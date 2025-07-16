import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModals } from "./auth-modals";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<"login" | "signup" | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-lg shadow-lg navbar-scrolled"
            : "bg-gray-900/90 backdrop-blur-lg navbar-enhanced"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <a className="text-2xl font-bold text-white hover:text-gray-200 transition-colors flex items-center">
                <span className="text-3xl mr-2">⚒️</span>
                SkillForge
              </a>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className={`text-gray-200 hover:text-white transition-colors relative group font-medium ${
                    location === item.href ? "text-white" : ""
                  }`}>
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-300 group-hover:w-full" />
                    {location === item.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-teal-400" />
                    )}
                  </a>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-200">Welcome, {user.displayName}</span>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => setShowAuthModal("login")}
                    variant="ghost"
                    className="text-gray-200 hover:text-white hover:bg-gray-800"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowAuthModal("signup")}
                    className="btn-gradient hover:scale-105 transition-transform"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onAuthClick={setShowAuthModal}
      />

      {/* Auth Modals */}
      <AuthModals
        showModal={showAuthModal}
        onClose={() => setShowAuthModal(null)}
        onSwitchMode={setShowAuthModal}
      />
    </>
  );
}
