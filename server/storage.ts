import {
  users,
  managers,
  families,
  children,
  growthRecords,
  type User,
  type UpsertUser,
  type Manager,
  type InsertManager,
  type Family,
  type InsertFamily,
  type Child,
  type InsertChild,
  type GrowthRecord,
  type InsertGrowthRecord,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  linkUserToManagerByEmail(userId: string, email: string): Promise<void>;

  // Manager operations
  getManagerByUserId(userId: string): Promise<Manager | undefined>;
  getManagerByEmail(email: string): Promise<Manager | undefined>;
  getManager(id: string): Promise<Manager | undefined>;
  getAllManagers(): Promise<Manager[]>;
  getManagersByRole(role: string): Promise<Manager[]>;
  getManagersBySupervisor(supervisorId: string): Promise<Manager[]>;
  createManager(manager: InsertManager): Promise<Manager>;
  updateManager(id: string, manager: Partial<InsertManager>): Promise<Manager>;
  deleteManager(id: string): Promise<void>;

  // Family operations
  getFamily(id: string): Promise<Family | undefined>;
  getFamiliesByManager(managerId: string): Promise<Family[]>;
  getFamiliesForSupervisor(supervisorId: string): Promise<Family[]>;
  getAllFamilies(): Promise<Family[]>;
  createFamily(family: InsertFamily): Promise<Family>;
  updateFamily(id: string, family: Partial<InsertFamily>): Promise<Family>;
  deleteFamily(id: string): Promise<void>;

  // Children operations
  getChild(id: string): Promise<Child | undefined>;
  getChildrenByFamily(familyId: string): Promise<Child[]>;
  getChildrenForManager(managerId: string): Promise<Child[]>;
  getChildrenForSupervisor(supervisorId: string): Promise<Child[]>;
  getAllChildren(): Promise<Child[]>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: string, child: Partial<InsertChild>): Promise<Child>;
  deleteChild(id: string): Promise<void>;

  // Growth record operations
  getGrowthRecord(id: string): Promise<GrowthRecord | undefined>;
  getGrowthRecordsByChild(childId: string): Promise<GrowthRecord[]>;
  getGrowthRecordsForManager(managerId: string): Promise<GrowthRecord[]>;
  getGrowthRecordsForSupervisor(supervisorId: string): Promise<GrowthRecord[]>;
  getAllGrowthRecords(): Promise<GrowthRecord[]>;
  createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord>;
  updateGrowthRecord(id: string, record: Partial<InsertGrowthRecord>): Promise<GrowthRecord>;
  deleteGrowthRecord(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async linkUserToManagerByEmail(userId: string, email: string): Promise<void> {
    // Find manager by email and update/sync their userId
    const manager = await this.getManagerByEmail(email);
    if (manager && manager.userId !== userId) {
      // Update userId even if already set (handles reassignment/reseeding)
      await db.update(managers).set({ userId }).where(eq(managers.email, email));
    }
  }

  // Manager operations
  async getManagerByUserId(userId: string): Promise<Manager | undefined> {
    const [manager] = await db.select().from(managers).where(eq(managers.userId, userId));
    return manager;
  }

  async getManagerByEmail(email: string): Promise<Manager | undefined> {
    const [manager] = await db.select().from(managers).where(eq(managers.email, email));
    return manager;
  }

  async getManager(id: string): Promise<Manager | undefined> {
    const [manager] = await db.select().from(managers).where(eq(managers.id, id));
    return manager;
  }

  async getAllManagers(): Promise<Manager[]> {
    return await db.select().from(managers);
  }

  async getManagersByRole(role: string): Promise<Manager[]> {
    return await db.select().from(managers).where(eq(managers.role, role));
  }

  async getManagersBySupervisor(supervisorId: string): Promise<Manager[]> {
    return await db.select().from(managers).where(eq(managers.supervisorId, supervisorId));
  }

  async createManager(managerData: InsertManager): Promise<Manager> {
    const [manager] = await db.insert(managers).values(managerData).returning();
    return manager;
  }

  async updateManager(id: string, managerData: Partial<InsertManager>): Promise<Manager> {
    const [manager] = await db.update(managers).set(managerData).where(eq(managers.id, id)).returning();
    return manager;
  }

  async deleteManager(id: string): Promise<void> {
    await db.delete(managers).where(eq(managers.id, id));
  }

  // Family operations
  async getFamily(id: string): Promise<Family | undefined> {
    const [family] = await db.select().from(families).where(eq(families.id, id));
    return family;
  }

  async getFamiliesByManager(managerId: string): Promise<Family[]> {
    return await db.select().from(families).where(eq(families.managerId, managerId));
  }

  async getFamiliesForSupervisor(supervisorId: string): Promise<Family[]> {
    const result = await db
      .select({
        id: families.id,
        familyName: families.familyName,
        country: families.country,
        managerId: families.managerId,
        complianceStatus: families.complianceStatus,
        managerNotes: families.managerNotes,
      })
      .from(families)
      .innerJoin(managers, eq(families.managerId, managers.id))
      .where(eq(managers.supervisorId, supervisorId));
    return result;
  }

  async getAllFamilies(): Promise<Family[]> {
    return await db.select().from(families);
  }

  async createFamily(familyData: InsertFamily): Promise<Family> {
    const [family] = await db.insert(families).values(familyData).returning();
    return family;
  }

  async updateFamily(id: string, familyData: Partial<InsertFamily>): Promise<Family> {
    const [family] = await db.update(families).set(familyData).where(eq(families.id, id)).returning();
    return family;
  }

  async deleteFamily(id: string): Promise<void> {
    await db.delete(families).where(eq(families.id, id));
  }

  // Children operations
  async getChild(id: string): Promise<Child | undefined> {
    const [child] = await db.select().from(children).where(eq(children.id, id));
    return child;
  }

  async getChildrenByFamily(familyId: string): Promise<Child[]> {
    return await db.select().from(children).where(eq(children.familyId, familyId));
  }

  async getChildrenForManager(managerId: string): Promise<Child[]> {
    const result = await db
      .select({
        id: children.id,
        name: children.name,
        birthday: children.birthday,
        familyId: children.familyId,
      })
      .from(children)
      .innerJoin(families, eq(children.familyId, families.id))
      .where(eq(families.managerId, managerId));
    return result;
  }

  async getChildrenForSupervisor(supervisorId: string): Promise<Child[]> {
    const result = await db
      .select({
        id: children.id,
        name: children.name,
        birthday: children.birthday,
        familyId: children.familyId,
      })
      .from(children)
      .innerJoin(families, eq(children.familyId, families.id))
      .innerJoin(managers, eq(families.managerId, managers.id))
      .where(eq(managers.supervisorId, supervisorId));
    return result;
  }

  async getAllChildren(): Promise<Child[]> {
    return await db.select().from(children);
  }

  async createChild(childData: InsertChild): Promise<Child> {
    const [child] = await db.insert(children).values(childData).returning();
    return child;
  }

  async updateChild(id: string, childData: Partial<InsertChild>): Promise<Child> {
    const [child] = await db.update(children).set(childData).where(eq(children.id, id)).returning();
    return child;
  }

  async deleteChild(id: string): Promise<void> {
    await db.delete(children).where(eq(children.id, id));
  }

  // Growth record operations
  async getGrowthRecord(id: string): Promise<GrowthRecord | undefined> {
    const [record] = await db.select().from(growthRecords).where(eq(growthRecords.id, id));
    return record;
  }

  async getGrowthRecordsByChild(childId: string): Promise<GrowthRecord[]> {
    return await db.select().from(growthRecords).where(eq(growthRecords.childId, childId));
  }

  async getGrowthRecordsForManager(managerId: string): Promise<GrowthRecord[]> {
    const result = await db
      .select({
        id: growthRecords.id,
        childId: growthRecords.childId,
        recordDate: growthRecords.recordDate,
        height: growthRecords.height,
        weight: growthRecords.weight,
        notes: growthRecords.notes,
      })
      .from(growthRecords)
      .innerJoin(children, eq(growthRecords.childId, children.id))
      .innerJoin(families, eq(children.familyId, families.id))
      .where(eq(families.managerId, managerId));
    return result;
  }

  async getGrowthRecordsForSupervisor(supervisorId: string): Promise<GrowthRecord[]> {
    const result = await db
      .select({
        id: growthRecords.id,
        childId: growthRecords.childId,
        recordDate: growthRecords.recordDate,
        height: growthRecords.height,
        weight: growthRecords.weight,
        notes: growthRecords.notes,
      })
      .from(growthRecords)
      .innerJoin(children, eq(growthRecords.childId, children.id))
      .innerJoin(families, eq(children.familyId, families.id))
      .innerJoin(managers, eq(families.managerId, managers.id))
      .where(eq(managers.supervisorId, supervisorId));
    return result;
  }

  async getAllGrowthRecords(): Promise<GrowthRecord[]> {
    return await db.select().from(growthRecords);
  }

  async createGrowthRecord(recordData: InsertGrowthRecord): Promise<GrowthRecord> {
    const [record] = await db.insert(growthRecords).values(recordData).returning();
    return record;
  }

  async updateGrowthRecord(id: string, recordData: Partial<InsertGrowthRecord>): Promise<GrowthRecord> {
    const [record] = await db.update(growthRecords).set(recordData).where(eq(growthRecords.id, id)).returning();
    return record;
  }

  async deleteGrowthRecord(id: string): Promise<void> {
    await db.delete(growthRecords).where(eq(growthRecords.id, id));
  }
}

export const storage = new DatabaseStorage();
