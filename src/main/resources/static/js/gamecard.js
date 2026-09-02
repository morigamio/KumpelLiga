/* Game card: one card per game with odds, betting and the "2x" double-bet toggle.
   Reads/writes cur.betsByGame (league.js). Loaded before games.js, which builds the slider. */

function hasOdds(g){ return g.oddsHome>0 || g.oddsAway>0 || g.oddsDraw>0; }
function isLocked(g){
  return g.isFinished || (g.matchTime && new Date(g.matchTime).getTime() <= Date.now());
}
function isDoubleBet(b){ return !!(b && (b.isDouble || b.double)); }

function renderGameCard(g){
  const existing = cur.betsByGame[g.id];   // {id, gameId, prediction, stake, isDouble} or undefined
  const finished = g.isFinished;
  const locked = isLocked(g);
  const dbl = isDoubleBet(existing);
  const won = finished && existing && existing.prediction === g.winner;
  const resultClass = !finished ? '' : !existing ? ' no-bet' : won ? ' bet-correct' : ' bet-wrong';
  const div = document.createElement('div');
  div.className = 'game' + (locked ? ' locked' : '') + (dbl ? ' double' : '') + resultClass;
  div.dataset.gameId = g.id;

  const scoreOrVs = finished
    ? '<span class="score">'+g.goalsHomeTeam+' : '+g.goalsAwayTeam+'</span>'
    : '<span class="vs">vs</span>';

  div.innerHTML =
    '<div class="top">'+
      '<span class="when">'+fmt(g.matchTime)+(finished?' · Finished':'')+'</span>'+
      '<span class="top-right">'+
        (finished?'':'<span class="pill">Matchday '+g.gameDay+'</span>')+
      '</span>'+
    '</div>'+
    '<div class="teams">'+
      '<span class="team home">'+escapeHtml(g.homeTeam)+'</span>'+
      scoreOrVs+
      '<span class="team away">'+escapeHtml(g.awayTeam)+'</span>'+
    '</div>';

  // 2x control: a toggle button while betting is open, a plain badge once locked
  const topRight = div.querySelector('.top-right');
  if (hasOdds(g) && !locked){
    const b = document.createElement('button');
    b.className = 'dbl' + (dbl ? ' on' : '');
    b.textContent = '2x';
    if (!existing){ b.disabled = true; b.title = 'Place a bet first to double it'; }
    else {
      b.title = dbl ? 'Double bet — tap to reset' : 'Double this bet';
      b.onclick = () => onDoubleClick(g, div);
    }
    topRight.prepend(b);
  } else if (dbl && !(finished && won)){
    const s = document.createElement('span');
    s.className = 'dbl on badge'; s.textContent = '2x';
    topRight.prepend(s);
  }
  if (finished && existing){
    const r = document.createElement('span');
    r.className = 'stamp ' + (won && dbl ? 'won-double' : won ? 'won' : 'lost');
    r.textContent = won && dbl ? 'Double win' : won ? 'Won' : 'Lost';
    topRight.prepend(r);
  }

  if (!hasOdds(g)){
    const n = document.createElement('div'); n.className='no-odds';
    n.textContent = finished ? 'No odds were offered for this game.' : 'No odds yet — betting opens once odds are set.';
    div.appendChild(n);
    return div;
  }

  const outcomes = [
    {label:g.homeTeam, pred:'homeTeam', val:g.oddsHome},
    {label:'Draw',     pred:'draw',     val:g.oddsDraw},
    {label:g.awayTeam, pred:'awayTeam', val:g.oddsAway},
  ];
  const odds = document.createElement('div'); odds.className='odds';
  outcomes.forEach(o=>{
    const b = document.createElement('button');
    b.className = 'opt' + (existing && existing.prediction===o.pred ? ' chosen' : '') + (finished && g.winner===o.pred ? ' winner' : '');
    b.innerHTML = '<span class="k">'+escapeHtml(o.label)+'</span><span class="v">'+o.val.toFixed(2)+'</span>';
    if (locked) b.disabled = true;
    else b.onclick = () => onBetClick(g, o.pred, div);
    odds.appendChild(b);
  });
  div.appendChild(odds);

  const note = document.createElement('div'); note.className='bet-note';
  const dblTxt = dbl ? ' · 2x points' : '';
  if (locked && !existing) note.textContent = 'Betting closed.';
  else if (locked && existing) { note.className='bet-note you'; note.textContent='Your pick: '+labelFor(g, existing.prediction)+dblTxt+' (locked)'; }
  else if (existing) { note.className='bet-note you'; note.textContent='Your bet: '+labelFor(g, existing.prediction)+dblTxt+' — tap it again to remove, or pick another to change.'; }
  else note.textContent = 'Tap an outcome to place your bet.';
  div.appendChild(note);

  return div;
}

function labelFor(g, pred){
  return pred==='homeTeam' ? g.homeTeam : pred==='awayTeam' ? g.awayTeam : 'Draw';
}

/* Re-render every card currently in the slider from cur.games / cur.betsByGame, keeping scroll position. */
function rerenderAllCards(){
  const byId = {};
  (cur.games||[]).forEach(g => byId[g.id] = g);
  document.querySelectorAll('.game[data-game-id]').forEach(card=>{
    const g = byId[card.dataset.gameId];
    if (g) card.replaceWith(renderGameCard(g));
  });
  syncDayUi();   // card heights may have changed
}

async function onBetClick(g, prediction, card){
  const note = card.querySelector('.bet-note');
  const existing = cur.betsByGame[g.id];
  card.querySelectorAll('.opt, .dbl').forEach(b=>b.disabled=true);
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
    card.replaceWith(renderGameCard(g));
    return;
  }
  if (r.data && r.data.id != null) cur.betsByGame[g.id] = r.data;  // POST/PUT return the bet

  // re-render just this card in place
  card.replaceWith(renderGameCard(g));
  syncDayUi();
  refreshRanking();
}

/* Toggle the double bet. The backend returns all of my bets for that matchday
   (only one of them may be double), so every card is re-rendered from the response. */
async function onDoubleClick(g, card){
  const existing = cur.betsByGame[g.id];
  if (!existing) return;
  const note = card.querySelector('.bet-note');
  card.querySelectorAll('.opt, .dbl').forEach(b=>b.disabled=true);
  note.className='bet-note'; note.innerHTML='<span class="spinner"></span>';

  const r = await api(isDoubleBet(existing) ? 'DELETE' : 'PUT', '/bets/'+existing.id+'/double');
  if (!r.ok){
    card.replaceWith(renderGameCard(g));
    const n = document.querySelector('.game[data-game-id="'+g.id+'"] .bet-note');
    if (n){ n.className='bet-note err'; n.textContent = r.text || 'Could not change double bet.'; }
    return;
  }
  if (Array.isArray(r.data)){
    for (const b of r.data) if (b.gameId != null) cur.betsByGame[b.gameId] = b;
  }
  rerenderAllCards();
}
