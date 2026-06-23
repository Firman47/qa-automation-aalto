/**
 * Aalto Dentist Portal — Auth Configuration
 *
 * Single source of truth for API base URLs and endpoints.
 * All modules import from here — no hardcoded URLs in spec files.
 */
export const API_BASE: string =
  process.env.API_BASE || 'https://dentist-api.sadigit.co.id/v1';

export const APP_BASE: string =
  process.env.APP_BASE || 'https://dental-monitoring.sadigit.co.id';

export const ENDPOINTS = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  CONFIRM_DOUBLE_LOGIN: `${API_BASE}/auth/confirm-double-login`,
  AUTH_ME: `${API_BASE}/auth/me`,
  LOGOUT: `${API_BASE}/auth/logout`,
} as const;

export const ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  CASES: '/cases',
  SETTINGS: '/settings',
} as const;
