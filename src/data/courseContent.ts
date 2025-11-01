/**
 * Real Course Content Data
 * Comprehensive learning materials for CloudCrew Academy
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'lab' | 'interactive' | 'article' | 'quiz';
  duration: string;
  content: string;
  videoId?: string; // ID of video in S3/CloudFront
  courseId?: string; // Course this lesson belongs to
  videoUrl?: string; // Legacy - will be replaced by CloudFront URLs
  thumbnail?: string;
  labInstructions?: string;
  resources?: Resource[];
  quiz?: Quiz;
  completed: boolean;
  unlocked: boolean;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'code' | 'template' | 'cheatsheet';
  url: string;
  size: string;
}

export interface Quiz {
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code-completion';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  project?: {
    title: string;
    description: string;
    requirements: string[];
    deliverables: string[];
  };
}

// AWS Fundamentals Course Content
export const awsFundamentalsContent: Module[] = [
  {
    id: 1,
    title: "Cloud Computing Foundations",
    description: "Master the fundamentals of cloud computing and discover why it's revolutionizing how we build and deploy applications.",
    duration: "3 hours",
    lessons: [
      {
        id: "lesson-1-1",
        title: "What is Cloud Computing?",
        description: "Understand the core concepts of cloud computing and how it differs from traditional on-premises infrastructure.",
        type: "video",
        duration: "15 min",
        content: `
# What is Cloud Computing?

## Learning Objectives
- Define cloud computing and its key characteristics
- Understand the difference between on-premises and cloud infrastructure
- Identify the main cloud service models (IaaS, PaaS, SaaS)
- Recognize the business benefits of cloud adoption

## Key Concepts

### Definition
Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

### Essential Characteristics
1. **On-demand self-service** - Provision resources automatically without human interaction
2. **Broad network access** - Available over the network through standard platforms
3. **Resource pooling** - Multi-tenant model with location independence
4. **Rapid elasticity** - Scale up or down quickly based on demand
5. **Measured service** - Pay only for what you use

### Service Models
- **IaaS** (Infrastructure as a Service) - Virtual machines, storage, networks
- **PaaS** (Platform as a Service) - Development platforms and tools
- **SaaS** (Software as a Service) - Complete applications delivered over the web
        `,
        videoId: "aws-fundamentals/1761899619938-lizzo_mixdown.mp4",
        courseId: "aws-fundamentals",
        videoUrl: "/videos/aws-fundamentals/cloud-computing-intro.mp4",
        thumbnail: "/lessons/cloud-intro-thumb.svg",
        resources: [
          {
            id: "res-1-1-1",
            name: "Cloud Computing Cheat Sheet",
            type: "cheatsheet",
            url: "/resources/cloud-computing-cheatsheet.pdf",
            size: "2.3 MB"
          },
          {
            id: "res-1-1-2",
            name: "Service Models Comparison",
            type: "pdf",
            url: "/resources/service-models-guide.pdf",
            size: "1.8 MB"
          }
        ],
        completed: false,
        unlocked: true
      },
      {
        id: "lesson-1-2",
        title: "AWS Global Infrastructure",
        description: "Explore AWS's massive global infrastructure and learn how it enables worldwide application deployment.",
        type: "interactive",
        duration: "20 min",
        content: `
# AWS Global Infrastructure

## Interactive Learning Experience
Explore AWS's global infrastructure through our interactive map and understand how data centers, availability zones, and regions work together.

## Key Components

### Regions
AWS has **33 Regions** worldwide, each containing multiple data centers. Regions are:
- Geographically isolated
- Connected via high-speed private network
- Enable data residency compliance
- Provide disaster recovery options

### Availability Zones (AZs)
Each region contains **2-6 Availability Zones**:
- Physically separate data centers
- Connected with low-latency networking
- Enable high availability architecture
- Isolated from failures in other AZs

### Edge Locations
**400+ Edge Locations** globally for:
- Content delivery (CloudFront CDN)
- Reduced latency for end users
- DDoS protection (AWS Shield)
- Real-time applications

## Hands-On Activity
Use our interactive tool to:
1. Select your optimal AWS region
2. Design a multi-AZ architecture
3. Calculate latency to different regions
4. Plan a global deployment strategy
        `,
        resources: [
          {
            id: "res-1-2-1",
            name: "AWS Regions and AZs Map",
            type: "pdf",
            url: "/resources/aws-global-infrastructure-map.pdf",
            size: "3.1 MB"
          },
          {
            id: "res-1-2-2",
            name: "Latency Calculator Tool",
            type: "template",
            url: "/tools/latency-calculator.html",
            size: "156 KB"
          }
        ],
        completed: false,
        unlocked: true
      },
      {
        id: "lesson-1-3",
        title: "AWS Account Setup & Security",
        description: "Set up your AWS account with proper security configurations and best practices from day one.",
        type: "lab",
        duration: "45 min",
        content: `
# AWS Account Setup Lab

## Lab Objectives
- Create and secure your AWS account
- Set up Multi-Factor Authentication (MFA)
- Configure billing alerts
- Create IAM users and policies
- Understand the AWS Free Tier

## Prerequisites
- Valid email address
- Credit/debit card for verification
- Mobile device for MFA setup

## Step-by-Step Instructions

### Part 1: Account Creation (10 min)
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Enter account details and contact information
4. Verify your identity with phone/SMS
5. Choose Basic support plan (free)

### Part 2: Security Configuration (20 min)
1. **Enable MFA for Root Account**
   - Go to IAM Console → Security Credentials
   - Add MFA device (virtual app recommended)
   - Scan QR code with Google Authenticator or Authy

2. **Create IAM Admin User**
   - Navigate to IAM → Users → Add User
   - Username: admin-[your-name]
   - Access type: Programmatic and Console
   - Attach AdministratorAccess policy
   - Download credentials CSV file

3. **Set Account Alias**
   - IAM → Account Alias → Create
   - Choose a memorable alias for login

### Part 3: Billing & Monitoring (15 min)
1. **Set Up Billing Alerts**
   - Billing Console → Preferences
   - Enable billing alerts
   - Create CloudWatch alarm for $10 threshold

2. **Explore Free Tier**
   - Review Free Tier offerings
   - Set up Free Tier usage alerts
   - Understand service limitations
        `,
        labInstructions: `
# Lab Environment Setup

## Required Tools
- Web browser (Chrome/Firefox recommended)
- Mobile authenticator app
- Text editor for storing credentials

## Lab Duration: 45 minutes

## Deliverables
- Configured AWS account with MFA
- IAM admin user created
- Billing alerts configured
- Free Tier monitoring enabled

## Success Criteria
- [ ] Root account secured with MFA
- [ ] IAM admin user can log in
- [ ] Billing alert configured
- [ ] Account alias set
- [ ] Free Tier dashboard accessible

## Troubleshooting
Common issues and solutions:
- Credit card verification failed → Try different card
- MFA not working → Check time sync on device
- IAM user can't access services → Verify policy attachment
        `,
        resources: [
          {
            id: "res-1-3-1",
            name: "AWS Security Checklist",
            type: "cheatsheet",
            url: "/resources/aws-security-checklist.pdf",
            size: "1.5 MB"
          },
          {
            id: "res-1-3-2",
            name: "IAM Policy Templates",
            type: "code",
            url: "/resources/iam-policy-templates.json",
            size: "45 KB"
          }
        ],
        completed: false,
        unlocked: true
      },
      {
        id: "lesson-1-4",
        title: "AWS Management Console Tour",
        description: "Navigate the AWS Management Console like a pro and discover essential tools for cloud management.",
        type: "video",
        duration: "25 min",
        content: `
# AWS Management Console Mastery

## Console Overview
The AWS Management Console is your gateway to managing AWS services. This guided tour will help you navigate efficiently and discover powerful productivity features.

## Key Areas

### Navigation Bar
- **Services menu** - Access all AWS services
- **Search** - Quick service and feature lookup
- **Resource Groups** - Organize related resources
- **Account dropdown** - Switch roles and regions

### Dashboard Widgets
- **Service Health** - Real-time status updates
- **Cost and Usage** - Spending overview
- **Recently Visited** - Quick access to services
- **Favorites** - Pin frequently used services

### Console Features
- **CloudShell** - Browser-based CLI access
- **Resource Groups** - Logical resource organization
- **Tag Editor** - Bulk resource tagging
- **Config** - Resource compliance monitoring

## Pro Tips for Urban Professionals
1. **Mobile-First Approach** - Use AWS mobile app for monitoring
2. **Bookmark Key URLs** - Direct service links for efficiency
3. **Customize Dashboard** - Focus on services you use most
4. **Learn Keyboard Shortcuts** - Speed up navigation
5. **Use CloudShell** - No need to install AWS CLI locally

## Hands-On Walkthrough
Follow along as we explore:
- Service navigation strategies
- Setting up your custom dashboard
- Using search and filters effectively
- Mobile app integration
- Console customization options
        `,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnail: "/lessons/console-tour-thumb.jpg",
        resources: [
          {
            id: "res-1-4-1",
            name: "Console Navigation Shortcuts",
            type: "cheatsheet",
            url: "/resources/console-shortcuts.pdf",
            size: "980 KB"
          },
          {
            id: "res-1-4-2",
            name: "AWS Mobile App Guide",
            type: "pdf",
            url: "/resources/mobile-app-guide.pdf",
            size: "2.7 MB"
          }
        ],
        completed: false,
        unlocked: false
      },
      {
        id: "lesson-1-5",
        title: "Module 1 Knowledge Check",
        description: "Test your understanding of cloud computing fundamentals and AWS basics.",
        type: "quiz",
        duration: "15 min",
        content: "Assessment of key concepts from Module 1",
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: "q1-1",
              question: "Which of the following is NOT one of the five essential characteristics of cloud computing?",
              type: "multiple-choice",
              options: [
                "On-demand self-service",
                "Broad network access",
                "Physical hardware ownership",
                "Measured service"
              ],
              correctAnswer: 2,
              explanation: "Physical hardware ownership is characteristic of on-premises infrastructure, not cloud computing. Cloud services are accessed remotely without owning the underlying hardware."
            },
            {
              id: "q1-2",
              question: "What is the minimum number of Availability Zones in an AWS Region?",
              type: "multiple-choice",
              options: ["1", "2", "3", "6"],
              correctAnswer: 1,
              explanation: "AWS Regions have a minimum of 2 Availability Zones, though most have 3 or more. This ensures high availability and fault tolerance."
            },
            {
              id: "q1-3",
              question: "True or False: Edge Locations are only used for content delivery (CloudFront).",
              type: "true-false",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation: "False. While CloudFront is a major use case, Edge Locations also support AWS Shield for DDoS protection, AWS Global Accelerator, and other services."
            },
            {
              id: "q1-4",
              question: "Which service model provides the most control over the underlying infrastructure?",
              type: "multiple-choice",
              options: ["SaaS", "PaaS", "IaaS", "FaaS"],
              correctAnswer: 2,
              explanation: "Infrastructure as a Service (IaaS) provides virtual machines, storage, and networking, giving you the most control over the underlying infrastructure."
            },
            {
              id: "q1-5",
              question: "What should be your first security step after creating a new AWS account?",
              type: "multiple-choice",
              options: [
                "Create IAM users",
                "Enable MFA on root account",
                "Set up billing alerts",
                "Choose a region"
              ],
              correctAnswer: 1,
              explanation: "Enabling MFA on the root account should be the first security step to protect your account from unauthorized access."
            }
          ]
        },
        completed: false,
        unlocked: false
      }
    ],
    project: {
      title: "Cloud Strategy Assessment",
      description: "Analyze a fictional company's IT infrastructure and propose a cloud migration strategy using AWS services.",
      requirements: [
        "Review the provided company case study",
        "Identify current pain points and inefficiencies",
        "Recommend appropriate AWS services and architecture",
        "Estimate costs and migration timeline",
        "Present security and compliance considerations"
      ],
      deliverables: [
        "Written assessment report (2-3 pages)",
        "AWS architecture diagram",
        "Cost estimation spreadsheet",
        "Migration roadmap timeline"
      ]
    }
  },
  {
    id: 2,
    title: "EC2 - Virtual Servers in the Cloud",
    description: "Master Amazon EC2 to launch, configure, and manage virtual servers that power modern applications.",
    duration: "4 hours",
    lessons: [
      {
        id: "lesson-2-1",
        title: "EC2 Fundamentals",
        description: "Understand EC2 instances, instance types, and the core concepts of virtual computing in AWS.",
        type: "video",
        duration: "20 min",
        content: `
# Amazon EC2 Fundamentals

## What is Amazon EC2?
Amazon Elastic Compute Cloud (EC2) provides secure, resizable compute capacity in the cloud. It's designed to make web-scale cloud computing easier for developers and system administrators.

## Key Concepts

### Instance Types
EC2 offers over 200 instance types optimized for different use cases:

**General Purpose (T3, T4g, M5, M6i)**
- Balanced CPU, memory, networking
- Web servers, microservices
- Development environments

**Compute Optimized (C5, C6i, C7g)**
- High-performance processors
- Scientific computing, gaming
- High-performance web servers

**Memory Optimized (R5, R6i, X1)**
- Fast performance for large datasets
- In-memory databases
- Real-time big data analytics

**Storage Optimized (I3, D3, H1)**
- High sequential read/write
- Distributed file systems
- Data warehousing applications

### Pricing Models
1. **On-Demand** - Pay per hour/second with no long-term commitments
2. **Reserved Instances** - Up to 75% savings with 1-3 year terms
3. **Spot Instances** - Up to 90% savings for fault-tolerant workloads
4. **Dedicated Hosts** - Physical servers for compliance requirements

## Real-World Use Cases
- **Startup MVP**: t3.micro for development and testing
- **E-commerce Site**: m5.large with Auto Scaling for traffic spikes
- **Data Processing**: c5.xlarge for batch processing jobs
- **Gaming Server**: c5n.large for low-latency multiplayer games

## Urban Professional Perspective
Learn how EC2 powers the apps you use daily:
- Instagram photo processing
- Uber ride matching algorithms
- Netflix video encoding
- Spotify recommendation engines
        `,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "/lessons/ec2-fundamentals-thumb.jpg",
        resources: [
          {
            id: "res-2-1-1",
            name: "EC2 Instance Types Guide",
            type: "cheatsheet",
            url: "/resources/ec2-instance-types.pdf",
            size: "3.2 MB"
          },
          {
            id: "res-2-1-2",
            name: "Cost Calculator Template",
            type: "template",
            url: "/resources/ec2-cost-calculator.xlsx",
            size: "2.1 MB"
          }
        ],
        completed: false,
        unlocked: false
      },
      {
        id: "lesson-2-2",
        title: "Launch Your First EC2 Instance",
        description: "Step-by-step lab to launch, configure, and connect to your first EC2 instance.",
        type: "lab",
        duration: "60 min",
        content: `
# Launch Your First EC2 Instance Lab

## Lab Overview
In this hands-on lab, you'll launch your first EC2 instance, configure security groups, connect via SSH, and install a simple web server.

## Learning Objectives
- Launch an EC2 instance using the AWS Management Console
- Configure security groups for web and SSH access
- Connect to instances using SSH and Session Manager
- Install and configure a web server
- Understand instance metadata and user data

## Prerequisites
- AWS account with administrative access
- Basic command line knowledge
- SSH client (Windows: PuTTY, Mac/Linux: built-in)

## Lab Instructions

### Step 1: Launch EC2 Instance (15 min)
1. **Navigate to EC2 Console**
   - AWS Console → Services → EC2
   - Choose your region (recommend us-east-1 for beginners)

2. **Launch Instance Wizard**
   - Click "Launch Instance"
   - Name: "my-first-web-server"
   - Application and OS Images: Amazon Linux 2023 AMI
   - Instance type: t3.micro (Free Tier eligible)
   - Key pair: Create new key pair named "my-ec2-key"
   - Download and save the .pem file securely

3. **Network Settings**
   - VPC: Default VPC
   - Subnet: Default subnet
   - Auto-assign public IP: Enable
   - Security group: Create new
     - Name: web-server-sg
     - Rules: SSH (22) from My IP, HTTP (80) from Anywhere

### Step 2: Connect to Your Instance (15 min)
1. **Wait for Instance Launch**
   - Instance state: Running
   - Status checks: 2/2 passed
   - Note the public IPv4 address

2. **SSH Connection (Linux/Mac)**
   \`\`\`bash
   chmod 400 my-ec2-key.pem
   ssh -i "my-ec2-key.pem" ec2-user@your-public-ip
   \`\`\`

3. **Alternative: Session Manager**
   - Instance → Actions → Connect
   - Session Manager tab → Connect
   - Browser-based terminal access

### Step 3: Install Web Server (20 min)
1. **Update System**
   \`\`\`bash
   sudo yum update -y
   \`\`\`

2. **Install Apache Web Server**
   \`\`\`bash
   sudo yum install -y httpd
   sudo systemctl start httpd
   sudo systemctl enable httpd
   \`\`\`

3. **Create Custom Web Page**
   \`\`\`bash
   echo "<h1>Hello from \$(hostname -f)</h1>" | sudo tee /var/www/html/index.html
   echo "<p>This server is running on Amazon EC2!</p>" | sudo tee -a /var/www/html/index.html
   echo "<p>Server details:</p>" | sudo tee -a /var/www/html/index.html
   echo "<ul>" | sudo tee -a /var/www/html/index.html
   echo "<li>Instance ID: \$(curl -s http://169.254.169.254/latest/meta-data/instance-id)</li>" | sudo tee -a /var/www/html/index.html
   echo "<li>Instance Type: \$(curl -s http://169.254.169.254/latest/meta-data/instance-type)</li>" | sudo tee -a /var/www/html/index.html
   echo "<li>Availability Zone: \$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)</li>" | sudo tee -a /var/www/html/index.html
   echo "</ul>" | sudo tee -a /var/www/html/index.html
   \`\`\`

4. **Test Web Server**
   - Open browser and navigate to http://your-public-ip
   - You should see your custom webpage

### Step 4: Explore Instance Features (10 min)
1. **Instance Metadata**
   Access instance metadata using curl commands:
   - Get instance metadata: curl http://169.254.169.254/latest/meta-data/
   - Get user data: curl http://169.254.169.254/latest/user-data/

2. **System Information**
   Check system resources:
   - Memory usage: free -h
   - Disk usage: df -h
   - Running processes: top

3. **AWS CLI (pre-installed)**
   Use AWS CLI: aws ec2 describe-instances --region us-east-1

## Lab Cleanup
**Important: Always clean up resources to avoid charges!**
1. EC2 Console → Instances → Select your instance
2. Instance State → Terminate Instance
3. Confirm termination
4. Delete security group if no longer needed
        `,
        labInstructions: `
# Lab Environment & Requirements

## Time Required
60 minutes (can be split into sessions)

## AWS Resources Used
- 1 x EC2 t3.micro instance (Free Tier eligible)
- Default VPC and security group
- Elastic IP (optional)

## Tools Needed
- SSH client or web browser for Session Manager
- Text editor for key file management
- Calculator for cost estimation

## Success Criteria
- [ ] Instance launched successfully
- [ ] SSH/Session Manager connection established
- [ ] Web server installed and running
- [ ] Custom webpage displays correctly
- [ ] Instance metadata retrieved
- [ ] Resources cleaned up

## Troubleshooting Guide
- **Can't connect via SSH**: Check security group rules and key file permissions
- **Web page not loading**: Verify security group allows port 80 from 0.0.0.0/0
- **Permission denied**: Ensure correct username (ec2-user for Amazon Linux)
- **Instance won't start**: Check service limits in your region

## Extended Challenges
For additional practice:
1. Install PHP and create a dynamic webpage
2. Set up SSL certificate with Let's Encrypt
3. Configure automatic backups with snapshots
4. Implement monitoring with CloudWatch
        `,
        resources: [
          {
            id: "res-2-2-1",
            name: "SSH Connection Guide",
            type: "pdf",
            url: "/resources/ssh-connection-guide.pdf",
            size: "1.8 MB"
          },
          {
            id: "res-2-2-2",
            name: "Linux Commands Cheat Sheet",
            type: "cheatsheet",
            url: "/resources/linux-commands.pdf",
            size: "2.4 MB"
          },
          {
            id: "res-2-2-3",
            name: "Apache Configuration Templates",
            type: "code",
            url: "/resources/apache-configs.zip",
            size: "856 KB"
          }
        ],
        completed: false,
        unlocked: false
      }
    ]
  }
];

// Serverless Architecture Course Content
export const serverlessContent: Module[] = [
  {
    id: 1,
    title: "Serverless Fundamentals",
    description: "Understanding serverless computing and its benefits for modern applications",
    duration: "3 hours",
    lessons: [
      {
        id: "serverless-1-1",
        title: "What is Serverless?",
        description: "Explore the serverless paradigm and how it's changing application development.",
        type: "video",
        duration: "20 min",
        content: `
# Understanding Serverless Computing

## What is Serverless?
Serverless computing is a cloud execution model where the cloud provider dynamically manages the allocation and provisioning of servers. Despite the name, servers are still involved, but developers don't need to manage them.

## Key Characteristics
1. **No Server Management** - Focus on code, not infrastructure
2. **Automatic Scaling** - Scale from zero to thousands of requests
3. **Pay Per Use** - Only pay when your code runs
4. **Event-Driven** - Triggered by events (HTTP requests, file uploads, etc.)
5. **Stateless** - Each execution is independent

## Serverless vs Traditional Architecture

### Traditional (Monolithic)
- Always running servers
- Fixed capacity planning
- Manual scaling
- Infrastructure management overhead

### Serverless (Event-Driven)
- Code runs on-demand
- Automatic scaling
- No idle costs
- Focus on business logic

## AWS Serverless Services
- **AWS Lambda** - Compute (functions)
- **API Gateway** - HTTP APIs
- **DynamoDB** - NoSQL database
- **S3** - Storage and static hosting
- **EventBridge** - Event routing
- **Step Functions** - Workflow orchestration

## Real-World Examples
- **Image Processing**: Automatic thumbnail generation when photos are uploaded
- **API Backends**: RESTful APIs that scale automatically
- **Data Processing**: ETL pipelines triggered by file uploads
- **Chat Bots**: Natural language processing for customer support
- **IoT Processing**: Real-time processing of sensor data

## Benefits for Urban Professionals
- **Faster Time to Market** - Deploy features in minutes, not days
- **Cost Effective** - Perfect for startups and side projects
- **Global Scale** - Automatically available worldwide
- **No Maintenance** - Focus on building, not maintaining servers
        `,
        videoId: "serverless-development/1761452366972-RNN Ep1.mpeg",
        courseId: "serverless-architecture",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "/lessons/serverless-intro-thumb.jpg",
        resources: [
          {
            id: "serverless-res-1-1",
            name: "Serverless Architecture Patterns",
            type: "pdf",
            url: "/resources/serverless-patterns.pdf",
            size: "4.2 MB"
          },
          {
            id: "serverless-res-1-2",
            name: "Cost Comparison Calculator",
            type: "template",
            url: "/resources/serverless-cost-calc.xlsx",
            size: "1.9 MB"
          }
        ],
        completed: false,
        unlocked: true
      }
    ]
  }
];

// Export course mapping
export const courseContentMap = {
  'aws-fundamentals': awsFundamentalsContent,
  'serverless-architecture': serverlessContent,
  'cloud-security': [] // Placeholder for future content
};