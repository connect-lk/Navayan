"use client";
import { IoSearchOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { NewBookingCard } from "@/components/comman/NewBookingCard";
import InventoryTable from "@/components/comman/InventoryTable";
import { bookingData } from "@/data";
import AllPages from "@/service/allPages";

const index = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [searchText, setSearchText] = useState(""); // <-- Add search state

  const InventoryListApiFun = async () => {
    try {
      const response = await AllPages.inventoryList(10);
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
      const response = await AllPages.holdFlat(id);
      InventoryListApiFun();
    } catch (error) {
      console.error("Error holding flat:", error.message);
    }
  };

  const tableData =
    inventoryList?.map((item, index) => ({
      id: item?.id,
      sn: index + 1,
      unitNo: `${item?.block_no} ${item?.flat_no}`,
      plotSize: `${item?.size} sq.ft`,
      plotFacing: item?.facing,
      plc: "Corner",
      cost: `₹${item?.amount}`,
      addCost: "₹500000.00",
      status: item?.status,
      booked: item?.status !== "available",
    })) || [];

  // Filter based on searchText
  const filteredData = tableData?.filter((item) =>
    item?.unitNo?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="max-w-screen-2xl mx-auto pb-16 px-6 min-h-screen   md:px-8 lg:px-12 2xl:px-0 ">
      <div className="max-w-screen-2xl mx-auto pt-12">
        <h2 className="text-center justify-start text-neutral-900 md:text-3xl text-2xl font-bold leading-7 md:my-8 my-6">
          {bookingData?.heading}
        </h2>
        <div className="grid grid-cols-1 w-full items-center md:items-stretch justify-center xl:gap-8 gap-4">
          {bookingData?.projects?.map((project, index) => (
            <NewBookingCard
              key={index}
              projectName={project?.projectName}
              total={project?.total}
              available={project?.available}
              onHold={project?.onHold}
              booked={project?.booked}
              url={project?.image}
              project_subtitle={project?.project_subtitle}
            />
          ))}
        </div>
      </div>

      <div className="w-full py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between ">
          <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 mb-4 sm:mb-0 md:block hidden">
            {bookingData?.inventoryHeading}
          </h1>

          <div className="w-full sm:w-80">
            <div className="relative flex items-center bg-white rounded-lg shadow-inner">
              <input
                type="text"
                placeholder={bookingData?.searchPlaceholder}
                className="w-full py-3.5 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#066fa9]"
                value={searchText} // <-- Bind value
                onChange={(e) => setSearchText(e.target.value)} // <-- Handle change
              />
              <IoSearchOutline className="absolute right-3 w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <InventoryTable tableData={filteredData} holdFlatFun={holdFlatFun} />
    </div>
  );
};

export default index;
