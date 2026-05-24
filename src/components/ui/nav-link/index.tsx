import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({
  href,
  children,
  className,
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={[
        "text-md-demibold text-textSecondary transition-colors hover:text-primary-300",
        className,
      ].join(" ")}
      aria-label={typeof children === "string" ? children : undefined}
    >
      {children}
    </Link>
  );
};

