import gsap from 'gsap';

interface AccordionState {
  currentIndex: number;
  isAutoPlaying: boolean;
  isInView: boolean;
}

interface AccordionConfig {
  headerSelector: string;
  textSelector: string;
  imgSelector: string;
  progressBarSelector: string;
  autoplayDuration: number;
  rootMargin: string;
}

interface AccordionElements {
  headers: HTMLElement[];
  texts: HTMLElement[];
  imgs: HTMLElement[];
  progressBars: HTMLElement[];
}

let state: AccordionState;
let config: AccordionConfig;
let elements: AccordionElements;
let autoplayTimeout: gsap.core.Tween | null = null;
let observer: IntersectionObserver | null = null;

export const initializeAccordion = (initialConfig: AccordionConfig) => {
  config = initialConfig;
  state = {
    currentIndex: 0,
    isAutoPlaying: true,
    isInView: false,
  };
  elements = getElements();

  setupEventListeners();
  setupIntersectionObserver();
  switchAccordion(0);
  startAutoplay();
};

const getElements = (): AccordionElements => ({
  headers: Array.from(document.querySelectorAll(config.headerSelector)),
  texts: Array.from(document.querySelectorAll(config.textSelector)),
  imgs: Array.from(document.querySelectorAll(config.imgSelector)),
  progressBars: Array.from(document.querySelectorAll(config.progressBarSelector)),
});

const setupEventListeners = () => {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  elements.headers.forEach((header, index) => {
    if (isMobile) {
      // For mobile devices, use touch events
      header.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault(); // Prevent default touch behavior
          handleHeaderClick(index);
        },
        { passive: false }
      );
    } else {
      // For desktop, keep using click events
      header.addEventListener('click', () => handleHeaderClick(index));
    }
  });

  // This event listener works for both mobile and desktop
  document.addEventListener('accordionSwitch', (e: Event) =>
    handleAccordionSwitch((e as CustomEvent).detail.index)
  );
};

const setupIntersectionObserver = () => {
  observer = new IntersectionObserver((entries) => handleIntersection(entries), {
    rootMargin: config.rootMargin,
    threshold: 0.1,
  });
  const accordionSection = document.querySelector('.accordion_list');
  if (accordionSection) observer.observe(accordionSection);
};

const handleHeaderClick = (index: number) => {
  switchAccordion(index);
  resetAutoplay();
};

const handleAccordionSwitch = (index: number) => {
  state.currentIndex = index;
  updateActiveClasses();
  animateElements();
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const [entry] = entries;
  state.isInView = entry.isIntersecting;
  if (state.isInView) {
    switchAccordion(0);
    startAutoplay();
  }
};

const switchAccordion = (index: number) => {
  const event = new CustomEvent('accordionSwitch', { detail: { index } });
  document.dispatchEvent(event);
};

const updateActiveClasses = () => {
  const { currentIndex } = state;
  elements.headers.forEach((header, i) => header.classList.toggle('active', i === currentIndex));
  elements.texts.forEach((text, i) => text.classList.toggle('active', i === currentIndex));
  elements.imgs.forEach((img, i) => img.classList.toggle('active', i === currentIndex));
  elements.progressBars.forEach((bar, i) => bar.classList.toggle('active', i === currentIndex));
};

const animateElements = () => {
  const { currentIndex } = state;
  gsap.killTweensOf(elements.progressBars);
  gsap.set(elements.progressBars, { width: '0%' });
  const tl = gsap.timeline();

  tl.add(animateText(elements.texts[currentIndex]))
    .add(animateProgressBar(elements.progressBars[currentIndex]))
    .add(animateImage(elements.imgs[currentIndex])); // Remove the function call here
};

const animateText = (element: HTMLElement) => {
  return gsap.fromTo(
    element,
    { height: 0, opacity: 0 },
    { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' }
  );
};

const animateImage = (element: HTMLElement) => {
  gsap.set(element.children, { clearProps: 'all' });

  const timeline = gsap.timeline();

  // Fade in the main element immediately
  timeline.to(element, { opacity: 1, duration: 0.3, ease: 'power2.out' });

  return timeline;
};

const animateProgressBar = (element: HTMLElement) => {
  return gsap.fromTo(
    element,
    { width: '0%' },
    { width: '100%', duration: config.autoplayDuration, ease: 'linear' }
  );
};

const startAutoplay = () => {
  if (autoplayTimeout) autoplayTimeout.kill();
  autoplayTimeout = gsap.delayedCall(config.autoplayDuration, () => {
    if (state.isInView && state.isAutoPlaying) {
      const nextIndex = (state.currentIndex + 1) % elements.headers.length;
      switchAccordion(nextIndex);
    }
    startAutoplay();
  });
};

const resetAutoplay = () => {
  if (autoplayTimeout) autoplayTimeout.kill();
  startAutoplay();
};
