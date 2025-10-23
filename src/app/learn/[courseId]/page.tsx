"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CourseContentManager } from "@/components/course/CourseContentManager";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getUserAccess } from "@/lib/access";

export default function LearnPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and enrolled
    const authenticated = isAuthenticated();
    const enrolled = localStorage.getItem(`enrolled_${courseId}`) === 'true';
    
    if (!authenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsEnrolled(enrolled);
    setIsLoading(false);
  }, [courseId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-dark-text-secondary mt-4">Loading course...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!isEnrolled) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
              Not Enrolled
            </h1>
            <p className="text-dark-text-secondary mb-8">
              You need to enroll in this course to access the content.
            </p>
            <a href={`/courses/${courseId}`} className="btn-primary">
              View Course Details
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const userAccess = getUserAccess();
  const userId = 'demo-user'; // In a real app, this would come from authentication

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        <CourseContentManager 
          courseId={courseId} 
          userId={userId} 
        />
      </div>
      
      <Footer />
    </main>
  );
}