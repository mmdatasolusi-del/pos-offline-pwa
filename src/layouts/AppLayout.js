import { renderSidebar } from '../components/Sidebar.js';
import { renderTopbar } from '../components/Topbar.js';
import { initRouter } from '../router/router.js';
import { authService } from '../services/auth-service.js';
import { hasOwnerAccount } from '../auth/auth.js';
import { init as initLoginPage } from '../pages/LoginPage.js';
import { init as initFirstRunPage } from '../pages/FirstRunPage.js';
import { startIdleMonitor } from '../services/idle-service.js';

export async function renderAppLayout() {
  const app = document.getElementById('app');
  if (!app) return;

  await authService.init();

  if (!(await authService.validateSession())) {
    app.innerHTML = '';

    if (await hasOwnerAccount()) {
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
      await initLoginPage(app);
    } else {
      if (window.location.hash !== '#/first-run') {
        window.location.hash = '#/first-run';
      }
      await initFirstRunPage(app);
    }
    return;
  }

  app.innerHTML = '';

  const sidebar = renderSidebar();
  const topbar = renderTopbar();

  const main = document.createElement('main');
  main.className = 'app-content';
  main.setAttribute('role', 'main');
  main.id = 'page-content';

  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  footer.innerHTML = `
    <span>&copy; ${new Date().getFullYear()} POS Offline PWA</span>
    <span>v1.0.0</span>
  `;

  app.appendChild(sidebar);
  app.appendChild(topbar);
  app.appendChild(main);
  app.appendChild(footer);

  initRouter(main);
  startIdleMonitor();
}
