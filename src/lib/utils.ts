import { env } from "$env/dynamic/private";

export const base_url = env['VERCEL'] ? `https://${env['VERCEL_URL']}` : 'http://localhost:3000';