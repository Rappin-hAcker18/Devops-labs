"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Award, 
  CheckCircle, 
  XCircle,
  Shield,
  Calendar,
  User,
  BookOpen,
  ExternalLink
} from "lucide-react";

interface VerificationResult {
  isValid: boolean;
  certificate?: {
    id: string;
    userName: string;
    courseName: string;
    completionDate: string;
    skills: string[];
  };
  error?: string;
}

export default function VerifyCertificatePage() {
  const searchParams = useSearchParams();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const certificateId = searchParams.get('id');
    
    if (!certificateId) {
      setVerificationResult({
        isValid: false,
        error: 'No certificate ID provided'
      });
      setIsVerifying(false);
      return;
    }

    // Simulate verification - in production, call API
    setTimeout(() => {
      // Mock verification success
      setVerificationResult({
        isValid: true,
        certificate: {
          id: certificateId,
          userName: 'John Doe',
          courseName: 'AWS Fundamentals for Beginners',
          completionDate: new Date().toISOString(),
          skills: ['AWS EC2', 'S3 Storage', 'IAM Security', 'Cloud Architecture']
        }
      });
      setIsVerifying(false);
    }, 1500);
  }, [searchParams]);

  if (isVerifying) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <Shield className="w-20 h-20 text-primary-400 mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary-400"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-dark-text-primary mb-2">
              Verifying Certificate
            </h2>
            <p className="text-dark-text-secondary">
              Please wait while we verify the authenticity...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        {/* Header */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-primary-400 mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold text-dark-text-primary mb-4">
              Certificate Verification
            </h1>
            <p className="text-lg text-dark-text-secondary">
              Verify the authenticity of CloudCrew Academy certificates
            </p>
          </div>
        </section>

        {/* Verification Result */}
        <section className="section-padding">
          <div className="max-w-3xl mx-auto">
            {verificationResult?.isValid ? (
              // Valid Certificate
              <div className="space-y-6">
                {/* Success Banner */}
                <div className="bg-success-500/20 border-2 border-success-500 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-success-500 rounded-full">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-success-400 mb-2">
                        Certificate Verified ✓
                      </h2>
                      <p className="text-dark-text-secondary">
                        This is an authentic CloudCrew Academy certificate issued to a verified graduate.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary-400" />
                    Certificate Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-dark-border">
                      <User className="w-5 h-5 text-primary-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-dark-text-muted mb-1">Recipient</p>
                        <p className="text-lg font-semibold text-dark-text-primary">
                          {verificationResult.certificate?.userName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pb-4 border-b border-dark-border">
                      <BookOpen className="w-5 h-5 text-primary-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-dark-text-muted mb-1">Course</p>
                        <p className="text-lg font-semibold text-dark-text-primary">
                          {verificationResult.certificate?.courseName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pb-4 border-b border-dark-border">
                      <Calendar className="w-5 h-5 text-primary-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-dark-text-muted mb-1">Completion Date</p>
                        <p className="text-lg font-semibold text-dark-text-primary">
                          {verificationResult.certificate?.completionDate && 
                            new Date(verificationResult.certificate.completionDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Shield className="w-5 h-5 text-primary-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-dark-text-muted mb-1">Certificate ID</p>
                        <p className="text-lg font-mono font-semibold text-dark-text-primary">
                          {verificationResult.certificate?.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Acquired */}
                {verificationResult.certificate?.skills && verificationResult.certificate.skills.length > 0 && (
                  <div className="card">
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-4">
                      Skills Demonstrated
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {verificationResult.certificate.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg text-sm font-medium border border-primary-500/30"
                        >
                          <CheckCircle className="w-4 h-4 inline-block mr-1" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Details */}
                <div className="card bg-dark-bg-tertiary border-dark-border">
                  <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                    About This Verification
                  </h3>
                  <div className="space-y-3 text-sm text-dark-text-secondary">
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                      This certificate was verified against CloudCrew Academy's official records
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                      The recipient successfully completed all course requirements
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                      This certificate is valid and has not been revoked
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                      Verification timestamp: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Invalid Certificate
              <div className="space-y-6">
                {/* Error Banner */}
                <div className="bg-error-500/20 border-2 border-error-500 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-error-500 rounded-full">
                      <XCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-error-400 mb-2">
                        Certificate Not Found
                      </h2>
                      <p className="text-dark-text-secondary mb-4">
                        {verificationResult?.error || 'We could not verify this certificate. It may be invalid, expired, or the ID may be incorrect.'}
                      </p>
                      <div className="space-y-2 text-sm text-dark-text-muted">
                        <p>Possible reasons:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>The certificate ID was entered incorrectly</li>
                          <li>The certificate has not been issued yet</li>
                          <li>The certificate may have been revoked</li>
                          <li>This is not an official CloudCrew Academy certificate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-dark-text-primary mb-4">
                    Need Help?
                  </h3>
                  <p className="text-dark-text-secondary mb-4">
                    If you believe this certificate should be valid, please contact our support team:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-dark-text-secondary">
                      Email: <a href="mailto:support@cloudcrew.academy" className="text-primary-400 hover:text-primary-300">support@cloudcrew.academy</a>
                    </p>
                    <p className="text-dark-text-secondary">
                      Include the certificate ID: <span className="font-mono bg-dark-bg-tertiary px-2 py-1 rounded">{searchParams.get('id')}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 text-center">
              <a
                href="/courses"
                className="btn-primary inline-flex items-center gap-2"
              >
                Explore Our Courses
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}
