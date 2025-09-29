// components/CheckPayment.js
import React from "react";
import { Modal, Input } from "antd";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ✅ Yup validation schema
const validationSchema = Yup.object({
  checkNumber: Yup.string()
    .required("Check number is required")
    .matches(/^[0-9]+$/, "Check number must be numeric"),
  bankName: Yup.string().required("Bank name is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
});

const CheckPayment = ({ visible, onClose, onSubmit }) => {
  return (
    <Modal
      title={
        <span className="text-lg sm:text-xl font-[600] text-gray-800">
          Enter Check Details
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-xl"
    >
      <Formik
        initialValues={{ checkNumber: "", bankName: "", amount: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
          onClose();
        }}
      >
        {({ handleSubmit }) => (
          <FormikForm
            onSubmit={handleSubmit}
            className="space-y-5 pt-2 text-gray-700"
          >
            {/* Check Number */}
            <div>
              <label className="block text-xs sm:text-[16px] font-medium mb-1.5">
                Check Number
              </label>
              <Field
                as={Input}
                name="checkNumber"
                placeholder="Enter check number"
                className="w-full self-stretch h-11 px-3 text-[24px] py-3 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300 focus:outline-none focus:ring-1 focus:ring-[#066FA9] placeholder-[#6b7280]"
              />
              <ErrorMessage
                name="checkNumber"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs sm:text-[16px] font-medium mb-1.5">
                Bank Name
              </label>
              <Field
                as={Input}
                name="bankName"
                placeholder="Enter bank name"
                className="w-full self-stretch h-11 px-3 text-[24px] py-3 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300 focus:outline-none focus:ring-1 focus:ring-[#066FA9] placeholder-[#6b7280]"
              />
              <ErrorMessage
                name="bankName"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs sm:text-[16px] font-medium mb-1.5">
                Amount
              </label>
              <Field
                as={Input}
                type="number"
                name="amount"
                placeholder="Enter amount"
                className="w-full self-stretch h-11 px-3 text-[24px] py-3 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-gray-300 focus:outline-none focus:ring-1 focus:ring-[#066FA9] placeholder-[#6b7280]"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mb-2 bg-[#066FA9] text-white font-semibold text-sm sm:text-base py-2.5 rounded-lg shadow-md hover:bg-[#055a87] transition"
            >
              Submit Check Payment
            </button>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default CheckPayment;
