import gsap from "gsap";

const stringPathElements = new Map<number, SVGPathElement>();

export function registerStringPath(
  stringIndex: number,
  el: SVGPathElement | null,
): void {
  if (!el) {
    stringPathElements.delete(stringIndex);
    return;
  }
  stringPathElements.set(stringIndex, el);
}

const activeBends = new Map<number, gsap.core.Timeline>();

/**
 * Builds an SVG path for a string that bends upward at a specific fret
 * position, tapering smoothly back down to the resting height at both
 * fixed ends (nut and bridge), like a real bent string.
 *
 * @param stringStartX - x-position of the string's fixed start (nut side)
 * @param stringEndX - x-position of the string's fixed end (bridge side)
 * @param restingY - the y-position the string sits at when not bent
 * @param bendX - x-position of the bend point (the fret being bent)
 * @param bendAmount - how far upward the string is pulled at bendX, in px
 */
function buildBendPath(
  stringStartX: number,
  stringEndX: number,
  restingY: number,
  bendX: number,
  bendAmount: number,
): string {
  const sampleCount = 40; // number of line segments used to approximate the curve

  // Distance from each fixed end to the bend point, used to normalize
  // how far along the taper any given x-position is.
  const distanceFromStartToBend = bendX - stringStartX;
  const distanceFromBendToEnd = stringEndX - bendX;

  const pathCommands: string[] = [];

  for (let i = 0; i <= sampleCount; i++) {
    // Walk evenly across the full string width, from start to end.
    const x = stringStartX + ((stringEndX - stringStartX) * i) / sampleCount;

    // How far this point is through its taper, from 0 (at a fixed end)
    // to 1 (at the bend point). Left and right sides taper independently
    // since they can have different lengths.
    const taperProgress =
      x <= bendX
        ? distanceFromStartToBend === 0
          ? 1
          : (x - stringStartX) / distanceFromStartToBend
        : distanceFromBendToEnd === 0
          ? 1
          : 1 - (x - bendX) / distanceFromBendToEnd;

    // Ease the linear taper into a smooth curve (quarter sine wave) so
    // the string lifts gradually off the fixed ends instead of kinking.
    const liftFalloff = Math.sin((Math.max(taperProgress, 0) * Math.PI) / 2);

    const y = restingY - bendAmount * liftFalloff;
    pathCommands.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }

  return pathCommands.join(" ");
}

/**
 * Bends a string upward at bendX (the fret position), holds briefly,
 * then releases with an elastic snap back to straight.
 */
export function bendString(
  stringIndex: number,
  noteEl: HTMLElement,
  bendPx: number = 22,
): void {
  const path = stringPathElements.get(stringIndex);
  const container = noteEl.closest<HTMLElement>(".string, .stringsFlipped");
  if (!path || !container) return;

  const containerRect = container.getBoundingClientRect();
  const noteRect = noteEl.getBoundingClientRect();
  const bendX = noteRect.left + noteRect.width / 2 - containerRect.left;
  console.log({
    stringIndex,
    fret: noteEl.textContent,
    bendX,
    containerWidth: containerRect.width,
  });

  const restY = 15; // matches your .string-line `top: 15px`
  const startX = 0;
  const endX = containerRect.width;

  activeBends.get(stringIndex)?.kill();
  const state = { amount: 0 };
  const redraw = () =>
    path.setAttribute(
      "d",
      buildBendPath(startX, endX, restY, bendX, state.amount),
    );

  const tl = gsap.timeline();
  activeBends.set(stringIndex, tl);
  tl.to(state, {
    amount: bendPx,
    duration: 0.18,
    ease: "power1.out",
    onUpdate: redraw,
  }).to(
    state,
    { amount: 0, duration: 0.4, ease: "elastic.out(1, 0.3)", onUpdate: redraw },
    "+=0.25",
  );
}
