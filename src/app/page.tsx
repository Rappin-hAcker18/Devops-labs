import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { PaymentTiers } from "@/components/sections/PaymentTiers";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <PaymentTiers />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}