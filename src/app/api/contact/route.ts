import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const FROM = "Ahmed Studio <no-reply@ahmed-studio.com>";
const TO = ["old-to-new@hotmail.com"];
const CC = ["ahmed.yic@hotmail.com"];

export async function POST(request: Request) {
  try {
    const values = await request.json();
    const { formType } = values;

    // ---------- Appointment / reservation form ----------
    if (formType === "appointment") {
      const { name, email, phone, date, time } = values;

      if (!name || !email || !phone || !date || !time) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      const dateObj = new Date(date);
      const timeObj = new Date(time);

      const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const { data, error } = await resend.emails.send({
        from: FROM,
        to: TO,
        cc: CC,
        replyTo: email,
        subject: `New Appointment Request from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>New Appointment Booking</h2>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>

            <hr />

            <p><strong>Requested Date:</strong> ${formattedDate}</p>
            <p><strong>Requested Time:</strong> ${formattedTime}</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    // ---------- Quote / service request form (existing, unchanged) ----------
    const {
      firstName,
      middleName,
      surname,
      email,
      phoneNumber,
      serviceType,
      quantity,
      duration,
      city,
      address,
      message,
    } = values;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      cc: CC,
      replyTo: email,
      subject: `New Service Request from ${firstName} ${surname} - ${serviceType}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>New Service Form Submission</h2>

          <p><strong>Full Name:</strong>
            ${firstName} ${middleName ?? ""} ${surname}
          </p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Duration:</strong> ${duration}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Address:</strong> ${address}</p>

          <hr />

          <h4>Message / Details:</h4>
          <p>${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}