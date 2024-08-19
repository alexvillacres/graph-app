import gsap from 'gsap';

export function animatePulse(
  timeline: gsap.core.Timeline,
  circleId: string,
  stops: string[],
  initalOffsets: string[],
  endOffset: string[]
) {
  // Use gsap.set to initialize all stops at 0%
  stops.forEach((stop, index) => {
    gsap.set(stop, { attr: { offset: initalOffsets[index] } });
  });

  gsap.set(circleId, { opacity: 0 });

  gsap.timeline({
    repeat: -1, // 2-second pause between repeats
    ease: 'expo.in', // Easing for smooth transitions
  });

  timeline
    .to(circleId, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }) // Fade in
    .to(circleId, { opacity: 0, duration: 0.5, ease: 'power1.inOut' }) // Fade o
    .to(stops[0], { attr: { offset: endOffset[0] }, delay: 0.2, duration: 3 }, 0)
    .to(stops[1], { attr: { offset: endOffset[1] }, delay: 0.2, duration: 3 }, 0)
    .to(stops[2], { attr: { offset: endOffset[2] }, delay: 0.2, duration: 3 }, 0)
    .to(stops[3], { attr: { offset: endOffset[3] }, delay: 0.2, duration: 3 }, 0);
}
