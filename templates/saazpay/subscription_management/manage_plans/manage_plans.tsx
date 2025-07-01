import React, { useState } from "react";
import PricingCard from "../../pricing_card";
import { IPlan, IProration } from "../../types";
import PreviewPlan from "./preview_plan";

interface ManagePlansProps {
  plans: IPlan[];
  previewPlan: (planId: string) => Promise<IProration>;
  onConfirm: (from: string, to: string, selectedPlan: IPlan) => void;
  existingPlan?: IPlan;
}

const ManagePlans = ({
  plans,
  previewPlan,
  onConfirm,
  existingPlan,
}: ManagePlansProps) => {
  const [selectedTab, setSelectedTab] = useState("month");
  const [selectedPlan, setSelectedPlan] = useState<null | IPlan>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [prorationDetails, setProrationDetails] = useState<IProration | null>(
    null
  );
  const filteredPlans = plans?.filter(
    (plan) => plan.billing_interval === selectedTab
  );

  const previewProration = async (planId: string) => {
    setIsLoading(true);
    setIsError(false);
    setProrationDetails(null);
    try {
      const data = await previewPlan(planId);
      setProrationDetails(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5">
      <div
        className={`${selectedPlan ? "md:col-span-2" : "col-span-3"} w-full`}
      >
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
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 ${
            selectedPlan && "md:grid-cols-2"
          } gap-4 mt-5`}
        >
          {filteredPlans?.length > 0 ? (
            filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);
                  previewProration(plan.id);
                }}
                className={`border-2 rounded-lg overflow-hidden duration-150 ${
                  selectedPlan?.id === plan.id
                    ? "border-[#f36a68]"
                    : "border-transparent cursor-pointer hover:border-gray-200"
                }`}
              >
                <PricingCard plan={plan} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No plans available for this billing interval.
            </p>
          )}
        </div>
      </div>
      {selectedPlan && (
        <div className="w-full col-span-1 mt-10 h-max md:mt-14">
          {isLoading ? (
            <div className="w-full bg-gray-100 border border-gray-300 rounded-lg h-80 animate-pulse" />
          ) : isError || !prorationDetails ? (
            <p className="text-sm text-red-500">
              Unable to fetch proration details. Please try again later.
            </p>
          ) : (
            <PreviewPlan
              oldPlan={existingPlan!}
              newPlan={selectedPlan!}
              prorationDetails={prorationDetails}
              onConfirm={(from, to) => onConfirm(from, to, selectedPlan)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
