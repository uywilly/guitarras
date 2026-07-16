import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { guitars } from "@/data/guitars";
import { FretboardNav } from "./fretboard-nav";
import { SideRays } from "./side-rays";

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
      if (
        el instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(el.tagName)
      )
        return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-5 sm:px-8">
      {/* Raking light across the whole page, in the finish of whichever guitar
          is up — the same accent the inlay dot and the spec rule already use.
          It sits under the content and takes no clicks. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <SideRays
          origin="top-right"
          rayColor1={guitar.accent}
          rayColor2="#e8e3d9"
          speed={1.6}
          intensity={2.4}
          spread={1.6}
          saturation={1.1}
          blend={0.28}
          falloff={1.5}
          opacity={1}
        />
      </div>

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
  // The demo video sits one past the last photo: same strip, same selection.
  const video = guitar.video;
  const showVideo = shot === guitar.images.length;
  const src = guitar.images[shot];

  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const stageRef = useRef<HTMLButtonElement>(null);

  // A new shot under a zoomed lens would land on an arbitrary crop.
  useEffect(() => setZoomed(false), [src]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setZoomed(false);
      stageRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  const pointTo = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="lg:sticky lg:top-8 lg:h-fit lg:w-1/2 lg:shrink-0">
      {showVideo && video ? (
        // Player and caption together occupy the photo stage's height, so the
        // strip below doesn't jump as you move between a photo and the video.
        <figure className="m-0 flex flex-col justify-center lg:min-h-[440px]">
          <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-rule bg-rosewood-deep">
            {/* nocookie, and mounted only once the video is chosen: the page
                itself never phones YouTube. */}
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&autoplay=1`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-nickel">
            {video.channel}
          </figcaption>
        </figure>
      ) : (
        /* Two treatments, because the source material genuinely is two things.
         Press cutouts float on an accent wash. Real photographs (the ESP is
         only documented in the wild) get a frame instead of pretending. */
        <button
          ref={stageRef}
          type="button"
          // Click zooms where you clicked; while zoomed the pointer pans the crop.
          onClick={(event) => {
            pointTo(event);
            setZoomed((on) => !on);
          }}
          onMouseMove={(event) => zoomed && pointTo(event)}
          onMouseLeave={() => setZoomed(false)}
          aria-label={zoomed ? "Alejar la imagen" : "Ampliar la imagen"}
          aria-pressed={zoomed}
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-sm border-0 p-0 lg:min-h-[440px]",
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
            isPhoto ? "border border-rule" : "bg-transparent",
          )}
          style={
            isPhoto
              ? undefined
              : {
                  background: `radial-gradient(ellipse at center, ${guitar.accent}1f 0%, transparent 68%)`,
                }
          }
        >
          <img
            // Keying on the src restarts the fade whenever the shot changes.
            key={src}
            src={src}
            alt={`${guitar.name} — foto ${shot + 1} de ${guitar.images.length}`}
            loading="lazy"
            className={cn(
              "animate-[fade_500ms_ease-out] max-h-[62vh] w-full transition-transform duration-300 ease-out",
              isPhoto ? "object-cover" : "object-contain",
              zoomed && "scale-[2.2]",
            )}
            style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
          />
        </button>
      )}

      {(guitar.images.length > 1 || video) && (
        <ul className="mt-3 flex list-none items-center gap-2 p-0">
          {guitar.thumbs.map((thumb, i) => (
            <li key={thumb}>
              <button
                type="button"
                onClick={() => onShot(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === shot ? "true" : undefined}
                className={cn(
                  "size-14 cursor-pointer overflow-hidden rounded-sm border bg-rosewood-deep p-1 transition-opacity",
                  i === shot && !showVideo
                    ? "border-bone/50 opacity-100"
                    : "border-rule opacity-50 hover:opacity-90",
                )}
              >
                <img
                  src={thumb}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain"
                />
              </button>
            </li>
          ))}

          {/* Last position on the strip, and the only one that isn't a
              photograph — so it keeps the 16:9 of the frame it came from. */}
          {video && (
            <li>
              <button
                type="button"
                onClick={() => onShot(guitar.images.length)}
                aria-label="Ver el video"
                aria-current={showVideo ? "true" : undefined}
                title={video.title}
                className={cn(
                  "group relative h-14 w-24 cursor-pointer overflow-hidden rounded-sm border bg-rosewood-deep p-0 transition-opacity",
                  showVideo
                    ? "border-bone/50 opacity-100"
                    : "border-rule opacity-50 hover:opacity-90",
                )}
              >
                <img
                  src={video.thumb}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-rosewood-deep/45 transition-colors group-hover:bg-rosewood-deep/20"
                >
                  <Play className="size-4 fill-bone text-bone" />
                </span>
              </button>
            </li>
          )}
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
        {[guitar.brand, guitar.series]
          .filter((part) => part && part !== "N/D")
          .join(" · ")}
      </p>

      <h1 className="font-display mt-3 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl">
        {guitar.name}
      </h1>

      <p className="mt-4 text-sm text-bone-dim">
        {[guitar.type, guitar.origin].filter(Boolean).join(" · ")}
      </p>

      <span
        aria-hidden
        className="mt-6 h-px w-16"
        style={{ backgroundColor: guitar.accent }}
      />

      <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
        {guitar.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5"
          >
            <dt className="shrink-0 text-xs tracking-wide text-nickel">
              {spec.label}
            </dt>
            <dd className="m-0 text-right font-mono text-xs text-bone">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      {guitar.review && (
        <figure
          className="mt-8 border-l-2 pl-5"
          style={{ borderColor: guitar.accent }}
        >
          <blockquote className="font-display m-0 text-lg leading-snug text-balance text-bone italic">
            {guitar.review.quote}
          </blockquote>
          <figcaption className="mt-3">
            <a
              href={guitar.review.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-nickel no-underline transition-colors hover:text-bone"
            >
              {guitar.review.sourceLabel}
              <ArrowUpRight className="size-3" />
            </a>
          </figcaption>
        </figure>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-[0.12em] text-nickel">
          {guitar.code}
        </span>
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
