import Link from "next/link";

interface IconLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const IconLink = ({
  href,
  label,
  children,
  className,
}: IconLinkProps) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className={[
        "flex items-center justify-center transition-opacity hover:opacity-80",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
};
