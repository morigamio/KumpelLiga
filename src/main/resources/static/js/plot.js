/* <kl-plot>: statistics view that draws one line per member over the season.
   Scope = resolution of the x-axis (per gameday or per game), metric = what the line shows.
   Loads games and the league's paid bets itself (GET /games, GET /leagues/{id}/bets) so it does not
   depend on load order; refreshRanking() (statistics.js) calls reload() after bets or live changes.
   Reads ME (shell.js). Styles: css/plot.css */

const PLOT_SCOPES = {
  gameday: { label: 'Gamedays', title: 'One point per gameday' },
  game:    { label: 'Games',    title: 'One point per game, in kickoff order' }
};
const PLOT_METRICS = {
  points:  { label: 'Points',      title: 'Total points so far' },
  yield:   { label: 'Yield',       title: 'Average points per settled bet so far' },
  highest: { label: 'Highest win', title: 'Highest single win so far' }
};
/* fixed categorical order, assigned by member (sorted by name) so a member keeps their colour */
const PLOT_COLORS = ['#2a78d6','#eb6834','#1baf7a','#eda100','#e87ba4','#008300','#4a3aa7','#e34948'];
const PLOT_OTHER = '#9a958a';
const PLOT_PREF_KEY = 'kl.plot';

customElements.define('kl-plot', class extends HTMLElement {
  connectedCallback(){
    let pref = {};
    try { pref = JSON.parse(localStorage.getItem(PLOT_PREF_KEY)) || {}; } catch (e) {}
    this.scope  = PLOT_SCOPES[pref.scope]   ? pref.scope  : 'gameday';
    this.metric = PLOT_METRICS[pref.metric] ? pref.metric : 'points';
    this.series = null;   // [{name, color, values:[...]}] for the current scope/metric
    this.xs = null;       // x positions: [{label, gameDay, boundary}]

    this.innerHTML =
      '<div class="plot-bar">'+
        this.segHtml('scope', PLOT_SCOPES, this.scope)+
        this.segHtml('metric', PLOT_METRICS, this.metric)+
      '</div>'+
      '<div class="plot-area"><div class="empty"><span class="spinner"></span></div></div>'+
      '<div class="plot-legend"></div>';
    this.querySelectorAll('.plot-bar button').forEach(b => b.onclick = () => this.select(b.dataset.group, b.dataset.key));
    this.ro = new ResizeObserver(() => { if (this.series) this.draw(); });
    this.ro.observe(this);
    this.load();
  }
  disconnectedCallback(){ if (this.ro) this.ro.disconnect(); }

  segHtml(group, defs, active){
    let s = '<div class="seg" data-group="'+group+'">';
    for (const [key, d] of Object.entries(defs)){
      s += '<button class="'+(key===active?'active':'')+'" data-group="'+group+'" data-key="'+key+'" title="'+d.title+'">'+d.label+'</button>';
    }
    return s+'</div>';
  }

  select(group, key){
    this[group] = key;
    this.querySelectorAll('.seg[data-group="'+group+'"] button').forEach(b => b.classList.toggle('active', b.dataset.key === key));
    try { localStorage.setItem(PLOT_PREF_KEY, JSON.stringify({scope: this.scope, metric: this.metric})); } catch (e) {}
    this.compute(); this.draw();
  }

  /* ---------------- data ---------------- */
  async load(){
    const leagueId = new URLSearchParams(location.search).get('id');
    const [gamesRes, betsRes] = await Promise.all([ api('GET','/games'), api('GET','/leagues/'+leagueId+'/bets') ]);
    if (!gamesRes.ok || !betsRes.ok){
      this.querySelector('.plot-area').innerHTML = '<div class="empty">Could not load plot data.</div>'; return;
    }
    this.games = (gamesRes.data||[]).slice().sort((a,b)=> (a.gameDay-b.gameDay) || (new Date(a.matchTime)-new Date(b.matchTime)));
    this.bets = betsRes.data||[];
    this.compute(); this.draw();
  }
  reload(){ return this.load(); }

  /* Builds this.xs and this.series for the current scope and metric. */
  compute(){
    const betsByGame = {};
    for (const b of this.bets){ (betsByGame[b.gameId] = betsByGame[b.gameId] || []).push(b); }

    // only games up to the last one with a settled bet; the season's tail stays out
    let last = -1;
    this.games.forEach((g,i)=>{ if (betsByGame[g.id]) last = i; });
    const games = this.games.slice(0, last+1);

    // members: everyone in the league, alphabetical, so colours are stable
    const names = new Set(this.bets.map(b => b.owner));
    if (typeof cur !== 'undefined' && cur && cur.league) (cur.league.participants||[]).forEach(p => names.add(p.name));
    const members = [...names].sort((a,b)=> a.localeCompare(b));

    // x positions: one per game, or one per gameday (its last game)
    const xs = [];
    if (this.scope === 'game'){
      games.forEach((g,i)=> xs.push({ games:[g], gameDay:g.gameDay, boundary: i===0 || games[i-1].gameDay !== g.gameDay,
                                      label: g.homeTeam+' – '+g.awayTeam }));
    } else {
      const byDay = new Map();
      games.forEach(g => { if (!byDay.has(g.gameDay)) byDay.set(g.gameDay, []); byDay.get(g.gameDay).push(g); });
      for (const [day, dayGames] of byDay) xs.push({ games: dayGames, gameDay: day, boundary: true, label: 'Gameday '+day });
    }

    // running state per member, sampled at every x
    const series = members.map((name,i)=> ({ name, color: i < PLOT_COLORS.length ? PLOT_COLORS[i] : PLOT_OTHER, values: [],
                                            sum: 0, count: 0, max: 0 }));
    const byName = Object.fromEntries(series.map(s => [s.name, s]));
    for (const x of xs){
      for (const g of x.games) for (const b of (betsByGame[g.id]||[])){
        const s = byName[b.owner]; if (!s) continue;
        const w = Number(b.winnings||0);
        s.sum += w; s.count += 1; s.max = Math.max(s.max, w);
      }
      for (const s of series){
        s.values.push(this.metric === 'points' ? s.sum : this.metric === 'yield' ? (s.count ? s.sum/s.count : 0) : s.max);
      }
    }
    this.xs = xs; this.series = series;
  }

  /* ---------------- drawing ---------------- */
  draw(){
    const area = this.querySelector('.plot-area'), legend = this.querySelector('.plot-legend');
    if (!this.xs.length){ area.innerHTML = '<div class="empty">No settled bets yet.</div>'; legend.innerHTML=''; return; }

    const W = Math.max(280, area.clientWidth || this.clientWidth || 600), H = 260;
    const m = { l: 40, r: 14, t: 14, b: 26 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const n = this.xs.length;
    const xAt = i => m.l + (n === 1 ? iw/2 : i * iw/(n-1));
    let maxV = 0; for (const s of this.series) for (const v of s.values) maxV = Math.max(maxV, v);
    const ticks = niceTicks(0, maxV || 1, 4);
    const top = ticks[ticks.length-1];
    const yAt = v => m.t + ih - (v/top)*ih;
    const yb = m.t + ih;

    let svg = '<svg class="plot-svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'">';
    // gridlines + y labels
    for (const t of ticks){
      svg += '<line class="grid" x1="'+m.l+'" x2="'+(W-m.r)+'" y1="'+yAt(t)+'" y2="'+yAt(t)+'"/>'+
             '<text class="ylab" x="'+(m.l-8)+'" y="'+(yAt(t)+3.5)+'" text-anchor="end">'+fmtTick(t)+'</text>';
    }
    // gameday boundaries and x labels (thin out labels when there are many gamedays)
    const days = this.xs.filter(x => x.boundary).length;
    const every = days > 17 ? 2 : 1;
    let d = 0;
    this.xs.forEach((x,i)=>{
      if (!x.boundary) return;
      d++;
      if (this.scope === 'game' && i > 0) svg += '<line class="guide" x1="'+xAt(i)+'" x2="'+xAt(i)+'" y1="'+m.t+'" y2="'+yb+'"/>';
      if (d % every === 1 || every === 1) svg += '<text class="xlab" x="'+xAt(i)+'" y="'+(H-8)+'" text-anchor="middle">'+x.gameDay+'</text>';
    });
    svg += '<line class="axis" x1="'+m.l+'" x2="'+(W-m.r)+'" y1="'+yb+'" y2="'+yb+'"/>';
    // lines: others first, me last so my line sits on top
    const ordered = this.series.slice().sort((a,b)=> (a.name===ME) - (b.name===ME));
    for (const s of ordered){
      const pts = s.values.map((v,i)=> xAt(i).toFixed(1)+','+yAt(v).toFixed(1)).join(' ');
      svg += '<polyline class="line'+(s.name===ME?' me':'')+'" data-name="'+escapeHtml(s.name)+'" points="'+pts+'" stroke="'+s.color+'"/>';
      const li = s.values.length-1;
      svg += '<circle class="end" data-name="'+escapeHtml(s.name)+'" cx="'+xAt(li)+'" cy="'+yAt(s.values[li])+'" r="'+(s.name===ME?4:3.5)+'" fill="'+s.color+'"/>';
    }
    // hover layer
    svg += '<line class="cross off" x1="0" x2="0" y1="'+m.t+'" y2="'+yb+'"/>'+
           '<rect class="hit" x="'+m.l+'" y="'+m.t+'" width="'+iw+'" height="'+ih+'" fill="transparent"/>'+
           '</svg><div class="tip" hidden></div>';
    area.innerHTML = svg;

    // legend: line key + name, keyed to the series colour; text stays in text colour
    legend.innerHTML = this.series.map(s =>
      '<span class="key" data-name="'+escapeHtml(s.name)+'"><i style="background:'+s.color+'"></i>'+escapeHtml(s.name)+
      (s.name===ME?' <span class="status-tag">you</span>':'')+'</span>').join('');
    legend.querySelectorAll('.key').forEach(k => {
      k.onmouseenter = () => this.highlight(k.dataset.name);
      k.onmouseleave = () => this.highlight(null);
    });

    // crosshair + tooltip
    const svgEl = area.querySelector('svg'), hit = area.querySelector('.hit'), cross = area.querySelector('.cross'), tip = area.querySelector('.tip');
    const toIndex = (clientX) => {
      const r = svgEl.getBoundingClientRect();
      const px = (clientX - r.left) * (W / r.width);
      return Math.max(0, Math.min(n-1, Math.round((px - m.l) / (n === 1 ? 1 : iw/(n-1)))));
    };
    hit.onmousemove = (e) => {
      const i = toIndex(e.clientX);
      cross.setAttribute('x1', xAt(i)); cross.setAttribute('x2', xAt(i)); cross.classList.remove('off');
      const rows = this.series.map(s => ({s, v: s.values[i]})).sort((a,b)=> b.v - a.v);
      tip.innerHTML = '<div class="tip-h">'+escapeHtml(this.xs[i].label)+(this.scope==='game' ? ' <span class="muted">· gameday '+this.xs[i].gameDay+'</span>' : '')+'</div>'+
        rows.map(r => '<div class="tip-r'+(r.s.name===ME?' me':'')+'"><i style="background:'+r.s.color+'"></i><span>'+escapeHtml(r.s.name)+'</span><b>'+fmtPts(r.v)+'</b></div>').join('');
      tip.hidden = false;
      const ar = area.getBoundingClientRect(), left = (xAt(i) / W) * ar.width;
      tip.style.left = (left + 12 + tip.offsetWidth > ar.width ? left - 12 - tip.offsetWidth : left + 12) + 'px';
      tip.style.top = Math.max(0, Math.min(e.clientY - ar.top - 20, ar.height - tip.offsetHeight)) + 'px';
    };
    hit.onmouseleave = () => { cross.classList.add('off'); tip.hidden = true; };
  }

  /* dims every line but the named one; null restores all */
  highlight(name){
    this.querySelectorAll('.plot-svg .line, .plot-svg .end').forEach(el => {
      el.classList.toggle('dim', !!name && el.getAttribute('data-name') !== name);
    });
  }
});

/* nice rounded ticks from 0 up to just above max */
function niceTicks(min, max, count){
  const raw = (max - min) / count;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m*pow).find(s => s >= raw);
  const ticks = [];
  for (let v = 0; v < max + step; v += step) ticks.push(+v.toFixed(6));
  return ticks;
}
function fmtTick(v){ return Number.isInteger(v) ? String(v) : String(+v.toFixed(2)); }
