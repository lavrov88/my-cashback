<template>
  <div>
    <!-- Chromium-like install button (visible when canPrompt) -->
    <Button
      v-if="pwa.canPrompt"
      label="Установить как приложение"
      icon="pi pi-android"
      severity="contrast"
      class="install-btn"
      @click="onInstall"
    />

    <!-- iOS fallback hint -->
    <div v-else-if="pwa.showIosInstallHint">
      <Button
        v-if="!openIosHint"
        label="Установить как приложение"
        icon="pi pi-apple"
        severity="contrast"
        class="install-btn"
        @click="openIosHint = true"
      />
      <Message
        v-if="openIosHint"
        severity="secondary"
        closable
        @close="openIosHint = false"
      >
        Чтобы добавить приложение на домашний экран, нажмите:<br/>
        <strong>Поделиться → Добавить на экран «Домой»»</strong>.
      </Message>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePwaStore } from '../stores/pwaStore' // поправь путь при необходимости

const pwa = usePwaStore()
const openIosHint = ref(false)

async function onInstall() {
  const result = await pwa.promptInstall()
  if (result === 'accepted') {
    // можно показать уведомление/аналитику
    console.log('PWA installed (accepted)')
  } else if (result === 'dismissed') {
    console.log('User dismissed install prompt')
  } else {
    // нет сохраненного события — скрыть кнопку или показать подсказку
    console.log('No install prompt event available')
  }
}
</script>

<style scoped lang="scss">
.install-btn {
  :deep(.pi.pi-android),
  :deep(.pi.pi-apple) {
    font-size: 1.5rem;
  }
}
</style>
