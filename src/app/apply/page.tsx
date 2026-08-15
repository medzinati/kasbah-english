import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join the Kasbah English community. Accepted members get discussions and live meetings.",
};

export default function ApplyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">Apply</p>
            <h1>Join the Kasbah English community</h1>
            <p>
              Fill in the form. We review every application and invite accepted learners into discussions and meetings.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>What happens next</h2>
              <ol className="steps-list">
                <li>You submit your application.</li>
                <li>We review your level, goals, and motivation.</li>
                <li>If accepted, you receive access to the members area.</li>
              </ol>
              <p className="form-note">
                The public site stays open to everyone. The community inside is for accepted members only.
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
