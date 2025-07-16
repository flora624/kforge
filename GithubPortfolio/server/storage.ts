import { 
  users, 
  projects, 
  blogPosts, 
  userProjects,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type BlogPost,
  type InsertBlogPost,
  type UserProject,
  type InsertUserProject
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProjects(filters?: { domain?: string; difficulty?: string; search?: string }): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  
  getUserProject(userId: number, projectId: number): Promise<UserProject | undefined>;
  createUserProject(userProject: InsertUserProject): Promise<UserProject>;
  getUserProjects(userId: number): Promise<UserProject[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private blogPosts: Map<number, BlogPost>;
  private userProjects: Map<number, UserProject>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentBlogPostId: number;
  private currentUserProjectId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.blogPosts = new Map();
    this.userProjects = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentBlogPostId = 1;
    this.currentUserProjectId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample projects
    const sampleProjects: Omit<Project, 'id' | 'createdAt'>[] = [
      {
        title: "E-commerce Analytics Dashboard",
        description: "Build a comprehensive analytics dashboard for tracking e-commerce metrics, sales performance, and customer behavior using modern data visualization techniques.",
        domain: "Technology",
        difficulty: "Intermediate",
        duration: "6-8 weeks",
        skillsGained: ["React", "Data Visualization", "API Integration", "Dashboard Design"],
        problemStatement: "Online retailers need better insights into their sales data, customer behavior, and inventory management to make informed business decisions.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        slug: "ecommerce-analytics-dashboard",
        tags: ["React", "Charts", "Analytics", "Dashboard"],
        isActive: true
      },
      {
        title: "AI-Powered Content Moderation System",
        description: "Develop an intelligent content moderation system that uses machine learning to automatically detect and filter inappropriate content across different media types.",
        domain: "Technology",
        difficulty: "Advanced",
        duration: "10-12 weeks",
        skillsGained: ["Machine Learning", "Natural Language Processing", "Python", "Content Analysis"],
        problemStatement: "Social media platforms and online communities struggle with manually moderating large volumes of user-generated content while maintaining accuracy and speed.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        slug: "ai-content-moderation-system",
        tags: ["AI", "Machine Learning", "Python", "Content Moderation"],
        isActive: true
      }
    ];

    sampleProjects.forEach(project => {
      const id = this.currentProjectId++;
      const fullProject: Project = {
        ...project,
        id,
        createdAt: new Date()
      };
      this.projects.set(id, fullProject);
    });

    // Add sample blog posts
    const sampleBlogPosts: Omit<BlogPost, 'id' | 'publishedAt'>[] = [
      {
        title: "The Future of Project-Based Learning",
        excerpt: "Exploring how hands-on projects are revolutionizing education and skill development in the digital age.",
        content: "Project-based learning is transforming how we acquire new skills...",
        slug: "future-of-project-based-learning",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        tags: ["Education", "Learning", "Skills"],
        readTime: "5 min read",
        isPublished: true
      }
    ];

    sampleBlogPosts.forEach(post => {
      const id = this.currentBlogPostId++;
      const fullPost: BlogPost = {
        ...post,
        id,
        publishedAt: new Date()
      };
      this.blogPosts.set(id, fullPost);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username, // Using email as username since username field doesn't exist
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getProjects(filters?: { domain?: string; difficulty?: string; search?: string }): Promise<Project[]> {
    let projects = Array.from(this.projects.values()).filter(p => p.isActive);
    
    if (filters?.domain) {
      projects = projects.filter(p => p.domain === filters.domain);
    }
    
    if (filters?.difficulty) {
      projects = projects.filter(p => p.difficulty === filters.difficulty);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return projects;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(p => p.slug === slug && p.isActive);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(p => p.isPublished);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug && p.isPublished);
  }

  async getUserProject(userId: number, projectId: number): Promise<UserProject | undefined> {
    return Array.from(this.userProjects.values()).find(
      up => up.userId === userId && up.projectId === projectId
    );
  }

  async createUserProject(insertUserProject: InsertUserProject): Promise<UserProject> {
    const id = this.currentUserProjectId++;
    const userProject: UserProject = {
      id,
      userId: insertUserProject.userId || null,
      projectId: insertUserProject.projectId || null,
      status: insertUserProject.status || "enrolled",
      progress: insertUserProject.progress || 0,
      enrolledAt: new Date()
    };
    this.userProjects.set(id, userProject);
    return userProject;
  }

  async getUserProjects(userId: number): Promise<UserProject[]> {
    return Array.from(this.userProjects.values()).filter(up => up.userId === userId);
  }
}

export const storage = new MemStorage();
