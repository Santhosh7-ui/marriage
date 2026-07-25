import CinematicIntro from '@/app/components/engemeent/CinematicIntro';
import PhotoboothTransition from '@/app/components/gallery/PhotoboothTransition';

export default function Home() {
  return (
    <main>
      <CinematicIntro />
      <section style={{ position: 'relative', zIndex: 10 }}>
        <PhotoboothTransition />
      </section>
      
      {/* ═══════════════════════════════════════════════
           FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="footer-names">Santhosh ❤️ Ambika</div>
        <div className="footer-date">22 · 03 · 2026</div>
        <div className="footer-divider" aria-hidden="true"></div>
        <p className="footer-note">Made with love ✦</p>
      </footer>
    </main>
  );
}
