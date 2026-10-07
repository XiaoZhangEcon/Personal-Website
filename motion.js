(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.reading-progress');
  const visual = document.querySelector('.hero-visual:not(.portrait-visual) img');
  let ticking = false;
  const update = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
    if (visual && !reduced.matches && window.innerWidth > 680 && window.scrollY < 1000) {
      visual.style.transform = `scale(1.045) translateY(${Math.min(28, window.scrollY * 0.045)}px)`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {if (!ticking) {ticking = true; requestAnimationFrame(update);}}, {passive: true});
  window.addEventListener('resize', update, {passive: true});
  reduced.addEventListener('change', () => { if (visual) visual.style.transform = ''; update(); });
  update();
  const items = document.querySelectorAll('.section-header, .approach-card, .research-row, .timeline, .skill-row, .content-section, .contact-panel, .image-band-copy');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
    }, {threshold: 0.08});
    items.forEach((item, index) => {
      if (item.getBoundingClientRect().top < window.innerHeight) return;
      item.classList.add('reveal');
      if (item.classList.contains('approach-card')) item.style.setProperty('--delay', `${index % 3 * 80}ms`);
      observer.observe(item);
    });
    // Keyboard navigation must reveal any element before focus reaches its controls.
    document.addEventListener('focusin', event => {
      let target = event.target.closest('.reveal');
      while (target) { target.classList.add('is-visible'); target = target.parentElement?.closest('.reveal'); }
    });
  }
})();
