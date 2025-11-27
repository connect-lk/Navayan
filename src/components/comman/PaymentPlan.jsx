import React, { useState } from "react";
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from "react-icons/hi2";
import CheckPayment from "./CheckPayment";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
const THEME_COLOR = "#066fa9";
const MOCK_TOTAL_AMOUNT = 10;

const paymentPlans = [
  {
    id: "plan-10",
    name: "Basic Reservation",
    percentage: 20,
    description: "At the time of booking (20% of the Basic Cost).",
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
  const navigation = useRouter()
  const handleCheckSubmit = async(values) => {
    console.log("Check Payment Submitted:", values);
    // 👉 You can send this data to API here

    try {
      // Your custom values
      const checkNumber = values?.checkNumber || "CHK12345";
      const bankName = values?.bankName || "HDFC Bank";
      const amount = values?.amount || 500; // INR

      // Call backend to create check payment order
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkNumber, bankName, amount }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMessage = data.error || data.details || "Something went wrong! Please try again.";
        console.error("Payment error:", errorMessage);
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: errorMessage,
          confirmButtonColor: THEME_COLOR,
        });
        return;
      }

      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RkgYklrk2WT4fq",
        amount: order.amount,
        currency: order.currency,
        name: "Navayan Properties",
        description: "Check Payment Transaction",
        order_id: order.id,
        handler: function (response) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
              <p><strong>Payment ID:</strong> ${response.razorpay_payment_id}</p>
              <p><strong>Order ID:</strong> ${response.razorpay_order_id}</p>
            `,
            confirmButtonColor: THEME_COLOR,
          });
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notes: order.notes || {},
        theme: {
          color: THEME_COLOR,
        },
        modal: {
          ondismiss: function() {
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment process.",
              confirmButtonColor: THEME_COLOR,
            });
            console.log("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Failed to initiate payment. Please try again.",
        confirmButtonColor: THEME_COLOR,
      });
    }
  };

  const selectedPlan = paymentPlans.find((p) => p.id === selectedPlanId);
  const amountToPay = selectedPlan
    ? (MOCK_TOTAL_AMOUNT * selectedPlan.percentage) / 100
    : 0;

  const handlePayNow = async () => {
    console.log("amountToPay", amountToPay);
    if (!amountToPay || amountToPay <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Payment Plan Required",
        text: "Please select a payment plan to continue.",
        confirmButtonColor: THEME_COLOR,
      });
      return;
    }

    try {
      // Call backend to create online payment order
      const res = await fetch("/api/razorpay-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amountToPay,
          planName: selectedPlan?.name || "Booking Payment"
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMessage = data.error || data.details || "Something went wrong! Please try again.";
        console.error("Payment error:", errorMessage);
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: errorMessage,
          confirmButtonColor: THEME_COLOR,
        });
        return;
      }

      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RkgYklrk2WT4fq",
        amount: order.amount,
        currency: order.currency,
        name: "Navayan Properties",
        description: `Payment for ${selectedPlan?.name || "Booking"}`,
        order_id: order.id,
        handler: function (response) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
              <p><strong>Payment ID:</strong> ${response.razorpay_payment_id}</p>
              <p><strong>Order ID:</strong> ${response.razorpay_order_id}</p>
              <p><strong>Amount:</strong> ${formatCurrency(amountToPay)}</p>
            `,
            confirmButtonColor: THEME_COLOR,
          });
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
          // You can redirect to success page or update UI here
        },
        prefill: {
          // You can get these from user data if available
          name: "Lokesh Kumar",    
          email: "lokesh@gmail.com",
          contact: "9876543210",
        },
        notes: order.notes || {},
        theme: {
          color: THEME_COLOR,
        },
        modal: {
          ondismiss: function() {
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment process.",
              confirmButtonColor: THEME_COLOR,
            });
            console.log("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Failed to initiate payment. Please try again.",
        confirmButtonColor: THEME_COLOR,
      });
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
          {paymentPlans?.map((plan) => {
            const isSelected = selectedPlanId === plan?.id;
            const planAmount = (MOCK_TOTAL_AMOUNT * plan?.percentage) / 100;

            return (
              <div
                key={plan?.id}
                className={`p-4 sm:p-5 border rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                  isSelected ? "border-[2px]" : "border"
                }`}
                style={{
                  borderColor: isSelected ? THEME_COLOR : "#e5e7eb",
                  backgroundColor: isSelected ? "#f0f9ff" : "white",
                }}
                onClick={() => setSelectedPlanId(plan?.id)}
              >
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-800">
                    {plan?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
                    {plan?.description}
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
