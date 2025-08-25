declare module 'virtual:pwa-register' {
  type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: (registration?: ServiceWorkerRegistration) => void;
    onOfflineReady?: () => void;
  };

  /**
   * Возвращает функцию для активации нового SW.
   * Пример использования: const updateSW = registerSW({...}); updateSW(true)
   */
  export function registerSW(options?: RegisterSWOptions): (reload?: boolean) => Promise<void>;
  export default registerSW;
}
