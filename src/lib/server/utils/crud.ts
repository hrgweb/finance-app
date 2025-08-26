import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { toCamelCase } from '$lib/utils';

type InsertOptions<T extends Record<string, any>> = {
	table: any;
	payload: T;
	message?: string;
};

type UpdateOptions<T extends Record<string, any>> = InsertOptions<T> & {
	key?: string;
	id: any;
	columns?: any;
};

type DeleteOptions<T extends Record<string, any>> = Partial<UpdateOptions<T>>;

type GetOptions<T extends Record<string, any>> = Omit<Partial<UpdateOptions<T>>, 'id'> & {
	columns?: any;
	value?: string;
};

function getTableName(table: object): string | undefined {
	const symbol = Object.getOwnPropertySymbols(table).find(
		(s) => s.toString() === 'Symbol(drizzle:Name)'
	);
	const result = symbol ? (table as any)[symbol] : undefined;
	return toCamelCase(result);
}

export async function getAll<T extends Record<string, any>>(options: GetOptions<T>) {
	const { table, columns } = options;

	try {
		const result = await (db.query as any)[getTableName(table)!].findMany({
			where: isNull(table.deletedAt),
			columns
		});
		return json(result);
	} catch (e: any) {
		return error(e);
	}
}

export async function getOne<T extends Record<string, any>>(options: GetOptions<T>) {
	const { table, columns, key = 'id', value } = options;

	try {
		const result = await (db.query as any)[getTableName(table)!].findFirst({
			where: and(eq(table[key], value), isNull(table.deletedAt)),
			columns
		});
		return json(result ?? null);
	} catch (e: any) {
		return error(e);
	}
}

function error(e: Error) {
	console.error('Database error:', e);
	return json({ message: e.message ?? 'Internal server error', success: false }, { status: 500 });
}

export async function handleCreate<T extends Record<string, any>>(options: InsertOptions<T>) {
	const { table, payload } = options;
	const body = { ...payload, createdAt: new Date(), updatedAt: new Date() };

	try {
		const result = (await db.insert(table).values(body).returning()) as any[];
		const data = result && result.length ? result[0] : null;
		return json(data);
	} catch (e: any) {
		return error(e);
	}
}

export async function handleUpdate<T extends Record<string, any>>(options: UpdateOptions<T>) {
	const { table, payload, key = 'id', id } = options;
	const body = { ...payload, updatedAt: new Date() };

	try {
		// Check if has record
		if (!(await hasRecord({ table, value: id }))) {
			return json({ message: 'record not found', success: false }, { status: 404 });
		}

		const result = (await db
			.update(table)
			.set(body)
			.where(eq(table[key], id))
			.returning()) as any[];
		return json(result && result.length ? result[0] : null);
	} catch (e: any) {
		return error(e);
	}
}

export async function handleDelete<T extends Record<string, any>>(options: DeleteOptions<T>) {
	const { table, key = 'id', id } = options;
	const body = { deletedAt: new Date() };

	try {
		// Check if has record
		if (!(await hasRecord({ table, value: id }))) {
			return json({ message: 'record not found', success: false }, { status: 404 });
		}

		await db.update(table).set(body).where(eq(table[key], id));
		return json({ success: true });
	} catch (e: any) {
		return error(e);
	}
}

async function hasRecord({ table, value }: { table: any; value: string }): Promise<boolean> {
	const item = await getOne({ table, value });
	const data = await item.json();

	return data && Object.keys(data)?.length ? true : false;
}
