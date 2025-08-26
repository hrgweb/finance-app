import { integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export function uuid(name: string) {
	return text(name).$defaultFn(() => crypto.randomUUID());
}

export function timestamps() {
	return {
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`), // auto set when inserting
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => sql`(unixepoch())`), // auto update on row update
		deletedAt: integer('deleted_at', { mode: 'timestamp' })
	};
}
