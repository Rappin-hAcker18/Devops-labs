import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Book, Clock, Users, Award, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LearningPaths } from "@/components/course/LearningPaths";

const courses = [
  {
    id: "aws-fundamentals",
    title: "AWS Fundamentals for Beginners",
    description: "Master the basics of Amazon Web Services with hands-on projects",
    level: "Beginner",
    duration: "4 weeks",
    students: 2500,
    rating: 4.8,
    price: "Free",
    tier: "free",
    image: "/courses/aws-fundamentals.jpg",
    modules: 8,
    labs: 12
  },
  {
    id: "serverless-architecture",
    title: "Serverless Architecture Mastery",
    description: "Build scalable applications with AWS Lambda, API Gateway, and DynamoDB",
    level: "Intermediate",
    duration: "6 weeks",
    students: 1800,
    rating: 4.9,
    price: "$49/mo",
    tier: "standard",
    image: "/courses/serverless.jpg",
    modules: 12,
    labs: 20
  },
  {
    id: "cloud-security",
    title: "Cloud Security & DevOps",
    description: "Advanced security practices and CI/CD pipelines in the cloud",
    level: "Advanced",
    duration: "8 weeks",
    students: 950,
    rating: 4.9,
    price: "$149/mo",
    tier: "premium",
    image: "/courses/cloud-security.jpg",
    modules: 16,
    labs: 25
  }
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Cloud Engineering Courses</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-text-secondary max-w-3xl mx-auto mb-8">
              From beginner to expert - master cloud engineering with hands-on projects designed for urban professionals.
            </p>
            
            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-cyan">15+</div>
                <div className="text-sm text-dark-text-muted">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">500+</div>
                <div className="text-sm text-dark-text-muted">Hours Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-pink">10K+</div>
                <div className="text-sm text-dark-text-muted">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">95%</div>
                <div className="text-sm text-dark-text-muted">Job Success</div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="section-padding bg-dark-bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <LearningPaths />
          </div>
        </section>

        {/* Individual Courses */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
                Or Browse Individual Courses
              </h2>
              <p className="text-dark-text-secondary">
                Take courses individually or as part of a structured learning path
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="card-elevated group hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Course Image Placeholder */}
                    <div className="w-full h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl mb-6 flex items-center justify-center">
                      <Book className="w-16 h-16 text-primary-400" />
                    </div>
                    
                    {/* Course Info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.tier === 'free' ? 'bg-neon-green/20 text-neon-green' :
                          course.tier === 'standard' ? 'bg-primary-500/20 text-primary-400' :
                          'bg-neon-purple/20 text-neon-purple'
                        }`}>
                          {course.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-dark-text-secondary">{course.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-display font-semibold text-dark-text-primary group-hover:gradient-text transition-all duration-300">
                        {course.title}
                      </h3>
                      
                      <p className="text-dark-text-secondary text-sm leading-relaxed">
                        {course.description}
                      </p>
                      
                      {/* Course Meta */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-dark-border-primary">
                        <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                          <Users className="w-4 h-4" />
                          {course.students.toLocaleString()} students
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                          <Book className="w-4 h-4" />
                          {course.modules} modules
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                          <Award className="w-4 h-4" />
                          {course.labs} labs
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <div className="w-full btn-primary group flex items-center justify-center gap-2">
                        Start Learning
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}