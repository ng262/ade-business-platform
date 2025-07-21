import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getPool } from "@/db";
import config from "@/config";
import { Status, Side } from "@shared/types/domain.types";
import type {
  Credentials,
  UserData,
  LoginResult,
  CompleteChallenge,
} from "@shared/validation";
import { type ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

async function decodeJwtPayload(token: string): Promise<any> {
  const base64Url = token.split(".")[1];
  const payloadJson = Buffer.from(base64Url, "base64").toString("utf8");
  return JSON.parse(payloadJson);
}

export async function loginService({
  username,
  password,
}: Credentials): Promise<ServiceResponse<LoginResult>> {
  const input = {
    AuthFlow: "USER_PASSWORD_AUTH" as const,
    ClientId: config.cognito.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  const command = new InitiateAuthCommand(input);
  let response;
  try {
    response = await cognitoClient.send(command);
  } catch (err: any) {
    if (err.name === "NotAuthorizedException") {
      return createFail({
        status: 401,
        message: "Incorrect username or password",
      });
    }
    return createFail({
      status: 500,
      message: "Authentication failed",
      errors: [err.message],
    });
  }

  if (response.ChallengeName) {
    if (!response.Session) {
      throw new Error("Challenge response missing session");
    }
    return createSuccess({
      data: {
        challenge: response.ChallengeName,
        session: response.Session,
        username,
      },
    });
  }

  const idToken = response.AuthenticationResult?.IdToken;

  const pool = await getPool();
  const result = await pool.query(
    `
      SELECT id, fname, lname, username, side, role, status
      FROM users
      WHERE username = $1
    `,
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    return createFail({ status: 404, message: "User not found" });
  }

  if (user.status == Status.Deactivated) {
    return createFail({ status: 403, message: "User deactivated" });
  }

  return createSuccess({ data: user });
}

export async function completeChallengeService(
  data: CompleteChallenge
): Promise<ServiceResponse<undefined>> {
  const { username, newPassword, session } = data;

  const command = new RespondToAuthChallengeCommand({
    ClientId: config.cognito.clientId,
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: newPassword,
    },
  });

  const response = await cognitoClient.send(command);

  const idToken = response.AuthenticationResult?.IdToken;
  if (!idToken) {
    return createFail({ status: 401, message: "Password challenge failed" });
  }

  return createSuccess({ status: 204 });
}

export async function registerService(
  userData: UserData
): Promise<ServiceResponse<undefined>> {
  const { username, fname, lname, side, role, status } = userData;
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO users (username, fname, lname, side, role, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [username, fname, lname, side, role, status]
    );

    const createCommand = new AdminCreateUserCommand({
      UserPoolId: config.cognito.userPoolId,
      Username: username,
      TemporaryPassword: config.cognito.tempPassword,
      MessageAction: "SUPPRESS",
      UserAttributes: [
        {
          Name: "email",
          Value: `${username}@placeholder.com`,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    });

    const createResponse = await cognitoClient.send(createCommand);
    if (!createResponse.User) {
      throw new Error("Cognito user creation failed");
    }

    const groupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: config.cognito.userPoolId,
      Username: username,
      GroupName: role,
    });

    const groupResponse = await cognitoClient.send(groupCommand);
    if (groupResponse.$metadata.httpStatusCode !== 200) {
      throw new Error("Cognito group assignment failed");
    }

    await client.query("COMMIT");
    return createSuccess({ status: 201 });
  } catch (err: any) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return createFail({ status: 409, message: "Username already exists" });
    }

    throw err;
  } finally {
    client.release();
  }
}
