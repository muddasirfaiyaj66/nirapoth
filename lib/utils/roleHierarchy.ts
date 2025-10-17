/**
 * Role hierarchy utility functions for managing role-based permissions
 */

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "POLICE"
  | "FIRE_SERVICE"
  | "CITIZEN";

// Define role hierarchy (higher number = higher privilege)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  POLICE: 60,
  FIRE_SERVICE: 50,
  CITIZEN: 20,
};

/**
 * Check if a user can manage another user based on role hierarchy
 * @param managerRole - The role of the user performing the action
 * @param targetRole - The role of the user being managed
 * @returns boolean - true if the manager can manage the target user
 */
export function canManageUser(
  managerRole: UserRole,
  targetRole: UserRole
): boolean {
  const managerLevel = ROLE_HIERARCHY[managerRole];
  const targetLevel = ROLE_HIERARCHY[targetRole];

  // A user can manage users with lower or equal hierarchy level
  // Exception: Only SUPER_ADMIN can manage other SUPER_ADMINs
  if (targetRole === "SUPER_ADMIN") {
    return managerRole === "SUPER_ADMIN";
  }

  return managerLevel >= targetLevel;
}

/**
 * Check if a user can update/modify another user's role
 * @param managerRole - The role of the user performing the action
 * @param targetRole - The current role of the user being updated
 * @param newRole - The new role being assigned (optional, for role updates)
 * @returns boolean - true if the manager can perform the action
 */
export function canUpdateUser(
  managerRole: UserRole,
  targetRole: UserRole,
  newRole?: UserRole
): boolean {
  // Basic check: can manage the target user
  if (!canManageUser(managerRole, targetRole)) {
    return false;
  }

  // If changing role, also check if manager can assign the new role
  if (newRole && !canAssignRole(managerRole, newRole)) {
    return false;
  }

  return true;
}

/**
 * Check if a user can assign a specific role to another user
 * @param managerRole - The role of the user performing the action
 * @param roleToAssign - The role being assigned
 * @returns boolean - true if the manager can assign this role
 */
export function canAssignRole(
  managerRole: UserRole,
  roleToAssign: UserRole
): boolean {
  const managerLevel = ROLE_HIERARCHY[managerRole];
  const roleLevel = ROLE_HIERARCHY[roleToAssign];

  // Only SUPER_ADMIN can assign SUPER_ADMIN role
  if (roleToAssign === "SUPER_ADMIN") {
    return managerRole === "SUPER_ADMIN";
  }

  // Manager can assign roles at their level or below
  return managerLevel > roleLevel;
}

/**
 * Get the list of roles that a user can assign to others
 * @param managerRole - The role of the user performing the action
 * @returns UserRole[] - Array of roles that can be assigned
 */
export function getAssignableRoles(managerRole: UserRole): UserRole[] {
  const managerLevel = ROLE_HIERARCHY[managerRole];

  return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter((role) => {
    if (role === "SUPER_ADMIN") {
      return managerRole === "SUPER_ADMIN";
    }
    return ROLE_HIERARCHY[role] < managerLevel;
  });
}

/**
 * Check if a user can delete another user
 * @param managerRole - The role of the user performing the action
 * @param targetRole - The role of the user being deleted
 * @returns boolean - true if the manager can delete the target user
 */
export function canDeleteUser(
  managerRole: UserRole,
  targetRole: UserRole
): boolean {
  // Same rules as managing a user, but stricter for SUPER_ADMIN
  if (targetRole === "SUPER_ADMIN") {
    return managerRole === "SUPER_ADMIN";
  }

  return canManageUser(managerRole, targetRole);
}

/**
 * Check if a user can block/unblock another user
 * @param managerRole - The role of the user performing the action
 * @param targetRole - The role of the user being blocked/unblocked
 * @returns boolean - true if the manager can block/unblock the target user
 */
export function canBlockUser(
  managerRole: UserRole,
  targetRole: UserRole
): boolean {
  // Same rules as managing a user
  return canManageUser(managerRole, targetRole);
}

/**
 * Get a human-readable description of what actions a role can perform
 * @param role - The role to describe
 * @returns string - Description of the role's capabilities
 */
export function getRoleCapabilities(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Can manage all users including other Super Admins";
    case "ADMIN":
      return "Can manage Police, Fire Service, and Citizens";
    case "POLICE":
      return "Can manage Citizens";
    case "FIRE_SERVICE":
      return "Can manage Citizens";
    case "CITIZEN":
      return "No management capabilities";
    default:
      return "Unknown role capabilities";
  }
}
