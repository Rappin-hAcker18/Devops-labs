import PaymentTestComponent from '../../components/PaymentTestComponent';

export default function PaymentTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          CloudCrew Academy - Payment Testing
        </h1>
        <PaymentTestComponent />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Payment Testing - CloudCrew Academy',
  description: 'Test Stripe payment integration for CloudCrew Academy',
};