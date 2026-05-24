export const menuItems: {
  title: string;
  href: string;
  hasChildren?: boolean;
}[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "راهنما", href: "/guide" },
  { title: "اسپیکر‌های هوشمند", href: "/speaker" },
  { title: "دستیاران صوتی", href: "/product", hasChildren: true },
  { title: "خانه", href: "/" },
];
