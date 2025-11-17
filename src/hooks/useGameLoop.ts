import { useEffect, useRef } from 'react';
import { useGame } from '@/context';
import { actions } from '@/context/actions';

/**
 * Custom hook for the game loop
 * Runs at 60 FPS using requestAnimationFrame
 */
export function useGameLoop() {
  const { dispatch } = useGame();
  const lastTimeRef = useRef<number>(performance.now());
  const animationIdRef = useRef<number>();

  useEffect(() => {
    let isActive = true;

    const loop = (currentTime: number) => {
      if (!isActive) return;

      // Calculate delta time in seconds
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Dispatch tick action with delta time
      dispatch(actions.tick(deltaTime));

      // Schedule next frame
      animationIdRef.current = requestAnimationFrame(loop);
    };

    // Start the loop
    lastTimeRef.current = performance.now();
    animationIdRef.current = requestAnimationFrame(loop);

    // Cleanup function
    return () => {
      isActive = false;
      if (animationIdRef.current !== undefined) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dispatch]);
}
