/*
import { getPool } from "@/db.js";

export async function getGoalsService(cid: string, title?: string) {
  let query = `
    SELECT gid, title, instructions, objective, reinforcer
    FROM goals
    WHERE cid = $1
  `;
  const params: any[] = [cid];

  if (title) {
    query += ` AND title ILIKE $2`;
    params.push(`%${title}%`);
  }

  const pool = await getPool();
  const result = await pool.query(query, params);
  return result.rows ?? [];
}

export async function updateGoalService(goal: {
  gid: string;
  title: string;
  instructions: string;
  objective: string;
  reinforcer: string;
}) {
  const { gid, title, instructions, objective, reinforcer } = goal;

  const pool = await getPool();
  const result = await pool.query(
    `
      UPDATE goals
      SET title = $1,
          instructions = $2,
          objective = $3,
          reinforcer = $4
      WHERE gid = $5
      RETURNING *;
    `,
    [title, instructions, objective, reinforcer, gid]
  );

  return result.rows[0] ?? null;
}
*/
