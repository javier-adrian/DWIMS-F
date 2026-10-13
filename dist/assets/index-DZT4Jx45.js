var io=Object.defineProperty;var so=(i,t,e)=>t in i?io(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var E=(i,t,e)=>so(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();const bt="https://api.kld-dwims.tech";function zt(){return localStorage.getItem("dwims_token")}function cs(i){localStorage.setItem("dwims_token",i)}function ds(i){localStorage.setItem("dwims_refresh_token",i)}function na(){localStorage.removeItem("dwims_token"),localStorage.removeItem("dwims_refresh_token")}function no(){return!!zt()}function ao(i){if(!i)return null;try{const e=i.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),s=decodeURIComponent(window.atob(e).split("").map(function(n){return"%"+("00"+n.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(s)}catch{return null}}function ei(){const i=zt(),t=ao(i);if(!t||!t["dwims:org_role"])return 0;let e=t["dwims:org_role"];Array.isArray(e)||(e=[e]);const s={Submitter:0,Reviewer:1,Administrator:2,SuperAdministrator:3};let n=0;for(const a of e){const o=a.split(":"),r=o[o.length-1];let l=s[r];l===void 0&&(l=parseInt(r,10)),!isNaN(l)&&l>n&&(n=l)}return n}async function B(i,t={}){const e={"Content-Type":"application/json",...t.headers},s=zt();s&&(e.Authorization=`Bearer ${s}`);const n=await fetch(`${bt}${i}`,{...t,headers:e});if(n.status===401)throw na(),window.location.hash="/login",new Error("Unauthorized");return n}const D={login:async(i,t)=>await B("/auth/login",{method:"POST",body:JSON.stringify({email:i,password:t})}),register:async i=>await fetch(`${bt}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),loginWithGoogle:async i=>await fetch(`${bt}/auth/oauth/google`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:i})}),forgotPassword:async i=>await fetch(`${bt}/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i})}),resetPassword:async(i,t,e)=>await fetch(`${bt}/auth/reset-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:i,token:t,newPassword:e})}),createSubmission:async i=>{const t=await B("/submission",{method:"POST",body:JSON.stringify(i)});if(!t.ok){const e=await t.text();throw new Error(`Failed to create submission: ${e}`)}return t},getMySubmissions:async()=>{const i=await B("/submission/own");if(!i.ok)throw new Error("Failed to fetch submissions");return i.json()},getPendingReviews:async()=>{const i=await B("/submission/review");if(!i.ok)throw new Error("Failed to fetch pending reviews");return i.json()},getSubmission:async i=>{const t=await B(`/submission/${i}`);if(!t.ok)throw new Error("Failed to fetch submission details");return t.json()},getSubmissionToReview:async i=>{const t=await B(`/submission/review/${i}`);if(!t.ok)throw new Error("Failed to fetch submission details");return t.json()},respondToSubmission:async(i,t,e,s,n=null)=>{const a=await B(`/submission/${i}/steps/${t}`,{method:"POST",body:JSON.stringify({outcome:e,remarks:s||null,nextReviewerEmail:n||null})});if(!a.ok){const o=await a.json().catch(()=>({}));throw new Error(o.ErrorDescription||o.Error||"Failed to respond to submission")}return a},resumeSubmission:async i=>{const t=await B(`/submission/${i}/resume`,{method:"POST"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||"Failed to resume submission")}return t},cancelSubmission:async i=>{const t=await B(`/submission/${i}/cancel`,{method:"POST"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||"Failed to cancel submission")}return t},getProfile:async()=>{const i=await B("/users/me");if(!i.ok)throw new Error("Failed to fetch profile");return i.json()},updateProfile:async i=>{const t=await B("/users/me",{method:"PUT",body:JSON.stringify(i)});if(!t.ok)throw new Error("Failed to update profile");return t},uploadSignature:async i=>{const t=await B("/users/me/signature",{method:"PUT",body:JSON.stringify({svgContent:i})});if(!t.ok){const e=await t.json();throw new Error(e.ErrorDescription||e.Error||"Failed to upload signature")}return t},getProcesses:async()=>{const i=await B("/process");if(!i.ok)throw new Error("Failed to fetch processes");return i.json()},getAllProcesses:async()=>{const i=await B("/process/all");if(!i.ok)throw new Error("Failed to fetch all processes");return i.json()},getProcess:async i=>{const t=await B(`/process/${i}`);if(!t.ok)throw new Error("Failed to fetch process");return t.json()},deleteProcess:async i=>{if(!(await B(`/process/${i}`,{method:"DELETE"})).ok)throw new Error("Failed to delete process")},getProcessSteps:async i=>{const t=await B(`/process/${i}/step`);if(!t.ok)throw new Error("Failed to fetch process steps");return t.json()},createProcess:async(i,t)=>{const e=await B("/process",{method:"POST",body:JSON.stringify({title:i,departmentId:t})});if(!e.ok){const s=await e.text();throw new Error(`Failed to create process: ${s||e.status}`)}return e.json()},addProcessStep:async(i,t)=>{const e=await B(`/process/${i}/step?processId=${i}`,{method:"POST",body:JSON.stringify(t)});if(!e.ok){const s=await e.text();throw new Error(`Failed to add step: ${s}`)}return e},updateProcessStep:async(i,t,e)=>{const s=await B(`/process/${i}/step/${t}`,{method:"PUT",body:JSON.stringify(e)});if(!s.ok){const n=await s.json().catch(()=>({}));throw new Error(n.ErrorDescription||n.Error||"Failed to update step")}return s},addProcessField:async(i,t)=>{const e=await B(`/process/${i}/field?processId=${i}`,{method:"POST",body:JSON.stringify(t)});if(!e.ok){const s=await e.text();throw new Error(`Failed to add field: ${s}`)}return e},getLogs:async(i={})=>{const t=new URLSearchParams;i.page&&t.append("Page",i.page),i.pageSize&&t.append("PageSize",i.pageSize),i.actionFilter&&t.append("ActionFilter",i.actionFilter),i.userIdFilter&&t.append("UserIdFilter",i.userIdFilter),i.from&&t.append("From",i.from),i.to&&t.append("To",i.to);const e=await B(`/logs?${t.toString()}`);if(!e.ok)throw new Error("Failed to fetch logs");return e.json()},getAnalyticsSummary:async(i={})=>{const t=new URLSearchParams;i.from&&t.append("From",i.from),i.to&&t.append("To",i.to),i.departmentId&&t.append("DepartmentId",i.departmentId),i.processId&&t.append("ProcessId",i.processId);const e=await B(`/analytics/summary?${t.toString()}`);if(!e.ok)throw new Error("Failed to fetch analytics summary");return e.json()},getDepartments:async()=>{const i=await B("/department");if(!i.ok)throw new Error("Failed to fetch departments");return i.json()},createDepartment:async(i,t)=>{const e=await B("/department",{method:"POST",body:JSON.stringify({name:i,description:t||null})});if(!e.ok){const s=await e.json().catch(()=>({}));throw new Error(s.ErrorDescription||s.Error||"Failed to create department")}return e},updateDepartment:async(i,t,e)=>{const s=await B(`/department/${i}`,{method:"PUT",body:JSON.stringify({name:t,description:e||null})});if(!s.ok){const n=await s.json().catch(()=>({}));throw new Error(n.ErrorDescription||n.Error||"Failed to update department")}return s},deleteDepartment:async i=>{const t=await B(`/department/${i}`,{method:"DELETE"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||"Failed to delete department")}return t},getDepartmentMembers:async i=>{const t=await B(`/department/${i}/members?departmentId=${i}`);if(!t.ok)throw new Error("Failed to fetch department members");return t.json()},assignRole:async(i,t,e)=>{const s=await B("/roles",{method:"POST",body:JSON.stringify({email:i,departmentId:t,generalRole:parseInt(e)})});if(!s.ok){const n=await s.json();throw new Error(n.ErrorDescription||n.Error||"Failed to assign role")}return s},removeRole:async i=>{const t=await B(`/roles/${i}`,{method:"DELETE"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||`Failed to remove role (${t.status})`)}return t},uploadDocument:async(i,t)=>{const e=new FormData;e.append("file",t);const s=zt(),n=await fetch(`${bt}/process/${i}/document`,{method:"POST",headers:{...s?{Authorization:`Bearer ${s}`}:{}},body:e});if(!n.ok){const a=await n.json().catch(()=>({}));throw new Error(a.ErrorDescription||a.Error||`Upload failed (${n.status})`)}return n.json()},getSubmissionDocument:async i=>{const t=zt(),e=await fetch(`${bt}/submission/${i}/pdf`,{headers:{...t?{Authorization:`Bearer ${t}`}:{}}});if(!e.ok)throw new Error("Document download failed");return e.blob()},getAttachments:async i=>{const t=await B(`/submission/${i}/attachments`);if(!t.ok)throw new Error("Failed to fetch attachments");return t.json()},downloadAttachment:async(i,t)=>{const e=zt(),s=await fetch(`${bt}/submission/${i}/attachments/${t}`,{headers:{...e?{Authorization:`Bearer ${e}`}:{}}});if(!s.ok)throw new Error("Failed to download attachment");return s},uploadAttachments:async(i,t)=>{const e=zt(),s=new FormData;for(const a of t)s.append("files",a);const n=await fetch(`${bt}/submission/${i}/attachments`,{method:"POST",headers:{...e?{Authorization:`Bearer ${e}`}:{}},body:s});if(!n.ok){const a=await n.json().catch(()=>({}));throw new Error(a.ErrorDescription||a.Error||"Failed to upload attachments")}return n},deleteAttachment:async(i,t)=>{const e=await B(`/submission/${i}/attachments/${t}`,{method:"DELETE"});if(!e.ok){const s=await e.json().catch(()=>({}));throw new Error(s.ErrorDescription||s.Error||"Failed to delete attachment")}return e}},gt=i=>window.location.hash.slice(1)===i?"flex items-center gap-3 px-4 py-3 text-[13px] font-black bg-[#005825] text-white rounded-xl shadow-lg shadow-green-900/20 transition-all duration-300":"flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-gray-500 hover:bg-green-50 hover:text-[#005825] rounded-xl transition-all duration-300",mt=i=>window.location.hash.slice(1)===i?"text-white":"text-gray-400 group-hover:text-[#005825]",et=i=>{const t=ei(),e=t>=1,s=t>=2,n=t===3;return`
  <div class="min-h-screen bg-[#f8faf9] flex relative font-sans antialiased scroll-smooth">
    
    <!-- FIXED BACKGROUND IMAGE (University Building) -->
    <div class="fixed inset-0 z-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center"></div>
    <!-- PREMIUM OVERLAY -->
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-white/75 via-white/85 to-[#dfded4]/90 backdrop-blur-[8px]"></div>

    <!-- Sidebar -->
    <aside id="mainSidebar" class="fixed inset-y-4 left-4 w-72 bg-white/90 backdrop-blur-3xl z-50 transform -translate-x-full lg:translate-x-0 transition-all duration-500 flex flex-col rounded-[32px] shadow-2xl shadow-green-900/10 border border-gray-100/50">
      
      <div class="px-8 py-6 mb-2 flex flex-col items-center">
        <div class="w-16 h-16 mb-2 flex items-center justify-center">
          <img src="/IMG/kldlogo.png" alt="KLD Logo" class="w-full h-full object-contain">
        </div>
        <div class="text-center group">
          <h1 class="text-[20px] font-black tracking-[-1px] text-gray-900 leading-none mb-1 uppercase">DWIMS</h1>
        </div>
      </div>

      <nav class="flex-1 pl-4 py-6 space-y-1 overflow-y-auto custom-scrollbar" id="main-nav">
          <div class="px-4 mb-3 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Main Menu</div>
          <div class="space-y-1">
              <a href="#/home" class="${gt("/home")} group">
                  <i class="fa-solid fa-house-chimney w-5 ${mt("/home")} transition-transform group-hover:scale-110"></i> Dashboard
              </a>
            <a href="#/submission/new" class="${gt("/submission/new")} group">
                <i class="fa-solid fa-file-circle-plus w-5 ${mt("/submission/new")} transition-transform group-hover:scale-110"></i> New Submission
            </a>
            <a href="#/status" class="${gt("/status")} group">
                <i class="fa-solid fa-radar w-5 ${mt("/status")} transition-transform group-hover:scale-110"></i> Submission Status
            </a>
          </div>

          ${e?`
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Approvals</div>
          <div class="space-y-1">
            <a href="#/review" class="${gt("/review")} group">
                <i class="fa-solid fa-stamp w-5 ${mt("/review")} transition-transform group-hover:scale-110"></i> Pending Approvals
            </a>
          </div>
          `:""}

          ${s?`
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Management</div>
          <div class="space-y-1">
            <a href="#/admin/documents" class="${gt("/admin/documents")} group">
                <i class="fa-solid fa-diagram-project w-5 ${mt("/admin/documents")} transition-transform group-hover:scale-110"></i> Manage Workflows
            </a>
            <a href="#/admin/reviewers" class="${gt("/admin/reviewers")} group">
                <i class="fa-solid fa-user-shield w-5 ${mt("/admin/reviewers")} transition-transform group-hover:scale-110"></i> User Management
            </a>
          </div>
          `:""}

          ${n?`
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">System Admin</div>
          <div class="space-y-1">
            <a href="#/admin/departments" class="${gt("/admin/departments")} group">
                <i class="fa-solid fa-buildings w-5 ${mt("/admin/departments")} transition-transform group-hover:scale-110"></i> Departments
            </a>
            <a href="#/admin/logs" class="${gt("/admin/logs")} group">
                <i class="fa-solid fa-bolt-lightning w-5 ${mt("/admin/logs")} transition-transform group-hover:scale-110"></i> Activity Logs
            </a>
          </div>
          `:""}

          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">General</div>
          <div class="space-y-1">
            <a href="#/settings" class="${gt("/settings")} group">
                <i class="fa-solid fa-user-gear w-5 ${mt("/settings")} transition-transform group-hover:scale-110"></i> 
                <span class="text-[13px] font-black tracking-tight">Account Settings</span>
            </a>
          </div>
      </nav>

      <div class="p-6">
        <div class="bg-gray-50/80 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-xl relative group/profile">
          <div class="w-9 h-9 bg-[#005825] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-green-900/20 group-hover/profile:scale-110 transition-transform">
            ${t==="superadmin"?"3":t}
          </div>
          <div class="flex flex-col flex-1">
            <span class="text-[12px] font-black text-gray-900 leading-none">Logged In</span>
            <span class="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">User Profile</span>
          </div>
          <button id="logoutBtn" class="flex items-center gap-2 p-2 rounded-xl bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-100 group/logout" title="Log Out">
            <i class="fa-solid fa-power-off text-sm"></i>
            <span class="text-[10px] font-black uppercase tracking-widest hidden group-hover/profile:block animate-in fade-in slide-in-from-right-1">Log Out</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-[300px] bg-[#f8faf9]/40 relative z-10 transition-all duration-300">
      <!-- Mobile header -->
      <header class="lg:hidden h-20 bg-white/50 backdrop-blur-md border-b border-white px-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg border border-gray-100">
                  <img src="/IMG/kldlogo.png" alt="KLD Logo" class="w-full h-full object-contain">
              </div>
              <span class="text-[17px] font-black text-gray-900 tracking-tight">DWIMS</span>
          </div>
          <button id="mobileMenuBtn" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center shadow-sm active:scale-95 transition-all">
            <i class="fa-solid fa-bars-staggered"></i>
          </button>
      </header>

      <main class="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <div class="max-w-7xl mx-auto ui-interior-wrap h-full">
          ${i}
        </div>
      </main>
    </div> <!-- Ends flex-1 content area -->
  </div> <!-- Ends min-h-screen flex container -->

  <!-- GLOBAL MODAL PORTAL (Completely outside flex context to avoid Safari/iOS fixed positioning bugs) -->
  <div id="modalPortal" class="absolute inset-0 pointer-events-none z-[1000] [&>*]:pointer-events-auto"></div>

  <!-- Mobile Overlay -->
  <div id="mobileOverlay" class="hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-500 opacity-0"></div>
`};window.addEventListener("click",i=>{i.target.closest("#logoutBtn")&&(na(),dt("/login"));const e=i.target.closest("#mobileMenuBtn"),s=document.getElementById("mainSidebar"),n=document.getElementById("mobileOverlay");e&&s&&n&&(s.classList.toggle("translate-x-0"),s.classList.toggle("-translate-x-full"),n.classList.toggle("hidden")),i.target===n&&s&&(s.classList.add("-translate-x-full"),s.classList.remove("translate-x-0"),n.classList.add("hidden"))});const us={render:()=>`
    <div class="ui-page-shell max-w-5xl">
      
      <!-- NAVIGATION & HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button type="button" id="backBtn" onclick="window.location.hash = '#/home'" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px] mb-8 cursor-pointer">
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
            
            <div class="w-full max-w-md mb-8">
              <label class="block text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-3 px-3">First Reviewer Email <span class="text-primary">*</span></label>
              <input type="email" id="reviewerEmailInput" placeholder="reviewer@kld.edu.ph" class="ui-input-lg w-full">
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
  `,init:async()=>{const i=document.getElementById("processDropdown"),t=document.getElementById("startProcessBtn"),e=document.getElementById("processSelectionState"),s=document.getElementById("formFillingState"),n=document.getElementById("selectedProcessName"),a=document.getElementById("dynamicFieldsContainer"),o=document.getElementById("submissionForm"),r=document.getElementById("cancelProcessBtn"),l=document.getElementById("submitSubmissionBtn"),c=document.getElementById("reviewerEmailInput"),d=document.getElementById("backBtn");d&&d.addEventListener("click",()=>dt("/home"));const u=document.getElementById("step1Indicator"),h=document.getElementById("step2Indicator");let p=null,m=[],f="";try{const g=await D.getAllProcesses();!g||g.length===0?i.innerHTML='<option value="">No document protocols found.</option>':(i.innerHTML='<option value="">-- Choose Protocol --</option>'+g.map(x=>`<option value="${x.id||x.Id}">${x.name||x.title||x.Name}</option>`).join(""),i.addEventListener("change",x=>{t.disabled=!x.target.value}))}catch(g){i.innerHTML='<option value="">Synchronization failed.</option>',console.error(g)}t.addEventListener("click",async()=>{var x;if(p=i.value,f=((x=c==null?void 0:c.value)==null?void 0:x.trim())||"",!f){c==null||c.focus(),c==null||c.setCustomValidity("Please enter the first reviewer email."),c==null||c.reportValidity();return}c==null||c.setCustomValidity("");const g=i.options[i.selectedIndex].text;u.classList.remove("bg-primary","text-white","shadow-lg"),u.classList.add("bg-white/40","text-primary"),u.querySelector("div").innerText="✓",h.classList.remove("bg-gray-100/50","text-gray-400"),h.classList.add("bg-primary","text-white","shadow-lg"),e.classList.add("hidden"),s.classList.remove("hidden"),n.innerText=g,a.innerHTML=`
        <div class="col-span-full py-20 text-center">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-primary mb-4"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-widest">Preparing form fields...</p>
        </div>
      `;try{const b=await D.getProcess(p);m=b.fields||b.Fields||[],m.length===0?a.innerHTML='<div class="col-span-full p-8 bg-blue-50/50 text-blue-800 rounded-3xl border border-blue-100 font-bold text-center">This protocol requires no additional data inputs. Proceed to final submission.</div>':a.innerHTML=m.map((y,w)=>{const v=y.id||y.Id,k=y.name||y.Name,_=y.type!==void 0?y.type:y.Type,S=y.required!==void 0?y.required:y.Required,M=w===0?"autofocus":"";let L="";const T="ui-input-lg w-full";return _===0?L=`<input type="text" id="field_${v}" placeholder="Enter ${k.toLowerCase()}" ${S?"required":""} ${M} class="${T}">`:_===1?L=`<input type="number" id="field_${v}" placeholder="Numeric entry" ${S?"required":""} ${M} class="${T}">`:_===2?L=`<input type="date" id="field_${v}" ${S?"required":""} ${M} class="${T}">`:_===4?L=`
                <div class="col-span-full mt-4 p-10 border-2 border-dashed border-gray-200 rounded-[32px] bg-white/20 flex flex-col items-center text-center group hover:border-primary/40 hover:bg-white transition-all shadow-inner">
                  <div class="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 transition-transform group-hover:rotate-6">
                    <i class="fa-solid fa-signature text-2xl"></i>
                  </div>
                  <p class="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-6">Digital Signature</p>
                  <input type="text" id="field_${v}" placeholder="Full Name (Legal Signature)" ${S?"required":""} class="w-full max-w-sm border-b-2 border-gray-300 focus:border-primary bg-transparent text-center font-serif italic text-primary text-3xl py-3 px-4 focus:outline-none focus:ring-0 placeholder-gray-100 transition-all">
                  <p class="text-[11px] text-gray-400 font-medium mt-8 leading-relaxed max-w-xs">By typing your name, you agree that the information provided is correct.</p>
                </div>
              `:L=`<input type="text" id="field_${v}" ${S?"required":""} ${M} class="${T}">`,`
              <div class="${_===4?"col-span-full":""} group">
                <label class="block text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-3 px-3 transition-colors group-hover:text-primary">
                    ${k} ${S?'<span class="text-primary ml-1">*</span>':""}
                </label>
                ${L}
              </div>
            `}).join("")}catch{a.innerHTML='<div class="col-span-full p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold">Failed to load protocol fields.</div>'}}),r.addEventListener("click",()=>{window.location.reload()}),o.addEventListener("submit",async g=>{g.preventDefault();const x=m.map(y=>{const w=y.id||y.Id,v=document.getElementById(`field_${w}`);return{fieldId:w,fieldValue:v?v.value:""}}),b={processId:p,firstReviewerEmail:f,fields:x};l.disabled=!0,l.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Finalizing...';try{await D.createSubmission(b),l.className="bg-emerald-500 text-white font-black px-14 py-6 rounded-3xl flex items-center justify-center gap-4",l.innerHTML='<i class="fa-solid fa-check-double scale-125"></i> Submission Logged',setTimeout(()=>{window.location.hash="#/home"},800)}catch(y){alert("Transmission error: "+y.message),l.disabled=!1,l.innerHTML='<i class="fa-solid fa-paper-plane"></i> Finalize Submission'}})}},hs={render:i=>`
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
  `,init:async i=>{const t=i.id;if(!t)return;const e=document.getElementById("modalPortal");e&&(e.innerHTML=`
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
      `);const s=document.getElementById("stepsList"),n=document.getElementById("fieldsList"),a={0:"fa-user-pen",1:"fa-user-check",2:"fa-user-gear",3:"fa-user-shield"},o={0:"Text",1:"Numeric",2:"Date",3:"Boolean",4:"Signature"},r=async()=>{var m,f;try{const g=await D.getProcess(t);if(g){document.getElementById("processHeaderName").innerText=g.name||g.title||"Untitled Architecture",(g.hasDocument||g.HasDocument)&&((m=document.getElementById("docStatus"))==null||m.classList.remove("hidden"),(f=document.getElementById("docStatus"))==null||f.classList.add("inline-flex"));const w=g.fields||g.Fields||[];w.length===0?n.innerHTML=`
              <div class="py-20 text-center opacity-20">
                  <i class="fa-solid fa-code text-4xl mb-4"></i>
                  <p class="text-[11px] font-black uppercase tracking-widest">No Mapping</p>
              </div>
            `:n.innerHTML=w.map(v=>`
              <li class="px-10 py-6 border-b border-gray-100/50 flex items-center justify-between group hover:bg-white/40 transition-all">
                  <div class="flex items-center gap-5">
                      <div class="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <i class="fa-solid fa-microchip text-[14px] opacity-40"></i>
                      </div>
                      <div>
                          <p class="text-[14px] font-extrabold text-gray-800 leading-none mb-1 group-hover:text-primary transition-colors">${v.name||v.title||v.Name||v.Title}</p>
                          <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">${o[v.type||0]||"Dynamic"}</p>
                      </div>
                  </div>
                  ${v.required?'<i class="fa-solid fa-shield-check text-primary text-xs opacity-50"></i>':""}
              </li>
            `).join("")}const x=await D.getProcessSteps(t),b=Array.isArray(x)?x:x.items||x.data||[];b.length===0?s.innerHTML=`
            <div class="py-32 text-center opacity-30 select-none">
                <i class="fa-solid fa-route text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">Sequence Matrix Empty</p>
            </div>
          `:s.innerHTML=b.sort((y,w)=>(y.order||0)-(w.order||0)).map(y=>`
            <li class="px-10 py-8 flex items-center justify-between group hover:bg-white/40 transition-all relative text-left">
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-primary group-hover:h-12 transition-all rounded-r-full shadow-[0_0_15px_rgba(11,93,59,0.3)]"></div>
              <div class="flex items-center gap-8 text-left">
                  <div class="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary font-black text-2xl group-hover:rotate-6 transition-transform">
                      ${y.order||y.Order||1}
                  </div>
                  <div class="text-left">
                    <h4 class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none mb-2 text-left">${y.name||y.title||y.Name||y.Title}</h4>
                    <div class="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-building-shield opacity-30"></i> ${y.departmentName||"Global Access"}</span>
                        <span class="opacity-10">|</span>
                        <span class="flex items-center gap-2 text-primary/60"><i class="fa-solid ${a[y.role||0]} opacity-30"></i> TIER-${y.role||0} ACCESS</span>
                    </div>
                  </div>
              </div>
              <button class="edit-step-btn w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100" data-id="${y.id}" data-title="${y.name||y.title}" data-dept="${y.departmentId}" data-order="${y.order}" data-role="${y.role}">
                <i class="fa-solid fa-sliders"></i>
              </button>
            </li>
          `).join("")}catch(g){console.error(g)}};await r();const l=(m,f)=>{const g=document.getElementById(m),x=g==null?void 0:g.querySelector('div[id$="Content"]');!g||!x||(f?(g.classList.remove("hidden"),setTimeout(()=>{x.classList.remove("scale-95","opacity-0","translate-y-4"),x.classList.add("scale-100","opacity-100","translate-y-0")},10)):(x.classList.add("scale-95","opacity-0","translate-y-4"),x.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{var b;if(g.classList.add("hidden"),(b=g.querySelector("form"))==null||b.reset(),m==="addStepModal"){const y=document.getElementById("editStepId");y&&(y.value="");const w=document.getElementById("stepModalTitle");w&&(w.innerText="Configure Node")}},300)))};document.getElementById("addStepBtn").onclick=()=>l("addStepModal",!0),document.getElementById("closeStepBtn").onclick=()=>l("addStepModal",!1),document.getElementById("closeStepBg").onclick=()=>l("addStepModal",!1),document.getElementById("addFieldBtn").onclick=()=>l("addFieldModal",!0),document.getElementById("closeFieldBg").onclick=()=>l("addFieldModal",!1);try{const m=await D.getDepartments(),f=document.getElementById("stepDepartment");f&&(f.innerHTML=m.map(g=>`<option value="${g.id}">${g.name}</option>`).join(""))}catch{}s.addEventListener("click",m=>{const f=m.target.closest(".edit-step-btn");f&&(document.getElementById("editStepId").value=f.dataset.id,document.getElementById("stepTitle").value=f.dataset.title,document.getElementById("stepDepartment").value=f.dataset.dept,document.getElementById("stepOrder").value=f.dataset.order,document.getElementById("stepRole").value=f.dataset.role,document.getElementById("stepModalTitle").innerText="Modify Node Architect",l("addStepModal",!0))}),document.getElementById("saveStepBtn").onclick=async m=>{const f=m.currentTarget,g=document.getElementById("editStepId").value,x={title:document.getElementById("stepTitle").value,departmentId:document.getElementById("stepDepartment").value,order:parseInt(document.getElementById("stepOrder").value),role:parseInt(document.getElementById("stepRole").value)},b=f.innerHTML;f.disabled=!0,f.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{g?await D.updateProcessStep(t,g,x):await D.addProcessStep(t,{processId:t,...x}),l("addStepModal",!1),await r()}catch(y){alert(y.message)}finally{f.disabled=!1,f.innerHTML=b}},document.getElementById("saveFieldBtn").onclick=async m=>{const f=m.currentTarget,g={processId:t,title:document.getElementById("fieldTitle").value,inputType:parseInt(document.getElementById("fieldType").value),required:document.getElementById("fieldRequired").checked},x=f.innerHTML;f.disabled=!0,f.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.addProcessField(t,g),l("addFieldModal",!1),await r()}catch(b){alert(b.message)}finally{f.disabled=!1,f.innerHTML=x}};const c=document.getElementById("docUploadArea"),d=document.getElementById("docFileInput"),u=document.getElementById("docFilePreview"),h=document.getElementById("uploadDocBtn");c&&(c.onclick=()=>d.click()),d&&(d.onchange=m=>{const f=m.target.files[0];if(!f||f.type!=="application/pdf")return alert("PDF source required.");document.getElementById("docFileName").innerText=f.name,document.getElementById("docFileSize").innerText=(f.size/1024/1024).toFixed(2)+" MB",c.classList.add("hidden"),u.classList.remove("hidden"),h.classList.remove("hidden")}),document.getElementById("removeDocBtn").onclick=()=>{d.value="",c.classList.remove("hidden"),u.classList.add("hidden"),h.classList.add("hidden")},h.onclick=async()=>{const m=d.files[0];if(!m)return;const f=h.innerHTML;h.disabled=!0,h.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.uploadDocument(t,m),document.getElementById("docMsg").innerText="SECURED",document.getElementById("docMsg").className="text-[10px] font-black text-emerald-600 uppercase tracking-widest",document.getElementById("docMsg").classList.remove("hidden"),document.getElementById("docStatus").classList.remove("hidden"),setTimeout(()=>{window.location.reload()},1500)}catch(g){alert(g.message)}finally{h.disabled=!1,h.innerHTML=f}};const p=document.getElementById("deleteProcessBtn");p&&p.addEventListener("click",async()=>{if(confirm("Are you sure you want to completely delete this workflow? This action cannot be undone.")){const m=p.innerHTML;p.disabled=!0,p.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';try{await D.deleteProcess(t),window.location.hash="#/admin/documents"}catch(f){alert("Failed to delete workflow: "+f.message),p.disabled=!1,p.innerHTML=m}}})}},ps={render:()=>`
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(0,88,37,0.4)] to-[rgba(255,216,77,0.2)] backdrop-blur-[12px] z-0"></div>

      <!-- Main translucent panel -->
      <div class="glass-panel w-[1000px] h-[650px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <!-- Top strip -->
        <div class="h-[70px] bg-primary flex items-center justify-center px-8 shadow-sm">
            <div class="flex items-center gap-3 text-accent font-semibold text-base tracking-wide">
                <img src="/IMG/kldlogo.png" alt="Logo" class="h-[38px] drop-shadow-md">
                <h2>Kolehiyo ng Lungsod ng Dasmariñas</h2>
            </div>
        </div>

        <!-- Content layout -->
        <div class="flex-1 flex items-center justify-between px-16 lg:px-20">
          
          <!-- Left title -->
          <div class="flex-1 hidden md:block">
              <h1 class="text-[58px] leading-[1.05] text-primary font-[900] tracking-tighter drop-shadow-[0_2px_15px_rgba(255,255,255,0.6)] fade-slide-up pl-4">
                  <span class="text-primary">D</span>ocument<br>
                  <span class="text-primary">W</span>orkflow<br>
                  <span class="text-primary">I</span>nformation<br>
                  <span class="text-primary">M</span>anagement<br>
                  <span class="text-primary">S</span>ystem
              </h1>
          </div>

          <!-- Login card -->
          <div class="w-full max-w-[420px] ui-card p-8 md:p-10 text-center fade-slide-up border border-white/50" style="animation-duration: 1s;">
              <h2 class="mb-8 text-primary text-3xl font-[900] tracking-tight">Log in</h2>

              <form id="loginForm" class="space-y-4">
                  <div class="relative">
                      <input id="email" type="text" placeholder="Username" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-colors peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="password" type="password" placeholder="Password" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-colors peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" class="ui-button-primary w-full py-3.5 mt-2 text-[15px]">
                      <i class="fa-solid fa-right-to-bracket"></i> Log in
                  </button>

                  <div class="flex items-center my-5">
                      <div class="flex-grow h-[1px] bg-gray-200"></div>
                      <span class="px-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest">or</span>
                      <div class="flex-grow h-[1px] bg-gray-200"></div>
                  </div>

                  <div id="googleSignInBtn" class="flex justify-center w-full mb-2"></div>

                  <div class="mt-5 flex justify-between text-[13px] font-medium">
                      <a href="#/register" class="text-primary hover:text-primary-hover hover:underline transition-colors">Sign up</a>
                      <a href="#/forgot-password" class="text-primary hover:text-primary-hover hover:underline transition-colors">Forgot Password?</a>
                  </div>
                  
                  <div id="loginSuccess" class="text-green-600 text-sm text-center hidden mt-2">
                    Password reset successfully. Please sign in with your new password.
                  </div>

                  <div id="loginError" class="text-red-500 text-sm text-center hidden mt-2">
                    Invalid credentials. Please try again.
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,init:()=>{const i=window.location.hash.split("?")[1]||"";new URLSearchParams(i).get("reset")==="success"&&document.getElementById("loginSuccess").classList.remove("hidden"),(()=>{if(window.handleGoogleCredentialResponse=async e=>{const s=document.getElementById("loginError");s.classList.add("hidden");try{const n=await D.loginWithGoogle(e.credential);if(n.ok){const a=await n.json();if(a.token)cs(a.token),a.refreshToken&&ds(a.refreshToken),dt("/home");else throw new Error("Authentication failed: Missing token.")}else{const a=await n.json().catch(()=>({}));throw new Error(a.ErrorDescription||a.Error||"Google authentication failed.")}}catch(n){s.innerText=n.message,s.classList.remove("hidden")}},document.getElementById("google-gsi-client"))window.google&&(window.google.accounts.id.initialize({client_id:"661977725301-h6fg9kb4p4bckqhg3878pmhfa3ierllq.apps.googleusercontent.com",callback:window.handleGoogleCredentialResponse}),window.google.accounts.id.renderButton(document.getElementById("googleSignInBtn"),{theme:"outline",size:"large",width:"100%",shape:"pill",type:"standard"}));else{const e=document.createElement("script");e.id="google-gsi-client",e.src="https://accounts.google.com/gsi/client",e.async=!0,e.defer=!0,e.onload=()=>{window.google&&(window.google.accounts.id.initialize({client_id:"661977725301-h6fg9kb4p4bckqhg3878pmhfa3ierllq.apps.googleusercontent.com",callback:window.handleGoogleCredentialResponse}),window.google.accounts.id.renderButton(document.getElementById("googleSignInBtn"),{theme:"outline",size:"large",width:"100%",shape:"pill",type:"standard"}))},document.body.appendChild(e)}})(),document.getElementById("loginForm").addEventListener("submit",async e=>{e.preventDefault();const s=document.getElementById("email").value,n=document.getElementById("password").value,a=e.currentTarget.querySelector("button"),o=document.getElementById("loginError"),r=a.innerHTML;o.classList.add("hidden"),a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';try{const l=await D.login(s,n);if(l.ok){const c=await l.json();if(c.token)cs(c.token),c.refreshToken&&ds(c.refreshToken),dt("/home");else throw new Error("Authentication failed: Missing token.")}else{const c=await l.json().catch(()=>({}));throw new Error(c.ErrorDescription||c.Error||"Invalid credentials. Access denied.")}}catch(l){o.innerText=l.message,o.classList.remove("hidden"),a.disabled=!1,a.innerHTML=r}})}},fs={NotificationWidget:()=>`
    <div class="ui-section-card p-8 hover:shadow-xl transition-all duration-500 h-full overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-[16px] font-black text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-bell text-primary animate-ring"></i> Notifications
        </h3>
        <span class="ui-tag">Real-time</span>
      </div>
      
      <div class="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        <div class="group p-4 bg-white/40 hover:bg-white/80 rounded-2xl border border-white/50 transition-all cursor-pointer">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center text-emerald-600 text-sm shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-check"></i>
            </div>
            <div>
              <p class="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors">Clearance Form Approved</p>
              <p class="text-[11px] text-gray-400 font-medium">Your submission has been signed by Registrar.</p>
              <p class="text-[10px] text-primary/40 font-black mt-1 uppercase tracking-widest">2 mins ago</p>
            </div>
          </div>
        </div>
        
        <div class="group p-4 bg-white/40 hover:bg-white/80 rounded-2xl border border-white/50 transition-all cursor-pointer opacity-70">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 text-sm shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-file-signature"></i>
            </div>
            <div>
              <p class="text-[13px] font-bold text-gray-800 leading-snug">New Step Activated</p>
              <p class="text-[11px] text-gray-400 font-medium">Document moved to Dean's Office for final review.</p>
              <p class="text-[10px] text-primary/40 font-black mt-1 uppercase tracking-widest">1 hour ago</p>
            </div>
          </div>
        </div>
        
        <div class="py-4 text-center">
          <button class="text-[11px] font-black text-primary/60 hover:text-primary uppercase tracking-[2px] transition-all">
            View All Events <i class="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  `,EfficiencyMetric:(i,t,e,s,n)=>`
    <div class="ui-card p-8 group hover:shadow-xl transition-all duration-500">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-2xl ${n}/10 flex items-center justify-center ${n} text-xl shadow-inner group-hover:rotate-6 transition-all">
          <i class="fa-solid ${s}"></i>
        </div>
        <h3 class="text-[13px] font-black text-gray-400 uppercase tracking-[2px] leading-tight">${i}</h3>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-[34px] font-black text-gray-900 tracking-tighter">${t}</span>
        <span class="text-[14px] font-black text-gray-400 uppercase tracking-widest">${e}</span>
      </div>
      <div class="mt-6 flex flex-col gap-2">
        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1">
          <span class="text-gray-400 italic">Target threshold</span>
          <span class="text-primary">${t>24?"Over":"Normal"}</span>
        </div>
        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div class="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(11,93,59,0.3)] transition-all duration-1000" style="width: ${Math.min(100,t/30*100)}%"></div>
        </div>
      </div>
    </div>
  `,QuickActions:(i=[])=>`
    <div class="grid grid-cols-2 gap-4">
      ${i.map(t=>`
        <a href="${t.link}" class="group ui-card p-6 hover:bg-primary transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 text-center">
          <div class="w-12 h-12 rounded-full bg-primary/5 group-hover:bg-white/20 flex items-center justify-center text-primary group-hover:text-white text-xl transition-all">
            <i class="fa-solid ${t.icon}"></i>
          </div>
          <span class="text-[12px] font-black text-gray-800 group-hover:text-white uppercase tracking-widest leading-none">${t.title}</span>
        </a>
      `).join("")}
    </div>
  `},gs={render:()=>{const i=ei();let t="My Dashboard",e="Monitor your document submissions and activities in real-time.",s=null;return i===1?(t="Reviewer Console",e="Manage pending approvals and track evaluation performance.",s=[{title:"Review Queue",icon:"fa-list-check",link:"#/review/pending"},{title:"My Signature",icon:"fa-signature",link:"#/settings"}]):i===2?(t="Department Analytics",e="Oversight of departmental document flows and process efficiency.",s=[{title:"Manage Flows",icon:"fa-diagram-project",link:"#/admin/documents"},{title:"Templates",icon:"fa-file-invoice",link:"#/admin/documents"}]):i===3&&(t="System Management",e="Global system activity and administrative oversight.",s=[{title:"Audit Logs",icon:"fa-terminal",link:"#/superadmin/logs"},{title:"Departments",icon:"fa-building-columns",link:"#/superadmin/departments"}]),`
    <div class="ui-page-shell">
      
      <!-- ROLE-BASED HEADER -->
      <div class="mb-12 relative p-8 md:p-10 ui-section-card overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div class="ui-tag mb-4">
                  <i class="fa-solid fa-circle-check"></i> System Operational
              </div>
              <h1 class="ui-page-title mb-3">${t}</h1>
              <p class="ui-muted font-medium italic opacity-80">${e}</p>
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
                    <i class="fa-solid fa-list-ul text-primary"></i> ${i>=1?"Global Queue":"Recent Submissions"}
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
           ${s?`
           <div class="space-y-4">
            <h3 class="text-[13px] font-black text-gray-400 uppercase tracking-[2px] px-2 flex items-center gap-2">
              <i class="fa-solid fa-bolt text-primary"></i> Quick Tasks
            </h3>
            ${fs.QuickActions(s)}
          </div>
          `:""}
          ${fs.NotificationWidget()}
        </div>
      </div>
    </div>
    `},init:async()=>{const i=document.getElementById("submissionsList");if(!i)return;const t={0:{label:"Submitted",style:"bg-blue-50 text-blue-700 border-blue-200",icon:"fa-rotate"},1:{label:"In Review",style:"bg-orange-50 text-orange-700 border-orange-200",icon:"fa-clock"},2:{label:"Approved",style:"bg-emerald-50 text-emerald-700 border-emerald-200",icon:"fa-check"},3:{label:"Rejected",style:"bg-red-50 text-red-700 border-red-200",icon:"fa-xmark"},4:{label:"Cancelled",style:"bg-gray-100 text-gray-600 border-gray-200",icon:"fa-ban"},5:{label:"On Hold",style:"bg-amber-50 text-amber-700 border-amber-200",icon:"fa-pause"}};try{const e=await D.getMySubmissions();let s=Array.isArray(e)?e:e.items||e.Items||e.data||e.Data||[],n=0,a=0,o=0;s.forEach(c=>{const d=c.status!==void 0?c.status:c.Status;d===1||d===5||d==="OnHold"?n++:d===2||d==="Approved"||d==="Complete"?a++:d===3||d==="Rejected"?o++:n++});const r=document.getElementById("stat-total"),l=document.getElementById("stat-review");r&&(r.textContent=s.length),l&&(l.textContent=n),s.length===0?i.innerHTML='<tr><td colspan="4" class="p-8 text-center text-gray-500">No records found.</td></tr>':i.innerHTML=s.map(c=>{const d=c.id||c.Id,u=c.documentType||c.DocumentType||c.name||"Document",h=c.status!==void 0?c.status:c.Status,p=t[h]||{label:"Pending",style:"bg-gray-100 text-gray-600",icon:"fa-circle-notch"},m=c.createdAt||c.CreatedAt;let f=m?new Date(m).toLocaleDateString():"N/A";return`
            <tr class="hover:bg-white/40 transition-all group">
              <td class="py-5 px-8 border-b border-gray-100/50">
                <div class="flex items-center gap-3">
                  <div class="w-1.5 h-6 bg-primary/20 rounded-full group-hover:bg-primary transition-colors"></div>
                  <div class="text-[14px] font-extrabold text-gray-800">${u}</div>
                </div>
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50 text-[13px] text-gray-500 font-medium">
                  ${f}
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50">
                <span class="inline-flex items-center text-[10px] font-black px-3 py-1 rounded-lg border-2 uppercase tracking-widest ${p.style}">
                    <i class="fa-solid ${p.icon} mr-2"></i> ${p.label}
                </span>
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50 text-right">
                <a href="#/track/${d}" class="ui-button-soft text-[12px] font-black px-4 py-2">
                  Track Status
                </a>
              </td>
            </tr>
          `}).join("")}catch(e){console.error(e),i.innerHTML='<tr><td colspan="4" class="p-10 text-red-500 text-center font-bold">Failed to load submissions.</td></tr>'}}},ms={render:()=>`
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="mb-14 relative p-8 md:p-10 ui-section-card rounded-[40px] overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <i class="fa-solid fa-hourglass-half animate-pulse"></i> Assessments Active
              </div>
              <h1 class="ui-page-title mb-3">Reviewer Dashboard</h1>
              <p class="ui-muted font-medium italic opacity-80">Review and approve pending document submissions.</p>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="text-right hidden sm:block">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Queue Health</div>
                    <div class="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                        <div id="queueHealthBar" class="h-full bg-emerald-500 rounded-full transition-all duration-1000" style="width: 100%"></div>
                    </div>
                </div>
                <div class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-amber-500 text-2xl shadow-amber-500/5 ring-4 ring-amber-500/5">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>
            </div>
          </div>
      </div>

      <div id="reviewsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="col-span-full py-40 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-[3px]">Loading pending reviews...</p>
        </div>
      </div>
    </div>
  `,init:async()=>{const i=document.getElementById("reviewsList");if(i)try{const t=await D.getPendingReviews();let e=Array.isArray(t)?t:t.items||t.Items||t.data||t.Data||[];if(e.length===0)i.className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/80 shadow-2xl",i.innerHTML=`
            <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner rotate-3">
                <i class="fa-solid fa-check-double scale-125"></i>
            </div>
            <h3 class="text-[28px] font-black text-gray-900 tracking-tight mb-3">All Clear</h3>
            <p class="text-[15px] text-gray-400 font-medium text-center max-w-sm italic opacity-80">You have no pending documents to review at this time.</p>
        `;else{const s=document.getElementById("queueHealthBar");if(s){const n=Math.max(20,100-e.length*10);s.style.width=n+"%",s.className=`h-full rounded-full transition-all duration-1000 ${n<50?"bg-amber-500":"bg-emerald-500"}`}i.innerHTML=e.map(n=>{const a=n.id||n.Id,o=n.responseName||n.ResponseName||"Document Submission",r=n.submitterName||n.SubmitterName||"Applicant",l=n.stepName||n.StepName||"Assessment",c=n.submittedAt||n.SubmittedAt,d=n.stepActivatedAt||n.StepActivatedAt;let u="Just now";if(d){const m=Math.floor((new Date-new Date(d))/36e5);u=m>0?`${m}h ago`:"Activated recently"}const h=n.status??n.Status??1,p=h===5||h==="OnHold"||h==="onhold"||h==="on hold";return`
            <div class="ui-card rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl group overflow-hidden flex flex-col justify-between ${p?"border-amber-200/60 bg-amber-50/20":""}">
              <!-- TOP SECTION -->
              <div class="p-8 pb-4">
                  <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-2">
                      <div class="inline-flex items-center gap-2 px-3 py-1 ${p?"bg-amber-500/15 text-amber-700 border-amber-500/30":"bg-amber-500/10 text-amber-600 border-amber-500/20"} rounded-full text-[10px] font-black uppercase tracking-widest border">
                          <i class="fa-solid ${p?"fa-pause":"fa-clock-rotate-left"}"></i> ${p?"On Hold":u}
                      </div>
                      ${p?`<span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">${u}</span>`:""}
                    </div>
                    <div class="text-[11px] font-black text-gray-300 uppercase tracking-tighter">TRK-${a.toString().slice(-6).toUpperCase()}</div>
                  </div>
                  
                  <h3 class="text-[22px] font-black text-gray-900 tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">${o}</h3>
                  
                  <div class="flex flex-wrap gap-2 mb-8">
                    <span class="px-3 py-1.5 bg-gray-100/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest border border-gray-200/50">
                        <i class="fa-solid fa-bezier-curve mr-2 opacity-40"></i> ${l}
                    </span>
                  </div>

                  <div class="space-y-4 pt-6 border-t border-gray-100/50">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-sm shadow-inner group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-user-graduate"></i>
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submitted By</p>
                            <p class="text-[13px] font-extrabold text-gray-800 leading-none">${r}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm shadow-inner group-hover:scale-110 transition-transform">
                            <i class="fa-regular fa-calendar"></i>
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submission Date</p>
                            <p class="text-[13px] font-extrabold text-gray-800 leading-none">${c?new Date(c).toLocaleDateString():"Pending"}</p>
                        </div>
                    </div>
                  </div>
              </div>

              <!-- ACTION SECTION -->
              <div class="p-8 pt-4">
                  <button data-id="${a}" class="review-btn ${p?"bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20":"ui-button-primary"} w-full py-5 rounded-2xl text-[15px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all">
                      <i class="fa-solid ${p?"fa-play":"fa-signature"}"></i> ${p?"Resume / Review":"Review Document"}
                  </button>
              </div>
            </div>
          `}).join(""),i.querySelectorAll(".review-btn").forEach(n=>{n.addEventListener("click",()=>{dt(`/review/${n.dataset.id}`)})})}}catch(t){console.error(t),i.className="col-span-full max-w-xl mx-auto py-20 text-center bg-red-50/50 rounded-[40px] border border-red-100",i.innerHTML=`
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h4 class="text-[20px] font-black text-red-700 tracking-tight mb-2">Unable to load reviews</h4>
          <p class="text-[14px] text-red-600 opacity-70">${t.message}</p>
      `}}},oo=2,ro=3,xs=5,lo=i=>{var e;const t={0:"Submitted",1:"In Review",2:"Approved",3:"Rejected",4:"Cancelled",5:"On Hold"};return t[i]??t[(e=i==null?void 0:i.toString())==null?void 0:e.toLowerCase()]??i??"—"},co=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"bg-blue-50 text-blue-700 border-blue-200",submitted:"bg-blue-50 text-blue-700 border-blue-200",1:"bg-orange-50 text-orange-700 border-orange-200",review:"bg-orange-50 text-orange-700 border-orange-200","in review":"bg-orange-50 text-orange-700 border-orange-200",2:"bg-emerald-50 text-emerald-700 border-emerald-200",approved:"bg-emerald-50 text-emerald-700 border-emerald-200",approve:"bg-emerald-50 text-emerald-700 border-emerald-200",3:"bg-red-50 text-red-700 border-red-200",rejected:"bg-red-50 text-red-700 border-red-200",reject:"bg-red-50 text-red-700 border-red-200",4:"bg-gray-100 text-gray-600 border-gray-200",cancelled:"bg-gray-100 text-gray-600 border-gray-200",cancel:"bg-gray-100 text-gray-600 border-gray-200",5:"bg-amber-50 text-amber-700 border-amber-200",onhold:"bg-amber-50 text-amber-700 border-amber-200","on hold":"bg-amber-50 text-amber-700 border-amber-200"}[t]??"bg-gray-100 text-gray-600 border-gray-200"},uo=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"fa-rotate",submitted:"fa-rotate",1:"fa-clock",review:"fa-clock","in review":"fa-clock",2:"fa-check",approved:"fa-check",approve:"fa-check",3:"fa-xmark",rejected:"fa-xmark",reject:"fa-xmark",4:"fa-ban",cancelled:"fa-ban",cancel:"fa-ban",5:"fa-pause",onhold:"fa-pause","on hold":"fa-pause"}[t]??"fa-circle-info"},bs={render:()=>`
    <div class="ui-page-shell">
      
      <!-- NAVIGATION -->
      <div class="mb-10">
        <button id="backBtn" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px]">
            <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to Dashboard
        </button>
      </div>

      <div id="reviewDetailContent" class="space-y-10 min-h-[500px]">
        <div class="flex flex-col items-center justify-center py-40 text-gray-300 gap-6">
            <i class="fa-solid fa-spinner fa-spin text-5xl text-primary/30"></i>
            <span class="text-[12px] font-black uppercase tracking-[3px] text-gray-400 animate-pulse">Loading document details...</span>
        </div>
      </div>
    </div>
  `,init:async i=>{var n,a,o,r,l;const t=i==null?void 0:i.id,e=document.getElementById("reviewDetailContent"),s=document.getElementById("backBtn");if(s&&(s.onclick=()=>dt("/review")),!t){e.innerHTML='<div class="p-20 bg-white/40 rounded-3xl border border-white text-center font-black uppercase tracking-widest text-red-500">Fault: Transmission ID Required</div>';return}try{const c=await D.getSubmissionToReview(t),d=c.fieldValues||c.FieldValues||[],u=c.stepResponses||c.StepResponses||[],h=c.currentStep||c.CurrentStep,p=c.status??c.Status??1,m=c.processId||c.ProcessId,f=c.processName||c.ProcessName||"Internal Protocol",g=c.submittedAt||c.SubmittedAt,x=p===1||p==="Review"||p==="review",b=p===5||p==="OnHold"||p==="onhold"||p==="on hold";let y=null;if(x&&m)try{const k=await D.getProcess(m),_=k.steps||k.Steps||[],S=_.find(M=>(M.name||M.Name||M.title||M.Title)===h);if(S&&(y=S.id||S.Id),!y){const M=u.find(L=>!(L.completedAt||L.CompletedAt));if(M){const L=_.find(T=>(T.name||T.Name)===(M.stepName||M.StepName));L&&(y=L.id||L.Id)}}}catch(k){console.error("Step resolution soft-fail",k)}const w=!!y&&x;if(e.innerHTML=`
        <!-- OFFICIAL CASE HEADER -->
        <div class="ui-section-card rounded-[48px] overflow-hidden p-10 lg:p-14 relative group">
          <div class="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
            <div class="flex-1">
              <div class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-widest mb-6 shadow-lg shadow-primary/20">
                  <i class="fa-solid fa-clipboard-user"></i> SUBMISSION REVIEW
              </div>
              <h2 class="ui-page-title mb-4">${f}</h2>
              <div class="flex flex-wrap items-center gap-8 text-[14px] text-gray-500 font-bold">
                <span class="flex items-center gap-2"><i class="fa-regular fa-calendar-check text-primary"></i> ${g?new Date(g).toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):"—"}</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-fingerprint text-primary"></i> #${t.toString().slice(-8).toUpperCase()}</span>
                ${h?`<span class="flex items-center gap-2 border-l border-gray-200 pl-8"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> <span class="font-black text-gray-900 uppercase tracking-[2px] text-[11px]">${h}</span></span>`:""}
              </div>
            </div>

            <div class="flex items-center gap-4">
                 ${p===2||p==="Approved"?`
                 <button id="downloadPdfBtn" class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary text-2xl hover:scale-110 active:scale-95 transition-all group/btn">
                    <i class="fa-solid fa-file-pdf group-hover/btn:rotate-12"></i>
                 </button>`:""}
                 <div class="inline-flex items-center px-10 py-5 rounded-3xl text-[16px] font-black shadow-xl border-2 border-white/50 ${co(p)} gap-4">
                    <i class="fa-solid ${uo(p)} scale-125"></i> ${lo(p)}
                 </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <!-- LEFT: DOCUMENT CONTENT & AUDIT -->
          <div class="lg:col-span-8 space-y-10">
              <!-- FIELD DATA -->
              <div class="ui-section-card rounded-[40px] p-12">
                  <h3 class="text-[18px] font-black text-gray-800 uppercase tracking-widest mb-10 pb-6 border-b border-gray-100 flex items-center gap-3">
                    <i class="fa-solid fa-file-invoice text-primary"></i> Document Information
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    ${d.map(k=>`
                        <div class="group">
                          <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 px-2 group-hover:text-primary transition-colors">${k.fieldName||k.FieldName}</dt>
                          <dd class="text-[16px] font-extrabold text-gray-800 bg-white/60 p-5 rounded-2xl border border-gray-100 shadow-inner group-hover:bg-white transition-all">
                            ${k.fieldValue==="true"?"AUTHENTICATED":k.fieldValue==="false"?"DECLINED":k.fieldValue||"—"}
                          </dd>
                        </div>
                    `).join("")}
                  </div>
              </div>

              <!-- ATTACHMENTS (read-only for reviewer) -->
              <div class="ui-section-card rounded-[40px] p-12">
                <h3 class="text-[18px] font-black text-gray-800 uppercase tracking-widest mb-8 pb-6 border-b border-gray-100 flex items-center gap-3">
                  <i class="fa-solid fa-paperclip text-violet-500"></i> Attachments
                </h3>
                <div id="reviewAttachmentsList" class="space-y-3">
                  <div class="flex items-center justify-center py-10 text-gray-300 gap-3">
                    <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
                  </div>
                </div>
              </div>

              <!-- ON HOLD STATUS ACTION -->
              ${b?`
              <div class="ui-section-card rounded-[40px] border-2 border-amber-500/30 p-12 bg-amber-500/5 relative overflow-hidden" id="onHoldSection">
                  <div class="absolute top-0 right-0 p-10 opacity-[0.05] text-amber-500 text-9xl -translate-y-10 translate-x-10">
                      <i class="fa-solid fa-pause"></i>
                  </div>
                  
                  <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 mb-6">
                      <i class="fa-solid fa-pause animate-pulse"></i> Workflow Paused
                  </div>

                  <h3 class="text-[24px] font-black text-gray-900 tracking-tight mb-3 flex items-center gap-4">
                    Submission On Hold
                  </h3>
                  <p class="text-[14px] text-gray-600 font-medium mb-8 leading-relaxed max-w-xl">
                    This submission is currently on hold. When you are ready to continue the review workflow, resume the submission below.
                  </p>

                  <div id="resumeError" class="hidden mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-[13px] flex items-center gap-2"></div>

                  <button id="resumeSubmissionBtn" class="py-5 px-10 rounded-3xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[15px] uppercase tracking-widest shadow-xl shadow-amber-500/20 flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95">
                    <i class="fa-solid fa-play"></i> Resume Submission
                  </button>
              </div>
              `:""}

              <!-- RESPOND SECTION -->
              ${w?`
              <div class="ui-section-card rounded-[40px] border-2 border-primary/20 p-12 bg-white relative overflow-hidden" id="respondSection">
                  <div class="absolute top-0 right-0 p-10 opacity-[0.05] text-primary text-9xl -translate-y-10 translate-x-10">
                      <i class="fa-solid fa-signature"></i>
                  </div>
                  
                  <h3 class="text-[24px] font-black text-gray-900 tracking-tight mb-8 flex items-center gap-4">
                    <span class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg shadow-lg">
                        <i class="fa-solid fa-legal"></i>
                    </span>
                    Review Decision
                  </h3>

                  <div class="mb-10">
                    <label class="block text-[11px] font-black text-gray-400 uppercase tracking-[3px] mb-3 px-2">Decision Remarks</label>
                    <textarea id="remarksInput" rows="4" placeholder="Enter formal justifications or feedback for the submitter (required if placing on hold)..." class="ui-input-lg w-full resize-none"></textarea>
                  </div>

                  <div class="mb-10" id="nextReviewerWrap">
                    <label class="block text-[11px] font-black text-gray-400 uppercase tracking-[3px] mb-3 px-2">Next Reviewer Email</label>
                    <input type="email" id="nextReviewerEmailInput" placeholder="nextreviewer@kld.edu.ph" class="ui-input-lg w-full">
                    <p class="text-[11px] text-gray-400 font-medium mt-2 px-2">Required when approving — designates the next step's assignee. Omit if this is the final step.</p>
                  </div>

                  <div id="respondError" class="hidden mb-10 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold flex items-center gap-3"></div>

                  <div class="flex flex-col sm:flex-row gap-4">
                    <button id="rejectBtn" class="flex-1 py-5 px-6 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-3xl text-[15px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-red-500/10 flex items-center justify-center gap-2">
                        <i class="fa-solid fa-xmark"></i> Reject
                    </button>
                    <button id="holdBtn" class="flex-1 py-5 px-6 border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white rounded-3xl text-[15px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2">
                        <i class="fa-solid fa-pause"></i> Hold
                    </button>
                    <button id="approveBtn" class="ui-button-primary flex-1 py-5 px-6 rounded-3xl text-[15px] uppercase tracking-widest">
                        <i class="fa-solid fa-check-double scale-110"></i> Approve & Sign
                    </button>
                  </div>
              </div>
              `:""}
          </div>

          <!-- RIGHT: TIMELINE -->
          <div class="lg:col-span-4">
              <div class="ui-section-card rounded-[40px] p-10 h-full">
                  <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest mb-10 pb-6 border-b border-gray-100/50 flex items-center gap-3">
                    <i class="fa-solid fa-route text-primary opacity-50"></i> Review Timeline
                  </h3>

                  <div class="relative ml-4 border-l-2 border-gray-100 space-y-10 pb-10">
                    ${u.map(k=>{const _=!(k.completedAt||k.CompletedAt),S=k.outcome||k.Outcome,T=_?"amber":S==="Reject"||S==="3"||S===3?"red":S==="OnHold"||S==="onhold"||S==="5"||S===5?"amber":"emerald";return`
                        <div class="relative pl-10 group">
                          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${_?"bg-amber-400 animate-pulse":T==="red"?"bg-red-500":T==="amber"?"bg-amber-500":"bg-emerald-500"} shadow-lg z-10"></div>
                          <div class="bg-white/60 p-6 rounded-3xl border border-gray-50 flex flex-col gap-2 group-hover:bg-white transition-all shadow-sm">
                            <span class="text-[13px] font-black text-gray-900 leading-none">${k.stepName||k.StepName}</span>
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${k.reviewer||"PROTOCOL"} &bull; ${k.completedAt?new Date(k.completedAt).toLocaleDateString():"AWAITING"}</span>
                            ${S?`<div class="mt-2 text-[12px] text-gray-600 font-medium italic border-l-2 border-primary/20 pl-3">"${k.remarks||"No remarks recorded."}"</div>`:""}
                          </div>
                        </div>
                        `}).join("")}
                  </div>
              </div>
          </div>
          
        </div>
      `,b&&((n=document.getElementById("resumeSubmissionBtn"))==null||n.addEventListener("click",async k=>{const _=k.currentTarget,S=_.innerHTML;_.disabled=!0,_.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Resuming...';const M=document.getElementById("resumeError");M==null||M.classList.add("hidden");try{await D.resumeSubmission(t),dt("/review")}catch(L){M&&(M.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${L.message}`,M.classList.remove("hidden")),_.disabled=!1,_.innerHTML=S}})),w){const k=async _=>{var P,V,U,O;const S=(V=(P=document.getElementById("remarksInput"))==null?void 0:P.value)==null?void 0:V.trim(),M=((O=(U=document.getElementById("nextReviewerEmailInput"))==null?void 0:U.value)==null?void 0:O.trim())||null,L=document.getElementById("respondError");if(L==null||L.classList.add("hidden"),_===xs&&!S){L.innerHTML='<i class="fa-solid fa-circle-exclamation"></i> Remarks are required when placing a submission on hold.',L.classList.remove("hidden");return}document.getElementById("approveBtn").disabled=!0,document.getElementById("rejectBtn").disabled=!0;const T=document.getElementById("holdBtn");T&&(T.disabled=!0);try{await D.respondToSubmission(t,y,_,S,M),dt("/review")}catch(j){L.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${j.message}`,L.classList.remove("hidden"),document.getElementById("approveBtn").disabled=!1,document.getElementById("rejectBtn").disabled=!1,T&&(T.disabled=!1)}};(a=document.getElementById("rejectBtn"))==null||a.addEventListener("click",()=>{var _;(_=document.getElementById("nextReviewerWrap"))==null||_.classList.add("hidden"),k(ro)}),(o=document.getElementById("holdBtn"))==null||o.addEventListener("click",()=>{var _;(_=document.getElementById("nextReviewerWrap"))==null||_.classList.add("hidden"),k(xs)}),(r=document.getElementById("approveBtn"))==null||r.addEventListener("click",()=>k(oo))}(l=document.getElementById("downloadPdfBtn"))==null||l.addEventListener("click",async k=>{const _=k.currentTarget,S=_.innerHTML;_.disabled=!0,_.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{const M=await D.getSubmissionDocument(t),L=window.URL.createObjectURL(M),T=document.createElement("a");T.href=L,T.download=`AuditLog_${t}.pdf`,document.body.appendChild(T),T.click(),window.URL.revokeObjectURL(L)}catch(M){alert(M.message)}finally{_.disabled=!1,_.innerHTML=S}});const v=k=>{const _=document.getElementById("reviewAttachmentsList");if(_){if(!k||k.length===0){_.innerHTML=`
            <div class="py-10 text-center">
              <div class="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-paperclip text-gray-200 text-xl"></i>
              </div>
              <p class="text-[12px] font-black text-gray-400 uppercase tracking-[2px]">No attachments</p>
            </div>`;return}_.innerHTML=k.map(S=>{const M=S.id||S.Id,L=S.fileName||S.FileName||"Attachment";return`
            <div class="flex items-center justify-between gap-4 p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm hover:bg-white transition-all">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 text-sm">
                  <i class="fa-solid fa-file"></i>
                </div>
                <span class="text-[13px] font-bold text-gray-700 truncate">${L}</span>
              </div>
              <button class="rev-att-download-btn w-8 h-8 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-all" data-att-id="${M}" data-att-name="${L}" title="Download">
                <i class="fa-solid fa-download text-xs"></i>
              </button>
            </div>`}).join(""),_.querySelectorAll(".rev-att-download-btn").forEach(S=>{S.addEventListener("click",async()=>{const M=S.dataset.attId,L=S.dataset.attName;try{const P=await(await D.downloadAttachment(t,M)).blob(),V=window.URL.createObjectURL(P),U=document.createElement("a");U.href=V,U.download=L,document.body.appendChild(U),U.click(),window.URL.revokeObjectURL(V)}catch(T){alert(T.message)}})})}};D.getAttachments(t).then(v).catch(()=>{const k=document.getElementById("reviewAttachmentsList");k&&(k.innerHTML='<p class="text-center text-[13px] text-red-400 font-bold py-6">Failed to load attachments.</p>')})}catch(c){e.innerHTML=`<div class="p-20 text-center font-black uppercase tracking-[3px] text-red-500 opacity-50"><i class="fa-solid fa-triangle-exclamation text-4xl mb-6"></i> Unable to load data: ${c.message}</div>`}}},ys={render:()=>`
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
  `,init:async()=>{const i=document.getElementById("modalPortal");i&&(i.innerHTML=`
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
      `);const t=document.getElementById("addDocumentModal"),e=document.getElementById("addDocumentBtn"),s=document.getElementById("closeModalBtn"),n=document.getElementById("closeModalBg"),a=document.getElementById("saveProcessBtn");e&&e.addEventListener("click",async()=>{t.classList.remove("hidden"),setTimeout(()=>{const c=document.getElementById("addDocumentModalContent");c&&(c.classList.remove("scale-95","opacity-0","translate-y-4"),c.classList.add("scale-100","opacity-100","translate-y-0"))},10);const l=document.getElementById("processDepartmentId");if(l)try{l.innerHTML='<option value="">Syncing Registry...</option>';const c=await D.getDepartments();!c||c.length===0?l.innerHTML='<option value="">No departments available</option>':l.innerHTML='<option value="" disabled selected>Select Department</option>'+c.map(d=>`<option value="${d.id}">${d.name}</option>`).join("")}catch{l.innerHTML='<option value="">Failed to connect</option>'}});const o=()=>{const l=document.getElementById("addDocumentModalContent");l&&(l.classList.add("scale-95","opacity-0","translate-y-4"),l.classList.remove("scale-100","opacity-100","translate-y-0")),setTimeout(()=>{var c;t.classList.add("hidden"),(c=document.getElementById("addProcessForm"))==null||c.reset()},300)};s&&s.addEventListener("click",o),n&&n.addEventListener("click",o);const r=async()=>{const l=document.getElementById("processList");if(l)try{const c=await D.getProcesses();if(!c||c.length===0){l.innerHTML=`
            <li class="flex-grow flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mb-4"><i class="fa-solid fa-folder-open"></i></div>
                <h3 class="text-[16px] font-bold text-gray-800">No processes configured</h3>
                <p class="text-[13px] text-gray-500 mt-1 max-w-sm">Click 'Create Workflow' to map a new document workflow.</p>
            </li>
          `;return}l.innerHTML=c.map(d=>`
          <li class="hover:bg-white/40 transition-all group animate-fade-in border-b border-gray-100/50 last:border-0 text-left">
            <a href="#/admin/documents/${d.id}" class="block px-8 py-7">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-6 text-left">
                  <div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <i class="fa-solid fa-diagram-project text-2xl opacity-80"></i>
                  </div>
                  <div class="text-left">
                    <p class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none text-left">${d.name||d.title||"Unnamed Process"}</p>
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
        `).join("")}catch{l.innerHTML='<li class="flex-grow flex items-center justify-center p-8 text-sm text-red-500 font-medium"> <i class="fa-solid fa-circle-exclamation mr-2"></i> Failed to load processes</li>'}};a&&a.addEventListener("click",async()=>{const l=document.getElementById("processTitle").value,c=document.getElementById("processDepartmentId").value;if(!l||!c)return alert("Title and Department ID are required");const d=a.innerHTML;a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Creating...';try{await D.createProcess(l,c),o(),await r()}catch(u){alert("Failed to save process: "+u.message)}finally{a.disabled=!1,a.innerHTML=d}}),r()}},vs={render:()=>`
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
  `,init:()=>{const i=document.getElementById("modalPortal");i&&(i.innerHTML=`
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
      `);const t=document.getElementById("reviewersList"),e=document.getElementById("addReviewerModal"),s={0:"Submitter",1:"Reviewer",2:"Admin",3:"Super Admin"},n={0:"fa-user-pen",1:"fa-user-check",2:"fa-user-gear",3:"fa-user-shield"},a=async()=>{try{const r=await D.getDepartments();let l=[];for(const c of r)try{const d=await D.getDepartmentMembers(c.id);l=l.concat(d.map(u=>({...u,departmentName:c.name})))}catch(d){console.error(d)}if(l.length===0){t.innerHTML=`
            <tr>
                <td colspan="4" class="px-10 py-32 text-center opacity-30">
                    <i class="fa-solid fa-users-slash text-6xl mb-6"></i>
                    <p class="text-[12px] font-black uppercase tracking-[4px]">No Personnel Mapped</p>
                </td>
            </tr>`;return}t.innerHTML=l.map(c=>{var h,p;const d=((((h=c.firstName)==null?void 0:h[0])||"")+(((p=c.lastName)==null?void 0:p[0])||"U")).toUpperCase(),u=c.role??c.generalRole??0;return`
            <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary font-black text-[18px] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          ${d}
                        </div>
                        <div>
                            <p class="text-[17px] font-black text-gray-900 leading-none mb-2 group-hover:text-primary transition-colors">${c.firstName||""} ${c.lastName||"Personnel"}</p>
                            <p class="text-[12px] font-bold text-gray-400 italic opacity-80">${c.email||"node-offline"}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-8">
                    <span class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100/50 text-gray-500 font-black text-[10px] uppercase tracking-widest border border-gray-200 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <i class="fa-solid ${n[u]} opacity-40"></i> TIER-${u} &middot; ${s[u]}
                    </span>
                </td>
                <td class="px-10 py-8">
                    <div class="flex items-center gap-3 text-[14px] font-black text-gray-700">
                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        ${c.departmentName||"Global Registry"}
                    </div>
                </td>
                <td class="px-10 py-8 text-right">
                    <button class="remove-role-btn w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ml-auto" data-id="${c.roleId||c.id}">
                        <i class="fa-solid fa-user-xmark"></i>
                    </button>
                </td>
            </tr>
          `}).join(""),document.querySelectorAll(".remove-role-btn").forEach(c=>{c.onclick=async()=>{const d=c.dataset.id;if(confirm("Irreversible Action: Revoke institutional deployment link?"))try{await D.removeRole(d),await a()}catch(u){alert(u.message)}}})}catch(r){console.error(r)}},o=r=>{const l=document.getElementById("addReviewerModalContent");r?(e.classList.remove("hidden"),setTimeout(()=>{l.classList.remove("scale-95","opacity-0","translate-y-4"),l.classList.add("scale-100","opacity-100","translate-y-0")},10)):(l.classList.add("scale-95","opacity-0","translate-y-4"),l.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{e.classList.add("hidden"),document.getElementById("addReviewerForm").reset()},300))};document.getElementById("addReviewerBtn").onclick=async()=>{o(!0);const r=document.getElementById("reviewerDepartmentId");try{const l=await D.getDepartments();r.innerHTML='<option value="" disabled selected>Allocation Node...</option>'+l.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}catch{}},document.getElementById("closeReviewerModalBtn").onclick=()=>o(!1),document.getElementById("closeReviewerModalBtnX").onclick=()=>o(!1),document.getElementById("closeReviewerModalBg").onclick=()=>o(!1),document.getElementById("saveReviewerBtn").onclick=async r=>{const l=r.currentTarget,c=document.getElementById("reviewerEmail").value,d=document.getElementById("reviewerDepartmentId").value,u=document.getElementById("reviewerRole").value;if(!c||!d)return alert("Strict parameters violation: Hub and Scope required.");const h=l.innerHTML;l.disabled=!0,l.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.assignRole(c,d,u),o(!1),await a()}catch(p){alert(p.message)}finally{l.disabled=!1,l.innerHTML=h}},a()}},ws={render:()=>`
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
  `,init:async()=>{var p,m;const i=document.getElementById("settingsForm");if(!i)return;try{const f=await D.getProfile();if(f&&(document.getElementById("first-name").value=f.firstName||f.FirstName||"",document.getElementById("last-name").value=f.lastName||f.LastName||"",document.getElementById("email-address").value=f.email||f.Email||"",document.getElementById("contact-number").value=f.contactNumber||f.ContactNumber||"",f.hasSignature!==void 0?f.hasSignature:f.HasSignature)){const x=document.getElementById("signature-status");x&&(x.classList.remove("hidden"),x.classList.add("inline-flex"))}}catch(f){console.error("Profile Retrieval Error",f)}const t=document.getElementById("signatureCanvas"),e=t.getContext("2d");let s=!1,n=[],a=[];const o=t.getBoundingClientRect(),r=window.devicePixelRatio||1;t.width=o.width*r,t.height=o.height*r,e.scale(r,r),t.style.width=o.width+"px",t.style.height=o.height+"px",e.strokeStyle="#000000",e.lineWidth=3,e.lineCap="round",e.lineJoin="round";function l(f){const g=t.getBoundingClientRect(),x=f.touches?f.touches[0].clientX:f.clientX,b=f.touches?f.touches[0].clientY:f.clientY;return{x:x-g.left,y:b-g.top}}const c=f=>{f.preventDefault(),s=!0;const g=l(f);a=[g],e.beginPath(),e.moveTo(g.x,g.y)},d=f=>{if(!s)return;f.preventDefault();const g=l(f);a.push(g),e.lineTo(g.x,g.y),e.stroke()},u=f=>{s&&(s=!1,a.length>1&&n.push([...a]),a=[])};t.addEventListener("mousedown",c),t.addEventListener("mousemove",d),t.addEventListener("mouseup",u),t.addEventListener("mouseleave",u),t.addEventListener("touchstart",c,{passive:!1}),t.addEventListener("touchmove",d,{passive:!1}),t.addEventListener("touchend",u),(p=document.getElementById("clearSignatureBtn"))==null||p.addEventListener("click",()=>{n=[],e.clearRect(0,0,t.width/r,t.height/r)});const h=()=>{const f=t.getBoundingClientRect().width,g=t.getBoundingClientRect().height,x=n.map(b=>{let y=`M ${b[0].x.toFixed(2)} ${b[0].y.toFixed(2)}`;for(let w=1;w<b.length;w++){const v=(b[w-1].x+b[w].x)/2,k=(b[w-1].y+b[w].y)/2;y+=` Q ${b[w-1].x.toFixed(2)} ${b[w-1].y.toFixed(2)} ${v.toFixed(2)} ${k.toFixed(2)}`}return`<path d="${y}" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`}).join("");return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f} ${g}" width="${f}" height="${g}">${x}</svg>`};(m=document.getElementById("saveSignatureBtn"))==null||m.addEventListener("click",async()=>{var b;const f=document.getElementById("signatureMsg"),g=document.getElementById("saveSignatureBtn");if(n.length===0)return alert("Input signature required.");const x=g.innerHTML;g.disabled=!0,g.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Processing...';try{await D.uploadSignature(h()),f.textContent="Enrolled successfully.",f.classList.remove("hidden"),(b=document.getElementById("signature-status"))==null||b.classList.remove("hidden")}catch(y){alert(y.message)}finally{g.disabled=!1,g.innerHTML=x}}),i.addEventListener("submit",async f=>{f.preventDefault();const g=i.querySelector('button[type="submit"]'),x=g.innerHTML;g.disabled=!0,g.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Synchronizing...';try{await D.updateProfile({firstName:document.getElementById("first-name").value,lastName:document.getElementById("last-name").value,email:document.getElementById("email-address").value,contactNumber:document.getElementById("contact-number").value||null}),g.className="w-full sm:w-auto bg-emerald-500 text-white font-black px-14 py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-4 transition-all",g.innerHTML='<i class="fa-solid fa-check-double"></i> Nodes Sync',setTimeout(()=>{g.className="w-full sm:w-auto bg-primary text-accent font-black px-14 py-5 rounded-[24px] shadow-2xl transition-all",g.innerHTML=x,g.disabled=!1},3e3)}catch(b){alert(b.message),g.disabled=!1,g.innerHTML=x}})}},ks={render:()=>`
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(11,93,59,0.3)] to-[rgba(255,216,77,0.1)] backdrop-blur-[12px] z-0"></div>

      <div class="glass-panel w-[1000px] h-[680px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <div class="h-[70px] bg-primary flex items-center justify-center px-8 shadow-sm">
            <div class="flex items-center gap-3 text-accent font-semibold text-base tracking-wide">
                <img src="/IMG/kldlogo.png" alt="Logo" class="h-[38px] drop-shadow-md">
                <h2>Kolehiyo ng Lungsod ng Dasmariñas</h2>
            </div>
        </div>

        <!-- Content layout -->
        <div class="flex-1 flex items-center justify-between px-16 lg:px-20">
          
          <!-- Left title -->
          <div class="flex-1 hidden md:block">
              <h1 class="text-[56px] leading-[1.15] text-primary font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] fade-slide-up">
                  <span class="text-primary font-bold">Join Our</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Sign up to start using<br>the campus portal</span>
              </h1>
          </div>

          <div class="w-full max-w-[420px] ui-card p-8 text-center fade-slide-up" style="animation-duration: 1s;">
              <h2 class="mb-5 text-primary text-2xl font-bold">Create Account</h2>

              <form id="registerForm" class="space-y-3.5">
                  <div class="grid grid-cols-2 gap-3.5">
                    <div class="relative">
                        <input id="firstName" name="firstName" type="text" placeholder="First Name" required 
                            class="ui-input pl-9 pr-3 py-3 peer">
                        <i class="fa-solid fa-address-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                    </div>
                    <div class="relative">
                        <input id="middleName" name="middleName" type="text" placeholder="Middle Name" 
                            class="ui-input pl-9 pr-3 py-3 peer">
                        <i class="fa-regular fa-address-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:text-primary"></i>
                    </div>
                  </div>

                  <div class="relative">
                      <input id="lastName" name="lastName" type="text" placeholder="Last Name" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="email" name="email" type="email" placeholder="Email Address" autocomplete="email" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="password" name="password" type="password" placeholder="Password" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" class="ui-button-primary w-full py-3.5 mt-2 text-[15px]">
                      <i class="fa-solid fa-user-plus"></i> Sign up
                  </button>

                  <div id="registerError" class="text-red-500 text-sm text-center hidden mt-2">
                    Registration failed. Please check your details.
                  </div>

                  <div class="mt-4 text-center text-[13px]">
                      <span class="text-gray-500">Already have an account?</span>
                      <a href="#/login" class="font-medium text-primary hover:text-primary-hover hover:underline ml-1">Sign in</a>
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,init:()=>{document.getElementById("registerForm").addEventListener("submit",async i=>{i.preventDefault();const t=document.getElementById("firstName").value.trim(),e=document.getElementById("lastName").value.trim(),s=document.getElementById("email").value.trim(),n=document.getElementById("password").value,a=document.getElementById("confirmPassword").value,o=document.getElementById("registerError"),r=i.target.querySelector("button"),l=r.innerHTML;if(n!==a){o.textContent="Passwords do not match.",o.classList.remove("hidden");return}r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';try{const c={firstName:t,lastName:e,email:s,password:n},d=await D.register(c);if(!d.ok){const u=await d.json().catch(()=>({}));throw new Error(u.errorDescription||u.title||"Registration failed")}dt("/login")}catch(c){o.textContent=c.message||"Registration failed. Please try again.",o.classList.remove("hidden"),r.disabled=!1,r.innerHTML=l}})}},_s={render:()=>`
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(11,93,59,0.3)] to-[rgba(255,216,77,0.1)] backdrop-blur-[12px] z-0"></div>

      <div class="glass-panel w-[1000px] h-[650px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <div class="h-[70px] bg-primary flex items-center justify-center px-8 shadow-sm">
            <div class="flex items-center gap-3 text-accent font-semibold text-base tracking-wide">
                <img src="/IMG/kldlogo.png" alt="Logo" class="h-[38px] drop-shadow-md">
                <h2>Kolehiyo ng Lungsod ng Dasmariñas</h2>
            </div>
        </div>

        <div class="flex-1 flex items-center justify-between px-16 lg:px-20">
          
          <div class="flex-1 hidden md:block">
              <h1 class="text-[56px] leading-[1.15] text-primary font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] fade-slide-up">
                  <span class="text-primary font-bold">Reset</span><br>
                  <span class="text-primary font-bold">Password</span>
              </h1>
          </div>

          <div class="w-full max-w-[380px] ui-card p-8 text-center fade-slide-up" style="animation-duration: 1s;">
              <h2 class="mb-2 text-primary text-2xl font-bold">Forgot Password</h2>
              <p class="text-gray-500 text-[13px] mb-6">Enter your email and we'll send you a reset link.</p>

              <form id="forgotForm" class="space-y-4">
                  <div class="relative">
                      <input id="fpEmail" name="email" type="email" placeholder="Email Address" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" id="fpSubmitBtn" class="ui-button-primary w-full py-3.5 mt-2 text-[15px] disabled:opacity-60">
                      <i class="fa-solid fa-paper-plane"></i> Send Link
                  </button>

                  <div id="fpError" class="text-red-500 text-sm text-center hidden mt-2"></div>
                  <div id="fpSuccess" class="text-green-600 text-sm text-center hidden mt-2 px-2">
                    If that email is registered, you will receive a password reset link shortly.
                  </div>

                  <div class="mt-5 text-center text-[13px]">
                      <a href="#/login" class="font-medium text-primary hover:text-primary-hover hover:underline transition-colors">&larr; Back to sign in</a>
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,init:()=>{const i=document.getElementById("forgotForm"),t=document.getElementById("fpError"),e=document.getElementById("fpSuccess"),s=document.getElementById("fpSubmitBtn");i.addEventListener("submit",async n=>{n.preventDefault(),t.classList.add("hidden"),e.classList.add("hidden"),s.disabled=!0;const a=s.innerHTML;s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending…';const o=document.getElementById("fpEmail").value.trim();try{const r=await D.forgotPassword(o);if(!r.ok&&r.status!==404){const l=await r.json().catch(()=>({}));throw new Error(l.errorDescription||l.title||"Something went wrong.")}e.classList.remove("hidden"),i.querySelector("input").value=""}catch(r){t.textContent=r.message,t.classList.remove("hidden")}finally{s.disabled=!1,s.innerHTML=a}})}},Ss={render:()=>`
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(11,93,59,0.3)] to-[rgba(255,216,77,0.1)] backdrop-blur-[12px] z-0"></div>

      <div class="glass-panel w-[1000px] h-[650px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <div class="h-[70px] bg-primary flex items-center justify-center px-8 shadow-sm">
            <div class="flex items-center gap-3 text-accent font-semibold text-base tracking-wide">
                <img src="/IMG/kldlogo.png" alt="Logo" class="h-[38px] drop-shadow-md">
                <h2>Kolehiyo ng Lungsod ng Dasmariñas</h2>
            </div>
        </div>

        <div class="flex-1 flex items-center justify-between px-16 lg:px-20">
          
          <div class="flex-1 hidden md:block">
              <h1 class="text-[56px] leading-[1.15] text-primary font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] fade-slide-up">
                  <span class="text-primary font-bold">Password</span><br>
                  <span class="text-primary font-bold">Reset</span>
              </h1>
          </div>

          <div class="w-full max-w-[380px] ui-card p-8 text-center fade-slide-up" style="animation-duration: 1s;">
              
              <div id="rpInvalidLink" class="text-red-500 text-[13px] text-center hidden mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                This reset link is invalid or has expired. Please request a new one.
                <div class="mt-2">
                  <a href="#/forgot-password" class="font-bold text-primary hover:text-primary-hover underline">Request new link</a>
                </div>
              </div>

              <form id="resetForm" class="space-y-4">
                  <h2 class="mb-2 text-primary text-2xl font-bold">New Password</h2>
                  <p class="text-gray-500 text-[13px] mb-6">Choose a secure password for your account.</p>

                  <div class="relative">
                      <input id="rpPassword" name="password" type="password" placeholder="New Password" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="rpConfirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" id="rpSubmitBtn" class="ui-button-primary w-full py-3.5 mt-2 text-[15px] disabled:opacity-60">
                      <i class="fa-solid fa-check"></i> Reset Password
                  </button>

                  <div id="rpError" class="text-red-500 text-sm text-center hidden mt-2"></div>

                  <div class="mt-5 text-center text-[13px]">
                      <a href="#/login" class="font-medium text-primary hover:text-primary-hover hover:underline transition-colors">&larr; Back to sign in</a>
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,init:()=>{const i=window.location.hash.split("?")[1]||"",t=new URLSearchParams(i),e=t.get("userId"),s=t.get("token"),n=document.getElementById("rpInvalidLink"),a=document.getElementById("resetForm"),o=document.getElementById("rpError"),r=document.getElementById("rpSubmitBtn");if(!e||!s){n.classList.remove("hidden"),a.classList.add("hidden");return}a.addEventListener("submit",async l=>{l.preventDefault(),o.classList.add("hidden");const c=document.getElementById("rpPassword").value,d=document.getElementById("rpConfirmPassword").value;if(c!==d){o.textContent="Passwords do not match.",o.classList.remove("hidden");return}r.disabled=!0;const u=r.innerHTML;r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Resetting…';try{const h=await D.resetPassword(e,s,c);if(!h.ok){const p=await h.json().catch(()=>({}));throw new Error(p.errorDescription||p.title||"Failed to reset password.")}dt("/login?reset=success")}catch(h){o.textContent=h.message,o.classList.remove("hidden"),r.disabled=!1,r.innerHTML=u}})}},Ms={render:()=>`
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
  `,init:()=>{const i=document.getElementById("logsTableBody"),t=document.getElementById("logFilterForm"),e=document.getElementById("prevPageBtn"),s=document.getElementById("nextPageBtn"),n=document.getElementById("currentPageLabel");let a=1,o={};const r=async(l=1)=>{i.innerHTML=`
        <tr><td colspan="4" class="px-10 py-32 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Searching logs...</p>
        </td></tr>`;try{const c=await D.getLogs({...o,page:l,pageSize:20}),d=Array.isArray(c)?c:c.items||c.data||[];d.length===0?(i.innerHTML=`
            <tr><td colspan="4" class="px-10 py-32 text-center opacity-30">
                <i class="fa-solid fa-terminal text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">No logs found</p>
            </td></tr>`,s.disabled=!0):(i.innerHTML=d.map(u=>{const h=new Date(u.timestamp||u.Timestamp),p=u.action||u.Action||"—";let m=u.details||u.Details||"";return typeof m=="object"&&(m=JSON.stringify(m)),`
              <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                   <div class="flex flex-col">
                     <span class="text-[14px] font-black text-gray-900 leading-none mb-1.5">${h.toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})}</span>
                     <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">${h.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}</span>
                   </div>
                </td>
                <td class="px-10 py-8">
                  <span class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest border border-primary/10 shadow-sm">
                    <i class="fa-solid fa-microchip opacity-30"></i> ${p}
                  </span>
                </td>
                <td class="px-10 py-8">
                  <div class="flex items-center gap-3 text-[12px] font-black font-mono text-gray-400 group-hover:text-gray-800 transition-colors">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                      ${u.userId||"Institutional System"}
                  </div>
                </td>
                <td class="px-10 py-8">
                  <div class="bg-white/50 p-4 rounded-2xl border border-gray-100 shadow-inner max-w-md">
                     <p class="text-[11px] font-mono font-medium text-gray-500 line-clamp-3 group-hover:line-clamp-none transition-all">${m||"No details available."}</p>
                  </div>
                </td>
              </tr>
            `}).join(""),s.disabled=d.length<20),a=l,n.textContent=a,e.disabled=a===1}catch(c){i.innerHTML=`<tr><td colspan="4" class="px-10 py-8 text-center text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Unable to load logs: ${c.message}</td></tr>`}};t.onsubmit=l=>{l.preventDefault(),o={actionFilter:document.getElementById("filterAction").value||void 0,userIdFilter:document.getElementById("filterUserId").value||void 0,from:document.getElementById("filterFrom").value||void 0},r(1)},e.onclick=()=>{a>1&&r(a-1)},s.onclick=()=>r(a+1),r(1)}},Es={render:()=>`
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
  `,init:()=>{const i=document.getElementById("modalPortal");i&&(i.innerHTML=`
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
      `);const t=document.getElementById("departmentTableBody"),e=document.getElementById("departmentModal"),s=document.getElementById("modal-title"),n=document.getElementById("saveDepartmentBtn"),a=async()=>{try{const r=await D.getDepartments();if(!r||r.length===0){t.innerHTML=`
            <tr>
              <td colspan="3" class="px-10 py-32 text-center opacity-30">
                  <span class="text-primary font-bold">Departments</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Managing Institutional<br>Process Units</span>
              </td>
            </tr>`;return}t.innerHTML=r.map(l=>`
          <tr class="group hover:bg-white/40 transition-all">
            <td class="px-10 py-8">
              <div class="flex items-center gap-6">
                  <div class="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <i class="fa-solid fa-building-shield text-2xl opacity-40"></i>
                  </div>
                  <div>
                    <a href="#/admin/departments/${l.id}" class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none">${l.name}</a>
                  </div>
              </div>
            </td>
            <td class="px-10 py-8">
              <p class="text-[14px] font-bold text-gray-500 italic leading-relaxed opacity-80 max-w-md line-clamp-2">
                  ${l.description||"No description provided."}
              </p>
            </td>
            <td class="px-10 py-8 text-right">
                <div class="flex items-center justify-end gap-4">
                    <span class="inline-flex px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-black text-[9px] uppercase tracking-widest border border-emerald-500/20 shadow-sm">Operational</span>
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button data-edit="${l.id}" data-name="${l.name}" data-desc="${(l.description||"").replace(/"/g,"&quot;")}" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all">
                            <i class="fa-solid fa-sliders"></i>
                        </button>
                        <button data-delete="${l.id}" data-name="${l.name.replace(/"/g,"&quot;")}" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 shadow-sm flex items-center justify-center transition-all">
                            <i class="fa-solid fa-link-slash"></i>
                        </button>
                    </div>
                </div>
            </td>
          </tr>
        `).join("")}catch{t.innerHTML='<tr><td colspan="3" class="px-10 py-8 text-center text-red-500 font-black uppercase text-[10px] tracking-widest"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Registry Access Error</td></tr>'}},o=(r,l=null)=>{const c=document.getElementById("departmentModalContent");r?(document.getElementById("departmentId").value=l?l.id:"",document.getElementById("departmentName").value=l?l.name:"",document.getElementById("departmentDescription").value=l?l.description:"",s.textContent=l?"Modify Configuration":"Register Department",n.innerHTML=l?'<i class="fa-solid fa-cloud-arrow-up"></i> Save Changes':'<i class="fa-solid fa-cloud-bolt text-lg opacity-70"></i> Add Department',e.classList.remove("hidden"),setTimeout(()=>{c.classList.remove("scale-95","opacity-0","translate-y-4"),c.classList.add("scale-100","opacity-100","translate-y-0")},10)):(c.classList.add("scale-95","opacity-0","translate-y-4"),c.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{e.classList.add("hidden"),document.getElementById("departmentForm").reset()},300))};document.getElementById("addDepartmentBtn").onclick=()=>o(!0),document.getElementById("closeModalBtn").onclick=()=>o(!1),document.getElementById("closeModalBtnX").onclick=()=>o(!1),document.getElementById("closeModalBg").onclick=()=>o(!1),t.addEventListener("click",async r=>{const l=r.target.closest("[data-edit]"),c=r.target.closest("[data-delete]");if(l&&o(!0,{id:l.dataset.edit,name:l.dataset.name,description:l.dataset.desc}),c&&confirm(`Irreversible Action: Decommission "${c.dataset.name}" and all associated deployment links?`))try{await D.deleteDepartment(c.dataset.delete),await a()}catch(d){alert(d.message)}}),n.onclick=async()=>{const r=document.getElementById("departmentId").value,l=document.getElementById("departmentName").value,c=document.getElementById("departmentDescription").value;if(!l)return alert("Entity identifier strictly required.");const d=n.innerHTML;n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{r?await D.updateDepartment(r,l,c):await D.createDepartment(l,c),o(!1),await a()}catch(u){alert(u.message)}finally{n.disabled=!1,n.innerHTML=d}},a()}},Ls={render:()=>`
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
    </div>
  `,init:async i=>{const t=i.id;if(!t)return;const e=document.getElementById("modalPortal");e&&(e.innerHTML=`
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
      `);const s={0:"fa-user-pen",1:"fa-user-check",2:"fa-user-gear",3:"fa-user-shield"},n=async()=>{try{const r=(await D.getDepartments()).find(p=>p.id===t);r&&(document.getElementById("deptName").innerText=r.name,document.getElementById("deptDesc").innerText=r.description||"Functional mandate unassigned.",document.getElementById("deptIdTag").innerText=`UNIT-${t.substring(0,8).toUpperCase()}`);const[l,c]=await Promise.all([D.getProcesses(),D.getDepartmentMembers(t)]),d=(l||[]).filter(p=>p.departmentId===t),u=document.getElementById("processList");d.length===0?u.innerHTML=`
            <div class="py-32 text-center opacity-30 select-none">
                <i class="fa-solid fa-sitemap text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">No Frameworks Scope</p>
            </div>`:u.innerHTML=d.map(p=>`
            <li class="px-10 py-8 flex items-center justify-between group hover:bg-white/40 transition-all relative">
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-primary group-hover:h-12 transition-all rounded-r-full shadow-[0_0_15px_rgba(11,93,59,0.3)]"></div>
              <div class="flex items-center gap-8">
                  <div class="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                      <i class="fa-solid fa-diagram-project text-2xl opacity-40"></i>
                  </div>
                  <div>
                    <h4 class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none mb-2">${p.name||p.title||"Untitled Protocol"}</h4>
                    <div class="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-layer-group opacity-30"></i> ${p.stepsCount||0} Architected Nodes</span>
                        <span class="opacity-10">|</span>
                        <span class="flex items-center gap-2 ${p.hasTemplate?"text-emerald-500":"text-gray-300"}"><i class="fa-solid ${p.hasTemplate?"fa-file-shield":"fa-file-slash"} opacity-30"></i> ${p.hasTemplate?"Template Synchronized":"Baseline Missing"}</span>
                    </div>
                  </div>
              </div>
              <a href="#/admin/documents/${p.id}" class="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <i class="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
              </a>
            </li>
          `).join("");const h=document.getElementById("membersList");!c||c.length===0?h.innerHTML=`
            <tr><td class="px-10 py-20 text-center opacity-20">
                <i class="fa-solid fa-users-slash text-4xl mb-4"></i>
                <p class="text-[11px] font-black uppercase tracking-widest">Isolated Node</p>
            </td></tr>`:(h.innerHTML=c.map(p=>{var g,x;const m=((((g=p.firstName)==null?void 0:g[0])||"")+(((x=p.lastName)==null?void 0:x[0])||"U")).toUpperCase(),f=p.role??p.generalRole??0;return`
              <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-6">
                    <div class="flex items-center gap-5">
                        <div class="w-12 h-12 rounded-xl bg-white border border-gray-50 shadow-md flex items-center justify-center text-primary font-black text-[12px] group-hover:scale-110 transition-transform">${m}</div>
                        <div>
                            <p class="text-[14px] font-black text-gray-900 leading-none group-hover:text-primary transition-colors mb-1">${p.firstName||""} ${p.lastName||"Member"}</p>
                            <p class="text-[10px] font-medium text-gray-400 italic">${p.email||"offline-hub"}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 font-black text-[9px] uppercase tracking-widest border border-gray-200 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <i class="fa-solid ${s[f]} opacity-30"></i> TIER-${f}
                    </span>
                </td>
                <td class="px-10 py-6 text-right">
                    <button class="remove-role-btn w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100" data-id="${p.roleId||p.id}">
                        <i class="fa-solid fa-user-minus"></i>
                    </button>
                </td>
              </tr>`}).join(""),document.querySelectorAll(".remove-role-btn").forEach(p=>{p.onclick=async()=>{if(confirm("Irreversible Action: Decouple member affiliation from this node?"))try{await D.removeRole(p.dataset.id),await n()}catch(m){alert(m.message)}}}))}catch(o){console.error(o)}};await n();const a=(o,r)=>{const l=document.getElementById(o),c=l.querySelector('div[id$="Content"]');r?(l.classList.remove("hidden"),setTimeout(()=>{c.classList.remove("scale-95","opacity-0","translate-y-4"),c.classList.add("scale-100","opacity-100","translate-y-0")},10)):(c.classList.add("scale-95","opacity-0","translate-y-4"),c.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{var d;l.classList.add("hidden"),(d=l.querySelector("form"))==null||d.reset()},300))};document.getElementById("addMemberBtn").onclick=()=>a("addMemberModal",!0),document.getElementById("closeMemberModalBtn").onclick=()=>a("addMemberModal",!1),document.getElementById("closeMemberModalBg").onclick=()=>a("addMemberModal",!1),document.getElementById("addProcessBtn").onclick=()=>a("addProcessModal",!0),document.getElementById("closeProcessModalBtn").onclick=()=>a("addProcessModal",!1),document.getElementById("closeProcessModalBg").onclick=()=>a("addProcessModal",!1),document.getElementById("saveMemberBtn").onclick=async o=>{const r=o.currentTarget,l=document.getElementById("memberEmail").value,c=document.getElementById("memberRole").value;if(!l)return alert("Hub identifier required.");const d=r.innerHTML;r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.assignRole(l,t,c),a("addMemberModal",!1),await n()}catch(u){alert(u.message)}finally{r.disabled=!1,r.innerHTML=d}},document.getElementById("saveProcessBtn").onclick=async o=>{const r=o.currentTarget,l=document.getElementById("processTitle").value;if(!l)return alert("Protocol nomenclature required.");const c=r.innerHTML;r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.createProcess(l,t),a("addProcessModal",!1),await n()}catch(d){alert(d.message)}finally{r.disabled=!1,r.innerHTML=c}}}},Ts={render:()=>`
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
  `,init:()=>{const i=document.getElementById("trackPendingList");(async()=>{try{const e=await D.getMySubmissions(),s=Array.isArray(e)?e:e.items||[];if(s.length===0){i.innerHTML=`
            <tr>
              <td colspan="4" class="px-10 py-32 text-center opacity-30">
                  <i class="fa-solid fa-ghost text-6xl mb-6"></i>
                  <p class="text-[12px] font-black uppercase tracking-[4px]">No Submissions Found</p>
              </td>
            </tr>`;return}const n=a=>a===0||a===1?{l:"Pending",c:"bg-primary/5 text-primary border-primary/10 shadow-sm",i:"fa-spinner fa-spin"}:a===2?{l:"Complete",c:"bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm",i:"fa-check-double"}:a===3?{l:"Rejected",c:"bg-red-500/10 text-red-600 border-red-500/20 shadow-sm",i:"fa-shield-xmark"}:a===4?{l:"Cancelled",c:"bg-gray-100 text-gray-500 border-gray-200 shadow-sm",i:"fa-ban"}:a===5?{l:"On Hold",c:"bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm",i:"fa-pause"}:{l:"Archived",c:"bg-gray-100 text-gray-400 border-gray-200",i:"fa-box-archive"};i.innerHTML=s.map(a=>{var l;const o=n(a.status),r=a.createdAt?new Date(a.createdAt).toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"}):"—";return`
            <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <i class="fa-solid fa-file-contract text-2xl opacity-40"></i>
                        </div>
                        <div>
                            <p class="text-[18px] font-black text-gray-900 leading-none mb-2 group-hover:text-primary transition-colors">${a.processName||((l=a.process)==null?void 0:l.title)||"Document Protocol"}</p>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID &middot; ${(a.id||"N/A").toString().substring(0,12).toUpperCase()}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-8">
                    <div class="flex items-center gap-3 text-[13px] font-black text-gray-600">
                        <i class="fa-regular fa-clock opacity-30"></i> ${r}
                    </div>
                </td>
                <td class="px-10 py-8">
                    <span class="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 ${o.c}">
                        <i class="fa-solid ${o.i} text-[11px] opacity-70"></i> ${o.l}
                    </span>
                </td>
                <td class="px-10 py-8 text-right">
                    <a href="#/track/${a.id}" class="ui-button-primary px-6 py-3 text-[11px] uppercase tracking-widest">
                        Track Status <i class="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>
                    </a>
                </td>
            </tr>
          `}).join("")}catch(e){i.innerHTML=`<tr><td colspan="4" class="px-10 py-10 text-center text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Queue Access Warning: ${e.message}</td></tr>`}})()}},Ds=i=>{var e;const t={0:"Submitted",1:"In Review",2:"Approved",3:"Rejected",4:"Cancelled",5:"On Hold"};return t[i]??t[(e=i==null?void 0:i.toString())==null?void 0:e.toLowerCase()]??i??"—"},As=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"bg-blue-50 text-blue-700 border-blue-200",submitted:"bg-blue-50 text-blue-700 border-blue-200",1:"bg-orange-50 text-orange-700 border-orange-200",review:"bg-orange-50 text-orange-700 border-orange-200","in review":"bg-orange-50 text-orange-700 border-orange-200",2:"bg-emerald-50 text-emerald-700 border-emerald-200",approved:"bg-emerald-50 text-emerald-700 border-emerald-200",approve:"bg-emerald-50 text-emerald-700 border-emerald-200",3:"bg-red-50 text-red-700 border-red-200",rejected:"bg-red-50 text-red-700 border-red-200",reject:"bg-red-50 text-red-700 border-red-200",4:"bg-gray-100 text-gray-600 border-gray-200",cancelled:"bg-gray-100 text-gray-600 border-gray-200",cancel:"bg-gray-100 text-gray-600 border-gray-200",5:"bg-amber-50 text-amber-700 border-amber-200",onhold:"bg-amber-50 text-amber-700 border-amber-200","on hold":"bg-amber-50 text-amber-700 border-amber-200"}[t]??"bg-gray-100 text-gray-600 border-gray-200"},Ps=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"fa-rotate",submitted:"fa-rotate",1:"fa-clock",review:"fa-clock","in review":"fa-clock",2:"fa-check",approved:"fa-check",approve:"fa-check",3:"fa-xmark",rejected:"fa-xmark",reject:"fa-xmark",4:"fa-ban",cancelled:"fa-ban",cancel:"fa-ban",5:"fa-pause",onhold:"fa-pause","on hold":"fa-pause"}[t]??"fa-circle-info"},Is={render:()=>`
    <div class="ui-page-shell max-w-6xl">
      
      <!-- HEADER & NAVIGATION -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button id="backBtn" onclick="window.history.back()" class="group inline-flex items-center gap-3 text-[12px] font-black text-gray-400 hover:text-primary transition-all uppercase tracking-[2px] mb-8">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to List
          </button>
          <h1 class="ui-page-title mb-4">Submission Status</h1>
          <p class="ui-muted font-medium max-w-xl leading-relaxed italic opacity-80">Real-time status and history of your document submission.</p>
        </div>
      </div>

      <div id="trackDetailContent" class="space-y-12 min-h-[400px]">
        <div class="flex flex-col items-center justify-center py-32 text-gray-300 gap-6">
            <i class="fa-solid fa-spinner fa-spin text-5xl text-primary/30"></i>
            <span class="text-[12px] font-black uppercase tracking-[3px] text-gray-400 animate-pulse">Retrieving Status...</span>
        </div>
      </div>
    </div>
  `,init:async i=>{var s,n;const t=i==null?void 0:i.id,e=document.getElementById("trackDetailContent");if(t)try{const a=await D.getSubmission(t),o=a.fieldValues||a.FieldValues||[],r=a.stepResponses||a.StepResponses||[],l=a.currentStep||a.CurrentStep,c=a.status??a.Status??1,d=a.processName||a.ProcessName||"Protocol Execution",u=a.submittedAt||a.SubmittedAt;e.innerHTML=`
        <!-- HERO DATA PANEL -->
        <div class="ui-section-card rounded-[48px] overflow-hidden p-10 lg:p-14 relative group">
          <div class="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
            <div class="flex-1">
               <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest mb-6">
                  <i class="fa-solid fa-fingerprint"></i> ID: #${t.toString().slice(-8).toUpperCase()}
              </div>
              <h2 class="text-[42px] font-black text-gray-900 tracking-tighter leading-none mb-4">${d}</h2>
              <div class="flex flex-wrap items-center gap-6 text-[14px] text-gray-500 font-bold">
                <span class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <i class="fa-regular fa-calendar-check text-primary"></i> 
                    ${u?new Date(u).toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):"Pending"}
                </span>
                ${l?`
                <span class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <i class="fa-solid fa-bezier-curve text-primary"></i> 
                    ${l}
                </span>`:""}
              </div>
            </div>

            <div class="flex flex-col items-start lg:items-end gap-3">
              <div class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-1">Current Status</div>
              <div class="flex items-center gap-4">
                ${c===2||c==="Approved"?`
                <button id="downloadPdfBtn" class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary text-2xl hover:scale-110 active:scale-95 transition-all group/btn" title="Download Document">
                   <i class="fa-solid fa-file-pdf group-hover/btn:rotate-12"></i>
                </button>`:""}
                <div class="inline-flex items-center px-10 py-5 rounded-3xl text-[18px] font-black shadow-2xl border-2 border-white/50 ${As(c)} gap-4 transition-all hover:scale-105 active:scale-95 cursor-default group-hover:shadow-primary/10">
                  <i class="fa-solid ${Ps(c)} scale-125"></i> 
                  ${Ds(c)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ATTACHMENTS PANEL -->
        <div class="ui-section-card rounded-[32px] p-10" id="attachmentsPanel">
          <div class="flex items-center justify-between gap-3 mb-8 pb-6 border-b border-gray-100/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-lg shadow-inner"><i class="fa-solid fa-paperclip"></i></div>
              <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest">Attachments</h3>
            </div>
            <label class="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <i class="fa-solid fa-upload"></i> Upload
              <input type="file" id="attachmentFileInput" multiple class="hidden">
            </label>
          </div>
          <div id="attachmentUploadError" class="hidden mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-[13px] flex items-center gap-2"></div>
          <div id="attachmentsList" class="space-y-3">
            <div class="flex items-center justify-center py-10 text-gray-300 gap-3">
              <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          <!-- LEFT: DATA ELEMENTS -->
          <div class="lg:col-span-2 space-y-8">
            <div class="ui-section-card rounded-[32px] p-10 h-full">
              <div class="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100/50">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shadow-inner"><i class="fa-solid fa-database"></i></div>
                  <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest">Submission Details</h3>
              </div>
              
              ${o.length>0?`
                <div class="space-y-8">
                  ${o.map(p=>`
                    <div class="group">
                      <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-hover:text-primary transition-colors">${p.fieldName||p.FieldName}</dt>
                      <dd class="text-[15px] font-extrabold text-gray-800 bg-white/60 p-4 rounded-2xl border border-gray-100/50 shadow-inner group-hover:bg-white transition-all transform group-hover:translate-x-1">
                        ${p.fieldValue||p.FieldValue||"—"}
                      </dd>
                    </div>
                  `).join("")}
                </div>
              `:`
                <div class="py-12 text-center">
                    <span class="text-primary font-bold">Document Details</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Status & History</span>
                </div>
              `}
            </div>
          </div>

          <!-- RIGHT: ENHANCED TIMELINE -->
          <div class="lg:col-span-3 space-y-8">
            <div class="ui-section-card rounded-[32px] p-10">
              <div class="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100/50">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shadow-inner"><i class="fa-solid fa-timeline"></i></div>
                  <h3 class="text-[16px] font-black text-gray-800 uppercase tracking-widest">Approval Progress</h3>
              </div>

              ${r.length>0?`
                <div class="relative ml-6 border-l-4 border-gray-100 space-y-12 pb-10">
                  ${r.map((p,m)=>{const f=p.outcome||p.Outcome,g=!(p.completedAt||p.CompletedAt),y=g?"amber":f==="Reject"||f==="3"||f===3?"red":f==="OnHold"||f==="onhold"||f==="5"||f===5?"amber":"emerald";return`
                      <div class="relative pl-12 group">
                        <!-- BALL -->
                        <div class="absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-white ${g?"bg-amber-400 animate-pulse":y==="red"?"bg-red-500":y==="amber"?"bg-amber-500":"bg-emerald-500"} shadow-md z-10 transition-transform group-hover:scale-125"></div>
                        
                        <div class="bg-white/80 p-8 rounded-[24px] border border-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:-translate-y-1 group-hover:bg-white relative">
                          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h4 class="text-[18px] font-black text-gray-800 leading-none mb-2">${p.stepName||p.StepName}</h4>
                                <div class="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <i class="fa-solid fa-user-tie text-[12px]"></i> ${p.reviewer||"System Protocol"} 
                                    &bull; 
                                    <i class="fa-solid fa-clock text-[12px]"></i> ${p.completedAt?new Date(p.completedAt).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"Pending"}
                                </div>
                            </div>
                            ${f?`
                            <span class="inline-flex items-center px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 ${As(f)}">
                                <i class="fa-solid ${Ps(f)} mr-2"></i> ${Ds(f)}
                            </span>`:""}
                          </div>
                          
                          ${p.remarks?`
                          <div class="mt-6 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 italic text-[14px] text-gray-600 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                            <i class="fa-solid fa-quote-left absolute -top-2 -left-1 text-gray-100 text-4xl group-hover:text-primary/10 transition-colors"></i>
                            <span class="relative z-10">${p.remarks}</span>
                          </div>`:""}
                        </div>
                      </div>
                    `}).join("")}
                </div>
              `:`
                <div class="py-20 text-center">
                    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-route text-gray-200 text-3xl"></i>
                    </div>
                    <p class="text-[14px] font-black text-gray-400 uppercase tracking-[2px]">Workflow nodes have not initialized.</p>
                </div>
              `}
            </div>
          </div>
        </div>
      `,(s=document.getElementById("downloadPdfBtn"))==null||s.addEventListener("click",async p=>{const m=p.currentTarget,f=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{const g=await D.getSubmissionDocument(t),x=window.URL.createObjectURL(g),b=document.createElement("a");b.href=x,b.download=`Submission_${t}.pdf`,document.body.appendChild(b),b.click(),window.URL.revokeObjectURL(x)}catch(g){alert(g.message)}finally{m.disabled=!1,m.innerHTML=f}});const h=p=>{const m=document.getElementById("attachmentsList");if(m){if(!p||p.length===0){m.innerHTML=`
            <div class="py-10 text-center">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-paperclip text-gray-200 text-2xl"></i>
              </div>
              <p class="text-[13px] font-black text-gray-400 uppercase tracking-[2px]">No attachments yet</p>
            </div>`;return}m.innerHTML=p.map(f=>{const g=f.id||f.Id,x=f.fileName||f.FileName||"Attachment";return`
            <div class="flex items-center justify-between gap-4 p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm hover:bg-white transition-all group" data-att-id="${g}">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 text-sm">
                  <i class="fa-solid fa-file"></i>
                </div>
                <span class="text-[13px] font-bold text-gray-700 truncate">${x}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button class="att-download-btn w-8 h-8 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-all" data-att-id="${g}" data-att-name="${x}" title="Download">
                  <i class="fa-solid fa-download text-xs"></i>
                </button>
                <button class="att-delete-btn w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all" data-att-id="${g}" title="Delete">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>`}).join(""),m.querySelectorAll(".att-download-btn").forEach(f=>{f.addEventListener("click",async()=>{const g=f.dataset.attId,x=f.dataset.attName;try{const y=await(await D.downloadAttachment(t,g)).blob(),w=window.URL.createObjectURL(y),v=document.createElement("a");v.href=w,v.download=x,document.body.appendChild(v),v.click(),window.URL.revokeObjectURL(w)}catch(b){alert(b.message)}})}),m.querySelectorAll(".att-delete-btn").forEach(f=>{f.addEventListener("click",async()=>{const g=f.dataset.attId;if(confirm("Delete this attachment?"))try{await D.deleteAttachment(t,g);const x=await D.getAttachments(t);h(x)}catch(x){alert(x.message)}})})}};D.getAttachments(t).then(h).catch(()=>{const p=document.getElementById("attachmentsList");p&&(p.innerHTML='<p class="text-center text-[13px] text-red-400 font-bold py-6">Failed to load attachments.</p>')}),(n=document.getElementById("attachmentFileInput"))==null||n.addEventListener("change",async p=>{const m=Array.from(p.target.files);if(!m.length)return;const f=document.getElementById("attachmentUploadError");f==null||f.classList.add("hidden");const g=document.getElementById("attachmentsList"),x=g==null?void 0:g.innerHTML;g&&(g.innerHTML='<div class="flex items-center justify-center py-10 gap-3 text-gray-400 font-bold text-[13px]"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</div>');try{await D.uploadAttachments(t,m);const b=await D.getAttachments(t);h(b)}catch(b){g&&x&&(g.innerHTML=x),f&&(f.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${b.message}`,f.classList.remove("hidden"))}p.target.value=""})}catch(a){e.innerHTML=`
        <div class="ui-card rounded-[40px] border-red-100 bg-red-50/30 p-20 text-center max-w-2xl mx-auto shadow-2xl">
          <div class="w-20 h-20 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h2 class="text-[28px] font-black text-red-700 tracking-tight mb-4">Error Loading Data</h2>
          <p class="text-red-600 text-[16px] font-medium leading-relaxed opacity-70">${a.message}</p>
          <button onclick="window.location.reload()" class="ui-button-primary mt-10 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-200">Retry</button>
        </div>
      `}}};/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */function De(i){return i+.5|0}const Mt=(i,t,e)=>Math.max(Math.min(i,e),t);function de(i){return Mt(De(i*2.55),0,255)}function At(i){return Mt(De(i*255),0,255)}function wt(i){return Mt(De(i/2.55)/100,0,1)}function Cs(i){return Mt(De(i*100),0,100)}const ot={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},Pi=[..."0123456789ABCDEF"],ho=i=>Pi[i&15],po=i=>Pi[(i&240)>>4]+Pi[i&15],Ie=i=>(i&240)>>4===(i&15),fo=i=>Ie(i.r)&&Ie(i.g)&&Ie(i.b)&&Ie(i.a);function go(i){var t=i.length,e;return i[0]==="#"&&(t===4||t===5?e={r:255&ot[i[1]]*17,g:255&ot[i[2]]*17,b:255&ot[i[3]]*17,a:t===5?ot[i[4]]*17:255}:(t===7||t===9)&&(e={r:ot[i[1]]<<4|ot[i[2]],g:ot[i[3]]<<4|ot[i[4]],b:ot[i[5]]<<4|ot[i[6]],a:t===9?ot[i[7]]<<4|ot[i[8]]:255})),e}const mo=(i,t)=>i<255?t(i):"";function xo(i){var t=fo(i)?ho:po;return i?"#"+t(i.r)+t(i.g)+t(i.b)+mo(i.a,t):void 0}const bo=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function aa(i,t,e){const s=t*Math.min(e,1-e),n=(a,o=(a+i/30)%12)=>e-s*Math.max(Math.min(o-3,9-o,1),-1);return[n(0),n(8),n(4)]}function yo(i,t,e){const s=(n,a=(n+i/60)%6)=>e-e*t*Math.max(Math.min(a,4-a,1),0);return[s(5),s(3),s(1)]}function vo(i,t,e){const s=aa(i,1,.5);let n;for(t+e>1&&(n=1/(t+e),t*=n,e*=n),n=0;n<3;n++)s[n]*=1-t-e,s[n]+=t;return s}function wo(i,t,e,s,n){return i===n?(t-e)/s+(t<e?6:0):t===n?(e-i)/s+2:(i-t)/s+4}function Yi(i){const e=i.r/255,s=i.g/255,n=i.b/255,a=Math.max(e,s,n),o=Math.min(e,s,n),r=(a+o)/2;let l,c,d;return a!==o&&(d=a-o,c=r>.5?d/(2-a-o):d/(a+o),l=wo(e,s,n,d,a),l=l*60+.5),[l|0,c||0,r]}function Xi(i,t,e,s){return(Array.isArray(t)?i(t[0],t[1],t[2]):i(t,e,s)).map(At)}function Gi(i,t,e){return Xi(aa,i,t,e)}function ko(i,t,e){return Xi(vo,i,t,e)}function _o(i,t,e){return Xi(yo,i,t,e)}function oa(i){return(i%360+360)%360}function So(i){const t=bo.exec(i);let e=255,s;if(!t)return;t[5]!==s&&(e=t[6]?de(+t[5]):At(+t[5]));const n=oa(+t[2]),a=+t[3]/100,o=+t[4]/100;return t[1]==="hwb"?s=ko(n,a,o):t[1]==="hsv"?s=_o(n,a,o):s=Gi(n,a,o),{r:s[0],g:s[1],b:s[2],a:e}}function Mo(i,t){var e=Yi(i);e[0]=oa(e[0]+t),e=Gi(e),i.r=e[0],i.g=e[1],i.b=e[2]}function Eo(i){if(!i)return;const t=Yi(i),e=t[0],s=Cs(t[1]),n=Cs(t[2]);return i.a<255?`hsla(${e}, ${s}%, ${n}%, ${wt(i.a)})`:`hsl(${e}, ${s}%, ${n}%)`}const Bs={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},Rs={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};function Lo(){const i={},t=Object.keys(Rs),e=Object.keys(Bs);let s,n,a,o,r;for(s=0;s<t.length;s++){for(o=r=t[s],n=0;n<e.length;n++)a=e[n],r=r.replace(a,Bs[a]);a=parseInt(Rs[o],16),i[r]=[a>>16&255,a>>8&255,a&255]}return i}let Ce;function To(i){Ce||(Ce=Lo(),Ce.transparent=[0,0,0,0]);const t=Ce[i.toLowerCase()];return t&&{r:t[0],g:t[1],b:t[2],a:t.length===4?t[3]:255}}const Do=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;function Ao(i){const t=Do.exec(i);let e=255,s,n,a;if(t){if(t[7]!==s){const o=+t[7];e=t[8]?de(o):Mt(o*255,0,255)}return s=+t[1],n=+t[3],a=+t[5],s=255&(t[2]?de(s):Mt(s,0,255)),n=255&(t[4]?de(n):Mt(n,0,255)),a=255&(t[6]?de(a):Mt(a,0,255)),{r:s,g:n,b:a,a:e}}}function Po(i){return i&&(i.a<255?`rgba(${i.r}, ${i.g}, ${i.b}, ${wt(i.a)})`:`rgb(${i.r}, ${i.g}, ${i.b})`)}const xi=i=>i<=.0031308?i*12.92:Math.pow(i,1/2.4)*1.055-.055,Jt=i=>i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4);function Io(i,t,e){const s=Jt(wt(i.r)),n=Jt(wt(i.g)),a=Jt(wt(i.b));return{r:At(xi(s+e*(Jt(wt(t.r))-s))),g:At(xi(n+e*(Jt(wt(t.g))-n))),b:At(xi(a+e*(Jt(wt(t.b))-a))),a:i.a+e*(t.a-i.a)}}function Be(i,t,e){if(i){let s=Yi(i);s[t]=Math.max(0,Math.min(s[t]+s[t]*e,t===0?360:1)),s=Gi(s),i.r=s[0],i.g=s[1],i.b=s[2]}}function ra(i,t){return i&&Object.assign(t||{},i)}function Os(i){var t={r:0,g:0,b:0,a:255};return Array.isArray(i)?i.length>=3&&(t={r:i[0],g:i[1],b:i[2],a:255},i.length>3&&(t.a=At(i[3]))):(t=ra(i,{r:0,g:0,b:0,a:1}),t.a=At(t.a)),t}function Co(i){return i.charAt(0)==="r"?Ao(i):So(i)}class we{constructor(t){if(t instanceof we)return t;const e=typeof t;let s;e==="object"?s=Os(t):e==="string"&&(s=go(t)||To(t)||Co(t)),this._rgb=s,this._valid=!!s}get valid(){return this._valid}get rgb(){var t=ra(this._rgb);return t&&(t.a=wt(t.a)),t}set rgb(t){this._rgb=Os(t)}rgbString(){return this._valid?Po(this._rgb):void 0}hexString(){return this._valid?xo(this._rgb):void 0}hslString(){return this._valid?Eo(this._rgb):void 0}mix(t,e){if(t){const s=this.rgb,n=t.rgb;let a;const o=e===a?.5:e,r=2*o-1,l=s.a-n.a,c=((r*l===-1?r:(r+l)/(1+r*l))+1)/2;a=1-c,s.r=255&c*s.r+a*n.r+.5,s.g=255&c*s.g+a*n.g+.5,s.b=255&c*s.b+a*n.b+.5,s.a=o*s.a+(1-o)*n.a,this.rgb=s}return this}interpolate(t,e){return t&&(this._rgb=Io(this._rgb,t._rgb,e)),this}clone(){return new we(this.rgb)}alpha(t){return this._rgb.a=At(t),this}clearer(t){const e=this._rgb;return e.a*=1-t,this}greyscale(){const t=this._rgb,e=De(t.r*.3+t.g*.59+t.b*.11);return t.r=t.g=t.b=e,this}opaquer(t){const e=this._rgb;return e.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return Be(this._rgb,2,t),this}darken(t){return Be(this._rgb,2,-t),this}saturate(t){return Be(this._rgb,1,t),this}desaturate(t){return Be(this._rgb,1,-t),this}rotate(t){return Mo(this._rgb,t),this}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */function xt(){}const Bo=(()=>{let i=0;return()=>i++})();function I(i){return i==null}function $(i){if(Array.isArray&&Array.isArray(i))return!0;const t=Object.prototype.toString.call(i);return t.slice(0,7)==="[object"&&t.slice(-6)==="Array]"}function C(i){return i!==null&&Object.prototype.toString.call(i)==="[object Object]"}function W(i){return(typeof i=="number"||i instanceof Number)&&isFinite(+i)}function nt(i,t){return W(i)?i:t}function A(i,t){return typeof i>"u"?t:i}const Ro=(i,t)=>typeof i=="string"&&i.endsWith("%")?parseFloat(i)/100:+i/t,la=(i,t)=>typeof i=="string"&&i.endsWith("%")?parseFloat(i)/100*t:+i;function N(i,t,e){if(i&&typeof i.call=="function")return i.apply(e,t)}function F(i,t,e,s){let n,a,o;if($(i))for(a=i.length,n=0;n<a;n++)t.call(e,i[n],n);else if(C(i))for(o=Object.keys(i),a=o.length,n=0;n<a;n++)t.call(e,i[o[n]],o[n])}function ii(i,t){let e,s,n,a;if(!i||!t||i.length!==t.length)return!1;for(e=0,s=i.length;e<s;++e)if(n=i[e],a=t[e],n.datasetIndex!==a.datasetIndex||n.index!==a.index)return!1;return!0}function si(i){if($(i))return i.map(si);if(C(i)){const t=Object.create(null),e=Object.keys(i),s=e.length;let n=0;for(;n<s;++n)t[e[n]]=si(i[e[n]]);return t}return i}function ca(i){return["__proto__","prototype","constructor"].indexOf(i)===-1}function Oo(i,t,e,s){if(!ca(i))return;const n=t[i],a=e[i];C(n)&&C(a)?ke(n,a,s):t[i]=si(a)}function ke(i,t,e){const s=$(t)?t:[t],n=s.length;if(!C(i))return i;e=e||{};const a=e.merger||Oo;let o;for(let r=0;r<n;++r){if(o=s[r],!C(o))continue;const l=Object.keys(o);for(let c=0,d=l.length;c<d;++c)a(l[c],i,o,e)}return i}function me(i,t){return ke(i,t,{merger:Fo})}function Fo(i,t,e){if(!ca(i))return;const s=t[i],n=e[i];C(s)&&C(n)?me(s,n):Object.prototype.hasOwnProperty.call(t,i)||(t[i]=si(n))}const Fs={"":i=>i,x:i=>i.x,y:i=>i.y};function jo(i){const t=i.split("."),e=[];let s="";for(const n of t)s+=n,s.endsWith("\\")?s=s.slice(0,-1)+".":(e.push(s),s="");return e}function No(i){const t=jo(i);return e=>{for(const s of t){if(s==="")break;e=e&&e[s]}return e}}function Pt(i,t){return(Fs[t]||(Fs[t]=No(t)))(i)}function Ki(i){return i.charAt(0).toUpperCase()+i.slice(1)}const _e=i=>typeof i<"u",It=i=>typeof i=="function",js=(i,t)=>{if(i.size!==t.size)return!1;for(const e of i)if(!t.has(e))return!1;return!0};function Ho(i){return i.type==="mouseup"||i.type==="click"||i.type==="contextmenu"}const R=Math.PI,H=2*R,$o=H+R,ni=Number.POSITIVE_INFINITY,zo=R/180,Y=R/2,Ot=R/4,Ns=R*2/3,Et=Math.log10,ft=Math.sign;function xe(i,t,e){return Math.abs(i-t)<e}function Hs(i){const t=Math.round(i);i=xe(i,t,i/1e3)?t:i;const e=Math.pow(10,Math.floor(Et(i))),s=i/e;return(s<=1?1:s<=2?2:s<=5?5:10)*e}function Vo(i){const t=[],e=Math.sqrt(i);let s;for(s=1;s<e;s++)i%s===0&&(t.push(s),t.push(i/s));return e===(e|0)&&t.push(e),t.sort((n,a)=>n-a).pop(),t}function Wo(i){return typeof i=="symbol"||typeof i=="object"&&i!==null&&!(Symbol.toPrimitive in i||"toString"in i||"valueOf"in i)}function te(i){return!Wo(i)&&!isNaN(parseFloat(i))&&isFinite(i)}function Uo(i,t){const e=Math.round(i);return e-t<=i&&e+t>=i}function da(i,t,e){let s,n,a;for(s=0,n=i.length;s<n;s++)a=i[s][e],isNaN(a)||(t.min=Math.min(t.min,a),t.max=Math.max(t.max,a))}function lt(i){return i*(R/180)}function Ji(i){return i*(180/R)}function $s(i){if(!W(i))return;let t=1,e=0;for(;Math.round(i*t)/t!==i;)t*=10,e++;return e}function ua(i,t){const e=t.x-i.x,s=t.y-i.y,n=Math.sqrt(e*e+s*s);let a=Math.atan2(s,e);return a<-.5*R&&(a+=H),{angle:a,distance:n}}function Ii(i,t){return Math.sqrt(Math.pow(t.x-i.x,2)+Math.pow(t.y-i.y,2))}function qo(i,t){return(i-t+$o)%H-R}function Q(i){return(i%H+H)%H}function Se(i,t,e,s){const n=Q(i),a=Q(t),o=Q(e),r=Q(a-n),l=Q(o-n),c=Q(n-a),d=Q(n-o);return n===a||n===o||s&&a===o||r>l&&c<d}function G(i,t,e){return Math.max(t,Math.min(e,i))}function Yo(i){return G(i,-32768,32767)}function kt(i,t,e,s=1e-6){return i>=Math.min(t,e)-s&&i<=Math.max(t,e)+s}function Qi(i,t,e){e=e||(o=>i[o]<t);let s=i.length-1,n=0,a;for(;s-n>1;)a=n+s>>1,e(a)?n=a:s=a;return{lo:n,hi:s}}const _t=(i,t,e,s)=>Qi(i,e,s?n=>{const a=i[n][t];return a<e||a===e&&i[n+1][t]===e}:n=>i[n][t]<e),Xo=(i,t,e)=>Qi(i,e,s=>i[s][t]>=e);function Go(i,t,e){let s=0,n=i.length;for(;s<n&&i[s]<t;)s++;for(;n>s&&i[n-1]>e;)n--;return s>0||n<i.length?i.slice(s,n):i}const ha=["push","pop","shift","splice","unshift"];function Ko(i,t){if(i._chartjs){i._chartjs.listeners.push(t);return}Object.defineProperty(i,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[t]}}),ha.forEach(e=>{const s="_onData"+Ki(e),n=i[e];Object.defineProperty(i,e,{configurable:!0,enumerable:!1,value(...a){const o=n.apply(this,a);return i._chartjs.listeners.forEach(r=>{typeof r[s]=="function"&&r[s](...a)}),o}})})}function zs(i,t){const e=i._chartjs;if(!e)return;const s=e.listeners,n=s.indexOf(t);n!==-1&&s.splice(n,1),!(s.length>0)&&(ha.forEach(a=>{delete i[a]}),delete i._chartjs)}function pa(i){const t=new Set(i);return t.size===i.length?i:Array.from(t)}const fa=function(){return typeof window>"u"?function(i){return i()}:window.requestAnimationFrame}();function ga(i,t){let e=[],s=!1;return function(...n){e=n,s||(s=!0,fa.call(window,()=>{s=!1,i.apply(t,e)}))}}function Jo(i,t){let e;return function(...s){return t?(clearTimeout(e),e=setTimeout(i,t,s)):i.apply(this,s),t}}const Zi=i=>i==="start"?"left":i==="end"?"right":"center",J=(i,t,e)=>i==="start"?t:i==="end"?e:(t+e)/2,Qo=(i,t,e,s)=>i===(s?"left":"right")?e:i==="center"?(t+e)/2:t;function ma(i,t,e){const s=t.length;let n=0,a=s;if(i._sorted){const{iScale:o,vScale:r,_parsed:l}=i,c=i.dataset&&i.dataset.options?i.dataset.options.spanGaps:null,d=o.axis,{min:u,max:h,minDefined:p,maxDefined:m}=o.getUserBounds();if(p){if(n=Math.min(_t(l,d,u).lo,e?s:_t(t,d,o.getPixelForValue(u)).lo),c){const f=l.slice(0,n+1).reverse().findIndex(g=>!I(g[r.axis]));n-=Math.max(0,f)}n=G(n,0,s-1)}if(m){let f=Math.max(_t(l,o.axis,h,!0).hi+1,e?0:_t(t,d,o.getPixelForValue(h),!0).hi+1);if(c){const g=l.slice(f-1).findIndex(x=>!I(x[r.axis]));f+=Math.max(0,g)}a=G(f,n,s)-n}else a=s-n}return{start:n,count:a}}function xa(i){const{xScale:t,yScale:e,_scaleRanges:s}=i,n={xmin:t.min,xmax:t.max,ymin:e.min,ymax:e.max};if(!s)return i._scaleRanges=n,!0;const a=s.xmin!==t.min||s.xmax!==t.max||s.ymin!==e.min||s.ymax!==e.max;return Object.assign(s,n),a}const Re=i=>i===0||i===1,Vs=(i,t,e)=>-(Math.pow(2,10*(i-=1))*Math.sin((i-t)*H/e)),Ws=(i,t,e)=>Math.pow(2,-10*i)*Math.sin((i-t)*H/e)+1,be={linear:i=>i,easeInQuad:i=>i*i,easeOutQuad:i=>-i*(i-2),easeInOutQuad:i=>(i/=.5)<1?.5*i*i:-.5*(--i*(i-2)-1),easeInCubic:i=>i*i*i,easeOutCubic:i=>(i-=1)*i*i+1,easeInOutCubic:i=>(i/=.5)<1?.5*i*i*i:.5*((i-=2)*i*i+2),easeInQuart:i=>i*i*i*i,easeOutQuart:i=>-((i-=1)*i*i*i-1),easeInOutQuart:i=>(i/=.5)<1?.5*i*i*i*i:-.5*((i-=2)*i*i*i-2),easeInQuint:i=>i*i*i*i*i,easeOutQuint:i=>(i-=1)*i*i*i*i+1,easeInOutQuint:i=>(i/=.5)<1?.5*i*i*i*i*i:.5*((i-=2)*i*i*i*i+2),easeInSine:i=>-Math.cos(i*Y)+1,easeOutSine:i=>Math.sin(i*Y),easeInOutSine:i=>-.5*(Math.cos(R*i)-1),easeInExpo:i=>i===0?0:Math.pow(2,10*(i-1)),easeOutExpo:i=>i===1?1:-Math.pow(2,-10*i)+1,easeInOutExpo:i=>Re(i)?i:i<.5?.5*Math.pow(2,10*(i*2-1)):.5*(-Math.pow(2,-10*(i*2-1))+2),easeInCirc:i=>i>=1?i:-(Math.sqrt(1-i*i)-1),easeOutCirc:i=>Math.sqrt(1-(i-=1)*i),easeInOutCirc:i=>(i/=.5)<1?-.5*(Math.sqrt(1-i*i)-1):.5*(Math.sqrt(1-(i-=2)*i)+1),easeInElastic:i=>Re(i)?i:Vs(i,.075,.3),easeOutElastic:i=>Re(i)?i:Ws(i,.075,.3),easeInOutElastic(i){return Re(i)?i:i<.5?.5*Vs(i*2,.1125,.45):.5+.5*Ws(i*2-1,.1125,.45)},easeInBack(i){return i*i*((1.70158+1)*i-1.70158)},easeOutBack(i){return(i-=1)*i*((1.70158+1)*i+1.70158)+1},easeInOutBack(i){let t=1.70158;return(i/=.5)<1?.5*(i*i*(((t*=1.525)+1)*i-t)):.5*((i-=2)*i*(((t*=1.525)+1)*i+t)+2)},easeInBounce:i=>1-be.easeOutBounce(1-i),easeOutBounce(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375},easeInOutBounce:i=>i<.5?be.easeInBounce(i*2)*.5:be.easeOutBounce(i*2-1)*.5+.5};function ts(i){if(i&&typeof i=="object"){const t=i.toString();return t==="[object CanvasPattern]"||t==="[object CanvasGradient]"}return!1}function Us(i){return ts(i)?i:new we(i)}function bi(i){return ts(i)?i:new we(i).saturate(.5).darken(.1).hexString()}const Zo=["x","y","borderWidth","radius","tension"],tr=["color","borderColor","backgroundColor"];function er(i){i.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),i.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>t!=="onProgress"&&t!=="onComplete"&&t!=="fn"}),i.set("animations",{colors:{type:"color",properties:tr},numbers:{type:"number",properties:Zo}}),i.describe("animations",{_fallback:"animation"}),i.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>t|0}}}})}function ir(i){i.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})}const qs=new Map;function sr(i,t){t=t||{};const e=i+JSON.stringify(t);let s=qs.get(e);return s||(s=new Intl.NumberFormat(i,t),qs.set(e,s)),s}function Ae(i,t,e){return sr(t,e).format(i)}const ba={values(i){return $(i)?i:""+i},numeric(i,t,e){if(i===0)return"0";const s=this.chart.options.locale;let n,a=i;if(e.length>1){const c=Math.max(Math.abs(e[0].value),Math.abs(e[e.length-1].value));(c<1e-4||c>1e15)&&(n="scientific"),a=nr(i,e)}const o=Et(Math.abs(a)),r=isNaN(o)?1:Math.max(Math.min(-1*Math.floor(o),20),0),l={notation:n,minimumFractionDigits:r,maximumFractionDigits:r};return Object.assign(l,this.options.ticks.format),Ae(i,s,l)},logarithmic(i,t,e){if(i===0)return"0";const s=e[t].significand||i/Math.pow(10,Math.floor(Et(i)));return[1,2,3,5,10,15].includes(s)||t>.8*e.length?ba.numeric.call(this,i,t,e):""}};function nr(i,t){let e=t.length>3?t[2].value-t[1].value:t[1].value-t[0].value;return Math.abs(e)>=1&&i!==Math.floor(i)&&(e=i-Math.floor(i)),e}var di={formatters:ba};function ar(i){i.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:di.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),i.route("scale.ticks","color","","color"),i.route("scale.grid","color","","borderColor"),i.route("scale.border","color","","borderColor"),i.route("scale.title","color","","color"),i.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&t!=="callback"&&t!=="parser",_indexable:t=>t!=="borderDash"&&t!=="tickBorderDash"&&t!=="dash"}),i.describe("scales",{_fallback:"scale"}),i.describe("scale.ticks",{_scriptable:t=>t!=="backdropPadding"&&t!=="callback",_indexable:t=>t!=="backdropPadding"})}const qt=Object.create(null),Ci=Object.create(null);function ye(i,t){if(!t)return i;const e=t.split(".");for(let s=0,n=e.length;s<n;++s){const a=e[s];i=i[a]||(i[a]=Object.create(null))}return i}function yi(i,t,e){return typeof t=="string"?ke(ye(i,t),e):ke(ye(i,""),t)}class or{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=s=>s.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(s,n)=>bi(n.backgroundColor),this.hoverBorderColor=(s,n)=>bi(n.borderColor),this.hoverColor=(s,n)=>bi(n.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return yi(this,t,e)}get(t){return ye(this,t)}describe(t,e){return yi(Ci,t,e)}override(t,e){return yi(qt,t,e)}route(t,e,s,n){const a=ye(this,t),o=ye(this,s),r="_"+e;Object.defineProperties(a,{[r]:{value:a[e],writable:!0},[e]:{enumerable:!0,get(){const l=this[r],c=o[n];return C(l)?Object.assign({},c,l):A(l,c)},set(l){this[r]=l}}})}apply(t){t.forEach(e=>e(this))}}var z=new or({_scriptable:i=>!i.startsWith("on"),_indexable:i=>i!=="events",hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[er,ir,ar]);function rr(i){return!i||I(i.size)||I(i.family)?null:(i.style?i.style+" ":"")+(i.weight?i.weight+" ":"")+i.size+"px "+i.family}function ai(i,t,e,s,n){let a=t[n];return a||(a=t[n]=i.measureText(n).width,e.push(n)),a>s&&(s=a),s}function lr(i,t,e,s){s=s||{};let n=s.data=s.data||{},a=s.garbageCollect=s.garbageCollect||[];s.font!==t&&(n=s.data={},a=s.garbageCollect=[],s.font=t),i.save(),i.font=t;let o=0;const r=e.length;let l,c,d,u,h;for(l=0;l<r;l++)if(u=e[l],u!=null&&!$(u))o=ai(i,n,a,o,u);else if($(u))for(c=0,d=u.length;c<d;c++)h=u[c],h!=null&&!$(h)&&(o=ai(i,n,a,o,h));i.restore();const p=a.length/2;if(p>e.length){for(l=0;l<p;l++)delete n[a[l]];a.splice(0,p)}return o}function Ft(i,t,e){const s=i.currentDevicePixelRatio,n=e!==0?Math.max(e/2,.5):0;return Math.round((t-n)*s)/s+n}function Ys(i,t){!t&&!i||(t=t||i.getContext("2d"),t.save(),t.resetTransform(),t.clearRect(0,0,i.width,i.height),t.restore())}function Bi(i,t,e,s){ya(i,t,e,s,null)}function ya(i,t,e,s,n){let a,o,r,l,c,d,u,h;const p=t.pointStyle,m=t.rotation,f=t.radius;let g=(m||0)*zo;if(p&&typeof p=="object"&&(a=p.toString(),a==="[object HTMLImageElement]"||a==="[object HTMLCanvasElement]")){i.save(),i.translate(e,s),i.rotate(g),i.drawImage(p,-p.width/2,-p.height/2,p.width,p.height),i.restore();return}if(!(isNaN(f)||f<=0)){switch(i.beginPath(),p){default:n?i.ellipse(e,s,n/2,f,0,0,H):i.arc(e,s,f,0,H),i.closePath();break;case"triangle":d=n?n/2:f,i.moveTo(e+Math.sin(g)*d,s-Math.cos(g)*f),g+=Ns,i.lineTo(e+Math.sin(g)*d,s-Math.cos(g)*f),g+=Ns,i.lineTo(e+Math.sin(g)*d,s-Math.cos(g)*f),i.closePath();break;case"rectRounded":c=f*.516,l=f-c,o=Math.cos(g+Ot)*l,u=Math.cos(g+Ot)*(n?n/2-c:l),r=Math.sin(g+Ot)*l,h=Math.sin(g+Ot)*(n?n/2-c:l),i.arc(e-u,s-r,c,g-R,g-Y),i.arc(e+h,s-o,c,g-Y,g),i.arc(e+u,s+r,c,g,g+Y),i.arc(e-h,s+o,c,g+Y,g+R),i.closePath();break;case"rect":if(!m){l=Math.SQRT1_2*f,d=n?n/2:l,i.rect(e-d,s-l,2*d,2*l);break}g+=Ot;case"rectRot":u=Math.cos(g)*(n?n/2:f),o=Math.cos(g)*f,r=Math.sin(g)*f,h=Math.sin(g)*(n?n/2:f),i.moveTo(e-u,s-r),i.lineTo(e+h,s-o),i.lineTo(e+u,s+r),i.lineTo(e-h,s+o),i.closePath();break;case"crossRot":g+=Ot;case"cross":u=Math.cos(g)*(n?n/2:f),o=Math.cos(g)*f,r=Math.sin(g)*f,h=Math.sin(g)*(n?n/2:f),i.moveTo(e-u,s-r),i.lineTo(e+u,s+r),i.moveTo(e+h,s-o),i.lineTo(e-h,s+o);break;case"star":u=Math.cos(g)*(n?n/2:f),o=Math.cos(g)*f,r=Math.sin(g)*f,h=Math.sin(g)*(n?n/2:f),i.moveTo(e-u,s-r),i.lineTo(e+u,s+r),i.moveTo(e+h,s-o),i.lineTo(e-h,s+o),g+=Ot,u=Math.cos(g)*(n?n/2:f),o=Math.cos(g)*f,r=Math.sin(g)*f,h=Math.sin(g)*(n?n/2:f),i.moveTo(e-u,s-r),i.lineTo(e+u,s+r),i.moveTo(e+h,s-o),i.lineTo(e-h,s+o);break;case"line":o=n?n/2:Math.cos(g)*f,r=Math.sin(g)*f,i.moveTo(e-o,s-r),i.lineTo(e+o,s+r);break;case"dash":i.moveTo(e,s),i.lineTo(e+Math.cos(g)*(n?n/2:f),s+Math.sin(g)*f);break;case!1:i.closePath();break}i.fill(),t.borderWidth>0&&i.stroke()}}function St(i,t,e){return e=e||.5,!t||i&&i.x>t.left-e&&i.x<t.right+e&&i.y>t.top-e&&i.y<t.bottom+e}function ui(i,t){i.save(),i.beginPath(),i.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),i.clip()}function hi(i){i.restore()}function cr(i,t,e,s,n){if(!t)return i.lineTo(e.x,e.y);if(n==="middle"){const a=(t.x+e.x)/2;i.lineTo(a,t.y),i.lineTo(a,e.y)}else n==="after"!=!!s?i.lineTo(t.x,e.y):i.lineTo(e.x,t.y);i.lineTo(e.x,e.y)}function dr(i,t,e,s){if(!t)return i.lineTo(e.x,e.y);i.bezierCurveTo(s?t.cp1x:t.cp2x,s?t.cp1y:t.cp2y,s?e.cp2x:e.cp1x,s?e.cp2y:e.cp1y,e.x,e.y)}function ur(i,t){t.translation&&i.translate(t.translation[0],t.translation[1]),I(t.rotation)||i.rotate(t.rotation),t.color&&(i.fillStyle=t.color),t.textAlign&&(i.textAlign=t.textAlign),t.textBaseline&&(i.textBaseline=t.textBaseline)}function hr(i,t,e,s,n){if(n.strikethrough||n.underline){const a=i.measureText(s),o=t-a.actualBoundingBoxLeft,r=t+a.actualBoundingBoxRight,l=e-a.actualBoundingBoxAscent,c=e+a.actualBoundingBoxDescent,d=n.strikethrough?(l+c)/2:c;i.strokeStyle=i.fillStyle,i.beginPath(),i.lineWidth=n.decorationWidth||2,i.moveTo(o,d),i.lineTo(r,d),i.stroke()}}function pr(i,t){const e=i.fillStyle;i.fillStyle=t.color,i.fillRect(t.left,t.top,t.width,t.height),i.fillStyle=e}function Yt(i,t,e,s,n,a={}){const o=$(t)?t:[t],r=a.strokeWidth>0&&a.strokeColor!=="";let l,c;for(i.save(),i.font=n.string,ur(i,a),l=0;l<o.length;++l)c=o[l],a.backdrop&&pr(i,a.backdrop),r&&(a.strokeColor&&(i.strokeStyle=a.strokeColor),I(a.strokeWidth)||(i.lineWidth=a.strokeWidth),i.strokeText(c,e,s,a.maxWidth)),i.fillText(c,e,s,a.maxWidth),hr(i,e,s,c,a),s+=Number(n.lineHeight);i.restore()}function Me(i,t){const{x:e,y:s,w:n,h:a,radius:o}=t;i.arc(e+o.topLeft,s+o.topLeft,o.topLeft,1.5*R,R,!0),i.lineTo(e,s+a-o.bottomLeft),i.arc(e+o.bottomLeft,s+a-o.bottomLeft,o.bottomLeft,R,Y,!0),i.lineTo(e+n-o.bottomRight,s+a),i.arc(e+n-o.bottomRight,s+a-o.bottomRight,o.bottomRight,Y,0,!0),i.lineTo(e+n,s+o.topRight),i.arc(e+n-o.topRight,s+o.topRight,o.topRight,0,-Y,!0),i.lineTo(e+o.topLeft,s)}const fr=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,gr=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function mr(i,t){const e=(""+i).match(fr);if(!e||e[1]==="normal")return t*1.2;switch(i=+e[2],e[3]){case"px":return i;case"%":i/=100;break}return t*i}const xr=i=>+i||0;function es(i,t){const e={},s=C(t),n=s?Object.keys(t):t,a=C(i)?s?o=>A(i[o],i[t[o]]):o=>i[o]:()=>i;for(const o of n)e[o]=xr(a(o));return e}function va(i){return es(i,{top:"y",right:"x",bottom:"y",left:"x"})}function Wt(i){return es(i,["topLeft","topRight","bottomLeft","bottomRight"])}function tt(i){const t=va(i);return t.width=t.left+t.right,t.height=t.top+t.bottom,t}function X(i,t){i=i||{},t=t||z.font;let e=A(i.size,t.size);typeof e=="string"&&(e=parseInt(e,10));let s=A(i.style,t.style);s&&!(""+s).match(gr)&&(console.warn('Invalid font style specified: "'+s+'"'),s=void 0);const n={family:A(i.family,t.family),lineHeight:mr(A(i.lineHeight,t.lineHeight),e),size:e,style:s,weight:A(i.weight,t.weight),string:""};return n.string=rr(n),n}function ue(i,t,e,s){let n,a,o;for(n=0,a=i.length;n<a;++n)if(o=i[n],o!==void 0&&o!==void 0)return o}function br(i,t,e){const{min:s,max:n}=i,a=la(t,(n-s)/2),o=(r,l)=>e&&r===0?0:r+l;return{min:o(s,-Math.abs(a)),max:o(n,a)}}function Ct(i,t){return Object.assign(Object.create(i),t)}function is(i,t=[""],e,s,n=()=>i[0]){const a=e||i;typeof s>"u"&&(s=Sa("_fallback",i));const o={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:i,_rootScopes:a,_fallback:s,_getTarget:n,override:r=>is([r,...i],t,a,s)};return new Proxy(o,{deleteProperty(r,l){return delete r[l],delete r._keys,delete i[0][l],!0},get(r,l){return ka(r,l,()=>Er(l,t,i,r))},getOwnPropertyDescriptor(r,l){return Reflect.getOwnPropertyDescriptor(r._scopes[0],l)},getPrototypeOf(){return Reflect.getPrototypeOf(i[0])},has(r,l){return Gs(r).includes(l)},ownKeys(r){return Gs(r)},set(r,l,c){const d=r._storage||(r._storage=n());return r[l]=d[l]=c,delete r._keys,!0}})}function ee(i,t,e,s){const n={_cacheable:!1,_proxy:i,_context:t,_subProxy:e,_stack:new Set,_descriptors:wa(i,s),setContext:a=>ee(i,a,e,s),override:a=>ee(i.override(a),t,e,s)};return new Proxy(n,{deleteProperty(a,o){return delete a[o],delete i[o],!0},get(a,o,r){return ka(a,o,()=>vr(a,o,r))},getOwnPropertyDescriptor(a,o){return a._descriptors.allKeys?Reflect.has(i,o)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(i,o)},getPrototypeOf(){return Reflect.getPrototypeOf(i)},has(a,o){return Reflect.has(i,o)},ownKeys(){return Reflect.ownKeys(i)},set(a,o,r){return i[o]=r,delete a[o],!0}})}function wa(i,t={scriptable:!0,indexable:!0}){const{_scriptable:e=t.scriptable,_indexable:s=t.indexable,_allKeys:n=t.allKeys}=i;return{allKeys:n,scriptable:e,indexable:s,isScriptable:It(e)?e:()=>e,isIndexable:It(s)?s:()=>s}}const yr=(i,t)=>i?i+Ki(t):t,ss=(i,t)=>C(t)&&i!=="adapters"&&(Object.getPrototypeOf(t)===null||t.constructor===Object);function ka(i,t,e){if(Object.prototype.hasOwnProperty.call(i,t)||t==="constructor")return i[t];const s=e();return i[t]=s,s}function vr(i,t,e){const{_proxy:s,_context:n,_subProxy:a,_descriptors:o}=i;let r=s[t];return It(r)&&o.isScriptable(t)&&(r=wr(t,r,i,e)),$(r)&&r.length&&(r=kr(t,r,i,o.isIndexable)),ss(t,r)&&(r=ee(r,n,a&&a[t],o)),r}function wr(i,t,e,s){const{_proxy:n,_context:a,_subProxy:o,_stack:r}=e;if(r.has(i))throw new Error("Recursion detected: "+Array.from(r).join("->")+"->"+i);r.add(i);let l=t(a,o||s);return r.delete(i),ss(i,l)&&(l=ns(n._scopes,n,i,l)),l}function kr(i,t,e,s){const{_proxy:n,_context:a,_subProxy:o,_descriptors:r}=e;if(typeof a.index<"u"&&s(i))return t[a.index%t.length];if(C(t[0])){const l=t,c=n._scopes.filter(d=>d!==l);t=[];for(const d of l){const u=ns(c,n,i,d);t.push(ee(u,a,o&&o[i],r))}}return t}function _a(i,t,e){return It(i)?i(t,e):i}const _r=(i,t)=>i===!0?t:typeof i=="string"?Pt(t,i):void 0;function Sr(i,t,e,s,n){for(const a of t){const o=_r(e,a);if(o){i.add(o);const r=_a(o._fallback,e,n);if(typeof r<"u"&&r!==e&&r!==s)return r}else if(o===!1&&typeof s<"u"&&e!==s)return null}return!1}function ns(i,t,e,s){const n=t._rootScopes,a=_a(t._fallback,e,s),o=[...i,...n],r=new Set;r.add(s);let l=Xs(r,o,e,a||e,s);return l===null||typeof a<"u"&&a!==e&&(l=Xs(r,o,a,l,s),l===null)?!1:is(Array.from(r),[""],n,a,()=>Mr(t,e,s))}function Xs(i,t,e,s,n){for(;e;)e=Sr(i,t,e,s,n);return e}function Mr(i,t,e){const s=i._getTarget();t in s||(s[t]={});const n=s[t];return $(n)&&C(e)?e:n||{}}function Er(i,t,e,s){let n;for(const a of t)if(n=Sa(yr(a,i),e),typeof n<"u")return ss(i,n)?ns(e,s,i,n):n}function Sa(i,t){for(const e of t){if(!e)continue;const s=e[i];if(typeof s<"u")return s}}function Gs(i){let t=i._keys;return t||(t=i._keys=Lr(i._scopes)),t}function Lr(i){const t=new Set;for(const e of i)for(const s of Object.keys(e).filter(n=>!n.startsWith("_")))t.add(s);return Array.from(t)}function Ma(i,t,e,s){const{iScale:n}=i,{key:a="r"}=this._parsing,o=new Array(s);let r,l,c,d;for(r=0,l=s;r<l;++r)c=r+e,d=t[c],o[r]={r:n.parse(Pt(d,a),c)};return o}const Tr=Number.EPSILON||1e-14,ie=(i,t)=>t<i.length&&!i[t].skip&&i[t],Ea=i=>i==="x"?"y":"x";function Dr(i,t,e,s){const n=i.skip?t:i,a=t,o=e.skip?t:e,r=Ii(a,n),l=Ii(o,a);let c=r/(r+l),d=l/(r+l);c=isNaN(c)?0:c,d=isNaN(d)?0:d;const u=s*c,h=s*d;return{previous:{x:a.x-u*(o.x-n.x),y:a.y-u*(o.y-n.y)},next:{x:a.x+h*(o.x-n.x),y:a.y+h*(o.y-n.y)}}}function Ar(i,t,e){const s=i.length;let n,a,o,r,l,c=ie(i,0);for(let d=0;d<s-1;++d)if(l=c,c=ie(i,d+1),!(!l||!c)){if(xe(t[d],0,Tr)){e[d]=e[d+1]=0;continue}n=e[d]/t[d],a=e[d+1]/t[d],r=Math.pow(n,2)+Math.pow(a,2),!(r<=9)&&(o=3/Math.sqrt(r),e[d]=n*o*t[d],e[d+1]=a*o*t[d])}}function Pr(i,t,e="x"){const s=Ea(e),n=i.length;let a,o,r,l=ie(i,0);for(let c=0;c<n;++c){if(o=r,r=l,l=ie(i,c+1),!r)continue;const d=r[e],u=r[s];o&&(a=(d-o[e])/3,r[`cp1${e}`]=d-a,r[`cp1${s}`]=u-a*t[c]),l&&(a=(l[e]-d)/3,r[`cp2${e}`]=d+a,r[`cp2${s}`]=u+a*t[c])}}function Ir(i,t="x"){const e=Ea(t),s=i.length,n=Array(s).fill(0),a=Array(s);let o,r,l,c=ie(i,0);for(o=0;o<s;++o)if(r=l,l=c,c=ie(i,o+1),!!l){if(c){const d=c[t]-l[t];n[o]=d!==0?(c[e]-l[e])/d:0}a[o]=r?c?ft(n[o-1])!==ft(n[o])?0:(n[o-1]+n[o])/2:n[o-1]:n[o]}Ar(i,n,a),Pr(i,a,t)}function Oe(i,t,e){return Math.max(Math.min(i,e),t)}function Cr(i,t){let e,s,n,a,o,r=St(i[0],t);for(e=0,s=i.length;e<s;++e)o=a,a=r,r=e<s-1&&St(i[e+1],t),a&&(n=i[e],o&&(n.cp1x=Oe(n.cp1x,t.left,t.right),n.cp1y=Oe(n.cp1y,t.top,t.bottom)),r&&(n.cp2x=Oe(n.cp2x,t.left,t.right),n.cp2y=Oe(n.cp2y,t.top,t.bottom)))}function Br(i,t,e,s,n){let a,o,r,l;if(t.spanGaps&&(i=i.filter(c=>!c.skip)),t.cubicInterpolationMode==="monotone")Ir(i,n);else{let c=s?i[i.length-1]:i[0];for(a=0,o=i.length;a<o;++a)r=i[a],l=Dr(c,r,i[Math.min(a+1,o-(s?0:1))%o],t.tension),r.cp1x=l.previous.x,r.cp1y=l.previous.y,r.cp2x=l.next.x,r.cp2y=l.next.y,c=r}t.capBezierPoints&&Cr(i,e)}function as(){return typeof window<"u"&&typeof document<"u"}function os(i){let t=i.parentNode;return t&&t.toString()==="[object ShadowRoot]"&&(t=t.host),t}function oi(i,t,e){let s;return typeof i=="string"?(s=parseInt(i,10),i.indexOf("%")!==-1&&(s=s/100*t.parentNode[e])):s=i,s}const pi=i=>i.ownerDocument.defaultView.getComputedStyle(i,null);function Rr(i,t){return pi(i).getPropertyValue(t)}const Or=["top","right","bottom","left"];function Ut(i,t,e){const s={};e=e?"-"+e:"";for(let n=0;n<4;n++){const a=Or[n];s[a]=parseFloat(i[t+"-"+a+e])||0}return s.width=s.left+s.right,s.height=s.top+s.bottom,s}const Fr=(i,t,e)=>(i>0||t>0)&&(!e||!e.shadowRoot);function jr(i,t){const e=i.touches,s=e&&e.length?e[0]:i,{offsetX:n,offsetY:a}=s;let o=!1,r,l;if(Fr(n,a,i.target))r=n,l=a;else{const c=t.getBoundingClientRect();r=s.clientX-c.left,l=s.clientY-c.top,o=!0}return{x:r,y:l,box:o}}function Ht(i,t){if("native"in i)return i;const{canvas:e,currentDevicePixelRatio:s}=t,n=pi(e),a=n.boxSizing==="border-box",o=Ut(n,"padding"),r=Ut(n,"border","width"),{x:l,y:c,box:d}=jr(i,e),u=o.left+(d&&r.left),h=o.top+(d&&r.top);let{width:p,height:m}=t;return a&&(p-=o.width+r.width,m-=o.height+r.height),{x:Math.round((l-u)/p*e.width/s),y:Math.round((c-h)/m*e.height/s)}}function Nr(i,t,e){let s,n;if(t===void 0||e===void 0){const a=i&&os(i);if(!a)t=i.clientWidth,e=i.clientHeight;else{const o=a.getBoundingClientRect(),r=pi(a),l=Ut(r,"border","width"),c=Ut(r,"padding");t=o.width-c.width-l.width,e=o.height-c.height-l.height,s=oi(r.maxWidth,a,"clientWidth"),n=oi(r.maxHeight,a,"clientHeight")}}return{width:t,height:e,maxWidth:s||ni,maxHeight:n||ni}}const Lt=i=>Math.round(i*10)/10;function Hr(i,t,e,s){const n=pi(i),a=Ut(n,"margin"),o=oi(n.maxWidth,i,"clientWidth")||ni,r=oi(n.maxHeight,i,"clientHeight")||ni,l=Nr(i,t,e);let{width:c,height:d}=l;if(n.boxSizing==="content-box"){const h=Ut(n,"border","width"),p=Ut(n,"padding");c-=p.width+h.width,d-=p.height+h.height}return c=Math.max(0,c-a.width),d=Math.max(0,s?c/s:d-a.height),c=Lt(Math.min(c,o,l.maxWidth)),d=Lt(Math.min(d,r,l.maxHeight)),c&&!d&&(d=Lt(c/2)),(t!==void 0||e!==void 0)&&s&&l.height&&d>l.height&&(d=l.height,c=Lt(Math.floor(d*s))),{width:c,height:d}}function Ks(i,t,e){const s=t||1,n=Lt(i.height*s),a=Lt(i.width*s);i.height=Lt(i.height),i.width=Lt(i.width);const o=i.canvas;return o.style&&(e||!o.style.height&&!o.style.width)&&(o.style.height=`${i.height}px`,o.style.width=`${i.width}px`),i.currentDevicePixelRatio!==s||o.height!==n||o.width!==a?(i.currentDevicePixelRatio=s,o.height=n,o.width=a,i.ctx.setTransform(s,0,0,s,0,0),!0):!1}const $r=function(){let i=!1;try{const t={get passive(){return i=!0,!1}};as()&&(window.addEventListener("test",null,t),window.removeEventListener("test",null,t))}catch{}return i}();function Js(i,t){const e=Rr(i,t),s=e&&e.match(/^(\d+)(\.\d+)?px$/);return s?+s[1]:void 0}function $t(i,t,e,s){return{x:i.x+e*(t.x-i.x),y:i.y+e*(t.y-i.y)}}function zr(i,t,e,s){return{x:i.x+e*(t.x-i.x),y:s==="middle"?e<.5?i.y:t.y:s==="after"?e<1?i.y:t.y:e>0?t.y:i.y}}function Vr(i,t,e,s){const n={x:i.cp2x,y:i.cp2y},a={x:t.cp1x,y:t.cp1y},o=$t(i,n,e),r=$t(n,a,e),l=$t(a,t,e),c=$t(o,r,e),d=$t(r,l,e);return $t(c,d,e)}const Wr=function(i,t){return{x(e){return i+i+t-e},setWidth(e){t=e},textAlign(e){return e==="center"?e:e==="right"?"left":"right"},xPlus(e,s){return e-s},leftForLtr(e,s){return e-s}}},Ur=function(){return{x(i){return i},setWidth(i){},textAlign(i){return i},xPlus(i,t){return i+t},leftForLtr(i,t){return i}}};function Zt(i,t,e){return i?Wr(t,e):Ur()}function La(i,t){let e,s;(t==="ltr"||t==="rtl")&&(e=i.canvas.style,s=[e.getPropertyValue("direction"),e.getPropertyPriority("direction")],e.setProperty("direction",t,"important"),i.prevTextDirection=s)}function Ta(i,t){t!==void 0&&(delete i.prevTextDirection,i.canvas.style.setProperty("direction",t[0],t[1]))}function Da(i){return i==="angle"?{between:Se,compare:qo,normalize:Q}:{between:kt,compare:(t,e)=>t-e,normalize:t=>t}}function Qs({start:i,end:t,count:e,loop:s,style:n}){return{start:i%e,end:t%e,loop:s&&(t-i+1)%e===0,style:n}}function qr(i,t,e){const{property:s,start:n,end:a}=e,{between:o,normalize:r}=Da(s),l=t.length;let{start:c,end:d,loop:u}=i,h,p;if(u){for(c+=l,d+=l,h=0,p=l;h<p&&o(r(t[c%l][s]),n,a);++h)c--,d--;c%=l,d%=l}return d<c&&(d+=l),{start:c,end:d,loop:u,style:i.style}}function Aa(i,t,e){if(!e)return[i];const{property:s,start:n,end:a}=e,o=t.length,{compare:r,between:l,normalize:c}=Da(s),{start:d,end:u,loop:h,style:p}=qr(i,t,e),m=[];let f=!1,g=null,x,b,y;const w=()=>l(n,y,x)&&r(n,y)!==0,v=()=>r(a,x)===0||l(a,y,x),k=()=>f||w(),_=()=>!f||v();for(let S=d,M=d;S<=u;++S)b=t[S%o],!b.skip&&(x=c(b[s]),x!==y&&(f=l(x,n,a),g===null&&k()&&(g=r(x,n)===0?S:M),g!==null&&_()&&(m.push(Qs({start:g,end:S,loop:h,count:o,style:p})),g=null),M=S,y=x));return g!==null&&m.push(Qs({start:g,end:u,loop:h,count:o,style:p})),m}function Pa(i,t){const e=[],s=i.segments;for(let n=0;n<s.length;n++){const a=Aa(s[n],i.points,t);a.length&&e.push(...a)}return e}function Yr(i,t,e,s){let n=0,a=t-1;if(e&&!s)for(;n<t&&!i[n].skip;)n++;for(;n<t&&i[n].skip;)n++;for(n%=t,e&&(a+=n);a>n&&i[a%t].skip;)a--;return a%=t,{start:n,end:a}}function Xr(i,t,e,s){const n=i.length,a=[];let o=t,r=i[t],l;for(l=t+1;l<=e;++l){const c=i[l%n];c.skip||c.stop?r.skip||(s=!1,a.push({start:t%n,end:(l-1)%n,loop:s}),t=o=c.stop?l:null):(o=l,r.skip&&(t=l)),r=c}return o!==null&&a.push({start:t%n,end:o%n,loop:s}),a}function Gr(i,t){const e=i.points,s=i.options.spanGaps,n=e.length;if(!n)return[];const a=!!i._loop,{start:o,end:r}=Yr(e,n,a,s);if(s===!0)return Zs(i,[{start:o,end:r,loop:a}],e,t);const l=r<o?r+n:r,c=!!i._fullLoop&&o===0&&r===n-1;return Zs(i,Xr(e,o,l,c),e,t)}function Zs(i,t,e,s){return!s||!s.setContext||!e?t:Kr(i,t,e,s)}function Kr(i,t,e,s){const n=i._chart.getContext(),a=tn(i.options),{_datasetIndex:o,options:{spanGaps:r}}=i,l=e.length,c=[];let d=a,u=t[0].start,h=u;function p(m,f,g,x){const b=r?-1:1;if(m!==f){for(m+=l;e[m%l].skip;)m-=b;for(;e[f%l].skip;)f+=b;m%l!==f%l&&(c.push({start:m%l,end:f%l,loop:g,style:x}),d=x,u=f%l)}}for(const m of t){u=r?u:m.start;let f=e[u%l],g;for(h=u+1;h<=m.end;h++){const x=e[h%l];g=tn(s.setContext(Ct(n,{type:"segment",p0:f,p1:x,p0DataIndex:(h-1)%l,p1DataIndex:h%l,datasetIndex:o}))),Jr(g,d)&&p(u,h-1,m.loop,d),f=x,d=g}u<h-1&&p(u,h-1,m.loop,d)}return c}function tn(i){return{backgroundColor:i.backgroundColor,borderCapStyle:i.borderCapStyle,borderDash:i.borderDash,borderDashOffset:i.borderDashOffset,borderJoinStyle:i.borderJoinStyle,borderWidth:i.borderWidth,borderColor:i.borderColor}}function Jr(i,t){if(!t)return!1;const e=[],s=function(n,a){return ts(a)?(e.includes(a)||e.push(a),e.indexOf(a)):a};return JSON.stringify(i,s)!==JSON.stringify(t,s)}function Fe(i,t,e){return i.options.clip?i[e]:t[e]}function Qr(i,t){const{xScale:e,yScale:s}=i;return e&&s?{left:Fe(e,t,"left"),right:Fe(e,t,"right"),top:Fe(s,t,"top"),bottom:Fe(s,t,"bottom")}:t}function Ia(i,t){const e=t._clip;if(e.disabled)return!1;const s=Qr(t,i.chartArea);return{left:e.left===!1?0:s.left-(e.left===!0?0:e.left),right:e.right===!1?i.width:s.right+(e.right===!0?0:e.right),top:e.top===!1?0:s.top-(e.top===!0?0:e.top),bottom:e.bottom===!1?i.height:s.bottom+(e.bottom===!0?0:e.bottom)}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */class Zr{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,s,n){const a=e.listeners[n],o=e.duration;a.forEach(r=>r({chart:t,initial:e.initial,numSteps:o,currentStep:Math.min(s-e.start,o)}))}_refresh(){this._request||(this._running=!0,this._request=fa.call(window,()=>{this._update(),this._request=null,this._running&&this._refresh()}))}_update(t=Date.now()){let e=0;this._charts.forEach((s,n)=>{if(!s.running||!s.items.length)return;const a=s.items;let o=a.length-1,r=!1,l;for(;o>=0;--o)l=a[o],l._active?(l._total>s.duration&&(s.duration=l._total),l.tick(t),r=!0):(a[o]=a[a.length-1],a.pop());r&&(n.draw(),this._notify(n,s,t,"progress")),a.length||(s.running=!1,this._notify(n,s,t,"complete"),s.initial=!1),e+=a.length}),this._lastDate=t,e===0&&(this._running=!1)}_getAnims(t){const e=this._charts;let s=e.get(t);return s||(s={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,s)),s}listen(t,e,s){this._getAnims(t).listeners[e].push(s)}add(t,e){!e||!e.length||this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce((s,n)=>Math.max(s,n._duration),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!(!e||!e.running||!e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const s=e.items;let n=s.length-1;for(;n>=0;--n)s[n].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var yt=new Zr;const en="transparent",tl={boolean(i,t,e){return e>.5?t:i},color(i,t,e){const s=Us(i||en),n=s.valid&&Us(t||en);return n&&n.valid?n.mix(s,e).hexString():t},number(i,t,e){return i+(t-i)*e}};class el{constructor(t,e,s,n){const a=e[s];n=ue([t.to,n,a,t.from]);const o=ue([t.from,a,n]);this._active=!0,this._fn=t.fn||tl[t.type||typeof o],this._easing=be[t.easing]||be.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=s,this._from=o,this._to=n,this._promises=void 0}active(){return this._active}update(t,e,s){if(this._active){this._notify(!1);const n=this._target[this._prop],a=s-this._start,o=this._duration-a;this._start=s,this._duration=Math.floor(Math.max(o,t.duration)),this._total+=a,this._loop=!!t.loop,this._to=ue([t.to,e,n,t.from]),this._from=ue([t.from,n,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,s=this._duration,n=this._prop,a=this._from,o=this._loop,r=this._to;let l;if(this._active=a!==r&&(o||e<s),!this._active){this._target[n]=r,this._notify(!0);return}if(e<0){this._target[n]=a;return}l=e/s%2,l=o&&l>1?2-l:l,l=this._easing(Math.min(1,Math.max(0,l))),this._target[n]=this._fn(a,r,l)}wait(){const t=this._promises||(this._promises=[]);return new Promise((e,s)=>{t.push({res:e,rej:s})})}_notify(t){const e=t?"res":"rej",s=this._promises||[];for(let n=0;n<s.length;n++)s[n][e]()}}class Ca{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!C(t))return;const e=Object.keys(z.animation),s=this._properties;Object.getOwnPropertyNames(t).forEach(n=>{const a=t[n];if(!C(a))return;const o={};for(const r of e)o[r]=a[r];($(a.properties)&&a.properties||[n]).forEach(r=>{(r===n||!s.has(r))&&s.set(r,o)})})}_animateOptions(t,e){const s=e.options,n=sl(t,s);if(!n)return[];const a=this._createAnimations(n,s);return s.$shared&&il(t.options.$animations,s).then(()=>{t.options=s},()=>{}),a}_createAnimations(t,e){const s=this._properties,n=[],a=t.$animations||(t.$animations={}),o=Object.keys(e),r=Date.now();let l;for(l=o.length-1;l>=0;--l){const c=o[l];if(c.charAt(0)==="$")continue;if(c==="options"){n.push(...this._animateOptions(t,e));continue}const d=e[c];let u=a[c];const h=s.get(c);if(u)if(h&&u.active()){u.update(h,d,r);continue}else u.cancel();if(!h||!h.duration){t[c]=d;continue}a[c]=u=new el(h,t,c,d),n.push(u)}return n}update(t,e){if(this._properties.size===0){Object.assign(t,e);return}const s=this._createAnimations(t,e);if(s.length)return yt.add(this._chart,s),!0}}function il(i,t){const e=[],s=Object.keys(t);for(let n=0;n<s.length;n++){const a=i[s[n]];a&&a.active()&&e.push(a.wait())}return Promise.all(e)}function sl(i,t){if(!t)return;let e=i.options;if(!e){i.options=t;return}return e.$shared&&(i.options=e=Object.assign({},e,{$shared:!1,$animations:{}})),e}function sn(i,t){const e=i&&i.options||{},s=e.reverse,n=e.min===void 0?t:0,a=e.max===void 0?t:0;return{start:s?a:n,end:s?n:a}}function nl(i,t,e){if(e===!1)return!1;const s=sn(i,e),n=sn(t,e);return{top:n.end,right:s.end,bottom:n.start,left:s.start}}function al(i){let t,e,s,n;return C(i)?(t=i.top,e=i.right,s=i.bottom,n=i.left):t=e=s=n=i,{top:t,right:e,bottom:s,left:n,disabled:i===!1}}function Ba(i,t){const e=[],s=i._getSortedDatasetMetas(t);let n,a;for(n=0,a=s.length;n<a;++n)e.push(s[n].index);return e}function nn(i,t,e,s={}){const n=i.keys,a=s.mode==="single";let o,r,l,c;if(t===null)return;let d=!1;for(o=0,r=n.length;o<r;++o){if(l=+n[o],l===e){if(d=!0,s.all)continue;break}c=i.values[l],W(c)&&(a||t===0||ft(t)===ft(c))&&(t+=c)}return!d&&!s.all?0:t}function ol(i,t){const{iScale:e,vScale:s}=t,n=e.axis==="x"?"x":"y",a=s.axis==="x"?"x":"y",o=Object.keys(i),r=new Array(o.length);let l,c,d;for(l=0,c=o.length;l<c;++l)d=o[l],r[l]={[n]:d,[a]:i[d]};return r}function vi(i,t){const e=i&&i.options.stacked;return e||e===void 0&&t.stack!==void 0}function rl(i,t,e){return`${i.id}.${t.id}.${e.stack||e.type}`}function ll(i){const{min:t,max:e,minDefined:s,maxDefined:n}=i.getUserBounds();return{min:s?t:Number.NEGATIVE_INFINITY,max:n?e:Number.POSITIVE_INFINITY}}function cl(i,t,e){const s=i[t]||(i[t]={});return s[e]||(s[e]={})}function an(i,t,e,s){for(const n of t.getMatchingVisibleMetas(s).reverse()){const a=i[n.index];if(e&&a>0||!e&&a<0)return n.index}return null}function on(i,t){const{chart:e,_cachedMeta:s}=i,n=e._stacks||(e._stacks={}),{iScale:a,vScale:o,index:r}=s,l=a.axis,c=o.axis,d=rl(a,o,s),u=t.length;let h;for(let p=0;p<u;++p){const m=t[p],{[l]:f,[c]:g}=m,x=m._stacks||(m._stacks={});h=x[c]=cl(n,d,f),h[r]=g,h._top=an(h,o,!0,s.type),h._bottom=an(h,o,!1,s.type);const b=h._visualValues||(h._visualValues={});b[r]=g}}function wi(i,t){const e=i.scales;return Object.keys(e).filter(s=>e[s].axis===t).shift()}function dl(i,t){return Ct(i,{active:!1,dataset:void 0,datasetIndex:t,index:t,mode:"default",type:"dataset"})}function ul(i,t,e){return Ct(i,{active:!1,dataIndex:t,parsed:void 0,raw:void 0,element:e,index:t,mode:"default",type:"data"})}function ae(i,t){const e=i.controller.index,s=i.vScale&&i.vScale.axis;if(s){t=t||i._parsed;for(const n of t){const a=n._stacks;if(!a||a[s]===void 0||a[s][e]===void 0)return;delete a[s][e],a[s]._visualValues!==void 0&&a[s]._visualValues[e]!==void 0&&delete a[s]._visualValues[e]}}}const ki=i=>i==="reset"||i==="none",rn=(i,t)=>t?i:Object.assign({},i),hl=(i,t,e)=>i&&!t.hidden&&t._stacked&&{keys:Ba(e,!0),values:null};class ct{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=vi(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&ae(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,s=this.getDataset(),n=(u,h,p,m)=>u==="x"?h:u==="r"?m:p,a=e.xAxisID=A(s.xAxisID,wi(t,"x")),o=e.yAxisID=A(s.yAxisID,wi(t,"y")),r=e.rAxisID=A(s.rAxisID,wi(t,"r")),l=e.indexAxis,c=e.iAxisID=n(l,a,o,r),d=e.vAxisID=n(l,o,a,r);e.xScale=this.getScaleForId(a),e.yScale=this.getScaleForId(o),e.rScale=this.getScaleForId(r),e.iScale=this.getScaleForId(c),e.vScale=this.getScaleForId(d)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&zs(this._data,this),t._stacked&&ae(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),s=this._data;if(C(e)){const n=this._cachedMeta;this._data=ol(e,n)}else if(s!==e){if(s){zs(s,this);const n=this._cachedMeta;ae(n),n._parsed=[]}e&&Object.isExtensible(e)&&Ko(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,s=this.getDataset();let n=!1;this._dataCheck();const a=e._stacked;e._stacked=vi(e.vScale,e),e.stack!==s.stack&&(n=!0,ae(e),e.stack=s.stack),this._resyncElements(t),(n||a!==e._stacked)&&(on(this,e._parsed),e._stacked=vi(e.vScale,e))}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),s=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(s,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:s,_data:n}=this,{iScale:a,_stacked:o}=s,r=a.axis;let l=t===0&&e===n.length?!0:s._sorted,c=t>0&&s._parsed[t-1],d,u,h;if(this._parsing===!1)s._parsed=n,s._sorted=!0,h=n;else{$(n[t])?h=this.parseArrayData(s,n,t,e):C(n[t])?h=this.parseObjectData(s,n,t,e):h=this.parsePrimitiveData(s,n,t,e);const p=()=>u[r]===null||c&&u[r]<c[r];for(d=0;d<e;++d)s._parsed[d+t]=u=h[d],l&&(p()&&(l=!1),c=u);s._sorted=l}o&&on(this,h)}parsePrimitiveData(t,e,s,n){const{iScale:a,vScale:o}=t,r=a.axis,l=o.axis,c=a.getLabels(),d=a===o,u=new Array(n);let h,p,m;for(h=0,p=n;h<p;++h)m=h+s,u[h]={[r]:d||a.parse(c[m],m),[l]:o.parse(e[m],m)};return u}parseArrayData(t,e,s,n){const{xScale:a,yScale:o}=t,r=new Array(n);let l,c,d,u;for(l=0,c=n;l<c;++l)d=l+s,u=e[d],r[l]={x:a.parse(u[0],d),y:o.parse(u[1],d)};return r}parseObjectData(t,e,s,n){const{xScale:a,yScale:o}=t,{xAxisKey:r="x",yAxisKey:l="y"}=this._parsing,c=new Array(n);let d,u,h,p;for(d=0,u=n;d<u;++d)h=d+s,p=e[h],c[d]={x:a.parse(Pt(p,r),h),y:o.parse(Pt(p,l),h)};return c}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,s){const n=this.chart,a=this._cachedMeta,o=e[t.axis],r={keys:Ba(n,!0),values:e._stacks[t.axis]._visualValues};return nn(r,o,a.index,{mode:s})}updateRangeFromParsed(t,e,s,n){const a=s[e.axis];let o=a===null?NaN:a;const r=n&&s._stacks[e.axis];n&&r&&(n.values=r,o=nn(n,a,this._cachedMeta.index)),t.min=Math.min(t.min,o),t.max=Math.max(t.max,o)}getMinMax(t,e){const s=this._cachedMeta,n=s._parsed,a=s._sorted&&t===s.iScale,o=n.length,r=this._getOtherScale(t),l=hl(e,s,this.chart),c={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:d,max:u}=ll(r);let h,p;function m(){p=n[h];const f=p[r.axis];return!W(p[t.axis])||d>f||u<f}for(h=0;h<o&&!(!m()&&(this.updateRangeFromParsed(c,t,p,l),a));++h);if(a){for(h=o-1;h>=0;--h)if(!m()){this.updateRangeFromParsed(c,t,p,l);break}}return c}getAllParsedValues(t){const e=this._cachedMeta._parsed,s=[];let n,a,o;for(n=0,a=e.length;n<a;++n)o=e[n][t.axis],W(o)&&s.push(o);return s}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,s=e.iScale,n=e.vScale,a=this.getParsed(t);return{label:s?""+s.getLabelForValue(a[s.axis]):"",value:n?""+n.getLabelForValue(a[n.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=al(A(this.options.clip,nl(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,s=this._cachedMeta,n=s.data||[],a=e.chartArea,o=[],r=this._drawStart||0,l=this._drawCount||n.length-r,c=this.options.drawActiveElementsOnTop;let d;for(s.dataset&&s.dataset.draw(t,a,r,l),d=r;d<r+l;++d){const u=n[d];u.hidden||(u.active&&c?o.push(u):u.draw(t,a))}for(d=0;d<o.length;++d)o[d].draw(t,a)}getStyle(t,e){const s=e?"active":"default";return t===void 0&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(s):this.resolveDataElementOptions(t||0,s)}getContext(t,e,s){const n=this.getDataset();let a;if(t>=0&&t<this._cachedMeta.data.length){const o=this._cachedMeta.data[t];a=o.$context||(o.$context=ul(this.getContext(),t,o)),a.parsed=this.getParsed(t),a.raw=n.data[t],a.index=a.dataIndex=t}else a=this.$context||(this.$context=dl(this.chart.getContext(),this.index)),a.dataset=n,a.index=a.datasetIndex=this.index;return a.active=!!e,a.mode=s,a}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",s){const n=e==="active",a=this._cachedDataOpts,o=t+"-"+e,r=a[o],l=this.enableOptionSharing&&_e(s);if(r)return rn(r,l);const c=this.chart.config,d=c.datasetElementScopeKeys(this._type,t),u=n?[`${t}Hover`,"hover",t,""]:[t,""],h=c.getOptionScopes(this.getDataset(),d),p=Object.keys(z.elements[t]),m=()=>this.getContext(s,n,e),f=c.resolveNamedOptions(h,p,m,u);return f.$shared&&(f.$shared=l,a[o]=Object.freeze(rn(f,l))),f}_resolveAnimations(t,e,s){const n=this.chart,a=this._cachedDataOpts,o=`animation-${e}`,r=a[o];if(r)return r;let l;if(n.options.animation!==!1){const d=this.chart.config,u=d.datasetAnimationScopeKeys(this._type,e),h=d.getOptionScopes(this.getDataset(),u);l=d.createResolver(h,this.getContext(t,s,e))}const c=new Ca(n,l&&l.animations);return l&&l._cacheable&&(a[o]=Object.freeze(c)),c}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||ki(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const s=this.resolveDataElementOptions(t,e),n=this._sharedOptions,a=this.getSharedOptions(s),o=this.includeOptions(e,a)||a!==n;return this.updateSharedOptions(a,e,s),{sharedOptions:a,includeOptions:o}}updateElement(t,e,s,n){ki(n)?Object.assign(t,s):this._resolveAnimations(e,n).update(t,s)}updateSharedOptions(t,e,s){t&&!ki(e)&&this._resolveAnimations(void 0,e).update(t,s)}_setStyle(t,e,s,n){t.active=n;const a=this.getStyle(e,n);this._resolveAnimations(e,s,n).update(t,{options:!n&&this.getSharedOptions(a)||a})}removeHoverStyle(t,e,s){this._setStyle(t,s,"active",!1)}setHoverStyle(t,e,s){this._setStyle(t,s,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,s=this._cachedMeta.data;for(const[r,l,c]of this._syncList)this[r](l,c);this._syncList=[];const n=s.length,a=e.length,o=Math.min(a,n);o&&this.parse(0,o),a>n?this._insertElements(n,a-n,t):a<n&&this._removeElements(a,n-a)}_insertElements(t,e,s=!0){const n=this._cachedMeta,a=n.data,o=t+e;let r;const l=c=>{for(c.length+=e,r=c.length-1;r>=o;r--)c[r]=c[r-e]};for(l(a),r=t;r<o;++r)a[r]=new this.dataElementType;this._parsing&&l(n._parsed),this.parse(t,e),s&&this.updateElements(a,t,e,"reset")}updateElements(t,e,s,n){}_removeElements(t,e){const s=this._cachedMeta;if(this._parsing){const n=s._parsed.splice(t,e);s._stacked&&ae(s,n)}s.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,s,n]=t;this[e](s,n)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const s=arguments.length-2;s&&this._sync(["_insertElements",t,s])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}E(ct,"defaults",{}),E(ct,"datasetElementType",null),E(ct,"dataElementType",null);function pl(i,t){if(!i._cache.$bar){const e=i.getMatchingVisibleMetas(t);let s=[];for(let n=0,a=e.length;n<a;n++)s=s.concat(e[n].controller.getAllParsedValues(i));i._cache.$bar=pa(s.sort((n,a)=>n-a))}return i._cache.$bar}function fl(i){const t=i.iScale,e=pl(t,i.type);let s=t._length,n,a,o,r;const l=()=>{o===32767||o===-32768||(_e(r)&&(s=Math.min(s,Math.abs(o-r)||s)),r=o)};for(n=0,a=e.length;n<a;++n)o=t.getPixelForValue(e[n]),l();for(r=void 0,n=0,a=t.ticks.length;n<a;++n)o=t.getPixelForTick(n),l();return s}function gl(i,t,e,s){const n=e.barThickness;let a,o;return I(n)?(a=t.min*e.categoryPercentage,o=e.barPercentage):(a=n*s,o=1),{chunk:a/s,ratio:o,start:t.pixels[i]-a/2}}function ml(i,t,e,s){const n=t.pixels,a=n[i];let o=i>0?n[i-1]:null,r=i<n.length-1?n[i+1]:null;const l=e.categoryPercentage;o===null&&(o=a-(r===null?t.end-t.start:r-a)),r===null&&(r=a+a-o);const c=a-(a-Math.min(o,r))/2*l;return{chunk:Math.abs(r-o)/2*l/s,ratio:e.barPercentage,start:c}}function xl(i,t,e,s){const n=e.parse(i[0],s),a=e.parse(i[1],s),o=Math.min(n,a),r=Math.max(n,a);let l=o,c=r;Math.abs(o)>Math.abs(r)&&(l=r,c=o),t[e.axis]=c,t._custom={barStart:l,barEnd:c,start:n,end:a,min:o,max:r}}function Ra(i,t,e,s){return $(i)?xl(i,t,e,s):t[e.axis]=e.parse(i,s),t}function ln(i,t,e,s){const n=i.iScale,a=i.vScale,o=n.getLabels(),r=n===a,l=[];let c,d,u,h;for(c=e,d=e+s;c<d;++c)h=t[c],u={},u[n.axis]=r||n.parse(o[c],c),l.push(Ra(h,u,a,c));return l}function _i(i){return i&&i.barStart!==void 0&&i.barEnd!==void 0}function bl(i,t,e){return i!==0?ft(i):(t.isHorizontal()?1:-1)*(t.min>=e?1:-1)}function yl(i){let t,e,s,n,a;return i.horizontal?(t=i.base>i.x,e="left",s="right"):(t=i.base<i.y,e="bottom",s="top"),t?(n="end",a="start"):(n="start",a="end"),{start:e,end:s,reverse:t,top:n,bottom:a}}function vl(i,t,e,s){let n=t.borderSkipped;const a={};if(!n){i.borderSkipped=a;return}if(n===!0){i.borderSkipped={top:!0,right:!0,bottom:!0,left:!0};return}const{start:o,end:r,reverse:l,top:c,bottom:d}=yl(i);n==="middle"&&e&&(i.enableBorderRadius=!0,(e._top||0)===s?n=c:(e._bottom||0)===s?n=d:(a[cn(d,o,r,l)]=!0,n=c)),a[cn(n,o,r,l)]=!0,i.borderSkipped=a}function cn(i,t,e,s){return s?(i=wl(i,t,e),i=dn(i,e,t)):i=dn(i,t,e),i}function wl(i,t,e){return i===t?e:i===e?t:i}function dn(i,t,e){return i==="start"?t:i==="end"?e:i}function kl(i,{inflateAmount:t},e){i.inflateAmount=t==="auto"?e===1?.33:0:t}class qe extends ct{parsePrimitiveData(t,e,s,n){return ln(t,e,s,n)}parseArrayData(t,e,s,n){return ln(t,e,s,n)}parseObjectData(t,e,s,n){const{iScale:a,vScale:o}=t,{xAxisKey:r="x",yAxisKey:l="y"}=this._parsing,c=a.axis==="x"?r:l,d=o.axis==="x"?r:l,u=[];let h,p,m,f;for(h=s,p=s+n;h<p;++h)f=e[h],m={},m[a.axis]=a.parse(Pt(f,c),h),u.push(Ra(Pt(f,d),m,o,h));return u}updateRangeFromParsed(t,e,s,n){super.updateRangeFromParsed(t,e,s,n);const a=s._custom;a&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,a.min),t.max=Math.max(t.max,a.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:s,vScale:n}=e,a=this.getParsed(t),o=a._custom,r=_i(o)?"["+o.start+", "+o.end+"]":""+n.getLabelForValue(a[n.axis]);return{label:""+s.getLabelForValue(a[s.axis]),value:r}}initialize(){this.enableOptionSharing=!0,super.initialize();const t=this._cachedMeta;t.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,s,n){const a=n==="reset",{index:o,_cachedMeta:{vScale:r}}=this,l=r.getBasePixel(),c=r.isHorizontal(),d=this._getRuler(),{sharedOptions:u,includeOptions:h}=this._getSharedOptions(e,n);for(let p=e;p<e+s;p++){const m=this.getParsed(p),f=a||I(m[r.axis])?{base:l,head:l}:this._calculateBarValuePixels(p),g=this._calculateBarIndexPixels(p,d),x=(m._stacks||{})[r.axis],b={horizontal:c,base:f.base,enableBorderRadius:!x||_i(m._custom)||o===x._top||o===x._bottom,x:c?f.head:g.center,y:c?g.center:f.head,height:c?g.size:Math.abs(f.size),width:c?Math.abs(f.size):g.size};h&&(b.options=u||this.resolveDataElementOptions(p,t[p].active?"active":n));const y=b.options||t[p].options;vl(b,y,x,o),kl(b,y,d.ratio),this.updateElement(t[p],p,b,n)}}_getStacks(t,e){const{iScale:s}=this._cachedMeta,n=s.getMatchingVisibleMetas(this._type).filter(d=>d.controller.options.grouped),a=s.options.stacked,o=[],r=this._cachedMeta.controller.getParsed(e),l=r&&r[s.axis],c=d=>{const u=d._parsed.find(p=>p[s.axis]===l),h=u&&u[d.vScale.axis];if(I(h)||isNaN(h))return!0};for(const d of n)if(!(e!==void 0&&c(d))&&((a===!1||o.indexOf(d.stack)===-1||a===void 0&&d.stack===void 0)&&o.push(d.stack),d.index===t))break;return o.length||o.push(void 0),o}_getStackCount(t){return this._getStacks(void 0,t).length}_getAxisCount(){return this._getAxis().length}getFirstScaleIdForIndexAxis(){const t=this.chart.scales,e=this.chart.options.indexAxis;return Object.keys(t).filter(s=>t[s].axis===e).shift()}_getAxis(){const t={},e=this.getFirstScaleIdForIndexAxis();for(const s of this.chart.data.datasets)t[A(this.chart.options.indexAxis==="x"?s.xAxisID:s.yAxisID,e)]=!0;return Object.keys(t)}_getStackIndex(t,e,s){const n=this._getStacks(t,s),a=e!==void 0?n.indexOf(e):-1;return a===-1?n.length-1:a}_getRuler(){const t=this.options,e=this._cachedMeta,s=e.iScale,n=[];let a,o;for(a=0,o=e.data.length;a<o;++a)n.push(s.getPixelForValue(this.getParsed(a)[s.axis],a));const r=t.barThickness;return{min:r||fl(e),pixels:n,start:s._startPixel,end:s._endPixel,stackCount:this._getStackCount(),scale:s,grouped:t.grouped,ratio:r?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:s,index:n},options:{base:a,minBarLength:o}}=this,r=a||0,l=this.getParsed(t),c=l._custom,d=_i(c);let u=l[e.axis],h=0,p=s?this.applyStack(e,l,s):u,m,f;p!==u&&(h=p-u,p=u),d&&(u=c.barStart,p=c.barEnd-c.barStart,u!==0&&ft(u)!==ft(c.barEnd)&&(h=0),h+=u);const g=!I(a)&&!d?a:h;let x=e.getPixelForValue(g);if(this.chart.getDataVisibility(t)?m=e.getPixelForValue(h+p):m=x,f=m-x,Math.abs(f)<o){f=bl(f,e,r)*o,u===r&&(x-=f/2);const b=e.getPixelForDecimal(0),y=e.getPixelForDecimal(1),w=Math.min(b,y),v=Math.max(b,y);x=Math.max(Math.min(x,v),w),m=x+f,s&&!d&&(l._stacks[e.axis]._visualValues[n]=e.getValueForPixel(m)-e.getValueForPixel(x))}if(x===e.getPixelForValue(r)){const b=ft(f)*e.getLineWidthForValue(r)/2;x+=b,f-=b}return{size:f,base:x,head:m,center:m+f/2}}_calculateBarIndexPixels(t,e){const s=e.scale,n=this.options,a=n.skipNull,o=A(n.maxBarThickness,1/0);let r,l;const c=this._getAxisCount();if(e.grouped){const d=a?this._getStackCount(t):e.stackCount,u=n.barThickness==="flex"?ml(t,e,n,d*c):gl(t,e,n,d*c),h=this.chart.options.indexAxis==="x"?this.getDataset().xAxisID:this.getDataset().yAxisID,p=this._getAxis().indexOf(A(h,this.getFirstScaleIdForIndexAxis())),m=this._getStackIndex(this.index,this._cachedMeta.stack,a?t:void 0)+p;r=u.start+u.chunk*m+u.chunk/2,l=Math.min(o,u.chunk*u.ratio)}else r=s.getPixelForValue(this.getParsed(t)[s.axis],t),l=Math.min(o,e.min*e.ratio);return{base:r-l/2,head:r+l/2,center:r,size:l}}draw(){const t=this._cachedMeta,e=t.vScale,s=t.data,n=s.length;let a=0;for(;a<n;++a)this.getParsed(a)[e.axis]!==null&&!s[a].hidden&&s[a].draw(this._ctx)}}E(qe,"id","bar"),E(qe,"defaults",{datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}}),E(qe,"overrides",{scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}});class Ye extends ct{initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,s,n){const a=super.parsePrimitiveData(t,e,s,n);for(let o=0;o<a.length;o++)a[o]._custom=this.resolveDataElementOptions(o+s).radius;return a}parseArrayData(t,e,s,n){const a=super.parseArrayData(t,e,s,n);for(let o=0;o<a.length;o++){const r=e[s+o];a[o]._custom=A(r[2],this.resolveDataElementOptions(o+s).radius)}return a}parseObjectData(t,e,s,n){const a=super.parseObjectData(t,e,s,n);for(let o=0;o<a.length;o++){const r=e[s+o];a[o]._custom=A(r&&r.r&&+r.r,this.resolveDataElementOptions(o+s).radius)}return a}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let s=t.length-1;s>=0;--s)e=Math.max(e,t[s].size(this.resolveDataElementOptions(s))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart.data.labels||[],{xScale:n,yScale:a}=e,o=this.getParsed(t),r=n.getLabelForValue(o.x),l=a.getLabelForValue(o.y),c=o._custom;return{label:s[t]||"",value:"("+r+", "+l+(c?", "+c:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,s,n){const a=n==="reset",{iScale:o,vScale:r}=this._cachedMeta,{sharedOptions:l,includeOptions:c}=this._getSharedOptions(e,n),d=o.axis,u=r.axis;for(let h=e;h<e+s;h++){const p=t[h],m=!a&&this.getParsed(h),f={},g=f[d]=a?o.getPixelForDecimal(.5):o.getPixelForValue(m[d]),x=f[u]=a?r.getBasePixel():r.getPixelForValue(m[u]);f.skip=isNaN(g)||isNaN(x),c&&(f.options=l||this.resolveDataElementOptions(h,p.active?"active":n),a&&(f.options.radius=0)),this.updateElement(p,h,f,n)}}resolveDataElementOptions(t,e){const s=this.getParsed(t);let n=super.resolveDataElementOptions(t,e);n.$shared&&(n=Object.assign({},n,{$shared:!1}));const a=n.radius;return e!=="active"&&(n.radius=0),n.radius+=A(s&&s._custom,a),n}}E(Ye,"id","bubble"),E(Ye,"defaults",{datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}}),E(Ye,"overrides",{scales:{x:{type:"linear"},y:{type:"linear"}}});function _l(i,t,e){let s=1,n=1,a=0,o=0;if(t<H){const r=i,l=r+t,c=Math.cos(r),d=Math.sin(r),u=Math.cos(l),h=Math.sin(l),p=(y,w,v)=>Se(y,r,l,!0)?1:Math.max(w,w*e,v,v*e),m=(y,w,v)=>Se(y,r,l,!0)?-1:Math.min(w,w*e,v,v*e),f=p(0,c,u),g=p(Y,d,h),x=m(R,c,u),b=m(R+Y,d,h);s=(f-x)/2,n=(g-b)/2,a=-(f+x)/2,o=-(g+b)/2}return{ratioX:s,ratioY:n,offsetX:a,offsetY:o}}class Vt extends ct{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const s=this.getDataset().data,n=this._cachedMeta;if(this._parsing===!1)n._parsed=s;else{let a=l=>+s[l];if(C(s[t])){const{key:l="value"}=this._parsing;a=c=>+Pt(s[c],l)}let o,r;for(o=t,r=t+e;o<r;++o)n._parsed[o]=a(o)}}_getRotation(){return lt(this.options.rotation-90)}_getCircumference(){return lt(this.options.circumference)}_getRotationExtents(){let t=H,e=-H;for(let s=0;s<this.chart.data.datasets.length;++s)if(this.chart.isDatasetVisible(s)&&this.chart.getDatasetMeta(s).type===this._type){const n=this.chart.getDatasetMeta(s).controller,a=n._getRotation(),o=n._getCircumference();t=Math.min(t,a),e=Math.max(e,a+o)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:s}=e,n=this._cachedMeta,a=n.data,o=this.getMaxBorderWidth()+this.getMaxOffset(a)+this.options.spacing,r=Math.max((Math.min(s.width,s.height)-o)/2,0),l=Math.min(Ro(this.options.cutout,r),1),c=this._getRingWeight(this.index),{circumference:d,rotation:u}=this._getRotationExtents(),{ratioX:h,ratioY:p,offsetX:m,offsetY:f}=_l(u,d,l),g=(s.width-o)/h,x=(s.height-o)/p,b=Math.max(Math.min(g,x)/2,0),y=la(this.options.radius,b),w=Math.max(y*l,0),v=(y-w)/this._getVisibleDatasetWeightTotal();this.offsetX=m*y,this.offsetY=f*y,n.total=this.calculateTotal(),this.outerRadius=y-v*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-v*c,0),this.updateElements(a,0,a.length,t)}_circumference(t,e){const s=this.options,n=this._cachedMeta,a=this._getCircumference();return e&&s.animation.animateRotate||!this.chart.getDataVisibility(t)||n._parsed[t]===null||n.data[t].hidden?0:this.calculateCircumference(n._parsed[t]*a/H)}updateElements(t,e,s,n){const a=n==="reset",o=this.chart,r=o.chartArea,c=o.options.animation,d=(r.left+r.right)/2,u=(r.top+r.bottom)/2,h=a&&c.animateScale,p=h?0:this.innerRadius,m=h?0:this.outerRadius,{sharedOptions:f,includeOptions:g}=this._getSharedOptions(e,n);let x=this._getRotation(),b;for(b=0;b<e;++b)x+=this._circumference(b,a);for(b=e;b<e+s;++b){const y=this._circumference(b,a),w=t[b],v={x:d+this.offsetX,y:u+this.offsetY,startAngle:x,endAngle:x+y,circumference:y,outerRadius:m,innerRadius:p};g&&(v.options=f||this.resolveDataElementOptions(b,w.active?"active":n)),x+=y,this.updateElement(w,b,v,n)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let s=0,n;for(n=0;n<e.length;n++){const a=t._parsed[n];a!==null&&!isNaN(a)&&this.chart.getDataVisibility(n)&&!e[n].hidden&&(s+=Math.abs(a))}return s}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?H*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart,n=s.data.labels||[],a=Ae(e._parsed[t],s.options.locale);return{label:n[t]||"",value:a}}getMaxBorderWidth(t){let e=0;const s=this.chart;let n,a,o,r,l;if(!t){for(n=0,a=s.data.datasets.length;n<a;++n)if(s.isDatasetVisible(n)){o=s.getDatasetMeta(n),t=o.data,r=o.controller;break}}if(!t)return 0;for(n=0,a=t.length;n<a;++n)l=r.resolveDataElementOptions(n),l.borderAlign!=="inner"&&(e=Math.max(e,l.borderWidth||0,l.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let s=0,n=t.length;s<n;++s){const a=this.resolveDataElementOptions(s);e=Math.max(e,a.offset||0,a.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let s=0;s<t;++s)this.chart.isDatasetVisible(s)&&(e+=this._getRingWeight(s));return e}_getRingWeight(t){return Math.max(A(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}E(Vt,"id","doughnut"),E(Vt,"defaults",{datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"}),E(Vt,"descriptors",{_scriptable:t=>t!=="spacing",_indexable:t=>t!=="spacing"&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")}),E(Vt,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data,{labels:{pointStyle:s,textAlign:n,color:a,useBorderRadius:o,borderRadius:r}}=t.legend.options;return e.labels.length&&e.datasets.length?e.labels.map((l,c)=>{const u=t.getDatasetMeta(0).controller.getStyle(c);return{text:l,fillStyle:u.backgroundColor,fontColor:a,hidden:!t.getDataVisibility(c),lineDash:u.borderDash,lineDashOffset:u.borderDashOffset,lineJoin:u.borderJoinStyle,lineWidth:u.borderWidth,strokeStyle:u.borderColor,textAlign:n,pointStyle:s,borderRadius:o&&(r||u.borderRadius),index:c}}):[]}},onClick(t,e,s){s.chart.toggleDataVisibility(e.index),s.chart.update()}}}});class Xe extends ct{initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:s,data:n=[],_dataset:a}=e,o=this.chart._animationsDisabled;let{start:r,count:l}=ma(e,n,o);this._drawStart=r,this._drawCount=l,xa(e)&&(r=0,l=n.length),s._chart=this.chart,s._datasetIndex=this.index,s._decimated=!!a._decimated,s.points=n;const c=this.resolveDatasetElementOptions(t);this.options.showLine||(c.borderWidth=0),c.segment=this.options.segment,this.updateElement(s,void 0,{animated:!o,options:c},t),this.updateElements(n,r,l,t)}updateElements(t,e,s,n){const a=n==="reset",{iScale:o,vScale:r,_stacked:l,_dataset:c}=this._cachedMeta,{sharedOptions:d,includeOptions:u}=this._getSharedOptions(e,n),h=o.axis,p=r.axis,{spanGaps:m,segment:f}=this.options,g=te(m)?m:Number.POSITIVE_INFINITY,x=this.chart._animationsDisabled||a||n==="none",b=e+s,y=t.length;let w=e>0&&this.getParsed(e-1);for(let v=0;v<y;++v){const k=t[v],_=x?k:{};if(v<e||v>=b){_.skip=!0;continue}const S=this.getParsed(v),M=I(S[p]),L=_[h]=o.getPixelForValue(S[h],v),T=_[p]=a||M?r.getBasePixel():r.getPixelForValue(l?this.applyStack(r,S,l):S[p],v);_.skip=isNaN(L)||isNaN(T)||M,_.stop=v>0&&Math.abs(S[h]-w[h])>g,f&&(_.parsed=S,_.raw=c.data[v]),u&&(_.options=d||this.resolveDataElementOptions(v,k.active?"active":n)),x||this.updateElement(k,v,_,n),w=S}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,s=e.options&&e.options.borderWidth||0,n=t.data||[];if(!n.length)return s;const a=n[0].size(this.resolveDataElementOptions(0)),o=n[n.length-1].size(this.resolveDataElementOptions(n.length-1));return Math.max(s,a,o)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}E(Xe,"id","line"),E(Xe,"defaults",{datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1}),E(Xe,"overrides",{scales:{_index_:{type:"category"},_value_:{type:"linear"}}});class ve extends ct{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart,n=s.data.labels||[],a=Ae(e._parsed[t].r,s.options.locale);return{label:n[t]||"",value:a}}parseObjectData(t,e,s,n){return Ma.bind(this)(t,e,s,n)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach((s,n)=>{const a=this.getParsed(n).r;!isNaN(a)&&this.chart.getDataVisibility(n)&&(a<e.min&&(e.min=a),a>e.max&&(e.max=a))}),e}_updateRadius(){const t=this.chart,e=t.chartArea,s=t.options,n=Math.min(e.right-e.left,e.bottom-e.top),a=Math.max(n/2,0),o=Math.max(s.cutoutPercentage?a/100*s.cutoutPercentage:1,0),r=(a-o)/t.getVisibleDatasetCount();this.outerRadius=a-r*this.index,this.innerRadius=this.outerRadius-r}updateElements(t,e,s,n){const a=n==="reset",o=this.chart,l=o.options.animation,c=this._cachedMeta.rScale,d=c.xCenter,u=c.yCenter,h=c.getIndexAngle(0)-.5*R;let p=h,m;const f=360/this.countVisibleElements();for(m=0;m<e;++m)p+=this._computeAngle(m,n,f);for(m=e;m<e+s;m++){const g=t[m];let x=p,b=p+this._computeAngle(m,n,f),y=o.getDataVisibility(m)?c.getDistanceFromCenterForValue(this.getParsed(m).r):0;p=b,a&&(l.animateScale&&(y=0),l.animateRotate&&(x=b=h));const w={x:d,y:u,innerRadius:0,outerRadius:y,startAngle:x,endAngle:b,options:this.resolveDataElementOptions(m,g.active?"active":n)};this.updateElement(g,m,w,n)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach((s,n)=>{!isNaN(this.getParsed(n).r)&&this.chart.getDataVisibility(n)&&e++}),e}_computeAngle(t,e,s){return this.chart.getDataVisibility(t)?lt(this.resolveDataElementOptions(t,e).angle||s):0}}E(ve,"id","polarArea"),E(ve,"defaults",{dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0}),E(ve,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:s,color:n}}=t.legend.options;return e.labels.map((a,o)=>{const l=t.getDatasetMeta(0).controller.getStyle(o);return{text:a,fillStyle:l.backgroundColor,strokeStyle:l.borderColor,fontColor:n,lineWidth:l.borderWidth,pointStyle:s,hidden:!t.getDataVisibility(o),index:o}})}return[]}},onClick(t,e,s){s.chart.toggleDataVisibility(e.index),s.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}});class Ri extends Vt{}E(Ri,"id","pie"),E(Ri,"defaults",{cutout:0,rotation:0,circumference:360,radius:"100%"});class Ge extends ct{getLabelAndValue(t){const e=this._cachedMeta.vScale,s=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(s[e.axis])}}parseObjectData(t,e,s,n){return Ma.bind(this)(t,e,s,n)}update(t){const e=this._cachedMeta,s=e.dataset,n=e.data||[],a=e.iScale.getLabels();if(s.points=n,t!=="resize"){const o=this.resolveDatasetElementOptions(t);this.options.showLine||(o.borderWidth=0);const r={_loop:!0,_fullLoop:a.length===n.length,options:o};this.updateElement(s,void 0,r,t)}this.updateElements(n,0,n.length,t)}updateElements(t,e,s,n){const a=this._cachedMeta.rScale,o=n==="reset";for(let r=e;r<e+s;r++){const l=t[r],c=this.resolveDataElementOptions(r,l.active?"active":n),d=a.getPointPositionForValue(r,this.getParsed(r).r),u=o?a.xCenter:d.x,h=o?a.yCenter:d.y,p={x:u,y:h,angle:d.angle,skip:isNaN(u)||isNaN(h),options:c};this.updateElement(l,r,p,n)}}}E(Ge,"id","radar"),E(Ge,"defaults",{datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}}),E(Ge,"overrides",{aspectRatio:1,scales:{r:{type:"radialLinear"}}});class Ke extends ct{getLabelAndValue(t){const e=this._cachedMeta,s=this.chart.data.labels||[],{xScale:n,yScale:a}=e,o=this.getParsed(t),r=n.getLabelForValue(o.x),l=a.getLabelForValue(o.y);return{label:s[t]||"",value:"("+r+", "+l+")"}}update(t){const e=this._cachedMeta,{data:s=[]}=e,n=this.chart._animationsDisabled;let{start:a,count:o}=ma(e,s,n);if(this._drawStart=a,this._drawCount=o,xa(e)&&(a=0,o=s.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:r,_dataset:l}=e;r._chart=this.chart,r._datasetIndex=this.index,r._decimated=!!l._decimated,r.points=s;const c=this.resolveDatasetElementOptions(t);c.segment=this.options.segment,this.updateElement(r,void 0,{animated:!n,options:c},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(s,a,o,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,s,n){const a=n==="reset",{iScale:o,vScale:r,_stacked:l,_dataset:c}=this._cachedMeta,d=this.resolveDataElementOptions(e,n),u=this.getSharedOptions(d),h=this.includeOptions(n,u),p=o.axis,m=r.axis,{spanGaps:f,segment:g}=this.options,x=te(f)?f:Number.POSITIVE_INFINITY,b=this.chart._animationsDisabled||a||n==="none";let y=e>0&&this.getParsed(e-1);for(let w=e;w<e+s;++w){const v=t[w],k=this.getParsed(w),_=b?v:{},S=I(k[m]),M=_[p]=o.getPixelForValue(k[p],w),L=_[m]=a||S?r.getBasePixel():r.getPixelForValue(l?this.applyStack(r,k,l):k[m],w);_.skip=isNaN(M)||isNaN(L)||S,_.stop=w>0&&Math.abs(k[p]-y[p])>x,g&&(_.parsed=k,_.raw=c.data[w]),h&&(_.options=u||this.resolveDataElementOptions(w,v.active?"active":n)),b||this.updateElement(v,w,_,n),y=k}this.updateSharedOptions(u,n,d)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let r=0;for(let l=e.length-1;l>=0;--l)r=Math.max(r,e[l].size(this.resolveDataElementOptions(l))/2);return r>0&&r}const s=t.dataset,n=s.options&&s.options.borderWidth||0;if(!e.length)return n;const a=e[0].size(this.resolveDataElementOptions(0)),o=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(n,a,o)/2}}E(Ke,"id","scatter"),E(Ke,"defaults",{datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1}),E(Ke,"overrides",{interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}});var Sl=Object.freeze({__proto__:null,BarController:qe,BubbleController:Ye,DoughnutController:Vt,LineController:Xe,PieController:Ri,PolarAreaController:ve,RadarController:Ge,ScatterController:Ke});function jt(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class rs{constructor(t){E(this,"options");this.options=t||{}}static override(t){Object.assign(rs.prototype,t)}init(){}formats(){return jt()}parse(){return jt()}format(){return jt()}add(){return jt()}diff(){return jt()}startOf(){return jt()}endOf(){return jt()}}var Ml={_date:rs};function El(i,t,e,s){const{controller:n,data:a,_sorted:o}=i,r=n._cachedMeta.iScale,l=i.dataset&&i.dataset.options?i.dataset.options.spanGaps:null;if(r&&t===r.axis&&t!=="r"&&o&&a.length){const c=r._reversePixels?Xo:_t;if(s){if(n._sharedOptions){const d=a[0],u=typeof d.getRange=="function"&&d.getRange(t);if(u){const h=c(a,t,e-u),p=c(a,t,e+u);return{lo:h.lo,hi:p.hi}}}}else{const d=c(a,t,e);if(l){const{vScale:u}=n._cachedMeta,{_parsed:h}=i,p=h.slice(0,d.lo+1).reverse().findIndex(f=>!I(f[u.axis]));d.lo-=Math.max(0,p);const m=h.slice(d.hi).findIndex(f=>!I(f[u.axis]));d.hi+=Math.max(0,m)}return d}}return{lo:0,hi:a.length-1}}function fi(i,t,e,s,n){const a=i.getSortedVisibleDatasetMetas(),o=e[t];for(let r=0,l=a.length;r<l;++r){const{index:c,data:d}=a[r],{lo:u,hi:h}=El(a[r],t,o,n);for(let p=u;p<=h;++p){const m=d[p];m.skip||s(m,c,p)}}}function Ll(i){const t=i.indexOf("x")!==-1,e=i.indexOf("y")!==-1;return function(s,n){const a=t?Math.abs(s.x-n.x):0,o=e?Math.abs(s.y-n.y):0;return Math.sqrt(Math.pow(a,2)+Math.pow(o,2))}}function Si(i,t,e,s,n){const a=[];return!n&&!i.isPointInArea(t)||fi(i,e,t,function(r,l,c){!n&&!St(r,i.chartArea,0)||r.inRange(t.x,t.y,s)&&a.push({element:r,datasetIndex:l,index:c})},!0),a}function Tl(i,t,e,s){let n=[];function a(o,r,l){const{startAngle:c,endAngle:d}=o.getProps(["startAngle","endAngle"],s),{angle:u}=ua(o,{x:t.x,y:t.y});Se(u,c,d)&&n.push({element:o,datasetIndex:r,index:l})}return fi(i,e,t,a),n}function Dl(i,t,e,s,n,a){let o=[];const r=Ll(e);let l=Number.POSITIVE_INFINITY;function c(d,u,h){const p=d.inRange(t.x,t.y,n);if(s&&!p)return;const m=d.getCenterPoint(n);if(!(!!a||i.isPointInArea(m))&&!p)return;const g=r(t,m);g<l?(o=[{element:d,datasetIndex:u,index:h}],l=g):g===l&&o.push({element:d,datasetIndex:u,index:h})}return fi(i,e,t,c),o}function Mi(i,t,e,s,n,a){return!a&&!i.isPointInArea(t)?[]:e==="r"&&!s?Tl(i,t,e,n):Dl(i,t,e,s,n,a)}function un(i,t,e,s,n){const a=[],o=e==="x"?"inXRange":"inYRange";let r=!1;return fi(i,e,t,(l,c,d)=>{l[o]&&l[o](t[e],n)&&(a.push({element:l,datasetIndex:c,index:d}),r=r||l.inRange(t.x,t.y,n))}),s&&!r?[]:a}var Al={modes:{index(i,t,e,s){const n=Ht(t,i),a=e.axis||"x",o=e.includeInvisible||!1,r=e.intersect?Si(i,n,a,s,o):Mi(i,n,a,!1,s,o),l=[];return r.length?(i.getSortedVisibleDatasetMetas().forEach(c=>{const d=r[0].index,u=c.data[d];u&&!u.skip&&l.push({element:u,datasetIndex:c.index,index:d})}),l):[]},dataset(i,t,e,s){const n=Ht(t,i),a=e.axis||"xy",o=e.includeInvisible||!1;let r=e.intersect?Si(i,n,a,s,o):Mi(i,n,a,!1,s,o);if(r.length>0){const l=r[0].datasetIndex,c=i.getDatasetMeta(l).data;r=[];for(let d=0;d<c.length;++d)r.push({element:c[d],datasetIndex:l,index:d})}return r},point(i,t,e,s){const n=Ht(t,i),a=e.axis||"xy",o=e.includeInvisible||!1;return Si(i,n,a,s,o)},nearest(i,t,e,s){const n=Ht(t,i),a=e.axis||"xy",o=e.includeInvisible||!1;return Mi(i,n,a,e.intersect,s,o)},x(i,t,e,s){const n=Ht(t,i);return un(i,n,"x",e.intersect,s)},y(i,t,e,s){const n=Ht(t,i);return un(i,n,"y",e.intersect,s)}}};const Oa=["left","top","right","bottom"];function oe(i,t){return i.filter(e=>e.pos===t)}function hn(i,t){return i.filter(e=>Oa.indexOf(e.pos)===-1&&e.box.axis===t)}function re(i,t){return i.sort((e,s)=>{const n=t?s:e,a=t?e:s;return n.weight===a.weight?n.index-a.index:n.weight-a.weight})}function Pl(i){const t=[];let e,s,n,a,o,r;for(e=0,s=(i||[]).length;e<s;++e)n=i[e],{position:a,options:{stack:o,stackWeight:r=1}}=n,t.push({index:e,box:n,pos:a,horizontal:n.isHorizontal(),weight:n.weight,stack:o&&a+o,stackWeight:r});return t}function Il(i){const t={};for(const e of i){const{stack:s,pos:n,stackWeight:a}=e;if(!s||!Oa.includes(n))continue;const o=t[s]||(t[s]={count:0,placed:0,weight:0,size:0});o.count++,o.weight+=a}return t}function Cl(i,t){const e=Il(i),{vBoxMaxWidth:s,hBoxMaxHeight:n}=t;let a,o,r;for(a=0,o=i.length;a<o;++a){r=i[a];const{fullSize:l}=r.box,c=e[r.stack],d=c&&r.stackWeight/c.weight;r.horizontal?(r.width=d?d*s:l&&t.availableWidth,r.height=n):(r.width=s,r.height=d?d*n:l&&t.availableHeight)}return e}function Bl(i){const t=Pl(i),e=re(t.filter(c=>c.box.fullSize),!0),s=re(oe(t,"left"),!0),n=re(oe(t,"right")),a=re(oe(t,"top"),!0),o=re(oe(t,"bottom")),r=hn(t,"x"),l=hn(t,"y");return{fullSize:e,leftAndTop:s.concat(a),rightAndBottom:n.concat(l).concat(o).concat(r),chartArea:oe(t,"chartArea"),vertical:s.concat(n).concat(l),horizontal:a.concat(o).concat(r)}}function pn(i,t,e,s){return Math.max(i[e],t[e])+Math.max(i[s],t[s])}function Fa(i,t){i.top=Math.max(i.top,t.top),i.left=Math.max(i.left,t.left),i.bottom=Math.max(i.bottom,t.bottom),i.right=Math.max(i.right,t.right)}function Rl(i,t,e,s){const{pos:n,box:a}=e,o=i.maxPadding;if(!C(n)){e.size&&(i[n]-=e.size);const u=s[e.stack]||{size:0,count:1};u.size=Math.max(u.size,e.horizontal?a.height:a.width),e.size=u.size/u.count,i[n]+=e.size}a.getPadding&&Fa(o,a.getPadding());const r=Math.max(0,t.outerWidth-pn(o,i,"left","right")),l=Math.max(0,t.outerHeight-pn(o,i,"top","bottom")),c=r!==i.w,d=l!==i.h;return i.w=r,i.h=l,e.horizontal?{same:c,other:d}:{same:d,other:c}}function Ol(i){const t=i.maxPadding;function e(s){const n=Math.max(t[s]-i[s],0);return i[s]+=n,n}i.y+=e("top"),i.x+=e("left"),e("right"),e("bottom")}function Fl(i,t){const e=t.maxPadding;function s(n){const a={left:0,top:0,right:0,bottom:0};return n.forEach(o=>{a[o]=Math.max(t[o],e[o])}),a}return s(i?["left","right"]:["top","bottom"])}function he(i,t,e,s){const n=[];let a,o,r,l,c,d;for(a=0,o=i.length,c=0;a<o;++a){r=i[a],l=r.box,l.update(r.width||t.w,r.height||t.h,Fl(r.horizontal,t));const{same:u,other:h}=Rl(t,e,r,s);c|=u&&n.length,d=d||h,l.fullSize||n.push(r)}return c&&he(n,t,e,s)||d}function je(i,t,e,s,n){i.top=e,i.left=t,i.right=t+s,i.bottom=e+n,i.width=s,i.height=n}function fn(i,t,e,s){const n=e.padding;let{x:a,y:o}=t;for(const r of i){const l=r.box,c=s[r.stack]||{placed:0,weight:1},d=r.stackWeight/c.weight||1;if(r.horizontal){const u=t.w*d,h=c.size||l.height;_e(c.start)&&(o=c.start),l.fullSize?je(l,n.left,o,e.outerWidth-n.right-n.left,h):je(l,t.left+c.placed,o,u,h),c.start=o,c.placed+=u,o=l.bottom}else{const u=t.h*d,h=c.size||l.width;_e(c.start)&&(a=c.start),l.fullSize?je(l,a,n.top,h,e.outerHeight-n.bottom-n.top):je(l,a,t.top+c.placed,h,u),c.start=a,c.placed+=u,a=l.right}}t.x=a,t.y=o}var Z={addBox(i,t){i.boxes||(i.boxes=[]),t.fullSize=t.fullSize||!1,t.position=t.position||"top",t.weight=t.weight||0,t._layers=t._layers||function(){return[{z:0,draw(e){t.draw(e)}}]},i.boxes.push(t)},removeBox(i,t){const e=i.boxes?i.boxes.indexOf(t):-1;e!==-1&&i.boxes.splice(e,1)},configure(i,t,e){t.fullSize=e.fullSize,t.position=e.position,t.weight=e.weight},update(i,t,e,s){if(!i)return;const n=tt(i.options.layout.padding),a=Math.max(t-n.width,0),o=Math.max(e-n.height,0),r=Bl(i.boxes),l=r.vertical,c=r.horizontal;F(i.boxes,f=>{typeof f.beforeLayout=="function"&&f.beforeLayout()});const d=l.reduce((f,g)=>g.box.options&&g.box.options.display===!1?f:f+1,0)||1,u=Object.freeze({outerWidth:t,outerHeight:e,padding:n,availableWidth:a,availableHeight:o,vBoxMaxWidth:a/2/d,hBoxMaxHeight:o/2}),h=Object.assign({},n);Fa(h,tt(s));const p=Object.assign({maxPadding:h,w:a,h:o,x:n.left,y:n.top},n),m=Cl(l.concat(c),u);he(r.fullSize,p,u,m),he(l,p,u,m),he(c,p,u,m)&&he(l,p,u,m),Ol(p),fn(r.leftAndTop,p,u,m),p.x+=p.w,p.y+=p.h,fn(r.rightAndBottom,p,u,m),i.chartArea={left:p.left,top:p.top,right:p.left+p.w,bottom:p.top+p.h,height:p.h,width:p.w},F(r.chartArea,f=>{const g=f.box;Object.assign(g,i.chartArea),g.update(p.w,p.h,{left:0,top:0,right:0,bottom:0})})}};class ja{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,s){}removeEventListener(t,e,s){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,s,n){return e=Math.max(0,e||t.width),s=s||t.height,{width:e,height:Math.max(0,n?Math.floor(e/n):s)}}isAttached(t){return!0}updateConfig(t){}}class jl extends ja{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const Je="$chartjs",Nl={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},gn=i=>i===null||i==="";function Hl(i,t){const e=i.style,s=i.getAttribute("height"),n=i.getAttribute("width");if(i[Je]={initial:{height:s,width:n,style:{display:e.display,height:e.height,width:e.width}}},e.display=e.display||"block",e.boxSizing=e.boxSizing||"border-box",gn(n)){const a=Js(i,"width");a!==void 0&&(i.width=a)}if(gn(s))if(i.style.height==="")i.height=i.width/(t||2);else{const a=Js(i,"height");a!==void 0&&(i.height=a)}return i}const Na=$r?{passive:!0}:!1;function $l(i,t,e){i&&i.addEventListener(t,e,Na)}function zl(i,t,e){i&&i.canvas&&i.canvas.removeEventListener(t,e,Na)}function Vl(i,t){const e=Nl[i.type]||i.type,{x:s,y:n}=Ht(i,t);return{type:e,chart:t,native:i,x:s!==void 0?s:null,y:n!==void 0?n:null}}function ri(i,t){for(const e of i)if(e===t||e.contains(t))return!0}function Wl(i,t,e){const s=i.canvas,n=new MutationObserver(a=>{let o=!1;for(const r of a)o=o||ri(r.addedNodes,s),o=o&&!ri(r.removedNodes,s);o&&e()});return n.observe(document,{childList:!0,subtree:!0}),n}function Ul(i,t,e){const s=i.canvas,n=new MutationObserver(a=>{let o=!1;for(const r of a)o=o||ri(r.removedNodes,s),o=o&&!ri(r.addedNodes,s);o&&e()});return n.observe(document,{childList:!0,subtree:!0}),n}const Ee=new Map;let mn=0;function Ha(){const i=window.devicePixelRatio;i!==mn&&(mn=i,Ee.forEach((t,e)=>{e.currentDevicePixelRatio!==i&&t()}))}function ql(i,t){Ee.size||window.addEventListener("resize",Ha),Ee.set(i,t)}function Yl(i){Ee.delete(i),Ee.size||window.removeEventListener("resize",Ha)}function Xl(i,t,e){const s=i.canvas,n=s&&os(s);if(!n)return;const a=ga((r,l)=>{const c=n.clientWidth;e(r,l),c<n.clientWidth&&e()},window),o=new ResizeObserver(r=>{const l=r[0],c=l.contentRect.width,d=l.contentRect.height;c===0&&d===0||a(c,d)});return o.observe(n),ql(i,a),o}function Ei(i,t,e){e&&e.disconnect(),t==="resize"&&Yl(i)}function Gl(i,t,e){const s=i.canvas,n=ga(a=>{i.ctx!==null&&e(Vl(a,i))},i);return $l(s,t,n),n}class Kl extends ja{acquireContext(t,e){const s=t&&t.getContext&&t.getContext("2d");return s&&s.canvas===t?(Hl(t,e),s):null}releaseContext(t){const e=t.canvas;if(!e[Je])return!1;const s=e[Je].initial;["height","width"].forEach(a=>{const o=s[a];I(o)?e.removeAttribute(a):e.setAttribute(a,o)});const n=s.style||{};return Object.keys(n).forEach(a=>{e.style[a]=n[a]}),e.width=e.width,delete e[Je],!0}addEventListener(t,e,s){this.removeEventListener(t,e);const n=t.$proxies||(t.$proxies={}),o={attach:Wl,detach:Ul,resize:Xl}[e]||Gl;n[e]=o(t,e,s)}removeEventListener(t,e){const s=t.$proxies||(t.$proxies={}),n=s[e];if(!n)return;({attach:Ei,detach:Ei,resize:Ei}[e]||zl)(t,e,n),s[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,s,n){return Hr(t,e,s,n)}isAttached(t){const e=t&&os(t);return!!(e&&e.isConnected)}}function Jl(i){return!as()||typeof OffscreenCanvas<"u"&&i instanceof OffscreenCanvas?jl:Kl}class ut{constructor(){E(this,"x");E(this,"y");E(this,"active",!1);E(this,"options");E(this,"$animations")}tooltipPosition(t){const{x:e,y:s}=this.getProps(["x","y"],t);return{x:e,y:s}}hasValue(){return te(this.x)&&te(this.y)}getProps(t,e){const s=this.$animations;if(!e||!s)return this;const n={};return t.forEach(a=>{n[a]=s[a]&&s[a].active()?s[a]._to:this[a]}),n}}E(ut,"defaults",{}),E(ut,"defaultRoutes");function Ql(i,t){const e=i.options.ticks,s=Zl(i),n=Math.min(e.maxTicksLimit||s,s),a=e.major.enabled?ec(t):[],o=a.length,r=a[0],l=a[o-1],c=[];if(o>n)return ic(t,c,a,o/n),c;const d=tc(a,t,n);if(o>0){let u,h;const p=o>1?Math.round((l-r)/(o-1)):null;for(Ne(t,c,d,I(p)?0:r-p,r),u=0,h=o-1;u<h;u++)Ne(t,c,d,a[u],a[u+1]);return Ne(t,c,d,l,I(p)?t.length:l+p),c}return Ne(t,c,d),c}function Zl(i){const t=i.options.offset,e=i._tickSize(),s=i._length/e+(t?0:1),n=i._maxLength/e;return Math.floor(Math.min(s,n))}function tc(i,t,e){const s=sc(i),n=t.length/e;if(!s)return Math.max(n,1);const a=Vo(s);for(let o=0,r=a.length-1;o<r;o++){const l=a[o];if(l>n)return l}return Math.max(n,1)}function ec(i){const t=[];let e,s;for(e=0,s=i.length;e<s;e++)i[e].major&&t.push(e);return t}function ic(i,t,e,s){let n=0,a=e[0],o;for(s=Math.ceil(s),o=0;o<i.length;o++)o===a&&(t.push(i[o]),n++,a=e[n*s])}function Ne(i,t,e,s,n){const a=A(s,0),o=Math.min(A(n,i.length),i.length);let r=0,l,c,d;for(e=Math.ceil(e),n&&(l=n-s,e=l/Math.floor(l/e)),d=a;d<0;)r++,d=Math.round(a+r*e);for(c=Math.max(a,0);c<o;c++)c===d&&(t.push(i[c]),r++,d=Math.round(a+r*e))}function sc(i){const t=i.length;let e,s;if(t<2)return!1;for(s=i[0],e=1;e<t;++e)if(i[e]-i[e-1]!==s)return!1;return s}const nc=i=>i==="left"?"right":i==="right"?"left":i,xn=(i,t,e)=>t==="top"||t==="left"?i[t]+e:i[t]-e,bn=(i,t)=>Math.min(t||i,i);function yn(i,t){const e=[],s=i.length/t,n=i.length;let a=0;for(;a<n;a+=s)e.push(i[Math.floor(a)]);return e}function ac(i,t,e){const s=i.ticks.length,n=Math.min(t,s-1),a=i._startPixel,o=i._endPixel,r=1e-6;let l=i.getPixelForTick(n),c;if(!(e&&(s===1?c=Math.max(l-a,o-l):t===0?c=(i.getPixelForTick(1)-l)/2:c=(l-i.getPixelForTick(n-1))/2,l+=n<t?c:-c,l<a-r||l>o+r)))return l}function oc(i,t){F(i,e=>{const s=e.gc,n=s.length/2;let a;if(n>t){for(a=0;a<n;++a)delete e.data[s[a]];s.splice(0,n)}})}function le(i){return i.drawTicks?i.tickLength:0}function vn(i,t){if(!i.display)return 0;const e=X(i.font,t),s=tt(i.padding);return($(i.text)?i.text.length:1)*e.lineHeight+s.height}function rc(i,t){return Ct(i,{scale:t,type:"scale"})}function lc(i,t,e){return Ct(i,{tick:e,index:t,type:"tick"})}function cc(i,t,e){let s=Zi(i);return(e&&t!=="right"||!e&&t==="right")&&(s=nc(s)),s}function dc(i,t,e,s){const{top:n,left:a,bottom:o,right:r,chart:l}=i,{chartArea:c,scales:d}=l;let u=0,h,p,m;const f=o-n,g=r-a;if(i.isHorizontal()){if(p=J(s,a,r),C(e)){const x=Object.keys(e)[0],b=e[x];m=d[x].getPixelForValue(b)+f-t}else e==="center"?m=(c.bottom+c.top)/2+f-t:m=xn(i,e,t);h=r-a}else{if(C(e)){const x=Object.keys(e)[0],b=e[x];p=d[x].getPixelForValue(b)-g+t}else e==="center"?p=(c.left+c.right)/2-g+t:p=xn(i,e,t);m=J(s,o,n),u=e==="left"?-Y:Y}return{titleX:p,titleY:m,maxWidth:h,rotation:u}}class Xt extends ut{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:s,_suggestedMax:n}=this;return t=nt(t,Number.POSITIVE_INFINITY),e=nt(e,Number.NEGATIVE_INFINITY),s=nt(s,Number.POSITIVE_INFINITY),n=nt(n,Number.NEGATIVE_INFINITY),{min:nt(t,s),max:nt(e,n),minDefined:W(t),maxDefined:W(e)}}getMinMax(t){let{min:e,max:s,minDefined:n,maxDefined:a}=this.getUserBounds(),o;if(n&&a)return{min:e,max:s};const r=this.getMatchingVisibleMetas();for(let l=0,c=r.length;l<c;++l)o=r[l].controller.getMinMax(this,t),n||(e=Math.min(e,o.min)),a||(s=Math.max(s,o.max));return e=a&&e>s?s:e,s=n&&e>s?e:s,{min:nt(e,nt(s,e)),max:nt(s,nt(e,s))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){N(this.options.beforeUpdate,[this])}update(t,e,s){const{beginAtZero:n,grace:a,ticks:o}=this.options,r=o.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=s=Object.assign({left:0,right:0,top:0,bottom:0},s),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+s.left+s.right:this.height+s.top+s.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=br(this,a,n),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const l=r<this.ticks.length;this._convertTicksToLabels(l?yn(this.ticks,r):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),o.display&&(o.autoSkip||o.source==="auto")&&(this.ticks=Ql(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),l&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t=this.options.reverse,e,s;this.isHorizontal()?(e=this.left,s=this.right):(e=this.top,s=this.bottom,t=!t),this._startPixel=e,this._endPixel=s,this._reversePixels=t,this._length=s-e,this._alignToPixels=this.options.alignToPixels}afterUpdate(){N(this.options.afterUpdate,[this])}beforeSetDimensions(){N(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){N(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),N(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){N(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let s,n,a;for(s=0,n=t.length;s<n;s++)a=t[s],a.label=N(e.callback,[a.value,s,t],this)}afterTickToLabelConversion(){N(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){N(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,s=bn(this.ticks.length,t.ticks.maxTicksLimit),n=e.minRotation||0,a=e.maxRotation;let o=n,r,l,c;if(!this._isVisible()||!e.display||n>=a||s<=1||!this.isHorizontal()){this.labelRotation=n;return}const d=this._getLabelSizes(),u=d.widest.width,h=d.highest.height,p=G(this.chart.width-u,0,this.maxWidth);r=t.offset?this.maxWidth/s:p/(s-1),u+6>r&&(r=p/(s-(t.offset?.5:1)),l=this.maxHeight-le(t.grid)-e.padding-vn(t.title,this.chart.options.font),c=Math.sqrt(u*u+h*h),o=Ji(Math.min(Math.asin(G((d.highest.height+6)/r,-1,1)),Math.asin(G(l/c,-1,1))-Math.asin(G(h/c,-1,1)))),o=Math.max(n,Math.min(a,o))),this.labelRotation=o}afterCalculateLabelRotation(){N(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){N(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:s,title:n,grid:a}}=this,o=this._isVisible(),r=this.isHorizontal();if(o){const l=vn(n,e.options.font);if(r?(t.width=this.maxWidth,t.height=le(a)+l):(t.height=this.maxHeight,t.width=le(a)+l),s.display&&this.ticks.length){const{first:c,last:d,widest:u,highest:h}=this._getLabelSizes(),p=s.padding*2,m=lt(this.labelRotation),f=Math.cos(m),g=Math.sin(m);if(r){const x=s.mirror?0:g*u.width+f*h.height;t.height=Math.min(this.maxHeight,t.height+x+p)}else{const x=s.mirror?0:f*u.width+g*h.height;t.width=Math.min(this.maxWidth,t.width+x+p)}this._calculatePadding(c,d,g,f)}}this._handleMargins(),r?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,s,n){const{ticks:{align:a,padding:o},position:r}=this.options,l=this.labelRotation!==0,c=r!=="top"&&this.axis==="x";if(this.isHorizontal()){const d=this.getPixelForTick(0)-this.left,u=this.right-this.getPixelForTick(this.ticks.length-1);let h=0,p=0;l?c?(h=n*t.width,p=s*e.height):(h=s*t.height,p=n*e.width):a==="start"?p=e.width:a==="end"?h=t.width:a!=="inner"&&(h=t.width/2,p=e.width/2),this.paddingLeft=Math.max((h-d+o)*this.width/(this.width-d),0),this.paddingRight=Math.max((p-u+o)*this.width/(this.width-u),0)}else{let d=e.height/2,u=t.height/2;a==="start"?(d=0,u=t.height):a==="end"&&(d=e.height,u=0),this.paddingTop=d+o,this.paddingBottom=u+o}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){N(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return e==="top"||e==="bottom"||t==="x"}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){this.beforeTickToLabelConversion(),this.generateTickLabels(t);let e,s;for(e=0,s=t.length;e<s;e++)I(t[e].label)&&(t.splice(e,1),s--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let s=this.ticks;e<s.length&&(s=yn(s,e)),this._labelSizes=t=this._computeLabelSizes(s,s.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,s){const{ctx:n,_longestTextCache:a}=this,o=[],r=[],l=Math.floor(e/bn(e,s));let c=0,d=0,u,h,p,m,f,g,x,b,y,w,v;for(u=0;u<e;u+=l){if(m=t[u].label,f=this._resolveTickFontOptions(u),n.font=g=f.string,x=a[g]=a[g]||{data:{},gc:[]},b=f.lineHeight,y=w=0,!I(m)&&!$(m))y=ai(n,x.data,x.gc,y,m),w=b;else if($(m))for(h=0,p=m.length;h<p;++h)v=m[h],!I(v)&&!$(v)&&(y=ai(n,x.data,x.gc,y,v),w+=b);o.push(y),r.push(w),c=Math.max(y,c),d=Math.max(w,d)}oc(a,e);const k=o.indexOf(c),_=r.indexOf(d),S=M=>({width:o[M]||0,height:r[M]||0});return{first:S(0),last:S(e-1),widest:S(k),highest:S(_),widths:o,heights:r}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return Yo(this._alignToPixels?Ft(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const s=e[t];return s.$context||(s.$context=lc(this.getContext(),t,s))}return this.$context||(this.$context=rc(this.chart.getContext(),this))}_tickSize(){const t=this.options.ticks,e=lt(this.labelRotation),s=Math.abs(Math.cos(e)),n=Math.abs(Math.sin(e)),a=this._getLabelSizes(),o=t.autoSkipPadding||0,r=a?a.widest.width+o:0,l=a?a.highest.height+o:0;return this.isHorizontal()?l*s>r*n?r/s:l/n:l*n<r*s?l/s:r/n}_isVisible(){const t=this.options.display;return t!=="auto"?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,s=this.chart,n=this.options,{grid:a,position:o,border:r}=n,l=a.offset,c=this.isHorizontal(),u=this.ticks.length+(l?1:0),h=le(a),p=[],m=r.setContext(this.getContext()),f=m.display?m.width:0,g=f/2,x=function(j){return Ft(s,j,f)};let b,y,w,v,k,_,S,M,L,T,P,V;if(o==="top")b=x(this.bottom),_=this.bottom-h,M=b-g,T=x(t.top)+g,V=t.bottom;else if(o==="bottom")b=x(this.top),T=t.top,V=x(t.bottom)-g,_=b+g,M=this.top+h;else if(o==="left")b=x(this.right),k=this.right-h,S=b-g,L=x(t.left)+g,P=t.right;else if(o==="right")b=x(this.left),L=t.left,P=x(t.right)-g,k=b+g,S=this.left+h;else if(e==="x"){if(o==="center")b=x((t.top+t.bottom)/2+.5);else if(C(o)){const j=Object.keys(o)[0],q=o[j];b=x(this.chart.scales[j].getPixelForValue(q))}T=t.top,V=t.bottom,_=b+g,M=_+h}else if(e==="y"){if(o==="center")b=x((t.left+t.right)/2);else if(C(o)){const j=Object.keys(o)[0],q=o[j];b=x(this.chart.scales[j].getPixelForValue(q))}k=b-g,S=k-h,L=t.left,P=t.right}const U=A(n.ticks.maxTicksLimit,u),O=Math.max(1,Math.ceil(u/U));for(y=0;y<u;y+=O){const j=this.getContext(y),q=a.setContext(j),rt=r.setContext(j),K=q.lineWidth,Gt=q.color,Pe=rt.dash||[],Kt=rt.dashOffset,se=q.tickWidth,Bt=q.tickColor,ne=q.tickBorderDash||[],Rt=q.tickBorderDashOffset;w=ac(this,y,l),w!==void 0&&(v=Ft(s,w,K),c?k=S=L=P=v:_=M=T=V=v,p.push({tx1:k,ty1:_,tx2:S,ty2:M,x1:L,y1:T,x2:P,y2:V,width:K,color:Gt,borderDash:Pe,borderDashOffset:Kt,tickWidth:se,tickColor:Bt,tickBorderDash:ne,tickBorderDashOffset:Rt}))}return this._ticksLength=u,this._borderValue=b,p}_computeLabelItems(t){const e=this.axis,s=this.options,{position:n,ticks:a}=s,o=this.isHorizontal(),r=this.ticks,{align:l,crossAlign:c,padding:d,mirror:u}=a,h=le(s.grid),p=h+d,m=u?-d:p,f=-lt(this.labelRotation),g=[];let x,b,y,w,v,k,_,S,M,L,T,P,V="middle";if(n==="top")k=this.bottom-m,_=this._getXAxisLabelAlignment();else if(n==="bottom")k=this.top+m,_=this._getXAxisLabelAlignment();else if(n==="left"){const O=this._getYAxisLabelAlignment(h);_=O.textAlign,v=O.x}else if(n==="right"){const O=this._getYAxisLabelAlignment(h);_=O.textAlign,v=O.x}else if(e==="x"){if(n==="center")k=(t.top+t.bottom)/2+p;else if(C(n)){const O=Object.keys(n)[0],j=n[O];k=this.chart.scales[O].getPixelForValue(j)+p}_=this._getXAxisLabelAlignment()}else if(e==="y"){if(n==="center")v=(t.left+t.right)/2-p;else if(C(n)){const O=Object.keys(n)[0],j=n[O];v=this.chart.scales[O].getPixelForValue(j)}_=this._getYAxisLabelAlignment(h).textAlign}e==="y"&&(l==="start"?V="top":l==="end"&&(V="bottom"));const U=this._getLabelSizes();for(x=0,b=r.length;x<b;++x){y=r[x],w=y.label;const O=a.setContext(this.getContext(x));S=this.getPixelForTick(x)+a.labelOffset,M=this._resolveTickFontOptions(x),L=M.lineHeight,T=$(w)?w.length:1;const j=T/2,q=O.color,rt=O.textStrokeColor,K=O.textStrokeWidth;let Gt=_;o?(v=S,_==="inner"&&(x===b-1?Gt=this.options.reverse?"left":"right":x===0?Gt=this.options.reverse?"right":"left":Gt="center"),n==="top"?c==="near"||f!==0?P=-T*L+L/2:c==="center"?P=-U.highest.height/2-j*L+L:P=-U.highest.height+L/2:c==="near"||f!==0?P=L/2:c==="center"?P=U.highest.height/2-j*L:P=U.highest.height-T*L,u&&(P*=-1),f!==0&&!O.showLabelBackdrop&&(v+=L/2*Math.sin(f))):(k=S,P=(1-T)*L/2);let Pe;if(O.showLabelBackdrop){const Kt=tt(O.backdropPadding),se=U.heights[x],Bt=U.widths[x];let ne=P-Kt.top,Rt=0-Kt.left;switch(V){case"middle":ne-=se/2;break;case"bottom":ne-=se;break}switch(_){case"center":Rt-=Bt/2;break;case"right":Rt-=Bt;break;case"inner":x===b-1?Rt-=Bt:x>0&&(Rt-=Bt/2);break}Pe={left:Rt,top:ne,width:Bt+Kt.width,height:se+Kt.height,color:O.backdropColor}}g.push({label:w,font:M,textOffset:P,options:{rotation:f,color:q,strokeColor:rt,strokeWidth:K,textAlign:Gt,textBaseline:V,translation:[v,k],backdrop:Pe}})}return g}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-lt(this.labelRotation))return t==="top"?"left":"right";let n="center";return e.align==="start"?n="left":e.align==="end"?n="right":e.align==="inner"&&(n="inner"),n}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:s,mirror:n,padding:a}}=this.options,o=this._getLabelSizes(),r=t+a,l=o.widest.width;let c,d;return e==="left"?n?(d=this.right+a,s==="near"?c="left":s==="center"?(c="center",d+=l/2):(c="right",d+=l)):(d=this.right-r,s==="near"?c="right":s==="center"?(c="center",d-=l/2):(c="left",d=this.left)):e==="right"?n?(d=this.left+a,s==="near"?c="right":s==="center"?(c="center",d-=l/2):(c="left",d-=l)):(d=this.left+r,s==="near"?c="left":s==="center"?(c="center",d+=l/2):(c="right",d=this.right)):c="right",{textAlign:c,x:d}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;if(e==="left"||e==="right")return{top:0,left:this.left,bottom:t.height,right:this.right};if(e==="top"||e==="bottom")return{top:this.top,left:0,bottom:this.bottom,right:t.width}}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:s,top:n,width:a,height:o}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(s,n,a,o),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const n=this.ticks.findIndex(a=>a.value===t);return n>=0?e.setContext(this.getContext(n)).lineWidth:0}drawGrid(t){const e=this.options.grid,s=this.ctx,n=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let a,o;const r=(l,c,d)=>{!d.width||!d.color||(s.save(),s.lineWidth=d.width,s.strokeStyle=d.color,s.setLineDash(d.borderDash||[]),s.lineDashOffset=d.borderDashOffset,s.beginPath(),s.moveTo(l.x,l.y),s.lineTo(c.x,c.y),s.stroke(),s.restore())};if(e.display)for(a=0,o=n.length;a<o;++a){const l=n[a];e.drawOnChartArea&&r({x:l.x1,y:l.y1},{x:l.x2,y:l.y2},l),e.drawTicks&&r({x:l.tx1,y:l.ty1},{x:l.tx2,y:l.ty2},{color:l.tickColor,width:l.tickWidth,borderDash:l.tickBorderDash,borderDashOffset:l.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:s,grid:n}}=this,a=s.setContext(this.getContext()),o=s.display?a.width:0;if(!o)return;const r=n.setContext(this.getContext(0)).lineWidth,l=this._borderValue;let c,d,u,h;this.isHorizontal()?(c=Ft(t,this.left,o)-o/2,d=Ft(t,this.right,r)+r/2,u=h=l):(u=Ft(t,this.top,o)-o/2,h=Ft(t,this.bottom,r)+r/2,c=d=l),e.save(),e.lineWidth=a.width,e.strokeStyle=a.color,e.beginPath(),e.moveTo(c,u),e.lineTo(d,h),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const s=this.ctx,n=this._computeLabelArea();n&&ui(s,n);const a=this.getLabelItems(t);for(const o of a){const r=o.options,l=o.font,c=o.label,d=o.textOffset;Yt(s,c,0,d,l,r)}n&&hi(s)}drawTitle(){const{ctx:t,options:{position:e,title:s,reverse:n}}=this;if(!s.display)return;const a=X(s.font),o=tt(s.padding),r=s.align;let l=a.lineHeight/2;e==="bottom"||e==="center"||C(e)?(l+=o.bottom,$(s.text)&&(l+=a.lineHeight*(s.text.length-1))):l+=o.top;const{titleX:c,titleY:d,maxWidth:u,rotation:h}=dc(this,l,e,r);Yt(t,s.text,0,0,a,{color:s.color,maxWidth:u,rotation:h,textAlign:cc(r,e,n),textBaseline:"middle",translation:[c,d]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,s=A(t.grid&&t.grid.z,-1),n=A(t.border&&t.border.z,0);return!this._isVisible()||this.draw!==Xt.prototype.draw?[{z:e,draw:a=>{this.draw(a)}}]:[{z:s,draw:a=>{this.drawBackground(),this.drawGrid(a),this.drawTitle()}},{z:n,draw:()=>{this.drawBorder()}},{z:e,draw:a=>{this.drawLabels(a)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),s=this.axis+"AxisID",n=[];let a,o;for(a=0,o=e.length;a<o;++a){const r=e[a];r[s]===this.id&&(!t||r.type===t)&&n.push(r)}return n}_resolveTickFontOptions(t){const e=this.options.ticks.setContext(this.getContext(t));return X(e.font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class He{constructor(t,e,s){this.type=t,this.scope=e,this.override=s,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let s;pc(e)&&(s=this.register(e));const n=this.items,a=t.id,o=this.scope+"."+a;if(!a)throw new Error("class does not have id: "+t);return a in n||(n[a]=t,uc(t,o,s),this.override&&z.override(t.id,t.overrides)),o}get(t){return this.items[t]}unregister(t){const e=this.items,s=t.id,n=this.scope;s in e&&delete e[s],n&&s in z[n]&&(delete z[n][s],this.override&&delete qt[s])}}function uc(i,t,e){const s=ke(Object.create(null),[e?z.get(e):{},z.get(t),i.defaults]);z.set(t,s),i.defaultRoutes&&hc(t,i.defaultRoutes),i.descriptors&&z.describe(t,i.descriptors)}function hc(i,t){Object.keys(t).forEach(e=>{const s=e.split("."),n=s.pop(),a=[i].concat(s).join("."),o=t[e].split("."),r=o.pop(),l=o.join(".");z.route(a,n,l,r)})}function pc(i){return"id"in i&&"defaults"in i}class fc{constructor(){this.controllers=new He(ct,"datasets",!0),this.elements=new He(ut,"elements"),this.plugins=new He(Object,"plugins"),this.scales=new He(Xt,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,s){[...e].forEach(n=>{const a=s||this._getRegistryForType(n);s||a.isForType(n)||a===this.plugins&&n.id?this._exec(t,a,n):F(n,o=>{const r=s||this._getRegistryForType(o);this._exec(t,r,o)})})}_exec(t,e,s){const n=Ki(t);N(s["before"+n],[],s),e[t](s),N(s["after"+n],[],s)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const s=this._typedRegistries[e];if(s.isForType(t))return s}return this.plugins}_get(t,e,s){const n=e.get(t);if(n===void 0)throw new Error('"'+t+'" is not a registered '+s+".");return n}}var pt=new fc;class gc{constructor(){this._init=void 0}notify(t,e,s,n){if(e==="beforeInit"&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install")),this._init===void 0)return;const a=n?this._descriptors(t).filter(n):this._descriptors(t),o=this._notify(a,t,e,s);return e==="afterDestroy"&&(this._notify(a,t,"stop"),this._notify(this._init,t,"uninstall"),this._init=void 0),o}_notify(t,e,s,n){n=n||{};for(const a of t){const o=a.plugin,r=o[s],l=[e,n,a.options];if(N(r,l,o)===!1&&n.cancelable)return!1}return!0}invalidate(){I(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const s=t&&t.config,n=A(s.options&&s.options.plugins,{}),a=mc(s);return n===!1&&!e?[]:bc(t,a,n,e)}_notifyStateChanges(t){const e=this._oldCache||[],s=this._cache,n=(a,o)=>a.filter(r=>!o.some(l=>r.plugin.id===l.plugin.id));this._notify(n(e,s),t,"stop"),this._notify(n(s,e),t,"start")}}function mc(i){const t={},e=[],s=Object.keys(pt.plugins.items);for(let a=0;a<s.length;a++)e.push(pt.getPlugin(s[a]));const n=i.plugins||[];for(let a=0;a<n.length;a++){const o=n[a];e.indexOf(o)===-1&&(e.push(o),t[o.id]=!0)}return{plugins:e,localIds:t}}function xc(i,t){return!t&&i===!1?null:i===!0?{}:i}function bc(i,{plugins:t,localIds:e},s,n){const a=[],o=i.getContext();for(const r of t){const l=r.id,c=xc(s[l],n);c!==null&&a.push({plugin:r,options:yc(i.config,{plugin:r,local:e[l]},c,o)})}return a}function yc(i,{plugin:t,local:e},s,n){const a=i.pluginScopeKeys(t),o=i.getOptionScopes(s,a);return e&&t.defaults&&o.push(t.defaults),i.createResolver(o,n,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function Oi(i,t){const e=z.datasets[i]||{};return((t.datasets||{})[i]||{}).indexAxis||t.indexAxis||e.indexAxis||"x"}function vc(i,t){let e=i;return i==="_index_"?e=t:i==="_value_"&&(e=t==="x"?"y":"x"),e}function wc(i,t){return i===t?"_index_":"_value_"}function wn(i){if(i==="x"||i==="y"||i==="r")return i}function kc(i){if(i==="top"||i==="bottom")return"x";if(i==="left"||i==="right")return"y"}function Fi(i,...t){if(wn(i))return i;for(const e of t){const s=e.axis||kc(e.position)||i.length>1&&wn(i[0].toLowerCase());if(s)return s}throw new Error(`Cannot determine type of '${i}' axis. Please provide 'axis' or 'position' option.`)}function kn(i,t,e){if(e[t+"AxisID"]===i)return{axis:t}}function _c(i,t){if(t.data&&t.data.datasets){const e=t.data.datasets.filter(s=>s.xAxisID===i||s.yAxisID===i);if(e.length)return kn(i,"x",e[0])||kn(i,"y",e[0])}return{}}function Sc(i,t){const e=qt[i.type]||{scales:{}},s=t.scales||{},n=Oi(i.type,t),a=Object.create(null);return Object.keys(s).forEach(o=>{const r=s[o];if(!C(r))return console.error(`Invalid scale configuration for scale: ${o}`);if(r._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${o}`);const l=Fi(o,r,_c(o,i),z.scales[r.type]),c=wc(l,n),d=e.scales||{};a[o]=me(Object.create(null),[{axis:l},r,d[l],d[c]])}),i.data.datasets.forEach(o=>{const r=o.type||i.type,l=o.indexAxis||Oi(r,t),d=(qt[r]||{}).scales||{};Object.keys(d).forEach(u=>{const h=vc(u,l),p=o[h+"AxisID"]||h;a[p]=a[p]||Object.create(null),me(a[p],[{axis:h},s[p],d[u]])})}),Object.keys(a).forEach(o=>{const r=a[o];me(r,[z.scales[r.type],z.scale])}),a}function $a(i){const t=i.options||(i.options={});t.plugins=A(t.plugins,{}),t.scales=Sc(i,t)}function za(i){return i=i||{},i.datasets=i.datasets||[],i.labels=i.labels||[],i}function Mc(i){return i=i||{},i.data=za(i.data),$a(i),i}const _n=new Map,Va=new Set;function $e(i,t){let e=_n.get(i);return e||(e=t(),_n.set(i,e),Va.add(e)),e}const ce=(i,t,e)=>{const s=Pt(t,e);s!==void 0&&i.add(s)};class Ec{constructor(t){this._config=Mc(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=za(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),$a(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return $e(t,()=>[[`datasets.${t}`,""]])}datasetAnimationScopeKeys(t,e){return $e(`${t}.transition.${e}`,()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]])}datasetElementScopeKeys(t,e){return $e(`${t}-${e}`,()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]])}pluginScopeKeys(t){const e=t.id,s=this.type;return $e(`${s}-plugin-${e}`,()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]])}_cachedScopes(t,e){const s=this._scopeCache;let n=s.get(t);return(!n||e)&&(n=new Map,s.set(t,n)),n}getOptionScopes(t,e,s){const{options:n,type:a}=this,o=this._cachedScopes(t,s),r=o.get(e);if(r)return r;const l=new Set;e.forEach(d=>{t&&(l.add(t),d.forEach(u=>ce(l,t,u))),d.forEach(u=>ce(l,n,u)),d.forEach(u=>ce(l,qt[a]||{},u)),d.forEach(u=>ce(l,z,u)),d.forEach(u=>ce(l,Ci,u))});const c=Array.from(l);return c.length===0&&c.push(Object.create(null)),Va.has(e)&&o.set(e,c),c}chartOptionScopes(){const{options:t,type:e}=this;return[t,qt[e]||{},z.datasets[e]||{},{type:e},z,Ci]}resolveNamedOptions(t,e,s,n=[""]){const a={$shared:!0},{resolver:o,subPrefixes:r}=Sn(this._resolverCache,t,n);let l=o;if(Tc(o,e)){a.$shared=!1,s=It(s)?s():s;const c=this.createResolver(t,s,r);l=ee(o,s,c)}for(const c of e)a[c]=l[c];return a}createResolver(t,e,s=[""],n){const{resolver:a}=Sn(this._resolverCache,t,s);return C(e)?ee(a,e,void 0,n):a}}function Sn(i,t,e){let s=i.get(t);s||(s=new Map,i.set(t,s));const n=e.join();let a=s.get(n);return a||(a={resolver:is(t,e),subPrefixes:e.filter(r=>!r.toLowerCase().includes("hover"))},s.set(n,a)),a}const Lc=i=>C(i)&&Object.getOwnPropertyNames(i).some(t=>It(i[t]));function Tc(i,t){const{isScriptable:e,isIndexable:s}=wa(i);for(const n of t){const a=e(n),o=s(n),r=(o||a)&&i[n];if(a&&(It(r)||Lc(r))||o&&$(r))return!0}return!1}var Dc="4.5.1";const Ac=["top","bottom","left","right","chartArea"];function Mn(i,t){return i==="top"||i==="bottom"||Ac.indexOf(i)===-1&&t==="x"}function En(i,t){return function(e,s){return e[i]===s[i]?e[t]-s[t]:e[i]-s[i]}}function Ln(i){const t=i.chart,e=t.options.animation;t.notifyPlugins("afterRender"),N(e&&e.onComplete,[i],t)}function Pc(i){const t=i.chart,e=t.options.animation;N(e&&e.onProgress,[i],t)}function Wa(i){return as()&&typeof i=="string"?i=document.getElementById(i):i&&i.length&&(i=i[0]),i&&i.canvas&&(i=i.canvas),i}const Qe={},Tn=i=>{const t=Wa(i);return Object.values(Qe).filter(e=>e.canvas===t).pop()};function Ic(i,t,e){const s=Object.keys(i);for(const n of s){const a=+n;if(a>=t){const o=i[n];delete i[n],(e>0||a>t)&&(i[a+e]=o)}}}function Cc(i,t,e,s){return!e||i.type==="mouseout"?null:s?t:i}class at{static register(...t){pt.add(...t),Dn()}static unregister(...t){pt.remove(...t),Dn()}constructor(t,e){const s=this.config=new Ec(e),n=Wa(t),a=Tn(n);if(a)throw new Error("Canvas is already in use. Chart with ID '"+a.id+"' must be destroyed before the canvas with ID '"+a.canvas.id+"' can be reused.");const o=s.createResolver(s.chartOptionScopes(),this.getContext());this.platform=new(s.platform||Jl(n)),this.platform.updateConfig(s);const r=this.platform.acquireContext(n,o.aspectRatio),l=r&&r.canvas,c=l&&l.height,d=l&&l.width;if(this.id=Bo(),this.ctx=r,this.canvas=l,this.width=d,this.height=c,this._options=o,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new gc,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=Jo(u=>this.update(u),o.resizeDelay||0),this._dataChanges=[],Qe[this.id]=this,!r||!l){console.error("Failed to create chart: can't acquire context from the given item");return}yt.listen(this,"complete",Ln),yt.listen(this,"progress",Pc),this._initialize(),this.attached&&this.update()}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:s,height:n,_aspectRatio:a}=this;return I(t)?e&&a?a:n?s/n:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return pt}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():Ks(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return Ys(this.canvas,this.ctx),this}stop(){return yt.stop(this),this}resize(t,e){yt.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const s=this.options,n=this.canvas,a=s.maintainAspectRatio&&this.aspectRatio,o=this.platform.getMaximumSize(n,t,e,a),r=s.devicePixelRatio||this.platform.getDevicePixelRatio(),l=this.width?"resize":"attach";this.width=o.width,this.height=o.height,this._aspectRatio=this.aspectRatio,Ks(this,r,!0)&&(this.notifyPlugins("resize",{size:o}),N(s.onResize,[this,o],this),this.attached&&this._doResize(l)&&this.render())}ensureScalesHaveIDs(){const e=this.options.scales||{};F(e,(s,n)=>{s.id=n})}buildOrUpdateScales(){const t=this.options,e=t.scales,s=this.scales,n=Object.keys(s).reduce((o,r)=>(o[r]=!1,o),{});let a=[];e&&(a=a.concat(Object.keys(e).map(o=>{const r=e[o],l=Fi(o,r),c=l==="r",d=l==="x";return{options:r,dposition:c?"chartArea":d?"bottom":"left",dtype:c?"radialLinear":d?"category":"linear"}}))),F(a,o=>{const r=o.options,l=r.id,c=Fi(l,r),d=A(r.type,o.dtype);(r.position===void 0||Mn(r.position,c)!==Mn(o.dposition))&&(r.position=o.dposition),n[l]=!0;let u=null;if(l in s&&s[l].type===d)u=s[l];else{const h=pt.getScale(d);u=new h({id:l,type:d,ctx:this.ctx,chart:this}),s[u.id]=u}u.init(r,t)}),F(n,(o,r)=>{o||delete s[r]}),F(s,o=>{Z.configure(this,o,o.options),Z.addBox(this,o)})}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,s=t.length;if(t.sort((n,a)=>n.index-a.index),s>e){for(let n=e;n<s;++n)this._destroyDatasetMeta(n);t.splice(e,s-e)}this._sortedMetasets=t.slice(0).sort(En("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach((s,n)=>{e.filter(a=>a===s._dataset).length===0&&this._destroyDatasetMeta(n)})}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let s,n;for(this._removeUnreferencedMetasets(),s=0,n=e.length;s<n;s++){const a=e[s];let o=this.getDatasetMeta(s);const r=a.type||this.config.type;if(o.type&&o.type!==r&&(this._destroyDatasetMeta(s),o=this.getDatasetMeta(s)),o.type=r,o.indexAxis=a.indexAxis||Oi(r,this.options),o.order=a.order||0,o.index=s,o.label=""+a.label,o.visible=this.isDatasetVisible(s),o.controller)o.controller.updateIndex(s),o.controller.linkScales();else{const l=pt.getController(r),{datasetElementType:c,dataElementType:d}=z.datasets[r];Object.assign(l,{dataElementType:pt.getElement(d),datasetElementType:c&&pt.getElement(c)}),o.controller=new l(this,s),t.push(o.controller)}}return this._updateMetasets(),t}_resetElements(){F(this.data.datasets,(t,e)=>{this.getDatasetMeta(e).controller.reset()},this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const s=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),n=this._animationsDisabled=!s.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0})===!1)return;const a=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let o=0;for(let c=0,d=this.data.datasets.length;c<d;c++){const{controller:u}=this.getDatasetMeta(c),h=!n&&a.indexOf(u)===-1;u.buildOrUpdateElements(h),o=Math.max(+u.getMaxOverflow(),o)}o=this._minPadding=s.layout.autoPadding?o:0,this._updateLayout(o),n||F(a,c=>{c.reset()}),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(En("z","_idx"));const{_active:r,_lastEvent:l}=this;l?this._eventHandler(l,!0):r.length&&this._updateHoverStyles(r,r,!0),this.render()}_updateScales(){F(this.scales,t=>{Z.removeBox(this,t)}),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),s=new Set(t.events);(!js(e,s)||!!this._responsiveListeners!==t.responsive)&&(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:s,start:n,count:a}of e){const o=s==="_removeElements"?-a:a;Ic(t,n,o)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,s=a=>new Set(t.filter(o=>o[0]===a).map((o,r)=>r+","+o.splice(1).join(","))),n=s(0);for(let a=1;a<e;a++)if(!js(n,s(a)))return;return Array.from(n).map(a=>a.split(",")).map(a=>({method:a[1],start:+a[2],count:+a[3]}))}_updateLayout(t){if(this.notifyPlugins("beforeLayout",{cancelable:!0})===!1)return;Z.update(this,this.width,this.height,t);const e=this.chartArea,s=e.width<=0||e.height<=0;this._layers=[],F(this.boxes,n=>{s&&n.position==="chartArea"||(n.configure&&n.configure(),this._layers.push(...n._layers()))},this),this._layers.forEach((n,a)=>{n._idx=a}),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})!==!1){for(let e=0,s=this.data.datasets.length;e<s;++e)this.getDatasetMeta(e).controller.configure();for(let e=0,s=this.data.datasets.length;e<s;++e)this._updateDataset(e,It(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const s=this.getDatasetMeta(t),n={meta:s,index:t,mode:e,cancelable:!0};this.notifyPlugins("beforeDatasetUpdate",n)!==!1&&(s.controller._update(e),n.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",n))}render(){this.notifyPlugins("beforeRender",{cancelable:!0})!==!1&&(yt.has(this)?this.attached&&!yt.running(this)&&yt.start(this):(this.draw(),Ln({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:s,height:n}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(s,n)}if(this.clear(),this.width<=0||this.height<=0||this.notifyPlugins("beforeDraw",{cancelable:!0})===!1)return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,s=[];let n,a;for(n=0,a=e.length;n<a;++n){const o=e[n];(!t||o.visible)&&s.push(o)}return s}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0})===!1)return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,s={meta:t,index:t.index,cancelable:!0},n=Ia(this,t);this.notifyPlugins("beforeDatasetDraw",s)!==!1&&(n&&ui(e,n),t.controller.draw(),n&&hi(e),s.cancelable=!1,this.notifyPlugins("afterDatasetDraw",s))}isPointInArea(t){return St(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,s,n){const a=Al.modes[e];return typeof a=="function"?a(this,t,s,n):[]}getDatasetMeta(t){const e=this.data.datasets[t],s=this._metasets;let n=s.filter(a=>a&&a._dataset===e).pop();return n||(n={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},s.push(n)),n}getContext(){return this.$context||(this.$context=Ct(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const s=this.getDatasetMeta(t);return typeof s.hidden=="boolean"?!s.hidden:!e.hidden}setDatasetVisibility(t,e){const s=this.getDatasetMeta(t);s.hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,s){const n=s?"show":"hide",a=this.getDatasetMeta(t),o=a.controller._resolveAnimations(void 0,n);_e(e)?(a.data[e].hidden=!s,this.update()):(this.setDatasetVisibility(t,s),o.update(a,{visible:s}),this.update(r=>r.datasetIndex===t?n:void 0))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),yt.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),Ys(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete Qe[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,s=(a,o)=>{e.addEventListener(this,a,o),t[a]=o},n=(a,o,r)=>{a.offsetX=o,a.offsetY=r,this._eventHandler(a)};F(this.options.events,a=>s(a,n))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,s=(l,c)=>{e.addEventListener(this,l,c),t[l]=c},n=(l,c)=>{t[l]&&(e.removeEventListener(this,l,c),delete t[l])},a=(l,c)=>{this.canvas&&this.resize(l,c)};let o;const r=()=>{n("attach",r),this.attached=!0,this.resize(),s("resize",a),s("detach",o)};o=()=>{this.attached=!1,n("resize",a),this._stop(),this._resize(0,0),s("attach",r)},e.isAttached(this.canvas)?r():o()}unbindEvents(){F(this._listeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._listeners={},F(this._responsiveListeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._responsiveListeners=void 0}updateHoverStyle(t,e,s){const n=s?"set":"remove";let a,o,r,l;for(e==="dataset"&&(a=this.getDatasetMeta(t[0].datasetIndex),a.controller["_"+n+"DatasetHoverStyle"]()),r=0,l=t.length;r<l;++r){o=t[r];const c=o&&this.getDatasetMeta(o.datasetIndex).controller;c&&c[n+"HoverStyle"](o.element,o.datasetIndex,o.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],s=t.map(({datasetIndex:a,index:o})=>{const r=this.getDatasetMeta(a);if(!r)throw new Error("No dataset found at index "+a);return{datasetIndex:a,element:r.data[o],index:o}});!ii(s,e)&&(this._active=s,this._lastEvent=null,this._updateHoverStyles(s,e))}notifyPlugins(t,e,s){return this._plugins.notify(this,t,e,s)}isPluginEnabled(t){return this._plugins._cache.filter(e=>e.plugin.id===t).length===1}_updateHoverStyles(t,e,s){const n=this.options.hover,a=(l,c)=>l.filter(d=>!c.some(u=>d.datasetIndex===u.datasetIndex&&d.index===u.index)),o=a(e,t),r=s?t:a(t,e);o.length&&this.updateHoverStyle(o,n.mode,!1),r.length&&n.mode&&this.updateHoverStyle(r,n.mode,!0)}_eventHandler(t,e){const s={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},n=o=>(o.options.events||this.options.events).includes(t.native.type);if(this.notifyPlugins("beforeEvent",s,n)===!1)return;const a=this._handleEvent(t,e,s.inChartArea);return s.cancelable=!1,this.notifyPlugins("afterEvent",s,n),(a||s.changed)&&this.render(),this}_handleEvent(t,e,s){const{_active:n=[],options:a}=this,o=e,r=this._getActiveElements(t,n,s,o),l=Ho(t),c=Cc(t,this._lastEvent,s,l);s&&(this._lastEvent=null,N(a.onHover,[t,r,this],this),l&&N(a.onClick,[t,r,this],this));const d=!ii(r,n);return(d||e)&&(this._active=r,this._updateHoverStyles(r,n,e)),this._lastEvent=c,d}_getActiveElements(t,e,s,n){if(t.type==="mouseout")return[];if(!s)return e;const a=this.options.hover;return this.getElementsAtEventForMode(t,a.mode,a,n)}}E(at,"defaults",z),E(at,"instances",Qe),E(at,"overrides",qt),E(at,"registry",pt),E(at,"version",Dc),E(at,"getChart",Tn);function Dn(){return F(at.instances,i=>i._plugins.invalidate())}function Bc(i,t,e){const{startAngle:s,x:n,y:a,outerRadius:o,innerRadius:r,options:l}=t,{borderWidth:c,borderJoinStyle:d}=l,u=Math.min(c/o,Q(s-e));if(i.beginPath(),i.arc(n,a,o-c/2,s+u/2,e-u/2),r>0){const h=Math.min(c/r,Q(s-e));i.arc(n,a,r+c/2,e-h/2,s+h/2,!0)}else{const h=Math.min(c/2,o*Q(s-e));if(d==="round")i.arc(n,a,h,e-R/2,s+R/2,!0);else if(d==="bevel"){const p=2*h*h,m=-p*Math.cos(e+R/2)+n,f=-p*Math.sin(e+R/2)+a,g=p*Math.cos(s+R/2)+n,x=p*Math.sin(s+R/2)+a;i.lineTo(m,f),i.lineTo(g,x)}}i.closePath(),i.moveTo(0,0),i.rect(0,0,i.canvas.width,i.canvas.height),i.clip("evenodd")}function Rc(i,t,e){const{startAngle:s,pixelMargin:n,x:a,y:o,outerRadius:r,innerRadius:l}=t;let c=n/r;i.beginPath(),i.arc(a,o,r,s-c,e+c),l>n?(c=n/l,i.arc(a,o,l,e+c,s-c,!0)):i.arc(a,o,n,e+Y,s-Y),i.closePath(),i.clip()}function Oc(i){return es(i,["outerStart","outerEnd","innerStart","innerEnd"])}function Fc(i,t,e,s){const n=Oc(i.options.borderRadius),a=(e-t)/2,o=Math.min(a,s*t/2),r=l=>{const c=(e-Math.min(a,l))*s/2;return G(l,0,Math.min(a,c))};return{outerStart:r(n.outerStart),outerEnd:r(n.outerEnd),innerStart:G(n.innerStart,0,o),innerEnd:G(n.innerEnd,0,o)}}function Qt(i,t,e,s){return{x:e+i*Math.cos(t),y:s+i*Math.sin(t)}}function li(i,t,e,s,n,a){const{x:o,y:r,startAngle:l,pixelMargin:c,innerRadius:d}=t,u=Math.max(t.outerRadius+s+e-c,0),h=d>0?d+s+e+c:0;let p=0;const m=n-l;if(s){const O=d>0?d-s:0,j=u>0?u-s:0,q=(O+j)/2,rt=q!==0?m*q/(q+s):m;p=(m-rt)/2}const f=Math.max(.001,m*u-e/R)/u,g=(m-f)/2,x=l+g+p,b=n-g-p,{outerStart:y,outerEnd:w,innerStart:v,innerEnd:k}=Fc(t,h,u,b-x),_=u-y,S=u-w,M=x+y/_,L=b-w/S,T=h+v,P=h+k,V=x+v/T,U=b-k/P;if(i.beginPath(),a){const O=(M+L)/2;if(i.arc(o,r,u,M,O),i.arc(o,r,u,O,L),w>0){const K=Qt(S,L,o,r);i.arc(K.x,K.y,w,L,b+Y)}const j=Qt(P,b,o,r);if(i.lineTo(j.x,j.y),k>0){const K=Qt(P,U,o,r);i.arc(K.x,K.y,k,b+Y,U+Math.PI)}const q=(b-k/h+(x+v/h))/2;if(i.arc(o,r,h,b-k/h,q,!0),i.arc(o,r,h,q,x+v/h,!0),v>0){const K=Qt(T,V,o,r);i.arc(K.x,K.y,v,V+Math.PI,x-Y)}const rt=Qt(_,x,o,r);if(i.lineTo(rt.x,rt.y),y>0){const K=Qt(_,M,o,r);i.arc(K.x,K.y,y,x-Y,M)}}else{i.moveTo(o,r);const O=Math.cos(M)*u+o,j=Math.sin(M)*u+r;i.lineTo(O,j);const q=Math.cos(L)*u+o,rt=Math.sin(L)*u+r;i.lineTo(q,rt)}i.closePath()}function jc(i,t,e,s,n){const{fullCircles:a,startAngle:o,circumference:r}=t;let l=t.endAngle;if(a){li(i,t,e,s,l,n);for(let c=0;c<a;++c)i.fill();isNaN(r)||(l=o+(r%H||H))}return li(i,t,e,s,l,n),i.fill(),l}function Nc(i,t,e,s,n){const{fullCircles:a,startAngle:o,circumference:r,options:l}=t,{borderWidth:c,borderJoinStyle:d,borderDash:u,borderDashOffset:h,borderRadius:p}=l,m=l.borderAlign==="inner";if(!c)return;i.setLineDash(u||[]),i.lineDashOffset=h,m?(i.lineWidth=c*2,i.lineJoin=d||"round"):(i.lineWidth=c,i.lineJoin=d||"bevel");let f=t.endAngle;if(a){li(i,t,e,s,f,n);for(let g=0;g<a;++g)i.stroke();isNaN(r)||(f=o+(r%H||H))}m&&Rc(i,t,f),l.selfJoin&&f-o>=R&&p===0&&d!=="miter"&&Bc(i,t,f),a||(li(i,t,e,s,f,n),i.stroke())}class pe extends ut{constructor(e){super();E(this,"circumference");E(this,"endAngle");E(this,"fullCircles");E(this,"innerRadius");E(this,"outerRadius");E(this,"pixelMargin");E(this,"startAngle");this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,e&&Object.assign(this,e)}inRange(e,s,n){const a=this.getProps(["x","y"],n),{angle:o,distance:r}=ua(a,{x:e,y:s}),{startAngle:l,endAngle:c,innerRadius:d,outerRadius:u,circumference:h}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],n),p=(this.options.spacing+this.options.borderWidth)/2,m=A(h,c-l),f=Se(o,l,c)&&l!==c,g=m>=H||f,x=kt(r,d+p,u+p);return g&&x}getCenterPoint(e){const{x:s,y:n,startAngle:a,endAngle:o,innerRadius:r,outerRadius:l}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],e),{offset:c,spacing:d}=this.options,u=(a+o)/2,h=(r+l+d+c)/2;return{x:s+Math.cos(u)*h,y:n+Math.sin(u)*h}}tooltipPosition(e){return this.getCenterPoint(e)}draw(e){const{options:s,circumference:n}=this,a=(s.offset||0)/4,o=(s.spacing||0)/2,r=s.circular;if(this.pixelMargin=s.borderAlign==="inner"?.33:0,this.fullCircles=n>H?Math.floor(n/H):0,n===0||this.innerRadius<0||this.outerRadius<0)return;e.save();const l=(this.startAngle+this.endAngle)/2;e.translate(Math.cos(l)*a,Math.sin(l)*a);const c=1-Math.sin(Math.min(R,n||0)),d=a*c;e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,jc(e,this,d,o,r),Nc(e,this,d,o,r),e.restore()}}E(pe,"id","arc"),E(pe,"defaults",{borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0,selfJoin:!1}),E(pe,"defaultRoutes",{backgroundColor:"backgroundColor"}),E(pe,"descriptors",{_scriptable:!0,_indexable:e=>e!=="borderDash"});function Ua(i,t,e=t){i.lineCap=A(e.borderCapStyle,t.borderCapStyle),i.setLineDash(A(e.borderDash,t.borderDash)),i.lineDashOffset=A(e.borderDashOffset,t.borderDashOffset),i.lineJoin=A(e.borderJoinStyle,t.borderJoinStyle),i.lineWidth=A(e.borderWidth,t.borderWidth),i.strokeStyle=A(e.borderColor,t.borderColor)}function Hc(i,t,e){i.lineTo(e.x,e.y)}function $c(i){return i.stepped?cr:i.tension||i.cubicInterpolationMode==="monotone"?dr:Hc}function qa(i,t,e={}){const s=i.length,{start:n=0,end:a=s-1}=e,{start:o,end:r}=t,l=Math.max(n,o),c=Math.min(a,r),d=n<o&&a<o||n>r&&a>r;return{count:s,start:l,loop:t.loop,ilen:c<l&&!d?s+c-l:c-l}}function zc(i,t,e,s){const{points:n,options:a}=t,{count:o,start:r,loop:l,ilen:c}=qa(n,e,s),d=$c(a);let{move:u=!0,reverse:h}=s||{},p,m,f;for(p=0;p<=c;++p)m=n[(r+(h?c-p:p))%o],!m.skip&&(u?(i.moveTo(m.x,m.y),u=!1):d(i,f,m,h,a.stepped),f=m);return l&&(m=n[(r+(h?c:0))%o],d(i,f,m,h,a.stepped)),!!l}function Vc(i,t,e,s){const n=t.points,{count:a,start:o,ilen:r}=qa(n,e,s),{move:l=!0,reverse:c}=s||{};let d=0,u=0,h,p,m,f,g,x;const b=w=>(o+(c?r-w:w))%a,y=()=>{f!==g&&(i.lineTo(d,g),i.lineTo(d,f),i.lineTo(d,x))};for(l&&(p=n[b(0)],i.moveTo(p.x,p.y)),h=0;h<=r;++h){if(p=n[b(h)],p.skip)continue;const w=p.x,v=p.y,k=w|0;k===m?(v<f?f=v:v>g&&(g=v),d=(u*d+w)/++u):(y(),i.lineTo(w,v),m=k,u=0,f=g=v),x=v}y()}function ji(i){const t=i.options,e=t.borderDash&&t.borderDash.length;return!i._decimated&&!i._loop&&!t.tension&&t.cubicInterpolationMode!=="monotone"&&!t.stepped&&!e?Vc:zc}function Wc(i){return i.stepped?zr:i.tension||i.cubicInterpolationMode==="monotone"?Vr:$t}function Uc(i,t,e,s){let n=t._path;n||(n=t._path=new Path2D,t.path(n,e,s)&&n.closePath()),Ua(i,t.options),i.stroke(n)}function qc(i,t,e,s){const{segments:n,options:a}=t,o=ji(t);for(const r of n)Ua(i,a,r.style),i.beginPath(),o(i,t,r,{start:e,end:e+s-1})&&i.closePath(),i.stroke()}const Yc=typeof Path2D=="function";function Xc(i,t,e,s){Yc&&!t.options.segment?Uc(i,t,e,s):qc(i,t,e,s)}class Tt extends ut{constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const s=this.options;if((s.tension||s.cubicInterpolationMode==="monotone")&&!s.stepped&&!this._pointsUpdated){const n=s.spanGaps?this._loop:this._fullLoop;Br(this._points,s,t,n,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=Gr(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,s=t.length;return s&&e[t[s-1].end]}interpolate(t,e){const s=this.options,n=t[e],a=this.points,o=Pa(this,{property:e,start:n,end:n});if(!o.length)return;const r=[],l=Wc(s);let c,d;for(c=0,d=o.length;c<d;++c){const{start:u,end:h}=o[c],p=a[u],m=a[h];if(p===m){r.push(p);continue}const f=Math.abs((n-p[e])/(m[e]-p[e])),g=l(p,m,f,s.stepped);g[e]=t[e],r.push(g)}return r.length===1?r[0]:r}pathSegment(t,e,s){return ji(this)(t,this,e,s)}path(t,e,s){const n=this.segments,a=ji(this);let o=this._loop;e=e||0,s=s||this.points.length-e;for(const r of n)o&=a(t,this,r,{start:e,end:e+s-1});return!!o}draw(t,e,s,n){const a=this.options||{};(this.points||[]).length&&a.borderWidth&&(t.save(),Xc(t,this,s,n),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}E(Tt,"id","line"),E(Tt,"defaults",{borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0}),E(Tt,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"}),E(Tt,"descriptors",{_scriptable:!0,_indexable:t=>t!=="borderDash"&&t!=="fill"});function An(i,t,e,s){const n=i.options,{[e]:a}=i.getProps([e],s);return Math.abs(t-a)<n.radius+n.hitRadius}class Ze extends ut{constructor(e){super();E(this,"parsed");E(this,"skip");E(this,"stop");this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,e&&Object.assign(this,e)}inRange(e,s,n){const a=this.options,{x:o,y:r}=this.getProps(["x","y"],n);return Math.pow(e-o,2)+Math.pow(s-r,2)<Math.pow(a.hitRadius+a.radius,2)}inXRange(e,s){return An(this,e,"x",s)}inYRange(e,s){return An(this,e,"y",s)}getCenterPoint(e){const{x:s,y:n}=this.getProps(["x","y"],e);return{x:s,y:n}}size(e){e=e||this.options||{};let s=e.radius||0;s=Math.max(s,s&&e.hoverRadius||0);const n=s&&e.borderWidth||0;return(s+n)*2}draw(e,s){const n=this.options;this.skip||n.radius<.1||!St(this,s,this.size(n)/2)||(e.strokeStyle=n.borderColor,e.lineWidth=n.borderWidth,e.fillStyle=n.backgroundColor,Bi(e,n,this.x,this.y))}getRange(){const e=this.options||{};return e.radius+e.hitRadius}}E(Ze,"id","point"),E(Ze,"defaults",{borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0}),E(Ze,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});function Ya(i,t){const{x:e,y:s,base:n,width:a,height:o}=i.getProps(["x","y","base","width","height"],t);let r,l,c,d,u;return i.horizontal?(u=o/2,r=Math.min(e,n),l=Math.max(e,n),c=s-u,d=s+u):(u=a/2,r=e-u,l=e+u,c=Math.min(s,n),d=Math.max(s,n)),{left:r,top:c,right:l,bottom:d}}function Dt(i,t,e,s){return i?0:G(t,e,s)}function Gc(i,t,e){const s=i.options.borderWidth,n=i.borderSkipped,a=va(s);return{t:Dt(n.top,a.top,0,e),r:Dt(n.right,a.right,0,t),b:Dt(n.bottom,a.bottom,0,e),l:Dt(n.left,a.left,0,t)}}function Kc(i,t,e){const{enableBorderRadius:s}=i.getProps(["enableBorderRadius"]),n=i.options.borderRadius,a=Wt(n),o=Math.min(t,e),r=i.borderSkipped,l=s||C(n);return{topLeft:Dt(!l||r.top||r.left,a.topLeft,0,o),topRight:Dt(!l||r.top||r.right,a.topRight,0,o),bottomLeft:Dt(!l||r.bottom||r.left,a.bottomLeft,0,o),bottomRight:Dt(!l||r.bottom||r.right,a.bottomRight,0,o)}}function Jc(i){const t=Ya(i),e=t.right-t.left,s=t.bottom-t.top,n=Gc(i,e/2,s/2),a=Kc(i,e/2,s/2);return{outer:{x:t.left,y:t.top,w:e,h:s,radius:a},inner:{x:t.left+n.l,y:t.top+n.t,w:e-n.l-n.r,h:s-n.t-n.b,radius:{topLeft:Math.max(0,a.topLeft-Math.max(n.t,n.l)),topRight:Math.max(0,a.topRight-Math.max(n.t,n.r)),bottomLeft:Math.max(0,a.bottomLeft-Math.max(n.b,n.l)),bottomRight:Math.max(0,a.bottomRight-Math.max(n.b,n.r))}}}}function Li(i,t,e,s){const n=t===null,a=e===null,r=i&&!(n&&a)&&Ya(i,s);return r&&(n||kt(t,r.left,r.right))&&(a||kt(e,r.top,r.bottom))}function Qc(i){return i.topLeft||i.topRight||i.bottomLeft||i.bottomRight}function Zc(i,t){i.rect(t.x,t.y,t.w,t.h)}function Ti(i,t,e={}){const s=i.x!==e.x?-t:0,n=i.y!==e.y?-t:0,a=(i.x+i.w!==e.x+e.w?t:0)-s,o=(i.y+i.h!==e.y+e.h?t:0)-n;return{x:i.x+s,y:i.y+n,w:i.w+a,h:i.h+o,radius:i.radius}}class ti extends ut{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:s,backgroundColor:n}}=this,{inner:a,outer:o}=Jc(this),r=Qc(o.radius)?Me:Zc;t.save(),(o.w!==a.w||o.h!==a.h)&&(t.beginPath(),r(t,Ti(o,e,a)),t.clip(),r(t,Ti(a,-e,o)),t.fillStyle=s,t.fill("evenodd")),t.beginPath(),r(t,Ti(a,e)),t.fillStyle=n,t.fill(),t.restore()}inRange(t,e,s){return Li(this,t,e,s)}inXRange(t,e){return Li(this,t,null,e)}inYRange(t,e){return Li(this,null,t,e)}getCenterPoint(t){const{x:e,y:s,base:n,horizontal:a}=this.getProps(["x","y","base","horizontal"],t);return{x:a?(e+n)/2:e,y:a?s:(s+n)/2}}getRange(t){return t==="x"?this.width/2:this.height/2}}E(ti,"id","bar"),E(ti,"defaults",{borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0}),E(ti,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});var td=Object.freeze({__proto__:null,ArcElement:pe,BarElement:ti,LineElement:Tt,PointElement:Ze});const Ni=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],Pn=Ni.map(i=>i.replace("rgb(","rgba(").replace(")",", 0.5)"));function Xa(i){return Ni[i%Ni.length]}function Ga(i){return Pn[i%Pn.length]}function ed(i,t){return i.borderColor=Xa(t),i.backgroundColor=Ga(t),++t}function id(i,t){return i.backgroundColor=i.data.map(()=>Xa(t++)),t}function sd(i,t){return i.backgroundColor=i.data.map(()=>Ga(t++)),t}function nd(i){let t=0;return(e,s)=>{const n=i.getDatasetMeta(s).controller;n instanceof Vt?t=id(e,t):n instanceof ve?t=sd(e,t):n&&(t=ed(e,t))}}function In(i){let t;for(t in i)if(i[t].borderColor||i[t].backgroundColor)return!0;return!1}function ad(i){return i&&(i.borderColor||i.backgroundColor)}function od(){return z.borderColor!=="rgba(0,0,0,0.1)"||z.backgroundColor!=="rgba(0,0,0,0.1)"}var rd={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(i,t,e){if(!e.enabled)return;const{data:{datasets:s},options:n}=i.config,{elements:a}=n,o=In(s)||ad(n)||a&&In(a)||od();if(!e.forceOverride&&o)return;const r=nd(i);s.forEach(r)}};function ld(i,t,e,s,n){const a=n.samples||s;if(a>=e)return i.slice(t,t+e);const o=[],r=(e-2)/(a-2);let l=0;const c=t+e-1;let d=t,u,h,p,m,f;for(o[l++]=i[d],u=0;u<a-2;u++){let g=0,x=0,b;const y=Math.floor((u+1)*r)+1+t,w=Math.min(Math.floor((u+2)*r)+1,e)+t,v=w-y;for(b=y;b<w;b++)g+=i[b].x,x+=i[b].y;g/=v,x/=v;const k=Math.floor(u*r)+1+t,_=Math.min(Math.floor((u+1)*r)+1,e)+t,{x:S,y:M}=i[d];for(p=m=-1,b=k;b<_;b++)m=.5*Math.abs((S-g)*(i[b].y-M)-(S-i[b].x)*(x-M)),m>p&&(p=m,h=i[b],f=b);o[l++]=h,d=f}return o[l++]=i[c],o}function cd(i,t,e,s){let n=0,a=0,o,r,l,c,d,u,h,p,m,f;const g=[],x=t+e-1,b=i[t].x,w=i[x].x-b;for(o=t;o<t+e;++o){r=i[o],l=(r.x-b)/w*s,c=r.y;const v=l|0;if(v===d)c<m?(m=c,u=o):c>f&&(f=c,h=o),n=(a*n+r.x)/++a;else{const k=o-1;if(!I(u)&&!I(h)){const _=Math.min(u,h),S=Math.max(u,h);_!==p&&_!==k&&g.push({...i[_],x:n}),S!==p&&S!==k&&g.push({...i[S],x:n})}o>0&&k!==p&&g.push(i[k]),g.push(r),d=v,a=0,m=f=c,u=h=p=o}}return g}function Ka(i){if(i._decimated){const t=i._data;delete i._decimated,delete i._data,Object.defineProperty(i,"data",{configurable:!0,enumerable:!0,writable:!0,value:t})}}function Cn(i){i.data.datasets.forEach(t=>{Ka(t)})}function dd(i,t){const e=t.length;let s=0,n;const{iScale:a}=i,{min:o,max:r,minDefined:l,maxDefined:c}=a.getUserBounds();return l&&(s=G(_t(t,a.axis,o).lo,0,e-1)),c?n=G(_t(t,a.axis,r).hi+1,s,e)-s:n=e-s,{start:s,count:n}}var ud={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(i,t,e)=>{if(!e.enabled){Cn(i);return}const s=i.width;i.data.datasets.forEach((n,a)=>{const{_data:o,indexAxis:r}=n,l=i.getDatasetMeta(a),c=o||n.data;if(ue([r,i.options.indexAxis])==="y"||!l.controller.supportsDecimation)return;const d=i.scales[l.xAxisID];if(d.type!=="linear"&&d.type!=="time"||i.options.parsing)return;let{start:u,count:h}=dd(l,c);const p=e.threshold||4*s;if(h<=p){Ka(n);return}I(o)&&(n._data=c,delete n.data,Object.defineProperty(n,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(f){this._data=f}}));let m;switch(e.algorithm){case"lttb":m=ld(c,u,h,s,e);break;case"min-max":m=cd(c,u,h,s);break;default:throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`)}n._decimated=m})},destroy(i){Cn(i)}};function hd(i,t,e){const s=i.segments,n=i.points,a=t.points,o=[];for(const r of s){let{start:l,end:c}=r;c=gi(l,c,n);const d=Hi(e,n[l],n[c],r.loop);if(!t.segments){o.push({source:r,target:d,start:n[l],end:n[c]});continue}const u=Pa(t,d);for(const h of u){const p=Hi(e,a[h.start],a[h.end],h.loop),m=Aa(r,n,p);for(const f of m)o.push({source:f,target:h,start:{[e]:Bn(d,p,"start",Math.max)},end:{[e]:Bn(d,p,"end",Math.min)}})}}return o}function Hi(i,t,e,s){if(s)return;let n=t[i],a=e[i];return i==="angle"&&(n=Q(n),a=Q(a)),{property:i,start:n,end:a}}function pd(i,t){const{x:e=null,y:s=null}=i||{},n=t.points,a=[];return t.segments.forEach(({start:o,end:r})=>{r=gi(o,r,n);const l=n[o],c=n[r];s!==null?(a.push({x:l.x,y:s}),a.push({x:c.x,y:s})):e!==null&&(a.push({x:e,y:l.y}),a.push({x:e,y:c.y}))}),a}function gi(i,t,e){for(;t>i;t--){const s=e[t];if(!isNaN(s.x)&&!isNaN(s.y))break}return t}function Bn(i,t,e,s){return i&&t?s(i[e],t[e]):i?i[e]:t?t[e]:0}function Ja(i,t){let e=[],s=!1;return $(i)?(s=!0,e=i):e=pd(i,t),e.length?new Tt({points:e,options:{tension:0},_loop:s,_fullLoop:s}):null}function Rn(i){return i&&i.fill!==!1}function fd(i,t,e){let n=i[t].fill;const a=[t];let o;if(!e)return n;for(;n!==!1&&a.indexOf(n)===-1;){if(!W(n))return n;if(o=i[n],!o)return!1;if(o.visible)return n;a.push(n),n=o.fill}return!1}function gd(i,t,e){const s=yd(i);if(C(s))return isNaN(s.value)?!1:s;let n=parseFloat(s);return W(n)&&Math.floor(n)===n?md(s[0],t,n,e):["origin","start","end","stack","shape"].indexOf(s)>=0&&s}function md(i,t,e,s){return(i==="-"||i==="+")&&(e=t+e),e===t||e<0||e>=s?!1:e}function xd(i,t){let e=null;return i==="start"?e=t.bottom:i==="end"?e=t.top:C(i)?e=t.getPixelForValue(i.value):t.getBasePixel&&(e=t.getBasePixel()),e}function bd(i,t,e){let s;return i==="start"?s=e:i==="end"?s=t.options.reverse?t.min:t.max:C(i)?s=i.value:s=t.getBaseValue(),s}function yd(i){const t=i.options,e=t.fill;let s=A(e&&e.target,e);return s===void 0&&(s=!!t.backgroundColor),s===!1||s===null?!1:s===!0?"origin":s}function vd(i){const{scale:t,index:e,line:s}=i,n=[],a=s.segments,o=s.points,r=wd(t,e);r.push(Ja({x:null,y:t.bottom},s));for(let l=0;l<a.length;l++){const c=a[l];for(let d=c.start;d<=c.end;d++)kd(n,o[d],r)}return new Tt({points:n,options:{}})}function wd(i,t){const e=[],s=i.getMatchingVisibleMetas("line");for(let n=0;n<s.length;n++){const a=s[n];if(a.index===t)break;a.hidden||e.unshift(a.dataset)}return e}function kd(i,t,e){const s=[];for(let n=0;n<e.length;n++){const a=e[n],{first:o,last:r,point:l}=_d(a,t,"x");if(!(!l||o&&r)){if(o)s.unshift(l);else if(i.push(l),!r)break}}i.push(...s)}function _d(i,t,e){const s=i.interpolate(t,e);if(!s)return{};const n=s[e],a=i.segments,o=i.points;let r=!1,l=!1;for(let c=0;c<a.length;c++){const d=a[c],u=o[d.start][e],h=o[d.end][e];if(kt(n,u,h)){r=n===u,l=n===h;break}}return{first:r,last:l,point:s}}class Qa{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,s){const{x:n,y:a,radius:o}=this;return e=e||{start:0,end:H},t.arc(n,a,o,e.end,e.start,!0),!s.bounds}interpolate(t){const{x:e,y:s,radius:n}=this,a=t.angle;return{x:e+Math.cos(a)*n,y:s+Math.sin(a)*n,angle:a}}}function Sd(i){const{chart:t,fill:e,line:s}=i;if(W(e))return Md(t,e);if(e==="stack")return vd(i);if(e==="shape")return!0;const n=Ed(i);return n instanceof Qa?n:Ja(n,s)}function Md(i,t){const e=i.getDatasetMeta(t);return e&&i.isDatasetVisible(t)?e.dataset:null}function Ed(i){return(i.scale||{}).getPointPositionForValue?Td(i):Ld(i)}function Ld(i){const{scale:t={},fill:e}=i,s=xd(e,t);if(W(s)){const n=t.isHorizontal();return{x:n?s:null,y:n?null:s}}return null}function Td(i){const{scale:t,fill:e}=i,s=t.options,n=t.getLabels().length,a=s.reverse?t.max:t.min,o=bd(e,t,a),r=[];if(s.grid.circular){const l=t.getPointPositionForValue(0,a);return new Qa({x:l.x,y:l.y,radius:t.getDistanceFromCenterForValue(o)})}for(let l=0;l<n;++l)r.push(t.getPointPositionForValue(l,o));return r}function Di(i,t,e){const s=Sd(t),{chart:n,index:a,line:o,scale:r,axis:l}=t,c=o.options,d=c.fill,u=c.backgroundColor,{above:h=u,below:p=u}=d||{},m=n.getDatasetMeta(a),f=Ia(n,m);s&&o.points.length&&(ui(i,e),Dd(i,{line:o,target:s,above:h,below:p,area:e,scale:r,axis:l,clip:f}),hi(i))}function Dd(i,t){const{line:e,target:s,above:n,below:a,area:o,scale:r,clip:l}=t,c=e._loop?"angle":t.axis;i.save();let d=a;a!==n&&(c==="x"?(On(i,s,o.top),Ai(i,{line:e,target:s,color:n,scale:r,property:c,clip:l}),i.restore(),i.save(),On(i,s,o.bottom)):c==="y"&&(Fn(i,s,o.left),Ai(i,{line:e,target:s,color:a,scale:r,property:c,clip:l}),i.restore(),i.save(),Fn(i,s,o.right),d=n)),Ai(i,{line:e,target:s,color:d,scale:r,property:c,clip:l}),i.restore()}function On(i,t,e){const{segments:s,points:n}=t;let a=!0,o=!1;i.beginPath();for(const r of s){const{start:l,end:c}=r,d=n[l],u=n[gi(l,c,n)];a?(i.moveTo(d.x,d.y),a=!1):(i.lineTo(d.x,e),i.lineTo(d.x,d.y)),o=!!t.pathSegment(i,r,{move:o}),o?i.closePath():i.lineTo(u.x,e)}i.lineTo(t.first().x,e),i.closePath(),i.clip()}function Fn(i,t,e){const{segments:s,points:n}=t;let a=!0,o=!1;i.beginPath();for(const r of s){const{start:l,end:c}=r,d=n[l],u=n[gi(l,c,n)];a?(i.moveTo(d.x,d.y),a=!1):(i.lineTo(e,d.y),i.lineTo(d.x,d.y)),o=!!t.pathSegment(i,r,{move:o}),o?i.closePath():i.lineTo(e,u.y)}i.lineTo(e,t.first().y),i.closePath(),i.clip()}function Ai(i,t){const{line:e,target:s,property:n,color:a,scale:o,clip:r}=t,l=hd(e,s,n);for(const{source:c,target:d,start:u,end:h}of l){const{style:{backgroundColor:p=a}={}}=c,m=s!==!0;i.save(),i.fillStyle=p,Ad(i,o,r,m&&Hi(n,u,h)),i.beginPath();const f=!!e.pathSegment(i,c);let g;if(m){f?i.closePath():jn(i,s,h,n);const x=!!s.pathSegment(i,d,{move:f,reverse:!0});g=f&&x,g||jn(i,s,u,n)}i.closePath(),i.fill(g?"evenodd":"nonzero"),i.restore()}}function Ad(i,t,e,s){const n=t.chart.chartArea,{property:a,start:o,end:r}=s||{};if(a==="x"||a==="y"){let l,c,d,u;a==="x"?(l=o,c=n.top,d=r,u=n.bottom):(l=n.left,c=o,d=n.right,u=r),i.beginPath(),e&&(l=Math.max(l,e.left),d=Math.min(d,e.right),c=Math.max(c,e.top),u=Math.min(u,e.bottom)),i.rect(l,c,d-l,u-c),i.clip()}}function jn(i,t,e,s){const n=t.interpolate(e,s);n&&i.lineTo(n.x,n.y)}var Pd={id:"filler",afterDatasetsUpdate(i,t,e){const s=(i.data.datasets||[]).length,n=[];let a,o,r,l;for(o=0;o<s;++o)a=i.getDatasetMeta(o),r=a.dataset,l=null,r&&r.options&&r instanceof Tt&&(l={visible:i.isDatasetVisible(o),index:o,fill:gd(r,o,s),chart:i,axis:a.controller.options.indexAxis,scale:a.vScale,line:r}),a.$filler=l,n.push(l);for(o=0;o<s;++o)l=n[o],!(!l||l.fill===!1)&&(l.fill=fd(n,o,e.propagate))},beforeDraw(i,t,e){const s=e.drawTime==="beforeDraw",n=i.getSortedVisibleDatasetMetas(),a=i.chartArea;for(let o=n.length-1;o>=0;--o){const r=n[o].$filler;r&&(r.line.updateControlPoints(a,r.axis),s&&r.fill&&Di(i.ctx,r,a))}},beforeDatasetsDraw(i,t,e){if(e.drawTime!=="beforeDatasetsDraw")return;const s=i.getSortedVisibleDatasetMetas();for(let n=s.length-1;n>=0;--n){const a=s[n].$filler;Rn(a)&&Di(i.ctx,a,i.chartArea)}},beforeDatasetDraw(i,t,e){const s=t.meta.$filler;!Rn(s)||e.drawTime!=="beforeDatasetDraw"||Di(i.ctx,s,i.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const Nn=(i,t)=>{let{boxHeight:e=t,boxWidth:s=t}=i;return i.usePointStyle&&(e=Math.min(e,t),s=i.pointStyleWidth||Math.min(s,t)),{boxWidth:s,boxHeight:e,itemHeight:Math.max(t,e)}},Id=(i,t)=>i!==null&&t!==null&&i.datasetIndex===t.datasetIndex&&i.index===t.index;class Hn extends ut{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,s){this.maxWidth=t,this.maxHeight=e,this._margins=s,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=N(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter(s=>t.filter(s,this.chart.data))),t.sort&&(e=e.sort((s,n)=>t.sort(s,n,this.chart.data))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display){this.width=this.height=0;return}const s=t.labels,n=X(s.font),a=n.size,o=this._computeTitleHeight(),{boxWidth:r,itemHeight:l}=Nn(s,a);let c,d;e.font=n.string,this.isHorizontal()?(c=this.maxWidth,d=this._fitRows(o,a,r,l)+10):(d=this.maxHeight,c=this._fitCols(o,n,r,l)+10),this.width=Math.min(c,t.maxWidth||this.maxWidth),this.height=Math.min(d,t.maxHeight||this.maxHeight)}_fitRows(t,e,s,n){const{ctx:a,maxWidth:o,options:{labels:{padding:r}}}=this,l=this.legendHitBoxes=[],c=this.lineWidths=[0],d=n+r;let u=t;a.textAlign="left",a.textBaseline="middle";let h=-1,p=-d;return this.legendItems.forEach((m,f)=>{const g=s+e/2+a.measureText(m.text).width;(f===0||c[c.length-1]+g+2*r>o)&&(u+=d,c[c.length-(f>0?0:1)]=0,p+=d,h++),l[f]={left:0,top:p,row:h,width:g,height:n},c[c.length-1]+=g+r}),u}_fitCols(t,e,s,n){const{ctx:a,maxHeight:o,options:{labels:{padding:r}}}=this,l=this.legendHitBoxes=[],c=this.columnSizes=[],d=o-t;let u=r,h=0,p=0,m=0,f=0;return this.legendItems.forEach((g,x)=>{const{itemWidth:b,itemHeight:y}=Cd(s,e,a,g,n);x>0&&p+y+2*r>d&&(u+=h+r,c.push({width:h,height:p}),m+=h+r,f++,h=p=0),l[x]={left:m,top:p,col:f,width:b,height:y},h=Math.max(h,b),p+=y+r}),u+=h,c.push({width:h,height:p}),u}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:s,labels:{padding:n},rtl:a}}=this,o=Zt(a,this.left,this.width);if(this.isHorizontal()){let r=0,l=J(s,this.left+n,this.right-this.lineWidths[r]);for(const c of e)r!==c.row&&(r=c.row,l=J(s,this.left+n,this.right-this.lineWidths[r])),c.top+=this.top+t+n,c.left=o.leftForLtr(o.x(l),c.width),l+=c.width+n}else{let r=0,l=J(s,this.top+t+n,this.bottom-this.columnSizes[r].height);for(const c of e)c.col!==r&&(r=c.col,l=J(s,this.top+t+n,this.bottom-this.columnSizes[r].height)),c.top=l,c.left+=this.left+n,c.left=o.leftForLtr(o.x(c.left),c.width),l+=c.height+n}}isHorizontal(){return this.options.position==="top"||this.options.position==="bottom"}draw(){if(this.options.display){const t=this.ctx;ui(t,this),this._draw(),hi(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:s,ctx:n}=this,{align:a,labels:o}=t,r=z.color,l=Zt(t.rtl,this.left,this.width),c=X(o.font),{padding:d}=o,u=c.size,h=u/2;let p;this.drawTitle(),n.textAlign=l.textAlign("left"),n.textBaseline="middle",n.lineWidth=.5,n.font=c.string;const{boxWidth:m,boxHeight:f,itemHeight:g}=Nn(o,u),x=function(k,_,S){if(isNaN(m)||m<=0||isNaN(f)||f<0)return;n.save();const M=A(S.lineWidth,1);if(n.fillStyle=A(S.fillStyle,r),n.lineCap=A(S.lineCap,"butt"),n.lineDashOffset=A(S.lineDashOffset,0),n.lineJoin=A(S.lineJoin,"miter"),n.lineWidth=M,n.strokeStyle=A(S.strokeStyle,r),n.setLineDash(A(S.lineDash,[])),o.usePointStyle){const L={radius:f*Math.SQRT2/2,pointStyle:S.pointStyle,rotation:S.rotation,borderWidth:M},T=l.xPlus(k,m/2),P=_+h;ya(n,L,T,P,o.pointStyleWidth&&m)}else{const L=_+Math.max((u-f)/2,0),T=l.leftForLtr(k,m),P=Wt(S.borderRadius);n.beginPath(),Object.values(P).some(V=>V!==0)?Me(n,{x:T,y:L,w:m,h:f,radius:P}):n.rect(T,L,m,f),n.fill(),M!==0&&n.stroke()}n.restore()},b=function(k,_,S){Yt(n,S.text,k,_+g/2,c,{strikethrough:S.hidden,textAlign:l.textAlign(S.textAlign)})},y=this.isHorizontal(),w=this._computeTitleHeight();y?p={x:J(a,this.left+d,this.right-s[0]),y:this.top+d+w,line:0}:p={x:this.left+d,y:J(a,this.top+w+d,this.bottom-e[0].height),line:0},La(this.ctx,t.textDirection);const v=g+d;this.legendItems.forEach((k,_)=>{n.strokeStyle=k.fontColor,n.fillStyle=k.fontColor;const S=n.measureText(k.text).width,M=l.textAlign(k.textAlign||(k.textAlign=o.textAlign)),L=m+h+S;let T=p.x,P=p.y;l.setWidth(this.width),y?_>0&&T+L+d>this.right&&(P=p.y+=v,p.line++,T=p.x=J(a,this.left+d,this.right-s[p.line])):_>0&&P+v>this.bottom&&(T=p.x=T+e[p.line].width+d,p.line++,P=p.y=J(a,this.top+w+d,this.bottom-e[p.line].height));const V=l.x(T);if(x(V,P,k),T=Qo(M,T+m+h,y?T+L:this.right,t.rtl),b(l.x(T),P,k),y)p.x+=L+d;else if(typeof k.text!="string"){const U=c.lineHeight;p.y+=Za(k,U)+d}else p.y+=v}),Ta(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,s=X(e.font),n=tt(e.padding);if(!e.display)return;const a=Zt(t.rtl,this.left,this.width),o=this.ctx,r=e.position,l=s.size/2,c=n.top+l;let d,u=this.left,h=this.width;if(this.isHorizontal())h=Math.max(...this.lineWidths),d=this.top+c,u=J(t.align,u,this.right-h);else{const m=this.columnSizes.reduce((f,g)=>Math.max(f,g.height),0);d=c+J(t.align,this.top,this.bottom-m-t.labels.padding-this._computeTitleHeight())}const p=J(r,u,u+h);o.textAlign=a.textAlign(Zi(r)),o.textBaseline="middle",o.strokeStyle=e.color,o.fillStyle=e.color,o.font=s.string,Yt(o,e.text,p,d,s)}_computeTitleHeight(){const t=this.options.title,e=X(t.font),s=tt(t.padding);return t.display?e.lineHeight+s.height:0}_getLegendItemAt(t,e){let s,n,a;if(kt(t,this.left,this.right)&&kt(e,this.top,this.bottom)){for(a=this.legendHitBoxes,s=0;s<a.length;++s)if(n=a[s],kt(t,n.left,n.left+n.width)&&kt(e,n.top,n.top+n.height))return this.legendItems[s]}return null}handleEvent(t){const e=this.options;if(!Od(t.type,e))return;const s=this._getLegendItemAt(t.x,t.y);if(t.type==="mousemove"||t.type==="mouseout"){const n=this._hoveredItem,a=Id(n,s);n&&!a&&N(e.onLeave,[t,n,this],this),this._hoveredItem=s,s&&!a&&N(e.onHover,[t,s,this],this)}else s&&N(e.onClick,[t,s,this],this)}}function Cd(i,t,e,s,n){const a=Bd(s,i,t,e),o=Rd(n,s,t.lineHeight);return{itemWidth:a,itemHeight:o}}function Bd(i,t,e,s){let n=i.text;return n&&typeof n!="string"&&(n=n.reduce((a,o)=>a.length>o.length?a:o)),t+e.size/2+s.measureText(n).width}function Rd(i,t,e){let s=i;return typeof t.text!="string"&&(s=Za(t,e)),s}function Za(i,t){const e=i.text?i.text.length:0;return t*e}function Od(i,t){return!!((i==="mousemove"||i==="mouseout")&&(t.onHover||t.onLeave)||t.onClick&&(i==="click"||i==="mouseup"))}var Fd={id:"legend",_element:Hn,start(i,t,e){const s=i.legend=new Hn({ctx:i.ctx,options:e,chart:i});Z.configure(i,s,e),Z.addBox(i,s)},stop(i){Z.removeBox(i,i.legend),delete i.legend},beforeUpdate(i,t,e){const s=i.legend;Z.configure(i,s,e),s.options=e},afterUpdate(i){const t=i.legend;t.buildLabels(),t.adjustHitBoxes()},afterEvent(i,t){t.replay||i.legend.handleEvent(t.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(i,t,e){const s=t.datasetIndex,n=e.chart;n.isDatasetVisible(s)?(n.hide(s),t.hidden=!0):(n.show(s),t.hidden=!1)},onHover:null,onLeave:null,labels:{color:i=>i.chart.options.color,boxWidth:40,padding:10,generateLabels(i){const t=i.data.datasets,{labels:{usePointStyle:e,pointStyle:s,textAlign:n,color:a,useBorderRadius:o,borderRadius:r}}=i.legend.options;return i._getSortedDatasetMetas().map(l=>{const c=l.controller.getStyle(e?0:void 0),d=tt(c.borderWidth);return{text:t[l.index].label,fillStyle:c.backgroundColor,fontColor:a,hidden:!l.visible,lineCap:c.borderCapStyle,lineDash:c.borderDash,lineDashOffset:c.borderDashOffset,lineJoin:c.borderJoinStyle,lineWidth:(d.width+d.height)/4,strokeStyle:c.borderColor,pointStyle:s||c.pointStyle,rotation:c.rotation,textAlign:n||c.textAlign,borderRadius:o&&(r||c.borderRadius),datasetIndex:l.index}},this)}},title:{color:i=>i.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:i=>!i.startsWith("on"),labels:{_scriptable:i=>!["generateLabels","filter","sort"].includes(i)}}};class ls extends ut{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const s=this.options;if(this.left=0,this.top=0,!s.display){this.width=this.height=this.right=this.bottom=0;return}this.width=this.right=t,this.height=this.bottom=e;const n=$(s.text)?s.text.length:1;this._padding=tt(s.padding);const a=n*X(s.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=a:this.width=a}isHorizontal(){const t=this.options.position;return t==="top"||t==="bottom"}_drawArgs(t){const{top:e,left:s,bottom:n,right:a,options:o}=this,r=o.align;let l=0,c,d,u;return this.isHorizontal()?(d=J(r,s,a),u=e+t,c=a-s):(o.position==="left"?(d=s+t,u=J(r,n,e),l=R*-.5):(d=a-t,u=J(r,e,n),l=R*.5),c=n-e),{titleX:d,titleY:u,maxWidth:c,rotation:l}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const s=X(e.font),a=s.lineHeight/2+this._padding.top,{titleX:o,titleY:r,maxWidth:l,rotation:c}=this._drawArgs(a);Yt(t,e.text,0,0,s,{color:e.color,maxWidth:l,rotation:c,textAlign:Zi(e.align),textBaseline:"middle",translation:[o,r]})}}function jd(i,t){const e=new ls({ctx:i.ctx,options:t,chart:i});Z.configure(i,e,t),Z.addBox(i,e),i.titleBlock=e}var Nd={id:"title",_element:ls,start(i,t,e){jd(i,e)},stop(i){const t=i.titleBlock;Z.removeBox(i,t),delete i.titleBlock},beforeUpdate(i,t,e){const s=i.titleBlock;Z.configure(i,s,e),s.options=e},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const ze=new WeakMap;var Hd={id:"subtitle",start(i,t,e){const s=new ls({ctx:i.ctx,options:e,chart:i});Z.configure(i,s,e),Z.addBox(i,s),ze.set(i,s)},stop(i){Z.removeBox(i,ze.get(i)),ze.delete(i)},beforeUpdate(i,t,e){const s=ze.get(i);Z.configure(i,s,e),s.options=e},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const fe={average(i){if(!i.length)return!1;let t,e,s=new Set,n=0,a=0;for(t=0,e=i.length;t<e;++t){const r=i[t].element;if(r&&r.hasValue()){const l=r.tooltipPosition();s.add(l.x),n+=l.y,++a}}return a===0||s.size===0?!1:{x:[...s].reduce((r,l)=>r+l)/s.size,y:n/a}},nearest(i,t){if(!i.length)return!1;let e=t.x,s=t.y,n=Number.POSITIVE_INFINITY,a,o,r;for(a=0,o=i.length;a<o;++a){const l=i[a].element;if(l&&l.hasValue()){const c=l.getCenterPoint(),d=Ii(t,c);d<n&&(n=d,r=l)}}if(r){const l=r.tooltipPosition();e=l.x,s=l.y}return{x:e,y:s}}};function ht(i,t){return t&&($(t)?Array.prototype.push.apply(i,t):i.push(t)),i}function vt(i){return(typeof i=="string"||i instanceof String)&&i.indexOf(`
`)>-1?i.split(`
`):i}function $d(i,t){const{element:e,datasetIndex:s,index:n}=t,a=i.getDatasetMeta(s).controller,{label:o,value:r}=a.getLabelAndValue(n);return{chart:i,label:o,parsed:a.getParsed(n),raw:i.data.datasets[s].data[n],formattedValue:r,dataset:a.getDataset(),dataIndex:n,datasetIndex:s,element:e}}function $n(i,t){const e=i.chart.ctx,{body:s,footer:n,title:a}=i,{boxWidth:o,boxHeight:r}=t,l=X(t.bodyFont),c=X(t.titleFont),d=X(t.footerFont),u=a.length,h=n.length,p=s.length,m=tt(t.padding);let f=m.height,g=0,x=s.reduce((w,v)=>w+v.before.length+v.lines.length+v.after.length,0);if(x+=i.beforeBody.length+i.afterBody.length,u&&(f+=u*c.lineHeight+(u-1)*t.titleSpacing+t.titleMarginBottom),x){const w=t.displayColors?Math.max(r,l.lineHeight):l.lineHeight;f+=p*w+(x-p)*l.lineHeight+(x-1)*t.bodySpacing}h&&(f+=t.footerMarginTop+h*d.lineHeight+(h-1)*t.footerSpacing);let b=0;const y=function(w){g=Math.max(g,e.measureText(w).width+b)};return e.save(),e.font=c.string,F(i.title,y),e.font=l.string,F(i.beforeBody.concat(i.afterBody),y),b=t.displayColors?o+2+t.boxPadding:0,F(s,w=>{F(w.before,y),F(w.lines,y),F(w.after,y)}),b=0,e.font=d.string,F(i.footer,y),e.restore(),g+=m.width,{width:g,height:f}}function zd(i,t){const{y:e,height:s}=t;return e<s/2?"top":e>i.height-s/2?"bottom":"center"}function Vd(i,t,e,s){const{x:n,width:a}=s,o=e.caretSize+e.caretPadding;if(i==="left"&&n+a+o>t.width||i==="right"&&n-a-o<0)return!0}function Wd(i,t,e,s){const{x:n,width:a}=e,{width:o,chartArea:{left:r,right:l}}=i;let c="center";return s==="center"?c=n<=(r+l)/2?"left":"right":n<=a/2?c="left":n>=o-a/2&&(c="right"),Vd(c,i,t,e)&&(c="center"),c}function zn(i,t,e){const s=e.yAlign||t.yAlign||zd(i,e);return{xAlign:e.xAlign||t.xAlign||Wd(i,t,e,s),yAlign:s}}function Ud(i,t){let{x:e,width:s}=i;return t==="right"?e-=s:t==="center"&&(e-=s/2),e}function qd(i,t,e){let{y:s,height:n}=i;return t==="top"?s+=e:t==="bottom"?s-=n+e:s-=n/2,s}function Vn(i,t,e,s){const{caretSize:n,caretPadding:a,cornerRadius:o}=i,{xAlign:r,yAlign:l}=e,c=n+a,{topLeft:d,topRight:u,bottomLeft:h,bottomRight:p}=Wt(o);let m=Ud(t,r);const f=qd(t,l,c);return l==="center"?r==="left"?m+=c:r==="right"&&(m-=c):r==="left"?m-=Math.max(d,h)+n:r==="right"&&(m+=Math.max(u,p)+n),{x:G(m,0,s.width-t.width),y:G(f,0,s.height-t.height)}}function Ve(i,t,e){const s=tt(e.padding);return t==="center"?i.x+i.width/2:t==="right"?i.x+i.width-s.right:i.x+s.left}function Wn(i){return ht([],vt(i))}function Yd(i,t,e){return Ct(i,{tooltip:t,tooltipItems:e,type:"tooltip"})}function Un(i,t){const e=t&&t.dataset&&t.dataset.tooltip&&t.dataset.tooltip.callbacks;return e?i.override(e):i}const to={beforeTitle:xt,title(i){if(i.length>0){const t=i[0],e=t.chart.data.labels,s=e?e.length:0;if(this&&this.options&&this.options.mode==="dataset")return t.dataset.label||"";if(t.label)return t.label;if(s>0&&t.dataIndex<s)return e[t.dataIndex]}return""},afterTitle:xt,beforeBody:xt,beforeLabel:xt,label(i){if(this&&this.options&&this.options.mode==="dataset")return i.label+": "+i.formattedValue||i.formattedValue;let t=i.dataset.label||"";t&&(t+=": ");const e=i.formattedValue;return I(e)||(t+=e),t},labelColor(i){const e=i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(i){const e=i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:xt,afterBody:xt,beforeFooter:xt,footer:xt,afterFooter:xt};function it(i,t,e,s){const n=i[t].call(e,s);return typeof n>"u"?to[t].call(e,s):n}class $i extends ut{constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,s=this.options.setContext(this.getContext()),n=s.enabled&&e.options.animation&&s.animations,a=new Ca(this.chart,n);return n._cacheable&&(this._cachedAnimations=Object.freeze(a)),a}getContext(){return this.$context||(this.$context=Yd(this.chart.getContext(),this,this._tooltipItems))}getTitle(t,e){const{callbacks:s}=e,n=it(s,"beforeTitle",this,t),a=it(s,"title",this,t),o=it(s,"afterTitle",this,t);let r=[];return r=ht(r,vt(n)),r=ht(r,vt(a)),r=ht(r,vt(o)),r}getBeforeBody(t,e){return Wn(it(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:s}=e,n=[];return F(t,a=>{const o={before:[],lines:[],after:[]},r=Un(s,a);ht(o.before,vt(it(r,"beforeLabel",this,a))),ht(o.lines,it(r,"label",this,a)),ht(o.after,vt(it(r,"afterLabel",this,a))),n.push(o)}),n}getAfterBody(t,e){return Wn(it(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:s}=e,n=it(s,"beforeFooter",this,t),a=it(s,"footer",this,t),o=it(s,"afterFooter",this,t);let r=[];return r=ht(r,vt(n)),r=ht(r,vt(a)),r=ht(r,vt(o)),r}_createItems(t){const e=this._active,s=this.chart.data,n=[],a=[],o=[];let r=[],l,c;for(l=0,c=e.length;l<c;++l)r.push($d(this.chart,e[l]));return t.filter&&(r=r.filter((d,u,h)=>t.filter(d,u,h,s))),t.itemSort&&(r=r.sort((d,u)=>t.itemSort(d,u,s))),F(r,d=>{const u=Un(t.callbacks,d);n.push(it(u,"labelColor",this,d)),a.push(it(u,"labelPointStyle",this,d)),o.push(it(u,"labelTextColor",this,d))}),this.labelColors=n,this.labelPointStyles=a,this.labelTextColors=o,this.dataPoints=r,r}update(t,e){const s=this.options.setContext(this.getContext()),n=this._active;let a,o=[];if(!n.length)this.opacity!==0&&(a={opacity:0});else{const r=fe[s.position].call(this,n,this._eventPosition);o=this._createItems(s),this.title=this.getTitle(o,s),this.beforeBody=this.getBeforeBody(o,s),this.body=this.getBody(o,s),this.afterBody=this.getAfterBody(o,s),this.footer=this.getFooter(o,s);const l=this._size=$n(this,s),c=Object.assign({},r,l),d=zn(this.chart,s,c),u=Vn(s,c,d,this.chart);this.xAlign=d.xAlign,this.yAlign=d.yAlign,a={opacity:1,x:u.x,y:u.y,width:l.width,height:l.height,caretX:r.x,caretY:r.y}}this._tooltipItems=o,this.$context=void 0,a&&this._resolveAnimations().update(this,a),t&&s.external&&s.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,s,n){const a=this.getCaretPosition(t,s,n);e.lineTo(a.x1,a.y1),e.lineTo(a.x2,a.y2),e.lineTo(a.x3,a.y3)}getCaretPosition(t,e,s){const{xAlign:n,yAlign:a}=this,{caretSize:o,cornerRadius:r}=s,{topLeft:l,topRight:c,bottomLeft:d,bottomRight:u}=Wt(r),{x:h,y:p}=t,{width:m,height:f}=e;let g,x,b,y,w,v;return a==="center"?(w=p+f/2,n==="left"?(g=h,x=g-o,y=w+o,v=w-o):(g=h+m,x=g+o,y=w-o,v=w+o),b=g):(n==="left"?x=h+Math.max(l,d)+o:n==="right"?x=h+m-Math.max(c,u)-o:x=this.caretX,a==="top"?(y=p,w=y-o,g=x-o,b=x+o):(y=p+f,w=y+o,g=x+o,b=x-o),v=y),{x1:g,x2:x,x3:b,y1:y,y2:w,y3:v}}drawTitle(t,e,s){const n=this.title,a=n.length;let o,r,l;if(a){const c=Zt(s.rtl,this.x,this.width);for(t.x=Ve(this,s.titleAlign,s),e.textAlign=c.textAlign(s.titleAlign),e.textBaseline="middle",o=X(s.titleFont),r=s.titleSpacing,e.fillStyle=s.titleColor,e.font=o.string,l=0;l<a;++l)e.fillText(n[l],c.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+r,l+1===a&&(t.y+=s.titleMarginBottom-r)}}_drawColorBox(t,e,s,n,a){const o=this.labelColors[s],r=this.labelPointStyles[s],{boxHeight:l,boxWidth:c}=a,d=X(a.bodyFont),u=Ve(this,"left",a),h=n.x(u),p=l<d.lineHeight?(d.lineHeight-l)/2:0,m=e.y+p;if(a.usePointStyle){const f={radius:Math.min(c,l)/2,pointStyle:r.pointStyle,rotation:r.rotation,borderWidth:1},g=n.leftForLtr(h,c)+c/2,x=m+l/2;t.strokeStyle=a.multiKeyBackground,t.fillStyle=a.multiKeyBackground,Bi(t,f,g,x),t.strokeStyle=o.borderColor,t.fillStyle=o.backgroundColor,Bi(t,f,g,x)}else{t.lineWidth=C(o.borderWidth)?Math.max(...Object.values(o.borderWidth)):o.borderWidth||1,t.strokeStyle=o.borderColor,t.setLineDash(o.borderDash||[]),t.lineDashOffset=o.borderDashOffset||0;const f=n.leftForLtr(h,c),g=n.leftForLtr(n.xPlus(h,1),c-2),x=Wt(o.borderRadius);Object.values(x).some(b=>b!==0)?(t.beginPath(),t.fillStyle=a.multiKeyBackground,Me(t,{x:f,y:m,w:c,h:l,radius:x}),t.fill(),t.stroke(),t.fillStyle=o.backgroundColor,t.beginPath(),Me(t,{x:g,y:m+1,w:c-2,h:l-2,radius:x}),t.fill()):(t.fillStyle=a.multiKeyBackground,t.fillRect(f,m,c,l),t.strokeRect(f,m,c,l),t.fillStyle=o.backgroundColor,t.fillRect(g,m+1,c-2,l-2))}t.fillStyle=this.labelTextColors[s]}drawBody(t,e,s){const{body:n}=this,{bodySpacing:a,bodyAlign:o,displayColors:r,boxHeight:l,boxWidth:c,boxPadding:d}=s,u=X(s.bodyFont);let h=u.lineHeight,p=0;const m=Zt(s.rtl,this.x,this.width),f=function(S){e.fillText(S,m.x(t.x+p),t.y+h/2),t.y+=h+a},g=m.textAlign(o);let x,b,y,w,v,k,_;for(e.textAlign=o,e.textBaseline="middle",e.font=u.string,t.x=Ve(this,g,s),e.fillStyle=s.bodyColor,F(this.beforeBody,f),p=r&&g!=="right"?o==="center"?c/2+d:c+2+d:0,w=0,k=n.length;w<k;++w){for(x=n[w],b=this.labelTextColors[w],e.fillStyle=b,F(x.before,f),y=x.lines,r&&y.length&&(this._drawColorBox(e,t,w,m,s),h=Math.max(u.lineHeight,l)),v=0,_=y.length;v<_;++v)f(y[v]),h=u.lineHeight;F(x.after,f)}p=0,h=u.lineHeight,F(this.afterBody,f),t.y-=a}drawFooter(t,e,s){const n=this.footer,a=n.length;let o,r;if(a){const l=Zt(s.rtl,this.x,this.width);for(t.x=Ve(this,s.footerAlign,s),t.y+=s.footerMarginTop,e.textAlign=l.textAlign(s.footerAlign),e.textBaseline="middle",o=X(s.footerFont),e.fillStyle=s.footerColor,e.font=o.string,r=0;r<a;++r)e.fillText(n[r],l.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+s.footerSpacing}}drawBackground(t,e,s,n){const{xAlign:a,yAlign:o}=this,{x:r,y:l}=t,{width:c,height:d}=s,{topLeft:u,topRight:h,bottomLeft:p,bottomRight:m}=Wt(n.cornerRadius);e.fillStyle=n.backgroundColor,e.strokeStyle=n.borderColor,e.lineWidth=n.borderWidth,e.beginPath(),e.moveTo(r+u,l),o==="top"&&this.drawCaret(t,e,s,n),e.lineTo(r+c-h,l),e.quadraticCurveTo(r+c,l,r+c,l+h),o==="center"&&a==="right"&&this.drawCaret(t,e,s,n),e.lineTo(r+c,l+d-m),e.quadraticCurveTo(r+c,l+d,r+c-m,l+d),o==="bottom"&&this.drawCaret(t,e,s,n),e.lineTo(r+p,l+d),e.quadraticCurveTo(r,l+d,r,l+d-p),o==="center"&&a==="left"&&this.drawCaret(t,e,s,n),e.lineTo(r,l+u),e.quadraticCurveTo(r,l,r+u,l),e.closePath(),e.fill(),n.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,s=this.$animations,n=s&&s.x,a=s&&s.y;if(n||a){const o=fe[t.position].call(this,this._active,this._eventPosition);if(!o)return;const r=this._size=$n(this,t),l=Object.assign({},o,this._size),c=zn(e,t,l),d=Vn(t,l,c,e);(n._to!==d.x||a._to!==d.y)&&(this.xAlign=c.xAlign,this.yAlign=c.yAlign,this.width=r.width,this.height=r.height,this.caretX=o.x,this.caretY=o.y,this._resolveAnimations().update(this,d))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let s=this.opacity;if(!s)return;this._updateAnimationTarget(e);const n={width:this.width,height:this.height},a={x:this.x,y:this.y};s=Math.abs(s)<.001?0:s;const o=tt(e.padding),r=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&r&&(t.save(),t.globalAlpha=s,this.drawBackground(a,t,n,e),La(t,e.textDirection),a.y+=o.top,this.drawTitle(a,t,e),this.drawBody(a,t,e),this.drawFooter(a,t,e),Ta(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const s=this._active,n=t.map(({datasetIndex:r,index:l})=>{const c=this.chart.getDatasetMeta(r);if(!c)throw new Error("Cannot find a dataset at index "+r);return{datasetIndex:r,element:c.data[l],index:l}}),a=!ii(s,n),o=this._positionChanged(n,e);(a||o)&&(this._active=n,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,s=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const n=this.options,a=this._active||[],o=this._getActiveElements(t,a,e,s),r=this._positionChanged(o,t),l=e||!ii(o,a)||r;return l&&(this._active=o,(n.enabled||n.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),l}_getActiveElements(t,e,s,n){const a=this.options;if(t.type==="mouseout")return[];if(!n)return e.filter(r=>this.chart.data.datasets[r.datasetIndex]&&this.chart.getDatasetMeta(r.datasetIndex).controller.getParsed(r.index)!==void 0);const o=this.chart.getElementsAtEventForMode(t,a.mode,a,s);return a.reverse&&o.reverse(),o}_positionChanged(t,e){const{caretX:s,caretY:n,options:a}=this,o=fe[a.position].call(this,t,e);return o!==!1&&(s!==o.x||n!==o.y)}}E($i,"positioners",fe);var Xd={id:"tooltip",_element:$i,positioners:fe,afterInit(i,t,e){e&&(i.tooltip=new $i({chart:i,options:e}))},beforeUpdate(i,t,e){i.tooltip&&i.tooltip.initialize(e)},reset(i,t,e){i.tooltip&&i.tooltip.initialize(e)},afterDraw(i){const t=i.tooltip;if(t&&t._willRender()){const e={tooltip:t};if(i.notifyPlugins("beforeTooltipDraw",{...e,cancelable:!0})===!1)return;t.draw(i.ctx),i.notifyPlugins("afterTooltipDraw",e)}},afterEvent(i,t){if(i.tooltip){const e=t.replay;i.tooltip.handleEvent(t.event,e,t.inChartArea)&&(t.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(i,t)=>t.bodyFont.size,boxWidth:(i,t)=>t.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:to},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:i=>i!=="filter"&&i!=="itemSort"&&i!=="external",_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},Gd=Object.freeze({__proto__:null,Colors:rd,Decimation:ud,Filler:Pd,Legend:Fd,SubTitle:Hd,Title:Nd,Tooltip:Xd});const Kd=(i,t,e,s)=>(typeof t=="string"?(e=i.push(t)-1,s.unshift({index:e,label:t})):isNaN(t)&&(e=null),e);function Jd(i,t,e,s){const n=i.indexOf(t);if(n===-1)return Kd(i,t,e,s);const a=i.lastIndexOf(t);return n!==a?e:n}const Qd=(i,t)=>i===null?null:G(Math.round(i),0,t);function qn(i){const t=this.getLabels();return i>=0&&i<t.length?t[i]:i}class zi extends Xt{constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const s=this.getLabels();for(const{index:n,label:a}of e)s[n]===a&&s.splice(n,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(I(t))return null;const s=this.getLabels();return e=isFinite(e)&&s[e]===t?e:Jd(s,t,A(e,t),this._addedLabels),Qd(e,s.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:s,max:n}=this.getMinMax(!0);this.options.bounds==="ticks"&&(t||(s=0),e||(n=this.getLabels().length-1)),this.min=s,this.max=n}buildTicks(){const t=this.min,e=this.max,s=this.options.offset,n=[];let a=this.getLabels();a=t===0&&e===a.length-1?a:a.slice(t,e+1),this._valueRange=Math.max(a.length-(s?0:1),1),this._startValue=this.min-(s?.5:0);for(let o=t;o<=e;o++)n.push({value:o});return n}getLabelForValue(t){return qn.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return typeof t!="number"&&(t=this.parse(t)),t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}}E(zi,"id","category"),E(zi,"defaults",{ticks:{callback:qn}});function Zd(i,t){const e=[],{bounds:n,step:a,min:o,max:r,precision:l,count:c,maxTicks:d,maxDigits:u,includeBounds:h}=i,p=a||1,m=d-1,{min:f,max:g}=t,x=!I(o),b=!I(r),y=!I(c),w=(g-f)/(u+1);let v=Hs((g-f)/m/p)*p,k,_,S,M;if(v<1e-14&&!x&&!b)return[{value:f},{value:g}];M=Math.ceil(g/v)-Math.floor(f/v),M>m&&(v=Hs(M*v/m/p)*p),I(l)||(k=Math.pow(10,l),v=Math.ceil(v*k)/k),n==="ticks"?(_=Math.floor(f/v)*v,S=Math.ceil(g/v)*v):(_=f,S=g),x&&b&&a&&Uo((r-o)/a,v/1e3)?(M=Math.round(Math.min((r-o)/v,d)),v=(r-o)/M,_=o,S=r):y?(_=x?o:_,S=b?r:S,M=c-1,v=(S-_)/M):(M=(S-_)/v,xe(M,Math.round(M),v/1e3)?M=Math.round(M):M=Math.ceil(M));const L=Math.max($s(v),$s(_));k=Math.pow(10,I(l)?L:l),_=Math.round(_*k)/k,S=Math.round(S*k)/k;let T=0;for(x&&(h&&_!==o?(e.push({value:o}),_<o&&T++,xe(Math.round((_+T*v)*k)/k,o,Yn(o,w,i))&&T++):_<o&&T++);T<M;++T){const P=Math.round((_+T*v)*k)/k;if(b&&P>r)break;e.push({value:P})}return b&&h&&S!==r?e.length&&xe(e[e.length-1].value,r,Yn(r,w,i))?e[e.length-1].value=r:e.push({value:r}):(!b||S===r)&&e.push({value:S}),e}function Yn(i,t,{horizontal:e,minRotation:s}){const n=lt(s),a=(e?Math.sin(n):Math.cos(n))||.001,o=.75*t*(""+i).length;return Math.min(t/a,o)}class ci extends Xt{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return I(t)||(typeof t=="number"||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:s}=this.getUserBounds();let{min:n,max:a}=this;const o=l=>n=e?n:l,r=l=>a=s?a:l;if(t){const l=ft(n),c=ft(a);l<0&&c<0?r(0):l>0&&c>0&&o(0)}if(n===a){let l=a===0?1:Math.abs(a*.05);r(a+l),t||o(n-l)}this.min=n,this.max=a}getTickLimit(){const t=this.options.ticks;let{maxTicksLimit:e,stepSize:s}=t,n;return s?(n=Math.ceil(this.max/s)-Math.floor(this.min/s)+1,n>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${n} ticks. Limiting to 1000.`),n=1e3)):(n=this.computeTickLimit(),e=e||11),e&&(n=Math.min(e,n)),n}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let s=this.getTickLimit();s=Math.max(2,s);const n={maxTicks:s,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:e.includeBounds!==!1},a=this._range||this,o=Zd(n,a);return t.bounds==="ticks"&&da(o,this,"value"),t.reverse?(o.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),o}configure(){const t=this.ticks;let e=this.min,s=this.max;if(super.configure(),this.options.offset&&t.length){const n=(s-e)/Math.max(t.length-1,1)/2;e-=n,s+=n}this._startValue=e,this._endValue=s,this._valueRange=s-e}getLabelForValue(t){return Ae(t,this.chart.options.locale,this.options.ticks.format)}}class Vi extends ci{determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=W(t)?t:0,this.max=W(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,s=lt(this.options.ticks.minRotation),n=(t?Math.sin(s):Math.cos(s))||.001,a=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,a.lineHeight/n))}getPixelForValue(t){return t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}E(Vi,"id","linear"),E(Vi,"defaults",{ticks:{callback:di.formatters.numeric}});const Le=i=>Math.floor(Et(i)),Nt=(i,t)=>Math.pow(10,Le(i)+t);function Xn(i){return i/Math.pow(10,Le(i))===1}function Gn(i,t,e){const s=Math.pow(10,e),n=Math.floor(i/s);return Math.ceil(t/s)-n}function tu(i,t){const e=t-i;let s=Le(e);for(;Gn(i,t,s)>10;)s++;for(;Gn(i,t,s)<10;)s--;return Math.min(s,Le(i))}function eu(i,{min:t,max:e}){t=nt(i.min,t);const s=[],n=Le(t);let a=tu(t,e),o=a<0?Math.pow(10,Math.abs(a)):1;const r=Math.pow(10,a),l=n>a?Math.pow(10,n):0,c=Math.round((t-l)*o)/o,d=Math.floor((t-l)/r/10)*r*10;let u=Math.floor((c-d)/Math.pow(10,a)),h=nt(i.min,Math.round((l+d+u*Math.pow(10,a))*o)/o);for(;h<e;)s.push({value:h,major:Xn(h),significand:u}),u>=10?u=u<15?15:20:u++,u>=20&&(a++,u=2,o=a>=0?1:o),h=Math.round((l+d+u*Math.pow(10,a))*o)/o;const p=nt(i.max,h);return s.push({value:p,major:Xn(p),significand:u}),s}class Wi extends Xt{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const s=ci.prototype.parse.apply(this,[t,e]);if(s===0){this._zero=!0;return}return W(s)&&s>0?s:null}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=W(t)?Math.max(0,t):null,this.max=W(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!W(this._userMin)&&(this.min=t===Nt(this.min,0)?Nt(this.min,-1):Nt(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let s=this.min,n=this.max;const a=r=>s=t?s:r,o=r=>n=e?n:r;s===n&&(s<=0?(a(1),o(10)):(a(Nt(s,-1)),o(Nt(n,1)))),s<=0&&a(Nt(n,-1)),n<=0&&o(Nt(s,1)),this.min=s,this.max=n}buildTicks(){const t=this.options,e={min:this._userMin,max:this._userMax},s=eu(e,this);return t.bounds==="ticks"&&da(s,this,"value"),t.reverse?(s.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),s}getLabelForValue(t){return t===void 0?"0":Ae(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=Et(t),this._valueRange=Et(this.max)-Et(t)}getPixelForValue(t){return(t===void 0||t===0)&&(t=this.min),t===null||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(Et(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}E(Wi,"id","logarithmic"),E(Wi,"defaults",{ticks:{callback:di.formatters.logarithmic,major:{enabled:!0}}});function Ui(i){const t=i.ticks;if(t.display&&i.display){const e=tt(t.backdropPadding);return A(t.font&&t.font.size,z.font.size)+e.height}return 0}function iu(i,t,e){return e=$(e)?e:[e],{w:lr(i,t.string,e),h:e.length*t.lineHeight}}function Kn(i,t,e,s,n){return i===s||i===n?{start:t-e/2,end:t+e/2}:i<s||i>n?{start:t-e,end:t}:{start:t,end:t+e}}function su(i){const t={l:i.left+i._padding.left,r:i.right-i._padding.right,t:i.top+i._padding.top,b:i.bottom-i._padding.bottom},e=Object.assign({},t),s=[],n=[],a=i._pointLabels.length,o=i.options.pointLabels,r=o.centerPointLabels?R/a:0;for(let l=0;l<a;l++){const c=o.setContext(i.getPointLabelContext(l));n[l]=c.padding;const d=i.getPointPosition(l,i.drawingArea+n[l],r),u=X(c.font),h=iu(i.ctx,u,i._pointLabels[l]);s[l]=h;const p=Q(i.getIndexAngle(l)+r),m=Math.round(Ji(p)),f=Kn(m,d.x,h.w,0,180),g=Kn(m,d.y,h.h,90,270);nu(e,t,p,f,g)}i.setCenterPoint(t.l-e.l,e.r-t.r,t.t-e.t,e.b-t.b),i._pointLabelItems=ru(i,s,n)}function nu(i,t,e,s,n){const a=Math.abs(Math.sin(e)),o=Math.abs(Math.cos(e));let r=0,l=0;s.start<t.l?(r=(t.l-s.start)/a,i.l=Math.min(i.l,t.l-r)):s.end>t.r&&(r=(s.end-t.r)/a,i.r=Math.max(i.r,t.r+r)),n.start<t.t?(l=(t.t-n.start)/o,i.t=Math.min(i.t,t.t-l)):n.end>t.b&&(l=(n.end-t.b)/o,i.b=Math.max(i.b,t.b+l))}function au(i,t,e){const s=i.drawingArea,{extra:n,additionalAngle:a,padding:o,size:r}=e,l=i.getPointPosition(t,s+n+o,a),c=Math.round(Ji(Q(l.angle+Y))),d=du(l.y,r.h,c),u=lu(c),h=cu(l.x,r.w,u);return{visible:!0,x:l.x,y:d,textAlign:u,left:h,top:d,right:h+r.w,bottom:d+r.h}}function ou(i,t){if(!t)return!0;const{left:e,top:s,right:n,bottom:a}=i;return!(St({x:e,y:s},t)||St({x:e,y:a},t)||St({x:n,y:s},t)||St({x:n,y:a},t))}function ru(i,t,e){const s=[],n=i._pointLabels.length,a=i.options,{centerPointLabels:o,display:r}=a.pointLabels,l={extra:Ui(a)/2,additionalAngle:o?R/n:0};let c;for(let d=0;d<n;d++){l.padding=e[d],l.size=t[d];const u=au(i,d,l);s.push(u),r==="auto"&&(u.visible=ou(u,c),u.visible&&(c=u))}return s}function lu(i){return i===0||i===180?"center":i<180?"left":"right"}function cu(i,t,e){return e==="right"?i-=t:e==="center"&&(i-=t/2),i}function du(i,t,e){return e===90||e===270?i-=t/2:(e>270||e<90)&&(i-=t),i}function uu(i,t,e){const{left:s,top:n,right:a,bottom:o}=e,{backdropColor:r}=t;if(!I(r)){const l=Wt(t.borderRadius),c=tt(t.backdropPadding);i.fillStyle=r;const d=s-c.left,u=n-c.top,h=a-s+c.width,p=o-n+c.height;Object.values(l).some(m=>m!==0)?(i.beginPath(),Me(i,{x:d,y:u,w:h,h:p,radius:l}),i.fill()):i.fillRect(d,u,h,p)}}function hu(i,t){const{ctx:e,options:{pointLabels:s}}=i;for(let n=t-1;n>=0;n--){const a=i._pointLabelItems[n];if(!a.visible)continue;const o=s.setContext(i.getPointLabelContext(n));uu(e,o,a);const r=X(o.font),{x:l,y:c,textAlign:d}=a;Yt(e,i._pointLabels[n],l,c+r.lineHeight/2,r,{color:o.color,textAlign:d,textBaseline:"middle"})}}function eo(i,t,e,s){const{ctx:n}=i;if(e)n.arc(i.xCenter,i.yCenter,t,0,H);else{let a=i.getPointPosition(0,t);n.moveTo(a.x,a.y);for(let o=1;o<s;o++)a=i.getPointPosition(o,t),n.lineTo(a.x,a.y)}}function pu(i,t,e,s,n){const a=i.ctx,o=t.circular,{color:r,lineWidth:l}=t;!o&&!s||!r||!l||e<0||(a.save(),a.strokeStyle=r,a.lineWidth=l,a.setLineDash(n.dash||[]),a.lineDashOffset=n.dashOffset,a.beginPath(),eo(i,e,o,s),a.closePath(),a.stroke(),a.restore())}function fu(i,t,e){return Ct(i,{label:e,index:t,type:"pointLabel"})}class ge extends ci{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=tt(Ui(this.options)/2),e=this.width=this.maxWidth-t.width,s=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+s/2+t.top),this.drawingArea=Math.floor(Math.min(e,s)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=W(t)&&!isNaN(t)?t:0,this.max=W(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Ui(this.options))}generateTickLabels(t){ci.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map((e,s)=>{const n=N(this.options.pointLabels.callback,[e,s],this);return n||n===0?n:""}).filter((e,s)=>this.chart.getDataVisibility(s))}fit(){const t=this.options;t.display&&t.pointLabels.display?su(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,s,n){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((s-n)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,s,n))}getIndexAngle(t){const e=H/(this._pointLabels.length||1),s=this.options.startAngle||0;return Q(t*e+lt(s))}getDistanceFromCenterForValue(t){if(I(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(I(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const s=e[t];return fu(this.getContext(),t,s)}}getPointPosition(t,e,s=0){const n=this.getIndexAngle(t)-Y+s;return{x:Math.cos(n)*e+this.xCenter,y:Math.sin(n)*e+this.yCenter,angle:n}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:s,right:n,bottom:a}=this._pointLabelItems[t];return{left:e,top:s,right:n,bottom:a}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const s=this.ctx;s.save(),s.beginPath(),eo(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),s.closePath(),s.fillStyle=t,s.fill(),s.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:s,grid:n,border:a}=e,o=this._pointLabels.length;let r,l,c;if(e.pointLabels.display&&hu(this,o),n.display&&this.ticks.forEach((d,u)=>{if(u!==0||u===0&&this.min<0){l=this.getDistanceFromCenterForValue(d.value);const h=this.getContext(u),p=n.setContext(h),m=a.setContext(h);pu(this,p,l,o,m)}}),s.display){for(t.save(),r=o-1;r>=0;r--){const d=s.setContext(this.getPointLabelContext(r)),{color:u,lineWidth:h}=d;!h||!u||(t.lineWidth=h,t.strokeStyle=u,t.setLineDash(d.borderDash),t.lineDashOffset=d.borderDashOffset,l=this.getDistanceFromCenterForValue(e.reverse?this.min:this.max),c=this.getPointPosition(r,l),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(c.x,c.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,s=e.ticks;if(!s.display)return;const n=this.getIndexAngle(0);let a,o;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(n),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach((r,l)=>{if(l===0&&this.min>=0&&!e.reverse)return;const c=s.setContext(this.getContext(l)),d=X(c.font);if(a=this.getDistanceFromCenterForValue(this.ticks[l].value),c.showLabelBackdrop){t.font=d.string,o=t.measureText(r.label).width,t.fillStyle=c.backdropColor;const u=tt(c.backdropPadding);t.fillRect(-o/2-u.left,-a-d.size/2-u.top,o+u.width,d.size+u.height)}Yt(t,r.label,0,-a,d,{color:c.color,strokeColor:c.textStrokeColor,strokeWidth:c.textStrokeWidth})}),t.restore()}drawTitle(){}}E(ge,"id","radialLinear"),E(ge,"defaults",{display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:di.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback(t){return t},padding:5,centerPointLabels:!1}}),E(ge,"defaultRoutes",{"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"}),E(ge,"descriptors",{angleLines:{_fallback:"grid"}});const mi={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},st=Object.keys(mi);function Jn(i,t){return i-t}function Qn(i,t){if(I(t))return null;const e=i._adapter,{parser:s,round:n,isoWeekday:a}=i._parseOpts;let o=t;return typeof s=="function"&&(o=s(o)),W(o)||(o=typeof s=="string"?e.parse(o,s):e.parse(o)),o===null?null:(n&&(o=n==="week"&&(te(a)||a===!0)?e.startOf(o,"isoWeek",a):e.startOf(o,n)),+o)}function Zn(i,t,e,s){const n=st.length;for(let a=st.indexOf(i);a<n-1;++a){const o=mi[st[a]],r=o.steps?o.steps:Number.MAX_SAFE_INTEGER;if(o.common&&Math.ceil((e-t)/(r*o.size))<=s)return st[a]}return st[n-1]}function gu(i,t,e,s,n){for(let a=st.length-1;a>=st.indexOf(e);a--){const o=st[a];if(mi[o].common&&i._adapter.diff(n,s,o)>=t-1)return o}return st[e?st.indexOf(e):0]}function mu(i){for(let t=st.indexOf(i)+1,e=st.length;t<e;++t)if(mi[st[t]].common)return st[t]}function ta(i,t,e){if(!e)i[t]=!0;else if(e.length){const{lo:s,hi:n}=Qi(e,t),a=e[s]>=t?e[s]:e[n];i[a]=!0}}function xu(i,t,e,s){const n=i._adapter,a=+n.startOf(t[0].value,s),o=t[t.length-1].value;let r,l;for(r=a;r<=o;r=+n.add(r,1,s))l=e[r],l>=0&&(t[l].major=!0);return t}function ea(i,t,e){const s=[],n={},a=t.length;let o,r;for(o=0;o<a;++o)r=t[o],n[r]=o,s.push({value:r,major:!1});return a===0||!e?s:xu(i,s,n,e)}class Te extends Xt{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const s=t.time||(t.time={}),n=this._adapter=new Ml._date(t.adapters.date);n.init(e),me(s.displayFormats,n.formats()),this._parseOpts={parser:s.parser,round:s.round,isoWeekday:s.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return t===void 0?null:Qn(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,s=t.time.unit||"day";let{min:n,max:a,minDefined:o,maxDefined:r}=this.getUserBounds();function l(c){!o&&!isNaN(c.min)&&(n=Math.min(n,c.min)),!r&&!isNaN(c.max)&&(a=Math.max(a,c.max))}(!o||!r)&&(l(this._getLabelBounds()),(t.bounds!=="ticks"||t.ticks.source!=="labels")&&l(this.getMinMax(!1))),n=W(n)&&!isNaN(n)?n:+e.startOf(Date.now(),s),a=W(a)&&!isNaN(a)?a:+e.endOf(Date.now(),s)+1,this.min=Math.min(n,a-1),this.max=Math.max(n+1,a)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],s=t[t.length-1]),{min:e,max:s}}buildTicks(){const t=this.options,e=t.time,s=t.ticks,n=s.source==="labels"?this.getLabelTimestamps():this._generate();t.bounds==="ticks"&&n.length&&(this.min=this._userMin||n[0],this.max=this._userMax||n[n.length-1]);const a=this.min,o=this.max,r=Go(n,a,o);return this._unit=e.unit||(s.autoSkip?Zn(e.minUnit,this.min,this.max,this._getLabelCapacity(a)):gu(this,r.length,e.minUnit,this.min,this.max)),this._majorUnit=!s.major.enabled||this._unit==="year"?void 0:mu(this._unit),this.initOffsets(n),t.reverse&&r.reverse(),ea(this,r,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map(t=>+t.value))}initOffsets(t=[]){let e=0,s=0,n,a;this.options.offset&&t.length&&(n=this.getDecimalForValue(t[0]),t.length===1?e=1-n:e=(this.getDecimalForValue(t[1])-n)/2,a=this.getDecimalForValue(t[t.length-1]),t.length===1?s=a:s=(a-this.getDecimalForValue(t[t.length-2]))/2);const o=t.length<3?.5:.25;e=G(e,0,o),s=G(s,0,o),this._offsets={start:e,end:s,factor:1/(e+1+s)}}_generate(){const t=this._adapter,e=this.min,s=this.max,n=this.options,a=n.time,o=a.unit||Zn(a.minUnit,e,s,this._getLabelCapacity(e)),r=A(n.ticks.stepSize,1),l=o==="week"?a.isoWeekday:!1,c=te(l)||l===!0,d={};let u=e,h,p;if(c&&(u=+t.startOf(u,"isoWeek",l)),u=+t.startOf(u,c?"day":o),t.diff(s,e,o)>1e5*r)throw new Error(e+" and "+s+" are too far apart with stepSize of "+r+" "+o);const m=n.ticks.source==="data"&&this.getDataTimestamps();for(h=u,p=0;h<s;h=+t.add(h,r,o),p++)ta(d,h,m);return(h===s||n.bounds==="ticks"||p===1)&&ta(d,h,m),Object.keys(d).sort(Jn).map(f=>+f)}getLabelForValue(t){const e=this._adapter,s=this.options.time;return s.tooltipFormat?e.format(t,s.tooltipFormat):e.format(t,s.displayFormats.datetime)}format(t,e){const n=this.options.time.displayFormats,a=this._unit,o=e||n[a];return this._adapter.format(t,o)}_tickFormatFunction(t,e,s,n){const a=this.options,o=a.ticks.callback;if(o)return N(o,[t,e,s],this);const r=a.time.displayFormats,l=this._unit,c=this._majorUnit,d=l&&r[l],u=c&&r[c],h=s[e],p=c&&u&&h&&h.major;return this._adapter.format(t,n||(p?u:d))}generateTickLabels(t){let e,s,n;for(e=0,s=t.length;e<s;++e)n=t[e],n.label=this._tickFormatFunction(n.value,e,t)}getDecimalForValue(t){return t===null?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,s=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+s)*e.factor)}getValueForPixel(t){const e=this._offsets,s=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+s*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,s=this.ctx.measureText(t).width,n=lt(this.isHorizontal()?e.maxRotation:e.minRotation),a=Math.cos(n),o=Math.sin(n),r=this._resolveTickFontOptions(0).size;return{w:s*a+r*o,h:s*o+r*a}}_getLabelCapacity(t){const e=this.options.time,s=e.displayFormats,n=s[e.unit]||s.millisecond,a=this._tickFormatFunction(t,0,ea(this,[t],this._majorUnit),n),o=this._getLabelSize(a),r=Math.floor(this.isHorizontal()?this.width/o.w:this.height/o.h)-1;return r>0?r:1}getDataTimestamps(){let t=this._cache.data||[],e,s;if(t.length)return t;const n=this.getMatchingVisibleMetas();if(this._normalized&&n.length)return this._cache.data=n[0].controller.getAllParsedValues(this);for(e=0,s=n.length;e<s;++e)t=t.concat(n[e].controller.getAllParsedValues(this));return this._cache.data=this.normalize(t)}getLabelTimestamps(){const t=this._cache.labels||[];let e,s;if(t.length)return t;const n=this.getLabels();for(e=0,s=n.length;e<s;++e)t.push(Qn(this,n[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return pa(t.sort(Jn))}}E(Te,"id","time"),E(Te,"defaults",{bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}});function We(i,t,e){let s=0,n=i.length-1,a,o,r,l;e?(t>=i[s].pos&&t<=i[n].pos&&({lo:s,hi:n}=_t(i,"pos",t)),{pos:a,time:r}=i[s],{pos:o,time:l}=i[n]):(t>=i[s].time&&t<=i[n].time&&({lo:s,hi:n}=_t(i,"time",t)),{time:a,pos:r}=i[s],{time:o,pos:l}=i[n]);const c=o-a;return c?r+(l-r)*(t-a)/c:r}class qi extends Te{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=We(e,this.min),this._tableRange=We(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:s}=this,n=[],a=[];let o,r,l,c,d;for(o=0,r=t.length;o<r;++o)c=t[o],c>=e&&c<=s&&n.push(c);if(n.length<2)return[{time:e,pos:0},{time:s,pos:1}];for(o=0,r=n.length;o<r;++o)d=n[o+1],l=n[o-1],c=n[o],Math.round((d+l)/2)!==c&&a.push({time:c,pos:o/(r-1)});return a}_generate(){const t=this.min,e=this.max;let s=super.getDataTimestamps();return(!s.includes(t)||!s.length)&&s.splice(0,0,t),(!s.includes(e)||s.length===1)&&s.push(e),s.sort((n,a)=>n-a)}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),s=this.getLabelTimestamps();return e.length&&s.length?t=this.normalize(e.concat(s)):t=e.length?e:s,t=this._cache.all=t,t}getDecimalForValue(t){return(We(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,s=this.getDecimalForPixel(t)/e.factor-e.end;return We(this._table,s*this._tableRange+this._minPos,!0)}}E(qi,"id","timeseries"),E(qi,"defaults",Te.defaults);var bu=Object.freeze({__proto__:null,CategoryScale:zi,LinearScale:Vi,LogarithmicScale:Wi,RadialLinearScale:ge,TimeScale:Te,TimeSeriesScale:qi});const yu=[Sl,td,Gd,bu];at.register(...yu);const Ue={render:()=>`
    <div class="ui-page-shell">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
        <div>
          <h1 class="ui-page-title mb-4">Analytics Dashboard</h1>
        </div>

        <!-- DATE RANGE FILTERS -->
        <div class="flex items-center gap-4 flex-wrap">
          <div class="group relative">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 px-1 group-hover:text-primary transition-colors">From</label>
            <input type="date" id="filterFrom" class="ui-input px-4 py-3 rounded-xl text-[13px] font-semibold">
          </div>
          <div class="group relative">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 px-1 group-hover:text-primary transition-colors">To</label>
            <input type="date" id="filterTo" class="ui-input px-4 py-3 rounded-xl text-[13px] font-semibold">
          </div>
          <div class="self-end">
            <button id="applyFiltersBtn" class="ui-button-primary px-8 py-3 rounded-xl text-[14px]">
              <i class="fa-solid fa-chart-line opacity-80"></i> Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div id="loadingState" class="flex flex-col items-center justify-center py-40 text-center">
        <i class="fa-solid fa-spinner fa-spin text-5xl text-primary/30 mb-6"></i>
        <p class="text-[12px] font-black text-gray-400 uppercase tracking-[4px]">Loading Analytics...</p>
      </div>

      <!-- ANALYTICS CONTENT -->
      <div id="analyticsContent" class="hidden space-y-10">

        <!-- KPI METRIC CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Total Submissions -->
          <div class="ui-section-card rounded-[28px] p-8 group hover:shadow-xl transition-all duration-500">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-all">
                <i class="fa-solid fa-file-lines"></i>
              </div>
              <h3 class="text-[12px] font-black text-gray-400 uppercase tracking-[2px] leading-tight">Total Submissions</h3>
            </div>
            <div class="flex items-baseline gap-2">
              <span id="totalSubmissions" class="text-[38px] font-black text-gray-900 tracking-tighter leading-none">—</span>
            </div>
            <div class="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div id="submissionsBar" class="h-full bg-primary rounded-full transition-all duration-1000" style="width: 0%"></div>
            </div>
          </div>

          <!-- Approval Rate -->
          <div class="ui-section-card rounded-[28px] p-8 group hover:shadow-xl transition-all duration-500">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-all">
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <h3 class="text-[12px] font-black text-gray-400 uppercase tracking-[2px] leading-tight">Approval Rate</h3>
            </div>
            <div class="flex items-baseline gap-2">
              <span id="approvalRate" class="text-[38px] font-black text-gray-900 tracking-tighter leading-none">—</span>
            </div>
            <div class="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div id="approvalBar" class="h-full bg-primary rounded-full transition-all duration-1000" style="width: 0%"></div>
            </div>
          </div>

          <!-- Avg Response Time -->
          <div class="ui-section-card rounded-[28px] p-8 group hover:shadow-xl transition-all duration-500">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-all">
                <i class="fa-solid fa-clock"></i>
              </div>
              <h3 class="text-[12px] font-black text-gray-400 uppercase tracking-[2px] leading-tight">Avg Response Time</h3>
            </div>
            <div class="flex items-baseline gap-2">
              <span id="avgResponseTime" class="text-[38px] font-black text-gray-900 tracking-tighter leading-none">—</span>
            </div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">hours average</p>
          </div>

          <!-- Avg Cycle Time -->
          <div class="ui-section-card rounded-[28px] p-8 group hover:shadow-xl transition-all duration-500">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-all">
                <i class="fa-solid fa-stopwatch"></i>
              </div>
              <h3 class="text-[12px] font-black text-gray-400 uppercase tracking-[2px] leading-tight">Avg Cycle Time</h3>
            </div>
            <div class="flex items-baseline gap-2">
              <span id="avgCycleTime" class="text-[38px] font-black text-gray-900 tracking-tighter leading-none">—</span>
            </div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">hours end-to-end</p>
          </div>
        </div>

        <!-- CHARTS ROW 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Volume by Day (Line Chart) -->
          <div class="lg:col-span-8 ui-section-card rounded-[32px] overflow-hidden">
            <div class="p-10 border-b border-gray-100/50 flex items-center justify-between">
              <div>
                <h3 class="text-[20px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                   <i class="fa-solid fa-chart-line text-primary opacity-80"></i> Volume by Day
                </h3>
              </div>
            </div>
            <div class="p-10">
              <canvas id="volumeByDayChart"></canvas>
            </div>
          </div>

          <!-- Submission Status (Doughnut Chart) -->
          <div class="lg:col-span-4 ui-section-card rounded-[32px] overflow-hidden">
            <div class="p-10 border-b border-gray-100/50">
              <h3 class="text-[20px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                <i class="fa-solid fa-chart-pie text-primary opacity-80"></i> Submission Status
              </h3>
            </div>
            <div class="p-10 flex items-center justify-center">
              <canvas id="submissionStatusChart" style="max-height: 260px;"></canvas>
            </div>
            <!-- Legend -->
            <div class="px-10 pb-8 grid grid-cols-2 gap-3">
              <div class="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <div class="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div> Approved
              </div>
              <div class="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <div class="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div> Rejected
              </div>
              <div class="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <div class="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0"></div> Pending
              </div>
              <div class="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <div class="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div> Cancelled
              </div>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW 2 -->
        <div class="ui-section-card rounded-[32px] overflow-hidden">
          <div class="p-10 border-b border-gray-100/50">
            <h3 class="text-[20px] font-black text-gray-900 tracking-tight flex items-center gap-3">
              <i class="fa-solid fa-diagram-project text-primary opacity-80"></i> Volume by Process
            </h3>
          </div>
          <div class="p-10">
            <canvas id="volumeByProcessChart" style="max-height: 320px;"></canvas>
          </div>
        </div>

      </div>
    </div>
  `,init:()=>{let i={};const t=async()=>{const a=document.getElementById("filterFrom").value,o=document.getElementById("filterTo").value,r=document.getElementById("analyticsContent"),l=document.getElementById("loadingState");r.classList.add("hidden"),l.classList.remove("hidden");try{const c={};a&&(c.from=new Date(a+"T00:00:00").toISOString()),o&&(c.to=new Date(o+"T23:59:59").toISOString());const d=await D.getAnalyticsSummary(c),u=d.volume.submissionCount,h=(d.volume.approvalRate*100).toFixed(1),p=d.responseTime.averageResponseTime.toFixed(1),m=d.cycleTime.averageCycleTime.toFixed(1);document.getElementById("totalSubmissions").textContent=u,document.getElementById("approvalRate").textContent=h+"%",document.getElementById("avgResponseTime").textContent=p,document.getElementById("avgCycleTime").textContent=m,setTimeout(()=>{document.getElementById("submissionsBar").style.width=Math.min(100,u/200*100)+"%",document.getElementById("approvalBar").style.width=h+"%"},100),Object.values(i).forEach(y=>y.destroy()),i={};const f={font:{family:"'Inter', sans-serif",weight:"700"},color:"#9ca3af"};at.defaults.font=f.font,at.defaults.color=f.color;const g=document.getElementById("volumeByDayChart").getContext("2d");i.volumeByDay=new at(g,{type:"line",data:{labels:d.volume.byDay.map(y=>new Date(y.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})),datasets:[{label:"Submissions",data:d.volume.byDay.map(y=>y.count),borderColor:"#005825",backgroundColor:"rgba(0,88,37,0.08)",tension:.4,fill:!0,pointBackgroundColor:"#005825",pointRadius:4,pointHoverRadius:6,borderWidth:2.5}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},border:{display:!1}},y:{grid:{color:"rgba(0,0,0,0.04)"},border:{display:!1},ticks:{stepSize:1}}}}});const x=document.getElementById("submissionStatusChart").getContext("2d");i.status=new at(x,{type:"doughnut",data:{labels:["Approved","Rejected","Pending","Cancelled"],datasets:[{data:[d.volume.approvedCount,d.volume.rejectedCount,d.volume.pendingCount,d.volume.cancelledCount],backgroundColor:["#005825","#ef4444","#f59e0b","#9ca3af"],borderWidth:0,hoverOffset:6}]},options:{responsive:!0,cutout:"72%",plugins:{legend:{display:!1}}}});const b=document.getElementById("volumeByProcessChart").getContext("2d");i.process=new at(b,{type:"bar",data:{labels:d.volume.byProcess.map(y=>y.processName),datasets:[{label:"Approved",data:d.volume.byProcess.map(y=>y.approved),backgroundColor:"#005825",borderRadius:4},{label:"Rejected",data:d.volume.byProcess.map(y=>y.rejected),backgroundColor:"#ef4444",borderRadius:4},{label:"Pending / Other",data:d.volume.byProcess.map(y=>y.total-y.approved-y.rejected),backgroundColor:"#f59e0b",borderRadius:4}]},options:{responsive:!0,plugins:{legend:{position:"top",labels:{usePointStyle:!0,pointStyle:"circle",padding:20,font:{size:11,weight:"700"}}}},scales:{x:{stacked:!0,grid:{display:!1},border:{display:!1}},y:{stacked:!0,grid:{color:"rgba(0,0,0,0.04)"},border:{display:!1}}}}}),l.classList.add("hidden"),r.classList.remove("hidden")}catch(c){console.error("Failed to load analytics",c);const d=document.getElementById("loadingState");d.innerHTML='<div class="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center text-3xl mb-6 mx-auto"><i class="fa-solid fa-triangle-exclamation"></i></div><h3 class="text-[22px] font-black text-gray-900 tracking-tight mb-2">Analytics Unavailable</h3><p class="text-[14px] text-gray-400 font-medium italic max-w-sm mx-auto">'+(c.message||"Unable to retrieve analytics data. Please try again.")+'</p><button onclick="window.location.reload()" class="mt-8 ui-button-soft px-8 py-3 rounded-xl text-[13px]"><i class="fa-solid fa-rotate-right"></i> Retry</button>'}},e=new Date,s=new Date(e);s.setDate(s.getDate()-30);const n=a=>{const o=a.getFullYear(),r=String(a.getMonth()+1).padStart(2,"0"),l=String(a.getDate()).padStart(2,"0");return o+"-"+r+"-"+l};document.getElementById("filterFrom").value=n(s),document.getElementById("filterTo").value=n(e),document.getElementById("applyFiltersBtn").addEventListener("click",t),t()}},ia=[{path:"/",view:()=>'<div class="p-8">Redirecting...</div>',init:()=>{window.location.hash="/home"}},{path:"/login",view:ps.render,init:ps.init,protected:!1},{path:"/register",view:ks.render,init:ks.init,protected:!1},{path:"/forgot-password",view:_s.render,init:_s.init,protected:!1},{path:"/reset-password",view:Ss.render,init:Ss.init,protected:!1},{path:"/home",view:i=>ei()>=2?Ue.render(i):gs.render(i),init:i=>{ei()>=2?Ue.init(i):gs.init(i)},protected:!0,layout:et},{path:"/status",view:Ts.render,init:Ts.init,protected:!0,layout:et},{path:"/track/:id",view:Is.render,init:Is.init,protected:!0,layout:et},{path:"/submission/new",view:us.render,init:us.init,protected:!0,layout:et},{path:"/review",view:ms.render,init:ms.init,protected:!0,layout:et},{path:"/review/:id",view:bs.render,init:bs.init,protected:!0,layout:et},{path:"/admin/documents",view:ys.render,init:ys.init,protected:!0,layout:et},{path:"/admin/documents/:id",view:hs.render,init:hs.init,protected:!0,layout:et},{path:"/admin/reviewers",view:vs.render,init:vs.init,protected:!0,layout:et},{path:"/admin/analytics",view:Ue.render,init:Ue.init,protected:!0,layout:et},{path:"/admin/logs",view:Ms.render,init:Ms.init,protected:!0,layout:et},{path:"/admin/departments",view:Es.render,init:Es.init,protected:!0,layout:et},{path:"/admin/departments/:id",view:Ls.render,init:Ls.init,protected:!0,layout:et},{path:"/settings",view:ws.render,init:ws.init,protected:!0,layout:et}];function vu(){window.addEventListener("hashchange",sa),window.addEventListener("load",sa)}function dt(i){window.location.hash=i}async function sa(){const i=window.location.hash.slice(1)||"/",t=document.getElementById("root");let e=null,s={};for(const n of ia){const a=n.path.split("/"),o=i.split("?")[0].split("/");if(a.length===o.length){let r=!0;for(let l=0;l<a.length;l++)if(a[l].startsWith(":"))s[a[l].slice(1)]=o[l];else if(a[l]!==o[l]){r=!1;break}if(r){e=n;break}}}if(e||(e=ia.find(n=>n.path==="/")),e.protected&&!no())return dt("/login");e.layout?t.innerHTML=e.layout(e.view(s)):t.innerHTML=e.view(s),typeof e.init=="function"&&setTimeout(()=>{e.init(s)},0)}document.querySelector("#app").innerHTML=`
  <div id="root" class="h-full w-full flex flex-col bg-gray-50 overflow-y-auto"></div>
`;vu();
