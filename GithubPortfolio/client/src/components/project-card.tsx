import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ProjectCardProps {
  project: {
    id?: number;
    title: string;
    description: string;
    domain: string;
    difficulty: string;
    duration: string;
    skillsGained: string[];
    imageUrl?: string;
    slug: string;
    tags: string[];
  };
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "difficulty-beginner";
      case "intermediate":
        return "difficulty-intermediate";
      case "advanced":
        return "difficulty-advanced";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-700";
      case "finance":
        return "bg-emerald-100 text-emerald-700";
      case "healthcare":
        return "bg-purple-100 text-purple-700";
      case "marketing":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="project-card-enhanced h-full">
        <div className="relative">
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute top-4 right-4">
            <Badge className={getDifficultyColor(project.difficulty)}>
              {project.difficulty}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge className={getDomainColor(project.domain)}>
              {project.domain}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {project.duration}
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <Badge
                key={tagIndex}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>
          
          <Link href={`/projects/${project.slug}`}>
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg">
              Start Project
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
