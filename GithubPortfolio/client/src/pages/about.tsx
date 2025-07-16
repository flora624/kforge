import { motion } from "framer-motion";
import { AboutSection } from "@/components/about-section";
import { Users, Target, Award, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Purpose-Driven Learning",
      description: "Every project has a clear purpose and real-world application, ensuring your time is well-invested.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We believe in the power of community support and peer learning to accelerate growth.",
    },
    {
      icon: Award,
      title: "Excellence in Education",
      description: "We maintain the highest standards in project design and educational content quality.",
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Your success is our success. We're committed to helping you achieve your career goals.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SkillForge</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming the way students learn through practical, industry-relevant projects
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 mb-16 border border-white/20"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              We envision a world where every student has access to practical, hands-on learning experiences that prepare them for successful careers. By bridging the gap between academic theory and industry practice, we're creating the next generation of skilled professionals who can tackle real-world challenges from day one.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* About Section Component */}
        <AboutSection />

        {/* Story Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">The Problem</h3>
                <p className="text-gray-600">
                  We noticed that students were graduating with theoretical knowledge but lacked practical skills needed in the workplace.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">The Solution</h3>
                <p className="text-gray-600">
                  We created SkillForge to provide hands-on, project-based learning experiences that mirror real industry challenges.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">The Impact</h3>
                <p className="text-gray-600">
                  Today, thousands of students have successfully transitioned from learning to earning through our platform.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
