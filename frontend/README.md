# Frontend — BrightSmile Dental

Next.js 16 (App Router) frontend for the AI Dental Receptionist & Patient Automation Platform.
**See the [root README](../README.md)** for the full documentation.

```bash
npm install
npm run dev      # http://localhost:3000  (needs the FastAPI backend on :8000)
npm run build
npm run lint
```

Environment variables go in `.env.local` — see [`../.env.example`](../.env.example). The only required one
is `API_URL` (server-side); `ADMIN_API_KEY` must match the backend when the dashboard is used.

Routes: `/` patient website · `/book` online booking · `/admin` clinic dashboard ·
`/solutions/dental` agency landing page · `/api/backend/*` server-side proxy to FastAPI.
