import { api } from '../api/client.js';

export const SuperAdminDepartments = {
  render: () => `
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
        <div>
           <h1 class="ui-page-title mb-4">Departments</h1>
           <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Oversee the organizational structure of the campus system.</p>
        </div>
        <button id="addDepartmentBtn" class="group ui-button-primary text-[15px] px-10 py-5 rounded-[24px]">
          <i class="fa-solid fa-plus text-xl group-hover:scale-110 transition-transform"></i> New Department
        </button>
      </div>

      <!-- ENTITY REGISTRY TABLE -->
      <div class="ui-section-card rounded-[32px] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-100/50">
                <th class="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Department Name</th>
                <th class="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Status</th>
                <th class="px-8 py-6 text-right text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Settings</th>
              </tr>
            </thead>
            <tbody id="departmentTableBody" class="divide-y divide-gray-100/30">
              <tr>
                 <td colspan="3" class="px-10 py-32 text-center">
                    <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
                    <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Loading Registry...</p>
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
        <div id="departmentModal" class="hidden ui-modal-shell">
            <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeModalBg"></div>
            <div class="ui-modal-panel max-w-lg overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="departmentModalContent">
                <!-- Close Button -->
                <button type="button" id="closeModalBtnX" class="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100/80 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center focus:outline-none z-10">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>

                <div class="p-10 lg:p-14">
                    <div class="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                        <i class="fa-solid fa-building-circle-check"></i>
                    </div>
                    <h3 id="modal-title" class="text-[24px] font-black text-gray-900 leading-tight mb-2">Register Department</h3>
                    <p class="text-[14px] text-gray-500 font-medium mb-8 italic opacity-70">Initialize a new department within the system.</p>
                    
                    <form id="departmentForm" class="space-y-8">
                      <input type="hidden" id="departmentId">
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Department Name</label>
                        <input id="departmentName" type="text" class="ui-input-lg w-full" placeholder="e.g. Center for Innovation" required>
                      </div>
                      
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Description</label>
                        <textarea id="departmentDescription" rows="4" class="ui-input-lg w-full resize-none min-h-[120px]" placeholder="Briefly describe the department's role..."></textarea>
                      </div>
                    </form>
                </div>
                
                <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4">
                    <button id="closeModalBtn" class="text-[12px] font-black text-gray-400 p-4 hover:text-gray-900 uppercase tracking-widest transition-all">Abort</button>
                    <button id="saveDepartmentBtn" class="ui-button-primary text-[15px] px-10 py-4 rounded-2xl">
                        <i class="fa-solid fa-cloud-bolt text-lg opacity-70"></i> Commit Registry
                    </button>
                </div>
            </div>
        </div>
      `;
    }

    const tbody = document.getElementById('departmentTableBody');
    const modal = document.getElementById('departmentModal');
    const modalTitle = document.getElementById('modal-title');
    const saveBtn = document.getElementById('saveDepartmentBtn');

    const loadDepartments = async () => {
      try {
        const departments = await api.getDepartments();
        if (!departments || departments.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="3" class="px-10 py-32 text-center opacity-30">
                  <span class="text-primary font-bold">Departments</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Managing Institutional<br>Process Units</span>
              </td>
            </tr>`;
          return;
        }
        tbody.innerHTML = departments.map(d => `
          <tr class="group hover:bg-white/40 transition-all">
            <td class="px-10 py-8">
              <div class="flex items-center gap-6">
                  <div class="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <i class="fa-solid fa-building-shield text-2xl opacity-40"></i>
                  </div>
                  <div>
                    <a href="#/admin/departments/${d.id}" class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none">${d.name}</a>
                  </div>
              </div>
            </td>
            <td class="px-10 py-8">
              <p class="text-[14px] font-bold text-gray-500 italic leading-relaxed opacity-80 max-w-md line-clamp-2">
                  ${d.description || 'No description provided.'}
              </p>
            </td>
            <td class="px-10 py-8 text-right">
                <div class="flex items-center justify-end gap-4">
                    <span class="inline-flex px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-black text-[9px] uppercase tracking-widest border border-emerald-500/20 shadow-sm">Operational</span>
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button data-edit="${d.id}" data-name="${d.name}" data-desc="${(d.description || '').replace(/"/g, '&quot;')}" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all">
                            <i class="fa-solid fa-sliders"></i>
                        </button>
                        <button data-delete="${d.id}" data-name="${d.name.replace(/"/g, '&quot;')}" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 shadow-sm flex items-center justify-center transition-all">
                            <i class="fa-solid fa-link-slash"></i>
                        </button>
                    </div>
                </div>
            </td>
          </tr>
        `).join('');
      } catch (e) {
        tbody.innerHTML = `<tr><td colspan="3" class="px-10 py-8 text-center text-red-500 font-black uppercase text-[10px] tracking-widest"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Registry Access Error</td></tr>`;
      }
    };

    const toggleModal = (show, department = null) => {
      const content = document.getElementById('departmentModalContent');
      if (show) {
        document.getElementById('departmentId').value = department ? department.id : '';
        document.getElementById('departmentName').value = department ? department.name : '';
        document.getElementById('departmentDescription').value = department ? department.description : '';
        modalTitle.textContent = department ? 'Modify Configuration' : 'Register Department';
        saveBtn.innerHTML = department ? '<i class="fa-solid fa-cloud-arrow-up"></i> Save Changes' : '<i class="fa-solid fa-cloud-bolt text-lg opacity-70"></i> Add Department';

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
          document.getElementById('departmentForm').reset();
        }, 300);
      }
    };

    document.getElementById('addDepartmentBtn').onclick = () => toggleModal(true);
    document.getElementById('closeModalBtn').onclick = () => toggleModal(false);
    document.getElementById('closeModalBtnX').onclick = () => toggleModal(false);
    document.getElementById('closeModalBg').onclick = () => toggleModal(false);

    tbody.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('[data-edit]');
      const deleteBtn = e.target.closest('[data-delete]');
      if (editBtn) {
        toggleModal(true, {
          id: editBtn.dataset.edit,
          name: editBtn.dataset.name,
          description: editBtn.dataset.desc
        });
      }
      if (deleteBtn) {
        if (confirm(`Irreversible Action: Decommission "${deleteBtn.dataset.name}" and all associated deployment links?`)) {
          try {
            await api.deleteDepartment(deleteBtn.dataset.delete);
            await loadDepartments();
          } catch (e) { alert(e.message); }
        }
      }
    });

    saveBtn.onclick = async () => {
      const id = document.getElementById('departmentId').value;
      const name = document.getElementById('departmentName').value;
      const description = document.getElementById('departmentDescription').value;
      if (!name) return alert('Entity identifier strictly required.');

      const initial = saveBtn.innerHTML;
      saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        if (id) await api.updateDepartment(id, name, description);
        else await api.createDepartment(name, description);
        toggleModal(false);
        await loadDepartments();
      } catch (err) { alert(err.message); }
      finally { saveBtn.disabled = false; saveBtn.innerHTML = initial; }
    };

    loadDepartments();
  }
};
