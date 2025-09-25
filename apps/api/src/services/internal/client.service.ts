import { getPool } from "@/db";
import type {
  Client,
  ClientData,
  ClientList,
  SerialId,
  DeleteClients,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";

export async function getClientService(
  id: SerialId
): Promise<ServiceResponse<Client>> {
  const pool = await getPool();

  const query = `
    SELECT id, fname, lname, side, status
    FROM clients
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);

  const client = result.rows[0];

  if (!client) {
    return createFail({ status: 404, message: "Client not found" });
  }

  return createSuccess({ data: client });
}

export async function getClientsService(): Promise<
  ServiceResponse<ClientList>
> {
  const pool = await getPool();

  const query = `
    SELECT id, fname, lname, side, status
    FROM clients
  `;
  const result = await pool.query(query);

  const clientList: ClientList = result.rows ?? [];
  return createSuccess({ data: clientList });
}

export async function updateClientService(
  id: SerialId,
  { fname, lname, side, status }: ClientData
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  const result = await pool.query(
    `UPDATE clients
     SET fname = $1, lname = $2, side = $3, status = $4
     WHERE id = $5`,
    [fname, lname, side, status, id]
  );

  if (result.rowCount === 0) {
    return createFail({ status: 404, message: "Client not found" });
  }

  return createSuccess({ status: 204 });
}

export async function createClientService(
  { fname, lname, side, status }: ClientData,
  startDate: DateString
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertClientResult = await client.query(
      `INSERT INTO clients (fname, lname, side, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [fname, lname, side, status]
    );

    const cid = insertClientResult.rows[0]?.id;
    if (!cid) {
      throw new Error("Failed to retrieve new client ID.");
    }

    await client.query(
      `INSERT INTO client_roster (cid, start_date)
       VALUES ($1, $2::date)`,
      [cid, startDate]
    );

    await client.query("COMMIT");
    return createSuccess({ status: 201 });
  } catch (error) {
    console.error("[createClientService] error:", error);
    await client.query("ROLLBACK");
    return createFail({
      status: 500,
      message: "Failed to create client and roster",
    });
  } finally {
    client.release();
  }
}
