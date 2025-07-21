import { ZodType } from "zod";
import { apiResponseSchema, type ApiResponse } from "@shared/validation";
import type { FetchResult } from "@shared/types/apiResult.types";

export type RequestPayload<B = undefined, Q = undefined, P = undefined> = {
  body?: B;
  query?: Q;
  params?: P;
};

export type PayloadSchemas<B = undefined, Q = undefined, P = undefined> = {
  bodySchema?: ZodType<B>;
  querySchema?: ZodType<Q>;
  paramsSchema?: ZodType<P>;
};

type FetchHandlerArgs<B, Q, P, T> = {
  service: (args: RequestPayload<B, Q, P>) => Promise<Response>;
  outputSchema?: ZodType<T>;
  payload?: RequestPayload<B, Q, P>;
  payloadSchemas?: PayloadSchemas<B, Q, P>;
};

function validateRequestPayload<B, Q, P>(
  payload: RequestPayload<B, Q, P> = {},
  schemas: PayloadSchemas<B, Q, P> = {}
): { success: true } | { success: false; message: string } {
  const { body, query, params } = payload;
  const { bodySchema, querySchema, paramsSchema } = schemas;

  if (paramsSchema) {
    const parsed = paramsSchema.safeParse(params);
    if (!parsed.success) {
      return { success: false, message: "Invalid route parameters" };
    }
  }

  if (querySchema) {
    const parsed = querySchema.safeParse(query);
    if (!parsed.success) {
      return { success: false, message: "Invalid query parameters" };
    }
  }

  if (bodySchema) {
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return { success: false, message: "Invalid request body" };
    }
  }

  return { success: true };
}

export async function fetchHandler<B, Q, P, T>({
  service,
  outputSchema,
  payload,
  payloadSchemas,
}: FetchHandlerArgs<B, Q, P, T>): Promise<FetchResult<T>> {
  const payloadValidation = validateRequestPayload(payload, payloadSchemas);
  if (!payloadValidation.success) {
    return { success: false, message: payloadValidation.message };
  }

  try {
    const response = payload ? await service(payload) : await service();

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }

    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      if (!outputSchema) {
        return { success: true };
      }
      return {
        success: false,
        message: "Expected JSON response but got something else",
      };
    }

    const json = await response.json().catch(() => null);
    if (!json && outputSchema) {
      return { success: false, message: "Malformed JSON" };
    }

    const responseVal = apiResponseSchema.safeParse(json);
    if (!responseVal.success) {
      return { success: false, message: "Malformed API response" };
    }

    const apiResponse = responseVal.data;

    if (!apiResponse.success) {
      return {
        success: false,
        message: apiResponse.message ?? "Unknown error",
      };
    }

    if (!outputSchema) {
      return { success: true };
    }

    const dataVal = outputSchema.safeParse(apiResponse.data);
    if (!dataVal.success) {
      return { success: false, message: "Invalid response data" };
    }

    return { success: true, data: dataVal.data };
  } catch (error) {
    console.error("Request failed:", error);
    return { success: false, message: "Fail" };
  }
}
