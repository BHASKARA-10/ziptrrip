# Firebase & Google Calendar Setup Instructions

Follow these steps to connect your ziptrrip app to Firebase for Google Authentication and Google Calendar sync.

---

## Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it (e.g., `ziptrrip`) and click **Continue**
4. Disable Google Analytics (optional) and click **Create Project**

---

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Build → Authentication** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click **Google** and toggle **Enable**
5. Enter your **Project support email** and click **Save**

---

## Step 3: Register a Web App

1. Go to **Project settings** (gear icon ⚙️ in the top-left)
2. Scroll down to **"Your apps"** section
3. Click the **web icon** (`</>`) to register a web app
4. Name it (e.g., `ziptrrip-web`) and click **Register app**
5. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ziptrrip-xxxxx.firebaseapp.com",
  projectId: "ziptrrip-xxxxx",
  storageBucket: "ziptrrip-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Step 4: Add Config to Your `.env` File

1. In the `frontend/` folder, create a file called `.env`
2. Add these values from the config above:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=ziptrrip-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ziptrrip-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=ziptrrip-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

3. Restart the frontend dev server (`npm run dev`)

---

## Step 5: Enable Google Calendar API (for calendar sync)

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Select the **same project** as your Firebase project (they share the same GCP project)
3. Go to **APIs & Services → Library**
4. Search for **"Google Calendar API"** and click **Enable**
5. Go to **APIs & Services → OAuth consent screen**
6. Choose **External** and fill in the required fields
7. Add the scope: `https://www.googleapis.com/auth/calendar.events`
8. Add yourself as a **Test user**

---

## Step 6: Test Everything

1. Start the backend: `cd backend && node server.js`
2. Start the frontend: `cd frontend && npm run dev`
3. Open [http://localhost:5173](http://localhost:5173)
4. Click **"Continue with Google"** on the login page
5. **Note:** Since you just created this app, you might see a warning saying **"Google hasn't verified this app"**. This is normal for testing. To proceed:
   - Click **"Advanced"** (or "Hide Advanced")
   - Click the link at the bottom that says **"Go to ziptrrip-xxxxx.firebaseapp.com (unsafe)"**
6. Sign in with your Google account
7. When you create a task using **"+ Add Task"**, it will automatically sync to your Google Calendar!

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Google login popup closes immediately | Check that your Firebase API key is correct in `.env` |
| "auth/invalid-api-key" error | Verify the `VITE_FIREBASE_API_KEY` value |
| Calendar sync fails | Make sure Google Calendar API is enabled in GCP console |
| "Access denied" on calendar | Add yourself as a test user in OAuth consent screen |

---

## Notes

- The **static login** (`test` / `test123`) works without any Firebase configuration
- Google Calendar sync only works when logged in via Google (not static login)
- When using static login, the Calendar page shows tasks in a general view but does NOT sync with Google Calendar
