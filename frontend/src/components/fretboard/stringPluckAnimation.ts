import gsap from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

gsap.registerPlugin(CSSRulePlugin);

/**
 * Nudges a string's line down and lets it spring back with an elastic
 * ease, so it looks like it got plucked. Targets the string's ::before
 * CSS rule directly through gsap's CSSRulePlugin, since a pseudo-element
 * has no real DOM node to animate.
 */
export function pluckString(stringIndex: number): void {
  const rule = CSSRulePlugin.getRule(
    `.fretboard .string:nth-of-type(${stringIndex + 1})::before`,
  );
  if (!rule) {
    return;
  }
  gsap.timeline()
    .to(rule, {
      cssRule: { top: "19px" },
      duration: 0.05,
      ease: "power1.out",
    })
    .to(rule, {
      cssRule: { top: "15px" },
      duration: 0.6,
      ease: "elastic.out(1, 0.15)",
    });
}
