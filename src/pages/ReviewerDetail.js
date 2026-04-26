import { api } from '../api/client.js';
import { navigateTo } from '../router/index.js';

const STATUS_APPROVE = 2;
const STATUS_REJECT = 3;

const statusLabel = (s) => {
  const map = { 0: 'Submitted', 1: 'In Review', 2: 'Approved', 3: 'Rejected', 4: 'Cancelled' };
  return map[s] ?? map[s?.toString()?.toLowerCase()] ?? s ?? '—';
};

const statusBadge = (s) => {
  const val = typeof s === 'string' ? s.toLowerCase() : s;
  const map = {
    0: 'bg-blue-50 text-blue-700 border-blue-200', 'submitted': 'bg-blue-50 text-blue-700 border-blue-200',
    1: 'bg-orange-50 text-orange-700 border-orange-200', 'review': 'bg-orange-50 text-orange-700 border-orange-200', 'in review': 'bg-orange-50 text-orange-700 border-orange-200',
    2: 'bg-emerald-50 text-emerald-700 border-emerald-200', 'approved': 'bg-emerald-50 text-emerald-700 border-emerald-200', 'approve': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    3: 'bg-red-50 text-red-700 border-red-200', 'rejected': 'bg-red-50 text-red-700 border-red-200', 'reject': 'bg-red-50 text-red-700 border-red-200',
    4: 'bg-gray-100 text-gray-600 border-gray-200', 'cancelled': 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[val] ?? 'bg-gray-100 text-gray-600 border-gray-200';
};

const statusIcon = (s) => {
  const val = typeof s === 'string' ? s.toLowerCase() : s;
  const map = {
    0: 'fa-rotate', 'submitted': 'fa-rotate',
    1: 'fa-clock', 'review': 'fa-clock', 'in review': 'fa-clock',
    2: 'fa-check', 'approved': 'fa-check', 'approve': 'fa-check',
    3: 'fa-xmark', 'rejected': 'fa-xmark', 'reject': 'fa-xmark'
  };
  return map[val] ?? 'fa-circle-info';
};

export const ReviewerDetail = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- NAVIGATION -->
      <div class="mb-10">
        <button id="backBtn" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px]">
            <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to Dashboard
        </button>
      </div>

      <div id="reviewDetailContent" class="space-y-10 min-h-[500px]">
        <div class="flex flex-col items-center justify-center py-40 text-gray-300 gap-6">
            <i class="fa-solid fa-spinner fa-spin text-5xl text-primary/30"></i>
            <span class="text-[12px] font-black uppercase tracking-[3px] text-gray-400 animate-pulse">Loading document details...</span>
        </div>
      </div>
    </div>
  `,

  init: async (params) => {
    const id = params?.id;
    const container = document.getElementById('reviewDetailContent');
    const backBtn = document.getElementById('backBtn');

    if (backBtn) backBtn.onclick = () => navigateTo('/review');

    if (!id) {
      container.innerHTML = `<div class="p-20 bg-white/40 rounded-3xl border border-white text-center font-black uppercase tracking-widest text-red-500">Fault: Transmission ID Required</div>`;
      return;
    }

    try {
      const sub = await api.getSubmissionToReview(id);
      const fieldValues = sub.fieldValues || sub.FieldValues || [];
      const stepResponses = sub.stepResponses || sub.StepResponses || [];
      const currentStep = sub.currentStep || sub.CurrentStep;
      const status = sub.status ?? sub.Status ?? 1;
      const processId = sub.processId || sub.ProcessId;
      const processName = sub.processName || sub.ProcessName || 'Internal Protocol';
      const submittedAt = sub.submittedAt || sub.SubmittedAt;

      const isReviewStatus = (status === 1 || status === 'Review' || status === 'review');
      let resolvedStepId = null;

      // Attempt to resolve the active step ID
      if (isReviewStatus && processId) {
        try {
          const processDetail = await api.getProcess(processId);
          const steps = processDetail.steps || processDetail.Steps || [];
          const matchedStep = steps.find(s => (s.name || s.Name || s.title || s.Title) === currentStep);
          if (matchedStep) resolvedStepId = matchedStep.id || matchedStep.Id;

          if (!resolvedStepId) {
            const activeResponse = stepResponses.find(s => !(s.completedAt || s.CompletedAt));
            if (activeResponse) {
              const matched = steps.find(s => (s.name || s.Name) === (activeResponse.stepName || activeResponse.StepName));
              if (matched) resolvedStepId = matched.id || matched.Id;
            }
          }
        } catch (e) { console.error("Step resolution soft-fail", e); }
      }

      const canRespond = !!resolvedStepId && isReviewStatus;

      container.innerHTML = `
        <!-- OFFICIAL CASE HEADER -->
        <div class="ui-section-card rounded-[48px] overflow-hidden p-10 lg:p-14 relative group">
          <div class="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
            <div class="flex-1">
              <div class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-widest mb-6 shadow-lg shadow-primary/20">
                  <i class="fa-solid fa-clipboard-user"></i> SUBMISSION REVIEW
              </div>
              <h2 class="ui-page-title mb-4">${processName}</h2>
              <div class="flex flex-wrap items-center gap-8 text-[14px] text-gray-500 font-bold">
                <span class="flex items-center gap-2"><i class="fa-regular fa-calendar-check text-primary"></i> ${submittedAt ? new Date(submittedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-fingerprint text-primary"></i> #${id.toString().slice(-8).toUpperCase()}</span>
                ${currentStep ? `<span class="flex items-center gap-2 border-l border-gray-200 pl-8"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> <span class="font-black text-gray-900 uppercase tracking-[2px] text-[11px]">${currentStep}</span></span>` : ''}
              </div>
            </div>

            <div class="flex items-center gap-4">
                 ${(status === 2 || status === 'Approved') ? `
                 <button id="downloadPdfBtn" class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary text-2xl hover:scale-110 active:scale-95 transition-all group/btn">
                    <i class="fa-solid fa-file-pdf group-hover/btn:rotate-12"></i>
                 </button>` : ''}
                 <div class="inline-flex items-center px-10 py-5 rounded-3xl text-[16px] font-black shadow-xl border-2 border-white/50 ${statusBadge(status)} gap-4">
                    <i class="fa-solid ${statusIcon(status)} scale-125"></i> ${statusLabel(status)}
                 </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <!-- LEFT: DOCUMENT CONTENT & AUDIT -->
          <div class="lg:col-span-8 space-y-10">
              <!-- FIELD DATA -->
              <div class="ui-section-card rounded-[40px] p-12">
                  <h3 class="text-[18px] font-black text-gray-800 uppercase tracking-widest mb-10 pb-6 border-b border-gray-100 flex items-center gap-3">
                    <i class="fa-solid fa-file-invoice text-primary"></i> Document Information
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    ${fieldValues.map(f => `
                        <div class="group">
                          <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 px-2 group-hover:text-primary transition-colors">${f.fieldName || f.FieldName}</dt>
                          <dd class="text-[16px] font-extrabold text-gray-800 bg-white/60 p-5 rounded-2xl border border-gray-100 shadow-inner group-hover:bg-white transition-all">
                            ${f.fieldValue === "true" ? "AUTHENTICATED" : (f.fieldValue === "false" ? "DECLINED" : (f.fieldValue || '—'))}
                          </dd>
                        </div>
                    `).join('')}
                  </div>
              </div>

              <!-- RESPOND SECTION -->
              ${canRespond ? `
              <div class="ui-section-card rounded-[40px] border-2 border-primary/20 p-12 bg-white relative overflow-hidden" id="respondSection">
                  <div class="absolute top-0 right-0 p-10 opacity-[0.05] text-primary text-9xl -translate-y-10 translate-x-10">
                      <i class="fa-solid fa-signature"></i>
                  </div>
                  
                  <h3 class="text-[24px] font-black text-gray-900 tracking-tight mb-8 flex items-center gap-4">
                    <span class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg shadow-lg">
                        <i class="fa-solid fa-legal"></i>
                    </span>
                    Review Decision
                  </h3>

                  <div class="mb-10">
                    <label class="block text-[11px] font-black text-gray-400 uppercase tracking-[3px] mb-3 px-2">Decision Remarks</label>
                    <textarea id="remarksInput" rows="4" placeholder="Enter formal justifications or feedback for the submitter..." class="ui-input-lg w-full resize-none"></textarea>
                  </div>

                  <div id="respondError" class="hidden mb-10 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold flex items-center gap-3"></div>

                  <div class="flex gap-6">
                    <button id="rejectBtn" class="flex-1 py-6 px-10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-3xl text-[16px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-red-500/10 flex items-center justify-center gap-3">
                        <i class="fa-solid fa-xmark"></i> Reject
                    </button>
                    <button id="approveBtn" class="ui-button-primary flex-1 py-6 px-10 rounded-3xl text-[16px] uppercase tracking-widest">
                        <i class="fa-solid fa-check-double scale-125"></i> Approve & Sign
                    </button>
                  </div>
              </div>
              ` : ''}
          </div>

          <!-- RIGHT: TIMELINE -->
          <div class="lg:col-span-4">
              <div class="ui-section-card rounded-[40px] p-10 h-full">
                  <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest mb-10 pb-6 border-b border-gray-100/50 flex items-center gap-3">
                    <i class="fa-solid fa-route text-primary opacity-50"></i> Review Timeline
                  </h3>

                  <div class="relative ml-4 border-l-2 border-gray-100 space-y-10 pb-10">
                    ${stepResponses.map(s => {
        const isPending = !(s.completedAt || s.CompletedAt);
        const outcome = s.outcome || s.Outcome;
        const colorClass = isPending ? 'amber' : (outcome === 'Reject' || outcome === '3' ? 'red' : 'emerald');

        return `
                        <div class="relative pl-10 group">
                          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${isPending ? 'bg-amber-400 animate-pulse' : (colorClass === 'red' ? 'bg-red-500' : 'bg-emerald-500')} shadow-lg z-10"></div>
                          <div class="bg-white/60 p-6 rounded-3xl border border-gray-50 flex flex-col gap-2 group-hover:bg-white transition-all shadow-sm">
                            <span class="text-[13px] font-black text-gray-900 leading-none">${s.stepName || s.StepName}</span>
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${s.reviewer || 'PROTOCOL'} &bull; ${s.completedAt ? new Date(s.completedAt).toLocaleDateString() : 'AWAITING'}</span>
                            ${outcome ? `<div class="mt-2 text-[12px] text-gray-600 font-medium italic border-l-2 border-primary/20 pl-3">"${s.remarks || 'No remarks recorded.'}"</div>` : ''}
                          </div>
                        </div>
                        `;
      }).join('')}
                  </div>
              </div>
          </div>
          
        </div>
      `;

      // Event Logic
      if (canRespond) {
        const respond = async (outcome) => {
          const remarks = document.getElementById('remarksInput')?.value?.trim();
          const errBox = document.getElementById('respondError');
          errBox?.classList.add('hidden');

          document.getElementById('approveBtn').disabled = true;
          document.getElementById('rejectBtn').disabled = true;

          try {
            await api.respondToSubmission(id, resolvedStepId, outcome, remarks);
            navigateTo('/review');
          } catch (err) {
            errBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${err.message}`;
            errBox.classList.remove('hidden');
            document.getElementById('approveBtn').disabled = false;
            document.getElementById('rejectBtn').disabled = false;
          }
        };

        document.getElementById('approveBtn')?.addEventListener('click', () => respond(STATUS_APPROVE));
        document.getElementById('rejectBtn')?.addEventListener('click', () => respond(STATUS_REJECT));
      }

      // Download PDF
      document.getElementById('downloadPdfBtn')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        try {
          const blob = await api.getSubmissionDocument(id);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `AuditLog_${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (err) { alert(err.message); }
        finally { btn.disabled = false; btn.innerHTML = originalHTML; }
      });

    } catch (err) {
      container.innerHTML = `<div class="p-20 text-center font-black uppercase tracking-[3px] text-red-500 opacity-50"><i class="fa-solid fa-triangle-exclamation text-4xl mb-6"></i> Unable to load data: ${err.message}</div>`;
    }
  }
};
