import SimpleInfoSection from "@/src/components/sections/SimpleInfoSection";

export default function IntroSection() {
  return (
    <section className="max-w-[1104px] mx-auto px-4 mt-20 text-center">
      <h2 className="text-3xl md:text-5xl font-semibold text-[#77510A] leading-tight mb-6">
        Superior Quality, Service and Technology
      </h2>
      <p className="text-[#3C3C3C] text-base md:text-lg leading-relaxed text-justify max-w-4xl mx-auto">
        Most companies see a box of old tapes and photos as a technical task. At Ahmed Studio,
        we see them as the heartbeat of your family's history. From your parents' wedding day to
        your own first steps, these moments deserve more than just \"digitizing\"—they deserve a
        revival. We have spent two decades perfecting a process that combines white-glove care
        with industry-leading technology, ensuring that your legacy isn't just saved, but is
        ready to be shared with the next generation.
      </p>
    </section>
  );
}
