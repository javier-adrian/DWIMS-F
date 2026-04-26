# DWIMS Backend Integration Guide

The frontend is now in a "Production Ready" state for backend integration. All mock data, demo accounts, and simulation logic have been removed.

## 🛠 Key Files for Integration

### 1. API Client (`api/client.js`)
- **Location**: `src/api/client.js` and `backend/src/api/client.js`
- **Purpose**: Centralizes all `fetch` logic.
- **Integration tasks**:
    - Update `BASE_URL` to point to your API.
    - The `api` object contains ready-to-use functions for all modules (Authentication, Submissions, Management, Analytics).
    - Authentication is handled via Bearer tokens in `localStorage`.

### 2. Role-Based Navigation (`components/Layout.js`)
- **Logic**: Uses `getCurrentUserHighestRole()` from the API client.
- **Mapping**:
    - `0`: Submitter
    - `1`: Reviewer
    - `2`: Administrator (Analytics visible)
    - `3`: SuperAdministrator (System Admin visible)

### 3. Analytics (`AdministratorAnalytics.js`)
- **Integration**: Expects data from `/analytics/summary`.
- **Chart.js**: Fully configured to render the provided JSON response format.

## 🎨 Design System
- **Colors**: Deep Institutional Green (`#005825`) and Dark Yellow (`#A17A00`) accents.
- **Framework**: Tailwind CSS (Configuration in `tailwind.config.js`).
- **Icons**: FontAwesome 6 Pro (linked via CDN in `index.html`).

## 🚀 Deployment / Handover
The `backend/src` folder contains the identical UI/UX refinements applied during this session, optimized for immediate inclusion into the backend architecture.
