import React from "react"; 
const CoApplicantDetails = ({ reviewApplicationlist }) => {
const applicantData = {
  "Full Name of Applicant"        : reviewApplicationlist?.coApplicantName ?? "Not Data",
  "C/o of"                        : reviewApplicationlist?.coApplicantCof ?? "Not Data",
  "Phone No. of Applicant"        : reviewApplicationlist?.coApplicantPhone ?? "Not Data",
  "Additional No. of Applicant"   : reviewApplicationlist?.coApplicantAdditionalPhone ?? "Not Data",
  "Email Id of Applicant"         : reviewApplicationlist?.coApplicantEmail ?? "Not Data",
  "Permanent Address of Applicant": reviewApplicationlist?.coApplicantAddress ?? "Not Data",
  "Aadhar No. of Applicant"       : reviewApplicationlist?.coApplicantAadhar ?? "Not Data",
  "PAN No. of Applicant"          : reviewApplicationlist?.coApplicantPan ?? "Not Data",
  DOB                             : reviewApplicationlist?.coApplicantDob ?? "Not Data",
  "Profession of Applicant"       : reviewApplicationlist?.coApplicantProfession ?? "Not Data",
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

export default CoApplicantDetails;
