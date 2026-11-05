/* ==========================================================================
   VIETNAM RECRUITMENT MARKETPLACE - APP LOGIC & SPA CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  handleUrlRouting();

  // Listen to browser forward/back & hash change
  window.addEventListener('hashchange', handleUrlRouting);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.show, .modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });


  /* ==========================================================================
     SPA VIEW SWITCHER & NAVIGATION
     ========================================================================== */
  
  function openEnterpriseModal(type) {
    showToast(`🏢 Feature for ${type || 'Employers'} - Contact: hr@vietnamjobs.vn`);
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

  window.switchView = switchView;
  function switchView(viewId, updateHash = true) {
    if (viewId === 'jobs') viewId = 'browse';
    window.state = state;
    state.currentView = viewId;

    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    const activeEl = document.getElementById(`view-${viewId}`);
    if (activeEl) {
      void activeEl.offsetWidth; // Trigger reflow for fresh entrance animation
      activeEl.classList.add('active-view');
    }

    // Sync Top Tier-2 Brand Nav Items
    document.querySelectorAll('.brand-nav-item').forEach(btn => {
      const bView = btn.getAttribute('data-view');
      if (bView === viewId || 
          (bView === 'jobs' && viewId === 'browse') || 
          (bView === 'browse' && viewId === 'browse') ||
          (bView === 'companies' && (viewId === 'companies' || viewId === 'company-detail')) ||
          (bView === 'courses' && (viewId === 'courses' || viewId === 'course-detail'))) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sync Mobile Drawer Items
    document.querySelectorAll('.drawer-item').forEach(btn => {
      const bView = btn.getAttribute('data-view');
      if (bView === viewId || 
          (bView === 'jobs' && viewId === 'browse') || 
          (bView === 'browse' && viewId === 'browse') ||
          (bView === 'companies' && (viewId === 'companies' || viewId === 'company-detail')) ||
          (bView === 'courses' && (viewId === 'courses' || viewId === 'course-detail'))) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (updateHash && viewId !== 'job-detail' && viewId !== 'company-detail' && viewId !== 'course-detail') {
      history.replaceState(null, null, ' ');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'browse') renderBrowseProjects();
    if (viewId === 'companies' && typeof filterCompanies === 'function') filterCompanies();
  }

  /* ==========================================================================
     URL ROUTING (SUPPORT DIRECT LINK WITH JOB ID)
     ========================================================================== */
  function handleUrlRouting() {
    const hash = window.location.hash || '';
    const urlParams = new URLSearchParams(window.location.search);

    // 1. Company Detail Route
    if (hash.includes('company?id=') || urlParams.get('slug')) {
      const match = hash.match(/company\?id=([^&]+)/);
      const companyId = match ? decodeURIComponent(match[1]) : (urlParams.get('slug') || urlParams.get('id'));
      if (companyId && typeof showCompanyDetail === 'function') {
        showCompanyDetail(companyId);
        return;
      }
    }

    // 2. Course Detail Route
    if (hash.includes('course?id=')) {
      const match = hash.match(/course\?id=([^&]+)/);
      const courseId = match ? decodeURIComponent(match[1]) : urlParams.get('id');
      if (courseId && typeof showCourseDetail === 'function') {
        showCourseDetail(courseId);
        return;
      }
    }

    // 3. Job Detail Route
    let jobId = urlParams.get('id');
    if (!jobId && hash.includes('job?id=')) {
      const match = hash.match(/job\?id=([^&]+)/);
      if (match) jobId = decodeURIComponent(match[1]);
    } else if (!jobId && hash.includes('id=') && !hash.includes('company') && !hash.includes('course')) {
      const match = hash.match(/id=([^&]+)/);
      if (match) jobId = decodeURIComponent(match[1]);
    }

    if (jobId) {
      showJobDetail(jobId, false);
      return;
    }

    // 4. View Routes
    if (hash === '#companies') switchView('companies');
    else if (hash === '#courses') switchView('courses');
    else if (hash === '#news') switchView('news');
    else if (hash === '#jobs' || hash === '#browse') switchView('browse');
  }

  /* ==========================================================================
     JOB DETAIL PAGE WITH ID (#view-job-detail)
     ========================================================================== */
  function initJobDetailPage() {
    document.getElementById('btn-back-to-jobs-feed')?.addEventListener('click', () => {
      switchView('home');
    });

    document.getElementById('btn-copy-job-id')?.addEventListener('click', () => {
      if (state.selectedProject) {
        navigator.clipboard?.writeText(state.selectedProject.id);
        showToast(`📋 Copied Job ID: ${state.selectedProject.id}`);
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
        btn.innerHTML = '<i class=\"fa-regular fa-bookmark\"></i> Save Job';
        showToast('Job removed from your saved list');
      } else {
        state.savedJobs.add(prjId);
        btn.classList.add('saved');
        btn.innerHTML = '<i class=\"fa-solid fa-bookmark bookmark-pop\" style=\"color:#0a66c2;\"></i> Saved';
        showToast('❤️ Job saved to your favorites!');
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
      showToast(`🔗 Copied job detail URL for ${state.selectedProject.id}!`);
    });
  }

  function showJobDetail(projectId, updateHash = true) {
    const p = state.projects.find(x => x.id === projectId) || 
              initialProjects.find(x => x.id === projectId) || 
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
    if (compEl) compEl.textContent = p.company || p.clientName || 'Accredited Employer';
    
    const logoText = p.logoType || (p.company || p.clientName || 'VN').substring(0, 3).toUpperCase();
    const logoUrl = resolveBrandLogo(p);
    
    if (logoEl) {
      logoEl.innerHTML = `<img src="${logoUrl}" alt="${logoText}" class="card-brand-logo" style="width:54px;height:54px;object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="card-brand-fallback" style="display:none;width:54px;height:54px;font-size:16px;">${logoText}</span>`;
    }

    if (locEl) locEl.innerHTML = `<i class="fa-solid fa-location-dot" style="color:var(--fl-primary);"></i> ${p.location || 'Hanoi & Ho Chi Minh City'}`;
    if (worktypeEl) worktypeEl.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${p.workType || p.type || 'Full-Time'}`;
    if (postedTimeEl) postedTimeEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${p.postedDate || p.timeAgo || 'Recently posted'}`;

    const salaryVal = p.salaryDisplay || (p.budgetMin ? (`${p.budgetMin} - ${p.budgetMax} USD`) : '$1,400 - $2,400 / mo');
    if (salaryEl) salaryEl.textContent = salaryVal;

    if (saveBtn) {
      if (state.savedJobs.has(p.id)) {
        saveBtn.innerHTML = '<i class=\"fa-solid fa-bookmark\" style=\"color:#0a66c2;\"></i> Saved';
      } else {
        saveBtn.innerHTML = '<i class=\"fa-regular fa-bookmark\"></i> Save Job';
      }
    }

    // Main Description & Requirements
    const descEl = document.getElementById('detail-description-text');
    if (descEl) {
      descEl.innerHTML = `
        <p style="margin-bottom:12px;">${p.description || 'Lead the architecture, development, and end-to-end execution of enterprise systems and supply chain solutions.'}</p>
        <p style="margin-bottom:12px;"><strong>Key Responsibilities:</strong></p>
        <ul style="list-style:disc; padding-left:20px; line-height:1.7; color:var(--fl-text-body);">
          <li>Analyze business requirements and architect robust, scalable system modules.</li>
          <li>Develop, optimize database query performance, and ensure strict security protocols.</li>
          <li>Collaborate with Product Managers, QA, and Tech Leads for sprint deliverables.</li>
          <li>Author technical architecture documentation, runbooks, and handover standards.</li>
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
    if (sideCompName) sideCompName.textContent = p.company || p.clientName || 'Accredited Employer';
    if (sideRating) sideRating.textContent = `${p.clientRating || 5.0} / 5.0 (${p.clientReviews || 84} reviews)`;
    if (sideHireRate) sideHireRate.textContent = p.clientHireRate || '98%';
    if (sideSince) sideSince.textContent = p.clientMemberSince || 'Since 2018';

    if (sideId) sideId.textContent = p.id;
    if (sideSalary) sideSalary.textContent = salaryVal;
    if (sideLoc) sideLoc.textContent = p.location || 'Hanoi & Ho Chi Minh City';
    if (sideWorktype) sideWorktype.textContent = p.workType || p.type || 'Full-Time';
    if (sideDeadline) sideDeadline.textContent = p.timeLeft || '15 days left';

    // Switch View & Update Hash
    switchView('job-detail', false);

    if (updateHash) {
      window.location.hash = `job?id=${encodeURIComponent(p.id)}`;
    }
  }

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
        showToast(`🔍 Searching for: ${kw}`);
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
            showToast('Job removed from your saved list');
          } else {
            state.savedJobs.add(prjId);
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            showToast('❤️ Job saved to your favorites!');
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
        showToast(`🔍 Showing verified jobs at ${compName}`);
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
      filtered = filtered.filter(p => (p.location && p.location.toLowerCase().includes('remote')) || (p.workType && p.workType.toLowerCase().includes('linh hoat')));
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
          <h4 style="font-size:16px; font-weight:700; color:var(--fl-text-heading); margin-bottom:6px;">No matching jobs found</h4>
          <p style="font-size:13.5px; color:var(--fl-text-muted);">Try adjusting your search keywords or clear filters to see all available jobs.</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(p => {
      const isSaved = state.savedJobs.has(p.id);
      const isPromoted = p.featured || p.hot;
      const initial = p.logoType || (p.company ? p.company.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() : 'VJ');
      const logoUrl = resolveBrandLogo(p);
      const salaryText = p.salaryDisplay || (p.budgetMin ? `${p.budgetMin} - ${p.budgetMax} USD` : 'Competitive');
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
                <span class="badge-hot-tag"><i class="fa-solid fa-fire"></i> HOT</span>
                <span class="badge-new-yellow">NEW</span>
                ${p.top100 !== false ? '<span class="badge-top100-star"><i class="fa-solid fa-star"></i> TOP 100</span>' : ''}
              </div>

              <div class="career-company-row">
                <span class="company-name-bold">${p.company || p.clientName || 'Animalz Technologies'}</span>
                <i class="fa-solid fa-circle-check career-verified-check" title="Verified Enterprise"></i>
                <span class="career-meta-sep">&bull;</span>
                <span class="career-location-text"><i class="fa-solid fa-location-dot" style="color:var(--fl-primary); font-size:12px;"></i> ${p.location || 'Hanoi & Ho Chi Minh City'}</span>
                <span class="career-meta-sep">&bull;</span>
                <span class="career-workmode-badge"><i class="fa-solid fa-briefcase" style="font-size:11px;"></i> ${p.workType || 'Full-Time'}</span>
              </div>

              <div class="career-pills-row">
                ${p.boosted !== false ? '<span class="pill-tag-boosted"><i class="fa-solid fa-rocket"></i> Boosted</span>' : ''}
                ${p.featured ? '<span class="pill-tag-featured"><i class="fa-solid fa-crown"></i> Featured</span>' : ''}
                <span class="pill-tag-white"><i class="fa-solid fa-shield"></i> 100% Verified</span>
                <span class="pill-tag-white"><i class="fa-solid fa-circle-check" style="color:var(--fl-primary);"></i> Urgent</span>
              </div>

              <div class="career-live-meta">
                <span><i class="fa-regular fa-clock"></i> ${p.postedDate || p.timeAgo || '2 gio truoc'}</span>
                <span class="career-meta-sep">&bull;</span>
                <span><i class="fa-solid fa-users" style="color:var(--fl-primary);"></i> <strong>${applicantCount}</strong> applicants</span>
                <span class="career-meta-sep">&bull;</span>
                <span style="color:var(--fl-text-muted); font-size:11.5px;"><i class="fa-solid fa-hashtag"></i> ${p.id}</span>
              </div>
            </div>
          </div>

          <div class="career-card-right-section">
            <div class="career-salary-box">
              <div class="career-salary-text">${salaryText}</div>
              <div class="career-salary-subbadge"><i class="fa-solid fa-circle-dollar-to-slot"></i> Competitive Salary</div>
            </div>

            <div class="career-action-buttons-group">
              <button class="btn-save-pill ${isSaved ? 'saved' : ''}" title="Save Job" data-action="save">
                <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}
              </button>
              <button class="btn-apply-prominent" data-action="view-detail">
                View Job <i class="fa-solid fa-arrow-right"></i>
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
            showToast('Job removed from your saved list');
          } else {
            state.savedJobs.add(prjId);
            showToast('❤️ Job saved to your favorites!');
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
      showToast('🔍 Filters applied successfully!');
    });

    document.getElementById('btn-reset-browse-filters')?.addEventListener('click', () => {
      document.querySelectorAll('.browse-cat-filter, .browse-type-filter, .browse-loc-filter').forEach(cb => {
        cb.checked = false;
      });
      const sortSelect = document.getElementById('browse-sort-select');
      if (sortSelect) sortSelect.value = 'newest';
      updateActiveBadge();
      renderBrowseProjects();
      showToast('🔄 Search filters have been reset');
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
    const locMap = { 'hcm': ['hcm', 'ho chi minh', 'hcmc', 'saigon'], 'hanoi': ['hanoi', 'ha noi'], 'danang': ['danang', 'da nang'], 'bacninh': ['bac ninh', 'bacninh'] };
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
      browseFeed.innerHTML = `<div style="background:#fff;border:1px solid var(--fl-border);border-radius:var(--radius-lg);padding:40px;text-align:center;"><i class="fa-solid fa-folder-open" style="font-size:36px;color:var(--fl-text-light);"></i><h4 style="margin-top:12px;font-size:16px;color:var(--fl-text-heading);">No matching jobs found</h4></div>`;
      return;
    }

    browseFeed.innerHTML = projects.map(p => {
      const isSaved = state.savedJobs.has(p.id);
      const initial = p.logoType || (p.company ? p.company.substring(0, 2).toUpperCase() : 'VJ');
      const logoUrl = resolveBrandLogo(p);
      const salaryText = p.salaryDisplay || (p.budgetMin ? `${p.budgetMin} - ${p.budgetMax} USD` : 'Competitive');

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
                <span class="badge-hot-tag"><i class="fa-solid fa-fire"></i> HOT</span>
              </div>

              <div class="career-company-row">
                <span class="company-name-bold">${p.company || p.clientName || 'Enterprise Employer'}</span>
                <i class="fa-solid fa-circle-check career-verified-check"></i>
                <span class="career-meta-sep">&bull;</span>
                <span class="career-location-text"><i class="fa-solid fa-location-dot" style="color:var(--fl-primary);"></i> ${p.location || 'Hanoi & Ho Chi Minh City'}</span>
              </div>

              <p style="font-size:13px; color:var(--fl-text-body); margin-top:4px; line-height:1.4;">
                ${p.description ? p.description.substring(0, 140) + '...' : 'Seeking qualified specialists to join high-impact enterprise teams.'}
              </p>
            </div>
          </div>

          <div class="career-card-right-section">
            <div class="career-salary-box">
              <div class="career-salary-text">${salaryText}</div>
            </div>

            <div class="career-action-buttons-group">
              <button class="btn-apply-prominent" data-action="view-detail">
                View Job <i class="fa-solid fa-arrow-right"></i>
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
      showToast(`📄 CV attachment added: ${file.name}`);
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('qa-input-name')?.value || 'Candidate';
      const jobTitle = document.getElementById('quick-apply-job-title')?.textContent || 'Position';

      closeModal();
      form.reset();
      state.attachedCVFile = null;
      if (previewBox) previewBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';

      showToast(`🎉 Successfully applied for \"${jobTitle}\"! Employer will review your application.`);
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
        <span>${p.company || p.clientName || 'Enterprise Employer'}</span>
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
      const minBudget = document.getElementById('wiz-min-budget').value || '$1,000';
      const maxBudget = document.getElementById('wiz-max-budget').value || '$2,500';

      const newPrj = {
        id: `prj-${Date.now()}`,
        title,
        company,
        location,
        salaryDisplay: `${minBudget} - ${maxBudget}`,
        hot: true,
        postedDate: 'Just now',
        timeAgo: 'Just now',
        applicantsCount: 0,
        logoType: company.substring(0, 3).toUpperCase(),
        description: desc,
        clientVerified: true
      };

      state.projects.unshift(newPrj);
      closeModal();
      form.reset();
      renderHomeFeaturedProjects();
      showToast('🎉 Job posted successfully! It is now live on the jobs board.');
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

    const guestGroup = document.getElementById('header-auth-guest');
    const userProfile = document.getElementById('header-user-profile');
    const userAvatarEl = document.getElementById('header-user-avatar');
    const userNameEl = document.getElementById('header-user-name');
    const dropNameEl = document.getElementById('dropdown-user-name');
    const dropEmailEl = document.getElementById('dropdown-user-email');
    const dropRoleEl = document.getElementById('dropdown-user-role');
    const userMenuTrigger = document.getElementById('btn-user-profile-menu');
    const userDropdown = document.getElementById('user-dropdown-menu');
    const logoutBtn = document.getElementById('btn-user-logout');

    const openModal = (tab = 'signin') => {
      if (tab === 'signup') {
        tabSignUp?.click();
      } else {
        tabSignIn?.click();
      }
      modal?.classList.add('show');
    };

    const closeModal = () => modal?.classList.remove('show');

    // Header Trigger Buttons
    document.getElementById('btn-header-signin')?.addEventListener('click', () => openModal('signin'));
    document.getElementById('btn-header-signup')?.addEventListener('click', () => openModal('signup'));
    document.getElementById('btn-open-auth-modal-mobile')?.addEventListener('click', () => openModal('signin'));
    closeBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
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

    // User Dropdown Toggle
    userMenuTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown?.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      userDropdown?.classList.remove('show');
    });

    // Render Logged-In User UI
    function renderUserAuthUI(user) {
      if (!user) {
        if (guestGroup) guestGroup.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        return;
      }

      if (guestGroup) guestGroup.style.display = 'none';
      if (userProfile) userProfile.style.display = 'inline-block';

      const initials = (user.name || 'User').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      if (userAvatarEl) userAvatarEl.textContent = initials;
      if (userNameEl) userNameEl.textContent = user.name || 'Candidate';
      if (dropNameEl) dropNameEl.textContent = user.name || 'Candidate';
      if (dropEmailEl) dropEmailEl.textContent = user.email || 'user@vietnamjobs.vn';
      if (dropRoleEl) dropRoleEl.textContent = user.role === 'Employer' ? '🏢 Employer Admin' : '⭐ Verified Candidate';

      // Update menu saved count
      const menuSaved = document.getElementById('menu-saved-count');
      if (menuSaved) menuSaved.textContent = state.savedJobs.size;
    }

    // Check Local Storage on Boot
    const savedUserJson = localStorage.getItem('vietnamjobs_auth_user');
    if (savedUserJson) {
      try {
        const user = JSON.parse(savedUserJson);
        renderUserAuthUI(user);
      } catch (e) {}
    }

    // Sign In Submission
    formSignIn?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email')?.value?.trim();
      const pass = document.getElementById('signin-password')?.value;

      if (!email || !pass) {
        showToast('⚠️ Please enter both email and password!');
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
      closeModal();
      showToast(`🎉 Welcome back, ${user.name}! Logged in successfully.`);
    });

    // 1-Click Demo Login
    document.getElementById('btn-quick-demo-login')?.addEventListener('click', () => {
      const demoUser = {
        name: 'Thean Le',
        email: 'thean.le@vietnamjobs.vn',
        role: 'Candidate',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(demoUser));
      renderUserAuthUI(demoUser);
      closeModal();
      showToast('⚡ Quick login as demo candidate (Thean Le)!');
    });

    // Sign Up Submission
    formSignUp?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value?.trim();
      const email = document.getElementById('signup-email')?.value?.trim();
      const phone = document.getElementById('signup-phone')?.value?.trim();
      const role = document.getElementById('signup-role')?.value || 'Candidate';
      const password = document.getElementById('signup-password')?.value;

      if (!name || !email || !password) {
        showToast('⚠️ Please complete all required fields (*)');
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
      closeModal();
      showToast(`🎊 Congratulations ${name}! Account created successfully.`);
    });

    // Logout
    logoutBtn?.addEventListener('click', () => {
      localStorage.removeItem('vietnamjobs_auth_user');
      renderUserAuthUI(null);
      userDropdown?.classList.remove('show');
      showToast('👋 You have been logged out successfully.');
    });

    // Dropdown shortcuts
    document.getElementById('dropdown-btn-saved')?.addEventListener('click', () => {
      userDropdown?.classList.remove('show');
      const savedPill = document.querySelector('[data-quick-filter="saved"]');
      savedPill?.click();
      document.getElementById('projects-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('dropdown-btn-applied')?.addEventListener('click', () => {
      userDropdown?.classList.remove('show');
      showToast('📄 You have 1 active job application in review.');
    });

    document.getElementById('dropdown-btn-post-job')?.addEventListener('click', () => {
      userDropdown?.classList.remove('show');
      openWizardModal();
    });

    document.getElementById('link-forgot-pass')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📩 Please contact support@vietnamjobs.vn to reset your password.');
    });
  }

  /* ==========================================================================
     FREELANCERS & CANDIDATES DIRECTORY
     ========================================================================== */
  function initFreelancersDirectory() {
    const grid = document.getElementById('freelancers-grid');
    if (!grid) return;

    grid.innerHTML = state.freelancers.map(f => {
      const skillsHtml = (f.skills || []).map(s => `<span class="detail-skill-pill" style="font-size:11.5px; padding:3px 10px;"><i class="fa-solid fa-check"></i> ${s}</span>`).join('');
      const avatarImg = f.photoUrl ? `<img src="${f.photoUrl}" alt="${f.name}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:var(--shadow-sm);" />` : `<div style="width:52px; height:52px; border-radius:50%; background:var(--fl-primary-light); color:var(--fl-primary); font-weight:800; display:flex; align-items:center; justify-content:center; font-size:16px;">${f.avatarText}</div>`;

      return `
        <div class="career-job-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:22px; cursor:default;">
          <div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:14px;">
                ${avatarImg}
                <div>
                  <h3 style="font-size:16px; font-weight:800; color:var(--fl-text-heading); margin-bottom:2px; display:flex; align-items:center; gap:6px;">
                    ${f.name}
                    <i class="fa-solid fa-circle-check" style="color:var(--fl-primary); font-size:13px;" title="Verified Candidate"></i>
                  </h3>
                  <div style="font-size:13px; color:var(--fl-primary); font-weight:600;">${f.title}</div>
                  <div style="font-size:12px; color:var(--fl-text-light); margin-top:2px;">
                    <i class="fa-solid fa-location-dot"></i> ${f.country} &bull; <i class="fa-solid fa-star" style="color:#eab308;"></i> ${f.rating} (${f.reviewsCount} reviews)
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
              <i class="fa-solid fa-paper-plane"></i> Invite to Interview
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
        showToast(`✉️ Interview invitation sent to ${name}! We will notify you once they accept.`);
      });
    });

    grid.querySelectorAll('[data-view-profile]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-view-profile');
        showToast(`📄 Opening profile for ${name}...`);
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
      document.getElementById('header-top-search-input'),
      document.getElementById('top-capsule-search-input')
    ].filter(Boolean);

    if (searchInputs.length === 0) return;

    const suggestions = [
      "🚀 Senior Java / Spring Boot Microservices (FPT, Vietcombank)...",
      "💻 React 19 & Next.js Fullstack Developer ($1,800 - $2,600)...",
      "🤖 AI & Machine Learning Solutions Architect (Enterprise Hub)...",
      "🚢 Senior Ocean Freight Operations Specialist (Viconship Group)...",
      "📱 Senior Mobile Flutter / iOS Engineer (Viettel Digital)...",
      "🎨 Lead Product UI/UX Designer (Design Systems & Tokens)...",
      "☁️ Principal DevOps & Multi-Cloud Kubernetes Engineer...",
      "⚡ Smart Warehouse Robotics & AMR Automation Lead...",
      "🏢 Explore career opportunities across 120+ accredited enterprises..."
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

    // "Khong hien lai" Checkbox Event Listener
    dontShowCb?.addEventListener('change', (e) => {
      e.stopPropagation();
      if (dontShowCb.checked) {
        localStorage.setItem('vietnamjobs_hide_activity_ticker', 'true');
        toast.classList.remove('show');
        clearInterval(tickerInterval);
        clearTimeout(toastTimeout);
        showToast('ℹ️ Live activity notifications paused');
      }
    });

    dontShowCb?.closest('.activity-toast-dont-show')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const activities = [
      { jobId: "prj-100", logo: "images/brands/fpt.svg", text: "Nguyen Minh Tuan vua ung tuyen <strong>Senior Backend Engineer</strong> tai FPT Software", time: "1 phut truoc" },
      { jobId: "prj-101", logo: "images/brands/vcb.svg", text: "Vietcombank vua gui loi moi phong van toi ung vien <strong>Tran Minh Quang</strong>", time: "3 phut truoc" },
      { jobId: "prj-102", logo: "images/brands/vinfast.svg", text: "VinFast Digital vua dang tuyen 3 vi tri <strong>React / Next.js Senior</strong>", time: "5 phut truoc" },
      { jobId: "prj-104", logo: "images/brands/shopee.svg", text: "Shopee Vietnam vua nhan 4 ho so ung tuyen <strong>Digital Marketing Manager</strong>", time: "8 phut truoc" },
      { jobId: "prj-103", logo: "images/brands/viettel.svg", text: "Vu Dinh Nam vua nop ho so ung tuyen <strong>Mobile Flutter Engineer</strong> tai Viettel", time: "12 phut truoc" },
      { jobId: "prj-105", logo: "images/brands/momo.svg", text: "MoMo Fintech vua xem ho so cua <strong>Nguyen Ha My</strong> (UX Lead)", time: "15 phut truoc" },
      { jobId: "prj-111", logo: "images/brands/samsung.svg", text: "Samsung R&D vua mo tuyen 2 vi tri <strong>AI Data Engineer</strong>", time: "18 phut truoc" }
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
      if (timeEl) timeEl.innerHTML = '<span class="live-pulse-dot" style="width:6px;height:6px;"></span> ' + act.time + ' <span style="margin-left:6px;color:var(--fl-primary);font-weight:700;">Xem chi tiet &rarr;</span>';

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
        salary: '$1,200 - $2,200 / mo',
        senior: 'Senior: $1,800 - $3,000 / mo',
        demand: '+42% Demand Growth',
        openCount: '1,240+ Open Roles',
        companies: [
          { name: 'FPT Software', img: 'images/brands/fpt.svg' },
          { name: 'Vietcombank', img: 'images/brands/vcb.svg' },
          { name: 'VinFast Digital', img: 'images/brands/vinfast.svg' },
          { name: 'Viettel Digital', img: 'images/brands/viettel.svg' }
        ],
        keyword: 'Java'
      },
      'react': {
        salary: '$1,100 - $2,000 / mo',
        senior: 'Senior / Lead: $1,600 - $2,800 / mo',
        demand: '+56% Demand Growth',
        openCount: '1,890+ Open Roles',
        companies: [
          { name: 'VinFast Digital', img: 'images/brands/vinfast.svg' },
          { name: 'KiotViet', img: 'images/brands/kiotviet.svg' },
          { name: 'Tiki', img: 'images/brands/tiki.svg' },
          { name: 'Shopee', img: 'images/brands/shopee.svg' }
        ],
        keyword: 'React'
      },
      'ai': {
        salary: '$1,500 - $2,800 / mo',
        senior: 'Principal / Architect: $2,500 - $4,200 / mo',
        demand: '+84% Breakout Growth',
        openCount: '860+ Open Roles',
        companies: [
          { name: 'Vietcombank', img: 'images/brands/vcb.svg' },
          { name: 'VNPay', img: 'images/brands/vnpay.svg' },
          { name: 'FPT AI Lab', img: 'images/brands/fpt.svg' },
          { name: 'Samsung R&D', img: 'images/brands/samsung.svg' }
        ],
        keyword: 'AI'
      },
      'mobile': {
        salary: '$1,100 - $2,000 / mo',
        senior: 'Senior: 40 - 60 trieu/thang',
        demand: '+38% Demand Growth',
        openCount: '940+ Open Roles',
        companies: [
          { name: 'Viettel Money', img: 'images/brands/viettel.svg' },
          { name: 'MoMo', img: 'images/brands/momo.svg' },
          { name: 'Grab Vietnam', img: 'images/brands/grab.svg' },
          { name: 'VNG', img: 'images/brands/vng.svg' }
        ],
        keyword: 'Mobile'
      },
      'design': {
        salary: '$1,000 - $1,900 / mo',
        senior: 'Lead UX: $1,500 - $2,400 / mo',
        demand: '+35% Demand Growth',
        openCount: '780+ Open Roles',
        companies: [
          { name: 'MoMo Fintech', img: 'images/brands/momo.svg' },
          { name: 'Grab Vietnam', img: 'images/brands/grab.svg' },
          { name: 'Tiki Corp', img: 'images/brands/tiki.svg' },
          { name: 'Shopee', img: 'images/brands/shopee.svg' }
        ],
        keyword: 'Design'
      },
      'marketing': {
        salary: '$900 - $1,700 / mo',
        senior: 'Head of Marketing: $1,800 - $3,000 / mo',
        demand: '+48% Demand Growth',
        openCount: '1,450+ Open Roles',
        companies: [
          { name: 'Shopee Vietnam', img: 'images/brands/shopee.svg' },
          { name: 'Grab Vietnam', img: 'images/brands/grab.svg' },
          { name: 'Unilever', img: 'images/brands/unilever.svg' },
          { name: "L'Oreal", img: 'images/brands/loreal.svg' }
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
        if (exploreBtn) exploreBtn.innerHTML = '<i class=\"fa-solid fa-magnifying-glass\"></i> View ' + data.openCount.split('+')[0] + '+ Roles';

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
      showToast(`🚀 Filtering jobs in category \"${currentKeyword}\"!`);
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
      if (resultTitle) resultTitle.textContent = 'ESTIMATED TAKE-HOME (NET):';
      calculate();
    });

    netBtn?.addEventListener('click', () => {
      isGrossToNet = false;
      netBtn.classList.add('active');
      grossBtn?.classList.remove('active');
      if (modeLabel) modeLabel.textContent = 'NET';
      if (resultTitle) resultTitle.textContent = 'RECOMMENDED GROSS SALARY:';
      calculate();
    });

    function formatNumber(num) {
      return num.toLocaleString('vi-VN') + ' $';
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

        // Progressive PIT Tax (Thue TNCN luy tien 2026)
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
        if (taxVal) taxVal.textContent = pit > 0 ? ('-' + formatNumber(pit)) : '0 $';
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
        if (taxVal) taxVal.textContent = 'Progressive bracket';
      }
    }

    calcBtn?.addEventListener('click', () => {
      calculate();
      showToast('⚡ Salary compensation model calculated!');
    });

    dependentsSelect?.addEventListener('change', calculate);

    // ATS CV Toolkit Download Handler
    document.getElementById('btn-download-cv-kit')?.addEventListener('click', () => {
      showToast('📥 Downloading 50+ ATS-Ready CV Templates (DOCX & PDF)...');
      setTimeout(() => {
        showToast('✅ Download complete! Best wishes on your career search.');
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

});



/* ==========================================================================
   HOMEPAGE ENTERPRISE LOGISTICS PORTAL JS (BROADCASTS, SPLIT JOBS, COURSES)
   ========================================================================== */

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

// 2. Enterprise Split-Screen Job Board Controller & Dataset
const enterpriseJobsDatabase = [
  // Page 1
  {
    "id": "job-1",
    "title": "Supply Chain Solutions Architect (Cold Chain)",
    "company": "VinFast Logistics & Cold Chain Solutions",
    "companyLogo": "images/brands/vinfast.svg",
    "companyIcon": "fa-snowflake",
    "salary": "$35.000.000 - $55.000.000/mo",
    "salaryVal": 45000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["Top Tier Enterprise", "Cold Chain", "High Salary", "Strategy"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "3 hours ago",
    "applicants": "22 applicants",
    "specs": { "exp": "Senior level (3 - 5 Yrs)", "edu": "Master / Engineering", "dept": "Strategic Network Optimization", "openings": "1 Position" },
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
    "salary": "$26.000.000 - $38.000.000/mo",
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
    "salary": "$22.000.000 - $35.000.000/mo",
    "salaryVal": 28000000,
    "location": "Ba Ria - Vung Tau, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "port",
    "tags": ["Deep Sea Port", "Maritime", "Terminal Ops", "Shift Work"],
    "isUrgent": false,
    "isHighSalary": false,
    "time": "1 day ago",
    "applicants": "34 applicants",
    "specs": { "exp": "Specialist (2 - 4 Yrs)", "edu": "Maritime University / Logistics", "dept": "Terminal Operating Systems (TOS)", "openings": "3 Positions" },
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
    "salary": "$30.000.000 - $48.000.000/mo",
    "salaryVal": 38000000,
    "location": "Da Nang, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["Telematics", "Fleet Tech", "Data Analytics", "LogiTech"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "1 day ago",
    "applicants": "35 applicants",
    "specs": { "exp": "Mid-Senior (2 - 4 Yrs)", "edu": "Data Science / Industrial Eng.", "dept": "Digital Freight Platform", "openings": "2 Positions" },
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
    "salary": "$28.000.000 - $42.000.000/mo",
    "salaryVal": 35000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "forwarding",
    "tags": ["Verified Employer", "Full-time", "Hybrid", "Ocean Freight"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "2 days ago",
    "applicants": "19 applicants",
    "specs": { "exp": "3 - 5 Years", "edu": "Bachelor Degree", "dept": "Asia-Europe Trade Lane", "openings": "2 Positions" },
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
    "salary": "$32.000.000 - $48.000.000/mo",
    "salaryVal": 40000000,
    "location": "Binh Duong, Vietnam (On-site)",
    "workplace": "On-site",
    "category": "robotics",
    "tags": ["Urgent Hiring", "Full-time", "On-site", "Warehouse Tech"],
    "isUrgent": true,
    "isHighSalary": true,
    "time": "2 days ago",
    "applicants": "28 applicants",
    "specs": { "exp": "2 - 4 Years", "edu": "BS in Mechatronics/CS", "dept": "Automated Operations Group", "openings": "4 Positions" },
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
    "salary": "$40.000.000 - $65.000.000/mo",
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
    "benefits": ["Sign-on bonus $50M", "Annual overseas tech conferences", "Full remote flexibility."]
  },
  {
    "id": "job-8",
    "title": "Multimodal Freight Operations Lead (Air & Sea)",
    "company": "Kuehne+Nagel Vietnam",
    "companyLogo": "images/brands/kuehne-nagel.svg",
    "companyIcon": "fa-plane-departure",
    "salary": "$30.000.000 - $45.000.000/mo",
    "salaryVal": 37000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "forwarding",
    "tags": ["Global 3PL", "Air Freight", "Multimodal", "Tan Son Nhat"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "3 days ago",
    "applicants": "18 applicants",
    "specs": { "exp": "Mid-Senior (3 - 5 Yrs)", "edu": "Bachelor in Economics / Trade", "dept": "Air Cargo Services", "openings": "2 Positions" },
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
    "salary": "$50.000.000 - $80.000.000/mo",
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
    "overview": "Direct all cold storage operations, multi-zone temperature validation (-25 deg C to +8 deg C), and automated ammonia refrigeration systems.",
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
    "salary": "$24.000.000 - $36.000.000/mo",
    "salaryVal": 30000000,
    "location": "Cai Mep - Gemalink Port, Vung Tau",
    "workplace": "On-site",
    "category": "port",
    "tags": ["Deep Sea", "Gemalink", "Berth Planning", "Maritime"],
    "isUrgent": false,
    "isHighSalary": false,
    "time": "4 days ago",
    "applicants": "24 applicants",
    "specs": { "exp": "Specialist (2 - 4 Yrs)", "edu": "Maritime Navigation / Logistics", "dept": "Port Operations", "openings": "2 Positions" },
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
    "salary": "$45.000.000 - $75.000.000/mo",
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
    "salary": "$28.000.000 - $42.000.000/mo",
    "salaryVal": 35000000,
    "location": "Binh Duong Mega MegaHub",
    "workplace": "On-site",
    "category": "robotics",
    "tags": ["E-Commerce", "Shopee", "Cross-Border", "Fulfillment"],
    "isUrgent": false,
    "isHighSalary": true,
    "time": "5 days ago",
    "applicants": "47 applicants",
    "specs": { "exp": "Supervisor (3 - 5 Yrs)", "edu": "Bachelor in Business / Logistics", "dept": "Inbound & Customs Hub", "openings": "3 Positions" },
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
    "salary": "$35.000.000 - $52.000.000/mo",
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
    "salary": "$32.000.000 - $48.000.000/mo",
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
    "salary": "$25.000.000 - $38.000.000/mo",
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
    "salary": "$27.000.000 - $40.000.000/mo",
    "salaryVal": 33000000,
    "location": "Ho Chi Minh City, Vietnam (Hybrid)",
    "workplace": "Hybrid",
    "category": "tech",
    "tags": ["ESG", "Green Logistics", "Carbon Accounting", "Sustainability"],
    "isUrgent": false,
    "isHighSalary": false,
    "time": "1 week ago",
    "applicants": "26 applicants",
    "specs": { "exp": "Analyst (2 - 4 Yrs)", "edu": "Environmental Science / Economics", "dept": "Sustainability Office", "openings": "1 Position" },
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
    "salary": "$35.000.000 - $55.000.000/mo",
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
    "salary": "$30.000.000 - $45.000.000/mo",
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
    "salary": "$24.000.000 - $36.000.000/mo",
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
    "salary": "$35.000.000 - $55.000.000/mo",
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

let enterpriseCurrentFilter = 'all';
let enterpriseSelectedJobId = 'job-1';
let currentJobPage = 1;
const JOBS_PER_PAGE = 5;

function initSplitScreenJobBoard() {
  const container = document.getElementById('jobs-list-container');
  const detailPanel = document.getElementById('job-detail-panel');
  const countBadge = document.getElementById('job-filter-count');
  const listCounter = document.getElementById('linkedin-jobs-counter');
  const chipBtns = document.querySelectorAll('.job-chip-btn');
  if (!container || !detailPanel) return;

  function getFilteredJobs() {
    let filtered = enterpriseJobsDatabase;
    if (enterpriseCurrentFilter === 'urgent') {
      filtered = enterpriseJobsDatabase.filter(j => j.isUrgent);
    } else if (enterpriseCurrentFilter === 'high-salary') {
      filtered = enterpriseJobsDatabase.filter(j => j.isHighSalary);
    } else if (enterpriseCurrentFilter !== 'all') {
      filtered = enterpriseJobsDatabase.filter(j => j.category === enterpriseCurrentFilter);
    }
    return filtered;
  }

  function renderJobList() {
    const filtered = getFilteredJobs();
    const totalJobs = filtered.length;

    if (countBadge) countBadge.textContent = `${totalJobs} results`;
    if (listCounter) listCounter.textContent = `${totalJobs} openings`;

    if (totalJobs === 0) {
      container.innerHTML = `
        <div style="padding: 48px 20px; text-align: center; color: #64748B;">
          <i class="fa-solid fa-folder-open" style="font-size: 36px; color: var(--fl-primary); margin-bottom: 12px; display:inline-block;"></i>
          <h3 style="font-size: 16px; color: #1E293B; margin-bottom: 6px; font-weight: 700;">No Openings Found</h3>
          <p style="font-size: 13px; margin-bottom: 14px; color: #64748B;">Try selecting "All Jobs" or adjusting your category filter.</p>
        </div>
      `;
      return;
    }

    // Ensure selected job exists in filtered list
    if (!filtered.some(j => j.id === enterpriseSelectedJobId)) {
      enterpriseSelectedJobId = filtered[0].id;
    }

    const jobsHtml = filtered.map(job => {
      const isSelected = job.id === enterpriseSelectedJobId;
      const easyApplyCategories = ['forwarding', 'robotics', 'customs'];
      const isEasyApply = easyApplyCategories.includes(job.category) || job.isUrgent;
      return `
        <article class="job-card ${isSelected ? 'active' : ''}" data-job-id="${job.id}" onclick="selectEnterpriseJob('${job.id}')" aria-selected="${isSelected}">
          <div class="job-card-top-row">
            <div class="linkedin-card-logo">
              <img src="${job.companyLogo}" alt="${job.company}" class="linkedin-brand-img" onerror="this.style.display='none'">
            </div>
            <div class="job-card-header-info">
              <h3 class="linkedin-card-title">${job.title}</h3>
              <div class="linkedin-card-company">${job.company}</div>
              <div class="li-card-meta">${job.location} &middot; ${job.workplace}</div>
              <div class="li-card-salary">${job.salary}</div>
              <div class="li-card-badges">
                ${isEasyApply ? '<span class="li-badge-easy-apply"><i class="fa-solid fa-bolt"></i> Easy Apply</span>' : ''}
                ${job.isUrgent ? '<span class="li-badge-urgent">URGENT</span>' : ''}
              </div>
              <div class="li-card-meta" style="margin-top:5px;">${job.time} &bull; ${job.applicants}</div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = jobsHtml;

    // Render detail panel for selected job
    renderEnterpriseJobDetail(enterpriseSelectedJobId);
  }

  function renderEnterpriseJobDetail(jobId) {
    const job = enterpriseJobsDatabase.find(j => j.id === jobId) || enterpriseJobsDatabase[0];
    if (!job) return;

    detailPanel.innerHTML = `
      <div style="padding-bottom: 24px; border-bottom: 1px solid #E2E8F0; margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:16px;">
          <div>
            <h1 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0; line-height: 1.3;">${job.title}</h1>
            <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569; flex-wrap:wrap;">
              <span style="font-weight:600; color:var(--fl-primary);">${job.company}</span>
              <span>&bull;</span>
              <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
              <span>&bull;</span>
              <span style="color:#059669; font-weight:600;"><i class="fa-solid fa-clock"></i> ${job.time}</span>
            </div>
          </div>
          <div style="width:56px; height:56px; flex-shrink:0;">
            <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain; background:transparent;">
          </div>
        </div>

        <div style="display:flex; gap:12px; margin-top:16px;">
          <button type="button" class="btn-linkedin-easy-apply" onclick=\"alert('Thank you for applying to: ${job.title}! Your application has been sent directly to hiring managers.');\" style="background:var(--fl-primary); color:#fff; border:none; padding:10px 24px; border-radius:24px; font-weight:600; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-paper-plane"></i> Apply Now
          </button>
          <button type="button" class="btn-linkedin-save-job" onclick="this.innerHTML = '<i class=\'fa-solid fa-bookmark\'></i> Saved'; this.style.borderColor='var(--fl-primary)'; this.style.color='var(--fl-primary)';" style="padding:9px 20px; border-radius:24px; font-weight:600; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <i class="fa-regular fa-bookmark"></i> Save Job
          </button>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0;">About the job</h3>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0;">${job.overview}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0;">Key Responsibilities</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
          ${(job.responsibilities || []).map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0;">Candidate Qualifications &amp; Requirements</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
          ${(job.requirements || []).map(rq => `<li style="margin-bottom: 6px;">${rq}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0;">Compensation &amp; Benefits</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
          ${(job.benefits || []).map(b => `<li style="margin-bottom: 6px;">${b}</li>`).join('')}
        </ul>
      </div>

      <div style="padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 12px 0;">About the company</h3>
        <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; padding:16px; border-radius:10px; border:1px solid #E2E8F0;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; flex-shrink:0;">
              <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain; background:transparent;">
            </div>
            <div>
              <div style="font-weight:700; font-size:14.5px; color:#0F172A;">${job.company}</div>
              <div style="font-size:12px; color:#64748B;">Accredited Enterprise Hiring Partner</div>
            </div>
          </div>
          <button type="button" onclick="this.textContent = 'Following'; this.style.background='#0F172A'; this.style.color='#fff';" style="background:#fff; border:1px solid #CBD5E1; color:#0F172A; padding:6px 16px; border-radius:20px; font-size:13px; font-weight:600; cursor:pointer;">
            + Follow
          </button>
        </div>
      </div>
    `;
  }

  window.selectEnterpriseJob = function(jobId) {
    enterpriseSelectedJobId = jobId;
    document.querySelectorAll('.job-card').forEach(c => {
      c.classList.toggle('active', c.dataset.jobId === jobId);
    });
    renderEnterpriseJobDetail(jobId);
  };

  window.goToJobPage = function(pageNum) {
    currentJobPage = pageNum;
    const filtered = getFilteredJobs();
    const startIndex = (currentJobPage - 1) * JOBS_PER_PAGE;
    if (filtered[startIndex]) {
      enterpriseSelectedJobId = filtered[startIndex].id;
    }
    renderJobList();
    const container = document.getElementById('jobs-list-container');
    if (container) container.scrollTop = 0;
  };

  window.changeJobPage = function(newPage) {
    goToJobPage(newPage);
  };

  // Wire filter chips
  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chipBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      enterpriseCurrentFilter = btn.dataset.filter || 'all';
      currentJobPage = 1;
      const filtered = getFilteredJobs();
      if (filtered.length > 0) {
        enterpriseSelectedJobId = filtered[0].id;
      }
      renderJobList();
    });
  });

  renderJobList();
}


// 3. Course Center Catalog Tabs & Cards Controller
const careerCatalogData = {
  exam: [
    { title: 'Legal & Regulatory Foundations', modules: '1 Module', views: '8,166,589 Views', img: 'images/career_banner_1.svg?v=2' },
    { title: 'Executive Verbal & Communication', modules: '1 Module', views: '7,478,162 Views', img: 'images/career_banner_2.svg?v=2' },
    { title: 'Analytical Judgment & Concepts', modules: '1 Module', views: '7,398,773 Views', img: 'images/career_banner_3.svg?v=2' },
    { title: 'Quantitative Logistics & Strategy', modules: '3 Modules', views: '6,550,610 Views', img: 'images/career_banner_4.svg?v=2' }
  ],
  guidance: [
    { title: 'Port & Maritime Career Pathways', modules: '2 Modules', views: '5,210,400 Views', img: 'images/career_banner_2.svg?v=2' },
    { title: 'Air Cargo Operations Onboarding', modules: '1 Module', views: '4,850,210 Views', img: 'images/career_banner_1.svg?v=2' },
    { title: 'Cold Chain Fleet Management Protocol', modules: '2 Modules', views: '4,120,900 Views', img: 'images/career_banner_4.svg?v=2' },
    { title: 'Warehouse Automation & AMR Integration', modules: '3 Modules', views: '3,950,450 Views', img: 'images/career_banner_3.svg?v=2' }
  ],
  cert: [
    { title: 'FIATA International Freight Forwarding Diploma', modules: '4 Modules', views: '6,890,120 Views', img: 'images/career_banner_3.svg?v=2' },
    { title: 'Certified Supply Chain Professional (CSCP)', modules: '5 Modules', views: '6,450,800 Views', img: 'images/career_banner_4.svg?v=2' },
    { title: 'Customs Clearance Specialist Credential', modules: '2 Modules', views: '5,780,300 Views', img: 'images/career_banner_1.svg?v=2' },
    { title: 'Dangerous Goods Air Regulations (IATA DGR)', modules: '3 Modules', views: '5,120,600 Views', img: 'images/career_banner_2.svg?v=2' }
  ],
  growth: [
    { title: 'Cross-Border Supply Chain Negotiation', modules: '2 Modules', views: '4,650,200 Views', img: 'images/career_banner_4.svg?v=2' },
    { title: 'Terminal Operating Systems (TOS) Leadership', modules: '3 Modules', views: '4,180,900 Views', img: 'images/career_banner_3.svg?v=2' },
    { title: 'Supply Chain Analytics & PowerBI Modeling', modules: '2 Modules', views: '3,890,400 Views', img: 'images/career_banner_1.svg?v=2' },
    { title: 'International Commercial Terms (Incoterms 2020)', modules: '1 Module', views: '3,650,700 Views', img: 'images/career_banner_2.svg?v=2' }
  ],
  postgrad: [
    { title: 'Master of Global Logistics & Maritime Governance', modules: '6 Modules', views: '3,450,100 Views', img: 'images/career_banner_1.svg?v=2' },
    { title: 'Postgraduate Diploma in Transport Economics', modules: '4 Modules', views: '3,120,400 Views', img: 'images/career_banner_2.svg?v=2' },
    { title: 'International Trade Law & Maritime Arbitration', modules: '5 Modules', views: '2,980,500 Views', img: 'images/career_banner_3.svg?v=2' },
    { title: 'Green Logistics & Port Decarbonization Research', modules: '3 Modules', views: '2,750,800 Views', img: 'images/career_banner_4.svg?v=2' }
  ],
  practice: [
    { title: 'Navis N4 Quayside Crane Dispatch Simulation', modules: '3 Modules', views: '4,520,100 Views', img: 'images/career_banner_2.svg?v=2' },
    { title: 'Warehouse WMS & Autonomous Robot Fleet Routing', modules: '2 Modules', views: '4,180,600 Views', img: 'images/career_banner_3.svg?v=2' },
    { title: 'Cold Chain IoT Sensor Calibration Workshop', modules: '2 Modules', views: '3,890,200 Views', img: 'images/career_banner_4.svg?v=2' },
    { title: 'Cross-Docking & Distribution Center Layout Plan', modules: '3 Modules', views: '3,540,900 Views', img: 'images/career_banner_1.svg?v=2' }
  ],
  knowledge: [
    { title: 'ASEAN Single Window & Electronic Customs Clearance', modules: '1 Module', views: '5,620,300 Views', img: 'images/career_banner_1.svg?v=2' },
    { title: 'Vietnam Maritime Code & Port Tariff Structures', modules: '2 Modules', views: '4,980,400 Views', img: 'images/career_banner_4.svg?v=2' },
    { title: 'Multimodal Bill of Lading & Carrier Liabilities', modules: '2 Modules', views: '4,750,100 Views', img: 'images/career_banner_2.svg?v=2' },
    { title: 'Air Waybill (AWB) Compliance & Dangerous Goods', modules: '1 Module', views: '4,320,800 Views', img: 'images/career_banner_3.svg?v=2' }
  ]
};

window.selectCareerTab = function(btn, title) {
  document.querySelectorAll('.career-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const cat = btn ? btn.dataset.category : 'exam';
  renderCareerCards(cat);
};

function renderCareerCards(cat) {
  const container = document.getElementById('career-cards-container');
  if (!container) return;
  const list = careerCatalogData[cat] || careerCatalogData['exam'];
  container.innerHTML = list.map(item => `
    <article class="career-card-item reveal" onclick=\"alert('Accredited Course: ${item.title}\nStructure: ${item.modules}\nEnrollment: ${item.views}');\" style="cursor:pointer;">
      <div class="career-card-img-wrap" style="border-radius:8px; overflow:hidden; aspect-ratio:16/9.2; background:#F1F5F9;">
        <img src="${item.img}" alt="${item.title}" class="career-card-img" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="career-card-content" style="padding:10px 2px 4px;">
        <h3 class="career-card-name" style="font-size:14.5px; font-weight:600; color:#191919; margin:0 0 6px; line-height:1.35; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          ${item.title}
        </h3>
        <div class="career-card-meta" style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#64748B;">
          <span><i class="fa-regular fa-file-lines"></i> ${item.modules}</span>
          <span><i class="fa-regular fa-eye"></i> ${item.views}</span>
        </div>
      </div>
    </article>
  `).join('');
}

// 4. Smooth Navigation Scroll Handler for Nav 5 items
function initNavigationScrollLinks() {
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetSelector = btn.getAttribute('data-scroll');
      if (!targetSelector) return;

      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        // Switch to home view first if not active
        if (typeof switchView === 'function') {
          switchView('home');
        }
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    });
  });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initYouTubeHub();
  initSplitScreenJobBoard();
  initNavigationScrollLinks();
});



/* ==========================================================================
   ENTERPRISE COMPANIES SHOWCASE, TECH + AI, PRICING, EVENTS & B2B LEADS JS
   ========================================================================== */

const enterpriseCompaniesData = [
  {
    id: 'vinfast',
    name: 'VinFast Logistics & Cold Chain Solutions',
    logo: 'images/brands/vinfast.svg',
    industry: 'Logistics Tech & AI Cold Chain',
    category: 'ai',
    tagline: 'Kien truc chuoi cung ung lanh thong minh & van tai tu hanh the he moi',
    location: 'Hai Phong & TP. Ho Chi Minh, Viet Nam',
    size: '10,000+ nhan su',
    founded: '2017',
    website: 'https://vinfastauto.com',
    desc: 'VinFast Logistics tien phong ung dung tri tue nhan tao (AI) va mang luoi vien thong IoT de toi uu hoa tuyen van tai pin xe dien, logistics chuoi cung ung lanh xuyen bien gioi ASEAN va mang luoi tram phan phoi thong minh.',
    techStack: ['Vision AI', 'Route Optimization ML', 'IoT Telematics', 'PyTorch', 'Kubernetes', 'Apache Kafka'],
    stats: { services: 4, plans: 3, events: 2, jobs: 6 },
    services: [
      {
        id: 'srv-vf-1',
        title: 'He Thong IoT Telematics Chuoi Lanh Thong Minh',
        icon: 'fa-snowflake',
        desc: 'Giam sat nhiet do, do am va dinh vi thoi gian thuc cho doi xe container lanh va kho lanh sau voi do chinh xac 99.98%. Canh bao nguy co lech nhiet tu dong qua AI.',
        features: [
          'Do tre truyen du lieu duoi 1.5 giay qua mang 5G/IoT ve tinh',
          'Tich hop tu dong he thong khai bao hai quan dien tu VNACCS',
          'Bao cao tu dong chuan GDP (Good Distribution Practice) cho duoc pham va vac xin'
        ]
      },
      {
        id: 'srv-vf-2',
        title: 'AI Dynamic Route Optimization Engine',
        icon: 'fa-route',
        desc: 'Thuat toan hoc may phan tich du lieu luu luong giao thong lich su va thoi gian thuc de tinh toan hai trinh va lo trinh xe tai toi uu, giam 18% chi phi tieu hao nhien lieu.',
        features: [
          'Can bang tai dong giua 40+ cum trung chuyen phan phoi Bac - Nam',
          'Du doan thoi gian cap cang (ETA) chinh xac toi tung phut',
          'Giam thieu toi da tinh trang chay rong (Empty-Miles Reduction)'
        ]
      },
      {
        id: 'srv-vf-3',
        title: 'Cong Tich Hop API B2B EDI & Logistics Microservices',
        icon: 'fa-network-wired',
        desc: 'Ha tang ket noi API cap doanh nghiep cho phep doi tac ERP (SAP, Oracle, CargoWise) dong bo hoa van don dien tu e-BL va hoa don cuoc van chuyen tuc thi.',
        features: [
          'Chuan bao mat ngan hang OAuth2, mTLS va ma hoa du lieu AES-256',
          'Kha nang chiu tai 150,000 requests/phut thoi diem cao diem',
          'Cam ket SLA he thong van hanh 99.99%'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-vf-pilot',
        name: 'Goi Thu Nghiem (Pilot Tier)',
        price: '$15.000.000',
        period: '/thang',
        desc: 'Phu hop cho cac doanh nghiep thu nghiem giai phap theo doi chuoi lanh va dinh vi AI tren quy mo nho.',
        popular: false,
        features: [
          'Trien khai toi da 10 cam bien IoT & xe van tai',
          'Truy cap bang dieu khien phan tich AI co ban',
          'Xuat bao cao dinh ky hang tuan',
          'Ho tro ky thuat qua Email & Ticket (gio hanh chinh)'
        ]
      },
      {
        id: 'price-vf-pro',
        name: 'Goi Doanh Nghiep (Growth Pro)',
        price: '$45.000.000',
        period: '/thang',
        desc: 'Giai phap toan dien toi uu hoa lo trinh xe tai va quan ly kho van thong minh thoi gian thuc.',
        popular: true,
        features: [
          'Trien khai khong gioi han toi 80 phuong tien / kho bai',
          'Day du thuat toan AI toi uu hoa lo trinh da diem',
          'Canh bao nhiet do & su co tuc thi qua SMS / Telegram / App',
          'Cam ket SLA van hanh 99.9% va ho tro ky thuat 24/7'
        ]
      },
      {
        id: 'price-vf-ent',
        name: 'Goi May Do Doanh Nghiep (Enterprise Custom)',
        price: 'Theo Quy Mo',
        period: '',
        desc: 'Kien truc ha tang danh rieng cho cac tap doan da quoc gia va tong cong ty logistics.',
        popular: false,
        features: [
          'Trien khai On-Premise hoac Dedicated Private Cloud',
          'Huan luyen rieng mo hinh AI tren du lieu logistics noi bo',
          'Chuyen gia Solutions Architect truc tiep dong hanh du an',
          'Tich hop sau he sinh thai ERP / WMS / TMS theo yeu cau'
        ]
      }
    ],
    events: [
      {
        id: 'evt-vf-1',
        title: 'Vietnam AI & Smart Logistics Innovation Summit 2026',
        format: 'Live Summit & Hybrid',
        date: '15/12/2026 &bull; 08:30 - 17:00',
        location: 'GEM Center, Quan 1, TP. Ho Chi Minh & Truc tuyen',
        desc: 'Dien dan thuong nien quy tu 800+ lanh dao chuoi cung ung, chuyen gia AI va co quan ban nganh cung thao luan lo trinh chuyen doi so va trung hoa carbon.'
      },
      {
        id: 'evt-vf-2',
        title: 'Workshop Ky Thuat: Toi Uu Hoa Tuyen Duong Van Tai Bang AI & Digital Twins',
        format: 'Hands-on Webinar',
        date: '28/11/2026 &bull; 14:00 - 16:30',
        location: 'Virtual Zoom / Google Meet Webinar',
        desc: 'Chia se kien truc thuc chien tu doi ngu ky su AI VinFast ve cach mo phong ban sao so (Digital Twin) de cat giam 18% chi phi nhien lieu.'
      }
    ]
  },
  {
    id: 'fpt',
    name: 'FPT Software AI & Digital Labs',
    logo: 'images/brands/fpt.svg',
    industry: 'Enterprise AI & Cloud Engineering',
    category: 'tech',
    tagline: 'Tien phong phat trien cac mo hinh Generative AI va giai phap chuyen doi so toan cau',
    location: 'Ha Noi, Da Nang & TP. Ho Chi Minh',
    size: '30,000+ nhan su',
    founded: '1999',
    website: 'https://fpt-software.com',
    desc: 'FPT Software cung cap cac giai phap tri tue nhan tao toan dien tu Generative AI, Computer Vision, xu ly ngon ngu tu nhien (NLP) cho toi cac he thong dam may phan tan cho hang tram tap doan trong danh sach Fortune 500.',
    techStack: ['Generative AI', 'Large Language Models', 'Computer Vision', 'Python', 'Go', 'AWS / Azure'],
    stats: { services: 5, plans: 3, events: 3, jobs: 8 },
    services: [
      {
        id: 'srv-fpt-1',
        title: 'FPT AI Mentor & Agentic AI Workflow Solutions',
        icon: 'fa-brain',
        desc: 'He thong tro ly ao va Agentic AI tu hanh co kha nang xu ly nghiep vu tu dong, phan tich tai lieu hop dong va tu dong hoa quy trinh khach hang (RPA).',
        features: [
          'Ho tro mo hinh ngon ngu tieng Viet chuyen nganh chinh xac cao',
          'Tu dong hoa 80% tac vu giai dap va xu ly ticket noi bo',
          'Bao mat du lieu tuyet doi theo tieu chuan ISO 27001'
        ]
      },
      {
        id: 'srv-fpt-2',
        title: 'Computer Vision & OCR Trich Xuat Du Lieu Tu Dong',
        icon: 'fa-eye',
        desc: 'Nhan dien va so hoa tuc thi chung tu van tai, hoa don GTGT, can cuoc cong dan va hop dong kinh te voi do chinh xac tren 99.2%.',
        features: [
          'Xu ly hon 200 dinh dang hoa don va bill of lading quoc te',
          'Thoi gian nhan dien duoi 0.8 giay / trang tai lieu',
          'Tich hop truc tiep he thong kho du lieu Data Lakehouse'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-fpt-starter',
        name: 'Goi Khoi Dong AI (AI Starter Pack)',
        price: '$25.000.000',
        period: '/thang',
        desc: 'Bo cong cu OCR va Chatbot AI co ban cho doanh nghiep so hoa chung tu va tuong tac khach hang.',
        popular: false,
        features: [
          'Xu ly 10,000 trang chung tu OCR / thang',
          '1 Tro ly AI hoi dap noi bo chuyen nghiep',
          'Tich hop API Webhook co ban',
          'Ho tro ky thuat 8/5'
        ]
      },
      {
        id: 'price-fpt-scale',
        name: 'Goi Chuyen Doi So (Enterprise Scale)',
        price: '$75.000.000',
        period: '/thang',
        desc: 'Tich hop Agentic AI va xu ly thi giac may tinh vao toan bo chu trinh nghiep vu doanh nghiep.',
        popular: true,
        features: [
          'Xu ly 100,000 trang chung tu OCR / thang',
          'Trien khai da Agent AI ket noi co so du lieu noi bo',
          'Mo hinh Fine-tuned chuyen biet theo du lieu cong ty',
          'Ho tro ky thuat 24/7 voi Dedicated Account Manager'
        ]
      },
      {
        id: 'price-fpt-custom',
        name: 'Goi May Do Du An (Strategic Custom)',
        price: 'Bao Gia Du An',
        period: '',
        desc: 'Phat trien giai phap cong nghe va he sinh thai phan mem quy mo lon.',
        popular: false,
        features: [
          'Doi ngu ky su chuyen trach biet phai (Dedicated Engineering Squad)',
          'Tu van chien luoc kien truc tong the Enterprise Architecture',
          'Ban giao toan bo ma nguon va ban quyen so huu tri tue',
          'Bao hanh va toi uu hoa he thong lau dai'
        ]
      }
    ],
    events: [
      {
        id: 'evt-fpt-1',
        title: 'FPT AI Summit 2026: The Age of Autonomous Agentic AI',
        format: 'Grand Technology Conference',
        date: '20/12/2026 &bull; 09:00 - 16:30',
        location: 'Trung tam Hoi nghi Quoc gia, Ha Noi & Livestream toan cau',
        desc: 'Su kien cong nghe thuong nien lon nhat cua FPT gioi thieu cac giai phap Agentic AI tu hanh va ung dung thuc tien trong ngan hang, san xuat va logistics.'
      }
    ]
  },
  {
    id: 'saigon-newport',
    name: 'Saigon Newport Corporation (TCIT / SNP)',
    logo: 'images/brands/saigon-newport.svg',
    industry: 'Cang Bien & Ha Tang Logistics So Hoa',
    category: 'logistics',
    tagline: 'Nha khai thac cang bien hang dau Viet Nam chiem tren 50% thi phan container xuat nhap khau',
    location: 'Cat Lai, Cai Mep & Hai Phong',
    size: '8,000+ nhan su',
    founded: '1989',
    website: 'https://saigonnewport.com.vn',
    desc: 'Tong cong ty Tan Cang Sai Gon la bieu tuong dan dau nganh cang bien Viet Nam, ung dung he thong quan tri khai thac cang tu dong hoa cao cap Navis N4 va mang luoi cang can ICD hien dai.',
    techStack: ['Navis N4 TOS', 'Automated Quayside Dispatch', 'Port EDI Hub', 'IoT Crane Sensors'],
    stats: { services: 4, plans: 3, events: 2, jobs: 4 },
    services: [
      {
        id: 'srv-snp-1',
        title: 'He Thong Thu Tuc Cang Dien Tu ePort & Lenh Giao Hang eDO',
        icon: 'fa-file-invoice',
        desc: 'Giai phap thanh toan va lam thu tuc truc tuyen 100%, giam 90% thoi gian cho doi nhan container tai cong cang.',
        features: [
          'Thanh toan truc tuyen bao mat qua Napas, Vietcombank, MBBank',
          'Tu dong ket noi co so du lieu Hai quan dien tu mot cua quoc gia',
          'Tra cuu tinh trang container 24/7 tren ung dung di dong'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-snp-custom',
        name: 'Goi Dich Vu Cang & Kho Bai Chuyen Biet',
        price: 'Lien He Bao Gia',
        period: '',
        desc: 'Bao gia chinh thuc cac dich vu nang ha, luu bai, dong rut hang va chuyen cang theo bieu cuoc quy dinh.',
        popular: true,
        features: [
          'Bieu cuoc minh bach theo quy chuan Bo Giao thong Van tai',
          'Chinh sach chiet khau uu dai cho hang tau va chu hang lon',
          'Ho tro lam thu tuc hai quan va kiem hoa nhanh tai bai'
        ]
      }
    ],
    events: [
      {
        id: 'evt-snp-1',
        title: 'Hoi Thao Logistics Xanh & Cang Bien Thong Minh 2026',
        format: 'Industry Conference',
        date: '10/01/2027 &bull; 08:30 - 12:00',
        location: 'Khach san Lotte Hotel Saigon, TP. Ho Chi Minh',
        desc: 'Dinh huong chuyen doi ha tang cau dien chay pin, nang luong mat troi ap mai va giai phap cang thong minh giam phat thai rong.'
      }
    ]
  },
  {
    id: 'logivan',
    name: 'Logivan Vietnam Freight Network',
    logo: 'images/brands/logivan.svg',
    industry: 'LogiTech & Nen Tang Van Tai So',
    category: 'tech',
    tagline: 'Uber cua nganh van tai xe tai hang hoa duong dai tai Viet Nam',
    location: 'Ha Noi & TP. Ho Chi Minh',
    size: '300+ nhan su',
    founded: '2017',
    website: 'https://logivan.com',
    desc: 'Logivan ket noi mang luoi hon 40,000 chu xe tai voi hang nghin doanh nghiep san xuat, ung dung thuat toan tri tue nhan tao de ghep chuyen hang chieu ve, cat giam chi phi van tai len den 30%.',
    techStack: ['AI Matching Algorithm', 'Dynamic Rate Index', 'Geospatial Analytics', 'Snowflake', 'BigQuery'],
    stats: { services: 3, plans: 3, events: 1, jobs: 5 },
    services: [
      {
        id: 'srv-logi-1',
        title: 'Nen Tang Dieu Phoi Xe Tai Ghep Chuyen Bang AI',
        icon: 'fa-truck-fast',
        desc: 'Tu dong ghep don hang voi xe tai trong chieu ve tren toan tuyen Quoc lo 1A va cac khu cong nghiep trong diem.',
        features: [
          'Tiet kiem tu 20% den 30% chi phi van chuyen so voi cuoc truyen thong',
          'Bao hiem hang hoa len toi 1 ty dong / chuyen van chuyen',
          'Dinh vi GPS vi tri phuong tien thoi gian thuc'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-logi-starter',
        name: 'Goi Doanh Nghiep Tieu Chuan',
        price: 'Theo Chuyen Hang',
        period: '',
        desc: 'Minh bach cuoc phi theo tung cung duong van tai voi hoa don GTGT day du.',
        popular: true,
        features: [
          'Bao gia cuoc canh tranh trong vong 15 phut',
          'Khong phu phi duy tri phan mem',
          'Theo doi hanh trinh xe truc tuyen qua portal',
          'Thanh toan linh hoat cong no 30 ngay cho doi tac xac thuc'
        ]
      }
    ],
    events: [
      {
        id: 'evt-logi-1',
        title: 'Tech Talk: Toi Uu Hoa Du Lieu Khong Gian Lon (Big Data) Cho Logistics',
        format: 'Technical Webinar',
        date: '05/12/2026 &bull; 19:30 - 21:00',
        location: 'Online Webinar (Google Meet)',
        desc: 'Cach Logivan xu ly hon 5 trieu diem du lieu GPS moi ngay de dua ra chi so cuoc van tai dong sat voi thi truong.'
      }
    ]
  },
  {
    id: 'tiki',
    name: 'Tiki Smart Automation MegaHub',
    logo: 'images/brands/tiki.svg',
    industry: 'E-Commerce Fulfillment & Robotics Automation',
    category: 'ai',
    tagline: 'Trung tam xu ly don hang tu dong hoa voi hon 500 robot tu hanh AMR hien dai',
    location: 'Binh Duong & Bac Ninh, Viet Nam',
    size: '3,000+ nhan su',
    founded: '2010',
    website: 'https://tiki.vn',
    desc: 'TikiNOW Smart Logistics van hanh chuoi trung tam kho van thong minh the he moi, ung dung he thong robot tu hanh AMR va thuat toan dieu phoi thong minh giup giao hang sieu toc trong 2 gio.',
    techStack: ['Autonomous Mobile Robots (AMR)', 'Kiva Fleet Orchestrator', 'SLAM Navigation', 'Edge AI'],
    stats: { services: 3, plans: 3, events: 2, jobs: 4 },
    services: [
      {
        id: 'srv-tiki-1',
        title: 'Dich Vu Kho Van Hoan Tat Don Hang Tu Dong Bang Robot (Fulfillment by Tiki)',
        icon: 'fa-robot',
        desc: 'Luu kho, nhat hang tu dong bang canh tay robot va doi xe AMR, dong goi va xuat hang sieu toc trong 15 phut tu luc nhan don.',
        features: [
          'Do chinh xac soan hang dat 99.99%',
          'Toi uu dien tich luu tru kho gap 2.5 lan so voi kho truyen thong',
          'Tich hop da kenh ban hang Shopee, TikTok Shop, Lazada, Tiki'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-tiki-ful',
        name: 'Goi Hoan Tat Don Hang Thong Minh',
        price: 'Tu $8.000 / don',
        period: '',
        desc: 'Toan bo chi phi luu kho, nhat hang bang robot, dong goi vat tu va dan nhan van chuyen.',
        popular: true,
        features: [
          'Mien phi 30 ngay luu kho dau tien cho san pham moi',
          'Dam bao toc do dong goi san sang giao trong 2 gio',
          'Bao hiem 100% gia tri hang hoa neu xay ra that thoat'
        ]
      }
    ],
    events: [
      {
        id: 'evt-tiki-1',
        title: 'Tech Tour: Trai Nghiem Kho Tu Dong Hoa 500+ Robot AMR Tai Binh Duong',
        format: 'On-site Experience',
        date: '10/01/2027 &bull; 09:00 - 14:00',
        location: 'Tiki Smart MegaHub, VSIP II, Ben Cat, Binh Duong',
        desc: 'Chuong trinh tham quan doc quyen danh cho cac ky su va nha quan ly chuoi cung ung tan mat quan sat ham doi robot AMR tu hanh.'
      }
    ]
  },
  {
    id: 'viconship',
    name: 'Viconship Logistics Group',
    logo: 'images/brands/viconship.svg',
    industry: 'Maritime Port Operations & Multimodal Shipping',
    category: 'logistics',
    tagline: 'Tap doan khai thac cang va dich vu dai ly van tai bien truyen thong hang dau Hai Phong',
    location: 'Hai Phong, Da Nang & TP. Ho Chi Minh',
    size: '2,500+ nhan su',
    founded: '1985',
    website: 'https://viconship.com',
    desc: 'Viconship so huu he thong cang can, bai container va dich vu giao nhan van tai da phuong thuc quoc te, ket noi mang luoi cac lien minh tau bien lon nhat the gioi.',
    techStack: ['Multimodal Shipping ERP', 'Automated Customs EDI', 'Container Gate Vision OCR'],
    stats: { services: 3, plans: 2, events: 1, jobs: 4 },
    services: [
      {
        id: 'srv-vic-1',
        title: 'Dich Vu Dai Ly Hang Tau & Van Tai Duong Bien Quoc Te',
        icon: 'fa-ship',
        desc: 'Cung cap booking tai trong va container tu Viet Nam di My, Chau Au va noi A voi bieu cuoc canh tranh.',
        features: [
          'Hop dong bao dam cho (Space Guarantee) trong mua cao diem',
          'Dai dien giai quyet thu tuc chung tu van don hai ngoai 24/7',
          'Theo doi vi tri tau bien thoi gian thuc'
        ]
      }
    ],
    pricing: [
      {
        id: 'price-vic-quote',
        name: 'Goi Cuoc Van Tai Hop Dong Doanh Nghiep',
        price: 'Bao Gia Theo Tuyen',
        period: '',
        desc: 'Bieu cuoc linh hoat theo tung mua vu voi dieu khoan thanh toan thuan loi cho cac nha xuat khau lon.',
        popular: true,
        features: [
          'Co dinh gia cuoc hop dong ky han dai han 6-12 thang',
          'Mien phi 14 ngay luu bai va luu vo container (Free Demurrage/Detention)',
          'Doi ngu cham soc tai khoan khach hang VIP chuyen nghiep'
        ]
      }
    ],
    events: [
      {
        id: 'evt-vic-1',
        title: 'Hoi Thao Du Bao Xu Huong Gia Cuoc Van Tai Bien Quoc Te 2026',
        format: 'Executive Seminar',
        date: '22/12/2026 &bull; 14:00 - 17:30',
        location: 'Khach san Nam Cuong, TP. Hai Phong',
        desc: 'Phan tich bien dong cac lien minh hang tau (Gemini Cooperation, Premier Alliance) va tac dong toi chi phi xuat khau cua doanh nghiep det may, da giay, dien tu.'
      }
    ]
  }
];

// Current state for active company detail
let currentSelectedCompanyId = 'vinfast';

// Initialize Companies Directory in #view-companies
function initCompaniesDirectory() {
  const grid = document.getElementById('companies-cards-grid');
  if (!grid) return;

  const searchInput = document.getElementById('companies-search-input');
  const tabPills = document.querySelectorAll('.companies-tab-pill');

  let currentCategory = 'all';
  let searchQuery = '';

  function renderCompanies() {
    let filtered = enterpriseCompaniesData;
    if (currentCategory !== 'all') {
      filtered = filtered.filter(c => c.category === currentCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.industry.toLowerCase().includes(q) || 
        c.techStack.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; color: #64748B;">
          <i class="fa-solid fa-building-circle-xmark" style="font-size: 40px; color: #94A3B8; margin-bottom: 12px; display:inline-block;"></i>
          <h3 style="font-size: 17px; color: #1E293B; margin-bottom: 6px; font-weight: 700;">No matching enterprises found</h3>
          <p style="font-size: 13.5px; color: #64748B;">Please try different search keywords or select the \"All\" filter tab.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(c => `
      <article class="company-card-enterprise">
        <div>
          <div class="company-card-top">
            <div class="company-brand-logo-wrap">
              <img src="${c.logo}" alt="${c.name}" class="company-brand-logo-img">
            </div>
            <div class="company-card-header-info">
              <div class="company-card-name-row">
                <h3 class="company-card-name">${c.name}</h3>
                <i class="fa-solid fa-circle-check company-card-verified-badge" title=\"Accredited Enterprise\"></i>
              </div>
              <div class="company-card-tagline">${c.tagline}</div>
              <div class="company-card-meta-pills">
                <span class="company-meta-pill"><i class="fa-solid fa-briefcase"></i> ${c.industry}</span>
                <span class="company-meta-pill"><i class="fa-solid fa-location-dot"></i> ${c.location.split('&')[0].trim()}</span>
              </div>
            </div>
          </div>

          <p class="company-card-desc">${c.desc}</p>

          <div class="company-card-tech-row">
            ${c.techStack.slice(0, 4).map(t => `<span class="company-tech-tag">${t}</span>`).join('')}
          </div>

          <div class="company-card-stats-grid">
            <div>
              <div class="company-stat-num">${c.stats.services}</div>
              <div class=\"company-stat-label\">Services & Tech</div>
            </div>
            <div>
              <div class="company-stat-num">${c.stats.events}</div>
              <div class=\"company-stat-label\">Events</div>
            </div>
            <div>
              <div class="company-stat-num">${c.stats.jobs}</div>
              <div class=\"company-stat-label\">Open Roles</div>
            </div>
          </div>
        </div>

        <div class="company-card-actions">
          <button type="button" class="btn-company-view-profile" onclick="openCompanyDetail('${c.id}')">
            View Profile &amp; Solutions
          </button>
          <button type="button" class="btn-company-contact-now" onclick="openCompanyContactModal('${c.id}')">
            <i class="fa-solid fa-paper-plane"></i> Contact Now
          </button>
        </div>
      </article>
    `).join('');
  }

  // Bind tabs
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

// Open Company Detail View
window.openCompanyDetail = function(companyId) {
  const company = enterpriseCompaniesData.find(c => c.id === companyId) || enterpriseCompaniesData[0];
  currentSelectedCompanyId = company.id;

  if (typeof switchView === 'function') {
    switchView('company-detail');
  }

  // Populate Header
  const logoEl = document.getElementById('company-profile-logo-img');
  const nameEl = document.getElementById('company-profile-name-text');
  const tagEl = document.getElementById('company-profile-tagline-text');
  const indEl = document.getElementById('company-profile-ind-text');
  const locEl = document.getElementById('company-profile-loc-text');
  const sizeEl = document.getElementById('company-profile-size-text');
  const webEl = document.getElementById('company-profile-web-link');

  if (logoEl) logoEl.src = company.logo;
  if (nameEl) nameEl.textContent = company.name;
  if (tagEl) tagEl.textContent = company.tagline;
  if (indEl) indEl.textContent = company.industry;
  if (locEl) locEl.textContent = company.location;
  if (sizeEl) sizeEl.textContent = company.size;
  if (webEl) {
    webEl.href = company.website;
    webEl.textContent = company.website.replace('https://', '');
  }

  // Wire Top "Contact Now" Button
  const topContactBtn = document.getElementById('btn-profile-contact-now-top');
  if (topContactBtn) {
    topContactBtn.onclick = () => openCompanyContactModal(company.id);
  }

  // Render Default Tab: Services
  switchCompanyTab('services');
};

// Switch Tabs inside Company Profile (services, tech, pricing, events, jobs)
window.switchCompanyTab = function(tabName) {
  const company = enterpriseCompaniesData.find(c => c.id === currentSelectedCompanyId) || enterpriseCompaniesData[0];
  document.querySelectorAll('.company-nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  const contentArea = document.getElementById('company-profile-tab-content');
  if (!contentArea) return;

  if (tabName === 'services') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Services &amp; Logistics Capabilities</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Verified technology, automated infrastructure, and logistics capabilities of ${company.name}.</p>
      </div>
      <div class="services-showcase-grid">
        ${(company.services || []).map(s => `
          <div class="service-card-item">
            <div>
              <div class="service-icon-box"><i class="fa-solid ${s.icon}"></i></div>
              <h3 class="service-title">${s.title}</h3>
              <p class="service-desc">${s.desc}</p>
              <ul class="service-features-list">
                ${(s.features || []).map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('')}
              </ul>
            </div>
            <button type="button" class="btn-company-contact-now" onclick="openCompanyContactModal('${company.id}', 'Solutions Inquiry: ${s.title.replace(/'/g, "\'")}')" style="width:100%;">
              <i class="fa-solid fa-paper-plane"></i> Contact Now
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'tech') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Core Technology Stack &amp; Autonomous AI Systems</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">High-throughput distributed systems, predictive optimization, and telemetry deployed at ${company.name}.</p>
      </div>

      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:28px; margin-bottom:28px;">
        <h3 style="font-size:16px; font-weight:700; color:#0F172A; margin:0 0 14px 0;">Core Technology &amp; Infrastructure Stack</h3>
        <div style="display:flex; flex-wrap:wrap; gap:10px;">
          ${company.techStack.map(t => `
            <span style="background:#FFFFFF; border:1px solid #CBD5E1; color:#0F172A; padding:8px 18px; border-radius:8px; font-size:13.5px; font-weight:700; display:inline-flex; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
              <i class="fa-solid fa-microchip" style="color:var(--fl-primary);"></i> ${t}
            </span>
          `).join('')}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:28px;">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:22px;">
          <div style="font-size:16px; font-weight:700; color:var(--fl-primary); margin-bottom:8px; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-brain"></i> Predictive Machine Learning &amp; AI Dispatch Optimization
          </div>
          <p style="font-size:13.5px; color:#475569; line-height:1.6; margin:0;">
            Trained across millions of transport lanes, integrating real-time telemetry and sub-second dispatch optimization algorithms.
          </p>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:22px;">
          <div style="font-size:16px; font-weight:700; color:var(--fl-primary); margin-bottom:8px; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-shield-halved"></i> Zero-Trust Security &amp; Compliance Standards
          </div>
          <p style="font-size:13.5px; color:#475569; line-height:1.6; margin:0;">
            Certified ISO/IEC 27001 and SOC 2 Type II infrastructure with end-to-end mTLS encryption and strict RBAC controls.
          </p>
        </div>
      </div>

      <div style="text-align:center; padding:32px; background:linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-radius:14px;">
        <h3 style="font-size:18px; font-weight:800; color:#1E3A8A; margin:0 0 8px 0;">Need tailored enterprise logistics &amp; AI infrastructure for your organization?</h3>
        <p style="font-size:14px; color:#1E40AF; margin:0 0 18px 0;">Our Solutions Architecture team is ready to design your operational integration roadmap.</p>
        <button type="button" class="btn-profile-contact-primary" onclick="openCompanyContactModal('${company.id}', 'Inquiry for Enterprise AI & Architecture Solutions')" style="margin:0 auto;">
          <i class="fa-solid fa-paper-plane"></i> Contact Solutions Team
        </button>
      </div>
    `;
  } else if (tabName === 'pricing') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Enterprise Pricing &amp; Service Tiers</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Transparent pricing, scalable service levels from pilot deployments to multi-facility operations.</p>
      </div>

      <div class="pricing-showcase-grid">
        ${(company.pricing || []).map(p => `
          <div class="pricing-plan-card ${p.popular ? 'highlighted' : ''}">
            ${p.popular ? '<div class=\"pricing-badge-popular\">POPULAR</div>' : ''}
            <div>
              <h3 class="pricing-plan-name">${p.name}</h3>
              <p class="pricing-plan-desc">${p.desc}</p>
              <div class="pricing-plan-price-row">
                <span class="pricing-price-num">${p.price}</span>
                <span class="pricing-price-period">${p.period}</span>
              </div>
              <ul class="pricing-features-list">
                ${(p.features || []).map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
              </ul>
            </div>
            <button type="button" class="${p.popular ? 'btn-company-contact-now' : 'btn-company-view-profile'}" onclick="openCompanyContactModal('${company.id}', 'Dang ky tu van goi cuoc: ${p.name.replace(/'/g, "\'")}')" style="width:100%; justify-content:center;">
              <i class="fa-solid fa-paper-plane"></i> ${p.price.includes('$') ? 'Inquire This Plan' : 'Contact Now'}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'events') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Industry Conferences, Workshops &amp; Tech Talks</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Register for exclusive industry seminars, logistics keynotes, and technical briefings hosted by ${company.name}.</p>
      </div>

      <div class="events-showcase-grid">
        ${(company.events || []).map(e => `
          <div class="event-card-item">
            <div>
              <div class="event-meta-badge-row">
                <span class="event-format-pill">${e.format}</span>
                <span class="event-date-text"><i class="fa-regular fa-calendar-days"></i> ${e.date.split('&bull;')[0].trim()}</span>
              </div>
              <h3 class="event-card-title">${e.title}</h3>
              <p class="event-card-desc">${e.desc}</p>
              <div class="event-card-location">
                <i class="fa-solid fa-location-dot" style="color:var(--fl-primary);"></i> ${e.location}
              </div>
            </div>
            <div style="display:flex; gap:10px; margin-top:16px;">
              <button type="button" class="btn-company-contact-now" onclick="alert('Dang ky ve tham gia thanh cong: ${e.title.replace(/'/g, "\'")}\nBan to chuc se gui ma QR vao email cua ban.'); this.innerHTML='<i class=\'fa-solid fa-check\'></i> Da Dang Ky';" style="flex:1;">
                <i class=\"fa-solid fa-ticket\"></i> Register (RSVP)
              </button>
              <button type="button" class="btn-company-view-profile" onclick="openCompanyContactModal('${company.id}', 'Hop tac to chuc su kien: ${e.title.replace(/'/g, "\'")}')" style="flex:1;">
                Partner With Us
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'jobs') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Current Open Roles at ${company.name}</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Join accredited engineering and operational teams building next-generation infrastructure.</p>
      </div>
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:24px; text-align:center;">
        <i class="fa-solid fa-briefcase" style="font-size:36px; color:var(--fl-primary); margin-bottom:12px; display:inline-block;"></i>
        <h3 style="font-size:16px; font-weight:700; color:#0F172A; margin-bottom:8px;">Direct Verified Openings</h3>
        <p style="font-size:13.5px; color:#64748B; max-width:500px; margin:0 auto 18px;">
          Browse the complete catalog of verified openings and apply directly through the VietnamJobs portal.
        </p>
        <button type="button" class="btn-company-contact-now" onclick="switchView('browse');" style="margin:0 auto;">
          <i class=\"fa-solid fa-arrow-right\"></i> Open Jobs Directory
        </button>
      </div>
    `;
  }
};

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
  const subject = form.elements['contact_service']?.value || 'Solutions Inquiry';
  const message = form.elements['contact_message']?.value?.trim();
  const targetCompanyId = document.getElementById('contact-target-company-id')?.value || currentSelectedCompanyId;
  const targetCompany = enterpriseCompaniesData.find(c => c.id === targetCompanyId) || enterpriseCompaniesData[0];

  if (!fullname || !email || !phone || !clientCompany) {
    alert('Please complete all required fields (*)');
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

  if (successRef) successRef.textContent = `Ma Ho So Yeu Cau: ${leadId}`;
  if (successCompanyText) {
    successCompanyText.innerHTML = `Your inquiry has been routed to <strong>${targetCompany.name}</strong> enterprise team. A specialist will follow up with you via <strong>${email}</strong> or <strong>${phone}</strong> within 24 business hours.`;
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


  // Window Helper for News Video Player
  window.playNewsVideo = function(videoId, title, category, date, duration, excerpt, elem) {
    const iframe = document.getElementById('news-yt-iframe');
    if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;

    const titleEl = document.getElementById('news-yt-title');
    if (titleEl) titleEl.textContent = title;

    const catEl = document.getElementById('news-yt-category');
    if (catEl) catEl.textContent = category;

    const dateEl = document.getElementById('news-yt-date');
    if (dateEl) dateEl.textContent = date;

    const durEl = document.getElementById('news-yt-duration');
    if (durEl) durEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${duration}`;

    const excerptEl = document.getElementById('news-yt-excerpt');
    if (excerptEl) excerptEl.textContent = excerpt;

    const extLink = document.getElementById('news-yt-external-link');
    if (extLink) extLink.href = `https://www.youtube.com/watch?v=${videoId}`;

    if (elem) {
      document.querySelectorAll('#news-yt-playlist .fw-yt-item').forEach(el => el.classList.remove('active'));
      elem.classList.add('active');
    }
  };

  // Course Tab Listeners
  document.addEventListener('click', (e) => {
    const courseTab = e.target.closest('[data-course-tab]');
    if (courseTab) {
      document.querySelectorAll('[data-course-tab]').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.color = '#475569';
        btn.style.borderColor = '#E2E8F0';
      });
      courseTab.classList.add('active');
      courseTab.style.background = '#0F172A';
      courseTab.style.color = '#fff';
      courseTab.style.borderColor = '#CBD5E1';
      showToast(`Filtering courses: ${courseTab.textContent.trim()}`);
    }
  });
