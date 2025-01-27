//use this file after generate the sql code

import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "./index";

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: "src/db/migrations",
		});
		console.log("Migrations completed");
	} catch (error) {
		console.error("Error during migration: ", error);
		process.exit(1);
	}
};

main();
