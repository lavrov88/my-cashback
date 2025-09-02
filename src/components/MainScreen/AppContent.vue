<template>
  <div id="app-content">
    <div v-if="months.length" class="month-cards">
      <MonthCard v-for="month in months" :key="month.id" :monthData="month" />
    </div>

    <div v-else class="months-empty-state">
      <div>
        <p>Список месяцев пока пуст.</p>
        <p>Нажмите на кнопку внизу, чтобы добавить первый месяц.</p>
      </div>
    </div>

    <div class="add-month-button-wrapper">
      <Button
        class="add-month-button"
        :class="{ 'first-month': !months.length }"
        icon="pi pi-plus"
        :label="months.length ? undefined : 'Добавить месяц'"
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
import { useMonthsStore } from '../../stores/monthsStore';
import MonthCard from './MonthCard.vue'
import MonthAddDialog from '../Dialogs/MonthAddDialog.vue';

const monthsStore = useMonthsStore()
const months = computed(() => monthsStore.months)
const monthAddDialog = ref<InstanceType<typeof MonthAddDialog> | null>(null)
const onToggleMonthAddDialog = () => monthAddDialog.value?.open()
</script>

<style scoped lang="scss">
#app-content {
  position: relative;
  width: 100vw;
  height: calc(100vh - 65px);
  background-color: var(--app-content-background);

  .month-cards {
    height: 100%;
    padding: 1rem 0.75rem 1.5rem 0.75rem;
    display: flex;
    align-items: start;
    flex-shrink: 0;
    gap: 1rem;
    overflow-x: scroll;
  }
  .months-empty-state {
    height: 100%;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-toolbar-color);
  }
  .add-month-button-wrapper {
    position: absolute;
    bottom: 2rem;
    right: 2rem;

    .add-month-button {
      width: 3.5rem;
      height: 3.5rem;

      &.first-month {
        width: auto;
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
    :deep(.p-button-icon) {
      font-size: 1.25rem;
    }
  }
}
</style>