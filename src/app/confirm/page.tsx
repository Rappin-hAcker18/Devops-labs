"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Mail, ArrowRight } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth";

function ConfirmContent() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authService.confirmSignUp(email, code);
      
      if (result.success) {
        alert("✅ Email verified successfully! You can now log in.");
        router.push('/login');
      } else {
        setError(result.error || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error('Confirmation error:', err);
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.resendConfirmationCode(email);
      
      if (result.success) {
        alert("✅ Verification code resent! Check your email.");
      } else {
        setError(result.error || "Failed to resend code.");
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-4">
              <Mail className="w-8 h-8 text-accent-400" />
            </div>
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
              Verify Your Email
            </h1>
            <p className="text-text-secondary">
              We sent a verification code to<br />
              <span className="text-accent-400 font-medium">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Verification Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-text mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input w-full text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full group"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already verified?{" "}
              <a href="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                Log in
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center">Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
