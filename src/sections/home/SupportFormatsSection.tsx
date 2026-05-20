export default function SupportFormatsSection() {
  return (
    /* استخدام اللون الجديد bg-bg-soft */
    <section className="bg-bg-soft p-12  mb-[50px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* الجزء الأيسر: العنوان والوصف */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <h2
            className="
  font-poppins
  text-[#242E42]
  text-[24px]
  sm:text-[30px]
  md:text-[36px]
  font-[500]
  mb-4 md:mb-6
"
          >
            Supported Formats
          </h2>

          <p
            className="
  font-poppins
  text-[#444647]
  text-[13px]
  sm:text-[14px]
  md:text-[16px]
  font-[400]
  mb-8 md:mb-10
  leading-relaxed
"
          >
            We support a wide range of legacy formats. If you don't see your
            format listed, please contact us for a custom assessment.
          </p>
          <button className="bg-primary text-white px-10 py-4 font-[400] rounded-lg hover:bg-primary/90 transition-all">
            Discover More
          </button>
        </div>

        {/* الجزء الأيمن: القوائم (Audio, Video, Film) */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {/* Audio */}
          <div>
            <h3 className="font-poppins text-[#CC8C33] text-[16px] md:text-[18px] font-[400] mb-3 md:mb-4 border-b border-[#D5D7DD] pb-2">
              Audio
            </h3>

            <ul className="space-y-1 md:space-y-2 font-poppins text-[#444647] text-[12px] md:text-sm">
              <li>1/4" Open Reel</li>
              <li>Compact Cassette</li>
              <li>DAT / ADAT</li>
              <li>Vinyl / Shellac</li>
              <li>Wire Recordings</li>
            </ul>
          </div>

          {/* Video */}
          <div>
            <h3 className="font-poppins text-[#CC8C33] text-[16px] md:text-[18px] font-[400] mb-3 md:mb-4 border-b border-[#D5D7DD] pb-2">
              Video
            </h3>

            <ul className="space-y-1 md:space-y-2 font-poppins text-[#444647] text-[12px] md:text-sm">
              <li>VHS / S-VHS</li>
              <li>Betacam SP/Digi</li>
              <li>U-Matic (3/4")</li>
              <li>Hi8 / Video8</li>
              <li>MiniDV / DVCAM</li>
            </ul>
          </div>

          {/* Film */}
          <div>
            <h3 className="font-poppins text-[#CC8C33] text-[16px] md:text-[18px] font-[400] mb-3 md:mb-4 border-b border-[#D5D7DD] pb-2">
              Film
            </h3>

            <ul className="space-y-1 md:space-y-2 font-poppins text-[#444647] text-[12px] md:text-sm">
              <li>32mm</li>
              <li>16mm / Super 16</li>
              <li>8mm / Super 8</li>
              <li>9.5mm</li>
              <li>Pathe Baby</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
