/* ==========================================================================
   VIETNAM RECRUITMENT MARKETPLACE - APP LOGIC & SPA CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Global State
  const state = {
    currentView: 'home',
    mode: 'work', // 'work' = candidate, 'hire' = employer
    currency: 'VND',
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
      categories: [],
      type: ['Full-Time', 'Part-Time', 'Contract'],
      search: '',
      location: 'all',
      sort: 'latest'
    }
  };

  // Initialize
  initNavigation();
  initAuthModal();
  initSearch();
  initQuickFilterPills();
  initQuickApplyModal();
  initProjectsFeed();
  initFreelancersDirectory();
  initWizardModal();
  initBestJobsShowcase();
  initCompanySpotlight();
  initEnterpriseFeatures();
  updateSavedJobsCountUI();

  loadProjectsFromAPI();

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */
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
    document.getElementById('footer-btn-headhunt')?.addEventListener('click', () => {
      openEnterpriseModal('Headhunt VIP');
    });
  }

  function switchView(viewId) {
    state.currentView = viewId;

    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    const activeEl = document.getElementById(`view-${viewId}`);
    if (activeEl) activeEl.classList.add('active-view');

    // Sync Top Tier-2 Brand Nav Items
    document.querySelectorAll('.brand-nav-item').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'browse') renderBrowseProjects();
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

      const applyBtn = card.querySelector('.btn-apply-primary');
      if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openQuickApplyModal(prjId);
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-save-heart') || e.target.closest('.btn-apply-primary')) return;
        openQuickApplyModal(prjId);
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

  function initProjectsFeed() {
    renderHomeFeaturedProjects();
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
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(state.filters.search) || 
        p.description.toLowerCase().includes(state.filters.search) ||
        (p.company && p.company.toLowerCase().includes(state.filters.search))
      );
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div style="background: #ffffff; border: 1px solid var(--fl-border); border-radius: var(--radius-md); padding: 40px 20px; text-align: center; color: var(--fl-text-muted);">
          <i class="fa-solid fa-briefcase" style="font-size: 32px; color: var(--fl-text-light); margin-bottom: 12px;"></i>
          <h4 style="color: var(--fl-text-heading); margin-bottom: 4px;">Không tìm thấy việc làm phù hợp</h4>
          <p style="font-size: 13.5px;">Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc "Tất cả việc làm".</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(p => createCleanJobCardHTML(p)).join('');
    attachCleanJobCardListeners(feedContainer);
  }

  function renderBrowseProjects() {
    const browseContainer = document.getElementById('browse-projects-feed');
    if (!browseContainer) return;
    browseContainer.innerHTML = state.projects.map(p => createCleanJobCardHTML(p)).join('');
    attachCleanJobCardListeners(browseContainer);
  }

  function createCleanJobCardHTML(p) {
    const isSaved = state.savedJobs.has(p.id);
    const initial = p.company ? p.company.charAt(0).toUpperCase() : 'A';
    const isPromoted = p.promoted || false;
    const applicantCount = p.proposalsCount || 18;
    const salary = p.salaryDisplay || (p.budget ? `${(p.budget.min/1000000).toFixed(0)} - ${(p.budget.max/1000000).toFixed(0)} Triệu / tháng` : '$75,000 - $99,999 USD');

    return `
      <div class="career-job-card ${isPromoted ? 'promoted' : ''}" id="card-${p.id}" data-project-id="${p.id}">
        
        <div class="career-card-left-section">
          <!-- Avatar Icon -->
          <div class="career-avatar-circle ${isPromoted ? 'promoted-icon' : ''}">
            ${isPromoted ? '<i class="fa-solid fa-bolt" style="color:#ea580c;"></i>' : initial}
          </div>

          <!-- Main Career Details -->
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
              <span class="career-location-text"><i class="fa-solid fa-location-dot" style="color:#ea580c; font-size:12px;"></i> ${p.location || 'Hà Nội & TP.HCM'}</span>
              <span class="career-meta-sep">•</span>
              <span class="career-workmode-badge"><i class="fa-solid fa-briefcase" style="font-size:11px;"></i> ${p.workType || 'Full-Time'}</span>
            </div>

            <!-- Full Pills Row -->
            <div class="career-pills-row">
              ${p.boosted !== false ? '<span class="pill-tag-boosted"><i class="fa-solid fa-rocket"></i> Boosted</span>' : ''}
              ${p.featured !== false ? '<span class="pill-tag-featured"><i class="fa-solid fa-crown"></i> Featured</span>' : ''}
              <span class="pill-tag-white"><i class="fa-solid fa-laptop-code"></i> Hybrid / WFH</span>
              <span class="pill-tag-white"><i class="fa-solid fa-gift"></i> Thưởng KPI</span>
              <span class="pill-tag-white"><i class="fa-solid fa-heart-pulse"></i> Bảo hiểm Bảo Việt</span>
            </div>

            <!-- Live Applicant Signal -->
            <div class="career-live-meta">
              <span><i class="fa-solid fa-users" style="color:#0056d2;"></i> <strong>${applicantCount}</strong> người đã nộp CV</span>
              <span class="career-meta-sep">•</span>
              <span><i class="fa-regular fa-clock"></i> Cập nhật 2 giờ trước</span>
            </div>

          </div>
        </div>

        <!-- Prominent Right Column: Salary & Big Action Buttons -->
        <div class="career-card-right-section">
          <div class="career-salary-box">
            <div class="career-salary-text">${salary}</div>
            <div class="career-salary-subbadge"><i class="fa-solid fa-circle-dollar-to-slot"></i> Thu nhập hấp dẫn</div>
          </div>

          <div class="career-action-buttons-group">
            <button class="btn-apply-prominent" data-apply-btn="${p.id}" title="Ứng tuyển nhanh">
              <i class="fa-solid fa-paper-plane"></i> Ứng Tuyển Ngay
            </button>
            <button class="btn-save-pill ${isSaved ? 'saved' : ''}" data-save-job="${p.id}" title="${isSaved ? 'Bỏ lưu' : 'Lưu tin tuyển dụng'}">
              <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart"></i>
              <span>${isSaved ? 'Đã Lưu' : 'Lưu Tin'}</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  function attachCleanJobCardListeners(container) {
    container.querySelectorAll('.career-job-card, .lemon-job-card').forEach(card => {
      const prjId = card.getAttribute('data-project-id');

      card.querySelectorAll('.btn-save-pill, .btn-save-heart').forEach(saveBtn => {
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.savedJobs.has(prjId)) {
            state.savedJobs.delete(prjId);
            showToast('Đã xóa khỏi danh sách đã lưu');
          } else {
            state.savedJobs.add(prjId);
            showToast('❤️ Đã lưu việc làm vào danh sách yêu thích!');
          }
          updateSavedJobsCountUI();
          renderHomeFeaturedProjects();
        });
      });

      card.querySelectorAll('.btn-apply-prominent, .btn-apply-primary').forEach(applyBtn => {
        applyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openQuickApplyModal(prjId);
        });
      });

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-save-pill') || e.target.closest('.btn-save-heart') || e.target.closest('.btn-apply-prominent') || e.target.closest('.btn-apply-primary')) return;
        openQuickApplyModal(prjId);
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

    fileInput?.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleCVFileSelected(fileInput.files[0]);
      }
    });

    function handleCVFileSelected(file) {
      state.attachedCVFile = file;
      if (filenameEl) filenameEl.textContent = file.name;
      if (previewBox) previewBox.style.display = 'flex';
      if (dropzone) dropzone.style.display = 'none';
      showToast(`📄 Đã đính kèm CV: ${file.name}`);
    }

    removeFileBtn?.addEventListener('click', () => {
      state.attachedCVFile = null;
      if (fileInput) fileInput.value = '';
      if (previewBox) previewBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('qa-input-name')?.value || 'Ứng viên';
      const jobTitle = document.getElementById('quick-apply-job-title')?.textContent || 'Vị trí';

      closeModal();
      form.reset();
      state.attachedCVFile = null;
      if (previewBox) previewBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';

      showToast(`🎉 Chúc mừng ${applicantName}! Hồ sơ ứng tuyển vị trí "${jobTitle}" đã được gửi trực tiếp đến bộ phận tuyển dụng.`);
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
        <i class="fa-solid fa-circle-check" style="color: #16a34a; font-size: 11px;"></i>
      `;
    }

    modal.classList.add('show');
  }

  /* ==========================================================================
     ENTERPRISE & B2B RECRUITMENT SUITE
     ========================================================================== */
  function initEnterpriseFeatures() {
    const enterpriseModal = document.getElementById('modal-enterprise-consult');
    const closeBtn = document.getElementById('close-enterprise-consult-modal');
    const cancelBtn = document.getElementById('btn-cancel-enterprise-consult');
    const consultForm = document.getElementById('enterprise-consult-form');

    const openConsultModal = (defaultPlan = null) => {
      if (defaultPlan) {
        const planSelect = document.getElementById('ec-input-plan');
        if (planSelect) {
          if (defaultPlan.includes('Pro')) planSelect.value = 'Business Pro';
          else if (defaultPlan.includes('Headhunt')) planSelect.value = 'Headhunt VIP';
          else if (defaultPlan.includes('Starter')) planSelect.value = 'Starter';
        }
      }
      enterpriseModal?.classList.add('show');
    };

    window.openEnterpriseModal = openConsultModal;

    const closeConsultModal = () => enterpriseModal?.classList.remove('show');

    document.getElementById('nav-btn-headhunt-trigger')?.addEventListener('click', () => openConsultModal('Headhunt VIP'));

    closeBtn?.addEventListener('click', closeConsultModal);
    cancelBtn?.addEventListener('click', closeConsultModal);
    enterpriseModal?.addEventListener('click', (e) => {
      if (e.target === enterpriseModal) closeConsultModal();
    });

    consultForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const compName = document.getElementById('ec-input-company')?.value || 'Doanh Nghiệp';
      const contact = document.getElementById('ec-input-contact-name')?.value || 'Đại diện';

      closeConsultModal();
      showToast(`🏢 Cảm ơn ${contact}! Yêu cầu tư vấn của ${compName} đã được tiếp nhận. Chuyên viên sẽ liên hệ trong vòng 30 phút.`);
    });
  }

  /* ==========================================================================
     WIZARD MODAL (POST A JOB)
     ========================================================================== */
  function initWizardModal() {
    const modal = document.getElementById('modal-wizard');
    const closeBtn = document.getElementById('close-wizard-modal');
    const cancelBtn = document.getElementById('btn-cancel-wizard');
    const form = document.getElementById('wizard-form');

    const closeModal = () => modal?.classList.remove('show');

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('wiz-title').value;
      const company = document.getElementById('wiz-company').value || 'Doanh Nghiệp Tuyển Dụng';
      const desc = document.getElementById('wiz-desc').value;
      const location = document.getElementById('wiz-location').value || 'Hà Nội';
      const minBudget = document.getElementById('wiz-min-budget').value || '20,000,000₫';
      const maxBudget = document.getElementById('wiz-max-budget').value || '35,000,000₫';

      const newPrj = {
        id: `prj-${Date.now()}`,
        title,
        company,
        location,
        salaryDisplay: `${minBudget} – ${maxBudget}`,
        hot: true,
        postedDate: 'Vừa đăng',
        applicantsCount: 0,
        workType: 'Toàn thời gian',
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
     AUTH MODAL
     ========================================================================== */
  function initAuthModal() {
    const modal = document.getElementById('modal-auth');
    const openBtn = document.getElementById('btn-open-auth-modal');
    const closeBtn = document.getElementById('close-auth-modal');
    const form = document.getElementById('auth-form');

    openBtn?.addEventListener('click', () => modal?.classList.add('show'));
    closeBtn?.addEventListener('click', () => modal?.classList.remove('show'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      modal?.classList.remove('show');
      showToast(`Xin chào ${email}! Đăng nhập tài khoản thành công.`);
    });
  }

  /* ==========================================================================
     FREELANCERS & CANDIDATES DIRECTORY
     ========================================================================== */
  function initFreelancersDirectory() {
    const grid = document.getElementById('freelancers-grid');
    if (!grid) return;

    grid.innerHTML = state.freelancers.map(f => `
      <div style="background:#ffffff; border:1px solid var(--fl-border); border-radius:var(--radius-md); padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <div style="width:44px; height:44px; border-radius:50%; background:var(--fl-primary-light); color:var(--fl-primary); font-weight:700; display:flex; align-items:center; justify-content:center; font-size:14px;">
              ${f.avatarText}
            </div>
            <div>
              <h4 style="font-size:15px; font-weight:700; color:var(--fl-text-heading);">${f.name}</h4>
              <div style="font-size:12.5px; color:var(--fl-text-muted);">${f.title}</div>
            </div>
          </div>
          <p style="font-size:13px; color:var(--fl-text-body); line-height:1.5; margin-bottom:12px;">${f.bio || f.tagline}</p>
        </div>
        <button class="btn-signup-red-solid" style="width:100%; justify-content:center; padding:8px;" onclick="alert('Đã gửi lời mời phỏng vấn tới ứng viên ${f.name}');">
          Liên Hệ Ứng Viên
        </button>
      </div>
    `).join('');
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
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

});
