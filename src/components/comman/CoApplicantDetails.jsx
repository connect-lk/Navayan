import React from "react";
import { applicantData } from "../../data";
const CoApplicantDetails = () => {
  return (
    <div className="min-h-auto bg-gray-100 flex items-center justify-center  ">
      <div className="bg-white rounded-xl outline-1 outline-offset-[-1px] outline-gray-200 w-full max-w-screen-2xl mx-auto overflow-hidden">
        <div className="divide-y divide-gray-200">
          {Object.entries(applicantData).map(([key, value]) => (
            <div
              key={key}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
            >
              <div className="justify-center text-gray-500 lg:text-[16px] text-sm font-normal  leading-tight">
                {key}
              </div>
              <div className="text-right justify-center text-gray-500 lg:text-[16px] text-sm font-normal leading-tight">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoApplicantDetails;
