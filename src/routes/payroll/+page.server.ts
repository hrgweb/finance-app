import type { PageServerLoad } from './$types';
import { z } from 'zod/v4';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate, message, fail } from 'sveltekit-superforms';

const schema = z.object({
	grossSalary: z.number().default(15000),
	nightDiff: z.number(),
	otPercentage: z.number().default(125),
	otHrs: z.number().default(3),
	sss: z.number().default(9),
	pagibig: z.number().default(7),
	philhealth: z.number().default(5)
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	return { form };
};
