import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Database, Smartphone } from "lucide-react";

export function Hero() {
  const handleExploreProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const floatingCards = [
    {
      title: "E-commerce Platform",
      description: "Build a full-stack shopping platform",
      tags: ["React", "Node.js"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      delay: 0,
      position: "top-20 left-10",
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time data visualization",
      tags: ["D3.js", "Python"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      delay: 2,
      position: "top-32 right-16",
    },
    {
      title: "Fitness Tracking App",
      description: "Mobile health & wellness platform",
      tags: ["Flutter", "Firebase"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      delay: 4,
      position: "bottom-32 left-20",
    },
  ];

  const blobVariants = {
    animate: {
      scale: [1, 1.1, 0.9, 1],
      rotate: [0, 180, 360],
      x: [0, 30, -20, 0],
      y: [0, -50, 20, 0],
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gray-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 rounded-full"
          variants={blobVariants}
          animate="animate"
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-15 rounded-full"
          variants={blobVariants}
          animate="animate"
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 7 }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-20 rounded-full"
          variants={blobVariants}
          animate="animate"
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 14 }}
        />
      </div>

      {/* Floating Project Cards */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {floatingCards.map((card, index) => (
          <motion.div
            key={index}
            className={`absolute ${card.position} w-64 h-40 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 0.8,
              delay: card.delay * 0.2,
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay * 0.5,
              }
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-20 object-cover rounded-lg mb-2"
            />
            <h4 className="font-semibold text-sm mb-1">{card.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{card.description}</p>
            <div className="flex gap-1">
              {card.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title text-white">
            Turn Theory into Tangible Skills
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Tackle real-world problems from every career domain. Build a portfolio that gets you hired.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleExploreProjects}
            size="lg"
            className="btn-gradient text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Browse Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
