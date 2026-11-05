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
    if (viewId === 'jobs') viewId = 'browse';
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
      if (bView === viewId || (bView === 'jobs' && viewId === 'browse') || (bView === 'browse' && viewId === 'browse')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sync Mobile Drawer Items
    document.querySelectorAll('.drawer-item').forEach(btn => {
      const bView = btn.getAttribute('data-view');
      if (bView === viewId || (bView === 'jobs' && viewId === 'browse') || (bView === 'browse' && viewId === 'browse')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (updateHash && viewId !== 'job-detail') {
      history.replaceState(null, null, ' ');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'browse') renderBrowseProjects();
    if (viewId === 'companies' && typeof initCompaniesDirectory === 'function') initCompaniesDirectory();
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
                <span class="badge-hot-tag"><i class="fa-solid fa-fire"></i> GẤP</span>
              </div>

              <div class="career-company-row">
                <span class="company-name-bold">${p.company || p.clientName || 'Doanh Nghiệp'}</span>
                <i class="fa-solid fa-circle-check career-verified-check"></i>
                <span class="career-meta-sep">•</span>
                <span class="career-location-text"><i class="fa-solid fa-location-dot" style="color:var(--fl-primary);"></i> ${p.location || 'Hà Nội & TP.HCM'}</span>
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
                Xem Chi Tiết <i class="fa-solid fa-arrow-right"></i>
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
        <div class="career-job-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:22px; cursor:default;">
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
      return `
        <article class="job-card ${isSelected ? 'active' : ''}" data-job-id="${job.id}" onclick="selectEnterpriseJob('${job.id}')" style="cursor:pointer;">
          <div class="job-card-top-row" style="display:flex; gap:12px; align-items:flex-start;">
            <div class="linkedin-card-logo" style="width:44px; height:44px; flex-shrink:0;">
              <img src="${job.companyLogo}" alt="${job.company}" class="linkedin-brand-img" style="width:100%; height:100%; object-fit:contain; background:transparent;">
            </div>
            <div class="job-card-header-info" style="flex:1; min-width:0;">
              <h3 class="linkedin-card-title" style="font-size:14.5px; font-weight:700; color:#0A66C2; margin:0 0 2px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                ${job.title}
              </h3>
              <div class="linkedin-card-company" style="font-size:12.5px; color:#475569; font-weight:500; margin-bottom:2px;">
                ${job.company}
              </div>
              <div style="font-size:12px; color:#64748B; margin-bottom:3px;">
                ${job.location}
              </div>
              <div style="font-size:13px; font-weight:700; color:#0F172A; margin-bottom:3px;">
                ${job.salary}
              </div>
              <div style="font-size:11.5px; color:#94A3B8; font-weight:500;">
                ${job.time} • ${job.applicants}
              </div>
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
              <span>•</span>
              <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
              <span>•</span>
              <span style="color:#059669; font-weight:600;"><i class="fa-solid fa-clock"></i> ${job.time}</span>
            </div>
          </div>
          <div style="width:56px; height:56px; flex-shrink:0;">
            <img src="${job.companyLogo}" alt="${job.company}" style="width:100%; height:100%; object-fit:contain; background:transparent;">
          </div>
        </div>

        <div style="display:flex; gap:12px; margin-top:16px;">
          <button type="button" class="btn-linkedin-easy-apply" onclick="alert('Cảm ơn bạn đã ứng tuyển vị trí: ${job.title}! Hồ sơ của bạn đã được gửi trực tiếp đến bộ phận tuyển dụng.');" style="background:var(--fl-primary); color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:700; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-paper-plane"></i> Apply Now
          </button>
          <button type="button" class="btn-linkedin-save-job" onclick="this.innerHTML = '<i class=\'fa-solid fa-bookmark\'></i> Saved'; this.style.borderColor='var(--fl-primary)'; this.style.color='var(--fl-primary)';" style="background:#fff; border:1px solid #CBD5E1; color:#475569; padding:10px 18px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
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
    <article class="career-card-item reveal" onclick="alert('Chương trình đào tạo: ${item.title}\nQuy mô: ${item.modules}\nLượt học viên: ${item.views}');" style="cursor:pointer;">
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
                <span class="event-format-pill">${e.format}</span>
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
      showToast(`Đang lọc khóa học: ${courseTab.textContent.trim()}`);
    }
  });
