import { camera } from './camera.js';

const logo = document.getElementById('phead-sub-cont');
const aboutInfo = document.getElementById('info-about');
const teamInfo = document.getElementById('info-team');
const socialsInfo = document.getElementById('info-socials');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    camera.y = -250 + scrollY;
    const logoOpacity = 2.6 - (scrollY * 0.01);
    const aboutOpacity = -4.0 + (scrollY * 0.01);
    const teamOpacity = -10.0 + (scrollY * 0.01);
    const socialsOpacity = -16.0 + (scrollY * 0.01);

    logo.style.opacity = Math.max(0, Math.min(1, logoOpacity));
    aboutInfo.style.opacity = Math.max(0, Math.min(1, aboutOpacity));
    teamInfo.style.opacity = Math.max(0, Math.min(1, teamOpacity));
    socialsInfo.style.opacity = Math.max(0, Math.min(1, socialsOpacity));
});
