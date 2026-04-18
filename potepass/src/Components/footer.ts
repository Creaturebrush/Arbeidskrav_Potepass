/* class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer-inner">
          <div class="site-footer-social">
            <a href="#" class="site-footer-link">
              <img src="/images/facebook.png" alt="" />
              <span>FACEBOOK</span>
            </a>

            <a href="#" class="site-footer-link">
              <img src="/images/twitter.png" alt="" />
              <span>TWITTER</span>
            </a>

            <a href="#" class="site-footer-link">
              <img src="/images/instagram.png" alt="" />
              <span>INSTAGRAM</span>
            </a>
          </div>

          <div class="site-footer-brand" aria-label="PØTEPASS logo">
            <div class="logo logo-footer">
              <span class="logo-text">P</span>
              <img class="logo-paw" src="/images/pawprint.png" alt="" />
              <span class="logo-text">TEPASS</span>
            </div>
          </div>

          <address class="site-footer-contact">
            <div>Poteveien, 3126 Tønsberg</div>
            <div>
              <a class="site-footer-link" href="mailto:potepass@gmail.com">Potepass@gmail.com</a>
            </div>
            <div>12345678</div>
          </address>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("site-footer")) {
  customElements.define("site-footer", SiteFooter);
}

*/

export function createFooter() {
  const footer = document.getElementById("site-footer") as HTMLElement;
  footer.innerHTML = `
  <footer class="site-footer">
        <div class="site-footer-inner">
          <div class="site-footer-social">
            <a href="#" class="site-footer-link">
              <img src="/images/facebook.png" alt="" />
              <span>FACEBOOK</span>
            </a>

            <a href="#" class="site-footer-link">
              <img src="/images/twitter.png" alt="" />
              <span>TWITTER</span>
            </a>

            <a href="#" class="site-footer-link">
              <img src="/images/instagram.png" alt="" />
              <span>INSTAGRAM</span>
            </a>
          </div>

          <div class="site-footer-brand" aria-label="PØTEPASS logo">
            <div class="logo logo-footer">
              <span class="logo-text">P</span>
              <img class="logo-paw" src="/images/pawprint.png" alt="" />
              <span class="logo-text">TEPASS</span>
            </div>
          </div>

          <address class="site-footer-contact">
            <div>Poteveien, 3126 Tønsberg</div>
            <div>
              <a class="site-footer-link" href="mailto:potepass@gmail.com">Potepass@gmail.com</a>
            </div>
            <div>12345678</div>
          </address>
        </div>
      </footer>
  `;
}