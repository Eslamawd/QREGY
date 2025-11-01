import FAQ from "@/components/Home/FAQ";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import MenuSection from "@/components/Home/MenuSection";
import SubscriptionPlans from "@/components/Home/SubscriptionPlans";
import TestimonialsCarousel from "@/components/Home/TestimonialsCarousel";
import UsersCounterSection from "@/components/Home/UsersCounterSection";
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FAQ />
      <UsersCounterSection />
      <TestimonialsCarousel />
      <SubscriptionPlans />
      <MenuSection />
    </>
  );
}
