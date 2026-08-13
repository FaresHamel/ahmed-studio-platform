"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useI18n } from "@/i18n/context";

interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: Date | null;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
}

// Raw time slots as Date objects (date part is irrelevant, only time matters)
const TIME_SLOTS: Date[] = [9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => {
  const d = new Date(2026, 0, 1, h, 0, 0);
  return d;
});

// Fixed English days of the week array
const ENGLISH_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const WHATSAPP_NUMBER = "966500238627";
const CONTACT_EMAIL = "old-to-new@hotmail.com";

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
}: AppointmentModalProps) {
  const { t, language } = useI18n();
  const m = t.modal.appointment;
  const isArabic = language === "ar";
  const locale = "en-US";

  // Normalize "today" to midnight so date-only comparisons work correctly
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth())
  );

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  const formatDate = (d: Date) => d.toLocaleDateString(locale);
  const monthName = currentMonth.toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });

  const getDaysInMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < getFirstDayOfMonth(currentMonth); i++)
    calendarDays.push(null);
  for (let i = 1; i <= getDaysInMonth(currentMonth); i++)
    calendarDays.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    );

  const isPastDay = (day: Date) => day < today;

  // ---- Bilingual validation schema (uses your i18n error keys, with inline fallbacks) ----
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, isArabic ? "يجب ألا يقل عن حرفين" : "Must be at least 2 characters")
      .required(m.errors?.nameRequired || (isArabic ? "هذا الحقل مطلوب" : "This field is required")),
    email: Yup.string()
      .trim()
      .email(m.errors?.emailInvalid || (isArabic ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address"))
      .required(m.errors?.emailRequired || (isArabic ? "هذا الحقل مطلوب" : "This field is required")),
    phone: Yup.string()
      .trim()
      .matches(
        /^[0-9+()\s-]{7,15}$/,
        isArabic ? "يرجى إدخال رقم هاتف صحيح" : "Please enter a valid phone number"
      )
      .required(m.errors?.phoneRequired || (isArabic ? "هذا الحقل مطلوب" : "This field is required")),
    date: Yup.date()
      .nullable()
      .min(today, m.errors?.dateMin || (isArabic ? "لا يمكن اختيار تاريخ في الماضي" : "The date cannot be in the past"))
      .required(m.errors?.dateRequired || (isArabic ? "هذا الحقل مطلوب" : "This field is required")),
    time: Yup.date()
      .nullable()
      .required(m.errors?.timeRequired || (isArabic ? "هذا الحقل مطلوب" : "This field is required")),
  });

  const formik = useFormik<AppointmentFormData>({
    initialValues: { name: "", email: "", phone: "", date: null, time: null },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, formType: "appointment" }),
        });

        const text = await response.text();
        if (!response.ok) throw new Error(text || "Failed to send email");

        toast.success(
          isArabic ? "تم حجز موعدك بنجاح!" : "Your appointment request was sent successfully!"
        );

        onSubmit(values);
        resetForm();
        onClose();
      } catch (error) {
        console.error("Appointment form error:", error);

        toast.error(
          (tst) => (
            <div className="text-sm leading-relaxed">
              <p className="font-medium mb-1">
                {isArabic
                  ? "حدث خطأ أثناء إرسال طلب الحجز."
                  : "Something went wrong sending your appointment request."}
              </p>
              <p>
                {isArabic
                  ? "يرجى المحاولة لاحقًا، أو تواصل معنا عبر "
                  : "Please try again later, or reach us via "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline font-medium"
                  onClick={() => toast.dismiss(tst.id)}
                >
              
                  {isArabic ? "البريد الإلكتروني" : "email"}
                </a>
                {isArabic ? " أو " : " or "}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                  onClick={() => toast.dismiss(tst.id)}
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
    },
  });

  if (!isOpen) return null;

  const inputAlignmentClass = isArabic
    ? "text-right placeholder:text-right dir-rtl"
    : "text-left placeholder:text-left dir-ltr";

  const isDateSelected = (day: Date) =>
    formik.values.date &&
    day.getDate() === formik.values.date.getDate() &&
    day.getMonth() === formik.values.date.getMonth() &&
    day.getFullYear() === formik.values.date.getFullYear();

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-amber-800">{m.title}</h1>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-500 hover:text-gray-700 text-2xl mx-2"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            noValidate
          >
            {/* Calendar Layout */}
            <div className="lg:col-span-1">
              <div className="bg-amber-50 rounded-lg p-6" dir="ltr">
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1
                        )
                      )
                    }
                    className="text-amber-700 hover:bg-amber-200 p-2 rounded"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-amber-800 font-semibold">{monthName}</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1
                        )
                      )
                    }
                    className="text-amber-700 hover:bg-amber-200 p-2 rounded"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {ENGLISH_DAYS.map((day, i) => (
                    <div
                      key={i}
                      className="text-amber-700 font-semibold text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => {
                    const disabled = !day || isPastDay(day);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          day && !disabled && formik.setFieldValue("date", day)
                        }
                        disabled={disabled}
                        className={`py-2 text-sm rounded ${
                          !day
                            ? "text-gray-300"
                            : disabled
                            ? "text-gray-300 cursor-not-allowed"
                            : isDateSelected(day)
                            ? "bg-amber-700 text-white font-semibold"
                            : "text-amber-900 hover:bg-amber-100"
                        }`}
                      >
                        {day ? day.getDate() : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
              {formik.touched.date && formik.errors.date && (
                <p className="text-red-500 text-sm mt-2">
                  {formik.errors.date as string}
                </p>
              )}
            </div>

            {/* Input Form Fields Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={m.namePlaceholder}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${inputAlignmentClass} ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={m.emailPlaceholder}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${inputAlignmentClass} ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={m.phonePlaceholder}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${inputAlignmentClass} ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                )}
              </div>

              {/* Time Slots Selection Matrix */}
              <div dir="ltr" className={isArabic ? "text-right" : "text-left"}>
                <label
                  className={`block text-gray-700 font-semibold mb-3 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {m.selectTime}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => formik.setFieldValue("time", slot)}
                      className={`py-2 px-3 rounded font-medium transition-colors ${
                        formik.values.time === slot
                          ? "bg-amber-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
                {formik.touched.time && formik.errors.time && (
                  <p
                    className={`text-red-500 text-sm mt-2 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {formik.errors.time as string}
                  </p>
                )}
              </div>

              <div className="flex items-center text-gray-600 text-sm gap-2">
                <Clock size={16} />
                <span>{m.timezone}</span>
              </div>

              {formik.values.date && formik.values.time && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                  <p className="text-blue-900">
                    {m.selected}{" "}
                    <span className="font-semibold">
                      {formatDate(formik.values.date)} — {formatTime(formik.values.time)}
                    </span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting
                  ? isArabic
                    ? "جارٍ الإرسال..."
                    : "Sending..."
                  : m.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}