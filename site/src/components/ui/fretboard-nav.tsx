import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Guitar } from "@/data/guitars";

interface FretboardNavProps {
  guitars: Guitar[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * The selector is a fingerboard. Inlay dots exist to mark position, which is
 * exactly the job here: one dot per instrument, the active one lit in that
 * guitar's own finish colour. Bone nut on the left, nickel fret wires between.
 */
/** Drag distance that advances one position. */
const SWIPE_STEP = 56;

export function FretboardNav({ guitars, activeIndex, onSelect }: FretboardNavProps) {
  const activeRef = useRef<HTMLLIElement>(null);

  // When the strip is scrolled (narrow screens) keyboard and arrow-button
  // moves must bring the new position into view, not leave it off-neck.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  // Sliding the strip moves the selection, like sliding a hand along the neck.
  // A drag can cross several positions before React has re-rendered any of
  // them, so the count is kept in a ref rather than read back off the prop.
  const cursor = useRef(activeIndex);
  useEffect(() => {
    cursor.current = activeIndex;
  }, [activeIndex]);

  const origin = useRef<number | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    origin.current = event.clientX;
    dragged.current = false;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (origin.current === null) return;
    const steps = Math.trunc((event.clientX - origin.current) / SWIPE_STEP);
    if (steps === 0) return;
    // Captured only once a drag is real: capturing on pointerdown would
    // retarget the click of an ordinary tap away from its dot.
    if (!dragged.current) event.currentTarget.setPointerCapture(event.pointerId);
    // Dragging left pulls the next guitar in from the right.
    cursor.current -= steps;
    onSelect(cursor.current);
    origin.current += steps * SWIPE_STEP;
    dragged.current = true;
  };

  const endDrag = () => {
    origin.current = null;
  };

  return (
    <nav
      aria-label="Elegir guitarra"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // pan-y hands vertical scrolling back to the page and keeps the
      // horizontal axis for the drag above.
      className="flex touch-pan-y items-stretch overflow-x-auto select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Nut — bone, like every nut in these specs. */}
      <div aria-hidden className="sticky left-0 z-10 w-[3px] shrink-0 rounded-l-[2px] bg-bone/70" />

      <ul className="flex flex-1 list-none items-stretch bg-gradient-to-b from-rosewood-raise to-rosewood-deep p-0">
        {guitars.map((guitar, index) => {
          const active = index === activeIndex;
          return (
            // A neck is long: on a phone the strip scrolls rather than crushing
            // ten positions into 39px each.
            <li
              key={guitar.id}
              ref={active ? activeRef : undefined}
              className="relative min-w-[74px] flex-1"
            >
              {/* Fret wire */}
              {index > 0 && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-nickel/10 via-nickel/45 to-nickel/10"
                />
              )}
              <button
                type="button"
                // A drag that ends over a dot is a swipe, not a pick.
                onClick={() => !dragged.current && onSelect(index)}
                aria-current={active ? "true" : undefined}
                className="group flex h-full w-full cursor-pointer flex-col items-center gap-2 border-0 bg-transparent px-1 py-3 sm:py-4"
                title={guitar.name}
              >
                <span
                  aria-hidden
                  style={active ? { backgroundColor: guitar.accent, boxShadow: `0 0 12px ${guitar.accent}` } : undefined}
                  className={cn(
                    "size-2 rounded-full transition-all duration-300 sm:size-2.5",
                    active ? "scale-125" : "bg-nickel/35 group-hover:bg-nickel/70",
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-[9px] tracking-wide whitespace-nowrap uppercase transition-colors duration-300 sm:text-[10px]",
                    active ? "text-bone" : "text-nickel/60 group-hover:text-bone-dim",
                  )}
                >
                  {guitar.short}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
