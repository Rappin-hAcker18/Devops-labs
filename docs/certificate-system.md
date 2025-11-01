# Certificate System Documentation

## Overview
CloudCrew Academy's certificate system automatically generates and manages course completion certificates for students. Certificates are professionally designed, verifiable, and can be shared on LinkedIn, resumes, and portfolios.

## Features

### 1. **Automatic Certificate Generation**
- Generated automatically upon course completion
- Unique certificate number for each certificate
- Includes student name, course name, completion date, and skills acquired
- Professional design with CloudCrew Academy branding

### 2. **Certificate Verification**
- Public verification page at `/certificates/verify?id={certificateNumber}`
- Anyone can verify certificate authenticity
- Shows certificate details without exposing private information

### 3. **Certificate Management**
- View all certificates from user dashboard
- Download certificates as PDF
- Share verification links
- Display on profile

## Implementation Status

### ✅ Completed
- Certificate display page (`/certificates`)
- Certificate verification page (`/certificates/verify`)
- Dashboard integration with certificates section
- API endpoints for certificate CRUD operations
- Mock data structure and validation

### 🚧 To Be Implemented
1. **PDF Generation** (High Priority)
   - Use `jsPDF` or `react-pdf` to generate PDF certificates
   - Implement PDF download functionality
   - Store PDFs in S3 bucket for persistence

2. **DynamoDB Integration**
   - Create `cloudcrew-certificates-{env}` DynamoDB table
   - Schema:
     ```
     {
       id: string (partition key)
       userId: string (GSI)
       courseId: string
       certificateNumber: string (GSI for verification)
       status: string (issued | revoked)
       issuedAt: timestamp
       revokedAt?: timestamp
       metadata: object
     }
     ```

3. **S3 Storage**
   - Create S3 bucket: `cloudcrew-certificates-{env}`
   - Store generated PDFs
   - Generate signed URLs for secure downloads
   - Set up lifecycle policies for storage optimization

4. **Email Notifications**
   - Send email when certificate is generated
   - Include PDF attachment
   - Provide verification link

5. **LinkedIn Integration**
   - Add "Share on LinkedIn" button
   - Pre-fill LinkedIn certification form with certificate details

## API Endpoints

### GET /api/certificates
Get all certificates for authenticated user
```typescript
Response: {
  certificates: Certificate[]
}
```

### GET /api/certificates?courseId={courseId}
Get certificate for specific course
```typescript
Response: {
  certificate: Certificate
}
```

### GET /api/certificates?certificateNumber={number}
Verify certificate (public endpoint)
```typescript
Response: {
  isValid: boolean
  certificate?: {
    id: string
    courseName: string
    userName: string
    completionDate: string
    skills: string[]
  }
}
```

### POST /api/certificates
Generate new certificate
```typescript
Request: {
  userId: string
  courseId: string
  courseName: string
  userName: string
  userEmail: string
}

Response: {
  message: string
  certificate: Certificate
}
```

### DELETE /api/certificates?id={certificateId}
Revoke certificate (admin only)
```typescript
Response: {
  message: string
}
```

## Certificate Data Model

```typescript
interface Certificate {
  id: string;                    // Unique certificate ID
  userId: string;                // User who earned certificate
  courseId: string;              // Course identifier
  courseName: string;            // Full course name
  userName: string;              // Recipient name
  userEmail: string;             // Recipient email
  completionDate: string;        // ISO date string
  certificateNumber: string;     // Public verification number (e.g., CC-12345678)
  instructorName: string;        // Course instructor
  skills: string[];              // Skills demonstrated
  pdfUrl?: string;              // S3 URL to PDF (when generated)
  status: 'issued' | 'revoked';  // Certificate status
}
```

## Usage Flow

### Student Completes Course
1. Student completes all lessons in a course
2. System checks if all requirements are met (100% completion, passing quiz scores)
3. Certificate is automatically generated via API
4. Certificate is saved to DynamoDB
5. PDF is generated and uploaded to S3
6. Email notification is sent to student
7. Certificate appears in student dashboard

### Student Views Certificate
1. Navigate to `/certificates?courseId={courseId}` or click from dashboard
2. Certificate is displayed with full details
3. Options to download PDF or share verification link

### Third Party Verification
1. Employer/institution visits `/certificates/verify?id={certificateNumber}`
2. System looks up certificate by number
3. Displays certificate authenticity and details
4. Shows verification timestamp

## Security Considerations

### Certificate Number Format
- Format: `CC-{8-digit-timestamp}`
- Example: `CC-12345678`
- Unique and non-sequential for security
- Short enough to type manually if needed

### Verification Security
- Certificate numbers are public (safe to share)
- Personal information (email) not displayed on verification page
- Revoked certificates show as invalid
- Verification timestamp recorded for audit trail

### Access Control
- Only certificate owners can download PDFs
- Only admins can revoke certificates
- Verification page is public (read-only)

## Future Enhancements

### 1. Digital Badges
- Open Badges standard compliance
- Shareable badge images for social media
- Badge metadata with verification URL

### 2. Certificate Templates
- Multiple template designs
- Course-specific branding
- Instructor signatures

### 3. Certificate Expiration
- Optional expiration dates for time-sensitive certifications
- Renewal process for expired certificates

### 4. Batch Generation
- Admin tool to generate certificates for all students in a cohort
- CSV export of certificate numbers

### 5. Analytics
- Track certificate views and verifications
- Report on most verified courses
- Employer verification patterns

## Testing Checklist

### Manual Testing
- [ ] Generate certificate for completed course
- [ ] View certificate from dashboard
- [ ] Download certificate PDF
- [ ] Share verification link
- [ ] Verify certificate using public page
- [ ] Test with invalid certificate number
- [ ] Test certificate for each course type

### Integration Testing
- [ ] API endpoint responses
- [ ] DynamoDB read/write operations
- [ ] S3 upload/download
- [ ] Email delivery
- [ ] Error handling

### E2E Testing
```typescript
// tests/e2e/certificates.spec.ts
test('complete course and receive certificate', async ({ page }) => {
  // 1. Login as student
  // 2. Complete final lesson
  // 3. Verify certificate appears in dashboard
  // 4. Click to view certificate
  // 5. Verify all details are correct
  // 6. Test download button
});

test('verify certificate publicly', async ({ page }) => {
  // 1. Navigate to verification page with valid certificate number
  // 2. Verify certificate details are displayed
  // 3. Test with invalid certificate number
  // 4. Verify error message
});
```

## Deployment Steps

### 1. Create DynamoDB Table
```bash
aws dynamodb create-table \
  --table-name cloudcrew-certificates-prod \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=certificateNumber,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"UserIdIndex\",
        \"KeySchema\": [{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],
        \"Projection\": {\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      },
      {
        \"IndexName\": \"CertificateNumberIndex\",
        \"KeySchema\": [{\"AttributeName\":\"certificateNumber\",\"KeyType\":\"HASH\"}],
        \"Projection\": {\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      }
    ]" \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 2. Create S3 Bucket
```bash
aws s3 mb s3://cloudcrew-certificates-prod
aws s3api put-bucket-cors --bucket cloudcrew-certificates-prod --cors-configuration file://cors-config.json
```

### 3. Install PDF Generation Library
```bash
npm install jspdf @react-pdf/renderer
```

### 4. Configure Environment Variables
```env
CERTIFICATES_TABLE=cloudcrew-certificates-prod
CERTIFICATES_BUCKET=cloudcrew-certificates-prod
AWS_REGION=us-east-1
```

## Support

For questions or issues with the certificate system:
- Email: support@cloudcrew.academy
- Include certificate number if applicable
- Attach screenshots if verification fails
