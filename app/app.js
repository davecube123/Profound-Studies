/* Profound Studies: study companion PWA.
   All personal data (progress, journal, notes, timer) lives in this browser's
   localStorage. Use Settings → Export to back it up or move it to another device. */
(function () {
  'use strict';

  // ---------- content model ----------
  const MODULES = [
    { id: '01-recursion', num: '01', name: 'Recursion', color: 'var(--m1)',
      hook: 'How can something defined in terms of itself be finite, useful and beautiful?',
      labs: [['Quicksort, seen', '01-recursion/quicksort.html']], code: [] },
    { id: '02-emergence', num: '02', name: 'Emergence', color: 'var(--m2)',
      hook: 'How do four rules on a grid produce gliders and computers?',
      labs: [['Game of Life', '02-emergence/life.html']], code: [] },
    { id: '03-primes', num: '03', name: 'Primes', color: 'var(--m3)',
      hook: 'Why do deterministic primes look random, and are there infinitely many twins?',
      labs: [['Twin primes', '03-primes/twin-primes.html']], code: [['twin_primes.py', '03-primes/twin_primes.py']] },
    { id: '04-randomness', num: '04', name: 'Randomness', color: 'var(--m4)',
      hook: 'Why does flipping coins make algorithms faster, and is it really necessary?',
      labs: [['Random vs fixed pivot', '01-recursion/quicksort.html']], code: [['miller_rabin.py', '04-randomness/miller_rabin.py']] },
    { id: '05-self-reference', num: '05', name: 'Self-reference', color: 'var(--m5)',
      hook: 'How can a sentence say "I am not provable", and why does that matter?',
      labs: [['The diagonal argument', '05-self-reference/diagonal.html']], code: [['quine.py', '05-self-reference/quine.py']] },
    { id: '06-complexity', num: '06', name: 'Complexity', color: 'var(--m6)',
      hook: 'Among things we can compute, what can we compute fast?',
      labs: [], code: [] },
  ];
  const MOD = Object.fromEntries(MODULES.map(m => [m.id, m]));

  // ---------- state ----------
  const KEY = 'profound-studies.v1';
  const blank = () => ({ checks: {}, journal: [], notes: {}, activity: {}, visits: {}, last: null, timer: null, theme: 'system', totals: {},
    carry: null, pz: {}, pzCadence: 'week', customPuzzles: [] });
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }
  let saveT = null;
  function save(now) {
    clearTimeout(saveT);
    const w = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save. Is storage full or blocked?'); } };
    now ? w() : (saveT = setTimeout(w, 250));
  }
  const localDay = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  function mark(kind) { const d = localDay(); S.activity[d] = (S.activity[d] || 0) + 1; save(); }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const view = $('#view');
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
  const fmtDate = iso => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const mmss = s => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  const textCache = {};
  async function getText(path) {
    if (textCache[path]) return textCache[path];
    const r = await fetch(path, { cache: 'no-cache' }).catch(() => null) || await caches?.match?.(path);
    if (!r || !r.ok) throw new Error('Could not load ' + path);
    return (textCache[path] = await r.text());
  }

  // checklist items, parsed from each module README
  const checklists = {};
  async function loadChecklist(id) {
    if (checklists[id]) return checklists[id];
    const txt = await getText(`${id}/README.md`);
    return (checklists[id] = [...txt.matchAll(/^\s*[-*]\s+\[[ xX]\]\s+(.+)$/gm)].map(m => m[1].trim()));
  }
  const ckey = (id, text) => id + '::' + text;
  function progress(id) {
    const items = checklists[id] || [];
    const done = items.filter(t => S.checks[ckey(id, t)]).length;
    return { done, total: items.length, pct: items.length ? done / items.length : 0 };
  }
  async function loadAllChecklists() { await Promise.all(MODULES.map(m => loadChecklist(m.id).catch(() => []))); }

  // link rewriting for markdown rendered inside the app
  const ROOT = new URL('./', location.href).href;
  function resolveFrom(base) {
    return u => {
      if (/^(https?:|mailto:)/.test(u)) return { href: u, external: true };
      if (u.startsWith('#')) return { href: '#/' + (location.hash.split('/').slice(1, 3).join('/')) };
      const abs = new URL(u, ROOT + base).href;
      let rel = abs.startsWith(ROOT) ? abs.slice(ROOT.length) : u;
      rel = rel.replace(/#.*$/, '');
      if (rel === '' || rel === 'README.md') return { href: '#/' };
      if (rel === 'THE_THREAD.md') return { href: '#/thread' };
      if (rel === 'questions.md') return { href: '#/journal' };
      if (rel === 'index.html') return { href: '#/' };
      if (rel === 'map.html') return { href: '#/map' };
      let m = rel.match(/^(\d\d-[a-z-]+)\/(README\.md)?$/);
      if (m && MOD[m[1]]) return { href: '#/module/' + m[1] };
      if (rel.endsWith('.py')) return { href: '#/code/' + rel };
      return { href: rel };
    };
  }

  // ---------- router ----------
  const routes = [
    [/^\/?$/, renderHome],
    [/^\/modules$/, renderModules],
    [/^\/module\/([\w-]+)$/, renderModule],
    [/^\/thread$/, renderThread],
    [/^\/journal$/, renderJournal],
    [/^\/journal\/new$/, (_, p) => editEntry(null, p)],
    [/^\/journal\/([\w]+)$/, editEntry],
    [/^\/focus$/, renderFocus],
    [/^\/map$/, renderMap],
    [/^\/code\/(.+)$/, renderCode],
    [/^\/puzzle$/, () => renderPuzzle(null)],
    [/^\/puzzle\/([\w-]+)$/, renderPuzzle],
    [/^\/puzzles$/, renderPuzzleLib],
    [/^\/puzzles\/new$/, renderPuzzleNew],
    [/^\/settings$/, renderSettings],
  ];
  let cleanup = null;
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    const [path, query] = (location.hash.slice(1) || '/').split('?');
    const params = new URLSearchParams(query || '');
    const top = path.split('/')[1] || 'home';
    const navKey = top === 'module' || top === 'thread' || top === 'code' ? 'modules' : top === 'puzzles' ? 'puzzle' : top;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === navKey));
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (m) { window.scrollTo(0, 0); Promise.resolve(fn(m[1], params)).catch(err => { view.innerHTML = `<div class="empty">${esc(err.message)}<br><br><a href="#/">Home</a></div>`; }); view.focus({ preventScroll: true }); return; }
    }
    location.hash = '#/';
  }
  window.addEventListener('hashchange', route);

  // ---------- views ----------
  function streak() {
    let n = 0; const d = new Date();
    if (!S.activity[localDay(d)]) d.setDate(d.getDate() - 1);
    while (S.activity[localDay(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function heatStrip(days = 21) {
    const d = new Date(); d.setDate(d.getDate() - days + 1); let h = '';
    for (let i = 0; i < days; i++) {
      const c = S.activity[localDay(d)] || 0;
      h += `<i class="${c >= 6 ? 'l3' : c >= 3 ? 'l2' : c ? 'l1' : ''}" title="${localDay(d)}: ${c} actions"></i>`;
      d.setDate(d.getDate() + 1);
    }
    return `<div class="heat" aria-label="Activity over the last ${days} days">${h}</div>`;
  }
  let seeds = null;
  async function loadSeeds() {
    if (seeds) return seeds;
    try {
      const t = await getText('questions.md');
      const part = t.split(/^## Seed questions.*$/m)[1] || '';
      seeds = [...part.matchAll(/^- (.+)$/gm)].map(m => m[1].trim().replace(/\*\*?([^*]+)\*\*?/g, '$1'));
    } catch (e) { seeds = []; }
    return seeds;
  }

  async function renderHome() {
    await loadAllChecklists(); await loadSeeds();
    const all = MODULES.map(m => progress(m.id));
    const done = all.reduce((a, p) => a + p.done, 0), total = all.reduce((a, p) => a + p.total, 0);
    const pct = total ? done / total : 0, C = 2 * Math.PI * 40;
    const open = S.journal.filter(e => e.status !== 'understood');
    const pool = [...open.map(e => ({ text: e.question, id: e.id })), ...seeds.map(s => ({ text: s }))].filter(x => x.text);
    const pick = pool.length ? pool[Math.floor((Date.now() / 864e5) % pool.length)] : null; // stable for the day
    const last = S.last;
    const pzCard = await puzzleHomeCard();
    view.innerHTML = `
      <section class="hero">
        <svg class="ring" viewBox="0 0 96 96" aria-label="${Math.round(pct * 100)}% of proof-path items done">
          <circle class="bg" cx="48" cy="48" r="40"/><circle class="fg" cx="48" cy="48" r="40" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 48 48)"/>
          <text x="48" y="48">${Math.round(pct * 100)}%</text></svg>
        <div>
          <h1>A few rules, applied again and again.</h1>
          <div class="muted small">${done} of ${total} proof-path steps · ${streak()} day streak · ${S.journal.length} journal entries</div>
          ${heatStrip()}
        </div>
      </section>

      ${pzCard}

      ${last ? `<h2>Continue</h2><a class="card" href="${esc(last.href)}"><div class="eyebrow">Where you left off</div><h3>${esc(last.title)}</h3></a>` : ''}

      ${pick ? `<h2>Something to wonder about today</h2>
        <div class="card"><div class="prompt">${esc(pick.text)}</div>
        <div class="row">
          <a class="btn primary" href="#/focus?q=${encodeURIComponent(pick.text)}">Attempt it (timer)</a>
          ${pick.id ? `<a class="btn" href="#/journal/${pick.id}">Open entry</a>` : `<button class="btn" id="seedLog">Log as question</button>`}
        </div></div>` : ''}

      <h2>Modules</h2>
      <div class="grid">${MODULES.map(m => modCard(m)).join('')}</div>

      <h2>The thread</h2>
      <a class="card" href="#/thread"><div class="eyebrow">Essay</div><h3>Why these six topics are one topic</h3><div class="muted small">Recursion, emergence, structure vs randomness, limits, and the diagonal that ties them together.</div></a>
    `;
    const b = $('#seedLog'); if (b) b.onclick = () => { const e = newEntry({ question: pick.text }); location.hash = '#/journal/' + e.id; };
  }
  function modCard(m) {
    const p = progress(m.id);
    return `<a class="card" href="#/module/${m.id}" style="--mc:${m.color}">
      <div class="row"><span class="dot"></span><span class="eyebrow">${m.num}</span><span class="spacer"></span><span class="muted small">${p.done}/${p.total}</span></div>
      <h3 style="margin-top:4px">${m.name}</h3><div class="muted small" style="margin-bottom:10px">${esc(m.hook)}</div>
      <div class="bar"><i style="width:${p.pct * 100}%"></i></div></a>`;
  }

  async function renderModules() {
    await loadAllChecklists();
    view.innerHTML = `<h1>Modules</h1><p class="lede">Follow curiosity, not the numbers. Each guide goes: see it, the ideas, the proof path, the world, the connections.</p>
      <div class="grid">${MODULES.map(modCard).join('')}</div>
      <h2>Also</h2><div class="grid">
        <a class="card" href="#/thread"><h3>The Thread</h3><div class="muted small">The unifying essay.</div></a>
        <a class="card" href="#/map"><h3>Concept map</h3><div class="muted small">Every connection, clickable.</div></a></div>`;
  }

  function checkboxRenderer(id) {
    return (raw, _checked, html) => {
      const k = ckey(id, raw.trim());
      return `<label><input type="checkbox" data-k="${esc(k)}" ${S.checks[k] ? 'checked' : ''}><span>${html}</span></label>`;
    };
  }
  function wireChecks(root, id) {
    root.addEventListener('change', e => {
      const k = e.target.dataset && e.target.dataset.k; if (!k) return;
      if (e.target.checked) { S.checks[k] = localDay(); mark(); } else delete S.checks[k];
      save(); updateModProgress(id);
      if (e.target.checked) toast('Nice. Consider logging what clicked in the journal.');
    });
  }
  function updateModProgress(id) {
    const p = progress(id), el = $('#modprog');
    if (el) { el.querySelector('i').style.width = p.pct * 100 + '%'; $('#modprogt').textContent = `${p.done} of ${p.total} proof-path steps`; }
  }

  async function renderModule(id) {
    const m = MOD[id]; if (!m) throw new Error('Unknown module');
    await loadChecklist(id);
    const src = await getText(`${id}/README.md`);
    S.last = { href: '#/module/' + id, title: `${m.num} · ${m.name}` }; S.visits[id] = Date.now(); save();
    const body = MD.render(src.replace(/^#\s+.*\n/, ''), { resolveLink: resolveFrom(id + '/'), checkbox: checkboxRenderer(id) });
    const p = progress(id);
    view.innerHTML = `
      <div style="--mc:${m.color}">
        <div class="modhead"><div class="modnum">${m.num}</div><div><div class="eyebrow">Module</div><h1 style="margin:0">${m.name}</h1></div></div>
        <div id="modprog" class="bar" style="margin:10px 0 4px"><i style="width:${p.pct * 100}%"></i></div>
        <div id="modprogt" class="muted small">${p.done} of ${p.total} proof-path steps</div>
        <div class="labbar row">
          ${m.labs.map(([t, h]) => `<a class="btn primary" href="${h}">▶ ${esc(t)}</a>`).join('')}
          ${m.code.map(([t, h]) => `<a class="btn" href="#/code/${h}">${esc(t)}</a>`).join('')}
          <a class="btn" href="#/focus?m=${id}">Focus</a>
          <a class="btn" href="#/journal/new?m=${id}">+ Question</a>
          <a class="btn ghost" href="#notes" id="toNotes">Notes ↓</a>
        </div>
        <article class="doc" id="doc">${body}</article>
        <h2 id="notes">My notes</h2>
        <p class="muted small">Your own words, saved automatically. Explaining it back is the real test of understanding.</p>
        <textarea id="noteText" style="min-height:220px" placeholder="What did I see? What surprised me? How would I explain this to a friend?">${esc(S.notes[id] || '')}</textarea>
        ${journalFor(id)}
      </div>`;
    wireChecks($('#doc'), id);
    $('#toNotes').onclick = e => { e.preventDefault(); $('#notes').scrollIntoView({ behavior: 'smooth' }); };
    let marked = false;
    $('#noteText').oninput = e => { S.notes[id] = e.target.value; if (!marked) { mark(); marked = true; } save(); };
  }
  function journalFor(id) {
    const es = S.journal.filter(e => e.module === id);
    if (!es.length) return '';
    return `<h2>Questions in this module</h2>${es.map(entryRow).join('')}`;
  }

  async function renderThread() {
    const src = await getText('THE_THREAD.md');
    S.last = { href: '#/thread', title: 'The Thread' }; save();
    view.innerHTML = `<article class="doc">${MD.render(src, { resolveLink: resolveFrom('') })}</article>`;
  }

  async function renderCode(path) {
    const src = await getText(path);
    const name = path.split('/').pop(), mod = path.split('/')[0];
    view.innerHTML = `<a href="#/module/${mod}" class="small">← ${esc(MOD[mod]?.name || 'Back')}</a>
      <h1 style="margin-top:8px">${esc(name)}</h1>
      <p class="muted small">Run it on your computer: <code>python3 ${esc(path)}</code>. Read it first and predict the output.</p>
      <div class="row" style="margin-bottom:10px"><button class="btn" id="copy">Copy code</button></div>
      <article class="doc"><pre><code>${esc(src)}</code></pre></article>`;
    $('#copy').onclick = () => navigator.clipboard.writeText(src).then(() => toast('Copied'), () => toast('Copy not allowed here'));
  }

  // ----- journal -----
  const FIELDS = [
    ['question', 'Question', 'What exactly am I wondering about?', 3],
    ['attempt', 'My attempt or guess', 'Before asking anyone (or any AI). Wrong guesses are valuable.', 5],
    ['stuck', 'Where I got stuck', 'The precise point where my understanding ran out.', 3],
    ['learned', 'What I learned', 'In my own words, once it clicked.', 4],
    ['newq', 'New questions it raised', 'One per line. Each can become its own entry.', 3],
  ];
  function newEntry(init = {}) {
    const e = Object.assign({ id: uid(), created: new Date().toISOString(), updated: new Date().toISOString(), module: '', status: 'open', minutes: 0, question: '', attempt: '', stuck: '', learned: '', newq: '' }, init);
    S.journal.unshift(e); mark(); save(true); return e;
  }
  function entryRow(e) {
    const m = MOD[e.module];
    return `<a class="entry" href="#/journal/${e.id}">
      <div class="q">${esc(e.question || '(untitled question)')}</div>
      <div class="meta"><span class="chip ${e.status === 'understood' ? 'done' : 'open'}">${e.status === 'understood' ? 'understood' : 'open'}</span>
      ${m ? `<span style="--mc:${m.color}"><span class="dot"></span>${m.name}</span>` : ''}
      <span>${fmtDate(e.updated || e.created)}</span>${e.minutes ? `<span>· ${e.minutes} min struggled</span>` : ''}</div></a>`;
  }
  let jFilter = { status: 'all', module: '', q: '' };
  async function renderJournal() {
    await loadSeeds();
    view.innerHTML = `
      <div class="row"><h1 style="margin:0">Journal</h1><span class="spacer"></span><a class="btn primary" href="#/journal/new">+ New question</a></div>
      <p class="lede">Curiosities, confusions and "aha" moments. Write the wrong guesses too: they show how your thinking moved.</p>
      <div class="row" style="margin-bottom:12px">
        <div class="seg" id="st">${['all', 'open', 'understood'].map(s => `<button data-s="${s}" class="${jFilter.status === s ? 'on' : ''}">${s}</button>`).join('')}</div>
        <select id="fm" style="width:auto"><option value="">All modules</option>${MODULES.map(m => `<option value="${m.id}" ${jFilter.module === m.id ? 'selected' : ''}>${m.num} ${m.name}</option>`).join('')}</select>
        <input id="fq" type="search" placeholder="Search…" value="${esc(jFilter.q)}" style="flex:1;min-width:140px">
      </div>
      <div id="list"></div>
      <h2>Seed questions</h2>
      <p class="muted small">Starting points from <code>questions.md</code>. Tap one to make it yours.</p>
      <div id="seeds">${seeds.map((s, i) => `<button class="entry" style="width:100%;text-align:left;cursor:pointer" data-i="${i}"><span class="q" style="font-weight:450">${esc(s)}</span></button>`).join('')}</div>
      <div class="row" style="margin-top:18px"><button class="btn" id="exp">Export journal as Markdown</button></div>`;
    const draw = () => {
      const q = jFilter.q.toLowerCase();
      const es = S.journal.filter(e => (jFilter.status === 'all' || (jFilter.status === 'understood') === (e.status === 'understood'))
        && (!jFilter.module || e.module === jFilter.module)
        && (!q || FIELDS.some(([k]) => (e[k] || '').toLowerCase().includes(q))));
      $('#list').innerHTML = es.length ? es.map(entryRow).join('') : `<div class="empty">${S.journal.length ? 'Nothing matches.' : 'No entries yet. Start with a seed question below, or your own.'}</div>`;
    };
    $('#st').onclick = e => { const s = e.target.dataset.s; if (!s) return; jFilter.status = s; [...$('#st').children].forEach(b => b.classList.toggle('on', b.dataset.s === s)); draw(); };
    $('#fm').onchange = e => { jFilter.module = e.target.value; draw(); };
    $('#fq').oninput = e => { jFilter.q = e.target.value; draw(); };
    $('#seeds').onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const en = newEntry({ question: seeds[+b.dataset.i] }); location.hash = '#/journal/' + en.id; };
    $('#exp').onclick = exportJournal;
    draw();
  }
  function editEntry(id, params) {
    let e;
    if (!id) {
      e = newEntry({ module: params?.get('m') || '', question: params?.get('q') || '', attempt: params?.get('a') || '', minutes: +(params?.get('min') || 0) });
      history.replaceState(null, '', '#/journal/' + e.id);
    } else e = S.journal.find(x => x.id === id);
    if (!e) throw new Error('Entry not found');
    view.innerHTML = `
      <a href="#/journal" class="small">← Journal</a>
      <div class="row" style="margin-top:10px">
        <div class="seg" id="status">${['open', 'understood'].map(s => `<button data-s="${s}" class="${e.status === s ? 'on' : ''}">${s}</button>`).join('')}</div>
        <select id="mod" style="width:auto"><option value="">No module</option>${MODULES.map(m => `<option value="${m.id}" ${e.module === m.id ? 'selected' : ''}>${m.num} ${m.name}</option>`).join('')}</select>
        <span class="spacer"></span><span class="muted small" id="saved">Saved</span>
      </div>
      ${FIELDS.map(([k, label, hint, rows]) => `<label class="field"><span>${label}</span><textarea data-k="${k}" rows="${rows}" style="min-height:${rows * 26}px" placeholder="${esc(hint)}">${esc(e[k])}</textarea></label>`).join('')}
      <label class="field" style="max-width:220px"><span>Minutes struggled</span><input type="text" inputmode="numeric" id="min" value="${e.minutes || ''}"></label>
      <div class="row">
        <a class="btn primary" href="#/focus?e=${e.id}">Struggle with it (timer)</a>
        <button class="btn" id="spawn">New questions → entries</button>
        <button class="btn" id="copy">Copy as Markdown</button>
        <span class="spacer"></span>
        <button class="btn danger" id="del">Delete</button>
      </div>
      <p class="muted small" style="margin-top:14px">Created ${fmtDate(e.created)}</p>`;
    const touch = () => { e.updated = new Date().toISOString(); save(); $('#saved').textContent = 'Saved'; };
    view.querySelectorAll('textarea[data-k]').forEach(t => t.oninput = () => { $('#saved').textContent = 'Saving…'; e[t.dataset.k] = t.value; touch(); });
    $('#min').oninput = ev => { e.minutes = parseInt(ev.target.value) || 0; touch(); };
    $('#mod').onchange = ev => { e.module = ev.target.value; touch(); };
    $('#status').onclick = ev => { const s = ev.target.dataset.s; if (!s) return; e.status = s; [...$('#status').children].forEach(b => b.classList.toggle('on', b.dataset.s === s)); if (s === 'understood') { mark(); toast('That feeling is the whole point.'); } touch(); };
    $('#spawn').onclick = () => {
      const qs = (e.newq || '').split('\n').map(s => s.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);
      if (!qs.length) return toast('Write some new questions first (one per line)');
      qs.reverse().forEach(q => newEntry({ question: q, module: e.module }));
      toast(`Created ${qs.length} new entr${qs.length > 1 ? 'ies' : 'y'}`);
    };
    $('#copy').onclick = () => navigator.clipboard.writeText(entryMd(e)).then(() => toast('Copied. Paste it into questions.md'), () => toast('Copy not allowed here'));
    $('#del').onclick = () => { if (confirm('Delete this entry? This cannot be undone.')) { S.journal = S.journal.filter(x => x !== e); save(true); location.hash = '#/journal'; } };
    if (!e.question) view.querySelector('textarea[data-k="question"]').focus();
  }
  function entryMd(e) {
    const m = MOD[e.module];
    let s = `## ${(e.created || '').slice(0, 10)}: ${(e.question || 'untitled').split('\n')[0].slice(0, 80)}\n`;
    s += `*${e.status}${m ? ' · ' + m.num + ' ' + m.name : ''}${e.minutes ? ' · ' + e.minutes + ' min struggled' : ''}*\n\n`;
    for (const [k, label] of FIELDS) if (e[k]) s += `**${label}:** ${e[k].trim()}\n\n`;
    return s;
  }
  function download(name, text, type = 'text/markdown') {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function exportJournal() {
    if (!S.journal.length) return toast('Journal is empty');
    download(`journal-${localDay()}.md`, `# Questions log\n\nExported ${new Date().toLocaleString()}\n\n---\n\n` + S.journal.map(entryMd).join('---\n\n'));
  }

  // ----- focus timer -----
  // S.timer = { duration, elapsed (s, before startedAt), startedAt (ms|null), q, module, entry, scratch, done }
  function tRemaining(t = S.timer) { if (!t) return 0; const run = t.startedAt ? (Date.now() - t.startedAt) / 1000 : 0; return t.duration - t.elapsed - run; }
  function tSpent(t = S.timer) { return t ? t.duration - Math.max(0, tRemaining(t)) : 0; }
  let ctxAudio = null;
  function chime() {
    try {
      ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = ctxAudio.createOscillator(), g = ctxAudio.createGain(), t0 = ctxAudio.currentTime + i * 0.18;
        o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
        o.connect(g).connect(ctxAudio.destination); o.start(t0); o.stop(t0 + 1);
      });
    } catch (e) { }
    if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
  }
  function finishTimer() {
    const t = S.timer; if (!t || t.done) return;
    t.elapsed = t.duration; t.startedAt = null; t.done = true; mark(); save(true); chime();
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      navigator.serviceWorker?.getRegistration().then(r => r ? r.showNotification('Time is up', { body: 'Log where you got stuck before you look anything up.', icon: 'icons/icon-192.png', tag: 'focus' }) : new Notification('Time is up'));
    }
  }
  function tickBadge() {
    const b = $('#timerBadge'), t = S.timer;
    if (t && !t.done && t.startedAt) {
      const r = tRemaining(); if (r <= 0) { finishTimer(); }
      b.hidden = false; b.textContent = '⏱ ' + mmss(Math.max(0, r));
    } else if (t && t.done) { b.hidden = false; b.textContent = '⏱ done, log it'; }
    else b.hidden = true;
  }
  setInterval(tickBadge, 1000);

  async function renderFocus(_, params) {
    await loadPuzzles();
    const pp = params.get('p'), pzl = pp && getPuzzle(pp);
    const pq = params.get('q') || (pzl ? pzl.title : null), pm = params.get('m') || (pzl ? pzl.module : null), pe = params.get('e');
    const fromEntry = pe && S.journal.find(x => x.id === pe);
    const busy = S.timer && !S.timer.done && (S.timer.startedAt || S.timer.elapsed > 0 || (S.timer.scratch || '').trim());
    if ((pq || pm || fromEntry) && busy) { toast('Finish or reset your current attempt first'); history.replaceState(null, '', '#/focus'); }
    else if (pq || pm || fromEntry) {
      S.timer = { duration: (S.timer?.duration) || 15 * 60, elapsed: 0, startedAt: null, done: false, scratch: '',
        q: fromEntry ? fromEntry.question : (pq || ''), module: fromEntry ? fromEntry.module : (pm || ''), entry: fromEntry ? fromEntry.id : null, puzzle: pzl ? pzl.id : null };
      save(); history.replaceState(null, '', '#/focus');
    }
    if (!S.timer) S.timer = { duration: 15 * 60, elapsed: 0, startedAt: null, done: false, scratch: '', q: '', module: '', entry: null };
    const t = S.timer, R = 46, C = 2 * Math.PI * R;
    view.innerHTML = `
      <h1>Focus: struggle first</h1>
      <p class="lede">Pick something you want to understand. Work on it alone until the timer ends. <b>No AI, no searching.</b> Then log where you got stuck. That point is exactly where learning happens.</p>
      <label class="field"><span>What am I attempting?</span><textarea id="tq" rows="2" style="min-height:60px" placeholder="e.g. Prove every twin prime pair after (3,5) has the form (6k−1, 6k+1)">${esc(t.q)}</textarea></label>
      <div class="row">
        <select id="tm" style="width:auto"><option value="">No module</option>${MODULES.map(m => `<option value="${m.id}" ${t.module === m.id ? 'selected' : ''}>${m.num} ${m.name}</option>`).join('')}</select>
        <div class="seg" id="dur">${[10, 15, 25, 45].map(n => `<button data-n="${n}" class="${t.duration === n * 60 ? 'on' : ''}">${n}m</button>`).join('')}</div>
      </div>
      <div class="clock">
        <svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="${R}"/><circle class="fg" id="arc" cx="50" cy="50" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg>
        <div><div class="t" id="tt">${mmss(tRemaining())}</div><div class="s" id="ts"></div></div>
      </div>
      <div class="row" style="justify-content:center;margin-bottom:16px">
        <button class="btn primary" id="go"></button><button class="btn" id="rs">Reset</button><button class="btn" id="log">Log attempt</button>
      </div>
      <label class="field"><span>Scratch: my attempt as I go</span><textarea id="scr" rows="6" style="min-height:150px" placeholder="Definitions I'm using, small cases, guesses, dead ends…">${esc(t.scratch)}</textarea><small>${t.puzzle ? 'This is added to the puzzle\'s thought log when you log it.' : 'This becomes the "My attempt" field when you log it.'}</small></label>
      <div class="rules">Tips: try small cases first. Draw something. Restate the problem in your own words. If you're stuck for real, write down <i>exactly</i> what you'd need to know to continue. That sentence is your best question.</div>`;
    const arc = $('#arc');
    const paint = () => {
      const r = Math.max(0, tRemaining());
      $('#tt').textContent = mmss(r);
      arc.style.strokeDashoffset = C * (1 - r / t.duration);
      $('#go').textContent = t.done ? 'Again' : t.startedAt ? 'Pause' : (t.elapsed ? 'Resume' : 'Start');
      $('#ts').textContent = t.done ? 'Time. Log where you got stuck.' : t.startedAt ? 'struggling…' : (t.elapsed ? 'paused' : 'ready');
      $('#dur').querySelectorAll('button').forEach(b => b.disabled = !!(t.startedAt || t.elapsed) && !t.done);
    };
    const iv = setInterval(() => { if (t.startedAt && tRemaining() <= 0) finishTimer(); paint(); }, 250);
    cleanup = () => clearInterval(iv);
    $('#tq').oninput = e => { t.q = e.target.value; save(); };
    $('#tm').onchange = e => { t.module = e.target.value; save(); };
    $('#scr').oninput = e => { t.scratch = e.target.value; save(); };
    $('#dur').onclick = e => { const n = +e.target.dataset.n; if (!n || e.target.disabled) return; t.duration = n * 60; t.done = false; t.elapsed = 0; $('#dur').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.n === n)); save(); paint(); };
    $('#go').onclick = () => {
      if (t.done) { t.done = false; t.elapsed = 0; t.startedAt = null; }
      if (t.startedAt) { t.elapsed += (Date.now() - t.startedAt) / 1000; t.startedAt = null; }
      else {
        t.startedAt = Date.now(); mark();
        if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
        try { ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)(); ctxAudio.resume(); } catch (e) { }
      }
      save(); paint(); tickBadge();
    };
    $('#rs').onclick = () => { t.elapsed = 0; t.startedAt = null; t.done = false; save(); paint(); tickBadge(); };
    $('#log').onclick = () => {
      const mins = Math.max(1, Math.round(tSpent() / 60));
      if (t.puzzle) {
        const st = pzState(t.puzzle);
        st.log.unshift({ at: new Date().toISOString(), text: t.scratch.trim() || '(a focused session on this puzzle)', minutes: mins });
        const id = t.puzzle; S.timer = null; mark(); save(true); location.hash = '#/puzzle/' + id; tickBadge(); return;
      }
      if (t.entry && S.journal.find(x => x.id === t.entry)) {
        const e = S.journal.find(x => x.id === t.entry);
        e.minutes = (e.minutes || 0) + mins;
        if (t.scratch.trim()) e.attempt = (e.attempt ? e.attempt.trim() + '\n\n' : '') + t.scratch.trim();
        e.updated = new Date().toISOString(); save(true);
        S.timer = null; save(true); location.hash = '#/journal/' + e.id;
      } else {
        const e = newEntry({ question: t.q, module: t.module, attempt: t.scratch, minutes: mins });
        S.timer = null; save(true); location.hash = '#/journal/' + e.id;
      }
      tickBadge();
    };
    paint();
  }

  function renderMap() {
    view.innerHTML = `<iframe class="mapframe" src="map.html" title="Concept map"></iframe>`;
  }

  // ----- puzzles: one problem you carry -----
  let PUZZLES = null;
  async function loadPuzzles() {
    if (PUZZLES) return PUZZLES;
    try { PUZZLES = parsePuzzles(await getText('puzzles/puzzles.md')); } catch (e) { PUZZLES = []; }
    return PUZZLES;
  }
  function parsePuzzles(txt) {
    return txt.split(/^## /m).slice(1).map(part => {
      const lines = part.split('\n');
      const [id, ...t] = lines[0].split(' · ');
      const meta = {};
      (lines[1] || '').split(' · ').forEach(kv => { const i = kv.indexOf(':'); if (i > 0) meta[kv.slice(0, i).trim()] = kv.slice(i + 1).trim(); });
      const sec = {};
      lines.slice(2).join('\n').split(/^### /m).slice(1).forEach(sx => {
        const nl = sx.indexOf('\n');
        sec[sx.slice(0, nl).trim().toLowerCase()] = sx.slice(nl + 1).replace(/\n-{3,}\s*$/, '').trim();
      });
      const hints = (sec.hints || '').split(/^\d+\.\s+/m).map(h => h.trim()).filter(Boolean);
      return { id: id.trim(), title: t.join(' · ').trim(), module: meta.module || '', scale: meta.scale || 'week',
        difficulty: +meta.difficulty || 1, problem: sec.problem || '', why: sec['why it matters'] || '',
        hints, solution: sec['solution sketch'] || '', extension: sec['keep carrying'] || '' };
    }).filter(p => p.id && p.title && p.problem);
  }
  const allPuzzles = () => [...(PUZZLES || []), ...S.customPuzzles];
  const getPuzzle = id => allPuzzles().find(p => p.id === id);
  function pzState(id) { return S.pz[id] || (S.pz[id] = { log: [], status: 'new', hintsOpen: 0, solutionSeen: false }); }
  const thoughtDays = st => new Set(st.log.map(l => localDay(new Date(l.at)))).size;
  const daysSince = iso => Math.floor((Date.parse(localDay()) - Date.parse(localDay(new Date(iso)))) / 864e5) + 1;

  // Schedule anchored to the week this feature was added (Monday 16 Nov 2026).
  const EPOCH = Date.UTC(2026, 10, 16);
  function scheduled(cadence = S.pzCadence) {
    const list = (PUZZLES || []).filter(p => p.scale === cadence);
    if (!list.length) return null;
    const now = new Date(), utcToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    let idx, label;
    if (cadence === 'month') {
      idx = (now.getFullYear() - 2026) * 12 + now.getMonth() - 10;
      label = 'Puzzle of the month · ' + now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    } else {
      idx = Math.floor((utcToday - EPOCH) / (7 * 864e5));
      const mon = new Date(EPOCH + idx * 7 * 864e5), sun = new Date(mon.getTime() + 6 * 864e5);
      const f = d => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
      label = `Puzzle of the week · ${f(mon)} – ${f(sun)}`;
    }
    return { puzzle: list[((idx % list.length) + list.length) % list.length], label };
  }
  const diffDots = d => `<span class="diff" title="difficulty ${d} of 3">${'●'.repeat(d)}${'○'.repeat(3 - d)}</span>`;
  function pzChips(p) {
    const m = MOD[p.module];
    return `<div class="row small" style="gap:10px">
      ${m ? `<span style="--mc:${m.color}"><span class="dot"></span>${m.name}</span>` : ''}
      <span class="chip">${p.scale === 'month' ? 'monthly' : p.scale === 'mine' ? 'my puzzle' : 'weekly'}</span>
      ${p.scale !== 'mine' ? diffDots(p.difficulty) : ''}</div>`;
  }
  function statusChip(p) {
    const st = S.pz[p.id]; const carrying = S.carry && S.carry.id === p.id;
    if (carrying) return '<span class="chip open">carrying</span>';
    if (st && st.status === 'solved') return '<span class="chip done">solved</span>';
    if (st && st.log.length) return `<span class="chip">thought on ${thoughtDays(st)} day${thoughtDays(st) > 1 ? 's' : ''}</span>`;
    return '';
  }

  async function puzzleHomeCard() {
    await loadPuzzles();
    const carried = S.carry && getPuzzle(S.carry.id);
    if (carried) {
      const st = pzState(carried.id), last = st.log[0];
      return `<h2>The puzzle you're carrying</h2>
        <div class="card pzcard"><div class="eyebrow">Day ${daysSince(S.carry.since)} · thought on ${thoughtDays(st)} day${thoughtDays(st) === 1 ? '' : 's'}</div>
        <h3 style="font-size:1.15rem;margin:4px 0 6px"><a href="#/puzzle" style="color:inherit;text-decoration:none">${esc(carried.title)}</a></h3>
        ${last ? `<div class="muted small" style="margin-bottom:10px">Last thought (${fmtDate(last.at)}): “${esc(last.text.slice(0, 140))}${last.text.length > 140 ? '…' : ''}”</div>` : '<div class="muted small" style="margin-bottom:10px">No thoughts logged yet. Even a wrong idea counts.</div>'}
        <div class="row"><a class="btn primary" href="#/puzzle">Add a thought</a><a class="btn" href="#/focus?p=${carried.id}">Focus on it</a></div></div>`;
    }
    const sc = scheduled(); if (!sc) return '';
    return `<h2>${esc(sc.label.split(' · ')[0])}</h2>
      <div class="card pzcard"><div class="eyebrow">${esc(sc.label.split(' · ')[1])}</div>
      <h3 style="font-size:1.15rem;margin:4px 0 6px">${esc(sc.puzzle.title)}</h3>${pzChips(sc.puzzle)}
      <div class="row" style="margin-top:12px"><a class="btn primary" href="#/puzzle">Look at it</a><a class="btn" href="#/puzzles">All puzzles</a></div></div>`;
  }

  async function renderPuzzle(id) {
    await loadPuzzles();
    let p, label = '';
    if (id) p = getPuzzle(id);
    else if (S.carry && getPuzzle(S.carry.id)) p = getPuzzle(S.carry.id);
    else { const sc = scheduled(); if (sc) { p = sc.puzzle; label = sc.label; } }
    if (!p) throw new Error('No puzzle found');
    const st = pzState(p.id), carrying = !!(S.carry && S.carry.id === p.id);
    const D = thoughtDays(st), mins = st.log.reduce((a, l) => a + (l.minutes || 0), 0);
    const md = t => MD.render(t || '', { resolveLink: resolveFrom('puzzles/') });
    const solved = st.status === 'solved';
    const showSolution = solved || st.solutionSeen;
    const H = p.hints.length;
    if (carrying) { S.last = { href: '#/puzzle', title: 'Puzzle: ' + p.title }; save(); }

    let hintsHtml = '';
    if (H) {
      hintsHtml = p.hints.slice(0, st.hintsOpen).map((h, i) => `<div class="hint"><div class="eyebrow">Hint ${i + 1}</div>${md(h)}</div>`).join('');
      if (st.hintsOpen < H) {
        const need = st.hintsOpen + 1 - D;
        hintsHtml += need <= 0
          ? `<button class="btn" id="hintBtn">Reveal hint ${st.hintsOpen + 1} of ${H}</button>`
          : `<div class="lock">🔒 Hint ${st.hintsOpen + 1} of ${H} unlocks after you log a thought on ${need} more day${need > 1 ? 's' : ''}. Hints reward carrying, not rushing.</div>`;
      }
    }
    const peekReady = !H || (st.hintsOpen >= H && D >= H + 1);
    let solHtml;
    if (p.scale === 'mine') solHtml = solved ? '<p class="muted">You marked this solved. 🎉</p>' : '';
    else if (showSolution) solHtml = `<div class="hint sol"><div class="eyebrow">Solution sketch</div>${md(p.solution)}</div>
        ${p.extension ? `<div class="hint ext"><div class="eyebrow">Keep carrying</div>${md(p.extension)}</div>` : ''}`;
    else solHtml = `<div class="lock">🔒 The solution sketch opens when you mark the puzzle solved, so you can compare. ${H ? `Or, if you're truly stuck: open all ${H} hints and think on ${H + 1} different days.` : ''}</div>
        ${peekReady && !solved ? '<button class="btn" id="peek">Show me the solution</button>' : ''}`;

    view.innerHTML = `
      <div class="row small"><a href="#/puzzles">← All puzzles</a></div>
      <div class="eyebrow" style="margin-top:12px">${carrying ? `You're carrying this · day ${daysSince(S.carry.since)}` : esc(label || (p.scale === 'month' ? 'Monthly puzzle' : p.scale === 'mine' ? 'My puzzle' : 'Weekly puzzle'))}</div>
      <h1>${esc(p.title)}</h1>
      ${pzChips(p)}
      ${carrying || st.log.length ? `<p class="muted small" style="margin:8px 0 0">Thought on ${D} day${D === 1 ? '' : 's'} · ${st.log.length} note${st.log.length === 1 ? '' : 's'}${mins ? ` · ${mins} min focused` : ''} ${solved ? ' · <b style="color:var(--good)">solved</b>' : ''}</p>` : ''}
      <article class="doc problem">${md(p.problem)}</article>
      ${p.why ? `<details class="why"><summary>Why it matters</summary><div class="doc">${md(p.why)}</div></details>` : ''}

      <div class="row" style="margin:16px 0">
        ${carrying ? `<a class="btn primary" href="#/focus?p=${p.id}">Focus on it</a>` : `<button class="btn primary" id="carry">Carry this puzzle</button>`}
        <a class="btn" href="#/journal/new?m=${esc(p.module)}&q=${encodeURIComponent('Puzzle “' + p.title + '”: ')}">Journal question</a>
        ${!solved ? '<button class="btn" id="solvedBtn">I solved it!</button>' : ''}
        ${carrying ? '<span class="spacer"></span><button class="btn ghost" id="setdown">Set it down</button>' : ''}
      </div>
      ${!carrying && S.carry && getPuzzle(S.carry.id) ? `<p class="muted small">You're currently carrying <a href="#/puzzle">${esc(getPuzzle(S.carry.id).title)}</a>. Carrying this one will set that one down (its notes are kept).</p>` : ''}

      <h2>Thoughts</h2>
      <p class="muted small">Log anything: a small case, a wrong idea, a picture you'd draw, a question. Coming back on different days is what unlocks hints.</p>
      <textarea id="thought" rows="3" placeholder="What I noticed today…"></textarea>
      <div class="row" style="margin:8px 0 14px"><button class="btn primary" id="addThought">Add thought</button></div>
      <div id="tlog">${st.log.map((l, i) => `<div class="thought"><div class="meta">${fmtDate(l.at)}${l.minutes ? ` · ${l.minutes} min focus` : ''}<button class="x" data-i="${i}" aria-label="Delete thought">×</button></div><div>${esc(l.text).replace(/\n/g, '<br>')}</div></div>`).join('') || '<div class="empty" style="padding:12px">No thoughts yet.</div>'}</div>

      ${H || p.scale !== 'mine' ? `<h2>Hints</h2>${hintsHtml || '<p class="muted small">No hints for this one.</p>'}` : ''}
      ${solHtml ? `<h2>Solution</h2>${solHtml}` : ''}
      ${p.scale === 'mine' ? '<div class="row" style="margin-top:20px"><button class="btn danger" id="delP">Delete this puzzle</button></div>' : ''}`;

    const carry = () => {
      S.carry = { id: p.id, since: new Date().toISOString() };
      if (st.status === 'new') st.status = 'carrying';
      mark(); save(true); toast('Carrying it. Let it sit in the back of your mind.');
      if (!id) renderPuzzle(null); else location.hash = '#/puzzle';
    };
    const cb = $('#carry'); if (cb) cb.onclick = () => {
      if (S.carry && getPuzzle(S.carry.id) && S.carry.id !== p.id && !confirm(`Set down “${getPuzzle(S.carry.id).title}” and carry this one instead?`)) return;
      carry();
    };
    $('#addThought').onclick = () => {
      const v = $('#thought').value.trim(); if (!v) return toast('Write a thought first');
      st.log.unshift({ at: new Date().toISOString(), text: v });
      if (!S.carry && st.status !== 'solved') { S.carry = { id: p.id, since: new Date().toISOString() }; toast('Logged, and you are now carrying this puzzle'); }
      else toast('Logged');
      mark(); save(true); renderPuzzle(id);
    };
    $('#tlog').onclick = e => { const b = e.target.closest('.x'); if (!b) return; if (confirm('Delete this thought?')) { st.log.splice(+b.dataset.i, 1); save(true); renderPuzzle(id); } };
    const hb = $('#hintBtn'); if (hb) hb.onclick = () => { st.hintsOpen++; mark(); save(true); renderPuzzle(id); };
    const pk = $('#peek'); if (pk) pk.onclick = () => { if (confirm('Look at the solution sketch? You can still keep carrying the "Keep carrying" extension afterwards.')) { st.solutionSeen = true; save(true); renderPuzzle(id); } };
    const sb = $('#solvedBtn'); if (sb) sb.onclick = () => {
      if (!st.log.length && !confirm('Mark solved without writing down your solution? Writing it in your own words is the best part.')) return;
      st.status = 'solved'; st.solvedAt = new Date().toISOString(); mark(); save(true);
      toast('Solved! Compare with the sketch, then try "Keep carrying".'); renderPuzzle(id);
    };
    const sd = $('#setdown'); if (sd) sd.onclick = () => { if (confirm('Set this puzzle down? Your thoughts are kept and you can pick it up again any time.')) { S.carry = null; if (st.status === 'carrying') st.status = 'paused'; save(true); location.hash = '#/puzzles'; } };
    const dp = $('#delP'); if (dp) dp.onclick = () => { if (confirm('Delete this puzzle and its thoughts?')) { S.customPuzzles = S.customPuzzles.filter(x => x.id !== p.id); delete S.pz[p.id]; if (S.carry && S.carry.id === p.id) S.carry = null; save(true); location.hash = '#/puzzles'; } };
  }

  let pzFilter = 'all';
  async function renderPuzzleLib() {
    await loadPuzzles();
    const sw = scheduled('week'), sm = scheduled('month');
    const carried = S.carry && getPuzzle(S.carry.id);
    const row = p => `<a class="entry" href="#/puzzle/${p.id}"><div class="row"><span class="q">${esc(p.title)}</span><span class="spacer"></span>${statusChip(p)}</div><div style="margin-top:4px">${pzChips(p)}</div></a>`;
    view.innerHTML = `
      <div class="row"><h1 style="margin:0">Puzzles</h1><span class="spacer"></span><a class="btn" href="#/puzzles/new">+ My own puzzle</a></div>
      <p class="lede">One problem at a time, carried for days. Hints unlock as you come back to it on different days.</p>
      ${carried ? `<div class="card pzcard" style="margin-bottom:16px"><div class="eyebrow">Carrying · day ${daysSince(S.carry.since)}</div><h3 style="margin:4px 0 0"><a href="#/puzzle" style="color:inherit">${esc(carried.title)}</a></h3></div>` : ''}
      <div class="grid">
        ${sw ? `<a class="card" href="#/puzzle/${sw.puzzle.id}"><div class="eyebrow">${esc(sw.label)}</div><h3 style="margin-top:4px">${esc(sw.puzzle.title)}</h3>${pzChips(sw.puzzle)}</a>` : ''}
        ${sm ? `<a class="card" href="#/puzzle/${sm.puzzle.id}"><div class="eyebrow">${esc(sm.label)}</div><h3 style="margin-top:4px">${esc(sm.puzzle.title)}</h3>${pzChips(sm.puzzle)}</a>` : ''}
      </div>
      <div class="row" style="margin:18px 0 10px">
        <span class="muted small">Featured on Home:</span>
        <div class="seg" id="cad">${['week', 'month'].map(c => `<button data-c="${c}" class="${S.pzCadence === c ? 'on' : ''}">${c === 'week' ? 'puzzle of the week' : 'puzzle of the month'}</button>`).join('')}</div>
      </div>
      <h2>Library</h2>
      <div class="seg" id="pf" style="margin-bottom:12px">${[['all', 'all'], ['week', 'weekly'], ['month', 'monthly'], ['mine', 'mine'], ['solved', 'solved']].map(([k, l]) => `<button data-f="${k}" class="${pzFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div id="plist"></div>`;
    const draw = () => {
      const list = allPuzzles().filter(p => pzFilter === 'all' || (pzFilter === 'solved' ? S.pz[p.id]?.status === 'solved' : p.scale === pzFilter));
      $('#plist').innerHTML = list.map(row).join('') || `<div class="empty">${pzFilter === 'mine' ? 'Add a problem of your own: something you saw, wondered, or read.' : 'Nothing here yet.'}</div>`;
    };
    $('#pf').onclick = e => { const f = e.target.dataset.f; if (!f) return; pzFilter = f; [...$('#pf').children].forEach(b => b.classList.toggle('on', b.dataset.f === f)); draw(); };
    $('#cad').onclick = e => { const c = e.target.dataset.c; if (!c) return; S.pzCadence = c; save(); renderPuzzleLib(); };
    draw();
  }

  function renderPuzzleNew() {
    view.innerHTML = `
      <a href="#/puzzles" class="small">← Puzzles</a>
      <h1 style="margin-top:8px">My own puzzle</h1>
      <p class="lede">Something you read, overheard, or wondered. A good puzzle to carry is one you can state in a few lines but can't see through yet.</p>
      <label class="field"><span>Title</span><input type="text" id="pt" placeholder="e.g. Can every even number > 2 be written as a sum of two primes?"></label>
      <label class="field"><span>Module</span><select id="pm"><option value="">None</option>${MODULES.map(m => `<option value="${m.id}">${m.num} ${m.name}</option>`).join('')}</select></label>
      <label class="field"><span>The problem</span><textarea id="ps" rows="6" placeholder="State it as precisely as you can. Markdown works."></textarea></label>
      <div class="row"><button class="btn primary" id="psave">Save and carry it</button><button class="btn" id="psave2">Save</button></div>`;
    const go = carry => {
      const title = $('#pt').value.trim(), problem = $('#ps').value.trim();
      if (!title || !problem) return toast('Give it a title and a statement');
      const p = { id: 'my-' + uid(), title, module: $('#pm').value, scale: 'mine', difficulty: 0, problem, why: '', hints: [], solution: '', extension: '' };
      S.customPuzzles.unshift(p);
      if (carry) { if (S.carry && getPuzzle(S.carry.id) && !confirm(`Set down “${getPuzzle(S.carry.id).title}”?`)) carry = false; }
      if (carry) { S.carry = { id: p.id, since: new Date().toISOString() }; pzState(p.id).status = 'carrying'; }
      mark(); save(true); location.hash = carry ? '#/puzzle' : '#/puzzle/' + p.id;
    };
    $('#psave').onclick = () => go(true); $('#psave2').onclick = () => go(false);
  }

  // ----- settings -----
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; installBar(); if (location.hash === '#/settings') renderSettings(); });
  window.addEventListener('appinstalled', () => { installEvt = null; installBar(); toast('Installed. Find it on your home screen.'); });

  // Install banner: one-tap install on Chrome/Edge/Android, step-by-step on iPhone/iPad.
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = () => isIOS() || /android/i.test(navigator.userAgent);
  function dismissedRecently() { try { return Date.now() - (+localStorage.getItem('ps.installDismissed') || 0) < 7 * 864e5; } catch (e) { return false; } }
  function installBar() {
    const bar = $('#installBar'); if (!bar) return;
    let html = '';
    if (!isStandalone() && !dismissedRecently()) {
      if (installEvt) html = `<img src="icons/icon-192.png" alt="" width="36" height="36"><div class="ib-text"><b>Install Profound Studies</b><span>Opens full-screen from your home screen and works offline.</span></div><button class="btn primary" id="ibGo">Install</button>`;
      else if (isIOS()) html = `<img src="icons/icon-192.png" alt="" width="36" height="36"><div class="ib-text"><b>Add to your home screen</b><span>Tap <svg class="share" viewBox="0 0 24 24" aria-label="Share"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8"/></svg> Share, then <b>Add to Home Screen</b>.</span></div>`;
      else if (isMobile()) html = `<img src="icons/icon-192.png" alt="" width="36" height="36"><div class="ib-text"><b>Add to your home screen</b><span>Open your browser menu (⋮) and choose <b>Install app</b> or <b>Add to Home screen</b>.</span></div>`;
    }
    if (html) html += `<button class="ib-x" id="ibX" aria-label="Dismiss">×</button>`;
    bar.innerHTML = html; bar.hidden = !html;
    const go = $('#ibGo'); if (go) go.onclick = async () => { installEvt.prompt(); const r = await installEvt.userChoice; installEvt = null; if (r.outcome !== 'accepted') { try { localStorage.setItem('ps.installDismissed', Date.now()); } catch (e) { } } installBar(); };
    const x = $('#ibX'); if (x) x.onclick = () => { try { localStorage.setItem('ps.installDismissed', Date.now()); } catch (e) { } installBar(); };
  }
  function applyTheme() { if (S.theme === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', S.theme); }
  function renderSettings() {
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    view.innerHTML = `
      <h1>Settings</h1>
      <h2>Appearance</h2>
      <div class="seg" id="th">${['system', 'light', 'dark'].map(s => `<button data-t="${s}" class="${S.theme === s ? 'on' : ''}">${s}</button>`).join('')}</div>
      <h2>Install</h2>
      <p class="muted small">${standalone ? 'Running as an installed app. ✓' : installEvt ? 'Install this as an app so it opens full-screen and works offline.' : 'In Chrome or Edge, use the install icon in the address bar. On iPhone, use Safari → Share → Add to Home Screen.'}</p>
      ${installEvt && !standalone ? '<button class="btn primary" id="inst">Install app</button>' : ''}
      <p class="muted small" id="sw">Offline: checking…</p>
      <h2>Your data</h2>
      <p class="muted small">Progress, notes, journal and timer are stored only in this browser. Export a backup now and then, or to move to another device. Exported Markdown can be committed to the repo.</p>
      <div class="row">
        <button class="btn" id="bk">Export backup (.json)</button>
        <label class="btn">Import backup<input type="file" id="imp" accept="application/json,.json" hidden></label>
        <button class="btn" id="jm">Export journal (.md)</button>
        <button class="btn" id="nm">Export notes (.md)</button>
      </div>
      <div class="row" style="margin-top:18px"><button class="btn danger" id="wipe">Erase everything…</button></div>
      <h2>About</h2>
      <p class="muted small">Profound Studies, a companion for studying what interests me: to understand, not just to prove. The interactive pages, guides and essay are files in this repo, and this app is a lens over them.</p>`;
    $('#th').onclick = e => { const t = e.target.dataset.t; if (!t) return; S.theme = t; save(); applyTheme(); renderSettings(); };
    const inst = $('#inst'); if (inst) inst.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; renderSettings(); };
    $('#bk').onclick = () => download(`profound-studies-backup-${localDay()}.json`, JSON.stringify(S, null, 2), 'application/json');
    $('#imp').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (typeof data !== 'object' || !Array.isArray(data.journal)) throw new Error('not a backup');
        if (!confirm('Replace all current data with this backup?')) return;
        S = Object.assign(blank(), data); save(true); applyTheme(); toast('Backup restored'); renderSettings();
      } catch (err) { toast('That file is not a valid backup'); }
    };
    $('#jm').onclick = exportJournal;
    $('#nm').onclick = () => {
      const parts = MODULES.filter(m => (S.notes[m.id] || '').trim()).map(m => `## ${m.num} · ${m.name}\n\n${S.notes[m.id].trim()}\n`);
      if (!parts.length) return toast('No notes yet');
      download(`notes-${localDay()}.md`, `# My notes\n\n${parts.join('\n')}`);
    };
    $('#wipe').onclick = () => { if (confirm('Erase all progress, notes and journal entries on this device? Export a backup first if unsure.')) { S = blank(); save(true); applyTheme(); toast('Erased'); location.hash = '#/'; } };
    if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistration().then(r => { $('#sw') && ($('#sw').textContent = r ? 'Offline: ready. Everything in the app is cached on this device.' : 'Offline: not available (open the app over http(s), not as a local file).'); });
    else $('#sw').textContent = 'Offline: not supported in this browser.';
  }

  // ---------- boot ----------
  applyTheme();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tickBadge(); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
  tickBadge();
  installBar();
  route();
})();
