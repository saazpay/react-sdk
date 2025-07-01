"use client";

import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import React, { useEffect, useState } from "react";
import PricingCard from "../pricing_card";
import { IPlan } from "../types";

interface PricingPlansProps {
  plans: IPlan[];
  activePlanId?: string;
}

const PricingPlans = ({ plans, activePlanId }: PricingPlansProps) => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [selectedTab, setSelectedTab] = useState("month");
  const filteredPlans = plans?.filter(
    (plan) => plan.billing_interval === selectedTab
  );

  useEffect(() => {
    if (!paddle && !activePlanId) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_KEY ?? "",
        environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as Environments,
      }).then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      });
    }
  }, []);

  const openCheckout = (plan: IPlan) => {
    // TODO: Implement your custom checkout logic if needed here
    if (paddle) {
      paddle.Checkout.open({
        items: [{ priceId: plan.id, quantity: 1 }],
        customData: {
          userId: "menadithrox1@gmail.com",
          appId: process.env.NEXT_PUBLIC_SAAZPAY_APP_ID,
        },
        settings: { theme: "light" },
      });
    } else {
      console.error("Paddle is not initialized");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          className={`px-4 py-1.5 cursor-pointer font-medium rounded-l-md border border-gray-200 dark:border-gray-700
            focus:outline-none transition-colors text-sm ${
              selectedTab === "month"
                ? "bg-[#f36a68] text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:text-gray-200 hover:dark:bg-gray-700"
            }`}
          onClick={() => setSelectedTab("month")}
          type="button"
        >
          Monthly
        </button>
        <button
          className={`px-4 py-1.5 cursor-pointer font-medium rounded-r-md border-r border-t border-b border-gray-200 dark:border-gray-700
            focus:outline-none transition-colors text-sm ${
              selectedTab === "year"
                ? "bg-[#f36a68] text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-700"
            }`}
          onClick={() => setSelectedTab("year")}
          type="button"
        >
          Yearly
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredPlans?.length > 0 ? (
          filteredPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onClick={activePlanId ? null : openCheckout}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No plans available for this billing interval.
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingPlans;
