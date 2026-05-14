import { redirect, type LoaderFunction, type LoaderFunctionArgs } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import type { RoleName } from '@/features/auth';
 
// AuthBootstrap resolves session before any loader runs, so by the time we get
// here `status` is either 'authenticated' or 'unauthenticated' — never 'loading'.
//
// Redirects unauthenticated users to /login, preserving the originally
// requested URL via ?redirect=. The login page reads it and bounces back on
// successful auth.
export const requireAuthLoader: LoaderFunction = ({ request }: LoaderFunctionArgs) => {
  const { status } = useAuthStore.getState();
  if (status !== 'authenticated') {
    const url = new URL(request.url);
    const target = url.pathname + url.search;
    return redirect(`/login?redirect=${encodeURIComponent(target)}`);
  }
  return null;
};
 
// Factory: builds a loader that requires auth AND at least one of the given roles.
export const requireRolesLoader =
  (...allowed: readonly RoleName[]): LoaderFunction =>
  ({ request }: LoaderFunctionArgs) => {
    const { status, user } = useAuthStore.getState();
 
    if (status !== 'authenticated' || user === null) {
      const url = new URL(request.url);
      return redirect(`/login?redirect=${encodeURIComponent(url.pathname + url.search)}`);
    }
 
    const ok = user.roles.some((r) => allowed.includes(r));
    if (!ok) {
      // Lacking-role users land on /forbidden, not /login. Phase 4 may add a
      // dedicated screen; for now /forbidden is handled by the 404 catch-all.
      return redirect('/forbidden');
    }
    return null;
  };
 
// Inverse: redirect AWAY from a route if already authenticated. Use on /login
// so signed-in users don't see the login page.
export const redirectIfAuthenticatedLoader: LoaderFunction = ({ request }: LoaderFunctionArgs) => {
  const { status } = useAuthStore.getState();
  if (status === 'authenticated') {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') ?? '/dashboard';
    return redirect(redirectTo);
  }
  return null;
};
