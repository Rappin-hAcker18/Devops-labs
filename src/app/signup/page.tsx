"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { UserPlus, Lock, Mail, Eye, EyeOff, User, Phone, MapPin, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    phone: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo signup - just store the data and redirect
      localStorage.setItem('authToken', 'demo-token-' + Date.now());
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('subscriptionTier', selectedPlan);
      
      // Redirect based on selected plan
      if (selectedPlan === 'free') {
        router.push('/courses');
      } else {
        router.push(`/checkout?plan=${selectedPlan}`);
      }
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignup = async () => {
    setIsLoading(true);
    
    // Instant demo signup
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('userEmail', 'demo@cloudcrew.academy');
    localStorage.setItem('subscriptionTier', 'free');
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    router.push('/courses');
  };

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: ["Course previews", "Community access", "Basic resources"]
    },
    {
      id: "standard",
      name: "Standard",
      price: "$49",
      period: "/month", 
      description: "Full course access",
      features: ["All courses", "Hands-on labs", "Certification", "Email support"],
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      price: "$149",
      period: "/month",
      description: "Complete career transformation",
      features: ["Everything in Standard", "1-on-1 mentoring", "Career services", "Job placement support"]
    }
  ];

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        <section className="section-padding">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-primary-500/20 rounded-full mb-6">
                <UserPlus className="w-8 h-8 text-primary-400" />
              </div>
              <h1 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
                Join CloudCrew Academy
              </h1>
              <p className="text-dark-text-secondary">
                Start your cloud engineering journey and unlock new economic opportunities
              </p>
            </div>

            {/* Plan Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-display font-semibold text-dark-text-primary mb-4 text-center">
                Choose Your Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`card cursor-pointer transition-all duration-300 relative ${
                      selectedPlan === plan.id
                        ? "ring-2 ring-primary-400 bg-primary-500/10"
                        : "hover:border-primary-500/50"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-urban-gradient text-white text-xs font-medium px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="font-display font-semibold text-dark-text-primary mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-3">
                        <span className="text-2xl font-bold gradient-text">{plan.price}</span>
                        <span className="text-dark-text-muted">{plan.period}</span>
                      </div>
                      <p className="text-sm text-dark-text-secondary mb-4">{plan.description}</p>
                      
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-dark-text-secondary">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={() => setSelectedPlan(plan.id)}
                      className="absolute top-4 right-4 w-4 h-4 text-primary-400"
                      aria-label={`Select ${plan.name} plan`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Signup Form */}
            <div className="card-elevated">
              <form className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        placeholder="Your first name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        placeholder="Your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                      <input
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-secondary transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-secondary transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-400 bg-dark-bg-secondary border-dark-border rounded focus:ring-primary-400 focus:ring-2 mt-1"
                    required
                    aria-label="Accept Terms of Service and Privacy Policy"
                  />
                  <p className="text-sm text-dark-text-secondary">
                    I agree to the{" "}
                    <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors duration-200">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors duration-200">
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* Marketing Opt-in */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-400 bg-dark-bg-secondary border-dark-border rounded focus:ring-primary-400 focus:ring-2 mt-1"
                    aria-label="Opt in to marketing updates"
                  />
                  <p className="text-sm text-dark-text-secondary">
                    Send me updates about new courses, community events, and career opportunities
                  </p>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-urban-gradient text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? "Creating Account..." 
                    : selectedPlan === "free" 
                    ? "Create Free Account" 
                    : "Start Your Journey"
                  }
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-bg-primary text-dark-text-muted">Or sign up with</span>
                  </div>
                </div>

                {/* Social Signup Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-dark-border rounded-lg bg-dark-bg-secondary text-dark-text-primary hover:bg-dark-bg-tertiary transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-dark-border rounded-lg bg-dark-bg-secondary text-dark-text-primary hover:bg-dark-bg-tertiary transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </form>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-8">
              <p className="text-dark-text-secondary">
                Already have an account?{" "}
                <a href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}