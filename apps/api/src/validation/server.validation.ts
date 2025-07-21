import { z } from "zod";

const _ = {
  multerDocument: z.object({
    originalname: z.string(),
    mimetype: z
      .string()
      .refine(
        (type) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(type),
        "Only PDF, DOC, or DOCX files are allowed"
      ),
    size: z
      .number()
      .min(1)
      .max(5 * 1024 * 1024),
    buffer: z.instanceof(Buffer),
  }),
} as const;

export const multerArraySchema = z.array(_.multerDocument);
