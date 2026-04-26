import { api } from '../api/client.js';

export const AdministratorReviewers = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
        <div>
           <h1 class="ui-page-title mb-4">Personnel Directory</h1>
           <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Manage staff roles and their department assignments.</p>
        </div>
        <button id="addReviewerBtn" class="group ui-button-primary text-[15px] px-10 py-5 rounded-[24px]">
          <i class="fa-solid fa-user-plus text-xl group-hover:scale-110 transition-transform"></i> Add New Staff
        </button>
      </div>

      <!-- DIRECTORY TABLE CACHE -->
      <div class="ui-section-card rounded-[32px] overflow-hidden">
          <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-100/50">
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">User Name & Email</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">User Role</th>
                <th class="px-10 py-8 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Department</th>
                <th class="px-10 py-8 text-right text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Actions</th>
              </tr>
            </thead>
            <tbody id="reviewersList" class="divide-y divide-gray-100/30">
              <tr>
                 <td colspan="4" class="px-10 py-32 text-center">
                    <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
                    <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Loading Staff List...</p>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  init: () => {
    // Inject Modal into Portal
    const portal = document.getElementById('modalPortal');
    if (portal) {
      portal.innerHTML = `
        <div id="addReviewerModal" class="hidden ui-modal-shell">
            <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeReviewerModalBg"></div>
            <div class="ui-modal-panel max-w-lg overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="addReviewerModalContent">
                <!-- Close Button -->
                <button type="button" id="closeReviewerModalBtnX" class="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100/80 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center focus:outline-none z-10">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>

                <div class="p-10 lg:p-14">
                    <div class="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <h3 class="text-[28px] font-black text-gray-900 leading-tight mb-2">Assign Role</h3>
                    <p class="text-[14px] text-gray-500 font-medium mb-10 italic opacity-70">Assign system access and department mapping for a user.</p>
                    
                    <form id="addReviewerForm" class="space-y-8">
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">User Email</label>
                        <input id="reviewerEmail" type="email" class="ui-input-lg w-full" placeholder="user@kld.edu.ph" required>
                      </div>
                      
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Assigned Department</label>
                        <select id="reviewerDepartmentId" class="ui-input-lg w-full cursor-pointer" required>
                          <option value="">Querying Registry...</option>
                        </select>
                      </div>

                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Select Role</label>
                        <select id="reviewerRole" class="ui-input-lg w-full cursor-pointer">
                          <option value="0">Submitter</option>
                          <option value="1">Reviewer</option>
                          <option value="2">Administrator</option>
                          <option value="3">Super Admin</option>
                        </select>
                      </div>
                    </form>
                </div>
                
                <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4">
                    <button id="closeReviewerModalBtn" class="text-[12px] font-black text-gray-400 p-4 hover:text-gray-900 uppercase tracking-widest transition-all">Discard</button>
                    <button id="saveReviewerBtn" class="ui-button-primary text-[15px] px-10 py-4 rounded-2xl">
                        <i class="fa-solid fa-fingerprint text-lg opacity-70"></i> Save Staff Role
                    </button>
                </div>
            </div>
        </div>
      `;
    }

    const list = document.getElementById('reviewersList');
    const modal = document.getElementById('addReviewerModal');
    const roleMap = { 0: 'Submitter', 1: 'Reviewer', 2: 'Admin', 3: 'Super Admin' };
    const roleIconMap = { 0: 'fa-user-pen', 1: 'fa-user-check', 2: 'fa-user-gear', 3: 'fa-user-shield' };

    const loadReviewers = async () => {
      try {
        const departments = await api.getDepartments();
        let allMembers = [];
        for (const dept of departments) {
          try {
            const members = await api.getDepartmentMembers(dept.id);
            allMembers = allMembers.concat(members.map(m => ({ ...m, departmentName: dept.name })));
          } catch (e) { console.error(e); }
        }

        if (allMembers.length === 0) {
          list.innerHTML = `
            <tr>
                <td colspan="4" class="px-10 py-32 text-center opacity-30">
                    <i class="fa-solid fa-users-slash text-6xl mb-6"></i>
                    <p class="text-[12px] font-black uppercase tracking-[4px]">No Personnel Mapped</p>
                </td>
            </tr>`;
          return;
        }

        list.innerHTML = allMembers.map(m => {
          const initials = ((m.firstName?.[0] || '') + (m.lastName?.[0] || 'U')).toUpperCase();
          const roleVal = m.role ?? m.generalRole ?? 0;
          return `
            <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary font-black text-[18px] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          ${initials}
                        </div>
                        <div>
                            <p class="text-[17px] font-black text-gray-900 leading-none mb-2 group-hover:text-primary transition-colors">${m.firstName || ''} ${m.lastName || 'Personnel'}</p>
                            <p class="text-[12px] font-bold text-gray-400 italic opacity-80">${m.email || 'node-offline'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-8">
                    <span class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100/50 text-gray-500 font-black text-[10px] uppercase tracking-widest border border-gray-200 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <i class="fa-solid ${roleIconMap[roleVal]} opacity-40"></i> TIER-${roleVal} &middot; ${roleMap[roleVal]}
                    </span>
                </td>
                <td class="px-10 py-8">
                    <div class="flex items-center gap-3 text-[14px] font-black text-gray-700">
                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        ${m.departmentName || 'Global Registry'}
                    </div>
                </td>
                <td class="px-10 py-8 text-right">
                    <button class="remove-role-btn w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ml-auto" data-id="${m.roleId || m.id}">
                        <i class="fa-solid fa-user-xmark"></i>
                    </button>
                </td>
            </tr>
          `;
        }).join('');

        // Attach Rejection Listeners
        document.querySelectorAll('.remove-role-btn').forEach(btn => {
          btn.onclick = async () => {
            const id = btn.dataset.id;
            if (confirm('Irreversible Action: Revoke institutional deployment link?')) {
              try {
                await api.removeRole(id);
                await loadReviewers();
              } catch (e) { alert(e.message); }
            }
          };
        });

      } catch (e) { console.error(e); }
    };

    const toggleModal = (show) => {
      const content = document.getElementById('addReviewerModalContent');
      if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => {
          content.classList.remove('scale-95', 'opacity-0', 'translate-y-4');
          content.classList.add('scale-100', 'opacity-100', 'translate-y-0');
        }, 10);
      } else {
        content.classList.add('scale-95', 'opacity-0', 'translate-y-4');
        content.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
        setTimeout(() => {
          modal.classList.add('hidden');
          document.getElementById('addReviewerForm').reset();
        }, 300);
      }
    };

    document.getElementById('addReviewerBtn').onclick = async () => {
      toggleModal(true);
      const select = document.getElementById('reviewerDepartmentId');
      try {
        const depts = await api.getDepartments();
        select.innerHTML = '<option value="" disabled selected>Allocation Node...</option>' +
          depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
      } catch (e) { }
    };

    document.getElementById('closeReviewerModalBtn').onclick = () => toggleModal(false);
    document.getElementById('closeReviewerModalBtnX').onclick = () => toggleModal(false);
    document.getElementById('closeReviewerModalBg').onclick = () => toggleModal(false);

    document.getElementById('saveReviewerBtn').onclick = async (e) => {
      const btn = e.currentTarget;
      const email = document.getElementById('reviewerEmail').value;
      const deptId = document.getElementById('reviewerDepartmentId').value;
      const role = document.getElementById('reviewerRole').value;
      if (!email || !deptId) return alert('Strict parameters violation: Hub and Scope required.');

      const initial = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        await api.assignRole(email, deptId, role);
        toggleModal(false);
        await loadReviewers();
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.innerHTML = initial; }
    };

    loadReviewers();
  }
};
