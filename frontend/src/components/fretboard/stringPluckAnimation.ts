import gsap from "gsap";

const stringLineElements = new Map<number, HTMLElement>();

/**
 * Registers (or unregisters, when el is null) the real DOM element that
 * represents a string's line, so pluckString can animate it directly.
 */
export function registerStringLine(stringIndex: number, el: HTMLElement | null): void {
  if (!el) {
    stringLineElements.delete(stringIndex);
    return;
  }
  stringLineElements.set(stringIndex, el);
}

/**
 * Nudges a string's line down and lets it spring back with an elastic
 * ease, so it looks like it got plucked.
 */
export function pluckString(stringIndex: number): void {
  const el = stringLineElements.get(stringIndex);
  if (!el) {
    return;
  }
  gsap.timeline()
    .to(el, {
      top: "19px",
      duration: 0.05,
      ease: "power1.out",
    })
    .to(el, {
      top: "15px",
      duration: 0.6,
      ease: "elastic.out(1, 0.15)",
    });
}
