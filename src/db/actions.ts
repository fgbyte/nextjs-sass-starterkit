import { db } from "@/db";
import { Users } from "@/db/schema";
import { sendWelcomeEmail } from "@/lib/actions/resend";
import { eq } from "drizzle-orm";

export async function createOrUpdateUser(
	clerkUserId: string,
	email: string,
	name: string,
) {
	try {
		console.log("Creating or updating user:", clerkUserId, email, name);

		const [existingUser] = await db
			.select()
			.from(Users)
			.where(eq(Users.stripeCustomerId, clerkUserId))
			.limit(1)
			.execute();

		if (existingUser) {
			const [updatedUser] = await db
				.update(Users)
				.set({ name, email })
				.where(eq(Users.stripeCustomerId, clerkUserId))
				.returning()
				.execute();
			// console.log("Updated user:", updatedUser);
			return updatedUser;
		}

		const [userWithEmail] = await db
			.select()
			.from(Users)
			.where(eq(Users.email, email))
			.limit(1)
			.execute();

		if (userWithEmail) {
			const [updatedUser] = await db
				.update(Users)
				.set({ name, stripeCustomerId: clerkUserId })
				.where(eq(Users.email, email))
				.returning()
				.execute();
			// console.log("Updated user:", updatedUser);
			sendWelcomeEmail(email, name);
			return updatedUser;
		}

		//else create new user with stripeCustomerId = clerkUserId
		const [newUser] = await db
			.insert(Users)
			.values({ email, name, stripeCustomerId: clerkUserId })
			.returning()
			.execute();
		console.log("New user created:", newUser);
		//send welcome email to new users with Resend
		sendWelcomeEmail(email, name);
		return newUser;
	} catch (error) {
		console.error("Error creating or updating user:", error);
		return null;
	}
}
