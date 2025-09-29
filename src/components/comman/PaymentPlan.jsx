import React, { useState } from "react";
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from "react-icons/hi2";
import CheckPayment from "./CheckPayment";

const THEME_COLOR = "#066fa9";
const MOCK_TOTAL_AMOUNT = 15000000;

const paymentPlans = [
  {
    id: "plan-10",
    name: "Basic Reservation",
    percentage: 10,
    description: "Secure your booking with the initial deposit.",
  },
  {
    id: "plan-30",
    name: "Standard Booking",
    percentage: 30,
    description: "Pay a larger portion now for faster processing.",
  },
  {
    id: "plan-50",
    name: "Premium Booking",
    percentage: 50,
    description: "Half payment upfront, reducing future EMI load.",
  },
  {
    id: "plan-75",
    name: "Premium Booking",
    percentage: 75,
    description: "Three-quarters payment upfront for priority processing.",
  },
  {
    id: "plan-100",
    name: "Full Payment",
    percentage: 100,
    description: "Complete payment now for full ownership.",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const PaymentPlan = ({ handlePreviousStep }) => {
  const [selectedPlanId, setSelectedPlanId] = useState("plan-10");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckSubmit = (values) => {
    console.log("Check Payment Submitted:", values);
    // 👉 You can send this data to API here
  };

  const selectedPlan = paymentPlans.find((p) => p.id === selectedPlanId);
  const amountToPay = selectedPlan
    ? (MOCK_TOTAL_AMOUNT * selectedPlan.percentage) / 100
    : 0;

  const handlePayNow = () => {
    if (amountToPay) {
      alert(`Proceeding to pay: ${formatCurrency(amountToPay)}`);
    }
  };

  return (
    <div className="w-full flex justify-center items-start px-3 sm:px-4 md:px-6">
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl w-full shadow-lg max-w-screen-2xl">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b border-gray-300 pb-2 sm:text-start text-center sm:pb-4">
          Choose Your Payment Plan
        </h2>

        {/* Total Amount */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between text-center sm:text-left gap-2">
          <p className="text-base sm:text-lg font-medium text-gray-700">
            Total Booking Amount:
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            {formatCurrency(MOCK_TOTAL_AMOUNT)}
          </p>
        </div>

        {/* Payment Plan Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {paymentPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const planAmount = (MOCK_TOTAL_AMOUNT * plan.percentage) / 100;

            return (
              <div
                key={plan.id}
                className={`p-4 sm:p-5 border rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                  isSelected ? "border-[2px]" : "border"
                }`}
                style={{
                  borderColor: isSelected ? THEME_COLOR : "#e5e7eb",
                  backgroundColor: isSelected ? "#f0f9ff" : "white",
                }}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
                    {plan.description}
                  </p>
                </div>
                <div>
                  <div
                    className="text-lg sm:text-xl font-bold"
                    style={{ color: THEME_COLOR }}
                  >
                    {formatCurrency(planAmount)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    ({plan.percentage}% of Total Amount)
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Summary */}
        <div className="mt-8 sm:mt-10 border-t border-gray-300 pt-4 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
            Payment Summary
          </h3>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
            <span className="text-base sm:text-lg font-medium text-gray-700">
              Amount Due Now:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#066FA9]">
              {formatCurrency(amountToPay)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 items-center">
            <button
              onClick={handlePreviousStep}
              className="w-full sm:w-auto bg-[#066FA9] text-white cursor-pointer font-semibold py-2.5 sm:py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex justify-center items-center gap-2 group"
            >
              <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1">
                <HiOutlineArrowSmallLeft className="text-base sm:text-lg" />
              </span>
              Back
            </button>
            <div className="flex items-center gap-6">
              <button
               onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: THEME_COLOR }}
                className="w-full sm:w-auto bg-[#066FA9] text-white cursor-pointer font-semibold py-2.5 sm:py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all capitalize duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex justify-center items-center gap-2 group disabled:opacity-50"
              >
                Proceed to pay Check
                <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <HiOutlineArrowSmallRight className="text-base sm:text-lg" />
                </span>
              </button>
              <button
                onClick={handlePayNow}
                disabled={!selectedPlanId}
                style={{ backgroundColor: THEME_COLOR }}
                className="w-full sm:w-auto bg-[#066FA9] text-white cursor-pointer font-semibold py-2.5 sm:py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all capitalize duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex justify-center items-center gap-2 group disabled:opacity-50"
              >
                Proceed to pay online
                <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <HiOutlineArrowSmallRight className="text-base sm:text-lg" />
                </span>
              </button>
            </div>
          </div>
          {/* Check Payment Modal */}
          <CheckPayment
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCheckSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPlan;
