import { getPool } from "@/db";
import type { Contact, Application } from "@shared/validation";
import { Express } from "express";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess } from "@/utils/service.util";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "@/config";

const ses = new SESClient({ region: config.ses.region });
const s3 = new S3Client({ region: config.s3.region });

export async function submitContactService({
  fname,
  lname,
  email,
  phone,
  message,
}: Contact): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  await pool.query(
    `INSERT INTO contact (fname, lname, email, phone, message) VALUES ($1, $2, $3, $4, $5)`,
    [fname, lname, email, phone, message]
  );

  return createSuccess({ status: 201 });
}

export async function submitApplicationService(
  { fname, lname, email, phone, message }: Application,
  files: Express.Multer.File[]
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  await Promise.all(
    files.map((file) =>
      s3.send(
        new PutObjectCommand({
          Bucket: config.s3.bucket,
          Key: `applications/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      )
    )
  );

  await ses.send(
    new SendEmailCommand({
      Source: config.ses.sender,
      Destination: { ToAddresses: [config.ses.recipient] },
      Message: {
        Subject: { Data: "New Application Submitted" },
        Body: {
          Text: {
            Data: `Application submitted by ${fname} ${lname} (${email}, ${phone}).\n\n${message}\n\nUploaded files:\n${files
              .map((f) => `- ${f.originalname}`)
              .join("\n")}`,
          },
        },
      },
    })
  );

  await pool.query(
    `INSERT INTO application (fname, lname, email, phone, message) VALUES ($1, $2, $3, $4, $5)`,
    [fname, lname, email, phone, message]
  );

  return createSuccess({ status: 201 });
}
