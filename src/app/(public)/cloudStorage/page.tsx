import AboutCloudStorage from "@/sections/cloudeStorage/Aboutcloudstorage";
import AfterDigitization from "@/sections/cloudeStorage/Afterdigitization";
import CloudFeatures from "@/sections/cloudeStorage/Cloudfeatures";
import StreamlinedJourney from "@/sections/cloudeStorage/Streamlinedjourney";

export default function CloudStorage() {
  return (
    <section className="w-full px-4 md:px-16 py-10 md:py-20">
      <AboutCloudStorage />
      <CloudFeatures />
      <AfterDigitization />
      <StreamlinedJourney />
    </section>
  );
}
