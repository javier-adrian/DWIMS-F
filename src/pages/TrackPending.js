import { api } from '../api/client.js';

export const TrackPending = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="mb-14">
        <h1 class="ui-page-title mb-4">Track My Submissions</h1>
        <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Monitor the current progress and evaluation status of your document submissions.</p>
      </div>

      <!-- REGISTRY TABLE CACHE -->
      <div class="ui-section-card rounded-[48px] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-100/50">
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Document</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Date Submitted</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Status</th>
                <th class="px-10 py-8 text-right text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Action</th>
              </tr>
            </thead>
            <tbody id="trackPendingList" class="divide-y divide-gray-100/30">
              <tr>
                 <td colspan="4" class="px-10 py-32 text-center">
                    <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
                    <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Retrieving Records...</p>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  init: () => {
    const list = document.getElementById('trackPendingList');

    const loadList = async () => {
      try {
        const data = await api.getMySubmissions();
        const docs = Array.isArray(data) ? data : (data.items || []);

        if (docs.length === 0) {
          list.innerHTML = `
            <tr>
              <td colspan="4" class="px-10 py-32 text-center opacity-30">
                  <i class="fa-solid fa-ghost text-6xl mb-6"></i>
                  <p class="text-[12px] font-black uppercase tracking-[4px]">No Submissions Found</p>
              </td>
            </tr>`;
          return;
        }

        const mapStatus = (statusNum) => {
          if (statusNum === 0 || statusNum === 1) return { l: 'Pending', c: 'bg-primary/5 text-primary border-primary/10 shadow-sm', i: 'fa-spinner fa-spin' };
          if (statusNum === 2) return { l: 'Complete', c: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm', i: 'fa-check-double' };
          if (statusNum === 3) return { l: 'Rejected', c: 'bg-red-500/10 text-red-600 border-red-500/20 shadow-sm', i: 'fa-shield-xmark' };
          return { l: 'Archived', c: 'bg-gray-100 text-gray-400 border-gray-200', i: 'fa-box-archive' };
        };

        list.innerHTML = docs.map(d => {
          const st = mapStatus(d.status);
          const date = d.createdAt ? new Date(d.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
          return `
            <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <i class="fa-solid fa-file-contract text-2xl opacity-40"></i>
                        </div>
                        <div>
                            <p class="text-[18px] font-black text-gray-900 leading-none mb-2 group-hover:text-primary transition-colors">${d.processName || d.process?.title || 'Document Protocol'}</p>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID &middot; ${(d.id || 'N/A').toString().substring(0, 12).toUpperCase()}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-8">
                    <div class="flex items-center gap-3 text-[13px] font-black text-gray-600">
                        <i class="fa-regular fa-clock opacity-30"></i> ${date}
                    </div>
                </td>
                <td class="px-10 py-8">
                    <span class="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 ${st.c}">
                        <i class="fa-solid ${st.i} text-[11px] opacity-70"></i> ${st.l}
                    </span>
                </td>
                <td class="px-10 py-8 text-right">
                    <a href="#/track/${d.id}" class="ui-button-primary px-6 py-3 text-[11px] uppercase tracking-widest">
                        Track Status <i class="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>
                    </a>
                </td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        list.innerHTML = `<tr><td colspan="4" class="px-10 py-10 text-center text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Queue Access Warning: ${err.message}</td></tr>`;
      }
    };

    loadList();
  }
};
