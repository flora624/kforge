import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { ProjectCarousel } from "@/components/project-carousel";
import { BlogSection } from "@/components/blog-section";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <ProjectCarousel />
      <BlogSection />
      <AboutSection />
    </div>
  );
}
