import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';

const registerSchema = z.object({
	name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }).max(64, { message: 'Name must be less than 64 characters' }).trim(),
	email: z.string({ required_error: 'Email is required' }).email().min(1, { message: 'Email is required' }).max(64, { message: 'Email must be less than 64 characters' }).trim(),
	password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }).max(32, { message: 'Password must be less than 32 characters' }).trim(),
	passwordConfirm: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }).max(32, { message: 'Password must be less than 32 characters' }).trim(),
	terms: z.enum(['on'], { required_error: 'You must accept the terms and conditions' })
}).superRefine(({ password, passwordConfirm }, ctx) => {
	if (passwordConfirm !== password) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password and Confirm Password must match',
			path: ['password']
		});
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password and Confirm Password must match',
			path: ['passwordConfirm']
		});
	}
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const result = registerSchema.parse(formData);
			console.log('Success:', result);
		} catch (e) {
			const { fieldErrors: errors } = e.flatten();
			const { password, passwordConfirm, ...rest } = formData;
			return {
				data: rest,
				errors
			};
		}
	}
};
