import Database from "better-sqlite3";
import { drizzle} from "drizzle-orm/better-sqlite3";

const sqlite = new Database("app.db");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);



export const db = drizzle(sqlite);
