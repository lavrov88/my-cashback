import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>
}

export const usePwaStore = defineStore('pwa', () => {
  // сохранённое событие beforeinstallprompt
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  // уже установлен ли app
  const installed = ref(false)
  // если нужно показывать iOS fallback instruction
  const showIosInstallHint = ref(false)

  const canPrompt = computed(() => !!deferredPrompt.value && !installed.value)
  const isInstalled = computed(() => installed.value)

  function handleBeforeInstallPrompt(e: Event) {
    const ev = e as BeforeInstallPromptEvent
    ev.preventDefault()
    deferredPrompt.value = ev
  }

  function handleAppInstalled() {
    installed.value = true
    deferredPrompt.value = null
  }

  function detectIosFallback() {
    const ua = navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(ua)
    const inStandalone =
      // @ts-ignore
      (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches
    showIosInstallHint.value = isIos && !inStandalone
  }

  function init() {
    detectIosFallback()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled as EventListener)
  }

  async function promptInstall(): Promise<'accepted' | 'dismissed' | 'no-event'> {
    if (!deferredPrompt.value) return 'no-event'
    try {
      await deferredPrompt.value.prompt()
      const choice = await deferredPrompt.value.userChoice
      // очистим после выбора
      const outcome = choice.outcome
      deferredPrompt.value = null
      if (outcome === 'accepted') installed.value = true
      return outcome
    } catch (err) {
      console.error('promptInstall error', err)
      return 'no-event'
    }
  }

  function dispose() {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.removeEventListener('appinstalled', handleAppInstalled as EventListener)
  }

  return {
    deferredPrompt,
    installed,
    showIosInstallHint,
    canPrompt,
    isInstalled,
    init,
    promptInstall,
    dispose
  }
})
