# CRUD API

## Description

This is a simple CRUD API with using in-memory database underneath.

## Technical stack

- Typescript
- Nodemon
- Dotenv
- Cross-env
- Jest
- Supertest
- 18 LTS version of Node.js

## How to start

1. Clone the repository: git clone -b develop https://github.com/ylepner/crud-api.git

2. Install packages:

  - npm install

## Scripts

npm run start:dev - run development server

npm run start:prod - run production server

npm run test - run tests

## Endpoints

- GET api/users - Get all users.
- GET api/users/${userId} - Get current user by userId.
- POST api/users - Create user.
- PUT api/users/{userId} - Update user info
- DELETE api/users/${userId} - Delete user.
