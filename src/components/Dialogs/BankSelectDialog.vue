<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissableMask
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
import { useUiHistory } from '../../composables/useUiHistory'

const banks = useBanksStore().banksSorted
const filteredBanks = computed(() => banks.filter(bank => !props.bankIdsToFilter.includes(bank.id)))

interface Props {
  bankIdsToFilter: string[]
}
const props = defineProps<Props>()
const emit = defineEmits(['select'])

// open-close
const { getComputedVisible } = useUiHistory()
const visible = getComputedVisible('bankSelect')
const openDialog = () => visible.value = true

const onClickBankItem = (id: string) => {
  emit('select', id)
  visible.value = false
}

defineExpose({ open: openDialog })

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