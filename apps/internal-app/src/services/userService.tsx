import type { RequestPayload } from "@/lib/fetchHandler";
import type { UserData, User, SerialId, DeleteUsers } from "@shared/validation";
import config from "@/config";

export async function getUserService({
  params: { id },
}: RequestPayload<undefined, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`${config.apiUrl}/api/users/${id}`, {
    credentials: "include",
  });
}

export async function getUsersService(): Promise<Response> {
  return fetch(`${config.apiUrl}/api/users`, {
    credentials: "include",
  });
}

export async function updateUserService({
  params: { id },
  body,
}: RequestPayload<UserData, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`${config.apiUrl}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function deactivateUsersService({
  body,
}: RequestPayload<{ ids: SerialId[] }>): Promise<Response> {
  return fetch(`${config.apiUrl}/api/users/deactivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function deleteUsersService({
  body,
}: RequestPayload<DeleteUsers>): Promise<Response> {
  return fetch(`${config.apiUrl}/api/users`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
}
