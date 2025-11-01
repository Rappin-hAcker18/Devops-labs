'use client';

import { useState } from 'react';
import { stripeService } from '../lib/stripe';

export default function PaymentTestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStandardCheckout = async () => {
    setIsLoading(true);
    addResult('🧪 Testing Standard Plan ($297) checkout...');
    
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID;
      if (!priceId) {
        throw new Error('Standard price ID not configured');
      }
      
      await stripeService.createSubscriptionCheckout(priceId, 'standard');
      addResult('✅ Standard checkout session created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult(`❌ Standard checkout failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPremiumCheckout = async () => {
    setIsLoading(true);
    addResult('🧪 Testing Premium Plan ($597) checkout...');
    
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
      if (!priceId) {
        throw new Error('Premium price ID not configured');
      }
      
      await stripeService.createSubscriptionCheckout(priceId, 'premium');
      addResult('✅ Premium checkout session created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult(`❌ Premium checkout failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPlanComparison = () => {
    addResult('🧪 Testing plan configuration...');
    
    try {
      // Test environment variables
      const standardPriceId = process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID;
      const premiumPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
      
      addResult(`✅ Standard Price ID: ${standardPriceId ? 'Configured' : 'Missing'}`);
      addResult(`✅ Premium Price ID: ${premiumPriceId ? 'Configured' : 'Missing'}`);
      
      if (standardPriceId && premiumPriceId) {
        addResult('✅ All pricing configuration ready for testing');
      } else {
        addResult('❌ Missing price ID configuration');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult(`❌ Plan configuration test failed: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🧪 CloudCrew Academy Payment Testing
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testStandardCheckout}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Standard ($297)
        </button>
        
        <button
          onClick={testPremiumCheckout}
          disabled={isLoading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Premium ($597)
        </button>
        
        <button
          onClick={testPlanComparison}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Plan Utils
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        <div className="max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">Click a test button to start testing...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💳 Manual Testing Instructions:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Click "Test Standard" or "Test Premium" above</li>
          <li>2. If successful, visit the pricing page: <code>/pricing</code></li>
          <li>3. Click "Get Started" on any paid plan</li>
          <li>4. Use test card: <code>4242 4242 4242 4242</code></li>
          <li>5. Complete payment and verify success redirect</li>
          <li>6. Check Stripe Dashboard for payment record</li>
        </ol>
      </div>
    </div>
  );
}