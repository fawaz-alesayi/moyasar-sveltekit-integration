import { MOYASAR_SECRET_KEY } from "$env/static/private";
import { type create_payment_source_schema, type create_payment_schema, payment_response_schema } from "$lib/payments/schemas/payment";
import { base_url } from "$lib/utils";
import type { z } from "zod";

export const make_payment_object = (source: z.infer<typeof create_payment_source_schema>) => {
    const payment: z.infer<typeof create_payment_schema> = {
        amount: 50000,
        currency: 'SAR',
        description: 'Test payment',
        source: source,
        callback_url: `${base_url}/callback`,
    }

    return payment;
}

const PAYMENT_ENDPOINT = 'https://api.moyasar.com/v1/payments';

export const make_payment = async (payment: z.infer<typeof create_payment_schema>) => {
    try {
        console.info(payment, `💳 Making a payment...`);
        const response = await fetch(PAYMENT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(MOYASAR_SECRET_KEY).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payment),
        });

        const results = await response.json();

        const payment_result = payment_response_schema.safeParse(results);

        if (!payment_result.success) {
            console.error(results, `🚨💳 Something went wrong while making a payment`);
            throw new PaymentError('Something went wrong while making the payment');
        }

        return payment_result.data;
    } catch (e) {
        console.error(e);
        throw new PaymentError('Something went wrong while making the payment');
    }
}

export class PaymentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PaymentError';
    }
}