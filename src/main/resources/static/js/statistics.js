/* <kl-statistics>: the statistics card on the league page. Renders the title, the view switcher
   and swaps the chosen view element (<kl-ranking>, <kl-plot>) into its content area.
   Plain markup, no shadow DOM, so css/league.css applies. Load after ranking.js and plot.js. */

const STAT_VIEWS = {
  ranking: { tag: 'kl-ranking', label: 'Ranking',
    icon: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+
          '<path d="M5 2h6v4a3 3 0 0 1-6 0V2z"/>'+           // cup
          '<path d="M5 3H2.5c0 2.5 1 3.5 2.5 3.5M11 3h2.5c0 2.5-1 3.5-2.5 3.5"/>'+  // handles
          '<path d="M8 9v3M5.5 14h5"/></svg>' },              // stem + base
  plot:    { tag: 'kl-plot', label: 'Plot',
    icon: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+
          '<path d="M2.5 2v11.5H14"/>'+          // axes
          '<path d="M5 10.5l3-4 2.5 2 3-4.5"/></svg>' }   // graph
};
const STAT_VIEW_KEY = 'kl.statView';

customElements.define('kl-statistics', class extends HTMLElement {
  connectedCallback(){
    this.ranking = null;   // last ranking list, kept so switching back re-renders without a fetch
    let buttons = '';
    for (const [key, v] of Object.entries(STAT_VIEWS)){
      buttons += '<button class="ghost" data-view="'+key+'" title="'+v.label+'" aria-label="'+v.label+'">'+v.icon+'</button>';
    }
    this.innerHTML =
      '<div class="section-title"><h2>Statistics</h2><div class="stat-bar">'+buttons+'</div></div>'+
      '<div class="stat-view"></div>';
    this.querySelectorAll('.stat-bar button').forEach(b => b.onclick = () => this.show(b.dataset.view));

    let saved = null;
    try { saved = localStorage.getItem(STAT_VIEW_KEY); } catch (e) {}
    this.show(STAT_VIEWS[saved] ? saved : 'ranking');
  }

  show(key){
    const view = STAT_VIEWS[key];
    if (!view) return;
    this.querySelectorAll('.stat-bar button').forEach(b => b.classList.toggle('active', b.dataset.view === key));
    const box = this.querySelector('.stat-view');
    box.innerHTML = '';
    const el = document.createElement(view.tag);
    box.appendChild(el);
    if (key === 'ranking' && this.ranking) el.render(this.ranking);
    try { localStorage.setItem(STAT_VIEW_KEY, key); } catch (e) {}
  }

  setRanking(list){
    this.ranking = list;
    const el = this.querySelector('kl-ranking');
    if (el) el.render(list);
  }

  setRankingError(text){
    const el = this.querySelector('kl-ranking');
    if (el) el.innerHTML = '<div class="empty">'+escapeHtml(text)+'</div>';
  }
});

/* Called after a bet or a live score change (gamecard.js, league.js). */
async function refreshRanking(){
  const stats = document.querySelector('kl-statistics');
  if (!stats || !cur) return;
  const r = await api('GET','/leagues/'+cur.league.id+'/ranking');
  if (r.ok) stats.setRanking(r.data);
  const plot = stats.querySelector('kl-plot');
  if (plot) plot.reload();
}
