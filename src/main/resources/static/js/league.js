/* League page (league.html): loads the league from ?id=, renders head + admin/member actions,
   then hands the games to games.js and the table to ranking.js. Must be loaded after those two. */

let cur = null;   // { league, myParticipant, games, days, dayIndex, betsByGame }

async function initLeague(){
  const acct = await initShell();
  if (!acct) return;
  const leagueId = new URLSearchParams(location.search).get('id');
  if (!leagueId){ goHome(); return; }

  $('track').innerHTML = '<div class="loading"><span class="spinner"></span></div>';

  const lgRes = await api('GET','/leagues/'+leagueId);
  if (!lgRes.ok){ $('gamesMsg').className='msg err'; $('gamesMsg').textContent='Could not open league.'; return; }
  const league = lgRes.data;
  const myParticipant = (league.participants||[]).find(p => p.name === ME);

  cur = { league, myParticipant, games: [], days: [], dayIndex: 0, betsByGame: {} };

  // header
  $('lvCrest').textContent = (league.name||'?').charAt(0).toUpperCase();
  $('lvName').textContent = league.name;
  const iAmAdmin = league.admin === ME;
  $('lvSub').innerHTML = (league.participants||[]).length+' members · admin '+escapeHtml(league.admin)+
     '  <span class="pill">'+fmtPts(myParticipant ? myParticipant.balance : 0)+' pts</span>';
  renderLeagueActions(league, myParticipant, iAmAdmin);

  // parallel: games, my bets, ranking
  const [gamesRes, betsRes, rankRes] = await Promise.all([
    api('GET','/games'),
    myParticipant ? api('GET','/participants/'+myParticipant.id+'/bets') : Promise.resolve({ok:true,data:[]}),
    api('GET','/leagues/'+leagueId+'/ranking')
  ]);

  if (betsRes.ok && Array.isArray(betsRes.data)){
    for (const b of betsRes.data) if (b.gameId != null) cur.betsByGame[b.gameId] = b;
  }
  if (gamesRes.ok) renderSlider(gamesRes.data);
  else { $('gamesMsg').className='msg err'; $('gamesMsg').textContent='Could not load games.'; }

  if (rankRes.ok) renderRanking(rankRes.data);
  else $('ranking').innerHTML = '<div class="empty">Could not load ranking.</div>';

  startLivePolling();
}

/* ---------------- live polling ----------------
   While a game is in progress, re-fetch only that matchday every LIVE_POLL_MS (keep in step with sync.cron.liveTracking) and patch the
   changed cards in place (scroll position and bets stay untouched). Paused in hidden tabs. */
const LIVE_POLL_MS = 120000;   // matches sync.cron.liveTracking (every 2 min)
let liveTimer = null;

function isLive(g){ return isLocked(g) && !g.isFinished; }
function liveGameDay(){
  const g = (cur.games||[]).find(isLive);
  return g ? g.gameDay : null;
}

function startLivePolling(){
  if (liveTimer) return;
  liveTimer = setInterval(refreshLive, LIVE_POLL_MS);
}

async function refreshLive(){
  if (document.hidden || !cur) return;
  const day = liveGameDay();
  if (day == null) return;

  const r = await api('GET','/games?gameDay='+day);
  if (!r.ok || !Array.isArray(r.data)) return;

  let changed = false;
  for (const fresh of r.data){
    const i = cur.games.findIndex(g => g.id === fresh.id);
    if (i < 0) continue;
    const old = cur.games[i];
    const card = document.querySelector('.game[data-game-id="'+fresh.id+'"]');
    const scoreChanged = old.goalsHomeTeam !== fresh.goalsHomeTeam || old.goalsAwayTeam !== fresh.goalsAwayTeam ||
                         old.isFinished !== fresh.isFinished;
    const kickedOff = card && isLocked(fresh) && !card.classList.contains('locked');  // rendered before kickoff
    if (!scoreChanged && !kickedOff) continue;
    cur.games[i] = fresh;
    if (card) card.replaceWith(renderGameCard(fresh));
    changed = true;
  }
  if (changed){ syncDayUi(); refreshRanking(); }
}

function renderLeagueActions(league, myParticipant, iAmAdmin){
  const box = $('lvActions'); box.innerHTML='';
  if (iAmAdmin){
    const b = document.createElement('button');
    b.className='danger'; b.textContent='Delete league';
    b.onclick = async ()=>{
      if (!confirm('Delete "'+league.name+'" for everyone? This cannot be undone.')) return;
      const r = await api('DELETE','/leagues/'+league.id);
      if (r.ok) goHome(); else alert(r.text||'Could not delete league.');
    };
    box.appendChild(b);
  } else if (myParticipant){
    const b = document.createElement('button');
    b.className='danger'; b.textContent='Leave';
    b.onclick = async ()=>{
      if (!confirm('Leave "'+league.name+'"?')) return;
      const r = await api('DELETE','/participants/'+myParticipant.id);
      if (r.ok) goHome(); else alert(r.text||'Could not leave league.');
    };
    box.appendChild(b);
  }
}

/* ---------------- boot ---------------- */
initLeague();
