/* Shell for logged-in pages: auth guard, current user, navigation between pages.
   Load it in <head> so the guard runs before anything renders. */
if (!token()) location.replace('index.html');

let ME = null;   // current account name, set by initShell()

/* ---------------- navigation ---------------- */
function goHome(){ location.href = 'home.html'; }
function goToLeague(id){ location.href = 'league.html?id=' + encodeURIComponent(id); }

function logout(){
  api('DELETE','/session').catch(()=>{});
  clearToken();
  localStorage.removeItem('kl_user');
  location.replace('index.html');
}

/* Resolves the current user and shows it in <kl-header>.
   Returns the /account response, or null when the session is invalid (page is redirecting). */
async function initShell(){
  const acct = await api('GET','/account');
  if (acct.status === 401){ logout(); return null; }
  ME = acct.ok ? acct.data.name : localStorage.getItem('kl_user');
  $('hdrName').textContent = ME || '';
  $('hdrAvatar').textContent = (ME||'?').charAt(0).toUpperCase();
  return acct;
}
