import {
  getUserService,
  getUsersService,
  updateUserService,
  deleteUsersService,
} from "@/services/internal/user.service";
import type {
  SerialId,
  User,
  UserData,
  UserList,
  SerialIdList,
  DeleteUsers,
} from "@shared/validation";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";
import { Request, Response } from "express";

export async function getUser(req: Request, res: Response) {
  if (!req.validatedParams) throw new Error("validatedParams missing");

  const { id } = req.validatedParams as { id: SerialId };
  const serviceResponse: ServiceResponse<User> = await getUserService(id);

  if (!isServiceSuccess(serviceResponse)) {
    res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
    return;
  }

  res.success({
    status: serviceResponse.status,
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}

export async function getUsers(req: Request, res: Response) {
  const serviceResponse: ServiceResponse<UserList> = await getUsersService();

  if (!isServiceSuccess(serviceResponse)) {
    res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
    return;
  }

  res.success({
    status: serviceResponse.status,
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}

export async function updateUser(req: Request, res: Response) {
  if (!req.validatedParams) throw new Error("validatedParams missing");
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const { id } = req.validatedParams as { id: SerialId };
  const userData = req.validatedBody as UserData;
  const serviceResponse: ServiceResponse<undefined> = await updateUserService(
    id,
    userData
  );

  if (!isServiceSuccess(serviceResponse)) {
    res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
    return;
  }

  res.status(serviceResponse.status).end();
}

export async function deleteUsers(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const users = req.validatedBody as DeleteUsers;
  const serviceResponse: ServiceResponse<undefined> =
    await deleteUsersService(users);

  if (!isServiceSuccess(serviceResponse)) {
    res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
    return;
  }

  res.status(serviceResponse.status).end();
}
