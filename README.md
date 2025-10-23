# CloudCrew Academy - Urban Cloud Engineering Platform

> 🏙️ **Empowering urban communities with cutting-edge cloud engineering skills for economic opportunity**

A modern, serverless Cloud Engineering course platform targeting urban youth and adults. Built with Next.js, AWS Lambda, and a mobile-first approach.

## 🚀 Features

### 💰 3-Tier Payment System
- **Free Starter**: Basic courses and community access
- **Standard Pro**: Full course library with hands-on AWS labs
- **Premium Elite**: 1-on-1 mentoring and career coaching

### 🎯 Target Audience Focus
- Urban youth and professionals seeking economic opportunities
- Mobile-first responsive design
- Community-driven learning approach
- Cultural representation in design and messaging

### ⚡ Technology Stack
- **Frontend**: Next.js 15 with TypeScript
- **UI**: Tailwind CSS with custom urban theme
- **Backend**: AWS Lambda functions (Node.js)
- **Database**: DynamoDB
- **Authentication**: AWS Cognito
- **Payments**: Stripe integration
- **Deployment**: Serverless Framework

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │────│   API Gateway    │────│  Lambda Functions│
│  (Frontend)     │    │                  │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                       ┌──────────────────┐    ┌─────────────────┐
                       │   CloudFront     │    │   DynamoDB      │
                       │   (CDN)          │    │   (Database)    │
                       └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured
- Serverless Framework installed globally

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd The_Work
   npm install
   ```

2. **Install Serverless Framework globally**
   ```bash
   npm install -g serverless
   ```

3. **Configure environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Add your environment variables
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

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