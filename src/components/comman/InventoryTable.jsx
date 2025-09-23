"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIosNew } from "react-icons/md";
import AllPages from "@/service/allPages";

const InventoryTable = memo(
  ({ kycTable, tableData, slug, loading, InventoryListApiFun }) => {
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [now, setNow] = useState(new Date()); // track current time
    const rowsPerPage = 20;

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

    // 📌 Book Now
    const handleBookNow = useCallback(
      async (plotNo) => {
        try {
          const res = await AllPages.holdFlat(plotNo);
          console.log("API Response:", res);
          InventoryListApiFun();
          router.push(`/properties/${slug}/bookingproperties/${plotNo}`);
        } catch (error) {
          console.error("Booking failed:", error.message);
        }
      },
      [router, slug]
    );

    return (
      <div className="bg-white rounded-xl min-h-auto shadow-sm">
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
                    const isHoldActive = remainingTime > 0;

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
                        <td className="xl:p-3 p-3 text-center">{row?.total}</td>

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
                                className={`font-semibold px-4 py-2 text-[14px] w-fit rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${
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
