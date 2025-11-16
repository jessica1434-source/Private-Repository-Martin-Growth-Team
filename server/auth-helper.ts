import type { Manager } from "../shared/schema";
import type { IStorage } from "./storage";

export interface AuthContext {
  manager: Manager;
  canAccessManager: (targetManagerId: string) => Promise<boolean>;
  canAccessFamily: (familyId: string) => Promise<boolean>;
  canAccessChild: (childId: string) => Promise<boolean>;
}

export async function getAuthContext(
  userId: string,
  email: string,
  storage: IStorage
): Promise<AuthContext | null> {
  // Try to get manager by userId
  let manager = await storage.getManagerByUserId(userId);
  
  // If not found, try to find manager by email and link it
  if (!manager) {
    await storage.linkUserToManagerByEmail(email, userId);
    manager = await storage.getManagerByUserId(userId);
  }
  
  // If still not found, user has no manager profile
  if (!manager) {
    return null;
  }
  
  // Build authorization context
  const context: AuthContext = {
    manager,
    canAccessManager: async (targetManagerId: string) => {
      // Boss can access all managers
      if (manager.role === 'boss') {
        return true;
      }
      
      // Can access own profile
      if (manager.id === targetManagerId) {
        return true;
      }
      
      // Supervisor can access subordinate managers
      if (manager.role === 'supervisor') {
        const subordinates = await storage.getManagersBySupervisor(manager.id);
        return subordinates.some(m => m.id === targetManagerId);
      }
      
      // Regular managers cannot access other managers
      return false;
    },
    canAccessFamily: async (familyId: string) => {
      // Boss can access all families
      if (manager.role === 'boss') {
        return true;
      }
      
      const family = await storage.getFamily(familyId);
      if (!family) {
        return false;
      }
      
      // Can access own families
      if (family.managerId === manager.id) {
        return true;
      }
      
      // Supervisor can access subordinate managers' families
      if (manager.role === 'supervisor') {
        const subordinates = await storage.getManagersBySupervisor(manager.id);
        return subordinates.some(m => m.id === family.managerId);
      }
      
      return false;
    },
    canAccessChild: async (childId: string) => {
      // Boss can access all children
      if (manager.role === 'boss') {
        return true;
      }
      
      const child = await storage.getChild(childId);
      if (!child) {
        return false;
      }
      
      const family = await storage.getFamily(child.familyId);
      if (!family) {
        return false;
      }
      
      // Can access children from own families
      if (family.managerId === manager.id) {
        return true;
      }
      
      // Supervisor can access subordinate managers' children
      if (manager.role === 'supervisor') {
        const subordinates = await storage.getManagersBySupervisor(manager.id);
        return subordinates.some(m => m.id === family.managerId);
      }
      
      return false;
    },
  };
  
  return context;
}
