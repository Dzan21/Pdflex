export function ThemeScript() {
  const code = `(function () {
    try {
      const ls = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldDark = ls ? ls === 'dark' : prefersDark;

      const root = document.documentElement;
      if (shouldDark) root.classList.add('dark');
      else root.classList.remove('dark');

      // ⚠️ Odstránené: document.body?.style.setProperty('--vt-ready', '1');
      // Tento zápis spôsoboval hydration mismatch
    } catch (_) {}
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}