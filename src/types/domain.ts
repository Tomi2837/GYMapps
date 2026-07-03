export type UserRole =
  | "superadmin"
  | "admin"
  | "receptionist"
  | "trainer"
  | "member";

export type EntityStatus = "active" | "inactive";

export interface Gym {
  id: string;
  name: string;
  logoUrl?: string;
  status: EntityStatus;
  createdAt: string;
}

export interface Branch {
  id: string;
  gymId: string;
  name: string;
  address: string;
  qrToken: string;
  status: EntityStatus;
}

export interface User {
  id: string;
  gymId: string;
  branchId?: string;
  memberId?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: EntityStatus;
  createdAt: string;
}

export interface Member {
  id: string;
  gymId: string;
  branchId: string;
  name: string;
  email: string;
  phone: string;
  document?: string;
  status: "active" | "expired" | "suspended" | "inactive";
  planId?: string;
  startDate: string;
  expirationDate: string;
  notes?: string;
}
