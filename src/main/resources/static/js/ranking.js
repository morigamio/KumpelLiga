/* League page: the points table. Reads cur (league.js) and ME (shell.js). */

function renderRanking(list){
  const box = $('ranking');
  if (!list || !list.length){ box.innerHTML='<div class="empty">No members yet.</div>'; return; }
  let rows='';
  list.forEach((p,i)=>{
    const rank=i+1;
    const g = rank<=3 ? ' g'+rank : '';
    rows += '<tr class="'+(p.name===ME?'me':'')+'">'+
      '<td><span class="rk'+g+'">'+rank+'</span></td>'+
      '<td>'+escapeHtml(p.name)+(p.name===ME?' <span class="status-tag">you</span>':'')+
        (p.status && p.status.toUpperCase()!=='APPROVED' ? ' <span class="status-tag">'+escapeHtml(p.status)+'</span>':'')+'</td>'+
      '<td class="r">'+fmtPts(p.balance)+'</td>'+
    '</tr>';
  });
  box.innerHTML =
    '<table class="rank"><thead><tr><th>#</th><th>Member</th><th class="r">Points</th></tr></thead>'+
    '<tbody>'+rows+'</tbody></table>';
}

async function refreshRanking(){
  const r = await api('GET','/leagues/'+cur.league.id+'/ranking');
  if (r.ok) renderRanking(r.data);
}
