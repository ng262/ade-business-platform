import type { RequestPayload } from "@/lib/fetchHandler";
import type {
  Credentials,
  CompleteChallenge,
  UserData,
} from "@shared/validation";
import config from "@/config";

export async function loginService({
  body,
}: RequestPayload<Credentials>): Promise<Response> {
  return await fetch(`${config.apiUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function logoutService(): Promise<Response> {
  return fetch(`${config.apiUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function completeChallengeService({
  body,
}: RequestPayload<CompleteChallenge>): Promise<Response> {
  return await fetch(`${config.apiUrl}/api/auth/challenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function registerService({
  body,
}: RequestPayload<UserData>): Promise<Response> {
  return await fetch(`${config.apiUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function getSessionUserService(): Promise<Response> {
  return fetch(`${config.apiUrl}/api/auth/me`, {
    credentials: "include",
  });
}

export async function resetPasswordService({
  body,
}: RequestPayload<Username>): Promise<Response> {
  return await fetch(`${config.apiUrl}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
}
