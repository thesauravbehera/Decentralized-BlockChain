import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/LandingPage.css';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4';

const NAV_LINKS = [
  { label: 'Features', to: '/features', appear: 'nb-appear--scale', d: '0.16s' },
  { label: 'How It Works', to: '/features', appear: 'nb-appear--soft', d: '0.28s' },
  { label: 'Sign In', to: '/login', appear: 'nb-appear--scale', d: '0.40s' },
  { label: 'Dashboard', to: '/home', appear: 'nb-appear--soft', d: '0.52s' },
];

const LogoMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <g transform="rotate(-30 12 12)">
      <circle cx="7.3" cy="3.2" r="1.45" />
      <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
      <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
      <circle cx="16.7" cy="20.8" r="1.45" />
    </g>
  </svg>
);

const BlockchainLandingPage = () => {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Page-level chrome: black html/body + desktop scroll lock, scoped to this route.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('nb-landing');
    return () => html.classList.remove('nb-landing', 'nb-menu-open');
  }, []);

  // Entrance motion: settle each element on its own animationend,
  // and force everything visible if animations never start.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const targets = Array.from(root.querySelectorAll('.nb-appear, .nb-hero-photo'));
    const cleanups = targets.map((el) => {
      const onEnd = (e) => {
        if (e.target !== el) return;
        el.classList.add('is-in');
        el.removeEventListener('animationend', onEnd);
      };
      el.addEventListener('animationend', onEnd);
      return () => el.removeEventListener('animationend', onEnd);
    });

    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const probe = root.querySelector('.nb-appear');
        const anims = probe && probe.getAnimations ? probe.getAnimations() : [];
        const active = anims.some((a) => a.playState === 'running' || a.playState === 'finished');
        if (!active) targets.forEach((el) => el.classList.add('is-in'));
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Menu: mirror state on <html>, close on Escape and on resize to desktop.
  useEffect(() => {
    document.documentElement.classList.toggle('nb-menu-open', menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const mq = window.matchMedia('(min-width: 901px)');
    const onMq = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="nb-root" ref={rootRef}>
      <div className="nb-grain" aria-hidden="true" />

      <div className="nb-hero-photo" aria-hidden="true">
        <video src={HERO_VIDEO} autoPlay muted loop playsInline preload="auto" />
      </div>

      <div className="nb-page">
        <div className="nb-menu-backdrop" onClick={closeMenu} aria-hidden="true" />

        <header className="nb-header">
          <Link
            to="/"
            className="nb-logo nb-appear nb-appear--scale"
            style={{ '--d': '0.08s' }}
            aria-label="Nebula"
          >
            <LogoMark />
            <span>
              Nebula
            </span>
          </Link>

          <nav id="site-nav" className="nb-nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`nb-appear ${link.appear}`}
                style={{ '--d': link.d }}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/register"
            className="nb-btn nb-btn-solid nb-header-cta nb-appear nb-appear--scale"
            style={{ '--d': '0.34s' }}
          >
            Start for Free
          </Link>

          <button
            type="button"
            className="nb-burger nb-appear nb-appear--scale"
            style={{ '--d': '0.34s' }}
            aria-controls="site-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <main className="nb-hero" id="top">
          <div className="nb-hero-copy">
            <div className="nb-badge nb-appear nb-appear--pop" style={{ '--d': '0.22s' }}>
              <svg className="nb-badge-star" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
              </svg>
              Decentralized Cloud Storage
            </div>

            <h1>
              <span className="nb-headline-line">
                <span className="nb-appear nb-appear--mask" style={{ '--d': '0.42s' }}>
                  Store files on <em>the blockchain</em>,
                </span>
              </span>
              <span className="nb-headline-line">
                <span className="nb-appear nb-appear--mask" style={{ '--d': '0.62s' }}>
                  encrypted before they leave.
                </span>
              </span>
            </h1>

            <p className="nb-lede nb-appear nb-appear--soft" style={{ '--d': '0.82s' }}>
              AES-256 encrypted in your browser, distributed across IPFS, and verified on
              Ethereum. Storage that no one can read, censor, or tamper with.
            </p>

            <div className="nb-hero-actions">
              <Link
                to="/register"
                className="nb-btn nb-btn-solid nb-appear nb-appear--btn"
                style={{ '--d': '0.96s' }}
              >
                Start for Free
              </Link>
              <Link
                to="/features"
                className="nb-btn nb-btn-ghost nb-appear nb-appear--side"
                style={{ '--d': '1.10s' }}
              >
                See how it works
              </Link>
            </div>
          </div>
        </main>

        <footer className="nb-stats">
          <div className="nb-stat nb-appear nb-appear--stat" style={{ '--d': '1.12s' }}>
            <svg className="nb-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id="nb-pill-a" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#3a3a3a" stopOpacity="0.62" />
                </linearGradient>
                <linearGradient id="nb-pill-b" x1="13" y1="2" x2="24" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#3a3a3a" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.62" />
                </linearGradient>
              </defs>
              <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#nb-pill-a)" />
              <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#nb-pill-b)" />
              <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
            </svg>
            <span>Distributed across the IPFS network</span>
          </div>

          <div className="nb-stat nb-appear nb-appear--stat" style={{ '--d': '1.28s' }}>
            <svg className="nb-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
              <path
                d="M12 7.1v7.4M8.15 12.35L12 16.2l3.85-3.85"
                fill="none"
                stroke="#111"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>AES-256 client-side encryption</span>
          </div>

          <div className="nb-stat nb-appear nb-appear--stat" style={{ '--d': '1.44s' }}>
            <svg className="nb-stat-icon-wide" viewBox="0 0 40 22" aria-hidden="true">
              <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
              <path d="M5.6 9.6L6.4 5.4l3 3.2zM14.8 9.6L14 5.4l-3 3.2z" fill="#f4f4f4" />
              <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
              <circle cx="8.7" cy="11.6" r="0.7" fill="#1a1a1a" />
              <circle cx="11.7" cy="11.6" r="0.7" fill="#1a1a1a" />

              <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
              <circle cx="17.4" cy="9.4" r="1.7" fill="#111" />
              <circle cx="23" cy="9.4" r="1.7" fill="#111" />
              <ellipse cx="20.2" cy="12.2" rx="0.9" ry="0.6" fill="#111" />
              <path d="M17.6 14.4q2.6 2.2 5.2 0" fill="none" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />

              <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
              <text
                x="30.2"
                y="15.1"
                fontSize="12.5"
                fontWeight="700"
                textAnchor="middle"
                fill="#ffffff"
                fontFamily='"Inter", system-ui, sans-serif'
              >
                e
              </text>
            </svg>
            <span>Verified on Ethereum via MetaMask</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlockchainLandingPage;
