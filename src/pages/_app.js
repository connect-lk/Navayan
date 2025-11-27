"use client";

import Navbar from "@/components/header/Navbar";
import "@/styles/globals.css";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import ScrollToTop from "@/components/comman/ScrollToTop";
<<<<<<< HEAD
import Script from "next/script";
=======
import QuotationReport from "@/components/comman/QuotationReport";
>>>>>>> 8dd3bac0d60ddb092da628cb6bd95d47343ea8c3

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <Navbar />
      <ScrollToTop /> {" "}
      <main className="pt-[40px] bg-[#e9e9e9] min-h-[calc(100vh-40px)]">
        {/* <QuotationReport /> */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}
