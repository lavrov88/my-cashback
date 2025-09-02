<template>
  <div id="app-wrapper">
    <AppHeader />
    <AppContent />

    <AppDialogsContainer />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/MainScreen/AppHeader.vue'
import AppContent from './components/MainScreen/AppContent.vue'
import AppDialogsContainer from './components/Dialogs/AppDialogsContainer.vue'
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