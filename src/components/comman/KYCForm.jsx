"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { applicantFields } from "../../data.js";
import { coApplicantFields } from "../../data.js";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import Link from "next/link.js";

const KYCForm = ({
  handleNextStep,
  tableData,
  kycDetails,
  bookingId,
  allKycDetails,
  reviewApplication,
}) => {
  const buildValidationSchema = () => {
    const schemaShape = {};
    [...applicantFields, ...coApplicantFields].forEach((field) => {
      if (field.type === "email") {
        schemaShape[field.name] = Yup.string()
          .email("Invalid email")
          .required("Required");
      } else {
        schemaShape[field.name] = Yup.string().required("Required");
      }
    });
    schemaShape["termsAccepted"] = Yup.bool().oneOf(
      [true],
      "You must accept the terms"
    );
    return Yup.object().shape(schemaShape);
  };

  const applicantAddress = [
    kycDetails?.addressEnglish?.house,
    kycDetails?.addressEnglish?.street,
    kycDetails?.addressEnglish?.subdist,
    kycDetails?.addressEnglish?.po,
    kycDetails?.addressEnglish?.dist,
    kycDetails?.addressEnglish?.state,
    kycDetails?.addressEnglish?.country,
    kycDetails?.addressEnglish?.pc,
  ]
    .filter(Boolean)
    .join(", ");
  // Format date to YYYY-MM-DD format
  // Handles various input formats: YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, or Date object
  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return "";
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse DD-MM-YYYY or DD/MM/YYYY format (common in Aadhaar data)
    const ddmmyyyyMatch = dateString.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return `${year}-${month}-${day}`;
    }
    
    // Try to parse as Date object (handles ISO strings, timestamps, etc.)
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
    
    // If all parsing fails, return original string
    return dateString;
  };

  // applicantAutoFillData
  const applicantAutoFillData = {
    applicantAadhar: kycDetails?.uid || allKycDetails?.applicantAadhar,
    applicantAdditionalPhone: allKycDetails?.applicantAdditionalPhone,
    applicantAddress: applicantAddress || allKycDetails?.applicantAddress,
    applicantCof: kycDetails?.addressEnglish?.co || allKycDetails?.applicantCof,
    applicantDob: formatDateToYYYYMMDD(kycDetails?.dob || allKycDetails?.applicantDob),
    applicantEmail: allKycDetails?.applicantEmail,
    applicantName: kycDetails?.name || allKycDetails?.applicantName,
    applicantPan: kycDetails?.panNum || allKycDetails?.applicantPan,
    applicantPhone: allKycDetails?.applicantPhone,
    applicantProfession: allKycDetails?.applicantProfession,
    applicantPhoto: kycDetails?.photo || allKycDetails?.applicantPhoto,
  };
  
  // coApplicantAutoFillData 
  const coApplicantAutoFillData = {
    coApplicantAadhar: allKycDetails?.coApplicantAadhar,
    coApplicantAdditionalPhone: allKycDetails?.coApplicantAdditionalPhone,
    coApplicantAddress: allKycDetails?.coApplicantAddress,
    coApplicantCof: allKycDetails?.coApplicantCof, 
    coApplicantDob: formatDateToYYYYMMDD(allKycDetails?.coApplicantDob),
    coApplicantEmail: allKycDetails?.coApplicantEmail,
    coApplicantName: allKycDetails?.coApplicantName,
    coApplicantPan: allKycDetails?.coApplicantPan,
    coApplicantPhone: allKycDetails?.coApplicantPhone,
    coApplicantProfession: allKycDetails?.coApplicantProfession,  
  };
  const initialValues = {};
  // applicantFields fields
  applicantFields.forEach((field) => {
    if (applicantAutoFillData.hasOwnProperty(field?.name)) {
      initialValues[field?.name] = applicantAutoFillData[field?.name];
    } else {
      initialValues[field?.name] = "";
    }
  });
  // Co-applicant fields
  coApplicantFields.forEach((field) => {
    if (coApplicantAutoFillData.hasOwnProperty(field?.name)) {
      initialValues[field?.name] = coApplicantAutoFillData[field?.name];
    } else {
      initialValues[field?.name] = "";
    }
  });

  initialValues["termsAccepted"] = false;
  const validationSchema = buildValidationSchema();

  // generate random BookingId
  function generateBookingId() {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    return "BK" + randomId.toString();
  }

  // KYC handleSubmit form
  const handleSubmit = async (values) => {
    console.log("values", values);
    
    // Normalize date formats before submitting
    const normalizedValues = {
      ...values,
      applicantDob: formatDateToYYYYMMDD(values.applicantDob),
      coApplicantDob: formatDateToYYYYMMDD(values.coApplicantDob),
    };
    
    try {
      const res = await fetch(
        "https://book.neotericproperties.in/wp-json/wp/v2/book_flat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: generateBookingId(),
            property_id: tableData[0]?.property_id,
            plot_no: bookingId,
            totalAmount: tableData[0]?.total,
            paymentStatus: "pending",
            photo: kycDetails?.photo,
            ...normalizedValues,
          }),
        }
      );

      const data = await res.json();
      if (data?.success) {
        reviewApplication();
        console.log("Booking & KYC saved:", data?.data);
      } else {
        console.error("Failed:", data.message || data);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }

    handleNextStep(3);
  };

  return (
    <div className="py-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values }) => (
          <Form className="bg-white rounded-xl shadow-md 2xl:p-10 lg:p-6 md:p-4 p-2">
            <div className="bg-white  p-4">
              <div className="flex justify-between items-center ">
                <h2 className="md:text-center text-center justify-center text-gray-800 md:text-3xl text-2xl font-bold md:mt-0 mt-4 mb-3 leading-9 flex-grow">
                  Complete Your KYC
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
              <div>
                <h3 className="tself-stretch text-center md:text-start justify-center text-gray-700 md:text-2xl text-xl font-semibold  leading-loose md:mb-4 mb-3">
                  Name of Applicant
                </h3>
                <div className="space-y-4">
                  {applicantFields?.map((field) => (
                    <div key={field?.name}>
                      {field.type === "textarea" ? (
                        <Field
                          as="textarea"
                          name={field?.name}
                          placeholder={field?.placeholder}
                          readOnly={field?.readOnly}
                          className={`w-full px-4 ${field?.type === "textarea" ? "h-24" : "h-auto"
                            }  py-3  focus:outline-none focus:ring-1 focus:ring-[#066FA9] bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300
                           placeholder-[#6b7280]`}
                        />
                      ) : (
                        <Field
                          type={field?.type}
                          name={field?.name}
                          placeholder={field?.placeholder}
                          readOnly={field?.readOnly}
                          className="w-full self-stretch px-3 py-3 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300 focus:outline-none focus:ring-1 focus:ring-[#066FA9] placeholder-[#6b7280] "
                        />
                      )}
                      {errors[field?.name] && touched[field?.name] && (
                        <div className="text-red-500 text-sm px-1 pt-1">
                          {errors[field?.name]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="self-stretch justify-center text-center md:text-start text-gray-700 md:text-2xl text-xl font-semibold leading-loose md:mb-4 mb-3">
                  Co-Applicant Name
                </h3>
                <div className="space-y-4">
                  {coApplicantFields?.map((field) => (
                    <div key={field?.name}>
                      {field?.type === "textarea" ? (
                        <Field
                          as="textarea"
                          name={field?.name}
                          placeholder={field?.placeholder}
                          className={` ${field?.type === "textarea" ? "h-24" : "h-auto"
                            }  py-3 px-4 w-full focus:outline-none focus:ring-1 focus:ring-[#066FA9] bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300 placeholder-[#6b7280]`}
                        />
                      ) : (
                        <Field
                          type={field?.type}
                          name={field?.name}
                          placeholder={field?.placeholder}
                          className={`w-full self-stretch px-3 py-3 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300 focus:outline-none focus:ring-1 focus:ring-[#066FA9] placeholder-[#6b7280] `}
                        />
                      )}
                      {errors[field?.name] && touched[field?.name] && (
                        <div className="text-red-500 text-sm px-1 pt-1">
                          {errors[field?.name]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 md:mb-0 mb-4 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex flex-col items-start">
                <p className=" py-2 text-sm text-gray-600">
                  *All fields are mandatory{" "}
                </p>
                <div className="md:flex items-start">
                  <Field
                    type="checkbox"
                    name="termsAccepted"
                    className="mt-1 md:ml-0 ml-1 h-5 w-5 text-[#066FA9] rounded border-gray-300 focus:ring-[#066FA9]"
                  />
                  <div className="ml-2 max-w-4xl block text-sm text-gray-600">
                    I confirm the details are true and consent to Neoteric
                    Properties using them for my property booking. I also
                    confirm my Co-Applicant's consent to share their
                    information. Please refer to our
                    <Link
                      href="#"
                      className="text-[#066FA9] hover:underline md:px-1 px-1"
                    >
                      Terms & Conditions
                    </Link>
                    and
                    <Link
                      href="#"
                      className="text-[#066FA9] hover:underline md:px-1 px-1"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </div>
                </div>

                {errors.termsAccepted && touched.termsAccepted && (
                  <div className="text-red-500 text-sm mt-2 md:mt-0">
                    You must accept the terms
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="mt-6 md:mt-0 bg-[#066FA9] text-white cursor-pointer font-semibold py-3 flex text-center justify-center items-center gap-2 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl group"
              >
                Proceed
                <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <HiOutlineArrowSmallRight className="text-lg" />
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default KYCForm;
