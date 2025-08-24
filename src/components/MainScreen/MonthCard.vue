<template>
  <Card
    class="month-card"
  >
    <template #header>
      <div class="month-card-header">
        <div><h3>{{ monthTitle }}</h3></div>
        <div>
          <Button
            icon="pi pi-ellipsis-v"
            severity="secondary"
            size="small"
            @click="menuToggle"
          />
          <Menu ref="menuRef" :model="menuItems" :popup="true" />
          <MonthEditDialog
            :isOpen="isMonthEditDialogOpen"
            :monthData="monthData"
            @toggle="onToggleMonthEditDialog"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="month-bank-items">
        <Card
          v-for="bank in monthData.monthBankItems"
          class="month-bank-item"
          :style="{
            backgroundColor: `var(--bank-color-${getBankDataFromId(bank.id, banks)?.colorId || 0})`
          }"
          @click="onClickBankItem(bank)"
        >
          <template #header>
            <div class="month-bank-item-title">{{ getBankDataFromId(bank.id, banks)?.name || '-' }}</div>
          </template>

          <template #content>
            <div class="month-bank-item-categories">
              <div v-for="category in bank.categories" :key="category.name" class="month-bank-item-category-item">
                <div class="month-bank-item-category-item__amount">{{ category.amount }}%</div>
                <div class="month-bank-item-category-item__name">{{ category.name }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <MonthBankItemEditDialog
        :isOpen="isBankItemEditDialogOpen"
        :month="props.monthData.id"
        :monthBankItem="(currentBankItemToEdit as MonthBankItem)"
        @toggle="onToggleBankItemEditDialog"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConfirm } from 'primevue'
import type Menu from 'primevue/menu'
import { useMonthsStore, type Month, type MonthBankItem } from '../../stores/monthsStore'
import { useBanksStore } from '../../stores/banksStore'
import {
  getMonthTitleFromId,
  getBankDataFromId,
} from '../../utils/common'
import MonthEditDialog from '../Dialogs/MonthEditDialog.vue'
import MonthBankItemEditDialog from '../Dialogs/MonthBankItemEditDialog.vue'
import dayjs from 'dayjs'

const props = defineProps({
  monthData: {
    type: Object as () => Month,
    required: true
  }
})

const confirm = useConfirm()
const banksStore = useBanksStore()
const monthsStore = useMonthsStore()
const banks = computed(() => banksStore.banksSorted)
const monthTitle = computed(() => getMonthTitleFromId(props.monthData.id, true))


// menu

const menuRef = ref<InstanceType<typeof Menu> | null>(null)
const menuItems = ref([
  { label: 'Редактировать', icon: 'pi pi-pencil', command: () => onToggleMonthEditDialog(true) },
  { label: 'Удалить', icon: 'pi pi-trash', command: () => onClickDeleteMonth() }
])
const menuToggle = (event: Event) => menuRef.value?.toggle(event)

// month edit dialog

const isMonthEditDialogOpen = ref(false)
const onToggleMonthEditDialog = (isOpen: boolean) => isMonthEditDialogOpen.value = isOpen


// delete confirmation

const onClickDeleteMonth = () => {
  const month = dayjs(props.monthData.id)
  const today = dayjs()
  const isCurrentOrFutureMonth = month.isSame(today, 'month') || month.isAfter(today, 'month')
  const deleteMonth = () => monthsStore.removeMonth(props.monthData.id)

  if (isCurrentOrFutureMonth) {
    confirm.require({
      message: 'Этот месяц ещё не закончился. Удалить его?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Отмена',
      },
      acceptProps: {
        label: 'Удалить',
        severity: 'danger',
      },
      accept: () => deleteMonth(),
    })
  } else {
    deleteMonth()
  }
}


// bank item edit dialog

const isBankItemEditDialogOpen = ref(false)
const onToggleBankItemEditDialog = (isOpen: boolean) => isBankItemEditDialogOpen.value = isOpen
const currentBankItemToEdit = ref<MonthBankItem>({ id: '', categories: [] })

const onClickBankItem = (bankItem: MonthBankItem) => {
  currentBankItemToEdit.value = bankItem
  onToggleBankItemEditDialog(true)
}
</script>

<style scoped lang="scss">
.month-card {
  width: calc(100vw - 5rem);
  min-width: calc(100vw - 5rem);
  font-size: 1.1rem;

  .month-card-header {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-size: 1.4rem;
    }
  }

  :deep(.p-card-body) {
    padding-top: 0;
  }

  .month-bank-item {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
    .month-bank-item-title {
      padding: 0.5rem 1rem;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .month-bank-item-categories {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;

      .month-bank-item-category-item {
        display: flex;
        align-items: center;

        .month-bank-item-category-item__amount {
          width: 3rem;
          font-weight: 600;
        }
      }
    }
  }
}
</style>