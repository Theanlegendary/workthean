import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Hamburger button
hamburger = '''<button class="hamburger-btn" id="btn-hamburger" aria-label="Mở menu" aria-expanded="false">
  <i class="fa-solid fa-bars"></i>
</button>
        <div class="brand-nav-links-left">'''
content = content.replace('<div class="brand-nav-links-left">', hamburger, 1)

# 2. Mobile nav drawer
mobile_nav = '''<!-- Mobile Nav Overlay & Drawer -->
<div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
<div class="mobile-nav-drawer" id="mobile-nav-drawer" aria-label="Menu điều hướng">
  <div class="drawer-logo">Vietnam<span style="color:#191919">Jobs</span></div>
  <button class="drawer-item" data-view="home"><i class="fa-solid fa-house"></i> Trang Chủ</button>
  <button class="drawer-item" data-view="browse"><i class="fa-solid fa-briefcase"></i> Việc Làm Mới</button>
  <button class="drawer-item" data-view="browse"><i class="fa-solid fa-building"></i> Top Công Ty</button>
  <button class="drawer-item" data-view="freelancers"><i class="fa-solid fa-user-tie"></i> Dành Cho Ứng Viên</button>
  <button class="drawer-item" data-view="browse"><i class="fa-solid fa-graduation-cap"></i> Học Bổng & Sinh Viên</button>
  <button class="drawer-item" data-view="browse"><i class="fa-solid fa-laptop-code"></i> Công Nghệ & IT</button>
  <div style="padding: 16px 20px; border-top: 1px solid var(--fl-border); margin-top: 8px; display: flex; gap: 8px; flex-direction: column;">
    <button class="btn-login-red-outline" id="btn-open-auth-modal-mobile" style="width:100%; justify-content:center;">Đăng Nhập</button>
    <button class="btn-signup-red-solid" id="btn-open-post-project-mobile" style="width:100%; justify-content:center;"><i class="fa-solid fa-plus-circle"></i> Đăng Tin Tuyển Dụng</button>
  </div>
</div>
</body>'''
content = content.replace('</body>', mobile_nav)

# 3. Hero stats
hero_stats = '''<!-- Hero Quick Search Tags -->
<div class="quick-search-tags-row">
  <span class="quick-search-label">Tìm nhanh:</span>
  <button class="quick-search-tag" data-filter-keyword="Java"><i class="fa-brands fa-java"></i> Java</button>
  <button class="quick-search-tag" data-filter-keyword="React"><i class="fa-brands fa-react"></i> React</button>
  <button class="quick-search-tag" data-filter-keyword="Python">🐍 Python</button>
  <button class="quick-search-tag" data-filter-keyword="Marketing"><i class="fa-solid fa-chart-line"></i> Marketing</button>
  <button class="quick-search-tag" data-filter-keyword="Design"><i class="fa-solid fa-pen-nib"></i> UI/UX</button>
  <button class="quick-search-tag" data-filter-keyword="Remote"><i class="fa-solid fa-laptop-house"></i> Remote</button>
</div>

<!-- Hero Stats -->
<div class="hero-stats-row">
  <div class="hero-stat-item">
    <div class="hero-stat-number" id="stat-candidates">520,000+</div>
    <div class="hero-stat-label">Ứng Viên</div>
  </div>
  <div class="hero-stat-divider"></div>
  <div class="hero-stat-item">
    <div class="hero-stat-number" id="stat-jobs">15,000+</div>
    <div class="hero-stat-label">Việc Làm</div>
  </div>
  <div class="hero-stat-divider"></div>
  <div class="hero-stat-item">
    <div class="hero-stat-number" id="stat-companies">3,200+</div>
    <div class="hero-stat-label">Doanh Nghiệp</div>
  </div>
  <div class="hero-stat-divider"></div>
  <div class="hero-stat-item">
    <div class="hero-stat-number">98%</div>
    <div class="hero-stat-label">Tỷ Lệ Phản Hồi</div>
  </div>
</div>
      </div>
'''
content = re.sub(r'(</form>\s*</div>)', r'</form>\n' + hero_stats, content, 1)

# 4. Browse view
browse_view = '''<section class="app-view" id="view-browse">
  <div class="container" style="padding: 24px 20px;">
    <div class="section-header-row" style="margin-bottom: 20px;">
      <div>
        <h2 class="section-title">Danh Sách Việc Làm Đang Mở</h2>
        <p class="section-subtitle">Tìm kiếm và ứng tuyển vào các vị trí phù hợp với năng lực của bạn</p>
      </div>
    </div>
    <div class="browse-layout-grid">
      <!-- Filter Sidebar -->
      <aside class="browse-filter-sidebar">
        <div class="filter-sidebar-title"><i class="fa-solid fa-sliders"></i> Bộ Lọc Tìm Kiếm</div>

        <div class="filter-group">
          <div class="filter-group-label">Ngành nghề</div>
          <label class="filter-option"><input type="checkbox" value="web-dev" class="browse-cat-filter"> Công nghệ / IT <span class="filter-count-badge">6.8k</span></label>
          <label class="filter-option"><input type="checkbox" value="ai-ml" class="browse-cat-filter"> AI & Dữ Liệu <span class="filter-count-badge">2.4k</span></label>
          <label class="filter-option"><input type="checkbox" value="mobile-apps" class="browse-cat-filter"> Mobile App <span class="filter-count-badge">3.2k</span></label>
          <label class="filter-option"><input type="checkbox" value="design" class="browse-cat-filter"> Design / UI-UX <span class="filter-count-badge">3.8k</span></label>
          <label class="filter-option"><input type="checkbox" value="recruitment" class="browse-cat-filter"> Kinh doanh / HR <span class="filter-count-badge">4.1k</span></label>
        </div>

        <div class="filter-group">
          <div class="filter-group-label">Hình thức</div>
          <label class="filter-option"><input type="checkbox" value="Full-Time" class="browse-type-filter"> Toàn thời gian</label>
          <label class="filter-option"><input type="checkbox" value="Part-Time" class="browse-type-filter"> Bán thời gian</label>
          <label class="filter-option"><input type="checkbox" value="Remote" class="browse-type-filter"> Remote / WFH</label>
        </div>

        <div class="filter-group">
          <div class="filter-group-label">Địa điểm</div>
          <label class="filter-option"><input type="checkbox" value="hcm" class="browse-loc-filter"> TP. Hồ Chí Minh</label>
          <label class="filter-option"><input type="checkbox" value="hanoi" class="browse-loc-filter"> Hà Nội</label>
          <label class="filter-option"><input type="checkbox" value="danang" class="browse-loc-filter"> Đà Nẵng</label>
          <label class="filter-option"><input type="checkbox" value="bacninh" class="browse-loc-filter"> Bắc Ninh</label>
        </div>

        <button class="btn-hero-search" style="width:100%; justify-content:center; margin-top:4px;" id="btn-apply-browse-filters">
          <i class="fa-solid fa-filter"></i> Áp Dụng Lọc
        </button>
      </aside>

      <!-- Main Results -->
      <div>
        <div class="browse-results-header">
          <div class="browse-results-count">Tìm thấy <span id="browse-results-count">0</span> việc làm</div>
          <select class="browse-sort-select" id="browse-sort-select">
            <option value="newest">Mới nhất</option>
            <option value="salary">Lương cao nhất</option>
            <option value="applicants">Nhiều ứng viên nhất</option>
          </select>
        </div>
        <div class="projects-feed" id="browse-projects-feed"></div>
      </div>
    </div>
  </div>
</section>'''
content = re.sub(r'<section class="app-view" id="view-browse">[\s\S]*?</section>', browse_view, content, 1)

# 5. Fix colors
content = content.replace('color: #16a34a', 'color: var(--fl-primary)')
content = content.replace('color:#16a34a', 'color:var(--fl-primary)')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('index.html updated')
