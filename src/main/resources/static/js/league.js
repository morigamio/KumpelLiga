/* League page (league.html): loads the league from ?id=, renders head + admin/member actions,
   then hands the games to games.js and the ranking to <kl-statistics> (statistics.js). Must be loaded after those. */

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
  $('lvSub').innerHTML = (league.participants||[]).length+' members · admin '+escapeHtml(league.admin);
  renderLeagueActions(league, myParticipant, iAmAdmin);

  // ranking straight from the league response: same participant data, just sorted by balance
  const stats = document.querySelector('kl-statistics');
  stats.setRanking((league.participants||[]).slice().sort((a,b)=> Number(b.balance||0) - Number(a.balance||0)));

  // parallel: games, my bets
  const [gamesRes, betsRes] = await Promise.all([
    api('GET','/games'),
    myParticipant ? api('GET','/participants/'+myParticipant.id+'/bets') : Promise.resolve({ok:true,data:[]})
  ]);

  if (betsRes.ok && Array.isArray(betsRes.data)){
    for (const b of betsRes.data) if (b.gameId != null) cur.betsByGame[b.gameId] = b;
  }
  if (gamesRes.ok) renderSlider(gamesRes.data);
  else { $('gamesMsg').className='msg err'; $('gamesMsg').textContent='Could not load games.'; }

  stats.reloadPlot();   // the plot reads cur.games, so it can only load now
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

/* Gear button that opens the league settings menu. Settings and rules are a placeholder for now;
   the only live entries are the admin's "Delete league" and a member's "Leave league". */
const GEAR_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
  '<circle cx="12" cy="12" r="3"/>'+
  '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

function renderLeagueActions(league, myParticipant, iAmAdmin){
  const box = $('lvActions'); box.innerHTML='';
  if (!myParticipant) return;

  const wrap = document.createElement('div'); wrap.className='settings';
  const gear = document.createElement('button');
  gear.className='ghost gear'; gear.title='League settings'; gear.setAttribute('aria-label','League settings');
  gear.innerHTML = GEAR_ICON;

  const menu = document.createElement('div'); menu.className='menu'; menu.hidden = true;
  menu.innerHTML =
    '<div class="menu-item disabled"><span>Settings &amp; rules</span><span class="soon">coming soon</span></div>'+
    '<div class="menu-sep"></div>';

  const danger = document.createElement('button'); danger.className='menu-item danger';
  if (iAmAdmin){
    danger.textContent = 'Delete league';
    danger.onclick = async ()=>{
      if (!confirm('Delete "'+league.name+'" for everyone? This cannot be undone.')) return;
      const r = await api('DELETE','/leagues/'+league.id);
      if (r.ok) goHome(); else alert(r.text||'Could not delete league.');
    };
  } else {
    danger.textContent = 'Leave league';
    danger.onclick = async ()=>{
      if (!confirm('Leave "'+league.name+'"?')) return;
      const r = await api('DELETE','/participants/'+myParticipant.id);
      if (r.ok) goHome(); else alert(r.text||'Could not leave league.');
    };
  }
  menu.appendChild(danger);

  gear.onclick = (e)=>{ e.stopPropagation(); menu.hidden = !menu.hidden; gear.classList.toggle('open', !menu.hidden); };
  document.addEventListener('click', ()=>{ menu.hidden = true; gear.classList.remove('open'); });

  wrap.appendChild(gear); wrap.appendChild(menu); box.appendChild(wrap);
}

/* ---------------- boot ---------------- */
initLeague();
