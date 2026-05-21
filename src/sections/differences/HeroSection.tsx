export default function HeroSection() {
  return (
    <section className="max-w-[1170px] mx-auto px-4 mt-6">
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "520px" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-600 via-amber-900 to-stone-800" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
          <p className="text-white/80 text-sm mb-3 tracking-wide uppercase">
            Preserve What Matters Most
          </p>
          <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight max-w-xl mb-6">
            Your Memories, <br />Digitized with Care
          </h1>
          <button className="w-fit bg-white text-stone-800 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-amber-50 transition-colors shadow-md">
            Request A Quote
          </button>
        </div>
      </div>
    </section>
  );
}
