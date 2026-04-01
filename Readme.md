# GenoCode

![Tech Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20MongoDB-informational)
![Status](https://img.shields.io/badge/status-Active-success)

GenoCode is a full-stack coding platform inspired by LeetCode-style workflows. Users can solve problems in multiple languages, run code, submit against test cases, and get AI-powered review feedback.

## Version 2 Highlights

- Modernized UI with responsive redesign and dark mode support
- Route-level lazy loading for faster first-load performance
- Server-side pagination/filter/search with optional cursor mode
- Queue-backed compiler execution with Redis mode and memory fallback
- Request tracing (`x-request-id`) and API rate limiting for reliability
- Improved AI review caching and error handling

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Monaco Editor, Framer Motion
- Main API: Node.js, Express, MongoDB, Mongoose
- Compiler API: Node.js, Express, Docker-based execution
- Auth: JWT
- Media: Cloudinary
- AI Review: Gemini API

## Features

- User registration and login
- Problem listing and detailed problem view
- Run and submit in C++, Java, Python, JavaScript
- Verdict handling (AC, WA, TLE, CE, RE)
- User profile with submission history and heatmap
- Admin problem create/update/delete flow
- AI review panel for submitted code
- Dark mode and responsive UI
- Route-level lazy loading for faster initial load
- Server-side pagination, filtering, and search for problem listing
- Request ID logging and basic rate limiting
- Queue-backed compiler flow (Redis mode + in-memory fallback)

## Architecture

This repo has 3 apps:

- client: frontend app (Vite)
- server: main backend (users, problems, submissions)
- compiler: compiler/review backend (run, submit, review)

Runtime flow:

1. Frontend calls server for user/problem data.
2. Frontend calls compiler API for run/submit/review actions.
3. Compiler API fetches test cases from server when required and returns verdict/review response.

Scalability notes:

- Problem list endpoint supports page mode and cursor mode.
- Compiler can run in distributed queue mode when REDIS_URL is configured.
- Basic rate limiting is enabled on APIs to prevent traffic spikes.
- Every request includes x-request-id for observability.

## Project Structure

```text
GenoCode/
|- client/
|  |- public/templates/
|  |- src/components/
|  |- src/screens/
|  |- package.json
|- server/
|  |- config/
|  |- controllers/
|  |- middleware/
|  |- models/
|  |- routes/
|  |- validators/
|  |- index.js
|  |- package.json
|- compiler/
|  |- controllers/
|  |- middlewares/
|  |- routes/
|  |- services/
|  |- index.js
|  |- package.json
|- Readme.md
```

## Environment Variables

Create environment files for each app.

### client/.env

```env
VITE_SERVER_URL=http://localhost:8000
VITE_COMPILER_URL=http://localhost:8080/api
```

### server/.env

```env
PORT=8000
MONGODB_URL=<your_mongodb_connection_string>
JWTSECRET=<your_jwt_secret>

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

NODE_ENV=development
```

### compiler/.env

```env
PORT=8080
DATABASE_SERVER=http://localhost:8000
GEMINI_API=<your_gemini_api_key>
PROMPT=<your_review_prompt>

# optional cache tuning
REVIEW_CACHE_TTL_MS=900000
REVIEW_CACHE_MAX_ITEMS=200

# optional: per-endpoint rate limits
RUN_RATE_LIMIT_PER_MIN=60
SUBMIT_RATE_LIMIT_PER_MIN=40
REVIEW_RATE_LIMIT_PER_MIN=15

# optional: distributed queue mode (enables Bull + Redis)
REDIS_URL=redis://localhost:6379
QUEUE_NAME=compiler-jobs
QUEUE_WORKER_CONCURRENCY=4

# fallback in-memory queue settings when REDIS_URL is not set
MAX_CONCURRENT_TASKS=4
MAX_QUEUE_SIZE=200
```

### server/.env (additional optional)

```env
API_RATE_LIMIT_PER_MIN=300
```

## Local Setup

Prerequisites:

- Node.js 18+
- npm
- Docker installed and running
- MongoDB connection string

Install dependencies:

```bash
cd server && npm install
cd ../compiler && npm install
cd ../client && npm install
```

Run all services in separate terminals:

```bash
# terminal 1: main API
cd server
npm start

# terminal 2: compiler API
cd compiler
node index.js

# terminal 3: frontend
cd client
npm run dev
```

Default local URLs:

- Frontend: http://localhost:5173
- Main API: http://localhost:8000
- Compiler API: http://localhost:8080/api

## API Route Prefixes

- server:
  - /user
  - /problem
  - /submit
- compiler:
  - /api/run
  - /api/submit
  - /api/review
  - /health

## Problem List API Usage

Page mode (default):

GET /problem/list?page=1&limit=15&level=All&search=&sort=newest

Supported query params:

- page: page number (1+)
- limit: page size (1 to 100)
- level: All, Easy, Medium, Hard
- search: title search text
- sort: newest, oldest, title_asc, title_desc

Cursor mode (optional):

GET /problem/list?limit=15&sort=newest&cursor=<date|id>

Cursor mode is useful for infinite scroll and very large datasets.

## Redis Queue Setup

Use this only for compiler service queue mode.

Local Redis with Docker:

```bash
docker run -d --name genocode-redis -p 6379:6379 redis:7-alpine
```

Compiler env for local Redis:

```env
REDIS_URL=redis://localhost:6379
QUEUE_NAME=compiler-jobs
QUEUE_WORKER_CONCURRENCY=4
```

Cloud Redis URL format examples:

- redis://default:<password>@<host>:<port>
- rediss://default:<password>@<host>:<port>

If REDIS_URL is not set, compiler automatically uses in-memory queue fallback.

## Health and Observability

- Compiler health endpoint: GET /health
- Request logs include:
  - timestamp
  - requestId
  - method + route
  - status code
  - response time
- Response header x-request-id is returned by server and compiler APIs.

Example health response (compiler):

```json
{
  "success": true,
  "service": "compiler",
  "queue": {
    "mode": "memory"
  }
}
```

## Deploy Notes

- Set all env variables in your hosting dashboards.
- Update client env with deployed backend URLs.
- Ensure compiler service can access Docker runtime.
- Prefer rediss for managed Redis providers.
- Keep queue and rate-limit values conservative first, then tune with traffic.
- If AI review fails with status 429, verify Gemini quota/billing for your project.

## Known Limitations

- AI review depends on Gemini API quota and availability.
- No automated test suite is configured yet.

## Contributing

Issues and pull requests are welcome.

## Author

Umesh Kumar Verma
