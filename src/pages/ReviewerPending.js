import { api } from '../api/client.js';
import { navigateTo } from '../router/index.js';

export const ReviewerPending = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="mb-14 relative p-8 md:p-10 ui-section-card rounded-[40px] overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <i class="fa-solid fa-hourglass-half animate-pulse"></i> Assessments Active
              </div>
              <h1 class="ui-page-title mb-3">Reviewer Dashboard</h1>
              <p class="ui-muted font-medium italic opacity-80">Review and approve pending document submissions.</p>
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

      <div id="reviewsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="col-span-full py-40 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-[3px]">Loading pending reviews...</p>
        </div>
      </div>
    </div>
  `,
  init: async () => {
    const list = document.getElementById('reviewsList');
    if (!list) return;

    try {
      const res = await api.getPendingReviews();
      let items = Array.isArray(res) ? res : (res.items || res.Items || res.data || res.Data || []);

      if (items.length === 0) {
        list.className = 'flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/80 shadow-2xl';
        list.innerHTML = `
            <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner rotate-3">
                <i class="fa-solid fa-check-double scale-125"></i>
            </div>
            <h3 class="text-[28px] font-black text-gray-900 tracking-tight mb-3">All Clear</h3>
            <p class="text-[15px] text-gray-400 font-medium text-center max-w-sm italic opacity-80">You have no pending documents to review at this time.</p>
        `;
      } else {
        // Update health bar for demo
        const healthBar = document.getElementById('queueHealthBar');
        if (healthBar) {
          const width = Math.max(20, 100 - (items.length * 10));
          healthBar.style.width = width + '%';
          healthBar.className = `h-full rounded-full transition-all duration-1000 ${width < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`;
        }

        list.innerHTML = items.map(r => {
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

          return `
            <div class="ui-card rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl group overflow-hidden flex flex-col justify-between">
              <!-- TOP SECTION -->
              <div class="p-8 pb-4">
                  <div class="flex items-center justify-between mb-8">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                        <i class="fa-solid fa-clock-rotate-left"></i> ${timeAgo}
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
                  <button data-id="${id}" class="review-btn ui-button-primary w-full py-5 rounded-2xl text-[15px]">
                      <i class="fa-solid fa-signature"></i> Review Document
                  </button>
              </div>
            </div>
          `;
        }).join('');

        // Wire up events
        list.querySelectorAll('.review-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            navigateTo(`/review/${btn.dataset.id}`);
          });
        });
      }
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
