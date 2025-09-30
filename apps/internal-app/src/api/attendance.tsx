import { fetchHandler } from "@/lib/fetchHandler";

import type {
  AttendanceQuery,
  AttendanceList,
  AttendanceUpsert,
  ClientAttendanceQuery,
  ClientAttendanceMap,
} from "@shared/validation";
import {
  attendanceQuerySchema,
  attendanceListSchema,
  attendanceUpsertSchema,
  clientAttendanceQuerySchema,
  clientAttendanceMapSchema,
} from "@shared/validation";

import {
  getAttendanceService,
  upsertAttendanceService,
  getClientAttendanceService,
} from "@/services/attendanceService";

import type { ClientResult } from "@shared/types/apiResult.types";

export async function getAttendance(
  query: AttendanceQuery
): Promise<ClientResult<AttendanceList>> {
  return await fetchHandler({
    service: getAttendanceService,
    payload: { query },
    payloadSchemas: { query: attendanceQuerySchema },
    outputSchema: attendanceListSchema,
  });
}

export async function upsertAttendance(
  list: AttendanceUpsert
): Promise<ClientResult<undefined>> {
  return await fetchHandler({
    service: upsertAttendanceService,
    payload: { body: list },
    payloadSchemas: { body: attendanceUpsertSchema },
  });
}

export async function getClientAttendance(
  query: ClientAttendanceQuery
): Promise<ClientResult<ClientAttendanceMap>> {
  return await fetchHandler({
    service: getClientAttendanceService,
    payload: { query },
    payloadSchemas: { query: clientAttendanceQuerySchema },
    outputSchema: clientAttendanceMapSchema,
  });
}
