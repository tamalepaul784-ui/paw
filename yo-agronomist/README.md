# Yo Agronomist

AI-driven agronomy advisory platform for Uganda.

## Apps
- `apps/web` Farmer-facing preview app
- `apps/admin` Admin dashboard preview
- `apps/api` Prisma + Express API

## Quick local setup
1. Install root dependencies if using workspaces, or install inside each app.
2. Copy `.env.example` to `.env` in the API and set `DATABASE_URL`.
3. Run PostgreSQL.
4. In `apps/api`, run:
   - `npm install`
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
   - `npx prisma db seed`
   - `npm run dev`
5. In `apps/web` and `apps/admin`, set `VITE_API_BASE_URL` and run `npm run dev`.

## Free deployment
- API + Postgres: Render
- Frontends: Vercel
