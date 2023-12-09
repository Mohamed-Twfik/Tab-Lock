import { z } from "zod";


export const User = z.object({
  email: z.string(), 
  name: z.string(),
  password: z.string(),
  urls: z.array(z.string().nullable()).nullable(),
  _id: z.string(),
  model: z.string(),
});

export const CreateUser = z.object({
  message: z.string(),
  user_id: z.string(),
});

export const Login = z.object({
  message: z.string(),
  user_id: z.string(),
  token: z.string(),
});

export const updateUser = z.object({
  message:z.string(),
})

export const deleteUser = z.object({
  message:z.string(),
})

export const getUserModel = z.object({
  user:User,
})




