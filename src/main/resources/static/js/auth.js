/* Login / register page (index.html). */
if (token()) location.replace('home.html');

let authMode = 'login';

function setAuthMode(mode){
  authMode = mode;
  $('segLogin').classList.toggle('active', mode==='login');
  $('segReg').classList.toggle('active', mode==='reg');
  $('authBtn').textContent = mode==='login' ? 'Login' : 'Create account';
  $('authMsg').textContent = '';
}

async function submitAuth(){
  const name = $('authName').value.trim();
  const password = $('authPass').value;
  const msg = $('authMsg'); msg.className='msg';
  if (!name || !password){ msg.className='msg err'; msg.textContent='Username and password required.'; return; }
  $('authBtn').disabled = true;
  try{
    if (authMode === 'reg'){
      const r = await api('POST','/account',{name,password});
      if (!r.ok){ msg.className='msg err'; msg.textContent = r.text || 'Registration failed.'; return; }
    }
    const r = await api('POST','/session',{name,password});
    if (!r.ok){ msg.className='msg err'; msg.textContent = r.text || 'Login failed.'; return; }
    setToken(r.text.trim());
    localStorage.setItem('kl_user', name);
    location.replace('home.html');
  } finally { $('authBtn').disabled = false; }
}
