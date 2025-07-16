import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { projects } from "@/data/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProjectCarousel() {
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filters = [
    { id: "all", label: "All Projects", icon: "🎯" },
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "finance", label: "Finance", icon: "💰" },
    { id: "healthcare", label: "Healthcare", icon: "🏥" },
    { id: "marketing", label: "Marketing", icon: "📢" },
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.domain.toLowerCase() === activeFilter);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Weekly{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Project Drops
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from projects across different domains and skill levels
          </p>
        </motion.div>

        {/* Project Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white/20 backdrop-blur-lg border-white/30 text-gray-700 hover:bg-white/30"
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </motion.div>

        {/* Project Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Featured Projects</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll("left")}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll("right")}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProjects.map((project, index) => (
              <div key={project.slug} className="flex-shrink-0 w-80">
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
