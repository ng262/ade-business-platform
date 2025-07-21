import { fetchHandler } from "@/lib/fetchHandler";

import type {
  AttendanceQuery,
  AttendanceList,
  AttendanceUpsert,
} from "@shared/validation";
import {
  attendanceQuerySchema,
  attendanceListSchema,
  attendanceUpsertSchema,
} from "@shared/validation";

import {
  getAttendanceService,
  upsertAttendanceService,
} from "@/services/attendanceService";

import type { ClientResult } from "@shared/types/apiResult.types";

export async function getAttendance(
  query: AttendanceQuery
): Promise<ClientResult<AttendanceList>> {
  const result = await fetchHandler({
    service: getAttendanceService,
    payload: { query },
    payloadSchemas: { query: attendanceQuerySchema },
    outputSchema: attendanceListSchema,
  });
  return result;
}

export async function upsertAttendance(
  list: AttendanceUpsert
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: upsertAttendanceService,
    payload: { body: list },
    payloadSchemas: { body: attendanceUpsertSchema },
  });
  return result;
}
