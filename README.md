# Turso Demo

## Humans

1. Sign up

2. Install the CLI:

https://docs.turso.tech/cli/installation

3. Create group:

```
$ turso group create --location aws-us-east-1 demo
Created group hello at aws-us-east-1 in 5.139s.
```

4. Create a database:

```
$ turso db create --group hello demo
Created database db1 at group hello in 504ms.

Start an interactive SQL shell with:

   turso db shell db1

To see information about the database, including a connection URL, run:

   turso db show db1

To get an authentication token for the database, run:

   turso db tokens create db1
```

## AI

### Managing databases

```console
$ npm i @tursodatabase/api
```

```console
$ export TURSO_API_TOKEN=$(turso auth token)
$ export TURSO_API_ORG=<organization>
```

```javascript
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
  group: "demo",
});
```

Full example is here: [create-database.mjs](create-database.mjs).

You can find full platform API reference documentation here: https://docs.turso.tech/api-reference/introduction

### Accessing databases

```console
$ npm i @libsql/client
```

```console
$ export TURSO_DATABASE_URL=$(turso db show --url <database>)
$ export TURSO_AUTH_TOKEN=$(turso db tokens create <database>)
```

```javascript
import { createClient } from "@libsql/client";

function getText() {
  // <insert code to generate a recommendation>
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
```

You can find full JavaScript SDK documentation here: https://docs.turso.tech/sdk/ts/quickstart

Documentation for other SDKs here: https://docs.turso.tech/sdk/introduction

Full example is here: [access-database.mjs](access-database.mjs).

### Offline access

```javascript
import { createClient } from "@libsql/client";

function getText() {
  // <insert code to generate a recommendation>
}

// Create database client:
const db = createClient({
  url: "file:local.db",
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Sync remote database to local.
db.sync();

// Create table and insert some data:
await db.execute("CREATE TABLE IF NOT EXISTS recs (text TEXT)");

const text = getText();
await db.execute({ sql: "INSERT INTO recs VALUES (?)", args: [text] });

// Query the table:
const rs = await db.execute({ sql: "SELECT * FROM recs" });
for (const row of rs.rows) {
    console.log(row);
}

// Sync local database to remote.
db.sync();
```

Full example is here: [offline-access.mjs](offline-access.mjs).
