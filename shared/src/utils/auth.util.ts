import { Role, RoleLevel } from "../types/domain.types";
import type { Challenge, User } from "../validation";

export function isChallenge(data: unknown): data is Challenge {
  return (
    typeof data === "object" &&
    data !== null &&
    "challenge" in data &&
    typeof (data as any).challenge === "string" &&
    "session" in data &&
    typeof (data as any).session === "string"
  );
}

export function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as any).id === "number"
  );
}

export function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
  return RoleLevel[userRole] >= RoleLevel[requiredRole];
}
