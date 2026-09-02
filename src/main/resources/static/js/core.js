/* Shared helpers used by every page: DOM lookup, token storage, API calls, formatting. */
const $ = id => document.getElementById(id);

/* ---------------- token storage ---------------- */
const token      = () => localStorage.getItem('kl_token');
const setToken   = t  => localStorage.setItem('kl_token', t);
const clearToken = () => localStorage.removeItem('kl_token');

/* ---------------- api helper ---------------- */
async function api(method, path, body){
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const t = token();
  if (t) headers['Authorization'] = 'Bearer ' + t;
  const res = await fetch(path, {method, headers, body: body ? JSON.stringify(body) : undefined});
  const text = await res.text();
  let data = text;
  try { data = text ? JSON.parse(text) : null; } catch(_) {}
  return {ok: res.ok, status: res.status, data, text};
}

/* ---------------- formatting ---------------- */
function fmt(iso){
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString(undefined,{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
}
function fmtPts(v){
  const n = Number(v||0);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}
function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
