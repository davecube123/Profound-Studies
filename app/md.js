/* A small Markdown renderer covering exactly what this repo's notes use:
   headings, paragraphs, lists (with [ ] checkboxes), code fences, tables,
   blockquotes, rules, **bold**, *italic*, `code` and [links](url).
   resolveLink(url) lets the app rewrite links; checkbox(text, checked) renders tasks. */
(function () {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function inline(text, opt) {
    const codes = [];
    let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = esc(s);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const r = opt.resolveLink ? opt.resolveLink(u) : { href: u };
      const ext = r.external ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${r.href}"${ext}>${t}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
    return s;
  }

  const isBlockStart = l => /^(#{1,6}\s|```|>|\s*([-*]|\d+\.)\s|\|)/.test(l) || /^-{3,}\s*$/.test(l);

  function render(src, opt = {}) {
    const lines = src.replace(/\r/g, '').split('\n');
    let out = '', i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      let m;
      if (l.startsWith('```')) {
        const buf = []; i++;
        while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
        i++; out += `<pre><code>${esc(buf.join('\n'))}</code></pre>`; continue;
      }
      if ((m = l.match(/^(#{1,6})\s+(.*)$/))) {
        const n = m[1].length, txt = m[2];
        const id = txt.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
        out += `<h${n} id="${id}">${inline(txt, opt)}</h${n}>`; i++; continue;
      }
      if (/^-{3,}\s*$/.test(l)) { out += '<hr>'; i++; continue; }
      if (l.startsWith('|') && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
        const row = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const head = row(l); i += 2; let body = '';
        while (i < lines.length && lines[i].startsWith('|')) {
          body += '<tr>' + row(lines[i]).map(c => `<td>${inline(c, opt)}</td>`).join('') + '</tr>'; i++;
        }
        out += `<div class="tablewrap"><table><thead><tr>${head.map(c => `<th>${inline(c, opt)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
        continue;
      }
      if (l.startsWith('>')) {
        const buf = [];
        while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
        out += `<blockquote>${render(buf.join('\n'), opt)}</blockquote>`; continue;
      }
      if ((m = l.match(/^\s*([-*]|\d+\.)\s+/))) {
        const ordered = /\d/.test(m[1]); const items = [];
        while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
          let item = lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''); i++;
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
          items.push(item);
        }
        const lis = items.map(it => {
          const t = it.match(/^\[( |x|X)\]\s+(.*)$/);
          if (t && opt.checkbox) return `<li class="task">${opt.checkbox(t[2], t[1] !== ' ', inline(t[2], opt))}</li>`;
          return `<li>${inline(it, opt)}</li>`;
        }).join('');
        out += ordered ? `<ol>${lis}</ol>` : `<ul>${lis}</ul>`; continue;
      }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) buf.push(lines[i++]);
      if (!buf.length) { buf.push(lines[i++]); }
      out += `<p>${inline(buf.join(' '), opt)}</p>`;
    }
    return out;
  }
  window.MD = { render, inline: (t, o = {}) => inline(t, o), esc };
})();
