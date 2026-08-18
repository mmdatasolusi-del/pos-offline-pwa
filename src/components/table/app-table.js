import { createElement } from '../../utils/dom-utils.js';

export function AppTable({ columns = [], data = [], variant = 'default', sortable = false, selectable = false, actions, onSort, onSelect, emptyText = 'Tidak ada data', className = '', pageSize }) {
  const currentPage = 1;
  const wrapper = createElement('div', { className: ['table-responsive', className].filter(Boolean).join(' ') });

  const table = createElement('table', { className: ['table align-middle mb-0', variant === 'striped' ? 'table-striped' : '', variant === 'compact' ? 'table-sm' : ''].filter(Boolean).join(' ') });

  const thead = createElement('thead', { className: 'table-light' });
  const headerRow = createElement('tr');

  if (selectable) {
    const th = createElement('th', { className: 'text-center', style: 'width:40px' });
    const cb = createElement('input', { type: 'checkbox', className: 'form-check-input cursor-pointer' });
    cb.addEventListener('change', (e) => {
      const checked = e.target.checked;
      table.querySelectorAll('tbody .form-check-input').forEach((c) => { c.checked = checked; });
      onSelect?.(checked ? data : []);
    });
    th.appendChild(cb);
    headerRow.appendChild(th);
  }

  for (const col of columns) {
    const th = createElement('th', {
      className: ['text-nowrap text-sm fw-semibold', col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : '', sortable && col.sortable !== false ? 'cursor-pointer select-none' : ''].filter(Boolean).join(' '),
      'data-field': col.key,
    });
    th.style.color = 'var(--color-text-body)';
    th.textContent = col.label || col.key;

    if (sortable && col.sortable !== false) {
      th.setAttribute('role', 'button');
      th.setAttribute('tabindex', '0');
      th.addEventListener('click', () => {
        const asc = th.getAttribute('data-sort') !== 'asc';
        thead.querySelectorAll('th[data-sort]').forEach((t) => t.removeAttribute('data-sort'));
        th.setAttribute('data-sort', asc ? 'asc' : 'desc');
        onSort?.(col.key, asc ? 'asc' : 'desc');
      });
    }

    headerRow.appendChild(th);
  }

  if (actions) {
    const th = createElement('th', { className: 'text-nowrap text-center', style: 'width:80px' });
    th.textContent = 'Aksi';
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = createElement('tbody');

  if (data.length === 0) {
    const row = createElement('tr');
    const cell = createElement('td', { colspan: columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0), className: 'text-center py-4' });
    cell.innerHTML = `<i class="bi bi-inbox fs-2 text-muted d-block mb-2"></i><span class="text-muted">${emptyText}</span>`;
    row.appendChild(cell);
    tbody.appendChild(row);
  } else {
    for (const row of data) {
      const tr = createElement('tr', { className: 'align-middle' });
      tr.style.borderColor = 'var(--color-border)';

      if (selectable) {
        const td = createElement('td', { className: 'text-center' });
        const cb = createElement('input', { type: 'checkbox', className: 'form-check-input cursor-pointer' });
        cb.addEventListener('change', () => {
          const selected = Array.from(tbody.querySelectorAll('.form-check-input:checked')).map((c) => {
            const idx = c.closest('tr').rowIndex - 1;
            return data[idx];
          });
          onSelect?.(selected);
        });
        td.appendChild(cb);
        tr.appendChild(td);
      }

      for (const col of columns) {
        const td = createElement('td', {
          className: ['text-sm', col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : ''].filter(Boolean).join(' '),
        });
        td.style.color = 'var(--color-text-body)';
        const val = row[col.key];
        if (col.render) {
          td.appendChild(col.render(val, row));
        } else {
          td.textContent = val !== null && val !== undefined ? val : '-';
        }
        tr.appendChild(td);
      }

      if (actions) {
        const td = createElement('td', { className: 'text-center' });
        const actionGroup = createElement('div', { className: 'd-flex gap-1 justify-content-center' });
        for (const action of actions) {
          const btn = createElement('button', {
            type: 'button',
            className: ['btn btn-sm border-0', action.className || 'btn-link text-decoration-none'].filter(Boolean).join(' '),
            'data-action': action.key,
            'aria-label': action.label || '',
          });
          btn.style.color = action.color || 'var(--color-primary-500)';
          if (action.icon) {
            btn.innerHTML = `<i class="${action.icon}"></i>`;
          } else {
            btn.textContent = action.label || '';
          }
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            action.onClick?.(row, e);
          });
          actionGroup.appendChild(btn);
        }
        td.appendChild(actionGroup);
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);

  wrapper.table = table;
  wrapper.tbody = tbody;

  wrapper.updateData = (newData) => {
    tbody.innerHTML = '';
    for (const row of newData) {
      const tr = createElement('tr', { className: 'align-middle' });
      tr.style.borderColor = 'var(--color-border)';
      for (const col of columns) {
        const td = createElement('td', {
          className: ['text-sm', col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : ''].filter(Boolean).join(' '),
        });
        const val = row[col.key];
        if (col.render) {
          td.appendChild(col.render(val, row));
        } else {
          td.textContent = val !== null && val !== undefined ? val : '-';
        }
        tr.appendChild(td);
      }
      if (actions) {
        const td = createElement('td', { className: 'text-center' });
        const actionGroup = createElement('div', { className: 'd-flex gap-1 justify-content-center' });
        for (const action of actions) {
          const btn = createElement('button', {
            type: 'button',
            className: ['btn btn-sm border-0', action.className || 'btn-link text-decoration-none'].filter(Boolean).join(' '),
            'data-action': action.key,
            'aria-label': action.label || '',
          });
          btn.style.color = action.color || 'var(--color-primary-500)';
          if (action.icon) {
            btn.innerHTML = `<i class="${action.icon}"></i>`;
          } else {
            btn.textContent = action.label || '';
          }
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            action.onClick?.(row, e);
          });
          actionGroup.appendChild(btn);
        }
        td.appendChild(actionGroup);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  };

  return wrapper;
}
