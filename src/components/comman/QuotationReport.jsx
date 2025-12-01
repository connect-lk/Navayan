"use client";
import React, { useState } from "react";
import Image from "next/image";
import { pdf } from "@react-pdf/renderer";
import QuotationPDF from "./QuotationPDF";
import { HiDownload } from "react-icons/hi";

const QuotationReport = ({ quotationData: propQuotationData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Static data from the quotation document (fallback)
  const defaultQuotationData = {
    quotationNumber: "QT-B33635AA",
    date: "26 Nov 2025",
    time: "10:25 AM",
    company: {
      name: "Neoteric Properties (RD Gupta Venture)",
      preparedBy: "Yogesh Jain",
      contact: "mis3@neotericgrp.in",
      phone: "+917389375628",
      address:
        "Silver Estate Apartments, D-2, University Rd, Balwant Nagar, Gwalior, Madhya Pradesh 474011",
      gstn: "23AASFN4959K1ZK",
      pan: "AASFN4950K",
    },
    customer: {
      name: "Arvind gupta",
      contactNumber: "9926618128",
    },
    property: {
      name: "Regal Garden",
      accommodation: "4 BHK",
      unitNo: "RG-14B-A",
      floor: "13th floor",
      apartmentArea: "1800 Sq.Ft",
      parkingLevel: "SINGLE+BACK TO BACK",
    },
    costs: {
      basicCost: 16200000,
      additionalCharges: {
        ibms: 360000,
        edc: 59000,
        clubMembership: 236000,
        legalCharges: 10000,
      },
      subtotal: 16865000,
      total: 16865000,
    },
    paymentSchedule: [
      {
        milestone: "At the time of booking (20% of the Basic Cost)",
        date: "26 Nov 2025",
        amount: 3240000,
      },
      {
        milestone: "80% of the Basic Cost",
        date: "26 Dec 2025",
        amount: 12960000,
      },
      {
        milestone:
          "Full Payment of Additional Charges before the time of Registry",
        date: "26 Dec 2025",
        amount: 665000,
      },
    ],
    termsAndConditions: [
      "This quotation is valid for 7 days from the date of issue and is subject to unit availability.",
      "All payments must be made as per the payment schedule mentioned herein.",
      "Prices are inclusive of applicable taxes. Any changes in tax rates will be adjusted accordingly.",
      "Stamp duty, registration charges, and government levies are payable by the customer as per actuals.",
      "This quotation does not constitute a final agreement. All terms will be as per the Sale Agreement.",
      "Stamp Duty & Registration shall be extra as per Actual.",
      "TDS @ 1% on agreement value more than 50 lakhs to be borne by customer against each payment made. Copy of Receipt of payment to be submitted to accounts@neotericgrp.in.",
    ],
  };

  // Use prop data if provided, otherwise use default
  const quotationData = propQuotationData || defaultQuotationData;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Convert number to words (simplified version)
  const numberToWords = (num) => {
    return "One Crore Sixty Eight Lakh Sixty Five Thousand Rupees Only";
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const doc = <QuotationPDF quotationData={quotationData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Quotation_${quotationData.quotationNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full py-4 px-2 sm:px-4 lg:px-6">
      {/* Download Button */}
      <div className="max-w-screen-lg mx-auto mb-4 flex justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center text-sm gap-2 px-6 cursor-pointer py-3 bg-[#EF6136] text-white font-semibold rounded-lg hover:bg-[#EF6136] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <HiDownload className="text-lg" />
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
      <div className="max-w-screen-lg mx-auto bg-white shadow-xl rounded-lg   overflow-hidden print:shadow-none print:rounded-none">
        {/* Top Orange Line */}
        {/* <div className="h-1.5 bg-[#EF6136] w-full"></div> */}

        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6 pt-6 px-6 sm:px-8">
          <div className="grid grid-cols-4 justify-between items-center gap-6">
            {/* Left Side - Company Logo (Complete Image Asset) */}
            <div className="flex-1 col-span-1 flex items-center justify-start">
              <Image
                src="/images/Screenshot_20.png"
                alt="Neoteric Properties Logo"
                width={150}
                height={80}
                quality={95}
                unoptimized
                className="object-contain h-auto"
              />
            </div>

            {/* Center Side - Project Logo (Complete Image Asset) */}
            <div className="flex-1 col-span-2 flex items-center justify-center">
              <Image
                src="/images/Screenshot_17.png"
                alt="Regal Garden Project Logo"
                width={150}
                height={30}
                unoptimized
                className="object-contain h-auto"
              />
            </div>

            {/* Right Side - Quotation Info in Bordered Box */}
            <div className="flex-1 flex  col-span-1 items-center justify-end">
              <div className=" rounded-md p-3 w-full max-w-xs text-right">
                <h3 className="text-[14px] font-bold text-gray-800 uppercase ">
                  QUOTATION
                </h3>
                <p className="text-lg font-bold text-[#EF6136]  font-mono">
                  {quotationData?.quotationNumber}
                </p>
                <p className="text-[14px] text-gray-700">
                  {quotationData?.date}, {quotationData?.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company and Customer Information */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                {quotationData.company.name}
              </h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Prepared by:</span>{" "}
                  {quotationData.company.preparedBy}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {quotationData.company.contact} | {quotationData.company.phone}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Address:</span>{" "}
                  {quotationData.company.address}
                </p>
                <p>
                  <span className="font-semibold">GSTN:</span>{" "}
                  {quotationData.company.gstn}
                </p>
                <p>
                  <span className="font-semibold">PAN:</span>{" "}
                  {quotationData.company.pan}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Customer Information
              </h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {quotationData.customer.name}
                </p>
                <p>
                  <span className="font-semibold">Contact Number:</span>{" "}
                  {quotationData.customer.contactNumber}
                </p>
                {quotationData.customer.email && quotationData.customer.email !== "N/A" && (
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {quotationData.customer.email}
                  </p>
                )}
                {quotationData.customer.address && quotationData.customer.address !== "N/A" && (
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {quotationData.customer.address}
                  </p>
                )}
                {quotationData.customer.aadhar && quotationData.customer.aadhar !== "N/A" && (
                  <p>
                    <span className="font-semibold">Aadhar No:</span>{" "}
                    {quotationData.customer.aadhar}
                  </p>
                )}
                {quotationData.customer.pan && quotationData.customer.pan !== "N/A" && (
                  <p>
                    <span className="font-semibold">PAN No:</span>{" "}
                    {quotationData.customer.pan}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Property Information
          </h4>
          <div className="space-y-3 grid grid-cols-2 text-sm    p-3">
            <div className="space-y-0.5">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 w-1/3">Property Name:</p>
                <p className="text-gray-600 w-2/3">{quotationData.property.name}</p>
              </div>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 w-1/3">Accommodation:</p>
                <p className="text-gray-600 w-2/3">
                  {quotationData.property.accommodation}
                </p>
              </div>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 w-1/3">Unit No:</p>
                <p className="text-gray-600 w-2/3">{quotationData.property.unitNo}</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 w-1/3">Floor:</p>
                <p className="text-gray-600 w-2/3">{quotationData.property.floor}</p>
              </div>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 w-1/3">Apartment Area:</p>
                <p className="text-gray-600 w-2/3">
                  {quotationData.property.apartmentArea}
                </p>
              </div>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 w-1/3">Parking & Level:</p>
                <p className="text-gray-600 w-2/3">
                  {quotationData.property.parkingLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Cost */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Property Cost
          </h4>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full border-collapse min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                    DESCRIPTION
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-800">
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    Basic cost of property
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-right text-gray-700">
                    {formatCurrency(quotationData.costs.basicCost)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td
                    colSpan="2"
                    className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800"
                  >
                    Additional Charges:
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 pl-8">
                    IBMS (Interest Bearing Maintenance Security)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-700">
                    {formatCurrency(quotationData.costs.additionalCharges.ibms)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 pl-8">
                    EDC (Electricity Development Charges)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-700">
                    {formatCurrency(quotationData.costs.additionalCharges.edc)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 pl-8">
                    Club Membership Fees
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-700">
                    {formatCurrency(
                      quotationData.costs.additionalCharges.clubMembership
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 pl-8">
                    Legal Charges
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-700">
                    {formatCurrency(
                      quotationData.costs.additionalCharges.legalCharges
                    )}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800">
                    Subtotal
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-right text-gray-800">
                    {formatCurrency(quotationData.costs.subtotal)}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 px-4 py-3 text-sm font-bold text-[#EF6136]">
                    Total Amount
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-bold text-right text-[#EF6136]">
                    {formatCurrency(quotationData.costs.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="px-6 sm:px-8 py-4 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Amount in Words:</span>{" "}
            <span className="italic">
              {numberToWords(quotationData.costs.total)}
            </span>
          </p>
        </div>

        {/* Payment Schedule */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Payment Schedule
          </h4>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full border-collapse min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                    MILESTONE
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                    DATE
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-800">
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotationData.paymentSchedule.map((payment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                      {payment.milestone}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                      {payment.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-right text-gray-700">
                      {formatCurrency(payment.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td
                    colSpan="2"
                    className="border border-gray-300 px-4 py-3 text-sm font-bold text-[#EF6136]"
                  >
                    Total Scheduled
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-bold text-right text-[#EF6136]">
                    {formatCurrency(
                      quotationData.costs.totalScheduled || 
                      quotationData.paymentSchedule.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) ||
                      quotationData.costs.total
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Terms & Conditions
          </h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 marker:text-[#EF6136]">
            {quotationData.termsAndConditions.map((term, index) => (
              <li key={index} className="pl-2">
                {term}
              </li>
            ))}
          </ol>

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-10 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
            <p className="">
              {quotationData.company.name} | {quotationData.company.contact}
            </p>
            <p>Computer generated quotation</p>
            <p>1/1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationReport;

