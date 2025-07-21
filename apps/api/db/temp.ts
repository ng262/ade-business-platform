import { getPool } from "@/db";

async function listAllApplications() {
  const pool = await getPool();

  try {
    const { rows } = await pool.query(`
      SELECT id, fname, lname, email, phone, message, created_at
      FROM application
      ORDER BY created_at DESC
    `);
    console.log(`📋 Found ${rows.length} applications:`);
    console.table(rows);
  } catch (err: any) {
    console.error("❌ Error querying application table:", err.message);
  } finally {
    await pool.end();
  }
}

listAllApplications();
