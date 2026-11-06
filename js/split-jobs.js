/* ==========================================================================
   VIỆC LÀM MỚI VIEW (#view-browse) - FULL-WIDTH JOB CARDS ENGINE
   Renders ONLY for the 'Việc Làm Mới' view (#view-browse).
   THE HOMEPAGE (#view-home) REMAINS 100% UNTOUCHED WITH ITS ORIGINAL 2-COLUMN SPLIT VIEW.
   ========================================================================== */

(function () {
  'use strict';

  const companyAccentColors = {
    'vinfast': '#003366',
    'dhl': '#FFCC00',
    'saigon-newport': '#004080',
    'logivan': '#FF6600',
    'viconship': '#003366',
    'tiki': '#189EFF',
    'fpt': '#F37021',
    'kuehne-nagel': '#003366',
    'slp-vietnam': '#008060',
    'gemadept': '#004B87',
    'viettel': '#EE0033',
    'shopee': '#EE4D2D',
    'grab': '#00B14F',
    'samsung': '#1428A0',
    'nike': '#111111',
    'adidas': '#111111',
    'unilever': '#1F36C7',
    'loreal': '#E30022',
    'zara': '#111111',
    'momo': '#A50064',
    'vng': '#FF6F00',
    'vpbank': '#008855',
    'snap': '#FFFC00',
    'general-motors': '#0050AA',
    'floqast': '#007A5A'
  };

  function getCompanyAccent(logoUrl, companyName) {
    const checkStr = `${logoUrl || ''} ${companyName || ''}`.toLowerCase();
    for (const [key, color] of Object.entries(companyAccentColors)) {
      if (checkStr.includes(key)) return color;
    }
    return '#0A66C2';
  }

  let activeBrowseFilter = 'all';

  function getJobsDatabase() {
    if (typeof enterpriseJobsDatabase !== 'undefined' && Array.isArray(enterpriseJobsDatabase) && enterpriseJobsDatabase.length > 0) {
      return enterpriseJobsDatabase;
    }
    if (typeof initialProjects !== 'undefined' && Array.isArray(initialProjects)) {
      return initialProjects;
    }
    return [];
  }

  function filterJobs(filterKey) {
    const allJobs = getJobsDatabase();
    if (!filterKey || filterKey === 'all') return allJobs;
    if (filterKey === 'urgent') return allJobs.filter(j => j.isUrgent);
    if (filterKey === 'latest') {
      return allJobs.filter(j => (j.time && (j.time.includes('giờ') || j.time.includes('min') || j.time.includes('hour') || j.time.includes('phút'))) || j.isUrgent || j.hot);
    }
    if (filterKey === 'multinational') {
      return allJobs.filter(j => (j.tags && j.tags.some(t => t.includes('Multinational') || t.includes('Top Tier') || t.includes('Enterprise') || t.includes('FDI'))) || (j.salaryVal && j.salaryVal >= 30000000));
    }
    return allJobs.filter(j => j.category === filterKey);
  }

  function generateJobCardHtml(job) {
    const logoUrl = job.companyLogo || job.logoUrl || 'images/brands/vinfast.svg';
    const company = job.company || job.clientName || 'Doanh Nghiệp Tuyển Dụng';
    const accent = getCompanyAccent(logoUrl, company);
    const expLevel = job.specs?.exp || job.level || (job.category === 'tech' ? 'Senior level' : 'Manager (5+ Yrs)');
    const loc = job.location || 'Hồ Chí Minh, VN';
    const workplace = job.workplace || job.workType || 'Hybrid';
    const timeAgo = job.time || job.timeAgo || 'Đăng gần đây';
    const salary = job.salary || job.salaryDisplay || 'Thỏa thuận';

    return `
      <article class="fw-job-card" onclick="openJobDetail('${job.id}')" style="--card-accent: ${accent};" role="button" tabindex="0" title="Click để xem chi tiết việc làm ${job.title}">
        <div class="fw-job-primary">
          <div class="fw-job-logo-box">
            <img src="${logoUrl}" alt="${company}" loading="lazy" onerror="this.onerror=null; this.src='images/brands/vinfast.svg';">
          </div>
          <div class="fw-job-info">
            <div class="fw-job-company-row">
              <span class="fw-job-company">${company}</span>
              <i class="fa-solid fa-circle-check fw-verified-check" title="Doanh nghiệp xác thực"></i>
            </div>
            <h3 class="fw-job-title">${job.title}</h3>
            <div class="fw-job-meta-chips">
              <span class="fw-meta-pill fw-meta-time"><i class="fa-regular fa-clock"></i> ${timeAgo}</span>
              <span class="fw-meta-pill fw-meta-workplace"><i class="fa-solid fa-briefcase"></i> ${workplace}</span>
              <span class="fw-meta-pill fw-meta-loc"><i class="fa-solid fa-location-dot"></i> ${loc}</span>
            </div>
          </div>
        </div>

        <div class="fw-job-actions-block">
          <div class="fw-job-salary-col">
            <div class="fw-job-salary">${salary}</div>
            <div class="fw-job-level"><i class="fa-solid fa-award"></i> ${expLevel}</div>
          </div>
          <div class="fw-job-btns-row">
            <button type="button" class="fw-bookmark-btn" onclick="event.stopPropagation(); toggleSaveJob('${job.id}', this);" title="Lưu việc làm">
              <i class="fa-regular fa-heart"></i>
            </button>
            <button type="button" class="fw-view-btn" onclick="event.stopPropagation(); openJobDetail('${job.id}');" title="Xem chi tiết">
              <span>Xem Chi Tiết</span>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderBrowseJobs(filterKey) {
    const container = document.getElementById('browse-jobs-container');
    if (!container) return;

    activeBrowseFilter = filterKey || activeBrowseFilter;
    const filtered = filterJobs(activeBrowseFilter);
    const cardsHtml = filtered.length > 0
      ? filtered.map(generateJobCardHtml).join('')
      : '<div style="padding:40px 20px; text-align:center; color:#64748B;">Không tìm thấy việc làm trong danh mục này.</div>';

    container.innerHTML = cardsHtml;

    const countBadges = document.querySelectorAll('#browse-openings-badge, #job-filter-count');
    countBadges.forEach(el => {
      el.textContent = `${filtered.length} việc làm`;
    });
  }

  // Hook into Việc Làm Mới filter chips
  window.filterSplitJobs = function(filter, btn) {
    document.querySelectorAll('.job-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderBrowseJobs(filter);
  };

  window.openJobDetail = function(jobId) {
    if (typeof showJobDetail === 'function') {
      showJobDetail(jobId);
    } else if (typeof window.showJobDetail === 'function') {
      window.showJobDetail(jobId);
    }
    if (typeof switchView === 'function') {
      switchView('job-detail');
    } else if (typeof window.switchView === 'function') {
      window.switchView('job-detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.toggleSaveJob = function(jobId, btn) {
    const heart = btn.querySelector('i');
    if (btn.classList.contains('saved')) {
      btn.classList.remove('saved');
      if (heart) {
        heart.className = 'fa-regular fa-heart';
        heart.style.color = '';
      }
    } else {
      btn.classList.add('saved');
      if (heart) {
        heart.className = 'fa-solid fa-heart';
        heart.style.color = '#DC2626';
      }
    }
  };


  window.renderBrowseJobs = function(filter) {
    renderBrowseJobs(filter);
  };

  // Automatically hook switchView so #view-browse renders every time user navigates to it
  const checkSwitchView = () => {
    if (typeof window.switchView === 'function' && !window.switchView._browseHooked) {
      const originalSwitch = window.switchView;
      window.switchView = function(viewId, updateHash) {
        originalSwitch(viewId, updateHash);
        if (viewId === 'browse' || viewId === 'view-browse') {
          setTimeout(renderBrowseJobs, 20);
        }
      };
      window.switchView._browseHooked = true;
    }
  };
  checkSwitchView();
  setInterval(checkSwitchView, 200);

  window.addEventListener('hashchange', () => {
    if (location.hash === '#browse') {
      setTimeout(renderBrowseJobs, 20);
    }
  });

  // Setup DOM listeners
  function init() {
    renderBrowseJobs('all');

    // When returning from job detail, return smoothly to browse view
    document.getElementById('btn-back-to-jobs-feed')?.addEventListener('click', () => {
      setTimeout(() => {
        const browseEl = document.getElementById('browse-jobs-container');
        if (browseEl && browseEl.offsetParent !== null) {
          browseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
