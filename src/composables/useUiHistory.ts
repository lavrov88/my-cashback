import { ref, readonly, onMounted, onUnmounted, computed } from 'vue'

type UiType = 'dialog' | 'drawer'

/**
 * Управляет state-ui через query-параметры и history API.
 * Поддерживает повторяющиеся ключи, напр. ?dialog=profile&dialog=confirm
 */

function readParamValues(key: string): string[] {
  const params = new URLSearchParams(window.location.search)
  return params.getAll(key)
}

function urlWithAdded(key: string, id: string): string {
  const params = new URLSearchParams(window.location.search)
  params.append(key, id)
  return `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}${window.location.hash || ''}`
}

export function useUiHistory() {
  // Sets to keep currently-open ids (reactive)
  const openDialogs = ref<string[]>([])   // dialog ids in URL order
  const openDrawers = ref<string[]>([])

  function syncFromUrl() {
    // read current URL params and sync sets
    if (typeof window === 'undefined') return
    openDialogs.value = readParamValues('dialog')
    openDrawers.value = readParamValues('drawer')
  }

  // open: pushState with added param
  function open(type: UiType, id: string) {
    if (typeof window === 'undefined') return
    const key = type === 'dialog' ? 'dialog' : 'drawer'
    const current = readParamValues(key)
    // если уже открыт — ничего не делаем
    if (current.includes(id)) return
    const newUrl = urlWithAdded(key, id)
    history.pushState({ ui: true }, '', newUrl)
    // затем синхронизируем локально
    syncFromUrl()
  }

  // close: prefer history.back() if current URL contains id (undo last push)
  function close(type: UiType, id: string) {
    if (typeof window === 'undefined') return
    const key = type === 'dialog' ? 'dialog' : 'drawer'
    const current = readParamValues(key)
    if (current.includes(id)) {
      // try to go back in history — this will trigger popstate and syncFromUrl
      history.back()
      return
    }

    // fallback: if id not present in URL (or history state mismatch) — remove param by replaceState
    const params = new URLSearchParams(window.location.search)
    const values = params.getAll(key).filter(v => v !== id)
    // remove all of key then append remaining
    params.delete(key)
    values.forEach(v => params.append(key, v))
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}${window.location.hash || ''}`
    history.replaceState({}, '', newUrl)
    syncFromUrl()
  }

  // return computed getter/setter for dialog
  function getComputedVisible(dialogId: string) {
    return computed({
      get() { return openDialogs.value.includes(dialogId) },
      set(val: boolean) {
        if (val) open('dialog', dialogId)
        else close('dialog', dialogId)
      }
    })
  }

  function getComputedDrawerVisible(drawerId: string) {
    return computed({
      get() { return openDrawers.value.includes(drawerId) },
      set(val: boolean) {
        if (val) open('drawer', drawerId)
        else close('drawer', drawerId)
      }
    })
  }

  function isOpen(type: UiType, id: string) {
    const set = type === 'dialog' ? openDialogs.value : openDrawers.value
    return set.includes(id)
  }

  function topOpen(type: UiType): string | null {
    const arr = type === 'dialog' ? openDialogs.value : openDrawers.value
    return arr.length ? arr[arr.length - 1] : null
  }

  // popstate listener: при изменении истории синхронизируем открытые элементы
  function onPop() {
    syncFromUrl()
  }

  onMounted(() => {
    // initial sync (включая когда страница загружена с ?dialog=...)
    syncFromUrl()
    window.addEventListener('popstate', onPop)
  })
  onUnmounted(() => {
    window.removeEventListener('popstate', onPop)
  })

  return {
    openDialogs: readonly(openDialogs),
    openDrawers: readonly(openDrawers),
    getComputedVisible,
    getComputedDrawerVisible,
    open,
    close,
    isOpen,
    topOpen,
  }
}