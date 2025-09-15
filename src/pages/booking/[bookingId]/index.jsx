"use client";
import ApplicantDetails from "@/components/comman/ApplicantDetails";
import CoApplicantDetails from "@/components/comman/CoApplicantDetails";
import InventoryTable from "@/components/comman/InventoryTable";
import { KycTableData } from "@/data";
import { ReviewTableData } from "@/data";
import KYCForm from "@/components/comman/KYCForm";
import React, { useEffect, useState } from "react";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { useParams } from "next/navigation";
import AllPages from "@/service/allPages";

// Main application component
export default function page() {
  const [currentStep, setCurrentStep] = useState(2);

  const params = useParams();
  const bookingId = params?.bookingId;

  const [inventoryItem, setInventoryItem] = useState(null);

  const InventoryListApiFun = async () => {
    try {
      const response = await AllPages.inventoryList(10);
      const data = response?.data || [];
      const matchedItem = data.find((item) => item.id === bookingId);
      setInventoryItem(matchedItem);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
    }
  };

  useEffect(() => {
    if (bookingId) {
      InventoryListApiFun();
    }
  }, [bookingId]);

  const tableData = inventoryItem
    ? [
        {
          sn: 1,
          unitNo: `Block ${inventoryItem.block_no} - Flat ${inventoryItem.flat_no}`,
          plotSize: `${inventoryItem?.size} sq.ft`,
          plotFacing: inventoryItem.facing,
          plc: "Corner",
          cost: `₹${inventoryItem.amount}`,
          addCost: "₹500000.00",
          status: inventoryItem.status,
          booked: inventoryItem.status !== "available",
        },
      ]
    : [];

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      localStorage.setItem("currentStep", newStep);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentStep]);

  const steps = [
    { id: 1, name: "Select Property" },
    { id: 2, name: "KYC" },
    { id: 3, name: "Review" },
    { id: 4, name: "Payment" },
  ];

  const renderContent = () => {
    if (currentStep === 2) {
      return (
        <div className=" ">
          <InventoryTable tableData={tableData} kycTable={"kycTable"} />
          <KYCForm handleNextStep={handleNextStep} />
        </div>
      );
    } else if (currentStep === 3) {
      return (
        <div className="">
          <div className="w-full md:py-6 py-4">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0 ">
              Selected Property
            </h1>
          </div>
          <InventoryTable tableData={tableData} kycTable={"ReviewTable"} />
          <div className="w-full py-6 md:mt-10 mt-4">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0">
              Applicant’s Details
            </h1>
          </div>
          <ApplicantDetails />
          <div className="w-full py-6 md:mt-10 mt-4">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0">
              Co-Applicant’s Details
            </h1>
          </div>
          <CoApplicantDetails />
          <div className="flex justify-center items-center md:py-12 py-0 md:pt-6 pt-0 md:pb-0 pb-6">
            <button
              onClick={handleNextStep}
              className="mt-6 md:w-auto w-full md:mt-0 bg-[#066FA9] text-white cursor-pointer font-semibold py-3 flex text-center justify-center items-center gap-2 px-12 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl group"
            >
              Proceed
              <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                <HiOutlineArrowSmallRight className="text-lg" />
              </span>
            </button>
          </div>
        </div>
      );
    } else if (currentStep === 4) {
      return (
        <div className="text-center h-96 items-center mx-auto w-full flex justify-center text-2xl">
          Payment Component
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-100 min-h-screen overflow-auto p-4 sm:p-8">
      <div className=" rounded-xl  md:p-6 p-3 max-w-screen-xl mx-auto mb-16 sticky top-12 z-10">
        <div className="flex justify-between items-center">
          {steps?.map((step) => (
            <div key={step?.id} className="flex-1 flex flex-col items-center">
              <div
                className={`md:w-12 w-8 md:h-12 h-8 rounded-full flex items-center text-[12px] md:text-[16px] justify-center font-bold ${
                  currentStep >= step?.id
                    ? "border-2 border-[#066fa9] text-[#066fa9] "
                    : "text-stone-900"
                } transition-colors z-50 duration-300
                  ${currentStep > step?.id ? "bg-[#066FA9]" : "bg-white "}
                  ${
                    currentStep === step?.id
                      ? "bg-[#066FA9]"
                      : " text-[#066fa9]"
                  }
                `}
              >
                {currentStep > step?.id ? (
                  <svg
                    className="md:h-6 h-4 md:w-6 w-4 text-white z-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step?.id
                )}
              </div>
              {/* Step name */}
              <div
                className={`mt-2 text-center lg:text-[16px] md:text-md text-[11px] font-medium transition-colors duration-300 ${
                  currentStep >= step?.id ? "text-[#1C1C1C]" : "text-[#1C1C1C]"
                }`}
              >
                {step?.name}
              </div>
              {/* Connector line */}
              {step?.id < steps?.length && (
                <div
                  className={`absolute md:mt-6 mt-4 h-1 w-[calc(25%-20px)] transition-colors duration-300
                    ${currentStep > step?.id ? "bg-[#066FA9]" : "bg-gray-300"}
                  `}
                  style={{
                    left: `calc(${step?.id * 25}% - 10px)`,
                    transform: "translateX(-50%)",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto">{renderContent()}</div>
    </div>
  );
}
