import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import type { Express } from "express";
import { storage } from "./storage";
import type { Manager } from "@shared/schema";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSession = ConnectPgSimple(session);

export function setupAuth(app: Express) {
  // Session configuration
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: false,
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax', // CSRF protection
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const manager = await storage.getManagerByUsername(username);
        
        if (!manager) {
          return done(null, false, { message: "用戶名或密碼錯誤" });
        }

        const isValidPassword = await bcrypt.compare(password, manager.passwordHash);
        
        if (!isValidPassword) {
          return done(null, false, { message: "用戶名或密碼錯誤" });
        }

        // Update last login time
        await storage.updateManagerLastLogin(manager.id);

        return done(null, manager);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user for session
  passport.serializeUser((manager: any, done) => {
    done(null, manager.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const manager = await storage.getManagerById(id);
      done(null, manager);
    } catch (error) {
      done(error);
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "未登入" });
}

// Helper to get current manager from request
export function getCurrentManager(req: any): Manager | null {
  return req.user || null;
}
