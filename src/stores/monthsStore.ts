import { computed, ref } from "vue"
import { defineStore } from "pinia"

export type Month = {
  id: string
  monthBankItems: MonthBankItem[]
}

export type MonthBankItem = {
  id: string
  categories: CategoryItem[]
}

export type CategoryItem = {
  id: string
  amount: number
  name: string
}

export const useMonthsStore = defineStore('months', () => {

  // state

  const months = ref<Month[]>([])


  // getters

  const getLastMonth = computed(() => months.value[0])


  // actions - month

  const _addMonth = (payload: Month) => {
    months.value = [...months.value, payload].sort((a, b) => b.id.localeCompare(a.id))
  }

  const addEmptyMonth = (id: string) => _addMonth({ id, monthBankItems: [] })

  const addMonthWithBanks = (id: string) => {
    const lastMonth = getLastMonth.value
    const newMonth: Month = { id, monthBankItems: [] }

    newMonth.monthBankItems = lastMonth.monthBankItems.map(mbi => ({
      id: mbi.id,
      categories: [],
    }))

    _addMonth(newMonth)
  }

  const addMonthWithBanksAndCategories = (id: string) => {
    const lastMonth = getLastMonth.value
    const newMonth: Month = { id, monthBankItems: [] }

    newMonth.monthBankItems = lastMonth.monthBankItems.map(mbi => ({
      id: mbi.id,
      categories: mbi.categories.map(c => ({
        id: c.id,
        amount: c.amount,
        name: c.name,
      })),
    }))

    _addMonth(newMonth)
  }

  const updateMonth = (payload: Month) => {
    const idx = months.value.findIndex(m => m.id === payload.id)
    if (idx === -1) return false
    months.value[idx] = payload
    return true
  }

  const removeMonth = (id: string) => {
    const idx = months.value.findIndex(m => m.id === id)
    if (idx === -1) return false
    months.value.splice(idx, 1)
    return true
  }


  // actions - month bank item

  const updateMonthBankItem = (month: string, monthBankItem: MonthBankItem) => {
    const idx = months.value.findIndex(m => m.id === month)
    if (idx === -1) return false
    months.value[idx].monthBankItems = months.value[idx].monthBankItems.map(mbi => mbi.id === monthBankItem.id ? monthBankItem : mbi)
    return true
  }

  return {
    months,

    _addMonth, // потом убрать
    addEmptyMonth,
    addMonthWithBanks,
    addMonthWithBanksAndCategories,

    updateMonth,
    removeMonth,

    updateMonthBankItem,
  }
})