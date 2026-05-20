interface Props {
  children: React.ReactNode;
  className?: string; // To allow changing the background color for each section
}

export default function SectionContainer({ children, className = "" }: Props) {
  return (
    // Here we put the unified Padding that matches the Navbar
    <section className={`w-full px-6 md:px-16 py-20 ${className}`}>
      {/* py-20 provides professional vertical spacing between sections */}
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  );
}
