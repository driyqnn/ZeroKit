
declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  type ConfettiFunction = (options?: ConfettiOptions) => Promise<null>;

  interface Confetti extends ConfettiFunction {
    create: (canvas: HTMLCanvasElement, options?: { resize?: boolean, useWorker?: boolean }) => ConfettiFunction;
    reset: () => void;
  }

  const confetti: Confetti;
  export default confetti;
}
