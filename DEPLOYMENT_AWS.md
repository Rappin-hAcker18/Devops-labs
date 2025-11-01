AWS Deployment Guide (Free + $49/mo)

- Prerequisites
  - AWS account with credentials configured locally.
  - Stripe test account with a recurring Price ($49/mo) created.
  - Environment variables prepared per `.env.example`.

- Stripe Setup
  - Create a Product in Stripe with a recurring monthly Price at $49.
  - Copy its Price ID into:
    - `NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID`
    - `STRIPE_STANDARD_PRICE_ID`
  - Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

- Backend Deploy
  - Update `backend/serverless.yml` envs for your stage (or use CI secrets).
  - From `backend/`: `npm ci && npx serverless deploy --stage dev`.
  - Note the API URL output and set `NEXT_PUBLIC_API_URL` accordingly.

- Frontend Run/Build
  - At repo root: `npm ci` then `npm run dev` for local.
  - For production build: `npm run build && npm run start` with the same `NEXT_PUBLIC_*` envs.

- Webhook
  - Stripe Dashboard → Developers → Webhooks → Add endpoint:
    - URL: `<your frontend>/api/webhook/stripe`
    - Events: checkout.session.completed, invoice.payment_succeeded, customer.subscription.*
  - Set `STRIPE_WEBHOOK_SECRET`.

- Verify Flow
  - Visit `/pricing` → choose Pro plan → redirected to Stripe.
  - Pay with test card 4242 4242 4242 4242.
  - Confirm redirect to `/success` and tier updated.
  - Access paid course content under `/courses`.

