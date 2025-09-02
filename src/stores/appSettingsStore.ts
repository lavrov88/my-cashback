import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppSettingsStore = defineStore('appSettings', () => {
  const isOpenBanksEditDialog = ref(false)

  return {
    isOpenBanksEditDialog
  }
})