import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { navbarData } from "../../data";

const Navbar = memo(() => {
  return (
    <section className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <header className="w-full max-w-screen-2xl mx-auto flex items-center h-[85px] justify-between p-4 2xl:p-0">
        <Link href={navbarData?.logo?.link || "/"}>
          <div className="flex flex-col gap-1">
            {navbarData?.logo?.src ? (
              <Image
                src={navbarData?.logo?.src || "/images/default-logo.png"}
                width={1200}
                height={1000}
                quality={95}
                alt={navbarData?.logo?.alt}
                priority
                className="md:w-56 w-40 h-full object-contain"
              />
            ) : null}
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
});

Navbar.displayName = "Navbar";

export default Navbar;
