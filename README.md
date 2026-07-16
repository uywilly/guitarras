# La colección

Sitio estático que muestra diez guitarras y sus fichas técnicas.
`Guitarras.md` es la fuente de verdad: el sitio se genera desde ahí.

## Estructura

```
Guitarras.md            specs — editá esto, no los datos generados
images/<código>/        originales scrapeados (80 MB, no se publican)
site/                   la app (Vite + React + TS + Tailwind v4)
  scripts/              pipeline md/imágenes -> datos del sitio
  src/data/guitars.ts   GENERADO — no editar a mano
  public/images/        webp optimizados (4 MB, esto sí se publica)
.github/workflows/      deploy a GitHub Pages
```

## Correr local

```bash
cd site
npm install
npm run dev
```

## Actualizar datos

Después de tocar `Guitarras.md` o de agregar imágenes a `images/<código>/`:

```bash
cd site
npm run sync     # procesa imágenes y regenera guitars.ts
```

`npm run sync` hace dos cosas:

1. **`prepare_images.py`** — convierte a webp (1400 px + thumb 360 px) y clasifica
   cada guitarra. Las fotos de prensa con fondo blanco se recortan a transparencia
   con floodfill desde la esquina, así la guitarra flota como las que ya venían en
   PNG transparente. Las fotos ambientales reales no se pueden recortar: quedan
   marcadas como `photo` y el sitio las enmarca en vez de fingir.
2. **`parse_md.py`** — parsea `Guitarras.md` a `src/data/guitars.ts`. Los campos se
   leen tal cual estén; no hay lista fija, así que agregar una spec nueva al `.md`
   la hace aparecer sola.

Requiere `python3` e ImageMagick (`magick`).

## Deploy

Push a `main` dispara el workflow. Una sola vez, en el repo:
**Settings → Pages → Source: GitHub Actions**.

`vite.config.ts` usa `base: "./"` (rutas relativas), así que el build funciona igual
en `usuario.github.io/repo/` que en un dominio propio. No hay que tocar nada al
cambiar el nombre del repo.

## Pendientes conocidos

- **Ranger (`MLAU185297625`)** — las cinco imágenes son de *otras* guitarras: el
  scraper de Mercado Libre agarró el carrusel de recomendados. Hay que reemplazarlas
  con fotos propias.
- **ESP LTD (`LMH103QMSTB`)** — solo dos fotos; el modelo está descontinuado y no hay
  más material oficial. Además la unidad real está modificada (trémolo Gotoh en vez
  del Floyd Rose), así que ninguna foto de catálogo la representa bien.
