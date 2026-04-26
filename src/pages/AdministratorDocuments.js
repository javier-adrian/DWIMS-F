import { api } from '../api/client.js';

export const AdministratorDocuments = {
  render: () => `
    <div class="ui-page-shell">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
            <h1 class="ui-page-title mb-3">Manage Workflows</h1>
            <p class="ui-muted font-medium italic opacity-80">Design and manage the document flow for different submission types.</p>
        </div>
        <button id="addDocumentBtn" class="ui-button-primary flex-shrink-0 px-8 py-4 text-[15px] rounded-2xl">
          <i class="fa-solid fa-plus text-lg"></i> Create Workflow
        </button>
      </div>
      
      <div class="ui-section-card rounded-[32px] overflow-hidden">
        <ul id="processList" class="divide-y divide-gray-100/50 flex flex-col min-h-[400px]">
          <li class="flex-grow flex flex-col items-center justify-center py-32 text-center text-gray-300">
            <i class="fa-solid fa-spinner fa-spin text-4xl mb-5 text-primary/30"></i>
            <span class="text-[14px] font-black uppercase tracking-widest">Loading Workflows...</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  init: async () => {
    // Inject Modal into Portal
    const portal = document.getElementById('modalPortal');
    if (portal) {
      portal.innerHTML = `
        <div id="addDocumentModal" class="hidden ui-modal-shell">
            <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeModalBg"></div>
            
            <div class="ui-modal-panel max-w-md overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="addDocumentModalContent">
              <button type="button" id="closeModalBtn" class="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100/80 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center focus:outline-none z-10">
                  <i class="fa-solid fa-xmark text-lg"></i>
              </button>
              
              <div class="p-10 lg:p-12">
                <div class="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-inner">
                    <i class="fa-solid fa-folder-plus"></i>
                </div>
                
                <h3 class="text-[28px] font-black text-gray-900 leading-tight mb-2">Create Workflow</h3>
                <p class="text-[14px] text-gray-500 font-medium mb-10 italic">Define a new document type and its approval process.</p>
                
                <form id="addProcessForm" class="space-y-8">
                  <div class="group">
                    <label class="ui-label group-hover:text-primary transition-colors">Workflow Name</label>
                    <input id="processTitle" type="text" class="ui-input-lg w-full" placeholder="e.g., Leave Request" required>
                  </div>
                  <div class="group">
                    <label class="ui-label group-hover:text-primary transition-colors">Assign to Department</label>
                    <div class="relative">
                        <select id="processDepartmentId" class="ui-input-lg w-full cursor-pointer pr-12" required>
                          <option value="">Loading Registry...</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"></i>
                    </div>
                  </div>
                </form>
              </div>
              
              <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end">
                <button type="button" id="saveProcessBtn" class="ui-button-primary w-full text-[15px] px-10 py-4 rounded-2xl active:translate-y-0">
                    <i class="fa-solid fa-save text-lg opacity-70"></i> Save Workflow
                </button>
              </div>
            </div>
          </div>
      `;
    }

    const modal = document.getElementById('addDocumentModal');
    const openBtn = document.getElementById('addDocumentBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const closeBg = document.getElementById('closeModalBg');
    const saveBtn = document.getElementById('saveProcessBtn');

    if (openBtn) {
      openBtn.addEventListener('click', async () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
          const content = document.getElementById('addDocumentModalContent');
          if (content) {
            content.classList.remove('scale-95', 'opacity-0', 'translate-y-4');
            content.classList.add('scale-100', 'opacity-100', 'translate-y-0');
          }
        }, 10);

        // Load departments into the select dropdown
        const select = document.getElementById('processDepartmentId');
        if (select) {
          try {
            select.innerHTML = '<option value="">Syncing Registry...</option>';
            const depts = await api.getDepartments();
            if (!depts || depts.length === 0) {
              select.innerHTML = '<option value="">No departments available</option>';
            } else {
              select.innerHTML = '<option value="" disabled selected>Select Department</option>' +
                depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
            }
          } catch (e) {
            select.innerHTML = '<option value="">Failed to connect</option>';
          }
        }
      });
    }

    const closeModal = () => {
      const content = document.getElementById('addDocumentModalContent');
      if (content) {
        content.classList.add('scale-95', 'opacity-0', 'translate-y-4');
        content.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
      }

      setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('addProcessForm')?.reset();
      }, 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBg) closeBg.addEventListener('click', closeModal);

    const loadProcesses = async () => {
      const list = document.getElementById('processList');
      if (!list) return;
      try {
        const processes = await api.getProcesses();
        if (!processes || processes.length === 0) {
          list.innerHTML = `
            <li class="flex-grow flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mb-4"><i class="fa-solid fa-folder-open"></i></div>
                <h3 class="text-[16px] font-bold text-gray-800">No processes configured</h3>
                <p class="text-[13px] text-gray-500 mt-1 max-w-sm">Click 'Create Workflow' to map a new document workflow.</p>
            </li>
          `;
          return;
        }
        list.innerHTML = processes.map(p => `
          <li class="hover:bg-white/40 transition-all group animate-fade-in border-b border-gray-100/50 last:border-0 text-left">
            <a href="#/admin/documents/${p.id}" class="block px-8 py-7">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-6 text-left">
                  <div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <i class="fa-solid fa-diagram-project text-2xl opacity-80"></i>
                  </div>
                  <div class="text-left">
                    <p class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none text-left">${p.name || p.title || 'Unnamed Process'}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-primary/20 group-hover:text-primary transition-all">
                    <i class="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </div>
            </a>
          </li>
        `).join('');
      } catch (e) {
        list.innerHTML = `<li class="flex-grow flex items-center justify-center p-8 text-sm text-red-500 font-medium"> <i class="fa-solid fa-circle-exclamation mr-2"></i> Failed to load processes</li>`;
      }
    };

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const title = document.getElementById('processTitle').value;
        const deptId = document.getElementById('processDepartmentId').value;
        if (!title || !deptId) return alert('Title and Department ID are required');

        const originalHtml = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
        try {
          await api.createProcess(title, deptId);
          closeModal();
          await loadProcesses();
        } catch (e) {
          alert('Failed to save process: ' + e.message);
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = originalHtml;
        }
      });
    }

    loadProcesses();
  }
};
