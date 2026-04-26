import { api } from '../api/client.js';
import { navigateTo } from '../router/index.js';

export const SuperAdminDepartmentDetail = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- NAVIGATION & HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
        <div>
          <button id="backBtn" onclick="window.history.back()" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px] mb-8">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to Registry
          </button>
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-primary/10 text-primary rounded-[28px] flex items-center justify-center text-3xl shadow-inner">
                <i class="fa-solid fa-hotel"></i>
            </div>
            <div>
                <h1 id="deptName" class="ui-page-title mb-3">Institutional Node</h1>
                <p id="deptDesc" class="ui-muted font-medium italic opacity-80">Functional mandate and operational scope for this organizational unit.</p>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
            <div class="px-6 py-4 bg-white/60 rounded-[20px] border border-white shadow-sm flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><i class="fa-solid fa-fingerprint"></i></div>
                <div>
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Entity ID</p>
                    <p id="deptIdTag" class="text-[13px] font-black text-gray-800 leading-none">SYS-000</p>
                </div>
            </div>
        </div>
      </div>

      <!-- MAIN CANVAS -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- LEFT: PROCESS ARCHITECTURE -->
        <div class="lg:col-span-12 xl:col-span-7 space-y-10">
            <div class="ui-section-card rounded-[40px] overflow-hidden flex flex-col min-h-[500px]">
                <div class="p-10 border-b border-gray-100/50 flex items-center justify-between">
                    <div>
                        <h3 class="text-[22px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <i class="fa-solid fa-sitemap text-primary opacity-80"></i> Process Pipelines
                        </h3>
                        <p class="text-[13px] text-gray-400 font-bold uppercase tracking-widest mt-1">Operational frameworks assigned to this node</p>
                    </div>
                    <button id="addProcessBtn" class="group ui-button-primary text-[13px] px-6 py-3 rounded-xl">
                      <i class="fa-solid fa-plus-circle group-hover:rotate-90 transition-transform"></i> Scope Protocol
                    </button>
                </div>
                
                <ul id="processList" class="divide-y divide-gray-100/50 flex-grow">
                   <!-- Processes Dynamic -->
                </ul>
            </div>
        </div>

        <!-- RIGHT: MEMBER AFFILIATION -->
        <div class="lg:col-span-12 xl:col-span-5 space-y-10">
            <div class="ui-section-card rounded-[40px] overflow-hidden flex flex-col h-full min-h-[500px]">
                <div class="p-10 border-b border-gray-100/50 flex items-center justify-between">
                    <div>
                        <h3 class="text-[22px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <i class="fa-solid fa-users-gear text-primary opacity-80"></i> Personnel Hub
                        </h3>
                        <p class="text-[13px] text-gray-400 font-bold uppercase tracking-widest mt-1">Affiliated institutional members</p>
                    </div>
                    <button id="addMemberBtn" class="w-10 h-10 rounded-xl bg-white text-primary border border-gray-100 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <i class="fa-solid fa-user-plus"></i>
                    </button>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <tbody id="membersList" class="divide-y divide-gray-100/30">
                          <!-- Members Dynamic -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD MEMBER -->
    <div id="addMemberModal" class="hidden ui-modal-shell">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeMemberModalBg"></div>
        <div class="ui-modal-panel max-w-lg overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="memberModalContent">
            <div class="p-10 lg:p-14">
                <div class="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                    <i class="fa-solid fa-user-link"></i>
                </div>
                <h3 class="text-[28px] font-black text-gray-900 leading-tight mb-2">Integrate Member</h3>
                <p class="text-[14px] text-gray-500 font-medium mb-10 italic opacity-70">Attach an institutional identity to this departmental node.</p>
                
                <form id="addMemberForm" class="space-y-8">
                  <div class="group">
                    <label class="ui-label group-hover:text-primary transition-colors">Personnel Email</label>
                    <input id="memberEmail" type="email" class="ui-input-lg w-full" placeholder="user@kld.edu.ph" required>
                  </div>
                  
                  <div class="group">
                    <label class="ui-label group-hover:text-primary transition-colors">Authorization Level</label>
                    <select id="memberRole" class="ui-input-lg w-full cursor-pointer">
                      <option value="0">TIER-0 &middot; Standard Submitter</option>
                      <option value="1" selected>TIER-1 &middot; Department Reviewer</option>
                      <option value="2">TIER-2 &middot; Process Administrator</option>
                    </select>
                  </div>
                </form>
            </div>
            
            <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4">
                <button id="closeMemberModalBtn" class="text-[12px] font-black text-gray-400 p-4 hover:text-gray-900 uppercase tracking-widest transition-all">Discard</button>
                <button id="saveMemberBtn" class="ui-button-primary px-10 py-4 text-[15px]">
                    <i class="fa-solid fa-link text-lg opacity-70"></i> Commit Integration
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL: ADD PROCESS -->
    <div id="addProcessModal" class="hidden ui-modal-shell">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeProcessModalBg"></div>
        <div class="ui-modal-panel max-w-lg overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="processModalContent">
            <div class="p-10 lg:p-14">
                <div class="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                    <i class="fa-solid fa-route"></i>
                </div>
                <h3 class="text-[28px] font-black text-gray-900 leading-tight mb-2">Scope Protocol</h3>
                <p class="text-[14px] text-gray-500 font-medium mb-10 italic opacity-70">Define a new operational framework for this organizational node.</p>
                
                <form id="addProcessForm" class="space-y-8">
                  <div class="group">
                    <label class="ui-label group-hover:text-primary transition-colors">Protocol Nomenclature</label>
                    <input id="processTitle" type="text" class="ui-input-lg w-full" placeholder="e.g. Clearance Review" required>
                  </div>
                </form>
            </div>
            
            <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4">
                <button id="closeProcessModalBtn" class="text-[12px] font-black text-gray-400 p-4 hover:text-gray-900 uppercase tracking-widest transition-all">Abort</button>
                <button id="saveProcessBtn" class="ui-button-primary px-10 py-4 text-[15px]">
                    <i class="fa-solid fa-diagram-project text-lg opacity-70"></i> Commit Protocol
                </button>
            </div>
        </div>
    </div>
  `,
  init: async (params) => {
    const deptId = params.id;
    if (!deptId) return;

    const roleMap = { 0: 'Submitter', 1: 'Reviewer', 2: 'Administrator', 3: 'Super Admin' };
    const roleIconMap = { 0: 'fa-user-pen', 1: 'fa-user-check', 2: 'fa-user-gear', 3: 'fa-user-shield' };

    const loadData = async () => {
      try {
        const departments = await api.getDepartments();
        const dept = departments.find(d => d.id === deptId);
        if (dept) {
          document.getElementById('deptName').innerText = dept.name;
          document.getElementById('deptDesc').innerText = dept.description || 'Functional mandate unassigned.';
          document.getElementById('deptIdTag').innerText = `UNIT-${deptId.substring(0, 8).toUpperCase()}`;
        }

        const [allProcesses, members] = await Promise.all([
          api.getProcesses(),
          api.getDepartmentMembers(deptId)
        ]);

        const deptProcesses = (allProcesses || []).filter(p => p.departmentId === deptId);
        const processList = document.getElementById('processList');
        if (deptProcesses.length === 0) {
          processList.innerHTML = `
            <div class="py-32 text-center opacity-30 select-none">
                <i class="fa-solid fa-sitemap text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">No Frameworks Scope</p>
            </div>`;
        } else {
          processList.innerHTML = deptProcesses.map(p => `
            <li class="px-10 py-8 flex items-center justify-between group hover:bg-white/40 transition-all relative">
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-primary group-hover:h-12 transition-all rounded-r-full shadow-[0_0_15px_rgba(11,93,59,0.3)]"></div>
              <div class="flex items-center gap-8">
                  <div class="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                      <i class="fa-solid fa-diagram-project text-2xl opacity-40"></i>
                  </div>
                  <div>
                    <h4 class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none mb-2">${p.name || p.title || 'Untitled Protocol'}</h4>
                    <div class="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-layer-group opacity-30"></i> ${p.stepsCount || 0} Architected Nodes</span>
                        <span class="opacity-10">|</span>
                        <span class="flex items-center gap-2 ${p.hasTemplate ? 'text-emerald-500' : 'text-gray-300'}"><i class="fa-solid ${p.hasTemplate ? 'fa-file-shield' : 'fa-file-slash'} opacity-30"></i> ${p.hasTemplate ? 'Template Synchronized' : 'Baseline Missing'}</span>
                    </div>
                  </div>
              </div>
              <a href="#/admin/documents/${p.id}" class="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <i class="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
              </a>
            </li>
          `).join('');
        }

        const membersList = document.getElementById('membersList');
        if (!members || members.length === 0) {
          membersList.innerHTML = `
            <tr><td class="px-10 py-20 text-center opacity-20">
                <i class="fa-solid fa-users-slash text-4xl mb-4"></i>
                <p class="text-[11px] font-black uppercase tracking-widest">Isolated Node</p>
            </td></tr>`;
        } else {
          membersList.innerHTML = members.map(m => {
            const initials = ((m.firstName?.[0] || '') + (m.lastName?.[0] || 'U')).toUpperCase();
            const roleVal = m.role ?? m.generalRole ?? 0;
            return `
              <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-6">
                    <div class="flex items-center gap-5">
                        <div class="w-12 h-12 rounded-xl bg-white border border-gray-50 shadow-md flex items-center justify-center text-primary font-black text-[12px] group-hover:scale-110 transition-transform">${initials}</div>
                        <div>
                            <p class="text-[14px] font-black text-gray-900 leading-none group-hover:text-primary transition-colors mb-1">${m.firstName || ''} ${m.lastName || 'Member'}</p>
                            <p class="text-[10px] font-medium text-gray-400 italic">${m.email || 'offline-hub'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 font-black text-[9px] uppercase tracking-widest border border-gray-200 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <i class="fa-solid ${roleIconMap[roleVal]} opacity-30"></i> TIER-${roleVal}
                    </span>
                </td>
                <td class="px-10 py-6 text-right">
                    <button class="remove-role-btn w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100" data-id="${m.roleId || m.id}">
                        <i class="fa-solid fa-user-minus"></i>
                    </button>
                </td>
              </tr>`;
          }).join('');

          document.querySelectorAll('.remove-role-btn').forEach(btn => {
            btn.onclick = async () => {
              if (confirm('Irreversible Action: Decouple member affiliation from this node?')) {
                try {
                  await api.removeRole(btn.dataset.id);
                  await loadData();
                } catch (e) { alert(e.message); }
              }
            };
          });
        }
      } catch (err) { console.error(err); }
    };

    await loadData();

    // Modal Control
    const toggleModal = (modalId, show) => {
      const modal = document.getElementById(modalId);
      const content = modal.querySelector('div[id$="Content"]');
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
          modal.querySelector('form')?.reset();
        }, 300);
      }
    };

    document.getElementById('addMemberBtn').onclick = () => toggleModal('addMemberModal', true);
    document.getElementById('closeMemberModalBtn').onclick = () => toggleModal('addMemberModal', false);
    document.getElementById('closeMemberModalBg').onclick = () => toggleModal('addMemberModal', false);

    document.getElementById('addProcessBtn').onclick = () => toggleModal('addProcessModal', true);
    document.getElementById('closeProcessModalBtn').onclick = () => toggleModal('addProcessModal', false);
    document.getElementById('closeProcessModalBg').onclick = () => toggleModal('addProcessModal', false);

    document.getElementById('saveMemberBtn').onclick = async (e) => {
      const btn = e.currentTarget;
      const email = document.getElementById('memberEmail').value;
      const role = document.getElementById('memberRole').value;
      if (!email) return alert('Hub identifier required.');
      const initial = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        await api.assignRole(email, deptId, role);
        toggleModal('addMemberModal', false);
        await loadData();
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.innerHTML = initial; }
    };

    document.getElementById('saveProcessBtn').onclick = async (e) => {
      const btn = e.currentTarget;
      const title = document.getElementById('processTitle').value;
      if (!title) return alert('Protocol nomenclature required.');
      const initial = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        await api.createProcess(title, deptId);
        toggleModal('addProcessModal', false);
        await loadData();
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.innerHTML = initial; }
    };
  }
};
