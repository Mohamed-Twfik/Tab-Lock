import {z} from "zod";

export const addUrlModel = z.object({
    message: z.string(),
});

export const deleteUrlModel = z.object({
    message: z.string(),
});

