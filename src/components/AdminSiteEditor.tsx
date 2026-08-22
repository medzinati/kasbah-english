"use client";

import { useEffect, useState } from "react";

type ContactSettings = { email: string; whatsapp: string };
type HomeHeroSettings = {
  headlineAr: string;
  headlineEn: string;
  ledeAr: string;
  ledeEn: string;
};
type FaqItem = { qAr: string; qEn: string; aAr: string; aEn: string };
type ReviewItem = {
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  quoteAr: string;
  quoteEn: string;
  photo: string;
};
type AboutSettings = {
  heroAr: string;
  heroEn: string;
  ledeAr: string;
  ledeEn: string;
  story1Ar: string;
  story1En: string;
  story2Ar: string;
  story2En: string;
  story3Ar: string;
  story3En: string;
  values: { titleAr: string; titleEn: string; textAr: string; textEn: string }[];
};
type PlanRow = {
  id: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  priceSar: number;
  blurbAr: string;
  blurbEn: string;
  badge: string;
  sortOrder: number;
  active: boolean;
};
type OpsSettings = {
  gaMeasurementId: string;
  defaultZoomUrl: string;
};

type Tab = "contact" | "hero" | "faq" | "reviews" | "about" | "pricing" | "ops";

const tabs: { id: Tab; label: string }[] = [
  { id: "contact", label: "التواصل" },
  { id: "hero", label: "الصفحة الرئيسية" },
  { id: "faq", label: "الأسئلة" },
  { id: "reviews", label: "التقييمات" },
  { id: "about", label: "نبذة عنا" },
  { id: "pricing", label: "الأسعار" },
  { id: "ops", label: "تشغيل" },
];

export function AdminSiteEditor() {
  const [tab, setTab] = useState<Tab>("contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [homeHero, setHomeHero] = useState<HomeHeroSettings | null>(null);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [about, setAbout] = useState<AboutSettings | null>(null);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [ops, setOps] = useState<OpsSettings>({ gaMeasurementId: "", defaultZoomUrl: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/site");
        const json = await res.json();
        if (!alive || !res.ok || !json.ok) {
          setNotice(json.error || "تعذّر تحميل المحتوى.");
          return;
        }
        setContact(json.contact);
        setHomeHero(json.homeHero);
        setFaq(json.faq);
        setReviews(json.reviews);
        setAbout(json.about);
        setPlans(json.plans);
        if (json.ops) setOps(json.ops);
      } catch {
        if (alive) setNotice("مشكلة في الشبكة.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, homeHero, faq, reviews, about, plans, ops }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setNotice(json.error || "تعذّر الحفظ.");
        return;
      }
      setNotice("تم الحفظ. التغييرات تظهر في الموقع فورًا.");
    } catch {
      setNotice("مشكلة في الشبكة.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="members-empty">جاري تحميل محتوى الموقع…</p>;
  }

  if (!contact || !homeHero || !about) {
    return <p className="members-empty">تعذّر تحميل البيانات.</p>;
  }

  return (
    <div className="admin-site">
      <p className="members-lede">
        تحكم في نصوص الموقع العامة مثل WordPress: التواصل، الصفحة الرئيسية، الأسئلة، التقييمات، النبذة، والأسعار.
      </p>

      <div className="admin-site-tabs" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={`admin-site-tab${tab === item.id ? " is-active" : ""}`}
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "contact" ? (
        <div className="site-form admin-site-panel">
          <label>
            البريد الإلكتروني
            <input
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              dir="ltr"
            />
          </label>
          <label>
            واتساب (أرقام مع رمز الدولة)
            <input
              value={contact.whatsapp}
              onChange={(e) => setContact({ ...contact, whatsapp: e.target.value.replace(/\D/g, "") })}
              dir="ltr"
              placeholder="9665…"
            />
          </label>
        </div>
      ) : null}

      {tab === "hero" ? (
        <div className="site-form admin-site-panel">
          <label>
            العنوان (عربي)
            <textarea rows={2} value={homeHero.headlineAr} onChange={(e) => setHomeHero({ ...homeHero, headlineAr: e.target.value })} />
          </label>
          <label>
            العنوان (English)
            <textarea rows={2} value={homeHero.headlineEn} onChange={(e) => setHomeHero({ ...homeHero, headlineEn: e.target.value })} dir="ltr" />
          </label>
          <label>
            النص الداعم (عربي)
            <textarea rows={3} value={homeHero.ledeAr} onChange={(e) => setHomeHero({ ...homeHero, ledeAr: e.target.value })} />
          </label>
          <label>
            النص الداعم (English)
            <textarea rows={3} value={homeHero.ledeEn} onChange={(e) => setHomeHero({ ...homeHero, ledeEn: e.target.value })} dir="ltr" />
          </label>
        </div>
      ) : null}

      {tab === "faq" ? (
        <div className="admin-site-panel">
          {faq.map((item, index) => (
            <div className="site-form admin-site-card" key={`faq-${index}`}>
              <h3>سؤال {index + 1}</h3>
              <label>
                السؤال عربي
                <input value={item.qAr} onChange={(e) => setFaq(faq.map((row, i) => (i === index ? { ...row, qAr: e.target.value } : row)))} />
              </label>
              <label>
                Question EN
                <input value={item.qEn} onChange={(e) => setFaq(faq.map((row, i) => (i === index ? { ...row, qEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                الجواب عربي
                <textarea rows={3} value={item.aAr} onChange={(e) => setFaq(faq.map((row, i) => (i === index ? { ...row, aAr: e.target.value } : row)))} />
              </label>
              <label>
                Answer EN
                <textarea rows={3} value={item.aEn} onChange={(e) => setFaq(faq.map((row, i) => (i === index ? { ...row, aEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <button type="button" className="btn btn-ghost dark" onClick={() => setFaq(faq.filter((_, i) => i !== index))}>
                حذف السؤال
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-ghost dark"
            onClick={() => setFaq([...faq, { qAr: "", qEn: "", aAr: "", aEn: "" }])}
          >
            إضافة سؤال
          </button>
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="admin-site-panel">
          {reviews.map((item, index) => (
            <div className="site-form admin-site-card" key={`review-${index}`}>
              <h3>تقييم {index + 1}</h3>
              <label>
                الاسم عربي
                <input value={item.nameAr} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, nameAr: e.target.value } : row)))} />
              </label>
              <label>
                Name EN
                <input value={item.nameEn} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, nameEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                البلد عربي
                <input value={item.countryAr} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, countryAr: e.target.value } : row)))} />
              </label>
              <label>
                Country EN
                <input value={item.countryEn} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, countryEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                الاقتباس عربي
                <textarea rows={3} value={item.quoteAr} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, quoteAr: e.target.value } : row)))} />
              </label>
              <label>
                Quote EN
                <textarea rows={3} value={item.quoteEn} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, quoteEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                رابط الصورة
                <input value={item.photo} onChange={(e) => setReviews(reviews.map((row, i) => (i === index ? { ...row, photo: e.target.value } : row)))} dir="ltr" />
              </label>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "about" ? (
        <div className="site-form admin-site-panel">
          <label>
            العنوان عربي
            <input value={about.heroAr} onChange={(e) => setAbout({ ...about, heroAr: e.target.value })} />
          </label>
          <label>
            Title EN
            <input value={about.heroEn} onChange={(e) => setAbout({ ...about, heroEn: e.target.value })} dir="ltr" />
          </label>
          <label>
            المقدمة عربي
            <textarea rows={2} value={about.ledeAr} onChange={(e) => setAbout({ ...about, ledeAr: e.target.value })} />
          </label>
          <label>
            Intro EN
            <textarea rows={2} value={about.ledeEn} onChange={(e) => setAbout({ ...about, ledeEn: e.target.value })} dir="ltr" />
          </label>
          <label>
            القصة ١ عربي
            <textarea rows={3} value={about.story1Ar} onChange={(e) => setAbout({ ...about, story1Ar: e.target.value })} />
          </label>
          <label>
            Story 1 EN
            <textarea rows={3} value={about.story1En} onChange={(e) => setAbout({ ...about, story1En: e.target.value })} dir="ltr" />
          </label>
          <label>
            القصة ٢ عربي
            <textarea rows={3} value={about.story2Ar} onChange={(e) => setAbout({ ...about, story2Ar: e.target.value })} />
          </label>
          <label>
            Story 2 EN
            <textarea rows={3} value={about.story2En} onChange={(e) => setAbout({ ...about, story2En: e.target.value })} dir="ltr" />
          </label>
          <label>
            القصة ٣ عربي
            <textarea rows={3} value={about.story3Ar} onChange={(e) => setAbout({ ...about, story3Ar: e.target.value })} />
          </label>
          <label>
            Story 3 EN
            <textarea rows={3} value={about.story3En} onChange={(e) => setAbout({ ...about, story3En: e.target.value })} dir="ltr" />
          </label>
          {about.values.map((value, index) => (
            <div className="admin-site-card" key={`value-${index}`}>
              <h3>قيمة {index + 1}</h3>
              <label>
                العنوان عربي
                <input
                  value={value.titleAr}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      values: about.values.map((row, i) => (i === index ? { ...row, titleAr: e.target.value } : row)),
                    })
                  }
                />
              </label>
              <label>
                Title EN
                <input
                  value={value.titleEn}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      values: about.values.map((row, i) => (i === index ? { ...row, titleEn: e.target.value } : row)),
                    })
                  }
                  dir="ltr"
                />
              </label>
              <label>
                النص عربي
                <textarea
                  rows={2}
                  value={value.textAr}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      values: about.values.map((row, i) => (i === index ? { ...row, textAr: e.target.value } : row)),
                    })
                  }
                />
              </label>
              <label>
                Text EN
                <textarea
                  rows={2}
                  value={value.textEn}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      values: about.values.map((row, i) => (i === index ? { ...row, textEn: e.target.value } : row)),
                    })
                  }
                  dir="ltr"
                />
              </label>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "pricing" ? (
        <div className="admin-site-panel">
          {plans.map((plan, index) => (
            <div className="site-form admin-site-card" key={plan.id}>
              <h3>
                باقة {plan.id}{" "}
                <label className="admin-inline-check">
                  <input
                    type="checkbox"
                    checked={plan.active}
                    onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, active: e.target.checked } : row)))}
                  />
                  نشطة
                </label>
              </h3>
              <label>
                الاسم عربي
                <input value={plan.nameAr} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, nameAr: e.target.value } : row)))} />
              </label>
              <label>
                Name EN
                <input value={plan.nameEn} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, nameEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                السعر (ر.س)
                <input
                  type="number"
                  min={1}
                  value={plan.priceSar}
                  onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, priceSar: Number(e.target.value) || 0 } : row)))}
                  dir="ltr"
                />
              </label>
              <label>
                المدة عربي
                <input value={plan.durationAr} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, durationAr: e.target.value } : row)))} />
              </label>
              <label>
                Duration EN
                <input value={plan.durationEn} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, durationEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                الوصف عربي
                <textarea rows={2} value={plan.blurbAr} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, blurbAr: e.target.value } : row)))} />
              </label>
              <label>
                Blurb EN
                <textarea rows={2} value={plan.blurbEn} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, blurbEn: e.target.value } : row)))} dir="ltr" />
              </label>
              <label>
                الشارة (popular / value / فارغ)
                <input value={plan.badge} onChange={(e) => setPlans(plans.map((row, i) => (i === index ? { ...row, badge: e.target.value } : row)))} dir="ltr" />
              </label>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "ops" ? (
        <div className="site-form admin-site-panel">
          <p className="members-lede">
            فعّل Analytics ورابط Zoom الافتراضي من هنا بدون انتظار إعدادات Vercel. حفظ Zoom يحدّث اللقاءات القادمة التي ما زال رابطها تجريبيًا.
          </p>
          <label>
            Google Analytics Measurement ID
            <input
              value={ops.gaMeasurementId}
              onChange={(e) => setOps({ ...ops, gaMeasurementId: e.target.value.trim() })}
              dir="ltr"
              placeholder="G-XXXXXXXXXX"
            />
          </label>
          <label>
            رابط Zoom الافتراضي للقاءات
            <input
              value={ops.defaultZoomUrl}
              onChange={(e) => setOps({ ...ops, defaultZoomUrl: e.target.value.trim() })}
              dir="ltr"
              placeholder="https://zoom.us/j/…"
            />
          </label>
        </div>
      ) : null}

      <div className="admin-site-actions">
        <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? "جاري الحفظ…" : "حفظ التغييرات"}
        </button>
        {notice ? (
          <p className={`form-status ${notice.includes("تم") ? "is-success" : "is-error"}`} role="status">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
