// seed.ts

import { getPool } from "@/db";
import { AttendanceStatus, Status, Side } from "@shared/types/domain.types";
import { subDays, formatISO } from "date-fns";

const pool = await getPool();

const today = new Date();
const dates = [0, 1, 2].map((d) =>
  formatISO(subDays(today, d), { representation: "date" })
);

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const log = (msg: string) => console.log("✅", msg);

const statusValues = Object.values(Status) as Status[];
const sideValues = Object.values(Side) as Side[];
const attendanceStatusValues = Object.values(
  AttendanceStatus
) as AttendanceStatus[];

async function seedClients() {
  const names = [
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
    const status = rand(statusValues);
    const side = rand(sideValues);
    await pool.query(
      `INSERT INTO clients (fname, lname, side, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [fname, lname, side, status]
    );
  }

  const { rows } = await pool.query("SELECT * FROM clients ORDER BY id");
  log(`Inserted ${rows.length} clients.`);
  return rows.map((r) => r.id);
}

async function seedGoals() {
  await pool.query(
    `INSERT INTO goals (cid, title, objective, instructions, reinforcer) VALUES
      (1,'Reading Practice','Improve comprehension','Read a short book','Stickers'),
      (1,'Math Drills','Addition fluency','Do 10 flashcards','Play time'),
      (1,'Social Skills','Initiate conversation','Practice greetings','High five'),
      (2,'Writing Letters','Improve handwriting','Write 3 sentences','Coloring time'),
      (2,'Counting Objects','Count to 20','Use beans','Tokens'),
      (2,'Listening Task','Auditory memory','Follow 3-step command','Music time'),
      (3,'Art Time','Fine-motor control','Colour within lines','Stamps'),
      (3,'Puzzle Solving','Visual logic','Complete 10-piece puzzle','Cheering'),
      (3,'Music ID','Auditory discrimination','Identify 3 instruments','Dance break')
     ON CONFLICT DO NOTHING;`
  );
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

  let total = 0;

  for (const cid of activeCids) {
    await pool.query(
      `INSERT INTO client_roster (cid, start_date, end_date)
       VALUES ($1, $2, NULL)
       ON CONFLICT (cid, start_date) DO NOTHING`,
      [cid, dates[0]]
    );
    total++;
  }

  for (const [i, cid] of endedCids.entries()) {
    const start = dates[i % dates.length];
    await pool.query(
      `INSERT INTO client_roster (cid, start_date, end_date)
       VALUES ($1, $2, $2)
       ON CONFLICT (cid, start_date) DO NOTHING`,
      [cid, start]
    );
    total++;
  }

  log(`Inserted ${total} client_roster rows.`);
  return {
    [dates[0]]: [1, 2, 4, 5, 6],
    [dates[1]]: [2, 3, 7],
    [dates[2]]: [1, 3, 8],
  };
}

async function seedAttendance(rosterMap: Record<string, number[]>) {
  let total = 0;

  for (const [date, cids] of Object.entries(rosterMap)) {
    for (const cid of cids) {
      await pool.query(
        `INSERT INTO attendance (cid, attendance_status, attendance_date)
         VALUES ($1,$2,$3)
         ON CONFLICT (cid, attendance_date) DO NOTHING`,
        [cid, rand(attendanceStatusValues), date]
      );
      total++;
    }
  }
  log(`Inserted ${total} attendance rows.`);
}

export async function runSeed() {
  console.log("🌱 Seeding…");
  await seedClients();
  await seedGoals();
  await seedGoalData();
  const rosterMap = await seedClientRoster();
  await seedAttendance(rosterMap);
  console.log("🌾 Seeding complete.");
}

if (import.meta.url === process.argv[1] || import.meta.main) {
  runSeed()
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await pool.end();
    });
}
