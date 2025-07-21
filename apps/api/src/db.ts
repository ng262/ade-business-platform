import fs from "fs";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import pkg from "pg";
const { Pool } = pkg;
import type { Pool as PoolType } from "pg";
import config from "@/config";

type DbCreds = {
  username: string;
  password: string;
};

const client = new SecretsManagerClient({ region: config.database.region });
let creds: DbCreds | undefined;

async function getDbSecret() {
  if (creds) return creds;

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: config.database.secretId,
      VersionStage: "AWSCURRENT",
    })
  );
  if (!response.SecretString) throw new Error("SecretString is undefined");

  creds = JSON.parse(response.SecretString);
  return creds;
}

let pool: PoolType | undefined;

export async function getPool() {
  if (pool) return pool;

  const creds = await getDbSecret();
  if (!creds) throw new Error("DB credentials missing");

  pool = new Pool({
    host: config.database.host,
    user: creds.username,
    password: creds.password,
    database: config.database.name,
    port: config.database.port,
    ssl: {
      ca: fs.readFileSync(config.database.caCertPath).toString(),
    },
  });

  return pool;
}
