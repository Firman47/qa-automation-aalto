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
