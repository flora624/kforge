import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),
  skillsGained: json("skills_gained").$type<string[]>().notNull(),
  problemStatement: text("problem_statement").notNull(),
  imageUrl: text("image_url"),
  slug: text("slug").notNull().unique(),
  tags: json("tags").$type<string[]>().notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  tags: json("tags").$type<string[]>().notNull(),
  readTime: text("read_time").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
});

export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  status: text("status").notNull().default("enrolled"),
  progress: integer("progress").default(0),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export const insertUserProjectSchema = createInsertSchema(userProjects).omit({
  id: true,
  enrolledAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertUserProject = z.infer<typeof insertUserProjectSchema>;
export type UserProject = typeof userProjects.$inferSelect;
