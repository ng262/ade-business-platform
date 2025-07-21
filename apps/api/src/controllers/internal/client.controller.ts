import {
  getClientService,
  getClientsService,
  updateClientService,
  createClientService,
} from "@/services/internal/client.service";

import type {
  SerialId,
  Client,
  ClientList,
  ClientData,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";
import { Request, Response } from "express";

export async function getClient(req: Request, res: Response) {
  if (!req.validatedParams) throw new Error("validatedParams missing");

  const { id } = req.validatedParams as { id: SerialId };
  const serviceResponse: ServiceResponse<Client> = await getClientService(id);

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

export async function getClients(req: Request, res: Response) {
  const serviceResponse: ServiceResponse<ClientList> =
    await getClientsService();

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

export async function updateClient(req: Request, res: Response) {
  if (!req.validatedParams) throw new Error("validatedParams missing");
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const { id } = req.validatedParams as { id: SerialId };
  const clientData = req.validatedBody as ClientData;
  const serviceResponse: ServiceResponse<undefined> = await updateClientService(
    id,
    clientData
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

export async function createClient(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const clientData = req.validatedBody as ClientData;
  const serviceResponse: ServiceResponse<undefined> =
    await createClientService(clientData);

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
