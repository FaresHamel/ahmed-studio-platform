import AboutCloudStorage from "@/src/sections/cloudeStorage/Aboutcloudstorage";
import AfterDigitization from "@/src/sections/cloudeStorage/Afterdigitization";
import CloudFeatures from "@/src/sections/cloudeStorage/Cloudfeatures";
import StreamlinedJourney from "@/src/sections/cloudeStorage/Streamlinedjourney";

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
