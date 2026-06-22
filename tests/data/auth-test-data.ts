/**
 * Aalto Dentist Portal — Shared Auth Test Data
 */

export type Role = 'doctor' | 'orthodontist' | 'admin';

export interface TestUser {
  email: string;
  password: string;
  role: Role;
  contextRole: 'dentist' | 'orthodontist' | 'superadmin';
  displayName: string;
}

export const DOCTOR: TestUser = {
  email: 'tatang.doctor@gmail.com',
  password: 'Password123!',
  role: 'doctor',
  contextRole: 'dentist',
  displayName: 'Tatang Doctor',
};

export const ORTHODONTIST: TestUser = {
  email: 'tatang.orthodontist@gmail.com',
  password: 'Password123!',
  role: 'orthodontist',
  contextRole: 'orthodontist',
  displayName: 'Tatang Orthodontist',
};

export const ADMIN: TestUser = {
  email: 'tatang.admin@gmail.com',
  password: 'Password123!',
  role: 'admin',
  contextRole: 'superadmin',
  displayName: 'Tatang Admin',
};

export const ALL_ROLES: TestUser[] = [DOCTOR, ORTHODONTIST, ADMIN];

/**
 * Dental Monitoring Partner account credentials
 */
export const DM_PARTNER = {
  email: 'e5be48b6-c784-461c-8910-71eb66130ba2@dentalmonitoring.com',
  password: 'ab06683134:3bf4ffffb01cde186_c14',
  url: 'https://partner.dental-monitoring.com/doctor/users/list/doctor',
};

/**
 * Invalid credentials for negative testing
 */
export const INVALID_CREDENTIALS = [
  {
    email: '',
    password: 'Password123!',
    expectedError: 'Email is required',
    expectedHttpStatus: 400,
  },
  {
    email: 'tatang.doctor@gmail.com',
    password: '',
    expectedError: 'Password is required',
    expectedHttpStatus: 400,
  },
  {
    email: 'wrong@email.com',
    password: 'WrongPass123!',
    expectedError: 'Invalid credentials',
    expectedHttpStatus: 401,
  },
  {
    email: 'notregistered@test.com',
    password: 'SomePass123!',
    expectedError: 'User not found',
    expectedHttpStatus: 401,
  },
];

/**
 * Edge case login payloads for comprehensive negative testing
 */
export const EDGE_CASE_LOGINS = [
  {
    email: 'not-an-email',
    password: 'Password123!',
    description: 'Invalid email format (no @)',
  },
  {
    email: '@nodomain.com',
    password: 'Password123!',
    description: 'Invalid email format (no local part)',
  },
  {
    email: '  ',
    password: 'Password123!',
    description: 'Whitespace email',
  },
  {
    email: 'tatang.doctor@gmail.com',
    password: 'short',
    description: 'Very short password',
  },
  {
    email: 'tatang.doctor@gmail.com',
    password: 'Password123!',
    remember: true,
    description: 'Login with remember me true',
  },
];

export const API_RATE_LIMIT = {
  maxRequests: 5,
  windowSeconds: 60,
  expectedStatus: 429,
  expectedMessage: 'Too many requests',
};
