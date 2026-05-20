interface Props {
  children: React.ReactNode;
  className?: string; // للسماح بتغيير لون الخلفية لكل قسم
}

export default function SectionContainer({ children, className = "" }: Props) {
  return (
    // هنا نضع الـ Padding الموحد الذي يطابق الـ Navbar
    <section className={`w-full px-6 md:px-16 py-20 ${className}`}>
      {/* py-20 تعطي مسافة عمودية احترافية بين الأقسام */}
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  );
}
