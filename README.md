# ziptrrip Todo Application

A full-stack Todo application built with React (Vite), Node.js (Express), and Firebase.

## Getting Started

### Backend Setup
1. Navigate to the \`backend\` directory:
   \`cd backend\`
2. Install dependencies:
   \`npm install\`
3. (Optional) Create a \`.env\` file with \`FIREBASE_SERVICE_ACCOUNT_PATH\` pointing to your Firebase Admin SDK JSON key. If not provided, it runs in a mock memory mode.
4. Start the server:
   \`node server.js\` (Runs on port 5000)

### Frontend Setup
1. Navigate to the \`frontend\` directory:
   \`cd frontend\`
2. Install dependencies:
   \`npm install\`
3. Create a \`.env\` file and add your Firebase config (e.g., \`VITE_FIREBASE_API_KEY\`). If not provided, mock mode is activated.
4. Start the Vite dev server:
   \`npm run dev\`

### Running the App
- Open the application in your browser (usually \`http://localhost:5173\`).
- **Static Login**: Use Username \`test\` and Password \`test123\`.
- **Google Login**: Use the Google button. If you have Firebase properly configured, it will prompt you for your Google credentials and request Calendar access.
