"use client";
import { IoSearchOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { NewBookingCard } from "@/components/comman/NewBookingCard";
import InventoryTable from "@/components/comman/InventoryTable";
import { bookingData } from "@/data";
import AllPages from "@/service/allPages";
import { useRouter } from "next/router";

const index = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [searchText, setSearchText] = useState(""); // <-- Add search state
  const [kycDetails, setKycDetails] = useState({});
  const router = useRouter();
  const { slug } = router.query; // get slug from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { session_id } = router.query; // dynamically get session_id
  console.log("inventoryList", inventoryList);
  const fetchProject = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const allProjects = await AllPages.properties();
      const matchedProject = allProjects.find((p) => p.slug === slug);
      setProject(matchedProject);
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const InventoryListApiFun = async () => {
    try {
      const response = await AllPages.inventoryList(41);
      setInventoryList(response?.data);
    } catch (error) {
      console.error("Error fetching inventory list:", error);
    }
  };

  useEffect(() => {
    InventoryListApiFun();
  }, []);

  const holdFlatFun = async (id) => {
    try {
      await AllPages.holdFlat(id);
      
      // InventoryListApiFun();
    } catch (error) {
      console.error("Error holding flat:", error.message);
    }
  };

  const tableData =
    inventoryList?.map((item, index) => ({
      id: item?.id,
      sn: index + 1, // Serial No
      plotNo: item?.plot_no, // PLOT NO.
      plotSize: `${item?.plot_size} sq.ft`, // PLOT SIZE
      plotFacing: item?.facing, // FACING
      plcSide: item?.plc_side, // PLC SIDE
      plcPercentage: `${item?.plc_percentage}%`, // PLC %
      north: item?.north, // NORTH
      south: item?.south, // SOUTH
      east: item?.east, // EAST
      west: item?.west, // WEST
      withPlc: `₹${item?.with_plc}`, // WITH PLC
      additional: `₹${item?.additional}`, // ADDITIONAL
      total: `₹${item?.total}`, // TOTAL
      status: item?.status, // STATUS
      booked: item?.status?.toLowerCase() !== "available", // booked flag
    })) || [];

  // Filter based on searchText
  const filteredData = tableData?.filter((item) =>
    item?.unitNo?.toLowerCase().includes(searchText?.toLowerCase())
  );



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

  useEffect(() => {

    if (session_id) {
      //  const access_token = localStorage.getItem("accessToken"); // browser can access localStorage

      //   const res = await fetch(
      //     `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
      //   );
      //   const data = await res.json();
      //   console.log("Aadhaar document:", data);

      const bokking_id = localStorage.getItem("booking_id")
        getAadhaarDetails(session_id).then((Details) => {
          // Save object as JSON string
          localStorage.setItem("kyc_Details", JSON.stringify(Details));

          // Optional: if you want to set state from storage later
          setKycDetails(Details);

          const bokking_id = localStorage.getItem("booking_id");
          router.push(`/properties/${slug}/bookingproperties/${bokking_id}`);
        });



      // const Details =  getAadhaarDetails()
      //   console.log("Details::",Details)
      //   setKycDetails(Details)
    }
  }, [session_id])
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
                onHold={project?.flats_available?.hold}
                booked={project?.flats_available?.booked}
                slug={project?.slug}
              />
            </div>
          </div>
          <div className="w-full py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between ">
              <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 mb-4 sm:mb-0 md:block hidden">
                {bookingData?.inventoryHeading}
              </h1>

              <div className="w-full sm:w-80">
                <div className="relative flex items-center bg-white rounded-xl shadow-inner">
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
            tableData={tableData}
            holdFlatFun={holdFlatFun}
            slug={slug}
          />
        </>
      )}
    </div>
  );
};

export default index;
