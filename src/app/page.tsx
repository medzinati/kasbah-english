import Image from "next/image";

const programs = [
  {
    num: "01",
    title: "Conversation Lab",
    text: "Speak naturally in real situations — work, travel, and everyday life — with guided live practice.",
  },
  {
    num: "02",
    title: "Exam Track",
    text: "Focused preparation for IELTS and academic English, with clear milestones and feedback.",
  },
  {
    num: "03",
    title: "Career English",
    text: "Meetings, emails, interviews, and presentations — English that moves your career forward.",
  },
];

const methods = [
  {
    title: "Live small groups",
    text: "Interactive sessions where you speak more than you listen to lectures.",
  },
  {
    title: "Personal feedback",
    text: "Teachers correct what matters most for clarity, confidence, and fluency.",
  },
  {
    title: "Progress you can feel",
    text: "Short goals, weekly rhythm, and practice that fits busy Moroccan and global schedules.",
  },
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="logo" href="#top">
            Kasbah <span>English</span>
          </a>
          <a className="nav-cta" href="#start">
            Start learning
          </a>
        </div>
      </header>

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
            <p className="headline">English that opens doors.</p>
            <p className="lede">
              An online English center for Moroccan learners — and anyone worldwide ready to speak with confidence.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#start">
                Book a free intro
              </a>
              <a className="btn btn-ghost" href="#programs">
                See programs
              </a>
            </div>
          </div>
        </section>

        <section className="section programs" id="programs">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Programs</p>
              <h2>Learn with purpose, not pressure.</h2>
              <p>Choose the path that matches your goal — then practice until English feels natural.</p>
            </div>

            <div className="program-list">
              {programs.map((item) => (
                <article className="program" key={item.num}>
                  <span className="program-num">{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section method" id="method">
          <div className="wrap method-grid">
            <div>
              <div className="section-head">
                <p className="eyebrow">How it works</p>
                <h2>A modern classroom with a kasbah soul.</h2>
                <p>
                  Rooted in Morocco, designed for the world — live online lessons that feel close, human, and practical.
                </p>
              </div>
              <div className="method-points">
                {methods.map((item) => (
                  <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="method-visual">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                alt="Students learning together online"
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>

        <section className="section audience" id="audience">
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
                  Clear explanations, flexible hours, and teachers who understand the journey from Darija and French to
                  fluent English.
                </p>
              </article>
              <article>
                <h3>For the world</h3>
                <p>
                  Join a global classroom with the same high standard — whether you’re in Casablanca, Paris, or beyond.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section final-cta" id="start">
          <div className="wrap">
            <h2>Ready to speak with confidence?</h2>
            <p>Tell us your level and goal — we’ll help you start the right program this week.</p>
            <a className="btn btn-primary" href="mailto:hello@kasbahenglish.com">
              Email hello@kasbahenglish.com
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <p>
            <strong>Kasbah English</strong> — online English for Morocco & the world.
          </p>
          <p>© {new Date().getFullYear()} Kasbah English</p>
        </div>
      </footer>
    </>
  );
}
