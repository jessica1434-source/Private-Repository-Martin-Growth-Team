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

  app.patch('/api/managers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentManager = getCurrentManager(req);
      
      if (!currentManager) {
        return res.status(403).json({ message: "Access denied: No manager profile found / 無權限：未找到管理員資料" });
      }
      
      const targetManagerId = req.params.id;
      const targetManager = await storage.getManagerById(targetManagerId);
      
      if (!targetManager) {
        return res.status(404).json({ message: "Manager not found / 管理員不存在" });
      }
      
      // Build updateData based on role permissions
      const updateData: Partial<any> = {};
      
      // Manager can only edit self, and ONLY name (cannot change role or supervisorId)
      if (currentManager.role === 'manager') {
        if (targetManagerId !== currentManager.id) {
          return res.status(403).json({ message: "Access denied: Managers can only edit themselves / 無權限：經理只能編輯自己" });
        }
        // Managers can ONLY update their name
        if (req.body.name) updateData.name = req.body.name;
        
        // Block any attempt to change role or supervisorId
        if (req.body.role || req.body.supervisorId !== undefined) {
          return res.status(403).json({ message: "Access denied: Managers cannot change role or supervisor / 無權限：經理不能更改角色或主管" });
        }
      }
      
      // Supervisor can only edit direct subordinate managers, and CANNOT change roles or supervisorId
      else if (currentManager.role === 'supervisor') {
        if (targetManager.supervisorId !== currentManager.id) {
          return res.status(403).json({ message: "Access denied: Supervisors can only edit their direct subordinates / 無權限：主管只能編輯直屬下屬" });
        }
        // Supervisors can ONLY update name
        if (req.body.name) updateData.name = req.body.name;
        
        // Block any attempt to change role or supervisorId
        if (req.body.role || req.body.supervisorId !== undefined) {
          return res.status(403).json({ message: "Access denied: Supervisors cannot change roles or reassign managers / 無權限：主管不能更改角色或重新分配管理員" });
        }
      }
      
      // Boss can edit any manager and change role/supervisorId
      else if (currentManager.role === 'boss') {
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.role) updateData.role = req.body.role;
        if (req.body.supervisorId !== undefined) updateData.supervisorId = req.body.supervisorId;
      }
      
      const updatedManager = await storage.updateManager(targetManagerId, updateData);
      res.json(updatedManager);
    } catch (error) {
      console.error("Error updating manager:", error);
      res.status(500).json({ message: "Failed to update manager / 更新管理員失敗" });
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

  app.post('/api/families', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      // Boss has read-only access to families - cannot create
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to families" });
      }
      
      // Only supervisor and manager can create families
      if (manager.role !== 'supervisor' && manager.role !== 'manager') {
        return res.status(403).json({ message: "Access denied: Only supervisor and manager can create families" });
      }
      
      const { familyName, country, managerId, complianceStatus = 'green', boneAge } = req.body;
      
      // Validate required fields
      if (!familyName || !country || !managerId) {
        return res.status(400).json({ message: "Missing required fields: familyName, country, managerId" });
      }
      
      // Supervisor can only assign families to subordinate managers
      if (manager.role === 'supervisor') {
        const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
        const isSubordinate = subordinateManagers.some(m => m.id === managerId);
        if (!isSubordinate) {
          return res.status(403).json({ message: "Access denied: Can only assign families to subordinate managers" });
        }
      }
      
      const familyData: any = {
        familyName,
        country,
        managerId,
        complianceStatus,
      };
      
      if (boneAge !== undefined && boneAge !== null) {
        familyData.boneAge = parseFloat(boneAge);
      }
      
      const family = await storage.createFamily(familyData);
      res.status(201).json(family);
    } catch (error) {
      console.error("Error creating family:", error);
      res.status(500).json({ message: "Failed to create family" });
    }
  });

  app.patch('/api/families/:id', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const familyId = req.params.id;
      const family = await storage.getFamily(familyId);
      
      if (!family) {
        return res.status(404).json({ message: "Family not found" });
      }
      
      // Authorization checks based on role
      if (manager.role === 'boss') {
        // Boss is view-only, cannot edit families
        return res.status(403).json({ message: "Access denied: Boss has read-only access to families" });
      } else if (manager.role === 'supervisor') {
        // Supervisor is view-only, cannot edit families
        return res.status(403).json({ message: "Access denied: Supervisors have read-only access" });
      } else if (manager.role === 'manager') {
        // Manager can only update their own families
        if (family.managerId !== manager.id) {
          return res.status(403).json({ message: "Access denied: Can only update your own families" });
        }
        
        // Manager cannot modify managerId at all (prevent reassignment or nulling)
        if (req.body.managerId !== undefined && req.body.managerId !== manager.id) {
          return res.status(403).json({ message: "Access denied: Cannot modify family assignment" });
        }
      }
      // Boss can update any family without restrictions
      
      const updateData: any = {
        familyName: req.body.familyName,
        country: req.body.country,
      };
      
      // Only Boss can update managerId
      if (manager.role === 'boss') {
        updateData.managerId = req.body.managerId;
      } else {
        // Manager: always keep original managerId
        updateData.managerId = family.managerId;
      }
      
      // Manager and Boss can update complianceStatus and managerNotes
      if (req.body.complianceStatus !== undefined) {
        updateData.complianceStatus = req.body.complianceStatus;
      }
      
      if (req.body.managerNotes !== undefined) {
        updateData.managerNotes = req.body.managerNotes;
      }
      
      if (req.body.boneAge !== undefined) {
        updateData.boneAge = req.body.boneAge;
      }
      
      const updatedFamily = await storage.updateFamily(familyId, updateData);
      res.json(updatedFamily);
    } catch (error) {
      console.error("Error updating family:", error);
      res.status(500).json({ message: "Failed to update family" });
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

  app.post('/api/children', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      // Boss has read-only access - cannot create children
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to children" });
      }
      
      // Only supervisor and manager can create children
      if (manager.role !== 'supervisor' && manager.role !== 'manager') {
        return res.status(403).json({ message: "Access denied: Only supervisor and manager can create children" });
      }
      
      const { name, birthday, familyId } = req.body;
      
      // Validate required fields
      if (!name || !birthday || !familyId) {
        return res.status(400).json({ message: "Missing required fields: name, birthday, familyId" });
      }
      
      // Check if family exists
      const family = await storage.getFamily(familyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found" });
      }
      
      // Supervisor can only create children for families of subordinate managers
      if (manager.role === 'supervisor') {
        const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
        const isSubordinateFamily = subordinateManagers.some(m => m.id === family.managerId);
        if (!isSubordinateFamily) {
          return res.status(403).json({ message: "Access denied: Can only create children for families of subordinate managers" });
        }
      }
      
      const childData = {
        name,
        birthday,
        familyId,
      };
      
      const child = await storage.createChild(childData);
      res.status(201).json(child);
    } catch (error) {
      console.error("Error creating child:", error);
      res.status(500).json({ message: "Failed to create child" });
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

  app.post('/api/growth-records', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found" });
      }
      
      const { childId, recordDate, height, weight, notes } = req.body;
      
      if (!childId || !recordDate || !height || !weight) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check authorization: verify child's family belongs to manager or subordinate
      const child = await storage.getChild(childId);
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      const family = await storage.getFamily(child.familyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found" });
      }
      
      // Boss has read-only access - cannot create growth records
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to growth records" });
      }
      
      // Check authorization for supervisor and manager
      if (family.managerId !== manager.id) {
        // Check if family belongs to a subordinate manager
        if (manager.role === 'supervisor') {
          const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
          const isSubordinateFamily = subordinateManagers.some(m => m.id === family.managerId);
          if (!isSubordinateFamily) {
            return res.status(403).json({ message: "Access denied: Cannot add records for this child" });
          }
        } else {
          return res.status(403).json({ message: "Access denied: Cannot add records for this child" });
        }
      }
      
      const record = await storage.createGrowthRecord({
        childId,
        recordDate,
        height: parseFloat(height),
        weight: parseFloat(weight),
        notes: notes || '',
      });
      
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating growth record:", error);
      res.status(500).json({ message: "Failed to create growth record" });
    }
  });

  app.patch('/api/growth-records/:id', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found / 無權限：未找到管理員資料" });
      }
      
      const recordId = req.params.id;
      const record = await storage.getGrowthRecord(recordId);
      
      if (!record) {
        return res.status(404).json({ message: "Growth record not found / 成長記錄不存在" });
      }
      
      // Get child and family to validate ownership
      const child = await storage.getChild(record.childId);
      if (!child) {
        return res.status(404).json({ message: "Child not found / 兒童不存在" });
      }
      
      const family = await storage.getFamily(child.familyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found / 家庭不存在" });
      }
      
      // Boss has read-only access - cannot update growth records
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to growth records / 無權限：老闆對成長記錄只有查看權限" });
      }
      
      // Supervisor can only update growth records for subordinate managers' children
      if (manager.role === 'supervisor') {
        const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
        const isSubordinateFamily = subordinateManagers.some(m => m.id === family.managerId);
        if (!isSubordinateFamily) {
          return res.status(403).json({ message: "Access denied: Can only update growth records for subordinate managers' children / 無權限：只能更新下屬經理的兒童成長記錄" });
        }
        
        const updateData: any = {};
        if (req.body.recordDate) updateData.recordDate = req.body.recordDate;
        if (req.body.height !== undefined) updateData.height = parseFloat(req.body.height);
        if (req.body.weight !== undefined) updateData.weight = parseFloat(req.body.weight);
        if (req.body.notes !== undefined) updateData.notes = req.body.notes;
        
        const updatedRecord = await storage.updateGrowthRecord(recordId, updateData);
        return res.json(updatedRecord);
      }
      
      // Manager can only update growth records for own families' children
      if (family.managerId === manager.id) {
        const updateData: any = {};
        if (req.body.recordDate) updateData.recordDate = req.body.recordDate;
        if (req.body.height !== undefined) updateData.height = parseFloat(req.body.height);
        if (req.body.weight !== undefined) updateData.weight = parseFloat(req.body.weight);
        if (req.body.notes !== undefined) updateData.notes = req.body.notes;
        
        const updatedRecord = await storage.updateGrowthRecord(recordId, updateData);
        return res.json(updatedRecord);
      }
      
      return res.status(403).json({ message: "Access denied: Cannot update this growth record / 無權限：無法更新此成長記錄" });
    } catch (error) {
      console.error("Error updating growth record:", error);
      res.status(500).json({ message: "Failed to update growth record / 更新成長記錄失敗" });
    }
  });

  app.delete('/api/growth-records/:id', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found / 無權限：未找到管理員資料" });
      }
      
      const recordId = req.params.id;
      const record = await storage.getGrowthRecord(recordId);
      
      if (!record) {
        return res.status(404).json({ message: "Growth record not found / 成長記錄不存在" });
      }
      
      // Get child and family to validate ownership
      const child = await storage.getChild(record.childId);
      if (!child) {
        return res.status(404).json({ message: "Child not found / 兒童不存在" });
      }
      
      const family = await storage.getFamily(child.familyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found / 家庭不存在" });
      }
      
      // Boss has read-only access - cannot delete growth records
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to growth records / 無權限：老闆對成長記錄只有查看權限" });
      }
      
      // Supervisor can only delete growth records for subordinate managers' children
      if (manager.role === 'supervisor') {
        const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
        const isSubordinateFamily = subordinateManagers.some(m => m.id === family.managerId);
        if (!isSubordinateFamily) {
          return res.status(403).json({ message: "Access denied: Can only delete growth records for subordinate managers' children / 無權限：只能刪除下屬經理的兒童成長記錄" });
        }
        
        await storage.deleteGrowthRecord(recordId);
        return res.json({ success: true, message: "Growth record deleted successfully / 成長記錄已成功刪除" });
      }
      
      // Manager can only delete growth records for own families' children
      if (family.managerId === manager.id) {
        await storage.deleteGrowthRecord(recordId);
        return res.json({ success: true, message: "Growth record deleted successfully / 成長記錄已成功刪除" });
      }
      
      return res.status(403).json({ message: "Access denied: Cannot delete this growth record / 無權限：無法刪除此成長記錄" });
    } catch (error) {
      console.error("Error deleting growth record:", error);
      res.status(500).json({ message: "Failed to delete growth record / 刪除成長記錄失敗" });
    }
  });

  // DELETE endpoints
  app.delete('/api/managers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentManager = getCurrentManager(req);
      
      if (!currentManager) {
        return res.status(403).json({ message: "Access denied: No manager profile found / 無權限：未找到管理員資料" });
      }
      
      // Only boss can delete managers
      if (currentManager.role !== 'boss') {
        return res.status(403).json({ message: "Access denied: Only boss can delete managers / 無權限：只有老闆可以刪除管理員" });
      }
      
      const managerId = req.params.id;
      const targetManager = await storage.getManagerById(managerId);
      
      if (!targetManager) {
        return res.status(404).json({ message: "Manager not found / 管理員不存在" });
      }
      
      // Prevent deleting self
      if (managerId === currentManager.id) {
        return res.status(400).json({ message: "Cannot delete yourself / 無法刪除自己" });
      }
      
      await storage.deleteManager(managerId);
      res.json({ success: true, message: "Manager deleted successfully / 管理員已成功刪除" });
    } catch (error) {
      console.error("Error deleting manager:", error);
      res.status(500).json({ message: "Failed to delete manager / 刪除管理員失敗" });
    }
  });

  app.delete('/api/families/:id', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found / 無權限：未找到管理員資料" });
      }
      
      const familyId = req.params.id;
      const family = await storage.getFamily(familyId);
      
      if (!family) {
        return res.status(404).json({ message: "Family not found / 家庭不存在" });
      }
      
      // Boss has read-only access - cannot delete families
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to families / 無權限：老闆對家庭只有查看權限" });
      }
      
      // Only supervisor and manager can delete families
      if (manager.role !== 'supervisor' && manager.role !== 'manager') {
        return res.status(403).json({ message: "Access denied: Only supervisor and manager can delete families / 無權限：只有主管和管理師可以刪除家庭" });
      }
      
      // Supervisor can only delete families of subordinate managers
      if (manager.role === 'supervisor') {
        const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
        const canAccess = subordinateManagers.some(m => m.id === family.managerId);
        if (!canAccess) {
          return res.status(403).json({ message: "Access denied: Cannot delete this family / 無權限：無法刪除此家庭" });
        }
      }
      
      await storage.deleteFamily(familyId);
      res.json({ success: true, message: "Family deleted successfully / 家庭已成功刪除" });
    } catch (error) {
      console.error("Error deleting family:", error);
      res.status(500).json({ message: "Failed to delete family / 刪除家庭失敗" });
    }
  });

  app.delete('/api/children/:id', isAuthenticated, async (req: any, res) => {
    try {
      const manager = getCurrentManager(req);
      
      if (!manager) {
        return res.status(403).json({ message: "Access denied: No manager profile found / 無權限：未找到管理員資料" });
      }
      
      const childId = req.params.id;
      const child = await storage.getChild(childId);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found / 兒童不存在" });
      }
      
      const family = await storage.getFamily(child.familyId);
      if (!family) {
        return res.status(404).json({ message: "Family not found / 家庭不存在" });
      }
      
      // Boss has read-only access - cannot delete children
      if (manager.role === 'boss') {
        return res.status(403).json({ message: "Access denied: Boss has read-only access to children / 無權限：老闆對兒童只有查看權限" });
      }
      
      // Only supervisor and manager can delete children
      if (manager.role !== 'supervisor' && manager.role !== 'manager') {
        return res.status(403).json({ message: "Access denied: Only supervisor and manager can delete children / 無權限：只有主管和管理師可以刪除兒童" });
      }
      
      // Supervisor can only delete children of subordinate managers' families
      if (manager.role === 'supervisor') {
        const subordinateManagers = await storage.getManagersBySupervisor(manager.id);
        const canAccess = subordinateManagers.some(m => m.id === family.managerId);
        if (!canAccess) {
          return res.status(403).json({ message: "Access denied: Cannot delete this child / 無權限：無法刪除此兒童" });
        }
      }
      
      await storage.deleteChild(childId);
      res.json({ success: true, message: "Child deleted successfully / 兒童已成功刪除" });
    } catch (error) {
      console.error("Error deleting child:", error);
      res.status(500).json({ message: "Failed to delete child / 刪除兒童失敗" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
