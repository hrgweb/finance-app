import { timestamp } from 'drizzle-orm/pg-core';

export function timestamps() {
	return {
		createdAt: timestamp('created_at'),
		updatedAt: timestamp('updated_at'),
		deletedAt: timestamp('deleted_at')
	};
}
