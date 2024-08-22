import gsap from 'gsap';

// Global variables and utility functions
const container = document.querySelector('.conversation_contain') as HTMLElement;
const messages = Array.from(container.querySelectorAll('.conversation_card')) as HTMLElement[];

const getMessageHeight = (message: HTMLElement): number => {
  return message.offsetHeight;
};

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

export function animateCards() {
  const container = document.querySelector('.conversation_contain') as HTMLElement;
  const messages = Array.from(container.querySelectorAll('.conversation_card')) as HTMLElement[];

  let currentIndex = 0;

  const current = messages[currentIndex];
  const next = messages[(currentIndex + 1) % messages.length];
  const hidden = messages[(currentIndex + 2) % messages.length];

  const currentHeight = getMessageHeight(current);
  const nextHeight = getMessageHeight(next);

  const tl = gsap.timeline({
    delay: 2.6,
    ease: 'power3.out',
    onComplete: () => {
      currentIndex = (currentIndex + 1) % messages.length;
      container.appendChild(current);
      animateCards();
    },
  });

  tl.fromTo(
    current,
    { opacity: 1, y: 0, filter: 'blur(0px)' },
    {
      y: -12,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.6,
      onComplete: () => {
        current.style.transform = 'translateY(100%)';
      },
    },
    '-=0.4'
  )
    .to(
      next,
      {
        y: 0,
        duration: 0.6,
      },
      '-=0.4'
    )
    .fromTo(
      hidden,
      { y: currentHeight + nextHeight, opacity: 0, filter: 'blur(12px)' },
      { y: nextHeight + 24, opacity: 1, duration: 0.6, filter: 'blur(0px)' },
      '-=0.4'
    );
}

export const setupInitialState = () => {
  const first = messages[0];
  const second = messages[1];

  const firstHeight = getMessageHeight(first);
  const secondHeight = getMessageHeight(second);

  gsap.set(first, { y: 0, opacity: 1 });
  gsap.set(second, { y: firstHeight + 24, opacity: 1 });

  container.style.height = `${firstHeight + secondHeight + 24}px`;
};
