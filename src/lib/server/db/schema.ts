import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { timestamps, uuid } from './helper';

export const users = sqliteTable('users', {
	id: uuid('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	mobileNo: text('mobile_no'),
	telNo: text('tel_no'),
	address: text('address'),
	occupation: text('occupation'),
	...timestamps()
});

export const banks = sqliteTable('banks', {
	id: uuid('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	address: text('address'),
	mobileNo: text('mobile_no'),
	telNo: text('tel_no'),
	...timestamps()
});

export const loans = sqliteTable('loans', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	bankId: uuid('bank_id').references(() => banks.id),
	principalAmount: integer('principal_amount').notNull(),
	termsInMonths: integer('terms_in_months').notNull(),
	...timestamps()
});

export const loanPayments = sqliteTable('loan_payments', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	bankId: uuid('bank_id').references(() => banks.id),
	loanId: uuid('loan_id').references(() => loans.id),
	amount: integer('amount').notNull(),
	...timestamps()
});

export const accounts = sqliteTable('accounts', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	initialAmount: integer('initial_amount').notNull(),
	totalAmount: integer('total_amount').notNull(),
	...timestamps()
});
