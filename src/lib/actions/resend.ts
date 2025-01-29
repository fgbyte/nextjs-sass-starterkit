import { WelcomeEmail } from "@/emails/WelcomeEmail";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
	try {
		if (typeof window !== "undefined") {
			console.error(
				"sendWelcomeEmail should only be called on the server side",
			);
			return;
		}
		const { data, error } = await resend.emails.send({
			from: "ACME <noreply@your-domain.com>",
			to: [email],
			subject: "Thank you",
			react: WelcomeEmail({ userName: name, userEmail: email }),
		});

		if (error) {
			return Response.json({ error }, { status: 500 });
		}

		console.log("Email sent successfully");
		return Response.json({ message: "Emails sent successfully" });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
