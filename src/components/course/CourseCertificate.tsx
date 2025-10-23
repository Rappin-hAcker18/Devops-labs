"use client";

import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  Calendar, 
  CheckCircle,
  Star,
  Trophy,
  Users,
  LinkedinIcon
} from 'lucide-react';

interface CourseCertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  courseId: string;
  instructor: string;
  grade?: string;
  credentialId?: string;
}

export function CourseCertificate({
  studentName,
  courseName,
  completionDate,
  courseId,
  instructor,
  grade = "Pass",
  credentialId
}: CourseCertificateProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF certificate
    console.log("Downloading certificate...");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseName)}&organizationName=${encodeURIComponent('CloudCrew Academy')}&issueYear=${new Date(completionDate).getFullYear()}&issueMonth=${new Date(completionDate).getMonth() + 1}`;
    window.open(linkedInUrl, '_blank');
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I completed ${courseName} at CloudCrew Academy!`,
          text: `I just earned my certificate in ${courseName}. Check out CloudCrew Academy for urban professionals entering cloud engineering!`,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`I just completed ${courseName} at CloudCrew Academy! 🎉 Check it out: ${window.location.origin}`);
      alert('Link copied to clipboard!');
    }
    
    setIsSharing(false);
  };

  return (
    <div className="space-y-8">
      {/* Congratulations Header */}
      <div className="text-center">
        <div className="inline-flex p-6 bg-urban-gradient rounded-full mb-6">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-display font-bold text-dark-text-primary mb-4">
          Congratulations! 🎉
        </h1>
        <p className="text-lg text-dark-text-secondary">
          You&apos;ve successfully completed <span className="font-semibold gradient-text">{courseName}</span>
        </p>
      </div>

      {/* Certificate Display */}
      <div className="card-elevated max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-neon-purple/10 p-8 rounded-2xl border-2 border-primary-500/20">
          {/* Certificate Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-urban-gradient rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold gradient-text">
                CloudCrew Academy
              </h2>
            </div>
            <h3 className="text-xl font-display text-dark-text-primary mb-2">
              Certificate of Completion
            </h3>
            <p className="text-dark-text-secondary">
              This certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold gradient-text border-b-2 border-primary-500/30 pb-2 inline-block">
              {studentName}
            </h2>
          </div>

          {/* Course Details */}
          <div className="text-center mb-8">
            <p className="text-dark-text-secondary mb-4">
              has successfully completed the course
            </p>
            <h3 className="text-2xl font-display font-semibold text-dark-text-primary mb-6">
              {courseName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <Calendar className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="font-medium text-dark-text-primary">Completion Date</div>
                <div className="text-dark-text-secondary">{completionDate}</div>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="font-medium text-dark-text-primary">Instructor</div>
                <div className="text-dark-text-secondary">{instructor}</div>
              </div>
              <div className="text-center">
                <Star className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="font-medium text-dark-text-primary">Grade</div>
                <div className="text-dark-text-secondary">{grade}</div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              Verified Certificate
            </div>
            {credentialId && (
              <p className="text-xs text-dark-text-muted mt-2">
                Credential ID: {credentialId}
              </p>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 w-16 h-16 bg-neon-cyan/10 rounded-full"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-neon-purple/10 rounded-full"></div>
          <div className="absolute top-1/2 right-8 w-12 h-12 bg-neon-pink/10 rounded-full"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
        <button
          onClick={handleDownload}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
        
        <button
          onClick={handleLinkedInShare}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <LinkedinIcon className="w-5 h-5" />
          Add to LinkedIn
        </button>
        
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Share2 className="w-5 h-5" />
          {isSharing ? 'Sharing...' : 'Share'}
        </button>
      </div>

      {/* Next Steps */}
      <div className="card bg-primary-500/10 border border-primary-500/20 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-4 text-center">
          What&apos;s Next?
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary">Update Your Resume</h4>
              <p className="text-sm text-dark-text-secondary">
                Add this certification to your resume and LinkedIn profile to showcase your new skills.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary">Continue Learning</h4>
              <p className="text-sm text-dark-text-secondary">
                Explore our other courses to build a complete cloud engineering skillset.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary">Join Our Job Network</h4>
              <p className="text-sm text-dark-text-secondary">
                Get connected with employers actively hiring cloud professionals in your area.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Browse More Courses
          </button>
          <button className="flex-1 border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Job Placement Help
          </button>
        </div>
      </div>

      {/* Social Proof */}
      <div className="text-center">
        <p className="text-dark-text-muted text-sm mb-4">
          Join 10,000+ urban professionals who have transformed their careers with CloudCrew Academy
        </p>
        <div className="flex justify-center items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
          <span className="text-dark-text-secondary ml-2">4.9/5 from 2,500+ reviews</span>
        </div>
      </div>
    </div>
  );
}

// Default props for demo
CourseCertificate.defaultProps = {
  studentName: "Alex Johnson",
  courseName: "AWS Fundamentals for Beginners",
  completionDate: "October 22, 2025",
  courseId: "aws-fundamentals",
  instructor: "Alex Rodriguez",
  grade: "A",
  credentialId: "CC-AWS-FUND-2025-1022"
};