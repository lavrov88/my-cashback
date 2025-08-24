<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    class="month-bank-item-edit-dialog"
  >
    <template #header>
      <div class="month-bank-item-edit-dialog-header">
        <div class="bank-title" :style="{ backgroundColor: bankTitleColor }">{{ bankTitle }}</div>
        <div>{{ monthTitle }}</div>
      </div>
    </template>


  <div class="month-bank-item-edit-dialog-content">
    <BankItemEditForm
      :bankId="monthBankItem.id"
      :categories="monthBankItem.categories"
      ref="bankItemEditFormRef"
    />
  </div>

  <template #footer>
    <div class="footer-buttons">
      <Button label="Отмена" text severity="secondary" @click="visible = false" autofocus />
      <Button label="Сохранить" @click="onClickSave" autofocus />
    </div>
  </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMonthsStore, type MonthBankItem } from '../../stores/monthsStore'
import { useBanksStore } from '../../stores/banksStore'
import { getMonthTitleFromId, getBankDataFromId } from '../../utils/common';
import BankItemEditForm from './MonthBankItemEditForm.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  month: {
    type: String,
    required: true,
  },
  monthBankItem: {
    type: Object as () => MonthBankItem,
    required: true,
  }
})

const emit = defineEmits(['toggle'])

const monthsStore = useMonthsStore()
const banks = computed(() => useBanksStore().banksSorted)

const visible = computed({
  get: () => props.isOpen,
  set: (value) => emit('toggle', value)
})

const bank = computed(() => getBankDataFromId(props.monthBankItem.id, banks.value))
const bankTitleColor = computed(() => `var(--bank-color-${bank.value?.colorId})`)
const bankTitle = computed(() => bank.value?.name)
const monthTitle = computed(() => getMonthTitleFromId(props.month))

const bankItemEditFormRef = ref<InstanceType<typeof BankItemEditForm> | null>(null)

const onClickSave = () => {
  console.log(bankItemEditFormRef.value?.editedCategories)
  const updatedItems = bankItemEditFormRef.value?.editedCategories

  if (updatedItems) {
    monthsStore.updateMonthBankItem(props.month, { id: props.monthBankItem.id, categories: updatedItems })
    visible.value = false
  }
}
</script>

<style lang="scss">
.month-bank-item-edit-dialog {
  width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);

  .month-bank-item-edit-dialog-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;

    .bank-title {
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-size: 1.25rem;
      font-weight: 600;
    }
  }
  .month-bank-item-edit-dialog-content {
    height: 100%;
  }
  .footer-buttons {
    padding-top: 20px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>