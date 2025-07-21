import express from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";

import validationHandler from "@/middleware/validation.middleware";
import { requireAuth, requireAtLeast } from "@/middleware/auth.middleware";

import {
  login,
  logout,
  register,
  completeChallenge,
  getSessionUser,
} from "@/controllers/internal/auth.controller";

import {
  getUser,
  getUsers,
  updateUser,
  deleteUsers,
} from "@/controllers/internal/user.controller";

import {
  getClient,
  getClients,
  updateClient,
  createClient,
} from "@/controllers/internal/client.controller";

import {
  getAttendance,
  upsertAttendance,
} from "@/controllers/internal/attendance.controller";

import {
  credentialsSchema,
  completeChallengeSchema,
  userDataSchema,
  serialIdSchema,
  serialIdListSchema,
  deleteUsersSchema,
  attendanceQuerySchema,
  attendanceUpsertSchema,
  clientDataSchema,
} from "@shared/validation";

import { Role } from "@shared/types/domain.types";

const router = express.Router();

router.post(
  "/auth/login",
  validationHandler({ body: credentialsSchema }),
  asyncHandler(login)
);

router.post("/auth/logout", asyncHandler(requireAuth), asyncHandler(logout));

router.post(
  "/auth/challenge",
  validationHandler({ body: completeChallengeSchema }),
  asyncHandler(completeChallenge)
);

router.post(
  "/auth/register",
  validationHandler({ body: userDataSchema }),
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(register)
);

router.get("/auth/me", asyncHandler(requireAuth), asyncHandler(getSessionUser));

router.get(
  "/user/:id",
  validationHandler({ params: z.object({ id: serialIdSchema }) }),
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(getUser)
);

router.get(
  "/users",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(getUsers)
);

router.delete(
  "/users",
  validationHandler({
    body: deleteUsersSchema,
  }),
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(deleteUsers)
);

router.put(
  "/user/:id",
  validationHandler({
    params: z.object({ id: serialIdSchema }),
    body: userDataSchema,
  }),
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(updateUser)
);

router.get(
  "/client/:id",
  validationHandler({ params: z.object({ id: serialIdSchema }) }),
  asyncHandler(requireAuth),
  asyncHandler(getClient)
);

router.get("/clients", asyncHandler(requireAuth), asyncHandler(getClients));

router.put(
  "/client/:id",
  validationHandler({
    params: z.object({ id: serialIdSchema }),
    body: clientDataSchema,
  }),
  asyncHandler(requireAuth),
  asyncHandler(updateClient)
);

router.post(
  "/client",
  validationHandler({ body: clientDataSchema }),
  asyncHandler(requireAuth),
  asyncHandler(createClient)
);

router.get(
  "/attendance",
  validationHandler({ query: attendanceQuerySchema }),
  asyncHandler(requireAuth),
  asyncHandler(getAttendance)
);

router.post(
  "/attendance",
  validationHandler({ body: attendanceUpsertSchema }),
  asyncHandler(requireAuth),
  asyncHandler(upsertAttendance)
);

const internalRouter = router;
export default internalRouter;
