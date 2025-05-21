import { createClient } from "@libsql/client";
import Sentencer from 'sentencer';

// Random text generation helper:
const templates = [
  "{{ adjective }}!",
  "See {{ a_noun }}.",
  "{{ a_noun }} now.",
  "Look, {{ a_noun }}!",
  "Very {{ adjective }}."
];

function getText() {
  const idx = Math.floor(Math.random() * templates.length);
  return Sentencer.make(templates[idx]);
}

// Create database client:
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create table and insert some data:
await db.execute("CREATE TABLE IF NOT EXISTS recs (text TEXT)");

const text = getText();
await db.execute({ sql: "INSERT INTO recs VALUES (?)", args: [text] });

// Query the table:
const rs = await db.execute({ sql: "SELECT * FROM recs" });
for (const row of rs.rows) {
    console.log(row);
}
