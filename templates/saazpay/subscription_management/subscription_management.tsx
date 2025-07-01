"use client";

import React, { useState } from "react";
import {
  IManagementUrl,
  IPlan,
  IProration,
  ISubscription,
  IUpdatePlan,
} from "../types";
import ManagePlans from "./manage_plans/manage_plans";

interface SubscriptionAPI {
  getPlans: () => Promise<IPlan[]>;
  previewPlan: (planId: string) => Promise<IProration>;
  changePlan: (planId: string) => Promise<IUpdatePlan>;
}

interface SubscriptionManagementProps {
  activeSubscription?: ISubscription;
  managementUrls: IManagementUrl;
  api: SubscriptionAPI;
}

const SubscriptionManagement = ({
  activeSubscription,
  managementUrls,
  api,
}: SubscriptionManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [plans, setPlans] = useState<IPlan[]>([]);

  const fetchPlans = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await api.getPlans();
      setPlans(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const changePlan = async (planId: string) => {
    setIsLoading(true);
    setIsError(false);
    setIsProcessing(false);
    try {
      await api.changePlan(planId);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      window.location.reload();
    }
  };

  const [state, setState] = useState<{
    isChangePlan: boolean;
    confirmChange: {
      from: string;
      to: string;
      planId?: string;
    } | null;
  }>({
    isChangePlan: false,
    confirmChange: null,
  });

  if (state.isChangePlan) {
    return (
      <div className="relative w-full h-full p-5 overflow-hidden bg-white border border-gray-200 rounded-md shadow dark:border-gray-700 dark:bg-gray-800">
        {activeSubscription && state.confirmChange ? (
          <div className="relative">
            {isProcessing && (
              <div className="absolute bottom-0 right-0 flex items-center px-3 py-2 text-xs font-medium text-orange-800 bg-orange-100 rounded-md gap-x-2">
                <svg
                  className="w-4 h-4 fill-orange-800"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                >
                  <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
                </svg>
                Subscription details are being updated
              </div>
            )}

            <div className="mb-5">
              <h6 className="font-medium">Confirm plan change</h6>
              <p className="text-sm text-gray-500">
                Are you sure you want to change your plan. You can always
                upgrade/downgrade later.
              </p>
              <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 gap-x-2">
                You're changing from{" "}
                <span className="px-2 py-1 font-semibold rounded-md bg-slate-100 dark:bg-slate-800">
                  {state.confirmChange.from}
                </span>{" "}
                to
                <span className="px-2 py-1 font-semibold rounded-md bg-slate-100 dark:bg-slate-800">
                  {state.confirmChange.to}
                </span>{" "}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={isProcessing}
                className="px-4 py-2 mt-5 text-sm font-medium duration-150 bg-gray-100 rounded-md cursor-pointer w-max hover:bg-gray-200"
                onClick={() => {
                  setState({
                    isChangePlan: true,
                    confirmChange: null,
                  });
                }}
              >
                Back to plans
              </button>
              <button
                disabled={isLoading || isProcessing}
                className="px-4 py-2 mt-5 text-sm font-medium text-white duration-150 bg-[#f36a68] rounded-md cursor-pointer w-max hover:bg-[#f36a68]/80"
                onClick={() => {
                  if (state.confirmChange && state.confirmChange.planId) {
                    changePlan(state.confirmChange.planId);
                  }
                }}
              >
                {isLoading ? "Processing..." : "Confirm change"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-5 gap-x-2">
              <button
                className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                onClick={() => {
                  setState({
                    isChangePlan: false,
                    confirmChange: null,
                  });
                }}
              >
                Dashboard
              </button>
              <svg
                className="w-3 h-3 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                Change plan
              </span>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="bg-gray-200 h-60 rounded-md animate-pulse duration-[2500]" />
                <div className="bg-gray-200 h-60 rounded-md animate-pulse duration-[1500]" />
                <div className="bg-gray-200 h-60 rounded-md animate-pulse duration-[500]" />
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center w-full h-full p-5 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
                Error loading plans
              </div>
            ) : (
              <ManagePlans
                existingPlan={plans.find(
                  (plan) => plan.id == activeSubscription?.price.id
                )}
                plans={plans.filter(
                  (plan) => plan.id != activeSubscription?.price.id
                )}
                previewPlan={api.previewPlan}
                onConfirm={async (from, to, selectedPlan) => {
                  setState({
                    isChangePlan: true,
                    confirmChange: {
                      from,
                      to,
                      planId: selectedPlan.id,
                    },
                  });
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-5 overflow-hidden bg-white border border-gray-200 rounded-md shadow dark:border-gray-700 dark:bg-gray-800">
      {activeSubscription ? (
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-20">
          {/* {isTimeout && (
              <div className="absolute bottom-0 flex items-center px-3 py-2 text-xs font-medium bg-gray-200 rounded-md right-5 gap-x-2 text-black/50">
                <Loader className="w-4 h-4 text-black/40" />
                subscription details are being updated
              </div>
            )} */}
          <div>
            {activeSubscription.product.image_url && (
              <img
                src={activeSubscription.product.image_url}
                alt={activeSubscription.product.name}
                className="w-10 object-contain p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md"
              />
            )}
            <div className="mt-2">
              <h3 className="text-base font-medium">
                {activeSubscription.product.name}
              </h3>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                {activeSubscription.product.description}
              </p>
            </div>
            <div className="flex flex-col justify-between flex-1 p-3 mt-5 bg-gray-100 rounded-md dark:bg-gray-700">
              <div>
                <h4 className="text-sm font-medium">
                  {activeSubscription.price.name}
                </h4>
                <p className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeSubscription.price.description}
                </p>
                <div className="flex items-end mt-1 gap-x-1">
                  <span className="block text-2xl font-semibold">
                    {activeSubscription.price.currency}{" "}
                    {activeSubscription.price.price}
                  </span>
                  <span className="font-medium text-sm text-gray-500 mb-0.5 dark:text-gray-400">
                    {formatBillingText(
                      activeSubscription.price.billing_frequency,
                      activeSubscription.price.billing_interval as any
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-1 text-xs font-medium">
                {(activeSubscription.price.trial_frequency ||
                  activeSubscription.price.trial_interval) &&
                  activeSubscription.price.trial_frequency != 0 && (
                    <div className="px-2 py-1 font-normal text-black rounded-md dark:text-white bg-primary/20 dark:bg-primary/30 w-max">
                      {activeSubscription.price.trial_frequency}{" "}
                      {activeSubscription.price.trial_interval}(s) trial period
                    </div>
                  )}
              </div>
            </div>

            <button
              onClick={() => {
                setState({
                  isChangePlan: true,
                  confirmChange: null,
                });
                fetchPlans();
              }}
              className="w-full px-4 py-2 mt-5 text-sm font-medium duration-150 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
            >
              Change plan
            </button>
          </div>

          <div className="flex-col flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">Next bill due</h3>
                <div className="mb-2 text-xs text-gray-500">
                  {activeSubscription.next_billed_at
                    ? formatDateTime(activeSubscription.next_billed_at)
                    : "Not available"}
                </div>
              </div>
              {activeSubscription && (
                <div className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded">
                  {activeSubscription.status}
                </div>
              )}
            </div>
            <hr />

            {activeSubscription.scheduled_change && (
              <div className="w-full p-2 mt-5 bg-orange-100 border-orange-200 shadow-sm dark:bg-orange-900 dark:border-orange-800">
                <div className="flex items-start justify-between p-2">
                  <div>
                    <h6 className="text-sm font-medium">
                      Subscription scheduled
                    </h6>
                    <p className="text-xs text-gray-500">
                      This subscription is scheduled to be canceled on{" "}
                      {formatDateTime(activeSubscription.scheduled_change)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col mt-5 gap-y-2">
              <a href={managementUrls.customerPortal} target="_blank">
                <button className="w-full px-4 py-2 text-sm font-medium duration-150 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                  Manage subscription
                </button>
              </a>
              <div className="flex flex-col items-center w-full gap-2 md:flex-row">
                <a
                  href={managementUrls.updatePaymentMethod}
                  target="_blank"
                  className="w-full"
                >
                  <button className="w-full px-4 py-2 text-sm font-medium duration-150 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                    Update payment method
                  </button>
                </a>
                <a
                  href={managementUrls.cancelSubscription}
                  target="_blank"
                  className="w-full"
                >
                  <button className="w-full px-4 py-2 text-sm font-medium text-white duration-150 bg-red-400 rounded-md cursor-pointer hover:bg-red-500">
                    Cancel subscription
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-10">
          <h3 className="text-sm font-semibold">No subscription found</h3>
          <p className="mb-2 text-xs text-gray-500">
            You don&apos;t have any active subscriptions.
          </p>
          <button
            onClick={() => {
              setState({
                isChangePlan: true,
                confirmChange: null,
              });
            }}
            className="px-4 py-2 text-sm font-medium duration-150 bg-gray-100 rounded-md cursor-pointer w-max hover:bg-gray-200"
          >
            Select plan
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;

const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
