import db from '../../database/db.js';
import { AppButton } from '../../components/button/app-button.js';
import { AppInput } from '../../components/form/app-input.js';
import { AppToggle } from '../../components/form/app-toggle.js';
import { showToast } from '../../components/feedback/app-alert.js';

export async function init(container) {
  const settings = await db.settings.toArray();
  const settingMap = {};
  for (const s of settings) {
    settingMap[s.key] = s;
  }

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Profil Toko</h2>
        <p class="text-muted text-sm mb-0">Informasi dasar toko Anda</p>
      </div>
      <div id="store-actions"></div>
    </div>
    <div class="card border-0 shadow-sm" style="background-color:var(--color-bg-card)">
      <div class="card-body p-4">
        <form id="store-form">
          <div id="store-name"></div>
          <div id="store-address"></div>
          <div id="store-phone"></div>
          <div class="row g-3">
            <div class="col-md-4">
              <div id="store-default-payment"></div>
            </div>
            <div class="col-md-4">
              <div id="store-tax"></div>
            </div>
            <div class="col-md-4">
              <div id="store-invoice-prefix"></div>
            </div>
          </div>
          <div id="store-negative-stock"></div>
          <div id="store-error" class="alert d-none py-2 px-3 text-sm" role="alert" style="background-color:var(--color-danger-50);border:1px solid #FECACA;color:var(--color-danger-600)"></div>
        </form>
      </div>
    </div>
  `;

  const nameInput = AppInput({
    label: 'Nama Toko',
    value: settingMap['store-name']?.value || '',
    placeholder: 'Masukkan nama toko',
    id: 'store-name-input',
  });
  document.getElementById('store-name').appendChild(nameInput);

  const addressInput = AppInput({
    label: 'Alamat Toko',
    value: settingMap['store-address']?.value || '',
    placeholder: 'Masukkan alamat toko',
    id: 'store-address-input',
  });
  document.getElementById('store-address').appendChild(addressInput);

  const phoneInput = AppInput({
    label: 'Nomor Telepon',
    value: settingMap['store-phone']?.value || '',
    placeholder: 'Contoh: 081234567890',
    id: 'store-phone-input',
  });
  document.getElementById('store-phone').appendChild(phoneInput);

  const paymentSelect = document.createElement('div');
  paymentSelect.innerHTML = `
    <div class="mb-3">
      <label for="store-payment-select" class="form-label text-sm fw-medium" style="color:var(--color-text-body)">Pembayaran Default</label>
      <select id="store-payment-select" class="form-select" style="border-color:var(--color-border)">
        <option value="CASH" ${settingMap['pos-default-payment']?.value === 'CASH' ? 'selected' : ''}>Tunai (CASH)</option>
        <option value="TRANSFER" ${settingMap['pos-default-payment']?.value === 'TRANSFER' ? 'selected' : ''}>Transfer</option>
        <option value="QRIS" ${settingMap['pos-default-payment']?.value === 'QRIS' ? 'selected' : ''}>QRIS</option>
        <option value="DEBIT" ${settingMap['pos-default-payment']?.value === 'DEBIT' ? 'selected' : ''}>Debit</option>
        <option value="CREDIT" ${settingMap['pos-default-payment']?.value === 'CREDIT' ? 'selected' : ''}>Kredit</option>
        <option value="MIXED" ${settingMap['pos-default-payment']?.value === 'MIXED' ? 'selected' : ''}>Campuran</option>
      </select>
    </div>
  `;
  document.getElementById('store-default-payment').appendChild(paymentSelect);

  const taxInput = AppInput({
    label: 'Pajak Default (%)',
    type: 'number',
    value: String(settingMap['tax-default-rate']?.value || 0),
    id: 'store-tax-input',
    attrs: { min: '0', max: '100', step: '0.5' },
  });
  document.getElementById('store-tax').appendChild(taxInput);

  const prefixInput = AppInput({
    label: 'Prefix Invoice',
    value: settingMap['invoice-prefix']?.value || 'INV',
    id: 'store-prefix-input',
  });
  document.getElementById('store-invoice-prefix').appendChild(prefixInput);

  const negativeToggle = AppToggle({
    label: 'Izinkan stok negatif',
    checked: settingMap['allow-negative-stock']?.value === true,
  });
  document.getElementById('store-negative-stock').appendChild(negativeToggle);

  const saveBtn = AppButton({ label: 'Simpan Pengaturan', icon: 'bi-check-lg', variant: 'primary' });
  document.getElementById('store-actions').appendChild(saveBtn);
  saveBtn.addEventListener('click', handleSave);

  async function handleSave() {
    const errorEl = document.getElementById('store-error');
    errorEl.classList.add('d-none');
    saveBtn.setLoading(true);

    try {
      const updates = {
        'store-name': nameInput.getValue(),
        'store-address': addressInput.getValue(),
        'store-phone': phoneInput.getValue(),
        'pos-default-payment': document.getElementById('store-payment-select').value,
        'tax-default-rate': Number(taxInput.getValue()) || 0,
        'invoice-prefix': prefixInput.getValue().toUpperCase(),
        'allow-negative-stock': negativeToggle.input.checked,
      };

      for (const [key, value] of Object.entries(updates)) {
        const existing = settingMap[key];
        if (existing) {
          await db.settings.update(existing.id, { value });
        }
      }

      showToast('Pengaturan berhasil disimpan', 'success');
    } catch (err) {
      errorEl.textContent = 'Gagal menyimpan: ' + err.message;
      errorEl.classList.remove('d-none');
    } finally {
      saveBtn.setLoading(false);
    }
  }
}
