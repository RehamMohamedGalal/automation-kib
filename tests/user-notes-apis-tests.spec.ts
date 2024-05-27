import { test, expect, request,APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserManagementApi } from '../pages/UserManagementApi';
import { NotesManagementAPi } from '../pages/notes';

let authToken: string;
let userId: string;
let noteId: string;
const categoryItems: string[] = ['Home', 'Work', 'Personal'];
const baseURL = 'https://practice.expandtesting.com/notes/api';

function generateText(min: number, max: number): string {
  let text = '';
  while (text.length < min) {
    text += faker.lorem.word();
  }
  return text.substring(0, Math.min(text.length, max));
}


test.describe('User and Notes Management Test Suite', () => {
  // let userManagementAPI: UserManagementApi;
  // let notesManagementAPI: NotesManagementAPi;

  const newUser = {
    name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    newPassword: faker.internet.password(),
  };

  const updatedNote = {
    title: generateText(3, 100),
    description: faker.lorem.paragraph(),
    completed: faker.datatype.boolean(),
    category: categoryItems[1],
  };

  const newNote = {
    title: generateText(3, 100),
    description: faker.lorem.paragraph(),
    category: categoryItems[0],
  };
  
  // FIXME
  test.beforeAll(async ({ request }) => {
    // userManagementAPI = new UserManagementApi(baseURL, request);
    // notesManagementAPI = new NotesManagementAPi(baseURL, request);
  });

  test('Check Register New User and verify it’s created successfully', async ({ request }) => {
    const userManagementAPI: UserManagementApi = new UserManagementApi(baseURL, request);
    const response = await userManagementAPI.registerUser(newUser);
    expect(response.status).toBe(201);
    console.log('Register Response:', response);
    userId = response.data.id;
  });

  test('Verify New User is created and can login successfully', async ({ request }) => {
    const userManagementAPI: UserManagementApi = new UserManagementApi(baseURL, request);
    const response = await userManagementAPI.loginUser({
      email: newUser.email,
      password: newUser.password,
    });
    expect(response.message).toEqual('Login successful');
    expect(response.data.name).toBe(newUser.name);
    authToken = response.data.token;
  });

  test('Check New User can get his Profile Data after logging in', async ({ request }) => {
    const userManagementAPI: UserManagementApi = new UserManagementApi(baseURL, request);
    const response = await userManagementAPI.getProfile(authToken);
    expect(response.message).toEqual('Profile successful');
    expect(response.data.name).toEqual(newUser.name);
    expect(response.data.id).toEqual(userId);
  });

  test('Check User can update his profile data Successfully', async ({ request }) => {
    const userManagementAPI: UserManagementApi = new UserManagementApi(baseURL, request);
    const newlyData = {
      name: faker.person.firstName(),
      company: faker.company.name(),
    };
    const response = await userManagementAPI.updateProfile(authToken, newlyData);
    expect(response.message).toEqual('Profile updated successful');
    expect(response.data.name).toEqual(newlyData.name);
    expect(response.data.company).toEqual(newlyData.company);
  });

  test('Check user can change his password successfully', async ({ request }) => {
    const userManagementAPI: UserManagementApi = new UserManagementApi(baseURL, request);
    const response = await userManagementAPI.changePassword(authToken, {
      currentPassword: newUser.password,
      newPassword: newUser.newPassword,
    });
    expect(response.success).toBe(true);
    expect(response.message).toEqual('The password was successfully updated');
  });

  test('Check User can add New Note successfully', async ({ request }) => {
    const notesManagementAPI: NotesManagementAPi = new NotesManagementAPi(baseURL, request);
    const response = await notesManagementAPI.createNote(authToken, newNote);
    expect(response.message).toEqual('Note successfully created');
    expect(response.data.category).toEqual(categoryItems[0]);
    noteId = response.data.id;
  });

  test('Check view list of notes with newly added note', async ({ request }) => {
    const notesManagementAPI: NotesManagementAPi = new NotesManagementAPi(baseURL, request);
    const response = await notesManagementAPI.getNotes(authToken);
    expect(response.message).toEqual('Notes successfully retrieved');
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[response.data.length - 1].id).toEqual(noteId);
    expect(response.data[response.data.length - 1].title).toEqual(newNote.title);
    expect(response.data[response.data.length - 1].category).toEqual(categoryItems[0]);
  });

  test('Check User can view Newly added Note Details', async ({ request }) => {
    const notesManagementAPI: NotesManagementAPi = new NotesManagementAPi(baseURL, request);
    const response = await notesManagementAPI.getNoteDetails(authToken, noteId);
    expect(response.data.id).toEqual(noteId);
    expect(response.data.title).toEqual(newNote.title);
  });

  test('Check user can update existing note correctly', async ({ request }) => {
    const notesManagementAPI: NotesManagementAPi = new NotesManagementAPi(baseURL, request);
    const response = await notesManagementAPI.updateNote(authToken, noteId, updatedNote);
    console.log(noteId);
    console.log(response);
    expect(response.data.id).toEqual(noteId);
    expect(response.message).toEqual("Note successfully Updated");
    expect(response.data.title).toEqual(updatedNote.title);
    expect(response.data.completed).toEqual(updatedNote.completed);
  });
});
