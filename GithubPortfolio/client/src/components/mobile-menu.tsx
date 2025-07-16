import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ href: string; label: string }>;
  onAuthClick: (mode: "login" | "signup") => void;
}

export function MobileMenu({ isOpen, onClose, navItems, onAuthClick }: MobileMenuProps) {
  const { user, logout } = useAuth();

  const handleAuthClick = (mode: "login" | "signup") => {
    onClose();
    onAuthClick(mode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-indigo-600">Menu</span>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className="block text-gray-700 hover:text-indigo-600 transition-colors text-lg"
                      onClick={onClose}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
                
                <div className="border-t pt-6 space-y-4">
                  {user ? (
                    <div className="space-y-4">
                      <div className="text-gray-700">Welcome, {user.displayName}</div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleAuthClick("login")}
                        className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => handleAuthClick("signup")}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
