"use client";

import Navbar from "@/components/header/Navbar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      {/* Add padding equal to the navbar's height */}
      <main className="pt-[40px] bg-[#e9e9e9] h-screen overflow-auto">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
