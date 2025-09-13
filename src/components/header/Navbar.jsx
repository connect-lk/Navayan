import Image from "next/image";
import Link from "next/link";
import React from "react";
import { navbarData } from "../../data";

const Navbar = () => {
  return (
    <section className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <header className="w-full max-w-screen-2xl mx-auto flex items-center h-[85px] justify-between p-4 2xl:p-0">
        <Link href={navbarData?.logo?.link || "/"}>
          <div className="flex flex-col gap-1">
            <Image
              src={navbarData?.logo?.src}
              width={navbarData?.logo?.width}
              height={navbarData?.logo?.height}
              quality={navbarData?.logo?.quality}
              alt={navbarData?.logo?.alt}
              className="md:w-56 w-40 h-full object-contain"
            />
            <h4 className="text-xs">built for today. rooted in trust.by <span className="text-[#F05936]">neoteric</span></h4>
          </div>
        </Link>
        <div className="flex items-center space-x-10">
          <Link
            href={navbarData?.disclaimerlinks?.link || "#"}
            className="text-sky-700 text-lg font-medium leading-tight md:block hidden"
          >
            {navbarData?.disclaimerlinks?.text}
          </Link>
          <button className="py-3 md:px-6 px-4 bg-[#066FA9] rounded-lg text-white text-sm font-medium font-['Inter'] leading-tight">
            {navbarData?.report_button?.text}
          </button>
        </div>
      </header>
    </section>
  );
};

export default Navbar;

