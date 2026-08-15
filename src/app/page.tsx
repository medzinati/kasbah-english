import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const highlights = [
  {
    title: "ابدأ مجانًا وبلا ضغط",
    text: "تصفّح الأخبار، جرّب دروسًا قصيرة مجانية، وافهم كيف تعمل كاسباه إنجليش — قبل ما تسجّل.",
  },
  {
    title: "مجتمع حقيقي في الداخل",
    text: "الأعضاء المقبولون يدخلون للنقاشات، مجموعات التدريب، ولقاءات زوم مباشرة مع مدرّسين وزملاء داعمين.",
  },
  {
    title: "إنجليزية تستعملها في حياتك",
    text: "نركّز على التحدّث بوضوح، الصوت الطبيعي، وبناء الثقة للدراسة والعمل والحياة اليومية.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader variant="hero" />

      <main id="top">
        <section className="hero" aria-label="كاسباه إنجليش">
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
              كاسباه <em>إنجليش</em>
            </h1>
            <p className="headline">تكلّم بثقة. وتقدّم مع مجتمع يساندك.</p>
            <p className="lede">
              بيت إنجليزي أونلاين للمتعلمين في المغرب — ولأي شخص في العالم — يبغى تدريبًا إنسانيًا، واضحًا، ومفيدًا في
              الحياة الحقيقية.
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                سجّل للانضمام
              </Link>
              <Link className="btn btn-ghost" href="/courses">
                جرّب درسًا مجانيًا
              </Link>
            </div>
          </div>
        </section>

        <section className="section programs">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">شنو غادي تلقا هنا</p>
              <h2>ودود من برّا. مركّز من داخل.</h2>
              <p>
                كاسباه إنجليش مفتوحة للجميع باش يستكشفوها. ومجتمع الأعضاء مختار بعناية — باش التدريب يبقى دافئ، مفيد،
                وجاد في التقدّم.
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
                <p className="eyebrow">كيف كيخدم</p>
                <h2>ثلاث خطوات بسيطة باش تكون معانا.</h2>
                <p>ما خاصّكش تكون طالق باش تبدا. خاصّك فضول، انتظام، ومكان تحس فيه بالأمان وأنت كتكلّم.</p>
              </div>
              <div className="method-points">
                <article>
                  <h3>١. استكشف بروحك</h3>
                  <p>اقرأ الأخبار، جرّب الدروس المجانية، وشوف واش جوّ كاسباه مناسب ليك.</p>
                </article>
                <article>
                  <h3>٢. سجّل في دقايق</h3>
                  <p>قول لينا مستواك، هدفك، وعلّاش بغيتي تتدرّب داخل مجتمع.</p>
                </article>
                <article>
                  <h3>٣. ادخل للمجتمع</h3>
                  <p>إلا تقبلتي، غادي تدخل للنقاشات والمجموعات ولقاءات مباشرة عبر زوم.</p>
                </article>
              </div>
            </div>

            <div className="method-visual">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                alt="متعلمون يتدرّبون على الإنجليزية معًا أونلاين"
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>

        <section className="section audience">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">لمن هذا؟</p>
              <h2>جذورنا في المغرب. وأبوابنا للعالم.</h2>
              <p>
                سواء كتفكّر بالدارجة أو الفرنسية أو أي لغة أخرى في الأول — كنساعدوك تبني إنجليزية خدامة في المحادثات
                الحقيقية.
              </p>
            </div>
            <div className="audience-split">
              <article>
                <h3>للمتعلمين في المغرب</h3>
                <p>
                  حصص أونلاين مرنة، شروحات واضحة، ومدرّسون فاهمين الرحلة من الدارجة والفرنسية إلى إنجليزية واثقة.
                </p>
              </article>
              <article>
                <h3>للمتعلمين في كل مكان</h3>
                <p>انضم لفصل عالمي مرحّب بنفس العناية والتنظيم والمستوى العالي — أينما كنت.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section final-cta">
          <div className="wrap">
            <h2>حنا مستعدين لما تكون مستعد.</h2>
            <p>سجّل اليوم. غادي نراجع طلبك ونوجّه الأعضاء المقبولين لدخول المجتمع.</p>
            <div className="cta-row" style={{ justifyContent: "center" }}>
              <Link className="btn btn-primary" href="/apply">
                سجّل الآن
              </Link>
              <Link className="btn btn-ghost dark" href="/contact">
                اطرح سؤالًا
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
