import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { cn } from "@/lib/utils";

/**
 * SideRays, from React Bits (https://reactbits.dev) — a WebGL fan of light
 * raked in from one corner. Ported to TypeScript, and with the container's
 * stylesheet folded into Tailwind classes, the way the rest of this site works.
 *
 * Two changes to the upstream behaviour, both consequences of the colours here
 * being live: the context is built once instead of on every prop change, and
 * a visitor who asks for reduced motion gets a single still frame.
 */

export type RayOrigin = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface SideRaysProps {
  /** Animation speed of the rays. */
  speed?: number;
  /** Colour of the first ray layer, as hex. */
  rayColor1?: string;
  /** Colour of the second ray layer, as hex. */
  rayColor2?: string;
  /** Overall brightness. */
  intensity?: number;
  /** Angular width of the fan. */
  spread?: number;
  /** Corner the rays emerge from. */
  origin?: RayOrigin;
  /** Rotation of the fan in degrees; positive tilts clockwise. */
  tilt?: number;
  /** 0 renders grey, above 1 boosts colour. */
  saturation?: number;
  /** Balance of the two layers: 0 is all of ray 1, 1 is all of ray 2. */
  blend?: number;
  /** How steeply brightness drops with distance; higher is a tighter glow. */
  falloff?: number;
  /** Overall opacity. */
  opacity?: number;
  className?: string;
}

type Uniforms = Record<string, { value: number | number[] }>;

const hexToRgb = (hex: string): number[] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
};

const originToFlip = (origin: RayOrigin): [number, number] => {
  switch (origin) {
    case "top-left":
      return [1, 0];
    case "bottom-right":
      return [0, 1];
    case "bottom-left":
      return [1, 1];
    default:
      return [0, 0];
  }
};

const vert = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const frag = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export function SideRays({
  speed = 1,
  rayColor1 = "#ffaa6e",
  rayColor2 = "#96c8ff",
  intensity = 1,
  spread = 1,
  origin = "top-right",
  tilt = 0,
  saturation = 1,
  blend = 0.78,
  falloff = 2,
  opacity = 1,
  className = "",
}: SideRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const [visible, setVisible] = useState(false);

  // Nothing is drawn while the layer is scrolled out of view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The context is deliberately built off `visible` alone. Upstream lists every
  // prop here, which tears the renderer down and rebuilds it on each change —
  // fine for fixed colours, but the accent below changes with the guitar. The
  // effect underneath pushes prop changes into the live uniforms instead.
  useEffect(() => {
    const container = containerRef.current;
    if (!visible || !container) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const [flipX, flipY] = originToFlip(origin);
    const uniforms: Uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      iSpeed: { value: speed },
      iRayColor1: { value: hexToRgb(rayColor1) },
      iRayColor2: { value: hexToRgb(rayColor2) },
      iIntensity: { value: intensity },
      iSpread: { value: spread },
      iFlipX: { value: flipX },
      iFlipY: { value: flipY },
      iTilt: { value: tilt },
      iSaturation: { value: saturation },
      iBlend: { value: blend },
      iFalloff: { value: falloff },
      iOpacity: { value: opacity },
    };
    uniformsRef.current = uniforms;

    const mesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, { vertex: vert, fragment: frag, uniforms }),
    });

    const updateSize = () => {
      renderer.dpr = Math.min(window.devicePixelRatio, 2);
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
      renderer.render({ scene: mesh });
    };

    let frame = 0;
    const loop = (t: number) => {
      uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    // Reduced motion still gets the light, just not the drift.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateSize);
      uniformsRef.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.parentNode?.removeChild(gl.canvas);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps -- props are pushed as uniforms below

  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    const [flipX, flipY] = originToFlip(origin);
    u.iSpeed.value = speed;
    u.iRayColor1.value = hexToRgb(rayColor1);
    u.iRayColor2.value = hexToRgb(rayColor2);
    u.iIntensity.value = intensity;
    u.iSpread.value = spread;
    u.iFlipX.value = flipX;
    u.iFlipY.value = flipY;
    u.iTilt.value = tilt;
    u.iSaturation.value = saturation;
    u.iBlend.value = blend;
    u.iFalloff.value = falloff;
    u.iOpacity.value = opacity;
  }, [speed, rayColor1, rayColor2, intensity, spread, origin, tilt, saturation, blend, falloff, opacity]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("relative size-full overflow-hidden", className)}
    />
  );
}
