import { pgTable, varchar, uuid, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './helper';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
	id: uuid('id')
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull(),
	password: varchar('password').notNull(),
	mobileNo: varchar('mobile_no'),
	telNo: varchar('tel_no'),
	address: varchar('address'),
	occupation: varchar('occupation'),
	...timestamps()
});

export const banks = pgTable('banks', {
	id: uuid('id').primaryKey(),
	name: varchar('name').notNull(),
	description: varchar('description'),
	address: varchar('address'),
	mobileNo: varchar('mobile_no'),
	telNo: varchar('tel_no'),
	...timestamps()
});

export const loans = pgTable('loans', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	bankId: uuid('bank_id').references(() => banks.id),
	principalAmount: integer('principal_amount').notNull(),
	termsInMonths: integer('terms_in_months').notNull(),
	...timestamps()
});

export const loanPayments = pgTable('loan_payments', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	bankId: uuid('bank_id').references(() => banks.id),
	loanId: uuid('loan_id').references(() => loans.id),
	amount: integer('amount').notNull(),
	...timestamps()
});

export const accounts = pgTable('accounts', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	initialAmount: integer('initial_amount').notNull(),
	totalAmount: integer('total_amount').notNull(),
	...timestamps()
});
