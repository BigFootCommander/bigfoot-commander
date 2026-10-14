/* Load the shared header and footer, keeping page-specific styles unchanged. */
async function loadSharedLayout() {
  const sections = [
    { id: 'site-header', file: 'header.html' },
    { id: 'site-footer', file: 'footer.html' }
  ];
  await Promise.all(sections.map(async ({ id, file }) => {
    const mount = document.getElementById(id);
    if (!mount) return;
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error('Could not load ' + file);
      const markup = await response.text();
      const parsed = new DOMParser().parseFromString(markup, 'text/html');
      const element = parsed.body.firstElementChild;
      if (!element) throw new Error('Empty layout: ' + file);
      if (id === 'site-header') {
        const page = location.pathname.split('/').pop() || 'index.html';
        for (const link of element.querySelectorAll('nav a[href]')) {
          if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
        }
      }
      mount.replaceWith(element);
    } catch (error) {
      console.error('Shared layout error:', error);
      mount.textContent = id === 'site-header' ? 'Site navigation could not be loaded. Please refresh the page.' : '';
    }
  }));
}
loadSharedLayout();
