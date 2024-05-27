import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

class UserManagementApi {
  private baseURL: string;
  private request: APIRequestContext;

  constructor(baseURL: string, request: APIRequestContext) {
    this.baseURL = baseURL;
    this.request = request;
  }

  async registerUser(userData: any) {
    const response = await this.request.post(`${this.baseURL}/users/register`, {
      data: userData,
    });
    return response.json();
  }

  async loginUser(credentials: any) {
    const response = await this.request.post(`${this.baseURL}/users/login`, {
      data: credentials,
    });
    return response.json();
  }

  async getProfile(authToken: string) {
    const response = await this.request.get(`${this.baseURL}/users/profile`, {
      headers: { 'x-auth-token': authToken },
    });
    return response.json();
  }

  async updateProfile(authToken: string, newProfileData: any) {
    const response = await this.request.patch(`${this.baseURL}/users/profile`, {
      headers: { 'x-auth-token': authToken },
      data: newProfileData,
    });
    return response.json();
  }

  async changePassword(authToken: string, passwordData: any) {
    const response = await this.request.post(`${this.baseURL}/users/change-password`, {
      headers: { 'x-auth-token': authToken },
      data: passwordData,
    });
    return response.json();
  }
}

export { UserManagementApi };
