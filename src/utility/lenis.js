import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 2,
    autoRaf: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}
