// import { loans } from '$lib/server/db/schema';
// import { type RequestHandler } from '@sveltejs/kit';
// import { getAll, handleCreate } from '$lib/server/utils/crud';

// export const GET: RequestHandler = async () => {
// 	return getAll({ table: loans });
// };

// export const POST: RequestHandler = async ({ request }): Promise<Response> => {
// 	const payload = await request.json();
// 	return handleCreate({
// 		table: loans,
// 		payload
// 	});
// };
