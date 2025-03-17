# NextJS Editor - Using tldraw

**Live Demo**: [https://nextjs-tldraw-editor.vercel.app](https://nextjs-tldraw-editor.vercel.app)

A Next.js application with an interactive editor built on tldraw.

> **IMPORTANT**: The environment file (.env.development.local) required to run this project locally was sent directly to Talent Director Lucia Perez via email.

## Key Features to Test

1. **Store Updates Status**: Check the status indicator in the top right corner showing real-time persistence status with Upstash Redis

2. **Custom Vidext Tool**: Find the custom 'Vidext Tool' in the toolbar which adds a "Vidext Technologies S.L." sticker to the canvas

3. **tRPC API Routes**: The application uses tRPC for type-safe API calls to store and retrieve document data

4. **Error Handling**: Proper error handling and loading states are implemented throughout the application

## Tech Stack

- **Frontend**: Next.js, React, tldraw
- **API**: Next.js, tRPC
- **Data Storage**: Upstash Redis
- **Styling**: TailwindCSS

## How to Run Locally

```bash
# Clone repository
git clone https://github.com/kamal-choudhary/nextjs-tldraw-editor.git

# Create env file (.env.development.local) in the root directory
# Note: This file was attached in the email to Talent Director: Lucia Perez

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

Thank you for the opportunity to demonstrate my technical skills with this challenge.
