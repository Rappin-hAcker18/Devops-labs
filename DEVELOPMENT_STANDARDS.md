CloudCrew Development Standards

- Code Style
  - Use TypeScript everywhere possible; enable strict types.
  - Prefer functional components with hooks; no implicit any.
  - Keep functions small, pure, and single‑purpose.
  - Name things clearly; avoid abbreviations and one‑letter vars.

- Project Structure
  - UI in `src/app` and `src/components`; shared libs in `src/lib`.
  - API routes in `src/app/api/*`; backend lambdas in `backend/src/handlers`.
  - Configuration via environment variables only; never hardcode secrets.

- Git & Reviews
  - Branch per task: `feat/*`, `fix/*`, `chore/*`.
  - Conventional commits: `feat: add pro $49 plan`.
  - PRs must include: scope, screenshots (UI), and test notes.

- Testing
  - Unit test logic-heavy utilities; test API handlers in isolation.
  - Manual smoke for critical flows: signup → checkout → access.
  - Use `.env.example` as the authoritative list of required envs.

- Stripe & Payments
  - Client uses publishable key only; never expose secret keys.
  - Prices are configured in Stripe Dashboard; reference by Price ID envs.
  - Use Checkout `mode=subscription` for recurring plans.
  - Webhooks validate with signing secret and update user tier idempotently.

- Access Control
  - Store authoritative `subscriptionTier` on the user record (DynamoDB).
  - Client caches tier in `localStorage` but treats backend as source of truth.
  - Gate content by tier at route/component level; avoid UI-only checks.

- Error Handling & Logging
  - Return typed error responses `{ error, code }`; no raw errors.
  - Log context, not secrets. Use structured logs in Lambdas.

- Performance
  - Avoid unnecessary rerenders; memoize heavy components.
  - Paginate API queries; index DynamoDB access patterns.

- Security
  - Never commit secrets. Use `.gitignore` for `.env*` (except examples).
  - Validate and sanitize all inputs at API boundaries.
  - Principle of least privilege for IAM roles.

- Deployment
  - Backend via Serverless (`backend/serverless.yml`) per stage.
  - Frontend uses `NEXT_PUBLIC_*` envs at build time.
  - Version infra changes; document migrations.

