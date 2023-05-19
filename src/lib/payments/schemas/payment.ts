import { z } from 'zod';

const creditcard_response_schema = z.object({
    type: z.literal('creditcard'),
    company: z.enum(['mada', 'visa', 'master', 'amex']),
    name: z.string(),
    number: z.string(),
    message: z.string().nullish(),
    transaction_url: z.string().nullish(),
    gateway_id: z.string(),
    reference_number: z.string().nullish(),
});

const applepay_response_schema = z.object({
    type: z.literal('applepay'),
    company: z.enum(['mada', 'visa', 'master', 'amex']),
    name: z.string(),
    number: z.string(),
    message: z.string().nullish(),
    gateway_id: z.string(),
    reference_number: z.string().nullish(),
});

const stcpay_response_schema = z.object({
    type: z.literal('stcpay'),
    mobile: z.string(),
    branch: z.string(),
    cashier: z.string(),
    transaction_url: z.string(),
    message: z.string().nullish(),
    reference_number: z.string().nullish(),
});

const token_response_schema = z.object({
    type: z.literal('token'),
    company: z.enum(['mada', 'visa', 'master', 'amex']),
    number: z.string(),
    message: z.string().nullable(),
    transaction_url: z.string().nullish(),
});

const creditcard_request_schema = z.object({
    type: z.literal('creditcard'),
    name: z.string(),
    number: z.string().max(19).transform((value) => value.replace(/\s/g, '')),
    cvc: z.string().min(3).max(4),
    month: z.string().length(2).transform(month => parseInt(month)),
    year: z.string().refine(year => year.length === 2 || year.length === 4).transform(year => parseInt(year)),
});

const applepay_request_schema = z.object({
    type: z.literal('applepay'),
    token: z.string(),
});

const stcpay_request_schema = z.object({
    type: z.literal('stcpay'),
    mobile: z.string(),
    branch: z.string().optional(),
    cashier: z.string().optional(),
});

const token_request_schema = z.object({
    type: z.literal('token'),
    token: z.string(),
    '3ds': z.boolean().default(true),
    manual: z.boolean().default(false),
});

export const create_payment_source_schema = creditcard_request_schema.or(applepay_request_schema).or(stcpay_request_schema).or(token_request_schema);

export const create_payment_schema = z.object({
    amount: z.number().positive().describe('Amount in halalas or the smallest currency unit'),
    currency: z.string().default('SAR').describe('Currency code'),
    description: z.string().optional(),
    source: create_payment_source_schema,
    callback_url: z.string().describe('Where the user should be redirected to after payment'),
    metadata: z.unknown().optional(),
})

const payment_source_response = creditcard_response_schema.or(applepay_response_schema).or(stcpay_response_schema).or(token_response_schema);

export const payment_response_schema = z.object({
    id: z.string(),
    status: z.enum(['initiated', 'paid', 'failed', 'authorized', 'captured', 'refunded', 'voided']),
    amount: z.number(),
    fee: z.number(),
    currency: z.string().default('SAR'),
    refunded: z.number(),
    refunded_at: z.string().nullish(),
    captured: z.number(),
    captured_at: z.string().nullish(),
    voided_at: z.string().nullish(),
    description: z.string().nullish(),
    amount_format: z.string(),
    fee_format: z.string(),
    refunded_format: z.string(),
    captured_format: z.string(),
    invoice_id: z.string().nullish(),
    ip: z.string().nullish(),
    callback_url: z.string().nullish(),
    created_at: z.string(),
    updated_at: z.string(),
    metadata: z.unknown().nullish(),
    source: payment_source_response,
});