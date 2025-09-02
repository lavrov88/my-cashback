<template>
  <Select
    :options="options"
    :modelValue="props.value"
    optionValue="id"
    :pt="{
      root: getRootPt,
      dropdown: {
        style: { display: 'none' }
      },
      overlay: {
        class: 'bank-color-select-overlay'
      },
      listContainer: {
        style: { maxHeight: 'max-content' },
      },
    }"
    @update:modelValue="emit('update:value', $event)"
  >
    <template #value>
      <div class="bank-color-select-value"></div>
    </template>

    <template #option="slotProps">
      <div
        class="bank-color-select-option"
        :style="{ backgroundColor: `var(--bank-color-${slotProps.option.id})` }"
      >
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BANK_COLORS } from '../../utils/consts'

interface Props {
  value: number
}
const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const options = ref([ ...BANK_COLORS ])

const getRootPt = (options: any) => {
  const colorId = options.state.d_value || 0
  return {
    style: { backgroundColor: `var(--bank-color-${colorId})` }
  }
}

</script>

<style lang="scss">
.bank-color-select-value {
  width: 12px;
  height: 20px;
}

.bank-color-select-overlay {
  .p-select-list {
    gap: 0.25rem;
  }
  .p-select-option {
    padding: 0;
    border-radius: 6px;
  }
  .bank-color-select-option {
    width: 100%;
    height: 30px;
  }
}
</style>