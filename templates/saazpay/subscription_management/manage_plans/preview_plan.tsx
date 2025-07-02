import React from "react";
import { IPlan, IProration } from "../../types";

interface Props {
  oldPlan: IPlan;
  newPlan: IPlan;
  prorationDetails: IProration;
  onConfirm: (from: string, to: string) => void;
}

const PreviewPlan = ({
  oldPlan,
  newPlan,
  prorationDetails,
  onConfirm,
}: Props) => {
  const currencyCode = prorationDetails.currencyCode;

  const formatCents = (amount: number, currencyCode = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount / 100);

  return (
    <div className="relative flex flex-col h-full p-5 overflow-hidden border border-gray-200 rounded-lg shadow dark:border-gray-700">
      <div>
        <h4 className="text-lg font-semibold text-foreground">
          Preview Plan Changes
        </h4>
        <p className="text-xs text-foreground/80">
          We've calculated the costs based on your current usage and the time
          remaining in your billing cycle.
        </p>
      </div>
      <p className="mt-4 text-xs text-foreground/80">
        You're changing from{" "}
        <span className="font-semibold">{oldPlan.product.name}</span> (
        {formatCents(oldPlan.price * 100, currencyCode)}/
        {oldPlan.billing_interval}) to{" "}
        <span className="font-semibold">{newPlan.product.name}</span> (
        {formatCents(newPlan.price * 100, currencyCode)}/
        {newPlan.billing_interval}).
      </p>

      <table className="w-full mt-5 mb-4 text-sm text-left">
        <tbody>
          <tr>
            <td className="py-2 pr-5 text-sm text-foreground/80">
              Pro-rated charge for new plan
            </td>
            <td className="py-2 text-right">
              {formatCents(
                Math.abs(prorationDetails.proratedCharge),
                currencyCode
              )}
            </td>
          </tr>
          <tr className="border-t border-foreground/10">
            <td className="py-2 pr-5 text-sm text-foreground/80">
              Unused credit from current plan
            </td>
            <td className="py-2 text-right text-green-600 dark:text-green-400">
              {formatCents(
                Math.abs(prorationDetails.creditAmount),
                currencyCode
              )}
            </td>
          </tr>

          <tr className="border-t border-foreground/10">
            <td className="py-2 pr-5 text-sm text-foreground/80">Sub total</td>
            <td className="py-2 text-right text-foreground/80">
              {formatCents(prorationDetails.subTotal, currencyCode)}
            </td>
          </tr>
          {prorationDetails.tax > 0 && (
            <tr className="border-t border-foreground/10">
              <td className="py-2 pr-5 text-sm text-foreground/80">Tax</td>
              <td className="py-2 text-right text-foreground/80">
                {formatCents(Math.abs(prorationDetails.tax), currencyCode)}
              </td>
            </tr>
          )}

          {prorationDetails.creditApplied > 0 && (
            <tr className="border-t border-foreground/10">
              <td className="py-2 pr-5 text-sm text-foreground/80">
                Credit applied
              </td>
              <td className="py-2 text-right text-foreground/80">
                {formatCents(prorationDetails.creditApplied, currencyCode)}
              </td>
            </tr>
          )}
          {prorationDetails.discount > 0 && (
            <tr className="border-t border-foreground/10">
              <td className="py-2 pr-5 text-sm text-foreground/80">Discount</td>
              <td className="py-2 text-right text-foreground/80">
                {formatCents(prorationDetails.discount, currencyCode)}
              </td>
            </tr>
          )}
          <tr className="font-bold border-t border-foreground/20">
            <td className="py-2 pr-5 text-sm text-foreground/80">
              Amount to be paid*
            </td>
            <td className="py-2 text-right text-foreground/80">
              {formatCents(prorationDetails.grandTotal, currencyCode)}
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={() => {
          if (!oldPlan || !newPlan) return;
          onConfirm(
            `${oldPlan.product.name} ${formatCents(
              oldPlan.price * 100,
              currencyCode
            )}/
            ${oldPlan.billing_interval}`,
            `${newPlan.product.name} ${formatCents(
              newPlan.price * 100,
              currencyCode
            )}/
            ${newPlan.billing_interval}`
          );
        }}
        className="w-full px-4 py-2 mt-5 text-sm font-medium duration-150 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Confirm change
      </button>
    </div>
  );
};

export default PreviewPlan;
