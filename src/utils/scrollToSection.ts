/**
 * Scrolls to a target element smoothly within the scroll container
 * @param itemId - The ID of the target element to scroll to
 * @param offset - Offset from top (default: 30px)
 */
export function scrollToSection(itemId: string, offset = 30) {
  setTimeout(() => {
    const el = document.getElementById(itemId);
    if (!el) return;

    const scrollContainer = document.querySelector(".overflow-y-auto");

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = el.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const targetPosition =
        scrollTop + elementRect.top - containerRect.top - offset;

      scrollContainer.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    } else {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, 10);
}
