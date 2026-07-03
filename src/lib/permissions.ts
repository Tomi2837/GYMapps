import type { UserRole } from "@/types/domain";

export type Permission =
  | "gyms.manage"
  | "branches.manage"
  | "users.manage"
  | "members.read"
  | "members.write"
  | "payments.read"
  | "payments.write"
  | "checkins.manage"
  | "routines.manage"
  | "profile.read";

const rolePermissions: Record<UserRole, Permission[]> = {
  superadmin: [
    "gyms.manage",
    "branches.manage",
    "users.manage",
    "members.read",
    "members.write",
    "payments.read",
    "payments.write",
    "checkins.manage",
    "routines.manage",
    "profile.read",
  ],
  admin: [
    "branches.manage",
    "users.manage",
    "members.read",
    "members.write",
    "payments.read",
    "payments.write",
    "checkins.manage",
    "routines.manage",
    "profile.read",
  ],
  receptionist: [
    "members.read",
    "members.write",
    "payments.read",
    "payments.write",
    "checkins.manage",
    "profile.read",
  ],
  trainer: ["members.read", "routines.manage", "profile.read"],
  member: ["profile.read"],
};

export function can(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}
