"use client";
import React, { useState } from "react";
import { Modal } from "antd";
import { ToastContainer } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlinePhone } from "react-icons/ai";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";

const ReportModal = ({ isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name must contain only letters")
      .required("Name is required")
      .min(2, "Too short")
      .max(50, "Too long"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    console.log("Form submitted:", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetForm();
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        closable
        footer={null}
        centered
        className="rounded-2xl max-w-md mx-auto shadow-lg bg-[#ffffff] report-modal "
        bodyStyle={{ padding: 0 }}
      >
        {/* Modal Container */}
        <div className="bg-[#ffffff] p-3 rounded-2xl overflow-hidden">
          {/* Logo Section */}
          <div className="flex justify-center bg-[#ffffff] pt-6">
            <Image
              src="/images/report_logo.png"
              alt="Report Logo"
              className="h-20 w-20 rounded-full shadow-md"
              width={160}
              height={160}
              quality={95}
            />
          </div>

          {/* Header */}
          <div className="text-center px-6 py-4 bg-[#ffffff]">
            <h2 className="text-neutral-900 text-2xl font-bold mb-2">
              Report an Issue
            </h2>
            <p className="text-sm text-gray-500">
              Please provide your details so we can assist you.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6 bg-[#ffffff]">
            <Formik
              initialValues={{ username: "", mobile: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange }) => (
                <Form className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Full Name"
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#066FA9] text-sm"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Contact Field */}
                  <div>
                    <Field
                      type="tel"
                      name="mobile"
                      placeholder="Contact Number"
                      maxLength="10"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) handleChange(e);
                      }}
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#066FA9] text-sm"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  {loading ? (
                    <div className="w-full py-3 bg-[#066FA9] flex justify-center items-center text-white font-medium rounded-lg">
                      <PulseLoader color="#FFFFFF" size={12} />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#066FA9] text-white font-semibold rounded-lg hover:bg-[#055c8c] transition"
                    >
                      Submit
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportModal;
