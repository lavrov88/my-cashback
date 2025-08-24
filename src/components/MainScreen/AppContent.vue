<template>
  <div id="app-content">
    <div class="month-cards">
      <MonthCard v-for="month in months" :key="month.id" :monthData="month" />
    </div>

    <div class="add-month-button-wrapper">
      <Button
        class="add-month-button"
        icon="pi pi-plus"
        rounded
        raised
        @click="onToggleMonthAddDialog"
      />
      <MonthAddDialog ref="monthAddDialog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MonthCard from './MonthCard.vue'

const monthAddDialog = ref<InstanceType<typeof MonthAddDialog> | null>(null)
const onToggleMonthAddDialog = () => monthAddDialog.value?.open()


/* TEST DATA */
import { useBanksStore } from '../../stores/banksStore';
import { useMonthsStore } from '../../stores/monthsStore';
import MonthAddDialog from '../Dialogs/MonthAddDialog.vue';

const banksStore = useBanksStore()
const banks = computed(() => banksStore.banksSorted)

if (banks.value.length === 0) {
  banksStore.updateBanks([
    { id: '1', name: 'Сбер', colorId: 1, sortOrder: 0 },
    { id: '2', name: 'Т-Банк', colorId: 2, sortOrder: 1 },
    { id: '3', name: 'ВТБ', colorId: 4, sortOrder: 2 },
    { id: '4', name: 'Альфа-Банк', colorId: 3, sortOrder: 3 },
  ])
}

const monthsStore = useMonthsStore()
const months = computed(() => monthsStore.months)

if (months.value.length === 0) {
  monthsStore._addMonth({
    id: '2025-09',
    monthBankItems: [
      { id: '1', categories: [{ id: '1', name: 'Хозтовары', amount: 15 }, { id: '2', name: 'Музеи', amount: 5 }] },
      { id: '2', categories: [{ id: '3', name: 'Супермаркеты', amount: 3 }, { id: '4', name: 'ЖКХ', amount: 5 }] },
    ],
  })

  monthsStore._addMonth({
    id: '2025-08',
    monthBankItems: [
      { id: '1', categories: [{ id: '1', name: 'Хозтовары', amount: 15 }, { id: '2', name: 'Музеи', amount: 5 }] },
      { id: '2', categories: [{ id: '3', name: 'Супермаркеты', amount: 3 }, { id: '4', name: 'ЖКХ', amount: 5 }] },
    ],
  })
}

</script>

<style scoped lang="scss">
#app-content {
  position: relative;
  width: 100vw;
  height: calc(100vh - 65px);
  background-color: var(--app-content-background);

  .month-cards {
    height: 100%;
    padding: 1rem 1rem 2rem 1rem;
    display: flex;
    align-items: start;
    flex-shrink: 0;
    gap: 1.5rem;
    overflow-x: scroll;
  }

  .add-month-button-wrapper {
    position: absolute;
    bottom: 2rem;
    right: 2rem;

    .add-month-button {
      width: 3.5rem;
      height: 3.5rem;
    }
    :deep(.p-button-icon) {
      font-size: 1.25rem;
    }
  }
}
</style>