import { clearToken, getCurrentUserHighestRole } from '../api/client.js';
import { navigateTo } from '../router/index.js';

const getNavClass = (path) => {
  const currentPath = window.location.hash.slice(1);
  const isActive = currentPath === path;
  return isActive
    ? "flex items-center gap-3 px-4 py-3 text-[13px] font-black bg-[#005825] text-white rounded-xl shadow-lg shadow-green-900/20 transition-all duration-300"
    : "flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-gray-500 hover:bg-green-50 hover:text-[#005825] rounded-xl transition-all duration-300";
};

const getIconClass = (path) => {
  const currentPath = window.location.hash.slice(1);
  const isActive = currentPath === path;
  return isActive ? "text-white" : "text-gray-400 group-hover:text-[#005825]";
};

export const Layout = (content) => {
  const highestRole = getCurrentUserHighestRole();
  const isReviewerOrAdmin = highestRole >= 1;
  const isOnlyAdmin = highestRole === 2;
  const isAdminLevel = highestRole >= 2;
  const isSuperAdmin = highestRole === 3;

  return `
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
              <a href="#/home" class="${getNavClass('/home')} group">
                  <i class="fa-solid fa-house-chimney w-5 ${getIconClass('/home')} transition-transform group-hover:scale-110"></i> Dashboard
              </a>
            <a href="#/submission/new" class="${getNavClass('/submission/new')} group">
                <i class="fa-solid fa-file-circle-plus w-5 ${getIconClass('/submission/new')} transition-transform group-hover:scale-110"></i> New Submission
            </a>
            <a href="#/status" class="${getNavClass('/status')} group">
                <i class="fa-solid fa-radar w-5 ${getIconClass('/status')} transition-transform group-hover:scale-110"></i> Submission Status
            </a>
          </div>

          ${isReviewerOrAdmin ? `
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Approvals</div>
          <div class="space-y-1">
            <a href="#/review" class="${getNavClass('/review')} group">
                <i class="fa-solid fa-stamp w-5 ${getIconClass('/review')} transition-transform group-hover:scale-110"></i> Pending Approvals
            </a>
          </div>
          ` : ''}

          ${isAdminLevel ? `
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">Management</div>
          <div class="space-y-1">
            <a href="#/admin/documents" class="${getNavClass('/admin/documents')} group">
                <i class="fa-solid fa-diagram-project w-5 ${getIconClass('/admin/documents')} transition-transform group-hover:scale-110"></i> Manage Workflows
            </a>
            <a href="#/admin/reviewers" class="${getNavClass('/admin/reviewers')} group">
                <i class="fa-solid fa-user-shield w-5 ${getIconClass('/admin/reviewers')} transition-transform group-hover:scale-110"></i> User Management
            </a>
          </div>
          ` : ''}

          ${isSuperAdmin ? `
          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">System Admin</div>
          <div class="space-y-1">
            <a href="#/admin/departments" class="${getNavClass('/admin/departments')} group">
                <i class="fa-solid fa-buildings w-5 ${getIconClass('/admin/departments')} transition-transform group-hover:scale-110"></i> Departments
            </a>
            <a href="#/admin/logs" class="${getNavClass('/admin/logs')} group">
                <i class="fa-solid fa-bolt-lightning w-5 ${getIconClass('/admin/logs')} transition-transform group-hover:scale-110"></i> Activity Logs
            </a>
          </div>
          ` : ''}

          <div class="pt-6 pb-2 px-4 text-[10px] font-black text-[#A17A00] uppercase tracking-[2.5px]">General</div>
          <div class="space-y-1">
            <a href="#/settings" class="${getNavClass('/settings')} group">
                <i class="fa-solid fa-user-gear w-5 ${getIconClass('/settings')} transition-transform group-hover:scale-110"></i> 
                <span class="text-[13px] font-black tracking-tight">Account Settings</span>
            </a>
          </div>
      </nav>

      <div class="p-6">
        <div class="bg-gray-50/80 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-xl relative group/profile">
          <div class="w-9 h-9 bg-[#005825] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-green-900/20 group-hover/profile:scale-110 transition-transform">
            ${highestRole === 'superadmin' ? '3' : highestRole}
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
          ${content}
        </div>
      </main>
    </div> <!-- Ends flex-1 content area -->
  </div> <!-- Ends min-h-screen flex container -->

  <!-- GLOBAL MODAL PORTAL (Completely outside flex context to avoid Safari/iOS fixed positioning bugs) -->
  <div id="modalPortal" class="absolute inset-0 pointer-events-none z-[1000] [&>*]:pointer-events-auto"></div>

  <!-- Mobile Overlay -->
  <div id="mobileOverlay" class="hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-500 opacity-0"></div>
`;
};

window.addEventListener('click', (e) => {
  const logoutBtn = e.target.closest('#logoutBtn');
  if (logoutBtn) {
    clearToken();
    navigateTo('/login');
  }

  const mobileBtn = e.target.closest('#mobileMenuBtn');
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('mobileOverlay');

  if (mobileBtn && sidebar && overlay) {
    sidebar.classList.toggle('translate-x-0');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  }

  if (e.target === overlay && sidebar) {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
  }
});
