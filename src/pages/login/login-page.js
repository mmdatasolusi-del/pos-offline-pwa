import { authService } from '../../services/auth-service.js';
import { ensureSystemRoles } from '../../auth/auth.js';
import { AppButton } from '../../components/button/app-button.js';
import { APP_CONFIG } from '../../config/app.config.js';

export async function init(container) {
  await ensureSystemRoles();

  container.innerHTML = '';
  container.className = 'd-flex align-items-center justify-content-center min-vh-100 p-3';
  container.style.backgroundColor = 'var(--color-bg-primary)';

  const card = document.createElement('div');
  card.className = 'card border-0 shadow';
  card.style.width = '100%';
  card.style.maxWidth = '400px';
  card.style.backgroundColor = 'var(--color-bg-card)';

  card.innerHTML = `
    <div class="card-body p-4">
      <div class="text-center mb-4">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width:64px;height:64px;background-color:var(--color-primary-50)">
          <i class="bi bi-shop fs-3" style="color:var(--color-primary-500)"></i>
        </div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">${APP_CONFIG.appName}</h2>
        <p class="text-muted text-sm mb-0">Masuk untuk melanjutkan</p>
      </div>
      <form id="login-form" novalidate>
        <div class="mb-3">
          <label for="login-username" class="form-label text-sm fw-medium" style="color:var(--color-text-body)">Username</label>
          <div class="input-group">
            <span class="input-group-text" style="background-color:var(--color-gray-50);border-color:var(--color-border)">
              <i class="bi bi-person" style="color:var(--color-gray-500)"></i>
            </span>
            <input type="text" id="login-username" class="form-control" placeholder="Masukkan username" required autocomplete="username" autofocus style="border-color:var(--color-border)">
          </div>
        </div>
        <div class="mb-3">
          <label for="login-password" class="form-label text-sm fw-medium" style="color:var(--color-text-body)">Password</label>
          <div class="input-group">
            <span class="input-group-text" style="background-color:var(--color-gray-50);border-color:var(--color-border)">
              <i class="bi bi-lock" style="color:var(--color-gray-500)"></i>
            </span>
            <input type="password" id="login-password" class="form-control" placeholder="Masukkan password" required autocomplete="current-password" style="border-color:var(--color-border)">
          </div>
        </div>
        <div id="login-error" class="alert d-none d-flex align-items-center gap-2 py-2 px-3 mb-3 text-sm" role="alert" style="background-color:var(--color-danger-50);border:1px solid #FECACA;color:var(--color-danger-600)">
          <i class="bi bi-exclamation-circle"></i>
          <span id="login-error-text"></span>
        </div>
        <div id="login-submit"></div>
      </form>
    </div>
  `;

  container.appendChild(card);

  const submitBtn = AppButton({
    label: 'Masuk',
    icon: 'bi-box-arrow-in-right',
    variant: 'primary',
    size: 'lg',
    fullWidth: true,
    className: 'mb-3',
  });
  document.getElementById('login-submit').appendChild(submitBtn);

  const form = document.getElementById('login-form');
  const errorContainer = document.getElementById('login-error');
  const errorText = document.getElementById('login-error-text');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  async function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      showError('Username wajib diisi');
      usernameInput.focus();
      return;
    }
    if (!password) {
      showError('Password wajib diisi');
      passwordInput.focus();
      return;
    }

    errorContainer.classList.add('d-none');
    submitBtn.setLoading(true);

    try {
      await authService.login(username, password);
      window.location.reload();
    } catch (err) {
      showError(err.message);
      submitBtn.setLoading(false);
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorContainer.classList.remove('d-none');
  }

  submitBtn.addEventListener('click', handleLogin);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });
}
