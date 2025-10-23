# CloudCrew Academy - Infrastructure Deployment Guide

## Overview
This guide walks through deploying the CloudCrew Academy platform to AWS using modern serverless architecture with CI/CD pipeline.

## Architecture Components

### Frontend (Next.js)
- **Deployment**: AWS Amplify or Vercel
- **CDN**: CloudFront for global distribution
- **Domain**: Custom domain with Route 53
- **SSL**: Automatic HTTPS with AWS Certificate Manager

### Backend (Serverless)
- **API**: AWS Lambda functions with API Gateway
- **Database**: DynamoDB for user data and course content
- **Authentication**: AWS Cognito for user management
- **File Storage**: S3 for video content and resources
- **CDN**: CloudFront for video streaming

### Infrastructure as Code
- **Framework**: AWS CDK or Serverless Framework
- **Environment Management**: Separate dev/staging/prod
- **Secret Management**: AWS Systems Manager Parameter Store
- **Monitoring**: CloudWatch, X-Ray tracing

## Deployment Steps

### 1. Prerequisites Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure

# Install Serverless Framework
npm install -g serverless

# Install AWS CDK (optional)
npm install -g aws-cdk
```

### 2. Backend Deployment

#### Configure Serverless Environment
```bash
cd backend
npm install

# Deploy to development
serverless deploy --stage dev

# Deploy to production
serverless deploy --stage prod
```

#### Environment Variables
Create `.env` files for each environment:

```env
# .env.dev
STAGE=dev
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
DYNAMODB_TABLE_PREFIX=cloudcrew-dev
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
S3_BUCKET_NAME=cloudcrew-dev-content
CLOUDFRONT_DOMAIN=dev-cdn.cloudcrew.academy
```

### 3. Frontend Deployment

#### Option A: AWS Amplify
```bash
# Initialize Amplify
npm install -g @aws-amplify/cli
amplify init

# Add hosting
amplify add hosting
amplify publish
```

#### Option B: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 4. CI/CD Pipeline

#### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy CloudCrew Academy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint
      
      - name: Build application
        run: npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy backend
        run: |
          cd backend
          npm ci
          npx serverless deploy --stage prod

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_COGNITO_USER_POOL_ID: ${{ secrets.NEXT_PUBLIC_COGNITO_USER_POOL_ID }}
          NEXT_PUBLIC_COGNITO_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_COGNITO_CLIENT_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 5. Environment Configuration

#### Production Environment Variables
```env
# Production (.env.production)
NEXT_PUBLIC_API_URL=https://api.cloudcrew.academy
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXX
NEXT_PUBLIC_CLOUDFRONT_URL=https://cdn.cloudcrew.academy
NEXT_PUBLIC_S3_BUCKET=cloudcrew-prod-content
```

### 6. Monitoring and Alerting

#### CloudWatch Alarms
```bash
# Create billing alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "CloudCrew-HighBilling" \
  --alarm-description "Alert when billing exceeds $100" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT-ID:billing-alerts

# Create API error alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "CloudCrew-APIErrors" \
  --alarm-description "Alert on API Gateway 5xx errors" \
  --metric-name 5XXError \
  --namespace AWS/ApiGateway \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### 7. Security Configuration

#### WAF Rules for API Protection
```bash
# Create WAF web ACL
aws wafv2 create-web-acl \
  --name CloudCrewAPIProtection \
  --scope CLOUDFRONT \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

#### SSL Certificate Setup
```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name cloudcrew.academy \
  --subject-alternative-names "*.cloudcrew.academy" \
  --validation-method DNS
```

### 8. Backup and Disaster Recovery

#### DynamoDB Backup
```bash
# Enable point-in-time recovery
aws dynamodb put-backup-policy \
  --table-name cloudcrew-prod-users \
  --backup-policy BackupEnabled=true
```

#### S3 Cross-Region Replication
```json
{
  "Role": "arn:aws:iam::ACCOUNT-ID:role/replication-role",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "Filter": {"Prefix": "course-content/"},
      "Destination": {
        "Bucket": "arn:aws:s3:::cloudcrew-backup-bucket",
        "StorageClass": "STANDARD_IA"
      }
    }
  ]
}
```

## Cost Optimization

### Estimated Monthly Costs (Production)

| Service | Usage | Cost |
|---------|-------|------|
| Lambda | 1M requests/month | $0.20 |
| API Gateway | 1M requests/month | $3.50 |
| DynamoDB | 5GB storage, 100K reads/writes | $15.00 |
| S3 | 100GB storage, 10GB transfer | $25.00 |
| CloudFront | 1TB transfer | $85.00 |
| Cognito | 10K MAU | $55.00 |
| **Total** | | **~$183.70/month** |

### Cost Optimization Tips
1. **Right-size Lambda functions** - Use ARM-based processors
2. **DynamoDB On-Demand** - Pay only for what you use
3. **S3 Intelligent Tiering** - Automatic cost optimization
4. **CloudFront Caching** - Reduce origin requests
5. **Reserved Capacity** - For predictable workloads

## Performance Optimization

### CloudFront Configuration
```yaml
# CDN settings for optimal performance
CacheBehaviors:
  - PathPattern: "/api/*"
    CachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    OriginRequestPolicyId: "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # CORS-S3Origin
  
  - PathPattern: "/videos/*"
    CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6" # Optimized
    Compress: true
    ViewerProtocolPolicy: "redirect-to-https"
```

### Lambda Optimization
```javascript
// Use Lambda layers for common dependencies
const AWS = require('aws-sdk');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Reuse connections outside handler
const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  // Handler code here
};
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API Gateway CORS configuration
   - Verify frontend domain in allowed origins

2. **Lambda Timeouts**
   - Increase timeout in serverless.yml
   - Optimize database queries
   - Use connection pooling

3. **High Costs**
   - Review CloudWatch logs for errors
   - Check for infinite loops in Lambda
   - Monitor DynamoDB read/write consumption

### Monitoring Commands
```bash
# Check API Gateway metrics
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway/"

# Monitor Lambda errors
aws logs filter-log-events \
  --log-group-name "/aws/lambda/cloudcrew-prod-api" \
  --filter-pattern "ERROR"

# DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedReadCapacityUnits \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

## Next Steps

1. **Set up staging environment** for testing
2. **Implement blue-green deployments** for zero-downtime updates
3. **Add comprehensive logging** with structured logs
4. **Set up performance monitoring** with AWS X-Ray
5. **Implement automated testing** in CI/CD pipeline

Remember: Start simple, monitor everything, and optimize based on real usage patterns!