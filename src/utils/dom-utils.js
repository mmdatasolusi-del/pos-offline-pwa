export const qs = (selector, context = document) => context.querySelector(selector);

export const qsa = (selector, context = document) => context.querySelectorAll(selector);

export function delegate(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e, target);
    }
  });
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }
  return el;
}

export function removeElement(el) {
  el?.parentNode?.removeChild(el);
}

export function emptyElement(el) {
  while (el?.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export function insertAfter(newEl, refEl) {
  refEl.parentNode?.insertBefore(newEl, refEl.nextSibling);
}
