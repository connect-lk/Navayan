"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIosNew } from "react-icons/md";
import AllPages from "@/service/allPages";
import { toast, ToastContainer } from "react-toastify";
import SessionManager from "@/utils/sessionManager";

const InventoryTable = memo(
  ({
    kycTable,
    tableData,
    slug,
    holdFlatFun,
    loading,
    InventoryListApiFun,
    fetchProject,
  }) => {
    const router = useRouter();

    const [loadingRow, setLoadingRow] = useState(null);
    const [updatedHoldRows, setUpdatedHoldRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [now, setNow] = useState(new Date()); // track current time
    const rowsPerPage = 20;

    // console.log("tableData", tableData);

    // ✅ Update current time every second
    useEffect(() => {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = tableData?.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(tableData?.length / rowsPerPage);

    // ⏳ Format mm:ss
    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };
    const getRemainingTime = (expiresAt) => {
      if (!expiresAt) return 0;
      const expiry = new Date(expiresAt.replace(" ", "T")).getTime();
      const now = new Date().getTime();

      const diff = Math.round((expiry - now) / 1000); // round instead of floor
      return diff > 0 ? diff : 0;
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
      console.log("Aadhaar document:", digilocker_issued_docData);

      const responsess = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilocker_issued_docData?.pan?.data?.files[0].url,
        }),
      });

      const datass = await responsess.json();
      const panKyc = datass?.data?.Certificate?.CertificateData?.PAN;

      const response = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilocker_issued_docData?.aadhaar?.data?.files[0].url,
        }),
      });

      const data = await response.json();
      // console.log("Parsed XML object:", data.data);
      const aadhaarKyc = data?.data?.Certificate?.CertificateData.KycRes;

      const userInfo = {
        uid: aadhaarKyc?.UidData?.$?.uid,
        name: aadhaarKyc?.UidData?.Poi?.$?.name,
        dob: aadhaarKyc?.UidData?.Poi?.$?.dob,
        gender: aadhaarKyc?.UidData?.Poi?.$?.gender,
        addressEnglish: aadhaarKyc?.UidData?.Poa?.$,
        addressLocal: aadhaarKyc?.UidData?.LData?.$,
        photo: aadhaarKyc?.UidData?.Pht,
        panNum: panKyc?.$?.num,
      };

      console.log(userInfo);
      return userInfo;
    };

    const handleBookNow = useCallback(async (id) => {
          await holdFlatFun(id);
          setLoadingRow(id);
          setTimeout(async () => {
            // Create secure session instead of using localStorage
            try {
              await SessionManager.createSession({
                bookingId: id,
                slug: slug,
                plotNo: id,
                currentStep: 2
              });
              router.push(`/properties/${slug}/bookingproperties/${id}`);
            } catch (error) {
              console.error("Error creating session:", error);
              router.push(`/properties/${slug}/bookingproperties/${id}`);
            }
          }, 1000);
      // const session_id = localStorage.getItem("session_id");
      // const access_token = localStorage.getItem("accessToken");
      // let statusData;
      // if (session_id && access_token) {
      //   const statusRes = await fetch(
      //     `/api/digilocker_status?session_id=${session_id}&access_token=${access_token}`
      //   );

      //   statusData = await statusRes.json();
      //   console.log("Session Status:", statusData);
      //   const createdAt = statusData?.data?.created_at;
      //   const updatedAt = statusData?.data?.updated_at;
      // }

      // if (
      //   statusData?.sessionExpired ||
      //   !session_id ||
      //   statusData?.code == 521 ||
      //   statusData?.code == 403
      // ) {
      //   // alert("d,jsahfjdasgfjh")
      //   const res = await fetch("/api/digilocker", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       slug,
      //     }),
      //   });

      //   const data = await res.json();
      //   console.log("API Response:", data);

      //   if (data.accessToken) {
      //     localStorage.setItem("accessToken", data.accessToken); // ✅ store in browser
      //     await holdFlatFun(id);
      //   }

      //   if (data.digiData?.data?.authorization_url) {
      //     window.location.href = data.digiData.data.authorization_url; // redirect user
      //   } else {
      //     setLoadingRow(null);
      //     console.error("No authorization URL found", data);
      //     if (data.error) {
      //       toast.error("Something went wrong !")
      //     }
      //   }
      // } else {

      //   getAadhaarDetails(session_id).then(async (Details) => {
      //     await holdFlatFun(id);
      //     setLoadingRow(id);

      //     // Save object as JSON string
      //     localStorage.setItem("kyc_Details", JSON.stringify(Details));
      //     const bokking_id = localStorage.getItem("booking_id");
      //     router.push(`/properties/${slug}/bookingproperties/${id}`);
      //   });
      // }
    });
    const handleHoldStatusUpdate = async (propertyId, plotNo) => {
      try {
        const response = await AllPages.holdStatusUpdate(propertyId, plotNo);
        if (response?.success) {
          await InventoryListApiFun(); // refresh inventory list
          await fetchProject(true); // force fresh project API
        }
      } catch (error) {
        console.error("Failed to update hold status:", error);
      }
    };

    return (
      <div className="bg-white rounded-xl min-h-auto shadow-sm">
        <ToastContainer/>
        <div className="rounded-xl overflow-hidden bg-gray-100">
          <div className="overflow-x-auto relative">
            <table className="w-full table-auto border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-gray-200 text-[#6B7280] text-sm xl:text-[15px]">
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center bg-[#f9fafb] sticky left-0 z-10">
                    PLOT NO.
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    PLOT SIZE
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    FACING
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    PLC SIDE
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    PLC %
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    NORTH
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    SOUTH
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    EAST
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    WEST
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    WITH PLC
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    ADDITIONAL
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    TOTAL
                  </th>
                  <th className="font-semibold xl:px-3 px-3 py-5 text-center">
                    STATUS
                  </th>
                  {kycTable !== "kycTable" && kycTable !== "ReviewTable" && (
                    <th className="font-semibold xl:px-3 px-3 py-5 text-center bg-[#f9fafb] sticky right-0 z-10">
                      BOOK
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="14">
                      <div className="flex justify-center items-center w-full h-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
                        <span className="ml-3 text-sm">
                          Loading property...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : currentRows?.length > 0 ? (
                  currentRows.map((row, index) => {
                    const remainingTime = getRemainingTime(
                      row?.hold_expires_at,
                      row?.created_at
                    );

                    const isHoldActive = remainingTime > 1;

                    if (
                      remainingTime === 0 &&
                      row?.status?.toLowerCase() === "hold" &&
                      !updatedHoldRows.includes(row?.id) &&
                      row?.property_id &&
                      row?.plotNo
                    ) {
                      handleHoldStatusUpdate(row.property_id, row.plotNo);
                      setUpdatedHoldRows((prev) => [...prev, row.id]); // mark as updated
                    }
                    return (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 transition-colors duration-200 text-sm text-[#6B7280] md:text-base"
                      >
                        <td className="xl:p-3 p-3 text-center bg-white sticky left-0 z-10">
                          {row?.plotNo}
                        </td>
                        <td className="xl:p-3 p-3 text-center">
                          {row?.plotSize}
                        </td>
                        <td className="xl:p-3 p-3 text-center">
                          {row?.plotFacing}
                        </td>
                        <td className="xl:p-3 p-3 text-center">
                          {row?.plcSide}
                        </td>
                        <td className="xl:p-3 p-3 text-center">
                          {row?.plcPercentage}
                        </td>
                        <td className="xl:p-3 p-3 text-center">{row?.north}</td>
                        <td className="xl:p-3 p-3 text-center">{row?.south}</td>
                        <td className="xl:p-3 p-3 text-center">{row?.east}</td>
                        <td className="xl:p-3 p-3 text-center">{row?.west}</td>
                        <td className="xl:p-3 p-3 text-center">
                          {row?.withPlc}
                        </td>
                        <td className="xl:p-3 p-3 text-center">
                          {row?.additional}
                        </td>
                        <td className="xl:p-3 p-3 text-center">
                          ₹{row?.total}
                        </td>

                        <td className="xl:p-3 p-3 text-center">
                          {isHoldActive ? (
                            <span className="px-2.5 py-1.5 rounded-sm text-sm font-semibold bg-blue-50 text-[#066FA9]">
                              Hold ({formatTime(remainingTime)})
                            </span>
                          ) : (
                            <span
                              className={`px-2.5 py-1.5 rounded-sm text-sm font-semibold ${
                                row.status?.toLowerCase() === "available"
                                  ? "bg-green-50 text-green-800"
                                  : row.status?.toLowerCase() === "booked"
                                  ? "bg-red-50 text-red-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {row.status}
                            </span>
                          )}
                        </td>

                        {kycTable !== "kycTable" &&
                          kycTable !== "ReviewTable" && (
                            <td className="p-4 text-center bg-white sticky right-0 z-10">
                              <button
                                onClick={() => handleBookNow(row?.plotNo)}
                                className={`font-semibold sm:px-4 px-3 sm:py-2 py-1.5 sm:text-[14px] text-[12px] flex items-center gap-4 w-fit rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${
                                  row?.booked || isHoldActive
                                    ? "bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed"
                                    : "hover:bg-[#055a87] bg-[#066FA9] text-white cursor-pointer"
                                }`}
                                disabled={row?.booked || isHoldActive}
                              >
                                {row?.booked
                                  ? "Booked"
                                  : isHoldActive
                                  ? "Hold"
                                  : "Book Now"}
                                {loadingRow === row?.plotNo && (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                )}
                              </button>
                            </td>
                          )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="14" className="text-center py-6 text-gray-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {tableData?.length > rowsPerPage && (
            <div className="flex justify-between px-6 items-center gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-sm text-gray-600 disabled:opacity-50 cursor-pointer"
              >
                <MdArrowBackIosNew className="text-xs" />
                <span className="sm:block hidden">PREVIOUS</span>
              </button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const isMobile =
                    typeof window !== "undefined" && window.innerWidth < 640;
                  const maxPageButtons = isMobile ? 3 : 7;

                  let startPage = Math.max(currentPage - 3, 1);
                  let endPage = Math.min(
                    startPage + maxPageButtons - 1,
                    totalPages
                  );

                  if (endPage - startPage < maxPageButtons - 1) {
                    startPage = Math.max(endPage - maxPageButtons + 1, 1);
                  }

                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className={`sm:w-10 w-8 sm:h-10 h-8 flex items-center justify-center rounded-full text-sm font-medium transition ${
                          currentPage === 1
                            ? "bg-[#066FA9] text-white"
                            : "transition-all shadow-sm hover:shadow-lg border border-slate-200 text-slate-600 hover:text-white hover:bg-[#066FA9]"
                        }`}
                      >
                        1
                      </button>
                    );
                    if (startPage > 2)
                      pages.push(
                        <span key="start-ellipsis" className="px-2">
                          ...
                        </span>
                      );
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`sm:w-10 w-8 sm:h-10 h-8 flex items-center justify-center rounded-full text-sm font-medium transition ${
                          currentPage === i
                            ? "bg-[#066FA9] text-white"
                            : "transition-all shadow-sm hover:shadow-lg border border-slate-200 text-slate-600 hover:text-white hover:bg-[#066FA9]"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1)
                      pages.push(
                        <span key="end-ellipsis" className="px-2">
                          ...
                        </span>
                      );
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className={`sm:w-10 w-8 sm:h-10 h-8 flex items-center justify-center rounded-full text-sm font-medium transition sm:block hidden ${
                          currentPage === totalPages
                            ? "bg-[#066FA9] text-white"
                            : "transition-all shadow-sm hover:shadow-lg border border-slate-200 text-slate-600 hover:text-white hover:bg-[#066FA9]"
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-sm text-gray-600 disabled:opacity-50 cursor-pointer"
              >
                <span className="sm:block hidden">NEXT</span>
                <GrNext className="text-xs" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

InventoryTable.displayName = "InventoryTable";

export default InventoryTable;
