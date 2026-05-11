export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;
