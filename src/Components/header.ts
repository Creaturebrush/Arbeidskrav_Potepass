class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="site-header-inner">
          <a class="site-header-brand" href="/index.html" aria-label="PØTEPASS hjem">
            <h1 class="logo">
              <span class="logo-text">P</span>
              <img class="logo-paw" src="/Images/pawprint.png" alt="" />
              <span class="logo-text">TEPASS</span>
            </h1>
        	</a>

          <nav class="site-header-nav" aria-label="Hovedmeny">
            <a href="/src/Pages/sitters/sitters.html">FINN HUNDEPASSERE</a>
            <a href="/src/Pages/registration/registration.html">BLI HUNDEPASSER</a>
            <a href="/src/Pages/login/login.html">LOG INN</a>
            <a href="/src/Pages/registration/registration.html">REGISTRER DEG</a>
          </nav>
        </div>
      </header>
    `;
  }
}

if (!customElements.get("site-header")) {
	customElements.define("site-header", SiteHeader);
}