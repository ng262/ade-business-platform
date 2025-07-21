import { fetchHandler } from "@/lib/fetchHandler";
import type {
  Credentials,
  LoginResult,
  UserData,
  CompleteChallenge,
  User,
  Username,
} from "@shared/validation";
import {
  credentialsSchema,
  loginResultSchema,
  userDataSchema,
  completeChallengeSchema,
  userSchema,
  usernameSchema,
} from "@shared/validation";
import {
  loginService,
  logoutService,
  registerService,
  completeChallengeService,
  getSessionUserService,
  resetPasswordService,
} from "@/services/authService";
import type { ClientResult } from "@shared/types/apiResult.types";

export async function login(
  creds: Credentials
): Promise<ClientResult<LoginResult>> {
  const result = await fetchHandler({
    service: loginService,
    payload: { body: creds },
    payloadSchemas: { body: credentialsSchema },
    outputSchema: loginResultSchema,
  });
  return result;
}

export async function logout(): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: logoutService,
  });
  return result;
}

export async function completeChallenge(
  data: CompleteChallenge
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: completeChallengeService,
    payload: { body: data },
    payloadSchemas: { body: completeChallengeSchema },
  });
  return result;
}

export async function register(
  userData: UserData
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: registerService,
    payload: { body: userData },
    payloadSchemas: { body: userDataSchema },
  });
  return result;
}

export async function getSessionUser(): Promise<ClientResult<User>> {
  const result = await fetchHandler({
    service: getSessionUserService,
    outputSchema: userSchema,
  });
  return result;
}

export async function resetPassword(
  username: Username
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: resetPasswordService,
    payload: { body: { username } },
    payloadSchemas: { body: usernameSchema },
  });
  return result;
}
