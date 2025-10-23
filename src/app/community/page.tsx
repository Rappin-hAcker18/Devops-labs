import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Users, MessageCircle, Calendar, Trophy, MapPin, Heart } from "lucide-react";

const communityStats = [
  { label: "Active Members", value: "10,000+", icon: Users },
  { label: "Cities Represented", value: "50+", icon: MapPin },
  { label: "Success Stories", value: "2,500+", icon: Trophy },
  { label: "Monthly Events", value: "15+", icon: Calendar }
];

const discussions = [
  {
    id: 1,
    title: "Just landed my first cloud role! 🎉",
    author: "Marcus J.",
    location: "Atlanta, GA",
    replies: 45,
    likes: 128,
    time: "2 hours ago",
    tag: "Success Story"
  },
  {
    id: 2,
    title: "AWS Lambda vs Azure Functions - which should I learn first?",
    author: "Priya P.",
    location: "Chicago, IL", 
    replies: 23,
    likes: 67,
    time: "4 hours ago",
    tag: "Discussion"
  },
  {
    id: 3,
    title: "Study group for AWS Solutions Architect exam?",
    author: "Jamal W.",
    location: "Brooklyn, NY",
    replies: 12,
    likes: 34,
    time: "1 day ago",
    tag: "Study Group"
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Virtual Career Fair - Cloud Engineering",
    date: "Oct 28, 2025",
    time: "2:00 PM EST",
    attendees: 245,
    type: "Career"
  },
  {
    id: 2,
    title: "AWS Lambda Workshop",
    date: "Nov 2, 2025", 
    time: "7:00 PM EST",
    attendees: 180,
    type: "Workshop"
  },
  {
    id: 3,
    title: "Urban Tech Meetup - Chicago",
    date: "Nov 8, 2025",
    time: "6:30 PM CST",
    attendees: 95,
    type: "Meetup"
  }
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Join the Community</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-text-secondary max-w-3xl mx-auto mb-8">
              Connect with fellow urban professionals, share your journey, and build your network in the cloud engineering community.
            </p>
            
            <button className="btn-neon text-lg px-8 py-4">
              Join Our Discord
              <Users className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Community Stats */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {communityStats.map((stat, index) => (
                <div key={index} className="card text-center">
                  <div className="inline-flex p-3 bg-primary-500/20 rounded-lg mb-4">
                    <stat.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="text-2xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-dark-text-secondary text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Discussions & Events */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Recent Discussions */}
              <div>
                <h2 className="text-2xl font-display font-bold text-dark-text-primary mb-6 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-primary-400" />
                  Recent Discussions
                </h2>
                
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="card-elevated hover:scale-102 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          discussion.tag === 'Success Story' ? 'bg-neon-green/20 text-neon-green' :
                          discussion.tag === 'Discussion' ? 'bg-primary-500/20 text-primary-400' :
                          'bg-neon-purple/20 text-neon-purple'
                        }`}>
                          {discussion.tag}
                        </span>
                        <span className="text-xs text-dark-text-muted">{discussion.time}</span>
                      </div>
                      
                      <h3 className="font-semibold text-dark-text-primary mb-2 hover:gradient-text transition-all duration-300 cursor-pointer">
                        {discussion.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-dark-text-secondary">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-urban-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {discussion.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{discussion.author}</span>
                          <span className="text-dark-text-muted">• {discussion.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {discussion.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {discussion.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full btn-outline mt-6">
                  View All Discussions
                </button>
              </div>

              {/* Upcoming Events */}
              <div>
                <h2 className="text-2xl font-display font-bold text-dark-text-primary mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-accent-400" />
                  Upcoming Events
                </h2>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="card-elevated hover:scale-102 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.type === 'Career' ? 'bg-neon-green/20 text-neon-green' :
                          event.type === 'Workshop' ? 'bg-primary-500/20 text-primary-400' :
                          'bg-accent-500/20 text-accent-400'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-xs text-dark-text-muted">{event.attendees} attending</span>
                      </div>
                      
                      <h3 className="font-semibold text-dark-text-primary mb-2 hover:gradient-text transition-all duration-300 cursor-pointer">
                        {event.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-dark-text-secondary">
                        <div className="flex items-center gap-4">
                          <span>{event.date}</span>
                          <span>{event.time}</span>
                        </div>
                        
                        <button className="btn-outline py-1 px-3 text-sm">
                          RSVP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full btn-outline mt-6">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="section-padding bg-dark-bg-secondary/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-dark-text-primary mb-6">
              Community Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="font-semibold text-dark-text-primary mb-2">Be Respectful</h3>
                <p className="text-dark-text-secondary text-sm">Treat everyone with respect and kindness</p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-dark-text-primary mb-2">Share Knowledge</h3>
                <p className="text-dark-text-secondary text-sm">Help others learn and grow together</p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-dark-text-primary mb-2">Stay Professional</h3>
                <p className="text-dark-text-secondary text-sm">Keep discussions relevant and constructive</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}