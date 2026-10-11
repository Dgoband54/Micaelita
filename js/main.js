'use strict';

// Cada interacción tiene su propio alcance. La música usa una sola instancia.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#control-animacion');
  let motionPaused = reducedMotion.matches;
  let motionOverride = false;
  const motionAllowed = () => !motionPaused;

  function updateMotion() {
    root.classList.toggle('motion-paused', motionPaused);
    root.classList.toggle('motion-enabled', motionOverride && !motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionButton.textContent = motionPaused ? 'Animaciones: no' : 'Animaciones: sí';
    document.querySelector('#particulas').replaceChildren();
    scheduleFrame();
  }
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => {
    motionOverride = true;
    motionPaused = !motionPaused;
    updateMotion();
  });
  reducedMotion.addEventListener('change', () => {
    if (!motionOverride) {
      motionPaused = reducedMotion.matches;
      updateMotion();
    }
  });

  // Las fotos siguen visibles si no está disponible IntersectionObserver.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove('reveal-pending');
        target.classList.add('is-visible');
        revealObserver.unobserve(target);
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('[data-reveal], .flower-section').forEach((element) => {
      if (element.hasAttribute('data-reveal')) element.classList.add('reveal-pending');
      revealObserver.observe(element);
    });
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      const id = visible[visible.length - 1].target.id;
      document.querySelectorAll('.chapter-nav a').forEach((link) => {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section').forEach((section) => chapterObserver.observe(section));
  }

  // Un solo requestAnimationFrame por scroll. Las medidas son estables: offsetTop
  // no incluye las transformaciones, evitando acumulación o vibración del parallax.
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  const progress = document.querySelector('#progreso');
  let framePending = false;
  let layout = [];
  function measureLayout() {
    layout = parallaxItems.map((element) => {
      let top = 0;
      for (let parent = element; parent; parent = parent.offsetParent) top += parent.offsetTop;
      return { element, top, height: element.offsetHeight, speed: Number(element.dataset.parallax) };
    });
    scheduleFrame();
  }
  function updateScroll() {
    framePending = false;
    const scroll = window.scrollY;
    const viewport = window.innerHeight;
    const distance = root.scrollHeight - viewport;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, scroll / distance) : 0})`;
    layout.forEach(({ element, top, height, speed }) => {
      if (!motionAllowed()) {
        element.style.transform = '';
        return;
      }
      if (top + height < scroll - 150 || top > scroll + viewport + 150) return;
      const movement = Math.max(-65, Math.min(65, (scroll + viewport / 2 - top - height / 2) * speed));
      element.style.transform = `translate3d(0, ${movement.toFixed(2)}px, 0)`;
    });
  }
  function scheduleFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', scheduleFrame, { passive: true });
  window.addEventListener('resize', measureLayout, { passive: true });
  window.addEventListener('load', measureLayout);
  if ('ResizeObserver' in window) new ResizeObserver(measureLayout).observe(document.body);
  measureLayout();
  updateMotion();

  // Partículas efímeras, limitadas incluso si se toca muchas veces.
  const particles = document.querySelector('#particulas');
  function celebrate(x, y, count = 16) {
    if (!motionAllowed()) return;
    particles.replaceChildren();
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'love-particle';
      if (index % 3 === 0) particle.classList.add('love-particle--star');
      particle.textContent = index % 3 === 0 ? '✧' : '♡';
      const angle = Math.PI * 2 * index / count;
      const distance = 80 + Math.random() * 150;
      const styles = {
        '--x': `${x}px`, '--y': `${y}px`, '--size': `${14 + Math.random() * 18}px`,
        '--dx': `${Math.cos(angle) * distance}px`, '--dy': `${Math.sin(angle) * distance - 70}px`,
        '--rotation': `${Math.random() * 80 - 40}deg`
      };
      Object.entries(styles).forEach(([name, value]) => particle.style.setProperty(name, value));
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
      particles.append(particle);
      window.setTimeout(() => particle.remove(), 2000);
    }
  }

  const flowers = document.querySelector('#flores');
  const wash = document.querySelector('#transicion-magica');
  let transitioning = false;
  flowers.addEventListener('click', (event) => {
    if (transitioning || window.getSelection()?.toString()) return;
    event.preventDefault();
    transitioning = true;
    const destination = document.querySelector('#titulo-recuerdos');
    const revealMemories = () => {
      document.querySelector('#recuerdos').scrollIntoView({ behavior: 'instant', block: 'start' });
      destination.focus({ preventScroll: true });
    };
    if (motionAllowed()) {
      celebrate(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
      wash.classList.add('is-active');
      window.setTimeout(revealMemories, 420);
      window.setTimeout(() => { wash.classList.remove('is-active'); transitioning = false; }, 1050);
    } else {
      revealMemories();
      transitioning = false;
    }
  });

  const hugButton = document.querySelector('#boton-abrazo');
  const hugs = ['Uno bien apretadito. Solo para ti.', 'Y otro, por si hoy lo necesitabas.', 'Aquí siempre tienes un abrazo.', 'Mi lugar favorito sigue siendo contigo.'];
  let hugCount = 0;
  let hugTimeout;
  hugButton.addEventListener('click', () => {
    const bounds = hugButton.getBoundingClientRect();
    celebrate(bounds.left + bounds.width / 2, bounds.top, 24);
    document.querySelector('#estado-abrazo').textContent = hugs[hugCount++ % hugs.length];
    const section = document.querySelector('#amor');
    section.classList.add('hugging');
    clearTimeout(hugTimeout);
    hugTimeout = window.setTimeout(() => section.classList.remove('hugging'), 1800);
  });

  // Visor nativo: mantiene el foco dentro y devuelve el foco a la foto al cerrar.
  const dialog = document.querySelector('#visor');
  const photoButtons = [...document.querySelectorAll('[data-photo]')];
  const viewerImage = document.querySelector('#visor-imagen');
  let currentPhoto = 0;
  let opener;
  function renderPhoto(index) {
    currentPhoto = (index + photoButtons.length) % photoButtons.length;
    const button = photoButtons[currentPhoto];
    const image = button.querySelector('img');
    const caption = button.closest('figure').querySelector('figcaption');
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    document.querySelector('#visor-titulo').textContent = caption.querySelector('.memory-card__number').textContent.split(' / ').slice(1).join(' / ');
    document.querySelector('#visor-descripcion').textContent = caption.querySelector('p').textContent;
    document.querySelector('#visor-contador').textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${photoButtons.length} recuerdos`;
  }
  photoButtons.forEach((button, index) => button.addEventListener('click', () => {
    if (typeof dialog.showModal !== 'function') {
      window.open(button.querySelector('img').src, '_blank', 'noopener');
      return;
    }
    opener = button;
    renderPhoto(index);
    dialog.showModal();
    document.querySelector('#cerrar-visor').focus();
  }));
  document.querySelector('#cerrar-visor').addEventListener('click', () => dialog.close());
  document.querySelector('#foto-anterior').addEventListener('click', () => renderPhoto(currentPhoto - 1));
  document.querySelector('#foto-siguiente').addEventListener('click', () => renderPhoto(currentPhoto + 1));
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      renderPhoto(currentPhoto + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  let touchStart = null;
  viewerImage.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    else touchStart = null;
  }, { passive: true });
  viewerImage.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) renderPhoto(currentPhoto + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  // Besitos de patito: interacción finita, también accesible con teclado.
  const duckButton = document.querySelector('#besito-patito');
  const duckSection = document.querySelector('#patitos');
  let duckTimer;
  duckButton.addEventListener('click', () => {
    const box = duckButton.getBoundingClientRect();
    celebrate(box.left + box.width / 2, box.top, 20);
    duckSection.classList.add('duck-kiss');
    document.querySelector('#estado-patito').textContent = 'Un cuac, un besito y toda una vida contigo.';
    clearTimeout(duckTimer);
    duckTimer = setTimeout(() => duckSection.classList.remove('duck-kiss'), 2200);
  });

  // El archivo local conserva la canción completa y no depende de servicios externos.
  const player = document.querySelector('#musica');
  const record = document.querySelector('#reproductor');
  const status = document.querySelector('#estado-musica');
  const dock = document.querySelector('#control-musica-flotante');
  const musicButtons = [...document.querySelectorAll('#boton-musica, #alternar-musica, #boton-vinilo')];
  let playing = false;

  function reflectMusic(active) {
    playing = active;
    record.dataset.state = active ? 'playing' : 'paused';
    musicButtons.forEach((button) => {
      const icon = button.querySelector('[data-music-icon]');
      const label = button.querySelector('[data-music-label]');
      if (icon) icon.textContent = active ? 'Ⅱ' : '▶';
      if (label) label.textContent = active ? 'Pausar nuestra canción' : 'Dale play a lo nuestro';
    });
    document.querySelector('#boton-vinilo').setAttribute('aria-label', active ? 'Pausar nuestra canción' : 'Reproducir nuestra canción');
  }
  function musicError() {
    reflectMusic(false);
    status.textContent = 'La canción no pudo iniciar. Revisa el archivo e inténtalo de nuevo.';
  }
  async function toggleMusic() {
    if (playing) {
      player.pause();
      return;
    }
    dock.hidden = false;
    try {
      if (player.ended) player.currentTime = 0;
      await player.play();
    } catch (error) {
      musicError();
      console.error('No se pudo reproducir la canción local.', error);
    }
  }
  musicButtons.forEach((button) => button.addEventListener('click', toggleMusic));
  player.addEventListener('play', () => {
    reflectMusic(true);
    status.textContent = 'Tú, yo y nuestra canción. Sigue bajando ♡';
    document.querySelectorAll('.memory-film video').forEach((video) => {
      if (!video.muted && !video.paused) video.pause();
    });
  });
  player.addEventListener('pause', () => {
    reflectMusic(false);
    status.textContent = 'Nuestra canción te espera cuando quieras.';
  });
  player.addEventListener('ended', () => {
    reflectMusic(false);
    status.textContent = '¿La escuchamos otra vez? ♡';
  });
  player.addEventListener('error', musicError);

  const localVideos = [...document.querySelectorAll('.memory-film video')];
  localVideos.forEach((video) => {
    const coordinateAudio = () => {
      if (!video.paused && !video.muted && video.volume > 0 && playing) player.pause();
    };
    video.addEventListener('play', () => {
      localVideos.forEach((other) => { if (other !== video) other.pause(); });
      coordinateAudio();
    });
    video.addEventListener('volumechange', coordinateAudio);
  });
})();

