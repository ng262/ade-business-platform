import { getPool } from "@/db";
import type {
  AttendanceQuery,
  AttendanceList,
  AttendanceUpsert,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";

export async function getAttendanceService({
  date,
  side,
}: AttendanceQuery): Promise<ServiceResponse<AttendanceList>> {
  const pool = await getPool();
  const params = [date, side];

  const query = `
    SELECT
      clients.id AS cid,
      clients.fname,
      clients.lname,
      attendance.attendance_status
    FROM client_roster
    JOIN clients
      ON clients.id = client_roster.cid
    LEFT JOIN attendance
      ON attendance.cid = client_roster.cid
    AND attendance.attendance_date = $1
    WHERE client_roster.start_date <= $1
      AND (client_roster.end_date IS NULL OR client_roster.end_date >= $1)
      AND clients.side = $2
    ORDER BY clients.lname
  `;

  const result = await pool.query(query, params);
  const attendanceList: AttendanceList = result.rows ?? [];

  return createSuccess({ data: attendanceList });
}

export async function upsertAttendanceService(
  list: AttendanceUpsert
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const { cid, attendance_date, attendance_status } of list) {
      await client.query(
        `
        INSERT INTO attendance (cid, attendance_date, attendance_status)
        VALUES ($1, $2, $3)
        ON CONFLICT (cid, attendance_date)
        DO UPDATE SET attendance_status = EXCLUDED.attendance_status
        `,
        [cid, attendance_date, attendance_status]
      );
    }

    await client.query("COMMIT");
    return createSuccess({ status: 204 });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getClientAttendanceService({
  month,
  cid,
}: ClientAttendanceQuery): Promise<ServiceResponse<ClientAttendanceMap>> {
  console.log("Service: getClientAttendanceService", { month, cid });
  const pool = await getPool();

  const sql = `
    SELECT
      attendance_date,
      attendance_status
    FROM attendance
    WHERE cid = $1
      AND attendance_date >= (($2 || '-01')::date)
      AND attendance_date <  (date_trunc('month', ($2 || '-01')::date) + interval '1 month')::date
    ORDER BY attendance_date
  `;

  const result = await pool.query(sql, [cid, month]);

  const map: ClientAttendanceMap = {};
  for (const row of result.rows as Array<{
    attendance_date: Date;
    attendance_status: string;
  }>) {
    const d = row.attendance_date.toISOString().slice(0, 10);
    map[d] = row.attendance_status as ClientAttendanceMap[string];
  }

  console.log("Service: getClientAttendanceService result", map);

  return createSuccess({ data: map });
}
