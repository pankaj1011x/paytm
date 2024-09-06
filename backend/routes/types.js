import z from "zod";

export const signupSchema = z.object({
  username: z.string().email().min(3),
  password: z.string().min(6),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
});

export const signinSchema = z.object({
  username: z.string().email().min(3),
  password: z.string().min(6),
});
