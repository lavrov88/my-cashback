import { createPinia } from "pinia"
import { createPiniaAutoPersistPlugin } from "../plugins/piniaPersist"
import type { App } from "vue"

const pinia = createPinia()
pinia.use(createPiniaAutoPersistPlugin({
  enabledByDefault: true,
  blacklist: [ 'appSettings' ],
  storagePrefix: 'cashbackApp:',
  debounceMs: 150
}))

export const usePinia = (app: App) => {
  app.use(pinia)
}