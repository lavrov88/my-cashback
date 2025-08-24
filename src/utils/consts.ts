// привязка цветов к id банков происходит в файле banks-colors.css

type BankColor = {
  id: number
}

const COLORS_COUNT = 6
let i = 0
export const BANK_COLORS: BankColor[] = new Array(COLORS_COUNT).fill(null).map(() => ({ id: i++ }))