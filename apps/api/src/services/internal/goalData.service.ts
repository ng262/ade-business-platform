/*
import { getPool } from "@/db.js";

export async function getGoalDataService(gid: string, date: string) {
  const pool = await getPool();
  const result = await pool.query(
    `SELECT did, activity, comments, prompt_level, initial
     FROM goal_data
     WHERE gid = $1 AND goal_data_date = $2`,
    [gid, date]
  );
  return result.rows[0] ?? {};
}

export async function upsertGoalDataService(data: {
  gid: string;
  date: string;
  activity: string;
  comments: string;
  prompt_level: number;
  initial: string;
}) {
  const { gid, date, activity, comments, prompt_level, initial } = data;

  const pool = await getPool();
  const result = await pool.query(
    `
      INSERT INTO goal_data (gid, goal_data_date, activity, comments, prompt_level, initial)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (gid, goal_data_date)
      DO UPDATE SET
        activity = EXCLUDED.activity,
        comments = EXCLUDED.comments,
        prompt_level = EXCLUDED.prompt_level,
        initial = EXCLUDED.initial
      RETURNING *;
    `,
    [gid, date, activity, comments, prompt_level, initial]
  );

  return result.rows[0] ?? {};
}
  */
