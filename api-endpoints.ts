/**
 * API Endpoints Configuration
 *
 * Centralized API endpoint definitions for Aalto Dentist Portal
 * Organized by resource. Access control is handled server-side via access_token/context_role.
 *
 * Updated: 2025-01-05 - Synchronized with API_DOCUMENTATION.md
 * - Added missing endpoints (LEADS, CASES, TREATMENTS, NOTIFICATIONS, PROFILE, etc.)
 * - Added deprecation notice for Messages endpoints (migrated to Firebase)
 * - Added Treatment Goal Questions endpoints
 * - Added confirm-double-login endpoint
 * - Added Patients external & monitoring endpoints
 * - Added Medical History Questions endpoints
 * - Added Scans endpoints (DM API Integration)
 * - Added Dental Insurance endpoints
 * - Added Webhooks endpoints
 *
 * Usage:
 * ```ts
 * import { API_ENDPOINTS } from '~/utils/api-endpoints'
 *
 * Because Nuxt using auto import, you can directly use API_ENDPOINTS in your files like so:
 *
 *
 * const { data } = await useApi(API_ENDPOINTS.PATIENTS.LIST)
 * const { data } = await useApi(API_ENDPOINTS.PATIENTS.GET('patient-id'))
 * const { data } = await useApi(API_ENDPOINTS.LEADS.GET('lead-id'))
 * ```
 */

export const API_ENDPOINTS = {
  /**
   * Authentication & Profile
   */
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    ME: '/v1/auth/me',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    CONFIRM_DOUBLE_LOGIN: '/v1/auth/confirm-double-login',
    REGISTER: '/v1/auth/register',
  },

  /**
   * Dashboard
   */
  DASHBOARD: '/v1/dashboard/stats',
  REFERRAL: '/v1/referrals/dashboard',

  // Send to message
  MESSAGES: {
    SUPPORT: '/v1/messages/support',
  },

  /**
   * Patients Management
   */
  PATIENTS: {
    LIST: '/v1/patients',
    CREATE: '/v1/patients',
    GET: (id: string) => `/v1/patients/${id}`,
    UPDATE: (id: string) => `/v1/patients/${id}`,
    DELETE: (id: string) => `/v1/patients/${id}`,
    // External patients (DM API)
    GET_EXTERNAL: (id: number) => `/v1/patients/getEx/${id}`,
    // Patient monitoring
    MONITORING_START: (id: number) => `/v1/patients/${id}/monitoring/start`,
    MONITORING_STOP: (id: number) => `/v1/patients/${id}/monitoring/stop`,
    MONITORING_PAUSE: (id: number) => `/v1/patients/${id}/monitoring/pause`,
    MONITORING_RESUME: (id: number) => `/v1/patients/${id}/monitoring/resume`,
    SCANS: (id: number) => `/v1/patients/${id}/scans`,
    MONITORING_HISTORY: (id: number) => `/v1/patients/${id}/events`,
    NOTIFICATION: (id: number) => `/v1/patients/${id}/notifications`,
    // Upload Engage File
    UPLOAD_ENGAGE_FILE: (id: string) => `/v1/patients/${id}/engage-files`,
    GET_ENGAGE_FILES: (patientId: string) => `/v1/patients/${patientId}/engage-files`,
    DELETE_ENGAGE_FILE: (fileId: string) => `/v1/patients/engage-files/${fileId}`,
    TRANSFER_PATIENT: '/v1/patients/transfer',
  },

  // README: this is the expected response format for GET GET_ENGAGE_FILES endpoint
  // {
  //   "status": true,
  //   "message": "Engage images retrieved successfully",
  //   "data": [
  //     {
  //       "id": "550e8400-e29b-41d4-a716-446655440003",
  //       "image_type": "SMILE",
  //       "image_url": "http://localhost:3000/uploads/engage-images/123e4567-e89b-12d3-a456-426614174000/SMILE/smile-550e8400-e29b-41d4-a716-446655440003.jpg",
  //       "created_at": "2026-03-09T10:30:00.000Z"
  //     },
  //     {
  //       "id": "550e8400-e29b-41d4-a716-446655440002",
  //       "image_type": "LEFT",
  //       "image_url": "http://localhost:3000/uploads/engage-images/123e4567-e89b-12d3-a456-426614174000/LEFT/left-550e8400-e29b-41d4-a716-446655440002.jpg",
  //       "created_at": "2026-03-09T10:25:00.000Z"
  //     },
  //     {
  //       "id": "550e8400-e29b-41d4-a716-446655440001",
  //       "image_type": "RIGHT",
  //       "image_url": "http://localhost:3000/uploads/engage-images/123e4567-e89b-12d3-a456-426614174000/RIGHT/right-550e8400-e29b-41d4-a716-446655440001.jpg",
  //       "created_at": "2026-03-09T10:20:00.000Z"
  //     }
  //   ]
  // }

  /**
   * Treatments Management
   */
  TREATMENTS: {
    LIST: '/v1/treatments',
    CREATE: '/v1/treatments',
    UPDATE: (id: string) => `/v1/treatments/${id}`,
    SEND: (id: string) => `/v1/treatments/${id}/send`,
    DELETE: (id: string) => `/v1/treatments/${id}`,
  },

  /**
   * Appointments Management
   */
  APPOINTMENTS: {
    LIST: '/v1/appointments',
    CREATE: '/v1/appointments',
    UPDATE: (id: string) => `/v1/appointments/${id}`,
  },

  /**
   * Lead Management (Dentist Feature)
   */
  LEADS: {
    LIST: '/v1/leads',
    INCOME: '/v1/leads/income-summary',
    GET: (id: string) => `/v1/leads/${id}`,
    CREATE: '/v1/leads',
    UPDATE: (id: string) => `/v1/leads/${id}`,
    UPDATE_STATUS: (id: string) => `/v1/leads/${id}/status`,
    ACCEPT: (id: string) => `/v1/leads/${id}/accept`,
    REJECT: (id: string) => `/v1/leads/${id}/reject`,
    // Activity management
    ACTIVITIES: (id: string) => `/v1/leads/${id}/activities`,
    CREATE_ACTIVITY: (id: string) => `/v1/leads/${id}/activities`,
    CONVERT_TO_CASE: (id: string) => `/v1/leads/${id}/convert-to-case`,
    SUMMARY: `/v1/leads/summaries`,
  },

  /**
   * Case Management
   */
  CASES: {
    LIST: '/v1/cases',
    CREATE: '/v1/cases',
    GET: (id: string) => `/v1/cases/${id}`,
    UPDATE: (id: string) => `/v1/cases/${id}`,
    UPDATE_STATUS: (id: string) => `/v1/cases/${id}/status`,

    // Tracker events
    TRACKER_EVENTS: (id: string) => `/v1/cases/${id}/tracker-events`,

    // File management
    FILES_UPLOAD: (id: string) => `/v1/cases/${id}/files`,
    FILES_DELETE: (id: string, fileId: string) => `/v1/cases/${id}/files/${fileId}`,
    FILES_REORGANIZE: (id: string) => `/v1/cases/${id}/files/auto-map`,

    // QR Code Quick Capture Feature
    QR_CODE: '/v1/cases/qr-code',
    QUICK_CREATE_FORM: (token: string) => `/v1/cases/quick-create/${token}`,
    QUICK_CREATE_SUBMIT: (token: string) => `/v1/cases/quick-create/${token}`,
    // Summary Generated by AI
    SUMMARY_INSURANCE: () => `/v2/dental-insurance/generate-insurance-summary`,
    SUMMARY_TREATMENT: () => `/v1/dental-insurance/generate-treatment-summary`,
    SUMMARY: '/v1/cases/summaries',
    // invoice generation
    INVOICE_GENERATE: (id: string) => `/v1/cases/${id}/invoice`,
    PUBLIC: (id: string) => `/v1/cases/${id}/information`,
    SEND_INFORMATION: (id: string) => `/v1/cases/${id}/email`,
    SEND_TO_MESSAGE: (id: string) => `/v1/cases/${id}/message`,
    MARK_AS_PAID: (id: string) => `/v1/cases/${id}/paid`,
    APPROVAL: (id: string) => `/v1/cases/${id}/approval`,
    REFINE: (id: string) => `/v1/cases/${id}/refine`,
    ARCHIVE: (id: string) => `/v1/cases/${id}/cases`,
  },

  /**
   * Meetings & Video Calls
   */
  MEETINGS: {
    CREATE_GOOGLE_MEET: '/v1/meetings/create-google-meet',
  },

  /**
   * User Management (Superadmin)
   */
  USERS: {
    LIST: '/v1/users',
    CREATE: '/v1/users',
    GET: (id: string) => `/v1/users/${id}`,
    UPDATE: (id: string) => `/v1/users/${id}`,
    DELETE: (id: string) => `/v1/users/${id}`,
    RESET_PASSWORD: (id: string) => `/v1/users/${id}/reset-password`,
    UPDATE_STATUS: (id: string) => `/v1/users/${id}/status`,
    UPDATE_BANK: (id: string) => `/v1/users/${id}/bank-account`,
  },

  /**
   * Clinic Management (Superadmin)
   */
  CLINICS: {
    LIST: '/v1/clinics',
    CREATE: '/v1/clinics',
    GET: (id: string) => `/v1/clinics/${id}`,
    UPDATE: (id: string) => `/v1/clinics/${id}`,
    DELETE: (id: string) => `/v1/clinics/${id}`,
    UPDATE_STATUS: (id: string) => `/v1/clinics/${id}/status`,
    UPDATE_TIER: (id: string) => `/v1/clinics/${id}/tier`,
    TRANSFER_OWNER: (id: string) => `/v1/clinics/${id}/transfer-owner`,
    // Clinic Members
    MEMBERS: {
      LIST: (clinicId: string) => `/v1/clinics/${clinicId}/members`,
      CREATE: (clinicId: string) => `/v1/clinics/${clinicId}/members`,
      DELETE: (clinicId: string, memberId: string) => `/v1/clinics/${clinicId}/members/${memberId}`,
    },
    PRACTICES: '/v1/practices',
  },

  /**
   * Orthodontist Management (Superadmin)
   */
  ORTHODONTISTS: {
    GET: (id: string) => `/v1/orthodontists/${id}`,
    UPDATE: (id: string) => `/v1/orthodontists/${id}`,
    DELETE: (id: string) => `/v1/orthodontists/${id}`,
  },

  /**
   * Orthodontist Assignments (Superadmin)
   */
  ORTHODONTIST_ASSIGNMENTS: {
    LIST: '/v1/orthodontist-assignments',
    CREATE: '/v1/orthodontist-assignments',
    GET: (id: string) => `/v1/orthodontist-assignments/${id}`,
    UPDATE: (id: string) => `/v1/orthodontist-assignments/${id}`,
    DELETE: (id: string) => `/v1/orthodontist-assignments/${id}`,
    DEACTIVATE: (id: string) => `/v1/orthodontist-assignments/${id}/deactivate`,
    REACTIVATE: (id: string) => `/v1/orthodontist-assignments/${id}/reactivate`,
    AVAILABLE: '/v1/orthodontist-assignments/available',
  },

  /**
   * Admin Operations (Superadmin)
   */
  ADMIN: {
    // Bulk Operations
    BULK_ASSIGN_ORTHODONTIST: '/v1/admin/bulk-assign-orthodontist',
    BULK_UPDATE_CLINIC_TIER: '/v1/admin/bulk-update-clinic-tier',
    BULK_REASSIGN_CASES: '/v1/admin/bulk-reassign-cases',
    // Statistics
    STATISTICS: {
      OVERVIEW: '/v1/admin/statistics/overview',
      CLINICS: '/v1/admin/statistics/clinics',
      ORTHODONTISTS: '/v1/admin/statistics/orthodontists',
      WORKLOAD: '/v1/admin/statistics/workload',
    },
  },

  /**
   * Reports & Analytics
   */
  REPORTS: {
    CASES: '/v1/reports/cases',
    LEADS: '/v1/reports/leads',
    REVENUE: '/v1/reports/revenue',
    PERFORMANCE: '/v1/reports/performance',
    PATIENTS: '/v1/reports/patients', // ⭐ Added for patients report
    TREATMENTS: '/v1/reports/treatments', // ⭐ Added for treatments report
  },

  /**
   * Activity Logs
   */
  ACTIVITY_LOGS: '/v1/activity-logs',

  /**
   * Notifications
   */
  NOTIFICATIONS: {
    LIST: '/v1/notifications',
    MARK_READ: (id: string) => `/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/v1/notifications/read-all',
    DELETE: (id: string) => `/v1/notifications/${id}`,
  },

  /**
   * Profile Management
   */
  PROFILE: {
    GET: '/v1/profile',
    UPDATE: '/v1/profile',
    CHANGE_PASSWORD: '/v1/profile/change-password',
    UPLOAD_PHOTO: '/v1/profile/upload-photo',
  },

  /**
   * Settings
   */
  SETTINGS: {
    NOTIFICATIONS: {
      GET: '/v1/settings/notifications',
      UPDATE: '/v1/settings/notifications',
    },
  },

  /**
   * Audit Logs (Admin Only)
   */
  AUDIT_LOGS: '/v1/audit-logs',

  /**
   * Treatment Goal Questions (Questionnaire Management)
   */
  TREATMENT_GOAL_QUESTIONS: {
    LIST: '/v1/treatment-goal-questions',
    CREATE: '/v1/treatment-goal-questions',
    UPDATE: (id: string) => `/v1/treatment-goal-questions/${id}`,
    DELETE: (id: string) => `/v1/treatment-goal-questions/${id}`,
    UPDATE_ORDER: (id: string) => `/v1/treatment-goal-questions/${id}/order`,
  },

  /**
   * Health Check
   */
  HEALTH: '/v1/health',

  /**
   * File Management
   */
  FILES: {
    LIST: '/v1/files',
    UPLOAD: '/v1/files/upload',
    GET: (fileUrl: string, server: string) =>
      `/v1/files/external?file_url=${encodeURIComponent(fileUrl)}&server=${server}`,
    GET_BY_ID: (fileId: string) => `/v1/files/${fileId}`,
    UPDATE: (fileId: string) => `/v1/files/${fileId}`,
    DELETE: (fileId: string) => `/v1/files/${fileId}/delete`,
    DOWNLOAD: (fileId: string) => `/v1/files/${fileId}/download`,
    EXTERNAL: '/v1/files/external',
  },
  /**
   * Doctor (DM API)
   */
  DOCTOR: {
    LIST: '/v1/doctors',
    GET: (id: string) => `/v1/doctors/${id}`,
    QUICKSTART: (id: number) => `/v1/doctors/${id}/quickstarts`,
  },

  /**
   * Patient Messages (DM API V2)
   * Real-time messaging with patients using external DM API
   */
  PATIENT_MESSAGES: {
    LIST: (patientId: number) => `/v1/messages/${patientId}`,
    SEND_TO_PATIENT: (patientId: number) => `/v1/messages/${patientId}/to-patient`,
    SEND_TO_TEAM: (patientId: number) => `/v1/messages/${patientId}/to-team`,
  },

  /**
   * Patient Files (DM API V2)
   * File management for patient records
   */
  PATIENT_FILES: {
    UPLOAD: (patientId: string) => `/v1/files/${patientId}/upload`,
    LIST: (patientId: string) => `/v1/files/${patientId}`,
    DELETE: (patientId: string, fileId: string) => `/v1/files/${patientId}/${fileId}`,
  },

  /**
   * Medical History Questions
   */
  MEDICAL_HISTORY_QUESTIONS: {
    LIST: '/v1/medical-history-questions',
    CREATE: '/v1/medical-history-questions',
    UPDATE: (id: string) => `/v1/medical-history-questions/${id}`,
    DELETE: (id: string) => `/v1/medical-history-questions/${id}`,
    UPDATE_ORDER: (id: string) => `/v1/medical-history-questions/${id}/order`,
  },

  /**
   * Dental Insurance
   */
  DENTAL_INSURANCE: {
    GENERATE_TREATMENT_SUMMARY: '/v1/dental-insurance/generate-treatment-summary',
    GENERATE_PROGRESS_NOTE: '/v1/dental-insurance/generate-progress-note',
    GENERATE_INSURANCE_SUMMARY: '/v1/dental-insurance/generate-insurance-summary',
    // GENERATE_INSURANCE_SUMMARY: '/v2/dental-insurance/generate-insurance-summary',
    GENERATE_SUGGESTION_ADA_AU: '/v2/dental-insurance/generate-sugestions-ada-codes',
    CONFIRM_SUGGESTION_ADA_AU: '/v2/dental-insurance/confirm-sugestions-ada-codes',
  },

  /**
   * Invoices
   */
  INVOICES: {
    ITEMS: '/v1/items',
    CREATE: (caseId: string) => `/v1/cases/${caseId}/invoice`,
  },

  /**
   * Blogs
   */
  BLOGS: {
    POST: {
      GET: '/v1/cms/posts',
      GET_BY_ID: (postId: string) => `/v1/cms/posts/${postId}`,
      GET_BY_SLUG: (slug: string) => `/v1/cms/posts/public/slug/${slug}`,
      CREATE: '/v1/cms/posts',
      UPDATE: (postId: string) => `/v1/cms/posts/${postId}`,
      UPDATE_STATUS: (postId: string) => `/v1/cms/posts/${postId}/status`,
      TOGGLE_FEATURED: (postId: string) => `/v1/cms/posts/${postId}/featured`,
      DELETE: (postId: string) => `/v1/cms/posts/${postId}`,
    },
    CATEGORY: {
      GET: '/v1/cms/categories',
      GET_BY_ID: (categoryId: string) => `/v1/cms/categories/${categoryId}`,
      GET_BY_SLUG: (slug: string) => `/v1/cms/categories/public/slug/${slug}`,
      CREATE: '/v1/cms/categories',
      UPDATE: (categoryId: string) => `/v1/cms/categories/${categoryId}`,
      UPDATE_STATUS: (categoryId: string) => `/v1/cms/categories/${categoryId}/status`,
      DELETE: (categoryId: string) => `/v1/cms/categories/${categoryId}`,
    },
    RATING: {
      GET_MY_RATING: (postId: string) => `/v1/cms/posts/${postId}/my-rating`,
      GET_RATING_SUMMARY: (postId: string) => `/v1/cms/posts/${postId}/summary`,
      SUBMIT: (postId: string) => `/v1/cms/posts/${postId}/rating`,
      DELETE: (postId: string) => `/v1/cms/posts/${postId}/rating`,
    },
  },
} as const

/**
 * Helper function to build endpoint with query parameters
 */
export function buildEndpoint(endpoint: string, query?: Record<string, any>): string {
  if (!query || Object.keys(query).length === 0) {
    return endpoint
  }

  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })

  const queryString = params.toString()
  return queryString ? `${endpoint}?${queryString}` : endpoint
}

/**
 * Type helper for API endpoints
 */
// eslint-disable-next-line no-unused-vars
export type ApiEndpoint = string | ((param: string) => string)
