"use client";
import ApplicantDetails from "@/components/comman/ApplicantDetails";
import CoApplicantDetails from "@/components/comman/CoApplicantDetails";
import InventoryTable from "@/components/comman/InventoryTable";
import { KycTableData } from "@/data";
import { ReviewTableData } from "@/data";
import KYCForm from "@/components/comman/KYCForm";
import React, { useEffect, useState } from "react";
import {
  HiOutlineArrowSmallRight,
  HiOutlineArrowSmallLeft,
} from "react-icons/hi2";
import { useParams } from "next/navigation";
import AllPages from "@/service/allPages";
import { useRouter } from "next/router";

// Main application component
export default function page() {
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [kycDetails, setKycDetails] = useState({});
  const params = useParams();
  const bookingId = params?.bookingId;
  const slug = params?.slug;
  // console.log("slug",slug)
      const [loadingRow, setLoadingRow] = useState(null);
  const router = useRouter();
  const { session_id } = router.query; // dynamically get session_id
  const [inventoryItem, setInventoryItem] = useState(null);
  const [reviewApplicationlist, setReviewApplicationList] = useState({});
  const [reviewloading, setReviewLoading] = useState(true);

  const InventoryListApiFun = async () => {
    try {
      // setLoading(true);
      const response = await AllPages.inventoryList(41);
      const data = response?.data || [];
      const matchedItem = data.find((item) => item.id === bookingId);
      setInventoryItem(matchedItem);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      // setLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  const getAadhaarDetails = async (session_id) => {
    const access_token = localStorage.getItem("accessToken"); // browser can access localStorage

    const res = await fetch(
      `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
    );
    const digilocker_issued_docData = await res.json(); 

    let panKyc ;
    if (digilocker_issued_docData?.pan?.data?.files[0].url) {
      const responsess = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilocker_issued_docData?.pan?.data?.files[0].url,
        }),
      });
  
      const datass = await responsess.json();
       panKyc = datass?.data?.Certificate?.CertificateData?.PAN;
    }

    let aadhaarKyc;
    if (digilocker_issued_docData?.aadhaar?.data?.files[0].url) {
      const response = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilocker_issued_docData?.aadhaar?.data?.files[0].url,
        }),
      });
  
      const data = await response.json(); 
       aadhaarKyc = data?.data?.Certificate?.CertificateData.KycRes;
    }

    const userInfo = {
      uid: aadhaarKyc?.UidData?.$?.uid || "",
      name: aadhaarKyc?.UidData?.Poi?.$?.name || "",
      dob: aadhaarKyc?.UidData?.Poi?.$?.dob || "",
      gender: aadhaarKyc?.UidData?.Poi?.$?.gender || "",
      addressEnglish: aadhaarKyc?.UidData?.Poa?.$ || "",
      addressLocal: aadhaarKyc?.UidData?.LData?.$ || "",
      photo: aadhaarKyc?.UidData?.Pht || "",
      panNum: panKyc?.$?.num || "",
    };
 
    return userInfo;
  };
  // useEffect(() => {

  //  if (session_id) {
  //   //  const access_token = localStorage.getItem("accessToken"); // browser can access localStorage

  //   //   const res = await fetch(
  //   //     `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
  //   //   );
  //   //   const data = await res.json();
  //   //   console.log("Aadhaar document:", data);

  // getAadhaarDetails(session_id).then((Details) => {
  //   // console.log("Details::", Details);
  //     setKycDetails(Details)
  // });

  // // const Details =  getAadhaarDetails()
  // //   console.log("Details::",Details)
  // //   setKycDetails(Details)
  //   }
  // }, [session_id])

  const tableData = inventoryItem
    ? [
        {
          id: inventoryItem?.id,
          plotNo: inventoryItem?.plot_no,
          property_id: inventoryItem?.property_id,
          plotSize: `${inventoryItem?.plot_size} sq.ft`,
          plotFacing: inventoryItem?.facing,
          plcSide: inventoryItem?.plc_side,
          plcPercentage: `${inventoryItem?.plc_percentage}%`,
          north: inventoryItem?.north,
          south: inventoryItem?.south,
          east: inventoryItem?.east,
          west: inventoryItem?.west,
          withPlc: `₹${inventoryItem?.with_plc}`,
          additional: `₹${inventoryItem?.additional}`,
          total: inventoryItem?.total,
          status: inventoryItem?.status,
          hold_expires_at: inventoryItem?.hold_expires_at,
          created_at: inventoryItem?.created_at,
          booked: inventoryItem?.status?.toLowerCase() !== "available",
        },
      ]
    : [];
  const reviewApplication = async () => {
    try {
      setReviewLoading(false);
      const response = await AllPages.reviewApplication(
        tableData[0]?.property_id,
        bookingId
      );
      setReviewApplicationList(response?.data[0]);
    } catch (error) {
      console.error("Error fetching inventory list:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  const bookedStatusUpdateFun = async () => {
    try {
      await AllPages.bookedStatusUpdate(tableData[0]?.property_id, bookingId);
      InventoryListApiFun();
    } catch (error) {
      console.error("Error holding flat:", error.message);
    }
  };

  const propertyId = tableData[0]?.property_id;

  const handleNextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      localStorage.setItem("currentStep", newStep);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      localStorage.setItem("currentStep", newStep);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentStep]);

  useEffect(() => {
    if (bookingId && propertyId) {
      reviewApplication();
    }
  }, [bookingId, propertyId]); // 👈 now stable, avoids infinite calls

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    const storedKyc = JSON.parse(localStorage.getItem("kyc_Details"));
    if (storedKyc) {
      setKycDetails(storedKyc);
    }
  }, []);

  useEffect(() => {
    if (bookingId) {
      InventoryListApiFun();
    }
  }, [bookingId]);



    useEffect(() => {
      if (session_id) {
        setLoading(true);
  // alert()
        const bokking_id = localStorage.getItem("booking_id");
        getAadhaarDetails(session_id).then((Details) => {
          // Save object as JSON string
          localStorage.setItem("kyc_Details", JSON.stringify(Details));
          localStorage.setItem("session_id", session_id);
  
          // Optional: if you wanft to set state from storage later
          setKycDetails(Details); 
          // const bokking_id = localStorage.getItem("booking_id");
          
  
          setLoading(false);
          router.push(`/properties/${slug}/bookingproperties/${bookingId}`);
        });
   
      }
    }, [session_id]);


  const steps = [
    { id: 1, name: "Select Property" },
    { id: 2, name: "KYC" },
    { id: 3, name: "Review" },
    { id: 4, name: "Payment" },
  ];


  const handle_kyc = async() => {
          localStorage.setItem("booking_id", bookingId);
          const session_id = localStorage.getItem("session_id");
          const access_token = localStorage.getItem("accessToken");
          let statusData;
          if (session_id && access_token) {
            const statusRes = await fetch(
              `/api/digilocker_status?session_id=${session_id}&access_token=${access_token}`
            );
    
            statusData = await statusRes.json();
            console.log("Session Status:", statusData);
            // const createdAt = statusData?.data?.created_at;
            // const updatedAt = statusData?.data?.updated_at;
          }
    
          if (
            statusData?.sessionExpired ||
            !session_id ||
            statusData?.code == 521 ||
            statusData?.code == 403
          ) {
            // alert("d,jsahfjdasgfjh")
            const res = await fetch("/api/digilocker", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                slug,
                bookingId
              }),
            });
    
            const data = await res.json();
            console.log("API Response:", data);
    
            if (data.accessToken) {
              localStorage.setItem("accessToken", data.accessToken); // ✅ store in browser
            }
    
            if (data.digiData?.data?.authorization_url) {
              window.location.href = data.digiData.data.authorization_url; // redirect user
            } else {
              setLoadingRow(null);
              console.error("No authorization URL found", data);
              if (data.error) {
                toast.error("Something went wrong !")
              }
            }
          } else {
            // alert()
    
            getAadhaarDetails(session_id).then(async (Details) => {
              setLoadingRow(id);
    
              // Save object as JSON string
              localStorage.setItem("kyc_Details", JSON.stringify(Details));

              setKycDetails(Details);
              // const bokking_id = localStorage.getItem("booking_id");
              // router.push(`/properties/${slug}/bookingproperties/${id}`);
            });
          }
  }


  // useEffect(() => {
  //   const 
  // }, [])
  

  const renderContent = () => {

    if (currentStep === 2) {
      return (
        <div className=" ">

          <InventoryTable
            tableData={tableData}
            kycTable={"kycTable"}
            // loading={loading}
            InventoryListApiFun={InventoryListApiFun}
          />

          
          {
            !loading ? (
              
            kycDetails?.uid ? (
              <KYCForm
                handleNextStep={handleNextStep}
                kycDetails={kycDetails}
                tableData={tableData}
                bookingId={bookingId}
                allKycDetails={reviewApplicationlist}
                reviewApplication={reviewApplication}
              />
            ):(
              <div className="flex items-center justify-center  mt-6  w-full bg-gray-100">
              <div className="bg-white py-24 rounded-lg shadow-md flex h-full justify-center w-full">
                <button className="py-3.5 md:px-12 px-4 cursor-pointer  bg-[#066FA9] rounded-lg text-white text-sm font-medium font-['Inter'] leading-tight" onClick={handle_kyc}>
                  Complete Your KYC
                </button>
              </div>
            </div>
            )
          ) :(
            <div className="flex justify-center items-center w-full h-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
              <span className="ml-3 text-sm">Loading kyc...</span>
            </div>
          )
          
          
          }
        </div>
      );
    } else if (currentStep === 3) {
      return (
        <>
          {reviewloading ? (
            <div className="flex justify-center items-center w-full h-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
              <span className="ml-3 text-sm">Loading property...</span>
            </div>
          ) : (
            <>
              <div className="">
                <div className="w-full md:py-6 py-4">
                  <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0 ">
                    Selected Property
                  </h1>
                </div>
                <InventoryTable
                  tableData={tableData}
                  kycTable={"ReviewTable"}
                />
                <div className="w-full py-6 md:mt-10 mt-4">
                  <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0">
                    Applicant’s Details
                  </h1>
                </div>
                <ApplicantDetails
                  reviewApplicationlist={reviewApplicationlist}
                />
                <div className="w-full py-6 md:mt-10 mt-4">
                  <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0">
                    Co-Applicant’s Details
                  </h1>
                </div>
                <CoApplicantDetails
                  reviewApplicationlist={reviewApplicationlist}
                />
                <div className="flex justify-between gap-6 items-center md:py-12 py-0 md:pt-6 pt-0 md:pb-0 pb-6">
                  <button
                    onClick={handlePreviousStep}
                    className="mt-6 md:w-auto w-full md:mt-0 bg-[#066FA9] text-white cursor-pointer font-semibold py-3 flex text-center justify-center items-center gap-2 px-12 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl group"
                  >
                    <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1">
                      <HiOutlineArrowSmallLeft className="text-lg" />
                    </span>
                    Back
                  </button>
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
            </>
          )}
        </>
      );
    } else if (currentStep === 4) {
      return (
        <>
          <div className="text-center h-96 items-center mx-auto w-full flex justify-center text-2xl">
            Payment Component
          </div>

          <div className="flex justify-center gap-6 items-center md:py-12 py-0 md:pt-6 pt-0 md:pb-0 pb-6">
            <button
              onClick={handlePreviousStep}
              className="mt-6 md:w-auto w-full md:mt-0 bg-[#066FA9] text-white cursor-pointer font-semibold py-3 flex text-center justify-center items-center gap-2 px-12 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl group"
            >
              <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1">
                <HiOutlineArrowSmallLeft className="text-lg" />
              </span>
              Back
            </button>
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
        </>
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
