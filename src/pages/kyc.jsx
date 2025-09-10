import ApplicantDetails from "@/components/comman/ApplicantDetails";
import CoApplicantDetails from "@/components/comman/CoApplicantDetails";
import InventoryTable from "@/components/comman/InventoryTable";
import KYCForm from "@/components/comman/KYCForm";
import React, { useState } from "react";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";

// Main application component
export default function page() {
  const [currentStep, setCurrentStep] = useState(2);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

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
          <InventoryTable kycTable={"kycTable"} />
          <KYCForm handleNextStep={handleNextStep} />
        </div>
      );
    } else if (currentStep === 3) {
      return (
        <div className="">
          <div className="w-full md:py-6 py-4">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-center md:text-left ">
              Selected Property
            </h1>
          </div>
          <InventoryTable kycTable={"ReviewTable"} />
          <div className="w-full py-6 mt-10">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-center md:text-left ">
              Applicant’s Details
            </h1>
          </div>
          <ApplicantDetails />
          <div className="w-full py-6 mt-10">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-center md:text-left ">
              Co-Applicant’s Details
            </h1>
          </div>
          <CoApplicantDetails />
          <div className="flex justify-center items-center py-12">
            <button
              type="submit"
              onClick={handleNextStep}
              className="mt-6 md:mt-0 bg-[#066FA9] text-white cursor-pointer font-semibold py-3 flex items-center gap-2 px-8 rounded-lg shadow-lg transition duration-200 ease-in-out transform md:hover:scale-105"
            >
              Proceed{" "}
              <span>
                <HiOutlineArrowSmallRight className="text-lg" />
              </span>
            </button>
          </div>
        </div>
      );
    } else if (currentStep === 4) {
      return <div className=" ">Payment Component</div>;
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
                className={`mt-2 text-center xl:text-lg md:text-md text-[11px] font-medium transition-colors duration-300 ${
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
