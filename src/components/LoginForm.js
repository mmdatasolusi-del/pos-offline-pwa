export function renderLoginForm() {
  const form = document.createElement('form');
  form.id = 'login-form';
  form.noValidate = true;
  form.innerHTML = `
    <div class="mb-3">
      <label for="login-username" class="form-label" style="font-size:14px;font-weight:500">Username</label>
      <div class="input-group">
        <span class="input-group-text" style="background:var(--login-input-bg,#f3f4f6);border:1px solid var(--login-input-border,#e5e7eb);border-right:none;border-radius:10px 0 0 10px">
          <i class="bi bi-person" style="color:var(--login-label,#6b7280)"></i>
        </span>
        <input type="text" id="login-username" class="form-control" placeholder="Masukkan username" required autocomplete="username"
          style="background:var(--login-input-bg,#f3f4f6);border:1px solid var(--login-input-border,#e5e7eb);border-left:none;border-radius:0 10px 10px 0;padding:10px 14px;font-size:14px;height:44px">
      </div>
    </div>
    <div class="mb-3">
      <label for="login-password" class="form-label" style="font-size:14px;font-weight:500">Password</label>
      <div class="input-group">
        <span class="input-group-text" style="background:var(--login-input-bg,#f3f4f6);border:1px solid var(--login-input-border,#e5e7eb);border-right:none;border-radius:10px 0 0 10px">
          <i class="bi bi-lock" style="color:var(--login-label,#6b7280)"></i>
        </span>
        <input type="password" id="login-password" class="form-control" placeholder="Masukkan password" required autocomplete="current-password"
          style="background:var(--login-input-bg,#f3f4f6);border:1px solid var(--login-input-border,#e5e7eb);border-left:none;border-radius:0 10px 10px 0;padding:10px 14px;font-size:14px;height:44px">
      </div>
    </div>
    <div class="form-check mb-3 d-flex align-items-center" style="padding-left:0">
      <input class="form-check-input" type="checkbox" id="login-remember" style="margin-right:8px;cursor:pointer">
      <label class="form-check-label" for="login-remember" style="font-size:13px;cursor:pointer">Ingat saya di perangkat ini</label>
    </div>
    <div id="login-error" class="alert alert-danger d-none py-2" style="font-size:13px;border-radius:10px" role="alert"></div>
    <button type="submit" id="login-submit" class="btn btn-primary w-100" style="border-radius:10px;padding:10px;font-size:15px;font-weight:600;height:44px">
      <span class="login-btn-text">Masuk</span>
      <div class="spinner-border spinner-border-sm d-none" role="status"><span class="visually-hidden">Loading...</span></div>
    </button>
  `;

  return form;
}

export function attachLoginEvents(form, onLogin) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = form.querySelector('#login-username').value.trim();
    const password = form.querySelector('#login-password').value;
    const errorEl = form.querySelector('#login-error');
    const submitBtn = form.querySelector('#login-submit');
    const btnText = form.querySelector('.login-btn-text');
    const spinner = form.querySelector('.spinner-border');

    errorEl.classList.add('d-none');
    submitBtn.disabled = true;
    btnText.textContent = 'Memproses...';
    spinner.classList.remove('d-none');

    try {
      await onLogin(username, password, form.querySelector('#login-remember')?.checked === true);
    } catch (err) {
      errorEl.textContent = err.message || 'Terjadi kesalahan. Silakan coba lagi.';
      errorEl.classList.remove('d-none');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Masuk';
      spinner.classList.add('d-none');
    }
  });
}
