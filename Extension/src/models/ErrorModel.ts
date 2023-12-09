import { z } from "zod";

export const ErrorSchema =  z.object({
      message: z.string(),
      data: z.nullable(z.string()).optional(),
      error: z.string().optional(),
      })

