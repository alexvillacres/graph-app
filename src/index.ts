import gsap from 'gsap';

import { animateCards, animatePulse, setupInitialState } from '$utils/animation';
// import { initializeTabs } from '$utils/tabs';
import { initializeAccordion } from '$utils/timedAccordion';

window.Webflow ||= [];
window.Webflow.push(() => {
  window.addEventListener('load', setupInitialState);

  const conversationContainer = document.querySelector('.conversation_contain') as HTMLElement;
  const conversationDelay: number = parseInt(conversationContainer.dataset.delay as string);
  const accordionContainer = document.querySelector('.accordion_component') as HTMLElement;
  const accordionDelay: number = parseInt(accordionContainer.dataset.delay as string) || 7;

  initializeAccordion({
    headerSelector: '.accordion_header',
    textSelector: '.accordion_text',
    imgSelector: '.accordion_img',
    progressBarSelector: '.accordion_progress',
    autoplayDuration: accordionDelay,
    rootMargin: '0px',
  });

  const pulesTimeline = gsap.timeline({
    repeat: -1, // Repeat indefinitely
  });

  const linearAnimation = gsap.timeline();
  animatePulse(
    linearAnimation,
    '#linear-circle',
    ['#linear-stop1', '#linear-stop2', '#linear-stop3', '#linear-stop4'],
    ['-90%', '-50%', '-20%', '0%'],
    ['120%', '170%', '180%', '200%']
  );

  const githubAnimation = gsap.timeline();
  animatePulse(
    githubAnimation,
    '#github-circle',
    ['#github-stop1', '#github-stop2', '#github-stop3', '#github-stop4'],
    ['-100%', '-60%', '-40%', '0%'],
    ['110%', '150%', '180%', '200%']
  );

  const jiraAnimation = gsap.timeline();
  animatePulse(
    jiraAnimation,
    '#jira-circle',
    ['#jira-stop1', '#jira-stop2', '#jira-stop3', '#jira-stop4'],
    ['-100%', '-60%', '-40%', '0%'],
    ['110%', '150%', '180%', '200%']
  );

  const slackAnimation = gsap.timeline();
  animatePulse(
    slackAnimation,
    '#slack-circle',
    ['#slack-stop1', '#slack-stop2', '#slack-stop3', '#slack-stop4'],
    ['-100%', '-60%', '-40%', '0%'],
    ['110%', '150%', '180%', '200%']
  );

  window.addEventListener('load', () => animateCards(conversationDelay));

  pulesTimeline.add(linearAnimation, 0);
  pulesTimeline.add(githubAnimation, '-=1');
  pulesTimeline.add(jiraAnimation, '-=1');
  pulesTimeline.add(slackAnimation, '-=1');
});
