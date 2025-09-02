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
          <Menu
            ref="menuRef"
            class="month-card-menu"
            :model="menuItems"
            :popup="true"
          />
          <MonthEditDialog
            :monthData="monthData"
            ref="monthEditDialogRef"
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
        :month="props.monthData.id"
        :monthBankItem="(currentBankItemToEdit as MonthBankItem)"
        ref="bankItemEditDialogRef"
      />
      <AppConfirmDialog ref="confirmRef" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import type Menu from 'primevue/menu'
import { useMonthsStore, type Month, type MonthBankItem } from '../../stores/monthsStore'
import { useBanksStore } from '../../stores/banksStore'
import {
  getMonthTitleFromId,
  getBankDataFromId,
} from '../../utils/common'
import MonthEditDialog from '../Dialogs/MonthEditDialog.vue'
import MonthBankItemEditDialog from '../Dialogs/MonthBankItemEditDialog.vue'
import AppConfirmDialog from '../Dialogs/AppConfirmDialog.vue'

interface Props {
  monthData: Month
}
const props = defineProps<Props>()

const banksStore = useBanksStore()
const monthsStore = useMonthsStore()
const banks = computed(() => banksStore.banksSorted)
const monthTitle = computed(() => getMonthTitleFromId(props.monthData.id, true))


// menu
const menuRef = ref<InstanceType<typeof Menu> | null>(null)
const menuItems = ref([
  { label: 'Редактировать', icon: 'pi pi-pencil', command: () => monthEditDialogRef.value?.open() },
  { label: 'Удалить', icon: 'pi pi-trash', command: () => onClickDeleteMonth() }
])
const menuToggle = (event: Event) => menuRef.value?.toggle(event)

// month edit dialog
const monthEditDialogRef = ref<InstanceType<typeof MonthEditDialog> | null>(null)

// delete confirmation
const confirmRef = ref<InstanceType<typeof AppConfirmDialog> | null>(null)
const onClickDeleteMonth = () => {
  const month = dayjs(props.monthData.id)
  const today = dayjs()
  const isCurrentOrFutureMonth = month.isSame(today, 'month') || month.isAfter(today, 'month')
  const deleteMonth = () => monthsStore.removeMonth(props.monthData.id)

  if (isCurrentOrFutureMonth) {
    confirmRef.value?.require({
      message: 'Этот месяц ещё не закончился. Удалить его?',
      acceptProps: {
        label: 'Удалить',
      },
      accept: () => deleteMonth(),
    })
  } else {
    deleteMonth()
  }
}


// bank item edit dialog

const bankItemEditDialogRef = ref<InstanceType<typeof MonthBankItemEditDialog> | null>(null)
const currentBankItemToEdit = ref<MonthBankItem>({ id: '', categories: [] })

const onClickBankItem = (bankItem: MonthBankItem) => {
  currentBankItemToEdit.value = bankItem
  bankItemEditDialogRef.value?.open()
}
</script>

<style scoped lang="scss">
.month-card {
  width: calc(100vw - 5rem);
  min-width: calc(100vw - 5rem);
  max-height: calc(100vh - 65px - 14px - 28px - 10px);
  font-size: 1.1rem;

  .month-card-header {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-size: 1.4rem;
      user-select: none;
    }
  }

  :deep(.p-card-body) {
    margin-bottom: 1.25rem;
    padding: 0 15px;
    overflow: auto;
  }

  .month-bank-item {
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
    .month-bank-item-title {
      padding: 0.5rem 0.75rem;
      font-size: 1.25rem;
      font-weight: 500;
    }
    :deep(.p-card-body) {
      padding: 0 15px;
      margin-bottom: 15px;
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
:deep(.month-card-menu .p-menu-item-link) {
  padding: 12px 20px !important;
}
</style>

<style lang="scss">
.month-card-menu .p-menu-item-link {
  padding: 15px;
}
</style>