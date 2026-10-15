import { api } from '../api/client.js';
import { navigateTo } from '../router/index.js';

export const ReviewerPending = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="mb-10 relative p-8 md:p-10 ui-section-card rounded-[40px] overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <i class="fa-solid fa-stamp"></i> Review Portal
              </div>
              <h1 class="ui-page-title mb-3">Reviewer Dashboard</h1>
              <p class="ui-muted font-medium italic opacity-80">Review pending submissions and track previously approved documents.</p>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="text-right hidden sm:block">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Queue Health</div>
                    <div class="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                        <div id="queueHealthBar" class="h-full bg-emerald-500 rounded-full transition-all duration-1000" style="width: 100%"></div>
                    </div>
                </div>
                <div class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-amber-500 text-2xl shadow-amber-500/5 ring-4 ring-amber-500/5">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>
            </div>
          </div>
      </div>

      <!-- TABS -->
      <div class="flex items-center gap-3 mb-8 border-b border-gray-200/60 pb-4">
        <button id="tabPendingBtn" class="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all bg-primary text-white shadow-lg shadow-primary/20">
          <i class="fa-solid fa-hourglass-half"></i> Pending Approvals (<span id="pendingCount">0</span>)
        </button>
        <button id="tabReviewedBtn" class="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all bg-white/70 text-gray-500 hover:text-gray-900 hover:bg-white border border-gray-200/50">
          <i class="fa-solid fa-clock-rotate-left"></i> Reviewed History (<span id="reviewedCount">0</span>)
        </button>
      </div>

      <div id="reviewsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="col-span-full py-40 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-[3px]">Loading reviews...</p>
        </div>
      </div>
    </div>
  `,
  init: async () => {
    const list = document.getElementById('reviewsList');
    const tabPendingBtn = document.getElementById('tabPendingBtn');
    const tabReviewedBtn = document.getElementById('tabReviewedBtn');
    const pendingCountEl = document.getElementById('pendingCount');
    const reviewedCountEl = document.getElementById('reviewedCount');
    const healthBar = document.getElementById('queueHealthBar');

    if (!list) return;

    let pendingItems = [];
    let reviewedItems = [];
    let currentTab = window.location.hash.includes('tab=reviewed') ? 'reviewed' : 'pending';

    const renderPending = () => {
      if (pendingItems.length === 0) {
        list.className = 'flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/80 shadow-2xl col-span-full';
        list.innerHTML = `
            <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner rotate-3">
                <i class="fa-solid fa-check-double scale-125"></i>
            </div>
            <h3 class="text-[28px] font-black text-gray-900 tracking-tight mb-3">All Clear</h3>
            <p class="text-[15px] text-gray-400 font-medium text-center max-w-sm italic opacity-80">You have no pending documents to review at this time.</p>
        `;
        return;
      }

      list.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
      list.innerHTML = pendingItems.map(r => {
        const id = r.id || r.Id;
        const process = r.responseName || r.ResponseName || 'Document Submission';
        const submitter = r.submitterName || r.SubmitterName || 'Applicant';
        const step = r.stepName || r.StepName || 'Assessment';
        const date = r.submittedAt || r.SubmittedAt;
        const activated = r.stepActivatedAt || r.StepActivatedAt;

        let timeAgo = 'Just now';
        if (activated) {
          const diffHrs = Math.floor((new Date() - new Date(activated)) / (1000 * 60 * 60));
          timeAgo = diffHrs > 0 ? `${diffHrs}h ago` : 'Activated recently';
        }

        const status = r.status ?? r.Status ?? 1;
        const isOnHold = status === 5 || status === 'OnHold' || status === 'onhold' || status === 'on hold';

        return `
          <div class="ui-card rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl group overflow-hidden flex flex-col justify-between ${isOnHold ? 'border-amber-200/60 bg-amber-50/20' : ''}">
            <!-- TOP SECTION -->
            <div class="p-8 pb-4">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center gap-2 px-3 py-1 ${isOnHold ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'} rounded-full text-[10px] font-black uppercase tracking-widest border">
                        <i class="fa-solid ${isOnHold ? 'fa-pause' : 'fa-clock-rotate-left'}"></i> ${isOnHold ? 'On Hold' : timeAgo}
                    </div>
                    ${isOnHold ? `<span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">${timeAgo}</span>` : ''}
                  </div>
                  <div class="text-[11px] font-black text-gray-300 uppercase tracking-tighter">TRK-${id.toString().slice(-6).toUpperCase()}</div>
                </div>
                
                <h3 class="text-[22px] font-black text-gray-900 tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">${process}</h3>
                
                <div class="flex flex-wrap gap-2 mb-8">
                  <span class="px-3 py-1.5 bg-gray-100/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest border border-gray-200/50">
                      <i class="fa-solid fa-bezier-curve mr-2 opacity-40"></i> ${step}
                  </span>
                </div>

                <div class="space-y-4 pt-6 border-t border-gray-100/50">
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-sm shadow-inner group-hover:scale-110 transition-transform">
                          <i class="fa-solid fa-user-graduate"></i>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submitted By</p>
                          <p class="text-[13px] font-extrabold text-gray-800 leading-none">${submitter}</p>
                      </div>
                  </div>
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm shadow-inner group-hover:scale-110 transition-transform">
                          <i class="fa-regular fa-calendar"></i>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submission Date</p>
                          <p class="text-[13px] font-extrabold text-gray-800 leading-none">${date ? new Date(date).toLocaleDateString() : 'Pending'}</p>
                      </div>
                  </div>
                </div>
            </div>

            <!-- ACTION SECTION -->
            <div class="p-8 pt-4">
                <button data-id="${id}" class="review-btn ${isOnHold ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'ui-button-primary'} w-full py-5 rounded-2xl text-[15px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all">
                    <i class="fa-solid ${isOnHold ? 'fa-play' : 'fa-signature'}"></i> ${isOnHold ? 'Resume / Review' : 'Review Document'}
                </button>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.review-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigateTo(`/review/${btn.dataset.id}`);
        });
      });
    };

    const mapReviewedStatus = (statusNum) => {
      if (statusNum === 2 || statusNum === 'Approved' || statusNum === 'approved') {
        return { label: 'Approved', badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30', icon: 'fa-check-double' };
      }
      if (statusNum === 3 || statusNum === 'Rejected' || statusNum === 'rejected') {
        return { label: 'Rejected', badgeClass: 'bg-red-500/10 text-red-700 border-red-500/30', icon: 'fa-xmark' };
      }
      if (statusNum === 5 || statusNum === 'OnHold' || statusNum === 'onhold' || statusNum === 'on hold') {
        return { label: 'On Hold', badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/30', icon: 'fa-pause' };
      }
      if (statusNum === 4 || statusNum === 'Cancelled' || statusNum === 'cancelled') {
        return { label: 'Cancelled', badgeClass: 'bg-gray-100 text-gray-600 border-gray-200', icon: 'fa-ban' };
      }
      return { label: 'In Review', badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-500/30', icon: 'fa-rotate' };
    };

    const renderReviewed = () => {
      if (reviewedItems.length === 0) {
        list.className = 'flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/80 shadow-2xl col-span-full';
        list.innerHTML = `
            <div class="w-24 h-24 bg-blue-50 text-blue-500 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner">
                <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <h3 class="text-[28px] font-black text-gray-900 tracking-tight mb-3">No Reviewed Documents</h3>
            <p class="text-[15px] text-gray-400 font-medium text-center max-w-sm italic opacity-80">You have not reviewed any document submissions yet.</p>
        `;
        return;
      }

      list.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
      list.innerHTML = reviewedItems.map(r => {
        const id = r.id || r.Id;
        const process = r.name || r.Name || 'Document Submission';
        const step = r.currentStep || r.CurrentStep || 'Completed';
        const date = r.createdAt || r.CreatedAt;
        const status = r.status ?? r.Status ?? 2;
        const st = mapReviewedStatus(status);

        return `
          <div class="ui-card rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl group overflow-hidden flex flex-col justify-between">
            <!-- TOP SECTION -->
            <div class="p-8 pb-4">
                <div class="flex items-center justify-between mb-8">
                  <div class="inline-flex items-center gap-2 px-3 py-1 ${st.badgeClass} rounded-full text-[10px] font-black uppercase tracking-widest border">
                      <i class="fa-solid ${st.icon}"></i> ${st.label}
                  </div>
                  <div class="text-[11px] font-black text-gray-300 uppercase tracking-tighter">TRK-${id.toString().slice(-6).toUpperCase()}</div>
                </div>
                
                <h3 class="text-[22px] font-black text-gray-900 tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">${process}</h3>
                
                <div class="flex flex-wrap gap-2 mb-8">
                  <span class="px-3 py-1.5 bg-gray-100/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest border border-gray-200/50">
                      <i class="fa-solid fa-bezier-curve mr-2 opacity-40"></i> ${step}
                  </span>
                </div>

                <div class="space-y-4 pt-6 border-t border-gray-100/50">
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm shadow-inner group-hover:scale-110 transition-transform">
                          <i class="fa-regular fa-calendar"></i>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submission Date</p>
                          <p class="text-[13px] font-extrabold text-gray-800 leading-none">${date ? new Date(date).toLocaleDateString() : '—'}</p>
                      </div>
                  </div>
                </div>
            </div>

            <!-- ACTION SECTION -->
            <div class="p-8 pt-4">
                <button data-id="${id}" class="view-reviewed-btn ui-button-primary w-full py-5 rounded-2xl text-[15px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all">
                    <i class="fa-solid fa-eye"></i> View Submission
                </button>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.view-reviewed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigateTo(`/review/${btn.dataset.id}`);
        });
      });
    };

    const updateTabsUI = () => {
      const activeClass = 'bg-primary text-white shadow-lg shadow-primary/20';
      const inactiveClass = 'bg-white/70 text-gray-500 hover:text-gray-900 hover:bg-white border border-gray-200/50';

      if (currentTab === 'pending') {
        tabPendingBtn.className = `flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${activeClass}`;
        tabReviewedBtn.className = `flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${inactiveClass}`;
        renderPending();
      } else {
        tabReviewedBtn.className = `flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${activeClass}`;
        tabPendingBtn.className = `flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${inactiveClass}`;
        renderReviewed();
      }
    };

    tabPendingBtn?.addEventListener('click', () => {
      currentTab = 'pending';
      window.location.hash = '#/review';
      updateTabsUI();
    });

    tabReviewedBtn?.addEventListener('click', () => {
      currentTab = 'reviewed';
      window.location.hash = '#/review?tab=reviewed';
      updateTabsUI();
    });

    try {
      const [pendingResult, reviewedResult] = await Promise.allSettled([
        api.getPendingReviews(),
        api.getSubmissionsReviewed()
      ]);

      if (pendingResult.status === 'fulfilled') {
        const res = pendingResult.value;
        pendingItems = Array.isArray(res) ? res : (res.items || res.Items || res.data || res.Data || []);
      }
      if (reviewedResult.status === 'fulfilled') {
        const res = reviewedResult.value;
        reviewedItems = Array.isArray(res) ? res : (res.items || res.Items || res.data || res.Data || []);
      }

      if (pendingCountEl) pendingCountEl.textContent = pendingItems.length;
      if (reviewedCountEl) reviewedCountEl.textContent = reviewedItems.length;

      if (healthBar) {
        const width = Math.max(20, 100 - (pendingItems.length * 10));
        healthBar.style.width = width + '%';
        healthBar.className = `h-full rounded-full transition-all duration-1000 ${width < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`;
      }

      updateTabsUI();
    } catch (err) {
      console.error(err);
      list.className = 'col-span-full max-w-xl mx-auto py-20 text-center bg-red-50/50 rounded-[40px] border border-red-100';
      list.innerHTML = `
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h4 class="text-[20px] font-black text-red-700 tracking-tight mb-2">Unable to load reviews</h4>
          <p class="text-[14px] text-red-600 opacity-70">${err.message}</p>
      `;
    }
  }
};
