import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#e9ecef]">
      <div className="text-center px-4">
        <h1 className="md:text-[7rem] text-[3rem] font-bold text-[#1f2937]">404</h1>
        <p className="text-2xl font-medium mt-4 text-[#1f2937]">
          Oops! Page not found
        </p>
        <p className="mt-4 mb-5 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#0077b6] text-white font-semibold rounded-full px-6 py-2.5  transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
