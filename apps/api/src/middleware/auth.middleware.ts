import { Request, Response, NextFunction } from "express";
import { Role } from "@shared/types/domain.types";
import { hasRequiredRole } from "@shared/utils/auth.util";
import { getUserService } from "@/services/internal/user.service";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session?.uid) {
    res.fail({ status: 401, message: "Unauthorized" });
    return;
  }

  const result = await getUserService(req.session.uid);
  if (!result.success) {
    res.fail({ status: 403, message: "User not found" });
    return;
  }

  req.user = result.data;
  next();
}

export function requireAtLeast(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      res.fail({ status: 401, message: "Unauthorized" });
      return;
    }

    if (!hasRequiredRole(role, minRole)) {
      res.fail({ status: 403, message: "Forbidden" });
      return;
    }

    next();
  };
}
