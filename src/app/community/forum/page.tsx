"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  ThumbsUp, 
  Reply, 
  Send,
  Users,
  Award,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/access";

interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    tier: string;
  };
  courseId?: string;
  replies: number;
  likes: number;
  createdAt: string;
  tags: string[];
}

export default function ForumPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'all' | 'questions' | 'discussions' | 'success'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion' });

  // Mock forum posts
  const [posts, setPosts] = useState<DiscussionPost[]>([
    {
      id: '1',
      title: 'How do I optimize Lambda cold starts?',
      content: 'I\'m working on a serverless project and experiencing 3-5 second cold starts. Any tips on reducing this?',
      author: {
        name: 'Alex Rodriguez',
        tier: 'standard'
      },
      courseId: 'serverless-architecture',
      replies: 8,
      likes: 15,
      createdAt: '2025-11-01T10:30:00Z',
      tags: ['AWS Lambda', 'Performance', 'Question']
    },
    {
      id: '2',
      title: 'Just passed my AWS Solutions Architect exam! 🎉',
      content: 'After 3 months of studying with CloudCrew Academy, I finally passed! The hands-on labs were crucial. Happy to answer questions!',
      author: {
        name: 'Jordan Chen',
        tier: 'standard'
      },
      replies: 24,
      likes: 89,
      createdAt: '2025-10-31T15:45:00Z',
      tags: ['Success Story', 'AWS Certification']
    },
    {
      id: '3',
      title: 'DynamoDB vs RDS - when to use which?',
      content: 'I\'m designing a new app and can\'t decide between DynamoDB and RDS. What are the key factors to consider?',
      author: {
        name: 'Maria Santos',
        tier: 'free'
      },
      courseId: 'aws-fundamentals',
      replies: 12,
      likes: 34,
      createdAt: '2025-10-31T09:20:00Z',
      tags: ['Database', 'Architecture', 'Question']
    },
    {
      id: '4',
      title: 'Free AWS credits for students?',
      content: 'Does anyone know how to get AWS credits for learning? I\'m on a tight budget.',
      author: {
        name: 'David Kim',
        tier: 'free'
      },
      replies: 6,
      likes: 18,
      createdAt: '2025-10-30T14:10:00Z',
      tags: ['Resources', 'Question']
    },
    {
      id: '5',
      title: 'Cloud Security best practices discussion',
      content: 'Let\'s discuss the most important security practices everyone should implement from day one.',
      author: {
        name: 'Sarah Johnson',
        tier: 'standard'
      },
      courseId: 'cloud-security',
      replies: 31,
      likes: 67,
      createdAt: '2025-10-29T11:00:00Z',
      tags: ['Security', 'Best Practices', 'Discussion']
    }
  ]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleCreatePost = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setIsCreating(true);
  };

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in all fields');
      return;
    }

    // Mock post creation
    const post: DiscussionPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: {
        name: 'You',
        tier: localStorage.getItem('subscriptionTier') || 'free'
      },
      replies: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      tags: [newPost.category]
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'discussion' });
    setIsCreating(false);
  };

  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'questions' && !post.tags.includes('Question')) return false;
    if (activeCategory === 'discussions' && !post.tags.includes('Discussion')) return false;
    if (activeCategory === 'success' && !post.tags.includes('Success Story')) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        {/* Header */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-display font-bold text-dark-text-primary mb-2">
                  Community Forum
                </h1>
                <p className="text-dark-text-secondary">
                  Ask questions, share knowledge, and connect with fellow cloud engineers
                </p>
              </div>
              <button
                onClick={handleCreatePost}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                New Post
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="card text-center">
                <Users className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text-primary">1,250+</p>
                <p className="text-dark-text-muted text-sm">Active Members</p>
              </div>
              <div className="card text-center">
                <MessageCircle className="w-8 h-8 text-success-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text-primary">5,430</p>
                <p className="text-dark-text-muted text-sm">Discussions</p>
              </div>
              <div className="card text-center">
                <Award className="w-8 h-8 text-warning-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text-primary">342</p>
                <p className="text-dark-text-muted text-sm">Solutions</p>
              </div>
              <div className="card text-center">
                <TrendingUp className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-text-primary">89%</p>
                <p className="text-dark-text-muted text-sm">Response Rate</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="card mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary'
                    }`}
                  >
                    All Posts
                  </button>
                  <button
                    onClick={() => setActiveCategory('questions')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeCategory === 'questions'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary'
                    }`}
                  >
                    Questions
                  </button>
                  <button
                    onClick={() => setActiveCategory('discussions')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeCategory === 'discussions'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary'
                    }`}
                  >
                    Discussions
                  </button>
                  <button
                    onClick={() => setActiveCategory('success')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeCategory === 'success'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary'
                    }`}
                  >
                    Success Stories
                  </button>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>
            </div>

            {/* Create Post Modal */}
            {isCreating && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Create New Post</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-dark-text-secondary mb-2">Title</label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="What's your question or topic?"
                        className="w-full px-4 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary-400"
                      />
                    </div>

                    <div>
                      <label className="block text-dark-text-secondary mb-2">Category</label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary-400"
                      >
                        <option value="question">Question</option>
                        <option value="discussion">Discussion</option>
                        <option value="success">Success Story</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-dark-text-secondary mb-2">Content</label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Share your thoughts, ask your question, or tell your story..."
                        rows={6}
                        className="w-full px-4 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary-400"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-2 bg-dark-bg-secondary text-dark-text-secondary rounded-lg hover:bg-dark-bg-tertiary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitPost}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="card text-center py-12">
                  <MessageCircle className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
                  <p className="text-dark-text-secondary">No posts found. Be the first to start a discussion!</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="card hover:card-hover transition-all cursor-pointer">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-urban-gradient rounded-full flex items-center justify-center text-white font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-dark-text-primary hover:text-primary-400 transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-dark-text-secondary text-sm">{post.author.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                post.author.tier === 'premium' ? 'bg-warning-500/20 text-warning-400' :
                                post.author.tier === 'standard' ? 'bg-primary-500/20 text-primary-400' :
                                'bg-success-500/20 text-success-400'
                              }`}>
                                {post.author.tier}
                              </span>
                              <span className="text-dark-text-muted text-sm">• {formatTimeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-dark-text-secondary mb-3 line-clamp-2">{post.content}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-dark-bg-secondary text-dark-text-secondary text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-dark-text-muted text-sm">
                          <button className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                            <Reply className="w-4 h-4" />
                            <span>{post.replies} replies</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}
