"use client";

import { useEffect } from "react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  // Prevent background scrolling when Modal is open (Scroll Lock)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-24 overflow-y-auto">
      {/* 1. Transparent overlay background with blur effect */}
      <div
        className="fixed inset-0 py-[30px] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 2. Modal body container */}
      <div className="relative bg-white w-full max-w-xl md:max-w-2xl rounded-xl shadow-2xl p-6 sm:p-8 z-10 my-8 transition-all transform animate-in fade-in zoom-in-95 duration-200">
        {/* Top close button (X Button) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main form title */}
        <h2 className="font-poppins text-[#84634B] text-[24px] sm:text-[28px] font-[500] pb-4 border-b border-gray-200 mb-6 text-left">
          Request a Quote
        </h2>

        {/* Input fields matching the attached design exactly */}
        <form
          className="w-full flex flex-col gap-4 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Full name fields laid out in one row on desktop and stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                First Name
              </label>
              <input
                type="text"
                placeholder="Ahmed..."
                className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                Middle Name
              </label>
              <input
                type="text"
                placeholder="Ahmed..."
                className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                Surname
              </label>
              <input
                type="text"
                placeholder="Ahmed..."
                className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[500] text-black font-poppins">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
            />
          </div>

          {/* Phone number and service type fields side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+966 50 023 ...."
                className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                Service Type
              </label>
              <select className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#84634B] appearance-none">
                <option>Select services</option>
                <option>Video Digitization</option>
                <option>Audio Digitization</option>
                <option>Film Scanning</option>
              </select>
            </div>
          </div>

          {/* City and address fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                City
              </label>
              <input
                type="text"
                placeholder="Jeddah"
                className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black font-poppins">
                Address
              </label>
              <input
                type="text"
                placeholder="Road no - 12, House no - 40"
                className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]"
              />
            </div>
          </div>

          {/* Message / project details field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[500] text-black font-poppins">
              Message / Project Details
            </label>
            <textarea
              rows={4}
              placeholder="Write here number of mediums u have and the condition and any information u need to add..."
              className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B] resize-none"
            />
          </div>

          {/* Terms and privacy policy checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 accent-[#84634B] cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-[12px] text-black font-poppins cursor-pointer"
            >
              I agree to the{" "}
              <span className="underline font-[500]">Privacy Policy</span> and{" "}
              <span className="underline font-[500]">Terms of Service</span>
            </label>
          </div>

          {/* Submit button aligned to the right */}
          <div className="w-full flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#6F533E] hover:bg-[#5C4331] text-white font-poppins font-[500] text-[15px] px-8 py-3 rounded-md shadow-md transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
