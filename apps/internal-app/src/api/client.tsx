import { fetchHandler } from "@/lib/fetchHandler";
import type {
  SerialId,
  Client,
  ClientData,
  ClientList,
  DateString,
} from "@shared/validation";
import {
  serialIdSchema,
  serialIdListSchema,
  clientSchema,
  clientListSchema,
  createClientSchema,
} from "@shared/validation";
import {
  getClientService,
  getClientsService,
  updateClientService,
  deactivateClientsService,
  deleteClientsService,
  createClientService,
} from "@/services/clientService";
import type { ClientResult } from "@shared/types/apiResult.types";

export async function getClient(id: SerialId): Promise<ClientResult<Client>> {
  return await fetchHandler({
    service: getClientService,
    outputSchema: clientSchema,
    payload: { params: { id } },
    payloadSchemas: { params: serialIdSchema },
  });
}

export async function getClients(): Promise<ClientResult<ClientList>> {
  return await fetchHandler({
    service: getClientsService,
    outputSchema: clientListSchema,
  });
}

export async function updateClient(
  id: SerialId,
  clientData: ClientData
): Promise<ClientResult<undefined>> {
  return await fetchHandler({
    service: updateClientService,
    payload: { params: { id }, body: clientData },
    payloadSchemas: { params: serialIdSchema, body: clientSchema },
  });
}

export async function deactivateClients(
  ids: SerialId[]
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: deactivateClientsService,
    payload: { body: { ids } },
    payloadSchemas: { body: serialIdListSchema },
  });
  return result;
}

export async function deleteClients(
  ids: SerialIdList
): Promise<ClientResult<undefined>> {
  const result = await fetchHandler({
    service: deleteClientsService,
    payload: { body: ids },
    payloadSchemas: { body: serialIdListSchema },
  });
  return result;
}

export async function createClient(
  clientData: ClientData,
  startDate: DateString
): Promise<ClientResult<undefined>> {
  return await fetchHandler({
    service: createClientService,
    payload: { body: { clientData, startDate } },
    payloadSchemas: { body: createClientSchema },
  });
}
