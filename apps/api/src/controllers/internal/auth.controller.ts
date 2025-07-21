import {
  loginService,
  completeChallengeService,
  registerService,
} from "@/services/internal/auth.service";
import { getUserService } from "@/services/internal/user.service";
import type {
  Credentials,
  User,
  Challenge,
  UserData,
  SerialId,
  LoginResult,
  CompleteChallenge,
} from "@shared/validation";
import { isChallenge, isUser } from "@shared/utils/auth.util";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const creds = req.validatedBody as Credentials;
  const serviceResponse: ServiceResponse<LoginResult> =
    await loginService(creds);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    res.fail({ status, errors, message });
    return;
  }

  const { status, data, message } = serviceResponse;

  if (isChallenge(data)) {
    res.success({ status, data, message });
    return;
  }

  if (!isUser(data)) throw new Error("Invalid user response");

  req.session.uid = data.id;
  res.success({ status, data, message });
}

export async function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout failed:", err);
      res.fail({ status: 500, message: "Failed to logout" });
      return;
    }
    res.clearCookie("connect.sid");
    res.success({
      status: 200,
      data: null,
      message: "Logged out successfully",
    });
  });
}

export async function completeChallenge(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const data = req.validatedBody as CompleteChallenge;
  const serviceResponse: ServiceResponse<User> =
    await completeChallengeService(data);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    res.fail({ status, errors, message });
    return;
  }

  res.status(serviceResponse.status).end();
}

export async function register(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const userData = req.validatedBody as UserData;
  const serviceResponse: ServiceResponse<undefined> =
    await registerService(userData);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    res.fail({ status, errors, message });
    return;
  }

  res.status(serviceResponse.status).end();
}

export async function getSessionUser(req: Request, res: Response) {
  if (!req.session?.uid) throw new Error("Session uid missing");

  const id = req.session.uid as SerialId;
  const serviceResponse: ServiceResponse<User> = await getUserService(id);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    res.fail({ status, errors, message });
    return;
  }

  const { status, data, message } = serviceResponse;
  res.success({ status, data, message });
}
