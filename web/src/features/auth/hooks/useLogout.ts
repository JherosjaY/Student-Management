export const useLogout = (options = {}): UseMutationResult<void, ApiError, void> => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const redirectTo = options.redirectTo ?? '/login';

  return useMutation({
    mutationFn: authService.logout,
    onSettled: async () => {
      queryClient.clear();              // critical
      await navigate(redirectTo, { replace: true });
    },
  });
};
