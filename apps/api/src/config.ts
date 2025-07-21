import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || "development";

dotenv.config({ path: path.resolve(__dirname, `../.env`) });
dotenv.config({ path: path.resolve(__dirname, `../.env.local`) });
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}.local`) });

function required(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const config = {
  env: env,

  server: {
    port: required("API_PORT"),
  },

  session: {
    duration: Number(required("SESSION_DURATION")),
    secret: required("SESSION_SECRET"),
  },

  database: {
    host: required("DB_HOST"),
    name: required("DB_NAME"),
    port: Number(required("DB_PORT")),
    region: required("RDS_REGION"),
    secretId: required("RDS_SECRET_ID"),
    caCertPath: required("DB_CA_PATH"),
  },

  cognito: {
    clientId: required("COGNITO_CLIENT_ID"),
    userPoolId: required("COGNITO_USER_POOL_ID"),
    region: required("COGNITO_REGION"),
    tempPassword: required("COGNITO_TEMP_PASSWORD"),
  },

  cors: {
    internalOrigin: required("APP_URL"),
    publicOrigin: required("WEBSITE_URL"),
  },

  ses: {
    region: required("SMTP_REGION"),
    host: required("SMTP_HOST"),
    port: Number(required("SMTP_PORT")),
    user: required("SMTP_USERNAME"),
    password: required("SMTP_PSWD"),
    sender: required("EMAIL_SENDER"),
    recipient: required("EMAIL_RECIPIENT"),
  },
  s3: {
    region: required("S3_REGION"),
    bucket: required("S3_BUCKET"),
  },
};

export default config;
