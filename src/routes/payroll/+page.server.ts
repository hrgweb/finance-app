import type { PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { payrollSchema } from '$lib/objects';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(payrollSchema));
	return { form };
};
