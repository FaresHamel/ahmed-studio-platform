"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit
}: AppointmentModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    email: "",
    phone: "",
    date: null,
    time: ""
  });

  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    );
  }

  // Time slots
  const timeSlots = [
    "09:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "01:00 pm",
    "02:00 pm",
    "03:00 pm",
    "04:00 pm",
    "05:00 pm"
  ];

  const validateForm = () => {
    const newErrors: Partial<AppointmentFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required" as any;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required" as any;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format" as any;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required" as any;
    }
    if (!formData.date) {
      newErrors.date = "Please select a date" as any;
    }
    if (!formData.time) {
      newErrors.time = "Please select a time" as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({ name: "", email: "", phone: "", date: null, time: "" });
      onClose();
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (day: Date) => {
    setFormData({ ...formData, date: day });
  };

  const isDateSelected = (day: Date) => {
    return (
      formData.date &&
      day.getDate() === formData.date.getDate() &&
      day.getMonth() === formData.date.getMonth() &&
      day.getFullYear() === formData.date.getFullYear()
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-amber-800">
              Make An Appointment
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Calendar Section */}
            <div className="lg:col-span-1">
              <div className="bg-amber-50 rounded-lg p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="text-amber-700 hover:bg-amber-200 p-2 rounded"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-amber-800 font-semibold">{monthName}</h2>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="text-amber-700 hover:bg-amber-200 p-2 rounded"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day,index) => (
                    <div
                      key={index}
                      className="text-amber-700 font-semibold text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => day && handleDateSelect(day)}
                      disabled={!day}
                      className={`py-2 text-sm rounded ${
                        !day
                          ? "text-gray-300"
                          : isDateSelected(day)
                          ? "bg-amber-700 text-white font-semibold"
                          : "text-amber-900 hover:bg-amber-100"
                      }`}
                    >
                      {day?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.name)}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.email)}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <input
                  type="tel"
                  placeholder="Enter your Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.phone)}
                  </p>
                )}
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, time })}
                      className={`py-2 px-3 rounded font-medium transition-colors ${
                        formData.time === time
                          ? "bg-amber-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-2">
                    {String(errors.time)}
                  </p>
                )}
              </div>

              {/* Timezone Info */}
              <div className="flex items-center text-gray-600 text-sm">
                <Clock size={16} className="mr-2" />
                <span>All times are in central time (Saudi Arabia)</span>
              </div>

              {/* Selected Date Display */}
              {formData.date && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-900">
                    Selected:{" "}
                    <span className="font-semibold">
                      {formData.date.toLocaleDateString()} at {formData.time}
                    </span>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-8"
              >
                Get Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
