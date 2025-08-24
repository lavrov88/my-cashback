<template>
  <Drawer
    :visible="visible"
    :pt="{
      root: {
        class: 'app-drawer'
      }
    }"
    @update:visible="onChangeVisible"
  >
    <template #container>
      <ul class="drawer-menu-items">
        <li v-ripple class="drawer-menu-item" @click="onClickBanks">
          <i class="pi pi-warehouse"></i>
          <span>Банки</span>
        </li>
      </ul>
    </template>
  </Drawer>

  <BanksEditDialog ref="banksEditDialogRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BanksEditDialog from '../Dialogs/BanksEditDialog.vue'
import { useUiHistory } from '../../composables/useUiHistory'

// open-close
const { getComputedDrawerVisible } = useUiHistory()
const visible = getComputedDrawerVisible('menu')
const openDrawer = () => visible.value = true
const onChangeVisible = (value: boolean) => visible.value = value

// banks
const banksEditDialogRef = ref<InstanceType<typeof BanksEditDialog> | null>(null)
const onClickBanks = () => {
  onChangeVisible(false)
  setTimeout(() => {
    banksEditDialogRef.value?.open()
  }, 100);
}

defineExpose({ open: openDrawer })

</script>

<style lang="scss">
.app-drawer {
  width: 75vw !important;
  max-width: 20rem;
}
.drawer-menu-item {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>