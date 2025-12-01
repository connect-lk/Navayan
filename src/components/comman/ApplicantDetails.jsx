import React from "react";

const ApplicantDetails = ({ reviewApplicationlist }) => { 
const applicantData = {
  "Full Name of Applicant"         : reviewApplicationlist?.applicantName ?? "Not Data",
  "C/o of"                         : reviewApplicationlist?.applicantCof?.replace(/^C\/O\s*/i, "") ?? "Not Data",
  "Phone No. of Applicant"         : reviewApplicationlist?.applicantPhone ?? "Not Data",
  "Additional No. of Applicant"    : reviewApplicationlist?.applicantAdditionalPhone ?? "Not Data",
  "Email Id of Applicant"          : reviewApplicationlist?.applicantEmail ?? "Not Data",
  "Permanent Address of Applicant" : reviewApplicationlist?.applicantAddress ?? "Not Data",
  "Aadhar No. of Applicant"        : reviewApplicationlist?.applicantAadhar ?? "Not Data",
  "PAN No. of Applicant"           : reviewApplicationlist?.applicantPan ?? "Not Data",
  DOB                              : reviewApplicationlist?.applicantDob ?? "Not Data",
  "Profession of Applicant"        : reviewApplicationlist?.applicantProfession ?? "Not Data",
}; 
  return (
    <div className="min-h-auto bg-gray-100 flex items-center justify-center  ">
      <div className="bg-white rounded-xl outline-1 outline-offset-[-1px] outline-gray-200 w-full max-w-screen-2xl mx-auto overflow-hidden">
        <div className="divide-y divide-gray-200">
          {Object.entries(applicantData).map(([key, value]) => (
            <div
              key={key}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
            >
              <div className="justify-center text-gray-500 lg:text-[16px] text-[15px] font-normal  leading-tight">
                {key}
              </div>
              <div className="md:text-right text-left justify-center text-gray-500 lg:text-[16px] text-[15px] font-normal leading-tight">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
