import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <p>
            <strong>كاسباه إنجليش</strong> — مجتمع ودود لتعلّم الإنجليزية أونلاين في المغرب والعالم.
          </p>
          <nav className="footer-links" aria-label="روابط التذييل">
            <Link href="/news">الأخبار</Link>
            <Link href="/courses">دروس مجانية</Link>
            <Link href="/apply">التسجيل</Link>
            <Link href="/contact">تواصل معنا</Link>
            <Link href="/members/login">الأعضاء</Link>
          </nav>
        </div>
        <p>© {new Date().getFullYear()} كاسباه إنجليش</p>
      </div>
    </footer>
  );
}
