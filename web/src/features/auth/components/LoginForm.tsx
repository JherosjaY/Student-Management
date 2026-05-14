export const LoginForm = ({ onSuccess }: LoginFormProps): ReactElement => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit((data) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success('Signed in');
        onSuccess();
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    });
  });

  const isPending = login.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormField label="Email" htmlFor="login-email" required error={errors.email?.message}>
        <Input id="login-email" type="email" autoComplete="email" autoFocus
               invalid={errors.email !== undefined}
               {...register('email')} />
      </FormField>
      <FormField label="Password" htmlFor="login-password" required error={errors.password?.message}>
        <PasswordInput id="login-password" autoComplete="current-password"
                       invalid={errors.password !== undefined}
                       {...register('password')} />
      </FormField>
      <Button type="submit" fullWidth size="lg" isLoading={isPending} loadingText="Signing in…">
        Sign in
      </Button>
    </form>
  );
};
