PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`initial_amount` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "user_id", "initial_amount", "total_amount", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "initial_amount", "total_amount", "created_at", "updated_at", "deleted_at" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_banks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`address` text,
	`mobile_no` text,
	`tel_no` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_banks`("id", "name", "description", "address", "mobile_no", "tel_no", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "description", "address", "mobile_no", "tel_no", "created_at", "updated_at", "deleted_at" FROM `banks`;--> statement-breakpoint
DROP TABLE `banks`;--> statement-breakpoint
ALTER TABLE `__new_banks` RENAME TO `banks`;--> statement-breakpoint
CREATE TABLE `__new_loan_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`bank_id` text,
	`loan_id` text,
	`amount` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bank_id`) REFERENCES `banks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_loan_payments`("id", "user_id", "bank_id", "loan_id", "amount", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "bank_id", "loan_id", "amount", "created_at", "updated_at", "deleted_at" FROM `loan_payments`;--> statement-breakpoint
DROP TABLE `loan_payments`;--> statement-breakpoint
ALTER TABLE `__new_loan_payments` RENAME TO `loan_payments`;--> statement-breakpoint
CREATE TABLE `__new_loans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`bank_id` text,
	`principal_amount` integer NOT NULL,
	`terms_in_months` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bank_id`) REFERENCES `banks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_loans`("id", "user_id", "bank_id", "principal_amount", "terms_in_months", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "bank_id", "principal_amount", "terms_in_months", "created_at", "updated_at", "deleted_at" FROM `loans`;--> statement-breakpoint
DROP TABLE `loans`;--> statement-breakpoint
ALTER TABLE `__new_loans` RENAME TO `loans`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`mobile_no` text NOT NULL,
	`tel_no` text,
	`address` text NOT NULL,
	`occupation` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "mobile_no", "tel_no", "address", "occupation", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "password", "mobile_no", "tel_no", "address", "occupation", "created_at", "updated_at", "deleted_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;