import { api } from '../api/client.js';

export const NewSubmission = {
  render: () => `
    <div class="ui-page-shell max-w-5xl">
      
      <!-- NAVIGATION & HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button id="backBtn" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px] mb-8">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Back to Dashboard
          </button>
          <h1 class="ui-page-title mb-4">New Submission</h1>
          <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Submit your document to the campus records system.</p>
        </div>
        
        <!-- STEP INDICATOR -->
        <div class="flex items-center gap-4 bg-white/40 p-2 rounded-2xl border border-white/60">
            <div id="step1Indicator" class="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary text-white shadow-lg transition-all duration-500">
                <span class="text-[11px] font-black uppercase tracking-widest">Type</span>
                <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</div>
            </div>
            <div class="w-8 h-[2px] bg-gray-200"></div>
            <div id="step2Indicator" class="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-100/50 text-gray-400 transition-all duration-500">
                <span class="text-[11px] font-black uppercase tracking-widest">Entry</span>
                <div class="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">2</div>
            </div>
        </div>
      </div>

      <!-- MAIN CONTAINER -->
      <div class="ui-section-card rounded-[32px] overflow-hidden">
        
        <!-- STEP 1: SELECTION -->
        <div id="processSelectionState" class="p-10 lg:p-20 text-center flex flex-col items-center">
            <div class="w-24 h-24 bg-primary/10 text-primary rounded-[32px] flex items-center justify-center text-4xl shadow-inner mb-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <i class="fa-solid fa-layer-group"></i>
            </div>
            <h3 class="text-[22px] font-black text-gray-800 mb-2">Select Document Type</h3>
            <p class="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-10">Choose the correct form to proceed</p>

            <div class="w-full max-w-md relative group mb-12">
                <select id="processDropdown" class="ui-input-lg w-full cursor-pointer pr-14 text-[18px]">
                  <option value="">Loading document types...</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-primary text-lg pointer-events-none group-hover:scale-110 transition-transform"></i>
            </div>
            
            <button id="startProcessBtn" disabled class="group ui-button-primary disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-[16px] px-14 py-6 rounded-3xl">
              Confirm & Prepare Form <i class="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
            </button>
        </div>

        <!-- STEP 2: FORM -->
        <div id="formFillingState" class="hidden">
          <div class="px-10 lg:px-20 py-12 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-8">
              <div class="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-primary text-3xl shrink-0">
                  <i class="fa-solid fa-file-signature"></i>
              </div>
              <div class="flex-1">
                  <div class="inline-flex px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-2">Form Details</div>
                  <h2 id="selectedProcessName" class="text-[36px] font-black text-gray-900 tracking-tighter leading-none mb-2"></h2>
                  <p class="text-[15px] text-gray-500 font-medium italic opacity-70">Please fill out all required fields accurately.</p>
              </div>
          </div>

          <div class="p-10 lg:p-20">
            <form id="submissionForm">
              <div id="dynamicFieldsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <!-- Dynamically Injected -->
              </div>
              
              <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-20 pt-10 border-t border-gray-100">
                <button type="button" id="cancelProcessBtn" class="text-[12px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all p-4">
                  <i class="fa-solid fa-trash-can mr-2"></i> Discard Selection
                </button>
                <button type="submit" id="submitSubmissionBtn" class="group ui-button-primary text-[16px] px-14 py-6 rounded-3xl">
                  <i class="fa-solid fa-paper-plane group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i> Finalize Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  init: async () => {
    const processDropdown = document.getElementById('processDropdown');
    const startProcessBtn = document.getElementById('startProcessBtn');
    const processSelectionState = document.getElementById('processSelectionState');
    const formFillingState = document.getElementById('formFillingState');
    const selectedProcessName = document.getElementById('selectedProcessName');
    const dynamicFieldsContainer = document.getElementById('dynamicFieldsContainer');
    const submissionForm = document.getElementById('submissionForm');
    const cancelProcessBtn = document.getElementById('cancelProcessBtn');
    const submitBtn = document.getElementById('submitSubmissionBtn');

    const step1Ind = document.getElementById('step1Indicator');
    const step2Ind = document.getElementById('step2Indicator');

    let currentProcessId = null;
    let currentFields = [];

    try {
      const processes = await api.getProcesses();
      if (!processes || processes.length === 0) {
        processDropdown.innerHTML = '<option value="">No document protocols found.</option>';
      } else {
        processDropdown.innerHTML = '<option value="">-- Choose Protocol --</option>' +
          processes.map(p => `<option value="${p.id || p.Id}">${p.name || p.title || p.Name}</option>`).join('');

        processDropdown.addEventListener('change', (e) => {
          startProcessBtn.disabled = !e.target.value;
        });
      }
    } catch (err) {
      processDropdown.innerHTML = '<option value="">Synchronization failed.</option>';
      console.error(err);
    }

    startProcessBtn.addEventListener('click', async () => {
      currentProcessId = processDropdown.value;
      const processName = processDropdown.options[processDropdown.selectedIndex].text;

      // Update Step UI
      step1Ind.classList.remove('bg-primary', 'text-white', 'shadow-lg');
      step1Ind.classList.add('bg-white/40', 'text-primary');
      step1Ind.querySelector('div').innerText = '✓';

      step2Ind.classList.remove('bg-gray-100/50', 'text-gray-400');
      step2Ind.classList.add('bg-primary', 'text-white', 'shadow-lg');

      processSelectionState.classList.add('hidden');
      formFillingState.classList.remove('hidden');
      selectedProcessName.innerText = processName;
      dynamicFieldsContainer.innerHTML = `
        <div class="col-span-full py-20 text-center">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-primary mb-4"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-widest">Preparing form fields...</p>
        </div>
      `;

      try {
        const processDetails = await api.getProcess(currentProcessId);
        currentFields = processDetails.fields || processDetails.Fields || [];

        if (currentFields.length === 0) {
          dynamicFieldsContainer.innerHTML = '<div class="col-span-full p-8 bg-blue-50/50 text-blue-800 rounded-3xl border border-blue-100 font-bold text-center">This protocol requires no additional data inputs. Proceed to final submission.</div>';
        } else {
          dynamicFieldsContainer.innerHTML = currentFields.map((f, i) => {
            const id = f.id || f.Id;
            const name = f.name || f.Name;
            const type = f.type !== undefined ? f.type : f.Type;
            const required = f.required !== undefined ? f.required : f.Required;
            const autofocus = i === 0 ? 'autofocus' : '';

            let inputHtml = '';
            const baseClass = "ui-input-lg w-full";

            if (type === 0) {
              inputHtml = `<input type="text" id="field_${id}" placeholder="Enter ${name.toLowerCase()}" ${required ? 'required' : ''} ${autofocus} class="${baseClass}">`;
            } else if (type === 1) {
              inputHtml = `<input type="number" id="field_${id}" placeholder="Numeric entry" ${required ? 'required' : ''} ${autofocus} class="${baseClass}">`;
            } else if (type === 2) {
              inputHtml = `<input type="date" id="field_${id}" ${required ? 'required' : ''} ${autofocus} class="${baseClass}">`;
            } else if (type === 4) {
              inputHtml = `
                <div class="col-span-full mt-4 p-10 border-2 border-dashed border-gray-200 rounded-[32px] bg-white/20 flex flex-col items-center text-center group hover:border-primary/40 hover:bg-white transition-all shadow-inner">
                  <div class="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 transition-transform group-hover:rotate-6">
                    <i class="fa-solid fa-signature text-2xl"></i>
                  </div>
                  <p class="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-6">Digital Signature</p>
                  <input type="text" id="field_${id}" placeholder="Full Name (Legal Signature)" ${required ? 'required' : ''} class="w-full max-w-sm border-b-2 border-gray-300 focus:border-primary bg-transparent text-center font-serif italic text-primary text-3xl py-3 px-4 focus:outline-none focus:ring-0 placeholder-gray-100 transition-all">
                  <p class="text-[11px] text-gray-400 font-medium mt-8 leading-relaxed max-w-xs">By typing your name, you agree that the information provided is correct.</p>
                </div>
              `;
            } else {
              inputHtml = `<input type="text" id="field_${id}" ${required ? 'required' : ''} ${autofocus} class="${baseClass}">`;
            }

            return `
              <div class="${type === 4 ? 'col-span-full' : ''} group">
                <label class="block text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-3 px-3 transition-colors group-hover:text-primary">
                    ${name} ${required ? '<span class="text-primary ml-1">*</span>' : ''}
                </label>
                ${inputHtml}
              </div>
            `;
          }).join('');
        }
      } catch (err) {
        dynamicFieldsContainer.innerHTML = `<div class="col-span-full p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold">Failed to load protocol fields.</div>`;
      }
    });

    cancelProcessBtn.addEventListener('click', () => {
      window.location.reload(); // Hard reset for aesthetic transition back
    });

    submissionForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payloadFields = currentFields.map(f => {
        const id = f.id || f.Id;
        const inputEl = document.getElementById(`field_${id}`);
        return {
          fieldId: id,
          fieldValue: inputEl ? inputEl.value : ''
        };
      });

      const payload = {
        processId: currentProcessId,
        fields: payloadFields
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Finalizing...';

      try {
        await api.createSubmission(payload);
        submitBtn.className = "bg-emerald-500 text-white font-black px-14 py-6 rounded-3xl flex items-center justify-center gap-4";
        submitBtn.innerHTML = '<i class="fa-solid fa-check-double scale-125"></i> Submission Logged';

        setTimeout(() => {
          window.location.hash = '#/home';
        }, 800);
      } catch (err) {
        alert('Transmission error: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Finalize Submission';
      }
    });
  }
};
