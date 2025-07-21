// reset-and-seed.ts – full database & Cognito reset + seeding + default user registration
// -----------------------------------------------------------------------------
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { subDays, formatISO } from "date-fns";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getPool } from "@/db";
import config from "@/config";
import {
  AttendanceStatus,
  Status,
  Role,
  Side,
} from "@shared/types/domain.types";
import { registerService } from "@/services/auth.service";

// -----------------------------------------------------------------------------
// Util helpers
// -----------------------------------------------------------------------------
const log = (msg: string) => console.log("✅", msg);
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function enumCheck(column: string, values: string[]): string {
  const formatted = values.map((v) => `'${v}'`).join(", ");
  return `CHECK (${column} IN (${formatted}))`;
}

// -----------------------------------------------------------------------------
// Main script
// -----------------------------------------------------------------------------
(async () => {
  console.log("🧹 Starting full reset & seed …");
  const pool = await getPool();
  const here = dirname(fileURLToPath(import.meta.url));

  // ────────────────────────────────────────
  // 1. Delete ALL Cognito users
  // ────────────────────────────────────────
  const cognitoClient = new CognitoIdentityProviderClient({
    region: config.cognito.region,
  });

  async function deleteAllCognitoUsers(): Promise<void> {
    const userPoolId = config.cognito.userPoolId;

    const listCmd = new ListUsersCommand({ UserPoolId: userPoolId, Limit: 60 });
    const { Users = [] } = await cognitoClient.send(listCmd);

    for (const user of Users) {
      if (!user.Username) continue;
      await cognitoClient.send(
        new AdminDeleteUserCommand({
          UserPoolId: userPoolId,
          Username: user.Username,
        })
      );
      console.log(`🗑️  Deleted Cognito user: ${user.Username}`);
    }
    console.log(`✅ Deleted ${Users.length} Cognito user(s).`);
  }

  await deleteAllCognitoUsers();

  // ────────────────────────────────────────
  // 2. Drop existing tables
  // ────────────────────────────────────────
  console.log("🔨 Dropping tables …");
  await pool.query(`
    DROP TABLE IF EXISTS
      client_roster,
      goal_data,
      goals,
      attendance,
      clients,
      users,
      session
    CASCADE;
  `);

  // ────────────────────────────────────────
  // 3. Re‑create schema (with enum CHECKs)
  // ────────────────────────────────────────
  console.log("🛠️  Re‑creating tables …");
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
  `);
  console.log("✅ Tables ready.");

  // ────────────────────────────────────────
  // 4. Seeding helpers & data
  // ────────────────────────────────────────
  const statusValues = Object.values(Status) as Status[];
  const sideValues = Object.values(Side) as Side[];
  const attendanceStatusValues = Object.values(
    AttendanceStatus
  ) as AttendanceStatus[];

  const today = new Date();
  const dates = [0, 1, 2].map((d) =>
    formatISO(subDays(today, d), { representation: "date" })
  );

  async function seedClients(): Promise<number[]> {
    const names: [string, string][] = [
      ["Alice", "Anderson"],
      ["Bob", "Brown"],
      ["Charlie", "Clark"],
      ["Diana", "Davis"],
      ["Ethan", "Evans"],
      ["Fiona", "Frost"],
      ["George", "Gibson"],
      ["Hannah", "Hughes"],
      ["Ivan", "Ingram"],
      ["Julia", "Jones"],
    ];

    for (const [fname, lname] of names) {
      await pool.query(
        `INSERT INTO clients (fname, lname, side, status) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [fname, lname, rand(sideValues), rand(statusValues)]
      );
    }

    const { rows } = await pool.query(`SELECT id FROM clients ORDER BY id`);
    log(`Inserted ${rows.length} clients.`);
    return rows.map((r) => r.id as number);
  }

  async function seedGoals() {
    await pool.query(`
      INSERT INTO goals (cid, title, objective, instructions, reinforcer) VALUES
        (1,'Reading Practice','Improve comprehension','Read a short book','Stickers'),
        (1,'Math Drills','Addition fluency','Do 10 flashcards','Play time'),
        (1,'Social Skills','Initiate conversation','Practice greetings','High five'),
        (2,'Writing Letters','Improve handwriting','Write 3 sentences','Coloring time'),
        (2,'Counting Objects','Count to 20','Use beans','Tokens'),
        (2,'Listening Task','Auditory memory','Follow 3-step command','Music time'),
        (3,'Art Time','Fine-motor control','Colour within lines','Stamps'),
        (3,'Puzzle Solving','Visual logic','Complete 10-piece puzzle','Cheering'),
        (3,'Music ID','Auditory discrimination','Identify 3 instruments','Dance break')
      ON CONFLICT DO NOTHING;
    `);
    log("Inserted 9 goals.");
  }

  async function seedGoalData() {
    const activities = [
      "Flashcards",
      "Reading",
      "Colouring",
      "Puzzle",
      "Music",
      "Simon Says",
    ];
    const comments = [
      "Did well",
      "Needed help",
      "Refused",
      "Distracted",
      "Excellent",
    ];
    const levels = ["I", "VP", "PP", "GP", "R", "NR"];
    const initials = ["AB", "CD", "EF"];

    for (let gid = 1; gid <= 9; gid++) {
      for (const date of dates) {
        await pool.query(
          `INSERT INTO goal_data (gid, goal_data_date, activity, comments, prompt_level, initial)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (gid, goal_data_date) DO NOTHING`,
          [
            gid,
            date,
            rand(activities),
            rand(comments),
            rand(levels),
            rand(initials),
          ]
        );
      }
    }
    log("Inserted goal_data for last 3 days.");
  }

  async function seedClientRoster() {
    const activeCids = [4, 5, 6];
    const endedCids = [1, 2, 3, 7, 8, 9, 10];
    const rosterMap: Record<string, number[]> = {
      [dates[0]]: [1, 2, 4, 5, 6],
      [dates[1]]: [2, 3, 7],
      [dates[2]]: [1, 3, 8],
    };

    let total = 0;
    for (const cid of activeCids) {
      await pool.query(
        `INSERT INTO client_roster (cid, start_date, end_date) VALUES ($1,$2,NULL) ON CONFLICT DO NOTHING`,
        [cid, dates[0]]
      );
      total++;
    }
    for (const [i, cid] of endedCids.entries()) {
      const start = dates[i % dates.length];
      await pool.query(
        `INSERT INTO client_roster (cid, start_date, end_date) VALUES ($1,$2,$2) ON CONFLICT DO NOTHING`,
        [cid, start]
      );
      total++;
    }
    log(`Inserted ${total} client_roster rows.`);
    return rosterMap;
  }

  async function seedAttendance(rosterMap: Record<string, number[]>) {
    let total = 0;
    for (const [date, cids] of Object.entries(rosterMap)) {
      for (const cid of cids) {
        await pool.query(
          `INSERT INTO attendance (cid, attendance_status, attendance_date) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
          [cid, rand(attendanceStatusValues), date]
        );
        total++;
      }
    }
    log(`Inserted ${total} attendance rows.`);
  }

  // ────────────────────────────────────────
  // 5. Run seeders sequentially
  // ────────────────────────────────────────
  await seedClients();
  await seedGoals();
  await seedGoalData();
  const rosterMap = await seedClientRoster();
  await seedAttendance(rosterMap);

  // ────────────────────────────────────────
  // 6. Create default admin user via registerService
  // ────────────────────────────────────────
  console.log("👤 Creating default admin user via registerService …");
  await registerService({
    username: "admin",
    fname: "Admin",
    lname: "User",
    side: Side.Both,
    role: Role.Admin,
    status: Status.Active,
  } as any); // cast to satisfy Service typing
  console.log("✅ Default admin user created.");

  // ────────────────────────────────────────
  // 7. Finish up
  // ────────────────────────────────────────
  console.log("🌾 Reset & seed complete.");
  await pool.end();
  process.exit(0);
})();
