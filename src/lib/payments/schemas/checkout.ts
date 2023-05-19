import { z } from "zod";

export const checkout_schema = z.object({
    'card-number': z.string().min(8).max(19).transform((value) => value.replace(/\s/g, '')),
    'name-on-card': z.string().transform((value) => value.trim()),
    'expiration-date': z.string().regex(/^\d{2}\/\d{2}$/).transform((value) => value.trim()),
    'cvc': z.string().min(3).max(4).transform((value) => value.trim()),
})