<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Добавить месяц"
    :closable="false"
    class="month-add-dialog"
  >

  <div class="month-add-dialog-content">
    <div class="datepicker-wrapper">
      <DatePicker
        :modelValue="date"
        :inline="true"
        view="month"
        :disabled="selectedVariant !== 'custom'"
        :pt="{
          month: ptMonth,
        }"
        @update:modelValue="onChangeMonth"
      />
    </div>

    <div class="month-add-variants-wrapper">
      <div class="month-add-variants">
        <div class="month-add-variant">
          <RadioButton
            v-model="selectedVariant"
            :disabled="isCurrentMonthDisabled"
            size="large"
            name="monthAddVariant"
            inputId="current"
            value="current"
          />
          <label for="current" :class="{ disabled: isCurrentMonthDisabled }">
            Текущий
            <span v-if="isCurrentMonthDisabled" class="disabled-comment">(уже есть)</span>
          </label>
        </div>
        <div class="month-add-variant">
          <RadioButton
            v-model="selectedVariant"
            :disabled="isNextMonthDisabled"
            size="large"
            name="monthAddVariant"
            inputId="next"
            value="next"
          />
          <label for="next" :class="{ disabled: isNextMonthDisabled }">
            Следующий
            <span v-if="isNextMonthDisabled" class="disabled-comment">(уже есть)</span>
          </label>
        </div>
        <div class="month-add-variant">
          <RadioButton
            v-model="selectedVariant"
            size="large"
            name="monthAddVariant"
            inputId="custom"
            value="custom"
          />
          <label for="custom">Другой</label>
        </div>
      </div>
    </div>
  </div>

  <template #footer>
    <div class="footer-buttons">
      <Button
        label="Отмена"
        text
        severity="secondary"
        @click="visible = false"
      />
      <SplitButton
        :disabled="!date"
        :model="monthAddItems"
        label="Добавить"
        class="p-button-text"
        @click="addMonth('empty')"
      />
    </div>
  </template>
  </Dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, nextTick, ref, watch } from 'vue'
import { useMonthsStore } from '../../stores/monthsStore';

// props
interface Props {
  isOpen: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['toggle'])

const visible = computed({
  get: () => props.isOpen,
  set: (value) => emit('toggle', value)
})
watch(() => props.isOpen, () => {
  // действия при открытии диалога
  if (!isCurrentMonthDisabled.value) {
    selectedVariant.value = 'current'
    date.value = dayjs().startOf('month').toDate()
  } else if (!isNextMonthDisabled.value) {
    selectedVariant.value = 'next'
    date.value = dayjs().add(1, 'month').startOf('month').toDate()
  } else {
    selectedVariant.value = 'custom'
    date.value = null
  }
})

// date
const date = ref<Date | null>(null)

// variants
type MonthAddVariants = 'current' | 'next' | 'custom'
const selectedVariant = ref<MonthAddVariants>('current')
const isCurrentMonthDisabled = computed(() => disabledMonths.value.includes(dayjs().format('YYYY-MM')))
const isNextMonthDisabled = computed(() => disabledMonths.value.includes(dayjs().add(1, 'month').format('YYYY-MM')))

watch(() => selectedVariant.value, () => {
  // переключаем выбранный месяц при смене варианта
  if (selectedVariant.value === 'current') {
    date.value = dayjs().startOf('month').toDate()
  }
  if (selectedVariant.value === 'next') {
    date.value = dayjs().add(1, 'month').startOf('month').toDate()
  }
})

// disabled months
const monthsStore = useMonthsStore()
const disabledMonths = computed(() => monthsStore.months.map((m) => m.id))

// datepicker
const ptMonth = (
  options: {
    state: { currentYear: number },
    context: { monthIndex: number },
  }
) => {
  // визуально выделяем недоступные месяцы
  const year = options.state.currentYear
  let month = String(options.context.monthIndex + 1)

  if (month.length === 1) {
    month = `0${month}`
  }

  const monthStr = `${year}-${month}`
  if (disabledMonths.value.includes(monthStr)) {
    return { class: 'disabled-month' }
  }
}

const onChangeMonth = async (value: Date | Date[] | (Date | null)[] | null | undefined) => {
  // откатываем на предыдущее значение, если выбран недоступный месяц
  const previousDate = date.value ? dayjs(date.value).toDate() : null

  if (!value || Array.isArray(value)) {
    // проверка на некорректные значения
    await nextTick()
    date.value = previousDate
    return
  }

  const monthStr = dayjs(value).format('YYYY-MM')
  await nextTick()
  if (disabledMonths.value.includes(monthStr)) {
    date.value = previousDate
  } else {
    date.value = value
  }
}

// month add actions

type MonthAddActionTypes = 'empty' | 'withBanks' | 'withBanksAndCategories'

const addMonth = (type: MonthAddActionTypes) => {
  if (!date.value) {
    return
  }
  const dateStr = dayjs(date.value).format('YYYY-MM')

  switch (type) {
    case 'empty':
      monthsStore.addEmptyMonth(dateStr)
      break
    case 'withBanks':
      monthsStore.addMonthWithBanks(dateStr)
      break
    case 'withBanksAndCategories':
      monthsStore.addMonthWithBanksAndCategories(dateStr)
      break
  }

  visible.value = false
}

const monthAddItems = [
  { label: 'Пустой месяц', command: () => addMonth('empty') },
  { separator: true },
  { label: 'С банками из последнего месяца', command: () => addMonth('withBanks') },
  { separator: true },
  { label: 'С банками и категориями из последнего месяца', command: () => addMonth('withBanksAndCategories') },
]

</script>

<style lang="scss">
.month-add-dialog {
  width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);

  .month-add-variants-wrapper {
    margin-top: 0.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .month-add-variants {
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .month-add-variant {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label.disabled {
      opacity: 0.6;

      .disabled-comment {
        font-size: 0.8rem;
        opacity: 0.7;
      }
    }
  }
  .datepicker-wrapper {
    margin-bottom: 2rem;
    width: 100%;
    height: 250px;
    display: flex;
    justify-content: center;

    .p-datepicker-title {
      .p-datepicker-select-year {
        font-size: 1rem;
        font-family: 'Inter', sans-serif;
      }
    }
    .p-datepicker-month {
      line-height: 1.8;
      transition: none;

      &.disabled-month {
        opacity: 0.4;
        color: var(--p-datepicker-date-color); // чтобы не менялся при клике
        background: none !important; // чтобы не было миганий
      }
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