
// ── GLOBAL PAGE LOADER (YOUTUBE / GITHUB STYLE REALTIME FEEDBACK) ───────────
window.startPageLoading = function() {
  const loader = document.getElementById('global-page-loader');
  const bar = loader?.querySelector('.global-loader-bar');
  if (loader && bar) {
    loader.classList.add('active');
    bar.style.transition = 'width 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
    bar.style.width = '35%';
    setTimeout(() => {
      if (loader.classList.contains('active')) {
        bar.style.width = '80%';
      }
    }, 60);
  }
};

window.finishPageLoading = function(callback) {
  const loader = document.getElementById('global-page-loader');
  const bar = loader?.querySelector('.global-loader-bar');
  if (loader && bar) {
    bar.style.transition = 'width 0.15s ease-out';
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.remove('active');
      if (typeof callback === 'function') callback();
      setTimeout(() => {
        bar.style.width = '0%';
      }, 180);
    }, 120);
  } else if (typeof callback === 'function') {
    callback();
  }
};

/* ==========================================================================
   VIETNAM RECRUITMENT MARKETPLACE - APP LOGIC & SPA CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     ROUTE METADATA & DYNAMIC SEO / SCHEMA.ORG
     ========================================================================== */
  const routeMetadata = {
    home: {
      title: 'VietnamJobs – Cổng Tuyển Dụng & Việc Làm Logistics, AI Quốc Gia',
      description: 'Nền tảng tuyển dụng thông minh chuyên ngành Logistics, Chuỗi cung ứng, Hàng hải và Kỹ sư AI hàng đầu Việt Nam.'
    },
    browse: {
      title: 'Khám Phá Việc Làm Logistics & AI – VietnamJobs',
      description: 'Tìm kiếm 50,000+ việc làm Logistics, Hàng hải, Xuất nhập khẩu và Kỹ sư AI với mức lương hấp dẫn.'
    },
    courses: {
      title: 'Khóa Học & Chứng Chỉ Quốc Tế Logistics – VietnamJobs',
      description: 'Chương trình đào tạo và cấp chứng chỉ nghề nghiệp FIATA, IATA, CSCP chuẩn quốc tế.'
    },
    companies: {
      title: 'Danh Bạ 500+ Doanh Nghiệp Hàng Đầu – VietnamJobs',
      description: 'Khám phá hồ sơ, văn hóa doanh nghiệp và cơ hội nghề nghiệp tại 500+ tập đoàn uy tín.'
    },
    news: {
      title: 'Thời Sự Tuyển Dụng & Thị Trường Lao Động – VietnamJobs',
      description: 'Tin tức thời sự thị trường lao động, xu hướng tuyển dụng Logistics & AI mới nhất.'
    }
  };

  function updateDynamicSEO(viewId, customTitle, customDesc) {
    const meta = routeMetadata[viewId] || routeMetadata.home;
    const title = customTitle || meta.title;
    const desc = customDesc || meta.description;
    
    document.title = title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', desc);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
  }

  function injectJobSchema(job) {
    let script = document.getElementById('schema-job-posting');
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-job-posting';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description || ("Cơ hội việc làm tại " + (job.company || "VietnamJobs")),
      "datePosted": "2026-11-01",
      "validThrough": "2026-12-31",
      "employmentType": job.workType === "Toàn thời gian" ? "FULL_TIME" : "CONTRACTOR",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company || "Doanh Nghiệp Tuyển Dụng",
        "sameAs": "https://vietnamjobs.vn/"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location || "TP. Hồ Chí Minh",
          "addressCountry": "VN"
        }
      }
    };
    script.textContent = JSON.stringify(schemaData, null, 2);
  }

  

  // Central Application State
  
  // Reliable Brand Logo Resolver
  const brandLogoLookup = {
    'fpt': 'images/brands/fpt.svg',
    'vietcombank': 'images/brands/vcb.svg',
    'vcb': 'images/brands/vcb.svg',
    'vingroup': 'images/brands/vinfast.svg',
    'vinfast': 'images/brands/vinfast.svg',
    'vf': 'images/brands/vinfast.svg',
    'viettel': 'images/brands/viettel.svg',
    'vtl': 'images/brands/viettel.svg',
    'shopee': 'images/brands/shopee.svg',
    'shp': 'images/brands/shopee.svg',
    'momo': 'images/brands/momo.svg',
    'tiki': 'images/brands/tiki.svg',
    'kiotviet': 'images/brands/kiotviet.svg',
    'kiot': 'images/brands/kiotviet.svg',
    'vnpay': 'images/brands/vnpay.svg',
    'grab': 'images/brands/grab.svg',
    'samsung': 'images/brands/samsung.svg',
    'ss': 'images/brands/samsung.svg',
    'axon': 'images/brands/axon.svg',
    'vpbank': 'images/brands/vpbank.svg',
    'vpbs': 'images/brands/vpbank.svg',
    'vng': 'images/brands/vng.svg',
    'nike': 'images/brands/nike.svg',
    'zara': 'images/brands/zara.svg',
    'loreal': 'images/brands/loreal.svg',
    'unilever': 'images/brands/unilever.svg',
    'adidas': 'images/brands/adidas.svg'
  };

  function resolveBrandLogo(p) {
    if (!p) return 'images/brands/fpt.svg';
    if (p.logoUrl && p.logoUrl.startsWith('images/brands/')) return p.logoUrl;
    const comp = ((p.company || p.clientName || '') + ' ' + (p.title || '')).toLowerCase();
    for (const [key, path] of Object.entries(brandLogoLookup)) {
      if (comp.includes(key)) return path;
    }
    const type = (p.logoType || '').toLowerCase();
    for (const [key, path] of Object.entries(brandLogoLookup)) {
      if (type.includes(key) || key.includes(type)) return path;
    }
    return p.logoUrl || 'images/brands/fpt.svg';
  }

  const state = {
    currentView: 'home',
    mode: 'work', // 'work' = candidate, 'hire' = employer
    projects: [...initialProjects],
    freelancers: [...initialFreelancers],
    categories: [...initialCategories],
    notifications: [...initialNotifications],
    savedJobs: new Set(['prj-100', 'prj-101']),
    quickFilter: 'all',
    attachedCVFile: null,
    companies: [],
    escrowLedger: [],
    selectedProject: null,
    filters: {
      search: '',
      category: 'all',
      location: 'all',
      type: 'all',
      minBudget: 0,
      maxBudget: 100000000,
      skills: []
    }
  };


  // Initialize Modules
  initSalaryCalculator();
  updateSavedJobsCountUI();
  initMobileNav();
  initBrowseFilters();
  console.log('[DOM] Starting initializations...');
  initNavigation();
  initTaobaoSearchTicker();
  initLiveActivityTicker();
  initMarketInsights();
  initSearch();
  initQuickFilterPills();
  initBestJobsShowcase();
  initCompanySpotlight();
  initProjectsFeed();
  initQuickApplyModal();
  initJobDetailPage();
  initPostJobWizard();
  initAuthSystem();
  initFreelancersDirectory();
  loadProjectsFromAPI();
  try {
    console.log('[DOM] Executing handleUrlRouting now...');
    handleUrlRouting();
  } catch(err) {
    console.error('[ROUTER INIT ERROR]:', err);
  }

  // Listen to browser forward/back & hash change
  window.addEventListener('hashchange', handleUrlRouting);
  if (typeof initFreightWavesInteractivity === 'function') {
    initFreightWavesInteractivity();
  }
  window.handleUrlRouting = handleUrlRouting;
  window.addEventListener('load', () => setTimeout(handleUrlRouting, 60));
  setTimeout(handleUrlRouting, 100);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.show, .modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });


  /* ==========================================================================
     SPA VIEW SWITCHER & NAVIGATION
     ========================================================================== */
  
  function openEnterpriseModal(type) {
    showToast(`🏢 Tính năng ${type || 'Doanh nghiệp'} — Liên hệ: hr@vietnamjobs.vn`);
  }

  
  function initMobileNav() {
    const hamburger = document.getElementById('btn-hamburger');
    const overlay = document.getElementById('mobile-nav-overlay');
    const drawer = document.getElementById('mobile-nav-drawer');

    const openDrawer = () => {
      if(overlay) overlay.classList.add('open');
      if(drawer) drawer.classList.add('open');
      hamburger?.setAttribute('aria-expanded', 'true');
    };

    const closeDrawer = () => {
      if(overlay) overlay.classList.remove('open');
      if(drawer) drawer.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    };

    hamburger?.addEventListener('click', openDrawer);
    overlay?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    drawer?.querySelectorAll('.drawer-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchView(btn.getAttribute('data-view'));
        closeDrawer();
      });
    });

    document.getElementById('btn-open-auth-modal-mobile')?.addEventListener('click', () => {
      closeDrawer();
      document.getElementById('modal-auth')?.classList.add('show');
    });

    document.getElementById('btn-open-post-project-mobile')?.addEventListener('click', () => {
      closeDrawer();
      openWizardModal();
    });
  }

  function initNavigation() {
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-view');
        switchView(targetView);
      });
    });

    document.getElementById('btn-open-post-project')?.addEventListener('click', openWizardModal);
    document.getElementById('footer-btn-post-job')?.addEventListener('click', openWizardModal);
    document.getElementById('btn-employer-cta-post')?.addEventListener('click', openWizardModal);
    document.getElementById('footer-btn-headhunt')?.addEventListener('click', () => {
      openEnterpriseModal('Headhunt VIP');
    });
  }

    /* ==========================================================================
     VIEW SWITCHER WITH HISTORY & HASH ROUTING
     ========================================================================== */
  function switchView(viewId, updateHash = true) {
    if (typeof viewId === 'string' && viewId.startsWith('view-')) {
      viewId = viewId.replace('view-', '');
    }
    if (viewId === 'news') {
      viewId = 'article';
    }
    state.currentView = viewId;

    // Ensure all header dropdowns and popovers are closed on view switch
    const searchPop = document.getElementById('search-suggestions-popover');
    if (searchPop) searchPop.classList.remove('active');
    const searchCapsule = document.getElementById('header-search-capsule');
    if (searchCapsule) searchCapsule.classList.remove('focused');
    const notifPop = document.getElementById('notification-popover');
    if (notifPop) notifPop.classList.remove('show');
    const profMenu = document.getElementById('modern-profile-menu') || document.getElementById('user-dropdown-menu');
    if (profMenu) profMenu.classList.remove('show');

    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    const activeEl = document.getElementById(`view-${viewId}`);
    if (activeEl) {
      void activeEl.offsetWidth;
      activeEl.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (viewId === 'courses' && window.coursesController) {
      setTimeout(() => window.coursesController.init(), 30);
    }
    if (viewId === 'companies' && typeof initCompaniesDirectory === 'function') {
      setTimeout(() => initCompaniesDirectory(), 30);
    }
    if (viewId === 'article') {
      const hub = document.getElementById('lw-hub-overview');
      const reader = document.getElementById('lw-article-reader');
      if (hub) hub.style.display = 'block';
      if (reader) reader.style.display = 'none';
      if (typeof window.initFwCarousel === 'function') {
        setTimeout(() => { if (typeof window.initFwCarousel === 'function') window.initFwCarousel(); if (typeof initFreightWavesInteractivity === 'function') initFreightWavesInteractivity(); }, 50);
      }
    }
    document.querySelectorAll('.nav-link[data-view]').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    document.querySelectorAll('.brand-nav-item').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    if (updateHash && viewId !== 'job-detail') {
      if (viewId === 'home') {
        if (window.location.hash) {
          history.pushState(null, null, window.location.pathname + window.location.search);
        }
      } else {
        window.location.hash = viewId;
      }
    }

    updateDynamicSEO(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'browse') renderBrowseProjects();
  }

  /* ==========================================================================
     URL ROUTING (SUPPORT DEEP LINKING FOR VIEWS & JOB IDS)
     ========================================================================== */
  function handleUrlRouting() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    const urlParams = new URLSearchParams(window.location.search);

    console.log('[Router] Handling route:', rawHash);

    // 1. Check Job Detail direct link
    let jobId = urlParams.get('id');
    if (!jobId && (rawHash.includes('job?id=') || rawHash.includes('job-detail?id='))) {
      const match = rawHash.match(/id=([^&]+)/);
      if (match) jobId = decodeURIComponent(match[1]);
    } else if (!jobId && (rawHash.startsWith('job/') || rawHash.startsWith('job-detail/'))) {
      jobId = decodeURIComponent(rawHash.split('/')[1]);
    }

    if (jobId) {
      showJobDetail(jobId, false);
      return;
    }

    // 2. Check Article / News direct link
    if (rawHash.startsWith('article') || rawHash.startsWith('news')) {
      let articleId = null;
      if (rawHash.includes('id=')) {
        const match = rawHash.match(/id=([^&]+)/);
        if (match) articleId = decodeURIComponent(match[1]);
      } else if (rawHash.includes('/')) {
        const parts = rawHash.split('/');
        if (parts[1]) articleId = decodeURIComponent(parts[1]);
      }
      if (articleId && typeof window.openArticle === 'function') {
        window.openArticle(articleId, false);
      } else {
        switchView('article', false);
        const hub = document.getElementById('lw-hub-overview');
        const reader = document.getElementById('lw-article-reader');
        if (hub) hub.style.display = 'block';
        if (reader) reader.style.display = 'none';
        if (typeof window.initFwCarousel === 'function') {
          setTimeout(() => { if (typeof window.initFwCarousel === 'function') window.initFwCarousel(); if (typeof initFreightWavesInteractivity === 'function') initFreightWavesInteractivity(); }, 50);
        }
      }
      return;
    }

    // 3. Candidate Profile, Saved Jobs, Applications & Settings Routes
    if (rawHash === 'saved-jobs' || rawHash === 'saved') {
      switchView('dashboard', false);
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('saved');
      return;
    }
    if (rawHash === 'candidate-cv' || rawHash === 'profile') {
      switchView('dashboard', false);
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('profile');
      return;
    }
    if (rawHash === 'applications' || rawHash === 'applied-jobs' || rawHash === 'applied') {
      switchView('dashboard', false);
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('applications');
      return;
    }
    if (rawHash === 'post-job' || rawHash === 'postajob' || rawHash === 'employer' || rawHash === 'dang-tin') {
      switchView('post-job', false);
      return;
    }
    if (rawHash === 'settings') {
      switchView('dashboard', false);
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('settings');
      return;
    }
    if (rawHash.startsWith('dashboard')) {
      switchView('dashboard', false);
      if (rawHash.includes('tab=')) {
        const tabMatch = rawHash.match(/tab=([^&]+)/);
        if (tabMatch && typeof window.switchDashboardTab === 'function') {
          window.switchDashboardTab(tabMatch[1]);
        }
      }
      return;
    }

    // 3b. Company Detail direct link & deep routing
    if (rawHash.startsWith('company-detail') || (rawHash.startsWith('company') && !rawHash.startsWith('companies'))) {
      let companyId = urlParams.get('companyId') || urlParams.get('id');
      if (!companyId && rawHash.includes('id=')) {
        const match = rawHash.match(/id=([^&]+)/);
        if (match) companyId = decodeURIComponent(match[1]);
      } else if (!companyId && rawHash.includes('/') && !rawHash.startsWith('company-detail?')) {
        const parts = rawHash.split('/');
        if (parts[1]) companyId = decodeURIComponent(parts[1]);
      }
      const targetCompany = companyId || (typeof currentSelectedCompanyId !== 'undefined' && currentSelectedCompanyId) || 'maersk';
      if (typeof window.openCompanyDetail === 'function') {
        window.openCompanyDetail(targetCompany);
      } else {
        switchView('company-detail', false);
      }
      return;
    }

    // 4. View routes
    const route = rawHash.split('?')[0].toLowerCase();
    const validViews = ['home', 'browse', 'job-detail', 'freelancers', 'dashboard', 'courses', 'course-detail', 'companies', 'company-detail', 'article'];
    if (validViews.includes(route)) {
      switchView(route, false);
    } else if (!rawHash || route === 'home') {
      switchView('home', false);
    }
  }

  // Global Navigation Helper for dropdowns, nav buttons, and deep links
  window.navigateTo = function(routeName, params = {}) {
    if (typeof closeAllDropdowns === 'function') closeAllDropdowns();

    if (routeName === 'home') {
      switchView('home');
    } else if (routeName === 'browse') {
      switchView('browse');
      if (params.filter === 'saved' && typeof filterJobsBySaved === 'function') {
        filterJobsBySaved();
      }
    } else if (routeName === 'saved-jobs' || routeName === 'saved') {
      switchView('dashboard');
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('saved');
      window.location.hash = 'saved-jobs';
    } else if (routeName === 'profile' || routeName === 'candidate-cv') {
      switchView('dashboard');
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('profile');
      window.location.hash = 'candidate-cv';
    } else if (routeName === 'applications' || routeName === 'applied-jobs') {
      switchView('dashboard');
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('applications');
      window.location.hash = 'applications';
    } else if (routeName === 'settings') {
      switchView('dashboard');
      if (typeof window.switchDashboardTab === 'function') window.switchDashboardTab('settings');
      window.location.hash = 'settings';
    } else if (routeName === 'post-job' || routeName === 'employer' || routeName === 'postajob' || routeName === 'dang-tin') {
      switchView('post-job');
      window.location.hash = 'post-job';
    } else if (routeName === 'dashboard') {
      switchView('dashboard');
      if (params.tab && typeof window.switchDashboardTab === 'function') {
        window.switchDashboardTab(params.tab);
        window.location.hash = `dashboard?tab=${params.tab}`;
      } else {
        window.location.hash = 'dashboard';
      }
    } else if (routeName === 'courses') {
      switchView('courses');
    } else if (routeName === 'course-detail') {
      switchView('course-detail');
    } else if (routeName === 'companies') {
      switchView('companies');
    } else if (routeName === 'company-detail') {
      switchView('company-detail');
    } else if (routeName === 'article' || routeName === 'news') {
      if (params.id && typeof window.openArticle === 'function') {
        window.openArticle(params.id, true);
      } else {
        window.openArticle(null, true);
      }
    } else if (routeName === 'job-detail' && params.id) {
      showJobDetail(params.id);
    } else {
      switchView(routeName);
    }
  };

  // Dashboard Tab Switcher
  window.switchDashboardTab = function(tabName) {
    console.log('[Dashboard] Switching to tab:', tabName);
    document.querySelectorAll('.dash-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.dash-tab-panel').forEach(panel => {
      if (panel.id === `dash-panel-${tabName}`) {
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  function initJobDetailPage() {
    document.getElementById('btn-back-to-jobs-feed')?.addEventListener('click', () => {
      switchView('home');
    });

    document.getElementById('btn-copy-job-id')?.addEventListener('click', () => {
      if (state.selectedProject) {
        navigator.clipboard?.writeText(state.selectedProject.id);
        showToast(`📋 Đã sao chép mã việc làm: ${state.selectedProject.id}`);
      }
    });

    document.getElementById('btn-detail-trigger-apply')?.addEventListener('click', () => {
      if (state.selectedProject) openQuickApplyModal(state.selectedProject.id);
    });

    document.getElementById('btn-bottom-apply-now')?.addEventListener('click', () => {
      if (state.selectedProject) openQuickApplyModal(state.selectedProject.id);
    });

    document.getElementById('btn-detail-trigger-save')?.addEventListener('click', (e) => {
      if (!state.selectedProject) return;
      const prjId = state.selectedProject.id;
      const btn = e.currentTarget;
      
      if (state.savedJobs.has(prjId)) {
        state.savedJobs.delete(prjId);
        btn.classList.remove('saved');
        btn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Lưu Việc';
        showToast('Đã bỏ lưu việc làm');
      } else {
        state.savedJobs.add(prjId);
        btn.classList.add('saved');
        btn.innerHTML = '<i class="fa-solid fa-bookmark bookmark-pop" style="color:#0a66c2;"></i> Đã Lưu';
        showToast('❤️ Đã lưu việc làm vào danh sách yêu thích!');
      }
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.remove('bookmark-pop');
        void icon.offsetWidth; // reflow
        icon.classList.add('bookmark-pop');
      }
      updateSavedJobsCountUI();
      renderHomeFeaturedProjects();
    });

    document.getElementById('btn-detail-trigger-share')?.addEventListener('click', () => {
      if (!state.selectedProject) return;
      const shareUrl = `${window.location.origin}${window.location.pathname}#job?id=${encodeURIComponent(state.selectedProject.id)}`;
      navigator.clipboard?.writeText(shareUrl);
      showToast(`🔗 Đã sao chép link chi tiết việc làm mã ${state.selectedProject.id}!`);
    });
  }

  function showJobDetail(projectId, updateHash = true) {
    const p = (typeof enterpriseJobsDatabase !== 'undefined' ? enterpriseJobsDatabase.find(x => x.id === projectId) : null) ||
              state.projects.find(x => x.id === projectId) || 
              (typeof initialProjects !== 'undefined' ? initialProjects.find(x => x.id === projectId) : null) || 
              state.projects[0];

    if (!p) return;
    state.selectedProject = p;

    // Header Info
    const idTag = document.getElementById('detail-job-id-tag');
    const idInline = document.getElementById('detail-id-inline');
    const titleEl = document.getElementById('detail-job-title');
    const compEl = document.getElementById('detail-company-name');
    const logoEl = document.getElementById('detail-company-logo');
    const locEl = document.getElementById('detail-location');
    const worktypeEl = document.getElementById('detail-worktype');
    const postedTimeEl = document.getElementById('detail-posted-time');
    const salaryEl = document.getElementById('detail-salary-value');
    const saveBtn = document.getElementById('btn-detail-trigger-save');

    if (idTag) idTag.textContent = p.id;
    if (idInline) idInline.innerHTML = `<i class="fa-solid fa-fingerprint"></i> ID: ${p.id}`;
    if (titleEl) titleEl.textContent = p.title;
    if (compEl) compEl.textContent = p.company || p.clientName || 'Doanh Nghiệp Tuyển Dụng';
    
    const logoText = p.logoType || (p.company || p.clientName || 'VN').substring(0, 3).toUpperCase();
    const logoUrl = resolveBrandLogo(p);
    
    if (logoEl) {
      logoEl.innerHTML = `<img src="${logoUrl}" alt="${logoText}" class="card-brand-logo" style="width:54px;height:54px;object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="card-brand-fallback" style="display:none;width:54px;height:54px;font-size:16px;">${logoText}</span>`;
    }

    if (locEl) locEl.innerHTML = `<i class="fa-solid fa-location-dot" style="color:var(--fl-primary);"></i> ${p.location || 'Hà Nội & TP.HCM'}`;
    if (worktypeEl) worktypeEl.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${p.workType || p.type || 'Toàn thời gian'}`;
    if (postedTimeEl) postedTimeEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${p.postedDate || p.timeAgo || 'Đăng gần đây'}`;

    const salaryVal = p.salaryDisplay || (p.budgetMin ? (`${p.budgetMin} – ${p.budgetMax} USD`) : '30 – 50 triệu/tháng');
    if (salaryEl) salaryEl.textContent = salaryVal;

    if (saveBtn) {
      if (state.savedJobs.has(p.id)) {
        saveBtn.innerHTML = '<i class="fa-solid fa-bookmark" style="color:#0a66c2;"></i> Đã Lưu';
      } else {
        saveBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Lưu Việc';
      }
    }

    // Main Description & Requirements
    const descEl = document.getElementById('detail-description-text');
    if (descEl) {
      descEl.innerHTML = `
        <p style="margin-bottom:12px;">${p.description || 'Tham gia trực tiếp phát triển và triển khai hệ thống giải pháp công nghệ cao cho doanh nghiệp hàng đầu tại Việt Nam.'}</p>
        <p style="margin-bottom:12px;"><strong>Trách nhiệm công việc chính:</strong></p>
        <ul style="list-style:disc; padding-left:20px; line-height:1.7; color:var(--fl-text-body);">
          <li>Tham gia phân tích yêu cầu nghiệp vụ và thiết kế kiến trúc hệ thống module tương ứng.</li>
          <li>Lập trình, tối ưu hóa hiệu năng cơ sở dữ liệu và đảm bảo tính bảo mật, khả năng mở rộng cao.</li>
          <li>Phối hợp cùng Product Manager, QA và Tech Lead để nghiệm thu sản phẩm đúng tiến độ cam kết.</li>
          <li>Tham gia xây dựng tài liệu kỹ thuật, hướng dẫn vận hành và chuyển giao công nghệ.</li>
        </ul>
      `;
    }

    // Skills Pills
    const skillsContainer = document.getElementById('detail-skills-container');
    if (skillsContainer) {
      const skillsList = (p.skills && p.skills.length > 0) ? p.skills : ['Java', 'Spring Boot', 'SQL', 'Git', 'Docker'];
      skillsContainer.innerHTML = skillsList.map(s => `
        <span class="detail-skill-pill"><i class="fa-solid fa-check"></i> ${s}</span>
      `).join('');
    }

    // Sidebar Specs
    const sideAvatar = document.getElementById('sidebar-company-avatar');
    const sideCompName = document.getElementById('sidebar-company-name');
    const sideRating = document.getElementById('sidebar-company-rating');
    const sideHireRate = document.getElementById('sidebar-company-hire-rate');
    const sideSince = document.getElementById('sidebar-company-since');
    const sideId = document.getElementById('sidebar-spec-id');
    const sideSalary = document.getElementById('sidebar-spec-salary');
    const sideLoc = document.getElementById('sidebar-spec-location');
    const sideWorktype = document.getElementById('sidebar-spec-worktype');
    const sideDeadline = document.getElementById('sidebar-spec-deadline');

    if (sideAvatar) {
      sideAvatar.innerHTML = `<img src="${logoUrl}" alt="${logoText}" class="card-brand-logo" style="width:42px;height:42px;object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="card-brand-fallback" style="display:none;width:42px;height:42px;">${logoText}</span>`;
    }
    if (sideCompName) sideCompName.textContent = p.company || p.clientName || 'Doanh Nghiệp Tuyển Dụng';
    if (sideRating) sideRating.textContent = `${p.clientRating || 5.0} / 5.0 (${p.clientReviews || 84} đánh giá)`;
    if (sideHireRate) sideHireRate.textContent = p.clientHireRate || '98%';
    if (sideSince) sideSince.textContent = p.clientMemberSince || 'Năm 2018';

    if (sideId) sideId.textContent = p.id;
    if (sideSalary) sideSalary.textContent = salaryVal;
    if (sideLoc) sideLoc.textContent = p.location || 'Hà Nội & TP.HCM';
    if (sideWorktype) sideWorktype.textContent = p.workType || p.type || 'Toàn thời gian';
    if (sideDeadline) sideDeadline.textContent = p.timeLeft || 'Còn 15 ngày';

    // Switch View & Update Hash
    switchView('job-detail', false);
    updateDynamicSEO('job-detail', `${p.title} – ${p.company || 'VietnamJobs'}`, `Tuyển dụng ${p.title} tại ${p.company || 'Việt Nam'}. Xem mô tả công việc, mức lương và nộp hồ sơ ngay.`);
    injectJobSchema(p);

    if (updateHash) {
      window.location.hash = `job?id=${encodeURIComponent(p.id)}`;
    }
  }

  // Expose to window cleanly
  window.showJobDetail = function(id) {
    showJobDetail(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.openJobDetail = window.showJobDetail;

  /* ==========================================================================
     SEARCH & FILTERING
     ========================================================================== */
  function initSearch() {
    const searchInput = document.getElementById('header-search-input');
    const locationSelect = document.getElementById('hero-location-select');
    const submitBtn = document.getElementById('btn-hero-submit-search');

    const handleSearch = () => {
      state.filters.search = searchInput?.value.trim().toLowerCase() || '';
      state.filters.location = locationSelect?.value || 'all';
      renderHomeFeaturedProjects();
      renderBrowseProjects();

      if (state.currentView !== 'home' && state.currentView !== 'browse') {
        switchView('browse');
      } else {
        const feedEl = document.getElementById('projects-feed');
        feedEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    searchInput?.addEventListener('input', () => {
      state.filters.search = searchInput.value.trim().toLowerCase();
      renderHomeFeaturedProjects();
    });

    locationSelect?.addEventListener('change', handleSearch);
    submitBtn?.addEventListener('click', handleSearch);

    // Quick Search Tags (YBOX Style)
    document.querySelectorAll('.quick-search-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const kw = tag.getAttribute('data-filter-keyword');
        if (searchInput) searchInput.value = kw;
        state.filters.search = kw.toLowerCase();
        renderHomeFeaturedProjects();
        showToast(`🔍 Đang tìm kiếm: ${kw}`);
        document.getElementById('projects-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const topCapsuleInput = document.getElementById('top-capsule-search-input');
    const topCapsuleBtn = document.getElementById('btn-top-capsule-search');

    const handleTopCapsuleSearch = () => {
      const q = topCapsuleInput?.value.trim().toLowerCase() || '';
      state.filters.search = q;
      if (searchInput) searchInput.value = topCapsuleInput?.value || '';
      renderHomeFeaturedProjects();
      if (state.currentView !== 'home' && state.currentView !== 'browse') {
        switchView('home');
      }
      document.getElementById('projects-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    topCapsuleInput?.addEventListener('input', () => {
      state.filters.search = topCapsuleInput.value.trim().toLowerCase();
      renderHomeFeaturedProjects();
    });

    topCapsuleInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleTopCapsuleSearch();
    });

    topCapsuleBtn?.addEventListener('click', handleTopCapsuleSearch);

    document.getElementById('sidebar-btn-post-job')?.addEventListener('click', openWizardModal);
    document.getElementById('nav-btn-hot-badge')?.addEventListener('click', () => {
      const hotPill = document.querySelector('[data-quick-filter="hot"]');
      hotPill?.click();
      document.getElementById('projects-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ==========================================================================
     QUICK FILTER TABS (ABOVE JOB FEED)
     ========================================================================== */
  function initQuickFilterPills() {
    const pills = document.querySelectorAll('.filter-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.quickFilter = pill.getAttribute('data-quick-filter') || 'all';
        renderHomeFeaturedProjects();
      });
    });
  }

  function updateSavedJobsCountUI() {
    const badge = document.getElementById('saved-jobs-count-badge');
    if (badge) badge.textContent = state.savedJobs.size;
  }

  /* ==========================================================================
     BEST JOBS SHOWCASE & CLEAN CARD RENDERING
     ========================================================================== */
  function initBestJobsShowcase() {
    document.querySelectorAll('.best-job-mini-card').forEach(card => {
      const prjId = card.getAttribute('data-project-id');
      
      const saveBtn = card.querySelector('.btn-save-heart');
      if (saveBtn) {
        if (state.savedJobs.has(prjId)) {
          saveBtn.classList.add('saved');
          saveBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }

        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.savedJobs.has(prjId)) {
            state.savedJobs.delete(prjId);
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            showToast('Đã bỏ lưu việc làm');
          } else {
            state.savedJobs.add(prjId);
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            showToast('❤️ Đã lưu việc làm vào danh sách yêu thích!');
          }
          updateSavedJobsCountUI();
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-save-heart')) return;
        showJobDetail(prjId);
      });
    });
  }

  function initCompanySpotlight() {
    document.querySelectorAll('[data-filter-company]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const compName = el.getAttribute('data-filter-company');
        const searchInput = document.getElementById('header-search-input');
        if (searchInput) searchInput.value = compName;
        state.filters.search = compName.toLowerCase();
        renderHomeFeaturedProjects();
        showToast(`🔍 Đang hiển thị việc làm mới tại ${compName}`);
        const feed = document.getElementById('projects-feed');
        feed?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  
  function showSkeletonLoader(containerId, count = 3) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Array.from({length: count}, () => `
      <div class="skeleton-card">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <div class="skeleton-line" style="width:48px;height:48px;border-radius:8px;flex-shrink:0;"></div>
          <div style="flex:1">
            <div class="skeleton-line wide"></div>
            <div class="skeleton-line mid"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="skeleton-line full"></div>
          <div class="skeleton-line mid"></div>
        </div>
      </div>
    `).join('');
  }

  function hideSkeletonLoader(containerId) {
    // handled by rendering content over it
  }

  function initProjectsFeed() {
    showSkeletonLoader('projects-feed', 4);
    setTimeout(() => {
      renderHomeFeaturedProjects();
    }, 300);
  }

  function renderHomeFeaturedProjects() {
    const feedContainer = document.getElementById('projects-feed');
    if (!feedContainer) return;

    let filtered = [...state.projects];

    if (state.quickFilter === 'hot') {
      filtered = filtered.filter(p => p.hot === true);
    } else if (state.quickFilter === 'remote') {
      filtered = filtered.filter(p => (p.location && p.location.toLowerCase().includes('remote')) || (p.workType && p.workType.toLowerCase().includes('linh hoạt')));
    } else if (state.quickFilter === 'fulltime') {
      filtered = filtered.filter(p => !p.type || p.type === 'Full-Time');
    } else if (state.quickFilter === 'highsalary') {
      filtered = filtered.filter(p => (p.budgetMax && p.budgetMax >= 2000) || (p.salaryDisplay && p.salaryDisplay.includes('35')));
    } else if (state.quickFilter === 'saved') {
      filtered = filtered.filter(p => state.savedJobs.has(p.id));
    }

    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.company && p.company.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.skills && p.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div style="background:#ffffff; border:1px solid var(--fl-border); border-radius:var(--radius-lg); padding:40px 20px; text-align:center;">
          <i class="fa-solid fa-folder-open" style="font-size:36px; color:var(--fl-text-light); margin-bottom:12px;"></i>
          <h4 style="font-size:16px; font-weight:700; color:var(--fl-text-heading); margin-bottom:6px;">Không tìm thấy việc làm phù hợp</h4>
          <p style="font-size:13.5px; color:var(--fl-text-muted);">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh sách.</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(p => {
      const isSaved = state.savedJobs.has(p.id);
      const isPromoted = p.featured || p.hot;
      const initial = p.logoType || (p.company ? p.company.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() : 'VJ');
      const logoUrl = resolveBrandLogo(p);
      const salaryText = p.salaryDisplay || (p.budgetMin ? `${p.budgetMin} – ${p.budgetMax} USD` : 'Thỏa thuận');
      const applicantCount = p.applicantsCount || (p.bids ? p.bids.length : 12);

      const avatarHtml = `<img
        src="${logoUrl}"
        alt="${initial}"
        class="card-brand-logo"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      /><span class="card-brand-fallback" style="display:none;">${initial}</span>`;

      return `
        <article class="career-job-card ${isPromoted ? 'promoted' : ''}" data-project-id="${p.id}">
          <div class="career-card-left-section">
            <div class="career-avatar-circle">
              ${avatarHtml}
            </div>

            <div class="career-main-details">
              <div class="career-title-row">
                <h3 class="career-job-title">${p.title}</h3>
                <span class="badge-hot-tag"><i class="fa-solid fa-fire"></i> GẤP</span>
                <span class="badge-new-yellow">NEW</span>
                ${p.top100 !== false ? '<span class="badge-top100-star"><i class="fa-solid fa-star"></i> TOP 100</span>' : ''}
              </div>

              <div class="career-company-row">
                <span class="company-name-bold">${p.company || p.clientName || 'Animalz Technologies'}</span>
                <i class="fa-solid fa-circle-check career-verified-check" title="Doanh nghiệp đã xác thực"></i>
                <span class="career-meta-sep">•</span>
                <span class="career-location-text"><i class="fa-solid fa-location-dot" style="color:var(--fl-primary); font-size:12px;"></i> ${p.location || 'Hà Nội & TP.HCM'}</span>
                <span class="career-meta-sep">•</span>
                <span class="career-workmode-badge"><i class="fa-solid fa-briefcase" style="font-size:11px;"></i> ${p.workType || 'Full-Time'}</span>
              </div>

              <div class="career-pills-row">
                ${p.boosted !== false ? '<span class="pill-tag-boosted"><i class="fa-solid fa-rocket"></i> Boosted</span>' : ''}
                ${p.featured ? '<span class="pill-tag-featured"><i class="fa-solid fa-crown"></i> Ưu Tiên</span>' : ''}
                <span class="pill-tag-white"><i class="fa-solid fa-shield"></i> Xác thực 100%</span>
                <span class="pill-tag-white"><i class="fa-solid fa-circle-check" style="color:var(--fl-primary);"></i> Tuyển gấp</span>
              </div>

              <div class="career-live-meta">
                <span><i class="fa-regular fa-clock"></i> ${p.postedDate || p.timeAgo || '2 giờ trước'}</span>
                <span class="career-meta-sep">•</span>
                <span><i class="fa-solid fa-users" style="color:var(--fl-primary);"></i> <strong>${applicantCount}</strong> người đã nộp CV</span>
                <span class="career-meta-sep">•</span>
                <span style="color:var(--fl-text-muted); font-size:11.5px;"><i class="fa-solid fa-hashtag"></i> ${p.id}</span>
              </div>
            </div>
          </div>

          <div class="career-card-right-section">
            <div class="career-salary-box">
              <div class="career-salary-text">${salaryText}</div>
              <div class="career-salary-subbadge"><i class="fa-solid fa-circle-dollar-to-slot"></i> Thu nhập hấp dẫn</div>
            </div>

            <div class="career-action-buttons-group">
              <button class="btn-save-pill ${isSaved ? 'saved' : ''}" title="Lưu việc làm" data-action="save">
                <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i> ${isSaved ? 'Đã lưu' : 'Lưu'}
              </button>
              <button class="btn-apply-prominent" data-action="view-detail">
                Xem Chi Tiết <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind Event Listeners
    feedContainer.querySelectorAll('.career-job-card').forEach(card => {
      const prjId = card.getAttribute('data-project-id');

      card.querySelectorAll('[data-action="save"]').forEach(saveBtn => {
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.savedJobs.has(prjId)) {
            state.savedJobs.delete(prjId);
            showToast('Đã bỏ lưu việc làm');
          } else {
            state.savedJobs.add(prjId);
            showToast('❤️ Đã lưu việc làm vào danh sách yêu thích!');
          }
          updateSavedJobsCountUI();
          renderHomeFeaturedProjects();
        });
      });

      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="save"]')) return;
        showJobDetail(prjId);
      });
    });
  }

  
  function initBrowseFilters() {
    const updateActiveBadge = () => {
      const activeCount = document.querySelectorAll('.browse-cat-filter:checked, .browse-type-filter:checked, .browse-loc-filter:checked').length;
      const badge = document.getElementById('filter-active-badge');
      if (badge) {
        if (activeCount > 0) {
          badge.textContent = activeCount;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    };

    document.getElementById('btn-apply-browse-filters')?.addEventListener('click', () => {
      renderBrowseProjects();
      showToast('🔍 Đã áp dụng bộ lọc thành công!');
    });

    document.getElementById('btn-reset-browse-filters')?.addEventListener('click', () => {
      document.querySelectorAll('.browse-cat-filter, .browse-type-filter, .browse-loc-filter').forEach(cb => {
        cb.checked = false;
      });
      const sortSelect = document.getElementById('browse-sort-select');
      if (sortSelect) sortSelect.value = 'newest';
      updateActiveBadge();
      renderBrowseProjects();
      showToast('🔄 Đã đặt lại toàn bộ bộ lọc tìm kiếm');
    });

    document.getElementById('browse-sort-select')?.addEventListener('change', renderBrowseProjects);

    document.querySelectorAll('.browse-cat-filter, .browse-type-filter, .browse-loc-filter').forEach(cb => {
      cb.addEventListener('change', () => {
        updateActiveBadge();
        renderBrowseProjects();
      });
    });
  }

  function renderBrowseProjects() {
    const browseFeed = document.getElementById('browse-projects-feed');
    if (!browseFeed) return;

    // Read filters
    const checkedCats = [...document.querySelectorAll('.browse-cat-filter:checked')].map(c => c.value);
    const checkedTypes = [...document.querySelectorAll('.browse-type-filter:checked')].map(c => c.value);
    const checkedLocs = [...document.querySelectorAll('.browse-loc-filter:checked')].map(c => c.value);
    const sortVal = document.getElementById('browse-sort-select')?.value || 'newest';

    let projects = [...state.projects];

    if (checkedCats.length > 0) projects = projects.filter(p => checkedCats.includes(p.category));
    if (checkedTypes.length > 0) projects = projects.filter(p => checkedTypes.some(t => (p.workType || p.type || '').toLowerCase().includes(t.toLowerCase())));
    if (checkedLocs.length > 0) {
    const locMap = { 'hcm': ['hcm', 'hồ chí minh', 'tp.hcm', 'ho chi minh', 'sài gòn'], 'hanoi': ['hà nội', 'ha noi', 'hà noi'], 'danang': ['đà nẵng', 'da nang'], 'bacninh': ['bắc ninh', 'bac ninh'] };
    projects = projects.filter(p => {
      const loc = (p.location || '').toLowerCase();
      return checkedLocs.some(filterKey => {
        const aliases = locMap[filterKey] || [filterKey];
        return aliases.some(alias => loc.includes(alias));
      });
    });
  }

    if (state.filters.search) {
      const q = state.filters.search;
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.company || '').toLowerCase().includes(q) ||
        (p.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    if (sortVal === 'salary') projects.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0));
    else if (sortVal === 'applicants') projects.sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0));

    const countEl = document.getElementById('browse-results-count');
    if (countEl) countEl.textContent = projects.length;

    if (projects.length === 0) {
      browseFeed.innerHTML = `<div style="background:#fff;border:1px solid var(--fl-border);border-radius:var(--radius-lg);padding:40px;text-align:center;"><i class="fa-solid fa-folder-open" style="font-size:36px;color:var(--fl-text-light);"></i><h4 style="margin-top:12px;font-size:16px;color:var(--fl-text-heading);">Không tìm thấy việc làm phù hợp</h4></div>`;
      return;
    }

    browseFeed.innerHTML = projects.map(p => {
      const isSaved = state.savedJobs.has(p.id);
      const initial = p.logoType || (p.company ? p.company.substring(0, 2).toUpperCase() : 'VJ');
      const logoUrl = resolveBrandLogo(p);
      const salaryText = p.salaryDisplay || (p.budgetMin ? `${p.budgetMin} – ${p.budgetMax} USD` : 'Thỏa thuận');

      return `
        <article class="career-job-card ${p.hot ? 'promoted' : ''}" data-project-id="${p.id}">
          <div class="career-card-left-section">
            <div class="career-avatar-circle">
              <img src="${logoUrl}" alt="${initial}" class="card-brand-logo"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <span class="card-brand-fallback" style="display:none;">${initial}</span>
            </div>

            <div class="career-main-details">
              <div class="career-title-row">
                <h3 class="career-job-title">${p.title}</h3>
                <span class="badge-hot-tag">GẤP</span>
              </div>

              <div class="career-company-row">
                <span class="company-name-bold">${p.company || p.clientName || 'Doanh Nghiệp'}</span>
                <span class="career-meta-sep">•</span>
                <span class="career-location-text">${p.location || 'Hà Nội & TP.HCM'}</span>
              </div>

              <p style="font-size:13px; color:var(--fl-text-body); margin-top:4px; line-height:1.4;">
                ${p.description ? p.description.substring(0, 140) + '...' : 'Tìm kiếm ứng viên tài năng tham gia dự án công nghệ.'}
              </p>
            </div>
          </div>

          <div class="career-card-right-section">
            <div class="career-salary-box">
              <div class="career-salary-text">${salaryText}</div>
            </div>

            <div class="career-action-buttons-group">
              <button class="btn-apply-prominent" data-action="view-detail">
                Xem Chi Tiết
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    browseFeed.querySelectorAll('.career-job-card').forEach(card => {
      const prjId = card.getAttribute('data-project-id');
      card.addEventListener('click', () => {
        showJobDetail(prjId);
      });
    });
  }

  /* ==========================================================================
     1-CLICK QUICK APPLY MODAL
     ========================================================================== */
  function initQuickApplyModal() {
    const modal = document.getElementById('modal-quick-apply');
    const closeBtn = document.getElementById('close-quick-apply-modal');
    const cancelBtn = document.getElementById('btn-cancel-quick-apply');
    const dropzone = document.getElementById('cv-dropzone-box');
    const fileInput = document.getElementById('qa-input-cv-file');
    const previewBox = document.getElementById('cv-attached-preview');
    const filenameEl = document.getElementById('cv-attached-filename');
    const removeFileBtn = document.getElementById('btn-remove-attached-cv');
    const form = document.getElementById('quick-apply-form');

    const closeModal = () => modal?.classList.remove('show');

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    dropzone?.addEventListener('click', () => fileInput?.click());

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleCVFileSelected(e.dataTransfer.files[0]);
      }
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleCVFileSelected(e.target.files[0]);
      }
    });

    removeFileBtn?.addEventListener('click', () => {
      state.attachedCVFile = null;
      if (fileInput) fileInput.value = '';
      if (previewBox) previewBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
    });

    function handleCVFileSelected(file) {
      if (!file) return;
      state.attachedCVFile = file;
      if (filenameEl) filenameEl.textContent = file.name;
      if (previewBox) previewBox.style.display = 'flex';
      if (dropzone) dropzone.style.display = 'none';
      showToast(`📄 Đã đính kèm hồ sơ CV: ${file.name}`);
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('qa-input-name')?.value || 'Ứng viên';
      const jobTitle = document.getElementById('quick-apply-job-title')?.textContent || 'Vị trí';

      closeModal();
      form.reset();
      state.attachedCVFile = null;
      if (previewBox) previewBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';

      showToast(`🎉 Ứng tuyển thành công vị trí "${jobTitle}"! Nhà tuyển dụng sẽ sớm liên hệ với bạn.`);
    });
  }

  function openQuickApplyModal(projectId) {
    const modal = document.getElementById('modal-quick-apply');
    if (!modal) return;

    const p = state.projects.find(x => x.id === projectId) || {
      title: 'Senior Software Engineer',
      company: 'FPT Software'
    };

    const titleEl = document.getElementById('quick-apply-job-title');
    const compEl = document.getElementById('quick-apply-company-name');
    const idInput = document.getElementById('quick-apply-project-id');

    if (titleEl) titleEl.textContent = p.title;
    if (idInput) idInput.value = p.id;
    if (compEl) {
      compEl.innerHTML = `
        <span>${p.company || p.clientName || 'Doanh Nghiệp'}</span>
        <i class="fa-solid fa-circle-check" style="color: var(--fl-primary); font-size: 11px;"></i>
      `;
    }

    modal.classList.add('show');
  }

  /* ==========================================================================
     POST JOB WIZARD MODAL
     ========================================================================== */
  function initPostJobWizard() {
    const modal = document.getElementById('modal-wizard');
    const closeBtn = document.getElementById('close-wizard-modal');
    const cancelBtn = document.getElementById('btn-cancel-wizard');
    const form = document.getElementById('wizard-form') || document.getElementById('wizard-job-form');

    const closeModal = () => modal?.classList.remove('show');

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('wiz-job-title').value;
      const company = document.getElementById('wiz-company-name').value;
      const location = document.getElementById('wiz-job-location').value;
      const desc = document.getElementById('wiz-job-desc').value;
      const minBudget = document.getElementById('wiz-min-budget').value || '15,000,000₫';
      const maxBudget = document.getElementById('wiz-max-budget').value || '35,000,000₫';

      const newPrj = {
        id: `prj-${Date.now()}`,
        title,
        company,
        location,
        salaryDisplay: `${minBudget} - ${maxBudget}`,
        hot: true,
        postedDate: 'Vừa xong',
        timeAgo: 'Vừa xong',
        applicantsCount: 0,
        logoType: company.substring(0, 3).toUpperCase(),
        description: desc,
        clientVerified: true
      };

      state.projects.unshift(newPrj);
      closeModal();
      form.reset();
      renderHomeFeaturedProjects();
      showToast('🎉 Đăng tin tuyển dụng thành công! Tin đã xuất hiện trên trang chủ.');
    });
  }

  function openWizardModal() {
    document.getElementById('modal-wizard')?.classList.add('show');
  }

  /* ==========================================================================
     COMPLETE SIGN IN / SIGN UP & AUTHENTICATION CONTROLLER
     ========================================================================== */
  function initAuthSystem() {
    const modal = document.getElementById('modal-auth');
    const closeBtn = document.getElementById('close-auth-modal');
    const tabSignIn = document.getElementById('tab-auth-signin');
    const tabSignUp = document.getElementById('tab-auth-signup');
    const formSignIn = document.getElementById('auth-signin-form');
    const formSignUp = document.getElementById('auth-signup-form');

    const userProfileCapsule = document.getElementById('header-user-profile');
    const userMenuTrigger = document.getElementById('btn-user-profile-menu');
    const userDropdown = document.getElementById('user-dropdown-menu');
    const notifBtn = document.getElementById('btn-header-notifications');
    const notifPopover = document.getElementById('notification-popover');
    
    const dropNameEl = document.getElementById('dropdown-user-name');
    const dropEmailEl = document.getElementById('dropdown-user-email');
    const dropRoleEl = document.getElementById('dropdown-user-role');
    const logoutBtn = document.getElementById('btn-user-logout');

    const roleCandidateSection = document.getElementById('role-menu-candidate');
    const roleEmployerSection = document.getElementById('role-menu-employer');
    const btnRoleCandidate = document.getElementById('btn-role-candidate');
    const btnRoleEmployer = document.getElementById('btn-role-employer');

    // Global Modal Helpers
    window.openAuthModal = function(tab = 'signin') {
      if (tab === 'signup') {
        tabSignUp?.click();
      } else {
        tabSignIn?.click();
      }
      if (modal) {
        modal.removeAttribute('hidden');
        modal.classList.add('show');
      }
    };

    window.closeAuthModal = function() {
      if (modal) {
        modal.setAttribute('hidden', '');
        modal.classList.remove('show');
      }
    };

    window.closeAllDropdowns = function() {
      const menu = document.getElementById('modern-profile-menu') || document.getElementById('user-dropdown-menu');
      if (menu) menu.classList.remove('show');
      userProfileCapsule?.classList.remove('open');
      notifPopover?.classList.remove('show');
      const searchPopover = document.getElementById('search-suggestions-popover');
      if (searchPopover) searchPopover.classList.remove('active');
      const searchCapsule = document.getElementById('header-search-capsule');
      if (searchCapsule) searchCapsule.classList.remove('focused');
      const btn = document.getElementById('btn-header-user-profile');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    };

    window.toggleFacebookProfileMenu = function(e) {
      if (e) e.stopPropagation();
      const menu = document.getElementById('modern-profile-menu') || document.getElementById('user-dropdown-menu');
      const capsule = document.getElementById('header-user-profile');
      const btn = document.getElementById('btn-header-user-profile');
      const notifPopover = document.getElementById('notification-popover');
      if (notifPopover) notifPopover.classList.remove('show');
      const searchPopover = document.getElementById('search-suggestions-popover');
      if (searchPopover) searchPopover.classList.remove('active');

      if (!menu) return;
      const isOpen = menu.classList.contains('show');
      if (isOpen) {
        menu.classList.remove('show');
        if (capsule) capsule.classList.remove('open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add('show');
        if (capsule) capsule.classList.add('open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    };

    window.clearRecentSearches = function(e) {
      if (e) e.stopPropagation();
      const list = document.getElementById('recent-searches-list');
      if (list) {
        list.innerHTML = '<div style="padding: 10px; color: #94A3B8; font-size: 12px; text-align: center;">Chưa có tìm kiếm gần đây</div>';
      }
      showToast('Đã xóa tất cả tìm kiếm gần đây');
    };

    window.removeRecentSearch = function(e, btn) {
      if (e) e.stopPropagation();
      const row = btn?.closest('.recent-search-row');
      if (row) {
        row.remove();
        const list = document.getElementById('recent-searches-list');
        if (list && list.children.length === 0) {
          list.innerHTML = '<div style="padding: 10px; color: #94A3B8; font-size: 12px; text-align: center;">Chưa có tìm kiếm gần đây</div>';
        }
      }
    };

    window.cycleUserRole = function(e) {
      if (e) e.stopPropagation();
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('vietnamjobs_auth_user'));
      } catch(err) {}
      if (!user) user = { name: 'Thean Lê', email: 'thean@example.com', role: 'Candidate' };
      
      const newRole = user.role === 'Candidate' ? 'Employer' : 'Candidate';
      window.switchUserRole(newRole);
    };

    // Close button & backdrop click
    closeBtn?.addEventListener('click', window.closeAuthModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) window.closeAuthModal();
    });

    // Tab Switching
    tabSignIn?.addEventListener('click', () => {
      tabSignIn.classList.add('active');
      tabSignUp?.classList.remove('active');
      if (formSignIn) formSignIn.style.display = 'block';
      if (formSignUp) formSignUp.style.display = 'none';
    });

    tabSignUp?.addEventListener('click', () => {
      tabSignUp.classList.add('active');
      tabSignIn?.classList.remove('active');
      if (formSignUp) formSignUp.style.display = 'block';
      if (formSignIn) formSignIn.style.display = 'none';
    });

    // Sign Up Role Selector Card Choice
    window.selectSignupRole = function(role) {
      const hiddenInput = document.getElementById('signup-role');
      if (hiddenInput) hiddenInput.value = role;

      const cardCand = document.getElementById('card-role-candidate');
      const cardEmp = document.getElementById('card-role-employer');
      if (role === 'Employer') {
        cardEmp?.classList.add('selected');
        cardCand?.classList.remove('selected');
      } else {
        cardCand?.classList.add('selected');
        cardEmp?.classList.remove('selected');
      }
    };

    // Header Trigger: User Profile Dropdown
    userMenuTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPopover?.classList.remove('show');
      const isShowing = userDropdown?.classList.contains('show');
      if (isShowing) {
        userDropdown?.classList.remove('show');
        userProfileCapsule?.classList.remove('open');
      } else {
        userDropdown?.classList.add('show');
        userProfileCapsule?.classList.add('open');
      }
    });

    // Header Trigger: Notifications Popover
    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown?.classList.remove('show');
      userProfileCapsule?.classList.remove('open');
      notifPopover?.classList.toggle('show');
    });

    // Close Dropdowns on Click Outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#header-user-profile')) {
        userDropdown?.classList.remove('show');
        userProfileCapsule?.classList.remove('open');
      }
      if (!e.target.closest('#header-notification-wrapper')) {
        notifPopover?.classList.remove('show');
      }
    });

    // Role Switching Controller
    window.switchUserRole = function(newRole) {
      let user = null;
      try {
        const stored = localStorage.getItem('vietnamjobs_auth_user');
        user = stored ? JSON.parse(stored) : null;
      } catch (e) {}

      if (!user) {
        user = {
          name: 'Thean Lê',
          email: 'thean.le@vietnamjobs.vn',
          role: 'Candidate',
          loginTime: new Date().toISOString()
        };
      }

      user.role = newRole;
      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(user));
      renderUserAuthUI(user);

      const roleName = newRole === 'Employer' ? 'Nhà Tuyển Dụng' : 'Ứng Viên';
      showToast(`⚡ Đã chuyển sang vai trò: ${roleName}`);
    };

    // Render Logged-In User UI & Adapt Role Options
    function renderUserAuthUI(user) {
      if (!user) {
        // Fallback default user so UI always displays matching user screenshot
        user = {
          name: 'Thean Lê',
          email: 'thean.le@vietnamjobs.vn',
          role: 'Candidate',
          loginTime: new Date().toISOString()
        };
      }

      if (dropNameEl) dropNameEl.textContent = user.name || 'Thean Lê';
      if (dropEmailEl) dropEmailEl.textContent = user.email || 'thean@example.com';

      const isEmployer = (user.role === 'Employer');

      const roleBadgeLabel = document.getElementById('badge-role-label');
      if (roleBadgeLabel) {
        roleBadgeLabel.textContent = isEmployer ? 'Nhà Tuyển Dụng' : 'Logistics Specialist';
      }

      if (dropRoleEl) {
        if (isEmployer) {
          dropRoleEl.className = 'dropdown-role-badge role-badge-employer';
          dropRoleEl.innerHTML = '<i class="fa-solid fa-building"></i> Nhà Tuyển Dụng (Employer)';
        } else {
          dropRoleEl.className = 'dropdown-role-badge role-badge-candidate';
          dropRoleEl.innerHTML = '<i class="fa-solid fa-user-check"></i> Ứng Viên (Candidate)';
        }
      }

      // Switch role section tabs in dropdown
      if (isEmployer) {
        if (roleEmployerSection) roleEmployerSection.style.display = 'block';
        if (roleCandidateSection) roleCandidateSection.style.display = 'none';
        btnRoleEmployer?.classList.add('active');
        btnRoleCandidate?.classList.remove('active');
      } else {
        if (roleCandidateSection) roleCandidateSection.style.display = 'block';
        if (roleEmployerSection) roleEmployerSection.style.display = 'none';
        btnRoleCandidate?.classList.add('active');
        btnRoleEmployer?.classList.remove('active');
      }

      // Update menu saved count
      const menuSaved = document.getElementById('menu-saved-count');
      if (menuSaved) menuSaved.textContent = state.savedJobs ? state.savedJobs.size : 0;
    }

    // Check Local Storage on Boot or set default
    let activeUser = null;
    const savedUserJson = localStorage.getItem('vietnamjobs_auth_user');
    if (savedUserJson) {
      try {
        activeUser = JSON.parse(savedUserJson);
      } catch (e) {}
    }
    if (!activeUser) {
      activeUser = {
        name: 'Thean Lê',
        email: 'thean.le@vietnamjobs.vn',
        role: 'Candidate',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(activeUser));
    }
    renderUserAuthUI(activeUser);

    // Modern Capsule Search Interactions
    const searchInput = document.getElementById('top-capsule-search-input');
    const searchIcon = document.getElementById('btn-top-capsule-search');

    const handleHeaderSearch = () => {
      const q = searchInput?.value?.trim();
      if (q) {
        switchView('browse');
        const mainSearch = document.getElementById('browse-search-input') || document.getElementById('job-search-input');
        if (mainSearch) {
          mainSearch.value = q;
          mainSearch.dispatchEvent(new Event('input', { bubbles: true }));
        }
        showToast(`🔍 Đang tìm kiếm: "${q}"`);
      } else {
        switchView('browse');
      }
    };

    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        closeSearchPopover();
        handleHeaderSearch();
      }
    });
    searchIcon?.addEventListener('click', () => {
      closeSearchPopover();
      handleHeaderSearch();
    });

    // Premium Dynamic Search Features
    const searchWrapper = document.getElementById('header-search-experience');
    const searchCapsule = document.getElementById('header-search-capsule');
    const searchPopover = document.getElementById('search-suggestions-popover');

    const openSearchPopover = () => {
      if (searchPopover) searchPopover.classList.add('active');
      if (searchCapsule) searchCapsule.classList.add('focused');
    };

    const closeSearchPopover = () => {
      if (searchPopover) searchPopover.classList.remove('active');
      if (searchCapsule) searchCapsule.classList.remove('focused');
    };

    searchInput?.addEventListener('focus', openSearchPopover);
    searchInput?.addEventListener('click', (e) => {
      e.stopPropagation();
      openSearchPopover();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (searchWrapper && !searchWrapper.contains(e.target)) {
        closeSearchPopover();
      }
    });

    // Global Shortcut: Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput?.focus();
        openSearchPopover();
      } else if (e.key === 'Escape') {
        closeSearchPopover();
        searchInput?.blur();
      }
    });

    // Global Quick Search Selector
    window.selectQuickSearch = function(keyword) {
      if (searchInput) searchInput.value = keyword;
      closeSearchPopover();
      handleHeaderSearch();
    };

    // Keep Clean Fixed Placeholder (Matching Image 2 Reference)
    if (searchInput) {
      searchInput.setAttribute('placeholder', 'Search for jobs, companies, or keywords...');
    }

    // Sign In Submission
    formSignIn?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email')?.value?.trim();
      const pass = document.getElementById('signin-password')?.value;

      if (!email || !pass) {
        showToast('⚠️ Vui lòng nhập đầy đủ thông tin đăng nhập!');
        return;
      }

      const user = {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'Candidate',
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(user));
      renderUserAuthUI(user);
      window.closeAuthModal();
      showToast(`🎉 Xin chào ${user.name}! Đăng nhập thành công vào VietnamJobs.`);
    });

    // Quick Demo Logins
    document.getElementById('btn-quick-demo-candidate')?.addEventListener('click', () => {
      const demoCandidate = {
        name: 'Thean Lê',
        email: 'thean.le@vietnamjobs.vn',
        role: 'Candidate',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(demoCandidate));
      renderUserAuthUI(demoCandidate);
      window.closeAuthModal();
      showToast('⚡ Đăng nhập thành công với vai trò Ứng Viên (Thean Lê)!');
    });

    document.getElementById('btn-quick-demo-employer')?.addEventListener('click', () => {
      const demoEmployer = {
        name: 'Vinamilk Logistics HR',
        email: 'recruitment@vinamilk.com.vn',
        role: 'Employer',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(demoEmployer));
      renderUserAuthUI(demoEmployer);
      window.closeAuthModal();
      showToast('⚡ Đăng nhập thành công với vai trò Nhà Tuyển Dụng (Vinamilk HR)!');
    });

    // Sign Up Submission with Role
    formSignUp?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value?.trim();
      const email = document.getElementById('signup-email')?.value?.trim();
      const phone = document.getElementById('signup-phone')?.value?.trim();
      const role = document.getElementById('signup-role')?.value || 'Candidate';
      const password = document.getElementById('signup-password')?.value;

      if (!name || !email || !password) {
        showToast('⚠️ Vui lòng điền đầy đủ các thông tin có dấu *!');
        return;
      }

      const newUser = {
        name,
        email,
        phone,
        role,
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(newUser));
      renderUserAuthUI(newUser);
      window.closeAuthModal();
      const roleTitle = role === 'Employer' ? 'Nhà Tuyển Dụng' : 'Ứng Viên';
      showToast(`🎊 Chúc mừng ${name}! Đã tạo tài khoản ${roleTitle} thành công.`);
    });

    // Logout
    logoutBtn?.addEventListener('click', () => {
      localStorage.removeItem('vietnamjobs_auth_user');
      window.closeAllDropdowns();
      // Render as guest or reset
      renderUserAuthUI(null);
      showToast('👋 Bạn đã đăng xuất thành công.');
    });

    // Dropdown Shortcuts
    document.getElementById('dropdown-btn-saved')?.addEventListener('click', () => {
      window.closeAllDropdowns();
      switchView('browse');
      showToast('Xem các tin tuyển dụng đã lưu');
    });

    document.getElementById('dropdown-btn-applied')?.addEventListener('click', () => {
      window.closeAllDropdowns();
      showToast('📄 Bạn hiện có 1 hồ sơ đang trong quy trình xét duyệt.');
    });

    document.getElementById('dropdown-btn-post-job')?.addEventListener('click', () => {
      window.closeAllDropdowns();
      if (typeof openWizardModal === 'function') {
        openWizardModal();
      } else {
        showToast('Mở trình tạo tin tuyển dụng mới cho Nhà tuyển dụng');
      }
    });
  }

  function initFreelancersDirectory() {
    const grid = document.getElementById('freelancers-grid');
    if (!grid) return;

    grid.innerHTML = state.freelancers.map(f => {
      const skillsHtml = (f.skills || []).map(s => `<span class="detail-skill-pill" style="font-size:11.5px; padding:3px 10px;"><i class="fa-solid fa-check"></i> ${s}</span>`).join('');
      const avatarImg = f.photoUrl ? `<img src="${f.photoUrl}" alt="${f.name}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:var(--shadow-sm);" />` : `<div style="width:52px; height:52px; border-radius:50%; background:var(--fl-primary-light); color:var(--fl-primary); font-weight:800; display:flex; align-items:center; justify-content:center; font-size:16px;">${f.avatarText}</div>`;

      return `
        <div class="career-job-card candidate-clean-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:22px; cursor:default; border:1px solid #E2E8F0 !important; border-left:1px solid #E2E8F0 !important; border-radius:14px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:14px;">
                ${avatarImg}
                <div>
                  <h3 style="font-size:16px; font-weight:800; color:var(--fl-text-heading); margin-bottom:2px; display:flex; align-items:center; gap:6px;">
                    ${f.name}
                    <i class="fa-solid fa-circle-check" style="color:var(--fl-primary); font-size:13px;" title="Ứng viên đã xác thực"></i>
                  </h3>
                  <div style="font-size:13px; color:var(--fl-primary); font-weight:600;">${f.title}</div>
                  <div style="font-size:12px; color:var(--fl-text-light); margin-top:2px;">
                    <i class="fa-solid fa-location-dot"></i> ${f.country} • <i class="fa-solid fa-star" style="color:#eab308;"></i> ${f.rating} (${f.reviewsCount} đánh giá)
                  </div>
                </div>
              </div>
            </div>

            <p style="font-size:13px; color:var(--fl-text-body); line-height:1.5; margin-bottom:14px;">${f.bio || f.tagline}</p>
            
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
              ${skillsHtml}
            </div>
          </div>

          <div style="display:flex; gap:10px; border-top:1px solid var(--fl-border); padding-top:14px;">
            <button class="btn-signup-red-solid" style="flex:1; justify-content:center; padding:9px 12px; font-size:13px;" data-candidate-name="${f.name}">
              <i class="fa-solid fa-paper-plane"></i> Mời Phỏng Vấn
            </button>
            <button class="btn-login-red-outline" style="padding:9px 14px; font-size:13px;" data-view-profile="${f.name}">
              Xem CV
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-candidate-name]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-candidate-name');
        showToast(`✉️ Đã gửi lời mời phỏng vấn tới chuyên gia ${name}! Chúng tôi sẽ thông báo cho bạn ngay khi ứng viên phản hồi.`);
      });
    });

    grid.querySelectorAll('[data-view-profile]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-view-profile');
        showToast(`📄 Đang mở hồ sơ năng lực chi tiết của ${name}...`);
      });
    });
  }

  /* ==========================================================================
     API DATA SYNC
     ========================================================================== */
  function loadProjectsFromAPI() {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        const list = Array.isArray(resData) ? resData : (resData && Array.isArray(resData.data) ? resData.data : null);
        if (list && list.length > 0) {
          state.projects = list;
          renderHomeFeaturedProjects();
        }
      })
      .catch(() => {});
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
    
  /* ==========================================================================
     TAOBAO-STYLE ROTATING SEARCH PLACEHOLDER TICKER
     ========================================================================== */
  function initTaobaoSearchTicker() {
    const searchInputs = [
      document.getElementById('header-search-input'),
      document.getElementById('header-top-search-input')
    ].filter(Boolean);

    if (searchInputs.length === 0) return;

    const suggestions = [
      "🚀 Senior Java / Spring Boot Microservices (FPT, VCB)...",
      "💻 React 18 & Next.js 14 Fullstack Developer 35M+...",
      "🤖 AI & Machine Learning Solution Architect...",
      "🛍️ Digital Marketing Manager Shopee, Grab...",
      "📱 Senior Mobile Flutter / iOS Viettel Money...",
      "🎨 Senior Product UI/UX Designer Figma (MoMo, Tiki)...",
      "☁️ DevOps & Cloud AWS Kubernetes Engineer...",
      "⚡ Kỹ sư phần mềm VinFast Digital...",
      "🏢 Khám phá cơ hội tại 3,200+ doanh nghiệp hàng đầu..."
    ];

    let currentIndex = 0;
    let isFocused = false;

    searchInputs.forEach(input => {
      input.addEventListener('focus', () => { isFocused = true; });
      input.addEventListener('blur', () => { isFocused = false; });
    });

    setInterval(() => {
      if (isFocused) return;
      currentIndex = (currentIndex + 1) % suggestions.length;
      const nextText = suggestions[currentIndex];

      searchInputs.forEach(input => {
        if (!input.value) {
          input.setAttribute('placeholder', nextText);
        }
      });
    }, 2800);
  }

  
  /* ==========================================================================
     HOMEPAGE LIVE ACTIVITY TICKER & MARKET INSIGHTS CONTROLLER
     ========================================================================== */
  function initLiveActivityTicker() {
    // Check if user previously disabled ticker
    if (localStorage.getItem('vietnamjobs_hide_activity_ticker') === 'true') {
      return;
    }

    const toast = document.getElementById('live-activity-toast');
    const msgEl = document.getElementById('activity-toast-msg');
    const timeEl = document.getElementById('activity-toast-time');
    const closeBtn = document.getElementById('btn-close-activity-toast');
    const dontShowCb = document.getElementById('cb-dont-show-activity');
    const onlineCounter = document.getElementById('live-online-users');

    // Live Online Counter Fluctuation
    if (onlineCounter) {
      setInterval(() => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const current = parseInt(onlineCounter.textContent.replace(/,/g, ''), 10) || 1486;
        onlineCounter.textContent = (current + delta).toLocaleString();
      }, 4000);
    }

    if (!toast || !msgEl) return;

    let tickerInterval = null;
    let toastTimeout = null;

    // "Không hiện lại" Checkbox Event Listener
    dontShowCb?.addEventListener('change', (e) => {
      e.stopPropagation();
      if (dontShowCb.checked) {
        localStorage.setItem('vietnamjobs_hide_activity_ticker', 'true');
        toast.classList.remove('show');
        clearInterval(tickerInterval);
        clearTimeout(toastTimeout);
        showToast('ℹ️ Đã tắt thông báo hoạt động ứng tuyển');
      }
    });

    dontShowCb?.closest('.activity-toast-dont-show')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const activities = [
      { jobId: "prj-100", logo: "images/brands/fpt.svg", text: "Nguyễn Minh Tuấn vừa ứng tuyển <strong>Senior Backend Engineer</strong> tại FPT Software", time: "1 phút trước" },
      { jobId: "prj-101", logo: "images/brands/vcb.svg", text: "Vietcombank vừa gửi lời mời phỏng vấn tới ứng viên <strong>Trần Minh Quang</strong>", time: "3 phút trước" },
      { jobId: "prj-102", logo: "images/brands/vinfast.svg", text: "VinFast Digital vừa đăng tuyển 3 vị trí <strong>React / Next.js Senior</strong>", time: "5 phút trước" },
      { jobId: "prj-104", logo: "images/brands/shopee.svg", text: "Shopee Vietnam vừa nhận 4 hồ sơ ứng tuyển <strong>Digital Marketing Manager</strong>", time: "8 phút trước" },
      { jobId: "prj-103", logo: "images/brands/viettel.svg", text: "Vũ Đình Nam vừa nộp hồ sơ ứng tuyển <strong>Mobile Flutter Engineer</strong> tại Viettel", time: "12 phút trước" },
      { jobId: "prj-105", logo: "images/brands/momo.svg", text: "MoMo Fintech vừa xem hồ sơ của <strong>Nguyễn Hà My</strong> (UX Lead)", time: "15 phút trước" },
      { jobId: "prj-111", logo: "images/brands/samsung.svg", text: "Samsung R&D vừa mở tuyển 2 vị trí <strong>AI Data Engineer</strong>", time: "18 phút trước" }
    ];

    let actIndex = 0;
    let currentJobId = "prj-100";

    // Direct routing on toast click
    toast.addEventListener('click', (e) => {
      if (e.target.closest('.activity-toast-close') || e.target.closest('.activity-toast-dont-show')) return;
      if (currentJobId) {
        showJobDetail(currentJobId);
        toast.classList.remove('show');
      }
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      toast.classList.remove('show');
    });

    function showNextActivity() {
      if (document.hidden) return;
      if (localStorage.getItem('vietnamjobs_hide_activity_ticker') === 'true') return;

      const act = activities[actIndex];
      actIndex = (actIndex + 1) % activities.length;
      currentJobId = act.jobId;

      const imgEl = document.getElementById('activity-toast-img');
      if (imgEl && act.logo) imgEl.src = act.logo;
      if (msgEl) msgEl.innerHTML = act.text;
      if (timeEl) timeEl.innerHTML = '<span class="live-pulse-dot" style="width:6px;height:6px;"></span> ' + act.time + ' <span style="margin-left:6px;color:var(--fl-primary);font-weight:700;">Xem chi tiết &rarr;</span>';

      toast.classList.add('show');

      clearTimeout(toastTimeout);
      // Stay visible for 7.5 seconds for comfortable reading
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 7500);
    }

    // Start ticker with comfortable unhurried 18s interval
    setTimeout(() => {
      showNextActivity();
      tickerInterval = setInterval(showNextActivity, 18000);
    }, 4000);
  }

  function initMarketInsights() {
    const chips = document.querySelectorAll('.market-role-chip');
    const salaryEl = document.getElementById('insight-salary');
    const seniorEl = document.getElementById('insight-senior');
    const demandEl = document.getElementById('insight-demand');
    const openCountEl = document.getElementById('insight-open-count');
    const compEl = document.getElementById('insight-companies');
    const exploreBtn = document.getElementById('btn-explore-role-jobs');

    const roleData = {
      'java': {
        salary: '28 – 50 triệu/tháng',
        senior: 'Senior: 45 – 70 triệu/tháng',
        demand: '+42% Nhu Cầu',
        openCount: '1,240+ vị trí đang mở',
        companies: [
          { name: 'FPT Software', img: 'images/brands/fpt.svg' },
          { name: 'Vietcombank', img: 'images/brands/vcb.svg' },
          { name: 'VinFast Digital', img: 'images/brands/vinfast.svg' },
          { name: 'Viettel Digital', img: 'images/brands/viettel.svg' }
        ],
        keyword: 'Java'
      },
      'react': {
        salary: '25 – 45 triệu/tháng',
        senior: 'Senior / Lead: 40 – 65 triệu/tháng',
        demand: '+56% Nhu Cầu',
        openCount: '1,890+ vị trí đang mở',
        companies: [
          { name: 'VinFast Digital', img: 'images/brands/vinfast.svg' },
          { name: 'KiotViet', img: 'images/brands/kiotviet.svg' },
          { name: 'Tiki', img: 'images/brands/tiki.svg' },
          { name: 'Shopee', img: 'images/brands/shopee.svg' }
        ],
        keyword: 'React'
      },
      'ai': {
        salary: '35 – 65 triệu/tháng',
        senior: 'Principal / Architect: 60 – 100+ triệu/tháng',
        demand: '+84% Đột Phá',
        openCount: '860+ vị trí đang mở',
        companies: [
          { name: 'Vietcombank', img: 'images/brands/vcb.svg' },
          { name: 'VNPay', img: 'images/brands/vnpay.svg' },
          { name: 'FPT AI Lab', img: 'images/brands/fpt.svg' },
          { name: 'Samsung R&D', img: 'images/brands/samsung.svg' }
        ],
        keyword: 'AI'
      },
      'mobile': {
        salary: '25 – 45 triệu/tháng',
        senior: 'Senior: 40 – 60 triệu/tháng',
        demand: '+38% Nhu Cầu',
        openCount: '940+ vị trí đang mở',
        companies: [
          { name: 'Viettel Money', img: 'images/brands/viettel.svg' },
          { name: 'MoMo', img: 'images/brands/momo.svg' },
          { name: 'Grab Vietnam', img: 'images/brands/grab.svg' },
          { name: 'VNG', img: 'images/brands/vng.svg' }
        ],
        keyword: 'Mobile'
      },
      'design': {
        salary: '22 – 42 triệu/tháng',
        senior: 'Lead UX: 35 – 55 triệu/tháng',
        demand: '+35% Nhu Cầu',
        openCount: '780+ vị trí đang mở',
        companies: [
          { name: 'MoMo Fintech', img: 'images/brands/momo.svg' },
          { name: 'Grab Vietnam', img: 'images/brands/grab.svg' },
          { name: 'Tiki Corp', img: 'images/brands/tiki.svg' },
          { name: 'Shopee', img: 'images/brands/shopee.svg' }
        ],
        keyword: 'Design'
      },
      'marketing': {
        salary: '20 – 38 triệu/tháng',
        senior: 'Head of Marketing: 40 – 70 triệu/tháng',
        demand: '+48% Nhu Cầu',
        openCount: '1,450+ vị trí đang mở',
        companies: [
          { name: 'Shopee Vietnam', img: 'images/brands/shopee.svg' },
          { name: 'Grab Vietnam', img: 'images/brands/grab.svg' },
          { name: 'Unilever', img: 'images/brands/unilever.svg' },
          { name: "L'Oréal", img: 'images/brands/loreal.svg' }
        ],
        keyword: 'Marketing'
      }
    };

    let currentKeyword = 'Java';

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const role = chip.getAttribute('data-role');
        const data = roleData[role];
        if (!data) return;

        currentKeyword = data.keyword;

        if (salaryEl) salaryEl.textContent = data.salary;
        if (seniorEl) seniorEl.textContent = data.senior;
        if (demandEl) demandEl.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i> ' + data.demand;
        if (openCountEl) openCountEl.textContent = data.openCount;
        if (exploreBtn) exploreBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Xem ' + data.openCount.split('+')[0] + '+ Việc Này';

        if (compEl) {
          compEl.innerHTML = data.companies.map(c => `
            <span class="hiring-comp-tag"><img src="${c.img}" alt="${c.name}"> ${c.name}</span>
          `).join('');
        }
      });
    });

    exploreBtn?.addEventListener('click', () => {
      switchView('browse');
      const searchInput = document.getElementById('header-search-input');
      if (searchInput) searchInput.value = currentKeyword;
      renderBrowseProjects();
      showToast(`🚀 Đang lọc danh sách việc làm ngành "${currentKeyword}"!`);
    });
  }

  
  /* ==========================================================================
     GROSS ⇄ NET SALARY CALCULATOR & ATS CV TOOLKIT CONTROLLER
     ========================================================================== */
  function initSalaryCalculator() {
    const grossBtn = document.getElementById('btn-calc-gross-to-net');
    const netBtn = document.getElementById('btn-calc-net-to-gross');
    const salaryInput = document.getElementById('calc-input-salary');
    const modeLabel = document.getElementById('calc-salary-mode-label');
    const dependentsSelect = document.getElementById('calc-dependents');
    const calcBtn = document.getElementById('btn-do-calculate');
    const resultTitle = document.getElementById('calc-result-title');
    const resultNetVal = document.getElementById('calc-net-result');
    const bhxhVal = document.getElementById('calc-bhxh-val');
    const bhytVal = document.getElementById('calc-bhyt-val');
    const bhtnVal = document.getElementById('calc-bhtn-val');
    const taxVal = document.getElementById('calc-tax-val');

    let isGrossToNet = true;

    grossBtn?.addEventListener('click', () => {
      isGrossToNet = true;
      grossBtn.classList.add('active');
      netBtn?.classList.remove('active');
      if (modeLabel) modeLabel.textContent = 'GROSS';
      if (resultTitle) resultTitle.textContent = 'LƯƠNG THỰC NHẬN (NET):';
      calculate();
    });

    netBtn?.addEventListener('click', () => {
      isGrossToNet = false;
      netBtn.classList.add('active');
      grossBtn?.classList.remove('active');
      if (modeLabel) modeLabel.textContent = 'NET';
      if (resultTitle) resultTitle.textContent = 'LƯƠNG GROSS CẦN ĐỀ XUẤT:';
      calculate();
    });

    function formatNumber(num) {
      return num.toLocaleString('vi-VN') + ' ₫';
    }

    function parseSalary(val) {
      if (!val) return 25000000;
      const clean = val.replace(/[^0-9]/g, '');
      return parseInt(clean, 10) || 25000000;
    }

    salaryInput?.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      if (raw) {
        e.target.value = parseInt(raw, 10).toLocaleString('en-US');
      }
    });

    function calculate() {
      const rawSalary = parseSalary(salaryInput?.value);
      const dependents = parseInt(dependentsSelect?.value || '0', 10);
      const selfDeduction = 11000000; // 11M VND per month
      const dependentDeduction = dependents * 4400000; // 4.4M per dependent

      let gross = rawSalary;
      let net = 0;

      if (isGrossToNet) {
        gross = rawSalary;
        // Insurance rates: BHXH 8%, BHYT 1.5%, BHTN 1%
        const bhxh = Math.round(gross * 0.08);
        const bhyt = Math.round(gross * 0.015);
        const bhtn = Math.round(gross * 0.01);
        const totalInsurance = bhxh + bhyt + bhtn;

        // Income before tax
        const incomeBeforeTax = Math.max(0, gross - totalInsurance);
        const taxableIncome = Math.max(0, incomeBeforeTax - selfDeduction - dependentDeduction);

        // Progressive PIT Tax (Thuế TNCN luỹ tiến 2026)
        let pit = 0;
        if (taxableIncome <= 5000000) pit = taxableIncome * 0.05;
        else if (taxableIncome <= 10000000) pit = 250000 + (taxableIncome - 5000000) * 0.1;
        else if (taxableIncome <= 18000000) pit = 750000 + (taxableIncome - 10000000) * 0.15;
        else if (taxableIncome <= 32000000) pit = 1950000 + (taxableIncome - 18000000) * 0.2;
        else if (taxableIncome <= 52000000) pit = 4750000 + (taxableIncome - 32000000) * 0.25;
        else if (taxableIncome <= 80000000) pit = 9750000 + (taxableIncome - 52000000) * 0.3;
        else pit = 18150000 + (taxableIncome - 80000000) * 0.35;

        pit = Math.round(pit);
        net = Math.max(0, gross - totalInsurance - pit);

        if (resultNetVal) resultNetVal.textContent = formatNumber(net);
        if (bhxhVal) bhxhVal.textContent = '-' + formatNumber(bhxh);
        if (bhytVal) bhytVal.textContent = '-' + formatNumber(bhyt);
        if (bhtnVal) bhtnVal.textContent = '-' + formatNumber(bhtn);
        if (taxVal) taxVal.textContent = pit > 0 ? ('-' + formatNumber(pit)) : '0 ₫';
      } else {
        // NET to GROSS estimation
        net = rawSalary;
        gross = Math.round(net / 0.895);
        const bhxh = Math.round(gross * 0.08);
        const bhyt = Math.round(gross * 0.015);
        const bhtn = Math.round(gross * 0.01);

        if (resultNetVal) resultNetVal.textContent = formatNumber(gross);
        if (bhxhVal) bhxhVal.textContent = formatNumber(bhxh);
        if (bhytVal) bhytVal.textContent = formatNumber(bhyt);
        if (bhtnVal) bhtnVal.textContent = formatNumber(bhtn);
        if (taxVal) taxVal.textContent = 'Quy đổi luỹ tiến';
      }
    }

    calcBtn?.addEventListener('click', () => {
      calculate();
      showToast('⚡ Đã tính xong mức thu nhập theo luật BHXH 2026!');
    });

    dependentsSelect?.addEventListener('change', calculate);

    // ATS CV Toolkit Download Handler
    document.getElementById('btn-download-cv-kit')?.addEventListener('click', () => {
      showToast('📥 Đang tải trọn bộ 50+ Mẫu CV Chuẩn ATS 2026 (Format .DOCX & .PDF)...');
      setTimeout(() => {
        showToast('✅ Tải hoàn tất! Chúc bạn ứng tuyển thành công vị trí mơ ước.');
      }, 1500);
    });
  }


  function showToast(msg, duration = 3800) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }



  // Expose switchView globally for external triggers (like Courses and Category clicks)
  window.switchView = function(viewId, updateHash = true) {
  window.startPageLoading();
  setTimeout(() => {
    switchView(viewId, updateHash);
    window.finishPageLoading();
  }, 100);
};

  // 1. YouTube Broadcasts Hub Controller
  function initYouTubeHub() {
    const iframe = document.getElementById('main-yt-iframe');
    const titleEl = document.getElementById('main-yt-title');
    const categoryEl = document.getElementById('main-yt-category');
    const dateEl = document.getElementById('main-yt-date');
    const durationEl = document.getElementById('main-yt-duration');
    const excerptEl = document.getElementById('main-yt-excerpt');
    const linkEl = document.getElementById('main-yt-external-link');
    const playlistItems = document.querySelectorAll('.fw-yt-item');
    if (!iframe || !playlistItems.length) return;

    playlistItems.forEach(item => {
      item.addEventListener('click', () => {
        playlistItems.forEach(i => {
          i.classList.remove('active');
          const tag = i.querySelector('.fw-yt-item-tag');
          if (tag && tag.textContent === 'Now Playing') {
            tag.textContent = i.dataset.category || 'Broadcast';
          }
        });

        item.classList.add('active');
        const curTag = item.querySelector('.fw-yt-item-tag');
        if (curTag) curTag.textContent = 'Now Playing';

        const ytId = item.dataset.ytId;
        const title = item.dataset.title;
        const category = item.dataset.category;
        const date = item.dataset.date;
        const duration = item.dataset.duration;
        const excerpt = item.dataset.excerpt;

        if (ytId) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&enablejsapi=1`;
        }
        if (titleEl) titleEl.textContent = title;
        if (categoryEl) categoryEl.textContent = category;
        if (dateEl) dateEl.textContent = date;
        if (durationEl) durationEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${duration}`;
        if (excerptEl) excerptEl.textContent = excerpt;
        if (linkEl && ytId) linkEl.href = `https://www.youtube.com/watch?v=${ytId}`;
      });
    });
  }

  // Initialize YouTube Hub on load
  initYouTubeHub();

  // Category filter trigger
  window.filterJobsByCategory = function(categoryKey) {
    if (typeof switchView === 'function') {
      switchView('browse');
    }
    const catMap = {
      'forwarding': 'Freight Forwarding',
      'robotics': 'Warehousing',
      'fleet': 'Trucking',
      'customs': 'Customs',
      'coldchain': 'Cold Chain',
      'port': 'Port',
      'aviation': 'Air Cargo',
      'express': 'Express',
      'procurement': 'Procurement',
      'software': 'Logistics Tech',
      'supplychain': 'Supply Chain',
      'distribution': 'Distribution',
      'inventory': 'Inventory',
      'ecommerce': 'E-Commerce Logistics',
      'crossborder': 'Cross-Border',
      'projectcargo': 'Project Cargo',
      'dangerous': 'Hazardous Cargo',
      'lastmile': 'Last Mile',
      'rail': 'Rail Freight',
      'terminal': 'Inland Container Depot'
    };
    const kw = catMap[categoryKey] || categoryKey;
    const searchInput = document.getElementById('search-input-browse') || document.getElementById('hero-search-input');
    if (searchInput && kw !== 'all') {
      searchInput.value = kw;
      if (typeof applyFilters === 'function') applyFilters();
    }
  };

});

/* ==========================================================================
   ENTERPRISE COMPANIES SHOWCASE, TECH + AI, PRICING, EVENTS & B2B LEADS JS
   ========================================================================== */

const enterpriseCompaniesData = [
  {
    id: 'maersk',
    name: 'A.P. Moller - Maersk (Vietnam & Greater Mekong)',
    logo: 'images/brands/maersk.svg',
    industry: 'Integrated Ocean & Inland Logistics',
    category: 'logistics',
    tagline: 'Connecting and simplifying global supply chains with digital ocean & inland solutions',
    location: 'TP. Hồ Chí Minh & Hà Nội, Việt Nam',
    size: '100,000+ toàn cầu (2,500+ tại VN)',
    founded: '1904',
    website: 'https://www.maersk.com',
    desc: 'A.P. Moller - Maersk là tập đoàn logistics tích hợp hàng đầu thế giới, kết nối vận tải container đường biển, kho bãi thông minh, logistics hàng không và chuỗi cung ứng lạnh xuyên lục địa với công nghệ số hóa toàn diện.',
    techStack: ['IoT Remote Container Management (RCM)', 'AI Trade Visibility Platform', 'Maersk Flow Cloud API', 'Automated Cold Storage AMR', 'Cybersecurity ISO 27001', 'Decarbonization Data Engine'],
    stats: { services: 4, plans: 3, events: 2, jobs: 8 },
    services: [
      {
        id: 'srv-maersk-1',
        title: 'Hệ Thống IoT RCM (Remote Container Management) Giám Sát Container Lạnh',
        icon: 'fa-snowflake',
        desc: 'Giám sát nhiệt độ, độ ẩm và thông số khí quyển của container lạnh 24/7 từ cảng xuất phát đến cảng đích với cảm biến thông minh và vệ tinh theo thời gian thực.',
        features: [
          'Truy cập dữ liệu trực tiếp 24/7 từ nền tảng web & ứng dụng di động Maersk',
          'Tự động gửi thông báo khi phát hiện bất thường về chuỗi làm lạnh',
          'Chứng thực tiêu chuẩn bảo quản cho hàng nông thủy sản xuất khẩu EU và Mỹ'
        ]
      },
      {
        id: 'srv-maersk-2',
        title: 'Tích Hợp API Maersk Flow & Vận Đơn Điện Tử e-BL',
        icon: 'fa-network-wired',
        desc: 'Số hóa 100% hồ sơ hải quan, booking trực tuyến và theo dõi lô hàng thời gian thực qua giao diện API doanh nghiệp kết nối trực tiếp với hệ thống ERP của bạn.',
        features: [
          'Booking container đường biển và vận tải nội địa tức thì (Instant Booking Guarantee)',
          'Đồng bộ hóa vận đơn điện tử e-BL loại bỏ rủi ro thất lạc chứng từ giấy',
          'Bảo mật dữ liệu cấp ngân hàng với mã hóa AES-256'
        ]
      },
      {
        id: 'srv-maersk-3',
        title: 'Mạng Lưới Kho Bãi Logistics Xanh Đạt Chuẩn LEED Gold',
        icon: 'fa-warehouse',
        desc: 'Trung tâm phân phối tự động hóa tại Bình Dương và Bắc Ninh ứng dụng robot AMR và hệ thống quản lý WMS thông minh, vận hành 100% năng lượng mặt trời.',
        features: [
          'Tối ưu hóa vị trí lưu kho bằng thuật toán AI phân bổ hàng hóa',
          'Tốc độ hoàn tất đơn hàng nhanh gấp 3 lần so với kho truyền thống',
          'Đạt tiêu chuẩn chứng nhận công trình xanh quốc tế LEED Gold'
        ]
      },
      {
        id: 'srv-maersk-4',
        title: 'Giải Pháp Vận Tải Giảm Phát Thải ECO Delivery',
        icon: 'fa-leaf',
        desc: 'Dịch vụ vận tải container trung hòa carbon ứng dụng nhiên liệu sinh học tiên tiến thế hệ mới với chứng chỉ xác thực giảm phát thải khí nhà kính theo chuẩn quốc tế.',
        features: [
          'Giảm tới 82% lượng phát thải CO2 so với vận tải nhiên liệu hóa thạch truyền thống',
          'Cung cấp chứng chỉ kiểm toán phát thải carbon độc lập cho báo cáo ESG doanh nghiệp',
          'Tích hợp liền mạch trên mọi tuyến vận tải đường biển quốc tế'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-maersk-pilot',
        name: 'Gói Kết Nối Số Hóa (Digital Connect Tier)',
        price: '5.500.000 đ',
        period: '/tháng hoặc theo lô hàng',
        badge: 'Dành Cho SME',
        popular: false,
        desc: 'Phù hợp cho các doanh nghiệp xuất nhập khẩu vừa và nhỏ bắt đầu số hóa quy trình đặt chỗ và theo dõi vận đơn container.',
        features: [
          'Tra cứu giá cước đường biển tức thì (Spot Rates) trên 300+ cảng toàn cầu',
          'Theo dõi trực tuyến định vị container theo thời gian thực',
          'Tạo và phê duyệt vận đơn trực tuyến e-BL',
          'Hỗ trợ kỹ thuật 24/7 từ chuyên viên logistics Maersk'
        ],
        ctaText: 'Đăng Ký Dùng Thử Ngay'
      },
      {
        id: 'price-maersk-pro',
        name: 'Gói Doanh Nghiệp Tích Hợp (Integrated Pro Tier)',
        price: '18.500.000 đ',
        period: '/tháng',
        badge: 'Doanh Nghiệp Đề Xuất',
        popular: true,
        desc: 'Giải pháp tích hợp toàn diện đường biển, đường bộ nội địa và kho bãi phân phối tự động cho doanh nghiệp quy mô lớn.',
        features: [
          'Toàn bộ tính năng của Gói Kết Nối Số Hóa',
          'Tích hợp 2 chiều API Maersk Flow vào hệ thống ERP / TMS của khách hàng',
          'Dịch vụ giám sát container lạnh cao cấp IoT RCM với cảnh báo tự động',
          'Cam kết giữ chỗ container mùa cao điểm (Priority Loading Guarantee)',
          'Quản lý tài khoản doanh nghiệp chuyên trách (Dedicated Account Manager)'
        ],
        ctaText: 'Đăng Ký Gói Pro'
      },
      {
        id: 'price-maersk-ent',
        name: 'Gói Chiến Lược Chuỗi Cung Ứng (Strategic Custom Enterprise)',
        price: 'May đo linh hoạt',
        period: 'theo hợp đồng năm',
        badge: 'Tập Đoàn Đa Quốc Gia',
        popular: false,
        desc: 'Thiết kế chuỗi cung ứng đầu-cuối riêng biệt cho tập đoàn sản xuất, chuỗi bán lẻ đa quốc gia và thương mại điện tử xuyên biên giới.',
        features: [
          'Toàn bộ tính năng của Gói Doanh Nghiệp Tích Hợp',
          'Thuê riêng kho bãi trung chuyển tự động AMR tại Hải Phòng / Bình Dương',
          'Giải pháp vận tải xanh ECO Delivery đạt tiêu chuẩn trung hòa carbon',
          'Cam kết chất lượng dịch vụ SLA 99.9% có bồi hoàn hợp đồng',
          'Kiến trúc sư giải pháp chuỗi cung ứng hỗ trợ tư vấn 1-1'
        ],
        ctaText: 'Liên Hệ Báo Giá May Đo'
      }
    ],
    events: [
      {
        id: 'evt-maersk-1',
        title: 'Maersk Tech Talk: Tương Lai Chuỗi Cung Ứng Xanh & Khử Carbon Logistics 2026',
        date: '15 Tháng 12, 2026',
        time: '09:00 - 11:30',
        type: 'Hội Thảo Trực Tuyến & Trực Tiếp',
        location: 'Maersk Innovation Center, TP. Hồ Chí Minh & Zoom Webinar',
        speaker: 'Alex Byelyavtsev (Master Mariner & Digital Transformation Director)',
        desc: 'Chia sẻ các điển hình thực tế về việc chuyển đổi 25+ đoàn xe tải điện, khử carbon vận tải đường biển và ứng dụng IoT viễn thông vào chuỗi cung ứng lạnh.',
        badge: 'Sắp Diễn Ra'
      },
      {
        id: 'evt-maersk-2',
        title: 'B2B Summit: Tối Ưu Lộ Trình & Khắc Phục Đứt Gãy Chuỗi Cung Ứng Bằng AI',
        date: '28 Tháng 12, 2026',
        time: '14:00 - 17:00',
        type: 'Hội Nghị Doanh Nghiệp Cấp Cao',
        location: 'Khách sạn JW Marriott, Hà Nội',
        speaker: 'Kristina Garbe (Key Client Director Automotive & Supply Chain)',
        desc: 'Hội nghị kết nối các giám đốc chuỗi cung ứng (CSCO) và chuyên gia công nghệ bàn về chiến lược thích ứng với biến động thương mại toàn cầu.',
        badge: 'Đăng Ký Giới Hạn'
      }
    ],
    jobs: [
      {
        id: 'job-maersk-1',
        title: 'Senior Supply Chain Solution Architect (Ocean & Inland)',
        salary: '55 - 80 triệu / tháng',
        location: 'TP. Hồ Chí Minh (Quận 1)',
        type: 'Toàn thời gian',
        tags: ['Supply Chain Design', 'ERP Integration', 'Logistics AI']
      },
      {
        id: 'job-maersk-2',
        title: 'IoT Cold Chain Telematics & Operations Specialist',
        salary: '35 - 55 triệu / tháng',
        location: 'Hải Phòng & Hà Nội',
        type: 'Toàn thời gian',
        tags: ['IoT', 'Reefer Telematics', 'Cold Chain']
      },
      {
        id: 'job-maersk-3',
        title: 'Logistics API Integration Engineer (EDI & CargoWise)',
        salary: '40 - 65 triệu / tháng',
        location: 'TP. Hồ Chí Minh / Hybrid',
        type: 'Toàn thời gian',
        tags: ['API Integration', 'CargoWise', 'Python/Cloud']
      }
    ]
  },
  {
    id: 'vinfast',
    name: 'VinFast Logistics & Cold Chain Solutions',
    logo: 'images/brands/vinfast.svg',
    industry: 'Logistics Tech & AI Cold Chain',
    category: 'ai',
    tagline: 'Kiến trúc chuỗi cung ứng lạnh thông minh & vận tải tự hành thế hệ mới',
    location: 'Hải Phòng & TP. Hồ Chí Minh, Việt Nam',
    size: '10,000+ nhân sự',
    founded: '2017',
    website: 'https://vinfastauto.com',
    desc: 'VinFast Logistics tiên phong ứng dụng trí tuệ nhân tạo (AI) và mạng lưới viễn thông IoT để tối ưu hóa tuyến vận tải pin xe điện, logistics chuỗi cung ứng lạnh xuyên biên giới ASEAN và mạng lưới trạm phân phối thông minh.',
    techStack: ['Vision AI', 'Route Optimization ML', 'IoT Telematics', 'PyTorch', 'Kubernetes', 'Apache Kafka'],
    stats: { services: 4, plans: 3, events: 2, jobs: 6 },
    services: [
      {
        id: 'srv-vf-1',
        title: 'Hệ Thống IoT Telematics Chuỗi Lạnh Thông Minh',
        icon: 'fa-snowflake',
        desc: 'Giám sát nhiệt độ, độ ẩm và định vị thời gian thực cho đội xe container lạnh và kho lạnh sâu với độ chính xác 99.98%. Cảnh báo nguy cơ lệch nhiệt tự động qua AI.',
        features: [
          'Độ trễ truyền dữ liệu dưới 1.5 giây qua mạng 5G/IoT vệ tinh',
          'Tích hợp tự động hệ thống khai báo hải quan điện tử VNACCS',
          'Báo cáo tự động chuẩn GDP (Good Distribution Practice) cho dược phẩm và vắc xin'
        ]
      },
      {
        id: 'srv-vf-2',
        title: 'AI Dynamic Route Optimization Engine',
        icon: 'fa-route',
        desc: 'Thuật toán học máy phân tích dữ liệu lưu lượng giao thông lịch sử và thời gian thực để tính toán hải trình và lộ trình xe tải tối ưu, giảm 18% chi phí tiêu hao nhiên liệu.',
        features: [
          'Cân bằng tải động giữa 40+ cụm trung chuyển phân phối Bắc - Nam',
          'Dự đoán thời gian cập cảng (ETA) chính xác tới từng phút',
          'Giảm thiểu tối đa tình trạng chạy rỗng (Empty-Miles Reduction)'
        ]
      },
      {
        id: 'srv-vf-3',
        title: 'Cổng Tích Hợp API B2B EDI & Logistics Microservices',
        icon: 'fa-network-wired',
        desc: 'Hạ tầng kết nối API cấp doanh nghiệp cho phép đối tác ERP (SAP, Oracle, CargoWise) đồng bộ hóa vận đơn điện tử e-BL và hóa đơn cước vận chuyển tức thì.',
        features: [
          'Chuẩn bảo mật ngân hàng OAuth2, mTLS và mã hóa dữ liệu AES-256',
          'Khả năng chịu tải 150,000 requests/phút thời điểm cao điểm',
          'Cam kết SLA hệ thống vận hành 99.99%'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-vf-pilot',
        name: 'Gói Thử Nghiệm (Pilot Tier)',
        price: '₫15.000.000',
        period: '/tháng',
        desc: 'Phù hợp cho các doanh nghiệp thử nghiệm giải pháp theo dõi chuỗi lạnh và định vị AI trên quy mô nhỏ.',
        popular: false,
        features: [
          'Triển khai tối đa 10 cảm biến IoT & xe vận tải',
          'Truy cập bảng điều khiển phân tích AI cơ bản',
          'Xuất báo cáo định kỳ hàng tuần',
          'Hỗ trợ kỹ thuật qua Email & Ticket (giờ hành chính)'
        ]
      },
      {
        id: 'price-vf-pro',
        name: 'Gói Doanh Nghiệp (Growth Pro)',
        price: '₫45.000.000',
        period: '/tháng',
        desc: 'Giải pháp toàn diện tối ưu hóa lộ trình xe tải và quản lý kho vận thông minh thời gian thực.',
        popular: true,
        features: [
          'Triển khai không giới hạn tới 80 phương tiện / kho bãi',
          'Đầy đủ thuật toán AI tối ưu hóa lộ trình đa điểm',
          'Cảnh báo nhiệt độ & sự cố tức thì qua SMS / Telegram / App',
          'Cam kết SLA vận hành 99.9% và hỗ trợ kỹ thuật 24/7'
        ]
      },
      {
        id: 'price-vf-ent',
        name: 'Gói May Đo Doanh Nghiệp (Enterprise Custom)',
        price: 'Theo Quy Mô',
        period: '',
        desc: 'Kiến trúc hạ tầng dành riêng cho các tập đoàn đa quốc gia và tổng công ty logistics.',
        popular: false,
        features: [
          'Triển khai On-Premise hoặc Dedicated Private Cloud',
          'Huấn luyện riêng mô hình AI trên dữ liệu logistics nội bộ',
          'Chuyên gia Solutions Architect trực tiếp đồng hành dự án',
          'Tích hợp sâu hệ sinh thái ERP / WMS / TMS theo yêu cầu'
        ]
      }
    ],
    events: [
      {
        id: 'evt-vf-1',
        title: 'Vietnam AI & Smart Logistics Innovation Summit 2026',
        format: 'Live Summit & Hybrid',
        date: '15/12/2026 • 08:30 - 17:00',
        location: 'GEM Center, Quận 1, TP. Hồ Chí Minh & Trực tuyến',
        desc: 'Diễn đàn thường niên quy tụ 800+ lãnh đạo chuỗi cung ứng, chuyên gia AI và cơ quan ban ngành cùng thảo luận lộ trình chuyển đổi số và trung hòa carbon.'
      },
      {
        id: 'evt-vf-2',
        title: 'Workshop Kỹ Thuật: Tối Ưu Hóa Tuyến Đường Vận Tải Bằng AI & Digital Twins',
        format: 'Hands-on Webinar',
        date: '28/11/2026 • 14:00 - 16:30',
        location: 'Virtual Zoom / Google Meet Webinar',
        desc: 'Chia sẻ kiến trúc thực chiến từ đội ngũ kỹ sư AI VinFast về cách mô phỏng bản sao số (Digital Twin) để cắt giảm 18% chi phí nhiên liệu.'
      }
    ]
  },
  {
    id: 'fpt',
    name: 'FPT Software AI & Digital Labs',
    logo: 'images/brands/fpt.svg',
    industry: 'Enterprise AI & Cloud Engineering',
    category: 'tech',
    tagline: 'Tiên phong phát triển các mô hình Generative AI và giải pháp chuyển đổi số toàn cầu',
    location: 'Hà Nội, Đà Nẵng & TP. Hồ Chí Minh',
    size: '30,000+ nhân sự',
    founded: '1999',
    website: 'https://fpt-software.com',
    desc: 'FPT Software cung cấp các giải pháp trí tuệ nhân tạo toàn diện từ Generative AI, Computer Vision, xử lý ngôn ngữ tự nhiên (NLP) cho tới các hệ thống đám mây phân tán cho hàng trăm tập đoàn trong danh sách Fortune 500.',
    techStack: ['Generative AI', 'Large Language Models', 'Computer Vision', 'Python', 'Go', 'AWS / Azure'],
    stats: { services: 5, plans: 3, events: 3, jobs: 8 },
    services: [
      {
        id: 'srv-fpt-1',
        title: 'FPT AI Mentor & Agentic AI Workflow Solutions',
        icon: 'fa-brain',
        desc: 'Hệ thống trợ lý ảo và Agentic AI tự hành có khả năng xử lý nghiệp vụ tự động, phân tích tài liệu hợp đồng và tự động hóa quy trình khách hàng (RPA).',
        features: [
          'Hỗ trợ mô hình ngôn ngữ tiếng Việt chuyên ngành chính xác cao',
          'Tự động hóa 80% tác vụ giải đáp và xử lý ticket nội bộ',
          'Bảo mật dữ liệu tuyệt đối theo tiêu chuẩn ISO 27001'
        ]
      },
      {
        id: 'srv-fpt-2',
        title: 'Computer Vision & OCR Trích Xuất Dữ Liệu Tự Động',
        icon: 'fa-eye',
        desc: 'Nhận diện và số hóa tức thì chứng từ vận tải, hóa đơn GTGT, căn cước công dân và hợp đồng kinh tế với độ chính xác trên 99.2%.',
        features: [
          'Xử lý hơn 200 định dạng hóa đơn và bill of lading quốc tế',
          'Thời gian nhận diện dưới 0.8 giây / trang tài liệu',
          'Tích hợp trực tiếp hệ thống kho dữ liệu Data Lakehouse'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-fpt-starter',
        name: 'Gói Khởi Động AI (AI Starter Pack)',
        price: '₫25.000.000',
        period: '/tháng',
        desc: 'Bộ công cụ OCR và Chatbot AI cơ bản cho doanh nghiệp số hóa chứng từ và tương tác khách hàng.',
        popular: false,
        features: [
          'Xử lý 10,000 trang chứng từ OCR / tháng',
          '1 Trợ lý AI hỏi đáp nội bộ chuyên nghiệp',
          'Tích hợp API Webhook cơ bản',
          'Hỗ trợ kỹ thuật 8/5'
        ]
      },
      {
        id: 'price-fpt-scale',
        name: 'Gói Chuyển Đổi Số (Enterprise Scale)',
        price: '₫75.000.000',
        period: '/tháng',
        desc: 'Tích hợp Agentic AI và xử lý thị giác máy tính vào toàn bộ chu trình nghiệp vụ doanh nghiệp.',
        popular: true,
        features: [
          'Xử lý 100,000 trang chứng từ OCR / tháng',
          'Triển khai đa Agent AI kết nối cơ sở dữ liệu nội bộ',
          'Mô hình Fine-tuned chuyên biệt theo dữ liệu công ty',
          'Hỗ trợ kỹ thuật 24/7 với Dedicated Account Manager'
        ]
      },
      {
        id: 'price-fpt-custom',
        name: 'Gói May Đo Dự Án (Strategic Custom)',
        price: 'Báo Giá Dự Án',
        period: '',
        desc: 'Phát triển giải pháp công nghệ và hệ sinh thái phần mềm quy mô lớn.',
        popular: false,
        features: [
          'Đội ngũ kỹ sư chuyên trách biệt phái (Dedicated Engineering Squad)',
          'Tư vấn chiến lược kiến trúc tổng thể Enterprise Architecture',
          'Bàn giao toàn bộ mã nguồn và bản quyền sở hữu trí tuệ',
          'Bảo hành và tối ưu hóa hệ thống lâu dài'
        ]
      }
    ],
    events: [
      {
        id: 'evt-fpt-1',
        title: 'FPT AI Summit 2026: The Age of Autonomous Agentic AI',
        format: 'Grand Technology Conference',
        date: '20/12/2026 • 09:00 - 16:30',
        location: 'Trung tâm Hội nghị Quốc gia, Hà Nội & Livestream toàn cầu',
        desc: 'Sự kiện công nghệ thường niên lớn nhất của FPT giới thiệu các giải pháp Agentic AI tự hành và ứng dụng thực tiễn trong ngân hàng, sản xuất và logistics.'
      }
    ]
  },
  {
    id: 'saigon-newport',
    name: 'Saigon Newport Corporation (TCIT / SNP)',
    logo: 'images/brands/saigon-newport.svg',
    industry: 'Cảng Biển & Hạ Tầng Logistics Số Hóa',
    category: 'logistics',
    tagline: 'Nhà khai thác cảng biển hàng đầu Việt Nam chiếm trên 50% thị phần container xuất nhập khẩu',
    location: 'Cát Lái, Cái Mép & Hải Phòng',
    size: '8,000+ nhân sự',
    founded: '1989',
    website: 'https://saigonnewport.com.vn',
    desc: 'Tổng công ty Tân Cảng Sài Gòn là biểu tượng dẫn đầu ngành cảng biển Việt Nam, ứng dụng hệ thống quản trị khai thác cảng tự động hóa cao cấp Navis N4 và mạng lưới cảng cạn ICD hiện đại.',
    techStack: ['Navis N4 TOS', 'Automated Quayside Dispatch', 'Port EDI Hub', 'IoT Crane Sensors'],
    stats: { services: 4, plans: 3, events: 2, jobs: 4 },
    services: [
      {
        id: 'srv-snp-1',
        title: 'Hệ Thống Thủ Tục Cảng Điện Tử ePort & Lệnh Giao Hàng eDO',
        icon: 'fa-file-invoice',
        desc: 'Giải pháp thanh toán và làm thủ tục trực tuyến 100%, giảm 90% thời gian chờ đợi nhận container tại cổng cảng.',
        features: [
          'Thanh toán trực tuyến bảo mật qua Napas, Vietcombank, MBBank',
          'Tự động kết nối cơ sở dữ liệu Hải quan điện tử một cửa quốc gia',
          'Tra cứu tình trạng container 24/7 trên ứng dụng di động'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-snp-custom',
        name: 'Gói Dịch Vụ Cảng & Kho Bãi Chuyên Biệt',
        price: 'Liên Hệ Báo Giá',
        period: '',
        desc: 'Báo giá chính thức các dịch vụ nâng hạ, lưu bãi, đóng rút hàng và chuyển cảng theo biểu cước quy định.',
        popular: true,
        features: [
          'Biểu cước minh bạch theo quy chuẩn Bộ Giao thông Vận tải',
          'Chính sách chiết khấu ưu đãi cho hãng tàu và chủ hàng lớn',
          'Hỗ trợ làm thủ tục hải quan và kiểm hóa nhanh tại bãi'
        ]
      }
    ],
    events: [
      {
        id: 'evt-snp-1',
        title: 'Hội Thảo Logistics Xanh & Cảng Biển Thông Minh 2026',
        format: 'Industry Conference',
        date: '10/01/2027 • 08:30 - 12:00',
        location: 'Khách sạn Lotte Hotel Saigon, TP. Hồ Chí Minh',
        desc: 'Định hướng chuyển đổi hạ tầng cẩu điện chạy pin, năng lượng mặt trời áp mái và giải pháp cảng thông minh giảm phát thải ròng.'
      }
    ]
  },
  {
    id: 'logivan',
    name: 'Logivan Vietnam Freight Network',
    logo: 'images/brands/logivan.svg',
    industry: 'LogiTech & Nền Tảng Vận Tải Số',
    category: 'tech',
    tagline: 'Uber của ngành vận tải xe tải hàng hóa đường dài tại Việt Nam',
    location: 'Hà Nội & TP. Hồ Chí Minh',
    size: '300+ nhân sự',
    founded: '2017',
    website: 'https://logivan.com',
    desc: 'Logivan kết nối mạng lưới hơn 40,000 chủ xe tải với hàng nghìn doanh nghiệp sản xuất, ứng dụng thuật toán trí tuệ nhân tạo để ghép chuyến hàng chiều về, cắt giảm chi phí vận tải lên đến 30%.',
    techStack: ['AI Matching Algorithm', 'Dynamic Rate Index', 'Geospatial Analytics', 'Snowflake', 'BigQuery'],
    stats: { services: 3, plans: 3, events: 1, jobs: 5 },
    services: [
      {
        id: 'srv-logi-1',
        title: 'Nền Tảng Điều Phối Xe Tải Ghép Chuyến Bằng AI',
        icon: 'fa-truck-fast',
        desc: 'Tự động ghép đơn hàng với xe tải trống chiều về trên toàn tuyến Quốc lộ 1A và các khu công nghiệp trọng điểm.',
        features: [
          'Tiết kiệm từ 20% đến 30% chi phí vận chuyển so với cước truyền thống',
          'Bảo hiểm hàng hóa lên tới 1 tỷ đồng / chuyến vận chuyển',
          'Định vị GPS vị trí phương tiện thời gian thực'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-logi-starter',
        name: 'Gói Doanh Nghiệp Tiêu Chuẩn',
        price: 'Theo Chuyến Hàng',
        period: '',
        desc: 'Minh bạch cước phí theo từng cung đường vận tải với hóa đơn GTGT đầy đủ.',
        popular: true,
        features: [
          'Báo giá cước cạnh tranh trong vòng 15 phút',
          'Không phụ phí duy trì phần mềm',
          'Theo dõi hành trình xe trực tuyến qua portal',
          'Thanh toán linh hoạt công nợ 30 ngày cho đối tác xác thực'
        ]
      }
    ],
    events: [
      {
        id: 'evt-logi-1',
        title: 'Tech Talk: Tối Ưu Hóa Dữ Liệu Không Gian Lớn (Big Data) Cho Logistics',
        format: 'Technical Webinar',
        date: '05/12/2026 • 19:30 - 21:00',
        location: 'Online Webinar (Google Meet)',
        desc: 'Cách Logivan xử lý hơn 5 triệu điểm dữ liệu GPS mỗi ngày để đưa ra chỉ số cước vận tải động sát với thị trường.'
      }
    ]
  },
  {
    id: 'tiki',
    name: 'Tiki Smart Automation MegaHub',
    logo: 'images/brands/tiki.svg',
    industry: 'E-Commerce Fulfillment & Robotics Automation',
    category: 'ai',
    tagline: 'Trung tâm xử lý đơn hàng tự động hóa với hơn 500 robot tự hành AMR hiện đại',
    location: 'Bình Dương & Bắc Ninh, Việt Nam',
    size: '3,000+ nhân sự',
    founded: '2010',
    website: 'https://tiki.vn',
    desc: 'TikiNOW Smart Logistics vận hành chuỗi trung tâm kho vận thông minh thế hệ mới, ứng dụng hệ thống robot tự hành AMR và thuật toán điều phối thông minh giúp giao hàng siêu tốc trong 2 giờ.',
    techStack: ['Autonomous Mobile Robots (AMR)', 'Kiva Fleet Orchestrator', 'SLAM Navigation', 'Edge AI'],
    stats: { services: 3, plans: 3, events: 2, jobs: 4 },
    services: [
      {
        id: 'srv-tiki-1',
        title: 'Dịch Vụ Kho Vận Hoàn Tất Đơn Hàng Tự Động Bằng Robot (Fulfillment by Tiki)',
        icon: 'fa-robot',
        desc: 'Lưu kho, nhặt hàng tự động bằng cánh tay robot và đội xe AMR, đóng gói và xuất hàng siêu tốc trong 15 phút từ lúc nhận đơn.',
        features: [
          'Độ chính xác soạn hàng đạt 99.99%',
          'Tối ưu diện tích lưu trữ kho gấp 2.5 lần so với kho truyền thống',
          'Tích hợp đa kênh bán hàng Shopee, TikTok Shop, Lazada, Tiki'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-tiki-ful',
        name: 'Gói Hoàn Tất Đơn Hàng Thông Minh',
        price: 'Từ ₫8.000 / đơn',
        period: '',
        desc: 'Toàn bộ chi phí lưu kho, nhặt hàng bằng robot, đóng gói vật tư và dán nhãn vận chuyển.',
        popular: true,
        features: [
          'Miễn phí 30 ngày lưu kho đầu tiên cho sản phẩm mới',
          'Đảm bảo tốc độ đóng gói sẵn sàng giao trong 2 giờ',
          'Bảo hiểm 100% giá trị hàng hóa nếu xảy ra thất thoát'
        ]
      }
    ],
    events: [
      {
        id: 'evt-tiki-1',
        title: 'Tech Tour: Trải Nghiệm Kho Tự Động Hóa 500+ Robot AMR Tại Bình Dương',
        format: 'On-site Experience',
        date: '10/01/2027 • 09:00 - 14:00',
        location: 'Tiki Smart MegaHub, VSIP II, Bến Cát, Bình Dương',
        desc: 'Chương trình tham quan độc quyền dành cho các kỹ sư và nhà quản lý chuỗi cung ứng tận mắt quan sát hạm đội robot AMR tự hành.'
      }
    ]
  },
  {
    id: 'viconship',
    name: 'Viconship Logistics Group',
    logo: 'images/brands/viconship.svg',
    industry: 'Maritime Port Operations & Multimodal Shipping',
    category: 'logistics',
    tagline: 'Tập đoàn khai thác cảng và dịch vụ đại lý vận tải biển truyền thống hàng đầu Hải Phòng',
    location: 'Hải Phòng, Đà Nẵng & TP. Hồ Chí Minh',
    size: '2,500+ nhân sự',
    founded: '1985',
    website: 'https://viconship.com',
    desc: 'Viconship sở hữu hệ thống cảng cạn, bãi container và dịch vụ giao nhận vận tải đa phương thức quốc tế, kết nối mạng lưới các liên minh tàu biển lớn nhất thế giới.',
    techStack: ['Multimodal Shipping ERP', 'Automated Customs EDI', 'Container Gate Vision OCR'],
    stats: { services: 3, plans: 2, events: 1, jobs: 4 },
    services: [
      {
        id: 'srv-vic-1',
        title: 'Dịch Vụ Đại Lý Hãng Tàu & Vận Tải Đường Biển Quốc Tế',
        icon: 'fa-ship',
        desc: 'Cung cấp booking tải trọng và container từ Việt Nam đi Mỹ, Châu Âu và nội Á với biểu cước cạnh tranh.',
        features: [
          'Hợp đồng bảo đảm chỗ (Space Guarantee) trong mùa cao điểm',
          'Đại diện giải quyết thủ tục chứng từ vận đơn hải ngoại 24/7',
          'Theo dõi vị trí tàu biển thời gian thực'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-vic-quote',
        name: 'Gói Cước Vận Tải Hợp Đồng Doanh Nghiệp',
        price: 'Báo Giá Theo Tuyến',
        period: '',
        desc: 'Biểu cước linh hoạt theo từng mùa vụ với điều khoản thanh toán thuận lợi cho các nhà xuất khẩu lớn.',
        popular: true,
        features: [
          'Cố định giá cước hợp đồng kỳ hạn dài hạn 6-12 tháng',
          'Miễn phí 14 ngày lưu bãi và lưu vỏ container (Free Demurrage/Detention)',
          'Đội ngũ chăm sóc tài khoản khách hàng VIP chuyên nghiệp'
        ]
      }
    ],
    events: [
      {
        id: 'evt-vic-1',
        title: 'Hội Thảo Dự Báo Xu Hướng Giá Cước Vận Tải Biển Quốc Tế 2026',
        format: 'Executive Seminar',
        date: '22/12/2026 • 14:00 - 17:30',
        location: 'Khách sạn Nam Cường, TP. Hải Phòng',
        desc: 'Phân tích biến động các liên minh hãng tàu (Gemini Cooperation, Premier Alliance) và tác động tới chi phí xuất khẩu của doanh nghiệp dệt may, da giày, điện tử.'
      }
    ]
  }
];

// Current state for active company detail
let currentSelectedCompanyId = 'vinfast';

// Initialize Companies Directory in #view-companies
// Metadata helper for authentic company showcases and detail pages
window.getCompanyMetadata = function(c) {
  const metaDb = {
    maersk: {
      coverImage: 'images/maersk_cover.jpg',
      aboutPhoto: 'images/maersk_about.jpg',
      employees: '10,000+',
      countries: '130+',
      rating: '4.2/5',
      aboutP1: 'A.P. Moller - Maersk is a global leader in integrated logistics and container shipping, committed to connecting the world. With a presence in over 130 countries, we move what matters — responsibly, efficiently and sustainably.',
      aboutP2: 'In Vietnam and the Greater Mekong region, we provide innovative logistics solutions that help businesses grow and communities thrive.',
      whyJoin: [
        'Be part of a global and innovative company',
        'Grow your career with world-class opportunities',
        'Make an impact on a more sustainable future'
      ],
      specialties: [
        { name: 'Supply Chain', icon: 'fa-box' },
        { name: 'Logistics', icon: 'fa-snowflake' },
        { name: 'International Trade', icon: 'fa-box-archive' },
        { name: 'Career Growth', icon: 'fa-chart-line' }
      ],
      latestJobs: [
        { title: 'Logistics Specialist', location: 'Ho Chi Minh City, Vietnam', id: 'job-1' },
        { title: 'Supply Chain Analyst', location: 'Phnom Penh, Cambodia', id: 'job-2' },
        { title: 'Operations Coordinator', location: 'Hanoi, Vietnam', id: 'job-3' }
      ]
    },
    vinfast: {
      coverImage: 'images/editorial_ai_logistics_hd.jpg',
      aboutPhoto: 'images/today_2.jpg',
      employees: '10,000+',
      countries: '35+',
      rating: '4.7/5',
      aboutP1: 'VinFast Logistics tiên phong kiến tạo mạng lưới vận tải thông minh, chuỗi cung ứng lạnh đạt chuẩn quốc tế và hạ tầng logistics pin xe điện xuyên lục địa.',
      aboutP2: 'Ứng dụng trí tuệ nhân tạo (AI) và mạng lưới viễn thông IoT để tối ưu hóa tuyến vận tải và điều hành trạm phân phối thông minh trên toàn quốc.',
      whyJoin: [
        'Lead the smart electric mobility & cold chain revolution',
        'Work with state-of-the-art AI automation & IoT fleets',
        'Competitive global package with fast-track promotion'
      ],
      specialties: [
        { name: 'Smart Cold Chain', icon: 'fa-snowflake' },
        { name: 'Vision AI', icon: 'fa-brain' },
        { name: 'IoT Telematics', icon: 'fa-tower-broadcast' },
        { name: 'Automotive Logistics', icon: 'fa-truck-bolt' }
      ],
      latestJobs: [
        { title: 'Cold Chain Solutions Architect', location: 'TP. Hồ Chí Minh & Hải Phòng', id: 'job-2' },
        { title: 'Fleet Telematics Data Analyst', location: 'Hà Nội (Cầu Giấy)', id: 'job-5' },
        { title: 'Autonomous Heavy Trucking Dispatch Supervisor', location: 'Hải Phòng Tech Hub', id: 'job-16' }
      ]
    },
    'saigon-newport': {
      coverImage: 'images/today_1.jpg',
      aboutPhoto: 'images/hero_3.jpg',
      employees: '9,000+',
      countries: '15+',
      rating: '4.8/5',
      aboutP1: 'Tổng Công Ty Tân Cảng Sài Gòn là nhà khai thác cảng container chuyên nghiệp, hiện đại và lớn nhất Việt Nam với thị phần trên 50% xuất nhập khẩu cả nước.',
      aboutP2: 'Sở hữu mạng lưới cảng nước sâu hiện đại kết nối các tuyến hàng hải trực tiếp đi Bắc Mỹ và Châu Âu, vận hành theo tiêu chuẩn xanh quốc tế.',
      whyJoin: [
        "Operate Vietnam's premier deep-sea container terminal hub",
        'Deploy advanced TOS Navis N4 port operating systems',
        'Industry-leading stability, maritime bonuses and career paths'
      ],
      specialties: [
        { name: 'Deep Sea Terminal', icon: 'fa-ship' },
        { name: 'TOS Navis N4', icon: 'fa-terminal' },
        { name: 'Container Berth', icon: 'fa-anchor' },
        { name: 'Customs Clearance', icon: 'fa-file-shield' }
      ],
      latestJobs: [
        { title: 'Container Terminal Dispatch Coordinator (Shift)', location: 'Bà Rịa - Vũng Tàu (TCIT)', id: 'job-4' },
        { title: 'Berth Allocation Specialist', location: 'Cát Lái Hub, TP.HCM', id: 'job-11' },
        { title: 'Smart Port Logistics Systems Engineer', location: 'Hải Phòng & Vũng Tàu', id: 'job-1' }
      ]
    },
    fpt: {
      coverImage: 'images/today_3.jpg',
      aboutPhoto: 'images/course_2.jpg',
      employees: '28,000+',
      countries: '30+',
      rating: '4.8/5',
      aboutP1: 'FPT Software là tập đoàn công nghệ toàn cầu cung cấp dịch vụ phần mềm, kiến trúc đám mây và giải pháp trí tuệ nhân tạo (AI) cho các khách hàng Fortune 500.',
      aboutP2: 'Trung tâm AI Logistics & Supply Chain Cloud phát triển các mô hình Computer Vision và hệ thống tự động hóa kho bãi phân phối thế hệ mới.',
      whyJoin: [
        'Build next-gen cloud & enterprise AI architectures',
        'Global mobility programs across Japan, US, Europe & APAC',
        'Continuous learning with sponsored certifications'
      ],
      specialties: [
        { name: 'Enterprise Cloud', icon: 'fa-cloud' },
        { name: 'Logistics AI', icon: 'fa-robot' },
        { name: 'Microservices', icon: 'fa-network-wired' },
        { name: 'Big Data', icon: 'fa-database' }
      ],
      latestJobs: [
        { title: 'Senior Backend Engineer (Java / Spring Boot)', location: 'Hà Nội & TP.HCM', id: 'job-12' },
        { title: 'AI Solution Architect (Logistics OCR)', location: 'Đà Nẵng & Hà Nội', id: 'job-8' },
        { title: 'Cloud DevOps Lead', location: 'Hồ Chí Minh (Quận 9)', id: 'job-14' }
      ]
    },
    logivan: {
      coverImage: 'images/today_2.jpg',
      aboutPhoto: 'images/course_1.jpg',
      employees: '1,200+',
      countries: '6+',
      rating: '4.6/5',
      aboutP1: 'LOGIVAN là nền tảng công nghệ kết nối vận tải xe tải trực tiếp hàng đầu Việt Nam, số hóa quy trình điều phối và kết nối chủ hàng với 60,000+ tài xế.',
      aboutP2: 'Ứng dụng thuật toán phân tích dữ liệu lớn và định giá cước động thời gian thực giúp giảm thiểu tỷ lệ xe chạy rỗng và tối ưu hóa chi phí logistics.',
      whyJoin: [
        'Disrupt overland trucking with AI algorithmic dispatch',
        'Fast-paced unicorn environment with high autonomy',
        'Competitive ESOP and modern tech-first perks'
      ],
      specialties: [
        { name: 'AI Freight Matching', icon: 'fa-truck-arrow-right' },
        { name: 'Dynamic Pricing', icon: 'fa-calculator' },
        { name: 'Mobile App Fleet', icon: 'fa-mobile-screen' },
        { name: 'Intralogistics', icon: 'fa-dolly' }
      ],
      latestJobs: [
        { title: 'Freight Matching ML Engineer', location: 'TP. Hồ Chí Minh', id: 'job-8' },
        { title: 'Trucking Operations Supervisor', location: 'Hà Nội & Bắc Ninh', id: 'job-16' },
        { title: 'Carrier Sourcing Manager', location: 'Đà Nẵng & Bình Dương', id: 'job-18' }
      ]
    },
    tiki: {
      coverImage: 'images/course_4.jpg',
      aboutPhoto: 'images/today_3.jpg',
      employees: '4,500+',
      countries: '8+',
      rating: '4.7/5',
      aboutP1: 'TikiNOW Smart Logistics vận hành mạng lưới chuỗi cung ứng thương mại điện tử hiện đại với trung tâm MegaHub tự động hóa 500+ robot tự hành AMR.',
      aboutP2: 'Tiên phong phát triển dịch vụ giao nhận siêu tốc 2 giờ và chuỗi xử lý đơn hàng tự động hóa hoàn toàn với độ chính xác soạn hàng 99.99%.',
      whyJoin: [
        'Pioneer automated robotics fulfillment & 2h delivery',
        'Work with high-throughput microservices and data pipelines',
        'Energetic e-commerce culture with comprehensive health benefits'
      ],
      specialties: [
        { name: 'Robotics Fulfillment', icon: 'fa-robot' },
        { name: 'E-Commerce Hub', icon: 'fa-cart-shopping' },
        { name: 'Cross-Border Air', icon: 'fa-plane' },
        { name: 'WMS Automation', icon: 'fa-warehouse' }
      ],
      latestJobs: [
        { title: 'Cross-Border Operations Lead', location: 'Tân Bình, TP.HCM', id: 'job-7' },
        { title: 'AMR Robotics Systems Specialist', location: 'Bình Dương Mega Hub', id: 'job-7' },
        { title: 'Last-Mile Delivery Regional Manager', location: 'Hà Nội (Long Biên)', id: 'job-21' }
      ]
    },
    viconship: {
      coverImage: 'images/hero_1.jpg',
      aboutPhoto: 'images/today_1.jpg',
      employees: '6,500+',
      countries: '18+',
      rating: '4.8/5',
      aboutP1: 'Viconship là một trong những tập đoàn khai thác cảng cạn, kho bãi container và dịch vụ giao nhận đại lý vận tải biển truyền thống uy tín lâu đời nhất Việt Nam.',
      aboutP2: 'Hợp tác chặt chẽ cùng các liên minh hãng tàu 2M, Ocean Alliance và THE Alliance, cung cấp giải pháp vận tải đa phương thức an toàn và tin cậy.',
      whyJoin: [
        'Join 40+ years of national maritime and shipping excellence',
        'Direct collaboration with 2M & Ocean Alliance shipping lines',
        'Comprehensive maritime retirement and training programs'
      ],
      specialties: [
        { name: 'Ocean Freight Forwarding', icon: 'fa-ship' },
        { name: 'Bonded Warehouse', icon: 'fa-warehouse' },
        { name: 'Customs Brokerage', icon: 'fa-passport' },
        { name: 'Reefer Depot', icon: 'fa-temperature-low' }
      ],
      latestJobs: [
        { title: 'Senior Ocean Freight Forwarder', location: 'TP. Hồ Chí Minh (Quận 1)', id: 'job-1' },
        { title: 'Customs Clearance Specialist', location: 'Hà Nội & Hải Phòng', id: 'job-3' },
        { title: 'Reefer Depot Operations Lead', location: 'Đà Nẵng Port', id: 'job-10' }
      ]
    }
  };

  const d = metaDb[c.id] || {
    coverImage: 'images/today_1.jpg',
    aboutPhoto: 'images/today_2.jpg',
    employees: c.size || '5,000+',
    countries: '12+',
    rating: '4.7/5',
    aboutP1: c.desc || 'Doanh nghiệp logistics và công nghệ hàng đầu tại Việt Nam.',
    aboutP2: c.tagline || 'Kiến tạo giải pháp chuỗi cung ứng thông minh và bền vững.',
    whyJoin: [
      'Be part of an industry-leading enterprise',
      'Accelerate your career with world-class logistics tools',
      'Collaborative and innovative company culture'
    ],
    specialties: (c.techStack || ['Logistics', 'Supply Chain', 'Operations']).slice(0, 4).map(s => ({ name: s, icon: 'fa-circle-check' })),
    latestJobs: [
      { title: 'Supply Chain Operations Lead', location: c.location, id: 'job-1' },
      { title: 'Logistics Analyst', location: c.location, id: 'job-2' }
    ]
  };

  return d;
};

// Render Single Premium Company Showcase Card (HTML generator)
window.generateCompanyShowcaseCardHtml = function(c) {
  const meta = getCompanyMetadata(c);
  const isSaved = localStorage.getItem('saved_company_' + c.id) === 'true';

  return `
    <article class="co-showcase-card" data-company-id="${c.id}">
      <!-- A. Company Cover Image -->
      <div class="co-card-cover-wrap" onclick="openCompanyDetail('${c.id}')" style="cursor: pointer;">
        <img src="${meta.coverImage}" alt="${c.name} Cover" class="co-card-cover-img" onerror="this.src='images/today_1.jpg'">
        <div class="co-card-cover-overlay"></div>
        <span class="co-cover-verified-badge">
          <i class="fa-solid fa-circle-check"></i> Verified
        </span>
      </div>

      <!-- B. Company Logo (Overlapping bottom of cover) -->
      <div class="co-card-logo-box" onclick="openCompanyDetail('${c.id}')" style="cursor: pointer;">
        <img src="${c.logo}" alt="${c.name} Logo" class="co-card-logo-img" onerror="this.src='images/brands/vinfast.svg'">
      </div>

      <!-- Card Body Content -->
      <div class="co-card-body">
        <!-- C. Company Identity -->
        <div class="co-card-identity">
          <div class="co-card-name-row">
            <h3 class="co-card-name" onclick="openCompanyDetail('${c.id}')">${c.name}</h3>
            <i class="fa-solid fa-circle-check co-verified-icon" title="Verified Employer"></i>
          </div>
          <div class="co-card-meta-row">
            <span class="co-meta-item"><i class="fa-solid fa-briefcase" style="color:#0759D1;"></i> ${c.industry}</span>
            <span class="co-meta-item"><i class="fa-solid fa-location-dot" style="color:#EF4444;"></i> ${c.location.split('&')[0].trim()}</span>
          </div>
        </div>

        <!-- D. Company Description -->
        <p class="co-card-desc">${c.desc}</p>

        <!-- E. Company Specialties (Pill tags) -->
        <div class="co-specialties-row">
          ${meta.specialties.map(s => `
            <span class="co-specialty-pill">
              <i class="fa-solid ${s.icon}"></i> ${s.name}
            </span>
          `).join('')}
        </div>

        <!-- F. Company Statistics Container (#F1F6FD) -->
        <div class="co-stats-box">
          <div class="co-stat-col">
            <i class="fa-solid fa-users co-stat-icon"></i>
            <div class="co-stat-val">${meta.employees}</div>
            <div class="co-stat-lbl">Employees</div>
          </div>
          <div class="co-stat-col">
            <i class="fa-solid fa-globe co-stat-icon"></i>
            <div class="co-stat-val">${meta.countries}</div>
            <div class="co-stat-lbl">Countries</div>
          </div>
          <div class="co-stat-col">
            <i class="fa-solid fa-star co-stat-icon"></i>
            <div class="co-stat-val">${meta.rating}</div>
            <div class="co-stat-lbl">Employer Rating</div>
          </div>
        </div>

        <!-- G. Card Action Buttons -->
        <div class="co-card-actions">
          <button type="button" class="btn-co-save ${isSaved ? 'saved' : ''}" onclick="toggleSaveCompany('${c.id}', this)">
            <i class="${isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
            <span>${isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button type="button" class="btn-co-primary" onclick="openCompanyDetail('${c.id}')">
            <span>View Company</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  `;
};

// Toggle Save Company state
window.toggleSaveCompany = function(companyId, btn) {
  const isCurrentlySaved = localStorage.getItem('saved_company_' + companyId) === 'true';
  const nextState = !isCurrentlySaved;
  localStorage.setItem('saved_company_' + companyId, nextState ? 'true' : 'false');

  if (btn) {
    btn.classList.toggle('saved', nextState);
    const icon = btn.querySelector('i');
    const span = btn.querySelector('span');
    if (icon) {
      icon.className = nextState ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
    if (span) {
      span.textContent = nextState ? 'Saved' : 'Save';
    }
  }

  const company = enterpriseCompaniesData.find(c => c.id === companyId);
  const cName = company ? company.name : 'doanh nghiệp';
  if (typeof showToast === 'function') {
    showToast(nextState ? `Đã lưu ${cName} vào danh sách quan tâm` : `Đã bỏ lưu ${cName}`);
  }
};

// Initialize Companies Directory in #view-companies
function initCompaniesDirectory() {
  const grid = document.getElementById('companies-cards-grid');
  if (!grid) return;

  const searchInput = document.getElementById('companies-search-input');
  const tabPills = document.querySelectorAll('.co-tab-pill');

  let currentCategory = 'all';
  let searchQuery = '';

  window.renderCompanies = function(forcedCategory) {
    if (forcedCategory) {
      currentCategory = forcedCategory;
      tabPills.forEach(p => p.classList.toggle('active', p.dataset.category === forcedCategory));
    }

    let filtered = enterpriseCompaniesData;
    if (currentCategory !== 'all') {
      filtered = filtered.filter(c => c.category === currentCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.industry.toLowerCase().includes(q) || 
        (c.techStack && c.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; color: #64748B;">
          <i class="fa-solid fa-building-circle-xmark" style="font-size: 40px; color: #94A3B8; margin-bottom: 12px; display:inline-block;"></i>
          <h3 style="font-size: 18px; color: #101D3A; margin-bottom: 6px; font-weight: 700;">No matching employers found</h3>
          <p style="font-size: 14px; color: #64748B;">Try adjusting your keywords or select "All Employers".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(c => generateCompanyShowcaseCardHtml(c)).join('');
  };

  // Bind category tabs
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tabPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category || 'all';
      renderCompanies();
    });
  });

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCompanies();
    });
  }

  renderCompanies();
}

// ── COMPANY DETAIL VIEW CONTROLLER (TAB-BY-TAB PROFESSIONAL SWITCHER) ───────
window.switchCompanyTab = function(tabName, clickedBtn) {
  // 1. Update subnav tab buttons
  const tabBtns = document.querySelectorAll('.co-detail-tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });

  // 2. Hide all tab panes, show target pane
  const panes = document.querySelectorAll('.co-tab-pane');
  panes.forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  const targetPane = document.getElementById(`co-tab-pane-${tabName}`);
  if (targetPane) {
    targetPane.classList.add('active');
    targetPane.style.display = 'block';
  }

  // 3. Keep scroll aligned to top of tab view
  const subnav = document.querySelector('.co-detail-subnav-bar');
  if (subnav) {
    const rect = subnav.getBoundingClientRect();
    if (rect.top < 60) {
      subnav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

window.handleDirectCompanyContact = function(e, companyName) {
  if (e) e.preventDefault();
  if (typeof window.showToast === 'function') {
    window.showToast(`🎉 Yêu cầu liên hệ đã được gửi tới ${companyName}! Chúng tôi sẽ phản hồi trong 24h làm việc.`);
  }
  document.getElementById('co-direct-contact-form')?.reset();
};

window.openCompanyDetail = function(companyId) {
  // Instantly trigger top progress bar for visual feedback
  if (typeof window.startPageLoading === 'function') {
    window.startPageLoading();
  }
  try {
    _executeOpenCompanyDetail(companyId);
  } finally {
    if (typeof window.finishPageLoading === 'function') {
      window.finishPageLoading();
    }
  }
};

function _executeOpenCompanyDetail(companyId) {
  // Brand dictionary for all 20 homepage partner brands
  const brandDict = {
    nike: { name: 'Nike Logistics & Sourcing Vietnam', industry: 'Sportswear & Footwear Supply Chain', location: 'TP. Hồ Chí Minh & Đồng Nai', logo: 'images/brands/nike.svg', tagline: 'Sustainable sourcing, automated inventory routing and international export distribution across ASEAN.' },
    dhl: { name: 'DHL Global Forwarding (Vietnam)', industry: 'International Freight Forwarding & 3PL', location: 'Hà Nội & TP. Hồ Chí Minh', logo: 'images/brands/dhl.svg', tagline: 'World leader in multimodal air and ocean freight forwarding with modern bonded customs facilities.' },
    gemadept: { name: 'Gemadept Corporation', industry: 'Port Operations & Integrated Logistics', location: 'Cảng Gemalink, Cái Mép & Hải Phòng', logo: 'images/brands/gemadept.svg', tagline: 'Vietnam top port operator and pioneer in deep-sea green maritime terminals connecting to North America and Europe.' },
    'kuehne-nagel': { name: 'Kuehne+Nagel Vietnam', industry: 'Global Air & Sea Logistics', location: 'Hà Nội & TP. Hồ Chí Minh', logo: 'images/brands/kuehne-nagel.svg', tagline: 'Global logistics titan delivering sea freight, air logistics, and contract warehousing solutions with net zero carbon tracking.' },
    'slp-vietnam': { name: 'SLP Logistics Vietnam (GLP Joint Venture)', industry: 'Industrial Logistics Real Estate & Smart Warehousing', location: 'Bắc Ninh, Hải Phòng, Long An', logo: 'images/brands/slp-vietnam.svg', tagline: 'Leading developer of modern Grade-A logistics facilities and high-throughput distribution hubs across Vietnam.' },
    viettel: { name: 'Viettel Post Corporation', industry: 'Express Logistics & E-Commerce Delivery', location: 'Hà Nội & Toàn Quốc', logo: 'images/brands/viettel.svg', tagline: 'Hạ tầng logistics số 1 Việt Nam với mạng lưới chuyển phát bưu chính và trung tâm phân loại thông minh AI trên 63 tỉnh thành.' },
    shopee: { name: 'Shopee Express (SPX Vietnam)', industry: 'E-Commerce Last-Mile Logistics', location: 'TP. Hồ Chí Minh & Hà Nội', logo: 'images/brands/shopee.svg', tagline: 'Đơn vị vận hành hệ thống logistics và hoàn tất đơn hàng TMĐT tự động hóa hàng đầu Đông Nam Á.' },
    grab: { name: 'Grab Vietnam Express & 3PL', industry: 'On-Demand Urban Delivery & Supply Chain', location: 'TP. Hồ Chí Minh & Hà Nội', logo: 'images/brands/grab.svg', tagline: 'Hệ sinh thái giao hàng siêu tốc và giải pháp chuỗi cung ứng đô thị thông minh lớn nhất khu vực.' },
    samsung: { name: 'Samsung SDS Vietnam', industry: 'Smart Logistics IT & Global SCM', location: 'Hà Nội, Thái Nguyên, Bắc Ninh', logo: 'images/brands/samsung.svg', tagline: 'Digital logistics platform Cello powering global semiconductor and high-tech electronics supply chains.' },
    adidas: { name: 'Adidas Global Supply Chain Vietnam', industry: 'Sporting Goods Sourcing & Freight SCM', location: 'TP. Hồ Chí Minh & Bình Dương', logo: 'images/brands/adidas.svg', tagline: 'Hệ thống quản lý chuỗi cung ứng sản xuất và xuất nhập khẩu nguyên phụ liệu thể thao toàn cầu.' },
    unilever: { name: 'Unilever Supply Chain Vietnam', industry: 'FMCG Logistics & Zero-Carbon SCM', location: 'TP. Hồ Chí Minh & Bắc Ninh', logo: 'images/brands/unilever.svg', tagline: 'Mạng lưới cung ứng hàng tiêu dùng hàng đầu với các trung tâm phân phối MegaHub tự động hóa 100%.' },
    loreal: { name: "L'Oreal Hub & Beauty Logistics", industry: 'Cosmetics Supply Chain & Warehousing', location: 'TP. Hồ Chí Minh', logo: 'images/brands/loreal.svg', tagline: 'Chuỗi cung ứng mỹ phẩm và kho bãi tiêu chuẩn xanh quốc tế phục vụ thị trường Đông Nam Á.' },
    zara: { name: 'Inditex Zara Fashion Logistics', industry: 'Fast-Fashion SCM & RFID Distribution', location: 'TP. Hồ Chí Minh & Hà Nội', logo: 'images/brands/zara.svg', tagline: 'Mô hình logistics thời trang nhanh hàng đầu thế giới với công nghệ kiểm soát RFID tự động.' },
    momo: { name: 'MoMo Fintech & Logistics Solutions', industry: 'Fintech, Payment & Logistics API', location: 'TP. Hồ Chí Minh', logo: 'images/brands/momo.svg', tagline: 'Giải pháp thanh toán số COD và kết nối API logistics toàn diện cho hàng triệu nhà bán hàng.' },
    vng: { name: 'VNG Tech & Digital Logistics Platform', industry: 'Logistics Technology & Cloud Infrastructure', location: 'TP. Hồ Chí Minh (VNG Campus)', logo: 'images/brands/vng.svg', tagline: 'Hạ tầng điện toán đám mây và giải pháp số hóa chuỗi cung ứng thông minh.' },
    vpbank: { name: 'VPBank Trade Finance & Logistics Hub', industry: 'Supply Chain Finance & Maritime Banking', location: 'Hà Nội & TP. Hồ Chí Minh', logo: 'images/brands/vpbank.svg', tagline: 'Dịch vụ tài trợ chuỗi cung ứng, LC quốc tế và bảo lãnh thanh toán xuất nhập khẩu hàng đầu.' }
  };

  let company = enterpriseCompaniesData.find(c => c.id === companyId);
  if (!company) {
    const b = brandDict[companyId] || {
      name: companyId.toUpperCase() + ' Logistics Group',
      industry: 'Logistics & Supply Chain Solutions',
      location: 'Vietnam & Regional Hub',
      logo: `images/brands/${companyId}.svg`,
      tagline: 'Leading enterprise partner in logistics, terminal infrastructure, and international freight transport.'
    };
    company = {
      id: companyId,
      name: b.name,
      industry: b.industry,
      location: b.location,
      logo: b.logo,
      tagline: b.tagline,
      website: 'https://vietnamjobs.vn',
      category: 'logistics'
    };
  }

  currentSelectedCompanyId = company.id;

  if (typeof switchView === 'function') {
    switchView('company-detail');
  }
  try {
    history.replaceState(null, '', '#company-detail?id=' + encodeURIComponent(company.id));
  } catch (e) {}

  // Scroll to top of window smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const container = document.getElementById('company-detail-content-wrapper');
  if (!container) return;

  const meta = getCompanyMetadata(company);
  const isSaved = localStorage.getItem('saved_company_' + company.id) === 'true';

  // Get related companies (exclude current company, take top 3)
  const relatedCompanies = enterpriseCompaniesData.filter(c => c.id !== company.id).slice(0, 3);

  container.innerHTML = `
    <!-- 1. Hero Panoramic Cover Banner -->
    <div class="co-detail-hero-banner">
      <img src="${meta.coverImage}" alt="${company.name} Panoramic Cover" class="co-detail-hero-img" onerror="this.src='images/today_1.jpg'">
      <div class="co-detail-hero-overlay"></div>
      
      <!-- Top Right Verified Badge -->
      <span class="co-detail-hero-verified">
        <i class="fa-solid fa-circle-check"></i> Verified Employer
      </span>

      <!-- Bottom Identity Overlaid on Banner -->
      <div class="co-detail-hero-content">
        <div class="co-detail-logo-box">
          <img src="${company.logo}" alt="${company.name}" class="co-detail-logo-img" onerror="this.src='images/brands/maersk.svg'">
        </div>
        <div class="co-detail-hero-text">
          <h1 class="co-detail-hero-title">${company.name}</h1>
          <p class="co-detail-hero-tagline">${company.tagline || 'Connecting and simplifying global supply chains with digital ocean and inland logistics solutions.'}</p>
          <div class="co-detail-hero-meta">
            <span><i class="fa-solid fa-briefcase" style="color:#38BDF8;"></i> ${company.industry}</span>
            <span>&bull;</span>
            <span><i class="fa-solid fa-location-dot" style="color:#F87171;"></i> ${company.location}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Sub-Navigation & Actions Bar (Tab by Tab Switcher) -->
    <div class="co-detail-subnav-bar">
      <div class="co-detail-tabs-list" role="tablist">
        <button type="button" class="co-detail-tab-btn active" data-tab="overview" onclick="switchCompanyTab('overview', this)">Overview</button>
        <button type="button" class="co-detail-tab-btn" data-tab="jobs" onclick="switchCompanyTab('jobs', this)">Jobs (${meta.latestJobs.length})</button>
        <button type="button" class="co-detail-tab-btn" data-tab="about" onclick="switchCompanyTab('about', this)">About</button>
        <button type="button" class="co-detail-tab-btn" data-tab="culture" onclick="switchCompanyTab('culture', this)">Culture</button>
        <button type="button" class="co-detail-tab-btn" data-tab="news" onclick="switchCompanyTab('news', this)">News</button>
        <button type="button" class="co-detail-tab-btn" data-tab="contact" onclick="switchCompanyTab('contact', this)">Contact</button>
      </div>
      <div class="co-detail-subnav-actions">
        <button type="button" class="btn-co-detail-save ${isSaved ? 'saved' : ''}" onclick="toggleSaveCompany('${company.id}', this)">
          <i class="${isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
          <span>${isSaved ? 'Saved Company' : 'Save Company'}</span>
        </button>
        <button type="button" class="btn-co-detail-contact" onclick="switchCompanyTab('contact', document.querySelector('.co-detail-tab-btn[data-tab=\'contact\']'))">
          <i class="fa-solid fa-paper-plane"></i>
          <span>Contact Company</span>
          <i class="fa-solid fa-arrow-right" style="font-size:12px;"></i>
        </button>
      </div>
    </div>

    <!-- 3. Tab Panes Wrapper (Dedicated Professional Content per Tab) -->
    <div class="co-detail-tab-panes-wrapper">

      <!-- ================= TAB 1: OVERVIEW ================= -->
      <div class="co-tab-pane active" id="co-tab-pane-overview">
        <div class="co-detail-main-grid">
          
          <!-- Left Column: About & Specialties -->
          <div class="co-detail-left-col">
            
            <!-- About Section with Sunset Cranes Photo -->
            <div class="co-detail-card">
              <h2 class="co-detail-card-heading">
                <span>About ${company.name.split('(')[0].trim()}</span>
              </h2>
              <div class="co-about-layout">
                <div class="co-about-text-col">
                  <p class="co-about-p">${meta.aboutP1}</p>
                  <p class="co-about-p">${meta.aboutP2}</p>
                  <a href="javascript:void(0)" onclick="switchCompanyTab('about')" class="co-about-readmore">
                    View Complete Corporate Profile &amp; Hubs <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
                <div class="co-about-img-wrap">
                  <img src="${meta.aboutPhoto}" alt="About ${company.name}" class="co-about-img" onerror="this.src='images/maersk_about.jpg'">
                </div>
              </div>
            </div>

            <!-- Our Specialties Section -->
            <div class="co-detail-card">
              <h2 class="co-detail-card-heading">
                <span>Core Capabilities &amp; Specialties</span>
              </h2>
              <div class="co-specialties-row">
                ${meta.specialties.map(s => `
                  <span class="co-specialty-pill" style="font-size: 14px; padding: 8px 18px;">
                    <i class="fa-solid ${s.icon}"></i> ${s.name}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Latest Jobs Preview Card -->
            <div class="co-detail-card">
              <div class="co-tab-section-header" style="margin-bottom: 16px; border: none; padding: 0;">
                <div>
                  <h3 class="co-about-subheading" style="margin: 0;">Featured Job Openings</h3>
                  <p style="font-size: 13px; color: #64748B; margin: 2px 0 0;">Recent roles hiring in Vietnam</p>
                </div>
                <button type="button" class="co-tab-link-btn" onclick="switchCompanyTab('jobs')">
                  View All ${meta.latestJobs.length} Jobs &rarr;
                </button>
              </div>
              <div class="co-detail-jobs-grid" style="grid-template-columns: 1fr; gap: 12px;">
                ${meta.latestJobs.slice(0, 2).map(j => `
                  <div class="co-detail-job-card" style="box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 16px;">
                    <div class="co-job-card-top">
                      <div class="co-job-icon-box" style="width: 40px; height: 40px; font-size: 16px;">
                        <i class="fa-solid fa-briefcase"></i>
                      </div>
                      <div>
                        <h4 class="co-job-card-title" style="font-size: 15px;">${j.title}</h4>
                        <div class="co-job-card-loc" style="font-size: 13px;">
                          <i class="fa-solid fa-location-dot"></i> ${j.location}
                        </div>
                      </div>
                    </div>
                    <button type="button" class="btn-co-job-apply" onclick="openJobDetail('${j.id}');">
                      <span>Apply Now</span>
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Right Column: Company Highlights & Why Join -->
          <div class="co-detail-right-col">
            
            <!-- Company Highlights -->
            <div class="co-detail-card">
              <h2 class="co-detail-card-heading">
                <span>Company Highlights</span>
              </h2>
              <div class="co-highlights-stats-grid">
                <div class="co-hl-stat-col">
                  <i class="fa-solid fa-users co-hl-stat-icon"></i>
                  <div class="co-hl-stat-num">${meta.employees}</div>
                  <div class="co-hl-stat-lbl">Employees</div>
                </div>
                <div class="co-hl-stat-col">
                  <i class="fa-solid fa-globe co-hl-stat-icon"></i>
                  <div class="co-hl-stat-num">${meta.countries}</div>
                  <div class="co-hl-stat-lbl">Countries</div>
                </div>
                <div class="co-hl-stat-col">
                  <i class="fa-solid fa-star co-hl-stat-icon"></i>
                  <div class="co-hl-stat-num">${meta.rating}</div>
                  <div class="co-hl-stat-lbl">Employer Rating</div>
                </div>
              </div>
            </div>

            <!-- Why Join Card -->
            <div class="co-why-join-card">
              <i class="fa-solid fa-certificate co-why-join-watermark"></i>
              <h2 class="co-why-join-title">Why Join ${company.name.split('(')[0].trim()}?</h2>
              <ul class="co-why-join-list">
                ${meta.whyJoin.map(point => `
                  <li class="co-why-join-item">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>${point}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Fast Contact CTA Card -->
            <div class="co-detail-card" style="margin-top: 24px;">
              <h2 class="co-detail-card-heading">
                <span>Inquiries &amp; Offices</span>
              </h2>
              <p style="font-size: 13.5px; color: #475569; line-height: 1.5; margin-bottom: 14px;">
                <i class="fa-solid fa-building" style="color: #2477E4; margin-right: 6px;"></i> ${company.location}
              </p>
              <button type="button" class="btn-co-tab-action" onclick="switchCompanyTab('contact')">
                <i class="fa-solid fa-envelope-open-text"></i> Open Office Directory &amp; Inquiry Form &rarr;
              </button>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= TAB 2: JOBS ================= -->
      <div class="co-tab-pane" id="co-tab-pane-jobs" style="display: none;">
        <div class="co-tab-section-header">
          <div>
            <h2 class="co-tab-main-title">Career Opportunities at ${company.name.split('(')[0].trim()}</h2>
            <p class="co-tab-main-sub">Explore ${meta.latestJobs.length} active positions offering international exposure, career progression, and competitive salaries.</p>
          </div>
          <span class="co-jobs-count-pill">${meta.latestJobs.length} Open Positions</span>
        </div>

        <div class="co-detail-jobs-grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; margin-top: 20px;">
          ${meta.latestJobs.map(j => `
            <div class="co-detail-job-card full-card">
              <div class="co-job-card-top">
                <div class="co-job-icon-box">
                  <i class="fa-solid fa-briefcase"></i>
                </div>
                <div>
                  <h3 class="co-job-card-title">${j.title}</h3>
                  <div class="co-job-card-loc">
                    <i class="fa-solid fa-location-dot"></i> ${j.location}
                  </div>
                </div>
              </div>
              <div class="co-job-card-meta-pills">
                <span class="job-meta-pill"><i class="fa-regular fa-clock"></i> Full-time</span>
                <span class="job-meta-pill salary-pill"><i class="fa-solid fa-coins"></i> ₫26.000.000 - ₫42.000.000 / mo</span>
                <span class="job-meta-pill urgent-pill"><i class="fa-solid fa-bolt"></i> Urgent Hiring</span>
              </div>
              <div class="co-job-card-footer">
                <button type="button" class="btn-job-quick-apply" onclick="openJobDetail('${j.id}');">
                  <span>Ứng Tuyển Ngay</span>
                  <i class="fa-solid fa-paper-plane"></i>
                </button>
                <button type="button" class="btn-job-view-spec" onclick="openJobDetail('${j.id}');">
                  <span>Chi Tiết</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Spontaneous Application Banner -->
        <div class="co-spontaneous-banner">
          <div class="spontaneous-left">
            <div class="spontaneous-icon"><i class="fa-solid fa-user-plus"></i></div>
            <div>
              <h4>Don't see an exact matching position?</h4>
              <p>Submit your CV directly to our Talent Network. Our recruiting team actively reviews candidates for new logistics operations roles.</p>
            </div>
          </div>
          <button type="button" class="btn-spontaneous-apply" onclick="openQuickApplyModal('spontaneous', '${company.name}')">
            Join Talent Network &rarr;
          </button>
        </div>
      </div>

      <!-- ================= TAB 3: ABOUT ================= -->
      <div class="co-tab-pane" id="co-tab-pane-about" style="display: none;">
        <div class="co-tab-section-header">
          <div>
            <h2 class="co-tab-main-title">About ${company.name}</h2>
            <p class="co-tab-main-sub">Corporate background, global multimodal reach, and regional operations in Vietnam.</p>
          </div>
        </div>

        <div class="co-about-full-grid">
          <div class="co-about-full-main">
            <div class="co-detail-card">
              <h3 class="co-about-subheading">Corporate Mission &amp; Regional Presence</h3>
              <p class="co-about-p" style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">${meta.aboutP1}</p>
              <p class="co-about-p" style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">${meta.aboutP2}</p>
              <p class="co-about-p" style="font-size: 15px; line-height: 1.7;">
                Operating extensively through Vietnam's economic gateways, our multimodal transport corridors seamlessly link manufacturing clusters in Bac Ninh, Hai Phong, Binh Duong, and Dong Nai to key global markets in North America, Europe, and intra-Asia.
              </p>
            </div>

            <!-- Vietnam Operational Hubs & Office Locations -->
            <div class="co-detail-card" style="margin-top: 24px;">
              <h3 class="co-about-subheading">Regional Offices &amp; Hubs in Vietnam</h3>
              <div class="co-locations-grid">
                <div class="co-loc-card">
                  <div class="co-loc-badge">Head Office</div>
                  <h4 class="co-loc-name">Ho Chi Minh City HQ</h4>
                  <p class="co-loc-addr"><i class="fa-solid fa-location-dot"></i> Bitexco Financial Tower / Landmark 81, District 1, HCMC</p>
                  <div class="co-loc-meta">
                    <span><i class="fa-solid fa-phone"></i> +84 28 3823 0011</span>
                    <span><i class="fa-solid fa-envelope"></i> hcmc.office@${company.id}.vn</span>
                  </div>
                </div>
                <div class="co-loc-card">
                  <div class="co-loc-badge">North Branch</div>
                  <h4 class="co-loc-name">Hanoi Regional Office</h4>
                  <p class="co-loc-addr"><i class="fa-solid fa-location-dot"></i> Lotte Center Hanoi, Lieu Giai, Ba Dinh, Hanoi</p>
                  <div class="co-loc-meta">
                    <span><i class="fa-solid fa-phone"></i> +84 24 3936 6000</span>
                    <span><i class="fa-solid fa-envelope"></i> hanoi.office@${company.id}.vn</span>
                  </div>
                </div>
                <div class="co-loc-card">
                  <div class="co-loc-badge">Port Terminal Hub</div>
                  <h4 class="co-loc-name">Hai Phong Maritime Gateway</h4>
                  <p class="co-loc-addr"><i class="fa-solid fa-location-dot"></i> Dinh Vu Logistics Park, Hai An District, Hai Phong</p>
                  <div class="co-loc-meta">
                    <span><i class="fa-solid fa-phone"></i> +84 225 385 9900</span>
                    <span><i class="fa-solid fa-envelope"></i> haiphong@${company.id}.vn</span>
                  </div>
                </div>
                <div class="co-loc-card">
                  <div class="co-loc-badge">Central Hub</div>
                  <h4 class="co-loc-name">Da Nang Port Operations</h4>
                  <p class="co-loc-addr"><i class="fa-solid fa-location-dot"></i> Tien Sa Port, Son Tra District, Da Nang City</p>
                  <div class="co-loc-meta">
                    <span><i class="fa-solid fa-phone"></i> +84 236 382 2555</span>
                    <span><i class="fa-solid fa-envelope"></i> danang@${company.id}.vn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="co-about-full-side">
            <!-- Scale & Assets -->
            <div class="co-detail-card">
              <h3 class="co-about-subheading">Enterprise Scope</h3>
              <div class="co-scope-row">
                <span class="scope-lbl">Global Employees</span>
                <span class="scope-val">${meta.employees}</span>
              </div>
              <div class="co-scope-row">
                <span class="scope-lbl">Countries Active</span>
                <span class="scope-val">${meta.countries}</span>
              </div>
              <div class="co-scope-row">
                <span class="scope-lbl">Industry Domain</span>
                <span class="scope-val">${company.industry}</span>
              </div>
              <div class="co-scope-row">
                <span class="scope-lbl">Primary Headquarters</span>
                <span class="scope-val">${company.location}</span>
              </div>
              <div class="co-scope-row">
                <span class="scope-lbl">Official Website</span>
                <span class="scope-val"><a href="${company.website || '#'}" target="_blank" rel="noopener" style="color:#2477E4; text-decoration:none; font-weight:600;">Visit Portal &rarr;</a></span>
              </div>
            </div>

            <div class="co-detail-card" style="margin-top: 24px;">
              <h3 class="co-about-subheading">Core Logistics Capabilities</h3>
              <div class="co-specialties-row" style="margin-top: 10px;">
                ${meta.specialties.map(s => `
                  <span class="co-specialty-pill" style="font-size: 13px; padding: 7px 14px;">
                    <i class="fa-solid ${s.icon}"></i> ${s.name}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 4: CULTURE ================= -->
      <div class="co-tab-pane" id="co-tab-pane-culture" style="display: none;">
        <div class="co-tab-section-header">
          <div>
            <h2 class="co-tab-main-title">Workplace Culture &amp; Values at ${company.name.split('(')[0].trim()}</h2>
            <p class="co-tab-main-sub">Empowering people through continuous learning, ethical leadership, inclusive growth, and employee wellbeing.</p>
          </div>
        </div>

        <!-- 4 Core Pillars -->
        <div class="co-culture-pillars-grid">
          <div class="culture-pillar-card">
            <div class="pillar-icon bg-blue"><i class="fa-solid fa-heart-pulse"></i></div>
            <h4 class="pillar-title">Constant Care &amp; Safety</h4>
            <p class="pillar-desc">Take care of today, actively prepare for tomorrow. Uncompromising safety across every port, vessel, and distribution warehouse.</p>
          </div>
          <div class="culture-pillar-card">
            <div class="pillar-icon bg-green"><i class="fa-solid fa-handshake-angle"></i></div>
            <h4 class="pillar-title">Humbleness &amp; Collaboration</h4>
            <p class="pillar-desc">Listen, learn, and innovate together. Open communication channels between field logistics teams and regional executive leaders.</p>
          </div>
          <div class="culture-pillar-card">
            <div class="pillar-icon bg-purple"><i class="fa-solid fa-shield-halved"></i></div>
            <h4 class="pillar-title">Uprightness &amp; Ethics</h4>
            <p class="pillar-desc">Our word is our bond. Transparency, regulatory compliance, and ethical standards guide every client shipment and customs clearance.</p>
          </div>
          <div class="culture-pillar-card">
            <div class="pillar-icon bg-amber"><i class="fa-solid fa-seedling"></i></div>
            <h4 class="pillar-title">Sustainable Future</h4>
            <p class="pillar-desc">Leading green shipping transformations, decarbonization initiatives, and zero-emission multimodal cold storage across ASEAN.</p>
          </div>
        </div>

        <!-- Employee Perks & Benefits Grid -->
        <div class="co-detail-card" style="margin-top: 28px;">
          <h3 class="co-about-subheading">Comprehensive Benefits Package</h3>
          <div class="co-benefits-grid">
            <div class="benefit-item">
              <i class="fa-solid fa-shield-virus benefit-ico"></i>
              <div>
                <h5>Premium Healthcare</h5>
                <p>Full outpatient and inpatient medical coverage for employees and direct family members.</p>
              </div>
            </div>
            <div class="benefit-item">
              <i class="fa-solid fa-gift benefit-ico"></i>
              <div>
                <h5>13th &amp; 14th Month Bonus</h5>
                <p>Guaranteed 13th month salary plus performance and KPI incentives paid semi-annually.</p>
              </div>
            </div>
            <div class="benefit-item">
              <i class="fa-solid fa-laptop-house benefit-ico"></i>
              <div>
                <h5>Hybrid Work Policy</h5>
                <p>Flexible work-from-home options for corporate and supply chain analysts.</p>
              </div>
            </div>
            <div class="benefit-item">
              <i class="fa-solid fa-graduation-cap benefit-ico"></i>
              <div>
                <h5>Sponsored Certifications</h5>
                <p>100% company-funded tuition for FIATA, APICS CPIM, and international logistics diplomas.</p>
              </div>
            </div>
            <div class="benefit-item">
              <i class="fa-solid fa-plane-departure benefit-ico"></i>
              <div>
                <h5>Annual Retreat &amp; Wellness</h5>
                <p>Yearly luxury team building excursions, gym allowances, and annual wellbeing days.</p>
              </div>
            </div>
            <div class="benefit-item">
              <i class="fa-solid fa-baby-carriage benefit-ico"></i>
              <div>
                <h5>Parental &amp; Sabbatical Leave</h5>
                <p>Generous maternity and paternity leave exceeding Vietnam labor statutory requirements.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Employee Testimonials -->
        <div class="co-testimonials-row" style="margin-top: 28px;">
          <div class="testimonial-card">
            <div class="testimonial-quote">"The scale of operations here is unmatched. Within 2 years, I had the opportunity to lead maritime clearance systems for some of the largest cold chain exporters in the Mekong Delta."</div>
            <div class="testimonial-author">
              <div class="author-avatar"><i class="fa-solid fa-user"></i></div>
              <div>
                <div class="author-name">Nguyen Minh Tuan</div>
                <div class="author-role">Senior Operations Supervisor &bull; 4 yrs at ${company.name.split('(')[0].trim()}</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-quote">"A truly respectful and global culture. The sponsored FIATA supply chain training gave me the tools to transition from operations coordinator to national logistics analyst."</div>
            <div class="testimonial-author">
              <div class="author-avatar"><i class="fa-solid fa-user"></i></div>
              <div>
                <div class="author-name">Le Tran Thao My</div>
                <div class="author-role">Supply Chain Lead &bull; 3 yrs at ${company.name.split('(')[0].trim()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 5: NEWS ================= -->
      <div class="co-tab-pane" id="co-tab-pane-news" style="display: none;">
        <div class="co-tab-section-header">
          <div>
            <h2 class="co-tab-main-title">Latest Company News &amp; Updates</h2>
            <p class="co-tab-main-sub">Recent developments, terminal announcements, green logistics milestones, and press releases.</p>
          </div>
        </div>

        <div class="co-news-grid">
          <div class="co-news-card" onclick="openArticle('vietnam-logistics-investment-2026')">
            <div class="co-news-img-wrap">
              <img src="images/today_1.jpg" alt="News 1" class="co-news-img">
              <span class="co-news-tag">Expansion</span>
            </div>
            <div class="co-news-content">
              <div class="co-news-date"><i class="fa-regular fa-clock"></i> 2 days ago &bull; Market Expansion</div>
              <h4 class="co-news-title">${company.name.split('(')[0].trim()} expands smart cold storage warehouse capacity in Southern Vietnam</h4>
              <p class="co-news-snippet">New facility features temperature-controlled zones from -25°C to +15°C, expanding export capabilities for agricultural and pharmaceutical sectors.</p>
              <span class="co-news-link">Read full story &rarr;</span>
            </div>
          </div>

          <div class="co-news-card" onclick="openArticle('maritime-shipping-rates-forecast-q1-2026')">
            <div class="co-news-img-wrap">
              <img src="images/today_2.jpg" alt="News 2" class="co-news-img">
              <span class="co-news-tag">Green Logistics</span>
            </div>
            <div class="co-news-content">
              <div class="co-news-date"><i class="fa-regular fa-clock"></i> 1 week ago &bull; Sustainability</div>
              <h4 class="co-news-title">${company.name.split('(')[0].trim()} launches dual-fuel vessel corridor connecting Cai Mep to North America</h4>
              <p class="co-news-snippet">New green shipping lane reduces carbon intensity by up to 65% per container transported on the transpacific trade route.</p>
              <span class="co-news-link">Read full story &rarr;</span>
            </div>
          </div>

          <div class="co-news-card" onclick="openArticle('vietnam-air-cargo-growth-2026')">
            <div class="co-news-img-wrap">
              <img src="images/today_3.jpg" alt="News 3" class="co-news-img">
              <span class="co-news-tag">Award</span>
            </div>
            <div class="co-news-content">
              <div class="co-news-date"><i class="fa-regular fa-clock"></i> 2 weeks ago &bull; Recognition</div>
              <h4 class="co-news-title">${company.name.split('(')[0].trim()} recognized as "Top Logistics Employer of the Year" in Vietnam</h4>
              <p class="co-news-snippet">Award highlights industry-leading workplace standards, transparent promotion frameworks, and excellence in supply chain training.</p>
              <span class="co-news-link">Read full story &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 6: CONTACT ================= -->
      <div class="co-tab-pane" id="co-tab-pane-contact" style="display: none;">
        <div class="co-tab-section-header">
          <div>
            <h2 class="co-tab-main-title">Contact &amp; Connect with ${company.name.split('(')[0].trim()}</h2>
            <p class="co-tab-main-sub">Get in touch with our Vietnam commercial division, logistics solutions team, or HR department.</p>
          </div>
        </div>

        <div class="co-contact-grid">
          <!-- Left: Direct Inquiry Form -->
          <div class="co-contact-form-box">
            <h3 class="co-contact-box-title">Send a Direct Message</h3>
            <p class="co-contact-box-sub">Fill out the form below. A company representative will get back to you within 24 business hours.</p>

            <form id="co-direct-contact-form" onsubmit="handleDirectCompanyContact(event, '${company.name}')">
              <div class="co-form-row">
                <div class="co-form-group">
                  <label>Họ và Tên (Full Name) *</label>
                  <input type="text" class="form-control" required placeholder="e.g. Tran Minh Tuan">
                </div>
                <div class="co-form-group">
                  <label>Email Doanh Nghiệp (Email) *</label>
                  <input type="email" class="form-control" required placeholder="tuan.tran@company.com">
                </div>
              </div>

              <div class="co-form-row">
                <div class="co-form-group">
                  <label>Số Điện Thoại (Phone) *</label>
                  <input type="tel" class="form-control" required placeholder="0912 345 678">
                </div>
                <div class="co-form-group">
                  <label>Chủ Đề Liên Hệ (Subject) *</label>
                  <select class="form-control" required>
                    <option value="Tư vấn giải pháp Logistics &amp; Cước vận tải">Tư vấn giải pháp Logistics &amp; Cước vận tải</option>
                    <option value="Hợp tác dịch vụ Kho bãi &amp; Chuỗi cung ứng">Hợp tác dịch vụ Kho bãi &amp; Chuỗi cung ứng</option>
                    <option value="Tuyển dụng &amp; Cơ hội việc làm">Tuyển dụng &amp; Cơ hội việc làm</option>
                    <option value="Đối tác đại lý Hải quan">Đối tác đại lý Hải quan</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div class="co-form-group">
                <label>Nội Dung Yêu Cầu (Message) *</label>
                <textarea class="form-control" rows="4" required placeholder="Vui lòng mô tả yêu cầu hoặc tuyến vận chuyển doanh nghiệp đang quan tâm..."></textarea>
              </div>

              <button type="submit" class="btn-co-submit-inquiry">
                <i class="fa-solid fa-paper-plane"></i> Gửi Yêu Cầu Liên Hệ
              </button>
            </form>
          </div>

          <!-- Right: Official Directory Card -->
          <div class="co-contact-directory-box">
            <h3 class="co-contact-box-title">Official Directory</h3>
            
            <div class="co-dir-item">
              <div class="dir-icon"><i class="fa-solid fa-headset"></i></div>
              <div>
                <div class="dir-lbl">Customer Service Hotline</div>
                <div class="dir-val">1900-8888 (Ext 2) / +84 28 3823 0011</div>
                <div class="dir-sub">Support Mon - Fri: 08:00 - 17:30</div>
              </div>
            </div>

            <div class="co-dir-item">
              <div class="dir-icon"><i class="fa-solid fa-envelope"></i></div>
              <div>
                <div class="dir-lbl">Recruitment &amp; HR Email</div>
                <div class="dir-val">careers.vietnam@${company.id}.com</div>
                <div class="dir-sub">For job applications and internship inquiries</div>
              </div>
            </div>

            <div class="co-dir-item">
              <div class="dir-icon"><i class="fa-solid fa-location-dot"></i></div>
              <div>
                <div class="dir-lbl">Vietnam Commercial Headquarters</div>
                <div class="dir-val">${company.location}</div>
                <div class="dir-sub">Multimodal Logistics &amp; Regional Hub</div>
              </div>
            </div>

            <div class="co-dir-item">
              <div class="dir-icon"><i class="fa-solid fa-globe"></i></div>
              <div>
                <div class="dir-lbl">Official Enterprise Portal</div>
                <div class="dir-val"><a href="${company.website || '#'}" target="_blank" rel="noopener" style="color:#2477E4; text-decoration:none;">${company.website || 'https://www.company.com'} &rarr;</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 4. Related Top Employers Section Underneath -->
    <div class="co-related-section">
      <div class="co-related-header">
        <div class="co-accent-bar"></div>
        <h2 class="co-related-title">Related Top Employers</h2>
        <p class="co-related-subtitle">Explore other leading enterprises in Logistics, Port Operations &amp; Technology</p>
      </div>

      <div class="co-related-cards-grid">
        ${relatedCompanies.map(rc => generateCompanyShowcaseCardHtml(rc)).join('')}
      </div>
    </div>
  `;
}


// 4. Dedicated B2B "Contact Now" Modal Controller
window.openCompanyContactModal = function(companyId, preselectedSubject = '', preselectedNote = '') {
  const company = enterpriseCompaniesData.find(c => c.id === companyId) || enterpriseCompaniesData[0];
  const overlay = document.getElementById('company-contact-modal');
  if (!overlay) return;

  const nameEl = document.getElementById('contact-modal-company-name');
  if (nameEl) nameEl.textContent = company.name;

  const companyInput = document.getElementById('contact-target-company-id');
  if (companyInput) companyInput.value = company.id;

  const subjectSelect = document.getElementById('contact-inquiry-subject');
  if (subjectSelect && preselectedSubject) {
    subjectSelect.value = preselectedSubject;
  }

  const messageTextarea = document.getElementById('contact-inquiry-message');
  if (messageTextarea && preselectedNote) {
    messageTextarea.value = preselectedNote;
  }

  // Reset modal state
  const formWrap = document.getElementById('contact-modal-form-wrap');
  const successWrap = document.getElementById('contact-modal-success-wrap');
  if (formWrap) formWrap.style.display = 'block';
  if (successWrap) successWrap.style.display = 'none';

  overlay.classList.add('open');
};

window.closeCompanyContactModal = function() {
  const overlay = document.getElementById('company-contact-modal');
  if (overlay) overlay.classList.remove('open');
};

window.submitCompanyContactForm = function(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('company-contact-form');
  if (!form) return;

  const fullname = form.elements['contact_fullname']?.value?.trim();
  const email = form.elements['contact_email']?.value?.trim();
  const phone = form.elements['contact_phone']?.value?.trim();
  const clientCompany = form.elements['contact_company']?.value?.trim();
  const subject = form.elements['contact_service']?.value || 'Tư vấn giải pháp';
  const message = form.elements['contact_message']?.value?.trim();
  const targetCompanyId = document.getElementById('contact-target-company-id')?.value || currentSelectedCompanyId;
  const targetCompany = enterpriseCompaniesData.find(c => c.id === targetCompanyId) || enterpriseCompaniesData[0];

  if (!fullname || !email || !phone || !clientCompany) {
    alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)');
    return;
  }

  // Generate reference lead code
  const leadId = 'LEAD-' + Math.floor(100000 + Math.random() * 900000);

  // Store in localStorage for demo persistence
  const existingLeads = JSON.parse(localStorage.getItem('vietnamjobs_company_leads') || '[]');
  existingLeads.unshift({
    leadId,
    timestamp: new Date().toISOString(),
    targetCompany: targetCompany.name,
    fullname,
    email,
    phone,
    clientCompany,
    subject,
    message
  });
  localStorage.setItem('vietnamjobs_company_leads', JSON.stringify(existingLeads));

  // Show Success Box inside Modal
  const formWrap = document.getElementById('contact-modal-form-wrap');
  const successWrap = document.getElementById('contact-modal-success-wrap');
  const successRef = document.getElementById('lead-success-ref-code');
  const successCompanyText = document.getElementById('lead-success-company-text');

  if (successRef) successRef.textContent = `Mã Hồ Sơ Yêu Cầu: ${leadId}`;
  if (successCompanyText) {
    successCompanyText.innerHTML = `Thông tin liên hệ của bạn đã được chuyển trực tiếp tới đại diện của <strong>${targetCompany.name}</strong>. Đại diện giải pháp sẽ liên hệ với bạn qua email <strong>${email}</strong> hoặc số điện thoại <strong>${phone}</strong> trong vòng 24 giờ làm việc.`;
  }

  if (formWrap) formWrap.style.display = 'none';
  if (successWrap) successWrap.style.display = 'block';

  // Clear form
  form.reset();
};

// Wire Top Nav "Companies" Button
document.addEventListener('DOMContentLoaded', () => {
  initCompaniesDirectory();

  // Ensure any [data-view="companies"] button opens companies directory
  document.querySelectorAll('[data-view="companies"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof switchView === 'function') {
        switchView('companies');
      }
    });
  });
});

/* ==========================================================================
   ARTICLE & EDITORIAL INTELLIGENCE ENGINE (PHNOM PENH POST / EDITORIAL STYLE)
   ========================================================================== */

// Master Article & News Database
const articlesDatabase = [
  {
    id: 'art-gdi',
    tag: 'National',
    sec: 'Immigration & Border Trade',
    title: 'GDI identify more than 5,000 attempts to illegally enter/exit Kingdom; 373 charged',
    author: 'Niem Chheng',
    location: 'Phnom Penh & Mekong Region',
    date: 'Published 30 October 2026, 09:15 ICT',
    heroImg: 'images/editorial_ai_logistics_hd.jpg',
    caption: 'The recent deportation of foreign nationals who committed offences in Cambodia & cross-border trade inspection. <b>GDI / VJ Intelligence</b>',
    listenMeta: '3 mins • AI voice',
    lead: 'Officials at Cambodia’s immigration checkpoints identified almost 3,000 criminal violations in the first nine months of the year, with the majority involving the use of forged documents.',
    paragraphs: [
      'They identified 2,921 cases, involving 5,262 people from 93 nationalities attempting unauthorized cross-border transitions along key ASEAN trade corridors.',
      'Of the total, 2,287 involved attempts to enter the Kingdom by 4,271 people, while 634 cases involved 991 people attempting to exit, according to the Ministry of Interior’s General Department of Immigration (GDI).',
      'The GDI report highlighted that rigorous enforcement alongside digitized biometric manifests has significantly strengthened security protocols across land border crossings connecting Vietnam, Cambodia, and Thailand.',
      'Authorities noted that legal trade corridors continue to operate smoothly, with automated customs clearances reaching record processing speeds despite heightened inspection of irregular documentation.'
    ],
    topics: ['Cambodia', 'Immigration', 'Ministry of Interior', 'Border Trade', 'Deportation', 'Cross-Border Logistics', 'ASEAN Corridor']
  },
  {
    id: 'art-cai-mep',
    tag: 'Maritime',
    sec: 'Deep Sea Ports',
    title: 'Cụm cảng Cái Mép đón chuyến tàu mẹ container 24,000 TEUs sang bờ Tây Mỹ',
    author: 'Đặng Minh Tuấn & Nhóm Phóng Viên Hàng Hải',
    location: 'Cái Mép - Thị Vải',
    date: 'Published 4 November 2026, 16:45 ICT',
    heroImg: 'images/hero_1.jpg',
    caption: 'Siêu tàu mẹ container thế hệ mới nhất cập cảng Cái Mép đi thẳng bờ Tây Hoa Kỳ không qua trung chuyển. <b>Port Authority</b>',
    listenMeta: '4 mins • AI voice',
    lead: 'Cụm cảng Cái Mép chính thức đón chuyến tàu mẹ trọng tải 24,000 TEUs, kết nối trực tiếp hàng xuất khẩu dệt may, da giày và điện tử của Việt Nam đến California chỉ trong 16 ngày.',
    paragraphs: [
      'Chuyến tàu thuộc liên minh hàng hải lớn nhất thế giới cập cầu cảng an toàn vào sáng nay, đánh dấu cột mốc năng lực tiếp nhận các tàu có mớn nước sâu lên tới -16.5m của Việt Nam.',
      'Việc kết nối tuyến biển trực tiếp (Direct service) không qua trung chuyển tại Singapore hay Hong Kong giúp các nhà xuất khẩu Việt Nam tiết kiệm từ 150 đến 250 USD cho mỗi container tiêu chuẩn.',
      'Đồng thời, thời gian vận chuyển trên biển được rút ngắn 5-7 ngày, tạo lợi thế cạnh tranh áp đảo cho nông sản tươi và hàng may mặc xuất khẩu mùa cao điểm cuối năm.',
      'Bộ Giao thông Vận tải khẳng định tiếp tục đẩy nhanh tiến độ nạo vét luồng hàng hải Vũng Tàu - Thị Vải để đón các thế hệ siêu tàu container lớn hơn nữa trong tương lai.'
    ],
    topics: ['Cái Mép', 'Container Shipping', 'Ocean Freight', 'Trans-Pacific', 'Ports', 'Direct Service']
  },
  {
    id: 'art-ai-dispatch',
    tag: 'Smart Logistics',
    sec: 'AI & Automation',
    title: 'AI điều vận bến bãi rút ngắn 42% thời gian chờ giải phóng hàng',
    author: 'Kỹ sư Lê Hoàng Nam',
    location: 'TP. Hồ Chí Minh & Bà Rịa - Vũng Tàu',
    date: 'Published 2 October 2026, 08:00 ICT',
    heroImg: 'images/editorial_ai_robotics_hd.jpg',
    caption: 'Hệ thống phân luồng container thông minh bằng AI tại cụm cảng nước sâu Cái Mép - Thị Vải. <b>VPA / Logistics Tech</b>',
    listenMeta: '3 mins • AI voice',
    lead: 'Các thuật toán học sâu (Deep Learning) kết hợp mạng cảm biến IoT trên quốc lộ 51 đang rút ngắn hơn 42% thời gian chờ tại cổng cảng Cái Mép - Thị Vải, tiết kiệm hàng triệu lít nhiên liệu mỗi tháng.',
    paragraphs: [
      'Mô hình điều vận thời gian thực phân tích lưu lượng giao thông, tình trạng bến bãi và lịch trình cập cầu của các tàu mẹ siêu trọng tải để phát hành khung giờ Gate-in tối ưu cho từng xe container kéo hàng.',
      'Tài xế nhận lệnh điện tử thông qua ứng dụng di động kết nối trực tiếp với hệ thống TOS (Terminal Operating System) của cảng, tự động mở barie nhận dạng biển số và mã container qua camera AI tốc độ cao.',
      'Theo thống kê của Tổng công ty Tân Cảng Sài Gòn, giải pháp này giúp triệt tiêu tình trạng ùn tắc kéo dài ngoài cổng cảng, nâng cao tỷ lệ quay vòng phương tiện thêm 1.8 lượt/ngày.'
    ],
    topics: ['AI Dispatch', 'Deep Learning', 'Port Automation', 'Smart Yard', 'Green Logistics']
  },
  {
    id: 'art-cross-border',
    tag: 'Policy & Tax',
    sec: 'Cross-Border Logistics',
    title: 'Tổng cục Thuế hướng dẫn biểu thuế tránh đánh thuế hai lần cho chuyên gia',
    author: 'Dr. Phạm Minh Quân',
    location: 'Hà Nội & Singapore',
    date: 'Published 28 September 2026, 14:30 ICT',
    heroImg: 'images/lead_story.jpg',
    caption: 'Hội nghị điều phối chuỗi cung ứng và hiệp định tránh đánh thuế 2 lần giữa Việt Nam & các nước thành viên ASEAN. <b>VJ Policy Center</b>',
    listenMeta: '4 mins • AI voice',
    lead: 'Tổng cục Thuế cùng Bộ Tài chính ban hành hướng dẫn thực thi hiệp định tránh đánh thuế hai lần (DTA) và quy chuẩn lao động xuyên biên giới đối với nhân sự công nghệ logistics và vận tải quốc tế.',
    paragraphs: [
      'Khung quy định mới thiết lập cơ chế xác thực thuế suất ưu đãi đối với các chuyên gia kỹ thuật phần mềm logistics, điều vận hàng hải và kỹ sư giải pháp làm việc từ xa giữa Việt Nam, Singapore và Malaysia.',
      'Doanh nghiệp vận tải giao nhận hàng hóa (Forwarder) đa quốc gia giờ đây được phép hạch toán chi phí nhân sự kỹ thuật số xuyên biên giới vào chi phí hoạt động hợp lệ khi có hợp đồng số hóa có chứng thực chữ ký điện tử quốc tế.',
      'Hệ thống tự động liên thông dữ liệu mã số thuế cá nhân và mã định danh doanh nghiệp giúp giảm thiểu 80% thời gian giải trình hồ sơ hoàn thuế khấu trừ tại nguồn (Withholding Tax).'
    ],
    topics: ['Tax Treaty', 'Cross-Border', 'Labor Law', 'Logistics Workforce', 'ASEAN', 'Remote Work']
  },
  {
    id: 'art-cold-chain',
    tag: 'Healthcare',
    sec: 'Pharma Cold Chain',
    title: 'Chuẩn WHO-GDP áp dụng cho 100% kho lạnh dược phẩm từ năm 2027',
    author: 'Dược sĩ Trần Bích Ngọc',
    location: 'Long An & Bắc Ninh',
    date: 'Published 12 October 2026, 11:20 ICT',
    heroImg: 'images/editorial_tech_salaries_hd.png',
    caption: 'Kho lạnh đạt tiêu chuẩn WHO-GDP với dải nhiệt kiểm soát tự động từ -25°C đến +8°C tại KCN Long Hậu. <b>VJ Pharma Logistics</b>',
    listenMeta: '5 mins • AI voice',
    lead: 'Bộ Y tế cùng Cục Quản lý Dược công bố lộ trình áp dụng bắt buộc tiêu chuẩn Thực hành tốt phân phối thuốc (GDP) của WHO đối với toàn bộ kho vận và xe lạnh vận chuyển dược phẩm từ 01/2027.',
    paragraphs: [
      'Quy chuẩn mới yêu cầu 100% phương tiện vận tải dược phẩm chuyên dụng phải lắp đặt thiết bị ghi nhiệt độ liên tục có kết nối truyền dữ liệu đám mây và hệ thống cảnh báo xâm nhập nhiệt tức thời.',
      'Các trung tâm phân phối kho lạnh bắt buộc duy trì hệ thống điện dự phòng 3 lớp và kiểm định mapping nhiệt độ định kỳ 6 tháng một lần theo tiêu chuẩn quốc tế ISPE.',
      'Sự chuyển dịch này đang tạo ra làn sóng đầu tư mạnh mẽ vào các kho lạnh thế hệ mới tại các vùng kinh tế trọng điểm phía Nam và phía Bắc.'
    ],
    topics: ['Cold Chain', 'Pharma Logistics', 'WHO-GDP', 'Vaccine Storage', 'Temperature Control']
  },
  {
    id: 'art-customs-edi',
    tag: 'Customs Tech',
    sec: 'Trade Compliance',
    title: 'Tân Cảng Sài Gòn tự động hóa hoàn toàn luồng khai báo hải quan điện tử',
    author: 'Hoàng Quốc Việt',
    location: 'Cát Lái & TP. Thủ Đức',
    date: 'Published 5 November 2026, 10:15 ICT',
    heroImg: 'images/hero_2.jpg',
    caption: 'Cổng thông tin khai báo VNACCS/VCIS điện tử tự động kết nối dữ liệu bãi container Cát Lái. <b>SNP / Tech Center</b>',
    listenMeta: '3 mins • AI voice',
    lead: 'Hệ thống tự động thông quan điện tử e-Port nâng cấp giúp giảm thời gian làm thủ tục lấy lệnh giao hàng D/O và hạ bãi từ 4 giờ xuống còn dưới 15 phút.',
    paragraphs: [
      'Chủ hàng và các công ty logistics có thể hoàn tất thanh toán điện tử, nộp hồ sơ kiểm tra chuyên ngành và đăng ký xe ra vào bến bãi hoàn toàn trực tuyến 24/7.',
      'Dữ liệu được mã hóa xác thực bằng chữ ký số HSM tập trung và liên thông trực tiếp với Cổng thông tin một cửa quốc gia NSW.',
      'Dự án thí điểm đã ghi nhận mức độ hài lòng trên 96% từ hơn 1,200 đại lý hải quan và doanh nghiệp xuất nhập khẩu khu vực Đông Nam Bộ.'
    ],
    topics: ['Customs EDI', 'VNACCS/VCIS', 'e-Port', 'Automation', 'SNP']
  },
  {
    id: 'art-noi-bai-cargo',
    tag: 'Aviation',
    sec: 'Air Freight',
    title: 'Hàng không Nội Bài mở thêm đường bay chuyên chở hàng hóa đi Frankfurt',
    author: 'Vũ Thanh Hằng',
    location: 'Hà Nội & Frankfurt',
    date: 'Published 6 November 2026, 07:30 ICT',
    heroImg: 'images/editorial_logistics_salaries.png',
    caption: 'Đội bay chuyên cơ vận tải hàng hóa Boeing 777F cất cánh từ nhà ga hàng hóa Nội Bài đi Frankfurt. <b>Air Cargo News</b>',
    listenMeta: '4 mins • AI voice',
    lead: 'Tuyến bay thẳng vận chuyển hàng hóa đường hàng không kết nối thủ đô Hà Nội với trung tâm logistics lớn nhất châu Âu chính thức đi vào khai thác với tần suất 4 chuyến/tuần.',
    paragraphs: [
      'Đường bay mới đáp ứng nhu cầu xuất khẩu linh kiện điện tử bán dẫn, thiết bị viễn thông và hàng may mặc cao cấp từ chuỗi cung ứng Bắc Ninh, Thái Nguyên sang thị trường EU.',
      'Thời gian vận chuyển được rút ngắn xuống dưới 14 giờ bay, hỗ trợ tích cực cho các hợp đồng giao hàng theo phương thức Just-In-Time của các tập đoàn công nghệ toàn cầu.',
      'Sản lượng hàng hóa hàng không qua cụm cảng Nội Bài dự kiến tăng trưởng trên 18% trong quý IV/2026 nhờ bổ sung năng lực chuyên chở này.'
    ],
    topics: ['Air Cargo', 'Aviation', 'Frankfurt', 'Noi Bai', 'Semiconductors', 'Direct Route']
  },
  {
    id: 'art-cargo-theft',
    tag: 'Security',
    sec: 'Supply Chain Risk',
    title: 'Cargo Theft Prevention Strategies in Transshipment Hubs',
    author: 'VJ Supply Chain Security Team',
    location: 'Regional Analysis',
    date: 'Published 1 November 2026',
    heroImg: 'images/editorial_ai_logistics_hd.jpg',
    caption: 'Advanced cargo tracking and geofencing surveillance across southern transshipment hubs.',
    listenMeta: '3 mins • Audio Brief',
    lead: 'Báo cáo an ninh logistics ghi nhận giải pháp triển khai cảm biến niêm phong thông minh (Smart Seal) và camera AI giám sát hành trình giúp giảm thiểu 85% rủi ro mất cắp hàng hóa.',
    paragraphs: [
      'Các hành lang vận chuyển liên tỉnh đang áp dụng hệ thống cảnh báo xâm nhập buồng lái và ngắt động cơ từ xa khi phương tiện di chuyển lệch khỏi lộ trình được phê duyệt.',
      'Bảo hiểm hàng hóa xuất nhập khẩu kết hợp dữ liệu hành trình theo thời gian thực giúp giảm 30% phí bảo hiểm cho các đơn vị vận tải đạt chuẩn ISO 28000.'
    ],
    topics: ['Cargo Theft', 'Security', 'Risk Management', 'IoT', 'Insurance']
  },
  {
    id: 'art-conrail',
    tag: 'Rail Freight',
    sec: 'Intermodal Logistics',
    title: 'North-South High-Speed Freight Rail Connectivity Action Plan',
    author: 'Bộ Kế Hoạch & Đầu Tư Logistics Taskforce',
    location: 'Hà Nội - TP. Hồ Chí Minh',
    date: 'Published 3 November 2026',
    heroImg: 'images/editorial_ai_robotics_hd.jpg',
    caption: 'Quy hoạch hành lang vận tải đường sắt tốc độ cao chuyên chở container liên vận quốc tế.',
    listenMeta: '4 mins • Audio Brief',
    lead: 'Quy hoạch đường sắt tốc độ cao mở ra hành lang vận tải hàng hóa xanh kết nối các trung tâm công nghiệp lớn với chi phí chỉ bằng 45% so với vận tải đường bộ.',
    paragraphs: [
      'Dự án định hướng thiết lập các ga hàng hóa liên vận quốc tế thế hệ mới tại Yên Viên, Đồng Đăng, Trảng Bom và Sóng Thần.',
      'Hệ thống đường ray khổ tiêu chuẩn 1,435mm cho phép kết nối xuyên suốt với mạng lưới đường sắt liên vận Á - Âu mà không cần sang tải toa xe.'
    ],
    topics: ['Railways', 'Intermodal', 'High-Speed Rail', 'Green Corridor', 'Eurasia Rail']
  }
];

// Open and hydrate any article by ID
// Open and hydrate any article by ID or Story Object
window.openArticle = function(articleInput, updateHash = true) {
  const hub = document.getElementById('lw-hub-overview');
  const reader = document.getElementById('lw-article-reader');

  // If no article passed, view the hub overview
  if (!articleInput) {
    if (typeof window.switchView === 'function') {
      window.switchView('article', false);
    }
    if (reader) reader.style.display = 'none';
    if (hub) hub.style.display = 'block';
    if (updateHash) window.location.hash = 'article';
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return;
  }

  // 1. Resolve article data
  let art = null;
  if (typeof articleInput === 'object' && articleInput !== null) {
    art = articleInput;
  } else if (typeof articleInput === 'string') {
    const id = articleInput.trim();
    art = (typeof articlesDatabase !== 'undefined') ? articlesDatabase.find(a => a.id === id) : null;
    if (!art) {
      // Look up by partial title match
      art = (typeof articlesDatabase !== 'undefined') ? articlesDatabase.find(a => 
        a.title.toLowerCase().includes(id.toLowerCase()) || id.toLowerCase().includes(a.title.toLowerCase())
      ) : null;
    }
    if (!art) {
      const cleanTitle = id.replace(/^art-/, '').replace(/-/g, ' ');
      art = {
        id: id,
        tag: 'LOGISTICS WAVES',
        sec: 'Industry Intelligence',
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        author: 'FreightWaves & VietnamJobs Editorial Board',
        location: 'Washington / Ho Chi Minh City',
        date: 'Published 06 November 2026',
        heroImg: 'images/editorial_ai_logistics_hd.jpg',
        caption: 'Báo cáo độc quyền về xu hướng thị trường chuỗi cung ứng và vận tải hàng hóa.',
        listenMeta: '3 mins • AI voice',
        lead: 'Phân tích chuyên sâu về làn sóng đầu tư hạ tầng chuỗi cung ứng, kho lạnh thông minh và giải pháp tự động hóa cảng biển thời gian thực.',
        paragraphs: [
          'Ngành logistics đang bước vào giai đoạn chuyển mình mạnh mẽ với sự gia tăng đột biến của các dự án kho tự động (ASRS) và cảng biển nước sâu tích hợp AI.',
          'Các doanh nghiệp hàng đầu đang đẩy nhanh tốc độ số hóa chứng từ điện tử EDI, tối ưu hóa tuyến đường điều vận và giảm thiểu khí thải carbon trên các hành lang kinh tế trọng điểm.',
          'Sự kết hợp giữa chính sách phát triển hạ tầng và dòng vốn FDI chất lượng cao đang mở ra hàng chục nghìn vị trí việc làm chuyên môn cao.'
        ]
      };
    }
  }

  if (!art) return;

  // 2. Switch view & toggle containers
  if (typeof state !== 'undefined') {
    state.currentView = 'article';
  }
  document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active-view'));
  const viewArticle = document.getElementById('view-article');
  if (viewArticle) viewArticle.classList.add('active-view');

  if (hub) hub.style.display = 'none';
  if (reader) reader.style.display = 'block';

  // 3. Hydrate Header Elements
  const elTag = document.getElementById('art-tag');
  const elSec = document.getElementById('art-sec');
  const elHeadline = document.getElementById('art-headline');
  const elAuthor = document.getElementById('art-author');
  const elLocation = document.getElementById('art-location');
  const elDate = document.getElementById('art-date');
  const elHeroImg = document.getElementById('art-hero-img');
  const elCaption = document.getElementById('art-caption');
  const elBody = document.getElementById('art-body');
  const elCrumbCat = document.getElementById('art-crumb-cat');
  const elListenMeta = document.getElementById('art-listen-meta');

  if (elTag) elTag.textContent = (art.tag || 'NATIONAL').toUpperCase();
  if (elSec) elSec.textContent = art.sec || 'Logistics & Supply Chain';
  if (elHeadline) elHeadline.textContent = art.title;
  if (elAuthor) elAuthor.textContent = art.author || 'Niem Chheng';
  if (elLocation) elLocation.textContent = art.location || 'Phnom Penh & Mekong Region';
  if (elDate) elDate.textContent = art.date || 'Published 30 October 2026, 09:15 ICT';
  if (elCrumbCat) elCrumbCat.textContent = art.sec || art.tag || 'Tin Tức Chuyên Ngành';
  if (elListenMeta) elListenMeta.innerHTML = art.listenMeta || '3 mins &bull; AI voice';

  if (elHeroImg) {
    elHeroImg.src = art.heroImg || 'images/editorial_ai_logistics_hd.jpg';
    elHeroImg.alt = art.title;
  }
  if (elCaption) {
    elCaption.innerHTML = art.caption || (art.title + ' — Báo cáo từ VJ Market Intelligence.');
  }

  // 4. Reset Audio Player
  isAudioPlaying = false;
  const btnAudio = document.getElementById('btn-art-listen');
  const iconAudio = document.getElementById('art-listen-icon');
  const titleAudio = document.getElementById('art-listen-title');
  if (btnAudio) btnAudio.style.background = '#DC2626';
  if (iconAudio) iconAudio.innerHTML = '<path d="M8 5v14l11-7z"/>';
  if (titleAudio) titleAudio.innerHTML = 'LISTEN TO THIS ARTICLE';

  // 5. Hydrate Article Body
  if (elBody) {
    const leadText = art.lead || 'Báo cáo độc quyền về xu hướng thị trường chuỗi cung ứng và vận tải hàng hóa.';
    const paragraphs = art.paragraphs && art.paragraphs.length > 0 ? art.paragraphs : [
      'Ngành logistics đang bước vào giai đoạn chuyển mình mạnh mẽ với sự gia tăng đột biến của các dự án kho tự động (ASRS) và cảng biển nước sâu tích hợp AI.',
      'Các doanh nghiệp hàng đầu đang đẩy nhanh tốc độ số hóa chứng từ điện tử EDI, tối ưu hóa tuyến đường điều vận và giảm thiểu khí thải carbon.',
      'Sự kết hợp giữa chính sách phát triển hạ tầng và dòng vốn FDI chất lượng cao đang mở ra hàng chục nghìn vị trí việc làm chuyên môn cao.'
    ];

    elBody.innerHTML = `
      <p class="lead" style="font-size:17px; font-weight:600; line-height:1.7; color:#1E293B; margin-bottom:18px;">${leadText}</p>
      ${paragraphs.map((p, idx) => {
        if (idx === 1) {
          return `
            <p style="margin-bottom:16px; line-height:1.75; font-size:15px; color:#334155;">${p}</p>
            <blockquote style="border-left:4px solid #0056B3; padding:12px 20px; margin:24px 0; background:#F8FAFC; font-style:italic; font-size:15px; color:#0F172A; border-radius:0 8px 8px 0;">
              "Minh bạch hóa dòng chảy hàng hóa và tự động hóa quy trình bốc dỡ là chìa khóa then chốt để hạ tầng logistics Việt Nam nâng cao năng lực cạnh tranh toàn cầu."
            </blockquote>
          `;
        }
        return `<p style="margin-bottom:16px; line-height:1.75; font-size:15px; color:#334155;">${p}</p>`;
      }).join('')}
    `;
  }

  // 6. Hydrate Right Sidebar Latest News List (Matching Screenshot)
  const sidebarList = document.getElementById('art-sidebar-newslist');
  if (sidebarList) {
    const latestItems = [
      { id: 'art-gdi', title: 'GDI identify more than 5,000 attempts to illegally enter/exit Kingdom', time: '12 mins ago', img: 'images/editorial_ai_logistics_hd.jpg' },
      { id: 'art-cai-mep', title: 'Cụm cảng Cái Mép đón chuyến tàu mẹ container 24,000 TEUs sang bờ Tây Mỹ', time: '35 mins ago', img: 'images/hero_1.jpg' },
      { id: 'art-ai-dispatch', title: 'AI điều vận bến bãi rút ngắn 42% thời gian chờ giải phóng hàng', time: '1 hr ago', img: 'images/editorial_ai_robotics_hd.jpg' },
      { id: 'art-cross-border', title: 'Tổng cục Thuế hướng dẫn biểu thuế tránh đánh thuế hai lần cho chuyên gia', time: '2 hrs ago', img: 'images/lead_story.jpg' },
      { id: 'art-cold-chain', title: 'Chuẩn WHO-GDP áp dụng cho 100% kho lạnh dược phẩm từ năm 2027', time: '4 hrs ago', img: 'images/editorial_tech_salaries_hd.png' },
      { id: 'art-customs-edi', title: 'Tân Cảng Sài Gòn tự động hóa hoàn toàn luồng khai báo hải quan điện tử', time: '6 hrs ago', img: 'images/hero_2.jpg' },
      { id: 'art-noi-bai-cargo', title: 'Hàng không Nội Bài mở thêm đường bay chuyên chở hàng hóa đi Frankfurt', time: '7 hrs ago', img: 'images/editorial_logistics_salaries.png' }
    ];

    sidebarList.innerHTML = latestItems.map(item => `
      <li style="margin:0;">
        <a href="#article?id=${item.id}" onclick="window.openArticle('${item.id}', true); return false;" class="sidebar-news-item" style="display:flex; align-items:flex-start; gap:12px; text-decoration:none; padding:8px 0; border-bottom:1px solid #F1F5F9;">
          <img src="${item.img}" alt="${item.title}" style="width:72px; height:52px; border-radius:6px; object-fit:cover; flex-shrink:0;">
          <div style="flex:1; min-width:0;">
            <div class="item-title" style="font-size:12.5px; font-weight:700; color:#0F172A; line-height:1.35; margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${item.title}</div>
            <div class="item-time" style="font-size:11px; color:#94A3B8; display:flex; align-items:center; gap:4px;">
              <i class="fa-regular fa-clock" style="font-size:10px;"></i> ${item.time}
            </div>
          </div>
        </a>
      </li>
    `).join('');
  }

  // 7. Update URL Hash & Scroll Top
  if (updateHash) {
    window.location.hash = `article?id=${encodeURIComponent(art.id)}`;
  }
  if (typeof updateDynamicSEO === 'function') {
    updateDynamicSEO('article', `${art.title} – VietnamJobs Editorial`, art.lead || art.title);
  }

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 20);
};

window.hideArticleReader = function() {
  const reader = document.getElementById('lw-article-reader');
  if (reader) reader.style.display = 'none';
  const overview = document.getElementById('lw-hub-overview');
  if (overview) {
    overview.style.display = 'block';
  }
  window.location.hash = 'article';
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

window.scrollLwCarousel = function(dir) {
  const c = document.getElementById('lw-today-carousel');
  if (c) {
    c.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }
};

// Interactive Article Audio Toggle
let isAudioPlaying = false;
window.toggleArticleAudio = function() {
  isAudioPlaying = !isAudioPlaying;
  const btn = document.getElementById('btn-art-listen');
  const icon = document.getElementById('art-listen-icon');
  const title = document.getElementById('art-listen-title');

  if (isAudioPlaying) {
    if (btn) btn.style.background = '#059669';
    if (icon) icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    if (title) title.innerHTML = 'Đang phát âm thanh AI...';
    showToast('Đang phát giọng đọc trí tuệ nhân tạo (AI Voice)...');
  } else {
    if (btn) btn.style.background = 'var(--art-red)';
    if (icon) icon.innerHTML = '<path d="M8 5l11 7-11 7z"/>';
    if (title) title.innerHTML = 'Listen to this article';
    showToast('Đã tạm dừng bài đọc.');
  }
};

// Cycle Audio Playback Speed
const audioSpeeds = ['1.0×', '1.25×', '1.5×', '2.0×'];
let currentSpeedIdx = 0;
window.cycleAudioSpeed = function(btn) {
  currentSpeedIdx = (currentSpeedIdx + 1) % audioSpeeds.length;
  const speed = audioSpeeds[currentSpeedIdx];
  if (btn) btn.textContent = speed;
  showToast('Tốc độ đọc: ' + speed);
};

/* ==========================================================================
   ENTERPRISE JOBS MASTER-DETAIL SPLIT-SCREEN ENGINE (PICTURE 3)
   ========================================================================== */

const enterpriseJobsDatabase = [
  {
    "id": "job-ocean-freight",
    "title": "Senior Ocean Freight Forwarder",
    "company": "VietnamJobs Logistics Group",
    "companyLogo": "images/brands/maersk.svg",
    "companyIcon": "fa-ship",
    "salary": "$28,000,000 - $42,000,000 / mo",
    "salaryVal": 35000000,
    "location": "Ho Chi Minh City - District 1 & Thu Duc (Hybrid)",
    "workplace": "Hybrid",
    "category": "forwarding",
    "tags": ["Full-time • 3 - 5 Years", "Ocean Freight", "1,001 - 5,000 employees", "Skills match your profile"],
    "isUrgent": true,
    "isHighSalary": true,
    "time": "2 hours ago",
    "applicants": "30 applicants",
    "specs": { "exp": "Full-time • 3 - 5 Years", "edu": "University Degree", "dept": "Ocean Freight Operations", "openings": "2 Positions" },
    "overview": "VietnamJobs Logistics Group is seeking an experienced Senior Ocean Freight Forwarder to direct FCL/LCL ocean freight routing, carrier space allocation, and enterprise account management across major trans-pacific and European trade corridors.",
    "responsibilities": [
      "Coordinate ocean freight carrier space bookings, spot rate negotiations, and space allocation with major maritime shipping lines (Maersk, MSC, CMA CGM).",
      "Ensure compliant export/import customs documentation, bill-of-lading (B/L) processing, and demurrage minimization for multinational accounts.",
      "Track and report real-time milestone shipment statuses across multimodal corridors to ensure on-time delivery KPIs."
    ],
    "requirements": [
      "Minimum 3 - 5 years direct experience in international ocean freight forwarding in Vietnam.",
      "Comprehensive knowledge of Incoterms 2020, maritime cargo law, and customs manifest protocols.",
      "Proficiency in bilingual professional English and Vietnamese."
    ],
    "benefits": [
      "13th & 14th month salary with performance incentive bonuses.",
      "Flexible hybrid work environment (1 day WFH per week).",
      "Premium Bao Viet VIP Healthcare package for employee & family."
    ]
  },

  // Page 1
  {
    "id": "job-1",
    "title": "Supply Chain Solutions Architect (Cold Chain)",
    "company": "VinFast Logistics & Cold Chain Solutions",
    "companyLogo": "images/brands/vinfast.svg",
    "companyIcon": "fa-snowflake",
    "salary": "₫35.000.000 - ₫55.000.000/mo",
    "salaryVal": 45000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["Top Tier Enterprise", "Cold Chain", "High Salary", "Strategy"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "3 hours ago",
    "applicants": "22 applicants",
    "specs": { "exp": "Senior level (3 – 5 Yrs)", "edu": "Master / Engineering", "dept": "Strategic Network Optimization", "openings": "1 Position" },
    "overview": "VinFast is seeking a seasoned Ocean Freight & Cold Chain Logistics Architect to lead refrigerated linehaul, battery transport, and multimodal carrier negotiations.",
    "responsibilities": [
      "Coordinate ocean freight routing, rate negotiations, and space allocation with major maritime alliances (2M, Ocean Alliance).",
      "Manage complex customs clearance, FMC bill-of-lading (B/L) documentation, and cross-border demurrage minimization.",
      "Act as direct strategic escalation lead for Tier-1 automotive and electronics enterprise shippers."
    ],
    "requirements": [
      "Minimum 3 years direct container ocean freight or cold chain forwarding experience in Vietnam.",
      "Proficiency with CargoWise ONE or equivalent enterprise freight forwarding ERP systems.",
      "Proficiency in bilingual trade English & Vietnamese."
    ],
    "benefits": [
      "14-month annual compensation with performance incentive bonuses.",
      "Flexible 2-day work-from-home policy each week.",
      "Premium healthcare insurance including outpatient and dental coverage."
    ]
  },
  {
    "id": "job-2",
    "title": "International Customs Clearance & Compliance Manager",
    "company": "DHL Global Forwarding Vietnam",
    "companyLogo": "images/brands/dhl.svg",
    "companyIcon": "fa-stamp",
    "salary": "₫26.000.000 - ₫38.000.000/mo",
    "salaryVal": 32000000,
    "location": "Hanoi, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "customs",
    "tags": ["Multinational", "Customs Brokerage", "Compliance", "Noi Bai"],
    "isUrgent": true,
    "isHighSalary": false,
    "time": "6 hours ago",
    "applicants": "33 applicants",
    "specs": { "exp": "Manager (5+ Yrs)", "edu": "BA Foreign Trade / Customs", "dept": "Customs & Trade Governance", "openings": "1 Position" },
    "overview": "Direct customs compliance, HS tariff classifications, and automated VNACCS/VCIS EDI transmissions for enterprise cargo moving through Northern Vietnam.",
    "responsibilities": [
      "Ensure zero regulatory non-compliance across 15,000+ annual sea/air declarations.",
      "Act as chief liaison with General Department of Vietnam Customs on duty exemptions."
    ],
    "requirements": ["Active Customs Broker License", "5+ years managing trade compliance within major 3PL."],
    "benefits": ["Competitive 13th-month salary", "Global mobility programs", "Full health insurance for family."]
  },
  {
    "id": "job-3",
    "title": "Container Terminal Dispatch Coordinator (Shift)",
    "company": "Saigon Newport Corporation (Tan Cang - Cai Mep TCIT)",
    "companyLogo": "images/brands/saigon-newport.svg",
    "companyIcon": "fa-anchor",
    "salary": "₫22.000.000 - ₫35.000.000/mo",
    "salaryVal": 28000000,
    "location": "Ba Ria - Vung Tau, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "port",
    "tags": ["Deep Sea Port", "Maritime", "Terminal Ops", "Shift Work"],
    "isUrgent": false,
    "isHighSalary": false,
    "time": "1 day ago",
    "applicants": "34 applicants",
    "specs": { "exp": "Specialist (2 – 4 Yrs)", "edu": "Maritime University / Logistics", "dept": "Terminal Operating Systems (TOS)", "openings": "3 Positions" },
    "overview": "Manage quayside ship-to-shore gantry cranes and container yard straddle carrier dispatch using Navis N4 Terminal Operating Systems at Cai Mep deep-water port.",
    "responsibilities": [
      "Coordinate container vessel stowage planning and crane split sequences for ultra-large container vessels.",
      "Optimize yard turn times for drayage tractor-trailers to under 28 minutes per transaction."
    ],
    "requirements": ["Bachelor in Maritime Navigation / Port Logistics", "Navis N4 TOS operating experience."],
    "benefits": ["Hazard & shift allowances", "Daily shuttle bus from HCMC/Vung Tau", "State corporation benefits."]
  },
  {
    "id": "job-4",
    "title": "Fleet Telematics & Route Optimization Data Analyst",
    "company": "Logivan Vietnam Freight Network",
    "companyLogo": "images/brands/logivan.svg",
    "companyIcon": "fa-truck",
    "salary": "₫30.000.000 - ₫48.000.000/mo",
    "salaryVal": 38000000,
    "location": "Da Nang, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["Telematics", "Fleet Tech", "Data Analytics", "LogiTech"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "1 day ago",
    "applicants": "35 applicants",
    "specs": { "exp": "Mid-Senior (2 – 4 Yrs)", "edu": "Data Science / Industrial Eng.", "dept": "Digital Freight Platform", "openings": "2 Positions" },
    "overview": "Analyze GPS telemetry, fuel consumption rates, and empty-miles backtrack across a network of 40,000+ heavy trucks.",
    "responsibilities": ["Build predictive dynamic routing models in Python/SQL", "Deploy driver safety scorecards."],
    "requirements": ["Proficiency in Python/R, PostgreSQL/BigQuery", "Background in transport logistics."],
    "benefits": ["Stock options program", "Flexible remote work", "MacBook Pro hardware provided."]
  },
  {
    "id": "job-5",
    "title": "Senior Ocean Freight Forwarder",
    "company": "Viconship Logistics Group",
    "companyLogo": "images/brands/viconship.svg",
    "companyIcon": "fa-ship",
    "salary": "₫28.000.000 - ₫42.000.000/mo",
    "salaryVal": 35000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "forwarding",
    "tags": ["Verified Employer", "Full-time", "Hybrid", "Ocean Freight"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "2 days ago",
    "applicants": "19 applicants",
    "specs": { "exp": "3 – 5 Years", "edu": "Bachelor Degree", "dept": "Asia-Europe Trade Lane", "openings": "2 Positions" },
    "overview": "Manage end-to-end container booking, multimodal carrier space allocations, and trade documentation for key accounts.",
    "responsibilities": ["Manage ocean freight contracts with 2M and Ocean Alliance carriers.", "Resolve customs documentation issues."],
    "requirements": ["3+ years ocean freight forwarding experience.", "Strong English and negotiation skills."],
    "benefits": ["14-month salary", "Annual corporate training sponsorship", "Flexible WFH schedule."]
  },
  // Page 2
  {
    "id": "job-6",
    "title": "AMR Robotics & Automation Systems Specialist",
    "company": "Tiki Logistics Automated Mega Hub",
    "companyLogo": "images/brands/tiki.svg",
    "companyIcon": "fa-robot",
    "salary": "₫32.000.000 - ₫48.000.000/mo",
    "salaryVal": 40000000,
    "location": "Binh Duong, Vietnam (On-site)",
    "workplace": "On-site",
    "category": "robotics",
    "tags": ["Urgent Hiring", "Full-time", "On-site", "Warehouse Tech"],
    "isUrgent": true,
    "isHighSalary": true,
    "time": "2 days ago",
    "applicants": "28 applicants",
    "specs": { "exp": "2 – 4 Years", "edu": "BS in Mechatronics/CS", "dept": "Automated Operations Group", "openings": "4 Positions" },
    "overview": "Lead continuous deployment, route calibration, and preventative maintenance for 450+ autonomous mobile robots (AMRs).",
    "responsibilities": ["Supervise Fleet Management Software (FMS)", "Calibrate LiDAR and SLAM sensors."],
    "requirements": ["Degree in Mechatronics/Electrical/Robotics", "Hands-on experience with AGV/AMRs."],
    "benefits": ["Attractive project completion bonuses", "Comprehensive healthcare", "Modern robotics lab."]
  },
  {
    "id": "job-7",
    "title": "Senior AI Computer Vision Engineer (Warehouse OCR)",
    "company": "FPT Software AI & Digital Labs",
    "companyLogo": "images/brands/fpt.svg",
    "companyIcon": "fa-eye",
    "salary": "₫40.000.000 - ₫65.000.000/mo",
    "salaryVal": 52000000,
    "location": "Hanoi, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["Generative AI", "Computer Vision", "PyTorch", "High Salary"],
    "isUrgent": true,
    "isHighSalary": true,
    "time": "2 days ago",
    "applicants": "41 applicants",
    "specs": { "exp": "Senior (4+ Yrs)", "edu": "Master / CS Degree", "dept": "AI Research Lab", "openings": "3 Positions" },
    "overview": "Train deep learning models for high-speed parcel barcode recognition, dimension measurement, and automated damage detection on conveyor belts.",
    "responsibilities": ["Develop PyTorch / TensorRT computer vision pipelines", "Optimize inference latency to <50ms."],
    "requirements": ["Strong PyTorch / OpenCV experience", "Knowledge of edge AI deployment."],
    "benefits": ["Sign-on bonus ₫50M", "Annual overseas tech conferences", "Full remote flexibility."]
  },
  {
    "id": "job-8",
    "title": "Multimodal Freight Operations Lead (Air & Sea)",
    "company": "Kuehne+Nagel Vietnam",
    "companyLogo": "images/brands/kuehne-nagel.svg",
    "companyIcon": "fa-plane-departure",
    "salary": "₫30.000.000 - ₫45.000.000/mo",
    "salaryVal": 37000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "forwarding",
    "tags": ["Global 3PL", "Air Freight", "Multimodal", "Tan Son Nhat"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "3 days ago",
    "applicants": "18 applicants",
    "specs": { "exp": "Mid-Senior (3 – 5 Yrs)", "edu": "Bachelor in Economics / Trade", "dept": "Air Cargo Services", "openings": "2 Positions" },
    "overview": "Coordinate priority air charter bookings and sea-air multimodal transit connections through ASEAN transshipment hubs.",
    "responsibilities": ["Negotiate block space agreements (BSA) with major airlines", "Manage pharmaceutical cool-chain air shipments."],
    "requirements": ["IATA Cargo introductory certification", "3+ years international airfreight experience."],
    "benefits": ["Global health insurance", "Annual performance review and bonuses", "18 days annual leave."]
  },
  {
    "id": "job-9",
    "title": "Director of Cold Chain Storage & Temperature Operations",
    "company": "SLP Vietnam Logistics",
    "companyLogo": "images/brands/slp-vietnam.svg",
    "companyIcon": "fa-snowflake",
    "salary": "₫50.000.000 - ₫80.000.000/mo",
    "salaryVal": 65000000,
    "location": "Long An & Bac Ninh (On-site)",
    "workplace": "On-site",
    "category": "tech",
    "tags": ["Executive", "Cold Storage", "GDP Standard", "Pharma"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "3 days ago",
    "applicants": "12 applicants",
    "specs": { "exp": "Director (8+ Yrs)", "edu": "BS / Master in Engineering", "dept": "Cold Storage Division", "openings": "1 Position" },
    "overview": "Direct all cold storage operations, multi-zone temperature validation (-25°C to +8°C), and automated ammonia refrigeration systems.",
    "responsibilities": ["Lead operational compliance with WHO-GDP and ISO 22000 standards", "Manage a team of 120 warehouse engineers and staff."],
    "requirements": ["8+ years cold storage operations leadership", "Familiarity with modern WMS and IoT telematics."],
    "benefits": ["Executive profit-sharing bonus", "Company car with driver", "Full family health coverage."]
  },
  {
    "id": "job-10",
    "title": "Deep-Sea Port Berth Planning Specialist",
    "company": "Gemadept Port Logistics",
    "companyLogo": "images/brands/gemadept.svg",
    "companyIcon": "fa-ship",
    "salary": "₫24.000.000 - ₫36.000.000/mo",
    "salaryVal": 30000000,
    "location": "Cai Mep - Gemalink Port, Vung Tau",
    "workplace": "On-site",
    "category": "port",
    "tags": ["Deep Sea", "Gemalink", "Berth Planning", "Maritime"],
    "isUrgent": false,
    "isHighSalary": false,
    "time": "4 days ago",
    "applicants": "24 applicants",
    "specs": { "exp": "Specialist (2 – 4 Yrs)", "edu": "Maritime Navigation / Logistics", "dept": "Port Operations", "openings": "2 Positions" },
    "overview": "Coordinate vessel berthing schedules, tide window calculations, and pilotage allocations for mega container vessels.",
    "responsibilities": ["Calculate tidal depths and draft requirements for 20,000+ TEU ships", "Liaise with maritime port authorities."],
    "requirements": ["Bachelor in Maritime Studies", "Experience with CATOS or Navis berth planning software."],
    "benefits": ["Port duty allowances", "Free housing at Cai Mep staff complex", "Yearly profit bonuses."]
  },
  // Page 3
  {
    "id": "job-11",
    "title": "Senior Logistics Backend Go & Kafka Engineer",
    "company": "Grab Vietnam Logistics Tech",
    "companyLogo": "images/brands/grab.svg",
    "companyIcon": "fa-code",
    "salary": "₫45.000.000 - ₫75.000.000/mo",
    "salaryVal": 60000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["Go", "Kafka", "High-Concurrency", "Microservices"],
    "isUrgent": true,
    "isHighSalary": true,
    "time": "4 days ago",
    "applicants": "39 applicants",
    "specs": { "exp": "Senior (4+ Yrs)", "edu": "BS / MS Computer Science", "dept": "Express Delivery Core", "openings": "2 Positions" },
    "overview": "Build low-latency dispatch and tracking microservices handling 2.5 million events per minute across Vietnam.",
    "responsibilities": ["Architect event-driven pipelines using Go and Apache Kafka", "Optimize Redis cache clusters and PostgreSQL sharding."],
    "requirements": ["Expert in Golang and distributed systems", "Experience with Kubernetes and high concurrency."],
    "benefits": ["Grab equity RSUs", "Comprehensive wellness allowance", "Top-tier MacBook Pro M3 Max."]
  },
  {
    "id": "job-12",
    "title": "Cross-Border E-Commerce Fulfillment Lead",
    "company": "Shopee Express Logistics Vietnam",
    "companyLogo": "images/brands/shopee.svg",
    "companyIcon": "fa-box-open",
    "salary": "₫28.000.000 - ₫42.000.000/mo",
    "salaryVal": 35000000,
    "location": "Binh Duong Mega MegaHub",
    "workplace": "On-site",
    "category": "robotics",
    "tags": ["E-Commerce", "Shopee", "Cross-Border", "Fulfillment"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "5 days ago",
    "applicants": "47 applicants",
    "specs": { "exp": "Supervisor (3 – 5 Yrs)", "edu": "Bachelor in Business / Logistics", "dept": "Inbound & Customs Hub", "openings": "3 Positions" },
    "overview": "Manage daily cross-docking and sorting for 800,000+ parcels arriving from regional cross-border distribution centers.",
    "responsibilities": ["Ensure 99.6% on-time sortation rate", "Supervise automated cross-belt sorting machinery."],
    "requirements": ["3+ years fulfillment hub operations leadership", "Familiarity with high-volume parcel sortation."],
    "benefits": ["Quarterly fulfillment bonuses", "Subsidized meals and transport", "Full medical insurance."]
  },
  {
    "id": "job-13",
    "title": "Warehouse Management Systems (WMS) Solutions Architect",
    "company": "BW Industrial Development JSC",
    "companyLogo": "images/brands/bw-industrial.svg",
    "companyIcon": "fa-warehouse",
    "salary": "₫35.000.000 - ₫52.000.000/mo",
    "salaryVal": 43000000,
    "location": "Binh Duong & Hai Phong (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["WMS", "Industrial Real Estate", "Solutions Architect", "Automation"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "5 days ago",
    "applicants": "15 applicants",
    "specs": { "exp": "Senior (5+ Yrs)", "edu": "BS / Master in Information Systems", "dept": "Smart Warehousing Advisory", "openings": "1 Position" },
    "overview": "Design tailored WMS and automated storage solutions (AS/RS) for multinational manufacturing tenants across BW logistics parks.",
    "responsibilities": ["Consult clients on Manhattan / Infor / SAP EWM implementations", "Draft industrial automation blueprints."],
    "requirements": ["Deep mastery of tier-1 WMS platforms", "Excellent enterprise consulting and presentation skills."],
    "benefits": ["Competitive executive bonus", "Flexible hybrid schedule", "International advisory projects."]
  },
  {
    "id": "job-14",
    "title": "Air Cargo Charter Operations & Dangerous Goods Lead",
    "company": "DB Schenker Vietnam",
    "companyLogo": "images/brands/db-schenker.svg",
    "companyIcon": "fa-plane",
    "salary": "₫32.000.000 - ₫48.000.000/mo",
    "salaryVal": 40000000,
    "location": "Hanoi (Noi Bai Airport Office)",
    "workplace": "On-site",
    "category": "forwarding",
    "tags": ["Air Cargo", "Dangerous Goods", "Noi Bai", "IATA DGR"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "6 days ago",
    "applicants": "21 applicants",
    "specs": { "exp": "Specialist (4+ Yrs)", "edu": "Aviation / Trade Degree", "dept": "Special Cargo Unit", "openings": "1 Position" },
    "overview": "Supervise full charter aircraft operations, lithium-battery cargo acceptance, and runway tarmac loading compliance at Noi Bai.",
    "responsibilities": ["Inspect Class 9 dangerous goods packages according to IATA DGR", "Direct tarmac aircraft loadmasters and ground handlers."],
    "requirements": ["Valid IATA Dangerous Goods Regulations Category 6 certification", "Experience handling full-freighter aircraft."],
    "benefits": ["Airport hazardous allowance", "Annual European training exchanges", "Full healthcare package."]
  },
  {
    "id": "job-15",
    "title": "Autonomous Heavy Trucking Dispatch Supervisor",
    "company": "Transimex Logistics Corporation",
    "companyLogo": "images/brands/transimex.svg",
    "companyIcon": "fa-truck-moving",
    "salary": "₫25.000.000 - ₫38.000.000/mo",
    "salaryVal": 31000000,
    "location": "Thu Duc City, HCMC",
    "workplace": "On-site",
    "category": "port",
    "tags": ["Trucking", "Container Drayage", "Dispatch", "Transimex"],
    "isUrgent": true,
    "isHighSalary": false,
    "time": "6 days ago",
    "applicants": "32 applicants",
    "specs": { "exp": "Supervisor (3+ Yrs)", "edu": "Transportation / Logistics Diploma", "dept": "Fleet Dispatch Center", "openings": "2 Positions" },
    "overview": "Coordinate 250+ prime movers hauling import/export containers between Cat Lai Port, ICD Song Than, and industrial zones.",
    "responsibilities": ["Dispatch trucks dynamically to minimize demurrage and gate waiting time", "Manage driver compliance and digital fuel logs."],
    "requirements": ["3+ years container trucking dispatch experience", "Familiarity with digital TMS dispatch systems."],
    "benefits": ["Monthly dispatch performance incentives", "Full social insurance and health benefits", "Year-end 13th and 14th month pay."]
  },
  // Page 4
  {
    "id": "job-16",
    "title": "Supply Chain ESG & Green Logistics Analyst",
    "company": "CJ Logistics Vietnam",
    "companyLogo": "images/brands/cj-logistics.svg",
    "companyIcon": "fa-leaf",
    "salary": "₫27.000.000 - ₫40.000.000/mo",
    "salaryVal": 33000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["ESG", "Green Logistics", "Carbon Accounting", "Sustainability"],
    "isUrgent": false,
    "isHighSalary": false,
    "time": "1 week ago",
    "applicants": "26 applicants",
    "specs": { "exp": "Analyst (2 – 4 Yrs)", "edu": "Environmental Science / Economics", "dept": "Sustainability Office", "openings": "1 Position" },
    "overview": "Measure Scope 1, 2, and 3 carbon emissions across warehousing and linehaul networks to meet EU CBAM and corporate ESG mandates.",
    "responsibilities": ["Calculate fleet carbon intensity per ton-kilometer", "Recommend route adjustments and EV fleet transitions."],
    "requirements": ["Familiarity with GHG Protocol and carbon accounting", "Strong analytical modeling skills in Python/Excel."],
    "benefits": ["Hybrid work environment", "International sustainability credentials sponsorship", "Premium health insurance."]
  },
  {
    "id": "job-17",
    "title": "Senior Procurement & Carrier Sourcing Manager",
    "company": "Sotrans Logistics Vietnam",
    "companyLogo": "images/brands/sotrans.svg",
    "companyIcon": "fa-handshake",
    "salary": "₫35.000.000 - ₫55.000.000/mo",
    "salaryVal": 45000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "forwarding",
    "tags": ["Procurement", "Carrier Sourcing", "Ocean Lines", "Sotrans"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "1 week ago",
    "applicants": "19 applicants",
    "specs": { "exp": "Manager (5+ Yrs)", "edu": "Foreign Trade / Logistics", "dept": "Global Procurement", "openings": "1 Position" },
    "overview": "Lead tender negotiations and annual service contracts with major container shipping lines and regional feeder operators.",
    "responsibilities": ["Manage ocean freight procurement budget of over $40M annually", "Benchmark carrier rates across Transpacific and Asia-Europe corridors."],
    "requirements": ["5+ years procurement in top tier freight forwarders", "Exceptional commercial negotiation skills."],
    "benefits": ["Lucrative annual performance bonus", "Global executive networking opportunities", "Flexible WFH schedule."]
  },
  {
    "id": "job-18",
    "title": "Logistics B2B EDI & API Integration Specialist",
    "company": "Viettel Post Digital Solutions",
    "companyLogo": "images/brands/viettel.svg",
    "companyIcon": "fa-network-wired",
    "salary": "₫30.000.000 - ₫45.000.000/mo",
    "salaryVal": 37000000,
    "location": "Hanoi & HCMC (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["EDI", "API Integration", "Viettel", "B2B Logistics"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "1 week ago",
    "applicants": "29 applicants",
    "specs": { "exp": "Specialist (3+ Yrs)", "edu": "Information Technology / Telecom", "dept": "Enterprise Solutions", "openings": "2 Positions" },
    "overview": "Implement EDI (EDIFACT 204/214/300) and REST API connectors integrating enterprise ERP systems with national delivery networks.",
    "responsibilities": ["Build automated data transformation pipelines", "Troubleshoot asynchronous message queues."],
    "requirements": ["Solid knowledge of EDI standards and JSON/XML REST APIs", "3+ years technical integration experience."],
    "benefits": ["Viettel Group comprehensive welfare", "Annual health checkups at Military Hospital 108", "Subsidized telecom packages."]
  },
  {
    "id": "job-19",
    "title": "Customs Brokerage Team Lead (Bonded Warehouse)",
    "company": "Hai An Transport & Stevedoring",
    "companyLogo": "images/brands/hai-an.svg",
    "companyIcon": "fa-stamp",
    "salary": "₫24.000.000 - ₫36.000.000/mo",
    "salaryVal": 30000000,
    "location": "Hai Phong (Dinh Vu Industrial Zone)",
    "workplace": "On-site",
    "category": "customs",
    "tags": ["Customs", "Bonded Warehouse", "Hai An", "Dinh Vu"],
    "isUrgent": true,
    "isHighSalary": false,
    "time": "1 week ago",
    "applicants": "23 applicants",
    "specs": { "exp": "Team Lead (4+ Yrs)", "edu": "Customs / International Business", "dept": "Bonded Customs Bureau", "openings": "1 Position" },
    "overview": "Lead a team of 8 customs declarants managing bonded warehouse inventory, import raw materials, and finished goods re-exportation.",
    "responsibilities": ["Review customs liquidation reports for export processing enterprises (EPE)", "Resolve customs audits and tariff appeals."],
    "requirements": ["Active Customs Broker License", "Experience with Hai Phong port customs sub-departments."],
    "benefits": ["Zone hazard allowance", "Company transport from Hai Phong center", "13th month salary and annual rewards."]
  },
  {
    "id": "job-20",
    "title": "Last-Mile Delivery Operations Regional Manager",
    "company": "Grab Vietnam Express Division",
    "companyLogo": "images/brands/grab.svg",
    "companyIcon": "fa-motorcycle",
    "salary": "₫35.000.000 - ₫55.000.000/mo",
    "salaryVal": 45000000,
    "location": "Ho Chi Minh City, Vietnam",
    "workplace": "On-site",
    "category": "robotics",
    "tags": ["Last-Mile", "On-Demand", "Operations Lead", "GrabExpress"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "1 week ago",
    "applicants": "38 applicants",
    "specs": { "exp": "Manager (5+ Yrs)", "edu": "Bachelor in Business / Operations", "dept": "GrabExpress Operations", "openings": "1 Position" },
    "overview": "Oversee last-mile two-wheel delivery fulfillment, driver supply balancing, and SLAs across Greater Ho Chi Minh City.",
    "responsibilities": ["Maintain 99.2% on-time pickup rate across peak lunch and evening hours", "Analyze cancellation heatmaps to allocate dynamic driver incentives."],
    "requirements": ["5+ years on-demand or courier logistics management", "Strong data-driven mindset with SQL proficiency."],
    "benefits": ["Grab competitive stock award", "Annual fitness and lifestyle allowance", "Top healthcare coverage."]
  }
];

    let currentFilter = 'all';
    let selectedJobId = enterpriseJobsDatabase[0] ? enterpriseJobsDatabase[0].id : null;

    function getFilteredJobs() {
      if (currentFilter === 'all') return enterpriseJobsDatabase;
      if (currentFilter === 'urgent') return enterpriseJobsDatabase.filter(j => j.isUrgent);
      return enterpriseJobsDatabase.filter(j => j.category === currentFilter);
    }

    function renderJobList() {
      const container = document.getElementById('jobs-list-container');
      const counterBadge = document.getElementById('job-filter-count');
      const listCounter = document.getElementById('linkedin-jobs-counter');
      const filtered = getFilteredJobs();

      if (counterBadge) counterBadge.textContent = `${filtered.length} Openings Available`;
      if (listCounter) listCounter.textContent = `${filtered.length} openings`;

      if (filtered.length === 0) {
        container.innerHTML = `<div style="padding:40px 20px; text-align:center; color:#64748B;">No openings found in this category.</div>`;
        return;
      }

      if (!filtered.some(j => j.id === selectedJobId)) {
        selectedJobId = filtered[0].id;
      }

      container.innerHTML = filtered.map(job => {
        const isSelected = job.id === selectedJobId;
        return `
          <article class="job-feed-card ${isSelected ? 'active' : ''}" onclick="selectJob('${job.id}')">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <div style="width:42px; height:42px; flex-shrink:0;">
                <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain;">
              </div>
              <div style="flex:1; min-width:0;">
                <h3 class="job-card-title">${job.title}</h3>
                <div class="job-card-company">${job.company}</div>
                <div class="job-card-location"><i class="fa-solid fa-location-dot" style="font-size:11px; margin-right:4px;"></i> ${job.location}</div>
                <div class="job-card-salary">${job.salary}</div>
                <div class="job-card-meta">
                  <span>${job.time}</span>
                  <span>•</span>
                  <span>${job.applicants}</span>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('');

      renderJobDetail(selectedJobId);
    }

    function selectJob(jobId) {
      selectedJobId = jobId;
      document.querySelectorAll('.job-feed-card').forEach(el => {
        el.classList.remove('active');
      });
      const targetCard = document.querySelector(`.job-feed-card[onclick*="${jobId}"]`);
      if (targetCard) targetCard.classList.add('active');
      renderJobDetail(jobId);
    }

    

let currentSplitJobId = 'job-2'; // Default to DHL job as in user's reference image
let currentSplitFilter = 'all';

// Render the left-hand scrollable job feed cards (Matches Picture 3, bigger logo, no easy apply)
window.renderSplitJobList = function() {
  const containers = document.querySelectorAll('.split-jobs-container, #split-jobs-list-container, #home-split-jobs-container');
  if (containers.length === 0) return;

  let filtered = enterpriseJobsDatabase;
  if (currentSplitFilter === 'urgent') {
    filtered = enterpriseJobsDatabase.filter(j => j.isUrgent);
  } else if (currentSplitFilter !== 'all') {
    filtered = enterpriseJobsDatabase.filter(j => j.category === currentSplitFilter);
  }

  document.querySelectorAll('.split-openings-badge, #splitOpeningsBadge, #job-filter-count, #linkedin-jobs-counter').forEach(el => {
    el.textContent = `${filtered.length} openings`;
  });

  const cardsHtml = filtered.map(job => {
    const isActive = job.id === currentSplitJobId;
    return `
      <div class="job-feed-card split-job-card ${isActive ? 'active' : ''}" data-job-id="${job.id}" id="feed-card-${job.id}" onclick="selectSplitJob('${job.id}');">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
          <div style="min-width:0; flex:1;">
            <div class="job-card-title split-card-title">${job.title}</div>
            <div class="job-card-company split-card-company" style="font-size:13px; color:#334155; font-weight:600; display:flex; align-items:center; gap:5px;">
              ${job.company} <i class="fa-solid fa-circle-check" style="color:#0A66C2; font-size:12px;"></i>
            </div>
            <div class="job-card-location split-card-loc" style="font-size:12px; color:#64748B; margin-top:2px;">
              <i class="fa-solid fa-location-dot" style="font-size:11px;"></i> ${job.location}
            </div>
          </div>
          <!-- Brand logo bigger just a little as requested (54px) -->
          <div class="split-card-logo-box" style="width:54px; height:54px; border:1px solid #E2E8F0; border-radius:10px; display:flex; align-items:center; justify-content:center; padding:6px; background:#fff; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain;" onerror="this.src='images/brands/vinfast.svg'">
          </div>
        </div>
        <div class="job-card-salary split-card-salary" style="font-size:13.5px; font-weight:700; color:#0A66C2; margin:6px 0 4px;">${job.salary}</div>
        <!-- Removed 'Easy Apply' as explicitly requested -->
        <div class="split-card-meta" style="display:flex; align-items:center; gap:8px; font-size:11.5px; color:#94A3B8;">
          <span>${job.time}</span>
          <span>•</span>
          <span>${job.applicants}</span>
        </div>
      </div>
    `;
  }).join('');

  containers.forEach(c => {
    c.innerHTML = cardsHtml;
  });
};

// Render the right-hand sticky job detail pane (matching Picture 3, bigger logo, no easy apply)
window.renderSplitJobDetail = function(jobId) {
  const panels = document.querySelectorAll('.split-detail-panel, #split-job-detail-panel, #home-split-detail-panel');
  if (panels.length === 0) return;

  const job = enterpriseJobsDatabase.find(j => j.id === jobId) || enterpriseJobsDatabase[0];
  if (!job) return;

  currentSplitJobId = job.id;

  const detailHtml = `
    <!-- Header Block (Border Free) -->
    <div style="padding-bottom: 20px; margin-bottom: 22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:20px;">
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="font-size:14px; font-weight:700; color:#0A66C2;">${job.company}</span>
            <i class="fa-solid fa-circle-check" style="color:#059669; font-size:13px;" title="Verified Enterprise"></i>
          </div>
          <h1 class="split-detail-title" style="font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 8px 0; line-height: 1.25;">${job.title}</h1>
          <div style="display:flex; align-items:center; gap:8px; font-size:13.5px; color:#64748B; flex-wrap:wrap; margin-bottom:14px;">
            <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
            <span>•</span>
            <span>Posted ${job.time}</span>
            <span>•</span>
            <span style="color:#059669; font-weight:600;"><i class="fa-solid fa-users"></i> ${job.applicants}</span>
          </div>

          <!-- Feature Tag Badges (No borders) -->
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px;">
            <span class="split-chip" style="background:#F1F5F9; border:none; color:#334155; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-briefcase"></i> ${job.specs ? job.specs.exp : 'Manager (5+ Yrs)'}
            </span>
            <span class="split-chip" style="background:#F1F5F9; border:none; color:#334155; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-building"></i> 1,001 - 5,000 employees
            </span>
            <span class="split-chip split-chip-salary" style="background:#EFF6FF; border:none; color:#0A66C2; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-money-bill-wave"></i> ${job.salary}
            </span>
            <span class="split-chip split-chip-match" style="background:#ECFDF5; border:none; color:#059669; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-circle-check"></i> Skills match your profile
            </span>
          </div>
        </div>
        <!-- Detail Brand Logo (No border) -->
        <div class="split-detail-logo-box" style="width:76px; height:76px; border:none; border-radius:12px; display:flex; align-items:center; justify-content:center; padding:8px; background:#F8FAFC; flex-shrink:0;">
          <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain;" onerror="this.src='images/brands/vinfast.svg'">
        </div>
      </div>

      <!-- Action Buttons Row (NO borders) -->
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <button type="button" class="btn-split-apply" onclick="openJobDetail('${job.id}');" style="background:#0A66C2; color:#fff; border:none; padding:11px 26px; border-radius:8px; font-weight:700; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(10,102,194,0.28); transition:all 0.2s;">
          <i class="fa-solid fa-paper-plane"></i> Ứng Tuyển Với CV
        </button>
        <button type="button" class="btn-split-save" onclick="this.innerHTML='<i class=\'fa-solid fa-bookmark\'></i> Saved'; this.style.color='#0A66C2'; this.style.background='#EFF6FF'; if(typeof showToast==='function') showToast('Đã lưu công việc');" style="background:#F1F5F9; border:none; color:#334155; padding:11px 18px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          <i class="fa-regular fa-bookmark"></i> Save
        </button>
        <button type="button" class="btn-split-share" onclick="if(typeof showToast==='function') showToast('Đã sao chép liên kết công việc');" title="Chia sẻ" style="background:#F1F5F9; border:none; color:#334155; width:42px; height:42px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; font-size:15px;">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
      </div>
    </div>

    <!-- About The Job -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">About the job</h3>
      <p style="font-size: 14.5px; color: #334155; line-height: 1.65; margin: 0;">${job.overview}</p>
    </div>

    <!-- Key Responsibilities -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; text-transform:uppercase; letter-spacing:0.05em;">KEY RESPONSIBILITIES</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.7;">
        ${(job.responsibilities || []).map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
      </ul>
    </div>

    <!-- Qualifications -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; text-transform:uppercase; letter-spacing:0.05em;">QUALIFICATIONS &amp; REQUIREMENTS</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.7;">
        ${(job.requirements || []).map(rq => `<li style="margin-bottom: 8px;">${rq}</li>`).join('')}
      </ul>
    </div>

    <!-- Benefits -->
    <div style="margin-bottom: 26px;">
      <h3 style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; text-transform:uppercase; letter-spacing:0.05em;">BENEFITS &amp; COMPENSATION</h3>
      <ul style="margin: 0; padding-left: 0; list-style:none; font-size: 14px; color: #475569; line-height: 1.7;">
        ${(job.benefits || []).map(b => `<li style="margin-bottom: 8px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-circle-check" style="color:#059669; font-size:14px; flex-shrink:0;"></i> <span>${b}</span></li>`).join('')}
      </ul>
    </div>

    <!-- Company Badge Footer (NO borders) -->
    <div style="padding-top: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; padding:16px 20px; border-radius:12px; border:none;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:48px; height:48px; flex-shrink:0;">
            <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain;" onerror="this.src='images/brands/vinfast.svg'">
          </div>
          <div>
            <div style="font-weight:800; font-size:15px; color:#0F172A;">${job.company}</div>
            <div style="font-size:12.5px; color:#64748B;">Accredited Enterprise Logistics Hiring Partner</div>
          </div>
        </div>
        <button type="button" onclick="this.textContent = 'Following'; this.style.background='#0F172A'; this.style.color='#fff';" style="background:#E2E8F0; border:none; color:#0F172A; padding:8px 18px; border-radius:20px; font-size:13px; font-weight:700; cursor:pointer;">
          + Follow
        </button>
      </div>
    </div>
  `;

  panels.forEach(p => {
    p.innerHTML = detailHtml;
  });

  document.querySelectorAll('.split-job-card, .job-feed-card').forEach(card => {
    if (card.getAttribute('data-job-id') === job.id || card.id === `feed-card-${job.id}`) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
};

// Select a job in the split-view
window.selectSplitJob = function(jobId) {
  renderSplitJobDetail(jobId);
};

// Filter split jobs by chip category
window.filterSplitJobs = function(category, btn) {
  currentSplitFilter = category;
  document.querySelectorAll('.job-chip-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSplitJobList();

  let filtered = enterpriseJobsDatabase;
  if (currentSplitFilter === 'urgent') filtered = enterpriseJobsDatabase.filter(j => j.isUrgent);
  else if (currentSplitFilter !== 'all') filtered = enterpriseJobsDatabase.filter(j => j.category === currentSplitFilter);
  if (filtered.length > 0) {
    renderSplitJobDetail(filtered[0].id);
  }
};

window.setSplitFilter = function(btn, filterKey) {
  document.querySelectorAll('.job-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  currentSplitFilter = filterKey;
  renderSplitJobList();
  renderSplitJobDetail(currentSplitJobId);
};

// Open the Split-View Screen from Homepage or Any Link
window.openJobDetailSplit = function(jobId) {
  currentSplitJobId = jobId || 'job-2';
  renderSplitJobList();
  renderSplitJobDetail(currentSplitJobId);
};

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderSplitJobList();
  renderSplitJobDetail(currentSplitJobId);
});

window.scrollToAbout = function() {
  var homeView = document.getElementById('view-home');
  var isHomeActive = homeView && homeView.classList.contains('active-view');

  if (!isHomeActive && typeof switchView === 'function') {
    switchView('home');
  }

  setTimeout(function() {
    var el = document.getElementById('about');
    if (el) {
      var top = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }, isHomeActive ? 10 : 250);
};


  // FreightWaves search toggle
  const fwSearchToggle = document.getElementById('searchToggle');
  const fwSearchPanel = document.getElementById('searchPanel');
  if (fwSearchToggle && fwSearchPanel) {
    fwSearchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isOpen = fwSearchPanel.classList.toggle('open');
      fwSearchToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        fwSearchPanel.querySelector('input')?.focus();
      }
    });
  }


/* ==========================================================================
   FREIGHTWAVES INTERACTIVE & RESPONSIVE EVENT DELEGATION
   Prevents dead href="#" resets and provides rich article interactions
   ========================================================================== */
function initFreightWavesInteractivity() {
  const hub = document.getElementById('lw-hub-overview');
  if (!hub || hub.dataset.interactiveBound === 'true') return;
  hub.dataset.interactiveBound = 'true';

  // 1. Delegated click handler on the entire FreightWaves media hub
  hub.addEventListener('click', function(e) {
    const target = e.target;
    
    // Prevent dead href="#" links from resetting URL to / or jumping to top
    const anchor = target.closest('a');
    if (anchor && (anchor.getAttribute('href') === '#' || !anchor.getAttribute('href'))) {
      e.preventDefault();
    }

    // Brand navigation links scrolling
    const brandLink = target.closest('.brand-link');
    if (brandLink) {
      e.preventDefault();
      if (brandLink.classList.contains('b-fw')) {
        hub.scrollIntoView({ behavior: 'smooth' });
      } else if (brandLink.classList.contains('b-modern')) {
        const el = document.getElementById('modern-title') || document.getElementById('top-stories-title');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (brandLink.classList.contains('b-amship')) {
        const el = document.getElementById('amship-title') || document.getElementById('top-stories-title');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (brandLink.classList.contains('b-sonar')) {
        if (typeof showToast === 'function') showToast('SONAR: Dữ liệu phân tích logistics & giá cước vận tải thời gian thực');
      } else if (brandLink.classList.contains('b-trains')) {
        document.getElementById('cdl-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (brandLink.classList.contains('b-playbook')) {
        document.querySelector('.nav-cards')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (brandLink.classList.contains('b-postal')) {
        document.getElementById('mont-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (brandLink.classList.contains('b-forums')) {
        if (typeof showToast === 'function') showToast('FreightWaves Community: Diễn đàn Logistics & Vận Tải Quốc Tế');
      }
      return;
    }

    // Secondary subnav links scrolling
    const subnavLink = target.closest('.subnav-item > a');
    if (subnavLink) {
      e.preventDefault();
      const txt = subnavLink.textContent.trim().toLowerCase();
      if (txt.includes('news')) {
        document.getElementById('top-stories-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (txt.includes('market') || txt.includes('data')) {
        document.getElementById('chart-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (txt.includes('sonar')) {
        document.getElementById('sonar-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (txt.includes('media')) {
        document.getElementById('fw-today-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (txt.includes('events')) {
        if (typeof showToast === 'function') showToast('Sự kiện: Hội nghị Thượng đỉnh Chuỗi Cung Ứng & Vận Tải Quốc Tế 2026');
      } else if (txt.includes('awards')) {
        document.getElementById('mont-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (txt.includes('resources')) {
        document.querySelector('.shipper-cols')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

        // Article cards click handler -> opens reader view with dynamic data
    const card = target.closest('.feature-card, .mini, .video-card, .card, .sonar-article, .sonar-list-item, .more-sonar-card, .chart-feature, .chart-minis .mini, .shipper-lead, .shipper-item, article');
    if (card) {
      e.preventDefault();
      const titleEl = card.querySelector('h3, h4, .title, a');
      const title = titleEl ? titleEl.textContent.trim() : 'Bản Tin Thị Trường & Logistics Intelligence';
      const catEl = card.querySelector('.cat, .kicker, .sub-tag');
      const cat = catEl ? catEl.textContent.trim() : 'LOGISTICS WAVES';
      const imgEl = card.querySelector('img');
      const heroImg = imgEl && imgEl.src && !imgEl.src.startsWith('data:image/svg') ? imgEl.src : 'images/editorial_ai_logistics_hd.jpg';

      // Check if title matches any entry in articlesDatabase
      let matched = (typeof articlesDatabase !== 'undefined') ? articlesDatabase.find(a => 
        a.title.toLowerCase() === title.toLowerCase() || 
        title.toLowerCase().includes(a.title.toLowerCase()) || 
        a.title.toLowerCase().includes(title.toLowerCase())
      ) : null;

      if (matched) {
        window.openArticle(matched.id, true);
      } else {
        const slug = 'art-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 40);
        const storyObj = {
          id: slug,
          tag: cat.toUpperCase(),
          sec: cat,
          title: title,
          author: 'FreightWaves Market Intelligence',
          location: 'Washington / Ho Chi Minh City',
          date: 'Published 06 November 2026',
          heroImg: heroImg,
          caption: title + ' — Báo cáo độc quyền từ FreightWaves & VietnamJobs Market Intelligence.',
          listenMeta: '3 mins • AI voice',
          lead: title + ': Phân tích chuyên sâu về dữ liệu thị trường vận tải, chuỗi cung ứng quốc tế và biến động chi phí logistics thời gian thực.',
          paragraphs: [
            'Theo thống kê mới nhất từ hệ thống giám sát tần suất cao SONAR và các cảng biển trung chuyển lớn, hoạt động vận tải hàng hóa đang ghi nhận sự dịch chuyển đáng kể trong biểu cước và năng lực xử lý bãi container.',
            'Các doanh nghiệp logistics lớn đang đẩy nhanh việc ứng dụng trí tuệ nhân tạo vào hệ thống điều phối đội xe và tự động hóa chứng từ hải quan, giúp rút ngắn 35% thời gian quay vòng phương tiện.',
            'Dữ liệu thời gian thực phản ánh nhu cầu tuyển dụng các vị trí Quản lý Chuỗi cung ứng, Chuyên viên Điều vận Cảng và Kỹ sư Phần mềm Logistics đang tăng trưởng mạnh mẽ trên toàn quốc.'
          ]
        };
        window.openArticle(storyObj, true);
      }
      return;
    }
  });

  // 2. Touch swipe gestures for FreightWaves Today video carousel
  const carousel = document.getElementById('videoCarousel');
  const track = document.getElementById('carouselTrack');
  if (carousel && track) {
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    carousel.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        isSwiping = true;
      }
    }, { passive: true });

    carousel.addEventListener('touchmove', function(e) {
      if (!isSwiping || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', function() {
      if (!isSwiping) return;
      isSwiping = false;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          document.getElementById('carNext')?.click();
        } else {
          document.getElementById('carPrev')?.click();
        }
      }
    }, { passive: true });
  }
}

// Open and hydrate any FreightWaves story dynamically
// Open and hydrate any FreightWaves story dynamically
function openDynamicFreightWavesStory(title, tag, heroImg) {
  if (typeof window.openArticle === 'function') {
    const slug = 'art-' + (title || 'news').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 40);
    window.openArticle({
      id: slug,
      tag: (tag || 'LOGISTICS WAVES').toUpperCase(),
      sec: tag || 'Market Intelligence',
      title: title || 'Bản Tin Thị Trường Logistics',
      author: 'FreightWaves Market Intelligence',
      location: 'Washington / Ho Chi Minh City',
      date: 'Published 06 November 2026',
      heroImg: heroImg || 'images/editorial_ai_logistics_hd.jpg',
      caption: (title || '') + ' — Báo cáo từ FreightWaves & VietnamJobs.',
      listenMeta: '3 mins • AI voice',
      lead: (title || '') + ': Phân tích chuyên sâu về dữ liệu thị trường vận tải và chuỗi cung ứng.',
      paragraphs: [
        'Theo thống kê mới nhất từ hệ thống giám sát tần suất cao SONAR, thị trường vận tải hàng hóa đang ghi nhận sự dịch chuyển đáng kể.',
        'Các doanh nghiệp logistics lớn đang đẩy nhanh ứng dụng trí tuệ nhân tạo vào hệ thống điều phối và tự động hóa chứng từ hải quan.',
        'Dữ liệu phản ánh nhu cầu tuyển dụng chuyên môn cao trong ngành logistics tiếp tục tăng trưởng mạnh.'
      ]
    }, true);
  }
}

