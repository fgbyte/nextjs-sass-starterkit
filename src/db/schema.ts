// Default test schema for the database

import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
	id: serial("id").primaryKey(),
	stripeCustomerId: text("stripe_customer_id").unique(),
	email: text("email").notNull().unique(),
	name: text("name"),
	createAt: timestamp("created_at").defaultNow(),
});
