/* Home page (home.html): account overview, my leagues, join / create league. */

async function initHome(){
  const acct = await initShell();
  if (!acct) return;
  const initial = (ME||'?').charAt(0).toUpperCase();
  $('acctAvatar').textContent = initial;
  $('acctName').textContent = ME || '—';
  $('acctSub').textContent = acct.ok ? ('Account #' + acct.data.id) : '';
  await loadLeagues();
}

async function loadLeagues(){
  $('myLeagues').innerHTML = '<div class="empty"><span class="spinner"></span></div>';

  const all = await api('GET','/leagues');
  if (!all.ok){ $('myLeagues').innerHTML = '<div class="empty">Could not load leagues.</div>'; return; }

  // "my leagues" = leagues where a participant carries my name
  const mine = [];
  for (const lg of all.data){
    const mp = (lg.participants||[]).find(p => p.name === ME);
    if (mp) mine.push({league: lg, myParticipant: mp});
  }
  renderMyLeagues(mine);
  renderAcctStats(mine);
}

function renderAcctStats(mine){
  $('statLeagues').textContent = mine.length;
  const totalPts = mine.reduce((s,x)=> s + Number(x.myParticipant.balance||0), 0);
  $('statPoints').textContent = mine.length ? Math.round(totalPts) : '–';
  $('statBest').textContent = '–'; // filled after ranks resolve
  if (!mine.length) return;
  // resolve best rank across leagues (uses ranking endpoint)
  Promise.all(mine.map(x => api('GET','/leagues/'+x.league.id+'/ranking'))).then(res=>{
    let best = Infinity;
    res.forEach(r=>{
      if (!r.ok) return;
      const idx = r.data.findIndex(p => p.name === ME);
      if (idx >= 0) best = Math.min(best, idx+1);
    });
    $('statBest').textContent = best === Infinity ? '–' : '#'+best;
  });
}

function renderMyLeagues(mine){
  const box = $('myLeagues');
  if (!mine.length){
    box.innerHTML = '<div class="empty">You are not in any league yet.<br>Join or create one below to start betting. 👇</div>';
    return;
  }
  box.innerHTML = '';
  for (const {league, myParticipant} of mine){
    const el = document.createElement('div');
    el.className = 'league-item';
    el.onclick = () => goToLeague(league.id);
    const members = (league.participants||[]).length;
    el.innerHTML =
      '<div class="crest">'+escapeHtml((league.name||'?').charAt(0).toUpperCase())+'</div>'+
      '<div class="li-main">'+
        '<div class="li-name">'+escapeHtml(league.name)+'</div>'+
        '<div class="li-sub">'+members+' member'+(members===1?'':'s')+
          ' · admin '+escapeHtml(league.admin)+
          (myParticipant.status && myParticipant.status.toUpperCase()!=='APPROVED'
             ? ' · <b>'+escapeHtml(myParticipant.status)+'</b>' : '')+
        '</div>'+
      '</div>'+
      '<div class="li-bal"><div class="b">'+fmtPts(myParticipant.balance)+'</div><div class="bl">points</div></div>'+
      '<div class="chev">›</div>';
    box.appendChild(el);
  }
}

async function joinLeague(){
  const name = $('joinId').value.trim();
  const password = $('joinPass').value;
  const msg = $('homeMsg'); msg.className='msg';
  if (!name || !password){ msg.className='msg err'; msg.textContent='League name and password required.'; return; }

  // League names are unique: look the name up, then join with its id (never send a
  // non-numeric value to the server, which would throw NumberFormatException on parseLong).
  const found = await api('GET','/leagues?name='+encodeURIComponent(name));
  if (!found.ok){ msg.className='msg err'; msg.textContent = found.text || 'Could not search leagues.'; return; }
  const league = (found.data||[]).find(l => l.name && l.name.toLowerCase() === name.toLowerCase());
  if (!league){ msg.className='msg err'; msg.textContent = 'No league named "'+name+'".'; return; }

  const r = await api('POST','/leagues/'+league.id+'/participants',{password});
  if (!r.ok){ msg.className='msg err'; msg.textContent = r.text || 'Could not join league.'; return; }
  msg.className='msg ok'; msg.textContent='Joined! Opening league…';
  goToLeague(league.id);
}

async function createLeague(){
  const name = $('lgName').value.trim();
  const password = $('lgPass').value;
  const msg = $('homeMsg'); msg.className='msg';
  if (!name || !password){ msg.className='msg err'; msg.textContent='League name and password required.'; return; }
  const r = await api('POST','/leagues',{name,password});
  if (!r.ok){ msg.className='msg err'; msg.textContent = r.text || 'Could not create league.'; return; }
  msg.className='msg ok'; msg.textContent='League "'+r.data.name+'" created. Opening…';
  goToLeague(r.data.id);
}

/* ---------------- boot ---------------- */
initHome();
