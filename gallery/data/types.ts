// Core photo record shape — matches photos-normalized.json
export interface PhotoRecord {
  id: string;
  filename: string;
  width: number;
  height: number;
  aspectRatio: number;
  captureDate: string;
  cameraModel: string;
  thumbnail: string;
  gallery: string;
  qualityScore: number;
  best50: boolean;
  best100: boolean;
  best250: boolean;
  best500: boolean;
}

// Laid-out photo: PhotoRecord + world-space position and size
export interface LayoutPhoto extends PhotoRecord {
  x: number;       // world-space center X
  y: number;       // world-space center Y
  z: number;       // world-space center Z
  w: number;       // world-space width
  h: number;       // world-space height
  tier: 0 | 1 | 2 | 3;  // 0=best50, 1=best100, 2=best250, 3=rest
}
