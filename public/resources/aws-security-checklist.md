# AWS Security Checklist
## CloudCrew Academy - Essential Security Best Practices

### 🔐 Account Security
- [ ] **Root Account Protection**
  - Enable Multi-Factor Authentication (MFA)
  - Use strong, unique password
  - Limit root account usage to billing/account management only
  - Set up account recovery contacts

- [ ] **IAM User Management**
  - Create individual IAM users for team members
  - Assign minimum necessary permissions (Principle of Least Privilege)
  - Use IAM groups for permission management
  - Enable MFA for all users with console access
  - Rotate access keys regularly (every 90 days)

### 🛡️ Access Control
- [ ] **IAM Policies**
  - Use AWS managed policies when possible
  - Regularly audit and review custom policies
  - Implement policy conditions for additional security
  - Use AWS Access Analyzer to validate policies

- [ ] **Resource Access**
  - Enable AWS CloudTrail for API logging
  - Configure VPC Flow Logs for network monitoring
  - Use Security Groups and NACLs for network access control
  - Implement resource-based policies where appropriate

### 💾 Data Protection
- [ ] **Encryption**
  - Enable encryption at rest for S3, EBS, RDS
  - Use AWS KMS for key management
  - Enable encryption in transit for all data transfers
  - Implement envelope encryption for sensitive data

- [ ] **Backup and Recovery**
  - Configure automated backups for critical resources
  - Test backup restoration procedures regularly
  - Implement cross-region backup for disaster recovery
  - Document recovery time objectives (RTO) and recovery point objectives (RPO)

### 📊 Monitoring and Alerting
- [ ] **CloudWatch Configuration**
  - Set up billing alerts and cost monitoring
  - Configure performance and health monitoring
  - Create custom metrics for application monitoring
  - Set up log aggregation and analysis

- [ ] **Security Monitoring**
  - Enable AWS Config for compliance monitoring
  - Configure AWS GuardDuty for threat detection
  - Set up AWS Security Hub for centralized security findings
  - Implement AWS Inspector for vulnerability assessments

### 🔄 Operational Security
- [ ] **Regular Maintenance**
  - Keep all systems and software updated
  - Regularly rotate credentials and certificates
  - Conduct security reviews and audits
  - Maintain incident response procedures

- [ ] **Compliance**
  - Understand relevant compliance requirements (GDPR, HIPAA, SOC 2)
  - Implement data classification and handling procedures
  - Document security controls and procedures
  - Conduct regular compliance assessments

### 🚨 Incident Response
- [ ] **Preparation**
  - Create incident response playbooks
  - Establish communication procedures
  - Identify key stakeholders and contacts
  - Set up automated alerting for security events

- [ ] **Response Capabilities**
  - Practice incident response scenarios
  - Have forensic capabilities ready
  - Maintain backup communication channels
  - Document lessons learned from incidents

---

## Quick Reference Commands

### IAM User Creation
```bash
# Create new user
aws iam create-user --user-name john-doe

# Add user to group
aws iam add-user-to-group --user-name john-doe --group-name developers

# Create access key
aws iam create-access-key --user-name john-doe
```

### Security Audit Commands
```bash
# List users without MFA
aws iam list-users --query 'Users[?!MfaDevices].[UserName]' --output table

# Check for unused access keys
aws iam list-access-keys --user-name john-doe

# Review user policies
aws iam list-attached-user-policies --user-name john-doe
```

### CloudTrail Setup
```bash
# Create CloudTrail
aws cloudtrail create-trail --name MyTrail --s3-bucket-name cloudtrail-logs-bucket

# Start logging
aws cloudtrail start-logging --name MyTrail
```

---

## Emergency Contacts
- **AWS Support**: https://console.aws.amazon.com/support/
- **AWS Abuse**: abuse@amazonaws.com
- **Security Issues**: aws-security@amazon.com

---

*This checklist should be reviewed and updated regularly as your AWS environment evolves. Always refer to the latest AWS security best practices documentation.*

**Last Updated**: October 2025
**Version**: 1.0
**CloudCrew Academy** | Building Cloud Engineers