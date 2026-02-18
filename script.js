/* ═══════════════════════════════════════════
   script.js — M. Alfiansah Portfolio
═══════════════════════════════════════════ */


/* ════════════════════════════════════════
   1. LOADER
════════════════════════════════════════ */
const loader    = document.getElementById('loader');
const loaderPct = document.getElementById('loader-pct');
let pct = 0;

const loaderInterval = setInterval(() => {
  pct = Math.min(pct + Math.random() * 12, 100);
  loaderPct.textContent = Math.floor(pct) + '%';

  if (pct >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => loader.classList.add('fade-out'), 400);
  }
}, 80);


/* ════════════════════════════════════════
   2. CUSTOM CURSOR
════════════════════════════════════════ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function updateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursor.style.left     = mx + 'px';
  cursor.style.top      = my + 'px';
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();

document.querySelectorAll('a, button, .projek-card, .slide-dot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width      = '20px';
    cursor.style.height     = '20px';
    cursorRing.style.width  = '56px';
    cursorRing.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width      = '12px';
    cursor.style.height     = '12px';
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
  });
});


/* ════════════════════════════════════════
   3. PARTICLES (Canvas)
════════════════════════════════════════ */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.r     = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,255' : '255,0,170';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ════════════════════════════════════════
   4. PHOTO SLIDESHOW
   ─ Ganti foto otomatis tiap 3 detik
   ─ Glitch flash saat transisi
   ─ Dots indikator bisa diklik
   ─ Untuk tambah foto: taruh file di assets/
     lalu tambahkan <img> baru di index.html
     dengan class="slide-img"
════════════════════════════════════════ */
(function initSlideshow() {
  const slider   = document.querySelector('.photo-slider');
  const slides   = Array.from(document.querySelectorAll('.slide-img'));
  const dotsWrap = document.getElementById('slideDots');

  if (!slider || slides.length < 2) return;

  let current  = 0;
  let autoPlay = null;
  const DURATION = 3000;

  /* Buat counter HUD */
  const counter = document.createElement('div');
  counter.className = 'slide-counter';
  slider.closest('.profile-frame').appendChild(counter);

  function updateCounter() {
    counter.textContent =
      `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  /* Buat dots */
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getDots() {
    return Array.from(dotsWrap.querySelectorAll('.slide-dot'));
  }

  /* Glitch flash */
  function triggerFlash() {
    slider.classList.add('flash');
    setTimeout(() => slider.classList.remove('flash'), 120);
  }

  /* Ganti slide */
  function goTo(next) {
    if (next === current) return;
    triggerFlash();

    slides[current].classList.remove('active');
    slides[current].classList.add('leaving');

    const prev = current;
    setTimeout(() => slides[prev].classList.remove('leaving'), 600);

    current = next;
    slides[current].classList.add('active');

    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
    updateCounter();
  }

  function nextSlide() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    stopAuto();
    autoPlay = setInterval(nextSlide, DURATION);
  }
  function stopAuto() {
    if (autoPlay) clearInterval(autoPlay);
  }

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  dotsWrap.addEventListener('click', () => { stopAuto(); startAuto(); });

  updateCounter();
  startAuto();
})();


/* ════════════════════════════════════════
   5. SCROLL REVEAL
════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animate');
      });
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


/* ════════════════════════════════════════
   6. SKILL BAR TRIGGER (backup)
════════════════════════════════════════ */
const profilSection = document.getElementById('profil');

const skillObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.classList.add('animate');
    });
  }
}, { threshold: 0.3 });

skillObserver.observe(profilSection);


/* ════════════════════════════════════════
   7. TYPEWRITER
════════════════════════════════════════ */
const taglines = [
  'Network Specialist',
  'Web Developer',
  'Problem Solver',
  'TKJ Graduate',
  'Arduino Enthusiast'
];

let tIdx = 0, cIdx = 0, typing = true;
const typeTarget = document.querySelector('.tagline strong');

if (typeTarget) {
  typeTarget.classList.add('typewriter');
  typeTarget.textContent = '';

  function typeLoop() {
    const word = taglines[tIdx];

    if (typing) {
      typeTarget.textContent = word.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx >= word.length) {
        typing = false;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      typeTarget.textContent = word.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        typing = true;
        tIdx = (tIdx + 1) % taglines.length;
      }
    }

    setTimeout(typeLoop, typing ? 90 : 45);
  }

  setTimeout(typeLoop, 2200);
}