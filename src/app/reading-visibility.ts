/** Visibility is the only automatic encounter trigger. Downloaded, detached,
 * hidden-tab, and off-screen units are never encountered. */
export function observeVisibleReadingUnits(elements: readonly HTMLElement[], encounter: (unitId: string) => void): { disconnect(): void } {
  let active = true;
  const pending = new Set(elements);
  let observer: IntersectionObserver | undefined;
  const mark = (element: HTMLElement) => {
    if (!active || document.hidden || !element.isConnected || !pending.has(element)) return;
    const id = element.dataset.readingUnit;
    if (!id) return;
    encounter(id);
    pending.delete(element);
    observer?.unobserve(element);
  };
  const scan = () => {
    if (!active || document.hidden) return;
    for (const element of pending) {
      if (!element.isConnected) continue;
      const rect = element.getBoundingClientRect();
      const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      if (rect.width > 0 && rect.height > 0 && width * height >= rect.width * rect.height * 0.1) mark(element);
    }
  };
  if (typeof window.IntersectionObserver === "function") {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting && entry.intersectionRatio >= 0.1) mark(entry.target as HTMLElement);
    }, { threshold: 0.1 });
    for (const element of elements) observer.observe(element);
  } else {
    // Older browsers must measure the viewport, not mark the entire section.
    window.addEventListener("scroll", scan, { passive: true });
    window.addEventListener("resize", scan);
    scan();
  }
  document.addEventListener("visibilitychange", scan);
  return { disconnect() {
    active = false;
    observer?.disconnect();
    pending.clear();
    window.removeEventListener("scroll", scan);
    window.removeEventListener("resize", scan);
    document.removeEventListener("visibilitychange", scan);
  } };
}
