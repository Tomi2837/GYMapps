import type { Member } from "@/types/domain";

export interface MemberRepository {
  findAll(gymId: string): Promise<Member[]>;
  findById(gymId: string, memberId: string): Promise<Member | null>;
  findByEmail(gymId: string, email: string): Promise<Member | null>;
  create(member: Member): Promise<Member>;
  update(gymId: string, memberId: string, changes: Partial<Member>): Promise<Member>;
  remove(gymId: string, memberId: string): Promise<void>;
}
