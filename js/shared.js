/* ============================================
   IIT Delhi Academic Pulse — Shared JavaScript
   ============================================ */

// ---- Toast Notification System ----
const Toast = {
  container: null,
  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  show(message, type = 'info', duration = 4000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">${icons[type] || 'info'}</span><span>${message}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }
};

// ---- Page Transition ----
function navigateTo(url) {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition active';
  for (let i = 0; i < 4; i++) { const bar = document.createElement('div'); bar.className = 'bar'; overlay.appendChild(bar); }
  document.body.appendChild(overlay);
  setTimeout(() => { window.location.href = url; }, 400);
}

// ---- Session Management ----
const Session = {
  set(key, value) { localStorage.setItem(`pulse_${key}`, JSON.stringify(value)); },
  get(key) { try { return JSON.parse(localStorage.getItem(`pulse_${key}`)); } catch { return null; } },
  remove(key) { localStorage.removeItem(`pulse_${key}`); },
  isLoggedIn() { return !!this.get('session'); },
  getUser() { return this.get('session'); },
  login(userData) { this.set('session', { ...userData, loginTime: Date.now() }); },
  logout() { this.remove('session'); }
};

// ---- Floating Particles ----
function initParticles(canvasId = 'particles-canvas', color = 'rgba(87,0,0,0.06)') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  // Parse the base color into r,g,b components
  const rgbMatch = color.match(/[\d.]+/g);
  const baseR = rgbMatch ? parseInt(rgbMatch[0]) : 87;
  const baseG = rgbMatch ? parseInt(rgbMatch[1]) : 0;
  const baseB = rgbMatch ? parseInt(rgbMatch[2]) : 0;

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseR},${baseG},${baseB},${p.opacity})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${baseR},${baseG},${baseB},${0.03 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Intersection Observer for Scroll Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ---- Mobile Sidebar Toggle ----
function initMobileSidebar() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.side-nav');
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/30 z-30 hidden';
  overlay.id = 'sidebar-overlay';
  document.body.appendChild(overlay);

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('hidden');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.add('hidden');
    });
  }
}

// ---- Format Time ----
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ---- Relative Time ----
function relativeTime(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ---- Init on DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initMobileSidebar();

  // Inject Global Interactive Particles (Moving Dots) on inner pages
  if (!window.location.pathname.includes('login.html')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'global-particles';
    canvas.className = 'fixed inset-0 pointer-events-none z-[-1] opacity-0 transition-opacity duration-1000';
    document.body.prepend(canvas);
    
    // Light mode inner pages get a dark red (primary color #570000) low-opacity particle
    initParticles('global-particles', 'rgba(87, 0, 0, 0.05)');
    
    // Fade in gracefully
    setTimeout(() => canvas.classList.remove('opacity-0'), 300);
  }
});
