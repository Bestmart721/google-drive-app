# Google Drive Node.js App

## 📄 Overview

This application allows a user to log in with their Google account and interact with their Google Drive. After authenticating via OAuth 2.0, users can:
- View their Drive files (name, type, last modified date)
- Upload a file from their local system
- Download any file directly to their browser
- Delete files from their Drive

Built with Node.js, Express, EJS for templating, and the official Google Drive API.

---

## ⚙️ Development Setup

1. Clone the repo  
   ```bash
   git clone https://github.com/Bestmart721/google-drive-app
   cd google-drive-app
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Add `.env` file:
   ```
   PORT=3000
   SESSION_SECRET=your-secret
   ```

4. Place your `credentials.json` from Google Cloud in the project root.

---

## ▶️ Running the App

```bash
node index.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.  
The app will prompt for Google authentication on first use.

---

## 🧠 Assumptions & Design Decisions

- All files are uploaded to the root directory of the user’s Google Drive.
- OAuth tokens are held in memory for simplicity (no DB/session persistence).
- Minimal frontend using Bootstrap 5 and EJS for clarity and speed.
- No folder creation, renaming, or sharing features included (per task scope).
