import React from "react";

import { useRouter } from "next/router";
const InventoryTable = ({ kycTable, tableData }) => {
  const router = useRouter();
  return (
    <div
      className={`bg-white rounded-xl  min-h-auto  ${
        kycTable === "kycTable" || kycTable === "ReviewTable"
          ? "shadow-sm"
          : "shadow-sm"
      }`}
    >
      <div
        className={`rounded-xl overflow-hidden ${
          kycTable === "kycTable" || kycTable === "ReviewTable"
            ? "bg-gray-100 "
            : "bg-gray-100  "
        }  `}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse  whitespace-nowrap">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-gray-200 text-[#6B7280] text-sm xl:text-[15px]">
                <th className="font-semibold xl:p-4 p-3 text-center ">SN.</th>
                <th className="font-semibold xl:p-4 p-3 text-center">
                  UNIT NO.
                </th>
                <th className="font-semibold xl:p-4 p-3 text-center">
                  PLOT SIZE
                </th>
                <th className="font-semibold xl:p-4 p-3 text-center">
                  PLOT FACING
                </th>
                <th className="font-semibold xl:p-4 p-3 text-center">PLC</th>
                <th className="font-semibold xl:p-4 p-3 text-center">COST</th>
                <th className="font-semibold xl:p-4 p-3 text-center">
                  ADD COST
                </th>
                <th className="font-semibold xl:p-4 p-3 text-center">STATUS</th>
                {kycTable === "kycTable" ||
                kycTable === "ReviewTable" ? null : (
                  <th className="font-semibold xl:p-4 p-3 text-center  ">
                    BOOK
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData?.map((row, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200 text-sm text-[#6B7280] md:text-base"
                >
                  <td className="xl:p-4 p-3 text-center  ">{row?.sn}</td>
                  <td className="xl:p-4 p-3 text-center">{row?.unitNo}</td>
                  <td className="xl:p-4 p-3 text-center">{row?.plotSize}</td>
                  <td className="xl:p-4 p-3 text-center">{row?.plotFacing}</td>
                  <td className="xl:p-4 p-3 text-center">{row?.plc}</td>
                  <td className="xl:p-4 p-3 text-center">{row?.cost}</td>
                  <td className="xl:p-4 p-3 text-center">{row?.addCost}</td>
                  <td className="xl:p-4 p-3 text-center">
                    <span
                      className={`px-2.5 py-1.5 rounded-sm text-sm font-semibold ${
                        row.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row?.status}
                    </span>
                  </td>
                  {kycTable === "kycTable" ||
                  kycTable === "ReviewTable" ? null : (
                    <td className="p-4 text-center ">
                      <button
                        onClick={() => router.push("/kyc")}
                        className={`font-semibold px-4 py-2 text-[14px]   cursor-pointer w-fit rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${
                          row?.booked
                            ? "bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed"
                            : " hover:bg-[#055a87] bg-[#066FA9] text-white"
                        }`}
                        disabled={row?.booked}
                      >
                        {row?.booked ? "Booked" : "Book Now"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
