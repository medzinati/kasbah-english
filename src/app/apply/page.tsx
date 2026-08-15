import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply to join Kasbah English. Accepted members unlock discussions, groups, and live Zoom practice sessions.",
};

export default function ApplyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">Apply</p>
            <h1>Come practice with us</h1>
            <p>
              Tell us a little about your level and goals. We read every application carefully and invite accepted
              learners into the community.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>What happens next</h2>
              <ol className="steps-list">
                <li>You send your application (it only takes a few minutes).</li>
                <li>We review your level, goals, and motivation with care.</li>
                <li>If accepted, you’ll get login details for the members area.</li>
              </ol>
              <p className="form-note">
                Everyone can explore the public site. The community inside — discussions, groups, and meetings — is for
                accepted members.
              </p>
            </div>
            <ApplyForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
