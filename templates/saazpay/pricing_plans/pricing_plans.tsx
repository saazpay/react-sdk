"use client";

import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import React, { useEffect, useState } from "react";
import PricingCard from "../pricing_card";
import { IPlan } from "../types";

interface PricingPlansProps {
  plans: IPlan[];
  activePlanId?: string;
  settings?: {
    primaryColor?: string;
    alignment?: "left" | "center" | "right";
  };
}

const PricingPlans = ({ plans, activePlanId, settings }: PricingPlansProps) => {
  const { primaryColor = "#f36a68", alignment = "left" } = settings || {};
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
        eventCallback: function (data) {
          if (data.name == "checkout.completed") {
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          }
        },
      }).then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      });
    }
  }, []);

  const openCheckout = (plan: IPlan) => {
    // NOTE: Implement your custom checkout logic if needed here
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
      <div
        style={{
          justifyContent: alignment,
        }}
        className="flex mb-6"
      >
        <div className="flex items-center bg-white border border-gray-200 rounded-md dark:bg-gray-800 w-max dark:border-gray-700">
          <button
            style={{
              backgroundColor: selectedTab === "month" ? primaryColor : "",
              color: selectedTab === "month" ? "white" : "",
            }}
            className={`px-4 py-1.5 cursor-pointer font-medium rounded-md
            focus:outline-none transition-colors text-sm ${
              selectedTab === "month"
                ? "text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedTab("month")}
            type="button"
          >
            Monthly
          </button>
          <button
            style={{
              backgroundColor: selectedTab === "year" ? primaryColor : "",
              color: selectedTab === "year" ? "white" : "",
            }}
            className={`px-4 py-1.5 cursor-pointer font-medium rounded-md
            focus:outline-none transition-colors text-sm ${
              selectedTab === "year"
                ? "text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedTab("year")}
            type="button"
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredPlans?.length > 0 ? (
          filteredPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              primaryColor={primaryColor}
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
