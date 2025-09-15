import type { InferSelectModel } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { z } from 'zod/v4';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

type UserSchema = InferSelectModel<typeof users> & {
	confirmPassword: string;
};

const schema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		// email: z.string().email('Invalid email address').nonempty('Email is required'),
		email: z.string(),
		password: z
			.string()
			.min(3, 'Password must be at least 8 characters long')
			.max(100, 'Password must be at most 100 characters long'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'] // show error on confirmPassword field
	});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	return { form };
};

export const actions = {
	signup: async ({ request }) => {
		const form = await superValidate(request, zod4(schema));
		try {
			if (!form.valid) {
				console.log('invalid', form);
				return fail(400, { form });
			}
			const body = {
				...form.data,
				createdAt: new Date(),
				updatedAt: new Date()
			} as never;
			const user = await db.insert(users).values(body).returning();
			console.log(user);
			return { user, form };
		} catch (error) {
			console.log(error);
			return fail(500, { form });
		}
	}
} satisfies Actions;
