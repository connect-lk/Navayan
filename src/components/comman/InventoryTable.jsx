"use client";

import React, { memo, useCallback } from "react";

import { useRouter } from "next/router";
const InventoryTable = memo(
  ({ kycTable, tableData, holdFlatFun, slug, loading }) => {
    const router = useRouter();


     const getAadhaarDetails = async (session_id) => {

    const access_token = localStorage.getItem("accessToken"); // browser can access localStorage

    const res = await fetch(
      `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
    );
    const digilocker_issued_docData = await res.json();
    console.log("Aadhaar document:", digilocker_issued_docData);


    const responsess = await fetch("/api/xml_to_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl: digilocker_issued_docData.pan.data.files[0].url
      }),
    });

    const datass = await responsess.json();
    const panKyc = datass.data.Certificate.CertificateData.PAN;


    const response = await fetch("/api/xml_to_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl: digilocker_issued_docData.aadhaar.data.files[0].url
      }),
    });

    const data = await response.json();
    // console.log("Parsed XML object:", data.data);
    const aadhaarKyc = data.data.Certificate.CertificateData.KycRes;

    const userInfo = {
      uid: aadhaarKyc.UidData.$.uid,
      name: aadhaarKyc.UidData.Poi.$.name,
      dob: aadhaarKyc.UidData.Poi.$.dob,
      gender: aadhaarKyc.UidData.Poi.$.gender,
      addressEnglish: aadhaarKyc.UidData.Poa.$,
      addressLocal: aadhaarKyc.UidData.LData.$,
      photo: aadhaarKyc.UidData.Pht,
      panNum: panKyc.$.num
    };

    console.log(userInfo);
    return userInfo
  }

    const handleBookNow = useCallback(
      async (id) => {
        // await holdFlatFun(id)
        localStorage.setItem("booking_id",id)

        const session_id = "1f214c31-a152-4c7e-be35-f447d1c64bdf";
        const access_token = localStorage.getItem("accessToken");

        const statusRes = await fetch(
          `/api/digilocker_status?session_id=${session_id}&access_token=${access_token}`
        );

        const statusData = await statusRes.json();
        console.log("Session Status:", statusData);
      const createdAt = statusData?.data?.created_at;
      const updatedAt = statusData?.data?.updated_at;

      if (createdAt) {
        console.log("Created At (raw):", createdAt);
        console.log("Created At (ISO):", new Date(createdAt).toISOString());
        console.log("Created At (local):", new Date(createdAt).toLocaleString());
      }

      if (updatedAt) {
        console.log("Updated At (raw):", updatedAt);
        console.log("Updated At (ISO):", new Date(updatedAt).toISOString());
        console.log("Updated At (local):", new Date(updatedAt).toLocaleString());
      }

      if (statusData.sessionExpired) {
        const res = await fetch("/api/digilocker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          slug
        })
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken); // ✅ store in browser
      }

    if (data.digiData?.data?.authorization_url) {
      window.location.href = data.digiData.data.authorization_url; // redirect user
    } else {
        console.error("No authorization URL found", data);
      }
      
      }else{
        // alert()
        getAadhaarDetails(session_id).then((Details) => {
          // Save object as JSON string
          localStorage.setItem("kyc_Details", JSON.stringify(Details));
          const bokking_id = localStorage.getItem("booking_id");
          router.push(`/properties/${slug}/bookingproperties/${id}`);
        });
      }
      },
      [holdFlatFun, router, slug]
    );

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
                  {/* <th className="font-semibold xl:p-4 p-3 text-center ">SN.</th> */}
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    PLOT NO.
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    PLOT SIZE
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    FACING
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    PLC SIDE
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    PLC %
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    NORTH
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    SOUTH
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">EAST</th>
                  <th className="font-semibold xl:p-4 p-3 text-center">WEST</th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    WITH PLC
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    ADDITIONAL
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    TOTAL
                  </th>
                  <th className="font-semibold xl:p-4 p-3 text-center">
                    STATUS
                  </th>
                  {kycTable === "kycTable" ||
                  kycTable === "ReviewTable" ? null : (
                    <th className="font-semibold xl:p-4 p-3 text-center  ">
                      BOOK
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9">
                      <div className="flex justify-center items-center w-full h-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
                        <span className="ml-3 text-sm">
                          Loading property...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50 transition-colors duration-200 text-sm text-[#6B7280] md:text-base"
                    >
                      {/* <td className="xl:p-4 p-3 text-center">{row?.sn}</td> */}
                      <td className="xl:p-4 p-3 text-center">{row?.plotNo}</td>
                      <td className="xl:p-4 p-3 text-center">
                        {row?.plotSize}
                      </td>
                      <td className="xl:p-4 p-3 text-center">
                        {row?.plotFacing}
                      </td>
                      <td className="xl:p-4 p-3 text-center">{row?.plcSide}</td>
                      <td className="xl:p-4 p-3 text-center">
                        {row?.plcPercentage}
                      </td>
                      <td className="xl:p-4 p-3 text-center">{row?.north}</td>
                      <td className="xl:p-4 p-3 text-center">{row?.south}</td>
                      <td className="xl:p-4 p-3 text-center">{row?.east}</td>
                      <td className="xl:p-4 p-3 text-center">{row?.west}</td>
                      <td className="xl:p-4 p-3 text-center">{row?.withPlc}</td>
                      <td className="xl:p-4 p-3 text-center">
                        {row?.additional}
                      </td>
                      <td className="xl:p-4 p-3 text-center">{row?.total}</td>
                      <td className="xl:p-4 p-3 text-center">
                        <span
                          className={`px-2.5 py-1.5 rounded-sm text-sm font-semibold ${
                            row.status?.toLowerCase() === "available"
                              ? "bg-green-50 text-green-800"
                              : row.status?.toLowerCase() === "hold"
                              ? "bg-blue-50 text-blue-800"
                              : "bg-red-50 text-red-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      {kycTable === "kycTable" ||
                      kycTable === "ReviewTable" ? null : (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleBookNow(row?.id)}
                            className={`font-semibold px-4 py-2 text-[14px] w-fit rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${
                              row?.booked
                                ? "bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed"
                                : "hover:bg-[#055a87] bg-[#066FA9] text-white cursor-pointer"
                            }`}
                            disabled={row?.booked}
                          >
                            {row?.booked ? "Booked" : "Book Now"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

InventoryTable.displayName = "InventoryTable";

export default InventoryTable;
