import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, getCurrentManager } from "./auth";
import passport from "passport";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema, type RegisterData, type LoginData } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Setup authentication
  setupAuth(app);

  // Register new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validation = registerSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "驗證失敗", 
          errors: validation.error.errors 
        });
      }

      const { username, password, name }: RegisterData = validation.data;

      // Check if username already exists
      const existingManager = await storage.getManagerByUsername(username);
      if (existingManager) {
        return res.status(400).json({ message: "用戶名已存在" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create manager with default role
      const manager = await storage.createManagerWithPassword(
        username,
        passwordHash,
        name,
        'manager'
      );

      res.json({ 
        success: true, 
        message: "註冊成功",
        manager: {
          id: manager.id,
          username: manager.username,
          name: manager.name,
          role: manager.role,
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "註冊失敗" });
    }
  });

  // Login
  app.post('/api/auth/login', (req, res, next) => {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "驗證失敗", 
        errors: validation.error.errors 
      });
    }

    passport.authenticate('local', (err: any, manager: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "登入失敗" });
      }
      
      if (!manager) {
        return res.status(401).json({ message: info?.message || "用戶名或密碼錯誤" });
      }

      // Regenerate session to prevent fixation attacks
      req.session.regenerate((err: any) => {
        if (err) {
          return res.status(500).json({ message: "登入失敗" });
        }

        req.logIn(manager, (err) => {
          if (err) {
            return res.status(500).json({ message: "登入失敗" });
          }

          res.json({
            success: true,
            message: "登入成功",
            manager: {
              id: manager.id,
              username: manager.username,
              name: manager.name,
              role: manager.role,
            }
          });
        });
      });
    })(req, res, next);
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "登出失敗" });
      }
      
      // Destroy session completely
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "已登出" });
      });
    });
  });

  // Get current user
  app.get('/api/auth/me', isAuthenticated, (req: any, res) => {
    const manager = getCurrentManager(req);
    if (!manager) {
      return res.status(401).json({ message: "未登入" });
    }

    res.json({
      id: manager.id,
      username: manager.username,
      name: manager.name,
      role: manager.role,
    });
  });

  // Manager routes
  app.get('/api/managers', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      if (manager.role === 'boss') {
        // Boss: return all managers
        const managers = await storage.getAllManagers();
        return res.json(managers);
      }
      
      if (manager.role === 'supervisor') {
        // Supervisor: return subordinate managers
        const subordinates = await storage.getManagersBySupervisor(manager.id);
        return res.json(subordinates);
      }
      
      // Regular managers get empty list (they don't manage other managers)
      res.json([]);
    } catch (error) {
      console.error("Error fetching managers:", error);
      res.status(500).json({ message: "Failed to fetch managers" });
    }
  });

  app.get('/api/managers/:id', isAuthenticated, async (req: any, res) => {
    try {
      
      const currentManager = getCurrentManager(req);
      
      if (!currentManager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const requestedManagerId = req.params.id;
      
      // Boss can access any manager profile
      if (currentManager.role === 'boss') {
        const manager = await storage.getManagerById(requestedManagerId);
        if (!manager) {
          return res.status(404).json({ message: "Manager not found" });
        }
        return res.json(manager);
      }
      
      // Can access own profile or subordinate profiles (if supervisor)
      if (currentManager.id !== requestedManagerId) {
        if (currentManager.role === 'supervisor') {
          const subordinates = await storage.getManagersBySupervisor(currentManager.id);
          const isSubordinate = subordinates.some(m => m.id === requestedManagerId);
          if (!isSubordinate) {
            return res.status(403).json({ message: "Access denied: Cannot access other managers' profiles" });
          }
        } else {
          return res.status(403).json({ message: "Access denied: Cannot access other managers' profiles" });
        }
      }
      
      const manager = await storage.getManagerById(requestedManagerId);
      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }
      res.json(manager);
    } catch (error) {
      console.error("Error fetching manager:", error);
      res.status(500).json({ message: "Failed to fetch manager" });
    }
  });

  app.get('/api/managers/supervisor/:supervisorId', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const requestedSupervisorId = req.params.supervisorId;
      
      // Can only access own subordinates
      if (manager.id !== requestedSupervisorId) {
        return res.status(403).json({ message: "Access denied: Cannot access other supervisors' teams" });
      }
      
      if (manager.role !== 'supervisor') {
        return res.status(403).json({ message: "Access denied: Only supervisors can access this endpoint" });
      }
      
      const managers = await storage.getManagersBySupervisor(requestedSupervisorId);
      res.json(managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
      res.status(500).json({ message: "Failed to fetch managers" });
    }
  });

  // Family routes
  app.get('/api/families', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      if (manager.role === 'boss') {
        // Boss: return all families
        const families = await storage.getAllFamilies();
        return res.json(families);
      }
      
      if (manager.role === 'supervisor') {
        // Supervisor: return families managed by subordinate managers (DB-filtered)
        const families = await storage.getFamiliesForSupervisor(manager.id);
        return res.json(families);
      }
      
      // Regular manager: return only their own families
      const families = await storage.getFamiliesByManager(manager.id);
      res.json(families);
    } catch (error) {
      console.error("Error fetching families:", error);
      res.status(500).json({ message: "Failed to fetch families" });
    }
  });

  app.get('/api/families/manager/:managerId', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const requestedManagerId = req.params.managerId;
      
      // Boss can access any manager's families
      if (manager.role === 'boss') {
        const families = await storage.getFamiliesByManager(requestedManagerId);
        return res.json(families);
      }
      
      // Check authorization: can only access own families or subordinate managers' families
      if (manager.id !== requestedManagerId) {
        // Check if requested manager is a subordinate
        if (manager.role === 'supervisor') {
          const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
          const isSubordinate = subordinateManagers.some(m => m.id === requestedManagerId);
          if (!isSubordinate) {
            return res.status(403).json({ message: "Access denied: Cannot access other managers' data" });
          }
        } else {
          return res.status(403).json({ message: "Access denied: Cannot access other managers' data" });
        }
      }
      
      const families = await storage.getFamiliesByManager(requestedManagerId);
      res.json(families);
    } catch (error) {
      console.error("Error fetching families:", error);
      res.status(500).json({ message: "Failed to fetch families" });
    }
  });

  // Children routes
  app.get('/api/children', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      if (manager.role === 'boss') {
        // Boss: return all children
        const children = await storage.getAllChildren();
        return res.json(children);
      }
      
      if (manager.role === 'supervisor') {
        // Supervisor: return children from subordinate managers' families (DB-filtered)
        const children = await storage.getChildrenForSupervisor(manager.id);
        return res.json(children);
      }
      
      // Regular manager: return children from own families (DB-filtered)
      const children = await storage.getChildrenForManager(manager.id);
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.get('/api/children/family/:familyId', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const requestedFamilyId = req.params.familyId;
      
      // Check authorization: verify family belongs to manager or subordinate
      const family = await storage.getFamily(requestedFamilyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found" });
      }
      
      // Boss can access any family's children
      if (manager.role === 'boss') {
        const children = await storage.getChildrenByFamily(requestedFamilyId);
        return res.json(children);
      }
      
      if (family.managerId !== manager.id) {
        // Check if family belongs to a subordinate manager
        if (manager.role === 'supervisor') {
          const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
          const isSubordinateFamily = subordinateManagers.some(m => m.id === family.managerId);
          if (!isSubordinateFamily) {
            return res.status(403).json({ message: "Access denied: Cannot access this family's data" });
          }
        } else {
          return res.status(403).json({ message: "Access denied: Cannot access this family's data" });
          }
      }
      
      const children = await storage.getChildrenByFamily(requestedFamilyId);
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  // Growth records routes
  app.get('/api/growth-records', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      if (manager.role === 'boss') {
        // Boss: return all growth records
        const records = await storage.getAllGrowthRecords();
        return res.json(records);
      }
      
      if (manager.role === 'supervisor') {
        // Supervisor: return growth records from subordinate managers (DB-filtered)
        const records = await storage.getGrowthRecordsForSupervisor(manager.id);
        return res.json(records);
      }
      
      // Regular manager: return growth records from own families (DB-filtered)
      const records = await storage.getGrowthRecordsForManager(manager.id);
      res.json(records);
    } catch (error) {
      console.error("Error fetching growth records:", error);
      res.status(500).json({ message: "Failed to fetch growth records" });
    }
  });

  app.get('/api/growth-records/child/:childId', isAuthenticated, async (req: any, res) => {
    try {
      
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const requestedChildId = req.params.childId;
      
      // Check authorization: verify child's family belongs to manager or subordinate
      const child = await storage.getChild(requestedChildId);
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      const family = await storage.getFamily(child.familyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found" });
      }
      
      // Boss can access any child's growth records
      if (manager.role === 'boss') {
        const records = await storage.getGrowthRecordsByChild(requestedChildId);
        return res.json(records);
      }
      
      if (family.managerId !== manager.id) {
        // Check if family belongs to a subordinate manager
        if (manager.role === 'supervisor') {
          const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
          const isSubordinateFamily = subordinateManagers.some(m => m.id === family.managerId);
          if (!isSubordinateFamily) {
            return res.status(403).json({ message: "Access denied: Cannot access this child's data" });
          }
        } else {
          return res.status(403).json({ message: "Access denied: Cannot access this child's data" });
        }
      }
      
      const records = await storage.getGrowthRecordsByChild(requestedChildId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching growth records:", error);
      res.status(500).json({ message: "Failed to fetch growth records" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
