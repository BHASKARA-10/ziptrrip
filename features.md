# Features and Functionalities

This document outlines the core features implemented in the **ziptrrip** application based on the requirements.

## 1. Multi-Page Architecture
- **Implementation**: The application uses **React Router** (`react-router-dom`) to provide a multi-page feel.
- **Routes**:
  - `/login`: The entry point for authentication.
  - `/`: The Dashboard page showing all tasks and stats.
  - `/task/:id`: The Task Detail page for viewing subtasks and notes.
  - `/calendar`: A generic calendar view for scheduled tasks.

## 2. Authentication (Dual Mode)
- **Static Login**: Users can log in using hardcoded credentials (Username: `test`, Password: `test123`). This bypasses Firebase and uses a mock session stored in `localStorage`.
- **Google Authentication**: Integrated with Firebase Auth SDK. Users can log in via a Google popup.

## 3. Google Calendar Integration
- **OAuth Scopes**: When a user logs in via Google, the application requests the `https://www.googleapis.com/auth/calendar.events` scope.
- **Syncing Tasks**: When a Google-authenticated user clicks "Add Task" on the Dashboard, the frontend uses the Google Access Token to create an event on the user's primary Google Calendar via the Google Calendar REST API.
- **Generic Calendar View**: Both static and Google users can access the `/calendar` page. For static users, it shows a generic layout of scheduled tasks without syncing. For Google users, it reminds them that their tasks are synced.

## 4. Backend CRUD API (Node.js/Express)
- **Framework**: Express.js server providing RESTful endpoints.
- **Endpoints**:
  - `GET /api/todos`: Fetch all.
  - `GET /api/todos/:id`: Fetch by ID.
  - `POST /api/todos`: Create.
  - `PUT /api/todos/:id`: Update.
  - `DELETE /api/todos/:id`: Delete.
- **Database**: Integrated with Firebase Admin SDK (Firestore). Includes a fallback mechanism that stores data in-memory if Firebase credentials are not provided via the `.env` file.

## 5. Premium UI Design
- **Styling**: Built entirely using Vanilla CSS to maximize control and match the provided high-fidelity designs.
- **Features**:
  - Glassmorphism effects (`backdrop-filter: blur()`).
  - Modern typography using the Google Font 'Inter'.
  - Rich color palettes (deep blues, teals, gradients).
  - Responsive Flexbox/Grid layouts mirroring the uploaded images.
