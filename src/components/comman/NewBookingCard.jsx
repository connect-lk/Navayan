import React from "react";
import Image from "next/image";

export const NewBookingCard = ({
  projectName,
  onHold,
  booked,
  total,
  available,
  url,
  project_subtitle,
}) => {
  const stats = [
    {
      label: "Total",
      value: total,
      bgColor: "bg-[#FFF4F4]",
      textColor: "text-[#8C0000]",
      valueColor: "text-[#8C0000]",
    },
    {
      label: "Available",
      value: available,
      bgColor: "bg-[#FEF3C7]",
      textColor: "text-[#78350F]",
      valueColor: "text-[#78350F]",
    },
    {
      label: "On Hold",
      value: onHold,
      bgColor: "bg-[#DBEAFE]",
      textColor: "text-[#1E3A8A]",
      valueColor: "text-[#1E3A8A]",
    },
    {
      label: "Booked",
      value: booked,
      bgColor: "bg-[#DCFCE7]",
      textColor: "text-[#14532D]",
      valueColor: "text-[#14532D]",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row items-stretch gap-4 md:gap-8 shadow-lg border border-gray-200 w-full max-w-screen-2xl mx-auto">
      <div className="flex-shrink-0 w-full md:w-1/3">
        <Image
          src={url}
          width={1200}
          height={1200}
          quality={95}
          alt={projectName}
          priority
          className="w-full h-[210px] rounded-xl object-cover"
        />
      </div>

      <div className="flex flex-col justify-between w-full md:w-2/3">
        <div className="">
          <p className="text-sm font-medium text-gray-500 mb-2">
            {project_subtitle}
          </p>
          <h3 className="text-xl font-bold text-[#1F2937] mb-4">
            {projectName}
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-center text-sm w-full md:text-base">
          {stats?.map((stat, index) => (
            <div
              key={index}
              className={`${stat?.bgColor} xl:p-3 p-2 rounded-lg flex flex-row items-center justify-between px-3`}
            >
              <span className={`block font-medium ${stat?.textColor}`}>
                {stat?.label}
              </span>
              <span className={`block font-bold text-xl ${stat?.valueColor}`}>
                {stat?.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
