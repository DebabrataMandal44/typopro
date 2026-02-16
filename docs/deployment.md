# TypoPro Deployment Guide

TypoPro is containerized for easy deployment across any environment that supports Docker.

## Prerequisites
- **Docker** and **Docker Compose** installed.
- **Node.js 20+** and **pnpm** (for local development).
- A valid **Google Gemini API Key**.

## Local Development
1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Set up the local database: `pnpm db:migrate`.
4. Start dev servers: `pnpm dev`.

## Production with Docker Compose
To run the full stack locally in production mode:

1. Create a `.env` file in the root directory (or export the variable):
   ```bash
   API_KEY=your_gemini_api_key
   ```
2. Start the services:
   ```bash
   pnpm docker:up
   ```
3. Access the application at `http://localhost:3000`.

## Environment Variables
### API Service
- `DATABASE_URL`: Path to the SQLite database (e.g., `file:/data/typro.db`).
- `API_KEY`: Required for Gemini-powered adaptive drills.
- `CORS_ORIGIN`: The URL of your web frontend (e.g., `http://localhost:3000`).
- `PORT`: Port the API listens on (default: `4000`).

### Web Service
- `VITE_API_BASE_URL`: The full URL to the API endpoint (e.g., `http://yourdomain.com/api`).

## Cloud Hosting (Generic)
1. **API Container**: Build using `apps/api/Dockerfile`. Mount a persistent volume at `/data` to persist the SQLite database.
2. **Web Container**: Build using `apps/web/Dockerfile`. Provide `VITE_API_BASE_URL` as a build argument.
3. **Networking**: Ensure the Web container can reach the API container, potentially through a load balancer or ingress.

## Persistence and Backups
The API uses a SQLite database stored in the `typro_data` volume. To backup data, simply backup the `typro.db` file from the persistent volume mount point.
