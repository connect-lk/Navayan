"use client";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";

import { NewBookingCard } from "@/components/comman/NewBookingCard";
import InventoryTable from "@/components/comman/InventoryTable";
import { bookingData } from "@/data";
import AllPages from "@/service/allPages";

const Index = () => {
  const router = useRouter();
  const { slug, session_id } = router.query;

  const [project, setProject] = useState(null);
  const [allInventoryList, setAllInventoryList] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [kycDetails, setKycDetails] = useState({});
  const [loading, setLoading] = useState(false);

  /** -------------------------------
   * Fetch Project by slug
   -------------------------------- */
const fetchProject = async (force = false) => {
  if (!slug) return null;

  try {
    const allProjects = await AllPages.properties(force); // pass force here
    const matchedProject = allProjects.find((p) => p.slug === slug);

    if (matchedProject) {
      setProject({ ...matchedProject });
      return matchedProject;
    }

    setProject(null);
    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    setProject(null);
    return null;
  }
};

  /** -------------------------------
   * Fetch Inventory List
   -------------------------------- */
  const InventoryListApiFun = async () => {
    if (!project?.id) return;

    try {
      const response = await AllPages.inventoryList(project.id);
      const tableData =
        response?.data?.map((item, index) => ({
          id: item?.id,
          sn: index + 1,
          plotNo: item?.plot_no,
          plotSize: `${item?.plot_size} sq.ft`,
          plotFacing: item?.facing,
          plcSide: item?.plc_side,
          plcPercentage: `${item?.plc_percentage}%`,
          north: item?.north,
          south: item?.south,
          east: item?.east,
          west: item?.west,
          withPlc: `₹${item?.with_plc}`,
          additional: `₹${item?.additional}`,
          total: item?.total,
          status: item?.status,
          property_id: item?.property_id,
          hold_expires_at: item?.hold_expires_at,
          created_at: item?.created_at,
          booked: item?.status?.toLowerCase() !== "available",
        })) || [];

      setAllInventoryList(tableData);
      setInventoryList(tableData);
    } catch (error) {
      console.error("Error fetching inventory list:", error);
    }
  };

  /** -------------------------------
   * Hold Flat
   -------------------------------- */
const holdFlatFun = async (id) => {
  try {
    await AllPages.holdFlat(id);
    await fetchProject(true);   // ✅ force fresh API fetch
    await InventoryListApiFun();
  } catch (error) {
    console.error("Error holding flat:", error.message);
  }
};

  /** -------------------------------
   * Get Aadhaar & PAN KYC Details
   -------------------------------- */
  const getAadhaarDetails = async (sessionId) => {
    const access_token = localStorage.getItem("accessToken");
    if (!access_token) return null;

    try {
      // DigiLocker API call
      const res = await fetch(
        `/api/digilocker_issued_doc?session_id=${sessionId}&access_token=${access_token}`
      );
      const digilockerData = await res.json();

      // PAN data
      const panRes = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilockerData?.pan?.data?.files[0]?.url,
        }),
      });
      const panData = await panRes.json();
      const panKyc = panData?.data?.Certificate?.CertificateData?.PAN;

      // Aadhaar data
      const aadhaarRes = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilockerData?.aadhaar?.data?.files[0]?.url,
        }),
      });
      const aadhaarData = await aadhaarRes.json();
      const aadhaarKyc =
        aadhaarData?.data?.Certificate?.CertificateData?.KycRes;

      return {
        uid: aadhaarKyc?.UidData?.$?.uid,
        name: aadhaarKyc?.UidData?.Poi?.$?.name,
        dob: aadhaarKyc?.UidData?.Poi?.$?.dob,
        gender: aadhaarKyc?.UidData?.Poi?.$?.gender,
        addressEnglish: aadhaarKyc?.UidData?.Poa?.$,
        addressLocal: aadhaarKyc?.UidData?.LData?.$,
        photo: aadhaarKyc?.UidData?.Pht,
        panNum: panKyc?.$?.num,
      };
    } catch (error) {
      console.error("Error fetching Aadhaar details:", error);
      return null;
    }
  };

  /** -------------------------------
   * Effects
   -------------------------------- */
  // Handle session_id → fetch KYC
  useEffect(() => {
    if (session_id) {
      setLoading(true);

      getAadhaarDetails(session_id).then((Details) => {
        if (Details) {
          setKycDetails(Details);
          localStorage.setItem("kyc_Details", JSON.stringify(Details));
          localStorage.setItem("session_id", session_id);

          const booking_id = localStorage.getItem("booking_id");
          if (booking_id) {
            router.push(`/properties/${slug}/bookingproperties/${booking_id}`);
          }
        }
        setLoading(false);
      });
    }
  }, [session_id]);

  // Fetch inventory when project is set
  useEffect(() => {
    if (project) {
      InventoryListApiFun();
    }
  }, [project]);

  // Search filter
  useEffect(() => {
    if (!searchText) {
      setInventoryList(allInventoryList);
    } else {
      const search = searchText.toLowerCase();
      const filtered = allInventoryList.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search)
        )
      );
      setInventoryList(filtered);
    }
  }, [searchText, allInventoryList]);

  // Initial fetch project
  useEffect(() => {
    fetchProject();
  }, [slug]);

  /** -------------------------------
   * Render
   -------------------------------- */
  return (
    <div className="max-w-screen-2xl mx-auto pb-16 px-6 min-h-screen md:px-8 lg:px-12 2xl:px-0">
      {loading ? (
        <div className="flex justify-center items-center gap-6 h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
          <span className="ml-3 text-lg">Loading property...</span>
        </div>
      ) : (
        <>
          {/* Heading + Card */}
          <div className="max-w-screen-2xl mx-auto pt-12">
            <h2 className="text-center text-neutral-900 md:text-3xl text-2xl font-bold leading-7 md:my-8 my-6">
              {bookingData?.heading}
            </h2>
            <div className="grid grid-cols-1 w-full xl:gap-8 gap-4">
              <NewBookingCard
                project_subtitle="Property Details"
                url={project?.acf?.property_image?.url}
                projectName={project?.title?.rendered}
                total={project?.flats_available?.total}
                available={project?.flats_available?.available}
                onHold={project?.flats_available?.hold}
                booked={project?.flats_available?.booked}
                slug={project?.slug}
              />
            </div>
          </div>

          {/* Search + Table */}
          <div className="w-full py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 mb-4 sm:mb-0 hidden md:block">
                {bookingData?.inventoryHeading}
              </h1>

              <div className="w-full sm:w-80">
                <div className="relative flex items-center bg-white rounded-xl">
                  <input
                    type="text"
                    placeholder={bookingData?.searchPlaceholder}
                    className="w-full py-3.5 pl-4 pr-10 text-sm text-gray-700 font-[600] placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#066fa9]"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <IoSearchOutline className="absolute right-3 w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          <InventoryTable
            tableData={inventoryList}
            holdFlatFun={holdFlatFun}
            InventoryListApiFun={InventoryListApiFun}
            fetchProject={fetchProject}
            searchText={searchText}
            slug={slug}
          />
        </>
      )}
    </div>
  );
};

export default Index;
