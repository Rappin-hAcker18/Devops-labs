import { NextRequest, NextResponse } from 'next/server';

interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  userEmail: string;
  completionDate: string;
  certificateNumber: string;
  instructorName: string;
  skills: string[];
  pdfUrl?: string;
}

// Mock data - in production, this would query DynamoDB
const mockCertificates: Certificate[] = [
  {
    id: 'cert-001',
    userId: 'user-123',
    courseId: 'aws-fundamentals',
    courseName: 'AWS Fundamentals for Beginners',
    userName: 'John Doe',
    userEmail: 'big_head_13@proton.me',
    completionDate: new Date('2024-10-15').toISOString(),
    certificateNumber: 'CC-12345678',
    instructorName: 'Alex Rodriguez',
    skills: ['AWS EC2', 'S3 Storage', 'IAM Security', 'Cloud Architecture']
  }
];

// GET /api/certificates - Get all certificates for authenticated user
// GET /api/certificates?courseId=aws-fundamentals - Get certificate for specific course
// GET /api/certificates?certificateNumber=CC-12345678 - Verify certificate
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const certificateNumber = searchParams.get('certificateNumber');
    const userId = searchParams.get('userId'); // In production, get from auth token

    // Verify certificate by number (public endpoint)
    if (certificateNumber) {
      const certificate = mockCertificates.find(
        cert => cert.certificateNumber === certificateNumber
      );

      if (!certificate) {
        return NextResponse.json(
          { error: 'Certificate not found' },
          { status: 404 }
        );
      }

      // Return public certificate info for verification
      return NextResponse.json({
        isValid: true,
        certificate: {
          id: certificate.id,
          courseName: certificate.courseName,
          userName: certificate.userName,
          completionDate: certificate.completionDate,
          certificateNumber: certificate.certificateNumber,
          skills: certificate.skills
        }
      });
    }

    // Get user's certificates (requires authentication)
    // In production, verify JWT token and get userId from it
    const userCertificates = mockCertificates.filter(
      cert => userId ? cert.userId === userId : true
    );

    // Filter by courseId if provided
    if (courseId) {
      const certificate = userCertificates.find(cert => cert.courseId === courseId);
      if (!certificate) {
        return NextResponse.json(
          { error: 'Certificate not found for this course' },
          { status: 404 }
        );
      }
      return NextResponse.json({ certificate });
    }

    return NextResponse.json({ certificates: userCertificates });

  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Generate new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, courseName, userName, userEmail } = body;

    // Validation
    if (!userId || !courseId || !courseName || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCert = mockCertificates.find(
      cert => cert.userId === userId && cert.courseId === courseId
    );

    if (existingCert) {
      return NextResponse.json(
        { 
          message: 'Certificate already exists',
          certificate: existingCert 
        },
        { status: 200 }
      );
    }

    // Get course skills
    const courseSkills: Record<string, string[]> = {
      'aws-fundamentals': ['AWS EC2', 'S3 Storage', 'IAM Security', 'Cloud Architecture'],
      'serverless-architecture': ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Serverless Framework'],
      'cloud-security': ['Cloud Security', 'DevOps', 'Infrastructure as Code', 'CI/CD Pipelines']
    };

    // Generate new certificate
    const newCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      userId,
      courseId,
      courseName,
      userName,
      userEmail,
      completionDate: new Date().toISOString(),
      certificateNumber: `CC-${Date.now().toString().slice(-8)}`,
      instructorName: 'Alex Rodriguez',
      skills: courseSkills[courseId] || ['Cloud Engineering']
    };

    // In production:
    // 1. Save to DynamoDB certificates table
    // 2. Generate PDF using jsPDF or puppeteer
    // 3. Upload PDF to S3
    // 4. Store S3 URL in certificate record
    // 5. Send email with certificate

    mockCertificates.push(newCertificate);

    return NextResponse.json({
      message: 'Certificate generated successfully',
      certificate: newCertificate
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

// DELETE /api/certificates/:id - Revoke certificate (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');

    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Verify admin role from auth token
    // 2. Update certificate status in DynamoDB to 'revoked'
    // 3. Log revocation reason and timestamp

    const index = mockCertificates.findIndex(cert => cert.id === certificateId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    mockCertificates.splice(index, 1);

    return NextResponse.json({
      message: 'Certificate revoked successfully'
    });

  } catch (error) {
    console.error('Error revoking certificate:', error);
    return NextResponse.json(
      { error: 'Failed to revoke certificate' },
      { status: 500 }
    );
  }
}
