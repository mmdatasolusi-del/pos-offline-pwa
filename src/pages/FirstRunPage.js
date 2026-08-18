import { getCurrentTheme } from '../services/theme-service.js';
import { createOwnerAccount } from '../auth/auth.js';
import { APP_CONFIG } from '../config/app.config.js';

function getThemeStyles() {
  const isDark = getCurrentTheme() === 'dark';
  return {
    bg: isDark ? 'background:linear-gradient(135deg,#0f172a,#1e293b)' : 'background:linear-gradient(135deg,#eff6ff,#f0fdf4)',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : '#e5e7eb',
    text: isDark ? '#f1f5f9' : '#111827',
    muted: isDark ? '#94a3b8' : '#6b7280',
    inputBg: isDark ? '#0f172a' : '#f3f4f6',
    inputBorder: isDark ? '#334155' : '#e5e7eb',
  };
}

export async function init(container) {
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
      <h1 style="font-size:22px;font-weight:700;color:${s.text};margin:0 0 4px">${APP_CONFIG.appName}</h1>
      <p style="font-size:13px;color:${s.muted};margin:0">Kasir Cerdas, Usaha Maju</p>
    </div>
    <div style="background:${s.cardBg};border:1px solid ${s.cardBorder};border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
      <h2 style="font-size:16px;font-weight:600;color:${s.text};margin:0 0 4px;text-align:center">Buat Akun Owner</h2>
      <p style="font-size:13px;color:${s.muted};margin:0 0 24px;text-align:center">Selamat datang! Buat akun pemilik pertama untuk mulai menggunakan aplikasi.</p>
      <form id="first-run-form" novalidate>
        <div class="mb-3">
          <label for="fr-fullname" class="form-label" style="font-size:14px;font-weight:500;color:${s.text}">Nama Lengkap</label>
          <input type="text" id="fr-fullname" class="form-control" placeholder="Nama pemilik toko" required autocomplete="name"
            style="background:${s.inputBg};border:1px solid ${s.inputBorder};border-radius:10px;padding:10px 14px;font-size:14px;height:44px">
        </div>
        <div class="mb-3">
          <label for="fr-username" class="form-label" style="font-size:14px;font-weight:500;color:${s.text}">Username</label>
          <input type="text" id="fr-username" class="form-control" placeholder="Masukkan username" required autocomplete="username"
            style="background:${s.inputBg};border:1px solid ${s.inputBorder};border-radius:10px;padding:10px 14px;font-size:14px;height:44px">
        </div>
        <div class="mb-3">
          <label for="fr-password" class="form-label" style="font-size:14px;font-weight:500;color:${s.text}">Password</label>
          <input type="password" id="fr-password" class="form-control" placeholder="Minimal 6 karakter" required autocomplete="new-password"
            style="background:${s.inputBg};border:1px solid ${s.inputBorder};border-radius:10px;padding:10px 14px;font-size:14px;height:44px">
        </div>
        <div class="mb-3">
          <label for="fr-password2" class="form-label" style="font-size:14px;font-weight:500;color:${s.text}">Konfirmasi Password</label>
          <input type="password" id="fr-password2" class="form-control" placeholder="Ulangi password" required autocomplete="new-password"
            style="background:${s.inputBg};border:1px solid ${s.inputBorder};border-radius:10px;padding:10px 14px;font-size:14px;height:44px">
        </div>
        <div id="fr-error" class="alert alert-danger d-none py-2" style="font-size:13px;border-radius:10px" role="alert"></div>
        <button type="submit" id="fr-submit" class="btn btn-primary w-100" style="border-radius:10px;padding:10px;font-size:15px;font-weight:600;height:44px">
          <span id="fr-submit-text">Buat Akun</span>
          <div id="fr-spinner" class="spinner-border spinner-border-sm d-none" role="status"><span class="visually-hidden">Loading...</span></div>
        </button>
      </form>
    </div>
  `;

  if (isDark) {
    wrapper.querySelectorAll('#fr-fullname, #fr-username, #fr-password, #fr-password2').forEach((el) => {
      el.style.cssText += 'background:#0f172a !important;border-color:#334155 !important;color:#f1f5f9';
    });
  }

  container.appendChild(wrapper);

  const form = wrapper.querySelector('#first-run-form');
  const errorEl = wrapper.querySelector('#fr-error');
  const submitBtn = wrapper.querySelector('#fr-submit');
  const submitText = wrapper.querySelector('#fr-submit-text');
  const spinner = wrapper.querySelector('#fr-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = wrapper.querySelector('#fr-fullname').value.trim();
    const username = wrapper.querySelector('#fr-username').value.trim();
    const password = wrapper.querySelector('#fr-password').value;
    const confirmPassword = wrapper.querySelector('#fr-password2').value;

    errorEl.classList.add('d-none');

    if (!fullName) {
      showError(errorEl, 'Nama lengkap wajib diisi');
      return;
    }
    if (!username) {
      showError(errorEl, 'Username wajib diisi');
      return;
    }
    if (password.length < 6) {
      showError(errorEl, 'Password minimal 6 karakter');
      return;
    }
    if (password !== confirmPassword) {
      showError(errorEl, 'Konfirmasi password tidak cocok');
      return;
    }

    submitBtn.disabled = true;
    submitText.textContent = 'Membuat akun...';
    spinner.classList.remove('d-none');

    try {
      const result = await createOwnerAccount({ username, fullName, password });
      if (!result.success) {
        throw new Error(result.error || 'Gagal membuat akun');
      }
      window.location.hash = '#/login';
      window.location.reload();
    } catch (err) {
      showError(errorEl, err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      submitBtn.disabled = false;
      submitText.textContent = 'Buat Akun';
      spinner.classList.add('d-none');
    }
  });
}

function showError(errorEl, message) {
  errorEl.textContent = message;
  errorEl.classList.remove('d-none');
}
