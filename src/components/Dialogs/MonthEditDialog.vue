<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="dialogTitle"
    :closable="false"
    class="month-edit-dialog"
  >

  <div class="month-edit-dialog-content">
    <div class="month-bank-items">
      <Card
        v-for="bank in currentMonthBankItems"
        :key="bank.id"
        class="month-bank-item"
      >
        <template #header>
          <div class="month-bank-item-header">
            <div
              class="month-bank-item-title"
              :style="{ backgroundColor: `var(--bank-color-${getBankDataFromId(bank.id, banks)?.colorId || 0})` }"
            >
              {{ getBankDataFromId(bank.id, banks)?.name || '-' }}
            </div>
            <div class="delete-button-wrapper">
              <Button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                class="delete-button"
                @click="onClickDeleteBank(bank.id)"
              />
            </div>
          </div>
        </template>
        <template #content>
          <div class="month-bank-item-categories">
            <MonthBankItemEditForm
              :bankId="bank.id"
              :categories="bank.categories"
              ref="bankItemEditFormRefs"
            />
          </div>
        </template>
      </Card>
    </div>

    <div class="add-bank-section">
      <Button
        label="Добавить банк"
        icon="pi pi-plus"
        severity="secondary"
        :style="{ width: '100%' }"
        @click="onClickAddBank"
      />
      <BankSelectDialog
        :isOpen="isBankSelectDialogOpen"
        :bankIdsToFilter="currentMonthBankItems.map(item => item.id)"
        @toggle="onToggleBankSelectDialog"
        @select="onAddBank"
      />
    </div>
  </div>

  <template #footer>
    <div class="footer-buttons">
      <Button label="Отмена" text severity="secondary" @click="visible = false" />
      <Button label="Сохранить" @click="onClickSave" />
    </div>
  </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { Card } from 'primevue';
import type { Month } from '../../stores/monthsStore'
import { useBanksStore } from '../../stores/banksStore';
import { useMonthsStore } from '../../stores/monthsStore';
import MonthBankItemEditForm from './MonthBankItemEditForm.vue';
import {
  getMonthTitleFromId,
  getBankDataFromId,
  sortBanksByIds,
} from '../../utils/common';
import BankSelectDialog from './BankSelectDialog.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  monthData: {
    type: Object as () => Month,
    required: true
  }
})
const emit = defineEmits(['toggle'])

const visible = computed({
  get: () => props.isOpen,
  set: (value) => emit('toggle', value)
})

const banks = computed(() => useBanksStore().banksSorted)

const dialogTitle = computed(() => getMonthTitleFromId(props.monthData.id, true))

const currentMonthBankItems = ref([ ...props.monthData.monthBankItems ])
watch(() => props.isOpen, () => {
  currentMonthBankItems.value = [ ...props.monthData.monthBankItems ]
})

const bankItemEditFormRefs = ref<InstanceType<typeof MonthBankItemEditForm>[]>([])

const onClickDeleteBank = (bankId: string) => {
  currentMonthBankItems.value = currentMonthBankItems.value.filter(item => item.id !== bankId)
}


// banks select
const isBankSelectDialogOpen = ref(false)
const onToggleBankSelectDialog = (value: boolean) => {
  isBankSelectDialogOpen.value = value
}

const onClickAddBank = () => onToggleBankSelectDialog(true)

const onAddBank = (bankId: string) => {
  currentMonthBankItems.value = [...currentMonthBankItems.value, reactive({
    id: bankId,
    categories: []
  })]
    .sort((a, b) => sortBanksByIds(a.id, b.id, banks.value)) // помещаем добавленный банк на свое место, согласно sortOrder
}

const onClickSave = () => {
  const updatedBankItems = bankItemEditFormRefs.value.map(form => ({
    id: form.bankId,
    categories: form.editedCategories
  }))
  useMonthsStore().updateMonth({id: props.monthData.id, monthBankItems: updatedBankItems})
  visible.value = false
}
</script>

<style lang="scss">
.month-edit-dialog {
  width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);

  .month-bank-item-header {
    padding: 0.75rem;
    padding-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .month-bank-item-title {
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .delete-button {
      width: 30px;
    }
  }

  .month-edit-dialog-content {
    .month-bank-item {
      margin-bottom: 1rem;
      border: 1px solid var(--p-inputtext-border-color);

      .p-card-body {
        padding: 0.75rem !important;
      }
    }

    .add-bank-section {
      margin-top: 1.5rem;
    }
  }

  .footer-buttons {
    padding-top: 20px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>