export const authService = {
  login: async (input: LoginFormValues): Promise<TokenPair> => {
    const pair = await apiClient({
      path: '/auth/login',
      method: 'POST',
      body: input,
      schema: tokenPairSchema,
      skipAuth: true,
    });
    persistSession(pair);
    return pair;
  },

  me: async (): Promise<PublicUser> => apiClient({
    path: '/auth/me',
    method: 'GET',
    schema: publicUserSchema,
  }),
};
