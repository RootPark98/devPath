import { BuyCreditsButton } from "@/components/billing/BuyCreditsButton";

export default function BillingPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">크레딧 구매</h1>

      <div className="space-y-3">
        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <div className="font-medium">Starter</div>
            <div className="text-sm opacity-70">100 credits</div>
          </div>
          <BuyCreditsButton packageType="starter" />
        </div>

        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <div className="font-medium">Pro</div>
            <div className="text-sm opacity-70">400 credits</div>
          </div>
          <BuyCreditsButton packageType="pro" />
        </div>

        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <div className="font-medium">Max</div>
            <div className="text-sm opacity-70">1000 credits</div>
          </div>
          <BuyCreditsButton packageType="max" />
        </div>
      </div>
    </main>
  );
}