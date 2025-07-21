import type { RequestPayload } from "@/lib/fetchHandler";
import type { AttendanceQuery, AttendanceList } from "@shared/validation";
import config from "@/config";

export async function getAttendanceService({
  query,
}: RequestPayload<undefined, AttendanceQuery>): Promise<Response> {
  const params = new URLSearchParams(query);
  return fetch(`${config.apiUrl}/api/attendance?${params.toString()}`, {
    credentials: "include",
  });
}

export async function upsertAttendanceService({
  body,
}: RequestPayload<AttendanceList>): Promise<Response> {
  return await fetch(`${config.apiUrl}/api/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
}
