/* <kl-header>: brand, current user, logout. Renders plain markup (no shadow DOM) so
   css/header.css applies and shell.js can fill #hdrName / #hdrAvatar. Load in <head>. */
customElements.define('kl-header', class extends HTMLElement {
  connectedCallback(){
    this.innerHTML =
      '<header>'+
        '<div class="brand-row"><span class="logo">⚽</span> KumpelLiga</div>'+
        '<div class="user">'+
          '<span class="muted bold" id="hdrName"></span>'+
          '<div class="avatar" id="hdrAvatar">?</div>'+
          '<button class="ghost" onclick="logout()">Logout</button>'+
        '</div>'+
      '</header>';
  }
});
