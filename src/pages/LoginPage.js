import { authService } from '../services/auth-service.js';
import { renderLoginForm, attachLoginEvents } from '../components/LoginForm.js';
import { getCurrentTheme } from '../services/theme-service.js';

function getThemeStyles() {
  const isDark = getCurrentTheme() === 'dark';
  return {
    bg: isDark ? 'background:linear-gradient(135deg,#0f172a,#1e293b)' : 'background:linear-gradient(135deg,#eff6ff,#f0fdf4)',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : '#e5e7eb',
    text: isDark ? '#f1f5f9' : '#111827',
    muted: isDark ? '#94a3b8' : '#6b7280',
  };
}

export async function init(container) {
  await authService.init();

  const s = getThemeStyles();
  const isDark = getCurrentTheme() === 'dark';

  container.innerHTML = '';
  container.style.cssText = `min-height:100vh;${s.bg};display:flex;align-items:center;justify-content:center;padding:24px`;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `width:100%;max-width:400px`;

  wrapper.innerHTML = `
    <div style="text-align:center;margin-bottom:32px">
      <div style="width:56px;height:56px;background:#2563eb;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
        <i class="bi bi-cpu" style="font-size:28px;color:#fff"></i>
      </div>
      <h1 style="font-size:22px;font-weight:700;color:${s.text};margin:0 0 4px">POS OFFLINE</h1>
      <p style="font-size:13px;color:${s.muted};margin:0">Kasir Cerdas, Usaha Maju</p>
    </div>
    <div id="login-card" style="background:${s.cardBg};border:1px solid ${s.cardBorder};border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
      <h2 style="font-size:16px;font-weight:600;color:${s.text};margin:0 0 24px;text-align:center">Masuk ke Akun Anda</h2>
      <div id="login-form-container"></div>
    </div>
  `;

  container.appendChild(wrapper);

  const formContainer = wrapper.querySelector('#login-form-container');
  const form = renderLoginForm();
  formContainer.appendChild(form);

  if (isDark) {
    document.querySelectorAll('#login-username, #login-password').forEach(el => {
      el.style.cssText += 'background:#0f172a !important;border-color:#334155 !important;color:#f1f5f9';
    });
  }

  attachLoginEvents(form, async (username, password, rememberMe) => {
    const result = await authService.login(username, password, rememberMe);
    if (result.success) {
      window.location.reload();
    } else {
      throw new Error(result.error);
    }
  });
}
