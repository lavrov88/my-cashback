<script setup lang="ts">

</script>

<template>
  <ConfirmDialog
    :pt="{
      root: {
        style: { width: 'calc(100vw - 1rem)' }, // устанавливаем ширину
      },
      pcCloseButton: {
        root: {
          style: 'display: none', // скрываем кнопку закрытия
        }
      },
      pcRejectButton: {
        root: {
          class: 'p-button-secondary p-button-text', // устанавливаем стили кнопки отмены
        }
      }
    }"
  />
</template>