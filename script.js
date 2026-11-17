document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- theme toggle ---------- */
const root = document.documentElement;
const themeBtn = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* ---------- mobile nav ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- scroll progress ---------- */
const progress = document.querySelector('.progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + '%';
}, { passive: true });

/* ---------- back to top ---------- */
const toTop = document.querySelector('.to-top');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- hero canvas: quiet floating-grid backdrop ---------- */
(function heroCanvas() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, points;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.round((w * h) / 24000);
    points = Array.from({ length: Math.min(count, 60) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15
    }));
  }

  function accent() {
    return getComputedStyle(root).getPropertyValue('--accent').trim() || '#E3A33D';
  }

  function tick() {
    if (!w) { requestAnimationFrame(tick); return; }
    ctx.clearRect(0, 0, w, h);
    const c = accent();
    points.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = c;
          ctx.globalAlpha = (1 - dist / 130) * 0.25;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
})();

/* ---------- typed text ---------- */
(function typed() {
  const el = document.getElementById('typed');
  if (!el) return;
  const words = ['Minecraft mods.', 'small bytecode VMs.', 'scripting tools in Python.', 'systems in Rust.'];
  let w = 0, i = 0, deleting = false;

  function step() {
    const word = words[w];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 85;
    if (!deleting && i === word.length) { delay = 1400; deleting = true; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(step, delay);
  }
  step();
})();

/* ---------- reveal on scroll ---------- */
const revealItems = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 40);
      io.unobserve(entry.target);
      if (entry.target.querySelector('[data-count]')) animateStats(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(el => io.observe(el));

function animateStats(container) {
  container.querySelectorAll('[data-count]').forEach(dd => {
    const target = parseInt(dd.dataset.count, 10);
    const duration = 900;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      dd.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

/* ---------- skills data ---------- */
const skills = [
  { name: 'Java', desc: 'Mods, Mixin, Forge/Fabric', icon: '<path d="M8 3c-1 2-3 3-3 6s2 4 2 7c0 2 2 3 5 3s5-1 5-3c0-3 2-4 2-7s-2-4-3-6"/>' },
  { name: 'Python', desc: 'Scripting & tooling', icon: '<circle cx="9" cy="8" r="2.5"/><circle cx="15" cy="16" r="2.5"/><path d="M8 11v2a4 4 0 0 0 4 4M16 13v-2a4 4 0 0 0-4-4"/>' },
  { name: 'C', desc: 'Low-level & fast paths', icon: '<path d="M4 18V6l8-3 8 3v12l-8 3-8-3Z"/><path d="M12 3v18"/>' },
  { name: 'Rust', desc: 'Systems & safety', icon: '<circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/>' },
  { name: 'Modding', desc: 'Forge, Fabric, Mixin', icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16"/>' },
  { name: 'Git', desc: 'Version control', icon: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v4a4 4 0 0 0 4 4h4"/>' },
  { name: 'HTML5 & CSS3', desc: 'Markup & styling', icon: '<path d="M9 6l-5 6 5 6"/><path d="M15 6l5 6-5 6"/>' },
  { name: 'JavaScript', desc: 'Browser scripting', icon: '<path d="M8 4c-2 0-3 1.2-3 3.2v2.6c0 1.3-1 2.2-2 2.2 1 0 2 .9 2 2.2v2.6c0 2 1 3.2 3 3.2"/><path d="M16 4c2 0 3 1.2 3 3.2v2.6c0 1.3 1 2.2 2 2.2-1 0-2 .9-2 2.2v2.6c0 2-1 3.2-3 3.2"/>' }
];
const skillsGrid = document.getElementById('skills-grid');
skillsGrid.innerHTML = skills.map(s => `
  <div class="skill-card reveal">
    <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${s.icon}</svg>
    <h4>${s.name}</h4>
    <p>${s.desc}</p>
  </div>`).join('');
skillsGrid.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- projects data ---------- */
const projects = [
  {
    title: 'Oreforge', tag: 'java',
    desc: 'A Minecraft mod that replaces vanilla ore placement with procedurally generated veins and a longer tool-progression chain. Built with Mixin so it hooks into world-gen without forking vanilla code.',
    tags: ['Java', 'Mixin', 'Fabric API'],
    link: 'https://github.com/CodeCreed08',
    icon: '<path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>'
  },
  {
    title: 'pyNBT', tag: 'python',
    desc: "A lightweight Python library for reading and editing Minecraft's NBT and Anvil region file format, so world data can be scripted outside the game.",
    tags: ['Python', 'Binary parsing'],
    link: 'https://github.com/CodeCreed08',
    icon: '<path d="M4 7a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/>'
  },
  {
    title: 'rustyvm', tag: 'rust',
    desc: 'A stack-based virtual machine and bytecode interpreter in Rust, built to understand how JVM-style runtimes execute class files.',
    tags: ['Rust', 'Bytecode design'],
    link: 'https://github.com/CodeCreed08',
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>'
  },
  {
    title: 'Mess Card Management System', tag: 'web',
    desc: 'A real-world project built to ease the process of getting and renewing a mess card, with QR code generation and scanning to verify cards.',
    tags: ['HTML', 'CSS', 'JavaScript', 'QR Code'],
    link: 'https://github.com/CodeCreed08/fwd05',
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 7h.01M11 7h.01"/>'
  }
  
];

const filtersEl = document.getElementById('filters');
const projectsGrid = document.getElementById('projects-grid');
const tags = ['all', ...new Set(projects.map(p => p.tag))];

filtersEl.innerHTML = tags.map((t, i) =>
  `<button class="filter-btn${i === 0 ? ' active' : ''}" data-tag="${t}">${t === 'all' ? 'All' : t[0].toUpperCase() + t.slice(1)}</button>`
).join('');

projectsGrid.innerHTML = projects.map(p => `
  <div class="project-card reveal" data-tag="${p.tag}">
    <div class="project-glyph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${p.icon}</svg></div>
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
    <a class="project-link" href="${p.link}" target="_blank" rel="noopener">View on GitHub →</a>
  </div>`).join('');
projectsGrid.querySelectorAll('.reveal').forEach(el => io.observe(el));

filtersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const tag = btn.dataset.tag;
  projectsGrid.querySelectorAll('.project-card').forEach(card => {
    card.classList.toggle('hidden', tag !== 'all' && card.dataset.tag !== tag);
  });
});

/* ---------- contact form (mailto, no backend) ---------- */
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  ['name', 'email', 'subject', 'message'].forEach(id => {
    const input = document.getElementById(id);
    const field = input.closest('.field');
    const errorEl = field.querySelector('.error');
    let msg = '';
    if (!input.value.trim()) msg = 'This field is required.';
    else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = 'Enter a valid email address.';
    field.classList.toggle('invalid', !!msg);
    errorEl.textContent = msg;
    if (msg) valid = false;
  });
  if (!valid) return;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const body = `From: ${name} (${email})\n\n${message}`;
  window.location.href = `mailto:dakshmohan99@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast('Opening your email app…');
});

/* ---------- copy email ---------- */
document.getElementById('copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('dakshmohan99@gmail.com');
    showToast('Email copied to clipboard');
  } catch (e) {
    showToast('Could not copy — select the text manually');
  }
});

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
