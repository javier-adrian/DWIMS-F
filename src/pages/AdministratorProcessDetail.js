import { api } from '../api/client.js';

export const AdministratorProcessDetail = {
  render: (params) => `
    <div class="ui-page-shell">
      
      <!-- NAVIGATION & HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
        <div>
          <button id="backBtn" onclick="window.history.back()" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px] mb-8">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to Registry
          </button>
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-primary/10 text-primary rounded-[28px] flex items-center justify-center text-3xl shadow-inner">
                <i class="fa-solid fa-diagram-project"></i>
            </div>
            <div>
                <h1 id="processHeaderName" class="ui-page-title mb-3">Document Workflow Design</h1>
                <p id="processHeaderDesc" class="ui-muted font-medium italic opacity-80">Design and manage the approval sequence for this institutional workflow.</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
            <button id="deleteProcessBtn" class="flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[14px] font-black shadow-sm">
                <i class="fa-solid fa-trash-can"></i> Delete Workflow
            </button>
        </div>
      </div>

      <!-- MAIN CANVAS -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- LEFT: STEP CONFIGURATION -->
        <div class="lg:col-span-12 xl:col-span-8 space-y-10">
          
          <!-- TEMPLATE UPLOAD PANEL -->
          <div class="ui-section-card rounded-[40px] overflow-hidden p-10 relative group">
              <div class="absolute top-0 right-0 p-10 opacity-[0.03] text-red-500 text-9xl group-hover:scale-110 transition-transform duration-1000"><i class="fa-solid fa-file-pdf"></i></div>
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10 pb-8 border-b border-gray-100/50">
                  <div>
                    <h3 class="text-[22px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <i class="fa-solid fa-file-contract text-red-500 opacity-80"></i> Official Document Template
                    </h3>
                    <p class="text-[13px] text-gray-400 font-bold uppercase tracking-widest mt-1">Base PDF for document mapping</p>
                  </div>
                  <span id="docStatus" class="hidden items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-[11px] uppercase tracking-widest border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                    <i class="fa-solid fa-circle-check"></i> Template Ready
                  </span>
              </div>

              <div id="docUploadArea" class="border-4 border-dashed border-gray-100 bg-gray-50/50 rounded-[28px] p-12 text-center hover:border-primary/30 hover:bg-white transition-all cursor-pointer relative group/upload">
                  <div class="w-16 h-16 mx-auto bg-white shadow-xl rounded-2xl flex items-center justify-center text-gray-300 mb-6 group-hover/upload:scale-110 transition-transform">
                     <i class="fa-solid fa-cloud-arrow-up text-2xl group-hover/upload:text-primary transition-colors"></i>
                  </div>
                  <p class="text-[15px] text-gray-600 font-extrabold mb-1">Upload Document Template</p>
                  <p class="text-[12px] text-gray-400 font-medium uppercase tracking-widest">DRAG PDF SOURCE OR BROWSE LOCAL FILES</p>
                  <input type="file" id="docFileInput" accept=".pdf,application/pdf" class="hidden">
              </div>

              <div id="docFilePreview" class="hidden mt-6 items-center justify-between bg-white px-8 py-6 rounded-[24px] border-2 border-gray-100 shadow-xl animate-scale-in">
                  <div class="flex items-center gap-6">
                    <div class="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <p id="docFileName" class="text-[16px] font-black text-gray-900 truncate max-w-sm"></p>
                      <p id="docFileSize" class="text-[12px] text-gray-400 font-bold uppercase tracking-widest"></p>
                    </div>
                  </div>
                  <button type="button" id="removeDocBtn" class="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
              </div>

              <div class="mt-8 flex items-center justify-end gap-6">
                <span id="docMsg" class="text-[12px] font-black uppercase tracking-widest hidden"></span>
                <button type="button" id="uploadDocBtn" class="hidden items-center gap-3 py-4 px-10 rounded-2xl shadow-2xl text-[14px] font-black text-white bg-gray-900 hover:bg-black transition-all hover:-translate-y-1 active:scale-95">
                  <i class="fa-solid fa-cloud-bolt text-primary"></i> Save Template
                </button>
              </div>
          </div>

          <!-- ROUTING ENGINE PANEL -->
          <div class="ui-section-card rounded-[40px] overflow-hidden flex flex-col">
              <div class="p-10 border-b border-gray-100/50 flex items-center justify-between">
                <div>
                    <h3 class="text-[22px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <i class="fa-solid fa-share-nodes text-primary opacity-80"></i> Approval Sequence
                    </h3>
                    <p class="text-[13px] text-gray-400 font-bold uppercase tracking-widest mt-1">Define the order of approval steps</p>
                </div>
                <button id="addStepBtn" class="group ui-button-primary text-[13px] px-6 py-3 rounded-xl">
                  <i class="fa-solid fa-plus-circle group-hover:rotate-90 transition-transform"></i> Add Step
                </button>
              </div>
              
              <ul id="stepsList" class="divide-y divide-gray-100/50 min-h-[300px]">
                <!-- Steps Dynamic -->
              </ul>
          </div>
        </div>

        <!-- RIGHT: DATA ARCHITECTURE PANEL -->
        <div class="lg:col-span-12 xl:col-span-4 space-y-10">
            <div class="ui-section-card rounded-[40px] overflow-hidden flex flex-col h-full">
                <div class="p-10 border-b border-gray-100/50 flex flex-col gap-6">
                    <div class="flex items-center justify-between w-full">
                        <h3 class="text-[18px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <i class="fa-solid fa-table-list text-primary opacity-50"></i> Document Fields
                        </h3>
                        <button id="addFieldBtn" class="w-10 h-10 rounded-xl bg-white text-primary border border-gray-100 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <ul id="fieldsList" class="divide-y divide-gray-100/50 flex-grow">
                  <!-- Fields Dynamic -->
                </ul>
            </div>
        </div>
      </div>
    </div>
  `,
  init: async (params) => {
    const processId = params.id;
    if (!processId) return;

    // Inject Modals into Portal
    const portal = document.getElementById('modalPortal');
    if (portal) {
      portal.innerHTML = `
        <!-- MODAL: ADD STEP -->
        <div id="addStepModal" class="hidden ui-modal-shell">
            <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeStepBg"></div>
            <div class="ui-modal-panel max-w-lg overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="stepModalContent">
                <div class="p-10 lg:p-14">
                    <div class="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                        <i class="fa-solid fa-bezier-curve"></i>
                    </div>
                    <h3 id="stepModalTitle" class="text-[28px] font-black text-gray-900 leading-tight mb-2">Configure Approval Step</h3>
                    <p class="text-[14px] text-gray-500 font-medium mb-10 italic opacity-70">Set the requirements and department for this step.</p>
                    
                    <form id="addStepForm" class="space-y-8">
                      <input type="hidden" id="editStepId">
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Step Title</label>
                        <input id="stepTitle" type="text" class="ui-input-lg w-full" placeholder="e.g. Dean Approval" required>
                      </div>
                      
                      <div class="grid grid-cols-2 gap-8">
                        <div class="group">
                            <label class="ui-label group-hover:text-primary transition-colors">Sequence</label>
                            <input id="stepOrder" type="number" min="1" class="ui-input-lg w-full" value="1" required>
                        </div>
                        <div class="group">
                            <label class="ui-label group-hover:text-primary transition-colors">Access Tier</label>
                            <select id="stepRole" class="ui-input-lg w-full cursor-pointer">
                              <option value="0">Submitter</option>
                              <option value="1" selected>Reviewer</option>
                              <option value="2">Administrator</option>
                              <option value="3">Super Administrator</option>
                            </select>
                        </div>
                      </div>

                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Target Department</label>
                        <select id="stepDepartment" class="ui-input-lg w-full cursor-pointer" required>
                          <option value="">Connecting Register...</option>
                        </select>
                      </div>
                    </form>
                </div>
                
                <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4">
                    <button id="closeStepBtn" class="text-[12px] font-black text-gray-400 p-4 hover:text-gray-900 uppercase tracking-widest transition-all">Cancel</button>
                    <button id="saveStepBtn" class="ui-button-primary px-10 py-4 text-[15px]">
                        <i class="fa-solid fa-microchip text-lg opacity-70"></i> Save Step
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL: ADD FIELD -->
        <div id="addFieldModal" class="hidden ui-modal-shell">
            <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" id="closeFieldBg"></div>
            <div class="ui-modal-panel max-w-md overflow-hidden transform transition-all scale-95 opacity-0 duration-300 translate-y-4" id="fieldModalContent">
                <div class="p-10 lg:p-12">
                    <div class="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">
                        <i class="fa-solid fa-brackets-terminal"></i>
                    </div>
                    <h3 class="text-[28px] font-black text-gray-900 leading-tight mb-2">Add Field</h3>
                    <p class="text-[14px] text-gray-500 font-medium mb-10 italic opacity-70">Define a new required piece of information for this document.</p>
                    
                    <form id="addFieldForm" class="space-y-8">
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Field Name</label>
                        <input id="fieldTitle" type="text" class="ui-input-lg w-full" placeholder="e.g. Student ID" required>
                      </div>
                      
                      <div class="group">
                        <label class="ui-label group-hover:text-primary transition-colors">Field Type</label>
                        <select id="fieldType" class="ui-input-lg w-full cursor-pointer">
                          <option value="0">Text Stream</option>
                          <option value="1">Numeric Input</option>
                          <option value="2">Calendar Vector</option>
                          <option value="3">Boolean Toggle</option>
                          <option value="4">Digital Signature Node</option>
                        </select>
                      </div>

                      <label class="flex items-center gap-4 p-6 border-2 border-gray-100 rounded-2xl bg-white/50 cursor-pointer hover:border-primary/20 transition-all select-none group/toggle">
                        <div class="relative">
                            <input id="fieldRequired" type="checkbox" checked class="peer h-8 w-8 appearance-none rounded-xl border-2 border-gray-200 checked:border-primary checked:bg-primary transition-all">
                            <i class="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                        </div>
                        <span class="text-[14px] font-black text-gray-700 uppercase tracking-widest group-hover/toggle:text-primary transition-colors">Required Field</span>
                      </label>
                    </form>
                </div>
                
                <div class="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end">
                    <button id="saveFieldBtn" class="ui-button-primary w-full py-5 text-[15px]">
                        <i class="fa-solid fa-database text-lg opacity-70"></i> Save Field
                    </button>
                </div>
            </div>
        </div>
      `;
    }

    const stepsList = document.getElementById('stepsList');
    const fieldsList = document.getElementById('fieldsList');
    const roleIconMap = { 0: 'fa-user-pen', 1: 'fa-user-check', 2: 'fa-user-gear', 3: 'fa-user-shield' };
    const typeLabelMap = { 0: 'Text', 1: 'Numeric', 2: 'Date', 3: 'Boolean', 4: 'Signature' };

    const loadData = async () => {
      try {
        const p = await api.getProcess(processId);
        if (p) {
          document.getElementById('processHeaderName').innerText = p.name || p.title || 'Untitled Architecture';
          const hasDoc = p.hasDocument || p.HasDocument;
          if (hasDoc) {
            document.getElementById('docStatus')?.classList.remove('hidden');
            document.getElementById('docStatus')?.classList.add('inline-flex');
          }
          // Load Fields
          const fields = p.fields || p.Fields || [];
          if (fields.length === 0) {
            fieldsList.innerHTML = `
              <div class="py-20 text-center opacity-20">
                  <i class="fa-solid fa-code text-4xl mb-4"></i>
                  <p class="text-[11px] font-black uppercase tracking-widest">No Mapping</p>
              </div>
            `;
          } else {
            fieldsList.innerHTML = fields.map(f => `
              <li class="px-10 py-6 border-b border-gray-100/50 flex items-center justify-between group hover:bg-white/40 transition-all">
                  <div class="flex items-center gap-5">
                      <div class="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <i class="fa-solid fa-microchip text-[14px] opacity-40"></i>
                      </div>
                      <div>
                          <p class="text-[14px] font-extrabold text-gray-800 leading-none mb-1 group-hover:text-primary transition-colors">${f.name || f.title || f.Name || f.Title}</p>
                          <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">${typeLabelMap[f.type || 0] || 'Dynamic'}</p>
                      </div>
                  </div>
                  ${f.required ? '<i class="fa-solid fa-shield-check text-primary text-xs opacity-50"></i>' : ''}
              </li>
            `).join('');
          }
        }

        // Load Steps
        const stepsRes = await api.getProcessSteps(processId);
        const steps = Array.isArray(stepsRes) ? stepsRes : (stepsRes.items || stepsRes.data || []);

        if (steps.length === 0) {
          stepsList.innerHTML = `
            <div class="py-32 text-center opacity-30 select-none">
                <i class="fa-solid fa-route text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">Sequence Matrix Empty</p>
            </div>
          `;
        } else {
          stepsList.innerHTML = steps.sort((a, b) => (a.order || 0) - (b.order || 0)).map(s => `
            <li class="px-10 py-8 flex items-center justify-between group hover:bg-white/40 transition-all relative text-left">
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-primary group-hover:h-12 transition-all rounded-r-full shadow-[0_0_15px_rgba(11,93,59,0.3)]"></div>
              <div class="flex items-center gap-8 text-left">
                  <div class="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary font-black text-2xl group-hover:rotate-6 transition-transform">
                      ${s.order || s.Order || 1}
                  </div>
                  <div class="text-left">
                    <h4 class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none mb-2 text-left">${s.name || s.title || s.Name || s.Title}</h4>
                    <div class="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-building-shield opacity-30"></i> ${s.departmentName || 'Global Access'}</span>
                        <span class="opacity-10">|</span>
                        <span class="flex items-center gap-2 text-primary/60"><i class="fa-solid ${roleIconMap[s.role || 0]} opacity-30"></i> TIER-${s.role || 0} ACCESS</span>
                    </div>
                  </div>
              </div>
              <button class="edit-step-btn w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100" data-id="${s.id}" data-title="${s.name || s.title}" data-dept="${s.departmentId}" data-order="${s.order}" data-role="${s.role}">
                <i class="fa-solid fa-sliders"></i>
              </button>
            </li>
          `).join('');
        }
      } catch (err) { console.error(err); }
    };

    await loadData();

    // --- MODAL LOGIC & ANIMATIONS ---
    const toggleModal = (modalId, show) => {
      const modal = document.getElementById(modalId);
      const content = modal?.querySelector('div[id$="Content"]');
      if (!modal || !content) return;
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
          if (modalId === 'addStepModal') {
            const editId = document.getElementById('editStepId');
            if (editId) editId.value = '';
            const title = document.getElementById('stepModalTitle');
            if (title) title.innerText = 'Configure Node';
          }
        }, 300);
      }
    };

    document.getElementById('addStepBtn').onclick = () => toggleModal('addStepModal', true);
    document.getElementById('closeStepBtn').onclick = () => toggleModal('addStepModal', false);
    document.getElementById('closeStepBg').onclick = () => toggleModal('addStepModal', false);

    document.getElementById('addFieldBtn').onclick = () => toggleModal('addFieldModal', true);
    document.getElementById('closeFieldBg').onclick = () => toggleModal('addFieldModal', false);

    // Populate Departments
    try {
      const depts = await api.getDepartments();
      const select = document.getElementById('stepDepartment');
      if (select) select.innerHTML = depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    } catch (e) { }

    // Edit Step Delegation
    stepsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.edit-step-btn');
      if (!btn) return;
      document.getElementById('editStepId').value = btn.dataset.id;
      document.getElementById('stepTitle').value = btn.dataset.title;
      document.getElementById('stepDepartment').value = btn.dataset.dept;
      document.getElementById('stepOrder').value = btn.dataset.order;
      document.getElementById('stepRole').value = btn.dataset.role;
      document.getElementById('stepModalTitle').innerText = 'Modify Node Architect';
      toggleModal('addStepModal', true);
    });

    // Save Step
    document.getElementById('saveStepBtn').onclick = async (e) => {
      const btn = e.currentTarget;
      const id = document.getElementById('editStepId').value;
      const payload = {
        title: document.getElementById('stepTitle').value,
        departmentId: document.getElementById('stepDepartment').value,
        order: parseInt(document.getElementById('stepOrder').value),
        role: parseInt(document.getElementById('stepRole').value)
      };
      const initial = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        if (id) await api.updateProcessStep(processId, id, payload);
        else await api.addProcessStep(processId, { processId, ...payload });
        toggleModal('addStepModal', false);
        await loadData();
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.innerHTML = initial; }
    };

    // Save Field
    document.getElementById('saveFieldBtn').onclick = async (e) => {
      const btn = e.currentTarget;
      const payload = {
        processId: processId,
        title: document.getElementById('fieldTitle').value,
        inputType: parseInt(document.getElementById('fieldType').value),
        required: document.getElementById('fieldRequired').checked
      };
      const initial = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        await api.addProcessField(processId, payload);
        toggleModal('addFieldModal', false);
        await loadData();
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.innerHTML = initial; }
    };

    // Document Upload
    const uploadArea = document.getElementById('docUploadArea');
    const fileInput = document.getElementById('docFileInput');
    const preview = document.getElementById('docFilePreview');
    const finalizeBtn = document.getElementById('uploadDocBtn');

    if (uploadArea) uploadArea.onclick = () => fileInput.click();
    if (fileInput) fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file || file.type !== 'application/pdf') return alert('PDF source required.');
      document.getElementById('docFileName').innerText = file.name;
      document.getElementById('docFileSize').innerText = (file.size / 1024 / 1024).toFixed(2) + ' MB';
      uploadArea.classList.add('hidden');
      preview.classList.remove('hidden');
      finalizeBtn.classList.remove('hidden');
    };

    document.getElementById('removeDocBtn').onclick = () => {
      fileInput.value = '';
      uploadArea.classList.remove('hidden');
      preview.classList.add('hidden');
      finalizeBtn.classList.add('hidden');
    };

    finalizeBtn.onclick = async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const initial = finalizeBtn.innerHTML;
      finalizeBtn.disabled = true; finalizeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      try {
        await api.uploadDocument(processId, file);
        document.getElementById('docMsg').innerText = 'SECURED';
        document.getElementById('docMsg').className = 'text-[10px] font-black text-emerald-600 uppercase tracking-widest';
        document.getElementById('docMsg').classList.remove('hidden');
        document.getElementById('docStatus').classList.remove('hidden');
        setTimeout(() => { window.location.reload(); }, 1500);
      } catch (err) { alert(err.message); }
      finally { finalizeBtn.disabled = false; finalizeBtn.innerHTML = initial; }
    };

    const deleteBtn = document.getElementById('deleteProcessBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to completely delete this workflow? This action cannot be undone.')) {
          const initial = deleteBtn.innerHTML;
          deleteBtn.disabled = true;
          deleteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
          try {
            await api.deleteProcess(processId);
            window.location.hash = '#/admin/documents';
          } catch (err) {
            alert('Failed to delete workflow: ' + err.message);
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = initial;
          }
        }
      });
    }
  }
};
