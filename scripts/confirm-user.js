/**
 * Manually confirm a Cognito user (for testing)
 * Usage: node scripts/confirm-user.js <email>
 */

const { CognitoIdentityProviderClient, AdminConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');

const userPoolId = 'us-east-1_eBAqIBYa1';
const region = 'us-east-1';

async function confirmUser(email) {
  const client = new CognitoIdentityProviderClient({ region });
  
  try {
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: userPoolId,
      Username: email
    });
    
    await client.send(command);
    console.log(`✅ User ${email} has been confirmed successfully!`);
    console.log('You can now log in at http://localhost:3001/login');
  } catch (error) {
    console.error('❌ Error confirming user:', error.message);
    if (error.name === 'UserNotFoundException') {
      console.log('\nUser not found. Please check the email address or sign up first.');
    }
  }
}

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/confirm-user.js <email>');
  process.exit(1);
}

confirmUser(email);
