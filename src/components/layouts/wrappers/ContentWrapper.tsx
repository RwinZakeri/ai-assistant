const ContentWrapper = ({ children, hiddenPaddingY }: { children: React.ReactNode, hiddenPaddingY?: boolean }) => {
  return <div className={`max-w-[1440px] mx-auto p-4 md:px-16 ${hiddenPaddingY ? "py-0" : "py-16 md:py-24"} `}>{children}</div>;
};

export default ContentWrapper;