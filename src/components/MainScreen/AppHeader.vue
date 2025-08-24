<template>
  <div id="app-header-wrapper">
    <Toolbar class="app-header-toolbar">
      <template #start>
        <Button
          icon="pi pi-bars"
          size="large"
          @click="onClickMenuButton"
        />
      </template>

      <template #center>
        <div class="app-title-wrapper">
          <h2>Cashback App</h2>
        </div>
      </template>

      <template #end>
      </template>
    </Toolbar>
  </div>
  <AppDrawer :visible="visible" @change="onChangeAppDrawer" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Toolbar from 'primevue/toolbar'
import AppDrawer from './AppDrawer.vue';

const visible = ref(false)
const onClickMenuButton = () => visible.value = !visible.value
const onChangeAppDrawer = (value: boolean) => visible.value = value

</script>

<style scoped lang="scss">
#app-header-wrapper {
  background-color: var(--app-content-background);

  .app-header-toolbar {
    height: 65px;
    border-radius: 0;
    border-bottom-color: var(--p-inputtext-border-color);
    border-color: var(--app-header-background);
    background-color: var(--app-header-background);
    box-shadow: var(--p-button-raised-shadow);
  }
  .app-title-wrapper {
    margin-right: 48px;
    display: flex;
    align-items: center;
    justify-content: center;

    h1 {
      margin: 0;
    }
  }
}
</style>