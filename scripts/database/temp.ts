import { getPool } from "../apps/api/src/db";

async function clearAllSessions() {
  const pool = await getPool();

  try {
    await pool.query(`DELETE FROM session`);
    console.log("🧹 All sessions cleared");
  } catch (err: any) {
    console.error("❌ Error clearing sessions:", err.message);
  } finally {
    await pool.end();
  }
}

clearAllSessions();
