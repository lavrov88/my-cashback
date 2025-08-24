<template>
  <Dialog
    v-model:visible="visible"
    class="app-confirm-dialog"
    :header="header"
    modal
    :closable="false"
  >
    <div class="app-confirm-dialog-content">
      <span class="pi pi-exclamation-triangle confirm-icon"></span>
      <div class="message">{{ message }}</div>
    </div>

    <template #footer>
      <div class="footer-buttons">
        <Button
          :label="rejectLabel"
          text
          severity="secondary"
          @click="onCancel"
        />
        <Button
          :label="acceptLabel"
          :severity="acceptSeverity"
          @click="onAccept"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUiHistory } from '../../composables/useUiHistory'

// open-close
const { getComputedVisible } = useUiHistory()
const visible = getComputedVisible('confirm')

// options
const header = ref('Подтверждение')
const message = ref('')
const rejectLabel = ref('Отмена')
const acceptLabel = ref('Подтвердить')
const acceptSeverity = ref('danger')
const accept = ref(() => {})

type ConfirmRequire = (
  options: {
    header?: string
    message: string
    rejectProps?: {
      label?: string
    };
    acceptProps?: {
      label?: string
      severity?: string
    };
    accept?: () => void
  }
) => void

const require: ConfirmRequire = (options) => {
  header.value = options.header || 'Подтверждение'
  message.value = options.message
  rejectLabel.value = options.rejectProps?.label || 'Отмена'
  acceptLabel.value = options.acceptProps?.label || 'Удалить'
  acceptSeverity.value = options.acceptProps?.severity || 'danger'
  accept.value = options.accept || (() => {})

  visible.value = true
}

const onCancel = () => {
  visible.value = false
}

const onAccept = () => {
  visible.value = false
  accept.value()
}

defineExpose({ require })

</script>

<style lang="scss">
.app-confirm-dialog {
  width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);

  .app-confirm-dialog-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .confirm-icon {
    font-size: 2rem;
  }
  .footer-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

</style>