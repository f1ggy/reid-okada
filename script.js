'use strict';
const copyButton = document.getElementById('copy-email');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('hello@reidokada.com');
    copyButton.textContent = 'Address copied ✓';
    document.getElementById('copy-status').textContent = 'Email address copied.';
  } catch {
    copyButton.textContent = 'Select and copy the address above';
    document.getElementById('copy-status').textContent = 'Copy unavailable. Select the email address above to copy it.';
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.getElementById('motion-toggle');
let paused = reducedMotion.matches;
function setMotionPause(value) {
  paused = value;
  document.body.classList.toggle('motion-paused', paused);
  document.documentElement.classList.toggle('motion-off', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
  resetCard();
}
motionButton.addEventListener('click', () => setMotionPause(!paused));
reducedMotion.addEventListener('change', () => setMotionPause(reducedMotion.matches));

const card = document.querySelector('.business-card');
const cardStage = document.querySelector('.card-stage');
let cardFrame = 0;
function resetCard() {
  cancelAnimationFrame(cardFrame);
  card.style.removeProperty('--rx');
  card.style.removeProperty('--ry');
}
cardStage.addEventListener('pointermove', (event) => {
  if (paused || reducedMotion.matches || !finePointer.matches) return;
  const bounds = cardStage.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  cancelAnimationFrame(cardFrame);
  cardFrame = requestAnimationFrame(() => {
    card.style.setProperty('--rx', `${-y * 4}deg`);
    card.style.setProperty('--ry', `${x * 4}deg`);
  });
});
cardStage.addEventListener('pointerleave', resetCard);
setMotionPause(paused);

const methodContent = [
  { label: '01 / INTENT', title: 'Start with the decision.', output: 'A clear question and a defined decision.', text: 'Define what needs to be understood, who will use the analysis, and what a useful answer should make possible.' },
  { label: '02 / ANALYSIS', title: 'Make the information useful.', output: 'Structured inputs with explicit assumptions.', text: 'Organize inputs, make assumptions explicit, and use AI to support repeatable tasks. Review the output and keep financial judgment at the center.' },
  { label: '03 / IMPROVEMENT', title: 'Build a better way to work.', output: 'A documented, repeatable workflow.', text: 'Look for duplicated effort and unclear handoffs. Improve the workflow, document the logic, and refine the process as requirements change.' }
];
const tabs = [...document.querySelectorAll('.method-tabs [role="tab"]')];
const panel = document.getElementById('method-panel');
function selectMethod(index, focus = false) {
  tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  const content = methodContent[index];
  panel.setAttribute('aria-labelledby', tabs[index].id);
  panel.querySelector('.panel-number').textContent = content.label;
  panel.querySelector('h3').textContent = content.title;
  panel.querySelector('p').textContent = content.text;
  panel.querySelector('.method-deliverable strong').textContent = content.output;
  document.querySelectorAll('.map-node').forEach((node, position) => node.classList.toggle('is-active', position === index));
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectMethod(index));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectMethod(next, true); }
  });
});
selectMethod(0);

const header = document.querySelector('.nav');
const progress = document.querySelector('.reading-progress');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav nav a')];
let scrollFrame = 0;
function updateScroll() {
  const available = document.documentElement.scrollHeight - innerHeight;
  const amount = available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0;
  progress.style.transform = `scaleX(${amount})`;
  header.classList.toggle('is-scrolled', scrollY > 20);
  let current = '';
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 160) current = `#${section.id}`;
  }
  if (amount > .98) current = '#contact';
  for (const link of navLinks) {
    if (link.hash === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  scrollFrame = 0;
}
addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}, { passive: true });
addEventListener('resize', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveals = document.querySelectorAll('.hero-bottom, .section-top, .experience-intro, .resume-row, .project-details, .project-notes article, .contact h2, .contact-bottom');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  for (const element of reveals) { element.classList.add('reveal'); observer.observe(element); }
  document.documentElement.classList.add('reveal-ready');
}

// Mobile navigation remains a normal link list, with predictable focus and dismissal.
const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.getElementById('main-navigation');
function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  document.querySelector('.nav-shell').classList.remove('menu-open');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  document.querySelector('.nav-shell').classList.toggle('menu-open', open);
});
mainNavigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-shell')) closeMenu();
});
document.querySelector('.nav-shell').addEventListener('focusout', (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
});
matchMedia('(max-width: 760px)').addEventListener('change', () => closeMenu());

document.documentElement.classList.add('js-ready');
