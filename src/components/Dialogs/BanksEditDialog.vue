<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Список банков"
    :closable="false"
    class="banks-edit-dialog"
  >

  <div class="banks-edit-dialog-content">
    <div class="bank-item-edit-form">
      <div
        v-for="(bank, idx) in editedBanks"
        :key="bank.id"
        class="bank-item"
      >
        <BanksEditColorSelector
          :value="editedBanks[idx].colorId"
          @update:value="editedBanks[idx].colorId = $event"
        />

        <InputText
          class="bank-item-name"
          :modelValue="bank.name"
          @update:modelValue="editedBanks[idx].name = $event || ''"
        />

        <Button
          v-if="idx === 0"
          icon="pi pi-angle-down"
          severity="secondary"
          class="bank-item-button double"
          @click="onClickMoveDown(bank.id)"
        />
        <ButtonGroup v-if="idx !== 0 && idx !== editedBanks.length - 1">
          <Button
            :disabled="idx === 0"
            icon="pi pi-angle-up"
            severity="secondary"
            class="bank-item-button"
            @click="onClickMoveUp(bank.id)"
          />
          <Button
            :disabled="idx === editedBanks.length - 1"
            icon="pi pi-angle-down"
            severity="secondary"
            class="bank-item-button"
            @click="onClickMoveDown(bank.id)"
          />
        </ButtonGroup>
        <Button
          v-if="idx === editedBanks.length - 1"
          icon="pi pi-angle-up"
          severity="secondary"
          class="bank-item-button double"
          @click="onClickMoveUp(bank.id)"
        />

        <Button
          icon="pi pi-times"
          variant="text"
          class="bank-item-button delete-button"
          @click="onClickDelete(bank.id)"
        />
      </div>

      <div class="add-category-section">
        <Button
          label="Добавить банк"
          icon="pi pi-plus"
          severity="secondary"
          :style="{ width: '100%' }"
          @click="onClickAdd"
        />
      </div>
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
import { computed, ref, watch } from 'vue'
import { useConfirm } from 'primevue'
import { useBanksStore } from '../../stores/banksStore'
import {
  generateId,
  moveArrElement,
} from '../../utils/common'
import BanksEditColorSelector from './BanksEditColorSelector.vue'

interface Props {
  isOpen: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['toggle'])

const confirm = useConfirm()

const visible = computed({
  get: () => props.isOpen,
  set: (value) => emit('toggle', value)
})

const banks = computed(() => useBanksStore().banksSorted)
const editedBanks = ref(banks.value.map(b => ({ ...b })))
watch(() => props.isOpen, () => {
  editedBanks.value = banks.value.map(b => ({ ...b }))
})

const onClickMoveUp = (id: string) => editedBanks.value = moveArrElement(editedBanks.value, id, 'up')
const onClickMoveDown = (id: string) => editedBanks.value = moveArrElement(editedBanks.value, id, 'down')

const onClickAdd = () => {
  let maxSortOrder = 0
  editedBanks.value.forEach(b => maxSortOrder = Math.max(maxSortOrder, b.sortOrder || 0))

  editedBanks.value = [
    ...editedBanks.value,
    {
      id: generateId(),
      name: '',
      colorId: 0,
      sortOrder: maxSortOrder + 1,
    }
  ]
}

const onClickDelete = (id: string) => {
  const isBankUsed = useBanksStore().isBankUsed(id)
  const deleteBank = (id: string) => editedBanks.value = editedBanks.value.filter(b => b.id !== id)

  if (isBankUsed) {
    confirm.require({
      message: 'Категории банка будут также удалены из всех месяцев, где они есть. Удалить банк?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Отмена',
      },
      acceptProps: {
        label: 'Удалить',
        severity: 'danger',
      },
      accept: () => deleteBank(id),
    })
  } else {
    deleteBank(id)
  }
}

const onClickSave = () => {
  useBanksStore().updateBanks(editedBanks.value)
  visible.value = false
}
</script>

<style lang="scss">
.banks-edit-dialog {
  width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);

  .bank-item {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .bank-color-button {
      width: 38px;
      height: 38px;
    }

    .bank-item-name {
      width: 100%;
    }

    .bank-item-button {
      width: 25px;

      &.double {
        min-width: 50px;
      }
      &.delete-button {
        min-width: 30px;
        color: var(--p-dialog-color);
      }
    }
  }
}
</style>