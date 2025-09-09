import { NewBookingCard } from "@/components/comman/NewBookingCard";
import { IoSearchOutline } from "react-icons/io5";
import React from "react";
import InventoryTable from "@/components/comman/InventoryTable";
const projects = [
  {
    projectName: "Navayan's Capital Park",
    total: 150,
    available: 35,
    onHold: 20,
    booked: 10,
  },
];
const page = () => {
  return (
    <div className="max-w-screen-2xl mx-auto pb-16 px-6 md:px-8 lg:px-12 2xl:px-0">
      <div className="max-w-screen-2xl mx-auto pt-12">
        <h2 className="text-center justify-start text-neutral-900 md:text-3xl text-2xl font-bold  leading-7 my-8">
          NEW BOOKING
        </h2>
        <div className=" grid grid-cols-1 w-full  items-center md:items-stretch justify-center xl:gap-8 gap-4">
          {projects.map((project, index) => (
            <NewBookingCard
              key={index}
              projectName={project.projectName}
              total={project.total}
              available={project.available}
              onHold={project.onHold}
              booked={project.booked}
            />
          ))}
        </div>
      </div>

      <div className="w-full py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between ">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Inventory
          </h1>

          <div className="w-full sm:w-80">
            <div className="relative flex items-center bg-white rounded-lg shadow-inner">
              <input
                type="text"
                placeholder="Search unit"
                className="w-full py-3.5 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#066fa9]"
              />
              <IoSearchOutline className="absolute right-3 w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <InventoryTable/>
    </div>
  );
};

export default page;
