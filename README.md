# CRUD API

## Description

This is a simple CRUD API with using in-memory database underneath

## Technical stack

- Typescript
- Nodemon
- Dotenv
- Cross-env
- Jest
- Supertest
- 18 LTS version of Node.js

## How to start

Clone the repository

      git clone -b develop https://github.com/ylepner/crud-api.git

Install packages

      npm i

## Scripts

run development server

      npm run start:dev

run production server

      npm run start:prod

run tests

      npm run test

## Endpoints

- **GET** api/users - Get all users
- **GET** api/users/{userId} - Get user by userId
- **POST** api/users - Create record about new user and store it in database
- **PUT** api/users/{userId} - Update existing user
- **DELETE** api/users/{userId} - Delete existing user from database
