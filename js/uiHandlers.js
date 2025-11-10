const downArrow = document.getElementById('down-arrow');
const aboutSection = document.getElementById('section-about');
const teamSection = document.getElementById('section-team');
const socialsSection = document.getElementById('section-socials');

function smoothScroll(top) {
    window.scrollTo({ top, left: 0, behavior: 'smooth' });
}

downArrow?.addEventListener('click', () => smoothScroll(850));
aboutSection?.addEventListener('click', () => smoothScroll(850));
teamSection?.addEventListener('click', () => smoothScroll(1450));
socialsSection?.addEventListener('click', () => smoothScroll(2150));
