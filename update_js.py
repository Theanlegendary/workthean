import os
import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add initMobileNav, initBrowseFilters, updateSavedJobsCountUI in init list
init_str = """
  // Initialize Modules
  updateSavedJobsCountUI();
  initMobileNav();
  initBrowseFilters();"""
content = content.replace('  // Initialize Modules', init_str)

# 2. Add openEnterpriseModal
ent_modal = """
  function openEnterpriseModal(type) {
    showToast(`🏢 Tính năng ${type || 'Doanh nghiệp'} — Liên hệ: hr@vietnamjobs.vn`);
  }
"""
content = content.replace("function initNavigation() {", ent_modal + "\n  function initNavigation() {")

# 3. Add showSkeletonLoader and hideSkeletonLoader
skel_loaders = """
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
"""
content = content.replace("function initProjectsFeed() {", skel_loaders + "\n  function initProjectsFeed() {")

# Modify initProjectsFeed
init_projects = """function initProjectsFeed() {
    showSkeletonLoader('projects-feed', 4);
    setTimeout(() => {
      renderHomeFeaturedProjects();
    }, 300);
  }"""
content = re.sub(r'function initProjectsFeed\(\) \{\s*renderHomeFeaturedProjects\(\);\s*\}', init_projects, content)

# 4. Mobile hamburger menu
mobile_nav = """
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
"""
content = content.replace("function initNavigation() {", mobile_nav + "\n  function initNavigation() {")

# 5. Browse filters
browse_filters = """
  function initBrowseFilters() {
    document.getElementById('btn-apply-browse-filters')?.addEventListener('click', renderBrowseProjects);
    document.getElementById('browse-sort-select')?.addEventListener('change', renderBrowseProjects);

    document.querySelectorAll('.browse-cat-filter, .browse-type-filter, .browse-loc-filter').forEach(cb => {
      cb.addEventListener('change', renderBrowseProjects);
    });
  }
"""
content = content.replace("function renderBrowseProjects() {", browse_filters + "\n  function renderBrowseProjects() {")

# Update renderBrowseProjects
render_browse = """function renderBrowseProjects() {
    const browseFeed = document.getElementById('browse-projects-feed');
    if (!browseFeed) return;
    
    showSkeletonLoader('browse-projects-feed', 4);
    
    setTimeout(() => {
        let filtered = [...state.projects];
        
        // Read filters
        const cats = Array.from(document.querySelectorAll('.browse-cat-filter:checked')).map(cb => cb.value);
        const types = Array.from(document.querySelectorAll('.browse-type-filter:checked')).map(cb => cb.value);
        const locs = Array.from(document.querySelectorAll('.browse-loc-filter:checked')).map(cb => cb.value);
        const sort = document.getElementById('browse-sort-select')?.value || 'newest';
        
        if (cats.length > 0) filtered = filtered.filter(p => cats.includes(p.category));
        if (types.length > 0) filtered = filtered.filter(p => types.includes(p.type) || types.includes(p.workType));
        if (locs.length > 0) {
            filtered = filtered.filter(p => {
                if (!p.location) return false;
                const pl = p.location.toLowerCase();
                return locs.some(l => pl.includes(l.toLowerCase()) || (l === 'hcm' && pl.includes('hồ chí minh')));
            });
        }
        
        if (sort === 'salary') {
            filtered.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0));
        } else if (sort === 'applicants') {
            filtered.sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0));
        }
        
        const countSpan = document.getElementById('browse-results-count');
        if (countSpan) countSpan.textContent = filtered.length;

        if (filtered.length === 0) {
          browseFeed.innerHTML = '<div style="padding: 20px; text-align: center;">Không tìm thấy việc làm phù hợp.</div>';
          return;
        }

        browseFeed.innerHTML = filtered.map(p => {
          const isSaved = state.savedJobs.has(p.id);
          const initial = p.logoType || (p.company ? p.company.substring(0, 2).toUpperCase() : 'VJ');
          const salaryText = p.salaryDisplay || (p.budgetMin ? `${p.budgetMin} – ${p.budgetMax} USD` : 'Thỏa thuận');

          return `
            <article class="career-job-card" data-project-id="${p.id}">
              <div class="career-card-left-section">
                <div class="career-avatar-circle">
                  ${initial}
                </div>

                <div class="career-main-details">
                  <div class="career-title-row">
                    <h3 class="career-job-title">${p.title}</h3>
                    ${p.hot ? '<span class="badge-hot-tag"><i class="fa-solid fa-fire"></i> GẤP</span>' : ''}
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
    }, 200);
  }"""
content = re.sub(r'function renderBrowseProjects\(\) \{[\s\S]*?\}\s*\}\s*\}\s*\}\);?\s*\}', render_browse, content)


# 6. Improved showToast
new_toast = """  function showToast(msg, duration = 3800) {
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
  }"""
content = re.sub(r'function showToast\(msg\) \{[\s\S]*?setTimeout\(\(\) => toast\.remove\(\), 4000\);\s*\}', new_toast, content)


# 7. Add escape key globally
escape_key = """
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.show, .modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });
"""
content = content.replace("window.addEventListener('hashchange', handleUrlRouting);", "window.addEventListener('hashchange', handleUrlRouting);\n" + escape_key)


# 8. Bookmark pop animation
pop_anim = """
          if (state.savedJobs.has(prjId)) {
            state.savedJobs.delete(prjId);
            showToast('Đã bỏ lưu việc làm');
          } else {
            state.savedJobs.add(prjId);
            showToast('❤️ Đã lưu việc làm vào danh sách yêu thích!');
          }
          
          const icon = saveBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('bookmark-pop');
            void icon.offsetWidth; // reflow
            icon.classList.add('bookmark-pop');
          }
          
          updateSavedJobsCountUI();
"""
# Replace inside renderHomeFeaturedProjects
content = re.sub(r'if \(state\.savedJobs\.has\(prjId\)\) \{[\s\S]*?updateSavedJobsCountUI\(\);', pop_anim, content, count=1)

# Wait, replace in initJobDetailPage:
pop_anim2 = """
      if (state.savedJobs.has(prjId)) {
        state.savedJobs.delete(prjId);
        btn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Lưu Việc';
        showToast('Đã bỏ lưu việc làm');
      } else {
        state.savedJobs.add(prjId);
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
"""
content = re.sub(r'if \(state\.savedJobs\.has\(prjId\)\) \{[\s\S]*?updateSavedJobsCountUI\(\);', pop_anim2, content, count=1)

# In initBestJobsShowcase
pop_anim3 = """
          if (state.savedJobs.has(prjId)) {
            state.savedJobs.delete(prjId);
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            showToast('Đã bỏ lưu việc làm');
          } else {
            state.savedJobs.add(prjId);
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = '<i class="fa-solid fa-heart bookmark-pop"></i>';
            showToast('❤️ Đã lưu việc làm vào danh sách yêu thích!');
          }
          const icon = saveBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('bookmark-pop');
            void icon.offsetWidth; // reflow
            icon.classList.add('bookmark-pop');
          }
          updateSavedJobsCountUI();
"""
content = re.sub(r'if \(state\.savedJobs\.has\(prjId\)\) \{[\s\S]*?updateSavedJobsCountUI\(\);', pop_anim3, content, count=1)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('js/app.js updated')
