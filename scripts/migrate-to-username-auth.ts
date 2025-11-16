import { db } from "../server/db";
import { managers } from "@shared/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";

async function migrateToUsernameAuth() {
  console.log("Starting migration to username-based authentication...");

  try {
    // Step 1: Add new columns if they don't exist
    console.log("Step 1: Adding new columns...");
    await db.execute(sql`
      ALTER TABLE managers 
      ADD COLUMN IF NOT EXISTS username TEXT,
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()
    `);

    // Step 2: Generate usernames and passwords for existing managers
    console.log("Step 2: Migrating existing managers...");
    const existingManagers = await db.select().from(managers);
    
    const defaultPassword = "password123"; // 默認密碼
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    for (const manager of existingManagers) {
      // Generate username from email or name
      let username = manager.email?.split('@')[0] || manager.name.replace(/\s+/g, '').toLowerCase();
      
      // Ensure username is unique
      let counter = 1;
      let finalUsername = username;
      while (true) {
        const existing = await db.execute(sql`
          SELECT id FROM managers WHERE username = ${finalUsername} AND id != ${manager.id}
        `);
        if (existing.rows.length === 0) break;
        finalUsername = `${username}${counter}`;
        counter++;
      }

      // Update manager with username and password
      await db.execute(sql`
        UPDATE managers 
        SET username = ${finalUsername},
            password_hash = ${passwordHash}
        WHERE id = ${manager.id}
      `);
      
      console.log(`  ✓ Migrated: ${manager.name} -> ${finalUsername}`);
    }

    // Step 3: Make username and password_hash NOT NULL
    console.log("Step 3: Making username and password_hash required...");
    await db.execute(sql`
      ALTER TABLE managers 
      ALTER COLUMN username SET NOT NULL,
      ALTER COLUMN password_hash SET NOT NULL
    `);

    // Step 4: Add unique constraint on username
    console.log("Step 4: Adding unique constraint on username...");
    await db.execute(sql`
      ALTER TABLE managers 
      ADD CONSTRAINT managers_username_unique UNIQUE (username)
    `);

    // Step 5: Drop old columns
    console.log("Step 5: Removing old columns...");
    await db.execute(sql`
      ALTER TABLE managers 
      DROP COLUMN IF EXISTS user_id,
      DROP COLUMN IF EXISTS email
    `);

    console.log("\n✅ Migration completed successfully!");
    console.log(`\n📝 Important: All existing users now have the default password: "${defaultPassword}"`);
    console.log("Please ask users to change their passwords after first login.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateToUsernameAuth();
