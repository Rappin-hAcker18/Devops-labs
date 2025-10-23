# AWS Fundamentals Training Video Scripts
## Professional Cloud Engineering Education for Urban Communities

---

## Video 1: Introduction to Cloud Computing
**Duration: 15 minutes**
**Target Audience: Complete beginners**
**Recording Setup: Professional instructor at desk with multiple monitors showing AWS console**

### Video Script - Lesson 1.1

**[SCENE 1: Opening - Instructor Introduction (0:00-1:30)]**

*Instructor appears on camera - professional setting with AWS certifications visible on wall*

**INSTRUCTOR:** "Welcome to CloudCrew Academy. I'm [Name], a Senior Cloud Engineer with 8 years of experience helping companies migrate to the cloud. Today, we're starting your journey into cloud computing - a technology that's not just transforming businesses, but creating real economic opportunities in our communities.

Before we dive in, let me ask you this: What if I told you that companies like Netflix, Spotify, and even your local bank are running on computers they don't own? That's the power of cloud computing, and by the end of this course, you'll understand exactly how this works and how you can build a career in this $500 billion industry."

**[SCENE 2: What is Cloud Computing? (1:30-4:00)]**

*Screen share begins - shows clean presentation slides with real AWS interface*

**INSTRUCTOR:** "Let's start with the basics. Cloud computing is the delivery of computing services over the internet. But what does that actually mean?

*[Shows diagram of traditional vs cloud infrastructure]*

Imagine you want to start a restaurant. In the traditional model, you'd need to:
- Buy the building
- Install all the kitchen equipment  
- Hire maintenance staff
- Pay for utilities whether you're busy or not

That's like traditional IT infrastructure. Companies had to buy servers, hire IT staff, and pay for everything upfront.

*[Transitions to cloud model diagram]*

Cloud computing is like using a food truck park. You rent space only when you need it, use shared utilities, and scale up during busy periods. You focus on cooking great food - not managing the infrastructure."

**[SCENE 3: Real-World Examples (4:00-6:30)]**

*Shows actual screenshots of major companies using AWS*

**INSTRUCTOR:** "Let me show you some companies you know that run on the cloud:

*[Shows Netflix AWS case study]*
Netflix streams 15 billion hours of content monthly - all running on Amazon Web Services. They don't own a single server.

*[Shows Airbnb architecture]*
Airbnb handles millions of bookings worldwide using cloud infrastructure that automatically scales up during peak travel seasons.

*[Shows local business example]*
Even small businesses in your neighborhood - that corner coffee shop taking mobile orders, the local gym with their app - they're likely using cloud services.

This isn't just about big tech companies. This is about every business that wants to compete in the digital economy."

**[SCENE 4: The Three Service Models (6:30-10:45)]**

*Shows clear visual representations of IaaS, PaaS, SaaS*

**INSTRUCTOR:** "Now, cloud computing comes in three main flavors. Think of these like different levels of service at a restaurant:

**Infrastructure as a Service (IaaS)**
*[Shows AWS EC2 console]*
This is like renting a kitchen with basic appliances. You get virtual machines, storage, and networking, but you install and manage everything else. AWS EC2 is a perfect example.

**Platform as a Service (PaaS)** 
*[Shows AWS Elastic Beanstalk interface]*
This is like a food truck - the kitchen is set up, utilities are connected, you just bring your recipes. You focus on your application code while the platform handles the infrastructure.

**Software as a Service (SaaS)**
*[Shows examples like Gmail, Salesforce]*
This is like ordering from DoorDash - the complete meal is delivered ready to consume. You use the software through your browser without managing anything."

**[SCENE 5: Economic Opportunities (10:45-13:15)]**

*Shows real job market data and salary information*

**INSTRUCTOR:** "Here's why this matters for your career and our communities:

*[Shows salary data]*
Entry-level cloud engineers in our metro area start at $65,000-75,000. With AWS certification, that jumps to $80,000-95,000. Senior cloud architects earn $120,000-150,000+.

*[Shows job growth statistics]*
Cloud computing jobs are growing 4x faster than traditional IT roles. Companies are desperately looking for skilled professionals.

*[Shows local success stories]*
Right here in our city, we've seen students land roles at:
- Local banks migrating to cloud
- Healthcare systems modernizing IT
- Startups building cloud-native applications
- Consulting firms serving enterprise clients

This isn't just about learning technology - it's about economic mobility and building generational wealth."

**[SCENE 6: Your Learning Path (13:15-15:00)]**

*Shows course roadmap and next steps*

**INSTRUCTOR:** "Here's what we're going to cover in this course:

**Week 1-2:** AWS Fundamentals - Core services, pricing, security basics
**Week 3-4:** Hands-on Labs - Build real applications using EC2, S3, RDS
**Week 5-6:** Advanced Topics - Auto-scaling, load balancing, monitoring
**Week 7-8:** Certification Prep - Practice exams, interview skills

Every lesson includes:
- Live demonstrations in real AWS environments
- Hands-on labs you can do with free tier accounts
- Real-world scenarios from actual client projects
- Career guidance and networking opportunities

In our next video, we'll create your first AWS account and explore the core services. You'll be surprised how quickly you can get productive.

Remember - every expert was once a beginner. Let's build your cloud career together."

**[SCENE 7: Call to Action (15:00)]**

**INSTRUCTOR:** "Ready to get started? Hit that next lesson button, and let's dive into AWS core services. And remember - we're building more than just technical skills. We're building careers, building wealth, and building stronger communities.

See you in the next video!"

---

## Video 2: AWS Core Services Deep Dive
**Duration: 22 minutes**
**Recording Setup: Split screen with instructor and live AWS console**

### Video Script - Lesson 1.2

**[SCENE 1: Welcome Back (0:00-1:00)]**

**INSTRUCTOR:** "Welcome back to CloudCrew Academy! In our last session, we covered what cloud computing is and why it matters for your career. Today, we're getting hands-on. I'm going to show you the core AWS services that power millions of applications worldwide.

We'll be working in a real AWS environment - the same console that engineers at Netflix, Airbnb, and Goldman Sachs use every day. By the end of this video, you'll understand the building blocks of the cloud."

**[SCENE 2: AWS Global Infrastructure (1:00-4:30)]**

*Screen shows AWS global infrastructure map*

**INSTRUCTOR:** "Before we dive into services, let's understand AWS's global reach. AWS operates in 31 geographic regions worldwide, with over 100 availability zones.

*[Zooms into US East region]*

Each region contains multiple availability zones - these are separate data centers designed to be isolated from failures. When you deploy applications, you can distribute them across multiple zones for high availability.

*[Shows network latency map]*

Why does this matter? If you're building an app for users in Atlanta, you'll deploy in the US East region for the lowest latency. Global customers? You can deploy worldwide with just a few clicks.

This is infrastructure that would cost millions to build yourself - available to you for pennies per hour."

**[SCENE 3: EC2 - Virtual Computers in the Cloud (4:30-8:45)]**

*Live demonstration in AWS EC2 console*

**INSTRUCTOR:** "Let's start with EC2 - Elastic Compute Cloud. This is your virtual computer in the cloud.

*[Navigates to EC2 dashboard]*

Watch as I launch a virtual server that would have taken weeks to procure in traditional IT:

*[Clicks 'Launch Instance']*

Step 1: Choose your operating system. We'll use Amazon Linux 2.
Step 2: Select instance size. t2.micro is free tier eligible - perfect for learning.
Step 3: Configure networking. AWS creates secure defaults.
Step 4: Storage. We'll add 20GB of SSD storage.
Step 5: Security groups - this is your firewall configuration.

*[Instance launches]*

In under 2 minutes, we have a running computer with:
- 1 virtual CPU
- 1GB RAM  
- 20GB SSD storage
- Public IP address
- Operating system ready to use

Cost? About $8.50 per month if you ran it 24/7. But with AWS, you only pay while it's running. Turn it off, you pay for storage only."

**[SCENE 4: S3 - Unlimited Storage (8:45-12:00)]**

*Demonstrates S3 console and features*

**INSTRUCTOR:** "Next, let's look at S3 - Simple Storage Service. This is where the internet keeps its stuff.

*[Opens S3 console]*

S3 stores objects in buckets. Think of buckets as folders, but they can hold unlimited amounts of data. Netflix stores all their video content here. Instagram stores all your photos here.

*[Creates a bucket live]*

Let me create a bucket called 'cloudcrew-demo-2025'. Notice I need a globally unique name - there are millions of S3 buckets worldwide.

*[Uploads a file]*

Now I'll upload a file. Watch the URL - this file is now accessible from anywhere in the world. S3 automatically replicates this across multiple data centers for durability.

*[Shows pricing calculator]*

Pricing is simple: $0.023 per GB per month. Your first 5GB are free for 12 months. Store 100GB of data? That's $2.30 per month. No upfront costs, no long-term contracts."

**[SCENE 5: RDS - Managed Databases (12:00-15:30)]**

*Demonstrates RDS setup and management*

**INSTRUCTOR:** "Databases are the heart of most applications. RDS - Relational Database Service - gives you production-ready databases without the headache of management.

*[Opens RDS console]*

RDS supports MySQL, PostgreSQL, Oracle, SQL Server, and more. Let me show you how easy it is to create a database that could handle thousands of users:

*[Clicks 'Create Database']*

Choose your engine - we'll use MySQL.
Select template - 'Free tier' for learning.
Set master username and password.
Choose instance size - db.t3.micro is free tier eligible.

*[Database creation starts]*

AWS is now provisioning a MySQL database with:
- Automatic backups
- Security patches
- Monitoring and alerting
- Multi-availability zone option for high availability

This is enterprise-grade database infrastructure that would normally require a full-time DBA. AWS manages it all for you."

**[SCENE 6: Putting It All Together (15:30-19:00)]**

*Shows architecture diagram being built in real-time*

**INSTRUCTOR:** "Let's see how these services work together in a real application:

*[Draws architecture on whiteboard or digital canvas]*

Web Application Architecture:
1. Users access your app through a web browser
2. Application runs on EC2 instances
3. User uploads (photos, documents) go to S3
4. Application data is stored in RDS database
5. CloudFront CDN delivers content globally

*[Shows actual running example]*

Here's a sample e-commerce site using this exact architecture:
- EC2 runs the web application
- S3 stores product images
- RDS stores customer orders and inventory
- Total monthly cost for 10,000 users: under $200

Compare that to building your own data center: easily $500,000+ upfront, plus ongoing maintenance."

**[SCENE 7: Security and Best Practices (19:00-21:00)]**

*Demonstrates IAM and security features*

**INSTRUCTOR:** "Security is built into everything on AWS. Let me show you IAM - Identity and Access Management:

*[Opens IAM console]*

IAM controls who can access what in your AWS account. You create users, groups, and roles with specific permissions.

*[Creates sample user]*

Best practices:
- Never share your root account credentials
- Create individual IAM users for team members
- Use groups to assign permissions
- Enable multi-factor authentication
- Follow the principle of least privilege

*[Shows security monitoring]*

AWS also provides CloudTrail for auditing - every action is logged. CloudWatch monitors your resources. GuardDuty detects threats automatically."

**[SCENE 8: Next Steps and Preview (21:00-22:00)]**

**INSTRUCTOR:** "We've covered the core building blocks:
- EC2 for compute
- S3 for storage  
- RDS for databases
- IAM for security

In our next session, we'll create your AWS account and build your first application using these services. You'll launch a web server, store files in S3, and set up a database - all in under an hour.

This is just the beginning. These same services power applications serving billions of users. You're learning the same tools used by senior engineers at Fortune 500 companies.

Ready to get hands-on? I'll see you in the next video where we set up your development environment!"

---

## Video 3: Hands-On Lab - Your First AWS Environment
**Duration: 45 minutes**
**Recording Setup: Screen recording with picture-in-picture instructor guidance**

### Video Script - Lesson 1.3

**[SCENE 1: Lab Overview (0:00-2:00)]**

**INSTRUCTOR:** "Welcome to your first hands-on AWS lab! This is where theory becomes practice. Today, you'll:

1. Create your AWS account safely and securely
2. Set up billing alerts to stay within free tier
3. Launch your first EC2 instance
4. Create an S3 bucket and upload files
5. Connect everything together

By the end of this lab, you'll have a working cloud environment that you built yourself. This is the same setup process used by startups and enterprises worldwide.

*[Shows final architecture diagram]*

Important note: Everything we build today stays within AWS Free Tier limits. You won't be charged anything if you follow along carefully."

**[SCENE 2: Account Creation and Security (2:00-12:00)]**

*Step-by-step screen recording of account setup*

**INSTRUCTOR:** "Let's start by creating your AWS account. Go to aws.amazon.com and click 'Create an AWS Account'.

*[Walks through each step]*

**Account Details:**
- Email: Use a dedicated email for AWS
- Account name: Something professional
- Password: Strong password with special characters

**Contact Information:**
- Choose 'Personal' account type
- Enter accurate billing information
- Phone number for verification

**Payment Method:**
- Credit or debit card required
- You won't be charged for free tier usage
- AWS uses this to prevent abuse

**Identity Verification:**
- Enter phone number
- Choose text or voice verification
- Enter the verification code

**Support Plan:**
- Select 'Basic Support' (free)
- This includes access to documentation and forums

*[Account creation completes]*

**Immediate Security Setup:**

Now, before we do anything else, let's secure this account:

*[Navigates to IAM]*

1. **Enable MFA on Root Account**
   - Go to IAM → Dashboard
   - Click 'Add MFA to root account'
   - Choose 'Virtual MFA device'
   - Download Google Authenticator or Authy
   - Scan QR code and enter two codes
   - Save recovery codes securely

2. **Create IAM Admin User**
   - IAM → Users → Add User
   - Username: admin-[yourname]
   - Access type: Both programmatic and console
   - Attach policy: AdministratorAccess
   - Download CSV file with credentials
   - **Never lose this file!**

3. **Log out and test IAM user login**"

**[SCENE 3: Billing Setup and Monitoring (12:00-18:00)]**

*Demonstrates billing configuration*

**INSTRUCTOR:** "Let's set up billing alerts so you never get surprised by charges:

*[Goes to Billing & Cost Management]*

**Enable Billing Alerts:**
1. Billing & Cost Management → Billing Preferences
2. Check 'Receive billing alerts'
3. Enter your email address
4. Save preferences

**Create Billing Alarms:**
1. CloudWatch → Alarms → Billing
2. Create alarm for $5 threshold
3. Create alarm for $10 threshold
4. Create alarm for $25 threshold

*[Shows Free Tier dashboard]*

**Monitor Free Tier Usage:**
- This dashboard shows your current usage
- Green = safe, Yellow = approaching limits, Red = exceeded
- Check this weekly during your learning

**Free Tier Limits to Remember:**
- EC2: 750 hours per month (t2.micro instances)
- S3: 5GB storage, 20,000 Get requests
- RDS: 750 hours per month (db.t2.micro)
- Data transfer: 15GB outbound per month"

**[SCENE 4: Launching Your First EC2 Instance (18:00-28:00)]**

*Live walkthrough of EC2 instance creation*

**INSTRUCTOR:** "Now for the exciting part - launching your first virtual server:

*[Opens EC2 console]*

**Step 1: Choose AMI (Amazon Machine Image)**
- Click 'Launch Instance'
- Select 'Amazon Linux 2 AMI' 
- This is a free tier eligible Linux distribution

**Step 2: Choose Instance Type**
- Select 't2.micro' (1 vCPU, 1GB RAM)
- This is free tier eligible
- Perfect for learning and small applications

**Step 3: Configure Instance**
- Number of instances: 1
- Network: Default VPC
- Subnet: Default
- Auto-assign public IP: Enable
- Leave other settings default

**Step 4: Add Storage**
- Size: 8GB (free tier allows up to 30GB)
- Volume Type: General Purpose SSD
- Delete on termination: Yes

**Step 5: Add Tags**
- Key: Name, Value: MyFirstInstance
- Key: Purpose, Value: Learning
- Tags help organize resources

**Step 6: Configure Security Group**
- Create new security group
- Name: web-server-sg
- Add rule: HTTP (port 80) from anywhere
- Add rule: SSH (port 22) from your IP only

**Step 7: Key Pair**
- Create new key pair: 'my-first-keypair'
- Download .pem file
- **Store this securely - you need it to connect**

*[Instance launches]*

**Connecting to Your Instance:**

*[Shows connection process]*

1. Wait for instance state: 'running'
2. Note the public IP address
3. Open terminal/command prompt
4. Navigate to your key file location
5. Set permissions: chmod 400 my-first-keypair.pem
6. Connect: ssh -i my-first-keypair.pem ec2-user@[PUBLIC-IP]

*[Successfully connects and shows command prompt]*

Congratulations! You're now connected to a computer running in AWS's data center!"

**[SCENE 5: S3 Bucket Creation and File Upload (28:00-35:00)]**

*Demonstrates S3 functionality*

**INSTRUCTOR:** "Let's create your S3 bucket for file storage:

*[Opens S3 console]*

**Create Bucket:**
1. Click 'Create bucket'
2. Bucket name: 'cloudcrew-[yourname]-[randomnumbers]'
3. Region: US East (N. Virginia) - same as your EC2
4. Block public access: Keep enabled for security
5. Versioning: Disabled for now
6. Encryption: Enable with default keys
7. Create bucket

**Upload Files:**
1. Click on your bucket name
2. Click 'Upload'
3. Add files - try a photo or document
4. Review settings
5. Upload

*[File uploads successfully]*

**File Management:**
- Each file gets a unique URL
- You can organize files in folders
- Set permissions per file or folder
- Enable versioning for backup

**Connect S3 to EC2:**

Back on our EC2 instance, let's install AWS CLI:

*[Returns to EC2 terminal]*

```bash
sudo yum update -y
sudo yum install aws-cli -y
aws configure
```

Enter your IAM user credentials (from the CSV file)
Set region: us-east-1
Output format: json

Now you can access S3 from your server:

```bash
aws s3 ls
aws s3 cp myfile.txt s3://your-bucket-name/
```"

**[SCENE 6: Building a Simple Web Application (35:00-42:00)]**

*Creates functioning web app on EC2*

**INSTRUCTOR:** "Let's put everything together by creating a simple web application:

*[On EC2 instance]*

**Install Web Server:**
```bash
sudo yum install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd
```

**Create Web Page:**
```bash
sudo nano /var/www/html/index.html
```

*[Creates HTML file with S3 integration]*

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Cloud App</title>
</head>
<body>
    <h1>Welcome to CloudCrew Academy!</h1>
    <p>This website is running on AWS EC2</p>
    <p>Files are stored in AWS S3</p>
    <p>Built by: [Your Name]</p>
</body>
</html>
```

**Test the Application:**
1. Open browser
2. Go to http://[YOUR-EC2-PUBLIC-IP]
3. See your website live on the internet!

*[Shows working website]*

**What We've Built:**
- Web server running on EC2
- Files stored in S3
- Secure access with IAM
- Cost: Under $0.50/day if running 24/7
- Can handle thousands of visitors

This is the foundation of how major websites work!"

**[SCENE 7: Cleanup and Cost Management (42:00-45:00)]**

*Demonstrates proper resource cleanup*

**INSTRUCTOR:** "Before we finish, let's clean up resources to avoid any charges:

**Stop EC2 Instance:**
- Go to EC2 console
- Select your instance
- Instance State → Stop
- Stopped instances don't charge for compute
- You only pay for storage ($0.80/month for 8GB)

**S3 Cleanup:**
- Delete test files you don't need
- Keep bucket for future labs
- First 5GB are free anyway

**Billing Check:**
- Check your billing dashboard
- Should show $0.00 for everything
- Verify free tier usage levels

**What's Next:**
In our next session, we'll:
- Add a database to our application
- Set up automatic scaling
- Implement monitoring and alerts
- Deploy a real-world application

**Lab Recap:**
Today you:
✅ Created a secure AWS account
✅ Launched a virtual server
✅ Created cloud storage
✅ Built a web application
✅ Learned cost management

You've just completed the same tasks that cloud engineers do at Fortune 500 companies. This is real, professional-level work.

Keep practicing, keep building, and I'll see you in the next session!"

---

## Additional Training Videos Structure

### Advanced Course Videos:

1. **AWS Security Deep Dive** (30 min)
2. **Auto Scaling and Load Balancing** (25 min)  
3. **Database Optimization with RDS** (35 min)
4. **Serverless Applications with Lambda** (40 min)
5. **Container Orchestration with ECS/EKS** (45 min)
6. **CI/CD Pipeline Setup** (50 min)
7. **Cost Optimization Strategies** (30 min)
8. **Disaster Recovery Planning** (35 min)
9. **Multi-Region Architecture** (40 min)
10. **AWS Certification Exam Prep** (60 min)

### Career Development Videos:

1. **Building Your Cloud Portfolio** (20 min)
2. **Interview Preparation for Cloud Roles** (25 min)
3. **Networking in the Cloud Community** (15 min)
4. **Freelancing as a Cloud Consultant** (30 min)
5. **Starting Your Cloud Consulting Business** (35 min)

Each video includes:
- Professional instructor delivery
- Real AWS console demonstrations
- Hands-on lab components
- Career guidance specific to urban communities
- Economic opportunity focus
- Practical, immediately applicable skills