<template>
  <Drawer
    :visible="visible"
    :pt="{
      root: {
        class: 'app-drawer'
      },
      header: {
        class: 'app-drawer-header'
      },
      content: {
        class: 'app-drawer-content'
      }
    }"
    @update:visible="onChangeVisible"
  >
    <template #header>
      <div class="drawer-header-inner">
        <Avatar :image="cashbackIcon" size="xlarge" shape="circle" />
        <h2>My Cashback</h2>
      </div>
    </template>

    <Menu :model="menuItems" class="app-drawer-menu" />

    <template #footer>
      <div class="drawer-footer-inner">
        <InstallButton />
      </div>
    </template>
  </Drawer>

  <BanksEditDialog ref="banksEditDialogRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BanksEditDialog from '../Dialogs/BanksEditDialog.vue'
import { useUiHistory } from '../../composables/useUiHistory'
import cashbackIcon from '/img/cashback-128.png'
import InstallButton from '../InstallButton.vue'

// open-close
const { getComputedDrawerVisible } = useUiHistory()
const visible = getComputedDrawerVisible('menu')
const openDrawer = () => visible.value = true
const onChangeVisible = (value: boolean) => visible.value = value

// menu items
const menuItems = ref([
  {
    label: 'Месяцы',
    items: [
      {
        label: 'Очистить прошедшие',
        icon: 'pi pi-trash',
        command: () => {},
      },
    ],
  },
  {
    label: 'Банки',
    items: [
      {
        label: 'Редактировать список',
        icon: 'pi pi-warehouse',
        command: () => onClickBanks(),
      },
    ],
  },
])


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
  width: 80vw !important;
  max-width: 25rem;

  .app-drawer-header {
    align-items: flex-start;
  }
  .drawer-header-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .app-drawer-content {
    padding: 0.75rem;
  }
  .app-drawer-menu {
    .p-menu-submenu-label {
      margin-top: 0.5rem;

      &:first-child {
        margin-top: 0;
      }
    }
  }
}

</style>