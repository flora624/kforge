import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { ArrowLeft, Clock, Users, Star, Calendar, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { projects } from "@/data/projects";

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:slug");
  const [scrollProgress, setScrollProgress] = useState(0);
  const project = projects.find(p => p.slug === params?.slug);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/projects" className="hover:text-indigo-600">Projects</Link>
          <span>/</span>
          <span className="text-gray-900">{project.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <Link href="/projects">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                  </Button>
                </Link>
                <Badge className={`${project.domain === "Technology" ? "bg-blue-100 text-blue-700" : 
                  project.domain === "Finance" ? "bg-emerald-100 text-emerald-700" :
                  project.domain === "Healthcare" ? "bg-purple-100 text-purple-700" :
                  "bg-pink-100 text-pink-700"}`}>
                  {project.domain}
                </Badge>
                <Badge variant="outline">{project.difficulty}</Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{project.description}</p>

              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {project.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  1,234 enrolled
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  4.8 rating
                </div>
              </div>
            </motion.div>

            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed">{project.problemStatement}</p>
            </motion.div>

            {/* Skills & Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-4">Skills You'll Gain</h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsGained.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Project Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-6">Project Milestones</h2>
              <div className="space-y-4">
                {[
                  { title: "Setup & Planning", description: "Environment setup and project planning", status: "completed" },
                  { title: "Core Development", description: "Build the main functionality", status: "in-progress" },
                  { title: "Testing & Debugging", description: "Comprehensive testing and bug fixes", status: "pending" },
                  { title: "Deployment & Documentation", description: "Deploy and create documentation", status: "pending" },
                ].map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/30 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      milestone.status === "completed" ? "bg-green-500" :
                      milestone.status === "in-progress" ? "bg-yellow-500" :
                      "bg-gray-300"
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-white/20 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold mb-2">Free</div>
                      <p className="text-gray-600">Full access to all materials</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Project
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Materials
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Sample Resume
                      </Button>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Self-paced learning
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Community support
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Certificate of completion
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Related Projects */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="bg-white/20 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Projects</h3>
                    <div className="space-y-4">
                      {projects.slice(0, 3).filter(p => p.slug !== project.slug).map((relatedProject, index) => (
                        <Link key={index} href={`/projects/${relatedProject.slug}`}>
                          <div className="flex items-center gap-3 p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors cursor-pointer">
                            <img
                              src={relatedProject.imageUrl}
                              alt={relatedProject.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{relatedProject.title}</h4>
                              <p className="text-xs text-gray-600">{relatedProject.domain}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
