<template>
  <div id="app-wrapper">
    <AppHeader />
    <AppContent />

    <AppConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/MainScreen/AppHeader.vue'
import AppContent from './components/MainScreen/AppContent.vue'
</script>

<style scoped lang="scss">
#app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
  min-width: 100vw;
}
</style>