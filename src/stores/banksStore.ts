import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useMonthsStore } from './monthsStore'

/** Тип записи банка */
export type Bank = {
  id: string
  name: string
  colorId: number
  sortOrder: number
}

export const useBanksStore = defineStore('banks', () => {
  const monthsStore = useMonthsStore()

  // state

  const banks = ref<Bank[]>([])

  // getters

  const banksSorted = computed(() =>
    [...banks.value].sort((a, b) => a.sortOrder - b.sortOrder)
  )

  // проверка, используется ли банк в каком-либо месяце
  const isBankUsed = (bankId: string) => {
    const months = monthsStore.months
    return months.some(m => m.monthBankItems.some(mbi => mbi.id === bankId))
  }

  // actions

  const _updateMonthBankItemsWithNewBanks = (updatedBanks: Bank[]) => {
    // убираем в месяцах удаленные банки и сортируем в соответствии с новыми sortOrder
    const months = monthsStore.months

    months.forEach(month => {
      const updatedMonthBankItems = month.monthBankItems
        .filter(mbi => updatedBanks.find(b => b.id === mbi.id))
        .sort((mbiA, mbiB) => {
          const bankA = updatedBanks.find(bank => bank.id === mbiA.id)
          const bankB = updatedBanks.find(bank => bank.id === mbiB.id)
          return (bankA?.sortOrder || 0) - (bankB?.sortOrder || 0)
        })

      monthsStore.updateMonth({
        id: month.id,
        monthBankItems: updatedMonthBankItems,
      })
    })
  }

  const updateBanks = (newBanks: Bank[]) => {
    const updatedBanks = newBanks.map((nb, idx) => ({ ...nb, sortOrder: idx }))
    // const oldBanks = [ ...banks.value ]
    // const removedBanks = oldBanks.filter(ob => !newBanks.find(nb => nb.id === ob.id))

    _updateMonthBankItemsWithNewBanks(updatedBanks)

    banks.value = [ ...updatedBanks ]
  }


  // function addBank(payload: { id?: string; name: string; colorId?: number; sortOrder?: number }): Bank {
  //   const id = payload.id ?? generateId()
  //   const currentMax = banks.value.length ? Math.max(...banks.value.map(b => b.sortOrder)) : -1
  //   const sortOrder = payload.sortOrder ?? currentMax + 1

  //   const bank: Bank = {
  //     id,
  //     name: payload.name,
  //     colorId: payload.colorId ?? null,
  //     sortOrder
  //   }
  //   banks.value.push(bank)
  //   return bank
  // }

  // function editBank(id: string, updates: Partial<Omit<Bank, 'id'>>): boolean {
  //   const idx = banks.value.findIndex(b => b.id === id)
  //   if (idx === -1) return false

  //   const existing = banks.value[idx]
  //   banks.value[idx] = {
  //     ...existing,
  //     ...updates
  //   }
  //   return true
  // }

  // function removeBank(id: string): boolean {
  //   const idx = banks.value.findIndex(b => b.id === id)
  //   if (idx === -1) return false
  //   banks.value.splice(idx, 1)
  //   return true
  // }

  // function setBanks(newBanks: Bank[]) {
  //   banks.value = [...newBanks]
  // }

  // function updateSortOrderByIdList(orderIds: string[]) {
  //   const mapIndex = new Map<string, number>()
  //   orderIds.forEach((id, idx) => mapIndex.set(id, idx))

  //   const known: Bank[] = []
  //   const unknown: Bank[] = []

  //   for (const b of banks.value) {
  //     if (mapIndex.has(b.id)) known.push(b)
  //     else unknown.push(b)
  //   }

  //   // Сортируем известные в соответствии с orderIds
  //   known.sort((a, b) => (mapIndex.get(a.id)! - mapIndex.get(b.id)!))

  //   // Переназначаем sortOrder: сначала known, затем unknown (keep their relative order)
  //   const next: Bank[] = []
  //   known.forEach((b, idx) => next.push({ ...b, sortOrder: idx }))
  //   unknown.forEach((b, idx) => next.push({ ...b, sortOrder: known.length + idx }))

  //   banks.value = next
  // }

  return {
    // state
    banks,

    // getters
    banksSorted,
    isBankUsed,

    // actions
    updateBanks,
    // addBank,
    // editBank,
    // removeBank,
    // setBanks,
    // updateSortOrderByIdList
  }
})
