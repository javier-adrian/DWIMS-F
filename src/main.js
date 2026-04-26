import './style.css';
import { initRouter } from './router/index.js';

document.querySelector('#app').innerHTML = `
  <div id="root" class="h-full w-full flex flex-col bg-gray-50 overflow-y-auto"></div>
`;

// Initialize the vanilla JS router
initRouter();
