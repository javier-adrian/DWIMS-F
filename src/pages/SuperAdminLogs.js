import { api } from '../api/client.js';

export const SuperAdminLogs = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="mb-14">
          <h1 class="ui-page-title mb-4">Activity History</h1>
          <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Monitor system-wide activity and administrative operations.</p>
      </div>

      <!-- AUDIT SCOPE FILTERS -->
      <div class="ui-section-card rounded-[40px] overflow-hidden p-10 mb-12">
         <div class="flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[3px] mb-8">
              <i class="fa-solid fa-filter"></i> Filter Activity
         </div>
        <form id="logFilterForm" class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="group">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 px-1 group-hover:text-primary transition-colors">Activity Type</label>
            <input type="text" id="filterAction" placeholder="e.g. Submission" class="ui-input-lg w-full">
          </div>
          <div class="group">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 px-1 group-hover:text-primary transition-colors">User ID</label>
            <input type="text" id="filterUserId" placeholder="Search by ID..." class="ui-input-lg w-full font-mono">
          </div>
          <div class="group">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 px-1 group-hover:text-primary transition-colors">Date</label>
            <input type="date" id="filterFrom" class="ui-input-lg w-full">
          </div>
          <div class="flex items-end">
            <button type="submit" class="ui-button-primary w-full text-[15px] py-4">
              <i class="fa-solid fa-magnifying-glass text-lg opacity-70"></i> View Logs
            </button>
          </div>
        </form>
      </div>

      <!-- TELEMETRY FEED -->
      <div class="ui-section-card rounded-[32px] overflow-hidden">
        <div class="px-10 py-8 border-b border-gray-100/50 bg-gray-50/30 flex items-center justify-between">
            <h3 class="text-[14px] font-black text-gray-700 flex items-center gap-2 italic uppercase tracking-widest"><i class="fa-solid fa-server text-primary"></i> Activity History</h3>
        </div>
        <div class="overflow-x-auto min-h-[500px]">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-100/50">
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Time</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Activity</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">User</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Details</th>
              </tr>
            </thead>
            <tbody id="logsTableBody" class="divide-y divide-gray-100/30">
              <tr>
                  <td colspan="4" class="px-10 py-32 text-center">
                     <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6 font-thin"></i>
                     <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Loading history...</p>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- TELEMETRY PAGINATION -->
        <div class="bg-gray-50/50 px-10 py-8 border-t border-gray-100/50 flex items-center justify-between">
          <button id="prevPageBtn" class="bg-white hover:bg-gray-50 text-gray-400 hover:text-primary border border-gray-200 text-[11px] font-black px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-3 uppercase tracking-widest disabled:opacity-20" disabled>
             <i class="fa-solid fa-arrow-left"></i> Previous
          </button>
          <div class="flex flex-col items-center">
              <span id="currentPageLabel" class="text-[18px] font-black text-gray-900 leading-none">1</span>
          </div>
          <button id="nextPageBtn" class="bg-white hover:bg-gray-50 text-gray-400 hover:text-primary border border-gray-200 text-[11px] font-black px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-3 uppercase tracking-widest disabled:opacity-20">
            Next <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  init: () => {
    const tableBody = document.getElementById('logsTableBody');
    const filterForm = document.getElementById('logFilterForm');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageLabel = document.getElementById('currentPageLabel');

    let currentPage = 1;
    let currentFilters = {};

    const loadLogs = async (page = 1) => {
      tableBody.innerHTML = `
        <tr><td colspan="4" class="px-10 py-32 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Searching logs...</p>
        </td></tr>`;

      try {
        const res = await api.getLogs({ ...currentFilters, page, pageSize: 20 });
        const items = Array.isArray(res) ? res : (res.items || res.data || []);

        if (items.length === 0) {
          tableBody.innerHTML = `
            <tr><td colspan="4" class="px-10 py-32 text-center opacity-30">
                <i class="fa-solid fa-terminal text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">No logs found</p>
            </td></tr>`;
          nextPageBtn.disabled = true;
        } else {
          tableBody.innerHTML = items.map(log => {
            const date = new Date(log.timestamp || log.Timestamp);
            const action = log.action || log.Action || '—';
            let details = log.details || log.Details || '';
            if (typeof details === 'object') details = JSON.stringify(details);

            return `
              <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                   <div class="flex flex-col">
                     <span class="text-[14px] font-black text-gray-900 leading-none mb-1.5">${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                     <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                   </div>
                </td>
                <td class="px-10 py-8">
                  <span class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest border border-primary/10 shadow-sm">
                    <i class="fa-solid fa-microchip opacity-30"></i> ${action}
                  </span>
                </td>
                <td class="px-10 py-8">
                  <div class="flex items-center gap-3 text-[12px] font-black font-mono text-gray-400 group-hover:text-gray-800 transition-colors">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                      ${log.userId || 'Institutional System'}
                  </div>
                </td>
                <td class="px-10 py-8">
                  <div class="bg-white/50 p-4 rounded-2xl border border-gray-100 shadow-inner max-w-md">
                     <p class="text-[11px] font-mono font-medium text-gray-500 line-clamp-3 group-hover:line-clamp-none transition-all">${details || 'No details available.'}</p>
                  </div>
                </td>
              </tr>
            `;
          }).join('');
          nextPageBtn.disabled = items.length < 20;
        }

        currentPage = page;
        currentPageLabel.textContent = currentPage;
        prevPageBtn.disabled = currentPage === 1;

      } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="4" class="px-10 py-8 text-center text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Unable to load logs: ${err.message}</td></tr>`;
      }
    };

    filterForm.onsubmit = (e) => {
      e.preventDefault();
      currentFilters = {
        actionFilter: document.getElementById('filterAction').value || undefined,
        userIdFilter: document.getElementById('filterUserId').value || undefined,
        from: document.getElementById('filterFrom').value || undefined,
      };
      loadLogs(1);
    };

    prevPageBtn.onclick = () => { if (currentPage > 1) loadLogs(currentPage - 1); };
    nextPageBtn.onclick = () => loadLogs(currentPage + 1);

    loadLogs(1);
  }
};
