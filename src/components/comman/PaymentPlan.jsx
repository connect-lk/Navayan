import React, { useState } from "react";
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from "react-icons/hi2";
import CheckPayment from "./CheckPayment";
import QuotationReport from "./QuotationReport";
import QuotationPDF from "./QuotationPDF";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { pdf } from "@react-pdf/renderer";
import AllPages from "@/service/allPages";
const THEME_COLOR = "#066fa9";

const paymentPlans = [
  {
    id: "plan-10",
    name: "Basic Reservation",
    percentage: 20,
    description: "At the time of booking (20% of the Basic Cost).",
  },
  {
    id: "plan-30",
    name: "Standard Booking",
    percentage: 30,
    description: "Pay a larger portion now for faster processing.",
  },
  {
    id: "plan-50",
    name: "Premium Booking",
    percentage: 50,
    description: "Half payment upfront, reducing future EMI load.",
  },
  {
    id: "plan-75",
    name: "Premium Booking",
    percentage: 75,
    description: "Three-quarters payment upfront for priority processing.",
  },
  {
    id: "plan-100",
    name: "Full Payment",
    percentage: 100,
    description: "Complete payment now for full ownership.",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const PaymentPlan = ({ handlePreviousStep, inventoryItem, reviewApplicationlist, kycDetails }) => {




 




  const [selectedPlanId, setSelectedPlanId] = useState("plan-10");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [quotationData, setQuotationData] = useState(null);
  const navigation = useRouter();
  
  // Ensure reviewApplicationlist is always an object
  const safeReviewApplicationlist = reviewApplicationlist || {};
  
  console.log("reviewApplicationlist--------paymentplan", safeReviewApplicationlist);
  console.log("reviewApplicationlist type:", typeof safeReviewApplicationlist);
  console.log("reviewApplicationlist keys:", Object.keys(safeReviewApplicationlist));
  console.log("reviewApplicationlist.bookingId:", safeReviewApplicationlist?.bookingId);
  
  // Calculate total amount from inventory item or use default
  // const totalAmount = inventoryItem?.with_plc || inventoryItem?.total || 100000;
  const totalAmount =  100000;
  
  const selectedPlan = paymentPlans.find((p) => p.id === selectedPlanId);
  const amountToPay = selectedPlan
    ? (totalAmount * selectedPlan.percentage) / 100
    : 0;

  // Build quotation data from props
  const buildQuotationData = () => {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    // Generate quotation number
    const quotationNumber = `QT-${inventoryItem?.id || '00000'}${Date.now().toString().slice(-4)}`;
    
    // Calculate costs - ensure all values are numbers
    const basicCost = Number(inventoryItem?.with_plc) || Number(inventoryItem?.total) || Number(totalAmount) || 0;
    const ibms = Number(inventoryItem?.additional) || 0;
    const edc = 59000; // Can be made dynamic if available
    const clubMembership = 236000; // Can be made dynamic if available
    const legalCharges = 10000; // Can be made dynamic if available
    
    const additionalCharges = {
      ibms: ibms,
      edc: edc,
      clubMembership: clubMembership,
      legalCharges: legalCharges,
    };
    
    // Calculate subtotal and total - ensure they are numbers
    const subtotal = Number(basicCost) + Number(ibms) + Number(edc) + Number(clubMembership) + Number(legalCharges);
    const total = Number(subtotal);
    
    // Build payment schedule based on selected plan
    const paymentSchedule = [];
    if (selectedPlan) {
      const planAmount = Number((basicCost * selectedPlan.percentage) / 100);
      paymentSchedule.push({
        milestone: selectedPlan.description,
        date: dateStr,
        amount: planAmount,
      });
      
      if (selectedPlan.percentage < 100) {
        const remainingAmount = Number(basicCost) - Number(planAmount);
        paymentSchedule.push({
          milestone: `${100 - selectedPlan.percentage}% of the Basic Cost`,
          date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: remainingAmount,
        });
      }
      
      // Add additional charges payment
      const additionalChargesTotal = Number(ibms) + Number(edc) + Number(clubMembership) + Number(legalCharges);
      if (additionalChargesTotal > 0) {
        paymentSchedule.push({
          milestone: "Full Payment of Additional Charges before the time of Registry",
          date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: additionalChargesTotal,
        });
      }
    }
    
    // Calculate total scheduled amount
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
        name: safeReviewApplicationlist?.applicantName || kycDetails?.name || "Customer",
        contactNumber: safeReviewApplicationlist?.applicantPhone || safeReviewApplicationlist?.applicantAdditionalPhone || kycDetails?.contactNumber || "N/A",
        email: safeReviewApplicationlist?.applicantEmail || "N/A",
        address: safeReviewApplicationlist?.applicantAddress || "N/A",
        aadhar: safeReviewApplicationlist?.applicantAadhar || "N/A",
        pan: safeReviewApplicationlist?.applicantPan || kycDetails?.panNum || "N/A",
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

  // Function to send quotation email with PDF and save PDF to server
  const sendQuotationEmail = async (quotationData, paymentResponse = null) => {
    console.log("📧 sendQuotationEmail called with quotationData:", quotationData);
    let pdfUrl = null;
    
    try {
      console.log("📄 Generating PDF...");
      // Generate PDF on client side
      const doc = <QuotationPDF quotationData={quotationData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      console.log("✅ PDF generated, size:", blob.size);
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
          resolve(base64String);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const pdfBase64 = await base64Promise;
      console.log("✅ PDF converted to base64, length:", pdfBase64.length);

      // Get bookingId for filename
      const bookingIdToUse = safeReviewApplicationlist?.bookingId || "";
      
      // Save PDF to server and get URL
      if (bookingIdToUse) {
        try {
          console.log("💾 Saving PDF to server with bookingId:", bookingIdToUse);
          const saveRes = await fetch("/api/save-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pdfBase64,
              bookingId: bookingIdToUse
            }),
          });

          const saveData = await saveRes.json();
          if (saveRes.ok && saveData.success) {
            pdfUrl = saveData.pdfUrl;
            console.log("✅ PDF saved successfully, URL:", pdfUrl);
          } else {
            console.error("❌ Failed to save PDF:", saveData.error);
          }
        } catch (saveError) {
          console.error("❌ Error saving PDF:", saveError);
        }
      } else {
        console.warn("⚠️ BookingId not found, skipping PDF save");
      }

      // Get customer email - try multiple sources
      let customerEmail = safeReviewApplicationlist?.applicantEmail || 
                         safeReviewApplicationlist?.applicant_email ||
                         quotationData.customer?.email || 
                         "";
      
      // Clean up email - remove "Not Data" or similar invalid values
      if (customerEmail && (customerEmail.toLowerCase() === "not data" || customerEmail.trim() === "")) {
        customerEmail = "";
      }
      
      const customerName = safeReviewApplicationlist?.applicantName || 
                          safeReviewApplicationlist?.applicant_name ||
                          quotationData.customer?.name || 
                          "Customer";
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!customerEmail || customerEmail.trim() === "" || !emailRegex.test(customerEmail.trim())) {
        console.warn("Customer email not found or invalid, skipping email send.", {
          email: customerEmail,
          reviewApplicationlistEmail: safeReviewApplicationlist?.applicantEmail,
          quotationDataEmail: quotationData.customer?.email
        });
        return;
      }
      
      // Trim email
      customerEmail = customerEmail.trim();
      
      console.log("📧 Preparing to send email to:", customerEmail);

      // Send email with PDF attachment
      console.log("📤 Calling /api/send-quotation-email...");
      const emailRes = await fetch("/api/send-quotation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationData,
          customerEmail,
          customerName,
          pdfBase64,
          paymentDetails: paymentResponse ? {
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id,
            signature: paymentResponse.razorpay_signature,
          } : null,
        }),
      });

      console.log("📥 Email API response status:", emailRes.status);
      const emailData = await emailRes.json();
      console.log("📥 Email API response data:", emailData);

      if (!emailRes.ok || !emailData.success) {
        console.error("❌ Failed to send email:", emailData.error);
        // Don't show error to user, just log it
      } else {
        console.log("✅ Quotation email sent successfully!");
      }

      // Return PDF URL for use in bookedStatusUpdate
      return pdfUrl;
    } catch (error) {
      console.error("❌ Error sending quotation email:", error);
      console.error("Error details:", error.message, error.stack);
      // Don't show error to user, just log it
      return null;
    }
  };

  // Function to update booked status after payment (success or failure)
  const updateBookedStatusAfterPayment = async (paymentResponse, paymentStatus = "paid", pdfQuotationUrl = null) => {
    try {
      console.log(`🔄 Updating booked status after payment (status: ${paymentStatus})...`);

      const propertyId = inventoryItem?.property_id ;
      const plotNo = inventoryItem?.plot_no;
      // Use bookingId from previous step
      const bookingIdToUse = safeReviewApplicationlist?.bookingId || "";
      const transactionId = paymentResponse?.razorpay_payment_id || paymentResponse?.paymentId || "";

      console.log("📤 Calling bookedStatusUpdate API with:", {
        property_id: propertyId,
        plot_no: plotNo,
        bookingId: bookingIdToUse,
        transactionId: transactionId,
        payment_status: paymentStatus,
        pdf_quotation_url: pdfQuotationUrl
      });

      // Call bookedStatusUpdate API
      const statusRes = await AllPages.bookedStatusUpdate(
        propertyId,
        plotNo,
        bookingIdToUse,
        transactionId,
        paymentStatus,
        pdfQuotationUrl
      );
      
      console.log(`✅ Booked status updated successfully (${paymentStatus}):`, statusRes);
    } catch (error) {
      console.error("❌ Error updating booked status:", error);
      // Don't show error to user, just log it
    }
  };

  const handleCheckSubmit = async(values) => {
    console.log("Check Payment Submitted:", values);
    // 👉 You can send this data to API here

    try {
      // Your custom values
      const checkNumber = values?.checkNumber || "CHK12345";
      const bankName = values?.bankName || "HDFC Bank";
      const amount = values?.amount || 500; // INR

      // Call backend to create check payment order
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkNumber, bankName, amount }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMessage = data.error || data.details || "Something went wrong! Please try again.";
        console.error("Payment error:", errorMessage);
        
        // Update booked status with failed payment
        updateBookedStatusAfterPayment({}, "failed").catch(err => {
          console.error("❌ Update booked status failed:", err);
        });
        
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: errorMessage,
          confirmButtonColor: THEME_COLOR,
        });
        return;
      }

      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RkgYklrk2WT4fq",
        amount: order.amount,
        currency: order.currency,
        name: "Navayan Properties",
        description: "Check Payment Transaction",
        order_id: order.id,
        handler: async function (response) {
          // Store payment details
          setPaymentDetails({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: values?.amount || amount,
            planName: values?.bankName || "Check Payment"
          });
          
          // Build and set quotation data
          const quotation = buildQuotationData();
          setQuotationData(quotation);
          
          // Show loader while processing APIs
          Swal.fire({
            title: "Processing Payment...",
            html: "Please wait while we process your payment and send confirmation.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          try {
            // Send email with PDF and get PDF URL
            console.log("🚀 Payment successful (Check), triggering email send...");
            const pdfUrl = await sendQuotationEmail(quotation, response);
            
            // Update booked status after payment (success) with PDF URL
            console.log("🔄 Updating booked status...");
            await updateBookedStatusAfterPayment(response, "paid", pdfUrl);
            
            // Close loader and show success alert
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `
                <p><strong>Payment ID:</strong> ${response.razorpay_payment_id}</p>
                <p><strong>Order ID:</strong> ${response.razorpay_order_id}</p>
              `,
              confirmButtonColor: THEME_COLOR,
              confirmButtonText: "View Booking Details"
            }).then((result) => {
              if (result.isConfirmed) {
                // Reload page to show booked details UI
                window.location.reload();
              } else {
                // Also reload after a short delay if user closes the modal
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            });
          } catch (err) {
            console.error("❌ Error processing payment:", err);
            // Still try to update booked status even if email fails
            try {
              await updateBookedStatusAfterPayment(response, "paid", null);
            } catch (updateErr) {
              console.error("❌ Update booked status failed:", updateErr);
            }
            
            // Show success alert even if some operations failed (payment was successful)
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `
                <p><strong>Payment ID:</strong> ${response.razorpay_payment_id}</p>
                <p><strong>Order ID:</strong> ${response.razorpay_order_id}</p>
                <p style="color: #ff9800; margin-top: 10px;">Note: Some operations may still be processing in the background.</p>
              `,
              confirmButtonColor: THEME_COLOR,
              confirmButtonText: "View Booking Details"
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              } else {
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            });
          }
          
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notes: order.notes || {},
        theme: {
          color: THEME_COLOR,
        },
        modal: {
          ondismiss: function() {
            // Update booked status with failed payment (cancelled)
            updateBookedStatusAfterPayment({}, "failed").catch(err => {
              console.error("❌ Update booked status failed:", err);
            });
            
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment process.",
              confirmButtonColor: THEME_COLOR,
            });
            console.log("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      
      // Update booked status with failed payment
      updateBookedStatusAfterPayment({}, "failed").catch(err => {
        console.error("❌ Update booked status failed:", err);
      });
      
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Failed to initiate payment. Please try again.",
        confirmButtonColor: THEME_COLOR,
      });
    }
  };

  const handlePayNow = async () => {
    console.log("amountToPay", amountToPay);
    if (!amountToPay || amountToPay <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Payment Plan Required",
        text: "Please select a payment plan to continue.",
        confirmButtonColor: THEME_COLOR,
      });
      return;
    }

    try {
      // Call backend to create online payment order
      const res = await fetch("/api/razorpay-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amountToPay,
          planName: selectedPlan?.name || "Booking Payment"
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMessage = data.error || data.details || "Something went wrong! Please try again.";
        console.error("Payment error:", errorMessage);
        
        // Update booked status with failed payment
        updateBookedStatusAfterPayment({}, "failed").catch(err => {
          console.error("❌ Update booked status failed:", err);
        });
        
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: errorMessage,
          confirmButtonColor: THEME_COLOR,
        });
        return;
      }

      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RkgYklrk2WT4fq",
        amount: order.amount,
        currency: order.currency,
        name: "Navayan Properties",
        description: `Payment for ${selectedPlan?.name || "Booking"}`,
        order_id: order.id,
        handler: async function (response) {
          // Store payment details
          setPaymentDetails({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: amountToPay,
            planName: selectedPlan?.name || "Booking Payment"
          });
          
          // Build and set quotation data
          const quotation = buildQuotationData();
          setQuotationData(quotation);
          
          // Show loader while processing APIs
          Swal.fire({
            title: "Processing Payment...",
            html: "Please wait while we process your payment and send confirmation.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          try {
            // Send email with PDF and get PDF URL
            console.log("🚀 Payment successful (Online), triggering email send...");
            const pdfUrl = await sendQuotationEmail(quotation, response);
            
            // Update booked status after payment (success) with PDF URL
            console.log("🔄 Updating booked status...");
            await updateBookedStatusAfterPayment(response, "paid", pdfUrl);
            
            // Close loader and show success alert
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `
                <p><strong>Payment ID:</strong> ${response.razorpay_payment_id}</p>
                <p><strong>Order ID:</strong> ${response.razorpay_order_id}</p>
                <p><strong>Amount:</strong> ${formatCurrency(amountToPay)}</p>
                <p style="margin-top: 10px; color: #066fa9;"><strong>✓ Quotation has been sent to your email</strong></p>
              `,
              confirmButtonColor: THEME_COLOR,
              confirmButtonText: "View Booking Details"
            }).then((result) => {
              if (result.isConfirmed) {
                // Reload page to show booked details UI
                window.location.reload();
              } else {
                // Also reload after a short delay if user closes the modal
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            });
          } catch (err) {
            console.error("❌ Error processing payment:", err);
            // Still try to update booked status even if email fails
            try {
              await updateBookedStatusAfterPayment(response, "paid", null);
            } catch (updateErr) {
              console.error("❌ Update booked status failed:", updateErr);
            }
            
            // Show success alert even if some operations failed (payment was successful)
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `
                <p><strong>Payment ID:</strong> ${response.razorpay_payment_id}</p>
                <p><strong>Order ID:</strong> ${response.razorpay_order_id}</p>
                <p><strong>Amount:</strong> ${formatCurrency(amountToPay)}</p>
                <p style="color: #ff9800; margin-top: 10px;">Note: Some operations may still be processing in the background.</p>
              `,
              confirmButtonColor: THEME_COLOR,
              confirmButtonText: "View Booking Details"
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              } else {
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            });
          }
          
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },
        prefill: {
          // You can get these from user data if available
          name: "Lokesh Kumar",    
          email: "lokesh@gmail.com",
          contact: "9876543210",
        },
        notes: order.notes || {},
        theme: {
          color: THEME_COLOR,
        },
        modal: {
          ondismiss: function() {
            // Update booked status with failed payment (cancelled)
            updateBookedStatusAfterPayment({}, "failed").catch(err => {
              console.error("❌ Update booked status failed:", err);
            });
            
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment process.",
              confirmButtonColor: THEME_COLOR,
            });
            console.log("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      
      // Update booked status with failed payment
      updateBookedStatusAfterPayment({}, "failed").catch(err => {
        console.error("❌ Update booked status failed:", err);
      });
      
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Failed to initiate payment. Please try again.",
        confirmButtonColor: THEME_COLOR,
      });
    }
  };

  // Show Quotation Report after successful payment
  if (showQuotation) {
    return (
      <div className="w-full">
        <div className="mb-4 px-3 sm:px-4 md:px-6">
          <button
            onClick={() => setShowQuotation(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <HiOutlineArrowSmallLeft className="text-lg" />
            Back to Payment Plan
          </button>
        </div>
        <QuotationReport quotationData={quotationData} />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-start px-3 sm:px-4 md:px-6">
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl w-full shadow-lg max-w-screen-2xl">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b border-gray-300 pb-2 sm:text-start text-center sm:pb-4">
          Choose Your Payment Plan
        </h2>

        {/* Total Amount */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between text-center sm:text-left gap-2">
          <p className="text-base sm:text-lg font-medium text-gray-700">
            Total Booking Amount:
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Payment Plan Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {paymentPlans?.map((plan) => {
            const isSelected = selectedPlanId === plan?.id;
            const planAmount = (totalAmount * plan?.percentage) / 100;

            return (
              <div
                key={plan?.id}
                className={`p-4 sm:p-5 border rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                  isSelected ? "border-[2px]" : "border"
                }`}
                style={{
                  borderColor: isSelected ? THEME_COLOR : "#e5e7eb",
                  backgroundColor: isSelected ? "#f0f9ff" : "white",
                }}
                onClick={() => setSelectedPlanId(plan?.id)}
              >
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-800">
                    {plan?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
                    {plan?.description}
                  </p>
                </div>
                <div>
                  <div
                    className="text-lg sm:text-xl font-bold"
                    style={{ color: THEME_COLOR }}
                  >
                    {formatCurrency(planAmount)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    ({plan.percentage}% of Total Amount)
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Summary */}
        <div className="mt-8 sm:mt-10 border-t border-gray-300 pt-4 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
            Payment Summary
          </h3>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
            <span className="text-base sm:text-lg font-medium text-gray-700">
              Amount Due Now:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#066FA9]">
              {formatCurrency(amountToPay)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 items-center">
            <button
              onClick={handlePreviousStep}
              className="w-full sm:w-auto bg-[#066FA9] text-white cursor-pointer font-semibold py-2.5 sm:py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex justify-center items-center gap-2 group"
            >
              <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1">
                <HiOutlineArrowSmallLeft className="text-base sm:text-lg" />
              </span>
              Back
            </button>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: THEME_COLOR }}
                className="w-full sm:w-auto bg-[#066FA9] text-white cursor-pointer font-semibold py-2.5 sm:py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all capitalize duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex justify-center items-center gap-2 group disabled:opacity-50"
              >
                Proceed to pay Check
                <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <HiOutlineArrowSmallRight className="text-base sm:text-lg" />
                </span>
              </button>
              <button
                onClick={handlePayNow} 
                disabled={!selectedPlanId}
                style={{ backgroundColor: THEME_COLOR }}
                className="w-full sm:w-auto bg-[#066FA9] text-white cursor-pointer font-semibold py-2.5 sm:py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all capitalize duration-300 ease-in-out transform hover:bg-[#055a87] hover:shadow-xl flex justify-center items-center gap-2 group disabled:opacity-50"
              >
                Proceed to pay online
                <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <HiOutlineArrowSmallRight className="text-base sm:text-lg" />
                </span>
              </button>
            </div>
          </div>
          {/* Check Payment Modal */}
          <CheckPayment
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCheckSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPlan;
