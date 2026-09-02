/* League page: matchday slider, game cards and betting. Reads/writes cur (league.js)
   and calls refreshRanking() (ranking.js) after a bet changes. */

function renderSlider(games){
  games = (games||[]).slice().sort((a,b)=> (a.gameDay-b.gameDay) || (new Date(a.matchTime)-new Date(b.matchTime)));
  cur.games = games;
  if (!games.length){
    $('track').innerHTML=''; $('dots').innerHTML='';
    $('dayLabel').textContent='No games';
    $('gamesMsg').className='msg'; $('gamesMsg').textContent='No games available yet.';
    return;
  }
  const days = [...new Set(games.map(g=>g.gameDay))].sort((a,b)=>a-b);
  cur.days = days;
  cur.dayIndex = defaultDayIndex(games, days);

  const track = $('track'); track.innerHTML='';
  days.forEach(day=>{
    const slide = document.createElement('div');
    slide.className='slide';
    const dayGames = games.filter(g=>g.gameDay===day);
    dayGames.forEach(g => slide.appendChild(renderGameCard(g)));
    track.appendChild(slide);
  });

  // dots
  const dots = $('dots'); dots.innerHTML='';
  days.forEach((day,i)=>{
    const d = document.createElement('button');
    d.className='dot'+(i===cur.dayIndex?' active':'');
    d.title='Matchday '+day;
    d.onclick=()=>scrollToDay(i);
    dots.appendChild(d);
  });

  track.onscroll = () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== cur.dayIndex){ cur.dayIndex = i; syncDayUi(); }
  };
  // jump (no smooth) to default day
  requestAnimationFrame(()=>{ track.scrollLeft = cur.dayIndex * track.clientWidth; syncDayUi(); });
}

function defaultDayIndex(games, days){
  const now = Date.now();
  const upcoming = games.find(g => !g.isFinished && new Date(g.matchTime).getTime() >= now);
  const day = upcoming ? upcoming.gameDay : days[days.length-1];
  return Math.max(0, days.indexOf(day));
}

function syncDayUi(){
  $('dayLabel').textContent = 'Matchday ' + cur.days[cur.dayIndex];
  [...$('dots').children].forEach((d,i)=> d.classList.toggle('active', i===cur.dayIndex));
}
function scrollToDay(i){
  i = Math.max(0, Math.min(i, cur.days.length-1));
  cur.dayIndex = i;
  $('track').scrollTo({left: i * $('track').clientWidth, behavior:'smooth'});
  syncDayUi();
}
function slideBy(d){ scrollToDay(cur.dayIndex + d); }

/* ---- game card + betting ---- */
function hasOdds(g){ return g.oddsHome>0 || g.oddsAway>0 || g.oddsDraw>0; }
function isLocked(g){
  return g.isFinished || (g.matchTime && new Date(g.matchTime).getTime() <= Date.now());
}

function renderGameCard(g){
  const existing = cur.betsByGame[g.id];   // {id, gameId, prediction, stake} or undefined
  const finished = g.isFinished;
  const resultClass = finished && existing
    ? (existing.prediction === g.winner ? ' bet-correct' : ' bet-wrong')
    : '';
  const div = document.createElement('div');
  div.className = 'game' + (isLocked(g) ? ' locked' : '') + resultClass;

  const scoreOrVs = finished
    ? '<span class="score">'+g.goalsHomeTeam+' : '+g.goalsAwayTeam+'</span>'
    : '<span class="vs">vs</span>';

  div.innerHTML =
    '<div class="top">'+
      '<span class="when">'+fmt(g.matchTime)+'</span>'+
      '<span class="pill'+(finished?' gold':'')+'">'+(finished?'Full time':'Matchday '+g.gameDay)+'</span>'+
    '</div>'+
    '<div class="teams">'+
      '<span class="team home">'+escapeHtml(g.homeTeam)+'</span>'+
      scoreOrVs+
      '<span class="team away">'+escapeHtml(g.awayTeam)+'</span>'+
    '</div>';

  if (!hasOdds(g)){
    const n = document.createElement('div'); n.className='no-odds';
    n.textContent = finished ? 'No odds were offered for this game.' : 'No odds yet — betting opens once odds are set.';
    div.appendChild(n);
    return div;
  }

  const locked = isLocked(g);
  const outcomes = [
    {label:g.homeTeam, pred:'homeTeam', val:g.oddsHome},
    {label:'Draw',     pred:'draw',     val:g.oddsDraw},
    {label:g.awayTeam, pred:'awayTeam', val:g.oddsAway},
  ];
  const odds = document.createElement('div'); odds.className='odds';
  outcomes.forEach(o=>{
    const b = document.createElement('button');
    b.className = 'opt' + (existing && existing.prediction===o.pred ? ' chosen' : '');
    b.innerHTML = '<span class="k">'+escapeHtml(o.label)+'</span><span class="v">'+o.val.toFixed(2)+'</span>';
    if (locked) b.disabled = true;
    else b.onclick = () => onBetClick(g, o.pred, div);
    odds.appendChild(b);
  });
  div.appendChild(odds);

  const note = document.createElement('div'); note.className='bet-note';
  if (locked && !existing) note.textContent = 'Betting closed.';
  else if (locked && existing) { note.className='bet-note you'; note.textContent='Your pick: '+labelFor(g, existing.prediction)+' (locked)'; }
  else if (existing) { note.className='bet-note you'; note.textContent='Your bet: '+labelFor(g, existing.prediction)+' — tap it again to remove, or pick another to change.'; }
  else note.textContent = 'Tap an outcome to place your bet.';
  div.appendChild(note);

  return div;
}

function labelFor(g, pred){
  return pred==='homeTeam' ? g.homeTeam : pred==='awayTeam' ? g.awayTeam : 'Draw';
}

async function onBetClick(g, prediction, card){
  const note = card.querySelector('.bet-note');
  const existing = cur.betsByGame[g.id];
  card.querySelectorAll('.opt').forEach(b=>b.disabled=true);
  note.className='bet-note'; note.innerHTML='<span class="spinner"></span>';

  let r;
  if (!existing){
    r = await api('POST','/leagues/'+cur.league.id+'/games/'+g.id+'/bets',{prediction});
  } else if (existing.prediction === prediction){
    r = await api('DELETE','/bets/'+existing.id);        // tap current pick again → remove
    if (r.ok) delete cur.betsByGame[g.id];
  } else {
    r = await api('PUT','/bets/'+existing.id,{prediction}); // different pick → change
  }

  if (!r.ok){
    note.className='bet-note err'; note.textContent = r.text || 'Bet failed.';
    card.querySelectorAll('.opt').forEach(b=>b.disabled=false);
    return;
  }
  if (r.data && r.data.id != null) cur.betsByGame[g.id] = r.data;  // POST/PUT return the bet

  // re-render just this card in place
  const fresh = renderGameCard(g);
  card.replaceWith(fresh);
  // refresh ranking + my points (balance may change on settlement, but reflect membership too)
  refreshRanking();
}
