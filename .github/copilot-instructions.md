# CloudCrew Academy - AI Agent Instructions

## Project Architecture
**CloudCrew Academy** is a production-ready serverless cloud engineering education platform with 21 pages, 2-tier Stripe payments, and video streaming.

### Key Stack Components
- **Frontend**: Next.js 15.5.6 (App Router) + TypeScript + Tailwind CSS  
- **Backend**: AWS Lambda (Serverless Framework) + Node.js 18.x
- **Database**: DynamoDB with 7 tables (users, enrollments, payments, video-metadata, etc.)
- **Auth**: AWS Cognito (`us-east-1_eBAqIBYa1`) with JWT tokens
- **Payments**: Stripe subscriptions ($49/mo Pro tier)
- **Video**: S3 + CloudFront CDN (`d2f6ofuxhmqty1.cloudfront.net`)

## Critical Development Patterns

### Authentication Flow
```tsx
// Always use AuthProvider context - never raw Cognito calls
import { useAuth } from '@/lib/useAuth';
const { user, isAuthenticated, signIn, signOut } = useAuth();

// Tier access control pattern in components
const userTier = user?.subscription_tier || 'free';
if (courseData.tier === 'standard' && userTier === 'free') {
  // Show upgrade prompt
}
```

### Course Content Structure
Courses are hardcoded in `src/data/courseContent.ts` with this pattern:
- 3 courses: `aws-fundamentals` (free), `serverless-architecture` (pro), `cloud-security` (pro)
- Each has modules → lessons → video/lab/article content types
- Progress tracking via DynamoDB `course-progress` table

### API Endpoints Pattern
Backend in `backend/src/handlers/` follows this structure:
```typescript
// Each handler exports: { handler } with CORS headers
// Environment variables from serverless.yml: USER_TABLE, COGNITO_USER_POOL_ID, etc.
// Authentication via JWT verification using aws-jwt-verify
```

## Development Workflows

### Local Development
```bash
npm run dev          # Frontend (localhost:3000)
cd backend && serverless deploy --stage dev  # Backend API
npm run stripe:setup # Configure Stripe products
```

### Testing Commands
```bash
npm run test:e2e     # Playwright tests (21 test files)
npm run test         # Jest unit tests
npm run lint         # TypeScript/ESLint checking
```

### Deployment
- Frontend: Vercel (main branch auto-deploys)
- Backend: `serverless deploy --stage prod` (creates AWS resources)
- Environment separation: dev/prod configs in `serverless.yml` vs `serverless-prod.yml`

## Key Integration Points

### Stripe Payment Flow
1. User clicks upgrade → `/checkout` page
2. Creates Stripe PaymentIntent via `/api/checkout` 
3. Webhook at `/api/webhook` updates user subscription_tier in DynamoDB
4. Frontend checks `localStorage.getItem('subscriptionTier')` for immediate UI updates

### Video Streaming
- Videos stored in S3, served via CloudFront 
- Metadata in `video-metadata` DynamoDB table
- HLS streaming for mobile optimization
- Progress tracking per user/video in database

### Course Navigation
Files in `src/app/courses/[courseId]/` handle dynamic routing. Course data flows:
`courseContent.ts` → Dynamic pages → Components in `src/components/course/`

## Mobile-First Design Philosophy
- Tailwind breakpoints: mobile → `md:` → `lg:`
- Touch-friendly navigation with burger menu
- Urban color scheme: slate-950 backgrounds, neon accents
- All video players optimized for mobile bandwidth

## Environment Variables Critical to Function
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=<backend-api-gateway-url>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend (serverless.yml)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
COGNITO_USER_POOL_ID=us-east-1_...
```

When making changes, always consider the 2-tier access model and mobile-first responsive design. Test authentication flows thoroughly as they drive the entire user experience.