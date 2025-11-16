import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth route - returns user with associated manager information
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Also fetch the manager profile associated with this user
      const manager = await storage.getManagerByUserId(userId);
      
      res.json({ ...user, manager });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Manager routes
  app.get('/api/managers', isAuthenticated, async (req: any, res) => {
    try {
      const managers = await storage.getAllManagers();
      res.json(managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
      res.status(500).json({ message: "Failed to fetch managers" });
    }
  });

  app.get('/api/managers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const manager = await storage.getManager(req.params.id);
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
      const managers = await storage.getManagersBySupervisor(req.params.supervisorId);
      res.json(managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
      res.status(500).json({ message: "Failed to fetch managers" });
    }
  });

  // Family routes
  app.get('/api/families', isAuthenticated, async (req: any, res) => {
    try {
      const families = await storage.getAllFamilies();
      res.json(families);
    } catch (error) {
      console.error("Error fetching families:", error);
      res.status(500).json({ message: "Failed to fetch families" });
    }
  });

  app.get('/api/families/manager/:managerId', isAuthenticated, async (req: any, res) => {
    try {
      const families = await storage.getFamiliesByManager(req.params.managerId);
      res.json(families);
    } catch (error) {
      console.error("Error fetching families:", error);
      res.status(500).json({ message: "Failed to fetch families" });
    }
  });

  // Children routes
  app.get('/api/children', isAuthenticated, async (req: any, res) => {
    try {
      const children = await storage.getAllChildren();
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.get('/api/children/family/:familyId', isAuthenticated, async (req: any, res) => {
    try {
      const children = await storage.getChildrenByFamily(req.params.familyId);
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  // Growth records routes
  app.get('/api/growth-records', isAuthenticated, async (req: any, res) => {
    try {
      const records = await storage.getAllGrowthRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching growth records:", error);
      res.status(500).json({ message: "Failed to fetch growth records" });
    }
  });

  app.get('/api/growth-records/child/:childId', isAuthenticated, async (req: any, res) => {
    try {
      const records = await storage.getGrowthRecordsByChild(req.params.childId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching growth records:", error);
      res.status(500).json({ message: "Failed to fetch growth records" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
