/* <kl-ranking>: the points table, one statistics view. Reads ME (shell.js).
   Shown inside <kl-statistics>, which calls render(list) with the ranking data. */

customElements.define('kl-ranking', class extends HTMLElement {
  connectedCallback(){
    if (!this.innerHTML) this.innerHTML = '<div class="empty"><span class="spinner"></span></div>';
  }

  render(list){
    if (!list || !list.length){ this.innerHTML='<div class="empty">No members yet.</div>'; return; }
    let rows='';
    list.forEach((p,i)=>{
      const rank=i+1;
      const g = rank<=3 ? ' g'+rank : '';
      rows += '<tr class="'+(p.name===ME?'me':'')+'">'+
        '<td><span class="rk'+g+'">'+rank+'</span></td>'+
        '<td>'+escapeHtml(p.name)+(p.name===ME?' <span class="status-tag">you</span>':'')+
          (p.status && p.status.toUpperCase()!=='APPROVED' ? ' <span class="status-tag">'+escapeHtml(p.status)+'</span>':'')+'</td>'+
        '<td class="r">'+fmtPts(p.balance)+'</td>'+
        '<td class="r">'+fmtPts(p.avgWinRate)+'</td>'+
        '<td class="r">'+fmtPts(p.highestWin)+'</td>'+
      '</tr>';
    });
    this.innerHTML =
      '<table class="rank"><thead><tr><th>#</th><th>Member</th><th class="r">Points</th>'+
      '<th class="r" title="Average points per bet">Yield</th>'+
      '<th class="r" title="Most points won with a single bet this season">Highest win</th></tr></thead>'+
      '<tbody>'+rows+'</tbody></table>';
  }
});
