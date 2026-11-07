/* ==========================================================================
   VIETNAMJOBS - POST A JOB PAGE LOGIC (EMPLOYER PORTAL)
   ========================================================================== */

(function() {
  'use strict';

  // Sample Logistics JD Template
  const SAMPLE_LOGISTICS_JD = `• Tiếp nhận và xử lý các đơn hàng vận tải đường biển (FCL/LCL), hàng không và logistics nội địa.
• Phối hợp chặt chẽ với các hãng tàu (Maersk, MSC, ONE), đại lý hải quan và đối tác kho bãi để tối ưu hóa chi phí vận chuyển.
• Theo dõi tiến độ đơn hàng trên hệ thống ERP/WMS, cập nhật tình trạng giao nhận cho khách hàng theo thời gian thực (real-time tracking).
• Giải quyết các vấn đề phát sinh liên quan đến chứng từ (B/L, C/O, Packing List, Invoice) và thủ tục thông quan hàng hóa.
• Lập báo cáo hiệu suất vận hành (KPIs) hàng tuần/tháng và đề xuất giải pháp cải tiến quy trình logistics tinh gọn.`;

  const SAMPLE_LOGISTICS_REQUIREMENTS = `• Tốt nghiệp Đại học/Cao đẳng chuyên ngành Kinh tế đối ngoại, Logistics & Chuỗi cung ứng, Xuất nhập khẩu hoặc các ngành liên quan.
• Tối thiểu 1 - 3 năm kinh nghiệm làm việc tại các công ty Forwarder, Logistics hoặc Doanh nghiệp xuất nhập khẩu.
• Am hiểu quy trình thông quan hải quan điện tử (ECUS5-VNACCS) và Incoterms 2020.
• Tiếng Anh giao tiếp tốt (tương đương TOEIC 650+), có khả năng trao đổi email và làm việc trực tiếp với đối tác nước ngoài.
• Kỹ năng giao tiếp, đàm phán và giải quyết vấn đề linh hoạt, chịu được áp lực tiến độ.`;

  let currentSkills = ['Logistics', 'Supply Chain', 'ERP / WMS', 'Thủ tục Hải quan', 'Incoterms 2020'];

  function updateLivePreview() {
    const title = document.getElementById('pj-job-title')?.value.trim() || 'Chuyên Viên Vận Hành Logistics & Chuỗi Cung Ứng';
    const company = document.getElementById('pj-company-name')?.value.trim() || 'A.P. Moller - Maersk Vietnam';
    const province = document.getElementById('pj-location-province')?.value || 'TP. Hồ Chí Minh';
    const workMode = document.querySelector('input[name="pj_work_mode"]:checked')?.value || 'Hybrid';
    const exp = document.getElementById('pj-experience-level')?.value || 'Chuyên viên (2-4 năm)';
    const isNegotiable = document.getElementById('pj-salary-negotiable')?.checked;
    const minSal = document.getElementById('pj-salary-min')?.value;
    const maxSal = document.getElementById('pj-salary-max')?.value;
    const logoSelect = document.getElementById('pj-company-logo-select')?.value || 'images/brands/maersk.svg';

    // Update Preview Elements
    const prevTitle = document.getElementById('preview-job-title');
    if (prevTitle) prevTitle.textContent = title;

    const prevCompany = document.getElementById('preview-company-name');
    if (prevCompany) prevCompany.innerHTML = `${company} <i class="fa-solid fa-circle-check" style="color: #0A66C2; font-size: 11px;"></i>`;

    const prevLogo = document.getElementById('preview-company-logo');
    if (prevLogo) prevLogo.src = logoSelect;

    const prevLocation = document.getElementById('preview-location');
    if (prevLocation) prevLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${province}`;

    const prevWorkMode = document.getElementById('preview-work-mode');
    if (prevWorkMode) prevWorkMode.textContent = workMode;

    const prevExp = document.getElementById('preview-experience');
    if (prevExp) prevExp.textContent = exp;

    const prevSalary = document.getElementById('preview-salary');
    if (prevSalary) {
      if (isNegotiable) {
        prevSalary.textContent = 'Thỏa thuận';
      } else if (minSal && maxSal) {
        const fmtMin = parseInt(minSal, 10).toLocaleString('vi-VN');
        const fmtMax = parseInt(maxSal, 10).toLocaleString('vi-VN');
        prevSalary.textContent = `₫${fmtMin} - ₫${fmtMax}/tháng`;
      } else if (minSal) {
        prevSalary.textContent = `Từ ₫${parseInt(minSal, 10).toLocaleString('vi-VN')}/tháng`;
      } else {
        prevSalary.textContent = '₫25.000.000 - ₫40.000.000/tháng';
      }
    }
  }

  function renderSkillsTags() {
    const container = document.getElementById('pj-skills-tags-wrap');
    if (!container) return;
    container.innerHTML = '';
    currentSkills.forEach((skill, index) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag-pill';
      tag.innerHTML = `<span>${skill}</span> <button type="button" class="skill-tag-remove" data-index="${index}" title="Xóa">&times;</button>`;
      container.appendChild(tag);
    });

    container.querySelectorAll('.skill-tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        currentSkills.splice(idx, 1);
        renderSkillsTags();
      });
    });
  }

  function handleSkillInputKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = document.getElementById('pj-skill-input');
      if (!input) return;
      const val = input.value.trim().replace(/,/g, '');
      if (val && !currentSkills.includes(val)) {
        currentSkills.push(val);
        renderSkillsTags();
        input.value = '';
      }
    }
  }

  function setJobTitleFromChip(title) {
    const input = document.getElementById('pj-job-title');
    if (input) {
      input.value = title;
      input.dispatchEvent(new Event('input'));
    }
  }

  function fillSampleLogisticsJD() {
    const desc = document.getElementById('pj-job-desc');
    const reqs = document.getElementById('pj-job-reqs');
    if (desc) desc.value = SAMPLE_LOGISTICS_JD;
    if (reqs) reqs.value = SAMPLE_LOGISTICS_REQUIREMENTS;
    if (typeof window.showToast === 'function') {
      window.showToast('✨ Đã chèn mẫu mô tả công việc Logistics chuẩn!');
    }
  }

  function toggleSalaryInputs() {
    const isNegotiable = document.getElementById('pj-salary-negotiable')?.checked;
    const minInput = document.getElementById('pj-salary-min');
    const maxInput = document.getElementById('pj-salary-max');
    if (minInput && maxInput) {
      minInput.disabled = isNegotiable;
      maxInput.disabled = isNegotiable;
      if (isNegotiable) {
        minInput.style.opacity = '0.5';
        maxInput.style.opacity = '0.5';
      } else {
        minInput.style.opacity = '1';
        maxInput.style.opacity = '1';
      }
    }
    updateLivePreview();
  }

  function handlePublishJob(e) {
    if (e) e.preventDefault();
    const title = document.getElementById('pj-job-title')?.value.trim();
    const company = document.getElementById('pj-company-name')?.value.trim();
    const email = document.getElementById('pj-contact-email')?.value.trim();

    if (!title) {
      alert('Vui lòng nhập tiêu đề vị trí tuyển dụng.');
      document.getElementById('pj-job-title')?.focus();
      return;
    }
    if (!company) {
      alert('Vui lòng nhập tên công ty / doanh nghiệp.');
      document.getElementById('pj-company-name')?.focus();
      return;
    }
    if (!email) {
      alert('Vui lòng nhập email nhận CV ứng tuyển.');
      document.getElementById('pj-contact-email')?.focus();
      return;
    }

    const province = document.getElementById('pj-location-province')?.value || 'TP. Hồ Chí Minh';
    const workMode = document.querySelector('input[name="pj_work_mode"]:checked')?.value || 'Hybrid';
    const logoSelect = document.getElementById('pj-company-logo-select')?.value || 'images/brands/maersk.svg';
    const isNegotiable = document.getElementById('pj-salary-negotiable')?.checked;
    const minSal = document.getElementById('pj-salary-min')?.value;
    const maxSal = document.getElementById('pj-salary-max')?.value;

    let salaryStr = 'Thỏa thuận';
    if (!isNegotiable && minSal && maxSal) {
      salaryStr = `₫${parseInt(minSal, 10).toLocaleString('vi-VN')} - ₫${parseInt(maxSal, 10).toLocaleString('vi-VN')}/tháng`;
    }

    // New Job Data Object
    const newJob = {
      id: 'job-custom-' + Date.now(),
      title: title,
      company: company,
      logo: logoSelect,
      salary: salaryStr,
      location: province,
      workMode: workMode,
      posted: 'Vừa xong',
      featured: true,
      tags: [...currentSkills]
    };

    // Prepend to window.state.jobs if available
    if (window.state && Array.isArray(window.state.jobs)) {
      window.state.jobs.unshift(newJob);
    }
    if (window.vietnamJobsData && Array.isArray(window.vietnamJobsData)) {
      window.vietnamJobsData.unshift(newJob);
    }

    // Success notification
    if (typeof window.showToast === 'function') {
      window.showToast(`🎉 Tin tuyển dụng "${title}" đã được đăng thành công và sẵn sàng đón nhận ứng viên!`);
    }

    // Confirmation & Option to View
    setTimeout(() => {
      if (confirm(`🎉 Tin tuyển dụng "${title}" đã được duyệt và đăng thành công!\n\nBạn có muốn chuyển đến danh sách việc làm để xem tin vừa đăng không?`)) {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('browse');
        } else if (typeof window.switchView === 'function') {
          window.switchView('browse');
        }
      }
    }, 400);
  }

  function handleSaveDraft() {
    const draftData = {
      title: document.getElementById('pj-job-title')?.value || '',
      company: document.getElementById('pj-company-name')?.value || '',
      desc: document.getElementById('pj-job-desc')?.value || '',
      reqs: document.getElementById('pj-job-reqs')?.value || '',
      email: document.getElementById('pj-contact-email')?.value || ''
    };
    try {
      localStorage.setItem('vj_employer_draft_job', JSON.stringify(draftData));
      if (typeof window.showToast === 'function') {
        window.showToast('💾 Đã lưu bản nháp tin tuyển dụng vào trình duyệt của bạn!');
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Export functions to global
  window.setJobTitleFromChip = setJobTitleFromChip;
  window.fillSampleLogisticsJD = fillSampleLogisticsJD;
  window.toggleSalaryInputs = toggleSalaryInputs;
  window.handlePublishJob = handlePublishJob;
  window.handleSaveDraft = handleSaveDraft;

  // Initialize event listeners when DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Inputs triggering live preview
    const syncInputs = [
      'pj-job-title',
      'pj-company-name',
      'pj-salary-min',
      'pj-salary-max',
      'pj-location-province',
      'pj-company-logo-select',
      'pj-experience-level'
    ];
    syncInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateLivePreview);
        el.addEventListener('change', updateLivePreview);
      }
    });

    document.querySelectorAll('input[name="pj_work_mode"]').forEach(radio => {
      radio.addEventListener('change', updateLivePreview);
    });

    const skillInput = document.getElementById('pj-skill-input');
    if (skillInput) {
      skillInput.addEventListener('keydown', handleSkillInputKey);
    }

    renderSkillsTags();
    updateLivePreview();
  });

})();
