import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the SkillForge application
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, name, firebaseUid } = req.body;
      
      if (!email || !name || !firebaseUid) {
        return res.status(400).json({ 
          error: "Missing required fields: email, name, firebaseUid" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: "User already exists" 
        });
      }

      const user = await storage.createUser({
        email,
        name,
        firebaseUid,
      });

      res.json(user);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const { domain, difficulty, search } = req.query;
      const projects = await storage.getProjects({
        domain: domain as string,
        difficulty: difficulty as string,
        search: search as string,
      });
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const project = await storage.getProjectBySlug(slug);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Get blog post error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User project enrollment
  app.post("/api/user-projects/enroll", async (req, res) => {
    try {
      const { userId, projectId } = req.body;
      
      if (!userId || !projectId) {
        return res.status(400).json({ 
          error: "Missing required fields: userId, projectId" 
        });
      }

      // Check if user is already enrolled
      const existingEnrollment = await storage.getUserProject(userId, projectId);
      if (existingEnrollment) {
        return res.status(409).json({ 
          error: "User already enrolled in this project" 
        });
      }

      const userProject = await storage.createUserProject({
        userId,
        projectId,
        status: "enrolled",
        progress: 0,
      });

      res.json(userProject);
    } catch (error) {
      console.error("Enrollment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user-projects/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userProjects = await storage.getUserProjects(parseInt(userId));
      res.json(userProjects);
    } catch (error) {
      console.error("Get user projects error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          error: "Email is required" 
        });
      }

      // In a real implementation, this would integrate with an email service
      // For now, we'll just return success
      res.json({ 
        message: "Successfully subscribed to newsletter",
        email 
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
