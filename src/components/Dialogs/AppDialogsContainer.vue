<template>
  <BanksEditDialog ref="banksEditDialogRef" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppSettingsStore } from '../../stores/appSettingsStore'
import BanksEditDialog from './BanksEditDialog.vue'

const appSettings = useAppSettingsStore()
const isOpenBanksEditDialog = computed(() => appSettings.isOpenBanksEditDialog)
const banksEditDialogRef = ref<InstanceType<typeof BanksEditDialog> | null>(null)

watch(
  () => isOpenBanksEditDialog.value,
  () => {
    if (isOpenBanksEditDialog.value) {
      banksEditDialogRef.value?.open()
    }
  }
)
</script>