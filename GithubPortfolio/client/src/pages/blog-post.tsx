import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { blogPosts } from "@/data/blog-posts";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const [scrollProgress, setScrollProgress] = useState(0);
  const post = blogPosts.find(p => p.slug === params?.slug);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tableOfContents = [
    { title: "Introduction", href: "#introduction" },
    { title: "Technical Skills", href: "#technical-skills" },
    { title: "Soft Skills", href: "#soft-skills" },
    { title: "Conclusion", href: "#conclusion" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/blog" className="hover:text-purple-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <Link href="/blog">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Jan 15, 2024
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
              </div>
            </motion.div>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  alt="Author"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold">John Doe</h4>
                  <p className="text-gray-600">Senior Software Engineer at TechCorp</p>
                  <p className="text-sm text-gray-500 mt-1">
                    John has over 10 years of experience in software development and mentoring.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-white/20 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Table of Contents
                    </h3>
                    <div className="space-y-2">
                      {tableOfContents.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="block text-sm text-gray-600 hover:text-purple-600 transition-colors py-1"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Related Articles */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="bg-white/20 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {blogPosts.slice(0, 3).filter(p => p.slug !== post.slug).map((relatedPost, index) => (
                        <Link key={index} href={`/blog/${relatedPost.slug}`}>
                          <div className="flex items-center gap-3 p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors cursor-pointer">
                            <img
                              src={relatedPost.imageUrl}
                              alt={relatedPost.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{relatedPost.title}</h4>
                              <p className="text-xs text-gray-600">{relatedPost.readTime}</p>
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
