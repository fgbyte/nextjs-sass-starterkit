import { Button, Html, Text } from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
	userName: string;
	userEmail: string;
}

export function WelcomeEmail({ userName, userEmail }: WelcomeEmailProps) {
	return (
		<Html lang="en">
			<Text>Hi {userName === "null null" ? userEmail : userName},</Text>
			<Button href={"https://google.com"}>Click me</Button>
		</Html>
	);
}
