import { authService } from '../../services/auth-service.js';
import { unlockScreen } from '../../services/idle-service.js';
import { AppButton } from '../../components/button/app-button.js';

export function init(container) {
  const user = authService.currentUser();
  if (!user) {
    window.location.hash = '#/login';
    return;
  }

  container.innerHTML = '';
  container.className = 'd-flex align-items-center justify-content-center min-vh-100 p-3';
  container.style.backgroundColor = 'var(--color-bg-primary)';

  const card = document.createElement('div');
  card.className = 'card border-0 shadow';
  card.style.width = '100%';
  card.style.maxWidth = '400px';
  card.style.backgroundColor = 'var(--color-bg-card)';

  card.innerHTML = `
    <div class="card-body p-4 text-center">
      <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width:48px;height:48px;background-color:var(--color-primary-50)">
        <i class="bi bi-lock-fill fs-4" style="color:var(--color-primary-500)"></i>
      </div>
      <p class="text-muted text-sm mb-1">Layar Terkunci</p>
      <h2 class="h5 fw-bold mb-3" style="color:var(--color-text-heading)">${user.fullName || user.username}</h2>
      <form id="unlock-form" novalidate>
        <div class="mb-3">
          <label for="unlock-password" class="form-label text-sm fw-medium" style="color:var(--color-text-body)">Masukkan password untuk membuka</label>
          <input type="password" id="unlock-password" class="form-control text-center" placeholder="Password" required autocomplete="current-password" autofocus style="border-color:var(--color-border)">
        </div>
        <div id="unlock-error" class="alert d-none d-flex align-items-center gap-2 py-2 px-3 mb-3 text-sm" role="alert" style="background-color:var(--color-danger-50);border:1px solid #FECACA;color:var(--color-danger-600)">
          <i class="bi bi-exclamation-circle"></i>
          <span id="unlock-error-text"></span>
        </div>
        <div id="unlock-submit"></div>
      </form>
      <button type="button" id="logout-btn" class="btn btn-link text-decoration-none text-sm mt-2" style="color:var(--color-gray-500)">
        Bukan ${user.fullName || user.username}? Keluar
      </button>
    </div>
  `;

  container.appendChild(card);

  const unlockBtn = AppButton({ label: 'Buka Kunci', variant: 'primary', size: 'lg', fullWidth: true });
  document.getElementById('unlock-submit').appendChild(unlockBtn);

  const form = document.getElementById('unlock-form');
  const errorContainer = document.getElementById('unlock-error');
  const errorText = document.getElementById('unlock-error-text');
  const passwordInput = document.getElementById('unlock-password');

  async function handleUnlock() {
    const password = passwordInput.value;
    if (!password) {
      showError('Password wajib diisi');
      return;
    }

    errorContainer.classList.add('d-none');
    unlockBtn.setLoading(true);

    try {
      const { authService } = await import('../../services/auth-service.js');
      await authService.login(user.username, password);
      unlockScreen();
      window.location.reload();
    } catch (err) {
      showError('Password salah');
      unlockBtn.setLoading(false);
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorContainer.classList.remove('d-none');
  }

  unlockBtn.addEventListener('click', handleUnlock);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUnlock();
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    const { authService } = await import('../../services/auth-service.js');
    authService.logout({ redirect: true });
  });
}
