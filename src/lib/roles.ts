export type AppRole = "ADMIN" | "TEACHER" | "MEMBER";

export function isAdmin(role?: string | null): boolean {
  return role === "ADMIN";
}

/** Teachers + admins: announcements, groups, meetings, member videos */
export function canTeach(role?: string | null): boolean {
  return role === "ADMIN" || role === "TEACHER";
}

export function roleLabelAr(role: string): string {
  if (role === "ADMIN") return "مدير";
  if (role === "TEACHER") return "أستاذ";
  return "عضو";
}

export function roleLabelEn(role: string): string {
  if (role === "ADMIN") return "Admin";
  if (role === "TEACHER") return "Teacher";
  return "Member";
}
