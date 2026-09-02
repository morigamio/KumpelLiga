/* League page: matchday slider. Reads/writes cur (league.js); cards come from gamecard.js. */

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
