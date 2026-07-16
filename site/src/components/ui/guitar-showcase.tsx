import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { guitars } from "@/data/guitars";
import { FretboardNav } from "./fretboard-nav";

export function GuitarShowcase() {
  const [index, setIndex] = useState(0);
  const [shot, setShot] = useState(0);
  const guitar = guitars[index];

  const select = useCallback((next: number) => {
    setIndex(((next % guitars.length) + guitars.length) % guitars.length);
    setShot(0);
  }, []);

  const goPrev = useCallback(() => select(index - 1), [index, select]);
  const goNext = useCallback(() => select(index + 1), [index, select]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(el.tagName)) return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-5 sm:px-8">
      <Header />

      <main className="flex flex-1 flex-col gap-10 py-8 lg:flex-row lg:gap-14 lg:py-12">
        <ImageStage guitar={guitar} shot={shot} onShot={setShot} />
        <SpecPanel guitar={guitar} onPrev={goPrev} onNext={goNext} />
      </main>

      <div className="sticky bottom-0 -mx-5 border-t border-rule bg-rosewood/95 px-5 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:-mx-8 sm:px-8">
        <FretboardNav guitars={guitars} activeIndex={index} onSelect={select} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-baseline justify-between border-b border-rule py-6">
      <span className="font-mono text-[11px] tracking-[0.2em] text-nickel uppercase">
        La colección
      </span>
      <span className="font-mono text-[11px] tracking-[0.2em] text-nickel uppercase">
        {guitars.length} instrumentos
      </span>
    </header>
  );
}

function ImageStage({
  guitar,
  shot,
  onShot,
}: {
  guitar: (typeof guitars)[number];
  shot: number;
  onShot: (index: number) => void;
}) {
  const isPhoto = guitar.imageKind === "photo";

  return (
    <div className="lg:sticky lg:top-8 lg:h-fit lg:w-1/2 lg:shrink-0">
      {/* Two treatments, because the source material genuinely is two things.
          Press cutouts float on an accent wash. Real photographs (the ESP is
          only documented in the wild) get a frame instead of pretending. */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-sm lg:min-h-[440px]",
          isPhoto && "border border-rule",
        )}
        style={
          isPhoto
            ? undefined
            : { background: `radial-gradient(ellipse at center, ${guitar.accent}1f 0%, transparent 68%)` }
        }
      >
        <img
          // Keying on the src restarts the fade whenever the shot changes.
          key={guitar.images[shot]}
          src={guitar.images[shot]}
          alt={`${guitar.name} — foto ${shot + 1} de ${guitar.images.length}`}
          loading="lazy"
          className={cn(
            "animate-[fade_500ms_ease-out]",
            isPhoto
              ? "max-h-[62vh] w-full object-cover"
              : "max-h-[62vh] w-full object-contain",
          )}
        />
      </div>

      {guitar.images.length > 1 && (
        <ul className="mt-3 flex list-none gap-2 p-0">
          {guitar.thumbs.map((thumb, i) => (
            <li key={thumb}>
              <button
                type="button"
                onClick={() => onShot(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === shot ? "true" : undefined}
                className={cn(
                  "size-14 cursor-pointer overflow-hidden rounded-sm border bg-rosewood-deep p-1 transition-opacity",
                  i === shot ? "border-bone/50 opacity-100" : "border-rule opacity-50 hover:opacity-90",
                )}
              >
                <img src={thumb} alt="" loading="lazy" className="size-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SpecPanel({
  guitar,
  onPrev,
  onNext,
}: {
  guitar: (typeof guitars)[number];
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <p className="font-mono text-[11px] tracking-[0.18em] text-nickel uppercase">
        {[guitar.brand, guitar.series].filter((part) => part && part !== "N/D").join(" · ")}
      </p>

      <h1 className="font-display mt-3 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl">
        {guitar.name}
      </h1>

      <p className="mt-4 text-sm text-bone-dim">
        {[guitar.type, guitar.origin].filter(Boolean).join(" · ")}
      </p>

      <span aria-hidden className="mt-6 h-px w-16" style={{ backgroundColor: guitar.accent }} />

      <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
        {guitar.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5"
          >
            <dt className="shrink-0 text-xs tracking-wide text-nickel">{spec.label}</dt>
            <dd className="m-0 text-right font-mono text-xs text-bone">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-[0.12em] text-nickel">{guitar.code}</span>
        <a
          href={guitar.source}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-bone-dim no-underline transition-colors hover:text-bone"
        >
          Ficha del fabricante
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <div className="mt-8 flex gap-2">
        <NavButton onClick={onPrev} label="Guitarra anterior">
          <ArrowLeft className="size-4" />
        </NavButton>
        <NavButton onClick={onNext} label="Guitarra siguiente">
          <ArrowRight className="size-4" />
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 cursor-pointer items-center justify-center rounded-sm border border-rule bg-transparent text-bone-dim transition-colors hover:border-bone/40 hover:text-bone"
    >
      {children}
    </button>
  );
}
