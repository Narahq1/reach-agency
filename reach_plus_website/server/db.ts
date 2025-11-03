import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, contacts, budgets, messages, reports, portfolioItems, services } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Clients queries
export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clients).where(eq(clients.userId, userId));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Contacts queries
export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function getContactById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Budgets queries
export async function getBudgetsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(budgets).where(eq(budgets.clientId, clientId)).orderBy(desc(budgets.createdAt));
}

export async function getAllBudgets() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(budgets).orderBy(desc(budgets.createdAt));
}

// Messages queries
export async function getMessagesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.clientId, clientId)).orderBy(desc(messages.createdAt));
}

// Reports queries
export async function getReportsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reports).where(eq(reports.clientId, clientId)).orderBy(desc(reports.createdAt));
}

// Portfolio queries
export async function getAllPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
}

export async function getFeaturedPortfolioItems(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioItems).where(eq(portfolioItems.featured, true)).limit(limit);
}

// Services queries
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services);
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
