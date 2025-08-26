import type { InferSelectModel } from 'drizzle-orm';
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

type User = InferSelectModel<typeof users>;

const USER_ID = '84b7d4f3-93a0-4dd5-9aaf-1ea65f36403f';

async function hashPassword(pw = '12345678') {
	return await bcrypt.hash(pw, 12);
}

// Users
const _users = [
	{
		id: USER_ID,
		name: 'hergen cute',
		email: 'hergen.gamayon@divmont',
		password: await hashPassword(),
		mobileNo: faker.phone.number(), // '961-770-7727'
		address: faker.location.city(),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		name: 'john doe',
		email: 'johndoe@gmail.com',
		password: await hashPassword(),
		mobileNo: faker.phone.number(),
		address: faker.location.city(),
		createdAt: new Date(),
		updatedAt: new Date()
	}
] as unknown as User;
await db.insert(users).values(_users);
