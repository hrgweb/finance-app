// import { json, type RequestHandler } from '@sveltejs/kit';
// import { readFile } from 'node:fs/promises';
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';

// export const POST: RequestHandler = async ({ request }) => {
// 	const payload = await request.formData();
// 	const file = payload.get('file') as File;

// 	// const _file = await readFile(file)
// 	const __filename = fileURLToPath(import.meta.url);
// 	const __dirname = dirname(__filename);

// 	console.log(import.meta.url);
// 	console.log(__filename);
// 	console.log(__dirname);

// 	const filePath = join(__dirname, file.name);

// 	console.log(filePath);

// 	return json(file);
// };
