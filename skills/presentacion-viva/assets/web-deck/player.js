// Minimal player for the slides exported from the claude.ai Slides artifact.
// Each slides/<id>.html is one <section> on a 1920×1080 canvas; deck.json sets the order.
const W = 1920, H = 1080;
const $ = id => document.getElementById(id);
const stage = $('stage');
const isPresenter = new URLSearchParams(location.search).has('presenter');
const isPrint = new URLSearchParams(location.search).has('print');
const bus = new BroadcastChannel('deck:' + location.pathname);
let slides = [], cur = -1, t0 = Date.now(), FONT = '';

const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function prepare(html, n, print = false) {
  // in print mode the animations get window.PRINT and stay in their final state (FINAL())
  const head = FONT + (print ? '<script>window.PRINT=1<\/script>' : '');
  html = html
    // <x-embed> → sandboxed iframe, same sandbox as the Slides type (scripts yes, clicks no), plus the brand font
    .replace(/<x-embed([^>]*)>([\s\S]*?)<\/x-embed>/g, (_, a, doc) =>
      `<iframe${a} sandbox="allow-scripts" scrolling="no" tabindex="-1" srcdoc="${attr(doc.replace(/<head>/i, '<head>' + head))}"></iframe>`);
  html = print
    ? html
      // printing: a video shows its poster, an embedded app shows its data-print-src capture
      .replace(/<img([^>]*?)\sdata-video="[^"]*"([^>]*)>/g, (_, a, b) => `<img${(a + b).replace(/\sdata-video-sound="[^"]*"/g, '')}>`)
      .replace(/<iframe([^>]*?)\sdata-print-src="([^"]*)"([^>]*)>\s*<\/iframe>/g, (_, a, src, b) => `<img${(a + b).replace(/\ssrc="[^"]*"/, '')} src="${src}" alt="Captura de la app">`)
    // <img data-video> → <video> with the image as poster
    : html.replace(/<img([^>]*?)\sdata-video="([^"]*)"([^>]*)>/g, (_, a, src, b) => {
      const rest = a + b, poster = rest.match(/\ssrc="([^"]*)"/)[1];
      const muted = /data-video-sound="on"/.test(rest) ? '' : ' muted';
      return `<video${rest.replace(/\s(src|alt|data-video-sound)="[^"]*"/g, '')} poster="${poster}" src="${src}" playsinline loop preload="auto"${muted}></video>`;
    });
  // footer page number follows the order in deck.json
  return html.replace(/(<p style="font-size:24px;font-weight:700;color:#[0-9A-Fa-f]{6}">)\d{2}(<\/p><\/div>)/, `$1${String(n).padStart(2, '0')}$2`);
}

// Slides format: text-align on a first-row cell aligns its whole column
function alignTables(sec) {
  sec.querySelectorAll('table').forEach(t => [...t.rows[0].cells].forEach((c, j) => {
    if (c.style.textAlign) [...t.rows].forEach(r => { if (r.cells[j] && !r.cells[j].style.textAlign) r.cells[j].style.textAlign = c.style.textAlign; });
  }));
}

// ?print: every slide stacked as a 1920×1080 page, animations frozen in their final state
function renderPrint() {
  document.body.classList.add('print');
  const msg = document.createElement('div');
  msg.id = 'print-msg';
  msg.textContent = 'Preparando la impresión…';
  document.body.append(msg);
  const legacy = [];
  slides.forEach((s, i) => {
    const t = document.createElement('template');
    t.innerHTML = prepare(s.raw, i + 1, true);
    const sec = t.content.querySelector('section');
    alignTables(sec);
    stage.append(sec);
    // animations without FINAL() ignore window.PRINT, and Chrome pauses timers in off-screen frames: they print half-built
    if (/<x-embed/.test(s.raw) && !/PRINT/.test(s.raw)) legacy.push(i + 1);
  });
  setTimeout(() => {
    msg.textContent = legacy.length
      ? `Ojo: ${legacy.length} slides con animaciones sin estado final pueden salir incompletas (${legacy.join(', ')}). Ver impresion.md`
      : 'Listo para imprimir: Ctrl+P → Guardar como PDF';
    msg.classList.add(legacy.length ? 'warn' : 'ok');
  }, 1500);
}

async function load() {
  const deck = await (await fetch('deck.json')).json();
  // fonts and title come from deck.json, as in the Slides artifact (faces: {key: {family, href}})
  document.title = deck.title ?? document.title;
  const faces = Object.values(deck.faces ?? {});
  FONT = faces.map(f => `<link rel="stylesheet" href="${f.href}">`).join('');
  document.head.insertAdjacentHTML('beforeend', FONT);
  if (faces[0]) document.body.style.setProperty('--font', `'${faces[0].family}'`);
  slides = await Promise.all(deck.order.map(async (id, i) => {
    const raw = await (await fetch(`slides/${id}.html`)).text();
    const t = document.createElement('template');
    t.innerHTML = raw;
    const c = t.content;
    return {
      id, raw, html: prepare(raw, i + 1),
      notes: c.querySelector('aside')?.textContent.trim() ?? '',
      title: (c.querySelector('h2, h1')?.textContent ?? (id === deck.cover ? 'Portada' : id[0].toUpperCase() + id.slice(1).replace(/-/g, ' '))).trim(),
    };
  }));
  if (isPrint) return renderPrint();
  buildIndex(deck.sections);
  if (isPresenter) { stage.hidden = true; $('presenter').hidden = false; setInterval(tick, 1000); }
  show((parseInt(location.hash.slice(1)) || 1) - 1);
}

function show(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i === cur || isPrint) return;
  cur = i;
  history.replaceState(null, '', '#' + (i + 1));
  $('c-pos').textContent = `${i + 1} / ${slides.length}`;
  $('progress').firstChild.style.width = (i + 1) / slides.length * 100 + '%';
  document.querySelectorAll('#i-list button').forEach((b, j) => b.toggleAttribute('aria-current', j === i));
  if (isPresenter) return renderNotes();

  const old = stage.querySelectorAll('section');
  const t = document.createElement('template');
  t.innerHTML = slides[i].html;
  const sec = t.content.querySelector('section');
  sec.classList.add('enter');
  stage.append(sec);
  sec.offsetWidth; // commit the start state so the fade runs
  sec.classList.remove('enter');
  // ponytail: every transition is a 0.4 s crossfade ("magic" included); only the two mockups slides use magic and their shared element does not move
  old.forEach(o => { o.querySelectorAll('video').forEach(v => v.pause()); setTimeout(() => o.remove(), 400); });

  // ponytail: only "auto" builds exist in the deck, so builds play in order on entry; click-to-build not implemented
  sec.querySelectorAll('[data-build-in]').forEach(el => {
    const [kind, order] = el.dataset.buildIn.split(' ');
    el.style.animationDelay = (0.4 + order * 0.6) + 's';
    el.classList.add('built', kind);
  });
  alignTables(sec);
  sec.querySelectorAll('video').forEach(v => {
    v.play().catch(() => {});
    v.onclick = () => v.paused ? v.play() : v.pause();
  });
}

function nav(i) { show(i); bus.postMessage(cur); }
bus.onmessage = e => show(e.data);
// An embedded app on another origin can drive the deck: parent.postMessage('deck:next' | 'deck:prev', '*')
addEventListener('message', e => { if (e.data === 'deck:next') nav(cur + 1); else if (e.data === 'deck:prev') nav(cur - 1); });

function renderNotes() {
  const s = slides[cur], next = slides[cur + 1];
  $('p-pos').textContent = `${cur + 1} / ${slides.length} · ${s.title}`;
  $('p-notes').textContent = s.notes;
  $('p-next').textContent = next ? `Siguiente (${cur + 2}): ${next.title}` : 'Última slide';
}
function tick() {
  const s = Math.floor((Date.now() - t0) / 1000);
  $('p-timer').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  stage.style.transform = `scale(${s}) translate(-50%, -50%)`;
}
addEventListener('resize', fit);
addEventListener('hashchange', () => nav((parseInt(location.hash.slice(1)) || 1) - 1));
fit();

const fullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
const presenterWindow = () => open(location.pathname + '?presenter#' + (cur + 1), 'presenter', 'width=900,height=700');

function buildIndex(sections) {
  const starts = Object.fromEntries(Object.values(sections).map(s => [s.start, s.description.split(':')[0]]));
  const list = $('i-list');
  slides.forEach((s, i) => {
    if (starts[s.id]) {
      const h = document.createElement('li');
      h.className = 'sec';
      h.textContent = starts[s.id];
      list.append(h);
    }
    const li = document.createElement('li'), b = document.createElement('button');
    b.innerHTML = `<span>${i + 1}</span>`;
    b.append(s.title);
    b.onclick = () => { nav(i); toggleIndex(false); };
    li.append(b);
    list.append(li);
  });
}
function toggleIndex(on = $('index').hidden) {
  $('index').hidden = !on;
  if (on) $('i-list').querySelector('[aria-current]')?.scrollIntoView({ block: 'center' });
}

$('c-prev').onclick = () => nav(cur - 1);
$('c-next').onclick = () => nav(cur + 1);
$('c-pos').onclick = $('c-index').onclick = () => toggleIndex();
$('i-close').onclick = () => toggleIndex(false);
$('c-notes').onclick = presenterWindow;
$('c-full').onclick = fullscreen;
$('p-prev').onclick = () => nav(cur - 1);
$('p-next-btn').onclick = () => nav(cur + 1);
// mouse clicks don't leave focus on a button, so Space keeps advancing slides
document.querySelectorAll('#ctrl, #p-nav').forEach(n => n.addEventListener('mousedown', e => e.preventDefault()));

// Show the controls while the pointer moves; hide them (and the cursor) after 2.5 s idle
let idle;
const wake = () => { document.body.classList.add('active'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.remove('active'), 2500); };
addEventListener('pointermove', wake);
addEventListener('pointerdown', wake);

// Click on the slide: left third goes back, the rest advances. Horizontal swipe on touch screens.
let down;
stage.addEventListener('pointerdown', e => { down = e.isPrimary && e.button === 0 ? e : null; });
stage.addEventListener('pointerup', e => {
  if (!down) return;
  const dx = e.clientX - down.clientX;
  down = null;
  if (!$('index').hidden) return toggleIndex(false);
  if (Math.abs(dx) > 60) return nav(cur + (dx < 0 ? 1 : -1));
  if (Math.abs(dx) > 10 || e.target.closest('video, a')) return; // videos toggle play on click
  nav(cur + (e.clientX < innerWidth / 3 ? -1 : 1));
});

addEventListener('keydown', e => {
  const k = e.key;
  if (e.target.closest?.('button') && (k === ' ' || k === 'Enter')) return; // let focused buttons work
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) nav(cur + 1);
  else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) nav(cur - 1);
  else if (k === 'Home') nav(0);
  else if (k === 'End') nav(slides.length - 1);
  else if (k === 'f') fullscreen();
  else if (k === 'g') toggleIndex();
  else if (k === 'Escape' && !$('index').hidden) toggleIndex(false);
  else if (k === 'p' && !isPresenter) presenterWindow();
  else if (k === 'r' && isPresenter) { t0 = Date.now(); tick(); }
  else return;
  e.preventDefault();
});

load();
