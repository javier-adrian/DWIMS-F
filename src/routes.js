import { Layout } from './components/Layout.js';
import { getCurrentUserHighestRole } from './api/client.js';
import { NewSubmission } from './pages/NewSubmission.js';
import { AdministratorProcessDetail } from './pages/AdministratorProcessDetail.js';
import { Login } from './pages/Login.js';
import { SubmitterHome } from './pages/SubmitterHome.js';

import { ReviewerPending } from './pages/ReviewerPending.js';
import { ReviewerDetail } from './pages/ReviewerDetail.js';
import { AdministratorDocuments } from './pages/AdministratorDocuments.js';
import { AdministratorReviewers } from './pages/AdministratorReviewers.js';
import { Settings } from './pages/Settings.js';
import { Register } from './pages/Register.js';
import { ForgotPassword } from './pages/ForgotPassword.js';
import { ResetPassword } from './pages/ResetPassword.js';
import { SuperAdminLogs } from './pages/SuperAdminLogs.js';
import { SuperAdminDepartments } from './pages/SuperAdminDepartments.js';
import { SuperAdminDepartmentDetail } from './pages/SuperAdminDepartmentDetail.js';
import { TrackPending } from './pages/TrackPending.js';
import { TrackDetail } from './pages/TrackDetail.js';
import { AdministratorAnalytics } from './pages/AdministratorAnalytics.js';

export const routes = [
  {
    path: '/', view: () => `<div class="p-8">Redirecting...</div>`, init: () => {
      window.location.hash = '/home';
    }
  },
  { path: '/login', view: Login.render, init: Login.init, protected: false },
  { path: '/register', view: Register.render, init: Register.init, protected: false },
  { path: '/forgot-password', view: ForgotPassword.render, init: ForgotPassword.init, protected: false },
  { path: '/reset-password', view: ResetPassword.render, init: ResetPassword.init, protected: false },
  {
    path: '/home',
    view: (params) => {
      const role = getCurrentUserHighestRole();
      if (role >= 2) return AdministratorAnalytics.render(params);
      return SubmitterHome.render(params);
    },
    init: (params) => {
      const role = getCurrentUserHighestRole();
      if (role >= 2) AdministratorAnalytics.init(params);
      else SubmitterHome.init(params);
    },
    protected: true,
    layout: Layout
  },
  { path: '/status', view: TrackPending.render, init: TrackPending.init, protected: true, layout: Layout },
  { path: '/track/:id', view: TrackDetail.render, init: TrackDetail.init, protected: true, layout: Layout },
  { path: '/submission/new', view: NewSubmission.render, init: NewSubmission.init, protected: true, layout: Layout },

  { path: '/review', view: ReviewerPending.render, init: ReviewerPending.init, protected: true, layout: Layout },
  { path: '/review/:id', view: ReviewerDetail.render, init: ReviewerDetail.init, protected: true, layout: Layout },
  { path: '/admin/documents', view: AdministratorDocuments.render, init: AdministratorDocuments.init, protected: true, layout: Layout },
  { path: '/admin/documents/:id', view: AdministratorProcessDetail.render, init: AdministratorProcessDetail.init, protected: true, layout: Layout },
  { path: '/admin/reviewers', view: AdministratorReviewers.render, init: AdministratorReviewers.init, protected: true, layout: Layout },
  { path: '/admin/analytics', view: AdministratorAnalytics.render, init: AdministratorAnalytics.init, protected: true, layout: Layout },
  { path: '/admin/logs', view: SuperAdminLogs.render, init: SuperAdminLogs.init, protected: true, layout: Layout },
  { path: '/admin/departments', view: SuperAdminDepartments.render, init: SuperAdminDepartments.init, protected: true, layout: Layout },
  { path: '/admin/departments/:id', view: SuperAdminDepartmentDetail.render, init: SuperAdminDepartmentDetail.init, protected: true, layout: Layout },
  { path: '/settings', view: Settings.render, init: Settings.init, protected: true, layout: Layout }
];
