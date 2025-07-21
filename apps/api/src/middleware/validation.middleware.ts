import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type SourceValidation = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  file?: ZodSchema;
  files?: ZodSchema;
};

export default function validationHandler(sources: SourceValidation) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const source of Object.keys(sources) as (keyof SourceValidation)[]) {
      const schema = sources[source];
      if (!schema) continue;

      const result = schema.safeParse(req[source]);
      if (!result.success) {
        res.fail({
          status: 400,
          message: `${source} validation failed`,
          errors: result.error.format(),
        });
        return;
      }

      if (source === "body") req.validatedBody = result.data;
      if (source === "query") req.validatedQuery = result.data;
      if (source === "params") req.validatedParams = result.data;
      if (source === "file") req.validatedFile = result.data;
      if (source === "files") req.validatedFiles = result.data;
    }

    next();
  };
}
