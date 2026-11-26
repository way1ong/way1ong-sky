// The marks of galaxies, nebulae and star clusters: drawn the same on the sky map and in the model of the Galaxy.
import type { DeepKind } from '../core/deep-sky.ts';

/**
 * The signs star charts use: a galaxy is an oval, a nebula a square, an open cluster a dotted circle, a
 * globular cluster a circle with a cross.
 */
export const deepSign: Record<DeepKind, (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => void> = {
  galaxy(ctx, x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.25, r * 0.6, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
  },
  nebula(ctx, x, y, r) {
    ctx.strokeRect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
  },
  open(ctx, x, y, r) {
    ctx.setLineDash([2.5, 2.5]);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  },
  globular(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
  },
};
