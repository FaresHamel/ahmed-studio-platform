interface SimpleInfoSectionProps {
  title: string;
  description: string;
  subtitle?: string;
  centered?: boolean;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  maxWidth?: string;
}

export default function SimpleInfoSection({
  title,
  description,
  subtitle,
  centered = true,
  containerClassName = "my-[100px]",
  titleClassName = "font-poppins text-primary text-[26px] sm:text-[30px] md:text-[40px] leading-tight font-[500] mb-4",
  descriptionClassName = "font-poppins text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-90",
  maxWidth = "max-w-3xl"
}: SimpleInfoSectionProps) {
  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      <div className={`text-center mb-16 ${maxWidth}`}>
        {subtitle && (
          <p className="font-poppins text-gray-600 text-sm mb-2">
            {subtitle}
          </p>
        )}
        <h2 className={titleClassName}>
          {title}
        </h2>

        <p className={descriptionClassName}>
          {description}
        </p>
      </div>
    </div>
  );
}
