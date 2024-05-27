import { test, expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';

let userId: any; 
let authToken: any;
let noteId: any;
const categoryItems: string[] = [
  'Home',
  'Work',
  'Personal',
];


test.describe('User Management Test Suite', () => {
  const baseurl = 'https://practice.expandtesting.com/notes/api'; 

  const newUser = {
    'name': faker.person.lastName(),
    'email': faker.internet.email(),
    'password': faker.internet.password(),
    'newPassword':faker.internet.password()
  };
  const updatedNote ={
    'id': faker.database.mongodbObjectId(),
    'title': faker.commerce.productDescription(),
    'description' : faker.lorem.paragraph(),
    'completed': faker.datatype.boolean(),
    'category': categoryItems[1]
  };

  const newNote = {
     'title': faker.commerce.productDescription(),
     'description': faker.lorem.paragraph()
     
  }


  test('Check Register New User and verify it’s created successfully', async ({ request }) => {
    const res = await request.post(`${baseurl}/users/register`, {
      data: newUser,
    });

    expect(res.status()).toBe(201); 
    const responseBody = await res.json();
    console.log('Register Response:', responseBody);
    console.log(responseBody.data.id);
    userId = responseBody.data.id;
  });

  test('Verify New User is created and can login successfully', async ({ request }) => {
    console.log(userId);
    const res = await request.post(`${baseurl}/users/login`,{
      data:{
        email:newUser.email,
        password: newUser.password
      }
    }
      
  );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toEqual("Login successful");
    expect(body.data.name).toBe(newUser.name);
    expect(body.data.token).toBeDefined();
    authToken= body.data.token;
    
  });

  test('Check New User can get his Profile Data after logging' , async ({request})  => {
  const res= await request.get(`${baseurl}/users/profile`,{
  headers: {
    'x-auth-token': authToken,
  },
});
console.log(authToken);
const body= await res.json();
expect(res.status()).toBe(200);
expect(body.message).toEqual("Profile successful");
expect(body.data.name).toEqual(newUser.name);
expect(body.data.id).toEqual(userId);
  })

  test('Check User can update his profile data Successfully', async ({request}) => {
    const newlyData = {
      name: faker.person.firstName(),
      company:faker.company.name()
    };
  const res= await request.patch(`${baseurl}/users/profile`,{
    headers:{
      'x-auth-token': authToken,
    },
    data:newlyData
  }) 
  const body= await res.json();
  console.log(body);
  expect(res.status()).toBe(200);
  expect(body.message).toEqual("Profile updated successful");
  expect(body.data.name).toEqual(newlyData.name);
  expect(body.data.company).toEqual(newlyData.company);

  })

  test('Check user can change his password successfully', async ({request}) => {
    const res = await request.post(`${baseurl}/users/change-password`,{
      headers:{'x-auth-token': authToken,},
      data:{
        'currentPassword':newUser.password,
        'newPassword' : newUser.newPassword
      }
    })
    const body= await res.json();
    expect(res.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toEqual("The password was successfully updated");
     
  })
test('Check User can add New Note successfully',async ({request}) => {
  const res= await request.post(`${baseurl}/notes`, {
    headers:
     {'x-auth-token': authToken,},
    data : {
      'title' : newNote.title,
      'description': newNote.description,
      'category' : categoryItems[0]
    }
  })
  const body = await res.json();
  console.log(body.title);
  expect(res.status()).toBe(200);
  expect(body.message).toEqual("Note successfully created");
  expect(body.data.category).toEqual(categoryItems[0]);
  noteId= body.data.id;
  
});

test('Check view list of notes with newly added note', async ({request}) => {
 const res= await request.get(`${baseurl}/notes`,{
  headers:{
    'x-auth-token':authToken,
  },
 })
 const body = await res.json();
 expect(body.message).toEqual("Notes successfully retrieved");
 const dataArray= body.data
 expect(dataArray.length).toBeGreaterThan(0); 
 console.log(dataArray.length);
 expect(body.data[dataArray.length-1].id).toEqual(noteId);
 expect(body.data[dataArray.length-1].title).toEqual(newNote.title);
 expect(body.data[dataArray.length-1].category).toEqual(categoryItems[0]);

})

test('Check User can view Newly added Note Details' , async ({request}) => {
  const res= await request.get(`${baseurl}/notes/${noteId}`,{
    headers:{
      'x-auth-token':authToken,
    },
  })
   const body=await res.json();
   expect(body.data.id).toEqual(noteId);
   expect(body.data.title).toEqual(newNote.title);

})
test('Check user can update existed note correctly', async ({request}) => {
  const res= await request.put(`${baseurl}/notes/${noteId}`,{
    headers:{
      'x-auth-token':authToken , 
    },
    data : updatedNote
   });
  const body = await res.json();
  console.log(body);
  expect(body.data.id).toEqual(updatedNote.id);
  expect(body.message).toEqual("");
  expect(body.data.title).toEqual(updatedNote.title);
  expect(body.data.completed).toEqual(updatedNote.completed);
})

});
