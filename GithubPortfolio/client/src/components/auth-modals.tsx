import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthModalsProps {
  showModal: "login" | "signup" | null;
  onClose: () => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}

export function AuthModals({ showModal, onClose, onSwitchMode }: AuthModalsProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    remember: false,
    agreeTerms: false,
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (showModal === "signup" && !formData.agreeTerms) {
        toast({
          title: "Error",
          description: "Please agree to the terms and conditions",
          variant: "destructive",
        });
        return;
      }

      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Authentication successful!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {showModal === "login" ? "Welcome Back" : "Start Your Journey"}
              </h2>
              <p className="text-gray-600">
                {showModal === "login" 
                  ? "Sign in to continue your learning journey" 
                  : "Create an account to access all projects"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {showModal === "signup" && (
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder={showModal === "login" ? "Enter your password" : "Create a password"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                />
              </div>

              {showModal === "login" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) => handleInputChange("remember", checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-sm text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                {showModal === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {showModal === "login" ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  onClick={() => onSwitchMode(showModal === "login" ? "signup" : "login")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {showModal === "login" ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
