# Quill - A Modern Note-Taking Web App

Quill is a feature-rich, responsive note-taking application inspired by Google Keep. It provides a seamless and intuitive user experience for creating, managing, and organizing notes, built with a modern tech stack and hosted on Firebase.

**Live Demo:** https://quill-a5e60.web.app/

---

## Features

- **Full User Authentication:** Secure sign-up and login with Email/Password and Google Sign-In.
- **Complete Note Management:** Create, edit, and manage notes in a beautiful, responsive grid layout.
- **Note Organization:**
  - **Archive:** Move notes out of the main view without deleting them.
  - **Trash:** Move notes to a trash folder with options to restore or delete them permanently.
  - **Empty Trash:** A secure, one-click option to permanently delete all trashed notes with a confirmation dialog.
- **Reminders:** Add a date and time to any new note to turn it into a reminder, which appears in a dedicated, sorted view.
- **Real-time Search:** A powerful, real-time search bar in the header that filters notes across all pages instantly as you type.
- **Responsive Design:** A fully responsive layout that works beautifully on desktop, tablet, and mobile devices.
- **Dark/Light Theme:** A sleek, modern UI with a theme toggle for user preference.

## Tech Stack

- **Frontend:** Angular (with Standalone Components and new `@for` syntax)
- **Styling:** SCSS with modern CSS Grid for layout
- **Backend & Database:** Firebase (Authentication and Firestore for real-time data)
- **Deployment:** Firebase Hosting

---

## Getting Started (Local Setup)

To run this project on your local machine, follow these steps:

1.  **Clone the Repository**

    ```bash
    git clone [https://github.com/srujan00000/Quill-A-Note-Taking-App.git](https://github.com/srujan00000/Quill-A-Note-Taking-App.git)
    cd YOUR_REPOSITORY_NAME
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set Up Your Own Firebase Project**

    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - Enable **Authentication** (with Email/Password and Google providers).
    - Create a **Firestore Database** in test mode.
    - In your new Firebase project, go to Project Settings and register a new "Web App".
    - Firebase will give you a configuration object. Copy this object.
    - In the Angular project, find the `app.config.ts` file and replace the `firebaseConfig` in the `provideFirebaseApp` section with your own.

4.  **Run the Development Server**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment

This project is configured for deployment on Firebase Hosting.

1.  **Build the project:**
    ```bash
    ng build
    ```
2.  **Deploy to Firebase:**
    ```bash
    firebase deploy --only hosting
    ```
