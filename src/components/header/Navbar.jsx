import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <section className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <header className="w-full max-w-screen-2xl mx-auto flex items-center h-[85px] justify-between p-4 2xl:p-0">
        <Link href="/">
          <div className="flex flex-col">
            <Image
              src="/images/logo.png"
              width={1200}
              height={1000}
              quality={95}
              alt="Navayan Logo"
              className="w-44 h-full object-contain"
            />
          </div>
        </Link>
        <div className="flex items-center space-x-10">
          <Link
            href="disclaimer"
            className="text-sky-700 text-lg font-medium leading-tight"
          >
            Disclaimer
          </Link>
          <button className="py-3 px-6 bg-[#066FA9] rounded-lg text-white text-sm font-medium font-['Inter'] leading-tight">
            Report an Issue
          </button>
        </div>
      </header>
    </section>
  );
};

export default Navbar;
