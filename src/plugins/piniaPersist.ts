import type { PiniaPluginContext } from 'pinia'

export type PiniaPersistOptions = {
  /** По умолчанию: true — сохранять все сторы, кроме тех, что в blacklist.
   *  Если false и указана whitelist — сохранять только те, что в whitelist.
   */
  enabledByDefault?: boolean
  /** Список id сторов, которые НЕ сохранять */
  blacklist?: string[]
  /** Если указан, сохранять только сторы из этого списка (игнорирует enabledByDefault) */
  whitelist?: string[]
  /** Ключ-префикс в localStorage */
  storagePrefix?: string
  /** Debounce записей в ms (0 = без debounce) */
  debounceMs?: number
}

const DEFAULTS: Required<Pick<PiniaPersistOptions, 'enabledByDefault' | 'blacklist' | 'whitelist' | 'storagePrefix' | 'debounceMs'>> = {
  enabledByDefault: true,
  blacklist: [],
  whitelist: [],
  storagePrefix: 'pinia:',
  debounceMs: 150
}

/**
 * Создаёт плагин персиста Pinia с конфигом blacklist/whitelist.
 */
export function createPiniaAutoPersistPlugin(opts?: PiniaPersistOptions) {
  const cfg = { ...DEFAULTS, ...(opts ?? {}) }

  const shouldPersist = (id: string) => {
    // Если whitelist указан явно и не пустой — сохраняем только из него
    if (cfg.whitelist && cfg.whitelist.length > 0) {
      return cfg.whitelist.includes(id)
    }
    // Иначе, сохраняем по enabledByDefault, но пропускаем blacklist
    if (cfg.blacklist && cfg.blacklist.length > 0 && cfg.blacklist.includes(id)) {
      return false
    }
    return cfg.enabledByDefault
  }

  return (context: PiniaPluginContext) => {
    const { store } = context
    const id = store.$id

    if (!shouldPersist(id)) {
      return
    }

    if (typeof window === 'undefined' || !window.localStorage) return

    const key = `${cfg.storagePrefix}${id}`

    // гидрация
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        store.$patch(parsed)
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[piniaPersist] hydrate failed for', id, err)
    }

    // подписка + debounce
    if (cfg.debounceMs && cfg.debounceMs > 0) {
      let timer: number | null = null
      store.$subscribe(() => {
        if (timer) clearTimeout(timer)
        timer = window.setTimeout(() => {
          try {
            localStorage.setItem(key, JSON.stringify(store.$state))
          } catch (e) {
            if (import.meta.env.DEV) console.warn('[piniaPersist] persist failed for', id, e)
          }
          timer = null
        }, cfg.debounceMs)
      })
    } else {
      store.$subscribe(() => {
        try {
          localStorage.setItem(key, JSON.stringify(store.$state))
        } catch (e) {
          if (import.meta.env.DEV) console.warn('[piniaPersist] persist failed for', id, e)
        }
      })
    }
  }
}


// import type { PiniaPluginContext } from 'pinia'

// /**
//  * Простая универсальная персист-мелкая реализация:
//  * - ре-гидрация store при создании (если есть сохранённые данные)
//  * - подписка на изменения ($subscribe) и сохранение в localStorage
//  * - пропуск для SSR (если localStorage отсутствует)
//  * - опциональная игнор-лист (storeOptions.persist === false)
//  *
//  * Можно улучшить: debounce, encrypt, custom storage, versioning/migration.
//  */

// const STORAGE_PREFIX = 'cashbackApp:' // ключ будет cashbackApp:<storeId>

// export function piniaAutoPersistPlugin() {
//   return (context: PiniaPluginContext) => {
//     const { store, options } = context

//     // Если явный запрет: options.persist === false — пропускаем
//     if ((options as any)?.persist === false) {
//       return
//     }

//     // Проверяем доступность localStorage (SSR-safe)
//     if (typeof window === 'undefined' || !window.localStorage) return

//     const key = `${STORAGE_PREFIX}${store.$id}`

//     // --- гидрация ---
//     try {
//       const raw = localStorage.getItem(key)
//       if (raw) {
//         // ожидаем JSON
//         const parsed = JSON.parse(raw)
//         // применение в store (patch — безопасно)
//         store.$patch(parsed)
//       }
//     } catch (err) {
//       // если не получилось распарсить/применить — игнорируем и продолжаем
//       // можно логировать в dev
//       if (import.meta.env.DEV) console.warn('[piniaPersist] failed to hydrate', store.$id, err)
//     }

//     // --- подписка на изменения ---
//     // можно добавить debounce, но здесь простой вариант — обновление при каждом изменении
//     store.$subscribe(
//       (_mutation, state) => {
//         try {
//           localStorage.setItem(key, JSON.stringify(state))
//         } catch (err) {
//           if (import.meta.env.DEV) console.warn('[piniaPersist] failed to persist', store.$id, err)
//         }
//       },
//       { detached: false } // используем стандартное поведение
//     )
//   }
// }
