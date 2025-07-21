import {
  getAttendanceService,
  upsertAttendanceService,
} from "@/services/internal/attendance.service";
import type {
  AttendanceQuery,
  AttendanceList,
  AttendanceUpsert,
} from "@shared/validation";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";
import { Request, Response } from "express";

export async function getAttendance(req: Request, res: Response) {
  if (!req.validatedQuery) throw new Error("validatedQuery missing");

  const query = req.validatedQuery as AttendanceQuery;
  const serviceResponse: ServiceResponse<AttendanceList> =
    await getAttendanceService(query);

  if (!isServiceSuccess(serviceResponse)) {
    res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
    return;
  }
  res.success({
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}

export async function upsertAttendance(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const list = req.validatedBody as AttendanceUpsert;
  const serviceResponse: ServiceResponse<undefined> =
    await upsertAttendanceService(list);

  if (!isServiceSuccess(serviceResponse)) {
    res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
    return;
  }
  res.status(serviceResponse.status).end();
}
