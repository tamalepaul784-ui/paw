# Yo Agronomist Upgrade

This is a simpler upgraded version of Yo Agronomist with:
- real AI advice via a Vercel serverless function
- email/password login via Supabase
- live weather data from Open-Meteo

## Files
- index.html
- styles.css
- script.js
- config.js
- api/advice.js
- vercel.json

## Setup

### 1. Supabase
Create a Supabase project.
In Authentication, enable Email/Password sign-in.
Copy your Project URL and anon public key.
Paste them into `config.js`.

### 2. OpenAI
In Vercel project settings, add this environment variable:
- OPENAI_API_KEY=your_key_here

### 3. Deploy to Vercel
Upload these files to GitHub, then import the repo into Vercel.
If you add or change environment variables in Vercel, redeploy the project.

## Notes
- Weather uses Open-Meteo directly from the browser.
- AI advice is generated on the serverless route `/api/advice`.
- This version is meant to be much easier to deploy than the Prisma backend version.
