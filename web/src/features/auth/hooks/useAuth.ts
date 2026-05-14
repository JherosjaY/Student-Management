// In a component — subscribe to a slice
const status = useAuthStore((s) => s.status);

// From non-React code (e.g. api-client) — read once, no subscription
const token = useAuthStore.getState().accessToken;

// From non-React code — mutate
useAuthStore.getState().clearSession();
