import { api } from '../api/client.js';

const statusLabel = (s) => {
  const map = { 0: 'Submitted', 1: 'In Review', 2: 'Approved', 3: 'Rejected', 4: 'Cancelled', 5: 'On Hold' };
  return map[s] ?? map[s?.toString()?.toLowerCase()] ?? s ?? '—';
};

const statusBadge = (s) => {
  const val = typeof s === 'string' ? s.toLowerCase() : s;
  const map = {
    0: 'bg-blue-50 text-blue-700 border-blue-200', 'submitted': 'bg-blue-50 text-blue-700 border-blue-200',
    1: 'bg-orange-50 text-orange-700 border-orange-200', 'review': 'bg-orange-50 text-orange-700 border-orange-200', 'in review': 'bg-orange-50 text-orange-700 border-orange-200',
    2: 'bg-emerald-50 text-emerald-700 border-emerald-200', 'approved': 'bg-emerald-50 text-emerald-700 border-emerald-200', 'approve': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    3: 'bg-red-50 text-red-700 border-red-200', 'rejected': 'bg-red-50 text-red-700 border-red-200', 'reject': 'bg-red-50 text-red-700 border-red-200',
    4: 'bg-gray-100 text-gray-600 border-gray-200', 'cancelled': 'bg-gray-100 text-gray-600 border-gray-200', 'cancel': 'bg-gray-100 text-gray-600 border-gray-200',
    5: 'bg-amber-50 text-amber-700 border-amber-200', 'onhold': 'bg-amber-50 text-amber-700 border-amber-200', 'on hold': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return map[val] ?? 'bg-gray-100 text-gray-600 border-gray-200';
};

const statusIcon = (s) => {
  const val = typeof s === 'string' ? s.toLowerCase() : s;
  const map = {
    0: 'fa-rotate', 'submitted': 'fa-rotate',
    1: 'fa-clock', 'review': 'fa-clock', 'in review': 'fa-clock',
    2: 'fa-check', 'approved': 'fa-check', 'approve': 'fa-check',
    3: 'fa-xmark', 'rejected': 'fa-xmark', 'reject': 'fa-xmark',
    4: 'fa-ban', 'cancelled': 'fa-ban', 'cancel': 'fa-ban',
    5: 'fa-pause', 'onhold': 'fa-pause', 'on hold': 'fa-pause'
  };
  return map[val] ?? 'fa-circle-info';
};

export const TrackDetail = {
  render: () => `
    <div class="ui-page-shell max-w-6xl">
      
      <!-- HEADER & NAVIGATION -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button id="backBtn" onclick="window.history.back()" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px] mb-8">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to List
          </button>
          <h1 class="ui-page-title mb-4">Submission Status</h1>
          <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Real-time status and history of your document submission.</p>
        </div>
      </div>

      <div id="trackDetailContent" class="space-y-12 min-h-[400px]">
        <div class="flex flex-col items-center justify-center py-32 text-gray-300 gap-6">
            <i class="fa-solid fa-spinner fa-spin text-5xl text-primary/30"></i>
            <span class="text-[12px] font-black uppercase tracking-[3px] text-gray-400 animate-pulse">Retrieving Status...</span>
        </div>
      </div>
    </div>
  `,

  init: async (params) => {
    const id = params?.id;
    const container = document.getElementById('trackDetailContent');
    if (!id) return;

    try {
      const sub = await api.getSubmission(id);
      const fieldValues = sub.fieldValues || sub.FieldValues || [];
      const stepResponses = sub.stepResponses || sub.StepResponses || [];
      const currentStep = sub.currentStep || sub.CurrentStep;
      const status = sub.status ?? sub.Status ?? 1;
      const processName = sub.processName || sub.ProcessName || 'Protocol Execution';
      const submittedAt = sub.submittedAt || sub.SubmittedAt;

      container.innerHTML = `
        <!-- HERO DATA PANEL -->
        <div class="ui-section-card rounded-[48px] overflow-hidden p-10 lg:p-14 relative group">
          <div class="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
            <div class="flex-1">
               <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest mb-6">
                  <i class="fa-solid fa-fingerprint"></i> ID: #${id.toString().slice(-8).toUpperCase()}
              </div>
              <h2 class="text-[42px] font-black text-gray-900 tracking-tighter leading-none mb-4">${processName}</h2>
              <div class="flex flex-wrap items-center gap-6 text-[14px] text-gray-500 font-bold">
                <span class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <i class="fa-regular fa-calendar-check text-primary"></i> 
                    ${submittedAt ? new Date(submittedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending'}
                </span>
                ${currentStep ? `
                <span class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <i class="fa-solid fa-bezier-curve text-primary"></i> 
                    ${currentStep}
                </span>` : ''}
              </div>
            </div>

            <div class="flex flex-col items-start lg:items-end gap-3">
              <div class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-1">Current Status</div>
              <div class="flex items-center gap-4">
                ${(status === 2 || status === 'Approved') ? `
                <button id="downloadPdfBtn" class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary text-2xl hover:scale-110 active:scale-95 transition-all group/btn" title="Download Document">
                   <i class="fa-solid fa-file-pdf group-hover/btn:rotate-12"></i>
                </button>` : ''}
                <div class="inline-flex items-center px-10 py-5 rounded-3xl text-[18px] font-black shadow-2xl border-2 border-white/50 ${statusBadge(status)} gap-4 transition-all hover:scale-105 active:scale-95 cursor-default group-hover:shadow-primary/10">
                  <i class="fa-solid ${statusIcon(status)} scale-125"></i> 
                  ${statusLabel(status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ATTACHMENTS PANEL -->
        <div class="ui-section-card rounded-[32px] p-10" id="attachmentsPanel">
          <div class="flex items-center justify-between gap-3 mb-8 pb-6 border-b border-gray-100/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-lg shadow-inner"><i class="fa-solid fa-paperclip"></i></div>
              <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest">Attachments</h3>
            </div>
            <label class="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <i class="fa-solid fa-upload"></i> Upload
              <input type="file" id="attachmentFileInput" multiple class="hidden">
            </label>
          </div>
          <div id="attachmentUploadError" class="hidden mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-[13px] flex items-center gap-2"></div>
          <div id="attachmentsList" class="space-y-3">
            <div class="flex items-center justify-center py-10 text-gray-300 gap-3">
              <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          <!-- LEFT: DATA ELEMENTS -->
          <div class="lg:col-span-2 space-y-8">
            <div class="ui-section-card rounded-[32px] p-10 h-full">
              <div class="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100/50">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shadow-inner"><i class="fa-solid fa-database"></i></div>
                  <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest">Submission Details</h3>
              </div>
              
              ${fieldValues.length > 0 ? `
                <div class="space-y-8">
                  ${fieldValues.map(f => `
                    <div class="group">
                      <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-hover:text-primary transition-colors">${f.fieldName || f.FieldName}</dt>
                      <dd class="text-[15px] font-extrabold text-gray-800 bg-white/60 p-4 rounded-2xl border border-gray-100/50 shadow-inner group-hover:bg-white transition-all transform group-hover:translate-x-1">
                        ${f.fieldValue || f.FieldValue || '—'}
                      </dd>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="py-12 text-center">
                    <span class="text-primary font-bold">Document Details</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Status & History</span>
                </div>
              `}
            </div>
          </div>

          <!-- RIGHT: ENHANCED TIMELINE -->
          <div class="lg:col-span-3 space-y-8">
            <div class="ui-section-card rounded-[32px] p-10">
              <div class="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100/50">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shadow-inner"><i class="fa-solid fa-timeline"></i></div>
                  <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest">Approval Progress</h3>
              </div>

              ${stepResponses.length > 0 ? `
                <div class="relative ml-6 border-l-4 border-gray-100 space-y-12 pb-10">
                  ${stepResponses.map((s, idx) => {
        const outcome = s.outcome || s.Outcome;
        const isPending = !(s.completedAt || s.CompletedAt);
        const isRejected = outcome === 'Reject' || outcome === '3' || outcome === 3;
        const isOnHold = outcome === 'OnHold' || outcome === 'onhold' || outcome === '5' || outcome === 5;
        const colorClass = isPending ? 'amber' : (isRejected ? 'red' : (isOnHold ? 'amber' : 'emerald'));

        return `
                      <div class="relative pl-12 group">
                        <!-- BALL -->
                        <div class="absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-white ${isPending ? 'bg-amber-400 animate-pulse' : (colorClass === 'red' ? 'bg-red-500' : (colorClass === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'))} shadow-md z-10 transition-transform group-hover:scale-125"></div>
                        
                        <div class="bg-white/80 p-8 rounded-[24px] border border-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:-translate-y-1 group-hover:bg-white relative">
                          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h4 class="text-[18px] font-black text-gray-800 leading-none mb-2">${s.stepName || s.StepName}</h4>
                                <div class="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <i class="fa-solid fa-user-tie text-[12px]"></i> ${s.reviewer || 'System Protocol'} 
                                    &bull; 
                                    <i class="fa-solid fa-clock text-[12px]"></i> ${s.completedAt ? new Date(s.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Pending'}
                                </div>
                            </div>
                            ${outcome ? `
                            <span class="inline-flex items-center px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 ${statusBadge(outcome)}">
                                <i class="fa-solid ${statusIcon(outcome)} mr-2"></i> ${statusLabel(outcome)}
                            </span>` : ''}
                          </div>
                          
                          ${s.remarks ? `
                          <div class="mt-6 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 italic text-[14px] text-gray-600 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                            <i class="fa-solid fa-quote-left absolute -top-2 -left-1 text-gray-100 text-4xl group-hover:text-primary/10 transition-colors"></i>
                            <span class="relative z-10">${s.remarks}</span>
                          </div>` : ''}
                        </div>
                      </div>
                    `;
      }).join('')}
                </div>
              ` : `
                <div class="py-20 text-center">
                    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-route text-gray-200 text-3xl"></i>
                    </div>
                    <p class="text-[14px] font-black text-gray-400 uppercase tracking-[2px]">Workflow nodes have not initialized.</p>
                </div>
              `}
            </div>
          </div>
        </div>
      `;

      // Download PDF Event Listener
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
          a.download = `Submission_${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (err) { alert(err.message); }
        finally { btn.disabled = false; btn.innerHTML = originalHTML; }
      });

      // --- ATTACHMENTS ---
      const renderAttachments = (attachments) => {
        const list = document.getElementById('attachmentsList');
        if (!list) return;
        if (!attachments || attachments.length === 0) {
          list.innerHTML = `
            <div class="py-10 text-center">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-paperclip text-gray-200 text-2xl"></i>
              </div>
              <p class="text-[13px] font-black text-gray-400 uppercase tracking-[2px]">No attachments yet</p>
            </div>`;
          return;
        }
        list.innerHTML = attachments.map(a => {
          const attId = a.id || a.Id;
          const name = a.fileName || a.FileName || 'Attachment';
          return `
            <div class="flex items-center justify-between gap-4 p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm hover:bg-white transition-all group" data-att-id="${attId}">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 text-sm">
                  <i class="fa-solid fa-file"></i>
                </div>
                <span class="text-[13px] font-bold text-gray-700 truncate">${name}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button class="att-download-btn w-8 h-8 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-all" data-att-id="${attId}" data-att-name="${name}" title="Download">
                  <i class="fa-solid fa-download text-xs"></i>
                </button>
                <button class="att-delete-btn w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all" data-att-id="${attId}" title="Delete">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>`;
        }).join('');

        // Download handlers
        list.querySelectorAll('.att-download-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const attId = btn.dataset.attId;
            const attName = btn.dataset.attName;
            try {
              const res = await api.downloadAttachment(id, attId);
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = attName;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            } catch (err) { alert(err.message); }
          });
        });

        // Delete handlers
        list.querySelectorAll('.att-delete-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const attId = btn.dataset.attId;
            if (!confirm('Delete this attachment?')) return;
            try {
              await api.deleteAttachment(id, attId);
              const updated = await api.getAttachments(id);
              renderAttachments(updated);
            } catch (err) { alert(err.message); }
          });
        });
      };

      // Load attachments
      api.getAttachments(id).then(renderAttachments).catch(() => {
        const list = document.getElementById('attachmentsList');
        if (list) list.innerHTML = `<p class="text-center text-[13px] text-red-400 font-bold py-6">Failed to load attachments.</p>`;
      });

      // Upload handler
      document.getElementById('attachmentFileInput')?.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const errBox = document.getElementById('attachmentUploadError');
        errBox?.classList.add('hidden');
        const list = document.getElementById('attachmentsList');
        const originalHTML = list?.innerHTML;
        if (list) list.innerHTML = `<div class="flex items-center justify-center py-10 gap-3 text-gray-400 font-bold text-[13px]"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</div>`;
        try {
          await api.uploadAttachments(id, files);
          const updated = await api.getAttachments(id);
          renderAttachments(updated);
        } catch (err) {
          if (list && originalHTML) list.innerHTML = originalHTML;
          if (errBox) {
            errBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${err.message}`;
            errBox.classList.remove('hidden');
          }
        }
        e.target.value = '';
      });

    } catch (err) {
      container.innerHTML = `
        <div class="ui-card rounded-[40px] border-red-100 bg-red-50/30 p-20 text-center max-w-2xl mx-auto shadow-2xl">
          <div class="w-20 h-20 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h2 class="text-[28px] font-black text-red-700 tracking-tight mb-4">Error Loading Data</h2>
          <p class="text-red-600 text-[16px] font-medium leading-relaxed opacity-70">${err.message}</p>
          <button onclick="window.location.reload()" class="ui-button-primary mt-10 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-200">Retry</button>
        </div>
      `;
    }
  }
};
