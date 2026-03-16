// ===== TYPED TEXT =====
const roles = ['Full Stack Developer', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function type() {
  const target = document.getElementById('typed');
  if (!target) return;
  const current = roles[roleIndex];
  target.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length + 1) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(type, delay);
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== AOS (scroll reveal) =====
function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// ===== SKILL BARS =====
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('animated'));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-category').forEach(el => observer.observe(el));
}

// ===== ACTIVE NAV LINK =====
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  type();
  initAOS();
  initSkillBars();
  initActiveNav();
  initParticles();
  initTilt();
  initCounters();
  initScrollProgress();
  initBackToTop();
  initCursor();
});


// ===== PARTICLES =====
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles';
  canvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  document.querySelector('.hero').prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 60;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
      ctx.fill();
    });
    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== CARD TILT =====
function initTilt() {
  document.querySelectorAll('.project-card, .cert-card, .hackathon-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const target = parseInt(text);
      const suffix = text.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; width:0%; z-index:9999;
    background:linear-gradient(90deg,#6366f1,#ec4899);
    transition:width 0.1s linear; border-radius:0 2px 2px 0;
    box-shadow: 0 0 8px rgba(99,102,241,0.6);
  `;
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  });
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.style.cssText = `
    position:fixed; bottom:2rem; right:2rem; z-index:999;
    width:44px; height:44px; border-radius:50%; border:none; cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#ec4899);
    color:#fff; font-size:1rem;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 20px rgba(99,102,241,0.4);
    opacity:0; transform:translateY(20px);
    transition:all 0.3s ease; pointer-events:none;
  `;
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
    btn.style.pointerEvents = show ? 'all' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== CUSTOM CURSOR =====
function initCursor() {
  if (window.matchMedia('(pointer:coarse)').matches) return; // skip on touch
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.style.cssText = `
    position:fixed; width:8px; height:8px; border-radius:50%;
    background:#6366f1; pointer-events:none; z-index:99999;
    transform:translate(-50%,-50%); transition:transform 0.1s;
  `;
  ring.style.cssText = `
    position:fixed; width:32px; height:32px; border-radius:50%;
    border:1.5px solid rgba(99,102,241,0.5); pointer-events:none; z-index:99998;
    transform:translate(-50%,-50%); transition:all 0.15s ease;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '48px'; ring.style.height = '48px';
      ring.style.borderColor = 'rgba(236,72,153,0.6)';
      dot.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px'; ring.style.height = '32px';
      ring.style.borderColor = 'rgba(99,102,241,0.5)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

// ===== CERTIFICATE MODAL =====
function openCert(src, title) {
  const modal = document.getElementById('certModal');
  document.getElementById('certModalFrame').src = src;
  document.getElementById('certModalTitle').textContent = title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCert(e) {
  if (e && e.target !== document.getElementById('certModal')) return;
  const modal = document.getElementById('certModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('certModalFrame').src = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCert();
});
