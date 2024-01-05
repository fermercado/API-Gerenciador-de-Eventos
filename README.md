# Event Management API

## 🌟 Introduction

Welcome to the Event Management API! This project is a backend application developed with Node.js and TypeScript, focused on event management. It includes technologies such as Express.js, Yup for validation, JWT authentication, bcrypt for password hashing, Jest for unit testing, API documentation via Swagger, MongoDB, ESLint and Prettier for code quality, as well as the use of `dotenv` for environment variable management and `Docker` for containerization and deployment.

## 🚀 Technologies Used

- **Node.js & TypeScript**: For a robust backend with strong typing.
- **Express.js**: Web framework for Node.js.
- **Yup**: For schema validation.
- **JWT (JSON Web Tokens)**: For authentication and route security.
- **Bcrypt**: Used for password hashing.
- **Jest**: For efficient unit testing.
- **Swagger**: For interactive API documentation.
- **MongoDB**: As a NoSQL database.
- **ESLint & Prettier**: To keep code consistent and clean.
- **Dotenv**: For managing environment variables.
- **Docker**: For containerization and facilitating deployment.

## 📋 API Features

### Users

- **User Registration**
  - Endpoint: `/api/v1/users/sign-up`
  - Description: Allows user registration in the system.
- **User Login**
  - Endpoint: `/api/v1/users/sign-in`
  - Description: Authenticates registered users.

### Events

- **Event Creation**
  - Endpoint: `/api/v1/events`
  - Method: POST
  - Description: Adds a new event to the system. (Authentication required)
- **Listing All Events**
  - Endpoint: `/api/v1/events`
  - Method: GET
  - Description: Displays all registered events. (Authentication required)
- **Deletion of Events by Day of the Week**
  - Endpoint: `/api/v1/events`
  - Method: DELETE
  - Description: Removes events according to the day of the week. (Authentication required)
- **Event Detail by ID**
  - Endpoint: `/api/v1/events/:id`
  - Method: GET
  - Description: Shows details of a specific event. (Authentication required)
- **Event Deletion by ID**
  - Endpoint: `/api/v1/events/:id`
  - Method: DELETE
  - Description: Deletes a specific event. (Authentication required)

## 🛠️ Configuration and Execution

```sh
# Clone the Repository
git clone https://github.com/fermercado/Challenge-3-Node-AWS.git
```

```sh
# Install Dependencies
npm install
```

## Environment Configuration

-Rename the `.env.example` file to `.env`.
-Fill in the necessary information in the `.env` file, such as environment variables for database connection, JWT secret key, etc.

## Use Docker

-To containerize and run the project, use Docker.
-Deployment was done using Docker and is available at: https://challenger-3-compass.onrender.com"

```sh
# Run the Project
npm run dev
```

## 📚 API Documentation

-Access the API documentation through Swagger UI for a detailed exploration of the routes.

## 🧪 Tests

```sh
# To run unit tests with Jest, execute:
npm run test
```

-This API offers a complete solution for event management, from user registration to event administration, with an emphasis on security and efficiency. Contributions and feedback are always welcome! For more information or support, please contact me.
