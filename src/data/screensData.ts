import { GalleryItem, CaseStudy } from '../types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'arch-01',
    title: 'Monolithic Concrete Pavilion',
    category: 'Architecture',
    hotlinkUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    author: 'Rory Gardiner',
    authorHandle: '@rorygardiner',
    aspectRatio: '16:9',
    dimensions: '2400 × 1350 px',
    exif: {
      camera: 'Phase One IQ4',
      lens: 'Schneider Kreuznach 35mm',
      focalLength: '35mm',
      aperture: 'f/8.0',
      iso: '64',
      shutter: '1/125s',
    },
    description: 'Raw board-formed concrete cantilevered structure capturing morning shadow gradients in Kyoto.',
    year: '2026',
  },
  {
    id: 'ind-01',
    title: 'Acoustic Precision Monolith',
    category: 'Industrial Design',
    hotlinkUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    author: 'Marcus Aurel',
    authorHandle: '@marcusaurel',
    aspectRatio: '4:3',
    dimensions: '1800 × 1350 px',
    exif: {
      camera: 'Hasselblad H6D-100c',
      lens: 'HC 2,2/100mm',
      focalLength: '100mm',
      aperture: 'f/5.6',
      iso: '100',
      shutter: '1/200s',
    },
    description: 'Bespoke anodized aluminum audio chamber engineered with zero visible fasteners.',
    year: '2026',
  },
  {
    id: 'fash-01',
    title: 'Sculptural Wool Silhouette',
    category: 'Editorial Fashion',
    hotlinkUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    author: 'Elena Rostova',
    authorHandle: '@elenarostova',
    aspectRatio: '3:4',
    dimensions: '1200 × 1600 px',
    exif: {
      camera: 'Leica S3 Medium Format',
      lens: 'Summarit-S 70mm f/2.5',
      focalLength: '70mm',
      aperture: 'f/4.0',
      iso: '200',
      shutter: '1/160s',
    },
    description: 'Avant-garde heavy drape outerwear tailored from unbleached natural Shetland fiber.',
    year: '2025',
  },
  {
    id: 'liv-01',
    title: 'Subtractive Living Pavilion',
    category: 'Minimalist Living',
    hotlinkUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    author: 'Kenzo Shibuya',
    authorHandle: '@kenzoshibuya',
    aspectRatio: '4:3',
    dimensions: '1600 × 1200 px',
    exif: {
      camera: 'Fujifilm GFX 100 II',
      lens: 'GF 45-100mm f/4',
      focalLength: '52mm',
      aperture: 'f/7.1',
      iso: '125',
      shutter: '1/60s',
    },
    description: 'Low-slung solid hinoki woodwork paired with textured lime plaster surfaces.',
    year: '2026',
  },
  {
    id: 'arch-02',
    title: 'Perimeter Curtain Glass Facade',
    category: 'Architecture',
    hotlinkUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: 'Astrid Lind',
    authorHandle: '@astridlind',
    aspectRatio: '16:9',
    dimensions: '1920 × 1080 px',
    exif: {
      camera: 'Canon EOS R5',
      lens: 'TS-E 24mm f/3.5L II',
      focalLength: '24mm (Tilt-Shift)',
      aperture: 'f/11',
      iso: '100',
      shutter: '1/80s',
    },
    description: 'Structural mullion repetition reflecting high-altitude cloud cover in Zurich.',
    year: '2025',
  },
  {
    id: 'ind-02',
    title: 'Horological Chrono-Gauge',
    category: 'Industrial Design',
    hotlinkUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    author: 'Julian Weber',
    authorHandle: '@julianweber',
    aspectRatio: '1:1',
    dimensions: '1400 × 1400 px',
    exif: {
      camera: 'Sony α7R V',
      lens: 'FE 90mm f/2.8 Macro G',
      focalLength: '90mm',
      aperture: 'f/13',
      iso: '100',
      shutter: '1/250s',
    },
    description: 'Beveled sapphire crystal casing with sandblasted titanium bezel indices.',
    year: '2026',
  },
  {
    id: 'liv-02',
    title: 'Monochrome Culinary Hearth',
    category: 'Minimalist Living',
    hotlinkUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    author: 'Clara Dupont',
    authorHandle: '@claradupont',
    aspectRatio: '16:9',
    dimensions: '1800 × 1012 px',
    exif: {
      camera: 'Nikon Z9',
      lens: 'NIKKOR Z 35mm f/1.8 S',
      focalLength: '35mm',
      aperture: 'f/4.5',
      iso: '160',
      shutter: '1/100s',
    },
    description: 'Honed black granite kitchen monolith with concealed induction surfaces.',
    year: '2026',
  },
  {
    id: 'fash-02',
    title: 'Tactile Monochromatic Portrait',
    category: 'Editorial Fashion',
    hotlinkUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    author: 'Soren Kjaer',
    authorHandle: '@sorenkjaer',
    aspectRatio: '3:4',
    dimensions: '1200 × 1600 px',
    exif: {
      camera: 'Hasselblad 907X 50C',
      lens: 'XCD 80mm f/1.9',
      focalLength: '80mm',
      aperture: 'f/2.2',
      iso: '100',
      shutter: '1/320s',
    },
    description: 'High-contrast studio study exploring silhouette curvature and structured wool tailoring.',
    year: '2025',
  },
];

export const FEATURED_CASE_STUDY: CaseStudy = {
  id: 'kronos-interface',
  title: 'KRONOS: Spatial Avionics Platform',
  subtitle: 'Zero-latency flight deck telematics and waypoint coordination for autonomous urban aerial corridors.',
  client: 'Aeronautics Dynamics Group (ADG)',
  year: '2026',
  discipline: 'Aviation Interface & Spatial HUD',
  heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  challenge: 'Urban air mobility operators were experiencing critical cognitive overload monitoring multi-rotor autonomous crafts simultaneously across congested metropolitan airspace. Legacy avionics software was cluttered with legacy CRT skeuomorphism and fragmented 2D feeds.',
  solution: 'We engineered a spatial situational interface prioritizing predictive trajectory cones, tabular micro-telemetry, and tactile glass HUD components. Every flight vector is verified with sub-50ms render times.',
  metrics: [
    {
      label: 'Telemetry Latency',
      value: '18ms',
      context: 'Down from 340ms legacy protocol benchmark',
    },
    {
      label: 'Operator Task Speed',
      value: '+164%',
      context: 'Validated across 420 simulated emergency vector events',
    },
    {
      label: 'Airspace Collision Margin',
      value: '0 Incidents',
      context: 'Across 12,000 live test hours in controlled testing corridor',
    },
    {
      label: 'Cognitive Load Reduction',
      value: '-42%',
      context: 'NASA-TLX standardized workload assessment score',
    },
  ],
  deliverables: [
    'Sub-20ms Spatial HUD Visual Engine',
    'High-Density Flight Vector Matrix',
    'Tactile Night-Vision Color Spectrum',
    'Tabular Avionics Typography System',
  ],
  galleryImages: [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Base flight coordination terminal deployed at Munich Test Facility',
      tag: 'Hardware Integration',
    },
    {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      caption: 'Anodized tactile throttle & vector control surface',
      tag: 'Physical Prototyping',
    },
    {
      url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
      caption: 'Auxiliary flight telemetry wearable receiver for rapid field dispatch',
      tag: 'Field Mobility',
    },
  ],
};

export const SAMPLE_HTML_TEMPLATES = [
  {
    name: 'Architectural Lookbook',
    description: 'Clean editorial grid with hotlinked photography, subtle borders, and unboxed typography.',
    code: `<section class="studio-section">
  <div class="hero-split">
    <div class="copy-column">
      <span class="meta-tag">Monograph 04 · April 2026</span>
      <h1 class="headline">Tectonic Concrete & Glazed Courtyards</h1>
      <p class="description">An architectural study in volumetric subtraction, raw board-formed surfaces, and filtered natural illumination.</p>
    </div>
    <div class="image-column">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Minimalist concrete villa with reflection pool" />
    </div>
  </div>

  <div class="spec-grid">
    <div class="spec-card">
      <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" alt="Subtractive living pavilion with low timber benches" />
      <h3>Interior Spatial Axis</h3>
      <p>Natural hinoki wood paired with acoustic lime wash.</p>
    </div>
    <div class="spec-card">
      <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80" alt="Monochrome dark kitchen hearth" />
      <h3>Monochrome Hearth</h3>
      <p>Honed black basalt countertops with concealed induction.</p>
    </div>
  </div>
</section>`,
  },
  {
    name: 'Industrial Device Showcase',
    description: 'Hardware product landing page with audio monolith and watch macro shots.',
    code: `<div class="device-showcase-screen">
  <header class="product-header">
    <span class="brand">KINETIC LABS</span>
    <span class="series">MK-IV Chrono Series</span>
  </header>

  <div class="product-hero">
    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80" alt="Bespoke anodized aluminum audio chamber" />
    <div class="product-meta">
      <h2>Precision Acoustic Monolith</h2>
      <p class="specs">40mm Beryllium Drivers · 96kHz Lossless Wireless · CNC Milled Basalt Base</p>
    </div>
  </div>

  <div class="sub-products">
    <div class="item">
      <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" alt="Horological chrono-gauge watch" />
      <h4>Titanium Chrono-Gauge</h4>
    </div>
    <div class="item">
      <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80" alt="Retro tactile optical camera" />
      <h4>Optical Viewfinder 35mm</h4>
    </div>
  </div>
</div>`,
  },
  {
    name: 'High-Fashion Monograph',
    description: 'Editorial magazine layout with high contrast silhouettes and typography.',
    code: `<div class="editorial-monograph">
  <div class="cover-card">
    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80" alt="Sculptural yellow knitwear fashion silhouette" />
    <div class="cover-text">
      <h2>Sculptural Form in Motion</h2>
      <span>Winter Collection / Issue 18</span>
    </div>
  </div>
  <div class="portrait-card">
    <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80" alt="High fashion editorial portrait in studio" />
    <div class="portrait-text">
      <h3>Tactile Drapery & Structure</h3>
      <p>Photographed by Soren Kjaer on medium format 50C sensor.</p>
    </div>
  </div>
</div>`,
  },
];
