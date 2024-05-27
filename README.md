# KIB Automation Task
QA Task for automating website and APIs
 
Tests are designed to maintain Some test cases for Front-end and APIs front-end ones:

## Pre-requisite
Install playwright follow guides below:
https://playwright.dev/docs/intro#installing-playwright


## Setup
Install dependencies:

$ npm install



## Run test


$ npm run test


#### Tests are designed to maintain Some test cases for Front-end and APIs front-end ones:

 - Add new Product 
 - Edit existed Product
 - Search for newly added product and verify it matched returned product name
 - delete existed product and search for it to verify it's already deleted APIs Ones :
 - Create New User and verify it's created successfully
 - Login with newly created user and fetch the retruned user token
 - using this token , edit the User info
 - using this token , view all users list
 - using this token , view user details
 - using this token , change password successfully
 - using this token , create new note and verify it's created
 - using this token , edit the created note