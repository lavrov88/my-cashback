<template>
  <Drawer
    :visible="visible"
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

  <BanksEditDialog :isOpen="isBanksOpen" @toggle="isBanksOpen = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BanksEditDialog from '../Dialogs/BanksEditDialog.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const onChangeVisible = (value: boolean) => {
  emit('change', value)
}

// banks
const isBanksOpen = ref(false)
const onClickBanks = () => {
  isBanksOpen.value = true
  onChangeVisible(false)
}
</script>

<style scoped>
.drawer-menu-item {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>