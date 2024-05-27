import { APIRequestContext } from '@playwright/test';

class NotesManagementAPi {
  private baseURL: string;
  private request: APIRequestContext;

  constructor(baseURL: string, request: APIRequestContext) {
    this.baseURL = baseURL;
    this.request = request;
  }

  async createNote(authToken: string, noteData: any) {
    const response = await this.request.post(`${this.baseURL}/notes`, {
      headers: { 'x-auth-token': authToken },
      data: noteData,
    });
    return response.json();
  }

  async getNotes(authToken: string) {
    const response = await this.request.get(`${this.baseURL}/notes`, {
      headers: { 'x-auth-token': authToken },
    });
    return response.json();
  }

  async getNoteDetails(authToken: string, noteId: string) {
    const response = await this.request.get(`${this.baseURL}/notes/${noteId}`, {
      headers: { 'x-auth-token': authToken },
    });
    return response.json();
  }

  async updateNote(authToken: string, noteId: string, updatedNoteData: any) {
    const response = await this.request.put(`${this.baseURL}/notes/${noteId}`, {
      headers: { 'x-auth-token': authToken },
      data: updatedNoteData,
    });
    return response.json();
  }
}

export { NotesManagementAPi };
