import { useState, useEffect } from "react";

export function useScrollspy(ids: string[], rootMargin = "-0% 0% -75% 0%") {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const scrollContainer = document.querySelector(".overflow-y-auto");

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const ob = new IntersectionObserver(
        ([e]) => e.isIntersecting && setActive(id),
        {
          root: scrollContainer,
          rootMargin,
        }
      );
      ob.observe(el);
      observers.push(ob);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids, rootMargin]);

  return active;
}
