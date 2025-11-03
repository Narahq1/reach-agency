import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "client"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - Companies using Reach+ Agency services
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  description: text("description"),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Contacts table - Form submissions and inquiries
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Budgets table - Budget request forms
 */
export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  services: json("services").$type<string[]>().notNull(), // Array of selected services
  budget: varchar("budget", { length: 50 }), // e.g., "5000-10000"
  timeline: varchar("timeline", { length: 100 }),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "quoted", "accepted", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  quotedAt: timestamp("quotedAt"),
  quotedPrice: decimal("quotedPrice", { precision: 12, scale: 2 }),
});

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

/**
 * Messages table - Communication between clients and agency
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  senderId: int("senderId").notNull(),
  senderType: mysqlEnum("senderType", ["client", "agency"]).notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Reports table - Performance reports for clients
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  month: varchar("month", { length: 7 }), // YYYY-MM format
  metrics: json("metrics").$type<Record<string, number>>().notNull(), // Key-value metrics
  summary: text("summary"),
  attachmentUrl: varchar("attachmentUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Portfolio items table - Case studies and portfolio projects
 */
export const portfolioItems = mysqlTable("portfolioItems", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  resultMetric: varchar("resultMetric", { length: 100 }), // e.g., "+150% ROI"
  resultDescription: text("resultDescription"),
  clientName: varchar("clientName", { length: 255 }),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioItems.$inferInsert;

/**
 * Services table - Available services offered by Reach+
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }), // Font Awesome icon class
  features: json("features").$type<string[]>(), // Array of feature descriptions
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
