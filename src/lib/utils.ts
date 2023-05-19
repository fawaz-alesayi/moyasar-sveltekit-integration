import { env } from "$env/dynamic/private";

export const base_url = env['development'] ? 'http://localhost:3000' : 'https://moyasar-sveltekit.vercel.app'