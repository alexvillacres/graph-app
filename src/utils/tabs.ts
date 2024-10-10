export interface TabsConfig {
  tabsSelector: string;
  contentsSelector: string;
  autoplayDuration?: number;
  rootMargin?: string;
}

export const initializeTabs = ({
  tabsSelector,
  contentsSelector,
  autoplayDuration = 5,
  rootMargin = '0px',
}: TabsConfig) => {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>(tabsSelector));
  const contents = Array.from(document.querySelectorAll<HTMLElement>(contentsSelector));
  const tabbedSection = document.querySelector('.tab_wrap');
  let activeTab: HTMLElement | null = null;
  let autoplayTimeout: gsap.core.Tween | null = null;
  let isInView = false;

  const switchTab = (newTab: HTMLElement): void => {
    if (newTab === activeTab) return; // Avoid switching to the same tab

    if (activeTab) {
      stopProgressBar(activeTab);
      activeTab.setAttribute('aria-selected', 'false');
      activeTab.setAttribute('tabindex', '-1'); // Make inactive tab unfocusable
      activeTab.classList.remove('active');
    }

    const newIndex = tabs.indexOf(newTab);
    console.log(tabs, newIndex);

    contents.forEach((content, index) => {
      content.classList.toggle('active', index === newIndex);
      content.setAttribute('aria-hidden', index !== newIndex ? 'true' : 'false');
    });

    newTab.setAttribute('aria-selected', 'true');
    newTab.setAttribute('tabindex', '0'); // Make the new active tab focusable
    newTab.classList.add('active');
    activeTab = newTab;

    resetProgressBar();
    if (isInView) {
      autoplayTabs();
    }
  };

  const animateProgressBar = (tab: HTMLElement): void => {
    const progressBar = tab.querySelector<HTMLElement>('.tab_progress');
    if (progressBar) {
      gsap.killTweensOf(progressBar);
      gsap.fromTo(
        progressBar,
        { width: '0%' },
        { width: '100%', duration: autoplayDuration, ease: 'linear' }
      );
    }
  };

  const stopProgressBar = (tab: HTMLElement): void => {
    const progressBar = tab.querySelector<HTMLElement>('.tab_progress');
    if (progressBar) {
      gsap.killTweensOf(progressBar);
      gsap.set(progressBar, { width: '0%' });
    }
  };

  const resetProgressBar = (): void => {
    if (activeTab) {
      const progressBar = activeTab.querySelector<HTMLElement>('.tab_progress');
      if (progressBar) {
        gsap.set(progressBar, { width: '0%' });
      }
    }

    if (autoplayTimeout) {
      autoplayTimeout.kill();
      autoplayTimeout = null;
    }
  };

  const autoplayTabs = (): void => {
    if (activeTab) {
      animateProgressBar(activeTab);
    }

    autoplayTimeout = gsap.delayedCall(autoplayDuration, () => {
      const currentIndex = tabs.indexOf(activeTab!);
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      switchTab(nextTab);
    });
  };

  const handleVisibilityChange = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    isInView = entry.isIntersecting;

    if (isInView) {
      autoplayTabs(); // Start autoplay when in view
    } else {
      resetProgressBar(); // Pause autoplay when out of view
    }
  };

  // Set up the IntersectionObserver to watch the tabbed section
  const observer = new IntersectionObserver(handleVisibilityChange, {
    root: null, // Use the viewport as the root
    rootMargin, // Adjust when to start based on viewport offset
    threshold: 0.1, // Trigger when 10% of the tab section is visible
  });

  if (tabbedSection) {
    observer.observe(tabbedSection);
  }

  // Keyboard navigation for tabs
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      resetProgressBar();
      switchTab(tab);
    });
  });

  // Set initial ARIA attributes and tabindex
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
    tab.setAttribute('aria-controls', contents[index].id);

    contents[index].setAttribute('role', 'tabpanel');
    contents[index].setAttribute('aria-labelledby', tab.id);
    contents[index].setAttribute('aria-hidden', 'true');
  });

  // Initialize with the first tab
  if (tabs[0]) {
    tabs[0].setAttribute('aria-selected', 'true');
    tabs[0].setAttribute('tabindex', '0');
    switchTab(tabs[0]);
  }
};
