"use client";

import React from "react";
import { IPlan } from "./types";

interface PricingCardProps {
  plan: IPlan;
  primaryColor: string;
  onClick?: ((plan: IPlan) => void) | null;
}
const PricingCard = ({ plan, onClick, primaryColor }: PricingCardProps) => {
  return (
    <div className="relative flex flex-col h-full p-5 overflow-hidden bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
      <div>
        {plan.product.image_url && (
          <img
            src={plan.product.image_url}
            alt={plan.product.name}
            className="w-10 object-contain p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md"
          />
        )}
        <div className="flex flex-col items-start mt-2">
          <h3 className="text-base font-medium">{plan.product.name}</h3>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-300 text-start">
            {plan.product.description}
          </p>
        </div>
      </div>
      <div className="flex-col justify-between flex-1 p-3 mt-5 bg-gray-100 rounded-md dark:bg-gray-800">
        <div className="flex flex-col items-start">
          <h4 className="text-sm font-medium">{plan.name}</h4>
          <p className="flex-1 text-sm text-gray-500 dark:text-gray-400 text-start">
            {plan.description}
          </p>
          <div className="flex items-end mt-1 gap-x-1">
            <span className="block text-2xl font-semibold">
              {plan.currency} {plan.price}
            </span>
            <span className="font-medium text-sm text-gray-500 mb-0.5 dark:text-gray-400">
              {formatBillingText(
                plan.billing_frequency,
                plan.billing_interval as "day" | "week" | "month" | "year"
              )}
            </span>
          </div>
        </div>

        <div className="mt-1 text-xs font-medium">
          {(plan.trial_frequency || plan.trial_interval) &&
            plan.trial_frequency != 0 && (
              <div className="px-2 py-1 font-normal text-black bg-gray-300 rounded dark:bg-gray-900 dark:text-white w-max">
                {plan.trial_frequency} {plan.trial_interval}(s) trial period
              </div>
            )}
        </div>
      </div>

      {onClick && (
        <button
          style={{
            backgroundColor: primaryColor,
          }}
          onClick={() => onClick(plan)}
          className="mt-4 w-full cursor-pointer text-white hover:opacity-90 px-4 py-1.5 rounded-md text-sm"
        >
          Select plan
        </button>
      )}
    </div>
  );
};

export default PricingCard;

const formatBillingText = (
  billing_frequency: number | null,
  billing_interval: "day" | "week" | "month" | "year" | null
): string => {
  if (!billing_frequency || !billing_interval) return "";
  return billing_frequency === 1
    ? `/ ${
        billing_interval.charAt(0).toUpperCase() + billing_interval.slice(1)
      }ly`
    : `/ Every ${billing_frequency} ${billing_interval}s`;
};
