import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const highlights = [
  {
    title: "Start free, no pressure",
    text: "Browse news, try short free lessons, and learn how Kasbah English works — before you apply.",
  },
  {
    title: "A real community inside",
    text: "Accepted members join discussions, group practice, and live Zoom meetings with supportive teachers and peers.",
  },
  {
    title: "English you can use",
    text: "We focus on speaking clearly, sounding natural, and building confidence for study, work, and everyday life.",
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
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2400&q=80"
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
            <p className="headline">Speak with confidence. Grow with a community.</p>
            <p className="lede">
              An online English home for Moroccan learners — and friends around the world — who want practice that feels
              human, clear, and useful.
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                Apply to join
              </Link>
              <Link className="btn btn-ghost" href="/courses">
                Try a free course
              </Link>
            </div>
          </div>
        </section>

        <section className="section programs">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">What you’ll find here</p>
              <h2>Friendly outside. Focused inside.</h2>
              <p>
                Kasbah English is open for everyone to explore. The members community is curated — so practice stays
                warm, useful, and serious about progress.
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
                <h2>Three simple steps to belong.</h2>
                <p>
                  You don’t need to be fluent to start. You need curiosity, consistency, and a place where speaking feels
                  safe.
                </p>
              </div>
              <div className="method-points">
                <article>
                  <h3>1. Explore at your pace</h3>
                  <p>Read the latest news, sample free courses, and see if the Kasbah vibe fits you.</p>
                </article>
                <article>
                  <h3>2. Apply in a few minutes</h3>
                  <p>Tell us your level, your goal, and why you want to practice with a community.</p>
                </article>
                <article>
                  <h3>3. Get invited inside</h3>
                  <p>If accepted, you’ll join discussions, groups, and live meetings with Zoom links.</p>
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
              <h2>Rooted in Morocco. Open to the world.</h2>
              <p>
                Whether you think in Darija, French, or another language first — we help you build English that works in
                real conversations.
              </p>
            </div>
            <div className="audience-split">
              <article>
                <h3>For learners in Morocco</h3>
                <p>
                  Flexible online sessions, clear explanations, and teachers who understand the journey from Darija and
                  French to confident English.
                </p>
              </article>
              <article>
                <h3>For learners everywhere</h3>
                <p>
                  Join a welcoming international classroom with the same care, structure, and high standard — wherever you
                  are.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section final-cta">
          <div className="wrap">
            <h2>Ready when you are.</h2>
            <p>Apply today. We’ll review your story and guide accepted members into the community.</p>
            <div className="cta-row" style={{ justifyContent: "center" }}>
              <Link className="btn btn-primary" href="/apply">
                Apply now
              </Link>
              <Link className="btn btn-ghost dark" href="/contact">
                Ask a question
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
