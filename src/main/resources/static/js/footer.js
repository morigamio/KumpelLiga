/* <kl-footer>: data-source attribution shown on every page (js/footer.js, css/footer.css).
   Renders plain markup (no shadow DOM) so the page styles apply. Load in <head>. */
customElements.define('kl-footer', class extends HTMLElement {
  connectedCallback(){
    this.innerHTML =
      '<footer>'+
        'Match data by <a href="https://www.openligadb.de" target="_blank" rel="noopener">OpenLigaDB</a>'+
        '<span class="sep">·</span>'+
        'Odds by <a href="https://the-odds-api.com" target="_blank" rel="noopener">The Odds API</a>'+
        '<span class="sep">·</span>'+
        '<a href="impressum.html">Impressum</a>'+
      '</footer>';
  }
});
