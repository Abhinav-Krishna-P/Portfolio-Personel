document.getElementById('year').textContent = new Date().getFullYear();

// Wordmark Typewriter Animation
document.addEventListener("DOMContentLoaded", () => {
  const wordmarkText = document.querySelector(".wordmark-text");
  if (wordmarkText) {
    const fullText = "Abhinav Krishna P.";
    wordmarkText.textContent = "";
    let index = 0;
    function typeNextChar() {
      if (index < fullText.length) {
        wordmarkText.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeNextChar, 80 + Math.random() * 40);
      }
    }
    setTimeout(typeNextChar, 300);
  }

  // ═══════════════════════════════════════════════
  //  SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════════════
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // Windows/first-paint fallback: reveal hero items already in view
    requestAnimationFrame(() => {
      revealEls.forEach(el => {
        if (el.classList.contains('revealed')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          el.classList.add('revealed');
          revealObserver.unobserve(el);
        }
      });
    });
  }

  // ═══════════════════════════════════════════════
  //  ANIMATED COUNTERS
  // ═══════════════════════════════════════════════
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    // Reserve final-width space so counting from 0 does not collapse rows
    counterEls.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.decimal === 'true';
      const suffix = el.dataset.suffix ?? (target >= 100 ? '+' : '');
      const finalText = isDecimal
        ? target.toFixed(1)
        : target.toLocaleString() + suffix;
      el.style.minWidth = '0';
      el.textContent = finalText;
      const width = el.getBoundingClientRect().width;
      if (width > 0) {
        el.style.minWidth = Math.ceil(width) + 'px';
      }
      el.textContent = isDecimal ? '0.0' : '0';
    });

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });

    counterEls.forEach(el => counterObserver.observe(el));

    // Start hero counters immediately if already visible on load
    requestAnimationFrame(() => {
      counterEls.forEach(el => {
        if (el.dataset.counted === 'true') return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      });
    });
  }

  function animateCounter(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const startTime = performance.now();
    const suffix = el.dataset.suffix ?? (target >= 100 ? '+' : '');

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Set final value exactly
        if (isDecimal) {
          el.textContent = target.toFixed(1);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
    }

    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════════════════
  //  STICKY HEADER + SCROLL PROGRESS
  // ═══════════════════════════════════════════════
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress');

  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Toggle scrolled class
          header.classList.toggle('scrolled', scrollY > 60);

          // Update progress bar
          if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════
  //  PARTICLE CANVAS (Hero background)
  // ═══════════════════════════════════════════════
  const canvas = document.querySelector('.hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 120;
    const lime = { r: 185, g: 217, b: 130 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `rgba(${lime.r}, ${lime.g}, ${lime.b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = `rgba(${lime.r}, ${lime.g}, ${lime.b}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    // Stop animation when hero is not visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!animId) drawParticles();
          } else {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }
  }

  // ═══════════════════════════════════════════════
  //  3D TILT EFFECT
  // ═══════════════════════════════════════════════
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (tiltCards.length && window.matchMedia('(hover: hover)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  // ═══════════════════════════════════════════════
  //  MAGNETIC SOCIAL ICONS
  // ═══════════════════════════════════════════════
  const socialLinks = document.querySelectorAll('.hero-social a');
  if (socialLinks.length && window.matchMedia('(hover: hover)').matches) {
    socialLinks.forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // ═══════════════════════════════════════════════
  //  WORK SECTION: vertical side nav with sliding indicator
  //  (falls back to a horizontal pill row on narrow screens)
  // ═══════════════════════════════════════════════
  const workNav = document.querySelector('.work-nav');
  if (workNav) {
    const tabs = Array.from(workNav.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('.work-stage [role="tabpanel"]'));
    const indicator = workNav.querySelector('.work-nav-indicator');

    function currentTab() {
      return tabs.find(t => t.classList.contains('is-active')) || tabs[0];
    }

    const isVertical = () => getComputedStyle(workNav).flexDirection === 'column';

    function moveIndicator(tab) {
      if (!indicator || !tab) return;
      if (isVertical()) {
        indicator.style.width = '';
        indicator.style.height = tab.offsetHeight + 'px';
        indicator.style.transform = `translateY(${tab.offsetTop}px)`;
      } else {
        indicator.style.height = '';
        indicator.style.width = tab.offsetWidth + 'px';
        indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
      }
    }

    function activateTab(nextTab, { focus = true } = {}) {
      tabs.forEach(tab => {
        const selected = tab === nextTab;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });

      panels.forEach(panel => {
        const match = panel.id === nextTab.getAttribute('aria-controls');
        panel.classList.toggle('is-active', match);
        if (match) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      if (!isVertical()) {
        workNav.scrollTo({ left: nextTab.offsetLeft - (workNav.clientWidth - nextTab.offsetWidth) / 2, behavior: 'smooth' });
      }
      moveIndicator(nextTab);
      if (focus) nextTab.focus({ preventScroll: true });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab, { focus: false }));

      tab.addEventListener('keydown', (e) => {
        const next = (index + 1) % tabs.length;
        const prev = (index - 1 + tabs.length) % tabs.length;
        const keyMap = {
          ArrowDown: next,
          ArrowRight: next,
          ArrowUp: prev,
          ArrowLeft: prev,
          Home: 0,
          End: tabs.length - 1
        };
        if (!(e.key in keyMap)) return;
        e.preventDefault();
        activateTab(tabs[keyMap[e.key]]);
      });
    });

    // Position the indicator once layout and fonts are settled
    const settle = () => {
      moveIndicator(currentTab());
      workNav.classList.add('is-ready');
    };
    requestAnimationFrame(settle);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
    window.addEventListener('resize', () => moveIndicator(currentTab()), { passive: true });
  }

  // ═══════════════════════════════════════════════
  //  PROJECT DETAILS MODAL
  // ═══════════════════════════════════════════════
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    const dialog = projectModal.querySelector('.project-modal-dialog');
    const content = projectModal.querySelector('.project-modal-content');
    let lastTrigger = null;

    function openProjectModal(card) {
      const item = card.closest('.project-item');
      const template = item && item.querySelector('template.project-modal-data');
      if (!template || !content || !dialog) return;

      content.replaceChildren(template.content.cloneNode(true));
      const heading = content.querySelector('h3');
      if (heading) heading.id = 'project-modal-title';

      content.querySelectorAll('[data-count]').forEach(el => {
        delete el.dataset.counted;
        el.textContent = el.dataset.decimal === 'true' ? '0.0' : '0';
        animateCounter(el);
      });

      lastTrigger = card;
      projectModal.hidden = false;
      projectModal.classList.add('is-open');
      document.body.classList.add('modal-open');
      dialog.focus({ preventScroll: true });
    }

    function closeProjectModal() {
      projectModal.hidden = true;
      projectModal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      if (content) content.replaceChildren();
      if (lastTrigger) {
        lastTrigger.focus({ preventScroll: true });
        lastTrigger = null;
      }
    }

    document.querySelector('.work-stage')?.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) openProjectModal(card);
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) closeProjectModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
        closeProjectModal();
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  LIVE CODING PROFILES (LeetCode + GitHub)
  //  HTML holds fallback values; these fetches overwrite them.
  // ═══════════════════════════════════════════════
  const GITHUB_USER = 'Abhinav-Krishna-P';
  const LEETCODE_USER = 'YWcKXilXgU';
  // Weeks that fit the graph's width; cell size and gap come from .activity-graph in styles.css
  function graphWeeks(container) {
    const style = getComputedStyle(container);
    const step = (parseFloat(style.gridAutoColumns) || 11) + (parseFloat(style.columnGap) || 3);
    return Math.min(53, Math.max(8, Math.floor((container.clientWidth + 3) / step)));
  }
  const CACHE_TTL = 30 * 60 * 1000;

  function readCache(key) {
    try {
      const hit = JSON.parse(localStorage.getItem(key));
      return hit && Date.now() - hit.at < CACHE_TTL ? hit.data : null;
    } catch { return null; }
  }

  function writeCache(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch { /* storage unavailable */ }
  }

  async function fetchJSON(url, timeout = 12000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // Try each source in order until one answers
  async function firstOk(urls, timeout) {
    for (const url of urls) {
      try { return await fetchJSON(url, timeout); } catch { /* try next source */ }
    }
    throw new Error('All sources failed');
  }

  function setField(card, attr, key, value) {
    card.querySelectorAll(`[data-${attr}="${key}"]`).forEach(el => { el.textContent = value; });
  }

  function setLiveState(card, state) {
    const badge = card.querySelector('[data-live-state]');
    if (!badge) return;
    badge.dataset.liveState = state;
    badge.textContent = { loading: 'Loading', live: 'Live', cached: 'Offline' }[state];
  }

  const isoDay = d => d.toISOString().slice(0, 10);

  // Builds a weeks x 7 grid ending today, as many weeks as fit the card;
  // levelFor(dateString) returns 0-4
  function renderGraph(container, levelFor, titleFor) {
    if (!container) return;
    container._render = () => renderGraph(container, levelFor, titleFor);
    const weeks = graphWeeks(container);
    container.dataset.weeks = weeks;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay() - (weeks - 1) * 7);
    const cells = [];
    for (const d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
      const day = isoDay(d);
      const cell = document.createElement('i');
      cell.dataset.level = levelFor(day);
      cell.title = titleFor(day);
      cells.push(cell);
    }
    container.replaceChildren(...cells);
  }

  function countToLevel(count, max) {
    if (!count) return 0;
    return Math.min(4, Math.ceil((count / Math.max(max, 1)) * 4));
  }

  function maxStreak(days) {
    const sorted = [...days].sort();
    let best = 0, run = 0, prev = null;
    for (const day of sorted) {
      run = prev && (Date.parse(day) - Date.parse(prev)) === 86400000 ? run + 1 : 1;
      best = Math.max(best, run);
      prev = day;
    }
    return best;
  }

  async function loadLeetCode() {
    const card = document.getElementById('leetcode-card');
    if (!card) return;
    const cacheKey = 'live:leetcode';
    let data = readCache(cacheKey);
    setLiveState(card, 'loading');
    if (!data) {
      try {
        data = await firstOk([
          `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USER}`,
          `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USER}`
        ], 15000);
        writeCache(cacheKey, data);
      } catch {
        setLiveState(card, 'cached');
        return;
      }
    }

    const solved = data.totalSolved || 0;
    setField(card, 'lc', 'solved', solved.toLocaleString());
    setField(card, 'lc', 'easy', data.easySolved);
    setField(card, 'lc', 'medium', data.mediumSolved);
    setField(card, 'lc', 'hard', data.hardSolved);
    if (data.ranking) setField(card, 'lc', 'ranking', Number(data.ranking).toLocaleString());

    const ring = card.querySelector('.solve-ring');
    if (ring && solved) {
      ring.style.setProperty('--easy', (data.easySolved / solved) * 100);
      ring.style.setProperty('--medium', (data.mediumSolved / solved) * 100);
    }

    // submissionCalendar maps unix seconds (UTC midnight) to submission counts
    const calendar = typeof data.submissionCalendar === 'string'
      ? JSON.parse(data.submissionCalendar)
      : data.submissionCalendar || {};
    const byDay = {};
    Object.entries(calendar).forEach(([ts, count]) => {
      byDay[isoDay(new Date(Number(ts) * 1000))] = count;
    });
    const total = Object.values(byDay).reduce((sum, n) => sum + n, 0);
    const peak = Math.max(0, ...Object.values(byDay));
    setField(card, 'lc', 'submissions', total.toLocaleString());
    setField(card, 'lc', 'streak', maxStreak(Object.keys(byDay)));
    renderGraph(
      card.querySelector('[data-graph="leetcode"]'),
      day => countToLevel(byDay[day], peak),
      day => `${byDay[day] || 0} submissions on ${day}`
    );
    setLiveState(card, 'live');
  }

  async function loadGitHub() {
    const card = document.getElementById('github-card');
    if (!card) return;
    const cacheKey = 'live:github';
    let data = readCache(cacheKey);
    setLiveState(card, 'loading');
    if (!data) {
      const [user, repos, contributions] = await Promise.allSettled([
        fetchJSON(`https://api.github.com/users/${GITHUB_USER}`),
        fetchJSON(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`),
        fetchJSON(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      ]);
      if (user.status === 'rejected' && contributions.status === 'rejected') {
        setLiveState(card, 'cached');
        return;
      }
      data = {
        user: user.value || null,
        repos: (repos.value || []).map(r => ({ name: r.name, stars: r.stargazers_count, fork: r.fork })),
        contributions: contributions.value || null
      };
      writeCache(cacheKey, data);
    }

    if (data.user) {
      setField(card, 'gh', 'repos', data.user.public_repos);
      setField(card, 'gh', 'followers', data.user.followers);
    }
    if (data.repos.length) {
      setField(card, 'gh', 'stars', data.repos.reduce((sum, r) => sum + r.stars, 0));
      const latest = data.repos.find(r => !r.fork && r.name !== GITHUB_USER);
      if (latest) setField(card, 'gh', 'latest', latest.name);
    }
    if (data.contributions) {
      setField(card, 'gh', 'contributions', data.contributions.total.lastYear.toLocaleString());
      const byDay = {};
      data.contributions.contributions.forEach(c => { byDay[c.date] = c; });
      renderGraph(
        card.querySelector('[data-graph="github"]'),
        day => (byDay[day] ? byDay[day].level : 0),
        day => `${byDay[day] ? byDay[day].count : 0} contributions on ${day}`
      );
    }
    setLiveState(card, 'live');
  }

  // Empty grids first so the cards keep their size while data loads
  document.querySelectorAll('.activity-graph').forEach(graph => renderGraph(graph, () => 0, day => day));
  loadLeetCode();
  loadGitHub();

  window.addEventListener('resize', () => {
    document.querySelectorAll('.activity-graph').forEach(graph => {
      if (graph._render && String(graphWeeks(graph)) !== graph.dataset.weeks) graph._render();
    });
  }, { passive: true });

  // ═══════════════════════════════════════════════
  //  SMOOTH SCROLL for nav anchors
  // ═══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
