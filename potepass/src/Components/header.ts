// FREDRIK

export function createHeader() {
  const header = document.getElementById("site-header") as HTMLElement;
  header.innerHTML = `
  <header class="site-header">
        <div class="site-header-inner">
          <a class="site-header-brand" href="/index.html" aria-label="PØTEPASS hjem">
            <h1 class="logo">
              <span class="logo-text">P</span>
              <img class="logo-paw" src="/images/pawprint.png" alt="" />
              <span class="logo-text">TEPASS</span>
            </h1>
        	</a>

          <nav class="site-header-nav" aria-label="Hovedmeny">
            <a href="#" data-open-login>FINN HUNDEPASSERE</a>
            <a href="/src/Pages/registration/registration.html">BLI HUNDEPASSER</a>
            <a href="#" data-open-login>LOGG INN</a>
            <a href="/src/Pages/registration/registration.html">REGISTRER DEG</a>
          </nav>
        </div>
      </header>
  `;
}
