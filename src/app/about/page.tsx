import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Target, Users, Award, Zap, Heart, Globe } from "lucide-react";

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Community First",
    description: "We believe in the power of community and support every step of your journey."
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Real Opportunities",
    description: "We focus on practical skills that directly lead to high-paying career opportunities."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Urban Focus",
    description: "Built specifically for urban communities with representation and understanding."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Innovation",
    description: "We use cutting-edge technology and modern teaching methods for effective learning."
  }
];

const team = [
  {
    name: "Alex Rodriguez",
    role: "Founder & CEO",
    bio: "Former AWS Solutions Architect with 10+ years in cloud engineering. Passionate about urban tech education.",
    location: "New York, NY"
  },
  {
    name: "Maya Johnson", 
    role: "Head of Curriculum",
    bio: "Ex-Microsoft cloud engineer who built training programs for Fortune 500 companies.",
    location: "Chicago, IL"
  },
  {
    name: "Jordan Smith",
    role: "Community Manager", 
    bio: "Cloud engineering bootcamp graduate turned mentor, helping thousands transition to tech.",
    location: "Atlanta, GA"
  }
];

const stats = [
  { label: "Students Graduated", value: "10,000+" },
  { label: "Average Salary Increase", value: "$35K" },
  { label: "Job Placement Rate", value: "95%" },
  { label: "Partner Companies", value: "200+" }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">About CloudCrew Academy</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-text-secondary max-w-3xl mx-auto">
              We&apos;re on a mission to democratize cloud engineering education and create economic opportunities in urban communities across America.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-dark-text-primary mb-6">
                  Our Mission
                </h2>
                <p className="text-dark-text-secondary leading-relaxed mb-6">
                  Cloud engineering is one of the fastest-growing and highest-paying fields in technology, but it remains largely inaccessible to urban communities. We&apos;re changing that.
                </p>
                <p className="text-dark-text-secondary leading-relaxed mb-6">
                  CloudCrew Academy was founded by urban professionals who understand the unique challenges and strengths of our communities. We provide world-class cloud engineering education with cultural relevance, community support, and direct pathways to economic opportunity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-neon-green">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">Industry Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-neon-cyan">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Community Built</span>
                  </div>
                </div>
              </div>
              
              <div className="card-elevated">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold gradient-text mb-2">{stat.value}</div>
                      <div className="text-dark-text-secondary text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-dark-bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center text-dark-text-primary mb-12">
              Our Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="card text-center group hover:scale-105 transition-all duration-300">
                  <div className="inline-flex p-3 bg-primary-500/20 rounded-lg mb-4 group-hover:bg-primary-500/30 transition-colors duration-300">
                    <div className="text-primary-400">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-dark-text-primary mb-3 group-hover:gradient-text transition-all duration-300">
                    {value.title}
                  </h3>
                  <p className="text-dark-text-secondary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center text-dark-text-primary mb-12">
              Meet Our Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="card-elevated text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-24 h-24 bg-urban-gradient rounded-full flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-6">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <h3 className="font-display font-semibold text-dark-text-primary mb-2 group-hover:gradient-text transition-all duration-300">
                    {member.name}
                  </h3>
                  
                  <div className="text-primary-400 font-medium mb-3">{member.role}</div>
                  
                  <p className="text-dark-text-secondary text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="text-dark-text-muted text-xs">{member.location}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-dark-bg-secondary/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-dark-text-primary mb-8">
              Our Story
            </h2>
            
            <div className="card-elevated text-left">
              <p className="text-dark-text-secondary leading-relaxed mb-6">
                CloudCrew Academy started in 2023 when our founder, Alex Rodriguez, noticed a glaring gap in tech education. Despite growing up in the Bronx and working his way through community college to become a successful cloud architect, Alex saw that most coding bootcamps and tech programs weren&apos;t reaching urban communities.
              </p>
              
              <p className="text-dark-text-secondary leading-relaxed mb-6">
                After mentoring dozens of aspiring developers from urban backgrounds, Alex realized that traditional tech education often ignored the unique challenges and strengths of urban learners. The curriculum was generic, the community was missing, and the pathways to employment were unclear.
              </p>
              
              <p className="text-dark-text-secondary leading-relaxed">
                CloudCrew Academy was built to bridge this gap - combining world-class technical education with cultural understanding, community support, and direct industry connections. Today, we&apos;re proud to have helped thousands of urban professionals transition into high-paying cloud engineering careers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card bg-urban-gradient p-12">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Ready to Join Our Mission?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Whether you&apos;re looking to start your cloud engineering journey or want to support our mission, we&apos;d love to have you in our community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 hover:bg-white/90 font-semibold py-4 px-8 rounded-xl transition-all duration-300">
                  Start Learning
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300">
                  Partner With Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}