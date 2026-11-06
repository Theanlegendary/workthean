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

  function switchView(viewId, updateHash = true) {
    if (typeof viewId === 'string' && viewId.startsWith('view-')) {
      viewId = viewId.replace('view-', '');
    }
    state.currentView = viewId;

    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    const activeEl = document.getElementById(`view-${viewId}`);
    if (activeEl) {
      void activeEl.offsetWidth; // Trigger reflow for fresh entrance animation
      activeEl.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (viewId === 'courses' && window.coursesController) {
      setTimeout(() => window.coursesController.init(), 30);
    }
    if (viewId === 'companies' && typeof initCompaniesDirectory === 'function') {
      setTimeout(() => initCompaniesDirectory(), 30);
    }
    document.querySelectorAll('.nav-link[data-view]').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Sync Top Tier-2 Brand Nav Items
    document.querySelectorAll('.brand-nav-item').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    if (updateHash && viewId !== 'job-detail') {
      history.replaceState(null, null, ' ');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'browse') renderBrowseProjects();
  }

  /* ==========================================================================
     URL ROUTING (SUPPORT DIRECT LINK WITH JOB ID)
     ========================================================================== */
  function handleUrlRouting() {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);

    let jobId = urlParams.get('id');

    if (!jobId && hash.includes('id=')) {
      const match = hash.match(/id=([^&]+)/);
      if (match) jobId = decodeURIComponent(match[1]);
    }

    if (jobId) {
      showJobDetail(jobId, false);
    }
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
      if (userNameEl) userNameEl.textContent = user.name || 'Ứng viên';
      if (dropNameEl) dropNameEl.textContent = user.name || 'Ứng viên';
      if (dropEmailEl) dropEmailEl.textContent = user.email || 'user@vietnamjobs.vn';
      if (dropRoleEl) dropRoleEl.textContent = user.role === 'Employer' ? '🏢 Nhà Tuyển Dụng' : '⭐ Ứng Viên VIP';

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
      closeModal();
      showToast(`🎉 Xin chào ${user.name}! Đăng nhập thành công vào VietnamJobs.`);
    });

    // 1-Click Demo Login
    document.getElementById('btn-quick-demo-login')?.addEventListener('click', () => {
      const demoUser = {
        name: 'Thean Lê',
        email: 'thean.le@vietnamjobs.vn',
        role: 'Candidate',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('vietnamjobs_auth_user', JSON.stringify(demoUser));
      renderUserAuthUI(demoUser);
      closeModal();
      showToast('⚡ Đã đăng nhập nhanh với tài khoản mẫu (Thean Lê)!');
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
      closeModal();
      showToast(`🎊 Chúc mừng ${name}! Tạo tài khoản thành công.`);
    });

    // Logout
    logoutBtn?.addEventListener('click', () => {
      localStorage.removeItem('vietnamjobs_auth_user');
      renderUserAuthUI(null);
      userDropdown?.classList.remove('show');
      showToast('👋 Bạn đã đăng xuất thành công khỏi hệ thống.');
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
      showToast('📄 Bạn đang có 1 hồ sơ đang trong quy trình xét duyệt.');
    });

    document.getElementById('dropdown-btn-post-job')?.addEventListener('click', () => {
      userDropdown?.classList.remove('show');
      openWizardModal();
    });

    document.getElementById('link-forgot-pass')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📩 Vui lòng liên hệ tổng đài 1900 6868 hoặc email support@vietnamjobs.vn để đặt lại mật khẩu.');
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
      document.getElementById('header-top-search-input'),
      document.getElementById('top-capsule-search-input')
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
  window.switchView = switchView;

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
          <h3 style="font-size: 17px; color: #1E293B; margin-bottom: 6px; font-weight: 700;">Không tìm thấy doanh nghiệp phù hợp</h3>
          <p style="font-size: 13.5px; color: #64748B;">Vui lòng thử từ khóa tìm kiếm khác hoặc chọn tab "Tất cả".</p>
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
                <i class="fa-solid fa-circle-check company-card-verified-badge" title="Doanh Nghiệp Đã Được Xác Thực"></i>
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
              <div class="company-stat-label">Dịch Vụ & SP</div>
            </div>
            <div>
              <div class="company-stat-num">${c.stats.events}</div>
              <div class="company-stat-label">Sự Kiện Tech</div>
            </div>
            <div>
              <div class="company-stat-num">${c.stats.jobs}</div>
              <div class="company-stat-label">Vị Trí Mở</div>
            </div>
          </div>
        </div>

        <div class="company-card-actions">
          <button type="button" class="btn-company-view-profile" onclick="openCompanyDetail('${c.id}')">
            Xem Hồ Sơ &amp; Báo Giá
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
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Dịch Vụ &amp; Giải Pháp Cung Cấp</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Các giải pháp công nghệ, AI và dịch vụ vận hành đã được xác thực của ${company.name}.</p>
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
            <button type="button" class="btn-company-contact-now" onclick="openCompanyContactModal('${company.id}', 'Tư vấn giải pháp: ${s.title.replace(/'/g, "\'")}')" style="width:100%;">
              <i class="fa-solid fa-paper-plane"></i> Contact Now
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'tech') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Công Nghệ Nền Tảng &amp; Ứng Dụng Trí Tuệ Nhân Tạo (AI)</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Kiến trúc phần mềm phân tán, mô hình Machine Learning và công nghệ đang vận hành tại ${company.name}.</p>
      </div>

      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:28px; margin-bottom:28px;">
        <h3 style="font-size:16px; font-weight:700; color:#0F172A; margin:0 0 14px 0;">Ngăn Xếp Công Nghệ (Core Tech Stack)</h3>
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
            <i class="fa-solid fa-brain"></i> Mô Hình Học Máy &amp; AI Tối Ưu Lộ Trình
          </div>
          <p style="font-size:13.5px; color:#475569; line-height:1.6; margin:0;">
            Hệ thống huấn luyện trên hơn 12 triệu lượt chuyến xe tải thực tế tại Việt Nam, tích hợp xử lý dữ liệu cảm biến IoT thời gian thực để đưa ra quyết định dispatch tự động với độ trễ dưới 2 giây.
          </p>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:22px;">
          <div style="font-size:16px; font-weight:700; color:var(--fl-primary); margin-bottom:8px; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-shield-halved"></i> Bảo Mật &amp; Chuẩn An Toàn Dữ Liệu
          </div>
          <p style="font-size:13.5px; color:#475569; line-height:1.6; margin:0;">
            Hạ tầng tuân thủ tiêu chuẩn ISO/IEC 27001 và SOC 2 Type II, hỗ trợ mã hóa đầu cuối mTLS và phân quyền dữ liệu theo vai trò (RBAC) nghiêm ngặt cho đối tác doanh nghiệp.
          </p>
        </div>
      </div>

      <div style="text-align:center; padding:32px; background:linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-radius:14px;">
        <h3 style="font-size:18px; font-weight:800; color:#1E3A8A; margin:0 0 8px 0;">Cần tư vấn kiến trúc công nghệ &amp; AI phù hợp cho doanh nghiệp của bạn?</h3>
        <p style="font-size:14px; color:#1E40AF; margin:0 0 18px 0;">Đội ngũ Solutions Architect của ${company.name} sẵn sàng đồng hành cùng bạn thiết kế lộ trình chuyển đổi.</p>
        <button type="button" class="btn-profile-contact-primary" onclick="openCompanyContactModal('${company.id}', 'Tư vấn giải pháp kiến trúc công nghệ &amp; AI')" style="margin:0 auto;">
          <i class="fa-solid fa-paper-plane"></i> Contact Now Để Nhận Tư Vấn
        </button>
      </div>
    `;
  } else if (tabName === 'pricing') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Bảng Giá &amp; Gói Dịch Vụ Doanh Nghiệp</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Minh bạch chi phí, linh hoạt mở rộng quy mô từ thử nghiệm đến tập đoàn đa quốc gia.</p>
      </div>

      <div class="pricing-showcase-grid">
        ${(company.pricing || []).map(p => `
          <div class="pricing-plan-card ${p.popular ? 'highlighted' : ''}">
            ${p.popular ? '<div class="pricing-badge-popular">ĐƯỢC ƯA CHUỘNG</div>' : ''}
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
            <button type="button" class="${p.popular ? 'btn-company-contact-now' : 'btn-company-view-profile'}" onclick="openCompanyContactModal('${company.id}', 'Đăng ký tư vấn gói cước: ${p.name.replace(/'/g, "\'")}')" style="width:100%; justify-content:center;">
              <i class="fa-solid fa-paper-plane"></i> ${p.price.includes('₫') ? 'Inquire This Plan' : 'Contact Now'}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'events') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Sự Kiện, Hội Thảo Công Nghệ &amp; Tech Talks</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Đăng ký tham gia các sự kiện chuyên môn, workshop thực chiến và diễn đàn chuyển đổi số do ${company.name} tổ chức.</p>
      </div>

      <div class="events-showcase-grid">
        ${(company.events || []).map(e => `
          <div class="event-card-item">
            <div>
              <div class="event-meta-badge-row">
                <span class="event-format-pill">${e.format || e.type || e.badge || "Trực Tuyến &amp; Trực Tiếp"}</span>
                <span class="event-date-text"><i class="fa-regular fa-calendar-days"></i> ${e.date.split('•')[0].trim()}</span>
              </div>
              <h3 class="event-card-title">${e.title}</h3>
              <p class="event-card-desc">${e.desc}</p>
              <div class="event-card-location">
                <i class="fa-solid fa-location-dot" style="color:var(--fl-primary);"></i> ${e.location}
              </div>
            </div>
            <div style="display:flex; gap:10px; margin-top:16px;">
              <button type="button" class="btn-company-contact-now" onclick="alert('Đăng ký vé tham gia thành công: ${e.title.replace(/'/g, "\'")}\nBan tổ chức sẽ gửi mã QR vào email của bạn.'); this.innerHTML='<i class=\'fa-solid fa-check\'></i> Đã Đăng Ký';" style="flex:1;">
                <i class="fa-solid fa-ticket"></i> Đăng Ký Tham Gia (RSVP)
              </button>
              <button type="button" class="btn-company-view-profile" onclick="openCompanyContactModal('${company.id}', 'Hợp tác tổ chức sự kiện: ${e.title.replace(/'/g, "\'")}')" style="flex:1;">
                Liên Hệ Hợp Tác
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'life') {
    const posts = company.lifePosts || [
      {
        id: 'post-1',
        author: 'Alex Byelyavtsev',
        authorBadge: '3rd+',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        authorTitle: `Master Mariner (Captain) | ${company.name}`,
        websiteLink: 'Visit my website',
        time: '4d • 🌐',
        text: 'New on illuminem Voices: The Resilience Test: Heatwave (3 of 3). In summer 2026 heat raised Europe\'s cooling demands while green maritime technologies navigated unprecedented conditions across global supply chain corridors.',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
        likesCount: 2,
        commentsCount: 1,
        repostsCount: 1
      },
      {
        id: 'post-2',
        author: 'Kristina Garbe',
        authorBadge: '3rd+',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
        authorTitle: `Key Client Director Automotive at ${company.name}`,
        websiteLink: '',
        time: '5d • 🌐',
        text: 'Beyond Ambition: What 25 Electric Trucks in Germany teach Us About Scaling Zero-Emission Logistics across multi-modal networks and accelerating supply chain decarbonization.',
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
        likesCount: 91,
        commentsCount: 6,
        repostsCount: 3
      },
      {
        id: 'post-3',
        author: 'Đặng Minh Tuấn',
        authorBadge: '1st',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
        authorTitle: `Head of Ocean Freight & Port Operations | ${company.name} Vietnam`,
        websiteLink: '',
        time: '2d • 🌐',
        text: 'Tự hào đón siêu tàu mẹ 24,000 TEUs cập cảng nước sâu Cái Mép tuần này! Đội ngũ logistics tại chỗ vận hành 24/7 bảo đảm giải phóng hàng thông suốt cho khách hàng xuất khẩu dệt may & thủy sản sang Bắc Mỹ.',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
        likesCount: 142,
        commentsCount: 18,
        repostsCount: 12
      }
    ];

    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 4px 0;">
              Trending employee content
            </h2>
            <p style="font-size: 14px; color: #64748B; margin: 0;">
              Posts from ${company.name} employees &amp; leaders
            </p>
          </div>
          <button type="button" class="btn-company-contact-now" onclick="openCompanyContactModal('${company.id}', 'Gặp gỡ và kết nối đội ngũ ${company.name}')">
            <i class="fa-solid fa-user-plus"></i> Kết Nối Với Đội Ngũ
          </button>
        </div>
      </div>

      <div class="company-life-posts-grid">
        ${posts.map(p => `
          <div class="linkedin-post-card">
            <div class="li-post-header">
              <img src="${p.authorAvatar}" alt="${p.author}" class="li-author-avatar">
              <div class="li-author-info">
                <div class="li-author-name-row">
                  <span class="li-author-name">${p.author}</span>
                  <span class="li-degree-badge">${p.authorBadge}</span>
                </div>
                <div class="li-author-title">${p.authorTitle}</div>
                ${p.websiteLink ? `<a href="#" onclick="showToast('Mở liên kết tác giả: ${p.websiteLink}'); return false;" class="li-author-link">${p.websiteLink}</a>` : ''}
                <div class="li-post-timestamp">${p.time}</div>
              </div>
            </div>
            <div class="li-post-content">
              <p>${p.text}</p>
            </div>
            ${p.image ? `
              <div class="li-post-media">
                <img src="${p.image}" alt="Post Media" loading="lazy">
              </div>
            ` : ''}
            <div class="li-post-social-counts">
              <div class="li-reaction-icons">
                <span class="reaction-badge thumb">👍</span>
                <span class="reaction-badge light">💡</span>
                <span class="reaction-badge clap">👏</span>
                <span class="li-count-text">${p.likesCount}</span>
              </div>
              <div class="li-comments-count">
                <span>${p.commentsCount} comments</span>
                ${p.repostsCount ? `<span>• ${p.repostsCount} reposts</span>` : ''}
              </div>
            </div>
            <div class="li-post-actions-row">
              <button type="button" class="li-action-btn" onclick="this.classList.toggle('active');"><i class="fa-regular fa-thumbs-up"></i> Like</button>
              <button type="button" class="li-action-btn" onclick="showToast('Bình luận trên bài viết của ${p.author}');"><i class="fa-regular fa-comment-dots"></i> Comment</button>
              <button type="button" class="li-action-btn" onclick="showToast('Đã chia sẻ bài viết của ${p.author}');"><i class="fa-solid fa-retweet"></i> Repost</button>
              <button type="button" class="li-action-btn" onclick="openCompanyContactModal('${company.id}', 'Liên hệ trực tiếp với nhân sự: ${p.author}');"><i class="fa-regular fa-paper-plane"></i> Send</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabName === 'jobs') {
    contentArea.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">Vị Trí Tuyển Dụng Đang Mở Tại ${company.name}</h2>
        <p style="font-size: 14px; color: #64748B; margin: 0;">Gia nhập đội ngũ kỹ sư và chuyên gia hàng đầu kiến tạo giải pháp tương lai.</p>
      </div>
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:24px; text-align:center;">
        <i class="fa-solid fa-briefcase" style="font-size:36px; color:var(--fl-primary); margin-bottom:12px; display:inline-block;"></i>
        <h3 style="font-size:16px; font-weight:700; color:#0F172A; margin-bottom:8px;">Các Vị Trí Tuyển Dụng Trực Tiếp</h3>
        <p style="font-size:13.5px; color:#64748B; max-width:500px; margin:0 auto 18px;">
          Xem danh sách đầy đủ các cơ hội nghề nghiệp và nộp hồ sơ trực tuyến qua bảng việc làm VietnamJobs.
        </p>
        <button type="button" class="btn-company-contact-now" onclick="switchView('browse');" style="margin:0 auto;">
          <i class="fa-solid fa-arrow-right"></i> Mở Bảng Việc Làm Tuyển Dụng
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
      'Among those attempting to enter, 103 people were arrested and sent to court, while the remainder were denied entry and recorded on international biometric registries.',
      'Several of the individuals were barred from entry due to their place on watchlists, while others used forged passports, fake visas, counterfeit entry and exit stamps or other falsified customs papers.',
      'Others had no clear purpose for travel or held invalid trade passports, disrupting regional logistics clearance protocols.',
      'Of the 991 individuals who attempted to leave the Kingdom, immigration officials detained 270, then sent them to court. Another 721 were identified as victims of human trafficking and allowed to return safely to their homes under humanitarian assistance programs.',
      'During the same period, GDI officials prevented 218 Cambodian nationals from exiting the country, after suspicions were raised that they were at risk of being trafficked into illicit operations.',
      'It reported that during the same nine-month period, 5,410 Cambodian nationals left the country through legitimate recruitment and certified cross-border logistics workforce agreements.',
      'The GDI also coordinated the repatriation of 5,568 Cambodian nationals from foreign jurisdictions, reinforcing digital border verification protocols with Vietnam, Thailand, and regional trade partners.'
    ],
    topics: ['Cambodia', 'Immigration', 'Ministry of Interior', 'Border Trade', 'Deportation', 'Cross-Border Logistics', 'ASEAN Corridor'],
    relatedStories: [
      { id: 'art-cross-border', title: 'Cross-Border Tech Hiring Guidelines & Global Remote Tax Treaties for 2026', time: '6 November 2026' },
      { id: 'art-ai-dispatch', title: 'Autonomous AI Dispatch Engines in Southern Vietnam Container Corridors', time: '5 November 2026' },
      { id: 'art-cai-mep', title: 'Siêu Tàu Container 24,000 TEUs Cập Cảng Cái Mép: Bước Ngoặt Chuỗi Cung Ứng', time: '4 November 2026' }
    ]
  },
  {
    id: 'art-cross-border',
    tag: 'Policy & Tax',
    sec: 'Cross-Border Logistics',
    title: 'Cross-Border Tech Hiring Guidelines & Global Remote Tax Treaties for 2026',
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
      'Hệ thống tự động liên thông dữ liệu mã số thuế cá nhân và mã định danh doanh nghiệp giúp giảm thiểu 80% thời gian giải trình hồ sơ hoàn thuế khấu trừ tại nguồn (Withholding Tax).',
      'Đại diện Hiệp hội Doanh nghiệp Dịch vụ Logistics Việt Nam (VLA) nhận định đây là bước tiến đột phá, giúp các công ty logistics nội địa dễ dàng thuê mướn các chuyên gia công nghệ chuỗi cung ứng hàng đầu toàn cầu mà không vướng rào cản pháp lý thuế quan.'
    ],
    topics: ['Tax Treaty', 'Cross-Border', 'Labor Law', 'Logistics Workforce', 'ASEAN', 'Remote Work'],
    relatedStories: [
      { id: 'art-gdi', title: 'GDI identify more than 5,000 attempts to illegally enter/exit Kingdom; 373 charged', time: '30 October 2026' },
      { id: 'art-ai-dispatch', title: 'Autonomous AI Dispatch Engines in Southern Vietnam Container Corridors', time: '2 October 2026' },
      { id: 'art-cold-chain', title: 'WHO-GDP Cold Storage Infrastructure Standards for Pharma Logistics', time: '12 October 2026' }
    ]
  },
  {
    id: 'art-ai-dispatch',
    tag: 'Smart Logistics',
    sec: 'AI & Automation',
    title: 'Autonomous AI Dispatch Engines in Southern Vietnam Container Corridors',
    author: 'Kỹ sư Lê Hoàng Nam',
    location: 'TP. Hồ Chí Minh & Bà Rịa - Vũng Tàu',
    date: 'Published 2 October 2026, 08:00 ICT',
    heroImg: 'images/editorial_ai_robotics_hd.jpg',
    caption: 'Hệ thống phân luồng container thông minh bằng AI tại cụm cảng nước sâu Cái Mép - Thị Vải. <b>VPA / Logistics Tech</b>',
    listenMeta: '3 mins • AI voice',
    lead: 'Các thuật toán học sâu (Deep Learning) kết hợp mạng cảm biến IoT trên quốc lộ 51 đang rút ngắn hơn 42% thời gian chờ tại cổng cảng Cái Mép - Thị Vải, tiết kiệm hàng triệu lít nhiên liệu mỗi tháng.',
    paragraphs: [
      'Mô hình điều vận thời gian thực phân tích lưu lượng giao thông, tình trạng bến bãi và lịch trình cập cầu của các tàu mẹ siêu trọng tải để phát hành khung giờ Gate-in tối ưu cho từng xe container kéo hàng.',
      'Tài xế nhận lệnh điện tử thông qua ứng dụng di động kết nối trực tiếp với hệ thống TOS (Terminal Operating System) của cảng, tự động mở barie nhận dạng biển số và mã container qua camera AI trong vòng 1.8 giây.',
      'Kết quả thử nghiệm 6 tháng qua cho thấy độ trễ trung bình của các chuyến hàng xuất khẩu từ Bình Dương và Đồng Nai về cảng đã giảm từ 4.5 giờ xuống còn 2.6 giờ.',
      'Dự án dự kiến sẽ được mở rộng ra toàn bộ các trung tâm ICD tại Thủ Đức và Long Bình trong quý 1 năm tới.'
    ],
    topics: ['AI Dispatch', 'Cai Mep Port', 'Smart Logistics', 'IoT Sensors', 'Automation', 'Container'],
    relatedStories: [
      { id: 'art-cai-mep', title: 'Siêu Tàu Container 24,000 TEUs Cập Cảng Cái Mép: Bước Ngoặt Chuỗi Cung Ứng', time: '4 November 2026' },
      { id: 'art-cross-border', title: 'Cross-Border Tech Hiring Guidelines & Global Remote Tax Treaties for 2026', time: '28 September 2026' },
      { id: 'art-cold-chain', title: 'WHO-GDP Cold Storage Infrastructure Standards for Pharma Logistics', time: '12 October 2026' }
    ]
  },
  {
    id: 'art-cold-chain',
    tag: 'Healthcare Logistics',
    sec: 'Cold Chain 4.0',
    title: 'WHO-GDP Cold Storage Infrastructure Standards for Pharma Logistics',
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
      'Sự chuyển dịch này đang tạo ra làn sóng đầu tư mạnh mẽ vào các kho lạnh thế hệ mới tại các vùng kinh tế trọng điểm phía Nam và phía Bắc.',
      'Các doanh nghiệp sở hữu chứng chỉ GDP đạt chuẩn sẽ được cấp luồng xanh ưu tiên thủ tục thông quan tại các cửa khẩu hàng không Nội Bài và Tân Sơn Nhất.'
    ],
    topics: ['Cold Chain', 'Pharma Logistics', 'WHO-GDP', 'Vaccine Storage', 'Temperature Control'],
    relatedStories: [
      { id: 'art-gdi', title: 'GDI identify more than 5,000 attempts to illegally enter/exit Kingdom; 373 charged', time: '30 October 2026' },
      { id: 'art-ai-dispatch', title: 'Autonomous AI Dispatch Engines in Southern Vietnam Container Corridors', time: '2 October 2026' },
      { id: 'art-cross-border', title: 'Cross-Border Tech Hiring Guidelines & Global Remote Tax Treaties for 2026', time: '28 September 2026' }
    ]
  },
  {
    id: 'art-cai-mep',
    tag: 'Maritime',
    sec: 'Deep Sea Ports',
    title: 'Siêu Tàu Container 24,000 TEUs Cập Cảng Cái Mép: Bước Ngoặt Chuỗi Cung Ứng Xuyên Thái Bình Dương',
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
    topics: ['Cái Mép', 'Container Shipping', 'Ocean Freight', 'Trans-Pacific', 'Ports', 'Direct Service'],
    relatedStories: [
      { id: 'art-ai-dispatch', title: 'Autonomous AI Dispatch Engines in Southern Vietnam Container Corridors', time: '2 October 2026' },
      { id: 'art-gdi', title: 'GDI identify more than 5,000 attempts to illegally enter/exit Kingdom; 373 charged', time: '30 October 2026' },
      { id: 'art-cold-chain', title: 'WHO-GDP Cold Storage Infrastructure Standards for Pharma Logistics', time: '12 October 2026' }
    ]
  }
];

// Open and hydrate any article by ID
window.openArticle = function(articleId) {
  const art = articlesDatabase.find(a => a.id === articleId) || articlesDatabase[0];

  // Hydrate DOM elements
  const elTag = document.getElementById('art-tag');
  const elSec = document.getElementById('art-sec');
  const elHeadline = document.getElementById('art-headline');
  const elAuthor = document.getElementById('art-author');
  const elLocation = document.getElementById('art-location');
  const elDate = document.getElementById('art-date');
  const elHeroImg = document.getElementById('art-hero-img');
  const elCaption = document.getElementById('art-caption');
  const elListenMeta = document.getElementById('art-listen-meta');
  const elBody = document.getElementById('art-body');
  const elCrumbCat = document.getElementById('art-crumb-cat');
  const elCrumbTitle = document.getElementById('art-crumb-title');

  if (elTag) elTag.textContent = art.tag.toUpperCase();
  if (elSec) elSec.textContent = art.sec;
  if (elHeadline) elHeadline.textContent = art.title;
  if (elAuthor) elAuthor.textContent = art.author;
  if (elLocation) elLocation.textContent = art.location;
  if (elDate) elDate.textContent = art.date;
  if (elHeroImg) {
    elHeroImg.src = art.heroImg;
    elHeroImg.alt = art.title;
  }
  if (elCaption) elCaption.innerHTML = art.caption;
  if (elListenMeta) elListenMeta.textContent = art.listenMeta;

  if (elCrumbCat) elCrumbCat.textContent = art.sec;
  if (elCrumbTitle) {
    elCrumbTitle.textContent = art.title.length > 35 ? art.title.slice(0, 35) + '...' : art.title;
  }

  // Hydrate Body
  if (elBody) {
    elBody.innerHTML = `
      <p class="lead">${art.lead}</p>
      ${art.paragraphs.map((p, idx) => {
        if (idx === 2) {
          return `
            <p>${p}</p>
            <blockquote>
              "Minh bạch pháp lý và số hóa quy trình thông quan là chìa khóa then chốt để hạ tầng logistics Việt Nam &amp; ASEAN bứt phá cạnh tranh toàn cầu."
            </blockquote>
          `;
        }
        return `<p>${p}</p>`;
      }).join('')}
    `;
  }

  // Hydrate More on this story
  const elMoreList = document.getElementById('art-more-list');
  if (elMoreList) {
    elMoreList.innerHTML = (art.relatedStories || []).map(r => `
      <li>
        <a href="#" onclick="openArticle('${r.id}'); return false;">
          <span class="dot"></span>
          <span>${r.title}<span class="sz">${r.time}</span></span>
        </a>
      </li>
    `).join('');
  }

  // Hydrate Related Topics
  const elTopics = document.getElementById('art-topics-list');
  if (elTopics) {
    elTopics.innerHTML = (art.topics || []).map(t => `
      <a class="pill" href="#" onclick="showToast('Chủ đề: ${t}'); return false;">${t} <span>+</span></a>
    `).join('');
  }

  // Hydrate Keep Reading 3x2 Grid
  const elGrid3 = document.getElementById('art-keep-reading-grid');
  if (elGrid3) {
    const otherArticles = articlesDatabase.filter(a => a.id !== art.id);
    const displayList = [...otherArticles, ...articlesDatabase].slice(0, 6);
    elGrid3.innerHTML = displayList.map(item => `
      <a class="card" href="#" onclick="openArticle('${item.id}'); return false;">
        <div class="thumb"><img src="${item.heroImg}" alt="${item.title}" loading="lazy"></div>
        <span class="cat">${item.tag}</span>
        <h3>${item.title}</h3>
        <span class="t">
          <svg class="clock" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          ${item.date.split(',')[0].replace('Published ', '')}
        </span>
      </a>
    `).join('');
  }

  // Hydrate Sidebar Latest News
  const elSidebarNews = document.getElementById('art-sidebar-newslist');
  if (elSidebarNews) {
    const newsItems = [
      { id: 'art-gdi', title: 'GDI identify more than 5,000 attempts to illegally enter/exit Kingdom', time: '12 mins ago', img: 'images/editorial_ai_logistics_hd.jpg' },
      { id: 'art-cai-mep', title: 'Cụm cảng Cái Mép đón chuyến tàu mẹ container 24,000 TEUs sang bờ Tây Mỹ', time: '35 mins ago', img: 'images/hero_1.jpg' },
      { id: 'art-ai-dispatch', title: 'AI điều vận bến bãi rút ngắn 42% thời gian chờ giải phóng hàng', time: '1 hr ago', img: 'images/editorial_ai_robotics_hd.jpg' },
      { id: 'art-cross-border', title: 'Tổng cục Thuế hướng dẫn biểu thuế tránh đánh thuế hai lần cho chuyên gia', time: '2 hrs ago', img: 'images/lead_story.jpg' },
      { id: 'art-cold-chain', title: 'Chuẩn WHO-GDP áp dụng cho 100% kho lạnh dược phẩm từ năm 2027', time: '3 hrs ago', img: 'images/editorial_tech_salaries_hd.png' },
      { id: 'art-cai-mep', title: 'Tân Cảng Sài Gòn tự động hóa hoàn toàn luồng khai báo hải quan điện tử', time: '5 hrs ago', img: 'images/news_1.jpg' },
      { id: 'art-cross-border', title: 'Hàng không Nội Bài mở thêm đường bay chuyên chở hàng hóa đi Frankfurt', time: '7 hrs ago', img: 'images/news_2.jpg' },
      { id: 'art-ai-dispatch', title: 'Ra mắt cổng thông tin truy xuất nguồn gốc container chuỗi lạnh xuất khẩu', time: '9 hrs ago', img: 'images/news_3.jpg' }
    ];
    elSidebarNews.innerHTML = newsItems.map(item => `
      <li>
        <a href="#" onclick="openArticle('${item.id}'); return false;">
          <img src="${item.img}" alt="" loading="lazy">
          <div>
            <h3>${item.title}</h3>
            <span class="t">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              ${item.time}
            </span>
          </div>
        </a>
      </li>
    `).join('');
  }

  // Switch View
  if (typeof switchView === 'function') {
    switchView('article');
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
