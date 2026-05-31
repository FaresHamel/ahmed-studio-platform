"use client";
import Image from "next/image";
import Link from "next/link";
interface JourneyStep {
  label: string;
  title: string;
  description: string;
}
interface StreamlinedJourneyProps {
  title?: string;
  steps?: JourneyStep[];
  imageUrl?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaImageUrl?: string;
  onButtonClick?: () => void;
}
const defaultSteps: JourneyStep[] = [
  {
    label: "The Digitization",
    title: "The Digitization",
    description:
      "We professionally transfer your old tapes and films using industry-leading technology."
  },
  {
    label: "The Notification",
    title: "The Notification",
    description:
      "Upon completion of your job, we'll send you an email to let you know your FREE online gallery is available."
  },
  {
    label: "The Celebration",
    title: "The Celebration",
    description:
      "Log in and start your 14-day free trial. Watch, share, and enjoy!"
  }
];

export default function StreamlinedJourney({
  title = "We've streamlined the journey from",
  steps = defaultSteps,
  imageUrl = "/images/streaming.jpg",
  ctaTitle = "Enjoy your first 14 days on us. Cancel anytime",
  ctaDescription = "To ship your memories for digital conversion. Includes a crush-proof box, waterproof bags, shock-resistant cushions, and free FedEx shipping.",
  ctaButtonText = "Claim Your 14 Days",
  ctaImageUrl = "/images/enjoy.jpg",
  onButtonClick
}: StreamlinedJourneyProps) {
  return (
    <section className="w-full bg-white">
      {/* Section 1: Journey Steps with Image */}
      <div className="py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Title */}
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-12 md:mb-16">
            {title}
          </h2>

          {/* Grid Layout: Image left, steps right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative w-full aspect-square md:aspect-auto md:h-[450px] rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src={imageUrl}
                alt="Streamlined Journey"
                fill
                className="object-cover"
                priority={false}
              />
            </div>

            {/* Steps */}
            <div className="space-y-8 order-1 lg:order-2">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-lg md:text-xl">
                      {index + 1}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                      {step.title}:
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: CTA Banner */}
      <div className="relative py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {" "}
          {/* Adjusted mobile padding slightly */}
          {/* FIXED CONTAINER: 
      - Removed aspect-video on mobile.
      - Added min-h-[480px] on mobile so it has plenty of room to stretch.
      - Kept md:h-[500px] so it retains your original layout size on desktop.
    */}
          <div className="relative w-full min-h-[480px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl flex flex-col">
            <Image
              src={ctaImageUrl}
              alt="Claim Your Days"
              fill
              className="object-cover"
              priority={false}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* CONTENT WRAPPER: 
        - Changed from absolute to absolute inset-0 but retained flex layout.
        - On mobile, items are padded cleanly to ensure no text cuts off.
      */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 z-10">
              {/* Title */}
              <div>
                <h2 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-4 md:mb-6">
                  {ctaTitle}
                </h2>
              </div>

              {/* Bottom: Description and Button */}
              {/* Changed items-start on mobile to items-stretch/normal, then items-end on sm and up */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 gap-6 mt-auto">
                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md flex-1">
                  {ctaDescription}
                </p>
                <Link
                  href="/subscription"
                  className="bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:shadow-lg active:scale-95 whitespace-nowrap flex-shrink-0 text-center"
                >
                  {ctaButtonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
