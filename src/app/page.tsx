import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const highlights = [
  {
    title: "Public learning",
    text: "News, free courses, and a clear path to apply — open to everyone.",
  },
  {
    title: "Members community",
    text: "After acceptance: discussion groups, announcements, and live meetings.",
  },
  {
    title: "Real practice",
    text: "Small-group sessions focused on speaking, clarity, and confidence.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader variant="hero" />

      <main id="top">
        <section className="hero" aria-label="Kasbah English">
          <div className="hero-media" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=80"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="hero-shade" />
          </div>

          <div className="wrap hero-content">
            <h1 className="brand">
              Kasbah <em>English</em>
            </h1>
            <p className="headline">An English community that practices together.</p>
            <p className="lede">
              Learn in public. Grow inside — discussions, group meetings, and real progress after you’re accepted.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="/apply">
                Apply to join
              </a>
              <a className="btn btn-ghost" href="/courses">
                Try free courses
              </a>
            </div>
          </div>
        </section>

        <section className="section programs">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">What Kasbah English is</p>
              <h2>A center outside. A community inside.</h2>
              <p>
                Everyone can explore news, free lessons, and how to apply. Members who are accepted unlock discussion
                groups and live meetings.
              </p>
            </div>

            <div className="program-list">
              {highlights.map((item, index) => (
                <article className="program" key={item.title}>
                  <span className="program-num">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section method">
          <div className="wrap method-grid">
            <div>
              <div className="section-head">
                <p className="eyebrow">How it works</p>
                <h2>Apply. Get accepted. Practice with us.</h2>
                <p>
                  Access to the inner community is intentional — so discussions stay useful and meetings stay focused.
                </p>
              </div>
              <div className="method-points">
                <article>
                  <h3>1. Explore freely</h3>
                  <p>Read news, try free courses, and see if Kasbah English fits your goals.</p>
                </article>
                <article>
                  <h3>2. Submit your application</h3>
                  <p>Tell us your level, goals, and why you want to join the community.</p>
                </article>
                <article>
                  <h3>3. Join the inside</h3>
                  <p>Accepted members enter discussions, group spaces, and Zoom-style meetings.</p>
                </article>
              </div>
            </div>

            <div className="method-visual">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                alt="Learners practicing English together online"
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>

        <section className="section audience">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Who it’s for</p>
              <h2>From Morocco to everywhere.</h2>
              <p>Built for Darija speakers and international learners who want English that works in real life.</p>
            </div>
            <div className="audience-split">
              <article>
                <h3>For Morocco</h3>
                <p>
                  Clear paths from Darija and French to confident English — with flexible online practice that fits real
                  schedules.
                </p>
              </article>
              <article>
                <h3>For the world</h3>
                <p>Join a global community with the same standard, whether you’re home or abroad.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section final-cta">
          <div className="wrap">
            <h2>Ready to apply?</h2>
            <p>We’ll review your application and invite accepted learners into the community.</p>
            <div className="cta-row" style={{ justifyContent: "center" }}>
              <a className="btn btn-primary" href="/apply">
                Apply now
              </a>
              <a className="btn btn-ghost dark" href="/contact">
                Contact us
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
