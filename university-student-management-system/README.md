# University Student Management System

This project is a **full‑stack student management system** built using a modern JavaScript stack.  It is designed for universities or colleges to manage students, courses, departments, grades, and announcements.  The system includes **JWT‑based authentication** for both administrators and students, role‑based authorization, and a responsive front‑end built with **React** and **Tailwind CSS**.  The back‑end is powered by **Node.js**, **Express.js**, and **MySQL**.

## 🗂 Project Structure

The repository is organised into two top‑level directories:

```
university-student-management-system/
├── client/   # React front‑end application
└── server/   # Node/Express back‑end application
```

### Front‑end (`client/`)

The front‑end is a [Create React App](https://create-react-app.dev/) project configured with **Tailwind CSS** and **React Router**.  It provides separate dashboards for administrators and students.  Components are grouped by feature area (students, courses, departments, grades and announcements) to keep the codebase modular.

Key folders:

* **`src/components`** – reusable components such as forms, tables and private route guards.
* **`src/pages`** – page components for admin and student dashboards.
* **`src/context`** – the authentication context that stores the logged in user’s information and JWT token.
* **`src/api`** – Axios instance configured to send requests to the Express API.

### Back‑end (`server/`)

The back‑end is a **Node.js** project using **Express.js**.  It communicates with a **MySQL** database via the `mysql2` package.  The API follows REST principles and uses [express-validator](https://express-validator.github.io/) for input validation and **bcrypt** for password hashing.

Key folders:

* **`controllers/`** – functions handling the core logic for each API route.
* **`models/`** – database access layer; each model defines queries for one resource (Student, Course, Department, Grade, Announcement).
* **`routes/`** – Express route definitions, grouped by resource.
* **`middleware/`** – custom middleware for authentication, role checks and global error handling.
* **`config/`** – centralised configuration for the database connection and environment variables.

## 🧾 Features

### Authentication

* JWT‑based auth for admins and students.
* Secure password hashing with bcrypt.
* Protected routes on the back‑end and route guards on the front‑end.

### Administration

Administrators can:

* Create, update, view and delete students.
* Create, update, view and delete courses.
* Create, update, view and delete departments.
* Enrol students in courses and assign them to departments.
* Add, edit and delete student grades per course.
* Post announcements for all students to see.

### Students

Students can:

* Log in to view their profile and personal information.
* See courses they are enrolled in and their grades.
* Read announcements posted by the administration.

### Reports (optional)

* Generate summary reports of student performance (not fully implemented – the groundwork is laid in the back‑end).

## ✅ Getting Started

Follow the steps below to set up the project locally.  These instructions assume you have **Node.js**, **npm**, and **MySQL** installed on your development machine.

### 1. Clone the repository

```bash
git clone <repository-url>
cd university-student-management-system
```

### 2. Back‑end setup

The server lives in the `server/` directory.

```bash
cd server
npm install
```

#### Configure environment variables

Copy the `.env.example` file to `.env` and fill in your configuration values:

```bash
cp .env.example .env
```

Open `.env` and set the MySQL connection details and the JWT secret.  For example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=university_db
JWT_SECRET=yourSecretKey
TOKEN_EXPIRY=1h
```

#### Create the database and seed sample data

1. Log into MySQL and create a database called `university_db` (or the name you used in `.env`).
2. Run the SQL script in `server/database/seed.sql` to create tables and insert sample data:

```bash
mysql -u root -p university_db < database/seed.sql
```

#### Start the development server

```bash
npm run dev
```

This will start the back‑end on port `5000` by default (configurable via `.env`).  The server watches files and restarts automatically using **Nodemon**.

### 3. Front‑end setup

Open a new terminal and navigate to the `client/` directory:

```bash
cd client
npm install
```

#### Configure environment variables

Create a `.env` file in the root of the `client/` directory and set the API base URL.  An example is provided in `.env.example`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

#### Start the React development server

```bash
npm start
```

This will start the client on port `3000`.  The React application will proxy API requests to the Express server using the base URL specified in `.env`.

## 🛠️ Scripts

The root `package.json` is intentionally kept minimal because each sub‑project (`client` and `server`) has its own dependencies and scripts.

### Server (`/server`)

| Script | Description                                |
| ------ | ------------------------------------------ |
| `npm start` | Run the server in production mode.          |
| `npm run dev` | Start the server with Nodemon for development. |
| `npm run seed` | (Optional) Run database seed scripts.        |

### Client (`/client`)

| Script | Description                                     |
| ------ | ----------------------------------------------- |
| `npm start` | Start the React development server.            |
| `npm build` | Create an optimized production build of the app. |
| `npm test` | Run tests (not implemented by default).         |

## 📁 Additional Notes

* **State management** – The app uses React Context to manage authentication state.  Because most data is fetched on demand from the API, a heavier solution like Redux was not required.
* **Validation** – Both the server and client implement form validation.  On the server side `express-validator` checks incoming data; on the client side input components display inline errors and use built‑in HTML validation attributes.
* **Styling** – Tailwind CSS provides utility classes for layout and styling.  You can switch to Bootstrap by installing it and replacing the classes if desired.
* **Reports** – The code includes an endpoint scaffold for generating reports (`/api/reports`), but the actual PDF/Excel generation is left as an exercise.

## 📣 Contributing

Contributions are welcome!  If you want to add features, fix bugs, or improve documentation, please submit a pull request.  Make sure to discuss significant changes in issues before working on them.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).