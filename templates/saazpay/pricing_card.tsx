"use client";

import React from "react";
import { IPlan } from "./types";

interface PricingCardProps {
  plan: IPlan;
  features?: string[];
  onClick?: ((plan: IPlan) => void) | null;
}
const PricingCard = ({ plan, features, onClick }: PricingCardProps) => {
  return (
    <div
      className="relative flex flex-col border shadow bg-white dark:bg-gray-900 border-gray-200 rounded-lg dark:border-gray-700 
    overflow-hidden h-full p-5"
    >
      <div>
        {plan.product.image_url && (
          <img
            src={plan.product.image_url}
            alt={plan.product.name}
            className="w-10 object-contain p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md"
          />
        )}
        <div className="mt-2 flex flex-col items-start">
          <h3 className="text-base font-medium">{plan.product.name}</h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm font-normal text-start">
            {plan.product.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-between bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-5">
        <div className="flex flex-col items-start">
          <h4 className="font-medium text-sm">{plan.name}</h4>
          <p className="text-sm text-gray-500 flex-1 dark:text-gray-400 text-start">
            {plan.description}
          </p>
          <div className="mt-1 flex items-end gap-x-1">
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

        <div className="text-xs font-medium mt-1">
          {(plan.trial_frequency || plan.trial_interval) &&
            plan.trial_frequency != 0 && (
              <div className="bg-[#f36a68] text-black dark:text-white font-normal px-2 py-1 rounded-md w-max">
                {plan.trial_frequency} {plan.trial_interval}(s) trial period
              </div>
            )}
        </div>
      </div>

      {onClick && (
        <button
          onClick={() => onClick(plan)}
          className="mt-4 w-full cursor-pointer bg-[#f36a68] text-white hover:opacity-90 px-4 py-1.5 rounded-md text-sm"
        >
          Select plan
        </button>
      )}

      {features && features?.length > 0 && (
        <hr className="border-dashed py-2" />
      )}
      <ul className="list-outside space-y-3 text-sm">
        {features?.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="size-3" />
            {item}
          </li>
        ))}
      </ul>
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
