var nr=Object.defineProperty;var ar=(i,t,e)=>t in i?nr(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var E=(i,t,e)=>ar(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();const bt="https://api.kld-dwims.tech";function Wt(){return localStorage.getItem("dwims_token")}function us(i){localStorage.setItem("dwims_token",i)}function hs(i){localStorage.setItem("dwims_refresh_token",i)}function ra(){localStorage.removeItem("dwims_token"),localStorage.removeItem("dwims_refresh_token")}function rr(){return!!Wt()}function or(i){if(!i)return null;try{const e=i.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),s=decodeURIComponent(window.atob(e).split("").map(function(n){return"%"+("00"+n.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(s)}catch{return null}}function ii(){const i=Wt(),t=or(i);if(!t||!t["dwims:org_role"])return 0;let e=t["dwims:org_role"];Array.isArray(e)||(e=[e]);const s={Submitter:0,Reviewer:1,Administrator:2,SuperAdministrator:3};let n=0;for(const a of e){const r=a.split(":"),o=r[r.length-1];let l=s[o];l===void 0&&(l=parseInt(o,10)),!isNaN(l)&&l>n&&(n=l)}return n}async function R(i,t={}){const e={"Content-Type":"application/json",...t.headers},s=Wt();s&&(e.Authorization=`Bearer ${s}`);const n=await fetch(`${bt}${i}`,{...t,headers:e});if(n.status===401)throw ra(),window.location.hash="/login",new Error("Unauthorized");return n}const D={login:async(i,t)=>await R("/auth/login",{method:"POST",body:JSON.stringify({email:i,password:t})}),register:async i=>await fetch(`${bt}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),loginWithGoogle:async i=>await fetch(`${bt}/auth/oauth/google`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:i})}),forgotPassword:async i=>await fetch(`${bt}/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i})}),resetPassword:async(i,t,e)=>await fetch(`${bt}/auth/reset-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:i,token:t,newPassword:e})}),createSubmission:async i=>{const t=await R("/submission",{method:"POST",body:JSON.stringify(i)});if(!t.ok){const e=await t.text();throw new Error(`Failed to create submission: ${e}`)}return t},getMySubmissions:async()=>{const i=await R("/submission/own");if(!i.ok)throw new Error("Failed to fetch submissions");return i.json()},getPendingReviews:async()=>{const i=await R("/submission/review");if(!i.ok)throw new Error("Failed to fetch pending reviews");return i.json()},getSubmissionsReviewed:async(i=1,t=50)=>{const e=await R(`/submission/reviewed?page=${i}&pageSize=${t}`);if(!e.ok)throw new Error("Failed to fetch reviewed submissions");return e.json()},getSubmission:async i=>{const t=await R(`/submission/${i}`);if(!t.ok)throw new Error("Failed to fetch submission details");return t.json()},getSubmissionToReview:async i=>{const t=await R(`/submission/review/${i}`);if(!t.ok)throw new Error("Failed to fetch submission details");return t.json()},respondToSubmission:async(i,t,e,s,n=null)=>{const a=await R(`/submission/${i}/steps/${t}`,{method:"POST",body:JSON.stringify({outcome:e,remarks:s||null,nextReviewerEmail:n||null})});if(!a.ok){const r=await a.json().catch(()=>({}));throw new Error(r.ErrorDescription||r.Error||"Failed to respond to submission")}return a},resumeSubmission:async i=>{const t=await R(`/submission/${i}/resume`,{method:"POST"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||"Failed to resume submission")}return t},cancelSubmission:async i=>{const t=await R(`/submission/${i}/cancel`,{method:"POST"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||"Failed to cancel submission")}return t},getProfile:async()=>{const i=await R("/users/me");if(!i.ok)throw new Error("Failed to fetch profile");return i.json()},updateProfile:async i=>{const t=await R("/users/me",{method:"PUT",body:JSON.stringify(i)});if(!t.ok)throw new Error("Failed to update profile");return t},uploadSignature:async i=>{const t=await R("/users/me/signature",{method:"PUT",body:JSON.stringify({svgContent:i})});if(!t.ok){const e=await t.json();throw new Error(e.ErrorDescription||e.Error||"Failed to upload signature")}return t},getProcesses:async()=>{const i=await R("/process");if(!i.ok)throw new Error("Failed to fetch processes");return i.json()},getAllProcesses:async()=>{const i=await R("/process/all");if(!i.ok)throw new Error("Failed to fetch all processes");return i.json()},getProcess:async i=>{const t=await R(`/process/${i}`);if(!t.ok)throw new Error("Failed to fetch process");return t.json()},deleteProcess:async i=>{if(!(await R(`/process/${i}`,{method:"DELETE"})).ok)throw new Error("Failed to delete process")},getProcessSteps:async i=>{const t=await R(`/process/${i}/step`);if(!t.ok)throw new Error("Failed to fetch process steps");return t.json()},createProcess:async(i,t)=>{const e=await R("/process",{method:"POST",body:JSON.stringify({title:i,departmentId:t})});if(!e.ok){const s=await e.text();throw new Error(`Failed to create process: ${s||e.status}`)}return e.json()},addProcessStep:async(i,t)=>{const e=await R(`/process/${i}/step?processId=${i}`,{method:"POST",body:JSON.stringify(t)});if(!e.ok){const s=await e.text();throw new Error(`Failed to add step: ${s}`)}return e},updateProcessStep:async(i,t,e)=>{const s=await R(`/process/${i}/step/${t}`,{method:"PUT",body:JSON.stringify(e)});if(!s.ok){const n=await s.json().catch(()=>({}));throw new Error(n.ErrorDescription||n.Error||"Failed to update step")}return s},addProcessField:async(i,t)=>{const e=await R(`/process/${i}/field?processId=${i}`,{method:"POST",body:JSON.stringify(t)});if(!e.ok){const s=await e.text();throw new Error(`Failed to add field: ${s}`)}return e},getLogs:async(i={})=>{const t=new URLSearchParams;i.page&&t.append("Page",i.page),i.pageSize&&t.append("PageSize",i.pageSize),i.actionFilter&&t.append("ActionFilter",i.actionFilter),i.userIdFilter&&t.append("UserIdFilter",i.userIdFilter),i.from&&t.append("From",i.from),i.to&&t.append("To",i.to);const e=await R(`/logs?${t.toString()}`);if(!e.ok)throw new Error("Failed to fetch logs");return e.json()},getAnalyticsSummary:async(i={})=>{const t=new URLSearchParams;i.from&&t.append("From",i.from),i.to&&t.append("To",i.to),i.departmentId&&t.append("DepartmentId",i.departmentId),i.processId&&t.append("ProcessId",i.processId);const e=await R(`/analytics/summary?${t.toString()}`);if(!e.ok)throw new Error("Failed to fetch analytics summary");return e.json()},getDepartments:async()=>{const i=await R("/department");if(!i.ok)throw new Error("Failed to fetch departments");return i.json()},createDepartment:async(i,t)=>{const e=await R("/department",{method:"POST",body:JSON.stringify({name:i,description:t||null})});if(!e.ok){const s=await e.json().catch(()=>({}));throw new Error(s.ErrorDescription||s.Error||"Failed to create department")}return e},updateDepartment:async(i,t,e)=>{const s=await R(`/department/${i}`,{method:"PUT",body:JSON.stringify({name:t,description:e||null})});if(!s.ok){const n=await s.json().catch(()=>({}));throw new Error(n.ErrorDescription||n.Error||"Failed to update department")}return s},deleteDepartment:async i=>{const t=await R(`/department/${i}`,{method:"DELETE"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||"Failed to delete department")}return t},getDepartmentMembers:async i=>{const t=await R(`/department/${i}/members?departmentId=${i}`);if(!t.ok)throw new Error("Failed to fetch department members");return t.json()},assignRole:async(i,t,e)=>{const s=await R("/roles",{method:"POST",body:JSON.stringify({email:i,departmentId:t,generalRole:parseInt(e)})});if(!s.ok){const n=await s.json();throw new Error(n.ErrorDescription||n.Error||"Failed to assign role")}return s},removeRole:async i=>{const t=await R(`/roles/${i}`,{method:"DELETE"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.ErrorDescription||e.Error||`Failed to remove role (${t.status})`)}return t},uploadDocument:async(i,t)=>{const e=new FormData;e.append("file",t);const s=Wt(),n=await fetch(`${bt}/process/${i}/document`,{method:"POST",headers:{...s?{Authorization:`Bearer ${s}`}:{}},body:e});if(!n.ok){const a=await n.json().catch(()=>({}));throw new Error(a.ErrorDescription||a.Error||`Upload failed (${n.status})`)}return n.json()},getSubmissionDocument:async i=>{const t=Wt(),e=await fetch(`${bt}/submission/${i}/pdf`,{headers:{...t?{Authorization:`Bearer ${t}`}:{}}});if(!e.ok)throw new Error("Failed to load document");return e.blob()},getAttachments:async i=>{const t=await R(`/submission/${i}/attachments`);if(!t.ok)throw new Error("Failed to fetch attachments");return t.json()},downloadAttachment:async(i,t)=>{const e=Wt(),s=await fetch(`${bt}/submission/${i}/attachments/${t}`,{headers:{...e?{Authorization:`Bearer ${e}`}:{}}});if(!s.ok)throw new Error("Failed to load attachment");return s},getAttachment:async(i,t)=>D.downloadAttachment(i,t),uploadAttachments:async(i,t)=>{const e=Wt(),s=new FormData;for(const a of t)s.append("files",a);const n=await fetch(`${bt}/submission/${i}/attachments`,{method:"POST",headers:{...e?{Authorization:`Bearer ${e}`}:{}},body:s});if(!n.ok){const a=await n.json().catch(()=>({}));throw new Error(a.ErrorDescription||a.Error||"Failed to upload attachments")}return n},deleteAttachment:async(i,t)=>{const e=await R(`/submission/${i}/attachments/${t}`,{method:"DELETE"});if(!e.ok){const s=await e.json().catch(()=>({}));throw new Error(s.ErrorDescription||s.Error||"Failed to delete attachment")}return e}},ht=i=>{const t=window.location.hash.slice(1);return t===i||i==="/review"&&t==="/review?tab=pending"?"flex items-center gap-3 px-4 py-3 text-[13px] font-black bg-[#005825] text-white rounded-xl shadow-lg shadow-green-900/20 transition-all duration-300":"flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-gray-500 hover:bg-green-50 hover:text-[#005825] rounded-xl transition-all duration-300"},pt=i=>{const t=window.location.hash.slice(1);return t===i||i==="/review"&&t==="/review?tab=pending"?"text-white":"text-gray-400 group-hover:text-[#005825]"},it=i=>{const t=ii(),e=t>=1,s=t>=2,n=t===3;return`
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
              <a href="#/home" class="${ht("/home")} group">
                  <i class="fa-solid fa-house-chimney w-5 ${pt("/home")} transition-transform group-hover:scale-110"></i> Dashboard
              </a>
            <a href="#/submission/new" class="${ht("/submission/new")} group">
                <i class="fa-solid fa-file-circle-plus w-5 ${pt("/submission/new")} transition-transform group-hover:scale-110"></i> New Submission
            </a>
            <a href="#/status" class="${ht("/status")} group">
                <i class="fa-solid fa-radar w-5 ${pt("/status")} transition-transform group-hover:scale-110"></i> Submission Status
            </a>
          </div>

          ${e?`
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Approvals</div>
          <div class="space-y-1">
            <a href="#/review" class="${ht("/review")} group">
                <i class="fa-solid fa-stamp w-5 ${pt("/review")} transition-transform group-hover:scale-110"></i> Pending Approvals
            </a>
            <a href="#/review?tab=reviewed" class="${ht("/review?tab=reviewed")} group">
                <i class="fa-solid fa-clock-rotate-left w-5 ${pt("/review?tab=reviewed")} transition-transform group-hover:scale-110"></i> Reviewed History
            </a>
          </div>
          `:""}

          ${s?`
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Management</div>
          <div class="space-y-1">
            <a href="#/admin/documents" class="${ht("/admin/documents")} group">
                <i class="fa-solid fa-diagram-project w-5 ${pt("/admin/documents")} transition-transform group-hover:scale-110"></i> Manage Workflows
            </a>
            <a href="#/admin/reviewers" class="${ht("/admin/reviewers")} group">
                <i class="fa-solid fa-user-shield w-5 ${pt("/admin/reviewers")} transition-transform group-hover:scale-110"></i> User Management
            </a>
          </div>
          `:""}

          ${n?`
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">System Admin</div>
          <div class="space-y-1">
            <a href="#/admin/departments" class="${ht("/admin/departments")} group">
                <i class="fa-solid fa-buildings w-5 ${pt("/admin/departments")} transition-transform group-hover:scale-110"></i> Departments
            </a>
            <a href="#/admin/logs" class="${ht("/admin/logs")} group">
                <i class="fa-solid fa-bolt-lightning w-5 ${pt("/admin/logs")} transition-transform group-hover:scale-110"></i> Activity Logs
            </a>
          </div>
          `:""}

          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">General</div>
          <div class="space-y-1">
            <a href="#/settings" class="${ht("/settings")} group">
                <i class="fa-solid fa-user-gear w-5 ${pt("/settings")} transition-transform group-hover:scale-110"></i> 
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
`};window.addEventListener("click",i=>{i.target.closest("#logoutBtn")&&(ra(),lt("/login"));const e=i.target.closest("#mobileMenuBtn"),s=document.getElementById("mainSidebar"),n=document.getElementById("mobileOverlay");e&&s&&n&&(s.classList.toggle("translate-x-0"),s.classList.toggle("-translate-x-full"),n.classList.toggle("hidden")),i.target===n&&s&&(s.classList.add("-translate-x-full"),s.classList.remove("translate-x-0"),n.classList.add("hidden"))});const ps={render:()=>`
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
  `,init:async()=>{const i=document.getElementById("processDropdown"),t=document.getElementById("startProcessBtn"),e=document.getElementById("processSelectionState"),s=document.getElementById("formFillingState"),n=document.getElementById("selectedProcessName"),a=document.getElementById("dynamicFieldsContainer"),r=document.getElementById("submissionForm"),o=document.getElementById("cancelProcessBtn"),l=document.getElementById("submitSubmissionBtn"),c=document.getElementById("reviewerEmailInput"),d=document.getElementById("backBtn");d&&d.addEventListener("click",()=>lt("/home"));const u=document.getElementById("step1Indicator"),p=document.getElementById("step2Indicator");let h=null,g=[],f="";try{const m=await D.getAllProcesses();!m||m.length===0?i.innerHTML='<option value="">No document protocols found.</option>':(i.innerHTML='<option value="">-- Choose Protocol --</option>'+m.map(x=>`<option value="${x.id||x.Id}">${x.name||x.title||x.Name}</option>`).join(""),i.addEventListener("change",x=>{t.disabled=!x.target.value}))}catch(m){i.innerHTML='<option value="">Synchronization failed.</option>',console.error(m)}t.addEventListener("click",async()=>{var x;if(h=i.value,f=((x=c==null?void 0:c.value)==null?void 0:x.trim())||"",!f){c==null||c.focus(),c==null||c.setCustomValidity("Please enter the first reviewer email."),c==null||c.reportValidity();return}c==null||c.setCustomValidity("");const m=i.options[i.selectedIndex].text;u.classList.remove("bg-primary","text-white","shadow-lg"),u.classList.add("bg-white/40","text-primary"),u.querySelector("div").innerText="✓",p.classList.remove("bg-gray-100/50","text-gray-400"),p.classList.add("bg-primary","text-white","shadow-lg"),e.classList.add("hidden"),s.classList.remove("hidden"),n.innerText=m,a.innerHTML=`
        <div class="col-span-full py-20 text-center">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-primary mb-4"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-widest">Preparing form fields...</p>
        </div>
      `;try{const b=await D.getProcess(h);g=b.fields||b.Fields||[],g.length===0?a.innerHTML='<div class="col-span-full p-8 bg-blue-50/50 text-blue-800 rounded-3xl border border-blue-100 font-bold text-center">This protocol requires no additional data inputs. Proceed to final submission.</div>':a.innerHTML=g.map((y,k)=>{const v=y.id||y.Id,w=y.name||y.Name,_=y.type!==void 0?y.type:y.Type,S=y.required!==void 0?y.required:y.Required,M=k===0?"autofocus":"";let L="";const T="ui-input-lg w-full";return _===0?L=`<input type="text" id="field_${v}" placeholder="Enter ${w.toLowerCase()}" ${S?"required":""} ${M} class="${T}">`:_===1?L=`<input type="number" id="field_${v}" placeholder="Numeric entry" ${S?"required":""} ${M} class="${T}">`:_===2?L=`<input type="date" id="field_${v}" ${S?"required":""} ${M} class="${T}">`:_===4?L=`
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
                    ${w} ${S?'<span class="text-primary ml-1">*</span>':""}
                </label>
                ${L}
              </div>
            `}).join("")}catch{a.innerHTML='<div class="col-span-full p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold">Failed to load protocol fields.</div>'}}),o.addEventListener("click",()=>{window.location.reload()}),r.addEventListener("submit",async m=>{m.preventDefault();const x=g.map(y=>{const k=y.id||y.Id,v=document.getElementById(`field_${k}`);return{fieldId:k,fieldValue:v?v.value:""}}),b={processId:h,firstReviewerEmail:f,fields:x};l.disabled=!0,l.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Finalizing...';try{await D.createSubmission(b),l.className="bg-emerald-500 text-white font-black px-14 py-6 rounded-3xl flex items-center justify-center gap-4",l.innerHTML='<i class="fa-solid fa-check-double scale-125"></i> Submission Logged',setTimeout(()=>{window.location.hash="#/home"},800)}catch(y){alert("Transmission error: "+y.message),l.disabled=!1,l.innerHTML='<i class="fa-solid fa-paper-plane"></i> Finalize Submission'}})}},fs={render:i=>`
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
      `);const s=document.getElementById("stepsList"),n=document.getElementById("fieldsList"),a={0:"fa-user-pen",1:"fa-user-check",2:"fa-user-gear",3:"fa-user-shield"},r={0:"Text",1:"Numeric",2:"Date",3:"Boolean",4:"Signature"},o=async()=>{var g,f;try{const m=await D.getProcess(t);if(m){document.getElementById("processHeaderName").innerText=m.name||m.title||"Untitled Architecture",(m.hasDocument||m.HasDocument)&&((g=document.getElementById("docStatus"))==null||g.classList.remove("hidden"),(f=document.getElementById("docStatus"))==null||f.classList.add("inline-flex"));const k=m.fields||m.Fields||[];k.length===0?n.innerHTML=`
              <div class="py-20 text-center opacity-20">
                  <i class="fa-solid fa-code text-4xl mb-4"></i>
                  <p class="text-[11px] font-black uppercase tracking-widest">No Mapping</p>
              </div>
            `:n.innerHTML=k.map(v=>`
              <li class="px-10 py-6 border-b border-gray-100/50 flex items-center justify-between group hover:bg-white/40 transition-all">
                  <div class="flex items-center gap-5">
                      <div class="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <i class="fa-solid fa-microchip text-[14px] opacity-40"></i>
                      </div>
                      <div>
                          <p class="text-[14px] font-extrabold text-gray-800 leading-none mb-1 group-hover:text-primary transition-colors">${v.name||v.title||v.Name||v.Title}</p>
                          <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">${r[v.type||0]||"Dynamic"}</p>
                      </div>
                  </div>
                  ${v.required?'<i class="fa-solid fa-shield-check text-primary text-xs opacity-50"></i>':""}
              </li>
            `).join("")}const x=await D.getProcessSteps(t),b=Array.isArray(x)?x:x.items||x.data||[];b.length===0?s.innerHTML=`
            <div class="py-32 text-center opacity-30 select-none">
                <i class="fa-solid fa-route text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">Sequence Matrix Empty</p>
            </div>
          `:s.innerHTML=b.sort((y,k)=>(y.order||0)-(k.order||0)).map(y=>`
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
          `).join("")}catch(m){console.error(m)}};await o();const l=(g,f)=>{const m=document.getElementById(g),x=m==null?void 0:m.querySelector('div[id$="Content"]');!m||!x||(f?(m.classList.remove("hidden"),setTimeout(()=>{x.classList.remove("scale-95","opacity-0","translate-y-4"),x.classList.add("scale-100","opacity-100","translate-y-0")},10)):(x.classList.add("scale-95","opacity-0","translate-y-4"),x.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{var b;if(m.classList.add("hidden"),(b=m.querySelector("form"))==null||b.reset(),g==="addStepModal"){const y=document.getElementById("editStepId");y&&(y.value="");const k=document.getElementById("stepModalTitle");k&&(k.innerText="Configure Node")}},300)))};document.getElementById("addStepBtn").onclick=()=>l("addStepModal",!0),document.getElementById("closeStepBtn").onclick=()=>l("addStepModal",!1),document.getElementById("closeStepBg").onclick=()=>l("addStepModal",!1),document.getElementById("addFieldBtn").onclick=()=>l("addFieldModal",!0),document.getElementById("closeFieldBg").onclick=()=>l("addFieldModal",!1);try{const g=await D.getDepartments(),f=document.getElementById("stepDepartment");f&&(f.innerHTML=g.map(m=>`<option value="${m.id}">${m.name}</option>`).join(""))}catch{}s.addEventListener("click",g=>{const f=g.target.closest(".edit-step-btn");f&&(document.getElementById("editStepId").value=f.dataset.id,document.getElementById("stepTitle").value=f.dataset.title,document.getElementById("stepDepartment").value=f.dataset.dept,document.getElementById("stepOrder").value=f.dataset.order,document.getElementById("stepRole").value=f.dataset.role,document.getElementById("stepModalTitle").innerText="Modify Node Architect",l("addStepModal",!0))}),document.getElementById("saveStepBtn").onclick=async g=>{const f=g.currentTarget,m=document.getElementById("editStepId").value,x={title:document.getElementById("stepTitle").value,departmentId:document.getElementById("stepDepartment").value,order:parseInt(document.getElementById("stepOrder").value),role:parseInt(document.getElementById("stepRole").value)},b=f.innerHTML;f.disabled=!0,f.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{m?await D.updateProcessStep(t,m,x):await D.addProcessStep(t,{processId:t,...x}),l("addStepModal",!1),await o()}catch(y){alert(y.message)}finally{f.disabled=!1,f.innerHTML=b}},document.getElementById("saveFieldBtn").onclick=async g=>{const f=g.currentTarget,m={processId:t,title:document.getElementById("fieldTitle").value,inputType:parseInt(document.getElementById("fieldType").value),required:document.getElementById("fieldRequired").checked},x=f.innerHTML;f.disabled=!0,f.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.addProcessField(t,m),l("addFieldModal",!1),await o()}catch(b){alert(b.message)}finally{f.disabled=!1,f.innerHTML=x}};const c=document.getElementById("docUploadArea"),d=document.getElementById("docFileInput"),u=document.getElementById("docFilePreview"),p=document.getElementById("uploadDocBtn");c&&(c.onclick=()=>d.click()),d&&(d.onchange=g=>{const f=g.target.files[0];if(!f||f.type!=="application/pdf")return alert("PDF source required.");document.getElementById("docFileName").innerText=f.name,document.getElementById("docFileSize").innerText=(f.size/1024/1024).toFixed(2)+" MB",c.classList.add("hidden"),u.classList.remove("hidden"),p.classList.remove("hidden")}),document.getElementById("removeDocBtn").onclick=()=>{d.value="",c.classList.remove("hidden"),u.classList.add("hidden"),p.classList.add("hidden")},p.onclick=async()=>{const g=d.files[0];if(!g)return;const f=p.innerHTML;p.disabled=!0,p.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.uploadDocument(t,g),document.getElementById("docMsg").innerText="SECURED",document.getElementById("docMsg").className="text-[10px] font-black text-emerald-600 uppercase tracking-widest",document.getElementById("docMsg").classList.remove("hidden"),document.getElementById("docStatus").classList.remove("hidden"),setTimeout(()=>{window.location.reload()},1500)}catch(m){alert(m.message)}finally{p.disabled=!1,p.innerHTML=f}};const h=document.getElementById("deleteProcessBtn");h&&h.addEventListener("click",async()=>{if(confirm("Are you sure you want to completely delete this workflow? This action cannot be undone.")){const g=h.innerHTML;h.disabled=!0,h.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';try{await D.deleteProcess(t),window.location.hash="#/admin/documents"}catch(f){alert("Failed to delete workflow: "+f.message),h.disabled=!1,h.innerHTML=g}}})}},gs={render:()=>`
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
  `,init:()=>{const i=window.location.hash.split("?")[1]||"";new URLSearchParams(i).get("reset")==="success"&&document.getElementById("loginSuccess").classList.remove("hidden"),(()=>{if(window.handleGoogleCredentialResponse=async e=>{const s=document.getElementById("loginError");s.classList.add("hidden");try{const n=await D.loginWithGoogle(e.credential);if(n.ok){const a=await n.json();if(a.token)us(a.token),a.refreshToken&&hs(a.refreshToken),lt("/home");else throw new Error("Authentication failed: Missing token.")}else{const a=await n.json().catch(()=>({}));throw new Error(a.ErrorDescription||a.Error||"Google authentication failed.")}}catch(n){s.innerText=n.message,s.classList.remove("hidden")}},document.getElementById("google-gsi-client"))window.google&&(window.google.accounts.id.initialize({client_id:"661977725301-h6fg9kb4p4bckqhg3878pmhfa3ierllq.apps.googleusercontent.com",callback:window.handleGoogleCredentialResponse}),window.google.accounts.id.renderButton(document.getElementById("googleSignInBtn"),{theme:"outline",size:"large",width:"100%",shape:"pill",type:"standard"}));else{const e=document.createElement("script");e.id="google-gsi-client",e.src="https://accounts.google.com/gsi/client",e.async=!0,e.defer=!0,e.onload=()=>{window.google&&(window.google.accounts.id.initialize({client_id:"661977725301-h6fg9kb4p4bckqhg3878pmhfa3ierllq.apps.googleusercontent.com",callback:window.handleGoogleCredentialResponse}),window.google.accounts.id.renderButton(document.getElementById("googleSignInBtn"),{theme:"outline",size:"large",width:"100%",shape:"pill",type:"standard"}))},document.body.appendChild(e)}})(),document.getElementById("loginForm").addEventListener("submit",async e=>{e.preventDefault();const s=document.getElementById("email").value,n=document.getElementById("password").value,a=e.currentTarget.querySelector("button"),r=document.getElementById("loginError"),o=a.innerHTML;r.classList.add("hidden"),a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';try{const l=await D.login(s,n);if(l.ok){const c=await l.json();if(c.token)us(c.token),c.refreshToken&&hs(c.refreshToken),lt("/home");else throw new Error("Authentication failed: Missing token.")}else{const c=await l.json().catch(()=>({}));throw new Error(c.ErrorDescription||c.Error||"Invalid credentials. Access denied.")}}catch(l){r.innerText=l.message,r.classList.remove("hidden"),a.disabled=!1,a.innerHTML=o}})}},ms={NotificationWidget:()=>`
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
  `},xs={render:()=>{const i=ii();let t="My Dashboard",e="Monitor your document submissions and activities in real-time.",s=null;return i===1?(t="Reviewer Console",e="Manage pending approvals and track evaluation performance.",s=[{title:"Review Queue",icon:"fa-list-check",link:"#/review/pending"},{title:"My Signature",icon:"fa-signature",link:"#/settings"}]):i===2?(t="Department Analytics",e="Oversight of departmental document flows and process efficiency.",s=[{title:"Manage Flows",icon:"fa-diagram-project",link:"#/admin/documents"},{title:"Templates",icon:"fa-file-invoice",link:"#/admin/documents"}]):i===3&&(t="System Management",e="Global system activity and administrative oversight.",s=[{title:"Audit Logs",icon:"fa-terminal",link:"#/superadmin/logs"},{title:"Departments",icon:"fa-building-columns",link:"#/superadmin/departments"}]),`
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
            ${ms.QuickActions(s)}
          </div>
          `:""}
          ${ms.NotificationWidget()}
        </div>
      </div>
    </div>
    `},init:async()=>{const i=document.getElementById("submissionsList");if(!i)return;const t={0:{label:"Submitted",style:"bg-blue-50 text-blue-700 border-blue-200",icon:"fa-rotate"},1:{label:"In Review",style:"bg-orange-50 text-orange-700 border-orange-200",icon:"fa-clock"},2:{label:"Approved",style:"bg-emerald-50 text-emerald-700 border-emerald-200",icon:"fa-check"},3:{label:"Rejected",style:"bg-red-50 text-red-700 border-red-200",icon:"fa-xmark"},4:{label:"Cancelled",style:"bg-gray-100 text-gray-600 border-gray-200",icon:"fa-ban"},5:{label:"On Hold",style:"bg-amber-50 text-amber-700 border-amber-200",icon:"fa-pause"}};try{const e=await D.getMySubmissions();let s=Array.isArray(e)?e:e.items||e.Items||e.data||e.Data||[],n=0,a=0,r=0;s.forEach(c=>{const d=c.status!==void 0?c.status:c.Status;d===1||d===5||d==="OnHold"?n++:d===2||d==="Approved"||d==="Complete"?a++:d===3||d==="Rejected"?r++:n++});const o=document.getElementById("stat-total"),l=document.getElementById("stat-review");o&&(o.textContent=s.length),l&&(l.textContent=n),s.length===0?i.innerHTML='<tr><td colspan="4" class="p-8 text-center text-gray-500">No records found.</td></tr>':i.innerHTML=s.map(c=>{const d=c.id||c.Id,u=c.documentType||c.DocumentType||c.name||"Document",p=c.status!==void 0?c.status:c.Status,h=t[p]||{label:"Pending",style:"bg-gray-100 text-gray-600",icon:"fa-circle-notch"},g=c.createdAt||c.CreatedAt;let f=g?new Date(g).toLocaleDateString():"N/A";return`
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
                <span class="inline-flex items-center text-[10px] font-black px-3 py-1 rounded-lg border-2 uppercase tracking-widest ${h.style}">
                    <i class="fa-solid ${h.icon} mr-2"></i> ${h.label}
                </span>
              </td>
              <td class="py-5 px-8 border-b border-gray-100/50 text-right">
                <a href="#/track/${d}" class="ui-button-soft text-[12px] font-black px-4 py-2">
                  Track Status
                </a>
              </td>
            </tr>
          `}).join("")}catch(e){console.error(e),i.innerHTML='<tr><td colspan="4" class="p-10 text-red-500 text-center font-bold">Failed to load submissions.</td></tr>'}}},bs={render:()=>`
    <div class="ui-page-shell">
      
      <!-- HEADER -->
      <div class="mb-10 relative p-8 md:p-10 ui-section-card rounded-[40px] overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <i class="fa-solid fa-stamp"></i> Review Portal
              </div>
              <h1 class="ui-page-title mb-3">Reviewer Dashboard</h1>
              <p class="ui-muted font-medium italic opacity-80">Review pending submissions and track previously approved documents.</p>
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

      <!-- TABS -->
      <div class="flex items-center gap-3 mb-8 border-b border-gray-200/60 pb-4">
        <button id="tabPendingBtn" class="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all bg-primary text-white shadow-lg shadow-primary/20">
          <i class="fa-solid fa-hourglass-half"></i> Pending Approvals (<span id="pendingCount">0</span>)
        </button>
        <button id="tabReviewedBtn" class="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all bg-white/70 text-gray-500 hover:text-gray-900 hover:bg-white border border-gray-200/50">
          <i class="fa-solid fa-clock-rotate-left"></i> Reviewed History (<span id="reviewedCount">0</span>)
        </button>
      </div>

      <div id="reviewsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="col-span-full py-40 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[12px] font-black text-gray-400 uppercase tracking-[3px]">Loading reviews...</p>
        </div>
      </div>
    </div>
  `,init:async()=>{const i=document.getElementById("reviewsList"),t=document.getElementById("tabPendingBtn"),e=document.getElementById("tabReviewedBtn"),s=document.getElementById("pendingCount"),n=document.getElementById("reviewedCount"),a=document.getElementById("queueHealthBar");if(!i)return;let r=[],o=[],l=window.location.hash.includes("tab=reviewed")?"reviewed":"pending";const c=()=>{if(r.length===0){i.className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/80 shadow-2xl col-span-full",i.innerHTML=`
            <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner rotate-3">
                <i class="fa-solid fa-check-double scale-125"></i>
            </div>
            <h3 class="text-[28px] font-black text-gray-900 tracking-tight mb-3">All Clear</h3>
            <p class="text-[15px] text-gray-400 font-medium text-center max-w-sm italic opacity-80">You have no pending documents to review at this time.</p>
        `;return}i.className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",i.innerHTML=r.map(h=>{const g=h.id||h.Id,f=h.responseName||h.ResponseName||"Document Submission",m=h.submitterName||h.SubmitterName||"Applicant",x=h.stepName||h.StepName||"Assessment",b=h.submittedAt||h.SubmittedAt,y=h.stepActivatedAt||h.StepActivatedAt;let k="Just now";if(y){const _=Math.floor((new Date-new Date(y))/36e5);k=_>0?`${_}h ago`:"Activated recently"}const v=h.status??h.Status??1,w=v===5||v==="OnHold"||v==="onhold"||v==="on hold";return`
          <div class="ui-card rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl group overflow-hidden flex flex-col justify-between ${w?"border-amber-200/60 bg-amber-50/20":""}">
            <!-- TOP SECTION -->
            <div class="p-8 pb-4">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center gap-2 px-3 py-1 ${w?"bg-amber-500/15 text-amber-700 border-amber-500/30":"bg-amber-500/10 text-amber-600 border-amber-500/20"} rounded-full text-[10px] font-black uppercase tracking-widest border">
                        <i class="fa-solid ${w?"fa-pause":"fa-clock-rotate-left"}"></i> ${w?"On Hold":k}
                    </div>
                    ${w?`<span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">${k}</span>`:""}
                  </div>
                  <div class="text-[11px] font-black text-gray-300 uppercase tracking-tighter">TRK-${g.toString().slice(-6).toUpperCase()}</div>
                </div>
                
                <h3 class="text-[22px] font-black text-gray-900 tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">${f}</h3>
                
                <div class="flex flex-wrap gap-2 mb-8">
                  <span class="px-3 py-1.5 bg-gray-100/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest border border-gray-200/50">
                      <i class="fa-solid fa-bezier-curve mr-2 opacity-40"></i> ${x}
                  </span>
                </div>

                <div class="space-y-4 pt-6 border-t border-gray-100/50">
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-sm shadow-inner group-hover:scale-110 transition-transform">
                          <i class="fa-solid fa-user-graduate"></i>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submitted By</p>
                          <p class="text-[13px] font-extrabold text-gray-800 leading-none">${m}</p>
                      </div>
                  </div>
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm shadow-inner group-hover:scale-110 transition-transform">
                          <i class="fa-regular fa-calendar"></i>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submission Date</p>
                          <p class="text-[13px] font-extrabold text-gray-800 leading-none">${b?new Date(b).toLocaleDateString():"Pending"}</p>
                      </div>
                  </div>
                </div>
            </div>

            <!-- ACTION SECTION -->
            <div class="p-8 pt-4">
                <button data-id="${g}" class="review-btn ${w?"bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20":"ui-button-primary"} w-full py-5 rounded-2xl text-[15px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all">
                    <i class="fa-solid ${w?"fa-play":"fa-signature"}"></i> ${w?"Resume / Review":"Review Document"}
                </button>
            </div>
          </div>
        `}).join(""),i.querySelectorAll(".review-btn").forEach(h=>{h.addEventListener("click",()=>{lt(`/review/${h.dataset.id}`)})})},d=h=>h===2||h==="Approved"||h==="approved"?{label:"Approved",badgeClass:"bg-emerald-500/10 text-emerald-700 border-emerald-500/30",icon:"fa-check-double"}:h===3||h==="Rejected"||h==="rejected"?{label:"Rejected",badgeClass:"bg-red-500/10 text-red-700 border-red-500/30",icon:"fa-xmark"}:h===5||h==="OnHold"||h==="onhold"||h==="on hold"?{label:"On Hold",badgeClass:"bg-amber-500/10 text-amber-700 border-amber-500/30",icon:"fa-pause"}:h===4||h==="Cancelled"||h==="cancelled"?{label:"Cancelled",badgeClass:"bg-gray-100 text-gray-600 border-gray-200",icon:"fa-ban"}:{label:"In Review",badgeClass:"bg-blue-500/10 text-blue-700 border-blue-500/30",icon:"fa-rotate"},u=()=>{if(o.length===0){i.className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/80 shadow-2xl col-span-full",i.innerHTML=`
            <div class="w-24 h-24 bg-blue-50 text-blue-500 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner">
                <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <h3 class="text-[28px] font-black text-gray-900 tracking-tight mb-3">No Reviewed Documents</h3>
            <p class="text-[15px] text-gray-400 font-medium text-center max-w-sm italic opacity-80">You have not reviewed any document submissions yet.</p>
        `;return}i.className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",i.innerHTML=o.map(h=>{const g=h.id||h.Id,f=h.name||h.Name||"Document Submission",m=h.currentStep||h.CurrentStep||"Completed",x=h.createdAt||h.CreatedAt,b=h.status??h.Status??2,y=d(b);return`
          <div class="ui-card rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl group overflow-hidden flex flex-col justify-between">
            <!-- TOP SECTION -->
            <div class="p-8 pb-4">
                <div class="flex items-center justify-between mb-8">
                  <div class="inline-flex items-center gap-2 px-3 py-1 ${y.badgeClass} rounded-full text-[10px] font-black uppercase tracking-widest border">
                      <i class="fa-solid ${y.icon}"></i> ${y.label}
                  </div>
                  <div class="text-[11px] font-black text-gray-300 uppercase tracking-tighter">TRK-${g.toString().slice(-6).toUpperCase()}</div>
                </div>
                
                <h3 class="text-[22px] font-black text-gray-900 tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">${f}</h3>
                
                <div class="flex flex-wrap gap-2 mb-8">
                  <span class="px-3 py-1.5 bg-gray-100/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest border border-gray-200/50">
                      <i class="fa-solid fa-bezier-curve mr-2 opacity-40"></i> ${m}
                  </span>
                </div>

                <div class="space-y-4 pt-6 border-t border-gray-100/50">
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm shadow-inner group-hover:scale-110 transition-transform">
                          <i class="fa-regular fa-calendar"></i>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Submission Date</p>
                          <p class="text-[13px] font-extrabold text-gray-800 leading-none">${x?new Date(x).toLocaleDateString():"—"}</p>
                      </div>
                  </div>
                </div>
            </div>

            <!-- ACTION SECTION -->
            <div class="p-8 pt-4">
                <button data-id="${g}" class="view-reviewed-btn ui-button-primary w-full py-5 rounded-2xl text-[15px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all">
                    <i class="fa-solid fa-eye"></i> View Submission
                </button>
            </div>
          </div>
        `}).join(""),i.querySelectorAll(".view-reviewed-btn").forEach(h=>{h.addEventListener("click",()=>{lt(`/review/${h.dataset.id}`)})})},p=()=>{const h="bg-primary text-white shadow-lg shadow-primary/20",g="bg-white/70 text-gray-500 hover:text-gray-900 hover:bg-white border border-gray-200/50";l==="pending"?(t.className=`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${h}`,e.className=`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${g}`,c()):(e.className=`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${h}`,t.className=`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all ${g}`,u())};t==null||t.addEventListener("click",()=>{l="pending",window.location.hash="#/review",p()}),e==null||e.addEventListener("click",()=>{l="reviewed",window.location.hash="#/review?tab=reviewed",p()});try{const[h,g]=await Promise.allSettled([D.getPendingReviews(),D.getSubmissionsReviewed()]);if(h.status==="fulfilled"){const f=h.value;r=Array.isArray(f)?f:f.items||f.Items||f.data||f.Data||[]}if(g.status==="fulfilled"){const f=g.value;o=Array.isArray(f)?f:f.items||f.Items||f.data||f.Data||[]}if(s&&(s.textContent=r.length),n&&(n.textContent=o.length),a){const f=Math.max(20,100-r.length*10);a.style.width=f+"%",a.className=`h-full rounded-full transition-all duration-1000 ${f<50?"bg-amber-500":"bg-emerald-500"}`}p()}catch(h){console.error(h),i.className="col-span-full max-w-xl mx-auto py-20 text-center bg-red-50/50 rounded-[40px] border border-red-100",i.innerHTML=`
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h4 class="text-[20px] font-black text-red-700 tracking-tight mb-2">Unable to load reviews</h4>
          <p class="text-[14px] text-red-600 opacity-70">${h.message}</p>
      `}}},lr=(i="",t="")=>{if(t&&t!=="application/octet-stream")return t;const e=(i||"").split(".").pop().toLowerCase();return{pdf:"application/pdf",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml",txt:"text/plain",log:"text/plain",json:"application/json",csv:"text/csv",html:"text/html",htm:"text/html",mp4:"video/mp4",webm:"video/webm",mp3:"audio/mpeg",wav:"audio/wav",ogg:"audio/ogg"}[e]||t||"application/octet-stream"};function Ft(i=""){return String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const si=async({title:i,fileName:t,blob:e,mimeType:s})=>{var k,v,w;const n=document.getElementById("activeFileViewerModal");n&&n.remove();const a=t||i||"Document Preview",r=s||lr(a,e==null?void 0:e.type),o=e&&r&&e.type!==r?new Blob([e],{type:r}):e,l=window.URL.createObjectURL(o),c=r==="application/pdf"||a.toLowerCase().endsWith(".pdf"),d=r.startsWith("image/"),u=r.startsWith("video/"),p=r.startsWith("audio/"),h=r.startsWith("text/")||r==="application/json";let g="fa-file";c?g="fa-file-pdf text-red-500":d?g="fa-file-image text-emerald-500":u?g="fa-file-video text-blue-500":p?g="fa-file-audio text-amber-500":h&&(g="fa-file-lines text-violet-500");const f=document.createElement("div");f.className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in",f.id="activeFileViewerModal";let m="";if(c)m=`
      <iframe src="${l}#toolbar=1" class="w-full h-full rounded-2xl border-0 bg-gray-100" title="${Ft(a)}"></iframe>
    `;else if(d)m=`
      <div class="w-full h-full flex items-center justify-center p-4 overflow-auto bg-gray-900/5 rounded-2xl">
        <img src="${l}" alt="${Ft(a)}" class="max-w-full max-h-full object-contain rounded-xl shadow-lg transition-transform">
      </div>
    `;else if(u)m=`
      <div class="w-full h-full flex items-center justify-center p-4 bg-black rounded-2xl">
        <video src="${l}" controls autoplay class="max-w-full max-h-full rounded-xl"></video>
      </div>
    `;else if(p)m=`
      <div class="w-full h-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl">
        <div class="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 shadow-inner">
          <i class="fa-solid fa-music"></i>
        </div>
        <p class="text-base font-bold text-gray-800 mb-6">${Ft(a)}</p>
        <audio src="${l}" controls class="w-full max-w-md"></audio>
      </div>
    `;else if(h)try{const _=await o.text();m=`
        <div class="w-full h-full overflow-auto p-6 bg-gray-50 font-mono text-xs text-gray-800 rounded-2xl whitespace-pre-wrap selection:bg-primary/20">${Ft(_)}</div>
      `}catch{m=`
        <iframe src="${l}" class="w-full h-full rounded-2xl border-0 bg-white" title="${Ft(a)}"></iframe>
      `}else m=`
      <div class="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-gray-50/50 rounded-2xl">
        <div class="w-20 h-20 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center text-3xl mb-6 shadow-inner">
          <i class="fa-solid fa-file"></i>
        </div>
        <h4 class="text-lg font-bold text-gray-800 mb-2">${Ft(a)}</h4>
        <p class="text-xs text-gray-400 font-medium max-w-sm mb-6 uppercase tracking-wider">Browser preview is not available for this file type.</p>
        <button id="viewerOpenTabBtnFallback" class="ui-button-primary px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in New Tab
        </button>
      </div>
    `;f.innerHTML=`
    <div class="relative w-full max-w-6xl h-[90vh] bg-white rounded-[32px] shadow-2xl border border-white/80 flex flex-col overflow-hidden animate-scale-in">
      <!-- HEADER -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white/80 backdrop-blur-md flex-shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
            <i class="fa-solid ${g}"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-black text-gray-900 truncate tracking-tight">${Ft(a)}</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${r}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button id="viewerOpenTabBtn" class="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all" title="Open in dedicated tab">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
            <span class="hidden sm:inline">Open in Tab</span>
          </button>
          <button id="viewerCloseBtn" class="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all" title="Close preview">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>

      <!-- VIEWER BODY -->
      <div class="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col min-h-0 bg-gray-50/30">
        <div class="w-full h-full flex-1 min-h-0 rounded-2xl overflow-hidden shadow-inner bg-white border border-gray-100">
          ${m}
        </div>
      </div>
    </div>
  `,document.body.appendChild(f);const x=()=>{f.remove(),document.removeEventListener("keydown",b),setTimeout(()=>{try{window.URL.revokeObjectURL(l)}catch{}},6e4)},b=_=>{_.key==="Escape"&&x()};document.addEventListener("keydown",b),(k=f.querySelector("#viewerCloseBtn"))==null||k.addEventListener("click",x),f.addEventListener("click",_=>{_.target===f&&x()});const y=()=>{window.open(l,"_blank")};(v=f.querySelector("#viewerOpenTabBtn"))==null||v.addEventListener("click",y),(w=f.querySelector("#viewerOpenTabBtnFallback"))==null||w.addEventListener("click",y)},cr=2,dr=3,ys=5,ur=i=>{var e;const t={0:"Submitted",1:"In Review",2:"Approved",3:"Rejected",4:"Cancelled",5:"On Hold"};return t[i]??t[(e=i==null?void 0:i.toString())==null?void 0:e.toLowerCase()]??i??"—"},hr=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"bg-blue-50 text-blue-700 border-blue-200",submitted:"bg-blue-50 text-blue-700 border-blue-200",1:"bg-orange-50 text-orange-700 border-orange-200",review:"bg-orange-50 text-orange-700 border-orange-200","in review":"bg-orange-50 text-orange-700 border-orange-200",2:"bg-emerald-50 text-emerald-700 border-emerald-200",approved:"bg-emerald-50 text-emerald-700 border-emerald-200",approve:"bg-emerald-50 text-emerald-700 border-emerald-200",3:"bg-red-50 text-red-700 border-red-200",rejected:"bg-red-50 text-red-700 border-red-200",reject:"bg-red-50 text-red-700 border-red-200",4:"bg-gray-100 text-gray-600 border-gray-200",cancelled:"bg-gray-100 text-gray-600 border-gray-200",cancel:"bg-gray-100 text-gray-600 border-gray-200",5:"bg-amber-50 text-amber-700 border-amber-200",onhold:"bg-amber-50 text-amber-700 border-amber-200","on hold":"bg-amber-50 text-amber-700 border-amber-200"}[t]??"bg-gray-100 text-gray-600 border-gray-200"},pr=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"fa-rotate",submitted:"fa-rotate",1:"fa-clock",review:"fa-clock","in review":"fa-clock",2:"fa-check",approved:"fa-check",approve:"fa-check",3:"fa-xmark",rejected:"fa-xmark",reject:"fa-xmark",4:"fa-ban",cancelled:"fa-ban",cancel:"fa-ban",5:"fa-pause",onhold:"fa-pause","on hold":"fa-pause"}[t]??"fa-circle-info"},vs={render:()=>`
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
  `,init:async i=>{var n,a,r,o,l;const t=i==null?void 0:i.id,e=document.getElementById("reviewDetailContent"),s=document.getElementById("backBtn");if(s&&(s.onclick=()=>lt("/review")),!t){e.innerHTML='<div class="p-20 bg-white/40 rounded-3xl border border-white text-center font-black uppercase tracking-widest text-red-500">Fault: Transmission ID Required</div>';return}try{let c;try{c=await D.getSubmissionToReview(t)}catch{c=await D.getSubmission(t)}const d=c.fieldValues||c.FieldValues||[],u=c.stepResponses||c.StepResponses||[],p=c.currentStep||c.CurrentStep,h=c.status??c.Status??1,g=c.processId||c.ProcessId,f=c.processName||c.ProcessName||"Internal Protocol",m=c.submittedAt||c.SubmittedAt,x=h===1||h==="Review"||h==="review",b=h===5||h==="OnHold"||h==="onhold"||h==="on hold";let y=null;if(x&&g)try{const w=await D.getProcess(g),_=w.steps||w.Steps||[],S=_.find(M=>(M.name||M.Name||M.title||M.Title)===p);if(S&&(y=S.id||S.Id),!y){const M=u.find(L=>!(L.completedAt||L.CompletedAt));if(M){const L=_.find(T=>(T.name||T.Name)===(M.stepName||M.StepName));L&&(y=L.id||L.Id)}}}catch(w){console.error("Step resolution soft-fail",w)}const k=!!y&&x;if(e.innerHTML=`
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
                <span class="flex items-center gap-2"><i class="fa-regular fa-calendar-check text-primary"></i> ${m?new Date(m).toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):"—"}</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-fingerprint text-primary"></i> #${t.toString().slice(-8).toUpperCase()}</span>
                ${p?`<span class="flex items-center gap-2 border-l border-gray-200 pl-8"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> <span class="font-black text-gray-900 uppercase tracking-[2px] text-[11px]">${p}</span></span>`:""}
              </div>
            </div>

            <div class="flex items-center gap-4">
                 ${h===2||h==="Approved"?`
                 <button id="downloadPdfBtn" class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary text-2xl hover:scale-110 active:scale-95 transition-all group/btn" title="View Document">
                    <i class="fa-solid fa-file-pdf group-hover/btn:rotate-12"></i>
                 </button>`:""}
                 <div class="inline-flex items-center px-10 py-5 rounded-3xl text-[16px] font-black shadow-xl border-2 border-white/50 ${hr(h)} gap-4">
                    <i class="fa-solid ${pr(h)} scale-125"></i> ${ur(h)}
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
                    ${d.map(w=>`
                        <div class="group">
                          <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 px-2 group-hover:text-primary transition-colors">${w.fieldName||w.FieldName}</dt>
                          <dd class="text-[16px] font-extrabold text-gray-800 bg-white/60 p-5 rounded-2xl border border-gray-100 shadow-inner group-hover:bg-white transition-all">
                            ${w.fieldValue==="true"?"AUTHENTICATED":w.fieldValue==="false"?"DECLINED":w.fieldValue||"—"}
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
              ${k?`
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

              <!-- READ-ONLY NOTICE FOR PAST REVIEWS -->
              ${!k&&!b?`
              <div class="ui-section-card rounded-[40px] p-8 bg-white border border-gray-100 flex items-center gap-5 shadow-sm">
                <div class="w-14 h-14 rounded-2xl ${h===2||h==="Approved"?"bg-emerald-50 text-emerald-600":h===3||h==="Rejected"?"bg-red-50 text-red-600":"bg-blue-50 text-blue-600"} flex items-center justify-center text-2xl flex-shrink-0">
                  <i class="fa-solid ${h===2||h==="Approved"?"fa-circle-check":h===3||h==="Rejected"?"fa-circle-xmark":"fa-circle-info"}"></i>
                </div>
                <div>
                  <h4 class="text-[16px] font-black text-gray-900 tracking-tight mb-1">
                    ${h===2||h==="Approved"?"Review Completed — Approved":h===3||h==="Rejected"?"Review Completed — Rejected":"Read-Only Submission"}
                  </h4>
                  <p class="text-[13px] text-gray-500 font-medium">This submission has already been processed. You can review the details, attachments, and decision history above.</p>
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
                    ${u.map(w=>{const _=!(w.completedAt||w.CompletedAt),S=w.outcome||w.Outcome,T=_?"amber":S==="Reject"||S==="3"||S===3?"red":S==="OnHold"||S==="onhold"||S==="5"||S===5?"amber":"emerald";return`
                        <div class="relative pl-10 group">
                          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${_?"bg-amber-400 animate-pulse":T==="red"?"bg-red-500":T==="amber"?"bg-amber-500":"bg-emerald-500"} shadow-lg z-10"></div>
                          <div class="bg-white/60 p-6 rounded-3xl border border-gray-50 flex flex-col gap-2 group-hover:bg-white transition-all shadow-sm">
                            <span class="text-[13px] font-black text-gray-900 leading-none">${w.stepName||w.StepName}</span>
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${w.reviewer||"PROTOCOL"} &bull; ${w.completedAt?new Date(w.completedAt).toLocaleDateString():"AWAITING"}</span>
                            ${S?`<div class="mt-2 text-[12px] text-gray-600 font-medium italic border-l-2 border-primary/20 pl-3">"${w.remarks||"No remarks recorded."}"</div>`:""}
                          </div>
                        </div>
                        `}).join("")}
                  </div>
              </div>
          </div>
          
        </div>
      `,b&&((n=document.getElementById("resumeSubmissionBtn"))==null||n.addEventListener("click",async w=>{const _=w.currentTarget,S=_.innerHTML;_.disabled=!0,_.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Resuming...';const M=document.getElementById("resumeError");M==null||M.classList.add("hidden");try{await D.resumeSubmission(t),lt("/review")}catch(L){M&&(M.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${L.message}`,M.classList.remove("hidden")),_.disabled=!1,_.innerHTML=S}})),k){const w=async _=>{var A,W,Y,B;const S=(W=(A=document.getElementById("remarksInput"))==null?void 0:A.value)==null?void 0:W.trim(),M=((B=(Y=document.getElementById("nextReviewerEmailInput"))==null?void 0:Y.value)==null?void 0:B.trim())||null,L=document.getElementById("respondError");if(L==null||L.classList.add("hidden"),_===ys&&!S){L.innerHTML='<i class="fa-solid fa-circle-exclamation"></i> Remarks are required when placing a submission on hold.',L.classList.remove("hidden");return}document.getElementById("approveBtn").disabled=!0,document.getElementById("rejectBtn").disabled=!0;const T=document.getElementById("holdBtn");T&&(T.disabled=!0);try{await D.respondToSubmission(t,y,_,S,M),lt("/review")}catch(F){L.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${F.message}`,L.classList.remove("hidden"),document.getElementById("approveBtn").disabled=!1,document.getElementById("rejectBtn").disabled=!1,T&&(T.disabled=!1)}};(a=document.getElementById("rejectBtn"))==null||a.addEventListener("click",()=>{var _;(_=document.getElementById("nextReviewerWrap"))==null||_.classList.add("hidden"),w(dr)}),(r=document.getElementById("holdBtn"))==null||r.addEventListener("click",()=>{var _;(_=document.getElementById("nextReviewerWrap"))==null||_.classList.add("hidden"),w(ys)}),(o=document.getElementById("approveBtn"))==null||o.addEventListener("click",()=>w(cr))}(l=document.getElementById("downloadPdfBtn"))==null||l.addEventListener("click",async w=>{const _=w.currentTarget,S=_.innerHTML;_.disabled=!0,_.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{const M=await D.getSubmissionDocument(t);await si({title:`AuditLog_${t}.pdf`,fileName:`AuditLog_${t}.pdf`,blob:M,mimeType:"application/pdf"})}catch(M){alert(M.message)}finally{_.disabled=!1,_.innerHTML=S}});const v=w=>{const _=document.getElementById("reviewAttachmentsList");if(_){if(!w||w.length===0){_.innerHTML=`
            <div class="py-10 text-center">
              <div class="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-paperclip text-gray-200 text-xl"></i>
              </div>
              <p class="text-[12px] font-black text-gray-400 uppercase tracking-[2px]">No attachments</p>
            </div>`;return}_.innerHTML=w.map(S=>{const M=S.id||S.Id,L=S.fileName||S.FileName||"Attachment";return`
            <div class="flex items-center justify-between gap-4 p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm hover:bg-white transition-all group" data-att-id="${M}" data-att-name="${L}">
              <div class="flex items-center gap-3 min-w-0 cursor-pointer rev-att-preview-trigger" title="Click to view file">
                <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 text-sm group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-file"></i>
                </div>
                <span class="text-[13px] font-bold text-gray-700 truncate group-hover:text-primary transition-colors">${L}</span>
              </div>
              <button class="rev-att-view-btn w-8 h-8 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-all" data-att-id="${M}" data-att-name="${L}" title="View">
                <i class="fa-solid fa-eye text-xs"></i>
              </button>
            </div>`}).join(""),_.querySelectorAll(".rev-att-view-btn, .rev-att-preview-trigger").forEach(S=>{S.addEventListener("click",async M=>{var Y,B,F,H,et;M.stopPropagation();const L=S.dataset.attId||((B=(Y=S.closest("[data-att-id]"))==null?void 0:Y.dataset)==null?void 0:B.attId),T=S.dataset.attName||((H=(F=S.closest("[data-att-name]"))==null?void 0:F.dataset)==null?void 0:H.attName)||"Attachment";if(!L)return;const A=S.classList.contains("rev-att-view-btn")?S:(et=S.closest("[data-att-id]"))==null?void 0:et.querySelector(".rev-att-view-btn"),W=A?A.innerHTML:null;A&&(A.disabled=!0,A.innerHTML='<i class="fa-solid fa-spinner fa-spin text-xs"></i>');try{const Mt=await(await D.downloadAttachment(t,L)).blob();await si({title:T,fileName:T,blob:Mt})}catch(X){alert(X.message)}finally{A&&W&&(A.disabled=!1,A.innerHTML=W)}})})}};D.getAttachments(t).then(v).catch(()=>{const w=document.getElementById("reviewAttachmentsList");w&&(w.innerHTML='<p class="text-center text-[13px] text-red-400 font-bold py-6">Failed to load attachments.</p>')})}catch(c){e.innerHTML=`<div class="p-20 text-center font-black uppercase tracking-[3px] text-red-500 opacity-50"><i class="fa-solid fa-triangle-exclamation text-4xl mb-6"></i> Unable to load data: ${c.message}</div>`}}},ws={render:()=>`
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
      `);const t=document.getElementById("addDocumentModal"),e=document.getElementById("addDocumentBtn"),s=document.getElementById("closeModalBtn"),n=document.getElementById("closeModalBg"),a=document.getElementById("saveProcessBtn");e&&e.addEventListener("click",async()=>{t.classList.remove("hidden"),setTimeout(()=>{const c=document.getElementById("addDocumentModalContent");c&&(c.classList.remove("scale-95","opacity-0","translate-y-4"),c.classList.add("scale-100","opacity-100","translate-y-0"))},10);const l=document.getElementById("processDepartmentId");if(l)try{l.innerHTML='<option value="">Syncing Registry...</option>';const c=await D.getDepartments();!c||c.length===0?l.innerHTML='<option value="">No departments available</option>':l.innerHTML='<option value="" disabled selected>Select Department</option>'+c.map(d=>`<option value="${d.id}">${d.name}</option>`).join("")}catch{l.innerHTML='<option value="">Failed to connect</option>'}});const r=()=>{const l=document.getElementById("addDocumentModalContent");l&&(l.classList.add("scale-95","opacity-0","translate-y-4"),l.classList.remove("scale-100","opacity-100","translate-y-0")),setTimeout(()=>{var c;t.classList.add("hidden"),(c=document.getElementById("addProcessForm"))==null||c.reset()},300)};s&&s.addEventListener("click",r),n&&n.addEventListener("click",r);const o=async()=>{const l=document.getElementById("processList");if(l)try{const c=await D.getProcesses();if(!c||c.length===0){l.innerHTML=`
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
        `).join("")}catch{l.innerHTML='<li class="flex-grow flex items-center justify-center p-8 text-sm text-red-500 font-medium"> <i class="fa-solid fa-circle-exclamation mr-2"></i> Failed to load processes</li>'}};a&&a.addEventListener("click",async()=>{const l=document.getElementById("processTitle").value,c=document.getElementById("processDepartmentId").value;if(!l||!c)return alert("Title and Department ID are required");const d=a.innerHTML;a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Creating...';try{await D.createProcess(l,c),r(),await o()}catch(u){alert("Failed to save process: "+u.message)}finally{a.disabled=!1,a.innerHTML=d}}),o()}},ks={render:()=>`
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
      `);const t=document.getElementById("reviewersList"),e=document.getElementById("addReviewerModal"),s={0:"Submitter",1:"Reviewer",2:"Admin",3:"Super Admin"},n={0:"fa-user-pen",1:"fa-user-check",2:"fa-user-gear",3:"fa-user-shield"},a=async()=>{try{const o=await D.getDepartments();let l=[];for(const c of o)try{const d=await D.getDepartmentMembers(c.id);l=l.concat(d.map(u=>({...u,departmentName:c.name})))}catch(d){console.error(d)}if(l.length===0){t.innerHTML=`
            <tr>
                <td colspan="4" class="px-10 py-32 text-center opacity-30">
                    <i class="fa-solid fa-users-slash text-6xl mb-6"></i>
                    <p class="text-[12px] font-black uppercase tracking-[4px]">No Personnel Mapped</p>
                </td>
            </tr>`;return}t.innerHTML=l.map(c=>{var p,h;const d=((((p=c.firstName)==null?void 0:p[0])||"")+(((h=c.lastName)==null?void 0:h[0])||"U")).toUpperCase(),u=c.role??c.generalRole??0;return`
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
          `}).join(""),document.querySelectorAll(".remove-role-btn").forEach(c=>{c.onclick=async()=>{const d=c.dataset.id;if(confirm("Irreversible Action: Revoke institutional deployment link?"))try{await D.removeRole(d),await a()}catch(u){alert(u.message)}}})}catch(o){console.error(o)}},r=o=>{const l=document.getElementById("addReviewerModalContent");o?(e.classList.remove("hidden"),setTimeout(()=>{l.classList.remove("scale-95","opacity-0","translate-y-4"),l.classList.add("scale-100","opacity-100","translate-y-0")},10)):(l.classList.add("scale-95","opacity-0","translate-y-4"),l.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{e.classList.add("hidden"),document.getElementById("addReviewerForm").reset()},300))};document.getElementById("addReviewerBtn").onclick=async()=>{r(!0);const o=document.getElementById("reviewerDepartmentId");try{const l=await D.getDepartments();o.innerHTML='<option value="" disabled selected>Allocation Node...</option>'+l.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}catch{}},document.getElementById("closeReviewerModalBtn").onclick=()=>r(!1),document.getElementById("closeReviewerModalBtnX").onclick=()=>r(!1),document.getElementById("closeReviewerModalBg").onclick=()=>r(!1),document.getElementById("saveReviewerBtn").onclick=async o=>{const l=o.currentTarget,c=document.getElementById("reviewerEmail").value,d=document.getElementById("reviewerDepartmentId").value,u=document.getElementById("reviewerRole").value;if(!c||!d)return alert("Strict parameters violation: Hub and Scope required.");const p=l.innerHTML;l.disabled=!0,l.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.assignRole(c,d,u),r(!1),await a()}catch(h){alert(h.message)}finally{l.disabled=!1,l.innerHTML=p}},a()}},_s={render:()=>`
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
  `,init:async()=>{var h,g;const i=document.getElementById("settingsForm");if(!i)return;try{const f=await D.getProfile();if(f&&(document.getElementById("first-name").value=f.firstName||f.FirstName||"",document.getElementById("last-name").value=f.lastName||f.LastName||"",document.getElementById("email-address").value=f.email||f.Email||"",document.getElementById("contact-number").value=f.contactNumber||f.ContactNumber||"",f.hasSignature!==void 0?f.hasSignature:f.HasSignature)){const x=document.getElementById("signature-status");x&&(x.classList.remove("hidden"),x.classList.add("inline-flex"))}}catch(f){console.error("Profile Retrieval Error",f)}const t=document.getElementById("signatureCanvas"),e=t.getContext("2d");let s=!1,n=[],a=[];const r=t.getBoundingClientRect(),o=window.devicePixelRatio||1;t.width=r.width*o,t.height=r.height*o,e.scale(o,o),t.style.width=r.width+"px",t.style.height=r.height+"px",e.strokeStyle="#000000",e.lineWidth=3,e.lineCap="round",e.lineJoin="round";function l(f){const m=t.getBoundingClientRect(),x=f.touches?f.touches[0].clientX:f.clientX,b=f.touches?f.touches[0].clientY:f.clientY;return{x:x-m.left,y:b-m.top}}const c=f=>{f.preventDefault(),s=!0;const m=l(f);a=[m],e.beginPath(),e.moveTo(m.x,m.y)},d=f=>{if(!s)return;f.preventDefault();const m=l(f);a.push(m),e.lineTo(m.x,m.y),e.stroke()},u=f=>{s&&(s=!1,a.length>1&&n.push([...a]),a=[])};t.addEventListener("mousedown",c),t.addEventListener("mousemove",d),t.addEventListener("mouseup",u),t.addEventListener("mouseleave",u),t.addEventListener("touchstart",c,{passive:!1}),t.addEventListener("touchmove",d,{passive:!1}),t.addEventListener("touchend",u),(h=document.getElementById("clearSignatureBtn"))==null||h.addEventListener("click",()=>{n=[],e.clearRect(0,0,t.width/o,t.height/o)});const p=()=>{const f=t.getBoundingClientRect().width,m=t.getBoundingClientRect().height,x=n.map(b=>{let y=`M ${b[0].x.toFixed(2)} ${b[0].y.toFixed(2)}`;for(let k=1;k<b.length;k++){const v=(b[k-1].x+b[k].x)/2,w=(b[k-1].y+b[k].y)/2;y+=` Q ${b[k-1].x.toFixed(2)} ${b[k-1].y.toFixed(2)} ${v.toFixed(2)} ${w.toFixed(2)}`}return`<path d="${y}" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`}).join("");return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f} ${m}" width="${f}" height="${m}">${x}</svg>`};(g=document.getElementById("saveSignatureBtn"))==null||g.addEventListener("click",async()=>{var b;const f=document.getElementById("signatureMsg"),m=document.getElementById("saveSignatureBtn");if(n.length===0)return alert("Input signature required.");const x=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Processing...';try{await D.uploadSignature(p()),f.textContent="Enrolled successfully.",f.classList.remove("hidden"),(b=document.getElementById("signature-status"))==null||b.classList.remove("hidden")}catch(y){alert(y.message)}finally{m.disabled=!1,m.innerHTML=x}}),i.addEventListener("submit",async f=>{f.preventDefault();const m=i.querySelector('button[type="submit"]'),x=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Synchronizing...';try{await D.updateProfile({firstName:document.getElementById("first-name").value,lastName:document.getElementById("last-name").value,email:document.getElementById("email-address").value,contactNumber:document.getElementById("contact-number").value||null}),m.className="w-full sm:w-auto bg-emerald-500 text-white font-black px-14 py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-4 transition-all",m.innerHTML='<i class="fa-solid fa-check-double"></i> Nodes Sync',setTimeout(()=>{m.className="w-full sm:w-auto bg-primary text-accent font-black px-14 py-5 rounded-[24px] shadow-2xl transition-all",m.innerHTML=x,m.disabled=!1},3e3)}catch(b){alert(b.message),m.disabled=!1,m.innerHTML=x}})}},Ss={render:()=>`
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
  `,init:()=>{document.getElementById("registerForm").addEventListener("submit",async i=>{i.preventDefault();const t=document.getElementById("firstName").value.trim(),e=document.getElementById("lastName").value.trim(),s=document.getElementById("email").value.trim(),n=document.getElementById("password").value,a=document.getElementById("confirmPassword").value,r=document.getElementById("registerError"),o=i.target.querySelector("button"),l=o.innerHTML;if(n!==a){r.textContent="Passwords do not match.",r.classList.remove("hidden");return}o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';try{const c={firstName:t,lastName:e,email:s,password:n},d=await D.register(c);if(!d.ok){const u=await d.json().catch(()=>({}));throw new Error(u.errorDescription||u.title||"Registration failed")}lt("/login")}catch(c){r.textContent=c.message||"Registration failed. Please try again.",r.classList.remove("hidden"),o.disabled=!1,o.innerHTML=l}})}},Ms={render:()=>`
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
  `,init:()=>{const i=document.getElementById("forgotForm"),t=document.getElementById("fpError"),e=document.getElementById("fpSuccess"),s=document.getElementById("fpSubmitBtn");i.addEventListener("submit",async n=>{n.preventDefault(),t.classList.add("hidden"),e.classList.add("hidden"),s.disabled=!0;const a=s.innerHTML;s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending…';const r=document.getElementById("fpEmail").value.trim();try{const o=await D.forgotPassword(r);if(!o.ok&&o.status!==404){const l=await o.json().catch(()=>({}));throw new Error(l.errorDescription||l.title||"Something went wrong.")}e.classList.remove("hidden"),i.querySelector("input").value=""}catch(o){t.textContent=o.message,t.classList.remove("hidden")}finally{s.disabled=!1,s.innerHTML=a}})}},Es={render:()=>`
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
  `,init:()=>{const i=window.location.hash.split("?")[1]||"",t=new URLSearchParams(i),e=t.get("userId"),s=t.get("token"),n=document.getElementById("rpInvalidLink"),a=document.getElementById("resetForm"),r=document.getElementById("rpError"),o=document.getElementById("rpSubmitBtn");if(!e||!s){n.classList.remove("hidden"),a.classList.add("hidden");return}a.addEventListener("submit",async l=>{l.preventDefault(),r.classList.add("hidden");const c=document.getElementById("rpPassword").value,d=document.getElementById("rpConfirmPassword").value;if(c!==d){r.textContent="Passwords do not match.",r.classList.remove("hidden");return}o.disabled=!0;const u=o.innerHTML;o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Resetting…';try{const p=await D.resetPassword(e,s,c);if(!p.ok){const h=await p.json().catch(()=>({}));throw new Error(h.errorDescription||h.title||"Failed to reset password.")}lt("/login?reset=success")}catch(p){r.textContent=p.message,r.classList.remove("hidden"),o.disabled=!1,o.innerHTML=u}})}},Ls={render:()=>`
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
  `,init:()=>{const i=document.getElementById("logsTableBody"),t=document.getElementById("logFilterForm"),e=document.getElementById("prevPageBtn"),s=document.getElementById("nextPageBtn"),n=document.getElementById("currentPageLabel");let a=1,r={};const o=async(l=1)=>{i.innerHTML=`
        <tr><td colspan="4" class="px-10 py-32 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-primary/30 mb-6"></i>
            <p class="text-[14px] font-black text-gray-400 uppercase tracking-[4px]">Searching logs...</p>
        </td></tr>`;try{const c=await D.getLogs({...r,page:l,pageSize:20}),d=Array.isArray(c)?c:c.items||c.data||[];d.length===0?(i.innerHTML=`
            <tr><td colspan="4" class="px-10 py-32 text-center opacity-30">
                <i class="fa-solid fa-terminal text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">No logs found</p>
            </td></tr>`,s.disabled=!0):(i.innerHTML=d.map(u=>{const p=new Date(u.timestamp||u.Timestamp),h=u.action||u.Action||"—";let g=u.details||u.Details||"";return typeof g=="object"&&(g=JSON.stringify(g)),`
              <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-8">
                   <div class="flex flex-col">
                     <span class="text-[14px] font-black text-gray-900 leading-none mb-1.5">${p.toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})}</span>
                     <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">${p.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}</span>
                   </div>
                </td>
                <td class="px-10 py-8">
                  <span class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest border border-primary/10 shadow-sm">
                    <i class="fa-solid fa-microchip opacity-30"></i> ${h}
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
                     <p class="text-[11px] font-mono font-medium text-gray-500 line-clamp-3 group-hover:line-clamp-none transition-all">${g||"No details available."}</p>
                  </div>
                </td>
              </tr>
            `}).join(""),s.disabled=d.length<20),a=l,n.textContent=a,e.disabled=a===1}catch(c){i.innerHTML=`<tr><td colspan="4" class="px-10 py-8 text-center text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Unable to load logs: ${c.message}</td></tr>`}};t.onsubmit=l=>{l.preventDefault(),r={actionFilter:document.getElementById("filterAction").value||void 0,userIdFilter:document.getElementById("filterUserId").value||void 0,from:document.getElementById("filterFrom").value||void 0},o(1)},e.onclick=()=>{a>1&&o(a-1)},s.onclick=()=>o(a+1),o(1)}},Ts={render:()=>`
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
      `);const t=document.getElementById("departmentTableBody"),e=document.getElementById("departmentModal"),s=document.getElementById("modal-title"),n=document.getElementById("saveDepartmentBtn"),a=async()=>{try{const o=await D.getDepartments();if(!o||o.length===0){t.innerHTML=`
            <tr>
              <td colspan="3" class="px-10 py-32 text-center opacity-30">
                  <span class="text-primary font-bold">Departments</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Managing Institutional<br>Process Units</span>
              </td>
            </tr>`;return}t.innerHTML=o.map(l=>`
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
        `).join("")}catch{t.innerHTML='<tr><td colspan="3" class="px-10 py-8 text-center text-red-500 font-black uppercase text-[10px] tracking-widest"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Registry Access Error</td></tr>'}},r=(o,l=null)=>{const c=document.getElementById("departmentModalContent");o?(document.getElementById("departmentId").value=l?l.id:"",document.getElementById("departmentName").value=l?l.name:"",document.getElementById("departmentDescription").value=l?l.description:"",s.textContent=l?"Modify Configuration":"Register Department",n.innerHTML=l?'<i class="fa-solid fa-cloud-arrow-up"></i> Save Changes':'<i class="fa-solid fa-cloud-bolt text-lg opacity-70"></i> Add Department',e.classList.remove("hidden"),setTimeout(()=>{c.classList.remove("scale-95","opacity-0","translate-y-4"),c.classList.add("scale-100","opacity-100","translate-y-0")},10)):(c.classList.add("scale-95","opacity-0","translate-y-4"),c.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{e.classList.add("hidden"),document.getElementById("departmentForm").reset()},300))};document.getElementById("addDepartmentBtn").onclick=()=>r(!0),document.getElementById("closeModalBtn").onclick=()=>r(!1),document.getElementById("closeModalBtnX").onclick=()=>r(!1),document.getElementById("closeModalBg").onclick=()=>r(!1),t.addEventListener("click",async o=>{const l=o.target.closest("[data-edit]"),c=o.target.closest("[data-delete]");if(l&&r(!0,{id:l.dataset.edit,name:l.dataset.name,description:l.dataset.desc}),c&&confirm(`Irreversible Action: Decommission "${c.dataset.name}" and all associated deployment links?`))try{await D.deleteDepartment(c.dataset.delete),await a()}catch(d){alert(d.message)}}),n.onclick=async()=>{const o=document.getElementById("departmentId").value,l=document.getElementById("departmentName").value,c=document.getElementById("departmentDescription").value;if(!l)return alert("Entity identifier strictly required.");const d=n.innerHTML;n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{o?await D.updateDepartment(o,l,c):await D.createDepartment(l,c),r(!1),await a()}catch(u){alert(u.message)}finally{n.disabled=!1,n.innerHTML=d}},a()}},Ds={render:()=>`
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
      `);const s={0:"fa-user-pen",1:"fa-user-check",2:"fa-user-gear",3:"fa-user-shield"},n=async()=>{try{const o=(await D.getDepartments()).find(h=>h.id===t);o&&(document.getElementById("deptName").innerText=o.name,document.getElementById("deptDesc").innerText=o.description||"Functional mandate unassigned.",document.getElementById("deptIdTag").innerText=`UNIT-${t.substring(0,8).toUpperCase()}`);const[l,c]=await Promise.all([D.getProcesses(),D.getDepartmentMembers(t)]),d=(l||[]).filter(h=>h.departmentId===t),u=document.getElementById("processList");d.length===0?u.innerHTML=`
            <div class="py-32 text-center opacity-30 select-none">
                <i class="fa-solid fa-sitemap text-6xl mb-6"></i>
                <p class="text-[12px] font-black uppercase tracking-[4px]">No Frameworks Scope</p>
            </div>`:u.innerHTML=d.map(h=>`
            <li class="px-10 py-8 flex items-center justify-between group hover:bg-white/40 transition-all relative">
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-primary group-hover:h-12 transition-all rounded-r-full shadow-[0_0_15px_rgba(11,93,59,0.3)]"></div>
              <div class="flex items-center gap-8">
                  <div class="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                      <i class="fa-solid fa-diagram-project text-2xl opacity-40"></i>
                  </div>
                  <div>
                    <h4 class="text-[18px] font-black text-gray-900 group-hover:text-primary transition-colors leading-none mb-2">${h.name||h.title||"Untitled Protocol"}</h4>
                    <div class="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-layer-group opacity-30"></i> ${h.stepsCount||0} Architected Nodes</span>
                        <span class="opacity-10">|</span>
                        <span class="flex items-center gap-2 ${h.hasTemplate?"text-emerald-500":"text-gray-300"}"><i class="fa-solid ${h.hasTemplate?"fa-file-shield":"fa-file-slash"} opacity-30"></i> ${h.hasTemplate?"Template Synchronized":"Baseline Missing"}</span>
                    </div>
                  </div>
              </div>
              <a href="#/admin/documents/${h.id}" class="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-primary hover:border-primary/20 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <i class="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
              </a>
            </li>
          `).join("");const p=document.getElementById("membersList");!c||c.length===0?p.innerHTML=`
            <tr><td class="px-10 py-20 text-center opacity-20">
                <i class="fa-solid fa-users-slash text-4xl mb-4"></i>
                <p class="text-[11px] font-black uppercase tracking-widest">Isolated Node</p>
            </td></tr>`:(p.innerHTML=c.map(h=>{var m,x;const g=((((m=h.firstName)==null?void 0:m[0])||"")+(((x=h.lastName)==null?void 0:x[0])||"U")).toUpperCase(),f=h.role??h.generalRole??0;return`
              <tr class="group hover:bg-white/40 transition-all">
                <td class="px-10 py-6">
                    <div class="flex items-center gap-5">
                        <div class="w-12 h-12 rounded-xl bg-white border border-gray-50 shadow-md flex items-center justify-center text-primary font-black text-[12px] group-hover:scale-110 transition-transform">${g}</div>
                        <div>
                            <p class="text-[14px] font-black text-gray-900 leading-none group-hover:text-primary transition-colors mb-1">${h.firstName||""} ${h.lastName||"Member"}</p>
                            <p class="text-[10px] font-medium text-gray-400 italic">${h.email||"offline-hub"}</p>
                        </div>
                    </div>
                </td>
                <td class="px-10 py-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 font-black text-[9px] uppercase tracking-widest border border-gray-200 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <i class="fa-solid ${s[f]} opacity-30"></i> TIER-${f}
                    </span>
                </td>
                <td class="px-10 py-6 text-right">
                    <button class="remove-role-btn w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100" data-id="${h.roleId||h.id}">
                        <i class="fa-solid fa-user-minus"></i>
                    </button>
                </td>
              </tr>`}).join(""),document.querySelectorAll(".remove-role-btn").forEach(h=>{h.onclick=async()=>{if(confirm("Irreversible Action: Decouple member affiliation from this node?"))try{await D.removeRole(h.dataset.id),await n()}catch(g){alert(g.message)}}}))}catch(r){console.error(r)}};await n();const a=(r,o)=>{const l=document.getElementById(r),c=l.querySelector('div[id$="Content"]');o?(l.classList.remove("hidden"),setTimeout(()=>{c.classList.remove("scale-95","opacity-0","translate-y-4"),c.classList.add("scale-100","opacity-100","translate-y-0")},10)):(c.classList.add("scale-95","opacity-0","translate-y-4"),c.classList.remove("scale-100","opacity-100","translate-y-0"),setTimeout(()=>{var d;l.classList.add("hidden"),(d=l.querySelector("form"))==null||d.reset()},300))};document.getElementById("addMemberBtn").onclick=()=>a("addMemberModal",!0),document.getElementById("closeMemberModalBtn").onclick=()=>a("addMemberModal",!1),document.getElementById("closeMemberModalBg").onclick=()=>a("addMemberModal",!1),document.getElementById("addProcessBtn").onclick=()=>a("addProcessModal",!0),document.getElementById("closeProcessModalBtn").onclick=()=>a("addProcessModal",!1),document.getElementById("closeProcessModalBg").onclick=()=>a("addProcessModal",!1),document.getElementById("saveMemberBtn").onclick=async r=>{const o=r.currentTarget,l=document.getElementById("memberEmail").value,c=document.getElementById("memberRole").value;if(!l)return alert("Hub identifier required.");const d=o.innerHTML;o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.assignRole(l,t,c),a("addMemberModal",!1),await n()}catch(u){alert(u.message)}finally{o.disabled=!1,o.innerHTML=d}},document.getElementById("saveProcessBtn").onclick=async r=>{const o=r.currentTarget,l=document.getElementById("processTitle").value;if(!l)return alert("Protocol nomenclature required.");const c=o.innerHTML;o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{await D.createProcess(l,t),a("addProcessModal",!1),await n()}catch(d){alert(d.message)}finally{o.disabled=!1,o.innerHTML=c}}}},As={render:()=>`
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
            </tr>`;return}const n=a=>a===0||a===1?{l:"Pending",c:"bg-primary/5 text-primary border-primary/10 shadow-sm",i:"fa-spinner fa-spin"}:a===2?{l:"Complete",c:"bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm",i:"fa-check-double"}:a===3?{l:"Rejected",c:"bg-red-500/10 text-red-600 border-red-500/20 shadow-sm",i:"fa-shield-xmark"}:a===4?{l:"Cancelled",c:"bg-gray-100 text-gray-500 border-gray-200 shadow-sm",i:"fa-ban"}:a===5?{l:"On Hold",c:"bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm",i:"fa-pause"}:{l:"Archived",c:"bg-gray-100 text-gray-400 border-gray-200",i:"fa-box-archive"};i.innerHTML=s.map(a=>{var l;const r=n(a.status),o=a.createdAt?new Date(a.createdAt).toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"}):"—";return`
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
                        <i class="fa-regular fa-clock opacity-30"></i> ${o}
                    </div>
                </td>
                <td class="px-10 py-8">
                    <span class="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 ${r.c}">
                        <i class="fa-solid ${r.i} text-[11px] opacity-70"></i> ${r.l}
                    </span>
                </td>
                <td class="px-10 py-8 text-right">
                    <a href="#/track/${a.id}" class="ui-button-primary px-6 py-3 text-[11px] uppercase tracking-widest">
                        Track Status <i class="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>
                    </a>
                </td>
            </tr>
          `}).join("")}catch(e){i.innerHTML=`<tr><td colspan="4" class="px-10 py-10 text-center text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Queue Access Warning: ${e.message}</td></tr>`}})()}},Is=i=>{var e;const t={0:"Submitted",1:"In Review",2:"Approved",3:"Rejected",4:"Cancelled",5:"On Hold"};return t[i]??t[(e=i==null?void 0:i.toString())==null?void 0:e.toLowerCase()]??i??"—"},Ps=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"bg-blue-50 text-blue-700 border-blue-200",submitted:"bg-blue-50 text-blue-700 border-blue-200",1:"bg-orange-50 text-orange-700 border-orange-200",review:"bg-orange-50 text-orange-700 border-orange-200","in review":"bg-orange-50 text-orange-700 border-orange-200",2:"bg-emerald-50 text-emerald-700 border-emerald-200",approved:"bg-emerald-50 text-emerald-700 border-emerald-200",approve:"bg-emerald-50 text-emerald-700 border-emerald-200",3:"bg-red-50 text-red-700 border-red-200",rejected:"bg-red-50 text-red-700 border-red-200",reject:"bg-red-50 text-red-700 border-red-200",4:"bg-gray-100 text-gray-600 border-gray-200",cancelled:"bg-gray-100 text-gray-600 border-gray-200",cancel:"bg-gray-100 text-gray-600 border-gray-200",5:"bg-amber-50 text-amber-700 border-amber-200",onhold:"bg-amber-50 text-amber-700 border-amber-200","on hold":"bg-amber-50 text-amber-700 border-amber-200"}[t]??"bg-gray-100 text-gray-600 border-gray-200"},Cs=i=>{const t=typeof i=="string"?i.toLowerCase():i;return{0:"fa-rotate",submitted:"fa-rotate",1:"fa-clock",review:"fa-clock","in review":"fa-clock",2:"fa-check",approved:"fa-check",approve:"fa-check",3:"fa-xmark",rejected:"fa-xmark",reject:"fa-xmark",4:"fa-ban",cancelled:"fa-ban",cancel:"fa-ban",5:"fa-pause",onhold:"fa-pause","on hold":"fa-pause"}[t]??"fa-circle-info"},Bs={render:()=>`
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
  `,init:async i=>{var s,n;const t=i==null?void 0:i.id,e=document.getElementById("trackDetailContent");if(t)try{const a=await D.getSubmission(t),r=a.fieldValues||a.FieldValues||[],o=a.stepResponses||a.StepResponses||[],l=a.currentStep||a.CurrentStep,c=a.status??a.Status??1,d=a.processName||a.ProcessName||"Protocol Execution",u=a.submittedAt||a.SubmittedAt;e.innerHTML=`
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
                <button id="downloadPdfBtn" class="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary text-2xl hover:scale-110 active:scale-95 transition-all group/btn" title="View Document">
                   <i class="fa-solid fa-file-pdf group-hover/btn:rotate-12"></i>
                </button>`:""}
                <div class="inline-flex items-center px-10 py-5 rounded-3xl text-[18px] font-black shadow-2xl border-2 border-white/50 ${Ps(c)} gap-4 transition-all hover:scale-105 active:scale-95 cursor-default group-hover:shadow-primary/10">
                  <i class="fa-solid ${Cs(c)} scale-125"></i> 
                  ${Is(c)}
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
              
              ${r.length>0?`
                <div class="space-y-8">
                  ${r.map(h=>`
                    <div class="group">
                      <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-hover:text-primary transition-colors">${h.fieldName||h.FieldName}</dt>
                      <dd class="text-[15px] font-extrabold text-gray-800 bg-white/60 p-4 rounded-2xl border border-gray-100/50 shadow-inner group-hover:bg-white transition-all transform group-hover:translate-x-1">
                        ${h.fieldValue||h.FieldValue||"—"}
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

              ${o.length>0?`
                <div class="relative ml-6 border-l-4 border-gray-100 space-y-12 pb-10">
                  ${o.map((h,g)=>{const f=h.outcome||h.Outcome,m=!(h.completedAt||h.CompletedAt),y=m?"amber":f==="Reject"||f==="3"||f===3?"red":f==="OnHold"||f==="onhold"||f==="5"||f===5?"amber":"emerald";return`
                      <div class="relative pl-12 group">
                        <!-- BALL -->
                        <div class="absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-white ${m?"bg-amber-400 animate-pulse":y==="red"?"bg-red-500":y==="amber"?"bg-amber-500":"bg-emerald-500"} shadow-md z-10 transition-transform group-hover:scale-125"></div>
                        
                        <div class="bg-white/80 p-8 rounded-[24px] border border-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:-translate-y-1 group-hover:bg-white relative">
                          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h4 class="text-[18px] font-black text-gray-800 leading-none mb-2">${h.stepName||h.StepName}</h4>
                                <div class="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <i class="fa-solid fa-user-tie text-[12px]"></i> ${h.reviewer||"System Protocol"} 
                                    &bull; 
                                    <i class="fa-solid fa-clock text-[12px]"></i> ${h.completedAt?new Date(h.completedAt).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"Pending"}
                                </div>
                            </div>
                            ${f?`
                            <span class="inline-flex items-center px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 ${Ps(f)}">
                                <i class="fa-solid ${Cs(f)} mr-2"></i> ${Is(f)}
                            </span>`:""}
                          </div>
                          
                          ${h.remarks?`
                          <div class="mt-6 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 italic text-[14px] text-gray-600 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                            <i class="fa-solid fa-quote-left absolute -top-2 -left-1 text-gray-100 text-4xl group-hover:text-primary/10 transition-colors"></i>
                            <span class="relative z-10">${h.remarks}</span>
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
      `,(s=document.getElementById("downloadPdfBtn"))==null||s.addEventListener("click",async h=>{const g=h.currentTarget,f=g.innerHTML;g.disabled=!0,g.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{const m=await D.getSubmissionDocument(t);await si({title:`Submission_${t}.pdf`,fileName:`Submission_${t}.pdf`,blob:m,mimeType:"application/pdf"})}catch(m){alert(m.message)}finally{g.disabled=!1,g.innerHTML=f}});const p=h=>{const g=document.getElementById("attachmentsList");if(g){if(!h||h.length===0){g.innerHTML=`
            <div class="py-10 text-center">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-paperclip text-gray-200 text-2xl"></i>
              </div>
              <p class="text-[13px] font-black text-gray-400 uppercase tracking-[2px]">No attachments yet</p>
            </div>`;return}g.innerHTML=h.map(f=>{const m=f.id||f.Id,x=f.fileName||f.FileName||"Attachment";return`
            <div class="flex items-center justify-between gap-4 p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm hover:bg-white transition-all group" data-att-id="${m}" data-att-name="${x}">
              <div class="flex items-center gap-3 min-w-0 cursor-pointer att-preview-trigger" title="Click to view file">
                <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 text-sm group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-file"></i>
                </div>
                <span class="text-[13px] font-bold text-gray-700 truncate group-hover:text-primary transition-colors">${x}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button class="att-view-btn w-8 h-8 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-all" data-att-id="${m}" data-att-name="${x}" title="View">
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
                <button class="att-delete-btn w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all" data-att-id="${m}" title="Delete">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>`}).join(""),g.querySelectorAll(".att-view-btn, .att-preview-trigger").forEach(f=>{f.addEventListener("click",async m=>{var v,w,_,S,M;m.stopPropagation();const x=f.dataset.attId||((w=(v=f.closest("[data-att-id]"))==null?void 0:v.dataset)==null?void 0:w.attId),b=f.dataset.attName||((S=(_=f.closest("[data-att-name]"))==null?void 0:_.dataset)==null?void 0:S.attName)||"Attachment";if(!x)return;const y=f.classList.contains("att-view-btn")?f:(M=f.closest("[data-att-id]"))==null?void 0:M.querySelector(".att-view-btn"),k=y?y.innerHTML:null;y&&(y.disabled=!0,y.innerHTML='<i class="fa-solid fa-spinner fa-spin text-xs"></i>');try{const T=await(await D.downloadAttachment(t,x)).blob();await si({title:b,fileName:b,blob:T})}catch(L){alert(L.message)}finally{y&&k&&(y.disabled=!1,y.innerHTML=k)}})}),g.querySelectorAll(".att-delete-btn").forEach(f=>{f.addEventListener("click",async()=>{const m=f.dataset.attId;if(confirm("Delete this attachment?"))try{await D.deleteAttachment(t,m);const x=await D.getAttachments(t);p(x)}catch(x){alert(x.message)}})})}};D.getAttachments(t).then(p).catch(()=>{const h=document.getElementById("attachmentsList");h&&(h.innerHTML='<p class="text-center text-[13px] text-red-400 font-bold py-6">Failed to load attachments.</p>')}),(n=document.getElementById("attachmentFileInput"))==null||n.addEventListener("change",async h=>{const g=Array.from(h.target.files);if(!g.length)return;const f=document.getElementById("attachmentUploadError");f==null||f.classList.add("hidden");const m=document.getElementById("attachmentsList"),x=m==null?void 0:m.innerHTML;m&&(m.innerHTML='<div class="flex items-center justify-center py-10 gap-3 text-gray-400 font-bold text-[13px]"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</div>');try{await D.uploadAttachments(t,g);const b=await D.getAttachments(t);p(b)}catch(b){m&&x&&(m.innerHTML=x),f&&(f.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${b.message}`,f.classList.remove("hidden"))}h.target.value=""})}catch(a){e.innerHTML=`
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
 */function Ae(i){return i+.5|0}const Et=(i,t,e)=>Math.max(Math.min(i,e),t);function ue(i){return Et(Ae(i*2.55),0,255)}function It(i){return Et(Ae(i*255),0,255)}function wt(i){return Et(Ae(i/2.55)/100,0,1)}function Rs(i){return Et(Ae(i*100),0,100)}const ot={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},Ci=[..."0123456789ABCDEF"],fr=i=>Ci[i&15],gr=i=>Ci[(i&240)>>4]+Ci[i&15],Ce=i=>(i&240)>>4===(i&15),mr=i=>Ce(i.r)&&Ce(i.g)&&Ce(i.b)&&Ce(i.a);function xr(i){var t=i.length,e;return i[0]==="#"&&(t===4||t===5?e={r:255&ot[i[1]]*17,g:255&ot[i[2]]*17,b:255&ot[i[3]]*17,a:t===5?ot[i[4]]*17:255}:(t===7||t===9)&&(e={r:ot[i[1]]<<4|ot[i[2]],g:ot[i[3]]<<4|ot[i[4]],b:ot[i[5]]<<4|ot[i[6]],a:t===9?ot[i[7]]<<4|ot[i[8]]:255})),e}const br=(i,t)=>i<255?t(i):"";function yr(i){var t=mr(i)?fr:gr;return i?"#"+t(i.r)+t(i.g)+t(i.b)+br(i.a,t):void 0}const vr=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function oa(i,t,e){const s=t*Math.min(e,1-e),n=(a,r=(a+i/30)%12)=>e-s*Math.max(Math.min(r-3,9-r,1),-1);return[n(0),n(8),n(4)]}function wr(i,t,e){const s=(n,a=(n+i/60)%6)=>e-e*t*Math.max(Math.min(a,4-a,1),0);return[s(5),s(3),s(1)]}function kr(i,t,e){const s=oa(i,1,.5);let n;for(t+e>1&&(n=1/(t+e),t*=n,e*=n),n=0;n<3;n++)s[n]*=1-t-e,s[n]+=t;return s}function _r(i,t,e,s,n){return i===n?(t-e)/s+(t<e?6:0):t===n?(e-i)/s+2:(i-t)/s+4}function Gi(i){const e=i.r/255,s=i.g/255,n=i.b/255,a=Math.max(e,s,n),r=Math.min(e,s,n),o=(a+r)/2;let l,c,d;return a!==r&&(d=a-r,c=o>.5?d/(2-a-r):d/(a+r),l=_r(e,s,n,d,a),l=l*60+.5),[l|0,c||0,o]}function Ki(i,t,e,s){return(Array.isArray(t)?i(t[0],t[1],t[2]):i(t,e,s)).map(It)}function Ji(i,t,e){return Ki(oa,i,t,e)}function Sr(i,t,e){return Ki(kr,i,t,e)}function Mr(i,t,e){return Ki(wr,i,t,e)}function la(i){return(i%360+360)%360}function Er(i){const t=vr.exec(i);let e=255,s;if(!t)return;t[5]!==s&&(e=t[6]?ue(+t[5]):It(+t[5]));const n=la(+t[2]),a=+t[3]/100,r=+t[4]/100;return t[1]==="hwb"?s=Sr(n,a,r):t[1]==="hsv"?s=Mr(n,a,r):s=Ji(n,a,r),{r:s[0],g:s[1],b:s[2],a:e}}function Lr(i,t){var e=Gi(i);e[0]=la(e[0]+t),e=Ji(e),i.r=e[0],i.g=e[1],i.b=e[2]}function Tr(i){if(!i)return;const t=Gi(i),e=t[0],s=Rs(t[1]),n=Rs(t[2]);return i.a<255?`hsla(${e}, ${s}%, ${n}%, ${wt(i.a)})`:`hsl(${e}, ${s}%, ${n}%)`}const Os={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},Fs={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};function Dr(){const i={},t=Object.keys(Fs),e=Object.keys(Os);let s,n,a,r,o;for(s=0;s<t.length;s++){for(r=o=t[s],n=0;n<e.length;n++)a=e[n],o=o.replace(a,Os[a]);a=parseInt(Fs[r],16),i[o]=[a>>16&255,a>>8&255,a&255]}return i}let Be;function Ar(i){Be||(Be=Dr(),Be.transparent=[0,0,0,0]);const t=Be[i.toLowerCase()];return t&&{r:t[0],g:t[1],b:t[2],a:t.length===4?t[3]:255}}const Ir=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;function Pr(i){const t=Ir.exec(i);let e=255,s,n,a;if(t){if(t[7]!==s){const r=+t[7];e=t[8]?ue(r):Et(r*255,0,255)}return s=+t[1],n=+t[3],a=+t[5],s=255&(t[2]?ue(s):Et(s,0,255)),n=255&(t[4]?ue(n):Et(n,0,255)),a=255&(t[6]?ue(a):Et(a,0,255)),{r:s,g:n,b:a,a:e}}}function Cr(i){return i&&(i.a<255?`rgba(${i.r}, ${i.g}, ${i.b}, ${wt(i.a)})`:`rgb(${i.r}, ${i.g}, ${i.b})`)}const yi=i=>i<=.0031308?i*12.92:Math.pow(i,1/2.4)*1.055-.055,Qt=i=>i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4);function Br(i,t,e){const s=Qt(wt(i.r)),n=Qt(wt(i.g)),a=Qt(wt(i.b));return{r:It(yi(s+e*(Qt(wt(t.r))-s))),g:It(yi(n+e*(Qt(wt(t.g))-n))),b:It(yi(a+e*(Qt(wt(t.b))-a))),a:i.a+e*(t.a-i.a)}}function Re(i,t,e){if(i){let s=Gi(i);s[t]=Math.max(0,Math.min(s[t]+s[t]*e,t===0?360:1)),s=Ji(s),i.r=s[0],i.g=s[1],i.b=s[2]}}function ca(i,t){return i&&Object.assign(t||{},i)}function js(i){var t={r:0,g:0,b:0,a:255};return Array.isArray(i)?i.length>=3&&(t={r:i[0],g:i[1],b:i[2],a:255},i.length>3&&(t.a=It(i[3]))):(t=ca(i,{r:0,g:0,b:0,a:1}),t.a=It(t.a)),t}function Rr(i){return i.charAt(0)==="r"?Pr(i):Er(i)}class ke{constructor(t){if(t instanceof ke)return t;const e=typeof t;let s;e==="object"?s=js(t):e==="string"&&(s=xr(t)||Ar(t)||Rr(t)),this._rgb=s,this._valid=!!s}get valid(){return this._valid}get rgb(){var t=ca(this._rgb);return t&&(t.a=wt(t.a)),t}set rgb(t){this._rgb=js(t)}rgbString(){return this._valid?Cr(this._rgb):void 0}hexString(){return this._valid?yr(this._rgb):void 0}hslString(){return this._valid?Tr(this._rgb):void 0}mix(t,e){if(t){const s=this.rgb,n=t.rgb;let a;const r=e===a?.5:e,o=2*r-1,l=s.a-n.a,c=((o*l===-1?o:(o+l)/(1+o*l))+1)/2;a=1-c,s.r=255&c*s.r+a*n.r+.5,s.g=255&c*s.g+a*n.g+.5,s.b=255&c*s.b+a*n.b+.5,s.a=r*s.a+(1-r)*n.a,this.rgb=s}return this}interpolate(t,e){return t&&(this._rgb=Br(this._rgb,t._rgb,e)),this}clone(){return new ke(this.rgb)}alpha(t){return this._rgb.a=It(t),this}clearer(t){const e=this._rgb;return e.a*=1-t,this}greyscale(){const t=this._rgb,e=Ae(t.r*.3+t.g*.59+t.b*.11);return t.r=t.g=t.b=e,this}opaquer(t){const e=this._rgb;return e.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return Re(this._rgb,2,t),this}darken(t){return Re(this._rgb,2,-t),this}saturate(t){return Re(this._rgb,1,t),this}desaturate(t){return Re(this._rgb,1,-t),this}rotate(t){return Lr(this._rgb,t),this}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */function xt(){}const Or=(()=>{let i=0;return()=>i++})();function P(i){return i==null}function z(i){if(Array.isArray&&Array.isArray(i))return!0;const t=Object.prototype.toString.call(i);return t.slice(0,7)==="[object"&&t.slice(-6)==="Array]"}function C(i){return i!==null&&Object.prototype.toString.call(i)==="[object Object]"}function U(i){return(typeof i=="number"||i instanceof Number)&&isFinite(+i)}function at(i,t){return U(i)?i:t}function I(i,t){return typeof i>"u"?t:i}const Fr=(i,t)=>typeof i=="string"&&i.endsWith("%")?parseFloat(i)/100:+i/t,da=(i,t)=>typeof i=="string"&&i.endsWith("%")?parseFloat(i)/100*t:+i;function N(i,t,e){if(i&&typeof i.call=="function")return i.apply(e,t)}function j(i,t,e,s){let n,a,r;if(z(i))for(a=i.length,n=0;n<a;n++)t.call(e,i[n],n);else if(C(i))for(r=Object.keys(i),a=r.length,n=0;n<a;n++)t.call(e,i[r[n]],r[n])}function ni(i,t){let e,s,n,a;if(!i||!t||i.length!==t.length)return!1;for(e=0,s=i.length;e<s;++e)if(n=i[e],a=t[e],n.datasetIndex!==a.datasetIndex||n.index!==a.index)return!1;return!0}function ai(i){if(z(i))return i.map(ai);if(C(i)){const t=Object.create(null),e=Object.keys(i),s=e.length;let n=0;for(;n<s;++n)t[e[n]]=ai(i[e[n]]);return t}return i}function ua(i){return["__proto__","prototype","constructor"].indexOf(i)===-1}function jr(i,t,e,s){if(!ua(i))return;const n=t[i],a=e[i];C(n)&&C(a)?_e(n,a,s):t[i]=ai(a)}function _e(i,t,e){const s=z(t)?t:[t],n=s.length;if(!C(i))return i;e=e||{};const a=e.merger||jr;let r;for(let o=0;o<n;++o){if(r=s[o],!C(r))continue;const l=Object.keys(r);for(let c=0,d=l.length;c<d;++c)a(l[c],i,r,e)}return i}function xe(i,t){return _e(i,t,{merger:Nr})}function Nr(i,t,e){if(!ua(i))return;const s=t[i],n=e[i];C(s)&&C(n)?xe(s,n):Object.prototype.hasOwnProperty.call(t,i)||(t[i]=ai(n))}const Ns={"":i=>i,x:i=>i.x,y:i=>i.y};function $r(i){const t=i.split("."),e=[];let s="";for(const n of t)s+=n,s.endsWith("\\")?s=s.slice(0,-1)+".":(e.push(s),s="");return e}function Hr(i){const t=$r(i);return e=>{for(const s of t){if(s==="")break;e=e&&e[s]}return e}}function Pt(i,t){return(Ns[t]||(Ns[t]=Hr(t)))(i)}function Qi(i){return i.charAt(0).toUpperCase()+i.slice(1)}const Se=i=>typeof i<"u",Ct=i=>typeof i=="function",$s=(i,t)=>{if(i.size!==t.size)return!1;for(const e of i)if(!t.has(e))return!1;return!0};function zr(i){return i.type==="mouseup"||i.type==="click"||i.type==="contextmenu"}const O=Math.PI,$=2*O,Vr=$+O,ri=Number.POSITIVE_INFINITY,Wr=O/180,q=O/2,jt=O/4,Hs=O*2/3,Lt=Math.log10,mt=Math.sign;function be(i,t,e){return Math.abs(i-t)<e}function zs(i){const t=Math.round(i);i=be(i,t,i/1e3)?t:i;const e=Math.pow(10,Math.floor(Lt(i))),s=i/e;return(s<=1?1:s<=2?2:s<=5?5:10)*e}function Ur(i){const t=[],e=Math.sqrt(i);let s;for(s=1;s<e;s++)i%s===0&&(t.push(s),t.push(i/s));return e===(e|0)&&t.push(e),t.sort((n,a)=>n-a).pop(),t}function qr(i){return typeof i=="symbol"||typeof i=="object"&&i!==null&&!(Symbol.toPrimitive in i||"toString"in i||"valueOf"in i)}function ee(i){return!qr(i)&&!isNaN(parseFloat(i))&&isFinite(i)}function Yr(i,t){const e=Math.round(i);return e-t<=i&&e+t>=i}function ha(i,t,e){let s,n,a;for(s=0,n=i.length;s<n;s++)a=i[s][e],isNaN(a)||(t.min=Math.min(t.min,a),t.max=Math.max(t.max,a))}function ct(i){return i*(O/180)}function Zi(i){return i*(180/O)}function Vs(i){if(!U(i))return;let t=1,e=0;for(;Math.round(i*t)/t!==i;)t*=10,e++;return e}function pa(i,t){const e=t.x-i.x,s=t.y-i.y,n=Math.sqrt(e*e+s*s);let a=Math.atan2(s,e);return a<-.5*O&&(a+=$),{angle:a,distance:n}}function Bi(i,t){return Math.sqrt(Math.pow(t.x-i.x,2)+Math.pow(t.y-i.y,2))}function Xr(i,t){return(i-t+Vr)%$-O}function Q(i){return(i%$+$)%$}function Me(i,t,e,s){const n=Q(i),a=Q(t),r=Q(e),o=Q(a-n),l=Q(r-n),c=Q(n-a),d=Q(n-r);return n===a||n===r||s&&a===r||o>l&&c<d}function K(i,t,e){return Math.max(t,Math.min(e,i))}function Gr(i){return K(i,-32768,32767)}function kt(i,t,e,s=1e-6){return i>=Math.min(t,e)-s&&i<=Math.max(t,e)+s}function ts(i,t,e){e=e||(r=>i[r]<t);let s=i.length-1,n=0,a;for(;s-n>1;)a=n+s>>1,e(a)?n=a:s=a;return{lo:n,hi:s}}const _t=(i,t,e,s)=>ts(i,e,s?n=>{const a=i[n][t];return a<e||a===e&&i[n+1][t]===e}:n=>i[n][t]<e),Kr=(i,t,e)=>ts(i,e,s=>i[s][t]>=e);function Jr(i,t,e){let s=0,n=i.length;for(;s<n&&i[s]<t;)s++;for(;n>s&&i[n-1]>e;)n--;return s>0||n<i.length?i.slice(s,n):i}const fa=["push","pop","shift","splice","unshift"];function Qr(i,t){if(i._chartjs){i._chartjs.listeners.push(t);return}Object.defineProperty(i,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[t]}}),fa.forEach(e=>{const s="_onData"+Qi(e),n=i[e];Object.defineProperty(i,e,{configurable:!0,enumerable:!1,value(...a){const r=n.apply(this,a);return i._chartjs.listeners.forEach(o=>{typeof o[s]=="function"&&o[s](...a)}),r}})})}function Ws(i,t){const e=i._chartjs;if(!e)return;const s=e.listeners,n=s.indexOf(t);n!==-1&&s.splice(n,1),!(s.length>0)&&(fa.forEach(a=>{delete i[a]}),delete i._chartjs)}function ga(i){const t=new Set(i);return t.size===i.length?i:Array.from(t)}const ma=function(){return typeof window>"u"?function(i){return i()}:window.requestAnimationFrame}();function xa(i,t){let e=[],s=!1;return function(...n){e=n,s||(s=!0,ma.call(window,()=>{s=!1,i.apply(t,e)}))}}function Zr(i,t){let e;return function(...s){return t?(clearTimeout(e),e=setTimeout(i,t,s)):i.apply(this,s),t}}const es=i=>i==="start"?"left":i==="end"?"right":"center",J=(i,t,e)=>i==="start"?t:i==="end"?e:(t+e)/2,to=(i,t,e,s)=>i===(s?"left":"right")?e:i==="center"?(t+e)/2:t;function ba(i,t,e){const s=t.length;let n=0,a=s;if(i._sorted){const{iScale:r,vScale:o,_parsed:l}=i,c=i.dataset&&i.dataset.options?i.dataset.options.spanGaps:null,d=r.axis,{min:u,max:p,minDefined:h,maxDefined:g}=r.getUserBounds();if(h){if(n=Math.min(_t(l,d,u).lo,e?s:_t(t,d,r.getPixelForValue(u)).lo),c){const f=l.slice(0,n+1).reverse().findIndex(m=>!P(m[o.axis]));n-=Math.max(0,f)}n=K(n,0,s-1)}if(g){let f=Math.max(_t(l,r.axis,p,!0).hi+1,e?0:_t(t,d,r.getPixelForValue(p),!0).hi+1);if(c){const m=l.slice(f-1).findIndex(x=>!P(x[o.axis]));f+=Math.max(0,m)}a=K(f,n,s)-n}else a=s-n}return{start:n,count:a}}function ya(i){const{xScale:t,yScale:e,_scaleRanges:s}=i,n={xmin:t.min,xmax:t.max,ymin:e.min,ymax:e.max};if(!s)return i._scaleRanges=n,!0;const a=s.xmin!==t.min||s.xmax!==t.max||s.ymin!==e.min||s.ymax!==e.max;return Object.assign(s,n),a}const Oe=i=>i===0||i===1,Us=(i,t,e)=>-(Math.pow(2,10*(i-=1))*Math.sin((i-t)*$/e)),qs=(i,t,e)=>Math.pow(2,-10*i)*Math.sin((i-t)*$/e)+1,ye={linear:i=>i,easeInQuad:i=>i*i,easeOutQuad:i=>-i*(i-2),easeInOutQuad:i=>(i/=.5)<1?.5*i*i:-.5*(--i*(i-2)-1),easeInCubic:i=>i*i*i,easeOutCubic:i=>(i-=1)*i*i+1,easeInOutCubic:i=>(i/=.5)<1?.5*i*i*i:.5*((i-=2)*i*i+2),easeInQuart:i=>i*i*i*i,easeOutQuart:i=>-((i-=1)*i*i*i-1),easeInOutQuart:i=>(i/=.5)<1?.5*i*i*i*i:-.5*((i-=2)*i*i*i-2),easeInQuint:i=>i*i*i*i*i,easeOutQuint:i=>(i-=1)*i*i*i*i+1,easeInOutQuint:i=>(i/=.5)<1?.5*i*i*i*i*i:.5*((i-=2)*i*i*i*i+2),easeInSine:i=>-Math.cos(i*q)+1,easeOutSine:i=>Math.sin(i*q),easeInOutSine:i=>-.5*(Math.cos(O*i)-1),easeInExpo:i=>i===0?0:Math.pow(2,10*(i-1)),easeOutExpo:i=>i===1?1:-Math.pow(2,-10*i)+1,easeInOutExpo:i=>Oe(i)?i:i<.5?.5*Math.pow(2,10*(i*2-1)):.5*(-Math.pow(2,-10*(i*2-1))+2),easeInCirc:i=>i>=1?i:-(Math.sqrt(1-i*i)-1),easeOutCirc:i=>Math.sqrt(1-(i-=1)*i),easeInOutCirc:i=>(i/=.5)<1?-.5*(Math.sqrt(1-i*i)-1):.5*(Math.sqrt(1-(i-=2)*i)+1),easeInElastic:i=>Oe(i)?i:Us(i,.075,.3),easeOutElastic:i=>Oe(i)?i:qs(i,.075,.3),easeInOutElastic(i){return Oe(i)?i:i<.5?.5*Us(i*2,.1125,.45):.5+.5*qs(i*2-1,.1125,.45)},easeInBack(i){return i*i*((1.70158+1)*i-1.70158)},easeOutBack(i){return(i-=1)*i*((1.70158+1)*i+1.70158)+1},easeInOutBack(i){let t=1.70158;return(i/=.5)<1?.5*(i*i*(((t*=1.525)+1)*i-t)):.5*((i-=2)*i*(((t*=1.525)+1)*i+t)+2)},easeInBounce:i=>1-ye.easeOutBounce(1-i),easeOutBounce(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375},easeInOutBounce:i=>i<.5?ye.easeInBounce(i*2)*.5:ye.easeOutBounce(i*2-1)*.5+.5};function is(i){if(i&&typeof i=="object"){const t=i.toString();return t==="[object CanvasPattern]"||t==="[object CanvasGradient]"}return!1}function Ys(i){return is(i)?i:new ke(i)}function vi(i){return is(i)?i:new ke(i).saturate(.5).darken(.1).hexString()}const eo=["x","y","borderWidth","radius","tension"],io=["color","borderColor","backgroundColor"];function so(i){i.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),i.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>t!=="onProgress"&&t!=="onComplete"&&t!=="fn"}),i.set("animations",{colors:{type:"color",properties:io},numbers:{type:"number",properties:eo}}),i.describe("animations",{_fallback:"animation"}),i.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>t|0}}}})}function no(i){i.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})}const Xs=new Map;function ao(i,t){t=t||{};const e=i+JSON.stringify(t);let s=Xs.get(e);return s||(s=new Intl.NumberFormat(i,t),Xs.set(e,s)),s}function Ie(i,t,e){return ao(t,e).format(i)}const va={values(i){return z(i)?i:""+i},numeric(i,t,e){if(i===0)return"0";const s=this.chart.options.locale;let n,a=i;if(e.length>1){const c=Math.max(Math.abs(e[0].value),Math.abs(e[e.length-1].value));(c<1e-4||c>1e15)&&(n="scientific"),a=ro(i,e)}const r=Lt(Math.abs(a)),o=isNaN(r)?1:Math.max(Math.min(-1*Math.floor(r),20),0),l={notation:n,minimumFractionDigits:o,maximumFractionDigits:o};return Object.assign(l,this.options.ticks.format),Ie(i,s,l)},logarithmic(i,t,e){if(i===0)return"0";const s=e[t].significand||i/Math.pow(10,Math.floor(Lt(i)));return[1,2,3,5,10,15].includes(s)||t>.8*e.length?va.numeric.call(this,i,t,e):""}};function ro(i,t){let e=t.length>3?t[2].value-t[1].value:t[1].value-t[0].value;return Math.abs(e)>=1&&i!==Math.floor(i)&&(e=i-Math.floor(i)),e}var hi={formatters:va};function oo(i){i.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:hi.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),i.route("scale.ticks","color","","color"),i.route("scale.grid","color","","borderColor"),i.route("scale.border","color","","borderColor"),i.route("scale.title","color","","color"),i.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&t!=="callback"&&t!=="parser",_indexable:t=>t!=="borderDash"&&t!=="tickBorderDash"&&t!=="dash"}),i.describe("scales",{_fallback:"scale"}),i.describe("scale.ticks",{_scriptable:t=>t!=="backdropPadding"&&t!=="callback",_indexable:t=>t!=="backdropPadding"})}const Xt=Object.create(null),Ri=Object.create(null);function ve(i,t){if(!t)return i;const e=t.split(".");for(let s=0,n=e.length;s<n;++s){const a=e[s];i=i[a]||(i[a]=Object.create(null))}return i}function wi(i,t,e){return typeof t=="string"?_e(ve(i,t),e):_e(ve(i,""),t)}class lo{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=s=>s.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(s,n)=>vi(n.backgroundColor),this.hoverBorderColor=(s,n)=>vi(n.borderColor),this.hoverColor=(s,n)=>vi(n.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return wi(this,t,e)}get(t){return ve(this,t)}describe(t,e){return wi(Ri,t,e)}override(t,e){return wi(Xt,t,e)}route(t,e,s,n){const a=ve(this,t),r=ve(this,s),o="_"+e;Object.defineProperties(a,{[o]:{value:a[e],writable:!0},[e]:{enumerable:!0,get(){const l=this[o],c=r[n];return C(l)?Object.assign({},c,l):I(l,c)},set(l){this[o]=l}}})}apply(t){t.forEach(e=>e(this))}}var V=new lo({_scriptable:i=>!i.startsWith("on"),_indexable:i=>i!=="events",hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[so,no,oo]);function co(i){return!i||P(i.size)||P(i.family)?null:(i.style?i.style+" ":"")+(i.weight?i.weight+" ":"")+i.size+"px "+i.family}function oi(i,t,e,s,n){let a=t[n];return a||(a=t[n]=i.measureText(n).width,e.push(n)),a>s&&(s=a),s}function uo(i,t,e,s){s=s||{};let n=s.data=s.data||{},a=s.garbageCollect=s.garbageCollect||[];s.font!==t&&(n=s.data={},a=s.garbageCollect=[],s.font=t),i.save(),i.font=t;let r=0;const o=e.length;let l,c,d,u,p;for(l=0;l<o;l++)if(u=e[l],u!=null&&!z(u))r=oi(i,n,a,r,u);else if(z(u))for(c=0,d=u.length;c<d;c++)p=u[c],p!=null&&!z(p)&&(r=oi(i,n,a,r,p));i.restore();const h=a.length/2;if(h>e.length){for(l=0;l<h;l++)delete n[a[l]];a.splice(0,h)}return r}function Nt(i,t,e){const s=i.currentDevicePixelRatio,n=e!==0?Math.max(e/2,.5):0;return Math.round((t-n)*s)/s+n}function Gs(i,t){!t&&!i||(t=t||i.getContext("2d"),t.save(),t.resetTransform(),t.clearRect(0,0,i.width,i.height),t.restore())}function Oi(i,t,e,s){wa(i,t,e,s,null)}function wa(i,t,e,s,n){let a,r,o,l,c,d,u,p;const h=t.pointStyle,g=t.rotation,f=t.radius;let m=(g||0)*Wr;if(h&&typeof h=="object"&&(a=h.toString(),a==="[object HTMLImageElement]"||a==="[object HTMLCanvasElement]")){i.save(),i.translate(e,s),i.rotate(m),i.drawImage(h,-h.width/2,-h.height/2,h.width,h.height),i.restore();return}if(!(isNaN(f)||f<=0)){switch(i.beginPath(),h){default:n?i.ellipse(e,s,n/2,f,0,0,$):i.arc(e,s,f,0,$),i.closePath();break;case"triangle":d=n?n/2:f,i.moveTo(e+Math.sin(m)*d,s-Math.cos(m)*f),m+=Hs,i.lineTo(e+Math.sin(m)*d,s-Math.cos(m)*f),m+=Hs,i.lineTo(e+Math.sin(m)*d,s-Math.cos(m)*f),i.closePath();break;case"rectRounded":c=f*.516,l=f-c,r=Math.cos(m+jt)*l,u=Math.cos(m+jt)*(n?n/2-c:l),o=Math.sin(m+jt)*l,p=Math.sin(m+jt)*(n?n/2-c:l),i.arc(e-u,s-o,c,m-O,m-q),i.arc(e+p,s-r,c,m-q,m),i.arc(e+u,s+o,c,m,m+q),i.arc(e-p,s+r,c,m+q,m+O),i.closePath();break;case"rect":if(!g){l=Math.SQRT1_2*f,d=n?n/2:l,i.rect(e-d,s-l,2*d,2*l);break}m+=jt;case"rectRot":u=Math.cos(m)*(n?n/2:f),r=Math.cos(m)*f,o=Math.sin(m)*f,p=Math.sin(m)*(n?n/2:f),i.moveTo(e-u,s-o),i.lineTo(e+p,s-r),i.lineTo(e+u,s+o),i.lineTo(e-p,s+r),i.closePath();break;case"crossRot":m+=jt;case"cross":u=Math.cos(m)*(n?n/2:f),r=Math.cos(m)*f,o=Math.sin(m)*f,p=Math.sin(m)*(n?n/2:f),i.moveTo(e-u,s-o),i.lineTo(e+u,s+o),i.moveTo(e+p,s-r),i.lineTo(e-p,s+r);break;case"star":u=Math.cos(m)*(n?n/2:f),r=Math.cos(m)*f,o=Math.sin(m)*f,p=Math.sin(m)*(n?n/2:f),i.moveTo(e-u,s-o),i.lineTo(e+u,s+o),i.moveTo(e+p,s-r),i.lineTo(e-p,s+r),m+=jt,u=Math.cos(m)*(n?n/2:f),r=Math.cos(m)*f,o=Math.sin(m)*f,p=Math.sin(m)*(n?n/2:f),i.moveTo(e-u,s-o),i.lineTo(e+u,s+o),i.moveTo(e+p,s-r),i.lineTo(e-p,s+r);break;case"line":r=n?n/2:Math.cos(m)*f,o=Math.sin(m)*f,i.moveTo(e-r,s-o),i.lineTo(e+r,s+o);break;case"dash":i.moveTo(e,s),i.lineTo(e+Math.cos(m)*(n?n/2:f),s+Math.sin(m)*f);break;case!1:i.closePath();break}i.fill(),t.borderWidth>0&&i.stroke()}}function St(i,t,e){return e=e||.5,!t||i&&i.x>t.left-e&&i.x<t.right+e&&i.y>t.top-e&&i.y<t.bottom+e}function pi(i,t){i.save(),i.beginPath(),i.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),i.clip()}function fi(i){i.restore()}function ho(i,t,e,s,n){if(!t)return i.lineTo(e.x,e.y);if(n==="middle"){const a=(t.x+e.x)/2;i.lineTo(a,t.y),i.lineTo(a,e.y)}else n==="after"!=!!s?i.lineTo(t.x,e.y):i.lineTo(e.x,t.y);i.lineTo(e.x,e.y)}function po(i,t,e,s){if(!t)return i.lineTo(e.x,e.y);i.bezierCurveTo(s?t.cp1x:t.cp2x,s?t.cp1y:t.cp2y,s?e.cp2x:e.cp1x,s?e.cp2y:e.cp1y,e.x,e.y)}function fo(i,t){t.translation&&i.translate(t.translation[0],t.translation[1]),P(t.rotation)||i.rotate(t.rotation),t.color&&(i.fillStyle=t.color),t.textAlign&&(i.textAlign=t.textAlign),t.textBaseline&&(i.textBaseline=t.textBaseline)}function go(i,t,e,s,n){if(n.strikethrough||n.underline){const a=i.measureText(s),r=t-a.actualBoundingBoxLeft,o=t+a.actualBoundingBoxRight,l=e-a.actualBoundingBoxAscent,c=e+a.actualBoundingBoxDescent,d=n.strikethrough?(l+c)/2:c;i.strokeStyle=i.fillStyle,i.beginPath(),i.lineWidth=n.decorationWidth||2,i.moveTo(r,d),i.lineTo(o,d),i.stroke()}}function mo(i,t){const e=i.fillStyle;i.fillStyle=t.color,i.fillRect(t.left,t.top,t.width,t.height),i.fillStyle=e}function Gt(i,t,e,s,n,a={}){const r=z(t)?t:[t],o=a.strokeWidth>0&&a.strokeColor!=="";let l,c;for(i.save(),i.font=n.string,fo(i,a),l=0;l<r.length;++l)c=r[l],a.backdrop&&mo(i,a.backdrop),o&&(a.strokeColor&&(i.strokeStyle=a.strokeColor),P(a.strokeWidth)||(i.lineWidth=a.strokeWidth),i.strokeText(c,e,s,a.maxWidth)),i.fillText(c,e,s,a.maxWidth),go(i,e,s,c,a),s+=Number(n.lineHeight);i.restore()}function Ee(i,t){const{x:e,y:s,w:n,h:a,radius:r}=t;i.arc(e+r.topLeft,s+r.topLeft,r.topLeft,1.5*O,O,!0),i.lineTo(e,s+a-r.bottomLeft),i.arc(e+r.bottomLeft,s+a-r.bottomLeft,r.bottomLeft,O,q,!0),i.lineTo(e+n-r.bottomRight,s+a),i.arc(e+n-r.bottomRight,s+a-r.bottomRight,r.bottomRight,q,0,!0),i.lineTo(e+n,s+r.topRight),i.arc(e+n-r.topRight,s+r.topRight,r.topRight,0,-q,!0),i.lineTo(e+r.topLeft,s)}const xo=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,bo=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function yo(i,t){const e=(""+i).match(xo);if(!e||e[1]==="normal")return t*1.2;switch(i=+e[2],e[3]){case"px":return i;case"%":i/=100;break}return t*i}const vo=i=>+i||0;function ss(i,t){const e={},s=C(t),n=s?Object.keys(t):t,a=C(i)?s?r=>I(i[r],i[t[r]]):r=>i[r]:()=>i;for(const r of n)e[r]=vo(a(r));return e}function ka(i){return ss(i,{top:"y",right:"x",bottom:"y",left:"x"})}function qt(i){return ss(i,["topLeft","topRight","bottomLeft","bottomRight"])}function tt(i){const t=ka(i);return t.width=t.left+t.right,t.height=t.top+t.bottom,t}function G(i,t){i=i||{},t=t||V.font;let e=I(i.size,t.size);typeof e=="string"&&(e=parseInt(e,10));let s=I(i.style,t.style);s&&!(""+s).match(bo)&&(console.warn('Invalid font style specified: "'+s+'"'),s=void 0);const n={family:I(i.family,t.family),lineHeight:yo(I(i.lineHeight,t.lineHeight),e),size:e,style:s,weight:I(i.weight,t.weight),string:""};return n.string=co(n),n}function he(i,t,e,s){let n,a,r;for(n=0,a=i.length;n<a;++n)if(r=i[n],r!==void 0&&r!==void 0)return r}function wo(i,t,e){const{min:s,max:n}=i,a=da(t,(n-s)/2),r=(o,l)=>e&&o===0?0:o+l;return{min:r(s,-Math.abs(a)),max:r(n,a)}}function Bt(i,t){return Object.assign(Object.create(i),t)}function ns(i,t=[""],e,s,n=()=>i[0]){const a=e||i;typeof s>"u"&&(s=Ea("_fallback",i));const r={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:i,_rootScopes:a,_fallback:s,_getTarget:n,override:o=>ns([o,...i],t,a,s)};return new Proxy(r,{deleteProperty(o,l){return delete o[l],delete o._keys,delete i[0][l],!0},get(o,l){return Sa(o,l,()=>Do(l,t,i,o))},getOwnPropertyDescriptor(o,l){return Reflect.getOwnPropertyDescriptor(o._scopes[0],l)},getPrototypeOf(){return Reflect.getPrototypeOf(i[0])},has(o,l){return Js(o).includes(l)},ownKeys(o){return Js(o)},set(o,l,c){const d=o._storage||(o._storage=n());return o[l]=d[l]=c,delete o._keys,!0}})}function ie(i,t,e,s){const n={_cacheable:!1,_proxy:i,_context:t,_subProxy:e,_stack:new Set,_descriptors:_a(i,s),setContext:a=>ie(i,a,e,s),override:a=>ie(i.override(a),t,e,s)};return new Proxy(n,{deleteProperty(a,r){return delete a[r],delete i[r],!0},get(a,r,o){return Sa(a,r,()=>_o(a,r,o))},getOwnPropertyDescriptor(a,r){return a._descriptors.allKeys?Reflect.has(i,r)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(i,r)},getPrototypeOf(){return Reflect.getPrototypeOf(i)},has(a,r){return Reflect.has(i,r)},ownKeys(){return Reflect.ownKeys(i)},set(a,r,o){return i[r]=o,delete a[r],!0}})}function _a(i,t={scriptable:!0,indexable:!0}){const{_scriptable:e=t.scriptable,_indexable:s=t.indexable,_allKeys:n=t.allKeys}=i;return{allKeys:n,scriptable:e,indexable:s,isScriptable:Ct(e)?e:()=>e,isIndexable:Ct(s)?s:()=>s}}const ko=(i,t)=>i?i+Qi(t):t,as=(i,t)=>C(t)&&i!=="adapters"&&(Object.getPrototypeOf(t)===null||t.constructor===Object);function Sa(i,t,e){if(Object.prototype.hasOwnProperty.call(i,t)||t==="constructor")return i[t];const s=e();return i[t]=s,s}function _o(i,t,e){const{_proxy:s,_context:n,_subProxy:a,_descriptors:r}=i;let o=s[t];return Ct(o)&&r.isScriptable(t)&&(o=So(t,o,i,e)),z(o)&&o.length&&(o=Mo(t,o,i,r.isIndexable)),as(t,o)&&(o=ie(o,n,a&&a[t],r)),o}function So(i,t,e,s){const{_proxy:n,_context:a,_subProxy:r,_stack:o}=e;if(o.has(i))throw new Error("Recursion detected: "+Array.from(o).join("->")+"->"+i);o.add(i);let l=t(a,r||s);return o.delete(i),as(i,l)&&(l=rs(n._scopes,n,i,l)),l}function Mo(i,t,e,s){const{_proxy:n,_context:a,_subProxy:r,_descriptors:o}=e;if(typeof a.index<"u"&&s(i))return t[a.index%t.length];if(C(t[0])){const l=t,c=n._scopes.filter(d=>d!==l);t=[];for(const d of l){const u=rs(c,n,i,d);t.push(ie(u,a,r&&r[i],o))}}return t}function Ma(i,t,e){return Ct(i)?i(t,e):i}const Eo=(i,t)=>i===!0?t:typeof i=="string"?Pt(t,i):void 0;function Lo(i,t,e,s,n){for(const a of t){const r=Eo(e,a);if(r){i.add(r);const o=Ma(r._fallback,e,n);if(typeof o<"u"&&o!==e&&o!==s)return o}else if(r===!1&&typeof s<"u"&&e!==s)return null}return!1}function rs(i,t,e,s){const n=t._rootScopes,a=Ma(t._fallback,e,s),r=[...i,...n],o=new Set;o.add(s);let l=Ks(o,r,e,a||e,s);return l===null||typeof a<"u"&&a!==e&&(l=Ks(o,r,a,l,s),l===null)?!1:ns(Array.from(o),[""],n,a,()=>To(t,e,s))}function Ks(i,t,e,s,n){for(;e;)e=Lo(i,t,e,s,n);return e}function To(i,t,e){const s=i._getTarget();t in s||(s[t]={});const n=s[t];return z(n)&&C(e)?e:n||{}}function Do(i,t,e,s){let n;for(const a of t)if(n=Ea(ko(a,i),e),typeof n<"u")return as(i,n)?rs(e,s,i,n):n}function Ea(i,t){for(const e of t){if(!e)continue;const s=e[i];if(typeof s<"u")return s}}function Js(i){let t=i._keys;return t||(t=i._keys=Ao(i._scopes)),t}function Ao(i){const t=new Set;for(const e of i)for(const s of Object.keys(e).filter(n=>!n.startsWith("_")))t.add(s);return Array.from(t)}function La(i,t,e,s){const{iScale:n}=i,{key:a="r"}=this._parsing,r=new Array(s);let o,l,c,d;for(o=0,l=s;o<l;++o)c=o+e,d=t[c],r[o]={r:n.parse(Pt(d,a),c)};return r}const Io=Number.EPSILON||1e-14,se=(i,t)=>t<i.length&&!i[t].skip&&i[t],Ta=i=>i==="x"?"y":"x";function Po(i,t,e,s){const n=i.skip?t:i,a=t,r=e.skip?t:e,o=Bi(a,n),l=Bi(r,a);let c=o/(o+l),d=l/(o+l);c=isNaN(c)?0:c,d=isNaN(d)?0:d;const u=s*c,p=s*d;return{previous:{x:a.x-u*(r.x-n.x),y:a.y-u*(r.y-n.y)},next:{x:a.x+p*(r.x-n.x),y:a.y+p*(r.y-n.y)}}}function Co(i,t,e){const s=i.length;let n,a,r,o,l,c=se(i,0);for(let d=0;d<s-1;++d)if(l=c,c=se(i,d+1),!(!l||!c)){if(be(t[d],0,Io)){e[d]=e[d+1]=0;continue}n=e[d]/t[d],a=e[d+1]/t[d],o=Math.pow(n,2)+Math.pow(a,2),!(o<=9)&&(r=3/Math.sqrt(o),e[d]=n*r*t[d],e[d+1]=a*r*t[d])}}function Bo(i,t,e="x"){const s=Ta(e),n=i.length;let a,r,o,l=se(i,0);for(let c=0;c<n;++c){if(r=o,o=l,l=se(i,c+1),!o)continue;const d=o[e],u=o[s];r&&(a=(d-r[e])/3,o[`cp1${e}`]=d-a,o[`cp1${s}`]=u-a*t[c]),l&&(a=(l[e]-d)/3,o[`cp2${e}`]=d+a,o[`cp2${s}`]=u+a*t[c])}}function Ro(i,t="x"){const e=Ta(t),s=i.length,n=Array(s).fill(0),a=Array(s);let r,o,l,c=se(i,0);for(r=0;r<s;++r)if(o=l,l=c,c=se(i,r+1),!!l){if(c){const d=c[t]-l[t];n[r]=d!==0?(c[e]-l[e])/d:0}a[r]=o?c?mt(n[r-1])!==mt(n[r])?0:(n[r-1]+n[r])/2:n[r-1]:n[r]}Co(i,n,a),Bo(i,a,t)}function Fe(i,t,e){return Math.max(Math.min(i,e),t)}function Oo(i,t){let e,s,n,a,r,o=St(i[0],t);for(e=0,s=i.length;e<s;++e)r=a,a=o,o=e<s-1&&St(i[e+1],t),a&&(n=i[e],r&&(n.cp1x=Fe(n.cp1x,t.left,t.right),n.cp1y=Fe(n.cp1y,t.top,t.bottom)),o&&(n.cp2x=Fe(n.cp2x,t.left,t.right),n.cp2y=Fe(n.cp2y,t.top,t.bottom)))}function Fo(i,t,e,s,n){let a,r,o,l;if(t.spanGaps&&(i=i.filter(c=>!c.skip)),t.cubicInterpolationMode==="monotone")Ro(i,n);else{let c=s?i[i.length-1]:i[0];for(a=0,r=i.length;a<r;++a)o=i[a],l=Po(c,o,i[Math.min(a+1,r-(s?0:1))%r],t.tension),o.cp1x=l.previous.x,o.cp1y=l.previous.y,o.cp2x=l.next.x,o.cp2y=l.next.y,c=o}t.capBezierPoints&&Oo(i,e)}function os(){return typeof window<"u"&&typeof document<"u"}function ls(i){let t=i.parentNode;return t&&t.toString()==="[object ShadowRoot]"&&(t=t.host),t}function li(i,t,e){let s;return typeof i=="string"?(s=parseInt(i,10),i.indexOf("%")!==-1&&(s=s/100*t.parentNode[e])):s=i,s}const gi=i=>i.ownerDocument.defaultView.getComputedStyle(i,null);function jo(i,t){return gi(i).getPropertyValue(t)}const No=["top","right","bottom","left"];function Yt(i,t,e){const s={};e=e?"-"+e:"";for(let n=0;n<4;n++){const a=No[n];s[a]=parseFloat(i[t+"-"+a+e])||0}return s.width=s.left+s.right,s.height=s.top+s.bottom,s}const $o=(i,t,e)=>(i>0||t>0)&&(!e||!e.shadowRoot);function Ho(i,t){const e=i.touches,s=e&&e.length?e[0]:i,{offsetX:n,offsetY:a}=s;let r=!1,o,l;if($o(n,a,i.target))o=n,l=a;else{const c=t.getBoundingClientRect();o=s.clientX-c.left,l=s.clientY-c.top,r=!0}return{x:o,y:l,box:r}}function zt(i,t){if("native"in i)return i;const{canvas:e,currentDevicePixelRatio:s}=t,n=gi(e),a=n.boxSizing==="border-box",r=Yt(n,"padding"),o=Yt(n,"border","width"),{x:l,y:c,box:d}=Ho(i,e),u=r.left+(d&&o.left),p=r.top+(d&&o.top);let{width:h,height:g}=t;return a&&(h-=r.width+o.width,g-=r.height+o.height),{x:Math.round((l-u)/h*e.width/s),y:Math.round((c-p)/g*e.height/s)}}function zo(i,t,e){let s,n;if(t===void 0||e===void 0){const a=i&&ls(i);if(!a)t=i.clientWidth,e=i.clientHeight;else{const r=a.getBoundingClientRect(),o=gi(a),l=Yt(o,"border","width"),c=Yt(o,"padding");t=r.width-c.width-l.width,e=r.height-c.height-l.height,s=li(o.maxWidth,a,"clientWidth"),n=li(o.maxHeight,a,"clientHeight")}}return{width:t,height:e,maxWidth:s||ri,maxHeight:n||ri}}const Tt=i=>Math.round(i*10)/10;function Vo(i,t,e,s){const n=gi(i),a=Yt(n,"margin"),r=li(n.maxWidth,i,"clientWidth")||ri,o=li(n.maxHeight,i,"clientHeight")||ri,l=zo(i,t,e);let{width:c,height:d}=l;if(n.boxSizing==="content-box"){const p=Yt(n,"border","width"),h=Yt(n,"padding");c-=h.width+p.width,d-=h.height+p.height}return c=Math.max(0,c-a.width),d=Math.max(0,s?c/s:d-a.height),c=Tt(Math.min(c,r,l.maxWidth)),d=Tt(Math.min(d,o,l.maxHeight)),c&&!d&&(d=Tt(c/2)),(t!==void 0||e!==void 0)&&s&&l.height&&d>l.height&&(d=l.height,c=Tt(Math.floor(d*s))),{width:c,height:d}}function Qs(i,t,e){const s=t||1,n=Tt(i.height*s),a=Tt(i.width*s);i.height=Tt(i.height),i.width=Tt(i.width);const r=i.canvas;return r.style&&(e||!r.style.height&&!r.style.width)&&(r.style.height=`${i.height}px`,r.style.width=`${i.width}px`),i.currentDevicePixelRatio!==s||r.height!==n||r.width!==a?(i.currentDevicePixelRatio=s,r.height=n,r.width=a,i.ctx.setTransform(s,0,0,s,0,0),!0):!1}const Wo=function(){let i=!1;try{const t={get passive(){return i=!0,!1}};os()&&(window.addEventListener("test",null,t),window.removeEventListener("test",null,t))}catch{}return i}();function Zs(i,t){const e=jo(i,t),s=e&&e.match(/^(\d+)(\.\d+)?px$/);return s?+s[1]:void 0}function Vt(i,t,e,s){return{x:i.x+e*(t.x-i.x),y:i.y+e*(t.y-i.y)}}function Uo(i,t,e,s){return{x:i.x+e*(t.x-i.x),y:s==="middle"?e<.5?i.y:t.y:s==="after"?e<1?i.y:t.y:e>0?t.y:i.y}}function qo(i,t,e,s){const n={x:i.cp2x,y:i.cp2y},a={x:t.cp1x,y:t.cp1y},r=Vt(i,n,e),o=Vt(n,a,e),l=Vt(a,t,e),c=Vt(r,o,e),d=Vt(o,l,e);return Vt(c,d,e)}const Yo=function(i,t){return{x(e){return i+i+t-e},setWidth(e){t=e},textAlign(e){return e==="center"?e:e==="right"?"left":"right"},xPlus(e,s){return e-s},leftForLtr(e,s){return e-s}}},Xo=function(){return{x(i){return i},setWidth(i){},textAlign(i){return i},xPlus(i,t){return i+t},leftForLtr(i,t){return i}}};function te(i,t,e){return i?Yo(t,e):Xo()}function Da(i,t){let e,s;(t==="ltr"||t==="rtl")&&(e=i.canvas.style,s=[e.getPropertyValue("direction"),e.getPropertyPriority("direction")],e.setProperty("direction",t,"important"),i.prevTextDirection=s)}function Aa(i,t){t!==void 0&&(delete i.prevTextDirection,i.canvas.style.setProperty("direction",t[0],t[1]))}function Ia(i){return i==="angle"?{between:Me,compare:Xr,normalize:Q}:{between:kt,compare:(t,e)=>t-e,normalize:t=>t}}function tn({start:i,end:t,count:e,loop:s,style:n}){return{start:i%e,end:t%e,loop:s&&(t-i+1)%e===0,style:n}}function Go(i,t,e){const{property:s,start:n,end:a}=e,{between:r,normalize:o}=Ia(s),l=t.length;let{start:c,end:d,loop:u}=i,p,h;if(u){for(c+=l,d+=l,p=0,h=l;p<h&&r(o(t[c%l][s]),n,a);++p)c--,d--;c%=l,d%=l}return d<c&&(d+=l),{start:c,end:d,loop:u,style:i.style}}function Pa(i,t,e){if(!e)return[i];const{property:s,start:n,end:a}=e,r=t.length,{compare:o,between:l,normalize:c}=Ia(s),{start:d,end:u,loop:p,style:h}=Go(i,t,e),g=[];let f=!1,m=null,x,b,y;const k=()=>l(n,y,x)&&o(n,y)!==0,v=()=>o(a,x)===0||l(a,y,x),w=()=>f||k(),_=()=>!f||v();for(let S=d,M=d;S<=u;++S)b=t[S%r],!b.skip&&(x=c(b[s]),x!==y&&(f=l(x,n,a),m===null&&w()&&(m=o(x,n)===0?S:M),m!==null&&_()&&(g.push(tn({start:m,end:S,loop:p,count:r,style:h})),m=null),M=S,y=x));return m!==null&&g.push(tn({start:m,end:u,loop:p,count:r,style:h})),g}function Ca(i,t){const e=[],s=i.segments;for(let n=0;n<s.length;n++){const a=Pa(s[n],i.points,t);a.length&&e.push(...a)}return e}function Ko(i,t,e,s){let n=0,a=t-1;if(e&&!s)for(;n<t&&!i[n].skip;)n++;for(;n<t&&i[n].skip;)n++;for(n%=t,e&&(a+=n);a>n&&i[a%t].skip;)a--;return a%=t,{start:n,end:a}}function Jo(i,t,e,s){const n=i.length,a=[];let r=t,o=i[t],l;for(l=t+1;l<=e;++l){const c=i[l%n];c.skip||c.stop?o.skip||(s=!1,a.push({start:t%n,end:(l-1)%n,loop:s}),t=r=c.stop?l:null):(r=l,o.skip&&(t=l)),o=c}return r!==null&&a.push({start:t%n,end:r%n,loop:s}),a}function Qo(i,t){const e=i.points,s=i.options.spanGaps,n=e.length;if(!n)return[];const a=!!i._loop,{start:r,end:o}=Ko(e,n,a,s);if(s===!0)return en(i,[{start:r,end:o,loop:a}],e,t);const l=o<r?o+n:o,c=!!i._fullLoop&&r===0&&o===n-1;return en(i,Jo(e,r,l,c),e,t)}function en(i,t,e,s){return!s||!s.setContext||!e?t:Zo(i,t,e,s)}function Zo(i,t,e,s){const n=i._chart.getContext(),a=sn(i.options),{_datasetIndex:r,options:{spanGaps:o}}=i,l=e.length,c=[];let d=a,u=t[0].start,p=u;function h(g,f,m,x){const b=o?-1:1;if(g!==f){for(g+=l;e[g%l].skip;)g-=b;for(;e[f%l].skip;)f+=b;g%l!==f%l&&(c.push({start:g%l,end:f%l,loop:m,style:x}),d=x,u=f%l)}}for(const g of t){u=o?u:g.start;let f=e[u%l],m;for(p=u+1;p<=g.end;p++){const x=e[p%l];m=sn(s.setContext(Bt(n,{type:"segment",p0:f,p1:x,p0DataIndex:(p-1)%l,p1DataIndex:p%l,datasetIndex:r}))),tl(m,d)&&h(u,p-1,g.loop,d),f=x,d=m}u<p-1&&h(u,p-1,g.loop,d)}return c}function sn(i){return{backgroundColor:i.backgroundColor,borderCapStyle:i.borderCapStyle,borderDash:i.borderDash,borderDashOffset:i.borderDashOffset,borderJoinStyle:i.borderJoinStyle,borderWidth:i.borderWidth,borderColor:i.borderColor}}function tl(i,t){if(!t)return!1;const e=[],s=function(n,a){return is(a)?(e.includes(a)||e.push(a),e.indexOf(a)):a};return JSON.stringify(i,s)!==JSON.stringify(t,s)}function je(i,t,e){return i.options.clip?i[e]:t[e]}function el(i,t){const{xScale:e,yScale:s}=i;return e&&s?{left:je(e,t,"left"),right:je(e,t,"right"),top:je(s,t,"top"),bottom:je(s,t,"bottom")}:t}function Ba(i,t){const e=t._clip;if(e.disabled)return!1;const s=el(t,i.chartArea);return{left:e.left===!1?0:s.left-(e.left===!0?0:e.left),right:e.right===!1?i.width:s.right+(e.right===!0?0:e.right),top:e.top===!1?0:s.top-(e.top===!0?0:e.top),bottom:e.bottom===!1?i.height:s.bottom+(e.bottom===!0?0:e.bottom)}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */class il{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,s,n){const a=e.listeners[n],r=e.duration;a.forEach(o=>o({chart:t,initial:e.initial,numSteps:r,currentStep:Math.min(s-e.start,r)}))}_refresh(){this._request||(this._running=!0,this._request=ma.call(window,()=>{this._update(),this._request=null,this._running&&this._refresh()}))}_update(t=Date.now()){let e=0;this._charts.forEach((s,n)=>{if(!s.running||!s.items.length)return;const a=s.items;let r=a.length-1,o=!1,l;for(;r>=0;--r)l=a[r],l._active?(l._total>s.duration&&(s.duration=l._total),l.tick(t),o=!0):(a[r]=a[a.length-1],a.pop());o&&(n.draw(),this._notify(n,s,t,"progress")),a.length||(s.running=!1,this._notify(n,s,t,"complete"),s.initial=!1),e+=a.length}),this._lastDate=t,e===0&&(this._running=!1)}_getAnims(t){const e=this._charts;let s=e.get(t);return s||(s={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,s)),s}listen(t,e,s){this._getAnims(t).listeners[e].push(s)}add(t,e){!e||!e.length||this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce((s,n)=>Math.max(s,n._duration),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!(!e||!e.running||!e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const s=e.items;let n=s.length-1;for(;n>=0;--n)s[n].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var yt=new il;const nn="transparent",sl={boolean(i,t,e){return e>.5?t:i},color(i,t,e){const s=Ys(i||nn),n=s.valid&&Ys(t||nn);return n&&n.valid?n.mix(s,e).hexString():t},number(i,t,e){return i+(t-i)*e}};class nl{constructor(t,e,s,n){const a=e[s];n=he([t.to,n,a,t.from]);const r=he([t.from,a,n]);this._active=!0,this._fn=t.fn||sl[t.type||typeof r],this._easing=ye[t.easing]||ye.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=s,this._from=r,this._to=n,this._promises=void 0}active(){return this._active}update(t,e,s){if(this._active){this._notify(!1);const n=this._target[this._prop],a=s-this._start,r=this._duration-a;this._start=s,this._duration=Math.floor(Math.max(r,t.duration)),this._total+=a,this._loop=!!t.loop,this._to=he([t.to,e,n,t.from]),this._from=he([t.from,n,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,s=this._duration,n=this._prop,a=this._from,r=this._loop,o=this._to;let l;if(this._active=a!==o&&(r||e<s),!this._active){this._target[n]=o,this._notify(!0);return}if(e<0){this._target[n]=a;return}l=e/s%2,l=r&&l>1?2-l:l,l=this._easing(Math.min(1,Math.max(0,l))),this._target[n]=this._fn(a,o,l)}wait(){const t=this._promises||(this._promises=[]);return new Promise((e,s)=>{t.push({res:e,rej:s})})}_notify(t){const e=t?"res":"rej",s=this._promises||[];for(let n=0;n<s.length;n++)s[n][e]()}}class Ra{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!C(t))return;const e=Object.keys(V.animation),s=this._properties;Object.getOwnPropertyNames(t).forEach(n=>{const a=t[n];if(!C(a))return;const r={};for(const o of e)r[o]=a[o];(z(a.properties)&&a.properties||[n]).forEach(o=>{(o===n||!s.has(o))&&s.set(o,r)})})}_animateOptions(t,e){const s=e.options,n=rl(t,s);if(!n)return[];const a=this._createAnimations(n,s);return s.$shared&&al(t.options.$animations,s).then(()=>{t.options=s},()=>{}),a}_createAnimations(t,e){const s=this._properties,n=[],a=t.$animations||(t.$animations={}),r=Object.keys(e),o=Date.now();let l;for(l=r.length-1;l>=0;--l){const c=r[l];if(c.charAt(0)==="$")continue;if(c==="options"){n.push(...this._animateOptions(t,e));continue}const d=e[c];let u=a[c];const p=s.get(c);if(u)if(p&&u.active()){u.update(p,d,o);continue}else u.cancel();if(!p||!p.duration){t[c]=d;continue}a[c]=u=new nl(p,t,c,d),n.push(u)}return n}update(t,e){if(this._properties.size===0){Object.assign(t,e);return}const s=this._createAnimations(t,e);if(s.length)return yt.add(this._chart,s),!0}}function al(i,t){const e=[],s=Object.keys(t);for(let n=0;n<s.length;n++){const a=i[s[n]];a&&a.active()&&e.push(a.wait())}return Promise.all(e)}function rl(i,t){if(!t)return;let e=i.options;if(!e){i.options=t;return}return e.$shared&&(i.options=e=Object.assign({},e,{$shared:!1,$animations:{}})),e}function an(i,t){const e=i&&i.options||{},s=e.reverse,n=e.min===void 0?t:0,a=e.max===void 0?t:0;return{start:s?a:n,end:s?n:a}}function ol(i,t,e){if(e===!1)return!1;const s=an(i,e),n=an(t,e);return{top:n.end,right:s.end,bottom:n.start,left:s.start}}function ll(i){let t,e,s,n;return C(i)?(t=i.top,e=i.right,s=i.bottom,n=i.left):t=e=s=n=i,{top:t,right:e,bottom:s,left:n,disabled:i===!1}}function Oa(i,t){const e=[],s=i._getSortedDatasetMetas(t);let n,a;for(n=0,a=s.length;n<a;++n)e.push(s[n].index);return e}function rn(i,t,e,s={}){const n=i.keys,a=s.mode==="single";let r,o,l,c;if(t===null)return;let d=!1;for(r=0,o=n.length;r<o;++r){if(l=+n[r],l===e){if(d=!0,s.all)continue;break}c=i.values[l],U(c)&&(a||t===0||mt(t)===mt(c))&&(t+=c)}return!d&&!s.all?0:t}function cl(i,t){const{iScale:e,vScale:s}=t,n=e.axis==="x"?"x":"y",a=s.axis==="x"?"x":"y",r=Object.keys(i),o=new Array(r.length);let l,c,d;for(l=0,c=r.length;l<c;++l)d=r[l],o[l]={[n]:d,[a]:i[d]};return o}function ki(i,t){const e=i&&i.options.stacked;return e||e===void 0&&t.stack!==void 0}function dl(i,t,e){return`${i.id}.${t.id}.${e.stack||e.type}`}function ul(i){const{min:t,max:e,minDefined:s,maxDefined:n}=i.getUserBounds();return{min:s?t:Number.NEGATIVE_INFINITY,max:n?e:Number.POSITIVE_INFINITY}}function hl(i,t,e){const s=i[t]||(i[t]={});return s[e]||(s[e]={})}function on(i,t,e,s){for(const n of t.getMatchingVisibleMetas(s).reverse()){const a=i[n.index];if(e&&a>0||!e&&a<0)return n.index}return null}function ln(i,t){const{chart:e,_cachedMeta:s}=i,n=e._stacks||(e._stacks={}),{iScale:a,vScale:r,index:o}=s,l=a.axis,c=r.axis,d=dl(a,r,s),u=t.length;let p;for(let h=0;h<u;++h){const g=t[h],{[l]:f,[c]:m}=g,x=g._stacks||(g._stacks={});p=x[c]=hl(n,d,f),p[o]=m,p._top=on(p,r,!0,s.type),p._bottom=on(p,r,!1,s.type);const b=p._visualValues||(p._visualValues={});b[o]=m}}function _i(i,t){const e=i.scales;return Object.keys(e).filter(s=>e[s].axis===t).shift()}function pl(i,t){return Bt(i,{active:!1,dataset:void 0,datasetIndex:t,index:t,mode:"default",type:"dataset"})}function fl(i,t,e){return Bt(i,{active:!1,dataIndex:t,parsed:void 0,raw:void 0,element:e,index:t,mode:"default",type:"data"})}function re(i,t){const e=i.controller.index,s=i.vScale&&i.vScale.axis;if(s){t=t||i._parsed;for(const n of t){const a=n._stacks;if(!a||a[s]===void 0||a[s][e]===void 0)return;delete a[s][e],a[s]._visualValues!==void 0&&a[s]._visualValues[e]!==void 0&&delete a[s]._visualValues[e]}}}const Si=i=>i==="reset"||i==="none",cn=(i,t)=>t?i:Object.assign({},i),gl=(i,t,e)=>i&&!t.hidden&&t._stacked&&{keys:Oa(e,!0),values:null};class dt{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=ki(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&re(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,s=this.getDataset(),n=(u,p,h,g)=>u==="x"?p:u==="r"?g:h,a=e.xAxisID=I(s.xAxisID,_i(t,"x")),r=e.yAxisID=I(s.yAxisID,_i(t,"y")),o=e.rAxisID=I(s.rAxisID,_i(t,"r")),l=e.indexAxis,c=e.iAxisID=n(l,a,r,o),d=e.vAxisID=n(l,r,a,o);e.xScale=this.getScaleForId(a),e.yScale=this.getScaleForId(r),e.rScale=this.getScaleForId(o),e.iScale=this.getScaleForId(c),e.vScale=this.getScaleForId(d)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&Ws(this._data,this),t._stacked&&re(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),s=this._data;if(C(e)){const n=this._cachedMeta;this._data=cl(e,n)}else if(s!==e){if(s){Ws(s,this);const n=this._cachedMeta;re(n),n._parsed=[]}e&&Object.isExtensible(e)&&Qr(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,s=this.getDataset();let n=!1;this._dataCheck();const a=e._stacked;e._stacked=ki(e.vScale,e),e.stack!==s.stack&&(n=!0,re(e),e.stack=s.stack),this._resyncElements(t),(n||a!==e._stacked)&&(ln(this,e._parsed),e._stacked=ki(e.vScale,e))}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),s=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(s,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:s,_data:n}=this,{iScale:a,_stacked:r}=s,o=a.axis;let l=t===0&&e===n.length?!0:s._sorted,c=t>0&&s._parsed[t-1],d,u,p;if(this._parsing===!1)s._parsed=n,s._sorted=!0,p=n;else{z(n[t])?p=this.parseArrayData(s,n,t,e):C(n[t])?p=this.parseObjectData(s,n,t,e):p=this.parsePrimitiveData(s,n,t,e);const h=()=>u[o]===null||c&&u[o]<c[o];for(d=0;d<e;++d)s._parsed[d+t]=u=p[d],l&&(h()&&(l=!1),c=u);s._sorted=l}r&&ln(this,p)}parsePrimitiveData(t,e,s,n){const{iScale:a,vScale:r}=t,o=a.axis,l=r.axis,c=a.getLabels(),d=a===r,u=new Array(n);let p,h,g;for(p=0,h=n;p<h;++p)g=p+s,u[p]={[o]:d||a.parse(c[g],g),[l]:r.parse(e[g],g)};return u}parseArrayData(t,e,s,n){const{xScale:a,yScale:r}=t,o=new Array(n);let l,c,d,u;for(l=0,c=n;l<c;++l)d=l+s,u=e[d],o[l]={x:a.parse(u[0],d),y:r.parse(u[1],d)};return o}parseObjectData(t,e,s,n){const{xScale:a,yScale:r}=t,{xAxisKey:o="x",yAxisKey:l="y"}=this._parsing,c=new Array(n);let d,u,p,h;for(d=0,u=n;d<u;++d)p=d+s,h=e[p],c[d]={x:a.parse(Pt(h,o),p),y:r.parse(Pt(h,l),p)};return c}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,s){const n=this.chart,a=this._cachedMeta,r=e[t.axis],o={keys:Oa(n,!0),values:e._stacks[t.axis]._visualValues};return rn(o,r,a.index,{mode:s})}updateRangeFromParsed(t,e,s,n){const a=s[e.axis];let r=a===null?NaN:a;const o=n&&s._stacks[e.axis];n&&o&&(n.values=o,r=rn(n,a,this._cachedMeta.index)),t.min=Math.min(t.min,r),t.max=Math.max(t.max,r)}getMinMax(t,e){const s=this._cachedMeta,n=s._parsed,a=s._sorted&&t===s.iScale,r=n.length,o=this._getOtherScale(t),l=gl(e,s,this.chart),c={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:d,max:u}=ul(o);let p,h;function g(){h=n[p];const f=h[o.axis];return!U(h[t.axis])||d>f||u<f}for(p=0;p<r&&!(!g()&&(this.updateRangeFromParsed(c,t,h,l),a));++p);if(a){for(p=r-1;p>=0;--p)if(!g()){this.updateRangeFromParsed(c,t,h,l);break}}return c}getAllParsedValues(t){const e=this._cachedMeta._parsed,s=[];let n,a,r;for(n=0,a=e.length;n<a;++n)r=e[n][t.axis],U(r)&&s.push(r);return s}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,s=e.iScale,n=e.vScale,a=this.getParsed(t);return{label:s?""+s.getLabelForValue(a[s.axis]):"",value:n?""+n.getLabelForValue(a[n.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=ll(I(this.options.clip,ol(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,s=this._cachedMeta,n=s.data||[],a=e.chartArea,r=[],o=this._drawStart||0,l=this._drawCount||n.length-o,c=this.options.drawActiveElementsOnTop;let d;for(s.dataset&&s.dataset.draw(t,a,o,l),d=o;d<o+l;++d){const u=n[d];u.hidden||(u.active&&c?r.push(u):u.draw(t,a))}for(d=0;d<r.length;++d)r[d].draw(t,a)}getStyle(t,e){const s=e?"active":"default";return t===void 0&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(s):this.resolveDataElementOptions(t||0,s)}getContext(t,e,s){const n=this.getDataset();let a;if(t>=0&&t<this._cachedMeta.data.length){const r=this._cachedMeta.data[t];a=r.$context||(r.$context=fl(this.getContext(),t,r)),a.parsed=this.getParsed(t),a.raw=n.data[t],a.index=a.dataIndex=t}else a=this.$context||(this.$context=pl(this.chart.getContext(),this.index)),a.dataset=n,a.index=a.datasetIndex=this.index;return a.active=!!e,a.mode=s,a}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",s){const n=e==="active",a=this._cachedDataOpts,r=t+"-"+e,o=a[r],l=this.enableOptionSharing&&Se(s);if(o)return cn(o,l);const c=this.chart.config,d=c.datasetElementScopeKeys(this._type,t),u=n?[`${t}Hover`,"hover",t,""]:[t,""],p=c.getOptionScopes(this.getDataset(),d),h=Object.keys(V.elements[t]),g=()=>this.getContext(s,n,e),f=c.resolveNamedOptions(p,h,g,u);return f.$shared&&(f.$shared=l,a[r]=Object.freeze(cn(f,l))),f}_resolveAnimations(t,e,s){const n=this.chart,a=this._cachedDataOpts,r=`animation-${e}`,o=a[r];if(o)return o;let l;if(n.options.animation!==!1){const d=this.chart.config,u=d.datasetAnimationScopeKeys(this._type,e),p=d.getOptionScopes(this.getDataset(),u);l=d.createResolver(p,this.getContext(t,s,e))}const c=new Ra(n,l&&l.animations);return l&&l._cacheable&&(a[r]=Object.freeze(c)),c}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||Si(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const s=this.resolveDataElementOptions(t,e),n=this._sharedOptions,a=this.getSharedOptions(s),r=this.includeOptions(e,a)||a!==n;return this.updateSharedOptions(a,e,s),{sharedOptions:a,includeOptions:r}}updateElement(t,e,s,n){Si(n)?Object.assign(t,s):this._resolveAnimations(e,n).update(t,s)}updateSharedOptions(t,e,s){t&&!Si(e)&&this._resolveAnimations(void 0,e).update(t,s)}_setStyle(t,e,s,n){t.active=n;const a=this.getStyle(e,n);this._resolveAnimations(e,s,n).update(t,{options:!n&&this.getSharedOptions(a)||a})}removeHoverStyle(t,e,s){this._setStyle(t,s,"active",!1)}setHoverStyle(t,e,s){this._setStyle(t,s,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,s=this._cachedMeta.data;for(const[o,l,c]of this._syncList)this[o](l,c);this._syncList=[];const n=s.length,a=e.length,r=Math.min(a,n);r&&this.parse(0,r),a>n?this._insertElements(n,a-n,t):a<n&&this._removeElements(a,n-a)}_insertElements(t,e,s=!0){const n=this._cachedMeta,a=n.data,r=t+e;let o;const l=c=>{for(c.length+=e,o=c.length-1;o>=r;o--)c[o]=c[o-e]};for(l(a),o=t;o<r;++o)a[o]=new this.dataElementType;this._parsing&&l(n._parsed),this.parse(t,e),s&&this.updateElements(a,t,e,"reset")}updateElements(t,e,s,n){}_removeElements(t,e){const s=this._cachedMeta;if(this._parsing){const n=s._parsed.splice(t,e);s._stacked&&re(s,n)}s.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,s,n]=t;this[e](s,n)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const s=arguments.length-2;s&&this._sync(["_insertElements",t,s])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}E(dt,"defaults",{}),E(dt,"datasetElementType",null),E(dt,"dataElementType",null);function ml(i,t){if(!i._cache.$bar){const e=i.getMatchingVisibleMetas(t);let s=[];for(let n=0,a=e.length;n<a;n++)s=s.concat(e[n].controller.getAllParsedValues(i));i._cache.$bar=ga(s.sort((n,a)=>n-a))}return i._cache.$bar}function xl(i){const t=i.iScale,e=ml(t,i.type);let s=t._length,n,a,r,o;const l=()=>{r===32767||r===-32768||(Se(o)&&(s=Math.min(s,Math.abs(r-o)||s)),o=r)};for(n=0,a=e.length;n<a;++n)r=t.getPixelForValue(e[n]),l();for(o=void 0,n=0,a=t.ticks.length;n<a;++n)r=t.getPixelForTick(n),l();return s}function bl(i,t,e,s){const n=e.barThickness;let a,r;return P(n)?(a=t.min*e.categoryPercentage,r=e.barPercentage):(a=n*s,r=1),{chunk:a/s,ratio:r,start:t.pixels[i]-a/2}}function yl(i,t,e,s){const n=t.pixels,a=n[i];let r=i>0?n[i-1]:null,o=i<n.length-1?n[i+1]:null;const l=e.categoryPercentage;r===null&&(r=a-(o===null?t.end-t.start:o-a)),o===null&&(o=a+a-r);const c=a-(a-Math.min(r,o))/2*l;return{chunk:Math.abs(o-r)/2*l/s,ratio:e.barPercentage,start:c}}function vl(i,t,e,s){const n=e.parse(i[0],s),a=e.parse(i[1],s),r=Math.min(n,a),o=Math.max(n,a);let l=r,c=o;Math.abs(r)>Math.abs(o)&&(l=o,c=r),t[e.axis]=c,t._custom={barStart:l,barEnd:c,start:n,end:a,min:r,max:o}}function Fa(i,t,e,s){return z(i)?vl(i,t,e,s):t[e.axis]=e.parse(i,s),t}function dn(i,t,e,s){const n=i.iScale,a=i.vScale,r=n.getLabels(),o=n===a,l=[];let c,d,u,p;for(c=e,d=e+s;c<d;++c)p=t[c],u={},u[n.axis]=o||n.parse(r[c],c),l.push(Fa(p,u,a,c));return l}function Mi(i){return i&&i.barStart!==void 0&&i.barEnd!==void 0}function wl(i,t,e){return i!==0?mt(i):(t.isHorizontal()?1:-1)*(t.min>=e?1:-1)}function kl(i){let t,e,s,n,a;return i.horizontal?(t=i.base>i.x,e="left",s="right"):(t=i.base<i.y,e="bottom",s="top"),t?(n="end",a="start"):(n="start",a="end"),{start:e,end:s,reverse:t,top:n,bottom:a}}function _l(i,t,e,s){let n=t.borderSkipped;const a={};if(!n){i.borderSkipped=a;return}if(n===!0){i.borderSkipped={top:!0,right:!0,bottom:!0,left:!0};return}const{start:r,end:o,reverse:l,top:c,bottom:d}=kl(i);n==="middle"&&e&&(i.enableBorderRadius=!0,(e._top||0)===s?n=c:(e._bottom||0)===s?n=d:(a[un(d,r,o,l)]=!0,n=c)),a[un(n,r,o,l)]=!0,i.borderSkipped=a}function un(i,t,e,s){return s?(i=Sl(i,t,e),i=hn(i,e,t)):i=hn(i,t,e),i}function Sl(i,t,e){return i===t?e:i===e?t:i}function hn(i,t,e){return i==="start"?t:i==="end"?e:i}function Ml(i,{inflateAmount:t},e){i.inflateAmount=t==="auto"?e===1?.33:0:t}class Ye extends dt{parsePrimitiveData(t,e,s,n){return dn(t,e,s,n)}parseArrayData(t,e,s,n){return dn(t,e,s,n)}parseObjectData(t,e,s,n){const{iScale:a,vScale:r}=t,{xAxisKey:o="x",yAxisKey:l="y"}=this._parsing,c=a.axis==="x"?o:l,d=r.axis==="x"?o:l,u=[];let p,h,g,f;for(p=s,h=s+n;p<h;++p)f=e[p],g={},g[a.axis]=a.parse(Pt(f,c),p),u.push(Fa(Pt(f,d),g,r,p));return u}updateRangeFromParsed(t,e,s,n){super.updateRangeFromParsed(t,e,s,n);const a=s._custom;a&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,a.min),t.max=Math.max(t.max,a.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:s,vScale:n}=e,a=this.getParsed(t),r=a._custom,o=Mi(r)?"["+r.start+", "+r.end+"]":""+n.getLabelForValue(a[n.axis]);return{label:""+s.getLabelForValue(a[s.axis]),value:o}}initialize(){this.enableOptionSharing=!0,super.initialize();const t=this._cachedMeta;t.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,s,n){const a=n==="reset",{index:r,_cachedMeta:{vScale:o}}=this,l=o.getBasePixel(),c=o.isHorizontal(),d=this._getRuler(),{sharedOptions:u,includeOptions:p}=this._getSharedOptions(e,n);for(let h=e;h<e+s;h++){const g=this.getParsed(h),f=a||P(g[o.axis])?{base:l,head:l}:this._calculateBarValuePixels(h),m=this._calculateBarIndexPixels(h,d),x=(g._stacks||{})[o.axis],b={horizontal:c,base:f.base,enableBorderRadius:!x||Mi(g._custom)||r===x._top||r===x._bottom,x:c?f.head:m.center,y:c?m.center:f.head,height:c?m.size:Math.abs(f.size),width:c?Math.abs(f.size):m.size};p&&(b.options=u||this.resolveDataElementOptions(h,t[h].active?"active":n));const y=b.options||t[h].options;_l(b,y,x,r),Ml(b,y,d.ratio),this.updateElement(t[h],h,b,n)}}_getStacks(t,e){const{iScale:s}=this._cachedMeta,n=s.getMatchingVisibleMetas(this._type).filter(d=>d.controller.options.grouped),a=s.options.stacked,r=[],o=this._cachedMeta.controller.getParsed(e),l=o&&o[s.axis],c=d=>{const u=d._parsed.find(h=>h[s.axis]===l),p=u&&u[d.vScale.axis];if(P(p)||isNaN(p))return!0};for(const d of n)if(!(e!==void 0&&c(d))&&((a===!1||r.indexOf(d.stack)===-1||a===void 0&&d.stack===void 0)&&r.push(d.stack),d.index===t))break;return r.length||r.push(void 0),r}_getStackCount(t){return this._getStacks(void 0,t).length}_getAxisCount(){return this._getAxis().length}getFirstScaleIdForIndexAxis(){const t=this.chart.scales,e=this.chart.options.indexAxis;return Object.keys(t).filter(s=>t[s].axis===e).shift()}_getAxis(){const t={},e=this.getFirstScaleIdForIndexAxis();for(const s of this.chart.data.datasets)t[I(this.chart.options.indexAxis==="x"?s.xAxisID:s.yAxisID,e)]=!0;return Object.keys(t)}_getStackIndex(t,e,s){const n=this._getStacks(t,s),a=e!==void 0?n.indexOf(e):-1;return a===-1?n.length-1:a}_getRuler(){const t=this.options,e=this._cachedMeta,s=e.iScale,n=[];let a,r;for(a=0,r=e.data.length;a<r;++a)n.push(s.getPixelForValue(this.getParsed(a)[s.axis],a));const o=t.barThickness;return{min:o||xl(e),pixels:n,start:s._startPixel,end:s._endPixel,stackCount:this._getStackCount(),scale:s,grouped:t.grouped,ratio:o?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:s,index:n},options:{base:a,minBarLength:r}}=this,o=a||0,l=this.getParsed(t),c=l._custom,d=Mi(c);let u=l[e.axis],p=0,h=s?this.applyStack(e,l,s):u,g,f;h!==u&&(p=h-u,h=u),d&&(u=c.barStart,h=c.barEnd-c.barStart,u!==0&&mt(u)!==mt(c.barEnd)&&(p=0),p+=u);const m=!P(a)&&!d?a:p;let x=e.getPixelForValue(m);if(this.chart.getDataVisibility(t)?g=e.getPixelForValue(p+h):g=x,f=g-x,Math.abs(f)<r){f=wl(f,e,o)*r,u===o&&(x-=f/2);const b=e.getPixelForDecimal(0),y=e.getPixelForDecimal(1),k=Math.min(b,y),v=Math.max(b,y);x=Math.max(Math.min(x,v),k),g=x+f,s&&!d&&(l._stacks[e.axis]._visualValues[n]=e.getValueForPixel(g)-e.getValueForPixel(x))}if(x===e.getPixelForValue(o)){const b=mt(f)*e.getLineWidthForValue(o)/2;x+=b,f-=b}return{size:f,base:x,head:g,center:g+f/2}}_calculateBarIndexPixels(t,e){const s=e.scale,n=this.options,a=n.skipNull,r=I(n.maxBarThickness,1/0);let o,l;const c=this._getAxisCount();if(e.grouped){const d=a?this._getStackCount(t):e.stackCount,u=n.barThickness==="flex"?yl(t,e,n,d*c):bl(t,e,n,d*c),p=this.chart.options.indexAxis==="x"?this.getDataset().xAxisID:this.getDataset().yAxisID,h=this._getAxis().indexOf(I(p,this.getFirstScaleIdForIndexAxis())),g=this._getStackIndex(this.index,this._cachedMeta.stack,a?t:void 0)+h;o=u.start+u.chunk*g+u.chunk/2,l=Math.min(r,u.chunk*u.ratio)}else o=s.getPixelForValue(this.getParsed(t)[s.axis],t),l=Math.min(r,e.min*e.ratio);return{base:o-l/2,head:o+l/2,center:o,size:l}}draw(){const t=this._cachedMeta,e=t.vScale,s=t.data,n=s.length;let a=0;for(;a<n;++a)this.getParsed(a)[e.axis]!==null&&!s[a].hidden&&s[a].draw(this._ctx)}}E(Ye,"id","bar"),E(Ye,"defaults",{datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}}),E(Ye,"overrides",{scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}});class Xe extends dt{initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,s,n){const a=super.parsePrimitiveData(t,e,s,n);for(let r=0;r<a.length;r++)a[r]._custom=this.resolveDataElementOptions(r+s).radius;return a}parseArrayData(t,e,s,n){const a=super.parseArrayData(t,e,s,n);for(let r=0;r<a.length;r++){const o=e[s+r];a[r]._custom=I(o[2],this.resolveDataElementOptions(r+s).radius)}return a}parseObjectData(t,e,s,n){const a=super.parseObjectData(t,e,s,n);for(let r=0;r<a.length;r++){const o=e[s+r];a[r]._custom=I(o&&o.r&&+o.r,this.resolveDataElementOptions(r+s).radius)}return a}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let s=t.length-1;s>=0;--s)e=Math.max(e,t[s].size(this.resolveDataElementOptions(s))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart.data.labels||[],{xScale:n,yScale:a}=e,r=this.getParsed(t),o=n.getLabelForValue(r.x),l=a.getLabelForValue(r.y),c=r._custom;return{label:s[t]||"",value:"("+o+", "+l+(c?", "+c:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,s,n){const a=n==="reset",{iScale:r,vScale:o}=this._cachedMeta,{sharedOptions:l,includeOptions:c}=this._getSharedOptions(e,n),d=r.axis,u=o.axis;for(let p=e;p<e+s;p++){const h=t[p],g=!a&&this.getParsed(p),f={},m=f[d]=a?r.getPixelForDecimal(.5):r.getPixelForValue(g[d]),x=f[u]=a?o.getBasePixel():o.getPixelForValue(g[u]);f.skip=isNaN(m)||isNaN(x),c&&(f.options=l||this.resolveDataElementOptions(p,h.active?"active":n),a&&(f.options.radius=0)),this.updateElement(h,p,f,n)}}resolveDataElementOptions(t,e){const s=this.getParsed(t);let n=super.resolveDataElementOptions(t,e);n.$shared&&(n=Object.assign({},n,{$shared:!1}));const a=n.radius;return e!=="active"&&(n.radius=0),n.radius+=I(s&&s._custom,a),n}}E(Xe,"id","bubble"),E(Xe,"defaults",{datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}}),E(Xe,"overrides",{scales:{x:{type:"linear"},y:{type:"linear"}}});function El(i,t,e){let s=1,n=1,a=0,r=0;if(t<$){const o=i,l=o+t,c=Math.cos(o),d=Math.sin(o),u=Math.cos(l),p=Math.sin(l),h=(y,k,v)=>Me(y,o,l,!0)?1:Math.max(k,k*e,v,v*e),g=(y,k,v)=>Me(y,o,l,!0)?-1:Math.min(k,k*e,v,v*e),f=h(0,c,u),m=h(q,d,p),x=g(O,c,u),b=g(O+q,d,p);s=(f-x)/2,n=(m-b)/2,a=-(f+x)/2,r=-(m+b)/2}return{ratioX:s,ratioY:n,offsetX:a,offsetY:r}}class Ut extends dt{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const s=this.getDataset().data,n=this._cachedMeta;if(this._parsing===!1)n._parsed=s;else{let a=l=>+s[l];if(C(s[t])){const{key:l="value"}=this._parsing;a=c=>+Pt(s[c],l)}let r,o;for(r=t,o=t+e;r<o;++r)n._parsed[r]=a(r)}}_getRotation(){return ct(this.options.rotation-90)}_getCircumference(){return ct(this.options.circumference)}_getRotationExtents(){let t=$,e=-$;for(let s=0;s<this.chart.data.datasets.length;++s)if(this.chart.isDatasetVisible(s)&&this.chart.getDatasetMeta(s).type===this._type){const n=this.chart.getDatasetMeta(s).controller,a=n._getRotation(),r=n._getCircumference();t=Math.min(t,a),e=Math.max(e,a+r)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:s}=e,n=this._cachedMeta,a=n.data,r=this.getMaxBorderWidth()+this.getMaxOffset(a)+this.options.spacing,o=Math.max((Math.min(s.width,s.height)-r)/2,0),l=Math.min(Fr(this.options.cutout,o),1),c=this._getRingWeight(this.index),{circumference:d,rotation:u}=this._getRotationExtents(),{ratioX:p,ratioY:h,offsetX:g,offsetY:f}=El(u,d,l),m=(s.width-r)/p,x=(s.height-r)/h,b=Math.max(Math.min(m,x)/2,0),y=da(this.options.radius,b),k=Math.max(y*l,0),v=(y-k)/this._getVisibleDatasetWeightTotal();this.offsetX=g*y,this.offsetY=f*y,n.total=this.calculateTotal(),this.outerRadius=y-v*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-v*c,0),this.updateElements(a,0,a.length,t)}_circumference(t,e){const s=this.options,n=this._cachedMeta,a=this._getCircumference();return e&&s.animation.animateRotate||!this.chart.getDataVisibility(t)||n._parsed[t]===null||n.data[t].hidden?0:this.calculateCircumference(n._parsed[t]*a/$)}updateElements(t,e,s,n){const a=n==="reset",r=this.chart,o=r.chartArea,c=r.options.animation,d=(o.left+o.right)/2,u=(o.top+o.bottom)/2,p=a&&c.animateScale,h=p?0:this.innerRadius,g=p?0:this.outerRadius,{sharedOptions:f,includeOptions:m}=this._getSharedOptions(e,n);let x=this._getRotation(),b;for(b=0;b<e;++b)x+=this._circumference(b,a);for(b=e;b<e+s;++b){const y=this._circumference(b,a),k=t[b],v={x:d+this.offsetX,y:u+this.offsetY,startAngle:x,endAngle:x+y,circumference:y,outerRadius:g,innerRadius:h};m&&(v.options=f||this.resolveDataElementOptions(b,k.active?"active":n)),x+=y,this.updateElement(k,b,v,n)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let s=0,n;for(n=0;n<e.length;n++){const a=t._parsed[n];a!==null&&!isNaN(a)&&this.chart.getDataVisibility(n)&&!e[n].hidden&&(s+=Math.abs(a))}return s}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?$*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart,n=s.data.labels||[],a=Ie(e._parsed[t],s.options.locale);return{label:n[t]||"",value:a}}getMaxBorderWidth(t){let e=0;const s=this.chart;let n,a,r,o,l;if(!t){for(n=0,a=s.data.datasets.length;n<a;++n)if(s.isDatasetVisible(n)){r=s.getDatasetMeta(n),t=r.data,o=r.controller;break}}if(!t)return 0;for(n=0,a=t.length;n<a;++n)l=o.resolveDataElementOptions(n),l.borderAlign!=="inner"&&(e=Math.max(e,l.borderWidth||0,l.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let s=0,n=t.length;s<n;++s){const a=this.resolveDataElementOptions(s);e=Math.max(e,a.offset||0,a.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let s=0;s<t;++s)this.chart.isDatasetVisible(s)&&(e+=this._getRingWeight(s));return e}_getRingWeight(t){return Math.max(I(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}E(Ut,"id","doughnut"),E(Ut,"defaults",{datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"}),E(Ut,"descriptors",{_scriptable:t=>t!=="spacing",_indexable:t=>t!=="spacing"&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")}),E(Ut,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data,{labels:{pointStyle:s,textAlign:n,color:a,useBorderRadius:r,borderRadius:o}}=t.legend.options;return e.labels.length&&e.datasets.length?e.labels.map((l,c)=>{const u=t.getDatasetMeta(0).controller.getStyle(c);return{text:l,fillStyle:u.backgroundColor,fontColor:a,hidden:!t.getDataVisibility(c),lineDash:u.borderDash,lineDashOffset:u.borderDashOffset,lineJoin:u.borderJoinStyle,lineWidth:u.borderWidth,strokeStyle:u.borderColor,textAlign:n,pointStyle:s,borderRadius:r&&(o||u.borderRadius),index:c}}):[]}},onClick(t,e,s){s.chart.toggleDataVisibility(e.index),s.chart.update()}}}});class Ge extends dt{initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:s,data:n=[],_dataset:a}=e,r=this.chart._animationsDisabled;let{start:o,count:l}=ba(e,n,r);this._drawStart=o,this._drawCount=l,ya(e)&&(o=0,l=n.length),s._chart=this.chart,s._datasetIndex=this.index,s._decimated=!!a._decimated,s.points=n;const c=this.resolveDatasetElementOptions(t);this.options.showLine||(c.borderWidth=0),c.segment=this.options.segment,this.updateElement(s,void 0,{animated:!r,options:c},t),this.updateElements(n,o,l,t)}updateElements(t,e,s,n){const a=n==="reset",{iScale:r,vScale:o,_stacked:l,_dataset:c}=this._cachedMeta,{sharedOptions:d,includeOptions:u}=this._getSharedOptions(e,n),p=r.axis,h=o.axis,{spanGaps:g,segment:f}=this.options,m=ee(g)?g:Number.POSITIVE_INFINITY,x=this.chart._animationsDisabled||a||n==="none",b=e+s,y=t.length;let k=e>0&&this.getParsed(e-1);for(let v=0;v<y;++v){const w=t[v],_=x?w:{};if(v<e||v>=b){_.skip=!0;continue}const S=this.getParsed(v),M=P(S[h]),L=_[p]=r.getPixelForValue(S[p],v),T=_[h]=a||M?o.getBasePixel():o.getPixelForValue(l?this.applyStack(o,S,l):S[h],v);_.skip=isNaN(L)||isNaN(T)||M,_.stop=v>0&&Math.abs(S[p]-k[p])>m,f&&(_.parsed=S,_.raw=c.data[v]),u&&(_.options=d||this.resolveDataElementOptions(v,w.active?"active":n)),x||this.updateElement(w,v,_,n),k=S}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,s=e.options&&e.options.borderWidth||0,n=t.data||[];if(!n.length)return s;const a=n[0].size(this.resolveDataElementOptions(0)),r=n[n.length-1].size(this.resolveDataElementOptions(n.length-1));return Math.max(s,a,r)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}E(Ge,"id","line"),E(Ge,"defaults",{datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1}),E(Ge,"overrides",{scales:{_index_:{type:"category"},_value_:{type:"linear"}}});class we extends dt{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart,n=s.data.labels||[],a=Ie(e._parsed[t].r,s.options.locale);return{label:n[t]||"",value:a}}parseObjectData(t,e,s,n){return La.bind(this)(t,e,s,n)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach((s,n)=>{const a=this.getParsed(n).r;!isNaN(a)&&this.chart.getDataVisibility(n)&&(a<e.min&&(e.min=a),a>e.max&&(e.max=a))}),e}_updateRadius(){const t=this.chart,e=t.chartArea,s=t.options,n=Math.min(e.right-e.left,e.bottom-e.top),a=Math.max(n/2,0),r=Math.max(s.cutoutPercentage?a/100*s.cutoutPercentage:1,0),o=(a-r)/t.getVisibleDatasetCount();this.outerRadius=a-o*this.index,this.innerRadius=this.outerRadius-o}updateElements(t,e,s,n){const a=n==="reset",r=this.chart,l=r.options.animation,c=this._cachedMeta.rScale,d=c.xCenter,u=c.yCenter,p=c.getIndexAngle(0)-.5*O;let h=p,g;const f=360/this.countVisibleElements();for(g=0;g<e;++g)h+=this._computeAngle(g,n,f);for(g=e;g<e+s;g++){const m=t[g];let x=h,b=h+this._computeAngle(g,n,f),y=r.getDataVisibility(g)?c.getDistanceFromCenterForValue(this.getParsed(g).r):0;h=b,a&&(l.animateScale&&(y=0),l.animateRotate&&(x=b=p));const k={x:d,y:u,innerRadius:0,outerRadius:y,startAngle:x,endAngle:b,options:this.resolveDataElementOptions(g,m.active?"active":n)};this.updateElement(m,g,k,n)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach((s,n)=>{!isNaN(this.getParsed(n).r)&&this.chart.getDataVisibility(n)&&e++}),e}_computeAngle(t,e,s){return this.chart.getDataVisibility(t)?ct(this.resolveDataElementOptions(t,e).angle||s):0}}E(we,"id","polarArea"),E(we,"defaults",{dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0}),E(we,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:s,color:n}}=t.legend.options;return e.labels.map((a,r)=>{const l=t.getDatasetMeta(0).controller.getStyle(r);return{text:a,fillStyle:l.backgroundColor,strokeStyle:l.borderColor,fontColor:n,lineWidth:l.borderWidth,pointStyle:s,hidden:!t.getDataVisibility(r),index:r}})}return[]}},onClick(t,e,s){s.chart.toggleDataVisibility(e.index),s.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}});class Fi extends Ut{}E(Fi,"id","pie"),E(Fi,"defaults",{cutout:0,rotation:0,circumference:360,radius:"100%"});class Ke extends dt{getLabelAndValue(t){const e=this._cachedMeta.vScale,s=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(s[e.axis])}}parseObjectData(t,e,s,n){return La.bind(this)(t,e,s,n)}update(t){const e=this._cachedMeta,s=e.dataset,n=e.data||[],a=e.iScale.getLabels();if(s.points=n,t!=="resize"){const r=this.resolveDatasetElementOptions(t);this.options.showLine||(r.borderWidth=0);const o={_loop:!0,_fullLoop:a.length===n.length,options:r};this.updateElement(s,void 0,o,t)}this.updateElements(n,0,n.length,t)}updateElements(t,e,s,n){const a=this._cachedMeta.rScale,r=n==="reset";for(let o=e;o<e+s;o++){const l=t[o],c=this.resolveDataElementOptions(o,l.active?"active":n),d=a.getPointPositionForValue(o,this.getParsed(o).r),u=r?a.xCenter:d.x,p=r?a.yCenter:d.y,h={x:u,y:p,angle:d.angle,skip:isNaN(u)||isNaN(p),options:c};this.updateElement(l,o,h,n)}}}E(Ke,"id","radar"),E(Ke,"defaults",{datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}}),E(Ke,"overrides",{aspectRatio:1,scales:{r:{type:"radialLinear"}}});class Je extends dt{getLabelAndValue(t){const e=this._cachedMeta,s=this.chart.data.labels||[],{xScale:n,yScale:a}=e,r=this.getParsed(t),o=n.getLabelForValue(r.x),l=a.getLabelForValue(r.y);return{label:s[t]||"",value:"("+o+", "+l+")"}}update(t){const e=this._cachedMeta,{data:s=[]}=e,n=this.chart._animationsDisabled;let{start:a,count:r}=ba(e,s,n);if(this._drawStart=a,this._drawCount=r,ya(e)&&(a=0,r=s.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:o,_dataset:l}=e;o._chart=this.chart,o._datasetIndex=this.index,o._decimated=!!l._decimated,o.points=s;const c=this.resolveDatasetElementOptions(t);c.segment=this.options.segment,this.updateElement(o,void 0,{animated:!n,options:c},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(s,a,r,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,s,n){const a=n==="reset",{iScale:r,vScale:o,_stacked:l,_dataset:c}=this._cachedMeta,d=this.resolveDataElementOptions(e,n),u=this.getSharedOptions(d),p=this.includeOptions(n,u),h=r.axis,g=o.axis,{spanGaps:f,segment:m}=this.options,x=ee(f)?f:Number.POSITIVE_INFINITY,b=this.chart._animationsDisabled||a||n==="none";let y=e>0&&this.getParsed(e-1);for(let k=e;k<e+s;++k){const v=t[k],w=this.getParsed(k),_=b?v:{},S=P(w[g]),M=_[h]=r.getPixelForValue(w[h],k),L=_[g]=a||S?o.getBasePixel():o.getPixelForValue(l?this.applyStack(o,w,l):w[g],k);_.skip=isNaN(M)||isNaN(L)||S,_.stop=k>0&&Math.abs(w[h]-y[h])>x,m&&(_.parsed=w,_.raw=c.data[k]),p&&(_.options=u||this.resolveDataElementOptions(k,v.active?"active":n)),b||this.updateElement(v,k,_,n),y=w}this.updateSharedOptions(u,n,d)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let o=0;for(let l=e.length-1;l>=0;--l)o=Math.max(o,e[l].size(this.resolveDataElementOptions(l))/2);return o>0&&o}const s=t.dataset,n=s.options&&s.options.borderWidth||0;if(!e.length)return n;const a=e[0].size(this.resolveDataElementOptions(0)),r=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(n,a,r)/2}}E(Je,"id","scatter"),E(Je,"defaults",{datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1}),E(Je,"overrides",{interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}});var Ll=Object.freeze({__proto__:null,BarController:Ye,BubbleController:Xe,DoughnutController:Ut,LineController:Ge,PieController:Fi,PolarAreaController:we,RadarController:Ke,ScatterController:Je});function $t(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class cs{constructor(t){E(this,"options");this.options=t||{}}static override(t){Object.assign(cs.prototype,t)}init(){}formats(){return $t()}parse(){return $t()}format(){return $t()}add(){return $t()}diff(){return $t()}startOf(){return $t()}endOf(){return $t()}}var Tl={_date:cs};function Dl(i,t,e,s){const{controller:n,data:a,_sorted:r}=i,o=n._cachedMeta.iScale,l=i.dataset&&i.dataset.options?i.dataset.options.spanGaps:null;if(o&&t===o.axis&&t!=="r"&&r&&a.length){const c=o._reversePixels?Kr:_t;if(s){if(n._sharedOptions){const d=a[0],u=typeof d.getRange=="function"&&d.getRange(t);if(u){const p=c(a,t,e-u),h=c(a,t,e+u);return{lo:p.lo,hi:h.hi}}}}else{const d=c(a,t,e);if(l){const{vScale:u}=n._cachedMeta,{_parsed:p}=i,h=p.slice(0,d.lo+1).reverse().findIndex(f=>!P(f[u.axis]));d.lo-=Math.max(0,h);const g=p.slice(d.hi).findIndex(f=>!P(f[u.axis]));d.hi+=Math.max(0,g)}return d}}return{lo:0,hi:a.length-1}}function mi(i,t,e,s,n){const a=i.getSortedVisibleDatasetMetas(),r=e[t];for(let o=0,l=a.length;o<l;++o){const{index:c,data:d}=a[o],{lo:u,hi:p}=Dl(a[o],t,r,n);for(let h=u;h<=p;++h){const g=d[h];g.skip||s(g,c,h)}}}function Al(i){const t=i.indexOf("x")!==-1,e=i.indexOf("y")!==-1;return function(s,n){const a=t?Math.abs(s.x-n.x):0,r=e?Math.abs(s.y-n.y):0;return Math.sqrt(Math.pow(a,2)+Math.pow(r,2))}}function Ei(i,t,e,s,n){const a=[];return!n&&!i.isPointInArea(t)||mi(i,e,t,function(o,l,c){!n&&!St(o,i.chartArea,0)||o.inRange(t.x,t.y,s)&&a.push({element:o,datasetIndex:l,index:c})},!0),a}function Il(i,t,e,s){let n=[];function a(r,o,l){const{startAngle:c,endAngle:d}=r.getProps(["startAngle","endAngle"],s),{angle:u}=pa(r,{x:t.x,y:t.y});Me(u,c,d)&&n.push({element:r,datasetIndex:o,index:l})}return mi(i,e,t,a),n}function Pl(i,t,e,s,n,a){let r=[];const o=Al(e);let l=Number.POSITIVE_INFINITY;function c(d,u,p){const h=d.inRange(t.x,t.y,n);if(s&&!h)return;const g=d.getCenterPoint(n);if(!(!!a||i.isPointInArea(g))&&!h)return;const m=o(t,g);m<l?(r=[{element:d,datasetIndex:u,index:p}],l=m):m===l&&r.push({element:d,datasetIndex:u,index:p})}return mi(i,e,t,c),r}function Li(i,t,e,s,n,a){return!a&&!i.isPointInArea(t)?[]:e==="r"&&!s?Il(i,t,e,n):Pl(i,t,e,s,n,a)}function pn(i,t,e,s,n){const a=[],r=e==="x"?"inXRange":"inYRange";let o=!1;return mi(i,e,t,(l,c,d)=>{l[r]&&l[r](t[e],n)&&(a.push({element:l,datasetIndex:c,index:d}),o=o||l.inRange(t.x,t.y,n))}),s&&!o?[]:a}var Cl={modes:{index(i,t,e,s){const n=zt(t,i),a=e.axis||"x",r=e.includeInvisible||!1,o=e.intersect?Ei(i,n,a,s,r):Li(i,n,a,!1,s,r),l=[];return o.length?(i.getSortedVisibleDatasetMetas().forEach(c=>{const d=o[0].index,u=c.data[d];u&&!u.skip&&l.push({element:u,datasetIndex:c.index,index:d})}),l):[]},dataset(i,t,e,s){const n=zt(t,i),a=e.axis||"xy",r=e.includeInvisible||!1;let o=e.intersect?Ei(i,n,a,s,r):Li(i,n,a,!1,s,r);if(o.length>0){const l=o[0].datasetIndex,c=i.getDatasetMeta(l).data;o=[];for(let d=0;d<c.length;++d)o.push({element:c[d],datasetIndex:l,index:d})}return o},point(i,t,e,s){const n=zt(t,i),a=e.axis||"xy",r=e.includeInvisible||!1;return Ei(i,n,a,s,r)},nearest(i,t,e,s){const n=zt(t,i),a=e.axis||"xy",r=e.includeInvisible||!1;return Li(i,n,a,e.intersect,s,r)},x(i,t,e,s){const n=zt(t,i);return pn(i,n,"x",e.intersect,s)},y(i,t,e,s){const n=zt(t,i);return pn(i,n,"y",e.intersect,s)}}};const ja=["left","top","right","bottom"];function oe(i,t){return i.filter(e=>e.pos===t)}function fn(i,t){return i.filter(e=>ja.indexOf(e.pos)===-1&&e.box.axis===t)}function le(i,t){return i.sort((e,s)=>{const n=t?s:e,a=t?e:s;return n.weight===a.weight?n.index-a.index:n.weight-a.weight})}function Bl(i){const t=[];let e,s,n,a,r,o;for(e=0,s=(i||[]).length;e<s;++e)n=i[e],{position:a,options:{stack:r,stackWeight:o=1}}=n,t.push({index:e,box:n,pos:a,horizontal:n.isHorizontal(),weight:n.weight,stack:r&&a+r,stackWeight:o});return t}function Rl(i){const t={};for(const e of i){const{stack:s,pos:n,stackWeight:a}=e;if(!s||!ja.includes(n))continue;const r=t[s]||(t[s]={count:0,placed:0,weight:0,size:0});r.count++,r.weight+=a}return t}function Ol(i,t){const e=Rl(i),{vBoxMaxWidth:s,hBoxMaxHeight:n}=t;let a,r,o;for(a=0,r=i.length;a<r;++a){o=i[a];const{fullSize:l}=o.box,c=e[o.stack],d=c&&o.stackWeight/c.weight;o.horizontal?(o.width=d?d*s:l&&t.availableWidth,o.height=n):(o.width=s,o.height=d?d*n:l&&t.availableHeight)}return e}function Fl(i){const t=Bl(i),e=le(t.filter(c=>c.box.fullSize),!0),s=le(oe(t,"left"),!0),n=le(oe(t,"right")),a=le(oe(t,"top"),!0),r=le(oe(t,"bottom")),o=fn(t,"x"),l=fn(t,"y");return{fullSize:e,leftAndTop:s.concat(a),rightAndBottom:n.concat(l).concat(r).concat(o),chartArea:oe(t,"chartArea"),vertical:s.concat(n).concat(l),horizontal:a.concat(r).concat(o)}}function gn(i,t,e,s){return Math.max(i[e],t[e])+Math.max(i[s],t[s])}function Na(i,t){i.top=Math.max(i.top,t.top),i.left=Math.max(i.left,t.left),i.bottom=Math.max(i.bottom,t.bottom),i.right=Math.max(i.right,t.right)}function jl(i,t,e,s){const{pos:n,box:a}=e,r=i.maxPadding;if(!C(n)){e.size&&(i[n]-=e.size);const u=s[e.stack]||{size:0,count:1};u.size=Math.max(u.size,e.horizontal?a.height:a.width),e.size=u.size/u.count,i[n]+=e.size}a.getPadding&&Na(r,a.getPadding());const o=Math.max(0,t.outerWidth-gn(r,i,"left","right")),l=Math.max(0,t.outerHeight-gn(r,i,"top","bottom")),c=o!==i.w,d=l!==i.h;return i.w=o,i.h=l,e.horizontal?{same:c,other:d}:{same:d,other:c}}function Nl(i){const t=i.maxPadding;function e(s){const n=Math.max(t[s]-i[s],0);return i[s]+=n,n}i.y+=e("top"),i.x+=e("left"),e("right"),e("bottom")}function $l(i,t){const e=t.maxPadding;function s(n){const a={left:0,top:0,right:0,bottom:0};return n.forEach(r=>{a[r]=Math.max(t[r],e[r])}),a}return s(i?["left","right"]:["top","bottom"])}function pe(i,t,e,s){const n=[];let a,r,o,l,c,d;for(a=0,r=i.length,c=0;a<r;++a){o=i[a],l=o.box,l.update(o.width||t.w,o.height||t.h,$l(o.horizontal,t));const{same:u,other:p}=jl(t,e,o,s);c|=u&&n.length,d=d||p,l.fullSize||n.push(o)}return c&&pe(n,t,e,s)||d}function Ne(i,t,e,s,n){i.top=e,i.left=t,i.right=t+s,i.bottom=e+n,i.width=s,i.height=n}function mn(i,t,e,s){const n=e.padding;let{x:a,y:r}=t;for(const o of i){const l=o.box,c=s[o.stack]||{placed:0,weight:1},d=o.stackWeight/c.weight||1;if(o.horizontal){const u=t.w*d,p=c.size||l.height;Se(c.start)&&(r=c.start),l.fullSize?Ne(l,n.left,r,e.outerWidth-n.right-n.left,p):Ne(l,t.left+c.placed,r,u,p),c.start=r,c.placed+=u,r=l.bottom}else{const u=t.h*d,p=c.size||l.width;Se(c.start)&&(a=c.start),l.fullSize?Ne(l,a,n.top,p,e.outerHeight-n.bottom-n.top):Ne(l,a,t.top+c.placed,p,u),c.start=a,c.placed+=u,a=l.right}}t.x=a,t.y=r}var Z={addBox(i,t){i.boxes||(i.boxes=[]),t.fullSize=t.fullSize||!1,t.position=t.position||"top",t.weight=t.weight||0,t._layers=t._layers||function(){return[{z:0,draw(e){t.draw(e)}}]},i.boxes.push(t)},removeBox(i,t){const e=i.boxes?i.boxes.indexOf(t):-1;e!==-1&&i.boxes.splice(e,1)},configure(i,t,e){t.fullSize=e.fullSize,t.position=e.position,t.weight=e.weight},update(i,t,e,s){if(!i)return;const n=tt(i.options.layout.padding),a=Math.max(t-n.width,0),r=Math.max(e-n.height,0),o=Fl(i.boxes),l=o.vertical,c=o.horizontal;j(i.boxes,f=>{typeof f.beforeLayout=="function"&&f.beforeLayout()});const d=l.reduce((f,m)=>m.box.options&&m.box.options.display===!1?f:f+1,0)||1,u=Object.freeze({outerWidth:t,outerHeight:e,padding:n,availableWidth:a,availableHeight:r,vBoxMaxWidth:a/2/d,hBoxMaxHeight:r/2}),p=Object.assign({},n);Na(p,tt(s));const h=Object.assign({maxPadding:p,w:a,h:r,x:n.left,y:n.top},n),g=Ol(l.concat(c),u);pe(o.fullSize,h,u,g),pe(l,h,u,g),pe(c,h,u,g)&&pe(l,h,u,g),Nl(h),mn(o.leftAndTop,h,u,g),h.x+=h.w,h.y+=h.h,mn(o.rightAndBottom,h,u,g),i.chartArea={left:h.left,top:h.top,right:h.left+h.w,bottom:h.top+h.h,height:h.h,width:h.w},j(o.chartArea,f=>{const m=f.box;Object.assign(m,i.chartArea),m.update(h.w,h.h,{left:0,top:0,right:0,bottom:0})})}};class $a{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,s){}removeEventListener(t,e,s){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,s,n){return e=Math.max(0,e||t.width),s=s||t.height,{width:e,height:Math.max(0,n?Math.floor(e/n):s)}}isAttached(t){return!0}updateConfig(t){}}class Hl extends $a{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const Qe="$chartjs",zl={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},xn=i=>i===null||i==="";function Vl(i,t){const e=i.style,s=i.getAttribute("height"),n=i.getAttribute("width");if(i[Qe]={initial:{height:s,width:n,style:{display:e.display,height:e.height,width:e.width}}},e.display=e.display||"block",e.boxSizing=e.boxSizing||"border-box",xn(n)){const a=Zs(i,"width");a!==void 0&&(i.width=a)}if(xn(s))if(i.style.height==="")i.height=i.width/(t||2);else{const a=Zs(i,"height");a!==void 0&&(i.height=a)}return i}const Ha=Wo?{passive:!0}:!1;function Wl(i,t,e){i&&i.addEventListener(t,e,Ha)}function Ul(i,t,e){i&&i.canvas&&i.canvas.removeEventListener(t,e,Ha)}function ql(i,t){const e=zl[i.type]||i.type,{x:s,y:n}=zt(i,t);return{type:e,chart:t,native:i,x:s!==void 0?s:null,y:n!==void 0?n:null}}function ci(i,t){for(const e of i)if(e===t||e.contains(t))return!0}function Yl(i,t,e){const s=i.canvas,n=new MutationObserver(a=>{let r=!1;for(const o of a)r=r||ci(o.addedNodes,s),r=r&&!ci(o.removedNodes,s);r&&e()});return n.observe(document,{childList:!0,subtree:!0}),n}function Xl(i,t,e){const s=i.canvas,n=new MutationObserver(a=>{let r=!1;for(const o of a)r=r||ci(o.removedNodes,s),r=r&&!ci(o.addedNodes,s);r&&e()});return n.observe(document,{childList:!0,subtree:!0}),n}const Le=new Map;let bn=0;function za(){const i=window.devicePixelRatio;i!==bn&&(bn=i,Le.forEach((t,e)=>{e.currentDevicePixelRatio!==i&&t()}))}function Gl(i,t){Le.size||window.addEventListener("resize",za),Le.set(i,t)}function Kl(i){Le.delete(i),Le.size||window.removeEventListener("resize",za)}function Jl(i,t,e){const s=i.canvas,n=s&&ls(s);if(!n)return;const a=xa((o,l)=>{const c=n.clientWidth;e(o,l),c<n.clientWidth&&e()},window),r=new ResizeObserver(o=>{const l=o[0],c=l.contentRect.width,d=l.contentRect.height;c===0&&d===0||a(c,d)});return r.observe(n),Gl(i,a),r}function Ti(i,t,e){e&&e.disconnect(),t==="resize"&&Kl(i)}function Ql(i,t,e){const s=i.canvas,n=xa(a=>{i.ctx!==null&&e(ql(a,i))},i);return Wl(s,t,n),n}class Zl extends $a{acquireContext(t,e){const s=t&&t.getContext&&t.getContext("2d");return s&&s.canvas===t?(Vl(t,e),s):null}releaseContext(t){const e=t.canvas;if(!e[Qe])return!1;const s=e[Qe].initial;["height","width"].forEach(a=>{const r=s[a];P(r)?e.removeAttribute(a):e.setAttribute(a,r)});const n=s.style||{};return Object.keys(n).forEach(a=>{e.style[a]=n[a]}),e.width=e.width,delete e[Qe],!0}addEventListener(t,e,s){this.removeEventListener(t,e);const n=t.$proxies||(t.$proxies={}),r={attach:Yl,detach:Xl,resize:Jl}[e]||Ql;n[e]=r(t,e,s)}removeEventListener(t,e){const s=t.$proxies||(t.$proxies={}),n=s[e];if(!n)return;({attach:Ti,detach:Ti,resize:Ti}[e]||Ul)(t,e,n),s[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,s,n){return Vo(t,e,s,n)}isAttached(t){const e=t&&ls(t);return!!(e&&e.isConnected)}}function tc(i){return!os()||typeof OffscreenCanvas<"u"&&i instanceof OffscreenCanvas?Hl:Zl}class ut{constructor(){E(this,"x");E(this,"y");E(this,"active",!1);E(this,"options");E(this,"$animations")}tooltipPosition(t){const{x:e,y:s}=this.getProps(["x","y"],t);return{x:e,y:s}}hasValue(){return ee(this.x)&&ee(this.y)}getProps(t,e){const s=this.$animations;if(!e||!s)return this;const n={};return t.forEach(a=>{n[a]=s[a]&&s[a].active()?s[a]._to:this[a]}),n}}E(ut,"defaults",{}),E(ut,"defaultRoutes");function ec(i,t){const e=i.options.ticks,s=ic(i),n=Math.min(e.maxTicksLimit||s,s),a=e.major.enabled?nc(t):[],r=a.length,o=a[0],l=a[r-1],c=[];if(r>n)return ac(t,c,a,r/n),c;const d=sc(a,t,n);if(r>0){let u,p;const h=r>1?Math.round((l-o)/(r-1)):null;for($e(t,c,d,P(h)?0:o-h,o),u=0,p=r-1;u<p;u++)$e(t,c,d,a[u],a[u+1]);return $e(t,c,d,l,P(h)?t.length:l+h),c}return $e(t,c,d),c}function ic(i){const t=i.options.offset,e=i._tickSize(),s=i._length/e+(t?0:1),n=i._maxLength/e;return Math.floor(Math.min(s,n))}function sc(i,t,e){const s=rc(i),n=t.length/e;if(!s)return Math.max(n,1);const a=Ur(s);for(let r=0,o=a.length-1;r<o;r++){const l=a[r];if(l>n)return l}return Math.max(n,1)}function nc(i){const t=[];let e,s;for(e=0,s=i.length;e<s;e++)i[e].major&&t.push(e);return t}function ac(i,t,e,s){let n=0,a=e[0],r;for(s=Math.ceil(s),r=0;r<i.length;r++)r===a&&(t.push(i[r]),n++,a=e[n*s])}function $e(i,t,e,s,n){const a=I(s,0),r=Math.min(I(n,i.length),i.length);let o=0,l,c,d;for(e=Math.ceil(e),n&&(l=n-s,e=l/Math.floor(l/e)),d=a;d<0;)o++,d=Math.round(a+o*e);for(c=Math.max(a,0);c<r;c++)c===d&&(t.push(i[c]),o++,d=Math.round(a+o*e))}function rc(i){const t=i.length;let e,s;if(t<2)return!1;for(s=i[0],e=1;e<t;++e)if(i[e]-i[e-1]!==s)return!1;return s}const oc=i=>i==="left"?"right":i==="right"?"left":i,yn=(i,t,e)=>t==="top"||t==="left"?i[t]+e:i[t]-e,vn=(i,t)=>Math.min(t||i,i);function wn(i,t){const e=[],s=i.length/t,n=i.length;let a=0;for(;a<n;a+=s)e.push(i[Math.floor(a)]);return e}function lc(i,t,e){const s=i.ticks.length,n=Math.min(t,s-1),a=i._startPixel,r=i._endPixel,o=1e-6;let l=i.getPixelForTick(n),c;if(!(e&&(s===1?c=Math.max(l-a,r-l):t===0?c=(i.getPixelForTick(1)-l)/2:c=(l-i.getPixelForTick(n-1))/2,l+=n<t?c:-c,l<a-o||l>r+o)))return l}function cc(i,t){j(i,e=>{const s=e.gc,n=s.length/2;let a;if(n>t){for(a=0;a<n;++a)delete e.data[s[a]];s.splice(0,n)}})}function ce(i){return i.drawTicks?i.tickLength:0}function kn(i,t){if(!i.display)return 0;const e=G(i.font,t),s=tt(i.padding);return(z(i.text)?i.text.length:1)*e.lineHeight+s.height}function dc(i,t){return Bt(i,{scale:t,type:"scale"})}function uc(i,t,e){return Bt(i,{tick:e,index:t,type:"tick"})}function hc(i,t,e){let s=es(i);return(e&&t!=="right"||!e&&t==="right")&&(s=oc(s)),s}function pc(i,t,e,s){const{top:n,left:a,bottom:r,right:o,chart:l}=i,{chartArea:c,scales:d}=l;let u=0,p,h,g;const f=r-n,m=o-a;if(i.isHorizontal()){if(h=J(s,a,o),C(e)){const x=Object.keys(e)[0],b=e[x];g=d[x].getPixelForValue(b)+f-t}else e==="center"?g=(c.bottom+c.top)/2+f-t:g=yn(i,e,t);p=o-a}else{if(C(e)){const x=Object.keys(e)[0],b=e[x];h=d[x].getPixelForValue(b)-m+t}else e==="center"?h=(c.left+c.right)/2-m+t:h=yn(i,e,t);g=J(s,r,n),u=e==="left"?-q:q}return{titleX:h,titleY:g,maxWidth:p,rotation:u}}class Kt extends ut{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:s,_suggestedMax:n}=this;return t=at(t,Number.POSITIVE_INFINITY),e=at(e,Number.NEGATIVE_INFINITY),s=at(s,Number.POSITIVE_INFINITY),n=at(n,Number.NEGATIVE_INFINITY),{min:at(t,s),max:at(e,n),minDefined:U(t),maxDefined:U(e)}}getMinMax(t){let{min:e,max:s,minDefined:n,maxDefined:a}=this.getUserBounds(),r;if(n&&a)return{min:e,max:s};const o=this.getMatchingVisibleMetas();for(let l=0,c=o.length;l<c;++l)r=o[l].controller.getMinMax(this,t),n||(e=Math.min(e,r.min)),a||(s=Math.max(s,r.max));return e=a&&e>s?s:e,s=n&&e>s?e:s,{min:at(e,at(s,e)),max:at(s,at(e,s))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){N(this.options.beforeUpdate,[this])}update(t,e,s){const{beginAtZero:n,grace:a,ticks:r}=this.options,o=r.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=s=Object.assign({left:0,right:0,top:0,bottom:0},s),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+s.left+s.right:this.height+s.top+s.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=wo(this,a,n),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const l=o<this.ticks.length;this._convertTicksToLabels(l?wn(this.ticks,o):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),r.display&&(r.autoSkip||r.source==="auto")&&(this.ticks=ec(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),l&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t=this.options.reverse,e,s;this.isHorizontal()?(e=this.left,s=this.right):(e=this.top,s=this.bottom,t=!t),this._startPixel=e,this._endPixel=s,this._reversePixels=t,this._length=s-e,this._alignToPixels=this.options.alignToPixels}afterUpdate(){N(this.options.afterUpdate,[this])}beforeSetDimensions(){N(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){N(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),N(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){N(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let s,n,a;for(s=0,n=t.length;s<n;s++)a=t[s],a.label=N(e.callback,[a.value,s,t],this)}afterTickToLabelConversion(){N(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){N(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,s=vn(this.ticks.length,t.ticks.maxTicksLimit),n=e.minRotation||0,a=e.maxRotation;let r=n,o,l,c;if(!this._isVisible()||!e.display||n>=a||s<=1||!this.isHorizontal()){this.labelRotation=n;return}const d=this._getLabelSizes(),u=d.widest.width,p=d.highest.height,h=K(this.chart.width-u,0,this.maxWidth);o=t.offset?this.maxWidth/s:h/(s-1),u+6>o&&(o=h/(s-(t.offset?.5:1)),l=this.maxHeight-ce(t.grid)-e.padding-kn(t.title,this.chart.options.font),c=Math.sqrt(u*u+p*p),r=Zi(Math.min(Math.asin(K((d.highest.height+6)/o,-1,1)),Math.asin(K(l/c,-1,1))-Math.asin(K(p/c,-1,1)))),r=Math.max(n,Math.min(a,r))),this.labelRotation=r}afterCalculateLabelRotation(){N(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){N(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:s,title:n,grid:a}}=this,r=this._isVisible(),o=this.isHorizontal();if(r){const l=kn(n,e.options.font);if(o?(t.width=this.maxWidth,t.height=ce(a)+l):(t.height=this.maxHeight,t.width=ce(a)+l),s.display&&this.ticks.length){const{first:c,last:d,widest:u,highest:p}=this._getLabelSizes(),h=s.padding*2,g=ct(this.labelRotation),f=Math.cos(g),m=Math.sin(g);if(o){const x=s.mirror?0:m*u.width+f*p.height;t.height=Math.min(this.maxHeight,t.height+x+h)}else{const x=s.mirror?0:f*u.width+m*p.height;t.width=Math.min(this.maxWidth,t.width+x+h)}this._calculatePadding(c,d,m,f)}}this._handleMargins(),o?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,s,n){const{ticks:{align:a,padding:r},position:o}=this.options,l=this.labelRotation!==0,c=o!=="top"&&this.axis==="x";if(this.isHorizontal()){const d=this.getPixelForTick(0)-this.left,u=this.right-this.getPixelForTick(this.ticks.length-1);let p=0,h=0;l?c?(p=n*t.width,h=s*e.height):(p=s*t.height,h=n*e.width):a==="start"?h=e.width:a==="end"?p=t.width:a!=="inner"&&(p=t.width/2,h=e.width/2),this.paddingLeft=Math.max((p-d+r)*this.width/(this.width-d),0),this.paddingRight=Math.max((h-u+r)*this.width/(this.width-u),0)}else{let d=e.height/2,u=t.height/2;a==="start"?(d=0,u=t.height):a==="end"&&(d=e.height,u=0),this.paddingTop=d+r,this.paddingBottom=u+r}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){N(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return e==="top"||e==="bottom"||t==="x"}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){this.beforeTickToLabelConversion(),this.generateTickLabels(t);let e,s;for(e=0,s=t.length;e<s;e++)P(t[e].label)&&(t.splice(e,1),s--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let s=this.ticks;e<s.length&&(s=wn(s,e)),this._labelSizes=t=this._computeLabelSizes(s,s.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,s){const{ctx:n,_longestTextCache:a}=this,r=[],o=[],l=Math.floor(e/vn(e,s));let c=0,d=0,u,p,h,g,f,m,x,b,y,k,v;for(u=0;u<e;u+=l){if(g=t[u].label,f=this._resolveTickFontOptions(u),n.font=m=f.string,x=a[m]=a[m]||{data:{},gc:[]},b=f.lineHeight,y=k=0,!P(g)&&!z(g))y=oi(n,x.data,x.gc,y,g),k=b;else if(z(g))for(p=0,h=g.length;p<h;++p)v=g[p],!P(v)&&!z(v)&&(y=oi(n,x.data,x.gc,y,v),k+=b);r.push(y),o.push(k),c=Math.max(y,c),d=Math.max(k,d)}cc(a,e);const w=r.indexOf(c),_=o.indexOf(d),S=M=>({width:r[M]||0,height:o[M]||0});return{first:S(0),last:S(e-1),widest:S(w),highest:S(_),widths:r,heights:o}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return Gr(this._alignToPixels?Nt(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const s=e[t];return s.$context||(s.$context=uc(this.getContext(),t,s))}return this.$context||(this.$context=dc(this.chart.getContext(),this))}_tickSize(){const t=this.options.ticks,e=ct(this.labelRotation),s=Math.abs(Math.cos(e)),n=Math.abs(Math.sin(e)),a=this._getLabelSizes(),r=t.autoSkipPadding||0,o=a?a.widest.width+r:0,l=a?a.highest.height+r:0;return this.isHorizontal()?l*s>o*n?o/s:l/n:l*n<o*s?l/s:o/n}_isVisible(){const t=this.options.display;return t!=="auto"?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,s=this.chart,n=this.options,{grid:a,position:r,border:o}=n,l=a.offset,c=this.isHorizontal(),u=this.ticks.length+(l?1:0),p=ce(a),h=[],g=o.setContext(this.getContext()),f=g.display?g.width:0,m=f/2,x=function(F){return Nt(s,F,f)};let b,y,k,v,w,_,S,M,L,T,A,W;if(r==="top")b=x(this.bottom),_=this.bottom-p,M=b-m,T=x(t.top)+m,W=t.bottom;else if(r==="bottom")b=x(this.top),T=t.top,W=x(t.bottom)-m,_=b+m,M=this.top+p;else if(r==="left")b=x(this.right),w=this.right-p,S=b-m,L=x(t.left)+m,A=t.right;else if(r==="right")b=x(this.left),L=t.left,A=x(t.right)-m,w=b+m,S=this.left+p;else if(e==="x"){if(r==="center")b=x((t.top+t.bottom)/2+.5);else if(C(r)){const F=Object.keys(r)[0],H=r[F];b=x(this.chart.scales[F].getPixelForValue(H))}T=t.top,W=t.bottom,_=b+m,M=_+p}else if(e==="y"){if(r==="center")b=x((t.left+t.right)/2);else if(C(r)){const F=Object.keys(r)[0],H=r[F];b=x(this.chart.scales[F].getPixelForValue(H))}w=b-m,S=w-p,L=t.left,A=t.right}const Y=I(n.ticks.maxTicksLimit,u),B=Math.max(1,Math.ceil(u/Y));for(y=0;y<u;y+=B){const F=this.getContext(y),H=a.setContext(F),et=o.setContext(F),X=H.lineWidth,Mt=H.color,Pe=et.dash||[],Jt=et.dashOffset,ne=H.tickWidth,Rt=H.tickColor,ae=H.tickBorderDash||[],Ot=H.tickBorderDashOffset;k=lc(this,y,l),k!==void 0&&(v=Nt(s,k,X),c?w=S=L=A=v:_=M=T=W=v,h.push({tx1:w,ty1:_,tx2:S,ty2:M,x1:L,y1:T,x2:A,y2:W,width:X,color:Mt,borderDash:Pe,borderDashOffset:Jt,tickWidth:ne,tickColor:Rt,tickBorderDash:ae,tickBorderDashOffset:Ot}))}return this._ticksLength=u,this._borderValue=b,h}_computeLabelItems(t){const e=this.axis,s=this.options,{position:n,ticks:a}=s,r=this.isHorizontal(),o=this.ticks,{align:l,crossAlign:c,padding:d,mirror:u}=a,p=ce(s.grid),h=p+d,g=u?-d:h,f=-ct(this.labelRotation),m=[];let x,b,y,k,v,w,_,S,M,L,T,A,W="middle";if(n==="top")w=this.bottom-g,_=this._getXAxisLabelAlignment();else if(n==="bottom")w=this.top+g,_=this._getXAxisLabelAlignment();else if(n==="left"){const B=this._getYAxisLabelAlignment(p);_=B.textAlign,v=B.x}else if(n==="right"){const B=this._getYAxisLabelAlignment(p);_=B.textAlign,v=B.x}else if(e==="x"){if(n==="center")w=(t.top+t.bottom)/2+h;else if(C(n)){const B=Object.keys(n)[0],F=n[B];w=this.chart.scales[B].getPixelForValue(F)+h}_=this._getXAxisLabelAlignment()}else if(e==="y"){if(n==="center")v=(t.left+t.right)/2-h;else if(C(n)){const B=Object.keys(n)[0],F=n[B];v=this.chart.scales[B].getPixelForValue(F)}_=this._getYAxisLabelAlignment(p).textAlign}e==="y"&&(l==="start"?W="top":l==="end"&&(W="bottom"));const Y=this._getLabelSizes();for(x=0,b=o.length;x<b;++x){y=o[x],k=y.label;const B=a.setContext(this.getContext(x));S=this.getPixelForTick(x)+a.labelOffset,M=this._resolveTickFontOptions(x),L=M.lineHeight,T=z(k)?k.length:1;const F=T/2,H=B.color,et=B.textStrokeColor,X=B.textStrokeWidth;let Mt=_;r?(v=S,_==="inner"&&(x===b-1?Mt=this.options.reverse?"left":"right":x===0?Mt=this.options.reverse?"right":"left":Mt="center"),n==="top"?c==="near"||f!==0?A=-T*L+L/2:c==="center"?A=-Y.highest.height/2-F*L+L:A=-Y.highest.height+L/2:c==="near"||f!==0?A=L/2:c==="center"?A=Y.highest.height/2-F*L:A=Y.highest.height-T*L,u&&(A*=-1),f!==0&&!B.showLabelBackdrop&&(v+=L/2*Math.sin(f))):(w=S,A=(1-T)*L/2);let Pe;if(B.showLabelBackdrop){const Jt=tt(B.backdropPadding),ne=Y.heights[x],Rt=Y.widths[x];let ae=A-Jt.top,Ot=0-Jt.left;switch(W){case"middle":ae-=ne/2;break;case"bottom":ae-=ne;break}switch(_){case"center":Ot-=Rt/2;break;case"right":Ot-=Rt;break;case"inner":x===b-1?Ot-=Rt:x>0&&(Ot-=Rt/2);break}Pe={left:Ot,top:ae,width:Rt+Jt.width,height:ne+Jt.height,color:B.backdropColor}}m.push({label:k,font:M,textOffset:A,options:{rotation:f,color:H,strokeColor:et,strokeWidth:X,textAlign:Mt,textBaseline:W,translation:[v,w],backdrop:Pe}})}return m}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-ct(this.labelRotation))return t==="top"?"left":"right";let n="center";return e.align==="start"?n="left":e.align==="end"?n="right":e.align==="inner"&&(n="inner"),n}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:s,mirror:n,padding:a}}=this.options,r=this._getLabelSizes(),o=t+a,l=r.widest.width;let c,d;return e==="left"?n?(d=this.right+a,s==="near"?c="left":s==="center"?(c="center",d+=l/2):(c="right",d+=l)):(d=this.right-o,s==="near"?c="right":s==="center"?(c="center",d-=l/2):(c="left",d=this.left)):e==="right"?n?(d=this.left+a,s==="near"?c="right":s==="center"?(c="center",d-=l/2):(c="left",d-=l)):(d=this.left+o,s==="near"?c="left":s==="center"?(c="center",d+=l/2):(c="right",d=this.right)):c="right",{textAlign:c,x:d}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;if(e==="left"||e==="right")return{top:0,left:this.left,bottom:t.height,right:this.right};if(e==="top"||e==="bottom")return{top:this.top,left:0,bottom:this.bottom,right:t.width}}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:s,top:n,width:a,height:r}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(s,n,a,r),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const n=this.ticks.findIndex(a=>a.value===t);return n>=0?e.setContext(this.getContext(n)).lineWidth:0}drawGrid(t){const e=this.options.grid,s=this.ctx,n=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let a,r;const o=(l,c,d)=>{!d.width||!d.color||(s.save(),s.lineWidth=d.width,s.strokeStyle=d.color,s.setLineDash(d.borderDash||[]),s.lineDashOffset=d.borderDashOffset,s.beginPath(),s.moveTo(l.x,l.y),s.lineTo(c.x,c.y),s.stroke(),s.restore())};if(e.display)for(a=0,r=n.length;a<r;++a){const l=n[a];e.drawOnChartArea&&o({x:l.x1,y:l.y1},{x:l.x2,y:l.y2},l),e.drawTicks&&o({x:l.tx1,y:l.ty1},{x:l.tx2,y:l.ty2},{color:l.tickColor,width:l.tickWidth,borderDash:l.tickBorderDash,borderDashOffset:l.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:s,grid:n}}=this,a=s.setContext(this.getContext()),r=s.display?a.width:0;if(!r)return;const o=n.setContext(this.getContext(0)).lineWidth,l=this._borderValue;let c,d,u,p;this.isHorizontal()?(c=Nt(t,this.left,r)-r/2,d=Nt(t,this.right,o)+o/2,u=p=l):(u=Nt(t,this.top,r)-r/2,p=Nt(t,this.bottom,o)+o/2,c=d=l),e.save(),e.lineWidth=a.width,e.strokeStyle=a.color,e.beginPath(),e.moveTo(c,u),e.lineTo(d,p),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const s=this.ctx,n=this._computeLabelArea();n&&pi(s,n);const a=this.getLabelItems(t);for(const r of a){const o=r.options,l=r.font,c=r.label,d=r.textOffset;Gt(s,c,0,d,l,o)}n&&fi(s)}drawTitle(){const{ctx:t,options:{position:e,title:s,reverse:n}}=this;if(!s.display)return;const a=G(s.font),r=tt(s.padding),o=s.align;let l=a.lineHeight/2;e==="bottom"||e==="center"||C(e)?(l+=r.bottom,z(s.text)&&(l+=a.lineHeight*(s.text.length-1))):l+=r.top;const{titleX:c,titleY:d,maxWidth:u,rotation:p}=pc(this,l,e,o);Gt(t,s.text,0,0,a,{color:s.color,maxWidth:u,rotation:p,textAlign:hc(o,e,n),textBaseline:"middle",translation:[c,d]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,s=I(t.grid&&t.grid.z,-1),n=I(t.border&&t.border.z,0);return!this._isVisible()||this.draw!==Kt.prototype.draw?[{z:e,draw:a=>{this.draw(a)}}]:[{z:s,draw:a=>{this.drawBackground(),this.drawGrid(a),this.drawTitle()}},{z:n,draw:()=>{this.drawBorder()}},{z:e,draw:a=>{this.drawLabels(a)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),s=this.axis+"AxisID",n=[];let a,r;for(a=0,r=e.length;a<r;++a){const o=e[a];o[s]===this.id&&(!t||o.type===t)&&n.push(o)}return n}_resolveTickFontOptions(t){const e=this.options.ticks.setContext(this.getContext(t));return G(e.font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class He{constructor(t,e,s){this.type=t,this.scope=e,this.override=s,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let s;mc(e)&&(s=this.register(e));const n=this.items,a=t.id,r=this.scope+"."+a;if(!a)throw new Error("class does not have id: "+t);return a in n||(n[a]=t,fc(t,r,s),this.override&&V.override(t.id,t.overrides)),r}get(t){return this.items[t]}unregister(t){const e=this.items,s=t.id,n=this.scope;s in e&&delete e[s],n&&s in V[n]&&(delete V[n][s],this.override&&delete Xt[s])}}function fc(i,t,e){const s=_e(Object.create(null),[e?V.get(e):{},V.get(t),i.defaults]);V.set(t,s),i.defaultRoutes&&gc(t,i.defaultRoutes),i.descriptors&&V.describe(t,i.descriptors)}function gc(i,t){Object.keys(t).forEach(e=>{const s=e.split("."),n=s.pop(),a=[i].concat(s).join("."),r=t[e].split("."),o=r.pop(),l=r.join(".");V.route(a,n,l,o)})}function mc(i){return"id"in i&&"defaults"in i}class xc{constructor(){this.controllers=new He(dt,"datasets",!0),this.elements=new He(ut,"elements"),this.plugins=new He(Object,"plugins"),this.scales=new He(Kt,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,s){[...e].forEach(n=>{const a=s||this._getRegistryForType(n);s||a.isForType(n)||a===this.plugins&&n.id?this._exec(t,a,n):j(n,r=>{const o=s||this._getRegistryForType(r);this._exec(t,o,r)})})}_exec(t,e,s){const n=Qi(t);N(s["before"+n],[],s),e[t](s),N(s["after"+n],[],s)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const s=this._typedRegistries[e];if(s.isForType(t))return s}return this.plugins}_get(t,e,s){const n=e.get(t);if(n===void 0)throw new Error('"'+t+'" is not a registered '+s+".");return n}}var gt=new xc;class bc{constructor(){this._init=void 0}notify(t,e,s,n){if(e==="beforeInit"&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install")),this._init===void 0)return;const a=n?this._descriptors(t).filter(n):this._descriptors(t),r=this._notify(a,t,e,s);return e==="afterDestroy"&&(this._notify(a,t,"stop"),this._notify(this._init,t,"uninstall"),this._init=void 0),r}_notify(t,e,s,n){n=n||{};for(const a of t){const r=a.plugin,o=r[s],l=[e,n,a.options];if(N(o,l,r)===!1&&n.cancelable)return!1}return!0}invalidate(){P(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const s=t&&t.config,n=I(s.options&&s.options.plugins,{}),a=yc(s);return n===!1&&!e?[]:wc(t,a,n,e)}_notifyStateChanges(t){const e=this._oldCache||[],s=this._cache,n=(a,r)=>a.filter(o=>!r.some(l=>o.plugin.id===l.plugin.id));this._notify(n(e,s),t,"stop"),this._notify(n(s,e),t,"start")}}function yc(i){const t={},e=[],s=Object.keys(gt.plugins.items);for(let a=0;a<s.length;a++)e.push(gt.getPlugin(s[a]));const n=i.plugins||[];for(let a=0;a<n.length;a++){const r=n[a];e.indexOf(r)===-1&&(e.push(r),t[r.id]=!0)}return{plugins:e,localIds:t}}function vc(i,t){return!t&&i===!1?null:i===!0?{}:i}function wc(i,{plugins:t,localIds:e},s,n){const a=[],r=i.getContext();for(const o of t){const l=o.id,c=vc(s[l],n);c!==null&&a.push({plugin:o,options:kc(i.config,{plugin:o,local:e[l]},c,r)})}return a}function kc(i,{plugin:t,local:e},s,n){const a=i.pluginScopeKeys(t),r=i.getOptionScopes(s,a);return e&&t.defaults&&r.push(t.defaults),i.createResolver(r,n,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function ji(i,t){const e=V.datasets[i]||{};return((t.datasets||{})[i]||{}).indexAxis||t.indexAxis||e.indexAxis||"x"}function _c(i,t){let e=i;return i==="_index_"?e=t:i==="_value_"&&(e=t==="x"?"y":"x"),e}function Sc(i,t){return i===t?"_index_":"_value_"}function _n(i){if(i==="x"||i==="y"||i==="r")return i}function Mc(i){if(i==="top"||i==="bottom")return"x";if(i==="left"||i==="right")return"y"}function Ni(i,...t){if(_n(i))return i;for(const e of t){const s=e.axis||Mc(e.position)||i.length>1&&_n(i[0].toLowerCase());if(s)return s}throw new Error(`Cannot determine type of '${i}' axis. Please provide 'axis' or 'position' option.`)}function Sn(i,t,e){if(e[t+"AxisID"]===i)return{axis:t}}function Ec(i,t){if(t.data&&t.data.datasets){const e=t.data.datasets.filter(s=>s.xAxisID===i||s.yAxisID===i);if(e.length)return Sn(i,"x",e[0])||Sn(i,"y",e[0])}return{}}function Lc(i,t){const e=Xt[i.type]||{scales:{}},s=t.scales||{},n=ji(i.type,t),a=Object.create(null);return Object.keys(s).forEach(r=>{const o=s[r];if(!C(o))return console.error(`Invalid scale configuration for scale: ${r}`);if(o._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${r}`);const l=Ni(r,o,Ec(r,i),V.scales[o.type]),c=Sc(l,n),d=e.scales||{};a[r]=xe(Object.create(null),[{axis:l},o,d[l],d[c]])}),i.data.datasets.forEach(r=>{const o=r.type||i.type,l=r.indexAxis||ji(o,t),d=(Xt[o]||{}).scales||{};Object.keys(d).forEach(u=>{const p=_c(u,l),h=r[p+"AxisID"]||p;a[h]=a[h]||Object.create(null),xe(a[h],[{axis:p},s[h],d[u]])})}),Object.keys(a).forEach(r=>{const o=a[r];xe(o,[V.scales[o.type],V.scale])}),a}function Va(i){const t=i.options||(i.options={});t.plugins=I(t.plugins,{}),t.scales=Lc(i,t)}function Wa(i){return i=i||{},i.datasets=i.datasets||[],i.labels=i.labels||[],i}function Tc(i){return i=i||{},i.data=Wa(i.data),Va(i),i}const Mn=new Map,Ua=new Set;function ze(i,t){let e=Mn.get(i);return e||(e=t(),Mn.set(i,e),Ua.add(e)),e}const de=(i,t,e)=>{const s=Pt(t,e);s!==void 0&&i.add(s)};class Dc{constructor(t){this._config=Tc(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=Wa(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),Va(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return ze(t,()=>[[`datasets.${t}`,""]])}datasetAnimationScopeKeys(t,e){return ze(`${t}.transition.${e}`,()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]])}datasetElementScopeKeys(t,e){return ze(`${t}-${e}`,()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]])}pluginScopeKeys(t){const e=t.id,s=this.type;return ze(`${s}-plugin-${e}`,()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]])}_cachedScopes(t,e){const s=this._scopeCache;let n=s.get(t);return(!n||e)&&(n=new Map,s.set(t,n)),n}getOptionScopes(t,e,s){const{options:n,type:a}=this,r=this._cachedScopes(t,s),o=r.get(e);if(o)return o;const l=new Set;e.forEach(d=>{t&&(l.add(t),d.forEach(u=>de(l,t,u))),d.forEach(u=>de(l,n,u)),d.forEach(u=>de(l,Xt[a]||{},u)),d.forEach(u=>de(l,V,u)),d.forEach(u=>de(l,Ri,u))});const c=Array.from(l);return c.length===0&&c.push(Object.create(null)),Ua.has(e)&&r.set(e,c),c}chartOptionScopes(){const{options:t,type:e}=this;return[t,Xt[e]||{},V.datasets[e]||{},{type:e},V,Ri]}resolveNamedOptions(t,e,s,n=[""]){const a={$shared:!0},{resolver:r,subPrefixes:o}=En(this._resolverCache,t,n);let l=r;if(Ic(r,e)){a.$shared=!1,s=Ct(s)?s():s;const c=this.createResolver(t,s,o);l=ie(r,s,c)}for(const c of e)a[c]=l[c];return a}createResolver(t,e,s=[""],n){const{resolver:a}=En(this._resolverCache,t,s);return C(e)?ie(a,e,void 0,n):a}}function En(i,t,e){let s=i.get(t);s||(s=new Map,i.set(t,s));const n=e.join();let a=s.get(n);return a||(a={resolver:ns(t,e),subPrefixes:e.filter(o=>!o.toLowerCase().includes("hover"))},s.set(n,a)),a}const Ac=i=>C(i)&&Object.getOwnPropertyNames(i).some(t=>Ct(i[t]));function Ic(i,t){const{isScriptable:e,isIndexable:s}=_a(i);for(const n of t){const a=e(n),r=s(n),o=(r||a)&&i[n];if(a&&(Ct(o)||Ac(o))||r&&z(o))return!0}return!1}var Pc="4.5.1";const Cc=["top","bottom","left","right","chartArea"];function Ln(i,t){return i==="top"||i==="bottom"||Cc.indexOf(i)===-1&&t==="x"}function Tn(i,t){return function(e,s){return e[i]===s[i]?e[t]-s[t]:e[i]-s[i]}}function Dn(i){const t=i.chart,e=t.options.animation;t.notifyPlugins("afterRender"),N(e&&e.onComplete,[i],t)}function Bc(i){const t=i.chart,e=t.options.animation;N(e&&e.onProgress,[i],t)}function qa(i){return os()&&typeof i=="string"?i=document.getElementById(i):i&&i.length&&(i=i[0]),i&&i.canvas&&(i=i.canvas),i}const Ze={},An=i=>{const t=qa(i);return Object.values(Ze).filter(e=>e.canvas===t).pop()};function Rc(i,t,e){const s=Object.keys(i);for(const n of s){const a=+n;if(a>=t){const r=i[n];delete i[n],(e>0||a>t)&&(i[a+e]=r)}}}function Oc(i,t,e,s){return!e||i.type==="mouseout"?null:s?t:i}class rt{static register(...t){gt.add(...t),In()}static unregister(...t){gt.remove(...t),In()}constructor(t,e){const s=this.config=new Dc(e),n=qa(t),a=An(n);if(a)throw new Error("Canvas is already in use. Chart with ID '"+a.id+"' must be destroyed before the canvas with ID '"+a.canvas.id+"' can be reused.");const r=s.createResolver(s.chartOptionScopes(),this.getContext());this.platform=new(s.platform||tc(n)),this.platform.updateConfig(s);const o=this.platform.acquireContext(n,r.aspectRatio),l=o&&o.canvas,c=l&&l.height,d=l&&l.width;if(this.id=Or(),this.ctx=o,this.canvas=l,this.width=d,this.height=c,this._options=r,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new bc,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=Zr(u=>this.update(u),r.resizeDelay||0),this._dataChanges=[],Ze[this.id]=this,!o||!l){console.error("Failed to create chart: can't acquire context from the given item");return}yt.listen(this,"complete",Dn),yt.listen(this,"progress",Bc),this._initialize(),this.attached&&this.update()}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:s,height:n,_aspectRatio:a}=this;return P(t)?e&&a?a:n?s/n:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return gt}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():Qs(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return Gs(this.canvas,this.ctx),this}stop(){return yt.stop(this),this}resize(t,e){yt.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const s=this.options,n=this.canvas,a=s.maintainAspectRatio&&this.aspectRatio,r=this.platform.getMaximumSize(n,t,e,a),o=s.devicePixelRatio||this.platform.getDevicePixelRatio(),l=this.width?"resize":"attach";this.width=r.width,this.height=r.height,this._aspectRatio=this.aspectRatio,Qs(this,o,!0)&&(this.notifyPlugins("resize",{size:r}),N(s.onResize,[this,r],this),this.attached&&this._doResize(l)&&this.render())}ensureScalesHaveIDs(){const e=this.options.scales||{};j(e,(s,n)=>{s.id=n})}buildOrUpdateScales(){const t=this.options,e=t.scales,s=this.scales,n=Object.keys(s).reduce((r,o)=>(r[o]=!1,r),{});let a=[];e&&(a=a.concat(Object.keys(e).map(r=>{const o=e[r],l=Ni(r,o),c=l==="r",d=l==="x";return{options:o,dposition:c?"chartArea":d?"bottom":"left",dtype:c?"radialLinear":d?"category":"linear"}}))),j(a,r=>{const o=r.options,l=o.id,c=Ni(l,o),d=I(o.type,r.dtype);(o.position===void 0||Ln(o.position,c)!==Ln(r.dposition))&&(o.position=r.dposition),n[l]=!0;let u=null;if(l in s&&s[l].type===d)u=s[l];else{const p=gt.getScale(d);u=new p({id:l,type:d,ctx:this.ctx,chart:this}),s[u.id]=u}u.init(o,t)}),j(n,(r,o)=>{r||delete s[o]}),j(s,r=>{Z.configure(this,r,r.options),Z.addBox(this,r)})}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,s=t.length;if(t.sort((n,a)=>n.index-a.index),s>e){for(let n=e;n<s;++n)this._destroyDatasetMeta(n);t.splice(e,s-e)}this._sortedMetasets=t.slice(0).sort(Tn("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach((s,n)=>{e.filter(a=>a===s._dataset).length===0&&this._destroyDatasetMeta(n)})}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let s,n;for(this._removeUnreferencedMetasets(),s=0,n=e.length;s<n;s++){const a=e[s];let r=this.getDatasetMeta(s);const o=a.type||this.config.type;if(r.type&&r.type!==o&&(this._destroyDatasetMeta(s),r=this.getDatasetMeta(s)),r.type=o,r.indexAxis=a.indexAxis||ji(o,this.options),r.order=a.order||0,r.index=s,r.label=""+a.label,r.visible=this.isDatasetVisible(s),r.controller)r.controller.updateIndex(s),r.controller.linkScales();else{const l=gt.getController(o),{datasetElementType:c,dataElementType:d}=V.datasets[o];Object.assign(l,{dataElementType:gt.getElement(d),datasetElementType:c&&gt.getElement(c)}),r.controller=new l(this,s),t.push(r.controller)}}return this._updateMetasets(),t}_resetElements(){j(this.data.datasets,(t,e)=>{this.getDatasetMeta(e).controller.reset()},this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const s=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),n=this._animationsDisabled=!s.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0})===!1)return;const a=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let r=0;for(let c=0,d=this.data.datasets.length;c<d;c++){const{controller:u}=this.getDatasetMeta(c),p=!n&&a.indexOf(u)===-1;u.buildOrUpdateElements(p),r=Math.max(+u.getMaxOverflow(),r)}r=this._minPadding=s.layout.autoPadding?r:0,this._updateLayout(r),n||j(a,c=>{c.reset()}),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(Tn("z","_idx"));const{_active:o,_lastEvent:l}=this;l?this._eventHandler(l,!0):o.length&&this._updateHoverStyles(o,o,!0),this.render()}_updateScales(){j(this.scales,t=>{Z.removeBox(this,t)}),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),s=new Set(t.events);(!$s(e,s)||!!this._responsiveListeners!==t.responsive)&&(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:s,start:n,count:a}of e){const r=s==="_removeElements"?-a:a;Rc(t,n,r)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,s=a=>new Set(t.filter(r=>r[0]===a).map((r,o)=>o+","+r.splice(1).join(","))),n=s(0);for(let a=1;a<e;a++)if(!$s(n,s(a)))return;return Array.from(n).map(a=>a.split(",")).map(a=>({method:a[1],start:+a[2],count:+a[3]}))}_updateLayout(t){if(this.notifyPlugins("beforeLayout",{cancelable:!0})===!1)return;Z.update(this,this.width,this.height,t);const e=this.chartArea,s=e.width<=0||e.height<=0;this._layers=[],j(this.boxes,n=>{s&&n.position==="chartArea"||(n.configure&&n.configure(),this._layers.push(...n._layers()))},this),this._layers.forEach((n,a)=>{n._idx=a}),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})!==!1){for(let e=0,s=this.data.datasets.length;e<s;++e)this.getDatasetMeta(e).controller.configure();for(let e=0,s=this.data.datasets.length;e<s;++e)this._updateDataset(e,Ct(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const s=this.getDatasetMeta(t),n={meta:s,index:t,mode:e,cancelable:!0};this.notifyPlugins("beforeDatasetUpdate",n)!==!1&&(s.controller._update(e),n.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",n))}render(){this.notifyPlugins("beforeRender",{cancelable:!0})!==!1&&(yt.has(this)?this.attached&&!yt.running(this)&&yt.start(this):(this.draw(),Dn({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:s,height:n}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(s,n)}if(this.clear(),this.width<=0||this.height<=0||this.notifyPlugins("beforeDraw",{cancelable:!0})===!1)return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,s=[];let n,a;for(n=0,a=e.length;n<a;++n){const r=e[n];(!t||r.visible)&&s.push(r)}return s}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0})===!1)return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,s={meta:t,index:t.index,cancelable:!0},n=Ba(this,t);this.notifyPlugins("beforeDatasetDraw",s)!==!1&&(n&&pi(e,n),t.controller.draw(),n&&fi(e),s.cancelable=!1,this.notifyPlugins("afterDatasetDraw",s))}isPointInArea(t){return St(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,s,n){const a=Cl.modes[e];return typeof a=="function"?a(this,t,s,n):[]}getDatasetMeta(t){const e=this.data.datasets[t],s=this._metasets;let n=s.filter(a=>a&&a._dataset===e).pop();return n||(n={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},s.push(n)),n}getContext(){return this.$context||(this.$context=Bt(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const s=this.getDatasetMeta(t);return typeof s.hidden=="boolean"?!s.hidden:!e.hidden}setDatasetVisibility(t,e){const s=this.getDatasetMeta(t);s.hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,s){const n=s?"show":"hide",a=this.getDatasetMeta(t),r=a.controller._resolveAnimations(void 0,n);Se(e)?(a.data[e].hidden=!s,this.update()):(this.setDatasetVisibility(t,s),r.update(a,{visible:s}),this.update(o=>o.datasetIndex===t?n:void 0))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),yt.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),Gs(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete Ze[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,s=(a,r)=>{e.addEventListener(this,a,r),t[a]=r},n=(a,r,o)=>{a.offsetX=r,a.offsetY=o,this._eventHandler(a)};j(this.options.events,a=>s(a,n))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,s=(l,c)=>{e.addEventListener(this,l,c),t[l]=c},n=(l,c)=>{t[l]&&(e.removeEventListener(this,l,c),delete t[l])},a=(l,c)=>{this.canvas&&this.resize(l,c)};let r;const o=()=>{n("attach",o),this.attached=!0,this.resize(),s("resize",a),s("detach",r)};r=()=>{this.attached=!1,n("resize",a),this._stop(),this._resize(0,0),s("attach",o)},e.isAttached(this.canvas)?o():r()}unbindEvents(){j(this._listeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._listeners={},j(this._responsiveListeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._responsiveListeners=void 0}updateHoverStyle(t,e,s){const n=s?"set":"remove";let a,r,o,l;for(e==="dataset"&&(a=this.getDatasetMeta(t[0].datasetIndex),a.controller["_"+n+"DatasetHoverStyle"]()),o=0,l=t.length;o<l;++o){r=t[o];const c=r&&this.getDatasetMeta(r.datasetIndex).controller;c&&c[n+"HoverStyle"](r.element,r.datasetIndex,r.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],s=t.map(({datasetIndex:a,index:r})=>{const o=this.getDatasetMeta(a);if(!o)throw new Error("No dataset found at index "+a);return{datasetIndex:a,element:o.data[r],index:r}});!ni(s,e)&&(this._active=s,this._lastEvent=null,this._updateHoverStyles(s,e))}notifyPlugins(t,e,s){return this._plugins.notify(this,t,e,s)}isPluginEnabled(t){return this._plugins._cache.filter(e=>e.plugin.id===t).length===1}_updateHoverStyles(t,e,s){const n=this.options.hover,a=(l,c)=>l.filter(d=>!c.some(u=>d.datasetIndex===u.datasetIndex&&d.index===u.index)),r=a(e,t),o=s?t:a(t,e);r.length&&this.updateHoverStyle(r,n.mode,!1),o.length&&n.mode&&this.updateHoverStyle(o,n.mode,!0)}_eventHandler(t,e){const s={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},n=r=>(r.options.events||this.options.events).includes(t.native.type);if(this.notifyPlugins("beforeEvent",s,n)===!1)return;const a=this._handleEvent(t,e,s.inChartArea);return s.cancelable=!1,this.notifyPlugins("afterEvent",s,n),(a||s.changed)&&this.render(),this}_handleEvent(t,e,s){const{_active:n=[],options:a}=this,r=e,o=this._getActiveElements(t,n,s,r),l=zr(t),c=Oc(t,this._lastEvent,s,l);s&&(this._lastEvent=null,N(a.onHover,[t,o,this],this),l&&N(a.onClick,[t,o,this],this));const d=!ni(o,n);return(d||e)&&(this._active=o,this._updateHoverStyles(o,n,e)),this._lastEvent=c,d}_getActiveElements(t,e,s,n){if(t.type==="mouseout")return[];if(!s)return e;const a=this.options.hover;return this.getElementsAtEventForMode(t,a.mode,a,n)}}E(rt,"defaults",V),E(rt,"instances",Ze),E(rt,"overrides",Xt),E(rt,"registry",gt),E(rt,"version",Pc),E(rt,"getChart",An);function In(){return j(rt.instances,i=>i._plugins.invalidate())}function Fc(i,t,e){const{startAngle:s,x:n,y:a,outerRadius:r,innerRadius:o,options:l}=t,{borderWidth:c,borderJoinStyle:d}=l,u=Math.min(c/r,Q(s-e));if(i.beginPath(),i.arc(n,a,r-c/2,s+u/2,e-u/2),o>0){const p=Math.min(c/o,Q(s-e));i.arc(n,a,o+c/2,e-p/2,s+p/2,!0)}else{const p=Math.min(c/2,r*Q(s-e));if(d==="round")i.arc(n,a,p,e-O/2,s+O/2,!0);else if(d==="bevel"){const h=2*p*p,g=-h*Math.cos(e+O/2)+n,f=-h*Math.sin(e+O/2)+a,m=h*Math.cos(s+O/2)+n,x=h*Math.sin(s+O/2)+a;i.lineTo(g,f),i.lineTo(m,x)}}i.closePath(),i.moveTo(0,0),i.rect(0,0,i.canvas.width,i.canvas.height),i.clip("evenodd")}function jc(i,t,e){const{startAngle:s,pixelMargin:n,x:a,y:r,outerRadius:o,innerRadius:l}=t;let c=n/o;i.beginPath(),i.arc(a,r,o,s-c,e+c),l>n?(c=n/l,i.arc(a,r,l,e+c,s-c,!0)):i.arc(a,r,n,e+q,s-q),i.closePath(),i.clip()}function Nc(i){return ss(i,["outerStart","outerEnd","innerStart","innerEnd"])}function $c(i,t,e,s){const n=Nc(i.options.borderRadius),a=(e-t)/2,r=Math.min(a,s*t/2),o=l=>{const c=(e-Math.min(a,l))*s/2;return K(l,0,Math.min(a,c))};return{outerStart:o(n.outerStart),outerEnd:o(n.outerEnd),innerStart:K(n.innerStart,0,r),innerEnd:K(n.innerEnd,0,r)}}function Zt(i,t,e,s){return{x:e+i*Math.cos(t),y:s+i*Math.sin(t)}}function di(i,t,e,s,n,a){const{x:r,y:o,startAngle:l,pixelMargin:c,innerRadius:d}=t,u=Math.max(t.outerRadius+s+e-c,0),p=d>0?d+s+e+c:0;let h=0;const g=n-l;if(s){const B=d>0?d-s:0,F=u>0?u-s:0,H=(B+F)/2,et=H!==0?g*H/(H+s):g;h=(g-et)/2}const f=Math.max(.001,g*u-e/O)/u,m=(g-f)/2,x=l+m+h,b=n-m-h,{outerStart:y,outerEnd:k,innerStart:v,innerEnd:w}=$c(t,p,u,b-x),_=u-y,S=u-k,M=x+y/_,L=b-k/S,T=p+v,A=p+w,W=x+v/T,Y=b-w/A;if(i.beginPath(),a){const B=(M+L)/2;if(i.arc(r,o,u,M,B),i.arc(r,o,u,B,L),k>0){const X=Zt(S,L,r,o);i.arc(X.x,X.y,k,L,b+q)}const F=Zt(A,b,r,o);if(i.lineTo(F.x,F.y),w>0){const X=Zt(A,Y,r,o);i.arc(X.x,X.y,w,b+q,Y+Math.PI)}const H=(b-w/p+(x+v/p))/2;if(i.arc(r,o,p,b-w/p,H,!0),i.arc(r,o,p,H,x+v/p,!0),v>0){const X=Zt(T,W,r,o);i.arc(X.x,X.y,v,W+Math.PI,x-q)}const et=Zt(_,x,r,o);if(i.lineTo(et.x,et.y),y>0){const X=Zt(_,M,r,o);i.arc(X.x,X.y,y,x-q,M)}}else{i.moveTo(r,o);const B=Math.cos(M)*u+r,F=Math.sin(M)*u+o;i.lineTo(B,F);const H=Math.cos(L)*u+r,et=Math.sin(L)*u+o;i.lineTo(H,et)}i.closePath()}function Hc(i,t,e,s,n){const{fullCircles:a,startAngle:r,circumference:o}=t;let l=t.endAngle;if(a){di(i,t,e,s,l,n);for(let c=0;c<a;++c)i.fill();isNaN(o)||(l=r+(o%$||$))}return di(i,t,e,s,l,n),i.fill(),l}function zc(i,t,e,s,n){const{fullCircles:a,startAngle:r,circumference:o,options:l}=t,{borderWidth:c,borderJoinStyle:d,borderDash:u,borderDashOffset:p,borderRadius:h}=l,g=l.borderAlign==="inner";if(!c)return;i.setLineDash(u||[]),i.lineDashOffset=p,g?(i.lineWidth=c*2,i.lineJoin=d||"round"):(i.lineWidth=c,i.lineJoin=d||"bevel");let f=t.endAngle;if(a){di(i,t,e,s,f,n);for(let m=0;m<a;++m)i.stroke();isNaN(o)||(f=r+(o%$||$))}g&&jc(i,t,f),l.selfJoin&&f-r>=O&&h===0&&d!=="miter"&&Fc(i,t,f),a||(di(i,t,e,s,f,n),i.stroke())}class fe extends ut{constructor(e){super();E(this,"circumference");E(this,"endAngle");E(this,"fullCircles");E(this,"innerRadius");E(this,"outerRadius");E(this,"pixelMargin");E(this,"startAngle");this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,e&&Object.assign(this,e)}inRange(e,s,n){const a=this.getProps(["x","y"],n),{angle:r,distance:o}=pa(a,{x:e,y:s}),{startAngle:l,endAngle:c,innerRadius:d,outerRadius:u,circumference:p}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],n),h=(this.options.spacing+this.options.borderWidth)/2,g=I(p,c-l),f=Me(r,l,c)&&l!==c,m=g>=$||f,x=kt(o,d+h,u+h);return m&&x}getCenterPoint(e){const{x:s,y:n,startAngle:a,endAngle:r,innerRadius:o,outerRadius:l}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],e),{offset:c,spacing:d}=this.options,u=(a+r)/2,p=(o+l+d+c)/2;return{x:s+Math.cos(u)*p,y:n+Math.sin(u)*p}}tooltipPosition(e){return this.getCenterPoint(e)}draw(e){const{options:s,circumference:n}=this,a=(s.offset||0)/4,r=(s.spacing||0)/2,o=s.circular;if(this.pixelMargin=s.borderAlign==="inner"?.33:0,this.fullCircles=n>$?Math.floor(n/$):0,n===0||this.innerRadius<0||this.outerRadius<0)return;e.save();const l=(this.startAngle+this.endAngle)/2;e.translate(Math.cos(l)*a,Math.sin(l)*a);const c=1-Math.sin(Math.min(O,n||0)),d=a*c;e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,Hc(e,this,d,r,o),zc(e,this,d,r,o),e.restore()}}E(fe,"id","arc"),E(fe,"defaults",{borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0,selfJoin:!1}),E(fe,"defaultRoutes",{backgroundColor:"backgroundColor"}),E(fe,"descriptors",{_scriptable:!0,_indexable:e=>e!=="borderDash"});function Ya(i,t,e=t){i.lineCap=I(e.borderCapStyle,t.borderCapStyle),i.setLineDash(I(e.borderDash,t.borderDash)),i.lineDashOffset=I(e.borderDashOffset,t.borderDashOffset),i.lineJoin=I(e.borderJoinStyle,t.borderJoinStyle),i.lineWidth=I(e.borderWidth,t.borderWidth),i.strokeStyle=I(e.borderColor,t.borderColor)}function Vc(i,t,e){i.lineTo(e.x,e.y)}function Wc(i){return i.stepped?ho:i.tension||i.cubicInterpolationMode==="monotone"?po:Vc}function Xa(i,t,e={}){const s=i.length,{start:n=0,end:a=s-1}=e,{start:r,end:o}=t,l=Math.max(n,r),c=Math.min(a,o),d=n<r&&a<r||n>o&&a>o;return{count:s,start:l,loop:t.loop,ilen:c<l&&!d?s+c-l:c-l}}function Uc(i,t,e,s){const{points:n,options:a}=t,{count:r,start:o,loop:l,ilen:c}=Xa(n,e,s),d=Wc(a);let{move:u=!0,reverse:p}=s||{},h,g,f;for(h=0;h<=c;++h)g=n[(o+(p?c-h:h))%r],!g.skip&&(u?(i.moveTo(g.x,g.y),u=!1):d(i,f,g,p,a.stepped),f=g);return l&&(g=n[(o+(p?c:0))%r],d(i,f,g,p,a.stepped)),!!l}function qc(i,t,e,s){const n=t.points,{count:a,start:r,ilen:o}=Xa(n,e,s),{move:l=!0,reverse:c}=s||{};let d=0,u=0,p,h,g,f,m,x;const b=k=>(r+(c?o-k:k))%a,y=()=>{f!==m&&(i.lineTo(d,m),i.lineTo(d,f),i.lineTo(d,x))};for(l&&(h=n[b(0)],i.moveTo(h.x,h.y)),p=0;p<=o;++p){if(h=n[b(p)],h.skip)continue;const k=h.x,v=h.y,w=k|0;w===g?(v<f?f=v:v>m&&(m=v),d=(u*d+k)/++u):(y(),i.lineTo(k,v),g=w,u=0,f=m=v),x=v}y()}function $i(i){const t=i.options,e=t.borderDash&&t.borderDash.length;return!i._decimated&&!i._loop&&!t.tension&&t.cubicInterpolationMode!=="monotone"&&!t.stepped&&!e?qc:Uc}function Yc(i){return i.stepped?Uo:i.tension||i.cubicInterpolationMode==="monotone"?qo:Vt}function Xc(i,t,e,s){let n=t._path;n||(n=t._path=new Path2D,t.path(n,e,s)&&n.closePath()),Ya(i,t.options),i.stroke(n)}function Gc(i,t,e,s){const{segments:n,options:a}=t,r=$i(t);for(const o of n)Ya(i,a,o.style),i.beginPath(),r(i,t,o,{start:e,end:e+s-1})&&i.closePath(),i.stroke()}const Kc=typeof Path2D=="function";function Jc(i,t,e,s){Kc&&!t.options.segment?Xc(i,t,e,s):Gc(i,t,e,s)}class Dt extends ut{constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const s=this.options;if((s.tension||s.cubicInterpolationMode==="monotone")&&!s.stepped&&!this._pointsUpdated){const n=s.spanGaps?this._loop:this._fullLoop;Fo(this._points,s,t,n,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=Qo(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,s=t.length;return s&&e[t[s-1].end]}interpolate(t,e){const s=this.options,n=t[e],a=this.points,r=Ca(this,{property:e,start:n,end:n});if(!r.length)return;const o=[],l=Yc(s);let c,d;for(c=0,d=r.length;c<d;++c){const{start:u,end:p}=r[c],h=a[u],g=a[p];if(h===g){o.push(h);continue}const f=Math.abs((n-h[e])/(g[e]-h[e])),m=l(h,g,f,s.stepped);m[e]=t[e],o.push(m)}return o.length===1?o[0]:o}pathSegment(t,e,s){return $i(this)(t,this,e,s)}path(t,e,s){const n=this.segments,a=$i(this);let r=this._loop;e=e||0,s=s||this.points.length-e;for(const o of n)r&=a(t,this,o,{start:e,end:e+s-1});return!!r}draw(t,e,s,n){const a=this.options||{};(this.points||[]).length&&a.borderWidth&&(t.save(),Jc(t,this,s,n),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}E(Dt,"id","line"),E(Dt,"defaults",{borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0}),E(Dt,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"}),E(Dt,"descriptors",{_scriptable:!0,_indexable:t=>t!=="borderDash"&&t!=="fill"});function Pn(i,t,e,s){const n=i.options,{[e]:a}=i.getProps([e],s);return Math.abs(t-a)<n.radius+n.hitRadius}class ti extends ut{constructor(e){super();E(this,"parsed");E(this,"skip");E(this,"stop");this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,e&&Object.assign(this,e)}inRange(e,s,n){const a=this.options,{x:r,y:o}=this.getProps(["x","y"],n);return Math.pow(e-r,2)+Math.pow(s-o,2)<Math.pow(a.hitRadius+a.radius,2)}inXRange(e,s){return Pn(this,e,"x",s)}inYRange(e,s){return Pn(this,e,"y",s)}getCenterPoint(e){const{x:s,y:n}=this.getProps(["x","y"],e);return{x:s,y:n}}size(e){e=e||this.options||{};let s=e.radius||0;s=Math.max(s,s&&e.hoverRadius||0);const n=s&&e.borderWidth||0;return(s+n)*2}draw(e,s){const n=this.options;this.skip||n.radius<.1||!St(this,s,this.size(n)/2)||(e.strokeStyle=n.borderColor,e.lineWidth=n.borderWidth,e.fillStyle=n.backgroundColor,Oi(e,n,this.x,this.y))}getRange(){const e=this.options||{};return e.radius+e.hitRadius}}E(ti,"id","point"),E(ti,"defaults",{borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0}),E(ti,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});function Ga(i,t){const{x:e,y:s,base:n,width:a,height:r}=i.getProps(["x","y","base","width","height"],t);let o,l,c,d,u;return i.horizontal?(u=r/2,o=Math.min(e,n),l=Math.max(e,n),c=s-u,d=s+u):(u=a/2,o=e-u,l=e+u,c=Math.min(s,n),d=Math.max(s,n)),{left:o,top:c,right:l,bottom:d}}function At(i,t,e,s){return i?0:K(t,e,s)}function Qc(i,t,e){const s=i.options.borderWidth,n=i.borderSkipped,a=ka(s);return{t:At(n.top,a.top,0,e),r:At(n.right,a.right,0,t),b:At(n.bottom,a.bottom,0,e),l:At(n.left,a.left,0,t)}}function Zc(i,t,e){const{enableBorderRadius:s}=i.getProps(["enableBorderRadius"]),n=i.options.borderRadius,a=qt(n),r=Math.min(t,e),o=i.borderSkipped,l=s||C(n);return{topLeft:At(!l||o.top||o.left,a.topLeft,0,r),topRight:At(!l||o.top||o.right,a.topRight,0,r),bottomLeft:At(!l||o.bottom||o.left,a.bottomLeft,0,r),bottomRight:At(!l||o.bottom||o.right,a.bottomRight,0,r)}}function td(i){const t=Ga(i),e=t.right-t.left,s=t.bottom-t.top,n=Qc(i,e/2,s/2),a=Zc(i,e/2,s/2);return{outer:{x:t.left,y:t.top,w:e,h:s,radius:a},inner:{x:t.left+n.l,y:t.top+n.t,w:e-n.l-n.r,h:s-n.t-n.b,radius:{topLeft:Math.max(0,a.topLeft-Math.max(n.t,n.l)),topRight:Math.max(0,a.topRight-Math.max(n.t,n.r)),bottomLeft:Math.max(0,a.bottomLeft-Math.max(n.b,n.l)),bottomRight:Math.max(0,a.bottomRight-Math.max(n.b,n.r))}}}}function Di(i,t,e,s){const n=t===null,a=e===null,o=i&&!(n&&a)&&Ga(i,s);return o&&(n||kt(t,o.left,o.right))&&(a||kt(e,o.top,o.bottom))}function ed(i){return i.topLeft||i.topRight||i.bottomLeft||i.bottomRight}function id(i,t){i.rect(t.x,t.y,t.w,t.h)}function Ai(i,t,e={}){const s=i.x!==e.x?-t:0,n=i.y!==e.y?-t:0,a=(i.x+i.w!==e.x+e.w?t:0)-s,r=(i.y+i.h!==e.y+e.h?t:0)-n;return{x:i.x+s,y:i.y+n,w:i.w+a,h:i.h+r,radius:i.radius}}class ei extends ut{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:s,backgroundColor:n}}=this,{inner:a,outer:r}=td(this),o=ed(r.radius)?Ee:id;t.save(),(r.w!==a.w||r.h!==a.h)&&(t.beginPath(),o(t,Ai(r,e,a)),t.clip(),o(t,Ai(a,-e,r)),t.fillStyle=s,t.fill("evenodd")),t.beginPath(),o(t,Ai(a,e)),t.fillStyle=n,t.fill(),t.restore()}inRange(t,e,s){return Di(this,t,e,s)}inXRange(t,e){return Di(this,t,null,e)}inYRange(t,e){return Di(this,null,t,e)}getCenterPoint(t){const{x:e,y:s,base:n,horizontal:a}=this.getProps(["x","y","base","horizontal"],t);return{x:a?(e+n)/2:e,y:a?s:(s+n)/2}}getRange(t){return t==="x"?this.width/2:this.height/2}}E(ei,"id","bar"),E(ei,"defaults",{borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0}),E(ei,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});var sd=Object.freeze({__proto__:null,ArcElement:fe,BarElement:ei,LineElement:Dt,PointElement:ti});const Hi=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],Cn=Hi.map(i=>i.replace("rgb(","rgba(").replace(")",", 0.5)"));function Ka(i){return Hi[i%Hi.length]}function Ja(i){return Cn[i%Cn.length]}function nd(i,t){return i.borderColor=Ka(t),i.backgroundColor=Ja(t),++t}function ad(i,t){return i.backgroundColor=i.data.map(()=>Ka(t++)),t}function rd(i,t){return i.backgroundColor=i.data.map(()=>Ja(t++)),t}function od(i){let t=0;return(e,s)=>{const n=i.getDatasetMeta(s).controller;n instanceof Ut?t=ad(e,t):n instanceof we?t=rd(e,t):n&&(t=nd(e,t))}}function Bn(i){let t;for(t in i)if(i[t].borderColor||i[t].backgroundColor)return!0;return!1}function ld(i){return i&&(i.borderColor||i.backgroundColor)}function cd(){return V.borderColor!=="rgba(0,0,0,0.1)"||V.backgroundColor!=="rgba(0,0,0,0.1)"}var dd={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(i,t,e){if(!e.enabled)return;const{data:{datasets:s},options:n}=i.config,{elements:a}=n,r=Bn(s)||ld(n)||a&&Bn(a)||cd();if(!e.forceOverride&&r)return;const o=od(i);s.forEach(o)}};function ud(i,t,e,s,n){const a=n.samples||s;if(a>=e)return i.slice(t,t+e);const r=[],o=(e-2)/(a-2);let l=0;const c=t+e-1;let d=t,u,p,h,g,f;for(r[l++]=i[d],u=0;u<a-2;u++){let m=0,x=0,b;const y=Math.floor((u+1)*o)+1+t,k=Math.min(Math.floor((u+2)*o)+1,e)+t,v=k-y;for(b=y;b<k;b++)m+=i[b].x,x+=i[b].y;m/=v,x/=v;const w=Math.floor(u*o)+1+t,_=Math.min(Math.floor((u+1)*o)+1,e)+t,{x:S,y:M}=i[d];for(h=g=-1,b=w;b<_;b++)g=.5*Math.abs((S-m)*(i[b].y-M)-(S-i[b].x)*(x-M)),g>h&&(h=g,p=i[b],f=b);r[l++]=p,d=f}return r[l++]=i[c],r}function hd(i,t,e,s){let n=0,a=0,r,o,l,c,d,u,p,h,g,f;const m=[],x=t+e-1,b=i[t].x,k=i[x].x-b;for(r=t;r<t+e;++r){o=i[r],l=(o.x-b)/k*s,c=o.y;const v=l|0;if(v===d)c<g?(g=c,u=r):c>f&&(f=c,p=r),n=(a*n+o.x)/++a;else{const w=r-1;if(!P(u)&&!P(p)){const _=Math.min(u,p),S=Math.max(u,p);_!==h&&_!==w&&m.push({...i[_],x:n}),S!==h&&S!==w&&m.push({...i[S],x:n})}r>0&&w!==h&&m.push(i[w]),m.push(o),d=v,a=0,g=f=c,u=p=h=r}}return m}function Qa(i){if(i._decimated){const t=i._data;delete i._decimated,delete i._data,Object.defineProperty(i,"data",{configurable:!0,enumerable:!0,writable:!0,value:t})}}function Rn(i){i.data.datasets.forEach(t=>{Qa(t)})}function pd(i,t){const e=t.length;let s=0,n;const{iScale:a}=i,{min:r,max:o,minDefined:l,maxDefined:c}=a.getUserBounds();return l&&(s=K(_t(t,a.axis,r).lo,0,e-1)),c?n=K(_t(t,a.axis,o).hi+1,s,e)-s:n=e-s,{start:s,count:n}}var fd={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(i,t,e)=>{if(!e.enabled){Rn(i);return}const s=i.width;i.data.datasets.forEach((n,a)=>{const{_data:r,indexAxis:o}=n,l=i.getDatasetMeta(a),c=r||n.data;if(he([o,i.options.indexAxis])==="y"||!l.controller.supportsDecimation)return;const d=i.scales[l.xAxisID];if(d.type!=="linear"&&d.type!=="time"||i.options.parsing)return;let{start:u,count:p}=pd(l,c);const h=e.threshold||4*s;if(p<=h){Qa(n);return}P(r)&&(n._data=c,delete n.data,Object.defineProperty(n,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(f){this._data=f}}));let g;switch(e.algorithm){case"lttb":g=ud(c,u,p,s,e);break;case"min-max":g=hd(c,u,p,s);break;default:throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`)}n._decimated=g})},destroy(i){Rn(i)}};function gd(i,t,e){const s=i.segments,n=i.points,a=t.points,r=[];for(const o of s){let{start:l,end:c}=o;c=xi(l,c,n);const d=zi(e,n[l],n[c],o.loop);if(!t.segments){r.push({source:o,target:d,start:n[l],end:n[c]});continue}const u=Ca(t,d);for(const p of u){const h=zi(e,a[p.start],a[p.end],p.loop),g=Pa(o,n,h);for(const f of g)r.push({source:f,target:p,start:{[e]:On(d,h,"start",Math.max)},end:{[e]:On(d,h,"end",Math.min)}})}}return r}function zi(i,t,e,s){if(s)return;let n=t[i],a=e[i];return i==="angle"&&(n=Q(n),a=Q(a)),{property:i,start:n,end:a}}function md(i,t){const{x:e=null,y:s=null}=i||{},n=t.points,a=[];return t.segments.forEach(({start:r,end:o})=>{o=xi(r,o,n);const l=n[r],c=n[o];s!==null?(a.push({x:l.x,y:s}),a.push({x:c.x,y:s})):e!==null&&(a.push({x:e,y:l.y}),a.push({x:e,y:c.y}))}),a}function xi(i,t,e){for(;t>i;t--){const s=e[t];if(!isNaN(s.x)&&!isNaN(s.y))break}return t}function On(i,t,e,s){return i&&t?s(i[e],t[e]):i?i[e]:t?t[e]:0}function Za(i,t){let e=[],s=!1;return z(i)?(s=!0,e=i):e=md(i,t),e.length?new Dt({points:e,options:{tension:0},_loop:s,_fullLoop:s}):null}function Fn(i){return i&&i.fill!==!1}function xd(i,t,e){let n=i[t].fill;const a=[t];let r;if(!e)return n;for(;n!==!1&&a.indexOf(n)===-1;){if(!U(n))return n;if(r=i[n],!r)return!1;if(r.visible)return n;a.push(n),n=r.fill}return!1}function bd(i,t,e){const s=kd(i);if(C(s))return isNaN(s.value)?!1:s;let n=parseFloat(s);return U(n)&&Math.floor(n)===n?yd(s[0],t,n,e):["origin","start","end","stack","shape"].indexOf(s)>=0&&s}function yd(i,t,e,s){return(i==="-"||i==="+")&&(e=t+e),e===t||e<0||e>=s?!1:e}function vd(i,t){let e=null;return i==="start"?e=t.bottom:i==="end"?e=t.top:C(i)?e=t.getPixelForValue(i.value):t.getBasePixel&&(e=t.getBasePixel()),e}function wd(i,t,e){let s;return i==="start"?s=e:i==="end"?s=t.options.reverse?t.min:t.max:C(i)?s=i.value:s=t.getBaseValue(),s}function kd(i){const t=i.options,e=t.fill;let s=I(e&&e.target,e);return s===void 0&&(s=!!t.backgroundColor),s===!1||s===null?!1:s===!0?"origin":s}function _d(i){const{scale:t,index:e,line:s}=i,n=[],a=s.segments,r=s.points,o=Sd(t,e);o.push(Za({x:null,y:t.bottom},s));for(let l=0;l<a.length;l++){const c=a[l];for(let d=c.start;d<=c.end;d++)Md(n,r[d],o)}return new Dt({points:n,options:{}})}function Sd(i,t){const e=[],s=i.getMatchingVisibleMetas("line");for(let n=0;n<s.length;n++){const a=s[n];if(a.index===t)break;a.hidden||e.unshift(a.dataset)}return e}function Md(i,t,e){const s=[];for(let n=0;n<e.length;n++){const a=e[n],{first:r,last:o,point:l}=Ed(a,t,"x");if(!(!l||r&&o)){if(r)s.unshift(l);else if(i.push(l),!o)break}}i.push(...s)}function Ed(i,t,e){const s=i.interpolate(t,e);if(!s)return{};const n=s[e],a=i.segments,r=i.points;let o=!1,l=!1;for(let c=0;c<a.length;c++){const d=a[c],u=r[d.start][e],p=r[d.end][e];if(kt(n,u,p)){o=n===u,l=n===p;break}}return{first:o,last:l,point:s}}class tr{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,s){const{x:n,y:a,radius:r}=this;return e=e||{start:0,end:$},t.arc(n,a,r,e.end,e.start,!0),!s.bounds}interpolate(t){const{x:e,y:s,radius:n}=this,a=t.angle;return{x:e+Math.cos(a)*n,y:s+Math.sin(a)*n,angle:a}}}function Ld(i){const{chart:t,fill:e,line:s}=i;if(U(e))return Td(t,e);if(e==="stack")return _d(i);if(e==="shape")return!0;const n=Dd(i);return n instanceof tr?n:Za(n,s)}function Td(i,t){const e=i.getDatasetMeta(t);return e&&i.isDatasetVisible(t)?e.dataset:null}function Dd(i){return(i.scale||{}).getPointPositionForValue?Id(i):Ad(i)}function Ad(i){const{scale:t={},fill:e}=i,s=vd(e,t);if(U(s)){const n=t.isHorizontal();return{x:n?s:null,y:n?null:s}}return null}function Id(i){const{scale:t,fill:e}=i,s=t.options,n=t.getLabels().length,a=s.reverse?t.max:t.min,r=wd(e,t,a),o=[];if(s.grid.circular){const l=t.getPointPositionForValue(0,a);return new tr({x:l.x,y:l.y,radius:t.getDistanceFromCenterForValue(r)})}for(let l=0;l<n;++l)o.push(t.getPointPositionForValue(l,r));return o}function Ii(i,t,e){const s=Ld(t),{chart:n,index:a,line:r,scale:o,axis:l}=t,c=r.options,d=c.fill,u=c.backgroundColor,{above:p=u,below:h=u}=d||{},g=n.getDatasetMeta(a),f=Ba(n,g);s&&r.points.length&&(pi(i,e),Pd(i,{line:r,target:s,above:p,below:h,area:e,scale:o,axis:l,clip:f}),fi(i))}function Pd(i,t){const{line:e,target:s,above:n,below:a,area:r,scale:o,clip:l}=t,c=e._loop?"angle":t.axis;i.save();let d=a;a!==n&&(c==="x"?(jn(i,s,r.top),Pi(i,{line:e,target:s,color:n,scale:o,property:c,clip:l}),i.restore(),i.save(),jn(i,s,r.bottom)):c==="y"&&(Nn(i,s,r.left),Pi(i,{line:e,target:s,color:a,scale:o,property:c,clip:l}),i.restore(),i.save(),Nn(i,s,r.right),d=n)),Pi(i,{line:e,target:s,color:d,scale:o,property:c,clip:l}),i.restore()}function jn(i,t,e){const{segments:s,points:n}=t;let a=!0,r=!1;i.beginPath();for(const o of s){const{start:l,end:c}=o,d=n[l],u=n[xi(l,c,n)];a?(i.moveTo(d.x,d.y),a=!1):(i.lineTo(d.x,e),i.lineTo(d.x,d.y)),r=!!t.pathSegment(i,o,{move:r}),r?i.closePath():i.lineTo(u.x,e)}i.lineTo(t.first().x,e),i.closePath(),i.clip()}function Nn(i,t,e){const{segments:s,points:n}=t;let a=!0,r=!1;i.beginPath();for(const o of s){const{start:l,end:c}=o,d=n[l],u=n[xi(l,c,n)];a?(i.moveTo(d.x,d.y),a=!1):(i.lineTo(e,d.y),i.lineTo(d.x,d.y)),r=!!t.pathSegment(i,o,{move:r}),r?i.closePath():i.lineTo(e,u.y)}i.lineTo(e,t.first().y),i.closePath(),i.clip()}function Pi(i,t){const{line:e,target:s,property:n,color:a,scale:r,clip:o}=t,l=gd(e,s,n);for(const{source:c,target:d,start:u,end:p}of l){const{style:{backgroundColor:h=a}={}}=c,g=s!==!0;i.save(),i.fillStyle=h,Cd(i,r,o,g&&zi(n,u,p)),i.beginPath();const f=!!e.pathSegment(i,c);let m;if(g){f?i.closePath():$n(i,s,p,n);const x=!!s.pathSegment(i,d,{move:f,reverse:!0});m=f&&x,m||$n(i,s,u,n)}i.closePath(),i.fill(m?"evenodd":"nonzero"),i.restore()}}function Cd(i,t,e,s){const n=t.chart.chartArea,{property:a,start:r,end:o}=s||{};if(a==="x"||a==="y"){let l,c,d,u;a==="x"?(l=r,c=n.top,d=o,u=n.bottom):(l=n.left,c=r,d=n.right,u=o),i.beginPath(),e&&(l=Math.max(l,e.left),d=Math.min(d,e.right),c=Math.max(c,e.top),u=Math.min(u,e.bottom)),i.rect(l,c,d-l,u-c),i.clip()}}function $n(i,t,e,s){const n=t.interpolate(e,s);n&&i.lineTo(n.x,n.y)}var Bd={id:"filler",afterDatasetsUpdate(i,t,e){const s=(i.data.datasets||[]).length,n=[];let a,r,o,l;for(r=0;r<s;++r)a=i.getDatasetMeta(r),o=a.dataset,l=null,o&&o.options&&o instanceof Dt&&(l={visible:i.isDatasetVisible(r),index:r,fill:bd(o,r,s),chart:i,axis:a.controller.options.indexAxis,scale:a.vScale,line:o}),a.$filler=l,n.push(l);for(r=0;r<s;++r)l=n[r],!(!l||l.fill===!1)&&(l.fill=xd(n,r,e.propagate))},beforeDraw(i,t,e){const s=e.drawTime==="beforeDraw",n=i.getSortedVisibleDatasetMetas(),a=i.chartArea;for(let r=n.length-1;r>=0;--r){const o=n[r].$filler;o&&(o.line.updateControlPoints(a,o.axis),s&&o.fill&&Ii(i.ctx,o,a))}},beforeDatasetsDraw(i,t,e){if(e.drawTime!=="beforeDatasetsDraw")return;const s=i.getSortedVisibleDatasetMetas();for(let n=s.length-1;n>=0;--n){const a=s[n].$filler;Fn(a)&&Ii(i.ctx,a,i.chartArea)}},beforeDatasetDraw(i,t,e){const s=t.meta.$filler;!Fn(s)||e.drawTime!=="beforeDatasetDraw"||Ii(i.ctx,s,i.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const Hn=(i,t)=>{let{boxHeight:e=t,boxWidth:s=t}=i;return i.usePointStyle&&(e=Math.min(e,t),s=i.pointStyleWidth||Math.min(s,t)),{boxWidth:s,boxHeight:e,itemHeight:Math.max(t,e)}},Rd=(i,t)=>i!==null&&t!==null&&i.datasetIndex===t.datasetIndex&&i.index===t.index;class zn extends ut{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,s){this.maxWidth=t,this.maxHeight=e,this._margins=s,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=N(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter(s=>t.filter(s,this.chart.data))),t.sort&&(e=e.sort((s,n)=>t.sort(s,n,this.chart.data))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display){this.width=this.height=0;return}const s=t.labels,n=G(s.font),a=n.size,r=this._computeTitleHeight(),{boxWidth:o,itemHeight:l}=Hn(s,a);let c,d;e.font=n.string,this.isHorizontal()?(c=this.maxWidth,d=this._fitRows(r,a,o,l)+10):(d=this.maxHeight,c=this._fitCols(r,n,o,l)+10),this.width=Math.min(c,t.maxWidth||this.maxWidth),this.height=Math.min(d,t.maxHeight||this.maxHeight)}_fitRows(t,e,s,n){const{ctx:a,maxWidth:r,options:{labels:{padding:o}}}=this,l=this.legendHitBoxes=[],c=this.lineWidths=[0],d=n+o;let u=t;a.textAlign="left",a.textBaseline="middle";let p=-1,h=-d;return this.legendItems.forEach((g,f)=>{const m=s+e/2+a.measureText(g.text).width;(f===0||c[c.length-1]+m+2*o>r)&&(u+=d,c[c.length-(f>0?0:1)]=0,h+=d,p++),l[f]={left:0,top:h,row:p,width:m,height:n},c[c.length-1]+=m+o}),u}_fitCols(t,e,s,n){const{ctx:a,maxHeight:r,options:{labels:{padding:o}}}=this,l=this.legendHitBoxes=[],c=this.columnSizes=[],d=r-t;let u=o,p=0,h=0,g=0,f=0;return this.legendItems.forEach((m,x)=>{const{itemWidth:b,itemHeight:y}=Od(s,e,a,m,n);x>0&&h+y+2*o>d&&(u+=p+o,c.push({width:p,height:h}),g+=p+o,f++,p=h=0),l[x]={left:g,top:h,col:f,width:b,height:y},p=Math.max(p,b),h+=y+o}),u+=p,c.push({width:p,height:h}),u}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:s,labels:{padding:n},rtl:a}}=this,r=te(a,this.left,this.width);if(this.isHorizontal()){let o=0,l=J(s,this.left+n,this.right-this.lineWidths[o]);for(const c of e)o!==c.row&&(o=c.row,l=J(s,this.left+n,this.right-this.lineWidths[o])),c.top+=this.top+t+n,c.left=r.leftForLtr(r.x(l),c.width),l+=c.width+n}else{let o=0,l=J(s,this.top+t+n,this.bottom-this.columnSizes[o].height);for(const c of e)c.col!==o&&(o=c.col,l=J(s,this.top+t+n,this.bottom-this.columnSizes[o].height)),c.top=l,c.left+=this.left+n,c.left=r.leftForLtr(r.x(c.left),c.width),l+=c.height+n}}isHorizontal(){return this.options.position==="top"||this.options.position==="bottom"}draw(){if(this.options.display){const t=this.ctx;pi(t,this),this._draw(),fi(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:s,ctx:n}=this,{align:a,labels:r}=t,o=V.color,l=te(t.rtl,this.left,this.width),c=G(r.font),{padding:d}=r,u=c.size,p=u/2;let h;this.drawTitle(),n.textAlign=l.textAlign("left"),n.textBaseline="middle",n.lineWidth=.5,n.font=c.string;const{boxWidth:g,boxHeight:f,itemHeight:m}=Hn(r,u),x=function(w,_,S){if(isNaN(g)||g<=0||isNaN(f)||f<0)return;n.save();const M=I(S.lineWidth,1);if(n.fillStyle=I(S.fillStyle,o),n.lineCap=I(S.lineCap,"butt"),n.lineDashOffset=I(S.lineDashOffset,0),n.lineJoin=I(S.lineJoin,"miter"),n.lineWidth=M,n.strokeStyle=I(S.strokeStyle,o),n.setLineDash(I(S.lineDash,[])),r.usePointStyle){const L={radius:f*Math.SQRT2/2,pointStyle:S.pointStyle,rotation:S.rotation,borderWidth:M},T=l.xPlus(w,g/2),A=_+p;wa(n,L,T,A,r.pointStyleWidth&&g)}else{const L=_+Math.max((u-f)/2,0),T=l.leftForLtr(w,g),A=qt(S.borderRadius);n.beginPath(),Object.values(A).some(W=>W!==0)?Ee(n,{x:T,y:L,w:g,h:f,radius:A}):n.rect(T,L,g,f),n.fill(),M!==0&&n.stroke()}n.restore()},b=function(w,_,S){Gt(n,S.text,w,_+m/2,c,{strikethrough:S.hidden,textAlign:l.textAlign(S.textAlign)})},y=this.isHorizontal(),k=this._computeTitleHeight();y?h={x:J(a,this.left+d,this.right-s[0]),y:this.top+d+k,line:0}:h={x:this.left+d,y:J(a,this.top+k+d,this.bottom-e[0].height),line:0},Da(this.ctx,t.textDirection);const v=m+d;this.legendItems.forEach((w,_)=>{n.strokeStyle=w.fontColor,n.fillStyle=w.fontColor;const S=n.measureText(w.text).width,M=l.textAlign(w.textAlign||(w.textAlign=r.textAlign)),L=g+p+S;let T=h.x,A=h.y;l.setWidth(this.width),y?_>0&&T+L+d>this.right&&(A=h.y+=v,h.line++,T=h.x=J(a,this.left+d,this.right-s[h.line])):_>0&&A+v>this.bottom&&(T=h.x=T+e[h.line].width+d,h.line++,A=h.y=J(a,this.top+k+d,this.bottom-e[h.line].height));const W=l.x(T);if(x(W,A,w),T=to(M,T+g+p,y?T+L:this.right,t.rtl),b(l.x(T),A,w),y)h.x+=L+d;else if(typeof w.text!="string"){const Y=c.lineHeight;h.y+=er(w,Y)+d}else h.y+=v}),Aa(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,s=G(e.font),n=tt(e.padding);if(!e.display)return;const a=te(t.rtl,this.left,this.width),r=this.ctx,o=e.position,l=s.size/2,c=n.top+l;let d,u=this.left,p=this.width;if(this.isHorizontal())p=Math.max(...this.lineWidths),d=this.top+c,u=J(t.align,u,this.right-p);else{const g=this.columnSizes.reduce((f,m)=>Math.max(f,m.height),0);d=c+J(t.align,this.top,this.bottom-g-t.labels.padding-this._computeTitleHeight())}const h=J(o,u,u+p);r.textAlign=a.textAlign(es(o)),r.textBaseline="middle",r.strokeStyle=e.color,r.fillStyle=e.color,r.font=s.string,Gt(r,e.text,h,d,s)}_computeTitleHeight(){const t=this.options.title,e=G(t.font),s=tt(t.padding);return t.display?e.lineHeight+s.height:0}_getLegendItemAt(t,e){let s,n,a;if(kt(t,this.left,this.right)&&kt(e,this.top,this.bottom)){for(a=this.legendHitBoxes,s=0;s<a.length;++s)if(n=a[s],kt(t,n.left,n.left+n.width)&&kt(e,n.top,n.top+n.height))return this.legendItems[s]}return null}handleEvent(t){const e=this.options;if(!Nd(t.type,e))return;const s=this._getLegendItemAt(t.x,t.y);if(t.type==="mousemove"||t.type==="mouseout"){const n=this._hoveredItem,a=Rd(n,s);n&&!a&&N(e.onLeave,[t,n,this],this),this._hoveredItem=s,s&&!a&&N(e.onHover,[t,s,this],this)}else s&&N(e.onClick,[t,s,this],this)}}function Od(i,t,e,s,n){const a=Fd(s,i,t,e),r=jd(n,s,t.lineHeight);return{itemWidth:a,itemHeight:r}}function Fd(i,t,e,s){let n=i.text;return n&&typeof n!="string"&&(n=n.reduce((a,r)=>a.length>r.length?a:r)),t+e.size/2+s.measureText(n).width}function jd(i,t,e){let s=i;return typeof t.text!="string"&&(s=er(t,e)),s}function er(i,t){const e=i.text?i.text.length:0;return t*e}function Nd(i,t){return!!((i==="mousemove"||i==="mouseout")&&(t.onHover||t.onLeave)||t.onClick&&(i==="click"||i==="mouseup"))}var $d={id:"legend",_element:zn,start(i,t,e){const s=i.legend=new zn({ctx:i.ctx,options:e,chart:i});Z.configure(i,s,e),Z.addBox(i,s)},stop(i){Z.removeBox(i,i.legend),delete i.legend},beforeUpdate(i,t,e){const s=i.legend;Z.configure(i,s,e),s.options=e},afterUpdate(i){const t=i.legend;t.buildLabels(),t.adjustHitBoxes()},afterEvent(i,t){t.replay||i.legend.handleEvent(t.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(i,t,e){const s=t.datasetIndex,n=e.chart;n.isDatasetVisible(s)?(n.hide(s),t.hidden=!0):(n.show(s),t.hidden=!1)},onHover:null,onLeave:null,labels:{color:i=>i.chart.options.color,boxWidth:40,padding:10,generateLabels(i){const t=i.data.datasets,{labels:{usePointStyle:e,pointStyle:s,textAlign:n,color:a,useBorderRadius:r,borderRadius:o}}=i.legend.options;return i._getSortedDatasetMetas().map(l=>{const c=l.controller.getStyle(e?0:void 0),d=tt(c.borderWidth);return{text:t[l.index].label,fillStyle:c.backgroundColor,fontColor:a,hidden:!l.visible,lineCap:c.borderCapStyle,lineDash:c.borderDash,lineDashOffset:c.borderDashOffset,lineJoin:c.borderJoinStyle,lineWidth:(d.width+d.height)/4,strokeStyle:c.borderColor,pointStyle:s||c.pointStyle,rotation:c.rotation,textAlign:n||c.textAlign,borderRadius:r&&(o||c.borderRadius),datasetIndex:l.index}},this)}},title:{color:i=>i.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:i=>!i.startsWith("on"),labels:{_scriptable:i=>!["generateLabels","filter","sort"].includes(i)}}};class ds extends ut{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const s=this.options;if(this.left=0,this.top=0,!s.display){this.width=this.height=this.right=this.bottom=0;return}this.width=this.right=t,this.height=this.bottom=e;const n=z(s.text)?s.text.length:1;this._padding=tt(s.padding);const a=n*G(s.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=a:this.width=a}isHorizontal(){const t=this.options.position;return t==="top"||t==="bottom"}_drawArgs(t){const{top:e,left:s,bottom:n,right:a,options:r}=this,o=r.align;let l=0,c,d,u;return this.isHorizontal()?(d=J(o,s,a),u=e+t,c=a-s):(r.position==="left"?(d=s+t,u=J(o,n,e),l=O*-.5):(d=a-t,u=J(o,e,n),l=O*.5),c=n-e),{titleX:d,titleY:u,maxWidth:c,rotation:l}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const s=G(e.font),a=s.lineHeight/2+this._padding.top,{titleX:r,titleY:o,maxWidth:l,rotation:c}=this._drawArgs(a);Gt(t,e.text,0,0,s,{color:e.color,maxWidth:l,rotation:c,textAlign:es(e.align),textBaseline:"middle",translation:[r,o]})}}function Hd(i,t){const e=new ds({ctx:i.ctx,options:t,chart:i});Z.configure(i,e,t),Z.addBox(i,e),i.titleBlock=e}var zd={id:"title",_element:ds,start(i,t,e){Hd(i,e)},stop(i){const t=i.titleBlock;Z.removeBox(i,t),delete i.titleBlock},beforeUpdate(i,t,e){const s=i.titleBlock;Z.configure(i,s,e),s.options=e},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Ve=new WeakMap;var Vd={id:"subtitle",start(i,t,e){const s=new ds({ctx:i.ctx,options:e,chart:i});Z.configure(i,s,e),Z.addBox(i,s),Ve.set(i,s)},stop(i){Z.removeBox(i,Ve.get(i)),Ve.delete(i)},beforeUpdate(i,t,e){const s=Ve.get(i);Z.configure(i,s,e),s.options=e},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const ge={average(i){if(!i.length)return!1;let t,e,s=new Set,n=0,a=0;for(t=0,e=i.length;t<e;++t){const o=i[t].element;if(o&&o.hasValue()){const l=o.tooltipPosition();s.add(l.x),n+=l.y,++a}}return a===0||s.size===0?!1:{x:[...s].reduce((o,l)=>o+l)/s.size,y:n/a}},nearest(i,t){if(!i.length)return!1;let e=t.x,s=t.y,n=Number.POSITIVE_INFINITY,a,r,o;for(a=0,r=i.length;a<r;++a){const l=i[a].element;if(l&&l.hasValue()){const c=l.getCenterPoint(),d=Bi(t,c);d<n&&(n=d,o=l)}}if(o){const l=o.tooltipPosition();e=l.x,s=l.y}return{x:e,y:s}}};function ft(i,t){return t&&(z(t)?Array.prototype.push.apply(i,t):i.push(t)),i}function vt(i){return(typeof i=="string"||i instanceof String)&&i.indexOf(`
`)>-1?i.split(`
`):i}function Wd(i,t){const{element:e,datasetIndex:s,index:n}=t,a=i.getDatasetMeta(s).controller,{label:r,value:o}=a.getLabelAndValue(n);return{chart:i,label:r,parsed:a.getParsed(n),raw:i.data.datasets[s].data[n],formattedValue:o,dataset:a.getDataset(),dataIndex:n,datasetIndex:s,element:e}}function Vn(i,t){const e=i.chart.ctx,{body:s,footer:n,title:a}=i,{boxWidth:r,boxHeight:o}=t,l=G(t.bodyFont),c=G(t.titleFont),d=G(t.footerFont),u=a.length,p=n.length,h=s.length,g=tt(t.padding);let f=g.height,m=0,x=s.reduce((k,v)=>k+v.before.length+v.lines.length+v.after.length,0);if(x+=i.beforeBody.length+i.afterBody.length,u&&(f+=u*c.lineHeight+(u-1)*t.titleSpacing+t.titleMarginBottom),x){const k=t.displayColors?Math.max(o,l.lineHeight):l.lineHeight;f+=h*k+(x-h)*l.lineHeight+(x-1)*t.bodySpacing}p&&(f+=t.footerMarginTop+p*d.lineHeight+(p-1)*t.footerSpacing);let b=0;const y=function(k){m=Math.max(m,e.measureText(k).width+b)};return e.save(),e.font=c.string,j(i.title,y),e.font=l.string,j(i.beforeBody.concat(i.afterBody),y),b=t.displayColors?r+2+t.boxPadding:0,j(s,k=>{j(k.before,y),j(k.lines,y),j(k.after,y)}),b=0,e.font=d.string,j(i.footer,y),e.restore(),m+=g.width,{width:m,height:f}}function Ud(i,t){const{y:e,height:s}=t;return e<s/2?"top":e>i.height-s/2?"bottom":"center"}function qd(i,t,e,s){const{x:n,width:a}=s,r=e.caretSize+e.caretPadding;if(i==="left"&&n+a+r>t.width||i==="right"&&n-a-r<0)return!0}function Yd(i,t,e,s){const{x:n,width:a}=e,{width:r,chartArea:{left:o,right:l}}=i;let c="center";return s==="center"?c=n<=(o+l)/2?"left":"right":n<=a/2?c="left":n>=r-a/2&&(c="right"),qd(c,i,t,e)&&(c="center"),c}function Wn(i,t,e){const s=e.yAlign||t.yAlign||Ud(i,e);return{xAlign:e.xAlign||t.xAlign||Yd(i,t,e,s),yAlign:s}}function Xd(i,t){let{x:e,width:s}=i;return t==="right"?e-=s:t==="center"&&(e-=s/2),e}function Gd(i,t,e){let{y:s,height:n}=i;return t==="top"?s+=e:t==="bottom"?s-=n+e:s-=n/2,s}function Un(i,t,e,s){const{caretSize:n,caretPadding:a,cornerRadius:r}=i,{xAlign:o,yAlign:l}=e,c=n+a,{topLeft:d,topRight:u,bottomLeft:p,bottomRight:h}=qt(r);let g=Xd(t,o);const f=Gd(t,l,c);return l==="center"?o==="left"?g+=c:o==="right"&&(g-=c):o==="left"?g-=Math.max(d,p)+n:o==="right"&&(g+=Math.max(u,h)+n),{x:K(g,0,s.width-t.width),y:K(f,0,s.height-t.height)}}function We(i,t,e){const s=tt(e.padding);return t==="center"?i.x+i.width/2:t==="right"?i.x+i.width-s.right:i.x+s.left}function qn(i){return ft([],vt(i))}function Kd(i,t,e){return Bt(i,{tooltip:t,tooltipItems:e,type:"tooltip"})}function Yn(i,t){const e=t&&t.dataset&&t.dataset.tooltip&&t.dataset.tooltip.callbacks;return e?i.override(e):i}const ir={beforeTitle:xt,title(i){if(i.length>0){const t=i[0],e=t.chart.data.labels,s=e?e.length:0;if(this&&this.options&&this.options.mode==="dataset")return t.dataset.label||"";if(t.label)return t.label;if(s>0&&t.dataIndex<s)return e[t.dataIndex]}return""},afterTitle:xt,beforeBody:xt,beforeLabel:xt,label(i){if(this&&this.options&&this.options.mode==="dataset")return i.label+": "+i.formattedValue||i.formattedValue;let t=i.dataset.label||"";t&&(t+=": ");const e=i.formattedValue;return P(e)||(t+=e),t},labelColor(i){const e=i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(i){const e=i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:xt,afterBody:xt,beforeFooter:xt,footer:xt,afterFooter:xt};function st(i,t,e,s){const n=i[t].call(e,s);return typeof n>"u"?ir[t].call(e,s):n}class Vi extends ut{constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,s=this.options.setContext(this.getContext()),n=s.enabled&&e.options.animation&&s.animations,a=new Ra(this.chart,n);return n._cacheable&&(this._cachedAnimations=Object.freeze(a)),a}getContext(){return this.$context||(this.$context=Kd(this.chart.getContext(),this,this._tooltipItems))}getTitle(t,e){const{callbacks:s}=e,n=st(s,"beforeTitle",this,t),a=st(s,"title",this,t),r=st(s,"afterTitle",this,t);let o=[];return o=ft(o,vt(n)),o=ft(o,vt(a)),o=ft(o,vt(r)),o}getBeforeBody(t,e){return qn(st(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:s}=e,n=[];return j(t,a=>{const r={before:[],lines:[],after:[]},o=Yn(s,a);ft(r.before,vt(st(o,"beforeLabel",this,a))),ft(r.lines,st(o,"label",this,a)),ft(r.after,vt(st(o,"afterLabel",this,a))),n.push(r)}),n}getAfterBody(t,e){return qn(st(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:s}=e,n=st(s,"beforeFooter",this,t),a=st(s,"footer",this,t),r=st(s,"afterFooter",this,t);let o=[];return o=ft(o,vt(n)),o=ft(o,vt(a)),o=ft(o,vt(r)),o}_createItems(t){const e=this._active,s=this.chart.data,n=[],a=[],r=[];let o=[],l,c;for(l=0,c=e.length;l<c;++l)o.push(Wd(this.chart,e[l]));return t.filter&&(o=o.filter((d,u,p)=>t.filter(d,u,p,s))),t.itemSort&&(o=o.sort((d,u)=>t.itemSort(d,u,s))),j(o,d=>{const u=Yn(t.callbacks,d);n.push(st(u,"labelColor",this,d)),a.push(st(u,"labelPointStyle",this,d)),r.push(st(u,"labelTextColor",this,d))}),this.labelColors=n,this.labelPointStyles=a,this.labelTextColors=r,this.dataPoints=o,o}update(t,e){const s=this.options.setContext(this.getContext()),n=this._active;let a,r=[];if(!n.length)this.opacity!==0&&(a={opacity:0});else{const o=ge[s.position].call(this,n,this._eventPosition);r=this._createItems(s),this.title=this.getTitle(r,s),this.beforeBody=this.getBeforeBody(r,s),this.body=this.getBody(r,s),this.afterBody=this.getAfterBody(r,s),this.footer=this.getFooter(r,s);const l=this._size=Vn(this,s),c=Object.assign({},o,l),d=Wn(this.chart,s,c),u=Un(s,c,d,this.chart);this.xAlign=d.xAlign,this.yAlign=d.yAlign,a={opacity:1,x:u.x,y:u.y,width:l.width,height:l.height,caretX:o.x,caretY:o.y}}this._tooltipItems=r,this.$context=void 0,a&&this._resolveAnimations().update(this,a),t&&s.external&&s.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,s,n){const a=this.getCaretPosition(t,s,n);e.lineTo(a.x1,a.y1),e.lineTo(a.x2,a.y2),e.lineTo(a.x3,a.y3)}getCaretPosition(t,e,s){const{xAlign:n,yAlign:a}=this,{caretSize:r,cornerRadius:o}=s,{topLeft:l,topRight:c,bottomLeft:d,bottomRight:u}=qt(o),{x:p,y:h}=t,{width:g,height:f}=e;let m,x,b,y,k,v;return a==="center"?(k=h+f/2,n==="left"?(m=p,x=m-r,y=k+r,v=k-r):(m=p+g,x=m+r,y=k-r,v=k+r),b=m):(n==="left"?x=p+Math.max(l,d)+r:n==="right"?x=p+g-Math.max(c,u)-r:x=this.caretX,a==="top"?(y=h,k=y-r,m=x-r,b=x+r):(y=h+f,k=y+r,m=x+r,b=x-r),v=y),{x1:m,x2:x,x3:b,y1:y,y2:k,y3:v}}drawTitle(t,e,s){const n=this.title,a=n.length;let r,o,l;if(a){const c=te(s.rtl,this.x,this.width);for(t.x=We(this,s.titleAlign,s),e.textAlign=c.textAlign(s.titleAlign),e.textBaseline="middle",r=G(s.titleFont),o=s.titleSpacing,e.fillStyle=s.titleColor,e.font=r.string,l=0;l<a;++l)e.fillText(n[l],c.x(t.x),t.y+r.lineHeight/2),t.y+=r.lineHeight+o,l+1===a&&(t.y+=s.titleMarginBottom-o)}}_drawColorBox(t,e,s,n,a){const r=this.labelColors[s],o=this.labelPointStyles[s],{boxHeight:l,boxWidth:c}=a,d=G(a.bodyFont),u=We(this,"left",a),p=n.x(u),h=l<d.lineHeight?(d.lineHeight-l)/2:0,g=e.y+h;if(a.usePointStyle){const f={radius:Math.min(c,l)/2,pointStyle:o.pointStyle,rotation:o.rotation,borderWidth:1},m=n.leftForLtr(p,c)+c/2,x=g+l/2;t.strokeStyle=a.multiKeyBackground,t.fillStyle=a.multiKeyBackground,Oi(t,f,m,x),t.strokeStyle=r.borderColor,t.fillStyle=r.backgroundColor,Oi(t,f,m,x)}else{t.lineWidth=C(r.borderWidth)?Math.max(...Object.values(r.borderWidth)):r.borderWidth||1,t.strokeStyle=r.borderColor,t.setLineDash(r.borderDash||[]),t.lineDashOffset=r.borderDashOffset||0;const f=n.leftForLtr(p,c),m=n.leftForLtr(n.xPlus(p,1),c-2),x=qt(r.borderRadius);Object.values(x).some(b=>b!==0)?(t.beginPath(),t.fillStyle=a.multiKeyBackground,Ee(t,{x:f,y:g,w:c,h:l,radius:x}),t.fill(),t.stroke(),t.fillStyle=r.backgroundColor,t.beginPath(),Ee(t,{x:m,y:g+1,w:c-2,h:l-2,radius:x}),t.fill()):(t.fillStyle=a.multiKeyBackground,t.fillRect(f,g,c,l),t.strokeRect(f,g,c,l),t.fillStyle=r.backgroundColor,t.fillRect(m,g+1,c-2,l-2))}t.fillStyle=this.labelTextColors[s]}drawBody(t,e,s){const{body:n}=this,{bodySpacing:a,bodyAlign:r,displayColors:o,boxHeight:l,boxWidth:c,boxPadding:d}=s,u=G(s.bodyFont);let p=u.lineHeight,h=0;const g=te(s.rtl,this.x,this.width),f=function(S){e.fillText(S,g.x(t.x+h),t.y+p/2),t.y+=p+a},m=g.textAlign(r);let x,b,y,k,v,w,_;for(e.textAlign=r,e.textBaseline="middle",e.font=u.string,t.x=We(this,m,s),e.fillStyle=s.bodyColor,j(this.beforeBody,f),h=o&&m!=="right"?r==="center"?c/2+d:c+2+d:0,k=0,w=n.length;k<w;++k){for(x=n[k],b=this.labelTextColors[k],e.fillStyle=b,j(x.before,f),y=x.lines,o&&y.length&&(this._drawColorBox(e,t,k,g,s),p=Math.max(u.lineHeight,l)),v=0,_=y.length;v<_;++v)f(y[v]),p=u.lineHeight;j(x.after,f)}h=0,p=u.lineHeight,j(this.afterBody,f),t.y-=a}drawFooter(t,e,s){const n=this.footer,a=n.length;let r,o;if(a){const l=te(s.rtl,this.x,this.width);for(t.x=We(this,s.footerAlign,s),t.y+=s.footerMarginTop,e.textAlign=l.textAlign(s.footerAlign),e.textBaseline="middle",r=G(s.footerFont),e.fillStyle=s.footerColor,e.font=r.string,o=0;o<a;++o)e.fillText(n[o],l.x(t.x),t.y+r.lineHeight/2),t.y+=r.lineHeight+s.footerSpacing}}drawBackground(t,e,s,n){const{xAlign:a,yAlign:r}=this,{x:o,y:l}=t,{width:c,height:d}=s,{topLeft:u,topRight:p,bottomLeft:h,bottomRight:g}=qt(n.cornerRadius);e.fillStyle=n.backgroundColor,e.strokeStyle=n.borderColor,e.lineWidth=n.borderWidth,e.beginPath(),e.moveTo(o+u,l),r==="top"&&this.drawCaret(t,e,s,n),e.lineTo(o+c-p,l),e.quadraticCurveTo(o+c,l,o+c,l+p),r==="center"&&a==="right"&&this.drawCaret(t,e,s,n),e.lineTo(o+c,l+d-g),e.quadraticCurveTo(o+c,l+d,o+c-g,l+d),r==="bottom"&&this.drawCaret(t,e,s,n),e.lineTo(o+h,l+d),e.quadraticCurveTo(o,l+d,o,l+d-h),r==="center"&&a==="left"&&this.drawCaret(t,e,s,n),e.lineTo(o,l+u),e.quadraticCurveTo(o,l,o+u,l),e.closePath(),e.fill(),n.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,s=this.$animations,n=s&&s.x,a=s&&s.y;if(n||a){const r=ge[t.position].call(this,this._active,this._eventPosition);if(!r)return;const o=this._size=Vn(this,t),l=Object.assign({},r,this._size),c=Wn(e,t,l),d=Un(t,l,c,e);(n._to!==d.x||a._to!==d.y)&&(this.xAlign=c.xAlign,this.yAlign=c.yAlign,this.width=o.width,this.height=o.height,this.caretX=r.x,this.caretY=r.y,this._resolveAnimations().update(this,d))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let s=this.opacity;if(!s)return;this._updateAnimationTarget(e);const n={width:this.width,height:this.height},a={x:this.x,y:this.y};s=Math.abs(s)<.001?0:s;const r=tt(e.padding),o=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&o&&(t.save(),t.globalAlpha=s,this.drawBackground(a,t,n,e),Da(t,e.textDirection),a.y+=r.top,this.drawTitle(a,t,e),this.drawBody(a,t,e),this.drawFooter(a,t,e),Aa(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const s=this._active,n=t.map(({datasetIndex:o,index:l})=>{const c=this.chart.getDatasetMeta(o);if(!c)throw new Error("Cannot find a dataset at index "+o);return{datasetIndex:o,element:c.data[l],index:l}}),a=!ni(s,n),r=this._positionChanged(n,e);(a||r)&&(this._active=n,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,s=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const n=this.options,a=this._active||[],r=this._getActiveElements(t,a,e,s),o=this._positionChanged(r,t),l=e||!ni(r,a)||o;return l&&(this._active=r,(n.enabled||n.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),l}_getActiveElements(t,e,s,n){const a=this.options;if(t.type==="mouseout")return[];if(!n)return e.filter(o=>this.chart.data.datasets[o.datasetIndex]&&this.chart.getDatasetMeta(o.datasetIndex).controller.getParsed(o.index)!==void 0);const r=this.chart.getElementsAtEventForMode(t,a.mode,a,s);return a.reverse&&r.reverse(),r}_positionChanged(t,e){const{caretX:s,caretY:n,options:a}=this,r=ge[a.position].call(this,t,e);return r!==!1&&(s!==r.x||n!==r.y)}}E(Vi,"positioners",ge);var Jd={id:"tooltip",_element:Vi,positioners:ge,afterInit(i,t,e){e&&(i.tooltip=new Vi({chart:i,options:e}))},beforeUpdate(i,t,e){i.tooltip&&i.tooltip.initialize(e)},reset(i,t,e){i.tooltip&&i.tooltip.initialize(e)},afterDraw(i){const t=i.tooltip;if(t&&t._willRender()){const e={tooltip:t};if(i.notifyPlugins("beforeTooltipDraw",{...e,cancelable:!0})===!1)return;t.draw(i.ctx),i.notifyPlugins("afterTooltipDraw",e)}},afterEvent(i,t){if(i.tooltip){const e=t.replay;i.tooltip.handleEvent(t.event,e,t.inChartArea)&&(t.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(i,t)=>t.bodyFont.size,boxWidth:(i,t)=>t.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:ir},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:i=>i!=="filter"&&i!=="itemSort"&&i!=="external",_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},Qd=Object.freeze({__proto__:null,Colors:dd,Decimation:fd,Filler:Bd,Legend:$d,SubTitle:Vd,Title:zd,Tooltip:Jd});const Zd=(i,t,e,s)=>(typeof t=="string"?(e=i.push(t)-1,s.unshift({index:e,label:t})):isNaN(t)&&(e=null),e);function tu(i,t,e,s){const n=i.indexOf(t);if(n===-1)return Zd(i,t,e,s);const a=i.lastIndexOf(t);return n!==a?e:n}const eu=(i,t)=>i===null?null:K(Math.round(i),0,t);function Xn(i){const t=this.getLabels();return i>=0&&i<t.length?t[i]:i}class Wi extends Kt{constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const s=this.getLabels();for(const{index:n,label:a}of e)s[n]===a&&s.splice(n,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(P(t))return null;const s=this.getLabels();return e=isFinite(e)&&s[e]===t?e:tu(s,t,I(e,t),this._addedLabels),eu(e,s.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:s,max:n}=this.getMinMax(!0);this.options.bounds==="ticks"&&(t||(s=0),e||(n=this.getLabels().length-1)),this.min=s,this.max=n}buildTicks(){const t=this.min,e=this.max,s=this.options.offset,n=[];let a=this.getLabels();a=t===0&&e===a.length-1?a:a.slice(t,e+1),this._valueRange=Math.max(a.length-(s?0:1),1),this._startValue=this.min-(s?.5:0);for(let r=t;r<=e;r++)n.push({value:r});return n}getLabelForValue(t){return Xn.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return typeof t!="number"&&(t=this.parse(t)),t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}}E(Wi,"id","category"),E(Wi,"defaults",{ticks:{callback:Xn}});function iu(i,t){const e=[],{bounds:n,step:a,min:r,max:o,precision:l,count:c,maxTicks:d,maxDigits:u,includeBounds:p}=i,h=a||1,g=d-1,{min:f,max:m}=t,x=!P(r),b=!P(o),y=!P(c),k=(m-f)/(u+1);let v=zs((m-f)/g/h)*h,w,_,S,M;if(v<1e-14&&!x&&!b)return[{value:f},{value:m}];M=Math.ceil(m/v)-Math.floor(f/v),M>g&&(v=zs(M*v/g/h)*h),P(l)||(w=Math.pow(10,l),v=Math.ceil(v*w)/w),n==="ticks"?(_=Math.floor(f/v)*v,S=Math.ceil(m/v)*v):(_=f,S=m),x&&b&&a&&Yr((o-r)/a,v/1e3)?(M=Math.round(Math.min((o-r)/v,d)),v=(o-r)/M,_=r,S=o):y?(_=x?r:_,S=b?o:S,M=c-1,v=(S-_)/M):(M=(S-_)/v,be(M,Math.round(M),v/1e3)?M=Math.round(M):M=Math.ceil(M));const L=Math.max(Vs(v),Vs(_));w=Math.pow(10,P(l)?L:l),_=Math.round(_*w)/w,S=Math.round(S*w)/w;let T=0;for(x&&(p&&_!==r?(e.push({value:r}),_<r&&T++,be(Math.round((_+T*v)*w)/w,r,Gn(r,k,i))&&T++):_<r&&T++);T<M;++T){const A=Math.round((_+T*v)*w)/w;if(b&&A>o)break;e.push({value:A})}return b&&p&&S!==o?e.length&&be(e[e.length-1].value,o,Gn(o,k,i))?e[e.length-1].value=o:e.push({value:o}):(!b||S===o)&&e.push({value:S}),e}function Gn(i,t,{horizontal:e,minRotation:s}){const n=ct(s),a=(e?Math.sin(n):Math.cos(n))||.001,r=.75*t*(""+i).length;return Math.min(t/a,r)}class ui extends Kt{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return P(t)||(typeof t=="number"||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:s}=this.getUserBounds();let{min:n,max:a}=this;const r=l=>n=e?n:l,o=l=>a=s?a:l;if(t){const l=mt(n),c=mt(a);l<0&&c<0?o(0):l>0&&c>0&&r(0)}if(n===a){let l=a===0?1:Math.abs(a*.05);o(a+l),t||r(n-l)}this.min=n,this.max=a}getTickLimit(){const t=this.options.ticks;let{maxTicksLimit:e,stepSize:s}=t,n;return s?(n=Math.ceil(this.max/s)-Math.floor(this.min/s)+1,n>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${n} ticks. Limiting to 1000.`),n=1e3)):(n=this.computeTickLimit(),e=e||11),e&&(n=Math.min(e,n)),n}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let s=this.getTickLimit();s=Math.max(2,s);const n={maxTicks:s,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:e.includeBounds!==!1},a=this._range||this,r=iu(n,a);return t.bounds==="ticks"&&ha(r,this,"value"),t.reverse?(r.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),r}configure(){const t=this.ticks;let e=this.min,s=this.max;if(super.configure(),this.options.offset&&t.length){const n=(s-e)/Math.max(t.length-1,1)/2;e-=n,s+=n}this._startValue=e,this._endValue=s,this._valueRange=s-e}getLabelForValue(t){return Ie(t,this.chart.options.locale,this.options.ticks.format)}}class Ui extends ui{determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=U(t)?t:0,this.max=U(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,s=ct(this.options.ticks.minRotation),n=(t?Math.sin(s):Math.cos(s))||.001,a=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,a.lineHeight/n))}getPixelForValue(t){return t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}E(Ui,"id","linear"),E(Ui,"defaults",{ticks:{callback:hi.formatters.numeric}});const Te=i=>Math.floor(Lt(i)),Ht=(i,t)=>Math.pow(10,Te(i)+t);function Kn(i){return i/Math.pow(10,Te(i))===1}function Jn(i,t,e){const s=Math.pow(10,e),n=Math.floor(i/s);return Math.ceil(t/s)-n}function su(i,t){const e=t-i;let s=Te(e);for(;Jn(i,t,s)>10;)s++;for(;Jn(i,t,s)<10;)s--;return Math.min(s,Te(i))}function nu(i,{min:t,max:e}){t=at(i.min,t);const s=[],n=Te(t);let a=su(t,e),r=a<0?Math.pow(10,Math.abs(a)):1;const o=Math.pow(10,a),l=n>a?Math.pow(10,n):0,c=Math.round((t-l)*r)/r,d=Math.floor((t-l)/o/10)*o*10;let u=Math.floor((c-d)/Math.pow(10,a)),p=at(i.min,Math.round((l+d+u*Math.pow(10,a))*r)/r);for(;p<e;)s.push({value:p,major:Kn(p),significand:u}),u>=10?u=u<15?15:20:u++,u>=20&&(a++,u=2,r=a>=0?1:r),p=Math.round((l+d+u*Math.pow(10,a))*r)/r;const h=at(i.max,p);return s.push({value:h,major:Kn(h),significand:u}),s}class qi extends Kt{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const s=ui.prototype.parse.apply(this,[t,e]);if(s===0){this._zero=!0;return}return U(s)&&s>0?s:null}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=U(t)?Math.max(0,t):null,this.max=U(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!U(this._userMin)&&(this.min=t===Ht(this.min,0)?Ht(this.min,-1):Ht(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let s=this.min,n=this.max;const a=o=>s=t?s:o,r=o=>n=e?n:o;s===n&&(s<=0?(a(1),r(10)):(a(Ht(s,-1)),r(Ht(n,1)))),s<=0&&a(Ht(n,-1)),n<=0&&r(Ht(s,1)),this.min=s,this.max=n}buildTicks(){const t=this.options,e={min:this._userMin,max:this._userMax},s=nu(e,this);return t.bounds==="ticks"&&ha(s,this,"value"),t.reverse?(s.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),s}getLabelForValue(t){return t===void 0?"0":Ie(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=Lt(t),this._valueRange=Lt(this.max)-Lt(t)}getPixelForValue(t){return(t===void 0||t===0)&&(t=this.min),t===null||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(Lt(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}E(qi,"id","logarithmic"),E(qi,"defaults",{ticks:{callback:hi.formatters.logarithmic,major:{enabled:!0}}});function Yi(i){const t=i.ticks;if(t.display&&i.display){const e=tt(t.backdropPadding);return I(t.font&&t.font.size,V.font.size)+e.height}return 0}function au(i,t,e){return e=z(e)?e:[e],{w:uo(i,t.string,e),h:e.length*t.lineHeight}}function Qn(i,t,e,s,n){return i===s||i===n?{start:t-e/2,end:t+e/2}:i<s||i>n?{start:t-e,end:t}:{start:t,end:t+e}}function ru(i){const t={l:i.left+i._padding.left,r:i.right-i._padding.right,t:i.top+i._padding.top,b:i.bottom-i._padding.bottom},e=Object.assign({},t),s=[],n=[],a=i._pointLabels.length,r=i.options.pointLabels,o=r.centerPointLabels?O/a:0;for(let l=0;l<a;l++){const c=r.setContext(i.getPointLabelContext(l));n[l]=c.padding;const d=i.getPointPosition(l,i.drawingArea+n[l],o),u=G(c.font),p=au(i.ctx,u,i._pointLabels[l]);s[l]=p;const h=Q(i.getIndexAngle(l)+o),g=Math.round(Zi(h)),f=Qn(g,d.x,p.w,0,180),m=Qn(g,d.y,p.h,90,270);ou(e,t,h,f,m)}i.setCenterPoint(t.l-e.l,e.r-t.r,t.t-e.t,e.b-t.b),i._pointLabelItems=du(i,s,n)}function ou(i,t,e,s,n){const a=Math.abs(Math.sin(e)),r=Math.abs(Math.cos(e));let o=0,l=0;s.start<t.l?(o=(t.l-s.start)/a,i.l=Math.min(i.l,t.l-o)):s.end>t.r&&(o=(s.end-t.r)/a,i.r=Math.max(i.r,t.r+o)),n.start<t.t?(l=(t.t-n.start)/r,i.t=Math.min(i.t,t.t-l)):n.end>t.b&&(l=(n.end-t.b)/r,i.b=Math.max(i.b,t.b+l))}function lu(i,t,e){const s=i.drawingArea,{extra:n,additionalAngle:a,padding:r,size:o}=e,l=i.getPointPosition(t,s+n+r,a),c=Math.round(Zi(Q(l.angle+q))),d=pu(l.y,o.h,c),u=uu(c),p=hu(l.x,o.w,u);return{visible:!0,x:l.x,y:d,textAlign:u,left:p,top:d,right:p+o.w,bottom:d+o.h}}function cu(i,t){if(!t)return!0;const{left:e,top:s,right:n,bottom:a}=i;return!(St({x:e,y:s},t)||St({x:e,y:a},t)||St({x:n,y:s},t)||St({x:n,y:a},t))}function du(i,t,e){const s=[],n=i._pointLabels.length,a=i.options,{centerPointLabels:r,display:o}=a.pointLabels,l={extra:Yi(a)/2,additionalAngle:r?O/n:0};let c;for(let d=0;d<n;d++){l.padding=e[d],l.size=t[d];const u=lu(i,d,l);s.push(u),o==="auto"&&(u.visible=cu(u,c),u.visible&&(c=u))}return s}function uu(i){return i===0||i===180?"center":i<180?"left":"right"}function hu(i,t,e){return e==="right"?i-=t:e==="center"&&(i-=t/2),i}function pu(i,t,e){return e===90||e===270?i-=t/2:(e>270||e<90)&&(i-=t),i}function fu(i,t,e){const{left:s,top:n,right:a,bottom:r}=e,{backdropColor:o}=t;if(!P(o)){const l=qt(t.borderRadius),c=tt(t.backdropPadding);i.fillStyle=o;const d=s-c.left,u=n-c.top,p=a-s+c.width,h=r-n+c.height;Object.values(l).some(g=>g!==0)?(i.beginPath(),Ee(i,{x:d,y:u,w:p,h,radius:l}),i.fill()):i.fillRect(d,u,p,h)}}function gu(i,t){const{ctx:e,options:{pointLabels:s}}=i;for(let n=t-1;n>=0;n--){const a=i._pointLabelItems[n];if(!a.visible)continue;const r=s.setContext(i.getPointLabelContext(n));fu(e,r,a);const o=G(r.font),{x:l,y:c,textAlign:d}=a;Gt(e,i._pointLabels[n],l,c+o.lineHeight/2,o,{color:r.color,textAlign:d,textBaseline:"middle"})}}function sr(i,t,e,s){const{ctx:n}=i;if(e)n.arc(i.xCenter,i.yCenter,t,0,$);else{let a=i.getPointPosition(0,t);n.moveTo(a.x,a.y);for(let r=1;r<s;r++)a=i.getPointPosition(r,t),n.lineTo(a.x,a.y)}}function mu(i,t,e,s,n){const a=i.ctx,r=t.circular,{color:o,lineWidth:l}=t;!r&&!s||!o||!l||e<0||(a.save(),a.strokeStyle=o,a.lineWidth=l,a.setLineDash(n.dash||[]),a.lineDashOffset=n.dashOffset,a.beginPath(),sr(i,e,r,s),a.closePath(),a.stroke(),a.restore())}function xu(i,t,e){return Bt(i,{label:e,index:t,type:"pointLabel"})}class me extends ui{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=tt(Yi(this.options)/2),e=this.width=this.maxWidth-t.width,s=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+s/2+t.top),this.drawingArea=Math.floor(Math.min(e,s)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=U(t)&&!isNaN(t)?t:0,this.max=U(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Yi(this.options))}generateTickLabels(t){ui.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map((e,s)=>{const n=N(this.options.pointLabels.callback,[e,s],this);return n||n===0?n:""}).filter((e,s)=>this.chart.getDataVisibility(s))}fit(){const t=this.options;t.display&&t.pointLabels.display?ru(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,s,n){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((s-n)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,s,n))}getIndexAngle(t){const e=$/(this._pointLabels.length||1),s=this.options.startAngle||0;return Q(t*e+ct(s))}getDistanceFromCenterForValue(t){if(P(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(P(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const s=e[t];return xu(this.getContext(),t,s)}}getPointPosition(t,e,s=0){const n=this.getIndexAngle(t)-q+s;return{x:Math.cos(n)*e+this.xCenter,y:Math.sin(n)*e+this.yCenter,angle:n}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:s,right:n,bottom:a}=this._pointLabelItems[t];return{left:e,top:s,right:n,bottom:a}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const s=this.ctx;s.save(),s.beginPath(),sr(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),s.closePath(),s.fillStyle=t,s.fill(),s.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:s,grid:n,border:a}=e,r=this._pointLabels.length;let o,l,c;if(e.pointLabels.display&&gu(this,r),n.display&&this.ticks.forEach((d,u)=>{if(u!==0||u===0&&this.min<0){l=this.getDistanceFromCenterForValue(d.value);const p=this.getContext(u),h=n.setContext(p),g=a.setContext(p);mu(this,h,l,r,g)}}),s.display){for(t.save(),o=r-1;o>=0;o--){const d=s.setContext(this.getPointLabelContext(o)),{color:u,lineWidth:p}=d;!p||!u||(t.lineWidth=p,t.strokeStyle=u,t.setLineDash(d.borderDash),t.lineDashOffset=d.borderDashOffset,l=this.getDistanceFromCenterForValue(e.reverse?this.min:this.max),c=this.getPointPosition(o,l),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(c.x,c.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,s=e.ticks;if(!s.display)return;const n=this.getIndexAngle(0);let a,r;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(n),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach((o,l)=>{if(l===0&&this.min>=0&&!e.reverse)return;const c=s.setContext(this.getContext(l)),d=G(c.font);if(a=this.getDistanceFromCenterForValue(this.ticks[l].value),c.showLabelBackdrop){t.font=d.string,r=t.measureText(o.label).width,t.fillStyle=c.backdropColor;const u=tt(c.backdropPadding);t.fillRect(-r/2-u.left,-a-d.size/2-u.top,r+u.width,d.size+u.height)}Gt(t,o.label,0,-a,d,{color:c.color,strokeColor:c.textStrokeColor,strokeWidth:c.textStrokeWidth})}),t.restore()}drawTitle(){}}E(me,"id","radialLinear"),E(me,"defaults",{display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:hi.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback(t){return t},padding:5,centerPointLabels:!1}}),E(me,"defaultRoutes",{"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"}),E(me,"descriptors",{angleLines:{_fallback:"grid"}});const bi={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},nt=Object.keys(bi);function Zn(i,t){return i-t}function ta(i,t){if(P(t))return null;const e=i._adapter,{parser:s,round:n,isoWeekday:a}=i._parseOpts;let r=t;return typeof s=="function"&&(r=s(r)),U(r)||(r=typeof s=="string"?e.parse(r,s):e.parse(r)),r===null?null:(n&&(r=n==="week"&&(ee(a)||a===!0)?e.startOf(r,"isoWeek",a):e.startOf(r,n)),+r)}function ea(i,t,e,s){const n=nt.length;for(let a=nt.indexOf(i);a<n-1;++a){const r=bi[nt[a]],o=r.steps?r.steps:Number.MAX_SAFE_INTEGER;if(r.common&&Math.ceil((e-t)/(o*r.size))<=s)return nt[a]}return nt[n-1]}function bu(i,t,e,s,n){for(let a=nt.length-1;a>=nt.indexOf(e);a--){const r=nt[a];if(bi[r].common&&i._adapter.diff(n,s,r)>=t-1)return r}return nt[e?nt.indexOf(e):0]}function yu(i){for(let t=nt.indexOf(i)+1,e=nt.length;t<e;++t)if(bi[nt[t]].common)return nt[t]}function ia(i,t,e){if(!e)i[t]=!0;else if(e.length){const{lo:s,hi:n}=ts(e,t),a=e[s]>=t?e[s]:e[n];i[a]=!0}}function vu(i,t,e,s){const n=i._adapter,a=+n.startOf(t[0].value,s),r=t[t.length-1].value;let o,l;for(o=a;o<=r;o=+n.add(o,1,s))l=e[o],l>=0&&(t[l].major=!0);return t}function sa(i,t,e){const s=[],n={},a=t.length;let r,o;for(r=0;r<a;++r)o=t[r],n[o]=r,s.push({value:o,major:!1});return a===0||!e?s:vu(i,s,n,e)}class De extends Kt{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const s=t.time||(t.time={}),n=this._adapter=new Tl._date(t.adapters.date);n.init(e),xe(s.displayFormats,n.formats()),this._parseOpts={parser:s.parser,round:s.round,isoWeekday:s.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return t===void 0?null:ta(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,s=t.time.unit||"day";let{min:n,max:a,minDefined:r,maxDefined:o}=this.getUserBounds();function l(c){!r&&!isNaN(c.min)&&(n=Math.min(n,c.min)),!o&&!isNaN(c.max)&&(a=Math.max(a,c.max))}(!r||!o)&&(l(this._getLabelBounds()),(t.bounds!=="ticks"||t.ticks.source!=="labels")&&l(this.getMinMax(!1))),n=U(n)&&!isNaN(n)?n:+e.startOf(Date.now(),s),a=U(a)&&!isNaN(a)?a:+e.endOf(Date.now(),s)+1,this.min=Math.min(n,a-1),this.max=Math.max(n+1,a)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],s=t[t.length-1]),{min:e,max:s}}buildTicks(){const t=this.options,e=t.time,s=t.ticks,n=s.source==="labels"?this.getLabelTimestamps():this._generate();t.bounds==="ticks"&&n.length&&(this.min=this._userMin||n[0],this.max=this._userMax||n[n.length-1]);const a=this.min,r=this.max,o=Jr(n,a,r);return this._unit=e.unit||(s.autoSkip?ea(e.minUnit,this.min,this.max,this._getLabelCapacity(a)):bu(this,o.length,e.minUnit,this.min,this.max)),this._majorUnit=!s.major.enabled||this._unit==="year"?void 0:yu(this._unit),this.initOffsets(n),t.reverse&&o.reverse(),sa(this,o,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map(t=>+t.value))}initOffsets(t=[]){let e=0,s=0,n,a;this.options.offset&&t.length&&(n=this.getDecimalForValue(t[0]),t.length===1?e=1-n:e=(this.getDecimalForValue(t[1])-n)/2,a=this.getDecimalForValue(t[t.length-1]),t.length===1?s=a:s=(a-this.getDecimalForValue(t[t.length-2]))/2);const r=t.length<3?.5:.25;e=K(e,0,r),s=K(s,0,r),this._offsets={start:e,end:s,factor:1/(e+1+s)}}_generate(){const t=this._adapter,e=this.min,s=this.max,n=this.options,a=n.time,r=a.unit||ea(a.minUnit,e,s,this._getLabelCapacity(e)),o=I(n.ticks.stepSize,1),l=r==="week"?a.isoWeekday:!1,c=ee(l)||l===!0,d={};let u=e,p,h;if(c&&(u=+t.startOf(u,"isoWeek",l)),u=+t.startOf(u,c?"day":r),t.diff(s,e,r)>1e5*o)throw new Error(e+" and "+s+" are too far apart with stepSize of "+o+" "+r);const g=n.ticks.source==="data"&&this.getDataTimestamps();for(p=u,h=0;p<s;p=+t.add(p,o,r),h++)ia(d,p,g);return(p===s||n.bounds==="ticks"||h===1)&&ia(d,p,g),Object.keys(d).sort(Zn).map(f=>+f)}getLabelForValue(t){const e=this._adapter,s=this.options.time;return s.tooltipFormat?e.format(t,s.tooltipFormat):e.format(t,s.displayFormats.datetime)}format(t,e){const n=this.options.time.displayFormats,a=this._unit,r=e||n[a];return this._adapter.format(t,r)}_tickFormatFunction(t,e,s,n){const a=this.options,r=a.ticks.callback;if(r)return N(r,[t,e,s],this);const o=a.time.displayFormats,l=this._unit,c=this._majorUnit,d=l&&o[l],u=c&&o[c],p=s[e],h=c&&u&&p&&p.major;return this._adapter.format(t,n||(h?u:d))}generateTickLabels(t){let e,s,n;for(e=0,s=t.length;e<s;++e)n=t[e],n.label=this._tickFormatFunction(n.value,e,t)}getDecimalForValue(t){return t===null?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,s=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+s)*e.factor)}getValueForPixel(t){const e=this._offsets,s=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+s*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,s=this.ctx.measureText(t).width,n=ct(this.isHorizontal()?e.maxRotation:e.minRotation),a=Math.cos(n),r=Math.sin(n),o=this._resolveTickFontOptions(0).size;return{w:s*a+o*r,h:s*r+o*a}}_getLabelCapacity(t){const e=this.options.time,s=e.displayFormats,n=s[e.unit]||s.millisecond,a=this._tickFormatFunction(t,0,sa(this,[t],this._majorUnit),n),r=this._getLabelSize(a),o=Math.floor(this.isHorizontal()?this.width/r.w:this.height/r.h)-1;return o>0?o:1}getDataTimestamps(){let t=this._cache.data||[],e,s;if(t.length)return t;const n=this.getMatchingVisibleMetas();if(this._normalized&&n.length)return this._cache.data=n[0].controller.getAllParsedValues(this);for(e=0,s=n.length;e<s;++e)t=t.concat(n[e].controller.getAllParsedValues(this));return this._cache.data=this.normalize(t)}getLabelTimestamps(){const t=this._cache.labels||[];let e,s;if(t.length)return t;const n=this.getLabels();for(e=0,s=n.length;e<s;++e)t.push(ta(this,n[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return ga(t.sort(Zn))}}E(De,"id","time"),E(De,"defaults",{bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}});function Ue(i,t,e){let s=0,n=i.length-1,a,r,o,l;e?(t>=i[s].pos&&t<=i[n].pos&&({lo:s,hi:n}=_t(i,"pos",t)),{pos:a,time:o}=i[s],{pos:r,time:l}=i[n]):(t>=i[s].time&&t<=i[n].time&&({lo:s,hi:n}=_t(i,"time",t)),{time:a,pos:o}=i[s],{time:r,pos:l}=i[n]);const c=r-a;return c?o+(l-o)*(t-a)/c:o}class Xi extends De{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=Ue(e,this.min),this._tableRange=Ue(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:s}=this,n=[],a=[];let r,o,l,c,d;for(r=0,o=t.length;r<o;++r)c=t[r],c>=e&&c<=s&&n.push(c);if(n.length<2)return[{time:e,pos:0},{time:s,pos:1}];for(r=0,o=n.length;r<o;++r)d=n[r+1],l=n[r-1],c=n[r],Math.round((d+l)/2)!==c&&a.push({time:c,pos:r/(o-1)});return a}_generate(){const t=this.min,e=this.max;let s=super.getDataTimestamps();return(!s.includes(t)||!s.length)&&s.splice(0,0,t),(!s.includes(e)||s.length===1)&&s.push(e),s.sort((n,a)=>n-a)}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),s=this.getLabelTimestamps();return e.length&&s.length?t=this.normalize(e.concat(s)):t=e.length?e:s,t=this._cache.all=t,t}getDecimalForValue(t){return(Ue(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,s=this.getDecimalForPixel(t)/e.factor-e.end;return Ue(this._table,s*this._tableRange+this._minPos,!0)}}E(Xi,"id","timeseries"),E(Xi,"defaults",De.defaults);var wu=Object.freeze({__proto__:null,CategoryScale:Wi,LinearScale:Ui,LogarithmicScale:qi,RadialLinearScale:me,TimeScale:De,TimeSeriesScale:Xi});const ku=[Ll,sd,Qd,wu];rt.register(...ku);const qe={render:()=>`
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
  `,init:()=>{let i={};const t=async()=>{const a=document.getElementById("filterFrom").value,r=document.getElementById("filterTo").value,o=document.getElementById("analyticsContent"),l=document.getElementById("loadingState");o.classList.add("hidden"),l.classList.remove("hidden");try{const c={};a&&(c.from=new Date(a+"T00:00:00").toISOString()),r&&(c.to=new Date(r+"T23:59:59").toISOString());const d=await D.getAnalyticsSummary(c),u=d.volume.submissionCount,p=(d.volume.approvalRate*100).toFixed(1),h=d.responseTime.averageResponseTime.toFixed(1),g=d.cycleTime.averageCycleTime.toFixed(1);document.getElementById("totalSubmissions").textContent=u,document.getElementById("approvalRate").textContent=p+"%",document.getElementById("avgResponseTime").textContent=h,document.getElementById("avgCycleTime").textContent=g,setTimeout(()=>{document.getElementById("submissionsBar").style.width=Math.min(100,u/200*100)+"%",document.getElementById("approvalBar").style.width=p+"%"},100),Object.values(i).forEach(y=>y.destroy()),i={};const f={font:{family:"'Inter', sans-serif",weight:"700"},color:"#9ca3af"};rt.defaults.font=f.font,rt.defaults.color=f.color;const m=document.getElementById("volumeByDayChart").getContext("2d");i.volumeByDay=new rt(m,{type:"line",data:{labels:d.volume.byDay.map(y=>new Date(y.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})),datasets:[{label:"Submissions",data:d.volume.byDay.map(y=>y.count),borderColor:"#005825",backgroundColor:"rgba(0,88,37,0.08)",tension:.4,fill:!0,pointBackgroundColor:"#005825",pointRadius:4,pointHoverRadius:6,borderWidth:2.5}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},border:{display:!1}},y:{grid:{color:"rgba(0,0,0,0.04)"},border:{display:!1},ticks:{stepSize:1}}}}});const x=document.getElementById("submissionStatusChart").getContext("2d");i.status=new rt(x,{type:"doughnut",data:{labels:["Approved","Rejected","Pending","Cancelled"],datasets:[{data:[d.volume.approvedCount,d.volume.rejectedCount,d.volume.pendingCount,d.volume.cancelledCount],backgroundColor:["#005825","#ef4444","#f59e0b","#9ca3af"],borderWidth:0,hoverOffset:6}]},options:{responsive:!0,cutout:"72%",plugins:{legend:{display:!1}}}});const b=document.getElementById("volumeByProcessChart").getContext("2d");i.process=new rt(b,{type:"bar",data:{labels:d.volume.byProcess.map(y=>y.processName),datasets:[{label:"Approved",data:d.volume.byProcess.map(y=>y.approved),backgroundColor:"#005825",borderRadius:4},{label:"Rejected",data:d.volume.byProcess.map(y=>y.rejected),backgroundColor:"#ef4444",borderRadius:4},{label:"Pending / Other",data:d.volume.byProcess.map(y=>y.total-y.approved-y.rejected),backgroundColor:"#f59e0b",borderRadius:4}]},options:{responsive:!0,plugins:{legend:{position:"top",labels:{usePointStyle:!0,pointStyle:"circle",padding:20,font:{size:11,weight:"700"}}}},scales:{x:{stacked:!0,grid:{display:!1},border:{display:!1}},y:{stacked:!0,grid:{color:"rgba(0,0,0,0.04)"},border:{display:!1}}}}}),l.classList.add("hidden"),o.classList.remove("hidden")}catch(c){console.error("Failed to load analytics",c);const d=document.getElementById("loadingState");d.innerHTML='<div class="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center text-3xl mb-6 mx-auto"><i class="fa-solid fa-triangle-exclamation"></i></div><h3 class="text-[22px] font-black text-gray-900 tracking-tight mb-2">Analytics Unavailable</h3><p class="text-[14px] text-gray-400 font-medium italic max-w-sm mx-auto">'+(c.message||"Unable to retrieve analytics data. Please try again.")+'</p><button onclick="window.location.reload()" class="mt-8 ui-button-soft px-8 py-3 rounded-xl text-[13px]"><i class="fa-solid fa-rotate-right"></i> Retry</button>'}},e=new Date,s=new Date(e);s.setDate(s.getDate()-30);const n=a=>{const r=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),l=String(a.getDate()).padStart(2,"0");return r+"-"+o+"-"+l};document.getElementById("filterFrom").value=n(s),document.getElementById("filterTo").value=n(e),document.getElementById("applyFiltersBtn").addEventListener("click",t),t()}},na=[{path:"/",view:()=>'<div class="p-8">Redirecting...</div>',init:()=>{window.location.hash="/home"}},{path:"/login",view:gs.render,init:gs.init,protected:!1},{path:"/register",view:Ss.render,init:Ss.init,protected:!1},{path:"/forgot-password",view:Ms.render,init:Ms.init,protected:!1},{path:"/reset-password",view:Es.render,init:Es.init,protected:!1},{path:"/home",view:i=>ii()>=2?qe.render(i):xs.render(i),init:i=>{ii()>=2?qe.init(i):xs.init(i)},protected:!0,layout:it},{path:"/status",view:As.render,init:As.init,protected:!0,layout:it},{path:"/track/:id",view:Bs.render,init:Bs.init,protected:!0,layout:it},{path:"/submission/new",view:ps.render,init:ps.init,protected:!0,layout:it},{path:"/review",view:bs.render,init:bs.init,protected:!0,layout:it},{path:"/review/:id",view:vs.render,init:vs.init,protected:!0,layout:it},{path:"/admin/documents",view:ws.render,init:ws.init,protected:!0,layout:it},{path:"/admin/documents/:id",view:fs.render,init:fs.init,protected:!0,layout:it},{path:"/admin/reviewers",view:ks.render,init:ks.init,protected:!0,layout:it},{path:"/admin/analytics",view:qe.render,init:qe.init,protected:!0,layout:it},{path:"/admin/logs",view:Ls.render,init:Ls.init,protected:!0,layout:it},{path:"/admin/departments",view:Ts.render,init:Ts.init,protected:!0,layout:it},{path:"/admin/departments/:id",view:Ds.render,init:Ds.init,protected:!0,layout:it},{path:"/settings",view:_s.render,init:_s.init,protected:!0,layout:it}];function _u(){window.addEventListener("hashchange",aa),window.addEventListener("load",aa)}function lt(i){window.location.hash=i}async function aa(){const i=window.location.hash.slice(1)||"/",t=document.getElementById("root");let e=null,s={};for(const n of na){const a=n.path.split("/"),r=i.split("?")[0].split("/");if(a.length===r.length){let o=!0;for(let l=0;l<a.length;l++)if(a[l].startsWith(":"))s[a[l].slice(1)]=r[l];else if(a[l]!==r[l]){o=!1;break}if(o){e=n;break}}}if(e||(e=na.find(n=>n.path==="/")),e.protected&&!rr())return lt("/login");e.layout?t.innerHTML=e.layout(e.view(s)):t.innerHTML=e.view(s),typeof e.init=="function"&&setTimeout(()=>{e.init(s)},0)}document.querySelector("#app").innerHTML=`
  <div id="root" class="h-full w-full flex flex-col bg-gray-50 overflow-y-auto"></div>
`;_u();
