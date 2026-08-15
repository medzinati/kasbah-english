import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminApplications } from "@/components/AdminApplications";
import { SignOutButton } from "@/components/SignOutButton";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/members");
  }

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const initial = applications.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    location: item.location,
    whatsapp: item.whatsapp,
    level: item.level,
    goal: item.goal,
    motivation: item.motivation,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="members-shell">
      <header className="members-top">
        <div className="wrap members-top-inner">
          <Link className="logo ink" href="/admin">
            Kasbah <span>Admin</span>
          </Link>
          <div className="members-top-actions">
            <Link className="text-link" href="/members">
              Members home
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="wrap members-main">
        <p className="eyebrow">Applications</p>
        <h1>Review & accept members</h1>
        <p className="members-lede">
          Accepting an application creates a member login. Copy the temporary password and send it privately.
        </p>
        <AdminApplications initial={initial} />
      </main>
    </div>
  );
}
