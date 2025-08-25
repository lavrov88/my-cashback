import type { Ref } from 'vue';

declare module 'virtual:pwa-register/vue' {
  type Options = {
    immediate?: boolean;
    onNeedRefresh?: (registration?: ServiceWorkerRegistration) => void;
    onOfflineReady?: () => void;
  };

  export function useRegisterSW(options?: Options): {
    needRefresh: Ref<boolean>;
    offlineReady: Ref<boolean>;
    updateServiceWorker: (reload?: boolean) => Promise<void>;
  };
}
