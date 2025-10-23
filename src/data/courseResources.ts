/**
 * Course Resources Generator
 * Creates downloadable resources for course content
 */

export interface ResourceTemplate {
  id: string;
  name: string;
  type: 'cheatsheet' | 'code' | 'template' | 'pdf';
  content: string;
  filename: string;
}

// AWS Fundamentals Resources
export const awsFundamentalsResources: ResourceTemplate[] = [
  {
    id: "aws-cloud-cheatsheet",
    name: "Cloud Computing Cheat Sheet",
    type: "cheatsheet",
    filename: "cloud-computing-cheatsheet.md",
    content: `# Cloud Computing Cheat Sheet

## Essential Definitions

### Cloud Computing
- **Definition**: Delivery of computing services over the Internet
- **Key Benefit**: Pay only for what you use
- **Elasticity**: Scale up/down based on demand

## Service Models

### IaaS (Infrastructure as a Service)
- **What**: Virtual machines, storage, networks
- **Examples**: Amazon EC2, Google Compute Engine
- **Use Cases**: Web hosting, development environments
- **Control Level**: Operating system and applications

### PaaS (Platform as a Service)
- **What**: Development platforms and tools
- **Examples**: AWS Elastic Beanstalk, Google App Engine
- **Use Cases**: Application development and deployment
- **Control Level**: Applications and data

### SaaS (Software as a Service)
- **What**: Complete applications delivered over web
- **Examples**: Gmail, Salesforce, Office 365
- **Use Cases**: End-user applications
- **Control Level**: Data only

## AWS Fundamentals

### Regions & Availability Zones
- **Regions**: 33 worldwide geographic locations
- **AZs**: 2-6 isolated data centers per region
- **Edge Locations**: 400+ CDN endpoints
- **Best Practice**: Design across multiple AZs

### Core Services
| Service | Purpose | Use Case |
|---------|---------|----------|
| EC2 | Virtual servers | Web applications |
| S3 | Object storage | File hosting, backup |
| RDS | Managed databases | User data, transactions |
| Lambda | Serverless compute | Event processing |
| VPC | Virtual networks | Secure environments |

### Pricing Models
1. **On-Demand**: Pay per hour/second
2. **Reserved**: 1-3 year commitments (up to 75% savings)
3. **Spot**: Bid for unused capacity (up to 90% savings)
4. **Dedicated**: Physical servers for compliance

## Security Best Practices

### Identity & Access Management (IAM)
- **Root Account**: Use only for account setup
- **MFA**: Always enable for root and admin users
- **Principle of Least Privilege**: Grant minimum required permissions
- **IAM Users**: Create for each person/application

### Security Groups
- **Purpose**: Virtual firewalls for EC2 instances
- **Default**: Deny all inbound, allow all outbound
- **Best Practice**: Be specific with ports and sources

### Encryption
- **At Rest**: S3, EBS, RDS encryption
- **In Transit**: TLS/SSL for all communications
- **Key Management**: AWS KMS for centralized control

## Cost Optimization Tips

### Free Tier Resources
- **EC2**: 750 hours/month of t2.micro (12 months)
- **S3**: 5GB storage (12 months)
- **RDS**: 750 hours/month db.t2.micro (12 months)
- **Lambda**: 1 million requests/month (always free)

### Monitoring & Alerts
- **CloudWatch**: Set billing alarms
- **Cost Explorer**: Analyze spending patterns
- **Trusted Advisor**: Identify cost optimization opportunities
- **Tags**: Organize resources for cost tracking

## Quick Commands

### AWS CLI Setup
\`\`\`bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
\`\`\`

### Common EC2 Commands
\`\`\`bash
# List instances
aws ec2 describe-instances

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
\`\`\`

### S3 Commands
\`\`\`bash
# List buckets
aws s3 ls

# Upload file
aws s3 cp file.txt s3://my-bucket/

# Download file
aws s3 cp s3://my-bucket/file.txt ./
\`\`\`

## Urban Professional Tips

### Mobile-First Approach
- **AWS Mobile App**: Monitor resources on-the-go
- **CloudShell**: Browser-based CLI access
- **Responsive Console**: Works on all devices

### Career Development
- **Certifications**: Start with Cloud Practitioner
- **Hands-On**: Build projects in Free Tier
- **Community**: Join AWS user groups
- **Documentation**: Always refer to official docs

### Cost-Conscious Development
- **Start Small**: Use t3.micro for learning
- **Monitor Usage**: Set up billing alerts
- **Clean Up**: Terminate unused resources
- **Spot Instances**: Use for non-critical workloads

Remember: Cloud engineering is about solving problems, not just using tools!
`
  },
  {
    id: "ec2-lab-template",
    name: "EC2 Lab Template",
    type: "template",
    filename: "ec2-lab-template.sh",
    content: `#!/bin/bash
# EC2 Instance Setup Script
# CloudCrew Academy - AWS Fundamentals Course

echo "🚀 Starting EC2 Instance Setup..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install essential tools
echo "🔧 Installing essential tools..."
sudo yum install -y git curl wget vim htop

# Install Apache Web Server
echo "🌐 Installing Apache Web Server..."
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd

# Create custom index page
echo "📄 Creating custom webpage..."
cat << 'EOF' | sudo tee /var/www/html/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudCrew Academy - EC2 Lab</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .badge {
            background: #4CAF50;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 20px;
            display: inline-block;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .info-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .footer {
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Congratulations!</h1>
        <div class="badge">EC2 Instance Successfully Configured</div>
        
        <p>You've successfully launched and configured your first EC2 instance through CloudCrew Academy!</p>
        
        <div class="info-grid">
            <div class="info-card">
                <h3>Instance ID</h3>
                <p id="instance-id">Loading...</p>
            </div>
            <div class="info-card">
                <h3>Instance Type</h3>
                <p id="instance-type">Loading...</p>
            </div>
            <div class="info-card">
                <h3>Availability Zone</h3>
                <p id="availability-zone">Loading...</p>
            </div>
            <div class="info-card">
                <h3>Public IP</h3>
                <p id="public-ip">Loading...</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Next Steps:</strong></p>
            <ul style="text-align: left; display: inline-block;">
                <li>Explore the AWS Management Console</li>
                <li>Try connecting via SSH</li>
                <li>Experiment with security groups</li>
                <li>Set up monitoring with CloudWatch</li>
            </ul>
        </div>
    </div>

    <script>
        // Fetch instance metadata
        async function loadInstanceInfo() {
            try {
                const metadataBase = 'http://169.254.169.254/latest/meta-data/';
                
                // Note: In a real scenario, you'd need to handle CORS and security
                // This is simplified for educational purposes
                document.getElementById('instance-id').textContent = 'i-0123456789abcdef0';
                document.getElementById('instance-type').textContent = 't3.micro';
                document.getElementById('availability-zone').textContent = 'us-east-1a';
                document.getElementById('public-ip').textContent = window.location.hostname;
                
            } catch (error) {
                console.log('Metadata service not available in demo mode');
            }
        }
        
        loadInstanceInfo();
    </script>
</body>
</html>
EOF

# Create a system information script
echo "📊 Creating system information script..."
cat << 'EOF' | sudo tee /home/ec2-user/system-info.sh
#!/bin/bash
echo "=== EC2 Instance System Information ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id 2>/dev/null || echo 'Not available')"
echo "Instance Type: $(curl -s http://169.254.169.254/latest/meta-data/instance-type 2>/dev/null || echo 'Not available')"
echo "Availability Zone: $(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone 2>/dev/null || echo 'Not available')"
echo "Security Groups: $(curl -s http://169.254.169.254/latest/meta-data/security-groups 2>/dev/null || echo 'Not available')"
echo ""
echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h
echo ""
echo "Network Interfaces:"
ip addr show
echo ""
echo "Running Services:"
sudo systemctl list-units --type=service --state=running | head -10
EOF

sudo chmod +x /home/ec2-user/system-info.sh

# Install AWS CLI v2 (if not already installed)
echo "☁️ Setting up AWS CLI..."
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Set up bashrc with useful aliases
echo "⚙️ Configuring bash environment..."
cat << 'EOF' >> /home/ec2-user/.bashrc

# CloudCrew Academy Custom Configuration
export PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]$ '

# Useful aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias ec2-info='/home/ec2-user/system-info.sh'
alias aws-whoami='aws sts get-caller-identity'

# AWS shortcuts
alias ec2-instances='aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,PublicIpAddress]" --output table'
alias s3-buckets='aws s3 ls'

echo "🎓 CloudCrew Academy EC2 Lab Environment Ready!"
echo "💡 Type 'ec2-info' to see system information"
echo "📚 Visit the web server at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-public-ip')"
EOF

# Create lab completion marker
echo "✅ Lab setup completed at $(date)" | sudo tee /var/log/cloudcrew-lab-setup.log

echo ""
echo "🎉 EC2 Lab Setup Complete!"
echo "🌐 Web server is running on port 80"
echo "📱 Access your instance at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-public-ip')"
echo "🔧 Run 'ec2-info' to see system information"
echo "📖 Don't forget to clean up resources when done!"
echo ""
`
  },
  {
    id: "aws-security-checklist",
    name: "AWS Security Best Practices Checklist",
    type: "pdf",
    filename: "aws-security-checklist.md",
    content: `# AWS Security Best Practices Checklist

## 🔐 Account Security

### Root Account Protection
- [ ] Enable MFA on root account
- [ ] Use strong, unique password
- [ ] Store root credentials securely
- [ ] Remove root access keys (if any exist)
- [ ] Set up account recovery contact information

### IAM (Identity and Access Management)
- [ ] Create IAM users instead of using root
- [ ] Enable MFA for all IAM users
- [ ] Use IAM roles for EC2 instances
- [ ] Implement principle of least privilege
- [ ] Regularly rotate access keys
- [ ] Use IAM password policy
- [ ] Enable CloudTrail for API logging

## 🔥 Network Security

### VPC (Virtual Private Cloud)
- [ ] Use custom VPC instead of default
- [ ] Implement private and public subnets
- [ ] Use NAT Gateway for private subnet internet access
- [ ] Enable VPC Flow Logs
- [ ] Use multiple Availability Zones

### Security Groups
- [ ] Follow principle of least privilege
- [ ] Avoid 0.0.0.0/0 for SSH (port 22)
- [ ] Use specific ports and protocols
- [ ] Regularly audit security group rules
- [ ] Use descriptive names and descriptions

### Network Access Control Lists (NACLs)
- [ ] Understand default NACL rules
- [ ] Use custom NACLs for additional security
- [ ] Ensure proper inbound/outbound rules
- [ ] Consider stateless nature of NACLs

## 💾 Data Protection

### Encryption at Rest
- [ ] Enable EBS encryption
- [ ] Use S3 bucket encryption
- [ ] Enable RDS encryption
- [ ] Use AWS KMS for key management
- [ ] Encrypt sensitive data in applications

### Encryption in Transit
- [ ] Use HTTPS/TLS for web traffic
- [ ] Enable SSL/TLS for database connections
- [ ] Use VPN or AWS Direct Connect for hybrid connectivity
- [ ] Encrypt data before uploading to S3

### Backup and Recovery
- [ ] Enable automated backups for RDS
- [ ] Create EBS snapshots regularly
- [ ] Use S3 versioning for important data
- [ ] Test backup restoration procedures
- [ ] Implement cross-region backups for DR

## 📊 Monitoring and Compliance

### CloudWatch and Logging
- [ ] Set up CloudWatch alarms for security events
- [ ] Enable CloudTrail in all regions
- [ ] Configure CloudWatch Logs for applications
- [ ] Monitor failed login attempts
- [ ] Set up billing alerts

### AWS Config
- [ ] Enable AWS Config for compliance monitoring
- [ ] Use Config Rules for security compliance
- [ ] Monitor configuration changes
- [ ] Set up compliance dashboards

### Third-Party Security Tools
- [ ] Consider AWS Security Hub
- [ ] Use AWS GuardDuty for threat detection
- [ ] Implement AWS WAF for web applications
- [ ] Use AWS Inspector for vulnerability assessment

## 🚨 Incident Response

### Preparation
- [ ] Create incident response plan
- [ ] Define roles and responsibilities
- [ ] Set up communication channels
- [ ] Prepare forensic tools and procedures

### Detection and Analysis
- [ ] Monitor CloudTrail logs for suspicious activity
- [ ] Set up automated alerting
- [ ] Use AWS Security Hub for centralized findings
- [ ] Implement SIEM solutions if needed

### Containment and Recovery
- [ ] Have procedures to isolate compromised resources
- [ ] Know how to revoke compromised credentials
- [ ] Plan for data recovery
- [ ] Document lessons learned

## 💰 Cost and Billing Security

### Billing Alerts
- [ ] Set up billing alarms in CloudWatch
- [ ] Use AWS Budgets for cost monitoring
- [ ] Monitor Free Tier usage
- [ ] Review monthly bills for unexpected charges

### Resource Management
- [ ] Tag resources for cost tracking
- [ ] Use AWS Cost Explorer regularly
- [ ] Implement automated resource cleanup
- [ ] Monitor unused resources

## 🎯 Service-Specific Security

### EC2 Instances
- [ ] Keep operating systems updated
- [ ] Use latest AMIs when launching instances
- [ ] Disable unnecessary services
- [ ] Use IAM roles instead of storing credentials
- [ ] Enable detailed monitoring

### S3 Buckets
- [ ] Block public access by default
- [ ] Use bucket policies carefully
- [ ] Enable access logging
- [ ] Use MFA Delete for important buckets
- [ ] Regularly audit bucket permissions

### RDS Databases
- [ ] Use strong database passwords
- [ ] Enable encryption at rest
- [ ] Use SSL connections
- [ ] Enable automated backups
- [ ] Use VPC for network isolation

### Lambda Functions
- [ ] Follow principle of least privilege for IAM roles
- [ ] Keep functions updated
- [ ] Monitor function logs
- [ ] Use environment variables securely
- [ ] Enable CloudTrail for Lambda API calls

## 📱 Mobile and Urban Professional Tips

### On-the-Go Security
- [ ] Use AWS Mobile App with MFA
- [ ] Enable push notifications for security alerts
- [ ] Use secure networks for AWS access
- [ ] Keep mobile devices updated and secured

### Quick Security Checks
- [ ] Daily: Check CloudWatch alarms
- [ ] Weekly: Review IAM users and permissions
- [ ] Monthly: Audit security groups and NACLs
- [ ] Quarterly: Review and rotate access keys

### Emergency Procedures
- [ ] Know how to quickly revoke access
- [ ] Have emergency contact information ready
- [ ] Understand AWS support escalation
- [ ] Keep offline copies of critical procedures

## 🎓 Continuous Learning

### Stay Updated
- [ ] Follow AWS Security Blog
- [ ] Join AWS security communities
- [ ] Attend security webinars and workshops
- [ ] Practice with AWS security labs

### Certifications
- [ ] Consider AWS Security Specialty certification
- [ ] Keep existing certifications current
- [ ] Practice hands-on security scenarios
- [ ] Learn from security case studies

Remember: Security is not a destination, it's a journey. Regularly review and update your security practices!

---

**CloudCrew Academy Security Team**
*"Securing the cloud, one professional at a time"*
`
  }
];

// Resource download functionality
export function downloadResource(resource: ResourceTemplate) {
  const blob = new Blob([resource.content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = resource.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Generate resource URLs for development
export function generateResourceUrl(resourceId: string): string {
  return `/api/resources/${resourceId}`;
}

export default awsFundamentalsResources;