import os

css_path = 'css/styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

animations_css = """
/* ==========================================================================
   PROFESSIONAL ANIMATION SYSTEM
   ========================================================================== */

/* View Fade-Slide Transition */
.app-view.active-view {
  animation: viewFadeIn 0.22s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes viewFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Staggered Card Reveal */
.career-job-card {
  animation: cardSlideIn 0.28s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Stagger delays for first 12 cards */
.career-job-card:nth-child(1)  { animation-delay: 0ms; }
.career-job-card:nth-child(2)  { animation-delay: 40ms; }
.career-job-card:nth-child(3)  { animation-delay: 80ms; }
.career-job-card:nth-child(4)  { animation-delay: 120ms; }
.career-job-card:nth-child(5)  { animation-delay: 160ms; }
.career-job-card:nth-child(6)  { animation-delay: 200ms; }
.career-job-card:nth-child(7)  { animation-delay: 240ms; }
.career-job-card:nth-child(8)  { animation-delay: 280ms; }
.career-job-card:nth-child(9)  { animation-delay: 320ms; }
.career-job-card:nth-child(10) { animation-delay: 360ms; }
.career-job-card:nth-child(11) { animation-delay: 400ms; }
.career-job-card:nth-child(12) { animation-delay: 440ms; }

/* Toast Notification Slide-Up */
.toast {
  animation: toastSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.toast.toast-hide {
  animation: toastFadeOut 0.25s ease forwards;
}

@keyframes toastSlideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes toastFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}

/* Save/Bookmark Pop Micro-Interaction */
@keyframes bookmarkPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3); }
  70%  { transform: scale(0.92); }
  100% { transform: scale(1); }
}

.bookmark-pop {
  animation: bookmarkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Skeleton Shimmer Loader */
.skeleton-card {
  background: #ffffff;
  border: 1px solid var(--fl-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
}

.skeleton-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton-line {
  background: #e9eaec;
  border-radius: 6px;
  margin-bottom: 10px;
}

.skeleton-line.wide  { height: 16px; width: 70%; }
.skeleton-line.mid   { height: 12px; width: 45%; }
.skeleton-line.short { height: 10px; width: 30%; }
.skeleton-line.full  { height: 12px; width: 100%; }

/* Live Pulse Dot */
.live-pulse-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  position: relative;
  margin-right: 5px;
}

.live-pulse-dot::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.3);
  animation: livePulse 1.6s ease-out infinite;
}

@keyframes livePulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  70%  { transform: scale(2);   opacity: 0; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Mobile Hamburger Menu */
.hamburger-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: var(--fl-text-heading);
  font-size: 20px;
  line-height: 1;
}

.mobile-nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 199;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-nav-overlay.open {
  display: block;
  opacity: 1;
}

.mobile-nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: #ffffff;
  z-index: 200;
  padding: 20px 0;
  box-shadow: 4px 0 24px rgba(0,0,0,0.12);
  transform: translateX(-100%);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

.mobile-nav-drawer.open {
  transform: translateX(0);
}

.mobile-nav-drawer .drawer-logo {
  padding: 0 20px 16px;
  border-bottom: 1px solid var(--fl-border);
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 900;
  color: var(--fl-primary);
}

.mobile-nav-drawer .drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 20px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--fl-text-heading);
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  transition: background 0.12s;
}

.mobile-nav-drawer .drawer-item:hover {
  background: var(--fl-bg-hover);
  color: var(--fl-primary);
}

.mobile-nav-drawer .drawer-item i {
  width: 20px;
  text-align: center;
  color: var(--fl-primary);
}

@media (max-width: 768px) {
  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-nav-links-left {
    display: none !important;
  }

  .header-social-pills {
    display: none;
  }

  .header-top-right-group .flag-language-btn,
  .header-top-right-group .header-capsule-search {
    display: none;
  }

  .header-top-right-group {
    gap: 6px;
  }

  .header-top-right-group .btn-login-red-outline {
    display: none;
  }
}

/* Hero Stats Row */
.hero-stats-row {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-stat-number {
  font-size: 22px;
  font-weight: 900;
  color: var(--fl-primary);
  line-height: 1.1;
}

.hero-stat-label {
  font-size: 11.5px;
  color: var(--fl-text-muted);
  font-weight: 600;
  margin-top: 2px;
}

.hero-stat-divider {
  width: 1px;
  height: 36px;
  background: var(--fl-border);
}

/* Quick Search Tags Row */
.quick-search-tags-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.quick-search-label {
  font-size: 12.5px;
  color: var(--fl-text-muted);
  font-weight: 600;
  white-space: nowrap;
}

.quick-search-tag {
  background: #ffffff;
  border: 1px solid var(--fl-border);
  color: var(--fl-text-body);
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.quick-search-tag:hover {
  background: var(--fl-primary-light);
  border-color: var(--fl-primary);
  color: var(--fl-primary);
}

/* Browse Sidebar Layout */
.browse-layout-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  align-items: flex-start;
}

@media (max-width: 880px) {
  .browse-layout-grid {
    grid-template-columns: 1fr;
  }

  .browse-filter-sidebar {
    display: none;
  }
}

.browse-filter-sidebar {
  background: #ffffff;
  border: 1px solid var(--fl-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 80px;
}

.filter-sidebar-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--fl-text-heading);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--fl-border);
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--fl-text-light);
  margin-bottom: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  cursor: pointer;
  font-size: 13.5px;
  color: var(--fl-text-body);
  border-radius: var(--radius-sm);
  transition: color 0.12s;
}

.filter-option input[type="checkbox"] {
  width: 15px;
  height: 15px;
  accent-color: var(--fl-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.filter-option:hover {
  color: var(--fl-primary);
}

.filter-count-badge {
  margin-left: auto;
  font-size: 11px;
  color: var(--fl-text-light);
  background: #f1f2f4;
  padding: 1px 6px;
  border-radius: 10px;
}

.browse-results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.browse-results-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--fl-text-heading);
}

.browse-results-count span {
  color: var(--fl-primary);
}

.browse-sort-select {
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--fl-border);
  border-radius: var(--radius-pill);
  padding: 6px 14px;
  color: var(--fl-text-body);
  background: #ffffff;
  cursor: pointer;
  outline: none;
}

.browse-sort-select:focus {
  border-color: var(--fl-primary);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
"""

if "PROFESSIONAL ANIMATION SYSTEM" not in content:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write('\\n' + animations_css)
    print("styles.css updated")
else:
    print("styles.css already contains animations")
