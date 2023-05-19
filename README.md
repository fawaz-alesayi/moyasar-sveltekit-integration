# Moyasar API Integration

A repo to show how you can integrate [Moyasar payment gateway](https://moyasar.com) in your SvelteKit app


## How it works

- Uses this Zod Schema to validate payment form


```typescript
import { z } from "zod";

export const checkout_schema = z.object({
    'card-number': z.string().min(8).max(19).transform((value) => value.replace(/\s/g, '')),
    'name-on-card': z.string().transform((value) => value.trim()),
    'expiration-date': z.string().regex(/^\d{2}\/\d{2}$/).transform((value) => value.trim()),
    'cvc': z.string().min(3).max(4).transform((value) => value.trim()),
})
```

- Transforms previous form data to Moyasar API format


```typescript
const creditcard_request_schema = z.object({
    type: z.literal('creditcard'),
    name: z.string(),
    number: z.string().max(19).transform((value) => value.replace(/\s/g, '')),
    cvc: z.string().min(3).max(4),
    month: z.string().length(2).transform(month => parseInt(month)),
    year: z.string().refine(year => year.length === 2 || year.length === 4).transform(year => parseInt(year)),
});

const applepay_request_schema = ...

export const create_payment_source_schema = creditcard_request_schema.or(applepay_request_schema).or(stcpay_request_schema).or(token_request_schema);

export const create_payment_schema = z.object({
    amount: z.number().positive().describe('Amount in halalas or the smallest currency unit'),
    currency: z.string().default('SAR').describe('Currency code'),
    description: z.string().optional(),
    source: create_payment_source_schema,
    callback_url: z.string().describe('Where the user should be redirected to after payment'),
    metadata: z.unknown().optional(),
})

export const make_payment = async (payment: z.infer<typeof create_payment_schema>) => {
    try {
        // Probably a better idea to use a logging library
        console.info(payment, `💳 Making a payment`);
        const response = await fetch(PAYMENT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(env.MOYASAR_SECRET_KEY).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payment),
        });

        const results = await response.json();

        const payment_result = payment_response_schema.safeParse(results);

        if (!payment_result.success) {
            console.error(results, `🚨💳 Something went wrong while making a payment`);
            console.debug(payment_result.error);
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

```

## Usage

Refer to [Testing Cards](https://moyasar.com/docs/testing/credit-cards) for what card numbers to use

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Note

Currently, the user is redirected to `http://localhost:3000/callback` after payment. This will not work because the callback URL must be https. You can use [ngrok](https://ngrok.com/) or [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/do-more-with-tunnels/trycloudflare/)to create a tunnel to your localhost and use the generated URL as the callback URL.


```bash

## Building

To create a production version of this app, run the following command:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy this app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
