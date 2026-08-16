export const planPricesSar: Record<string, number> = {
  "1m": 99,
  "3m": 249,
  "6m": 399,
  "12m": 699,
  "36m": 1499,
};

export function planCheckoutAmountSar(planId: string | null | undefined): number | null {
  if (!planId) return null;
  return planPricesSar[planId] ?? null;
}
