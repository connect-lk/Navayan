"use client";
import React, { useState, useEffect } from "react";
import { HiCheckCircle, HiDocumentText, HiCalendar, HiEye, HiDownload, HiX } from "react-icons/hi";
import InventoryTable from "./InventoryTable";
import ApplicantDetails from "./ApplicantDetails";
import CoApplicantDetails from "./CoApplicantDetails";
import QuotationReport from "./QuotationReport";
import { useRouter } from "next/router";

const BookedPropertyDetails = ({
  inventoryItem,
  reviewApplicationlist,
  tableData,
  slug,
  kycDetails
}) => {
  const router = useRouter();
  const [showQuotation, setShowQuotation] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showQuotation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuotation]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Build quotation data from booking information
  const buildQuotationData = () => {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Generate quotation number
    const quotationNumber = `QT-${inventoryItem?.id || '00000'}${Date.now().toString().slice(-4)}`;

    // Calculate costs
    const basicCost = Number(inventoryItem?.with_plc) || Number(inventoryItem?.total) || 0;
    const ibms = Number(inventoryItem?.additional) || 0;
    const edc = 59000;
    const clubMembership = 236000;
    const legalCharges = 10000;

    const additionalCharges = {
      ibms: ibms,
      edc: edc,
      clubMembership: clubMembership,
      legalCharges: legalCharges,
    };

    const subtotal = Number(basicCost) + Number(ibms) + Number(edc) + Number(clubMembership) + Number(legalCharges);
    const total = Number(subtotal);

    // Build payment schedule (default 20% plan)
    const paymentSchedule = [
      {
        milestone: "At the time of booking (20% of the Basic Cost)",
        date: dateStr,
        amount: Number((basicCost * 20) / 100),
      },
      {
        milestone: "80% of the Basic Cost",
        date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: Number((basicCost * 80) / 100),
      },
      {
        milestone: "Full Payment of Additional Charges before the time of Registry",
        date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: Number(ibms) + Number(edc) + Number(clubMembership) + Number(legalCharges),
      }
    ];

    const totalScheduled = paymentSchedule.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      quotationNumber,
      date: dateStr,
      time: timeStr,
      company: {
        name: "Neoteric Properties (RD Gupta Venture)",
        preparedBy: "Yogesh Jain",
        contact: "mis3@neotericgrp.in",
        phone: "+917389375628",
        address: "Silver Estate Apartments, D-2, University Rd, Balwant Nagar, Gwalior, Madhya Pradesh 474011",
        gstn: "23AASFN4959K1ZK",
        pan: "AASFN4950K",
      },
      customer: {
        name: reviewApplicationlist?.applicantName || kycDetails?.name || "Customer",
        contactNumber: reviewApplicationlist?.applicantPhone || reviewApplicationlist?.applicantAdditionalPhone || kycDetails?.contactNumber || "N/A",
        email: reviewApplicationlist?.applicantEmail || "N/A",
        address: reviewApplicationlist?.applicantAddress || "N/A",
        aadhar: reviewApplicationlist?.applicantAadhar || "N/A",
        pan: reviewApplicationlist?.applicantPan || kycDetails?.panNum || "N/A",
      },
      property: {
        name: inventoryItem?.property_name || "Property",
        accommodation: inventoryItem?.accommodation || `${inventoryItem?.bedrooms || 0} BHK`,
        unitNo: inventoryItem?.plot_no || inventoryItem?.unit_no || "N/A",
        floor: inventoryItem?.floor || `${inventoryItem?.floor_number || 'N/A'} floor`,
        apartmentArea: inventoryItem?.plot_size ? `${inventoryItem.plot_size} Sq.Ft` : inventoryItem?.apartment_area || "N/A",
        parkingLevel: inventoryItem?.parking_level || inventoryItem?.parking || "N/A",
      },
      costs: {
        basicCost: Number(basicCost),
        additionalCharges,
        subtotal: Number(subtotal),
        total: Number(total),
        totalScheduled: Number(totalScheduled),
      },
      paymentSchedule,
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
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (reviewApplicationlist?.pdf_quotation_url) {
      // Open PDF in new tab for download
      window.open(reviewApplicationlist.pdf_quotation_url, '_blank');
    } else {
      alert("PDF quotation is not available yet. Please contact support.");
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <HiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Your property booking has been successfully completed. Below are your booking details.
            </p>
          </div>
        </div>
      </div>

      {/* Booking ID Card */}
      {reviewApplicationlist?.bookingId && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-[#066FA9]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Booking ID</p>
              <p className="text-xl font-bold text-[#066FA9]">
                {reviewApplicationlist.bookingId}
              </p>
            </div>
            {reviewApplicationlist?.paymentStatus && (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700">
                  Payment Status: {reviewApplicationlist.paymentStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Details Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <HiDocumentText className="w-6 h-6 text-[#066FA9]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Property Details
          </h2>
        </div>
        <InventoryTable
          tableData={tableData}
          kycTable={"ReviewTable"}
        />
      </div>

      {/* Applicant Details Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <HiCalendar className="w-6 h-6 text-[#066FA9]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Applicant Details
          </h2>
        </div>
        <ApplicantDetails reviewApplicationlist={reviewApplicationlist} />
      </div>

      {/* Co-Applicant Details Section */}
      {reviewApplicationlist?.coApplicantName && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <HiCalendar className="w-6 h-6 text-[#066FA9]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Co-Applicant Details
            </h2>
          </div>
          <CoApplicantDetails reviewApplicationlist={reviewApplicationlist} />
        </div>
      )}

      {/* Booking Summary Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Booking Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inventoryItem?.with_plc && (
            <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
              <p className="text-sm text-gray-500 mb-1">Basic Cost (with PLC)</p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(inventoryItem.with_plc)}
              </p>
            </div>
          )}
          {inventoryItem?.additional && (
            <div className="pb-4 md:pb-0">
              <p className="text-sm text-gray-500 mb-1">Additional Charges</p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(inventoryItem.additional)}
              </p>
            </div>
          )}
          {inventoryItem?.total && (
            <div className="border-t border-gray-200 pt-4 md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-[#066FA9]">
                {formatCurrency(inventoryItem.total)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <button
          onClick={() => router.push(`/properties/${slug || router.query.slug}`)}
          className="w-full sm:w-auto bg-[#066FA9] text-white font-semibold py-3 cursor-pointer px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex items-center justify-center gap-2"
        >
          View Other Properties
        </button>
        <button
          onClick={() => setShowQuotation(true)}
          className="w-full sm:w-auto bg-white border-2 border-[#066FA9] text-[#066FA9] cursor-pointer font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#066FA9] hover:text-white flex items-center justify-center gap-2"
        >
          <HiEye className="w-5 h-5" />
          View Quotation Report
        </button>
        {reviewApplicationlist?.pdf_quotation_url && (
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto bg-[#EF6136] text-white font-semibold py-3 px-8 cursor-pointer  rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#d4552d] hover:shadow-xl flex items-center justify-center gap-2"
          >
            <HiDownload className="w-5 h-5" />
            Download PDF
          </button>
        )}
      </div>

      {/* Quotation Report Modal */}
      {showQuotation && (
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-60 z-[9999] flex items-center justify-center   p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowQuotation(false);
            }
          }}
          style={{ overflow: 'hidden' }}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-screen-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              height: '95vh',
              maxHeight: '95vh'
            }}
          >
            {/* Modal Header with Close Button */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center rounded-t-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Quotation Report</h3>
              <button
                onClick={() => setShowQuotation(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Area - Only this scrolls */}
            <div
              className="overflow-y-auto overflow-x-hidden"
              style={{
                height: 'calc(95vh - 60px)',
                flex: '1 1 auto',
                minHeight: 0
              }}
            >
              <div className="p-4">
                <QuotationReport quotationData={buildQuotationData()} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedPropertyDetails;

