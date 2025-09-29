import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .endsWith('@picpay.com', { message: "Use seu email corporativo @picpay.com" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Nome deve ter no mínimo 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .endsWith('@picpay.com', { message: "Use seu email corporativo @picpay.com" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .regex(/[A-Z]/, { message: "A senha deve conter ao menos uma letra maiúscula" })
    .regex(/[a-z]/, { message: "A senha deve conter ao menos uma letra minúscula" })
    .regex(/[0-9]/, { message: "A senha deve conter ao menos um número" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
