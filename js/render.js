import { camera } from './camera.js';  // <-- use the same camera

export let width = window.innerWidth;
export let height = window.innerHeight;

const canvas = document.getElementById('bg-grid');
export const ctx = canvas.getContext('2d');

canvas.width = width;
canvas.height = height;

const spacing = 20;
const cols = Math.ceil(width / spacing) + 10;
const rows = Math.ceil(height / spacing) + 0;

let offset = 0;

export const waveHeights = Array.from({ length: cols * 2 }, () => Math.random() * 30 + 10);
const phaseY = Array.from({ length: rows }, () => Math.random() * Math.PI * 2);

const starColor = { r: 125, g: 255, b: 255 };
const numStars = 300;
const stars = Array.from({ length: numStars }, () => ({
    x: (Math.random() - 0.5) * cols * spacing * 2,
    y: (Math.random() - 0.5) * rows * spacing * 6,
    z: Math.random() * rows * spacing * 2,
    glowRadius: Math.random() * 2 + 2
}));

export let cam = { x: 0, y: -250, z: 400, rot: 0 };

export function project(x, y, z) {
    const cosR = Math.cos(camera.rot);
    const sinR = Math.sin(camera.rot);
    const yRot = y * cosR - z * sinR;
    const zRot = y * sinR + z * cosR;

    const scale = 500 / (zRot - camera.z + 500);
    const px = (x - camera.x) * scale + width / 2;
    const py = (yRot - camera.y) * scale + height / 2;
    return [px, py, zRot];
}

function lerpColor(a, b, t) {
    const ar = (a >> 16) & 0xff,
          ag = (a >> 8) & 0xff,
          ab = a & 0xff;
    const br = (b >> 16) & 0xff,
          bg = (b >> 8) & 0xff,
          bb = b & 0xff;
    const rr = Math.round(ar + t * (br - ar));
    const rg = Math.round(ag + t * (bg - ag));
    const rb = Math.round(ab + t * (bb - ab));
    return `rgb(${rr},${rg},${rb})`;
}

function getWaveHeight(x, y, waveAmp) {
    return (
        Math.sin(x * 0.3 + offset + phaseY[y]) * waveAmp +
        Math.sin(y * 0.2 + offset + phaseY[y]) * waveAmp * 0.5 +
        Math.sin((x + y) * 0.15 + offset * 0.8) * waveAmp * 0.3 +
        Math.sin((x - y) * 0.25 + offset * 1.2) * waveAmp * 0.2
    );
}

function drawStars() {
    for (const star of stars) {
        star.z -= 0.2;
        if (star.z < 0) star.z += rows * spacing * 2;

        const [px, py, zRot] = project(star.x, star.y, star.z);
        if (px < 0 || px > width || py < 0 || py > height) continue;

        const brightness = 1 - Math.min(star.z / (rows * spacing * 2), 1);
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, star.glowRadius);
        gradient.addColorStop(0, `rgba(${starColor.r},${starColor.g},${starColor.b},${brightness})`);
        gradient.addColorStop(0.5, `rgba(${starColor.r},${starColor.g},${starColor.b},${brightness * 0.2})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, star.glowRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    drawStars();

    for (let y = 0; y < rows; y++) {
        ctx.beginPath();
        for (let x = -cols; x < cols; x++) {
            const xpos = x * spacing;
            const ypos = 0;
            const waveAmp = waveHeights[x + cols];
            const zpos = y * spacing + getWaveHeight(x, y, waveAmp);
            const [px, py] = project(xpos, ypos, zpos);
            if (x === -cols) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        const zFar = y * spacing;
        const fog = 1 - Math.min(zFar / (rows * spacing), 1);
        ctx.strokeStyle = lerpColor(0x000033, 0x00ffff, fog);
        ctx.stroke();
    }

    for (let x = -cols; x < cols; x++) {
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
            const xpos = x * spacing;
            const ypos = 0;
            const waveAmp = waveHeights[x + cols];
            const zpos = y * spacing + getWaveHeight(x, y, waveAmp);
            const [px, py] = project(xpos, ypos, zpos);
            if (y === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        const zFar = rows * spacing;
        const fog = 1 - Math.min(zFar / (rows * spacing), 1);
        ctx.strokeStyle = lerpColor(0x000033, 0x00ffff, fog);
        ctx.stroke();
    }

    offset += 0.05;
    requestAnimationFrame(drawGrid);
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
