import type { PhotoRecord, LayoutPhoto } from '@/data/types';

// Deterministic pseudo-random number generator
function seededRand(seed: string): () => number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(33, h) ^ seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    h = (Math.imul(1664525, h) + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

function getTier(p: PhotoRecord): 0 | 1 | 2 | 3 {
  if (p.best50) return 0;
  if (p.best100) return 1;
  if (p.best250) return 2;
  return 3;
}

const BASE_SCALE = 3.0;

function getScaleMultiplier(tier: number, rand: () => number): number {
  switch (tier) {
    case 0: return 3.5 + rand() * 1.5; // 3.5 - 5
    case 1: return 2.0 + rand() * 1.0; // 2 - 3
    case 2: return 1.3 + rand() * 0.5; // 1.3 - 1.8
    default: return 1.0;
  }
}

export function computeLayout(photos: PhotoRecord[]): LayoutPhoto[] {
  const layout: LayoutPhoto[] = [];
  if (photos.length === 0) return layout;

  const heroes = photos.filter(p => getTier(p) === 0);
  const primaries = photos.filter(p => getTier(p) === 1);
  const others = photos.filter(p => getTier(p) > 1);

  // If no heroes exist, fake one just so the layout doesn't break
  if (heroes.length === 0 && photos.length > 0) {
    heroes.push(photos[0]);
  }

  const numConstellations = heroes.length;
  const constellations: Constellation[] = heroes.map((hero) => ({
    hero,
    primaries: [] as PhotoRecord[],
    supporting: [] as PhotoRecord[]
  }));

  // Distribute primaries evenly
  primaries.forEach((p, i) => constellations[i % numConstellations].primaries.push(p));

  // Distribute others evenly
  others.forEach((p, i) => constellations[i % numConstellations].supporting.push(p));

  // Position constellations in a macro golden spiral or loose grid
  const cols = Math.ceil(Math.sqrt(numConstellations * 1.5));
  const clusterSpacing = 150; // Huge breathing space between clusters

  const gridW = cols * clusterSpacing;
  const gridH = Math.ceil(numConstellations / cols) * clusterSpacing;

  const globalRand = seededRand("global-macro");

  constrainPhotos(constellations, layout, cols, clusterSpacing, gridW, gridH, globalRand);

  return layout;
}

interface Constellation {
  hero: PhotoRecord;
  primaries: PhotoRecord[];
  supporting: PhotoRecord[];
}

function constrainPhotos(
  constellations: Constellation[],
  layout: LayoutPhoto[],
  cols: number,
  clusterSpacing: number,
  gridW: number,
  gridH: number,
  globalRand: () => number,
) {
  constellations.forEach((cluster, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Add macro jitter to the cluster center
    const cx = col * clusterSpacing - gridW / 2 + clusterSpacing / 2 + (globalRand() - 0.5) * (clusterSpacing * 0.4);
    const cy = -(row * clusterSpacing - gridH / 2 + clusterSpacing / 2) + (globalRand() - 0.5) * (clusterSpacing * 0.4);

    const rand = seededRand(cluster.hero.id);

    // 1. Position Hero
    const heroTier = getTier(cluster.hero);
    const heroH = BASE_SCALE * getScaleMultiplier(heroTier, rand);
    const heroW = cluster.hero.aspectRatio * heroH;
    layout.push({
      ...cluster.hero,
      x: cx, y: cy, z: 0.5 + rand() * 0.5,
      w: heroW, h: heroH, tier: heroTier
    });

    // 2. Position Primaries (orbiting hero closely, forming flow)
    let angle = rand() * Math.PI * 2;
    cluster.primaries.forEach((p) => {
      const tier = getTier(p);
      const childH = BASE_SCALE * getScaleMultiplier(tier, rand);
      const childW = p.aspectRatio * childH;

      const radius = heroW * 0.6 + childW * 0.5 + rand() * 5;
      angle += (Math.PI * 2) / cluster.primaries.length + (rand() - 0.5) * 0.5;

      layout.push({
        ...p,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        z: (rand() - 0.5) * 1.0,
        w: childW, h: childH, tier
      });
    });

    // 3. Position Supporting (flowing outwards)
    let suppAngle = rand() * Math.PI * 2;
    let suppRadiusBase = heroW * 1.2;

    cluster.supporting.forEach((p) => {
      const tier = getTier(p);
      const childH = BASE_SCALE * getScaleMultiplier(tier, rand);
      const childW = p.aspectRatio * childH;

      // Organic flow outwards
      suppAngle += 0.4 + rand() * 0.4;
      suppRadiusBase += childW * 0.15; // spiral out

      const r = suppRadiusBase + rand() * 5;

      layout.push({
        ...p,
        x: cx + Math.cos(suppAngle) * r,
        y: cy + Math.sin(suppAngle) * r,
        z: -0.5 - rand() * 1.5, // deeper in background
        w: childW, h: childH, tier
      });
    });
  });
}
