import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/members");
  }
  return session;
}
