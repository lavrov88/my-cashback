import { registerSW } from 'virtual:pwa-register'
import { getActivePinia } from 'pinia'
import { usePwaStore } from '../stores/pwaStore'


const initPwaPiniaStore = () => {
  const pinia = getActivePinia()
  const pwa = usePwaStore(pinia)
  pwa.init()
}

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
  initPwaPiniaStore()
  registerSW()
  applyViewportBugFix()
}

