import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails,
  CognitoUserAttribute,
  ICognitoUserPoolData
} from 'amazon-cognito-identity-js';

// Cognito User Pool configuration
const poolData: ICognitoUserPoolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_PLACEHOLDER',
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID'
};

const userPool = new CognitoUserPool(poolData);

export interface AuthUser {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  subscription_tier?: string;
  email_verified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  // Get current authenticated user
  getCurrentUser(): CognitoUser | null {
    return userPool.getCurrentUser();
  }

  // Sign up new user
  async signUp(userData: SignUpData): Promise<{ success: boolean; user?: CognitoUser; error?: string }> {
    return new Promise((resolve) => {
      const { email, password, firstName, lastName } = userData;
      
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: 'given_name',
          Value: firstName,
        }),
        new CognitoUserAttribute({
          Name: 'family_name',
          Value: lastName,
        }),
        // Note: custom:subscription_tier is set in backend after user is created
      ];

      userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          console.error('Sign up error:', err);
          resolve({ success: false, error: err.message });
          return;
        }
        
        resolve({ 
          success: true, 
          user: result?.user,
        });
      });
    });
  }

  // Confirm email verification
  async confirmSignUp(email: string, verificationCode: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(verificationCode, true, (err) => {
        if (err) {
          console.error('Confirmation error:', err);
          resolve({ success: false, error: err.message });
          return;
        }
        
        resolve({ success: true });
      });
    });
  }

  // Resend confirmation code
  async resendConfirmationCode(email: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.resendConfirmationCode((err) => {
        if (err) {
          console.error('Resend code error:', err);
          resolve({ success: false, error: err.message });
          return;
        }
        
        resolve({ success: true });
      });
    });
  }

  // Sign in user
  async signIn(userData: SignInData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    return new Promise((resolve) => {
      const { email, password } = userData;
      
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          console.log('🔐 Login successful, processing...');
          const idToken = result.getIdToken();
          const payload = idToken.payload;
          
          // Store tokens in localStorage first
          localStorage.setItem('idToken', idToken.getJwtToken());
          localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
          localStorage.setItem('refreshToken', result.getRefreshToken().getToken());
          console.log('💾 Tokens stored in localStorage');
          
          // Fetch user tier from backend API (reads from DynamoDB)
          let subscriptionTier = 'free';
          try {
            console.log('📡 Fetching user tier from backend...');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
              headers: {
                'Authorization': `Bearer ${idToken.getJwtToken()}`
              }
            });
            console.log('📡 Response status:', response.status);
            if (response.ok) {
              const data = await response.json();
              subscriptionTier = data.subscriptionTier || 'free';
              localStorage.setItem('subscriptionTier', subscriptionTier);
              console.log('✅ Fetched user tier from backend:', subscriptionTier);
            } else {
              const errorText = await response.text();
              console.error('❌ Failed to fetch user tier, status:', response.status, errorText);
            }
          } catch (error) {
            console.error('❌ Failed to fetch user tier:', error);
          }
          
          const user: AuthUser = {
            sub: payload.sub,
            email: payload.email,
            given_name: payload.given_name,
            family_name: payload.family_name,
            subscription_tier: subscriptionTier,
            email_verified: payload.email_verified === 'true'
          };
          
          console.log('👤 User object created:', user);
          resolve({ success: true, user });
        },
        onFailure: (err) => {
          console.error('Sign in error:', err);
          resolve({ success: false, error: err.message });
        },
        newPasswordRequired: () => {
          resolve({ success: false, error: 'New password required' });
        }
      });
    });
  }

  // Sign out user
  async signOut(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    
    // Clear stored tokens
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Get current user session
  async getCurrentUserSession(): Promise<{ user: AuthUser | null; isAuthenticated: boolean }> {
    return new Promise((resolve) => {
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) {
        resolve({ user: null, isAuthenticated: false });
        return;
      }

      currentUser.getSession((err: any, session: any) => {
        if (err || !session?.isValid()) {
          resolve({ user: null, isAuthenticated: false });
          return;
        }

        const idToken = session.getIdToken();
        const payload = idToken.payload;
        
        const user: AuthUser = {
          sub: payload.sub,
          email: payload.email,
          given_name: payload.given_name,
          family_name: payload.family_name,
          subscription_tier: payload['custom:subscription_tier'] || 'free',
          email_verified: payload.email_verified === 'true'
        };

        resolve({ user, isAuthenticated: true });
      });
    });
  }

  // Update user attributes
  async updateUserAttribute(attributeName: string, attributeValue: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) {
        resolve({ success: false, error: 'No authenticated user' });
        return;
      }

      const attribute = new CognitoUserAttribute({
        Name: attributeName,
        Value: attributeValue,
      });

      currentUser.updateAttributes([attribute], (err) => {
        if (err) {
          console.error('Update attribute error:', err);
          resolve({ success: false, error: err.message });
          return;
        }
        
        resolve({ success: true });
      });
    });
  }

  // Get ID token for API calls
  getIdToken(): string | null {
    return localStorage.getItem('idToken');
  }

  // Get access token for API calls
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;