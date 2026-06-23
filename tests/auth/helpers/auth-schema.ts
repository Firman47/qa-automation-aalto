/**
 * Aalto Dentist Portal — Auth Response Schema Validation
 *
 * TypeScript interfaces dan validator untuk response shape API Auth.
 * Digunakan oleh spec files untuk verifikasi structure response.
 */

/** Standard API envelope */
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T | null;
}

/** Login response — user + clinic info */
export interface LoginData {
  user: UserProfile;
  clinic?: ClinicInfo;
}

/** User profile from /v1/auth/me or login response */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  context_role: 'dentist' | 'orthodontist' | 'superadmin';
  role: string;
  is_active: boolean;
  clinic?: ClinicInfo;
  phone?: string;
  profile_image?: string;
}

/** Clinic information */
export interface ClinicInfo {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

/** Reset password response */
export interface ResetPasswordData {
  token?: string;
  expires_at?: string;
}

/** Auth Me response shape */
export interface AuthMeData {
  user: UserProfile;
}

/** Logout response shape */
export interface LogoutData {
  redirect_url?: string;
}

/**
 * Validator helpers — memeriksa bahwa response memiliki field yang diharapkan.
 * Tidak menggunakan assertion; hanya return boolean + detail.
 */
export function validateUserProfile(obj: unknown): { valid: boolean; missing: string[] } {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  const profile = obj as Record<string, unknown>;
  const required = ['id', 'email', 'full_name', 'context_role', 'role', 'is_active'];
  const missing = required.filter((field) => profile[field] === undefined || profile[field] === null);
  return { valid: missing.length === 0, missing };
}

export function validateClinicInfo(obj: unknown): { valid: boolean; missing: string[] } {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['clinic is not an object'] };
  }
  const clinic = obj as Record<string, unknown>;
  const required = ['id', 'name', 'address'];
  const missing = required.filter((field) => clinic[field] === undefined || clinic[field] === null);
  return { valid: missing.length === 0, missing };
}
