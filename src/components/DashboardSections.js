/**
 * Reusable functional components for the DWIMS Dashboard.
 * These are injected based on the user's current role.
 */

export const DashboardSections = {

    /**
     * Compact notification list for Submitters and Staff.
     */
    NotificationWidget: () => `
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
  `,

    /**
     * Visual KPI indicator for Admins/SuperAdmins.
     */
    EfficiencyMetric: (title, value, unit, icon, colorClass) => `
    <div class="ui-card p-8 group hover:shadow-xl transition-all duration-500">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-2xl ${colorClass}/10 flex items-center justify-center ${colorClass} text-xl shadow-inner group-hover:rotate-6 transition-all">
          <i class="fa-solid ${icon}"></i>
        </div>
        <h3 class="text-[13px] font-black text-gray-400 uppercase tracking-[2px] leading-tight">${title}</h3>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-[34px] font-black text-gray-900 tracking-tighter">${value}</span>
        <span class="text-[14px] font-black text-gray-400 uppercase tracking-widest">${unit}</span>
      </div>
      <div class="mt-6 flex flex-col gap-2">
        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1">
          <span class="text-gray-400 italic">Target threshold</span>
          <span class="text-primary">${value > 24 ? 'Over' : 'Normal'}</span>
        </div>
        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div class="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(11,93,59,0.3)] transition-all duration-1000" style="width: ${Math.min(100, (value / 30) * 100)}%"></div>
        </div>
      </div>
    </div>
  `,

    /**
     * Action grid for quick tasks.
     */
    QuickActions: (actions = []) => `
    <div class="grid grid-cols-2 gap-4">
      ${actions.map(a => `
        <a href="${a.link}" class="group ui-card p-6 hover:bg-primary transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 text-center">
          <div class="w-12 h-12 rounded-full bg-primary/5 group-hover:bg-white/20 flex items-center justify-center text-primary group-hover:text-white text-xl transition-all">
            <i class="fa-solid ${a.icon}"></i>
          </div>
          <span class="text-[12px] font-black text-gray-800 group-hover:text-white uppercase tracking-widest leading-none">${a.title}</span>
        </a>
      `).join('')}
    </div>
  `
};
