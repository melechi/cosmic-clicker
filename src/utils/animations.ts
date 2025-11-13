/**
 * Animation utilities and easing functions
 */

/**
 * Easing functions for smooth animations
 */
export const easing = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => --t * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - --t * t * t * t,
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInBounce: (t: number): number => 1 - easing.easeOutBounce(1 - t),
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};

/**
 * Interpolate between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Generate a random number between min and max
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simple spring physics for smooth animations
 */
export class Spring {
  private current: number;
  private target: number;
  private velocity: number;
  private stiffness: number;
  private damping: number;

  constructor(initial = 0, stiffness = 0.15, damping = 0.8) {
    this.current = initial;
    this.target = initial;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  update(deltaTime: number): number {
    const force = (this.target - this.current) * this.stiffness;
    this.velocity += force * deltaTime;
    this.velocity *= this.damping;
    this.current += this.velocity * deltaTime;
    return this.current;
  }

  setTarget(target: number): void {
    this.target = target;
  }

  setCurrent(current: number): void {
    this.current = current;
    this.velocity = 0;
  }

  getValue(): number {
    return this.current;
  }

  isSettled(threshold = 0.001): boolean {
    return Math.abs(this.target - this.current) < threshold && Math.abs(this.velocity) < threshold;
  }
}

/**
 * Create a wobble effect (useful for click feedback)
 */
export function wobble(time: number, amplitude = 1, frequency = 4): number {
  return Math.sin(time * frequency * Math.PI * 2) * amplitude * Math.exp(-time * 3);
}

/**
 * Generate particle position for explosions/bursts
 */
export interface ParticleConfig {
  angle: number;
  speed: number;
  lifetime: number;
}

export function generateBurstParticles(count: number, speedMin = 50, speedMax = 150): ParticleConfig[] {
  const particles: ParticleConfig[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      angle: (Math.PI * 2 * i) / count,
      speed: random(speedMin, speedMax),
      lifetime: random(0.5, 1.5),
    });
  }
  return particles;
}
