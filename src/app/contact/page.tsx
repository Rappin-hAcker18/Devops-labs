"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Phone, Mail, Calendar, Building2, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type FormState = {
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  interestedPlan: string;
  timeline: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  company: "",
  teamSize: "",
  interestedPlan: "",
  timeline: "",
  message: "",
};

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan");

    if (plan && !formState.interestedPlan) {
      setFormState((prev) => ({
        ...prev,
        interestedPlan: plan === "premium" ? "Premium (Elite)" : "Standard (All Access)",
      }));
    }
  }, [searchParams, formState.interestedPlan]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccessMessage("Thanks for reaching out. Our team will contact you within one business day.");
      setFormState(initialState);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send your message right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />

      <div className="pt-20 pb-24">
        <section className="section-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-500/10 text-primary-300 text-sm font-medium">
                Talk with CloudCrew
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl font-display font-bold text-dark-text-primary">
                Let’s build your cloud talent pipeline
              </h1>
              <p className="mt-4 text-lg text-dark-text-secondary max-w-2xl mx-auto">
                Share a few details and our sales team will craft a plan that fits your goals, budget, and hiring timeline.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="card-elevated p-8 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-dark-text-primary mb-2">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formState.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Jordan Williams"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-dark-text-primary mb-2">
                        Work email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        placeholder="jordan@company.com"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-dark-text-primary mb-2">
                        Company or organization
                      </label>
                      <input
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        placeholder="Urban Tech Collective"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="teamSize" className="block text-sm font-medium text-dark-text-primary mb-2">
                        Team size
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formState.teamSize}
                        onChange={handleChange}
                        className="input w-full"
                      >
                        <option value="">Select</option>
                        <option value="1-9">1-9 learners</option>
                        <option value="10-49">10-49 learners</option>
                        <option value="50-199">50-199 learners</option>
                        <option value="200+">200+ learners</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="interestedPlan" className="block text-sm font-medium text-dark-text-primary mb-2">
                        Interested plan
                      </label>
                      <select
                        id="interestedPlan"
                        name="interestedPlan"
                        value={formState.interestedPlan}
                        onChange={handleChange}
                        className="input w-full"
                      >
                        <option value="">Decide with sales</option>
                        <option value="Free Starter">Free Starter</option>
                        <option value="Standard (All Access)">Standard (All Access)</option>
                        <option value="Premium (Elite)">Premium (Elite)</option>
                        <option value="Enterprise">Enterprise custom</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-dark-text-primary mb-2">
                        Desired start
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formState.timeline}
                        onChange={handleChange}
                        className="input w-full"
                      >
                        <option value="">Select</option>
                        <option value="ASAP">ASAP</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-dark-text-primary mb-2">
                      How can we help?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your goals, cohort details, and what support you need."
                      className="input w-full resize-none"
                    />
                  </div>

                  {successMessage && (
                    <div className="rounded-lg border border-success-500/40 bg-success-500/10 px-4 py-3 text-sm text-success-300">
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-urban-gradient text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send message"
                    )}
                  </button>

                  <p className="text-xs text-dark-text-muted text-center">
                    By submitting this form, you agree to be contacted about CloudCrew Academy programs and services.
                  </p>
                </form>
              </div>

              <aside className="space-y-6">
                <div className="card-elevated p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-dark-text-primary">
                      Prefer to reach out directly?
                    </h2>
                    <p className="mt-2 text-sm text-dark-text-secondary">
                      Meet the team that helps workforce programs and employers upskill talent for cloud careers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="tel:+13472001234"
                      className="flex items-start gap-3 rounded-lg border border-dark-border-primary/60 bg-dark-bg-secondary/40 px-4 py-3 hover:border-primary-500/60 transition-colors duration-200"
                    >
                      <div className="mt-1 rounded-full bg-primary-500/15 p-2 text-primary-300">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-text-primary">Talk with sales</p>
                        <p className="text-sm text-dark-text-secondary">+1 (347) 200-1234</p>
                      </div>
                    </a>

                    <a
                      href="mailto:sales@cloudcrew.academy"
                      className="flex items-start gap-3 rounded-lg border border-dark-border-primary/60 bg-dark-bg-secondary/40 px-4 py-3 hover:border-primary-500/60 transition-colors duration-200"
                    >
                      <div className="mt-1 rounded-full bg-primary-500/15 p-2 text-primary-300">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-text-primary">Email the team</p>
                        <p className="text-sm text-dark-text-secondary">sales@cloudcrew.academy</p>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 rounded-lg border border-dark-border-primary/60 bg-dark-bg-secondary/40 px-4 py-3">
                      <div className="mt-1 rounded-full bg-primary-500/15 p-2 text-primary-300">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-text-primary">Schedule a session</p>
                        <p className="text-sm text-dark-text-secondary">Weekly strategy calls every Tuesday & Thursday</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-dark-border-primary/60 bg-dark-bg-secondary/40 px-4 py-3">
                      <div className="mt-1 rounded-full bg-primary-500/15 p-2 text-primary-300">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-text-primary">Serving programs nationwide</p>
                        <p className="text-sm text-dark-text-secondary">
                          Workforce agencies, HBCUs, community colleges, and employer academies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-elevated p-8 space-y-4">
                  <h3 className="text-lg font-display font-semibold text-dark-text-primary">
                    What happens next?
                  </h3>
                  <ul className="space-y-3 text-sm text-dark-text-secondary">
                    <li>
                      1. A CloudCrew advisor reaches out within 24 hours.
                    </li>
                    <li>
                      2. We align on your goals, cohorts, and program outcomes.
                    </li>
                    <li>
                      3. You receive a tailored proposal with pricing and next steps.
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
