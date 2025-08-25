<template>
  <div class="bank-item-edit-form">
    <div
      v-for="(category, idx) in editedCategories"
      :key="category.id"
      class="category-item"
    >
        <InputNumber
          class="category-item-amount"
          :modelValue="category.amount"
          :min="0"
          :max="100"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          suffix="%"
          @update:modelValue="editedCategories[idx].amount = $event"
        />
        <InputText
          class="category-item-name"
          :modelValue="category.name"
          @update:modelValue="editedCategories[idx].name = $event || ''"
        />

        <Button
          v-if="editedCategories.length > 1 && idx === 0"
          icon="pi pi-angle-down"
          severity="secondary"
          class="category-item-button double"
          @click="onClickMoveDown(category.id)"
        />
        <ButtonGroup v-if="idx !== 0 && idx !== editedCategories.length - 1">
          <Button
            :disabled="idx === 0"
            icon="pi pi-angle-up"
            severity="secondary"
            class="category-item-button"
            @click="onClickMoveUp(category.id)"
          />
          <Button
            :disabled="idx === editedCategories.length - 1"
            icon="pi pi-angle-down"
            severity="secondary"
            class="category-item-button"
            @click="onClickMoveDown(category.id)"
          />
        </ButtonGroup>
        <Button
          v-if="editedCategories.length > 1 && idx === editedCategories.length - 1"
          icon="pi pi-angle-up"
          severity="secondary"
          class="category-item-button double"
          @click="onClickMoveUp(category.id)"
        />

        <Button
          icon="pi pi-times"
          variant="text"
          class="category-item-button delete-button"
          @click="onClickDelete(category.id)"
        />
    </div>

    <div class="add-category-section">
      <Button
        label="Добавить категорию"
        icon="pi pi-plus"
        severity="secondary"
        :style="{ width: '100%', height: '42px' }"
        @click="onClickAdd"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CategoryItem } from '../../stores/monthsStore';
import { generateId, moveArrElement } from '../../utils/common';

interface Props {
  bankId: string,
  categories: CategoryItem[],
}
const props = defineProps<Props>()

const editedCategories = ref<CategoryItem[]>([ ...props.categories ])

const onClickMoveUp = (id: string) => editedCategories.value = moveArrElement(editedCategories.value, id, 'up')
const onClickMoveDown = (id: string) => editedCategories.value = moveArrElement(editedCategories.value, id, 'down')
const onClickDelete = (id: string) => editedCategories.value = editedCategories.value.filter(c => c.id !== id)

const onClickAdd = () => {
  editedCategories.value = [...editedCategories.value, { id: generateId(), amount: 0, name: '' }]
}

watch(() => props.categories, () => {
  editedCategories.value = [...props.categories]
})

defineExpose({
  bankId: props.bankId,
  editedCategories,
})
</script>

<style scoped lang="scss">
.category-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .category-item-amount {
    :deep(input) {
      width: 45px;
      padding-inline: 0.5rem;
    }
  }
  .category-item-name {
    width: 100%;
  }
  .category-item-button {
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
.add-category-section {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>