/**
 * Aalto Dentist Portal — Auth Me Page Object
 * Endpoint: GET /v1/auth/me
 *
 * Encapsulates /v1/auth/me API testing with browser-based and request-context access.
 */
import { type Page, type APIRequestContext, type Response } from '@playwright/test';
import { ENDPOINTS } from '../helpers/auth-config';

export class AuthMePage {
  readonly page: Page;
  readonly request: APIRequestContext;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
  }

  /** Fetch /v1/auth/me via browser's network (uses login cookie) */
  async getMeViaPage(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes(ENDPOINTS.AUTH_ME) && resp.request().method() === 'GET',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  /** Fetch /v1/auth/me via API request context (standalone, no browser context) */
  async getMeViaApi(token?: string): Promise<{ status: number; body: Record<string, unknown> }> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await this.request.get(ENDPOINTS.AUTH_ME, { headers });
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  /** Wait for the GET /v1/auth/me network response to occur naturally */
  async waitForMeResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes(ENDPOINTS.AUTH_ME) && resp.request().method() === 'GET',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  /** Get the user data object from a /v1/auth/me response */
  getUserData(meResponse: { status: number; body: Record<string, unknown> }): Record<string, unknown> {
    const data = meResponse.body.data as Record<string, unknown>;
    const user = (data?.user || data) as Record<string, unknown>;
    return user;
  }
}
