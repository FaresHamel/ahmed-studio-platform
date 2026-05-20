import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function CloudSection() {
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[10px]">
          <Image
            src="/images/setUpDesktop.jpg"
            alt="From your attic to our app"
            fill
            className="object-cover"
          />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="font-poppins text-primary text-[26px] sm:text-[36px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            From your <br />
            attic to our app
          </h2>

          <p className="mt-8 font-poppins text-black text-[400] text-[16px] leading-relaxed opacity-90">
            Immerse yourself in the world of your memories from any screen, at any
            time. The AS Cloud makes it easy to stream and share thousands of
            moments from our app across your TV, tablet, laptop, phone and more.
            we provide you a FREE Cloud Hosting for 10 days! an amazing cloud
            hosting service for your home movies with many features. u can access
            memories any where, any time
          </p>

          <button className="mt-10 bg-primary text-white px-12 py-4 font-poppins font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md">
            Find Out More
          </button>
        </div>
      }
    />
  );
}
