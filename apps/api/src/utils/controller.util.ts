import {
  type ServiceResponse,
  type ServiceSuccess,
} from "@/types/server.types";

export function isServiceSuccess<T>(
  result: ServiceResponse<T>
): result is ServiceSuccess<T> {
  return result.success === true;
}
