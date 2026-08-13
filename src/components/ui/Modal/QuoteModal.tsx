"use client";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useI18n } from "@/i18n/context";
import toast from "react-hot-toast";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteFormValues {
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  city: string;
  address: string;
  message: string;
  duration: string;
  quantity: string;
  agreeTerms: boolean;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const WHATSAPP_NUMBER = "966500238627"; // international format, no + or spaces
const CONTACT_EMAIL = "old-to-new@hotmail.com";
  
  const { t, language } = useI18n();
  const m = t?.modal2;
  const isRtl = language === "ar";
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

  // ---- Bilingual validation messages ----
  const required = isRtl ? "هذا الحقل مطلوب" : "This field is required";
  const msgs = {
    required,
    minName: isRtl ? "يجب ألا يقل عن حرفين" : "Must be at least 2 characters",
    email: isRtl ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address",
    phone: isRtl ? "يرجى إدخال رقم هاتف صحيح" : "Please enter a valid phone number",
    select: isRtl ? "يرجى اختيار خيار" : "Please select an option",
    terms: isRtl
      ? "يجب الموافقة على الشروط والأحكام للمتابعة"
      : "You must agree to the Terms & Conditions to continue",
    quantity: isRtl ? "يرجى إدخال كمية صحيحة" : "Please enter a valid quantity",
    message: isRtl
      ? "يرجى كتابة تفاصيل أكثر (10 أحرف على الأقل)"
      : "Please provide more detail (min 10 characters)",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().trim().min(2, msgs.minName).required(msgs.required),
    middleName: Yup.string().trim().min(2, msgs.minName).required(msgs.required),
    surname: Yup.string().trim().min(2, msgs.minName).required(msgs.required),
    email: Yup.string().trim().email(msgs.email).required(msgs.required),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^[0-9+()\s-]{7,15}$/, msgs.phone)
      .required(msgs.required),
    serviceType: Yup.string().required(msgs.select).notOneOf([""], msgs.select),
    city: Yup.string().trim().required(msgs.required),
    address: Yup.string().trim().required(msgs.required),
    message: Yup.string().trim().min(10, msgs.message).required(msgs.required),
    duration: Yup.string().required(msgs.select).notOneOf([""], msgs.select),
    quantity: Yup.string().trim().required(msgs.quantity),
    agreeTerms: Yup.boolean().oneOf([true], msgs.terms),
  });

  const formik = useFormik<QuoteFormValues>({
    initialValues: {
      firstName: "",
      middleName: "",
      surname: "",
      email: "",
      phoneNumber: "",
      serviceType: "",
      city: "",
      address: "",
      message: "",
      duration: "",
      quantity: "",
      agreeTerms: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      setStatus(undefined);

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...values, formType: "quote" })
        });

        // Don't assume the response is JSON yet
        const text = await response.text();

        console.log("API status:", response.status);
        console.log("API response:", text);

        if (!response.ok) {
          throw new Error(text || "Failed to send email");
        }

        setStatus({
          type: "success",
          message: isRtl
            ? "تم إرسال طلبك بنجاح، سنتواصل معك قريبًا."
            : "Your request has been sent successfully. We'll be in touch soon."
        });

          toast.success(
            isRtl
              ? "تم إرسال طلبك بنجاح!"
              : "Your request was sent successfully!"
          );

        resetForm();

        setTimeout(() => onClose(), 1800);
      } catch (error) {
        console.error("Contact form error:", error);

        setStatus({
          type: "error",
          message: isRtl
            ? "تعذّر إرسال الطلب، يرجى المحاولة مرة أخرى."
            : "Failed to send your request. Please try again."
        });

         // Friendly toast with a fallback path — doesn't expose the raw API error
    toast.error(
      (t) => (
        <div className="text-sm leading-relaxed">
          <p className="font-medium mb-1">
            {isRtl
              ? "حدث خطأ أثناء الإرسال."
              : "Something went wrong sending your request."}
          </p>
          <p>
            {isRtl ? "يرجى المحاولة لاحقًا، أو تواصل معنا عبر " : "Please try again later, or reach us via "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline font-medium"
              onClick={() => toast.dismiss(t.id)}
            >
              {isRtl ? "البريد الإلكتروني" : "email"}
            </a>
            {isRtl ? " أو " : " or "}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
              onClick={() => toast.dismiss(t.id)}
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      ),
      { duration: 7000 }
    );

      } finally {
        setSubmitting(false);
      }
    }
  });

  if (!isOpen) return null;

  const errClass = "text-[11px] text-red-500 mt-0.5";
  const inputBase =
    "w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#84634B]";
  const inputError = "ring-1 ring-red-400";



  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-24 overflow-y-auto">
      <div
        className="fixed inset-0 py-[30px] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl md:max-w-2xl rounded-xl shadow-2xl p-6 sm:p-8 z-10 my-8 text-start transition-all transform animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className={`absolute top-5 ${
            isRtl ? "left-5" : "right-5"
          } text-gray-400 hover:text-black transition-colors`}
          aria-label="Close modal"
          type="button"
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

        <h2 className="text-[#84634B] text-[24px] sm:text-[28px] font-[500] pb-4 border-b border-gray-200 mb-6">
          {m.title}
        </h2>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          {/* Names row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-[12px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.firstName}
              </label>
              <input
                type="text"
                name="firstName"
                placeholder={m.placeholderName}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputBase} ${
                  formik.touched.firstName && formik.errors.firstName
                    ? inputError
                    : ""
                }`}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <span className={errClass}>{formik.errors.firstName}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.middleName}
              </label>
              <input
                type="text"
                name="middleName"
                placeholder={m.placeholderName}
                value={formik.values.middleName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputBase} ${
                  formik.touched.middleName && formik.errors.middleName
                    ? inputError
                    : ""
                }`}
              />
              {formik.touched.middleName && formik.errors.middleName && (
                <span className={errClass}>{formik.errors.middleName}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.surname}
              </label>
              <input
                type="text"
                name="surname"
                placeholder={m.placeholderName}
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputBase} ${
                  formik.touched.surname && formik.errors.surname
                    ? inputError
                    : ""
                }`}
              />
              {formik.touched.surname && formik.errors.surname && (
                <span className={errClass}>{formik.errors.surname}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[500] text-black">
              {m.email}
            </label>
            <input
              type="email"
              name="email"
              placeholder={m.email}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputBase} ${
                formik.touched.email && formik.errors.email ? inputError : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <span className={errClass}>{formik.errors.email}</span>
            )}
          </div>

          {/* Phone + service type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.phoneNumber}
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="050 023 ...."
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputBase} ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? inputError
                    : ""
                }`}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <span className={errClass}>{formik.errors.phoneNumber}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.serviceType}
              </label>
              <select
                name="serviceType"
                value={formik.values.serviceType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#84634B] appearance-none rtl:bg-left ${
                  formik.touched.serviceType && formik.errors.serviceType
                    ? inputError
                    : ""
                }`}
              >
                <option value="">{m.selectServices}</option>
                <option value="Video_Digitization">{m.videoDigi}</option>
                <option value="Audio_Digitization">{m.audioDigi}</option>
                <option value="Film_Scanning">{m.filmScan}</option>
                <option value="⁠Photo_scanning">{m.photoDigi}</option>
                <option value="restoration">{m.restorationDigi}</option>
                <option value="other_Digitization">{m.otherDigi}</option>
              </select>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <span className={errClass}>{formik.errors.serviceType}</span>
              )}
            </div>
          </div>

          {/* City + address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.city}
              </label>
              <input
                type="text"
                name="city"
                placeholder={m.placeholderCity}
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputBase} ${
                  formik.touched.city && formik.errors.city ? inputError : ""
                }`}
              />
              {formik.touched.city && formik.errors.city && (
                <span className={errClass}>{formik.errors.city}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-black">
                {m.address}
              </label>
              <input
                type="text"
                name="address"
                placeholder={m.placeholderAddress}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputBase} ${
                  formik.touched.address && formik.errors.address
                    ? inputError
                    : ""
                }`}
              />
              {formik.touched.address && formik.errors.address && (
                <span className={errClass}>{formik.errors.address}</span>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[500] text-black">
              {m.messageLabel}
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder={m.messagePlaceholder}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputBase} resize-none ${
                formik.touched.message && formik.errors.message
                  ? inputError
                  : ""
              }`}
            />
            {formik.touched.message && formik.errors.message && (
              <span className={errClass}>{formik.errors.message}</span>
            )}
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[500] text-black">
              {m.durationLabel}
            </label>
            <select
              name="duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#84634B] appearance-none rtl:bg-left ${
                formik.touched.duration && formik.errors.duration
                  ? inputError
                  : ""
              }`}
            >
              <option value="">{m.selectServices}</option>
              <option value="regular">{m.regularService}</option>
              <option value="urgent">{m.urgentService}</option>
            </select>
            {formik.touched.duration && formik.errors.duration && (
              <span className={errClass}>{formik.errors.duration}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[500] text-black">
              {m.quantity}
            </label>
            <input
              type="text"
              name="quantity"
              placeholder={m.quantity}
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputBase} ${
                formik.touched.quantity && formik.errors.quantity
                  ? inputError
                  : ""
              }`}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <span className={errClass}>{formik.errors.quantity}</span>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                name="agreeTerms"
                checked={formik.values.agreeTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4 accent-[#84634B] cursor-pointer shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-[12px] text-black cursor-pointer leading-tight select-none"
              >
                {m.agreeTo}{" "}
                <a
                  href="/terms_and_serivecss.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-[500] hover:text-[#84634B] transition-colors"
                >
                  {m.terms}
                </a>
              </label>
            </div>
            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
              <span className={errClass}>{formik.errors.agreeTerms}</span>
            )}
          </div>

          {/* Submit status (from the Resend call) */}
          {formik.status && (
            <p
              className={`text-sm mt-1 ${
                formik.status.type === "success"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {formik.status.message}
            </p>
          )}

          <div className="w-full flex justify-end rtl:justify-start mt-4">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-[#6F533E] hover:bg-[#5C4331] text-white font-[500] text-[15px] px-8 py-3 rounded-md shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting
                ? isRtl
                  ? "جارٍ الإرسال..."
                  : "Sending..."
                : m.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}