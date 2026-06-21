interface PageHeadingProps {
  label?: string;
  title: string;
}

export function PageHeading({ label, title }: PageHeadingProps) {
  return (
    <div className="mb-10">
      {label && (
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
          {label}
        </p>
      )}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#111111]">
        {title}
      </h1>
    </div>
  );
}
