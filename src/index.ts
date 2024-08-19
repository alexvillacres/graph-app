import gsap from 'gsap';

import { animatePulse } from '$utils/animation';

window.Webflow ||= [];
window.Webflow.push(() => {
  const masterTimeline = gsap.timeline({
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

  masterTimeline.add(linearAnimation, 0);
  masterTimeline.add(githubAnimation, '-=2');
  masterTimeline.add(jiraAnimation, '-=2');
  masterTimeline.add(slackAnimation, '-=2');
});
