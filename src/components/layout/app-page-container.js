export function renderPageContainer() {
  const container = document.createElement('main');
  container.className = 'app-content';
  container.setAttribute('role', 'main');
  container.id = 'page-content';
  return container;
}
