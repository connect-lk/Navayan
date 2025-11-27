"use client";

import Navbar from "@/components/header/Navbar";
import "@/styles/globals.css";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import ScrollToTop from "@/components/comman/ScrollToTop";
import Script from "next/script";

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
      <ScrollToTop />
      <main className="pt-[40px] bg-[#e9e9e9]">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
