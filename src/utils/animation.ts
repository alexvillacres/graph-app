import gsap from 'gsap';

const container = document.querySelector('.conversation_contain') as HTMLElement;
const messages = Array.from(container.querySelectorAll('.conversation_card')) as HTMLElement[];
const getMessageHeight = (message: HTMLElement): number => {
  return message.getBoundingClientRect().height;
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

export const animateCards = (rotationDelay: number = 4) => {
  const container = document.querySelector('.conversation_contain') as HTMLElement;
  const messages = Array.from(container.querySelectorAll('.conversation_card')) as HTMLElement[];
  let currentIndex = 0;

  const current = messages[currentIndex];
  const next = messages[(currentIndex + 1) % messages.length];
  const hidden = messages[(currentIndex + 2) % messages.length];
  const nextHeight = getMessageHeight(next);

  // Master timeline for Card animation
  const tl = gsap.timeline({
    // time in between conversation rotation
    delay: rotationDelay,
    ease: 'power3.out',
    onComplete: () => {
      currentIndex = (currentIndex + 1) % messages.length;
      container.appendChild(current);
      animateCards();
    },
  });

  // Top card animation
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
    // Middle card
    .to(
      next,
      {
        y: 0,
        duration: 0.6,
      },
      '-=0.4'
    )
    // Bottom card
    .fromTo(
      hidden,
      { y: nextHeight + 24, opacity: 0, filter: 'blur(5px)' },
      { y: nextHeight + 24, opacity: 1, duration: 0.6, filter: 'blur(0px)' },
      '-=0.2'
    );
};

export const setupInitialState = () => {
  const first = messages[0];
  const second = messages[1];
  const firstHeight = getMessageHeight(first);

  const tl = gsap.timeline();

  // Set initial state for the first message
  gsap.set(first, { opacity: 0, y: 24, filter: 'blur(5px)' });

  // Set initial state for the second message
  gsap.set(second, { opacity: 0, y: firstHeight + 48, filter: 'blur(5px)', force3D: true });

  // Set the container height to fit both messages
  container.style.height = `${firstHeight + 24}px`;

  // Animate the first message appearing
  tl.to(first, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    filter: 'blur(0px)',
    ease: 'power3.out',
  }).to(
    second,
    {
      opacity: 1,
      y: firstHeight + 24,
      duration: 0.8,
      filter: 'blur(0px)',
      ease: 'power3.out',
    },
    '+=1'
  );
};
