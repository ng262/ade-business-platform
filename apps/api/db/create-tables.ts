import { getPool } from "@/db";
import {
  AttendanceStatus,
  Status,
  Role,
  Side,
} from "@shared/types/domain.types";

function enumCheck(column: string, values: string[]): string {
  const formatted = values.map((v) => `'${v}'`).join(", ");
  return `CHECK (${column} IN (${formatted}))`;
}

export async function createTables() {
  const pool = await getPool();

  const attendanceStatusCheck = enumCheck(
    "attendance_status",
    Object.values(AttendanceStatus)
  );
  const roleCheck = enumCheck("role", Object.values(Role));
  const statusCheck = enumCheck("status", Object.values(Status));
  const sideCheck = enumCheck("side", Object.values(Side));

  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      fname TEXT NOT NULL,
      lname TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      side TEXT NOT NULL ${sideCheck},
      role TEXT NOT NULL ${roleCheck},
      status TEXT NOT NULL ${statusCheck}
    );

    CREATE TABLE clients (
      id SERIAL PRIMARY KEY,
      fname TEXT NOT NULL,
      lname TEXT NOT NULL,
      side TEXT NOT NULL ${sideCheck},
      status TEXT NOT NULL ${statusCheck}
    );

    CREATE TABLE goals (
      id SERIAL PRIMARY KEY,
      cid INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      objective TEXT,
      instructions TEXT,
      reinforcer TEXT
    );

    CREATE TABLE client_roster (
      cid INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (cid, start_date)
    );

    CREATE TABLE attendance (
      id SERIAL PRIMARY KEY,
      cid INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      attendance_date DATE NOT NULL,
      attendance_status TEXT NOT NULL ${attendanceStatusCheck},
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(cid, attendance_date)
    );

    CREATE TABLE goal_data (
      id SERIAL PRIMARY KEY,
      gid INTEGER REFERENCES goals(id) ON DELETE CASCADE,
      goal_data_date DATE,
      activity TEXT,
      comments TEXT,
      prompt_level TEXT,
      initial TEXT,
      UNIQUE (gid, goal_data_date)
    );

    CREATE TABLE session (
      sid VARCHAR PRIMARY KEY,
      sess JSONB NOT NULL,
      expire TIMESTAMP NOT NULL
    );

    CREATE TABLE contact (
      id SERIAL PRIMARY KEY,
      fname TEXT NOT NULL,
      lname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE application (
      id SERIAL PRIMARY KEY,
      fname TEXT NOT NULL,
      lname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
await createTables();
