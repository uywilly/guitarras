// Generated from Guitarras.md — edit that file and re-run scripts/parse_md.py.
export interface Spec {
  label: string;
  value: string;
}

export interface Review {
  quote: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface Guitar {
  id: string;
  code: string;
  name: string;
  short: string;
  brand: string;
  series: string;
  type: string;
  origin: string;
  accent: string;
  /** cutout: the guitar floats free. photo: a real photograph, framed. */
  imageKind: 'cutout' | 'photo';
  images: string[];
  thumbs: string[];
  specs: Spec[];
  /** null when no real review of this exact model exists. */
  review: Review | null;
  source: string;
}

export const guitars: Guitar[] = [
  {
    "id": "squier-classic-vibe-70s-jaguar",
    "code": "0374090557",
    "name": "Squier Classic Vibe '70s Jaguar",
    "short": "Jaguar",
    "brand": "Squier by Fender",
    "series": "Classic Vibe",
    "type": "Eléctrica Solid Body",
    "origin": "Indonesia",
    "accent": "#6FAF98",
    "imageKind": "cutout",
    "images": [
      "images/0374090557/01.webp",
      "images/0374090557/02.webp",
      "images/0374090557/03.webp",
      "images/0374090557/04.webp",
      "images/0374090557/05.webp"
    ],
    "thumbs": [
      "images/0374090557/01_t.webp",
      "images/0374090557/02_t.webp",
      "images/0374090557/03_t.webp",
      "images/0374090557/04_t.webp",
      "images/0374090557/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "24\""
      },
      {
        "label": "Cuerpo",
        "value": "Poplar"
      },
      {
        "label": "Mástil",
        "value": "Maple (C Shape)"
      },
      {
        "label": "Diapasón",
        "value": "Indian Laurel"
      },
      {
        "label": "Radio",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22 Narrow Tall"
      },
      {
        "label": "Cejuela",
        "value": "Bone (42 mm)"
      },
      {
        "label": "Pastillas",
        "value": "2x Fender Designed Alnico Single Coils"
      },
      {
        "label": "Configuración",
        "value": "SS"
      },
      {
        "label": "Electrónica",
        "value": "Jaguar Rhythm & Lead Circuit"
      },
      {
        "label": "Puente",
        "value": "Vintage-Style Floating Bridge"
      },
      {
        "label": "Vibrato",
        "value": "Floating Vibrato"
      },
      {
        "label": "Clavijas",
        "value": "Vintage Style"
      },
      {
        "label": "Hardware",
        "value": "Nickel"
      },
      {
        "label": "Peso aproximado",
        "value": "3,6–3,9 kg"
      }
    ],
    "review": {
      "quote": "La calidad acá es difícil de superar en cualquier Jaguar de menos de mil dólares. Las pastillas suenan como corresponde y la guitarra se ve y se siente bien construida. Me veo tocándola durante años.",
      "sourceLabel": "Comprador verificado en zZounds",
      "sourceUrl": "https://www.zzounds.com/productreview--SQU0374090"
    },
    "source": "https://intl.fender.com/products/classic-vibe-70s-jaguar"
  },
  {
    "id": "epiphone-joe-bonamassa-1959-les-paul-custom-antique-ebony",
    "code": "EIJBLPCBGB1",
    "name": "Epiphone Joe Bonamassa 1959 Les Paul Custom (Antique Ebony)",
    "short": "Les Paul",
    "brand": "Epiphone",
    "series": "Artist Collection",
    "type": "Eléctrica Solid Body",
    "origin": "China",
    "accent": "#C9A24D",
    "imageKind": "cutout",
    "images": [
      "images/EIJBLPCBGB1/01.webp",
      "images/EIJBLPCBGB1/02.webp",
      "images/EIJBLPCBGB1/03.webp",
      "images/EIJBLPCBGB1/04.webp",
      "images/EIJBLPCBGB1/05.webp"
    ],
    "thumbs": [
      "images/EIJBLPCBGB1/01_t.webp",
      "images/EIJBLPCBGB1/02_t.webp",
      "images/EIJBLPCBGB1/03_t.webp",
      "images/EIJBLPCBGB1/04_t.webp",
      "images/EIJBLPCBGB1/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "24.75\""
      },
      {
        "label": "Cuerpo",
        "value": "Solid Mahogany"
      },
      {
        "label": "Mástil",
        "value": "Mahogany (1959 Rounded Medium C)"
      },
      {
        "label": "Diapasón",
        "value": "Ebony"
      },
      {
        "label": "Radio",
        "value": "12\""
      },
      {
        "label": "Trastes",
        "value": "22 Medium Jumbo"
      },
      {
        "label": "Cejuela",
        "value": "Graph Tech (43 mm)"
      },
      {
        "label": "Pastillas",
        "value": "2x Epiphone ProBucker Custom Humbuckers"
      },
      {
        "label": "Configuración",
        "value": "HH"
      },
      {
        "label": "Electrónica",
        "value": "2 Vol / 2 Tone + selector de 3 posiciones"
      },
      {
        "label": "Puente",
        "value": "LockTone Tune-O-Matic"
      },
      {
        "label": "Vibrato",
        "value": "Bigsby B70"
      },
      {
        "label": "Clavijas",
        "value": "Grover Imperial"
      },
      {
        "label": "Hardware",
        "value": "Gold"
      },
      {
        "label": "Incluye",
        "value": "Hard Case + Certificate of Authenticity"
      },
      {
        "label": "Peso aproximado",
        "value": "4,2–4,8 kg"
      }
    ],
    "review": null,
    "source": "https://www.gibson.com/products/epiphone-joe-bonamassa-59-les-paul-custom-antique-ebony"
  },
  {
    "id": "epiphone-sg-custom-ebony",
    "code": "EISCEBGH1",
    "name": "Epiphone SG Custom (Ebony)",
    "short": "SG",
    "brand": "Epiphone",
    "series": "Inspired by Gibson Collection",
    "type": "Eléctrica Solid Body",
    "origin": "China",
    "accent": "#A8863A",
    "imageKind": "cutout",
    "images": [
      "images/EISCEBGH1/01.webp",
      "images/EISCEBGH1/02.webp",
      "images/EISCEBGH1/03.webp",
      "images/EISCEBGH1/04.webp",
      "images/EISCEBGH1/05.webp"
    ],
    "thumbs": [
      "images/EISCEBGH1/01_t.webp",
      "images/EISCEBGH1/02_t.webp",
      "images/EISCEBGH1/03_t.webp",
      "images/EISCEBGH1/04_t.webp",
      "images/EISCEBGH1/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "24.75\""
      },
      {
        "label": "Cuerpo",
        "value": "Mahogany"
      },
      {
        "label": "Mástil",
        "value": "Mahogany (1960 SlimTaper C)"
      },
      {
        "label": "Diapasón",
        "value": "Ebony"
      },
      {
        "label": "Radio",
        "value": "12\""
      },
      {
        "label": "Trastes",
        "value": "22 Medium Jumbo"
      },
      {
        "label": "Cejuela",
        "value": "Graph Tech (43 mm)"
      },
      {
        "label": "Pastillas",
        "value": "2x Epiphone ProBucker Custom Humbuckers"
      },
      {
        "label": "Configuración",
        "value": "HH"
      },
      {
        "label": "Electrónica",
        "value": "2 Vol / 2 Tone + selector de 3 posiciones"
      },
      {
        "label": "Puente",
        "value": "LockTone Tune-O-Matic"
      },
      {
        "label": "Cordal",
        "value": "LockTone Stop Bar"
      },
      {
        "label": "Clavijas",
        "value": "Grover Mini Rotomatic (18:1)"
      },
      {
        "label": "Hardware",
        "value": "Gold"
      },
      {
        "label": "Incluye",
        "value": "Premium Gig Bag"
      },
      {
        "label": "Peso aproximado",
        "value": "3,0–3,4 kg"
      }
    ],
    "review": {
      "quote": "Fue una sorpresa, y de las buenas. La guitarra no necesitó ningún ajuste. Toca y suena muy bien. Tengo muchas SG y Les Paul Gibson: toca mejor que algunas de mis SG Gibson.",
      "sourceLabel": "Comprador verificado en zZounds",
      "sourceUrl": "https://www.zzounds.com/productreview--EPIEISC"
    },
    "source": "https://www.gibson.com/products/epiphone-sg-custom-ebony"
  },
  {
    "id": "ibanez-aad50celg",
    "code": "AAD50CELG",
    "name": "Ibanez AAD50CELG",
    "short": "AAD50CE",
    "brand": "Ibanez",
    "series": "Advanced Acoustic",
    "type": "Electroacústica",
    "origin": "China",
    "accent": "#C89F6B",
    "imageKind": "cutout",
    "images": [
      "images/AAD50CELG/01.webp",
      "images/AAD50CELG/02.webp",
      "images/AAD50CELG/03.webp",
      "images/AAD50CELG/04.webp",
      "images/AAD50CELG/05.webp"
    ],
    "thumbs": [
      "images/AAD50CELG/01_t.webp",
      "images/AAD50CELG/02_t.webp",
      "images/AAD50CELG/03_t.webp",
      "images/AAD50CELG/04_t.webp",
      "images/AAD50CELG/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "25.6\""
      },
      {
        "label": "Cuerpo",
        "value": "Grand Dreadnought (Solid Sitka Spruce + Sapele)"
      },
      {
        "label": "Mástil",
        "value": "Okoume (AAD Profile)"
      },
      {
        "label": "Diapasón",
        "value": "Purpleheart"
      },
      {
        "label": "Radio",
        "value": "15.75\""
      },
      {
        "label": "Trastes",
        "value": "20 Nickel Silver"
      },
      {
        "label": "Cejuela",
        "value": "Bone (43 mm)"
      },
      {
        "label": "Pastilla",
        "value": "Ibanez T-Bar Undersaddle"
      },
      {
        "label": "Preamp",
        "value": "Ibanez AEQ-TP2 con afinador integrado"
      },
      {
        "label": "Electrónica",
        "value": "EQ de 2 bandas + salidas XLR y 1/4\""
      },
      {
        "label": "Bracing",
        "value": "X-M Bracing"
      },
      {
        "label": "Puente",
        "value": "Purpleheart"
      },
      {
        "label": "Clavijas",
        "value": "Die-Cast Chrome (18:1)"
      },
      {
        "label": "Hardware",
        "value": "Chrome"
      }
    ],
    "review": {
      "quote": "Me acaba de llegar mi Ibanez electroacústica Advanced: instrumento hermoso, gran sonido.",
      "sourceLabel": "Comprador verificado en zZounds",
      "sourceUrl": "https://www.zzounds.com/productreview--IBAAAD50CE"
    },
    "source": "https://www.ibanez.com/eu/products/detail/aad50ce_1x_04.html"
  },
  {
    "id": "squier-classic-vibe-50s-stratocaster",
    "code": "0374005540",
    "name": "Squier Classic Vibe '50s Stratocaster",
    "short": "Strato",
    "brand": "Squier by Fender",
    "series": "Classic Vibe",
    "type": "Eléctrica Solid Body",
    "origin": "Indonesia",
    "accent": "#DD6E62",
    "imageKind": "cutout",
    "images": [
      "images/0374005540/01.webp",
      "images/0374005540/02.webp",
      "images/0374005540/03.webp",
      "images/0374005540/04.webp",
      "images/0374005540/05.webp"
    ],
    "thumbs": [
      "images/0374005540/01_t.webp",
      "images/0374005540/02_t.webp",
      "images/0374005540/03_t.webp",
      "images/0374005540/04_t.webp",
      "images/0374005540/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "25.5\""
      },
      {
        "label": "Cuerpo",
        "value": "Nato"
      },
      {
        "label": "Mástil",
        "value": "Maple (C Shape)"
      },
      {
        "label": "Diapasón",
        "value": "Maple"
      },
      {
        "label": "Radio",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "21 Narrow Tall"
      },
      {
        "label": "Cejuela",
        "value": "Bone (42 mm)"
      },
      {
        "label": "Pastillas",
        "value": "3x Fender Designed Alnico Single Coils"
      },
      {
        "label": "Configuración",
        "value": "SSS"
      },
      {
        "label": "Electrónica",
        "value": "Master Volume + 2 Tone + selector de 5 posiciones"
      },
      {
        "label": "Puente",
        "value": "Vintage-Style Synchronized Tremolo"
      },
      {
        "label": "Clavijas",
        "value": "Vintage Style"
      },
      {
        "label": "Hardware",
        "value": "Nickel"
      },
      {
        "label": "Peso aproximado",
        "value": "3,3–3,7 kg"
      }
    ],
    "review": {
      "quote": "La Strat de los '50 luce como debe, toca maravillosamente y suena auténtica. Si no llegás a la Fender Classic Series '50s Stratocaster, esta es definitivamente la guitarra a comprar.",
      "sourceLabel": "MusicRadar",
      "sourceUrl": "https://www.musicradar.com/reviews/guitars/squier-classic-vibe-stratocaster-50s-175425"
    },
    "source": "https://intl.fender.com/products/classic-vibe-50s-stratocaster"
  },
  {
    "id": "jackson-js-series-kelly-js32t",
    "code": "2910124568",
    "name": "Jackson JS Series Kelly JS32T",
    "short": "Kelly",
    "brand": "Jackson",
    "series": "JS Series",
    "type": "Eléctrica Solid Body",
    "origin": "China",
    "accent": "#8E9BA6",
    "imageKind": "cutout",
    "images": [
      "images/2910124568/01.webp",
      "images/2910124568/02.webp",
      "images/2910124568/03.webp",
      "images/2910124568/04.webp",
      "images/2910124568/05.webp"
    ],
    "thumbs": [
      "images/2910124568/01_t.webp",
      "images/2910124568/02_t.webp",
      "images/2910124568/03_t.webp",
      "images/2910124568/04_t.webp",
      "images/2910124568/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "25.5\""
      },
      {
        "label": "Cuerpo",
        "value": "Poplar"
      },
      {
        "label": "Mástil",
        "value": "Maple (Speed Neck)"
      },
      {
        "label": "Diapasón",
        "value": "Amaranth"
      },
      {
        "label": "Radio",
        "value": "Compound 12\"-16\""
      },
      {
        "label": "Trastes",
        "value": "24 Jumbo"
      },
      {
        "label": "Cejuela",
        "value": "Black Plastic (42.86 mm)"
      },
      {
        "label": "Pastillas",
        "value": "2x Jackson High-Output Humbuckers"
      },
      {
        "label": "Configuración",
        "value": "HH"
      },
      {
        "label": "Electrónica",
        "value": "Master Volume + Master Tone + selector de 3 posiciones"
      },
      {
        "label": "Puente",
        "value": "Jackson TOM-Style String-Through-Body"
      },
      {
        "label": "Clavijas",
        "value": "Jackson Sealed Die-Cast"
      },
      {
        "label": "Hardware",
        "value": "Black"
      },
      {
        "label": "Peso aproximado",
        "value": "3,4–3,8 kg"
      }
    ],
    "review": {
      "quote": "Creo que es una de las mejores guitarras por su precio en el mercado. Me encanta el encordado a través del cuerpo. Es simplemente una buena guitarra apenas la sacás de la caja: tiene un mástil rápido y muy buen tono.",
      "sourceLabel": "Comprador verificado en zZounds",
      "sourceUrl": "https://www.zzounds.com/productreview--JAC2910023"
    },
    "source": "https://intl.jacksonguitars.com/products/js-series-kelly-js32t"
  },
  {
    "id": "epiphone-flying-v-ebony",
    "code": "EIFVEBNH1",
    "name": "Epiphone Flying V (Ebony)",
    "short": "Flying V",
    "brand": "Epiphone",
    "series": "Inspired by Gibson Collection",
    "type": "Eléctrica Solid Body",
    "origin": "China",
    "accent": "#A9AFB3",
    "imageKind": "cutout",
    "images": [
      "images/EIFVEBNH1/01.webp",
      "images/EIFVEBNH1/02.webp",
      "images/EIFVEBNH1/03.webp",
      "images/EIFVEBNH1/04.webp",
      "images/EIFVEBNH1/05.webp"
    ],
    "thumbs": [
      "images/EIFVEBNH1/01_t.webp",
      "images/EIFVEBNH1/02_t.webp",
      "images/EIFVEBNH1/03_t.webp",
      "images/EIFVEBNH1/04_t.webp",
      "images/EIFVEBNH1/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "24.75\""
      },
      {
        "label": "Cuerpo",
        "value": "Mahogany"
      },
      {
        "label": "Mástil",
        "value": "Mahogany (SlimTaper C)"
      },
      {
        "label": "Diapasón",
        "value": "Laurel"
      },
      {
        "label": "Radio",
        "value": "12\""
      },
      {
        "label": "Trastes",
        "value": "22 Medium Jumbo"
      },
      {
        "label": "Cejuela",
        "value": "Graph Tech NuBone (43 mm)"
      },
      {
        "label": "Pastillas",
        "value": "Epiphone ProBucker 2 + ProBucker 3"
      },
      {
        "label": "Configuración",
        "value": "HH"
      },
      {
        "label": "Electrónica",
        "value": "2 Vol / 1 Tone + selector de 3 posiciones"
      },
      {
        "label": "Puente",
        "value": "LockTone Tune-O-Matic"
      },
      {
        "label": "Cordal",
        "value": "LockTone Stop Bar"
      },
      {
        "label": "Clavijas",
        "value": "Grover Rotomatic (18:1)"
      },
      {
        "label": "Hardware",
        "value": "Nickel"
      },
      {
        "label": "Peso aproximado",
        "value": "3,1–3,5 kg"
      }
    ],
    "review": {
      "quote": "Tuve varias Epiphone Flying V y esta es muy superior a las anteriores. Los bordes redondeados del diapasón y el trabajo de trastes son excelentes para la comodidad, y afina y se queda afinada muy bien. Es liviana y está bien balanceada: no tuve nada de neck dive.",
      "sourceLabel": "Comprador verificado en zZounds",
      "sourceUrl": "https://www.zzounds.com/productreview--EPIEIFV"
    },
    "source": "https://www.gibson.com/products/epiphone-flying-v-ebony"
  },
  {
    "id": "newen-tl",
    "code": "TL",
    "name": "Newen TL",
    "short": "Newen TL",
    "brand": "Newen",
    "series": "American Classic",
    "type": "Eléctrica Solid Body",
    "origin": "Argentina",
    "accent": "#D8573B",
    "imageKind": "cutout",
    "images": [
      "images/TL/01.webp",
      "images/TL/02.webp",
      "images/TL/03.webp",
      "images/TL/04.webp",
      "images/TL/05.webp"
    ],
    "thumbs": [
      "images/TL/01_t.webp",
      "images/TL/02_t.webp",
      "images/TL/03_t.webp",
      "images/TL/04_t.webp",
      "images/TL/05_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "25.5\" (648 mm)"
      },
      {
        "label": "Cuerpo",
        "value": "White Oak (Roble Blanco)"
      },
      {
        "label": "Mástil",
        "value": "Maple (C Shape)"
      },
      {
        "label": "Diapasón",
        "value": "Rosewood"
      },
      {
        "label": "Radio",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22 Vintage 5150"
      },
      {
        "label": "Cejuela",
        "value": "Synthetic Bone (42 mm)"
      },
      {
        "label": "Pastillas",
        "value": "2x Paradinamic® Single Coil"
      },
      {
        "label": "Configuración",
        "value": "SS"
      },
      {
        "label": "Electrónica",
        "value": "Master Volume + Master Tone + selector de 3 posiciones"
      },
      {
        "label": "Selector",
        "value": "1. Neck · 2. Neck + Bridge · 3. Bridge"
      },
      {
        "label": "Puente",
        "value": "Vintage Style TL 3-Saddle Bridge"
      },
      {
        "label": "Construcción del mástil",
        "value": "Bolt-On (4 Bolt Neck Plate)"
      },
      {
        "label": "Clavijas",
        "value": "Standard Metal Machine Heads"
      },
      {
        "label": "Hardware",
        "value": "Chrome"
      },
      {
        "label": "Pickguard",
        "value": "Negro"
      },
      {
        "label": "Acabado del cuerpo",
        "value": "Pintura custom sobre negro"
      },
      {
        "label": "Acabado del mástil",
        "value": "Satin Polyurethane"
      },
      {
        "label": "Peso aproximado",
        "value": "3,5 kg"
      }
    ],
    "review": null,
    "source": "https://www.newenguitars.com/product-page/newen-tl"
  },
  {
    "id": "ranger-honey-burst",
    "code": "MLAU185297625",
    "name": "Ranger (Honey Burst)",
    "short": "Ranger",
    "brand": "Ranger",
    "series": "N/D",
    "type": "Eléctrica Solid Body",
    "origin": "China (OEM)",
    "accent": "#C6983A",
    "imageKind": "cutout",
    "images": [
      "images/MLAU185297625/01.webp",
      "images/MLAU185297625/02.webp",
      "images/MLAU185297625/03.webp",
      "images/MLAU185297625/04.webp"
    ],
    "thumbs": [
      "images/MLAU185297625/01_t.webp",
      "images/MLAU185297625/02_t.webp",
      "images/MLAU185297625/03_t.webp",
      "images/MLAU185297625/04_t.webp"
    ],
    "specs": [
      {
        "label": "Escala",
        "value": "24.5\" (622.3 mm)"
      },
      {
        "label": "Cuerpo",
        "value": "Mahogany"
      },
      {
        "label": "Tapa",
        "value": "Arce flameado (Flamed Maple)"
      },
      {
        "label": "Mástil",
        "value": "Maple"
      },
      {
        "label": "Diapasón",
        "value": "Rosewood"
      },
      {
        "label": "Radio",
        "value": "N/D"
      },
      {
        "label": "Trastes",
        "value": "22"
      },
      {
        "label": "Cejuela",
        "value": "N/D"
      },
      {
        "label": "Pastillas",
        "value": "2x Humbuckers"
      },
      {
        "label": "Configuración",
        "value": "HH"
      },
      {
        "label": "Electrónica",
        "value": "2 Vol / 2 Tone + selector de 3 posiciones"
      },
      {
        "label": "Puente",
        "value": "Tune-O-Matic con Stop Bar"
      },
      {
        "label": "Clavijas",
        "value": "Die-Cast"
      },
      {
        "label": "Hardware",
        "value": "Chrome"
      },
      {
        "label": "Acabado",
        "value": "Gloss (Honey Burst sobre tapa flameada)"
      },
      {
        "label": "Incluye",
        "value": "Funda acolchada"
      },
      {
        "label": "Peso aproximado",
        "value": "N/D"
      }
    ],
    "review": null,
    "source": "https://www.mercadolibre.com.ar/guitarra-electrica-ranger-con-funda--azul-profundo/up/MLAU185297625"
  },
  {
    "id": "esp-ltd-mh-103qm-see-thru-black-modificada",
    "code": "LMH103QMSTB",
    "name": "ESP LTD MH-103QM (See-Thru Black) — Modificada",
    "short": "MH-103",
    "brand": "ESP LTD",
    "series": "MH Series",
    "type": "Guitarra eléctrica solid body",
    "origin": "",
    "accent": "#9A8F87",
    "imageKind": "cutout",
    "images": [
      "images/LMH103QMSTB/01.webp",
      "images/LMH103QMSTB/02.webp",
      "images/LMH103QMSTB/03.webp",
      "images/LMH103QMSTB/04.webp",
      "images/LMH103QMSTB/05.webp"
    ],
    "thumbs": [
      "images/LMH103QMSTB/01_t.webp",
      "images/LMH103QMSTB/02_t.webp",
      "images/LMH103QMSTB/03_t.webp",
      "images/LMH103QMSTB/04_t.webp",
      "images/LMH103QMSTB/05_t.webp"
    ],
    "specs": [
      {
        "label": "Modelo",
        "value": "MH-103QM"
      },
      {
        "label": "Orientación",
        "value": "Diestra"
      },
      {
        "label": "Color",
        "value": "See-Thru Black"
      },
      {
        "label": "Construcción",
        "value": "Bolt-on"
      },
      {
        "label": "Escala",
        "value": "25.5\" (648 mm)"
      },
      {
        "label": "Cuerpo",
        "value": "Basswood"
      },
      {
        "label": "Tapa",
        "value": "Quilted Maple"
      },
      {
        "label": "Mástil",
        "value": "Maple"
      },
      {
        "label": "Perfil del mástil",
        "value": "Thin U"
      },
      {
        "label": "Diapasón",
        "value": "Maple"
      },
      {
        "label": "Radio del diapasón",
        "value": "350 mm / 13.78\""
      },
      {
        "label": "Número de trastes",
        "value": "24"
      },
      {
        "label": "Tipo de trastes",
        "value": "Extra Jumbo"
      },
      {
        "label": "Cejuela",
        "value": "Locking Nut"
      },
      {
        "label": "Ancho de la cejuela",
        "value": "42 mm"
      },
      {
        "label": "Inlays",
        "value": "Black Dot"
      },
      {
        "label": "Inlay especial",
        "value": "Logotipo MH-103QM en el traste 12"
      },
      {
        "label": "Configuración de pastillas",
        "value": "HSS"
      },
      {
        "label": "Pastilla del mástil",
        "value": "ESP Designed LS-120N Single Coil"
      },
      {
        "label": "Pastilla central",
        "value": "ESP Designed LS-120M Single Coil"
      },
      {
        "label": "Pastilla del puente",
        "value": "ESP Designed LH-150B Humbucker"
      },
      {
        "label": "Controles",
        "value": "Master Volume y Master Tone"
      },
      {
        "label": "Selector",
        "value": "5 posiciones"
      },
      {
        "label": "Puente original",
        "value": "Floyd Rose Special / LTD Double-Locking Tremolo"
      },
      {
        "label": "Puente actual",
        "value": "Trémolo Gotoh de fabricación japonesa"
      },
      {
        "label": "Modelo exacto del Gotoh",
        "value": "No identificado"
      },
      {
        "label": "Clavijas",
        "value": "LTD"
      },
      {
        "label": "Hardware",
        "value": "Black Nickel"
      },
      {
        "label": "Peso aproximado",
        "value": "3,2 kg; puede variar según la unidad y el puente instalado"
      },
      {
        "label": "Estado del modelo",
        "value": "Descontinuado"
      }
    ],
    "review": {
      "quote": "La MH-103QM no tiene ni el aspecto ni el rendimiento de una eléctrica de entrada. Performance con carácter, y una ficha técnica impresionante para lo que cuesta. Emociones fuertes para rockeros exigentes.",
      "sourceLabel": "MusicRadar",
      "sourceUrl": "https://www.musicradar.com/reviews/guitars/esp-ltd-mh-103qm-158065"
    },
    "source": "https://reverb.com/p/esp-ltd-mh-103-qm"
  }
];
