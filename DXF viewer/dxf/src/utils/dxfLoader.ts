import DxfParser from 'dxf-parser';

export type Shape =
  | { type: 'line'; layer: string; x1: number; y1: number; x2: number; y2: number }
  | { type: 'circle'; layer: string; cx: number; cy: number; r: number }
  | { type: 'arc'; layer: string; cx: number; cy: number; r: number; start: number; end: number }
  | { type: 'polyline'; layer: string; points: { x: number; y: number }[] };

export interface DxfResult {
  shapes: Shape[];
  layers: string[];
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
  version: string;
}

function arcPointsToLines(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const points: { x: number; y: number }[] = [];
  let start = startDeg;
  let end = endDeg;
  if (end < start) end += 360;
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const angle = ((start + ((end - start) * i) / steps) * Math.PI) / 180;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return points;
}

export function parseDxf(dxfText: string): DxfResult {
  const parser = new DxfParser();
  const dxf = parser.parseSync(dxfText);

  const shapes: Shape[] = [];
  const layerSet = new Set<string>();
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const updateBBox = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  const entities = dxf?.entities || [];

  for (const ent of entities) {
    const layer = ent.layer || '0';
    layerSet.add(layer);

    if (ent.type === 'LINE' && ent.vertices?.length >= 2) {
      const [a, b] = ent.vertices;
      shapes.push({ type: 'line', layer, x1: a.x, y1: -a.y, x2: b.x, y2: -b.y });
      updateBBox(a.x, -a.y);
      updateBBox(b.x, -b.y);
    }

    if (ent.type === 'CIRCLE' && ent.center) {
      shapes.push({ type: 'circle', layer, cx: ent.center.x, cy: -ent.center.y, r: ent.radius });
      updateBBox(ent.center.x - ent.radius, -ent.center.y - ent.radius);
      updateBBox(ent.center.x + ent.radius, -ent.center.y + ent.radius);
    }

    if (ent.type === 'ARC' && ent.center) {
      shapes.push({
        type: 'arc',
        layer,
        cx: ent.center.x,
        cy: -ent.center.y,
        r: ent.radius,
        start: ent.startAngle,
        end: ent.endAngle,
      });
      updateBBox(ent.center.x - ent.radius, -ent.center.y - ent.radius);
      updateBBox(ent.center.x + ent.radius, -ent.center.y + ent.radius);
    }

    if ((ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') && ent.vertices?.length) {
      const points = ent.vertices.map((v: any) => ({ x: v.x, y: -v.y }));
      shapes.push({ type: 'polyline', layer, points });
      points.forEach((p: any) => updateBBox(p.x, p.y));
    }
  }

  if (!isFinite(minX)) {
    minX = 0; minY = 0; maxX = 100; maxY = 100;
  }

  return {
    shapes,
    layers: Array.from(layerSet),
    bbox: { minX, minY, maxX, maxY },
    version: dxf?.header?.$ACADVER || 'Unknown',
  };
}

export { arcPointsToLines };