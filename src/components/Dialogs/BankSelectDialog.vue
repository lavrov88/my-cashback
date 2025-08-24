<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    class="bank-select-dialog"
  >
    <Listbox
      :options="filteredBanks"
      optionLabel="name"
      optionValue="id"
      @value-change="onClickBankItem"
    >
      <template #option="slotProps">
        <div class="bank-select-option">
          <div
            class="bank-select-option__color"
            :style="{ backgroundColor: `var(--bank-color-${slotProps.option.colorId})` }"
          ></div>
          {{ slotProps.option.name }}
        </div>
      </template>
    </Listbox>

    <template #footer>
      <div class="footer-buttons">
        <Button label="Отмена" text severity="secondary" @click="visible = false" autofocus />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBanksStore } from '../../stores/banksStore';

const banks = useBanksStore().banksSorted
const filteredBanks = computed(() => banks.filter(bank => !props.bankIdsToFilter.includes(bank.id)))

interface Props {
  isOpen: boolean
  bankIdsToFilter: string[]
}
const props = defineProps<Props>()
const emit = defineEmits(['toggle', 'select'])

const visible = computed({
  get: () => props.isOpen,
  set: (value) => emit('toggle', value)
})

const onClickBankItem = (id: string) => {
  emit('select', id)
  visible.value = false
}
</script>

<style lang="scss">
.bank-select-dialog {
  width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);

  .p-dialog-header {
    padding-top: 0;
  }
  .bank-select-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .bank-select-option__color {
      width: 20px;
      height: 20px;
      border-radius: 6px;
    }
  }
  .footer-buttons {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>