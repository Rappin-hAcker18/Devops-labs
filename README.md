# CloudCrew Academy - Urban Cloud Engineering Platform

> 🏙️ **Empowering urban communities with cutting-edge cloud engineering skills for economic opportunity**

A modern, serverless Cloud Engineering course platform targeting urban youth and adults. Built with Next.js, AWS, and a mobile-first approach.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com/)

## 🚀 Live Demo

- **Production**: Coming soon
- **Staging**: Coming soon
- **Local Dev**: `http://localhost:3000`

## ✨ Features

### 🎓 Complete Learning Platform
- **3 Comprehensive Courses**: AWS Fundamentals, Serverless Architecture, Cloud Security
- **Video Lessons**: Streaming via CloudFront CDN
- **Progress Tracking**: Real-time course completion tracking
- **Interactive Labs**: Hands-on AWS practice environments
- **Course Certificates**: Downloadable, verifiable completion certificates

### 💳 2-Tier Payment System
- **Free Tier**: Course overviews and community access
- **Pro Plan ($49/mo)**: Full access to all 3 courses, labs, and premium features

### 👥 Community Features
- **Discussion Forum**: Q&A, discussions, success stories
- **User Profiles**: Track achievements and certificates
- **Admin Dashboard**: Complete platform management tools

### 🎯 Target Audience
- Urban youth and professionals seeking tech careers
- Mobile-first responsive design
- Community-driven learning approach
- Economic opportunity focus

### ⚡ Technology Stack

**Frontend:**
- Next.js 15.5.6 with TypeScript
- Tailwind CSS with custom urban theme
- React 19 with Server Components
- Responsive mobile-first design

**Backend:**
- AWS Lambda with Serverless Framework
- Node.js 18.x runtime
- API Gateway for REST endpoints
- DynamoDB for data storage

**Authentication & Payments:**
- AWS Cognito for user management
- Stripe for subscription payments
- Webhook integration for real-time updates

**Media & Storage:**
- S3 for video storage
- CloudFront CDN for global delivery
- HLS video streaming

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │────│   API Gateway    │────│  Lambda Functions│
│  (Frontend)     │    │                  │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
        │                       │                        │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cognito       │    │   CloudFront     │    │   DynamoDB      │
│   (Auth)        │    │   (CDN)          │    │   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
        │                       │                        │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Stripe        │    │   S3             │    │   Vercel        │
│   (Payments)    │    │   (Storage)      │    │   (Hosting)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured with credentials
- Git

### Local Development

1. **Clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cloudcrew-academy.git
   cd cloudcrew-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Copy example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your values:
   # - AWS Cognito credentials
   # - Stripe test keys
   # - API Gateway URL
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend (optional for local API testing)
   cd backend
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

### Testing

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage
```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete production deployment instructions
- **[Quick Deploy](DEPLOY.md)** - Quick reference commands for deployment
- **[Certificate System](docs/certificate-system.md)** - Certificate generation and verification
- **[Stripe Setup](docs/stripe-setup-guide.md)** - Payment integration setup
- **[Video Infrastructure](docs/video-infrastructure-setup.md)** - Video streaming setup
- **[Development Standards](DEVELOPMENT_STANDARDS.md)** - Code standards and best practices

## 🌐 Deployment

### Production Deployment (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Backend Deployment

```bash
cd backend

# Deploy to production
npx serverless deploy --stage prod

# Deploy to staging
npx serverless deploy --stage staging
```

## 🎨 Design System

### Urban Theme Colors
- **Primary**: Electric blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Warm grays (#78716c to #292524)
- **Accent**: Vibrant purple (#d946ef to #c026d3)
- **Background**: Deep navy (#0f172a)

### Typography
- **Display Font**: Poppins (headings, bold statements)
- **Body Font**: Inter (content, UI elements)

### Mobile-First Approach
- Responsive breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly interactions
- Optimized for mobile data usage

## 📱 Mobile Features

- **Progressive Web App (PWA)** capabilities
- **Offline content download** for courses
- **Mobile-optimized video streaming**
- **Touch gestures** for navigation
- **Push notifications** for engagement

## 🔒 Authentication & Security

- **AWS Cognito** for user management
- **JWT tokens** for API authentication
- **Role-based access control** (Free, Standard, Premium)
- **Secure payment processing** with Stripe

## 💳 Payment Integration

### Stripe Implementation
- **Subscription management** for recurring payments
- **One-time payments** for course upgrades
- **Student discounts** and promotional codes
- **Secure webhooks** for payment processing

## 🏢 AWS Infrastructure

### Core Services
- **Lambda Functions**: Serverless API endpoints
- **API Gateway**: RESTful API management
- **DynamoDB**: NoSQL database for user data and courses
- **Cognito**: User authentication and authorization
- **CloudFront**: Global content delivery
- **S3**: Static file storage for course materials

### Database Schema
```
Users Table:
- userId (PK)
- email, name, phone, location
- subscriptionTier, goals, experience
- createdAt, updatedAt

Courses Table:
- courseId (PK)
- title, description, difficulty
- modules, duration, price
- tier (free, standard, premium)

Progress Table:
- userId (PK), courseId (SK)
- completedModules, currentLesson
- timeSpent, lastAccessed
```

## 🚀 Deployment

### Development
```bash
# Start local development
npm run dev

# Run backend locally
cd backend
serverless offline
```

### Staging
```bash
# Deploy backend to staging
npm run deploy:dev

# Deploy frontend to Vercel
vercel --env=staging
```

### Production
```bash
# Deploy backend to production
npm run deploy:prod

# Deploy frontend to production
vercel --prod
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e
```

## 📊 Analytics & Monitoring

- **User engagement tracking** with custom events
- **Course completion metrics**
- **Payment conversion analysis**
- **AWS CloudWatch** for infrastructure monitoring
- **Error tracking** with Sentry

## 🤝 Contributing

We welcome contributions from the urban tech community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Write tests for new features
- Ensure mobile responsiveness
- Consider accessibility in all designs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏙️ Community

- **Discord**: Join our learning community
- **Twitter**: [@CloudCrewAcad](https://twitter.com/cloudcrewacad)
- **LinkedIn**: [CloudCrew Academy](https://linkedin.com/company/cloudcrew-academy)
- **Email**: hello@cloudcrew.academy

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform development
- ✅ 3-tier payment system
- ✅ Mobile-first design
- 🔄 AWS infrastructure setup

### Phase 2 (Next 3 months)
- 📱 React Native mobile app
- 🎥 Video streaming platform
- 🏆 Gamification features
- 🤖 AI-powered learning recommendations

### Phase 3 (6 months)
- 🌍 Multi-language support
- 🎓 Corporate partnerships
- 📊 Advanced analytics dashboard
- 🚀 International expansion

---

**Built with ❤️ for the urban community by CloudCrew Academy**