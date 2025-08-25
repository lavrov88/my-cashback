import { registerSW } from 'virtual:pwa-register'

const applyViewportBugFix = () => {
  // функция, исправляющая баг с уменьшением размера содержимого при смене темы

  const forceRepaint = () => {
    const html = document.documentElement;
    html.style.display = 'none';
    html.offsetHeight; // читаем значение, чтобы форсировать reflow
    html.style.display = '';
  }

  document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // немного отложим, чтобы система успела применить изменения темы
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        forceRepaint();
      });
    });
  }
});
}

export const configurePwaParameters = () => {
  registerSW()
  applyViewportBugFix()
}

