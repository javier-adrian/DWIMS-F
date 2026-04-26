import { api, getCurrentUserHighestRole } from '../api/client.js';
import { DashboardSections } from '../components/DashboardSections.js';

export const SubmitterHome = {
  render: () => {
    const highestRole = getCurrentUserHighestRole();

    // Header labels
    let title = "My Dashboard";
    let sub = "Monitor your document submissions and activities in real-time.";

    // Default actions (Submitter - No quick tasks needed per manuscript)
    let quickActions = null;

    if (highestRole === 1) {
      title = "Reviewer Console";
      sub = "Manage pending approvals and track evaluation performance.";
      quickActions = [
        { title: "Review Queue", icon: "fa-list-check", link: "#/review/pending" },
        { title: "My Signature", icon: "fa-signature", link: "#/settings" }
      ];
    } else if (highestRole === 2) {
      title = "Department Analytics";
      sub = "Oversight of departmental document flows and process efficiency.";
      quickActions = [
        { title: "Manage Flows", icon: "fa-diagram-project", link: "#/admin/documents" },
        { title: "Templates", icon: "fa-file-invoice", link: "#/admin/documents" }
      ];
    } else if (highestRole === 3) {
      title = "System Management";
      sub = "Global system activity and administrative oversight.";
      quickActions = [
        { title: "Audit Logs", icon: "fa-terminal", link: "#/superadmin/logs" },
        { title: "Departments", icon: "fa-building-columns", link: "#/superadmin/departments" }
      ];
    }

    return `
    <div class="ui-page-shell">
      
      <!-- ROLE-BASED HEADER -->
      <div class="mb-12 relative p-8 md:p-10 ui-section-card overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div class="ui-tag mb-4">
                  <i class="fa-solid fa-circle-check"></i> System Operational
              </div>
              <h1 class="ui-page-title mb-3">${title}</h1>
              <p class="ui-muted font-medium italic opacity-80">${sub}</p>
            </div>
            <a href="#/submission/new" id="newSubmissionBtn" class="ui-button-primary flex-shrink-0 px-6 py-3.5 text-[15px] rounded-2xl">
              <i class="fa-solid fa-plus text-lg"></i> New Submission
            </a>
          </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- LEFT: STATS & TABLE -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- METRIC CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="relative ui-card p-6 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                  <div>
                    <div class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Submissions</div>
                    <div class="text-[28px] font-black text-gray-900 leading-none" id="stat-total">0</div>
                  </div>
              </div>
              <div class="relative ui-card p-6 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl"><i class="fa-solid fa-hourglass-half"></i></div>
                  <div>
                    <div class="text-[10px] font-black uppercase tracking-widest text-gray-400">Under Review</div>
                    <div class="text-[28px] font-black text-gray-900 leading-none" id="stat-review">0</div>
                  </div>
              </div>
          </div>

          <!-- TABLE SECTION -->
          <div class="ui-card overflow-hidden">
            <div class="px-8 py-6 border-b border-gray-100/50 flex items-center justify-between">
                <h3 class="text-[16px] font-black text-gray-700 flex items-center gap-2">
                    <i class="fa-solid fa-list-ul text-primary"></i> ${highestRole >= 1 ? 'Global Queue' : 'Recent Submissions'}
                </h3>
            </div>
            <div class="overflow-x-auto min-h-[300px]">
              <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50/40 border-b border-gray-100/50">
                  <tr>
                    <th class="py-5 px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Document</th>
                    <th class="py-5 px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Date Submitted</th>
                    <th class="py-5 px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th class="py-5 px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="submissionsList" class="divide-y divide-gray-100">
                  <tr>
                    <td colspan="4" class="p-8 text-center text-sm text-gray-500">
                      <i class="fa-solid fa-spinner fa-spin mr-2"></i> Loading records...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- RIGHT: SIDEBAR -->
        <div class="space-y-8">
           ${quickActions ? `
           <div class="space-y-4">
            <h3 class="text-[13px] font-black text-gray-400 uppercase tracking-[2px] px-2 flex items-center gap-2">
              <i class="fa-solid fa-bolt text-primary"></i> Quick Tasks
            </h3>
            ${DashboardSections.QuickActions(quickActions)}
          </div>
          ` : ''}
          ${DashboardSections.NotificationWidget()}
        </div>
      </div>
    </div>
    `;
  },

  init: async () => {
    const list = document.getElementById('submissionsList');
    if (!list) return;

    const statusMap = {
      0: { label: 'Submitted', style: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'fa-rotate' },
      1: { label: 'In Review', style: 'bg-orange-50 text-orange-700 border-orange-200', icon: 'fa-clock' },
      2: { label: 'Approved', style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'fa-check' },
      3: { label: 'Rejected', style: 'bg-red-50 text-red-700 border-red-200', icon: 'fa-xmark' }
    };

    try {
      const res = await api.getMySubmissions();
      let items = Array.isArray(res) ? res : (res.items || res.Items || res.data || res.Data || []);

      let underReview = 0;
      let approved = 0;
      let rejected = 0;

      items.forEach(s => {
        const statusVal = s.status !== undefined ? s.status : s.Status;
        if (statusVal === 1) underReview++;
        else if (statusVal === 2 || statusVal === 'Approved' || statusVal === 'Complete') approved++;
        else if (statusVal === 3 || statusVal === 'Rejected') rejected++;
        else underReview++;
      });

      const stTotal = document.getElementById('stat-total');
      const stReview = document.getElementById('stat-review');
      if (stTotal) stTotal.textContent = items.length;
      if (stReview) stReview.textContent = underReview;

      if (items.length === 0) {
        list.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">No records found.</td></tr>';
      } else {
        list.innerHTML = items.map(s => {
          const id = s.id || s.Id;
          const type = s.documentType || s.DocumentType || s.name || 'Document';
          const statusVal = s.status !== undefined ? s.status : s.Status;
          const status = statusMap[statusVal] || { label: 'Pending', style: 'bg-gray-100 text-gray-600', icon: 'fa-circle-notch' };
          const dateStr = s.createdAt || s.CreatedAt;
          let formattedDate = dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

          return `
            <tr class="hover:bg-white/40 transition-all group">
              <td class="py-5 px-8 border-b border-gray-100/50">
                <div class="flex items-center gap-3">
                  <div class="w-1.5 h-6 bg-primary/20 rounded-full group-hover:bg-primary transition-colors"></div>
                  <div class="text-[14px] font-extrabold text-gray-800">${type}</div>
                </div>
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50 text-[13px] text-gray-500 font-medium">
                  ${formattedDate}
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50">
                <span class="inline-flex items-center text-[10px] font-black px-3 py-1 rounded-lg border-2 uppercase tracking-widest ${status.style}">
                    <i class="fa-solid ${status.icon} mr-2"></i> ${status.label}
                </span>
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50 text-right">
                <a href="#/track/${id}" class="ui-button-soft text-[12px] font-black px-4 py-2">
                  Track Status
                </a>
              </td>
            </tr>
          `;
        }).join('');
      }
    } catch (err) {
      console.error(err);
      list.innerHTML = `<tr><td colspan="4" class="p-10 text-red-500 text-center font-bold">Failed to load submissions.</td></tr>`;
    }
  }
};
