import { createClient } from "@tursodatabase/api";
import { hri } from "human-readable-ids";

// Configuration:
const org = process.env.TURSO_API_ORG;
const token = process.env.TURSO_API_TOKEN;

// Create API client:
const turso = createClient({ org, token });

// Generate unique database name and provision it:
const databaseName = hri.random();
const database = await turso.databases.create(databaseName, {
  group: "default",
});
console.log("Created database: " + databaseName)
