import { renderSidebar } from '../components/layout/app-sidebar.js';
import { renderTopbar } from '../components/layout/app-topbar.js';
import { renderPageContainer } from '../components/layout/app-page-container.js';
import { renderPageLoader } from '../components/feedback/app-spinner.js';

export function renderAppLayout() {
  const app = document.getElementById('app');
  if (!app) return null;

  app.innerHTML = '';

  const sidebar = renderSidebar();
  const topbar = renderTopbar();
  const content = renderPageContainer();
  const loader = renderPageLoader();

  const wrapper = document.createElement('div');
  wrapper.className = 'app-wrapper';
  wrapper.appendChild(topbar);
  wrapper.appendChild(content);
  wrapper.appendChild(loader);

  app.appendChild(sidebar);
  app.appendChild(wrapper);

  return content;
}
