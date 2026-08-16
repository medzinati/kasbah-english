import { planPricesSar as fallbackPrices } from "@/lib/pricing-fallback";
import { prisma } from "@/lib/prisma";

export async function planCheckoutAmountSar(planId: string | null | undefined): Promise<number | null> {
  if (!planId) return null;
  try {
    const plan = await prisma.pricingPlan.findUnique({ where: { id: planId } });
    if (plan?.active) return plan.priceSar;
  } catch {
    // fall through
  }
  return fallbackPrices[planId] ?? null;
}

export { fallbackPrices as planPricesSar };
