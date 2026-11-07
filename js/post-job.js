/* ==========================================================================
   CLEAN MINIMALIST POST A JOB CONTROLLER
   ========================================================================== */

(function() {
  'use strict';

  function toggleSalaryInputs() {
    const isNegotiable = document.getElementById('pj-salary-negotiable')?.checked;
    const minInput = document.getElementById('pj-salary-min');
    const maxInput = document.getElementById('pj-salary-max');
    if (minInput && maxInput) {
      minInput.disabled = isNegotiable;
      maxInput.disabled = isNegotiable;
      minInput.style.opacity = isNegotiable ? '0.45' : '1';
      maxInput.style.opacity = isNegotiable ? '0.45' : '1';
    }
  }

  function handlePublishJob(e) {
    if (e) e.preventDefault();

    const title = document.getElementById('pj-job-title')?.value.trim();
    const company = document.getElementById('pj-company-name')?.value.trim();
    const email = document.getElementById('pj-contact-email')?.value.trim();
    const location = document.getElementById('pj-location-province')?.value.trim() || 'Ho Chi Minh City';
    const workMode = document.querySelector('input[name="pj_work_mode"]:checked')?.value || 'Hybrid';
    const isNegotiable = document.getElementById('pj-salary-negotiable')?.checked;
    const minSal = document.getElementById('pj-salary-min')?.value;
    const maxSal = document.getElementById('pj-salary-max')?.value;

    if (!title || !company || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    let salaryStr = 'Thỏa thuận';
    if (!isNegotiable && minSal && maxSal) {
      salaryStr = `₫${parseInt(minSal, 10).toLocaleString('vi-VN')} - ₫${parseInt(maxSal, 10).toLocaleString('vi-VN')}/tháng`;
    }

    const newJob = {
      id: 'job-custom-' + Date.now(),
      title: title,
      company: company,
      logo: 'images/brands/maersk.svg',
      salary: salaryStr,
      location: location,
      workMode: workMode,
      posted: 'Just now',
      featured: true,
      tags: ['Logistics', 'Operations', workMode]
    };

    if (window.state && Array.isArray(window.state.jobs)) {
      window.state.jobs.unshift(newJob);
    }
    if (window.vietnamJobsData && Array.isArray(window.vietnamJobsData)) {
      window.vietnamJobsData.unshift(newJob);
    }

    if (typeof window.showToast === 'function') {
      window.showToast(`Job listing "${title}" has been published successfully.`);
    }

    if (typeof window.navigateTo === 'function') {
      window.navigateTo('browse');
    } else if (typeof window.switchView === 'function') {
      window.switchView('browse');
    }
  }

  window.toggleSalaryInputs = toggleSalaryInputs;
  window.handlePublishJob = handlePublishJob;

})();
