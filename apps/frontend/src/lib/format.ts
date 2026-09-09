const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Prices in the catalog are BRL. */
export function formatCurrency(value: number): string {
  return brlFormatter.format(value)
}
