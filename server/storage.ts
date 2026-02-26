import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, type PortfolioItem, type InsertPortfolioItem, type PortfolioImage, type InsertPortfolioImage, type PortfolioItemWithImages, type SiteSetting, contactMessages, users, portfolioItems, portfolioImages, siteSettings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markMessageRead(id: number): Promise<void>;
  markMessageUnread(id: number): Promise<void>;
  deleteMessage(id: number): Promise<void>;
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsWithImages(): Promise<PortfolioItemWithImages[]>;
  getPortfolioItemById(id: number): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, data: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<void>;
  getPortfolioImages(portfolioItemId: number): Promise<PortfolioImage[]>;
  addPortfolioImage(image: InsertPortfolioImage): Promise<PortfolioImage>;
  deletePortfolioImage(id: number): Promise<void>;
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  getAllSettings(): Promise<SiteSetting[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [msg] = await db.insert(contactMessages).values(message).returning();
    return msg;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async markMessageRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
  }

  async markMessageUnread(id: number): Promise<void> {
    await db.update(contactMessages).set({ read: false }).where(eq(contactMessages.id, id));
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
  }

  async getPortfolioItemsWithImages(): Promise<PortfolioItemWithImages[]> {
    const items = await this.getPortfolioItems();
    const allImages = await db.select().from(portfolioImages).orderBy(portfolioImages.displayOrder);
    return items.map(item => ({
      ...item,
      images: allImages.filter(img => img.portfolioItemId === item.id),
    }));
  }

  async getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [created] = await db.insert(portfolioItems).values(item).returning();
    return created;
  }

  async updatePortfolioItem(id: number, data: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const [updated] = await db.update(portfolioItems).set(data).where(eq(portfolioItems.id, id)).returning();
    return updated;
  }

  async deletePortfolioItem(id: number): Promise<void> {
    await db.delete(portfolioImages).where(eq(portfolioImages.portfolioItemId, id));
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }

  async getPortfolioImages(portfolioItemId: number): Promise<PortfolioImage[]> {
    return db.select().from(portfolioImages).where(eq(portfolioImages.portfolioItemId, portfolioItemId)).orderBy(portfolioImages.displayOrder);
  }

  async addPortfolioImage(image: InsertPortfolioImage): Promise<PortfolioImage> {
    const [created] = await db.insert(portfolioImages).values(image).returning();
    return created;
  }

  async deletePortfolioImage(id: number): Promise<void> {
    await db.delete(portfolioImages).where(eq(portfolioImages.id, id));
  }

  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSetting(key);
    if (existing !== null) {
      await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }
  }

  async getAllSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }
}

export const storage = new DatabaseStorage();
