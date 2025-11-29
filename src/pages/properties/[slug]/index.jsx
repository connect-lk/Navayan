"use client";
import { IoSearchOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { NewBookingCard } from "@/components/comman/NewBookingCard";
import InventoryTable from "@/components/comman/InventoryTable";
import { bookingData } from "@/data";
import AllPages from "@/service/allPages";
import { useRouter } from "next/router";
import SessionManager from "@/utils/sessionManager";

const index = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [searchText, setSearchText] = useState(""); // <-- Add search state
  const [kycDetails, setKycDetails] = useState({});
  const router = useRouter();
  const { slug } = router.query; // get slug from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { session_id } = router.query; // dynamically get session_id
  // console.log("project",project?.id)
  const fetchProject = async () => {
    if (!slug) return;
    try {
      const allProjects = await AllPages.properties();
      const matchedProject = allProjects.find((p) => p.slug === slug);
      setProject(matchedProject);
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject([]);
    } finally {
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const InventoryListApiFun = async () => {
    try {
      const response = await AllPages.inventoryList(project?.id);
      setInventoryList(response?.data);
    } catch (error) {
      console.error("Error fetching inventory list:", error);
    }
  };

  useEffect(() => {
    InventoryListApiFun();
  }, [project?.id]);

  const holdFlatFun = async (id) => {
    try {
      await AllPages.holdFlat(id);
      InventoryListApiFun();
    } catch (error) {
      console.error("Error holding flat:", error.message);
    }
  };
  const tableData =
    inventoryList?.map((item, index) => ({
      id: item?.id,
      sn: index + 1,
      plotNo: item?.plot_no,
      property_id: item?.property_id || project?.id, // Add property_id from item or fallback to project.id
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
      hold_expires_at: item?.hold_expires_at,
      created_at: item?.created_at,
      booked: item?.status?.toLowerCase() !== "available",
    })) || [];

  // Filter based on searchText
  const filteredData = tableData?.filter((item) =>
    item?.plotNo?.toLowerCase().includes(searchText?.toLowerCase())
  );

  const now = new Date();

  const holdCount = tableData
    ?.map((item) => item?.hold_expires_at) // dates array
    ?.filter((dateStr) => {
      if (!dateStr) return false; // ignore null
      const date = new Date(dateStr.replace(" ", "T")); // parse date
      return date > now; // only future dates
    })?.length;

  // booked count
  const bookedCount = tableData?.filter((item) => item?.booked)?.length;

  // hold count

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
 
    return userInfo;
  };

  // useEffect(() => {
  //   if (session_id) {
  //     setLoading(true);
  //     //  const access_token = localStorage.getItem("accessToken"); // browser can access localStorage

  //     //   const res = await fetch(
  //     //     `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
  //     //   );
  //     //   const data = await res.json();
  //     //   console.log("Aadhaar document:", data);

  //     const bokking_id = localStorage.getItem("booking_id");
  //     getAadhaarDetails(session_id).then((Details) => {
  //       // Save object as JSON string
  //       localStorage.setItem("kyc_Details", JSON.stringify(Details));
  //       localStorage.setItem("session_id", session_id);

  //       // Optional: if you want to set state from storage later
  //       setKycDetails(Details); 
  //       const bokking_id = localStorage.getItem("booking_id");


  //       router.push(`/properties/${slug}/bookingproperties/${bokking_id}`);
  //     });

 
  //   }
  // }, [session_id]);
  return (
    <div className="max-w-screen-2xl mx-auto pb-16 px-6 min-h-screen   md:px-8 lg:px-12 2xl:px-0 ">
      {loading ? (
        <div className="flex justify-center items-center gap-6 h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066FA9]"></div>
          <span className="ml-3 text-lg">Loading property...</span>
        </div>
      ) : (
        <>
          <div className="max-w-screen-2xl mx-auto pt-12">
            <h2 className="text-center justify-start text-neutral-900 md:text-3xl text-2xl font-bold leading-7 md:my-8 my-6">
              {bookingData?.heading}
            </h2>
            <div className="grid grid-cols-1 w-full items-center md:items-stretch justify-center xl:gap-8 gap-4">
              <NewBookingCard
                project_subtitle={"Property Details"}
                url={project?.acf?.property_image?.url}
                projectName={project?.title?.rendered}
                total={project?.flats_available?.total}
                available={project?.flats_available?.available}
                onHold={holdCount}
                booked={bookedCount}
                slug={project?.slug}
              />
            </div>
          </div>
          <div className="w-full py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between ">
              <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 mb-4 sm:mb-0 md:block hidden">
                {bookingData?.inventoryHeading}
              </h1>

              <div className="w-full sm:w-80">
                <div className="relative flex items-center bg-white rounded-xl  ">
                  <input
                    type="text"
                    placeholder={bookingData?.searchPlaceholder}
                    className="w-full py-3.5 pl-4 pr-10 text-sm text-gray-700 font-[600] placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#066fa9]"
                    value={searchText} // <-- Bind value
                    onChange={(e) => setSearchText(e.target.value)} // <-- Handle change
                  />
                  <IoSearchOutline className="absolute right-3 w-5 h-5 font-[900] text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          <InventoryTable
            tableData={filteredData}
            holdFlatFun={holdFlatFun}
            InventoryListApiFun={InventoryListApiFun}
            fetchProject={fetchProject}
            slug={slug}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default index;
