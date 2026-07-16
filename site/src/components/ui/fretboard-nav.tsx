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
export function FretboardNav({ guitars, activeIndex, onSelect }: FretboardNavProps) {
  const activeRef = useRef<HTMLLIElement>(null);

  // When the strip is scrolled (narrow screens) keyboard and arrow-button
  // moves must bring the new position into view, not leave it off-neck.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  return (
    <nav
      aria-label="Elegir guitarra"
      className="flex items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                onClick={() => onSelect(index)}
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
