// create-tables.ts – schema using enums for CHECK constraints
import { getPool } from "@/db";
import {
  AttendanceStatus,
  Role,
  Status,
  Side,
} from "@shared/types/domain.types";

const pool = await getPool();

console.log("🛠️  Creating tables...");

// Dynamically convert enum to SQL CHECK constraint string
function enumCheck(column: string, values: string[]): string {
  const formatted = values.map((v) => `'${v}'`).join(", ");
  return `CHECK (${column} IN (${formatted}))`;
}

const attendanceStatusCheck = enumCheck(
  "attendance_status",
  Object.values(AttendanceStatus)
);
const roleCheck = enumCheck("role", Object.values(Role));
const statusCheck = enumCheck("status", Object.values(Status));
const sideCheck = enumCheck("side", Object.values(Side));

await pool.query(`
  CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    side TEXT NOT NULL ${sideCheck},
    status TEXT NOT NULL ${statusCheck}
  );

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    side TEXT NOT NULL ${sideCheck},
    role TEXT NOT NULL ${roleCheck},
    status TEXT NOT NULL ${statusCheck}
  );

  CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    cid INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    objective TEXT,
    instructions TEXT,
    reinforcer TEXT
  );

  CREATE TABLE IF NOT EXISTS client_roster (
    cid INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cid, start_date)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    cid INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    attendance_status TEXT NOT NULL ${attendanceStatusCheck},
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cid, attendance_date)
  );

  CREATE TABLE IF NOT EXISTS goal_data (
    id SERIAL PRIMARY KEY,
    gid INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    goal_data_date DATE,
    activity TEXT,
    comments TEXT,
    prompt_level TEXT,
    initial TEXT,
    UNIQUE (gid, goal_data_date)
  );

  CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
  );
`);

console.log("✅ Table creation complete.");
