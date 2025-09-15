import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";

export const ProjectCard = ({
  projectName,
  onHold,
  booked,
  total,
  available,
  url,
  homePageData,
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
  const router = useRouter();
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 w-full mx-auto">
      <Image
        src={url}
        width={1200}
        height={1200}
        quality={95}
        priority
        alt={`Image of ${projectName}`}
        className="w-full xl:h-[240px] h-[200px] rounded-xl object-cover mb-4"
      />
      <h3 className="justify-center text-slate-800 text-xl font-bold leading-normal mb-3">
        {projectName}
      </h3>
      <div className="grid grid-cols-2 gap-2 text-center text-sm md:text-base">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className={`${stat?.bgColor} p-2 rounded-lg flex flex-row items-center justify-between px-3`}
          >
            <span className={`block font-[500]  ${stat?.textColor}`}>
              {stat?.label}
            </span>
            <span
              className={`block font-bold xl:text-xl lg:text-md   ${stat?.valueColor}`}
            >
              {stat?.value}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push(homePageData?.button?.link)}
        className="w-full mt-6    text-white cursor-pointer font-[400] py-3 text-center flex   justify-center items-center gap-2 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] bg-[#066FA9] hover:shadow-xl group"
      >
        <span>{homePageData?.button?.text}</span>
        <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
          <HiOutlineArrowSmallRight className="text-lg" />
        </span>
      </button>
    </div>
  );
};
