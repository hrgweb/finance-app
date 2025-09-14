import type { Actions } from './$types';

export const actions = {
	login: async (event) => {
		console.log('login', event);
	}
} satisfies Actions;
