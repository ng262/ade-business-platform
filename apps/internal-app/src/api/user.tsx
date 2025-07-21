import { z } from "zod";

import { fetchHandler } from "@/lib/fetchHandler";
import type {
  SerialId,
  UserData,
  UserList,
  DeleteUsers,
} from "@shared/validation";
import {
  serialIdSchema,
  serialIdListSchema,
  userSchema,
  userListSchema,
  deleteUsersSchema,
} from "@shared/validation";
import {
  getUserService,
  getUsersService,
  updateUserService,
  deactivateUsersService,
  deleteUsersService,
} from "@/services/userService";
import type { ClientResult } from "@shared/types/apiResult.types";

export async function getUser(id: SerialId): Promise<ClientResult<User>> {
  const result: ClientResult<User> = await fetchHandler({
    service: getUserService,
    outputSchema: userSchema,
    payload: { params: { id } },
    payloadSchemas: { params: serialIdSchema },
  });
  return result;
}

export async function getUsers(): Promise<ClientResult<UserList>> {
  const result = await fetchHandler({
    service: getUsersService,
    outputSchema: userListSchema,
  });
  return result;
}

export async function updateUser(
  id: SerialId,
  userData: UserData
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: updateUserService,
    payload: { params: { id }, body: userData },
    payloadSchemas: { params: serialIdSchema, body: userSchema },
  });
  return result;
}

export async function deactivateUsers(
  ids: SerialId[]
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: deactivateUsersService,
    payload: { body: { ids } },
    payloadSchemas: { body: serialIdListSchema },
  });
  return result;
}

export async function deleteUsers(
  users: DeleteUsers
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: deleteUsersService,
    payload: { body: users },
    payloadSchemas: { body: deleteUsersSchema },
  });
  return result;
}
