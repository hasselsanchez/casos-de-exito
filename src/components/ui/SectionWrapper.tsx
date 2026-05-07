interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  narrow?: boolean;
}

export default function SectionWrapper({
  id,
  className = "",
  children,
  narrow = false,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`relative overflow-hidden ${className}`}>
      <div
        className={`relative z-10 mx-auto px-4 tablet:px-6 ${
          narrow ? "max-w-[721px]" : "max-w-[1018px]"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
