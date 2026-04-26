import { api } from '../api/client.js';
import Chart from 'chart.js/auto';

export const AdministratorAnalytics = {
  render: () => `
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
  `,

  init: () => {
    let charts = {};

    const loadData = async () => {
      const from = document.getElementById('filterFrom').value;
      const to = document.getElementById('filterTo').value;

      const content = document.getElementById('analyticsContent');
      const loading = document.getElementById('loadingState');

      content.classList.add('hidden');
      loading.classList.remove('hidden');

      try {
        const filters = {};
        if (from) filters.from = new Date(from + 'T00:00:00').toISOString();
        if (to) filters.to = new Date(to + 'T23:59:59').toISOString();

        const summary = await api.getAnalyticsSummary(filters);

        // Update KPI cards
        const subCount = summary.volume.submissionCount;
        const approvalPct = (summary.volume.approvalRate * 100).toFixed(1);
        const avgResp = summary.responseTime.averageResponseTime.toFixed(1);
        const avgCycle = summary.cycleTime.averageCycleTime.toFixed(1);

        document.getElementById('totalSubmissions').textContent = subCount;
        document.getElementById('approvalRate').textContent = approvalPct + '%';
        document.getElementById('avgResponseTime').textContent = avgResp;
        document.getElementById('avgCycleTime').textContent = avgCycle;

        // Animate progress bars
        setTimeout(() => {
          document.getElementById('submissionsBar').style.width = Math.min(100, (subCount / 200) * 100) + '%';
          document.getElementById('approvalBar').style.width = approvalPct + '%';
        }, 100);

        // Destroy old charts before re-rendering
        Object.values(charts).forEach(c => c.destroy());
        charts = {};

        const chartDefaults = {
          font: { family: "'Inter', sans-serif", weight: '700' },
          color: '#9ca3af'
        };
        Chart.defaults.font = chartDefaults.font;
        Chart.defaults.color = chartDefaults.color;

        // Volume by Day (Line)
        const dayCtx = document.getElementById('volumeByDayChart').getContext('2d');
        charts.volumeByDay = new Chart(dayCtx, {
          type: 'line',
          data: {
            labels: summary.volume.byDay.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
              label: 'Submissions',
              data: summary.volume.byDay.map(d => d.count),
              borderColor: '#005825',
              backgroundColor: 'rgba(0,88,37,0.08)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#005825',
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 2.5
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, border: { display: false } },
              y: { grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { stepSize: 1 } }
            }
          }
        });

        // Status Doughnut
        const statusCtx = document.getElementById('submissionStatusChart').getContext('2d');
        charts.status = new Chart(statusCtx, {
          type: 'doughnut',
          data: {
            labels: ['Approved', 'Rejected', 'Pending', 'Cancelled'],
            datasets: [{
              data: [
                summary.volume.approvedCount,
                summary.volume.rejectedCount,
                summary.volume.pendingCount,
                summary.volume.cancelledCount
              ],
              backgroundColor: ['#005825', '#ef4444', '#f59e0b', '#9ca3af'],
              borderWidth: 0,
              hoverOffset: 6
            }]
          },
          options: {
            responsive: true,
            cutout: '72%',
            plugins: { legend: { display: false } }
          }
        });

        // Volume by Process (Stacked Bar)
        const processCtx = document.getElementById('volumeByProcessChart').getContext('2d');
        charts.process = new Chart(processCtx, {
          type: 'bar',
          data: {
            labels: summary.volume.byProcess.map(p => p.processName),
            datasets: [
              {
                label: 'Approved',
                data: summary.volume.byProcess.map(p => p.approved),
                backgroundColor: '#005825',
                borderRadius: 4
              },
              {
                label: 'Rejected',
                data: summary.volume.byProcess.map(p => p.rejected),
                backgroundColor: '#ef4444',
                borderRadius: 4
              },
              {
                label: 'Pending / Other',
                data: summary.volume.byProcess.map(p => p.total - p.approved - p.rejected),
                backgroundColor: '#f59e0b',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 11, weight: '700' } }
              }
            },
            scales: {
              x: { stacked: true, grid: { display: false }, border: { display: false } },
              y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }
            }
          }
        });

        loading.classList.add('hidden');
        content.classList.remove('hidden');

      } catch (error) {
        console.error('Failed to load analytics', error);
        const loading = document.getElementById('loadingState');
        loading.innerHTML = '<div class="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center text-3xl mb-6 mx-auto"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
          '<h3 class="text-[22px] font-black text-gray-900 tracking-tight mb-2">Analytics Unavailable</h3>' +
          '<p class="text-[14px] text-gray-400 font-medium italic max-w-sm mx-auto">' + (error.message || 'Unable to retrieve analytics data. Please try again.') + '</p>' +
          '<button onclick="window.location.reload()" class="mt-8 ui-button-soft px-8 py-3 rounded-xl text-[13px]"><i class="fa-solid fa-rotate-right"></i> Retry</button>';
      }
    };

    // Set default date range: last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const toLocalDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    };

    document.getElementById('filterFrom').value = toLocalDate(thirtyDaysAgo);
    document.getElementById('filterTo').value = toLocalDate(today);

    document.getElementById('applyFiltersBtn').addEventListener('click', loadData);

    loadData();
  }
};
