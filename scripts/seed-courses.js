import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDb = DynamoDBDocumentClient.from(client);

// Sample course data for CloudCrew Academy
const sampleCourses = [
  {
    courseId: 'aws-fundamentals',
    title: 'AWS Cloud Fundamentals',
    description: 'Master the basics of AWS cloud computing designed specifically for urban professionals looking to break into tech careers.',
    difficulty: 'Beginner',
    duration: '4 weeks',
    tier: 'free',
    modules: 12,
    estimatedHours: 20,
    thumbnail: '/images/courses/aws-fundamentals.jpg',
    skills: ['AWS Console', 'EC2', 'S3', 'IAM', 'VPC'],
    learningOutcomes: [
      'Navigate AWS Console confidently',
      'Launch and manage EC2 instances',
      'Store and manage files in S3',
      'Understand cloud security basics',
      'Build your first web application on AWS'
    ],
    modules_detail: [
      {
        moduleId: 1,
        title: 'Getting Started with AWS',
        lessons: [
          { id: 1, title: 'What is Cloud Computing?', duration: '8 mins', type: 'video' },
          { id: 2, title: 'Creating Your AWS Account', duration: '5 mins', type: 'hands-on' },
          { id: 3, title: 'AWS Console Navigation', duration: '10 mins', type: 'interactive' }
        ]
      },
      {
        moduleId: 2,
        title: 'Core AWS Services',
        lessons: [
          { id: 4, title: 'Introduction to EC2', duration: '12 mins', type: 'video' },
          { id: 5, title: 'Launching Your First Instance', duration: '15 mins', type: 'hands-on' },
          { id: 6, title: 'Understanding S3 Storage', duration: '10 mins', type: 'video' }
        ]
      }
    ],
    pricing: 0,
    certificateAvailable: true,
    prerequisites: 'No prior experience required',
    targetAudience: 'Urban professionals, career changers, tech beginners',
    instructor: {
      name: 'CloudCrew Academy',
      bio: 'Expert instructors from Fortune 500 companies',
      experience: '10+ years in cloud engineering'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    enrollmentCount: 1250,
    averageRating: 4.8,
    reviews: 156
  },
  {
    courseId: 'serverless-development',
    title: 'Serverless Development with AWS Lambda',
    description: 'Build scalable, cost-effective applications without managing servers. Perfect for developers ready to level up their skills.',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    tier: 'standard',
    modules: 18,
    estimatedHours: 35,
    thumbnail: '/images/courses/serverless-dev.jpg',
    skills: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Node.js', 'Python'],
    learningOutcomes: [
      'Build serverless APIs with Lambda',
      'Design scalable database solutions',
      'Implement authentication and authorization',
      'Deploy production-ready applications',
      'Optimize costs and performance'
    ],
    modules_detail: [
      {
        moduleId: 1,
        title: 'Serverless Architecture Fundamentals',
        lessons: [
          { id: 1, title: 'Introduction to Serverless', duration: '10 mins', type: 'video' },
          { id: 2, title: 'AWS Lambda Deep Dive', duration: '15 mins', type: 'video' },
          { id: 3, title: 'Your First Lambda Function', duration: '20 mins', type: 'hands-on' }
        ]
      },
      {
        moduleId: 2,
        title: 'Building APIs with API Gateway',
        lessons: [
          { id: 4, title: 'REST API Concepts', duration: '12 mins', type: 'video' },
          { id: 5, title: 'Creating Your First API', duration: '25 mins', type: 'hands-on' },
          { id: 6, title: 'Advanced API Features', duration: '18 mins', type: 'interactive' }
        ]
      }
    ],
    pricing: 297,
    certificateAvailable: true,
    prerequisites: 'Basic programming knowledge (JavaScript or Python)',
    targetAudience: 'Developers, software engineers, tech professionals',
    instructor: {
      name: 'Senior Cloud Architect Team',
      bio: 'AWS-certified architects from leading tech companies',
      experience: '15+ years in serverless architecture'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    enrollmentCount: 890,
    averageRating: 4.9,
    reviews: 124
  },
  {
    courseId: 'cloud-architecture',
    title: 'Cloud Architecture & DevOps Mastery',
    description: 'Design and deploy enterprise-grade cloud solutions. The comprehensive program for serious cloud professionals.',
    difficulty: 'Advanced',
    duration: '8 weeks',
    tier: 'premium',
    modules: 24,
    estimatedHours: 60,
    thumbnail: '/images/courses/cloud-architecture.jpg',
    skills: ['AWS Architecture', 'DevOps', 'Kubernetes', 'Terraform', 'CI/CD'],
    learningOutcomes: [
      'Design highly available architectures',
      'Implement Infrastructure as Code',
      'Build automated CI/CD pipelines',
      'Master container orchestration',
      'Prepare for AWS Solutions Architect certification'
    ],
    modules_detail: [
      {
        moduleId: 1,
        title: 'Enterprise Architecture Principles',
        lessons: [
          { id: 1, title: 'Well-Architected Framework', duration: '15 mins', type: 'video' },
          { id: 2, title: 'High Availability Design', duration: '20 mins', type: 'video' },
          { id: 3, title: 'Architecture Workshop', duration: '45 mins', type: 'hands-on' }
        ]
      },
      {
        moduleId: 2,
        title: 'Infrastructure as Code',
        lessons: [
          { id: 4, title: 'Introduction to Terraform', duration: '18 mins', type: 'video' },
          { id: 5, title: 'Building Infrastructure', duration: '30 mins', type: 'hands-on' },
          { id: 6, title: 'Advanced Terraform Patterns', duration: '25 mins', type: 'interactive' }
        ]
      }
    ],
    pricing: 597,
    certificateAvailable: true,
    prerequisites: 'Intermediate AWS knowledge, programming experience',
    targetAudience: 'Senior developers, cloud engineers, DevOps professionals',
    instructor: {
      name: 'Principal Cloud Architects',
      bio: 'Former AWS and Google Cloud architects',
      experience: '20+ years in enterprise architecture'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    enrollmentCount: 445,
    averageRating: 4.9,
    reviews: 89,
    includes1on1Mentoring: true,
    careerServices: true,
    jobPlacementAssistance: true
  }
  ,
  {
    courseId: 'cloud-engineering-all-levels',
    title: 'Cloud Engineering (All Levels)',
    description: 'A complete path from fundamentals to advanced cloud engineering with hands-on AWS labs and projects.',
    difficulty: 'Beginner to Advanced',
    duration: '12 weeks',
    tier: 'standard',
    modules: 30,
    estimatedHours: 80,
    thumbnail: '/images/courses/cloud-engineering-all-levels.jpg',
    skills: ['AWS', 'Networking', 'Security', 'Serverless', 'IaC', 'CI/CD'],
    learningOutcomes: [
      'Understand core cloud concepts and AWS services',
      'Design secure, scalable architectures',
      'Build serverless APIs and event-driven systems',
      'Automate infrastructure with Terraform',
      'Implement CI/CD pipelines and observability'
    ],
    modules_detail: [
      {
        moduleId: 1,
        title: 'Foundations',
        lessons: [
          { id: 1, title: 'Cloud and AWS Basics', duration: '10 mins', type: 'video' },
          { id: 2, title: 'Identity & Access (IAM)', duration: '15 mins', type: 'video' },
          { id: 3, title: 'Hands-on: Launch Your First EC2', duration: '20 mins', type: 'hands-on' }
        ]
      },
      {
        moduleId: 2,
        title: 'Networking & Storage',
        lessons: [
          { id: 4, title: 'VPC, Subnets, and Security Groups', duration: '18 mins', type: 'video' },
          { id: 5, title: 'S3 Storage Deep Dive', duration: '16 mins', type: 'video' },
          { id: 6, title: 'Hands-on: Static Website on S3 + CloudFront', duration: '25 mins', type: 'hands-on' }
        ]
      },
      {
        moduleId: 3,
        title: 'Serverless & IaC',
        lessons: [
          { id: 7, title: 'Lambda, API Gateway, and Events', duration: '20 mins', type: 'video' },
          { id: 8, title: 'Intro to Terraform on AWS', duration: '18 mins', type: 'video' },
          { id: 9, title: 'Hands-on: Serverless API with Terraform', duration: '40 mins', type: 'hands-on' }
        ]
      }
    ],
    pricing: 49,
    certificateAvailable: true,
    prerequisites: 'No prior experience required (guided path)',
    targetAudience: 'Young adults, adults, and career-changers seeking cloud roles',
    instructor: {
      name: 'CloudCrew Instructors',
      bio: 'AWS-certified experts from industry',
      experience: '10+ years in cloud and DevOps'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    enrollmentCount: 0,
    averageRating: 0,
    reviews: 0
  }
];

// Function to seed the database
export async function seedCourses() {
  console.log('Starting to seed courses...');
  
  for (const course of sampleCourses) {
    try {
      const params = {
        TableName: 'cloudcrew-courses-dev',
        Item: course,
      };
      
      await dynamoDb.send(new PutCommand(params));
      console.log(`✅ Added course: ${course.title}`);
    } catch (error) {
      console.error(`❌ Error adding course ${course.title}:`, error);
    }
  }
  
  console.log('Course seeding completed!');
}

// Run the seeding
seedCourses().catch(console.error);
