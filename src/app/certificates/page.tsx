"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect, useRef, Suspense } from "react";
import { 
  Award, 
  Download, 
  Share2, 
  CheckCircle,
  Calendar,
  Trophy,
  Star,
  ExternalLink
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userName: string;
  completionDate: string;
  certificateNumber: string;
  instructorName: string;
  skills: string[];
}

function CertificateContent() {
  const searchParams = useSearchParams();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock certificate data - in production, fetch from API
    const courseId = searchParams.get('courseId') || 'aws-fundamentals';
    
    const mockCertificate: Certificate = {
      id: `CERT-${Date.now()}`,
      courseId,
      courseName: getCourseNameById(courseId),
      userName: 'John Doe', // From authenticated user
      completionDate: new Date().toISOString(),
      certificateNumber: `CC-${Date.now().toString().slice(-8)}`,
      instructorName: 'Alex Rodriguez',
      skills: getSkillsByCourse(courseId)
    };

    setCertificate(mockCertificate);
    setIsLoading(false);
  }, [searchParams]);

  const getCourseNameById = (courseId: string): string => {
    const courses: Record<string, string> = {
      'aws-fundamentals': 'AWS Fundamentals for Beginners',
      'serverless-architecture': 'Serverless Architecture Mastery',
      'cloud-security': 'Cloud Security & DevOps Excellence'
    };
    return courses[courseId] || 'Cloud Engineering Course';
  };

  const getSkillsByCourse = (courseId: string): string[] => {
    const skills: Record<string, string[]> = {
      'aws-fundamentals': ['AWS EC2', 'S3 Storage', 'IAM Security', 'Cloud Architecture'],
      'serverless-architecture': ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Serverless Framework'],
      'cloud-security': ['Cloud Security', 'DevOps', 'Infrastructure as Code', 'CI/CD Pipelines']
    };
    return skills[courseId] || ['Cloud Engineering'];
  };

  const handleDownload = () => {
    // In production, this would generate a real PDF
    alert('PDF download functionality will be implemented with jsPDF or similar library');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/certificates/verify?id=${certificate?.certificateNumber}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Certificate verification link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-dark-text-secondary">Generating your certificate...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-dark-text-primary mb-4">Certificate Not Found</h1>
            <p className="text-dark-text-secondary">
              The certificate you're looking for doesn't exist or hasn't been generated yet.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        {/* Header */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex p-4 bg-success-500/20 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-success-400" />
            </div>
            <h1 className="text-4xl font-display font-bold text-dark-text-primary mb-4">
              Congratulations! 🎉
            </h1>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              You've successfully completed <span className="text-primary-400 font-semibold">{certificate.courseName}</span>
            </p>
          </div>
        </section>

        {/* Certificate */}
        <section className="section-padding">
          <div className="max-w-5xl mx-auto">
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Certificate
              </button>
            </div>

            {/* Certificate Design */}
            <div 
              ref={certificateRef}
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-12 rounded-2xl shadow-2xl border-8 border-primary-500/20"
            >
              {/* Header with Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CloudCrew Academy
                  </span>
                </div>
                <div className="h-1 w-64 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full"></div>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-8">
                <p className="text-slate-600 text-lg mb-2">Certificate of Completion</p>
                <h2 className="text-5xl font-display font-bold text-slate-900 mb-2">
                  {certificate.courseName}
                </h2>
              </div>

              {/* Recipient */}
              <div className="text-center mb-8">
                <p className="text-slate-600 text-lg mb-2">This is to certify that</p>
                <p className="text-4xl font-display font-bold text-slate-900 mb-4">
                  {certificate.userName}
                </p>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  has successfully completed the comprehensive cloud engineering curriculum and demonstrated 
                  mastery of essential skills required for modern cloud infrastructure development.
                </p>
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {certificate.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-blue-600/10 text-blue-700 rounded-full text-sm font-medium border border-blue-600/20"
                  >
                    <CheckCircle className="w-4 h-4 inline-block mr-1" />
                    {skill}
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Calendar className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">Completion Date</p>
                  <p className="text-slate-900 font-semibold">
                    {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg">
                  <Award className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">Certificate ID</p>
                  <p className="text-slate-900 font-semibold">{certificate.certificateNumber}</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg">
                  <Star className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">Instructor</p>
                  <p className="text-slate-900 font-semibold">{certificate.instructorName}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-200">
                <div className="text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-slate-900 inline-block px-8">
                    <p className="text-slate-900 font-semibold mt-2">{certificate.instructorName}</p>
                    <p className="text-slate-600 text-sm">Lead Instructor</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-slate-900 inline-block px-8">
                    <p className="text-slate-900 font-semibold mt-2">Dr. Marcus Johnson</p>
                    <p className="text-slate-600 text-sm">Academy Director</p>
                  </div>
                </div>
              </div>

              {/* Verification Footer */}
              <div className="text-center mt-8 pt-6 border-t border-slate-300">
                <p className="text-slate-500 text-sm">
                  Verify this certificate at:{' '}
                  <span className="text-blue-600 font-mono">
                    cloudcrew.academy/verify/{certificate.certificateNumber}
                  </span>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-dark-text-primary mb-4">What's Next?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-text-secondary">Add this certificate to your LinkedIn profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-text-secondary">Include it in your resume and portfolio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-text-secondary">Continue learning with our advanced courses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-text-secondary">Join our alumni network for job opportunities</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-dark-text-primary mb-4">Certificate Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-text-muted">Certificate Type:</span>
                    <span className="text-dark-text-primary font-medium">Course Completion</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-text-muted">Valid:</span>
                    <span className="text-dark-text-primary font-medium">Lifetime</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-text-muted">Verification:</span>
                    <span className="text-success-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-text-muted">Shareable Link:</span>
                    <button
                      onClick={handleShare}
                      className="text-primary-400 font-medium flex items-center gap-1 hover:text-primary-300"
                    >
                      Copy
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center">Loading...</div>}>
      <CertificateContent />
    </Suspense>
  );
}
