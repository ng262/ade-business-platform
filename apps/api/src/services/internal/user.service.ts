import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getPool } from "@/db";
import type {
  UserData,
  UserList,
  User,
  SerialId,
  DeleteUsers,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";
import { Status, Side } from "@shared/types/domain.types";
import config from "@/config";

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

export async function getUserService(
  id: SerialId
): Promise<ServiceResponse<User>> {
  const pool = await getPool();

  const query = `
    SELECT id, fname, lname, username, side, role, status
    FROM users
    WHERE id = $1
  `;
  const params = [id];

  const result = await pool.query(query, params);

  const user = result.rows[0];

  if (!user) {
    return createFail({ status: 404, message: "User not found" });
  }

  return createSuccess({ data: user });
}

export async function getUsersService(): Promise<ServiceResponse<UserList>> {
  const pool = await getPool();

  let query = `SELECT id, fname, lname, username, side, role, status FROM users`;

  const result = await pool.query(query);
  const userList: UserList = result.rows ?? [];

  return createSuccess({ data: userList });
}

export async function updateUserService(
  id: SerialId,
  { username, fname, lname, side, role, status }: UserData
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  const result = await pool.query(
    `UPDATE users
   SET username = $1, fname = $2, lname = $3, side = $4, role = $5, status = $6
   WHERE id = $7;`,
    [username, fname, lname, side, role, status, id]
  );

  if (result.rowCount === 0) {
    return createFail({ status: 404, message: "User not found" });
  }

  return createSuccess({ status: 204 });
}

export async function deleteUsersService(
  users: DeleteUsers
): Promise<ServiceResponse<undefined>> {
  const failures: DeleteUsers = [];
  const pool = await getPool();

  for (const user of users) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(`DELETE FROM users WHERE id = $1`, [user.id]);

      await cognitoClient.send(
        new AdminDeleteUserCommand({
          UserPoolId: config.cognito.userPoolId,
          Username: user.username,
        })
      );

      await client.query("COMMIT");
    } catch (err: any) {
      await client.query("ROLLBACK");
      console.log(err);
      failures.push({
        id: user.id,
        username: user.username,
      });
    } finally {
      client.release();
    }
  }

  if (failures.length > 0) {
    return createFail({
      status: 207,
      message: "Some users failed to delete",
      errors: failures,
    });
  }

  return createSuccess({ status: 204 });
}
