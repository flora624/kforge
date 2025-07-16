import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Code, Award } from "lucide-react";

export function AboutSection() {
  const stats = [
    { label: "Projects Available", value: "500+", color: "text-indigo-600" },
    { label: "Students Enrolled", value: "10,000+", color: "text-emerald-600" },
    { label: "Job Placement Rate", value: "85%", color: "text-purple-600" },
  ];

  const teamStats = [
    { label: "Former Google Engineers", value: "3", color: "text-indigo-600" },
    { label: "Education Specialists", value: "5", color: "text-emerald-600" },
    { label: "Industry Mentors", value: "50+", color: "text-purple-600" },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bridging the gap between academic learning and industry readiness through practical, real-world projects
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Mission Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-6">Transforming Education Through Experience</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At SkillForge, we believe that the best way to learn is by doing. Traditional education often leaves students with theoretical knowledge but lacks practical application. We're changing that by providing hands-on projects that mirror real industry challenges.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our platform connects ambitious learners with experienced industry mentors who design projects based on actual workplace scenarios. Every project is carefully crafted to build not just technical skills, but also the problem-solving mindset that employers value most.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team/Founder Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/30 transition-all duration-300 hover:shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                alt="Diverse team collaborating on educational technology"
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
              />
              <h4 className="text-2xl font-bold mb-3">Meet Our Team</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our diverse team of educators, developers, and industry professionals work together to create the most effective learning experiences possible.
              </p>
              <div className="space-y-4">
                {teamStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{stat.label}</span>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
