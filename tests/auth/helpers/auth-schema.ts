/**
 * Aalto Dentist Portal — Auth Response Schema Validation
 *
 * TypeScript interfaces dan validator untuk response shape semua endpoint Auth.
 * Setiap endpoint memiliki interface sendiri + validator function yang return { valid, missing }.
 */

// ===================== Standard Envelope =====================

/** Standard API envelope — semua endpoint mengembalikan ini */
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T | null;
}

// ===================== Common Shapes =====================

/** User profile — muncul di login response dan /v1/auth/me */
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

/** Clinic information — nested di user profile */
export interface ClinicInfo {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

// ===================== Endpoint-Specific Shapes =====================

/** POST /v1/auth/login — success response data */
export interface LoginData {
  user: UserProfile;
  clinic?: ClinicInfo;
  /** Present when double login confirmation required */
  requires_double_login?: boolean;
}

/** POST /v1/auth/register — success response data */
export interface RegisterData {
  user?: UserProfile;
  message?: string;
}

/** POST /v1/auth/forgot-password — success response (minimal) */
export interface ForgotPasswordData {
  message?: string;
}

/** POST /v1/auth/reset-password — success response data */
export interface ResetPasswordData {
  token?: string;
  expires_at?: string;
  message?: string;
}

/** POST /v1/auth/confirm-double-login — success response */
export interface ConfirmDoubleLoginData {
  token?: string;
  session?: string;
}

/** GET /v1/auth/me — response data */
export interface AuthMeData {
  user: UserProfile;
}

/** POST /v1/auth/logout — response data */
export interface LogoutData {
  redirect_url?: string;
}

// ===================== Validator Functions =====================

export interface ValidationResult {
  valid: boolean;
  missing: string[];
  extra?: string[];
}

// ---------- Common Validators ----------

export function validateUserProfile(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  const profile = obj as Record<string, unknown>;
  const required = ['id', 'email', 'full_name', 'context_role', 'role', 'is_active'];
  const missing = required.filter(
    (field) => profile[field] === undefined || profile[field] === null,
  );
  return { valid: missing.length === 0, missing };
}

export function validateClinicInfo(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['clinic is not an object'] };
  }
  const clinic = obj as Record<string, unknown>;
  const required = ['id', 'name', 'address'];
  const missing = required.filter(
    (field) => clinic[field] === undefined || clinic[field] === null,
  );
  return { valid: missing.length === 0, missing };
}

// ---------- Endpoint-Specific Validators ----------

export function validateLoginResponse(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  const data = obj as Record<string, unknown>;

  // Both direct user and nested data.user are valid
  const user = (data.user || (data as Record<string, unknown>).user) as Record<string, unknown> | undefined;
  if (!user) {
    // If data is the envelope, check data.data.user
    const innerData = data.data as Record<string, unknown> | undefined;
    const nestedUser = innerData?.user as Record<string, unknown> | undefined;
    if (!nestedUser) {
      return { valid: false, missing: ['user object not found in response'] };
    }
    return validateUserProfile(nestedUser);
  }
  return validateUserProfile(user);
}

export function validateRegisterResponse(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  const data = obj as Record<string, unknown>;
  const hasMessage = data.message !== undefined && data.message !== null;
  return { valid: hasMessage, missing: hasMessage ? [] : ['message'] };
}

export function validateForgotPasswordResponse(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  const data = obj as Record<string, unknown>;
  const hasMessage = data.message !== undefined && data.message !== null;
  return { valid: hasMessage, missing: hasMessage ? [] : ['message'] };
}

export function validateResetPasswordResponse(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  // Minimal: just needs message
  const data = obj as Record<string, unknown>;
  const hasMessage = data.message !== undefined && data.message !== null;
  return { valid: hasMessage, missing: hasMessage ? [] : ['message'] };
}

export function validateLogoutResponse(obj: unknown): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: ['response is not an object'] };
  }
  // Logout may or may not have redirect_url — message is the minimum
  const data = obj as Record<string, unknown>;
  const hasMessage = data.message !== undefined && data.message !== null;
  return { valid: hasMessage, missing: hasMessage ? [] : ['message'] };
}
