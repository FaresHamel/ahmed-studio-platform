import AboutCloudStorage from "@/src/sections/cloudeStorage/Aboutcloudstorage";
import AfterDigitization from "@/src/sections/cloudeStorage/Afterdigitization";
import CloudFeatures from "@/src/sections/cloudeStorage/Cloudfeatures";
import StreamlinedJourney from "@/src/sections/cloudeStorage/Streamlinedjourney";

export default function CloudStorage() {
  return (
    <section className={`w-full px-6 md:px-16 py-20`}>
      <AboutCloudStorage/>
      <CloudFeatures/>
      <AfterDigitization/>
      <StreamlinedJourney/>
    </section>
  );
}
