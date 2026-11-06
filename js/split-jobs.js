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

  /* ==========================================================================
     IMAGE 3: ADVANCED CLIENT-SIDE FILTER & SEARCH ENGINE
     ========================================================================== */
  let isNewJobsFilterActive = false;

  window.toggleNewJobsFilter = function(el) {
    isNewJobsFilterActive = !isNewJobsFilterActive;
    if (el) {
      if (isNewJobsFilterActive) el.classList.add('active');
      else el.classList.remove('active');
    }
    window.applyBrowseFilters();
  };

  window.updateCategoryPill = function(sel) {
    const label = document.getElementById('pill-category-label');
    const pill = document.getElementById('pill-filter-category');
    if (label && sel) {
      const selectedText = sel.options[sel.selectedIndex].text;
      label.textContent = sel.value === 'all' ? 'Job Category' : selectedText;
      if (pill) {
        if (sel.value !== 'all') pill.classList.add('active');
        else pill.classList.remove('active');
      }
    }
  };

  window.updateExpPill = function(sel) {
    const label = document.getElementById('pill-exp-label');
    const pill = document.getElementById('pill-filter-exp');
    if (label && sel) {
      const selectedText = sel.options[sel.selectedIndex].text;
      label.textContent = sel.value === 'all' ? 'Experience' : selectedText;
      if (pill) {
        if (sel.value !== 'all') pill.classList.add('active');
        else pill.classList.remove('active');
      }
    }
  };

  window.updateIndustryPill = function(sel) {
    const label = document.getElementById('pill-industry-label');
    const pill = document.getElementById('pill-filter-industry');
    if (label && sel) {
      const selectedText = sel.options[sel.selectedIndex].text;
      label.textContent = sel.value === 'all' ? 'Industry' : selectedText;
      if (pill) {
        if (sel.value !== 'all') pill.classList.add('active');
        else pill.classList.remove('active');
      }
    }
  };

  window.resetAllBrowseFilters = function() {
    isNewJobsFilterActive = false;
    const pillNew = document.getElementById('pill-filter-new');
    if (pillNew) pillNew.classList.remove('active');

    const kw = document.getElementById('browse-search-keyword');
    if (kw) kw.value = '';

    const wp = document.getElementById('browse-filter-workplace');
    if (wp) wp.value = 'all';

    const loc = document.getElementById('browse-filter-location');
    if (loc) loc.value = 'all';

    const cat = document.getElementById('browse-select-category');
    if (cat) {
      cat.value = 'all';
      window.updateCategoryPill(cat);
    }

    const exp = document.getElementById('browse-select-exp');
    if (exp) {
      exp.value = 'all';
      window.updateExpPill(exp);
    }

    const ind = document.getElementById('browse-select-industry');
    if (ind) {
      ind.value = 'all';
      window.updateIndustryPill(ind);
    }

    window.applyBrowseFilters();
  };

  window.applyBrowseFilters = function() {
    const container = document.getElementById('browse-jobs-container');
    if (!container) return;

    let jobs = getJobsDatabase();

    // 1. Keyword search (Title, Company, Description, Tags)
    const kw = document.getElementById('browse-search-keyword')?.value.trim().toLowerCase();
    if (kw) {
      jobs = jobs.filter(j => {
        const text = `${j.title || ''} ${j.company || j.clientName || ''} ${j.description || ''} ${(j.tags || []).join(' ')}`.toLowerCase();
        return text.includes(kw);
      });
    }

    // 2. Workplace filter (Remote, Hybrid, On-site)
    const wp = document.getElementById('browse-filter-workplace')?.value;
    if (wp && wp !== 'all') {
      jobs = jobs.filter(j => {
        const place = `${j.workplace || ''} ${j.workType || ''}`.toLowerCase();
        return place.includes(wp.toLowerCase());
      });
    }

    // 3. Location filter
    const loc = document.getElementById('browse-filter-location')?.value;
    if (loc && loc !== 'all') {
      jobs = jobs.filter(j => {
        return (j.location || '').toLowerCase().includes(loc.toLowerCase());
      });
    }

    // 4. Category filter
    const cat = document.getElementById('browse-select-category')?.value;
    if (cat && cat !== 'all') {
      jobs = jobs.filter(j => j.category === cat);
    }

    // 5. Experience filter
    const exp = document.getElementById('browse-select-exp')?.value;
    if (exp && exp !== 'all') {
      jobs = jobs.filter(j => {
        const jExp = `${j.specs?.exp || ''} ${j.level || ''}`.toLowerCase();
        if (exp === 'Fresher') return jExp.includes('fresher') || jExp.includes('1 năm') || jExp.includes('junior');
        if (exp === '1-3') return jExp.includes('1') || jExp.includes('2') || jExp.includes('3');
        if (exp === 'Senior') return jExp.includes('senior') || jExp.includes('3') || jExp.includes('4') || jExp.includes('5');
        if (exp === 'Manager') return jExp.includes('manager') || jExp.includes('lead') || jExp.includes('trưởng');
        return true;
      });
    }

    // 6. New Jobs Only
    if (isNewJobsFilterActive) {
      jobs = jobs.filter(j => j.isUrgent || j.hot || (j.time && (j.time.includes('giờ') || j.time.includes('phút') || j.time.includes('min') || j.time.includes('hour'))));
    }

    // 7. Sort
    const sortVal = document.getElementById('browse-sort-select')?.value || 'latest';
    if (sortVal === 'salary-high') {
      jobs.sort((a, b) => (b.salaryVal || 0) - (a.salaryVal || 0));
    }

    // Render cards
    if (jobs.length > 0) {
      container.innerHTML = jobs.map(generateJobCardHtml).join('');
    } else {
      container.innerHTML = `
        <div style="background:#FFFFFF; border-radius:16px; padding:60px 20px; text-align:center; border:1px solid #E2E8F0; margin-top:10px;">
          <div style="font-size:44px; margin-bottom:12px;">🔍</div>
          <h3 style="font-size:18px; font-weight:700; color:#0F172A; margin-bottom:6px;">Không tìm thấy việc làm phù hợp</h3>
          <p style="font-size:14px; color:#64748B; margin-bottom:20px;">Vui lòng thử điều chỉnh lại từ khóa hoặc xóa bớt bộ lọc.</p>
          <button type="button" onclick="resetAllBrowseFilters();" style="background:#0A66C2; color:#FFFFFF; border:none; padding:10px 22px; border-radius:9999px; font-weight:700; font-size:13.5px; cursor:pointer;">
            Xóa Toàn Bộ Bộ Lọc
          </button>
        </div>
      `;
    }

    // Update counter
    const countEl = document.getElementById('browse-results-count');
    if (countEl) countEl.textContent = jobs.length;
  };

  // Re-hook renderBrowseJobs to use applyBrowseFilters
  window.renderBrowseJobs = function() {
    window.applyBrowseFilters();
  };

})();