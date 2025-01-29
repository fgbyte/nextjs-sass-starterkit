import { createOrUpdateUser } from "@/db/actions";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
	const SIGNING_SECRET = process.env.SIGNING_SECRET;

	if (!SIGNING_SECRET) {
		throw new Error(
			"Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
		);
	}

	// Create new Svix instance with secret
	const wh = new Webhook(SIGNING_SECRET);

	// Get headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing Svix headers", {
			status: 400,
		});
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	let evt: WebhookEvent;

	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error: Could not verify webhook:", err);
		return new Response("Error: Verification error", {
			status: 400,
		});
	}

	// Add the user to the DB
	const eventType = evt.type;

	//Grab the necessary data from the event
	if (eventType === "user.created" || eventType === "user.updated") {
		const { id, email_addresses, first_name, last_name } = evt.data;
		const email = email_addresses[0]?.email_address;
		const name = `${first_name} ${last_name}`;

		if (email) {
			try {
				//call my drizzle function to create or update the user
				await createOrUpdateUser(id, email, name);
			} catch (error) {
				console.error("Error creating / updating user:", error);
				return new Response("Error processing user data", { status: 500 });
			}
		}
	}

	return new Response("Webhook received", { status: 200 });
}
