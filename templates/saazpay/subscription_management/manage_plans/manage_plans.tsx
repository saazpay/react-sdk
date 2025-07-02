import React, { useState } from "react";
import PricingCard from "../../pricing_card";
import { IPlan, IProration } from "../../types";
import PreviewPlan from "./preview_plan";

interface ManagePlansProps {
  plans: IPlan[];
  previewPlan: (planId: string) => Promise<IProration>;
  onConfirm: (from: string, to: string, selectedPlan: IPlan) => void;
  primaryColor: string;
  existingPlan?: IPlan;
}

const ManagePlans = ({
  plans,
  previewPlan,
  onConfirm,
  primaryColor,
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
      if (!existingPlan) {
        throw new Error("No existing plan found");
      }
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
        <div className="flex items-center mb-6 bg-white border border-gray-200 rounded-md dark:bg-gray-800 w-max dark:border-gray-700">
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
                style={{
                  borderColor: selectedPlan?.id === plan.id ? primaryColor : "",
                }}
                className={`border-2 rounded-lg overflow-hidden duration-150 ${
                  selectedPlan?.id !== plan.id &&
                  "border-transparent cursor-pointer hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <PricingCard plan={plan} primaryColor={primaryColor} />
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
            <div className="w-full bg-gray-100 border border-gray-300 rounded-lg h-80 animate-pulse dark:bg-gray-900 dark:border-gray-600" />
          ) : isError || !prorationDetails ? (
            <div className="p-5 border border-gray-200 rounded-lg shadow dark:border-gray-700">
              <div className="text-sm text-red-400">
                Unable to fetch proration details. Please try again later.
              </div>
            </div>
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
