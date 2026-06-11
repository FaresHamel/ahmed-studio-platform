"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useI18n } from "@/src/i18n/context";

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
  const d = new Date(2000, 0, 1, h, 0, 0);
  return d;
});

// Fixed English days of the week array
const ENGLISH_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit
}: AppointmentModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0));
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    email: "",
    phone: "",
    date: null,
    time: null
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AppointmentFormData, string>>
  >({});
  const { t, language } = useI18n();
  const m = t.modal.appointment;

  const isArabic = language === "ar";

  // Force "en-US" so months, years, and times always render in standard English format
  const locale = "en-US";

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  const formatDate = (d: Date) => d.toLocaleDateString(locale);
  const monthName = currentMonth.toLocaleString(locale, {
    month: "long",
    year: "numeric"
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

  const isDateSelected = (day: Date) =>
    formData.date &&
    day.getDate() === formData.date.getDate() &&
    day.getMonth() === formData.date.getMonth() &&
    day.getFullYear() === formData.date.getFullYear();

  const validateForm = () => {
    const e: Partial<Record<keyof AppointmentFormData, string>> = {};
    if (!formData.name.trim()) e.name = m.errors.nameRequired;
    if (!formData.email.trim()) e.email = m.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = m.errors.emailInvalid;
    if (!formData.phone.trim()) e.phone = m.errors.phoneRequired;
    if (!formData.date) e.date = m.errors.dateRequired;
    if (!formData.time) e.time = m.errors.timeRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", phone: "", date: null, time: null });
      onClose();
    }
  };

  if (!isOpen) return null;

  // Dynamic text alignment classes based on active translation context language
  const inputAlignmentClass = isArabic
    ? "text-right placeholder:text-right dir-rtl"
    : "text-left placeholder:text-left dir-ltr";

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
              className="text-gray-500 hover:text-gray-700 text-2xl mx-2"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Calendar Layout */}
            <div className="lg:col-span-1">
              <div className="bg-amber-50 rounded-lg p-6" dir="ltr">
                {" "}
                {/* Locked to LTR so calendar layouts don't invert columns */}
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
                  {/* Swapped custom dynamic translations for explicit English Day Headings */}
                  {ENGLISH_DAYS.map((day, i) => (
                    <div
                      key={i}
                      className="text-amber-700 font-semibold text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        day && setFormData({ ...formData, date: day })
                      }
                      disabled={!day}
                      className={`py-2 text-sm rounded ${
                        !day
                          ? "text-gray-300"
                          : isDateSelected(day)
                          ? "bg-amber-700 text-white font-semibold"
                          : "text-amber-900 hover:bg-amber-100"
                      }`}
                    >
                      {day ? day.getDate() : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Form Fields Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={m.namePlaceholder}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${inputAlignmentClass} ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder={m.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${inputAlignmentClass} ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder={m.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${inputAlignmentClass} ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
                      onClick={() => setFormData({ ...formData, time: slot })}
                      className={`py-2 px-3 rounded font-medium transition-colors ${
                        formData.time === slot
                          ? "bg-amber-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
                {errors.time && (
                  <p
                    className={`text-red-500 text-sm mt-2 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.time}
                  </p>
                )}
              </div>

              <div className="flex items-center text-gray-600 text-sm gap-2">
                <Clock size={16} />
                <span>{m.timezone}</span>
              </div>

              {formData.date && formData.time && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                  <p className="text-blue-900">
                    {m.selected}{" "}
                    <span className="font-semibold">
                      {formatDate(formData.date)} — {formatTime(formData.time)}
                    </span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-8"
              >
                {m.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
