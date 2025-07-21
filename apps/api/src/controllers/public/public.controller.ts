import {
  submitContactService,
  submitApplicationService,
} from "@/services/public/public.service";
import type { Contact, Application } from "@shared/validation";
import { Express } from "express";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";
import { Request, Response } from "express";

export async function submitContact(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");

  const contact = req.validatedBody as Contact;
  const serviceResponse: ServiceResponse<undefined> =
    await submitContactService(contact);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    res.fail({ status, errors, message });
    return;
  }

  res.status(serviceResponse.status).end();
}

export async function submitApplication(req: Request, res: Response) {
  if (!req.validatedBody) throw new Error("validatedBody missing");
  if (!req.validatedFiles) throw new Error("validatedFiles missing");

  const application = req.validatedBody as Application;
  const files: Express.Multer.File[] = req.validatedFiles;
  const serviceResponse: ServiceResponse<undefined> =
    await submitApplicationService(application, files);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    res.fail({ status, errors, message });
    return;
  }

  res.status(serviceResponse.status).end();
}
