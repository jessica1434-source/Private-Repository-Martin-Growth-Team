import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, date, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const managers = pgTable("managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default('manager'),
  supervisorId: varchar("supervisor_id").references((): any => managers.id),
});

export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyName: text("family_name").notNull(),
  country: text("country").notNull(),
  managerId: varchar("manager_id").references(() => managers.id),
  complianceStatus: text("compliance_status").notNull().default('green'),
  managerNotes: text("manager_notes"),
});

export const children = pgTable("children", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  birthday: date("birthday").notNull(),
  familyId: varchar("family_id").notNull().references(() => families.id),
});

export const growthRecords = pgTable("growth_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childId: varchar("child_id").notNull().references(() => children.id),
  recordDate: date("record_date").notNull(),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  notes: text("notes").notNull().default(''),
});

export const insertManagerSchema = createInsertSchema(managers).omit({ id: true });
export const insertFamilySchema = createInsertSchema(families).omit({ id: true });
export const insertChildSchema = createInsertSchema(children).omit({ id: true });
export const insertGrowthRecordSchema = createInsertSchema(growthRecords).omit({ id: true });

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Manager = typeof managers.$inferSelect;
export type InsertManager = z.infer<typeof insertManagerSchema>;
export type Family = typeof families.$inferSelect;
export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type Child = typeof children.$inferSelect;
export type InsertChild = z.infer<typeof insertChildSchema>;
export type GrowthRecord = typeof growthRecords.$inferSelect;
export type InsertGrowthRecord = z.infer<typeof insertGrowthRecordSchema>;
