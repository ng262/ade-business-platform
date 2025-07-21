import { type ServiceSuccess, type ServiceFail } from "@/types/server.types";

export function createSuccess<T>({
  status = 200,
  data,
  message = "OK",
}: {
  status?: number;
  data?: T;
  message?: string;
}): ServiceSuccess<T> {
  return {
    success: true,
    status,
    data,
    message,
  };
}

export function createFail({
  status,
  errors = undefined,
  message = "Error",
}: {
  status: number;
  errors?: any;
  message?: string;
}): ServiceFail {
  return {
    success: false,
    status,
    errors,
    message,
  };
}
