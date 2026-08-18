import { authService } from '../services/auth-service.js';

export const LOGIN_PATH = '#/login';
export const HOME_PATH = '#/dashboard';

/**
 * Menentukan redirect untuk sebuah route berdasarkan status autentikasi.
 * - Route protected + belum login  -> #/login
 * - Route auth-only + sudah login  -> #/dashboard
 * - Selain itu -> null (boleh diakses)
 */
export function resolveRouteRedirect(route) {
  if (!route) return null;

  const loggedIn = authService.isLoggedIn();

  if (route.protected && !loggedIn) {
    return LOGIN_PATH;
  }

  if (route.authOnly && loggedIn) {
    return HOME_PATH;
  }

  return null;
}

/**
 * Guard reusable. Mengembalikan true bila route boleh diakses,
 * false bila harus di-redirect (hash diarahkan + reload).
 */
export function guardRoute(route) {
  const redirect = resolveRouteRedirect(route);
  if (!redirect) return true;

  if (window.location.hash !== redirect) {
    window.location.hash = redirect;
  }
  window.location.reload();
  return false;
}
