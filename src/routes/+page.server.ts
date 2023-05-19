import { fail, type Actions, redirect, error } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from "./$types";
import HttpStatusCode from "$lib/httpStatusCodes.ts";
import type { z } from "zod";
import { checkout_schema } from "$lib/payments/schemas/checkout.ts";
import { create_payment_source_schema, payment_response_schema } from "$lib/payments/schemas/payment.ts";
import { make_payment_object, make_payment, PaymentError } from "$lib/payments/service.ts";

const TEST_CARD = '4111111111111111'

export const load = (async (event) => {
    const form = await superValidate(event, checkout_schema);

    form.data['card-number'] = TEST_CARD

    return { form };
}) satisfies PageServerLoad;


const secure_3d_redirect = (response: z.infer<typeof payment_response_schema>) => {
    if (response.source.type === 'creditcard' && response.source.transaction_url) {
        throw redirect(HttpStatusCode.TEMPORARY_REDIRECT, response.source.transaction_url);
    }
}

export const actions = ({
    pay: async ({ request }) => {
        const form = await superValidate(request, checkout_schema);

        if (!form.valid) {
            console.error(form.errors);
            return fail(HttpStatusCode.BAD_REQUEST, {
                form,
            } as const);
        }

        const customer_payment_info = create_payment_source_schema.safeParse({
            type: 'creditcard',
            name: form.data['name-on-card'],
            number: form.data['card-number'],
            cvc: form.data['cvc'],
            month: form.data['expiration-date'].split('/')[0],
            year: form.data['expiration-date'].split('/')[1],
        });

        if (!customer_payment_info.success) {
            console.error(customer_payment_info.error);
            return fail(HttpStatusCode.BAD_REQUEST, {
                form,
            } as const);
        }

        const payment = make_payment_object(customer_payment_info.data);

        try {
            const response = await make_payment(payment);
            console.info(response);

            secure_3d_redirect(response);

            return {
                form,
            }
        } catch (e) {
            if (e instanceof PaymentError) {
                console.error(e);
                throw error(HttpStatusCode.INTERNAL_SERVER_ERROR, e.message);
            }
            throw e;
        }
    }
}) satisfies Actions