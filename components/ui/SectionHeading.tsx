type Props = {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ id, title, subtitle, className = "" }: Props) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <h2 id={id} className="text-section font-semibold">
        {title}
      </h2>
      {subtitle && <p className="mt-5 text-lead text-muted">{subtitle}</p>}
    </header>
  );
}
