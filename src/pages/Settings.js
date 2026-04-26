import { api } from '../api/client.js';

export const Settings = {
  render: () => `
    <div class="ui-page-shell max-w-6xl">
      
      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="ui-page-title mb-2">Profile Settings</h1>
        <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Manage your profile information and digital signature.</p>
      </div>
      
      <div class="space-y-6">
        <form id="settingsForm" class="space-y-6">
          
          <!-- SECTION: PROFILE -->
          <div class="ui-card rounded-[24px] overflow-hidden">
            <div class="p-6 lg:p-8 lg:grid lg:grid-cols-3 lg:gap-10">
              <div class="mb-6 lg:mb-0">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-[16px] flex items-center justify-center text-xl mb-4 shadow-inner">
                   <i class="fa-solid fa-user-gear"></i>
                </div>
                <h3 class="text-[18px] font-black text-gray-900 tracking-tight mb-1">Profile Details</h3>
                <p class="text-[12px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Update your personal information</p>
              </div>
              
              <div class="lg:col-span-2 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="group">
                    <label for="first-name" class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 px-1 group-hover:text-primary transition-colors">First Name</label>
                    <input type="text" name="first-name" id="first-name" class="ui-input-lg rounded-[14px] border-2 border-gray-100 group-hover:border-gray-200">
                  </div>
  
                  <div class="group">
                    <label for="last-name" class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 px-1 group-hover:text-primary transition-colors">Last Name</label>
                    <input type="text" name="last-name" id="last-name" class="ui-input-lg rounded-[14px] border-2 border-gray-100 group-hover:border-gray-200">
                  </div>
                </div>
  
                <div class="group">
                  <label for="email-address" class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 px-1 group-hover:text-primary transition-colors">School Email</label>
                  <div class="relative">
                      <input type="email" name="email-address" id="email-address" class="ui-input-lg pl-12 pr-5 rounded-[14px] border-2 border-gray-100 group-hover:border-gray-200">
                      <i class="fa-regular fa-envelope absolute left-4.5 top-1/2 -translate-y-1/2 text-primary/30 text-[18px]"></i>
                  </div>
                </div>
  
                <div class="group">
                  <label for="contact-number" class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 px-1 group-hover:text-primary transition-colors">Contact Number</label>
                  <div class="relative">
                      <input type="text" name="contact-number" id="contact-number" placeholder="+63 9xx xxx xxxx" class="ui-input-lg pl-12 pr-5 rounded-[14px] border-2 border-gray-100 group-hover:border-gray-200">
                      <i class="fa-solid fa-mobile-screen absolute left-4.5 top-1/2 -translate-y-1/2 text-primary/30 text-[18px]"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- SECTION: SIGNATURE -->
          <div class="ui-card rounded-[24px] overflow-hidden">
            <div class="p-6 lg:p-8 lg:grid lg:grid-cols-3 lg:gap-10">
              <div class="mb-6 lg:mb-0">
                <div class="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-[16px] flex items-center justify-center text-xl mb-4 shadow-inner">
                   <i class="fa-solid fa-signature"></i>
                </div>
                <h3 class="text-[18px] font-black text-gray-900 tracking-tight mb-1">Digital Signature</h3>
                <p class="text-[12px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Setup your electronic signature</p>
              </div>
              
              <div class="lg:col-span-2">
                 <div class="border-2 border-dashed border-gray-100 rounded-[20px] p-6 bg-white transition-all hover:border-amber-400/40 relative group shadow-sm" id="signaturePadContainer">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <span class="text-[11px] font-black uppercase tracking-[3px] text-gray-400">Draw your signature below</span>
                      <div class="flex items-center gap-6">
                        <span id="signature-status" class="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-emerald-600 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm">
                          <i class="fa-solid fa-shield-halved"></i> Key Registered
                        </span>
                        <button type="button" id="clearSignatureBtn" class="text-[11px] font-black text-gray-400 hover:text-red-500 transition-all flex items-center gap-2 uppercase tracking-widest p-2"><i class="fa-solid fa-eraser text-lg"></i> Clear</button>
                      </div>
                    </div>
                    
                    <div class="border-2 border-gray-100 rounded-[16px] overflow-hidden bg-gray-50/50 shadow-inner mb-6 relative cursor-crosshair active:scale-[0.99] transition-all group-hover:border-amber-500/10">
                       <canvas id="signatureCanvas" width="600" height="150" style="width:100%;height:150px;touch-action:none;"></canvas>
                       <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center opacity-[0.03] select-none text-[100px] text-gray-400 font-serif italic">
                           Enrollment
                       </div>
                    </div>
                    
                    <div class="flex items-center justify-between gap-6">
                      <button type="button" id="saveSignatureBtn" class="bg-gray-900 hover:bg-black text-white text-[14px] font-black px-10 py-5 rounded-[20px] shadow-2xl transition-all flex items-center gap-4 hover:-translate-y-1 active:scale-95">
                        <i class="fa-solid fa-fingerprint text-amber-500 text-xl"></i> Save Signature
                      </button>
                      <span id="signatureMsg" class="text-[13px] hidden font-black uppercase tracking-widest text-emerald-600"></span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
  
          <!-- SECTION: PREFERENCES -->
          <div class="ui-card rounded-[24px] overflow-hidden">
            <div class="p-6 lg:p-8 lg:grid lg:grid-cols-3 lg:gap-10">
              <div class="mb-6 lg:mb-0">
                <div class="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-[16px] flex items-center justify-center text-xl mb-4 shadow-inner">
                   <i class="fa-solid fa-tower-broadcast"></i>
                </div>
                <h3 class="text-[18px] font-black text-gray-900 tracking-tight mb-1">Notification Settings</h3>
                <p class="text-[12px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Alert configuration</p>
              </div>
              
              <div class="lg:col-span-2">
                  <label class="flex items-start gap-6 p-6 border-2 border-gray-100 rounded-[20px] bg-white/80 cursor-pointer hover:border-primary/30 hover:bg-white transition-all w-full group shadow-sm">
                    <div class="relative flex items-center mt-1">
                      <input id="notifications" name="notifications" type="checkbox" class="peer h-10 w-10 cursor-pointer appearance-none rounded-[14px] border-2 border-gray-200 checked:border-primary checked:bg-primary transition-all shadow-sm">
                      <i class="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                    </div>
                    <div>
                        <span class="block text-[18px] font-black text-gray-800 select-none group-hover:text-primary transition-colors tracking-tight">Enable Email Alerts</span>
                        <p class="text-[15px] text-gray-500 font-medium mt-3 leading-relaxed select-none opacity-80 italic">Receive real-time updates regarding your submission status and required actions.</p>
                    </div>
                  </label>
              </div>
            </div>
          </div>
  
          <!-- GLOBAL ACTIONS -->
          <div class="pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-8">
            <button type="button" onclick="window.location.reload()" class="w-full sm:w-auto text-gray-400 hover:text-red-500 text-[12px] font-black uppercase tracking-[3px] transition-all px-10 py-5">
                Discard Changes
            </button>
            <button type="submit" class="ui-button-primary w-full sm:w-auto text-[16px] px-14 py-5 rounded-[24px]">
                <i class="fa-solid fa-cloud-bolt text-xl opacity-70"></i> Update Profile
            </button>
          </div>
          
        </form>
      </div>
    </div>
  `,
  init: async () => {
    const form = document.getElementById('settingsForm');
    if (!form) return;

    // --- Load Profile Data ---
    try {
      const profile = await api.getProfile();
      if (profile) {
        document.getElementById('first-name').value = profile.firstName || profile.FirstName || '';
        document.getElementById('last-name').value = profile.lastName || profile.LastName || '';
        document.getElementById('email-address').value = profile.email || profile.Email || '';
        document.getElementById('contact-number').value = profile.contactNumber || profile.ContactNumber || '';

        const hasSig = profile.hasSignature !== undefined ? profile.hasSignature : profile.HasSignature;
        if (hasSig) {
          const sigStatus = document.getElementById('signature-status');
          if (sigStatus) {
            sigStatus.classList.remove('hidden');
            sigStatus.classList.add('inline-flex');
          }
        }
      }
    } catch (e) { console.error('Profile Retrieval Error', e); }

    // --- Signature Engineering ---
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let paths = [];
    let currentPath = [];

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - r.left, y: cy - r.top };
    }

    const startDraw = (e) => {
      e.preventDefault();
      isDrawing = true;
      const pos = getPos(e);
      currentPath = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      currentPath.push(pos);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const endDraw = (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      if (currentPath.length > 1) paths.push([...currentPath]);
      currentPath = [];
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    document.getElementById('clearSignatureBtn')?.addEventListener('click', () => {
      paths = [];
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    });

    const pathsToSvg = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const pathData = paths.map(stroke => {
        let d = `M ${stroke[0].x.toFixed(2)} ${stroke[0].y.toFixed(2)}`;
        for (let i = 1; i < stroke.length; i++) {
          const cx = (stroke[i - 1].x + stroke[i].x) / 2;
          const cy = (stroke[i - 1].y + stroke[i].y) / 2;
          d += ` Q ${stroke[i - 1].x.toFixed(2)} ${stroke[i - 1].y.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`;
        }
        return `<path d="${d}" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      }).join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${pathData}</svg>`;
    };

    document.getElementById('saveSignatureBtn')?.addEventListener('click', async () => {
      const msg = document.getElementById('signatureMsg');
      const btn = document.getElementById('saveSignatureBtn');
      if (paths.length === 0) return alert('Input signature required.');

      const initial = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      try {
        await api.uploadSignature(pathsToSvg());
        msg.textContent = 'Enrolled successfully.';
        msg.classList.remove('hidden');
        document.getElementById('signature-status')?.classList.remove('hidden');
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.innerHTML = initial; }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Synchronizing...';

      try {
        await api.updateProfile({
          firstName: document.getElementById('first-name').value,
          lastName: document.getElementById('last-name').value,
          email: document.getElementById('email-address').value,
          contactNumber: document.getElementById('contact-number').value || null
        });
        btn.className = "w-full sm:w-auto bg-emerald-500 text-white font-black px-14 py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-4 transition-all";
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Nodes Sync';
        setTimeout(() => {
          btn.className = "w-full sm:w-auto bg-primary text-accent font-black px-14 py-5 rounded-[24px] shadow-2xl transition-all";
          btn.innerHTML = original;
          btn.disabled = false;
        }, 3000);
      } catch (err) { alert(err.message); btn.disabled = false; btn.innerHTML = original; }
    });
  }
};
