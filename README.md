# FolioMind - AI Powered Developer Portfolio Platform

Production-ready AI-powered developer portfolio platform with:
- Public portfolio website (`client`)
- Admin CMS dashboard (`admin`)
- Node/Express API backend (`server`)

## Tech Stack
- Frontend: React + Vite + TailwindCSS + Framer Motion
- Backend: Node.js + Express + MongoDB (Atlas-ready)
- Auth: JWT + bcrypt
- Media: Cloudinary
- AI: OpenAI API

## Monorepo Structure
```
client/   # Public portfolio site
admin/    # Admin dashboard CMS
server/   # REST API + AI assistant + auth
```

## Setup
1. Install dependencies
```bash
npm install --prefix server
npm install --prefix client
npm install --prefix admin
```

2. Configure env files
- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`
- Copy `admin/.env.example` to `admin/.env`

3. Start apps
```bash
npm run dev:server
npm run dev:client
npm run dev:admin
```

## AI Provider (Quota-Free Option)
- Default config uses `AI_PROVIDER=ollama` for local usage without API quotas.
- Install Ollama and pull a model:
```bash
ollama pull llama3.1:8b
```
- Ensure in `server/.env`:
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1:8b
```
- Optional cloud mode:
  - `AI_PROVIDER=openai_compatible`
  - set `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`

## API Routes
- Auth
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Projects
  - `GET /api/projects`
  - `POST /api/projects` (admin)
  - `PUT /api/projects/:id` (admin)
  - `DELETE /api/projects/:id` (admin)
- Skills
  - `GET /api/skills`
  - `POST /api/skills` (admin)
  - `PUT /api/skills/:id` (admin)
  - `DELETE /api/skills/:id` (admin)
- Site Content
  - `GET /api/site`
  - `PUT /api/site` (admin)
- Theme
  - `GET /api/theme`
  - `PUT /api/theme` (admin)
- Media
  - `POST /api/upload` (admin)
- AI Assistant
  - `POST /api/ai/chat`

## Deployment
- Client: Vercel
- Admin: Vercel (separate project or `/admin` rewrite)
- Server: Render or Railway
- MongoDB: Atlas
