import { routes } from '../routes.js';
import { isAuthenticated } from '../api/client.js';

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
}

export function navigateTo(path) {
  window.location.hash = path;
}

async function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const root = document.getElementById('root');
  
  // Find matching route
  let matchedRoute = null;
  let params = {};
  
  for (const route of routes) {
    const routeParts = route.path.split('/');
    const hashParts = hash.split('?')[0].split('/'); // ignoring query params for now
    
    if (routeParts.length === hashParts.length) {
      let isMatch = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = hashParts[i];
        } else if (routeParts[i] !== hashParts[i]) {
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) {
        matchedRoute = route;
        break;
      }
    }
  }

  if (!matchedRoute) {
    matchedRoute = routes.find(r => r.path === '/'); // fallback
  }

  // Check authentication if needed
  if (matchedRoute.protected && !isAuthenticated()) {
    return navigateTo('/login');
  }

  // Render view
  if (matchedRoute.layout) {
    root.innerHTML = matchedRoute.layout(matchedRoute.view(params));
  } else {
    root.innerHTML = matchedRoute.view(params);
  }

  // Initialize view scripts
  if (typeof matchedRoute.init === 'function') {
    setTimeout(() => {
      matchedRoute.init(params);
    }, 0);
  }
}
