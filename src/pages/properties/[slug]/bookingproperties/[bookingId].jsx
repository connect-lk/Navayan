"use client";
import ApplicantDetails from "@/components/comman/ApplicantDetails";
import CoApplicantDetails from "@/components/comman/CoApplicantDetails";
import InventoryTable from "@/components/comman/InventoryTable";
import { KycTableData } from "@/data";
import { ReviewTableData } from "@/data";
import KYCForm from "@/components/comman/KYCForm";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  HiOutlineArrowSmallRight,
  HiOutlineArrowSmallLeft,
} from "react-icons/hi2";
import { useParams } from "next/navigation";
import AllPages from "@/service/allPages";
import { useRouter } from "next/router";
import PaymentPlan from "@/components/comman/PaymentPlan";
import SessionManager from "@/utils/sessionManager";
import BookedPropertyDetails from "@/components/comman/BookedPropertyDetails";

// Main application component
export default function page() {
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [kycDetails, setKycDetails] = useState({});
  const params = useParams();
  const plotNo = params?.bookingId;
  const slug = params?.slug;
  const [loadingRow, setLoadingRow] = useState(null);
  const router = useRouter();
  const { session_id } = router.query; // dynamically get session_id
  const [inventoryItem, setInventoryItem] = useState(null);
  const [reviewApplicationlist, setReviewApplicationList] = useState({});
  const [reviewloading, setReviewLoading] = useState(true);
  const [accessValidated, setAccessValidated] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const paymentStatusCheckedRef = useRef(false);

console.log("currentStep", reviewApplicationlist);



  const InventoryListApiFun = async () => {
    try {
      // setLoading(true);
      const response = await AllPages.inventoryList(41);
      const data = response?.data || [];
      const matchedItem = data.find((item) => item.id === plotNo);
      setInventoryItem(matchedItem);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      // setLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  const getAadhaarDetails = async (session_id) => {
    // Get access token from secure session instead of localStorage
    const sensitiveData = await SessionManager.getSensitiveData();
    const access_token = sensitiveData?.accessToken;

    if (!access_token) {
      console.error("Access token not found in session");
      return null;
    }

    const res = await fetch(
      `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
    );
    const digilocker_issued_docData = await res.json();

    let panKyc;
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
  // Track if reviewApplication has been called to prevent infinite loops
  const reviewApplicationCalledRef = useRef(false);
  const lastPropertyIdRef = useRef(null);
  const lastPlotNoRef = useRef(null);

  const reviewApplication = useCallback(async (forceRefresh = false) => {
    const propertyId = tableData[0]?.property_id;

    // Prevent duplicate calls unless forced
    if (!forceRefresh &&
      reviewApplicationCalledRef.current &&
      lastPropertyIdRef.current === propertyId &&
      lastPlotNoRef.current === plotNo) {
      return;
    }

    if (!propertyId || !plotNo) {
      return;
    }

    try {
      setReviewLoading(true);
      reviewApplicationCalledRef.current = true;
      lastPropertyIdRef.current = propertyId;
      lastPlotNoRef.current = plotNo;

      const response = await AllPages.reviewApplication(propertyId, plotNo);
      console.log("reviewApplication API response:", response);
      console.log("reviewApplication response.data:", response?.data);
      console.log("reviewApplication response.data[0]:", response?.data?.[0]);
      
      const bookingData = response?.data?.[0] || response?.data || null;
      console.log("bookingData after processing:", bookingData);
      console.log("bookingData keys:", bookingData ? Object.keys(bookingData) : "null/undefined");
      
      // Always set to an object, never undefined or null
      setReviewApplicationList(bookingData || {});
      console.log("reviewApplicationlist state set to:", bookingData || {});

      // If booking data exists, it means the property is booked
      if (bookingData && bookingData.bookingId) {
        setIsBooked(true);
      }
    } catch (error) {
      console.error("Error fetching inventory list:", error);
      reviewApplicationCalledRef.current = false; // Reset on error
    } finally {
      setReviewLoading(false);
    }
  }, [plotNo, tableData?.[0]?.property_id]); // Only depend on property_id, not entire tableData




  const bookedStatusUpdateFun = async () => {
    try {
      await AllPages.bookedStatusUpdate(tableData[0]?.property_id, plotNo);
      InventoryListApiFun();
    } catch (error) {
      console.error("Error holding flat:", error.message);
    }
  };






  const propertyId = tableData[0]?.property_id;

  const handleNextStep = async () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      // Update secure session instead of localStorage
      await SessionManager.updateSession({ currentStep: newStep });
    }
  };
  const handlePreviousStep = async () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      // Update secure session instead of localStorage
      await SessionManager.updateSession({ currentStep: newStep });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentStep]);

  useEffect(() => {
    if (plotNo && propertyId) {
      // Reset ref when plotNo or propertyId changes
      if (lastPropertyIdRef.current !== propertyId || lastPlotNoRef.current !== plotNo) {
        reviewApplicationCalledRef.current = false;
      }
      reviewApplication();
    }
  }, [plotNo, propertyId, reviewApplication]);

  // Ensure reviewApplication is called when step 3 is reached and data is missing
  useEffect(() => {
    if (currentStep === 3 && plotNo && propertyId && !reviewloading) {
      // Check if we have any meaningful data (not just empty object)
      const hasData = reviewApplicationlist && 
                     typeof reviewApplicationlist === 'object' && 
                     Object.keys(reviewApplicationlist).length > 0;
      
      // If no data, fetch it
      if (!hasData) {
        console.log("Step 3 reached but no data found, fetching reviewApplication...");
        // Reset the ref to allow fetching
        reviewApplicationCalledRef.current = false;
        lastPropertyIdRef.current = null;
        lastPlotNoRef.current = null;
        reviewApplication(true); // Force refresh
      } else {
        console.log("Step 3 reached with data:", reviewApplicationlist);
      }
    }
  }, [currentStep, plotNo, propertyId, reviewApplication, reviewApplicationlist, reviewloading]);

  // Ensure reviewApplication is called when step 4 is reached and data is missing
  useEffect(() => {
    if (currentStep === 4 && plotNo && propertyId && !reviewloading) {
      // Check if we have any meaningful data (not just empty object)
      const hasData = reviewApplicationlist && 
                     typeof reviewApplicationlist === 'object' && 
                     Object.keys(reviewApplicationlist).length > 0;
      
      // If no data, fetch it
      if (!hasData) {
        console.log("Step 4 reached but no data found, fetching reviewApplication...");
        // Reset the ref to allow fetching
        reviewApplicationCalledRef.current = false;
        lastPropertyIdRef.current = null;
        lastPlotNoRef.current = null;
        reviewApplication(true); // Force refresh
      } else {
        console.log("Step 4 reached with data:", reviewApplicationlist);
      }
    }
  }, [currentStep, plotNo, propertyId, reviewApplication, reviewApplicationlist, reviewloading]);

  // Check payment status and refresh if needed (only once after payment)
  useEffect(() => {
    if (
      currentStep === 4 &&
      reviewApplicationlist?.paymentStatus === "paid" &&
      !paymentStatusCheckedRef.current &&
      !reviewloading &&
      propertyId
    ) {
      paymentStatusCheckedRef.current = true;
      // Force refresh booking data once after payment
      reviewApplicationCalledRef.current = false;
      reviewApplication(true); // Force refresh
    }
  }, [currentStep, reviewApplicationlist?.paymentStatus, reviewloading, propertyId, reviewApplication]);

  // Check booking status when inventory item loads
  useEffect(() => {
    if (inventoryItem) {
      const status = inventoryItem?.status?.toLowerCase();
      if (status === "booked") {
        setIsBooked(true);
      } else {
        setIsBooked(false);
      }
    }
  }, [inventoryItem]);

  // Refresh inventory when payment is completed to get updated status
  useEffect(() => {
    if (reviewApplicationlist?.paymentStatus === "paid" && plotNo && !reviewloading) {
      // Refresh inventory to get updated booked status
      InventoryListApiFun();
      // Refresh booking data
      if (!reviewApplicationCalledRef.current) {
        reviewApplicationCalledRef.current = false;
        reviewApplication(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewApplicationlist?.paymentStatus]);

  // Validate booking access and load session data
  useEffect(() => {
    const validateAndLoadSession = async () => {
      try {
        // Validate booking access
        const isValid = await SessionManager.validateBooking(plotNo, slug);

        if (!isValid && plotNo && slug) {
          // If access is invalid, redirect to property page
          router.push(`/properties/${slug}`);
          return;
        }

        setAccessValidated(true);

        // Load session data
        const sessionData = await SessionManager.getSession();
        if (sessionData) {
          if (sessionData.currentStep) {
            setCurrentStep(sessionData.currentStep);
          }
          if (sessionData.kycDetails) {
            setKycDetails(sessionData.kycDetails);
          }
        }
      } catch (error) {
        console.error("Error validating booking access:", error);
        router.push(`/properties/${slug}`);
      }
    };

    if (plotNo && slug) {
      validateAndLoadSession();
    }
  }, [plotNo, slug, router]);

  useEffect(() => {
    if (plotNo) {
      InventoryListApiFun();
    }
  }, [plotNo]);



  useEffect(() => {
    if (session_id) {
      setLoading(true);
      getAadhaarDetails(session_id).then(async (Details) => {
        if (Details) {
          // Save to secure session instead of localStorage
          await SessionManager.createSession({
            bookingId: plotNo,
            slug: slug,
            kycDetails: Details,
            sessionId: session_id,
            plotNo: plotNo,
            currentStep: 2
          });

          // Get sensitive data for session
          const sensitiveData = await SessionManager.getSensitiveData();
          if (sensitiveData?.accessToken) {
            await SessionManager.updateSession({
              accessToken: sensitiveData.accessToken
            });
          }

          setKycDetails(Details);
          setLoading(false);
          router.push(`/properties/${slug}/bookingproperties/${plotNo}`);
        }
      });
    }
  }, [session_id, plotNo, slug, router]);


  const steps = [
    { id: 1, name: "Select Property" },
    { id: 2, name: "KYC" },
    { id: 3, name: "Review" },
    { id: 4, name: "Payment" },
  ];


  const handle_kyc = async () => {
    try {
      // Get session data securely
      const sessionData = await SessionManager.getSession();
      const sensitiveData = await SessionManager.getSensitiveData();

      const session_id = sessionData?.sessionId || sensitiveData?.sessionId;
      const access_token = sensitiveData?.accessToken;

      let statusData;
      if (session_id && access_token) {
        const statusRes = await fetch(
          `/api/digilocker_status?session_id=${session_id}&access_token=${access_token}`
        );

        statusData = await statusRes.json();
        console.log("Session Status:", statusData);
      }

      if (
        statusData?.sessionExpired ||
        !session_id ||
        statusData?.code == 521 ||
        statusData?.code == 403
      ) {
        // Create new digilocker session
        const res = await fetch("/api/digilocker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            bookingId: plotNo
          }),
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (data.accessToken) {
          // Save to secure session instead of localStorage
          await SessionManager.createSession({
            bookingId: plotNo,
            slug: slug,
            accessToken: data.accessToken,
            plotNo: plotNo,
            currentStep: currentStep
          });
        }

        if (data.digiData?.data?.authorization_url) {
          window.location.href = data.digiData.data.authorization_url;
        } else {
          setLoadingRow(null);
          console.error("No authorization URL found", data);
          if (data.error) {
            // toast.error("Something went wrong !")
          }
        }
      } else {
        getAadhaarDetails(session_id).then(async (Details) => {
          if (Details) {
            setLoadingRow(plotNo);

            // Save to secure session instead of localStorage
            await SessionManager.updateSession({
              kycDetails: Details,
              sessionId: session_id
            });

            setKycDetails(Details);
          }
        });
      }
    } catch (error) {
      console.error("Error in handle_kyc:", error);
    }
  }


  // useEffect(() => {
  //   const 
  // }, [])


  // Don't render content until access is validated
  if (!accessValidated && plotNo && slug) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
        <span className="ml-3 text-sm">Validating access...</span>
      </div>
    );
  }

  // Show booked details UI if:
  // 1. Property is booked (status === "booked" in inventoryItem) OR
  // 2. Payment is completed (paymentStatus === "paid") AND booking exists
  const isPropertyBooked = inventoryItem?.status?.toLowerCase() === "booked";
  const paymentCompleted = reviewApplicationlist?.paymentStatus === "paid";
  const hasBookingId = reviewApplicationlist?.bookingId;

  // Show booked UI if:
  // - Property status is "booked" AND has booking ID, OR
  // - Payment is completed AND has booking ID
  const shouldShowBookedUI =
    inventoryItem &&
    hasBookingId &&
    (isPropertyBooked || paymentCompleted) &&
    !reviewloading;

  if (shouldShowBookedUI) {
    return (
      <div className="bg-gray-100 min-h-screen overflow-auto p-4 sm:p-8">
        <BookedPropertyDetails
          inventoryItem={inventoryItem}
          reviewApplicationlist={reviewApplicationlist}
          tableData={tableData}
          slug={slug}
          kycDetails={kycDetails}
        />
      </div>
    );
  }

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
                  plotNo={plotNo}
                  allKycDetails={reviewApplicationlist}
                  reviewApplication={reviewApplication}
                />
              ) : (
                <div className="flex items-center justify-center  mt-6  w-full bg-gray-100">
                  <div className="bg-white py-24 rounded-lg shadow-md flex h-full justify-center w-full">
                    <button className="py-3.5 md:px-12 px-4 cursor-pointer  bg-[#066FA9] rounded-lg text-white text-sm font-medium font-['Inter'] leading-tight" onClick={handle_kyc}>
                      Complete Your KYC
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center w-full h-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
                <span className="ml-3 text-sm">Loading kyc...</span>
              </div>
            )


          }
        </div>
      );
    } else if (currentStep === 3) {
      // Check if we have any data at all (not just empty object)
      const hasData = reviewApplicationlist && 
                     typeof reviewApplicationlist === 'object' && 
                     Object.keys(reviewApplicationlist).length > 0;
      
      // Debug logs
      console.log("Step 3 - reviewApplicationlist:", reviewApplicationlist);
      console.log("Step 3 - hasData:", hasData);
      console.log("Step 3 - reviewloading:", reviewloading);
      console.log("Step 3 - reviewApplicationlist keys:", reviewApplicationlist ? Object.keys(reviewApplicationlist) : "null/undefined");
      
      // If no data and we're not loading, try to fetch it
      if (!hasData && !reviewloading && plotNo && propertyId) {
        console.log("Step 3: No data found, attempting to fetch reviewApplication...");
        reviewApplicationCalledRef.current = false;
        reviewApplication(true);
      }

      return (
        <>
          {reviewloading || !hasData ? (
            <div className="flex justify-center items-center w-full h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
              <span className="ml-3 text-sm">Loading booking details...</span>
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
                    Applicant's Details
                  </h1>
                </div>
                <ApplicantDetails
                  reviewApplicationlist={reviewApplicationlist || {}}
                />
                <div className="w-full py-6 md:mt-10 mt-4">
                  <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 text-left md:text-left pl-1 md:pl-0">
                    Co-Applicant's Details
                  </h1>
                </div>
                <CoApplicantDetails
                  reviewApplicationlist={reviewApplicationlist || {}}
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
      // Check if payment is already completed or property is booked - show booked UI instead


      // if ((reviewApplicationlist?.paymentStatus === "paid" || isBooked) && hasBookingId && !reviewloading) {
      //   // This will be caught by the shouldShowBookedUI check above
      //   return null;
      // }

      // Check if payment is already completed - show loading while data refreshes
      if (reviewApplicationlist?.paymentStatus === "paid" && reviewloading) {
        return (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
            <span className="ml-3 text-sm">Loading booking details...</span>
          </div>
        );
      }

      // Show loading if data is still being fetched
      if (reviewloading) {
        return (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
            <span className="ml-3 text-sm">Loading booking details...</span>
          </div>
        );
      }

      // Check if we have any data at all (not just empty object)
      const hasData = reviewApplicationlist && 
                     typeof reviewApplicationlist === 'object' && 
                     Object.keys(reviewApplicationlist).length > 0;
      
      // If no data and we're not loading, try to fetch it one more time
      if (!hasData && !reviewloading && plotNo && propertyId) {
        console.log("No data found, attempting to fetch reviewApplication...");
        reviewApplicationCalledRef.current = false;
        reviewApplication(true);
        return (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
            <span className="ml-3 text-sm">Loading booking details...</span>
          </div>
        );
      }

      console.log("reviewApplicationlist before PaymentPlan:", reviewApplicationlist);
      console.log("reviewApplicationlist keys:", Object.keys(reviewApplicationlist));

      return (
        <>
          <PaymentPlan
            handlePreviousStep={handlePreviousStep}
            inventoryItem={inventoryItem}
            reviewApplicationlist={reviewApplicationlist}
            kycDetails={kycDetails}
          />
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
                className={`md:w-12 w-8 md:h-12 h-8 rounded-full flex items-center text-[12px] md:text-[16px] justify-center font-bold ${currentStep >= step?.id
                  ? "border-2 border-[#066fa9] text-[#066fa9] "
                  : "text-stone-900"
                  } transition-colors z-50 duration-300
                  ${currentStep > step?.id ? "bg-[#066FA9]" : "bg-white "}
                  ${currentStep === step?.id
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
                className={`mt-2 text-center lg:text-[16px] md:text-md text-[11px] font-medium transition-colors duration-300 ${currentStep >= step?.id ? "text-[#1C1C1C]" : "text-[#1C1C1C]"
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
