import { useState, useEffect, useRef, useCallback } from 'react';
import { easing } from '../utils/animations';

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for animated number transitions
 */
export interface UseAnimatedNumberOptions {
  duration?: number;
  easingFunction?: (t: number) => number;
  delay?: number;
}

export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const { duration = 500, easingFunction = easing.easeOutQuad, delay = 0 } = options;
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number>();
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef<number>();

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime + delay;
      }

      if (currentTime < startTimeRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunction(progress);

      const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, easingFunction, delay]);

  return displayValue;
}

/**
 * Hook for fade in/out animations
 */
export interface UseFadeOptions {
  duration?: number;
  delay?: number;
}

export function useFade(isVisible: boolean, options: UseFadeOptions = {}) {
  const { duration = 300, delay = 0 } = options;
  const [opacity, setOpacity] = useState(isVisible ? 1 : 0);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }

    const startTime = performance.now() + delay;
    const targetOpacity = isVisible ? 1 : 0;
    const startOpacity = opacity;

    const animate = (currentTime: number) => {
      if (currentTime < startTime) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing.easeInOutQuad(progress);

      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * easedProgress;
      setOpacity(currentOpacity);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (!isVisible) {
        setShouldRender(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, duration, delay]); // Note: opacity not in deps to avoid loops

  return { opacity, shouldRender };
}

/**
 * Hook for scale animations (pulse effect)
 */
export function usePulse(trigger: number, options: { duration?: number; scale?: number } = {}) {
  const { duration = 200, scale = 1.1 } = options;
  const [currentScale, setCurrentScale] = useState(1);
  const animationRef = useRef<number>();
  const lastTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === lastTriggerRef.current) {
      return;
    }
    lastTriggerRef.current = trigger;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let currentScale: number;
      if (progress < 0.5) {
        // Scale up
        const upProgress = progress * 2;
        currentScale = 1 + (scale - 1) * easing.easeOutQuad(upProgress);
      } else {
        // Scale down
        const downProgress = (progress - 0.5) * 2;
        currentScale = scale - (scale - 1) * easing.easeOutQuad(downProgress);
      }

      setCurrentScale(currentScale);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentScale(1);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, duration, scale]);

  return currentScale;
}

/**
 * Hook for shake animation (error feedback)
 */
export function useShake(trigger: number, options: { duration?: number; intensity?: number } = {}) {
  const { duration = 500, intensity = 10 } = options;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const lastTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === lastTriggerRef.current) {
      return;
    }
    lastTriggerRef.current = trigger;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const decay = 1 - progress;
      const frequency = 8;
      const offsetX = Math.sin(progress * frequency * Math.PI * 2) * intensity * decay;
      const offsetY = Math.cos(progress * frequency * Math.PI * 2) * intensity * 0.5 * decay;

      setOffset({ x: offsetX, y: offsetY });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, duration, intensity]);

  return offset;
}

/**
 * Hook to run an animation loop with requestAnimationFrame
 */
export function useAnimationFrame(callback: (deltaTime: number) => void, isActive = true): void {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000; // Convert to seconds
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = undefined;
    };
  }, [isActive]);
}

/**
 * Hook to detect if an element is visible in viewport
 */
export function useInView(options: IntersectionObserverInit = {}): [
  React.RefCallback<Element>,
  boolean
] {
  const [isInView, setIsInView] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    const { current: currentObserver } = observer;

    if (node) {
      currentObserver.observe(node);
    }

    return () => {
      currentObserver.disconnect();
    };
  }, [node, options.threshold, options.root, options.rootMargin]);

  const ref = useCallback((node: Element | null) => {
    setNode(node);
  }, []);

  return [ref, isInView];
}
