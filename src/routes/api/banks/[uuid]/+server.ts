import { banks } from '$lib/server/db/schema';
import { getOne, handleDelete, handleUpdate } from '$lib/server/utils/crud';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return getOne({ table: banks, value: params?.uuid });
};

export const PATCH: RequestHandler = async ({ request, params }): Promise<Response> => {
	const payload = await request.json();
	return handleUpdate({
		table: banks,
		payload,
		id: params?.uuid
	});
};

export const DELETE: RequestHandler = async ({ params }): Promise<Response> => {
	return handleDelete({
		table: banks,
		id: params?.uuid
	});
};
