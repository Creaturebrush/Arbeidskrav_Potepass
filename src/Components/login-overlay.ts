class LoginOverlay extends HTMLElement {

  constructor() {
    super();

    this.modalEl = null;

    this.onDocClick = (e) => {
      const target = e.target;

      // Open: any link with data-open-login so we can resuse this part of the code to all overlays if we want
      const openLink = target && target.closest && target.closest("[data-open-login]");
      if (openLink) {
        e.preventDefault();
        this.open();
        return;
      }

      // Close: click backdrop or X (anything with data-close) - same here, we can reuse this for all overlays if we want
      const closeEl = target && target.closest && target.closest("[data-close]");
      if (closeEl && this.modalEl && this.modalEl.classList.contains("is-open")) {
        this.close();
      }
    };

    this.onKeyDown = (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    };
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="modal modal-login" id="loginModal" aria-hidden="true">
        <div class="modal-backdrop" data-close="true"></div>

        <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
          <button class="modal-close" type="button" aria-label="Lukk" data-close="true">✕</button>

          <h4 id="loginTitle" class="modal-title">LOGG INN</h4>

          <div class="modal-decor" aria-hidden="true">
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
            <img src="/images/filledpawprint.png" alt="" />
          </div>

          <p class="modal-subtitle">Velkommen tilbake! Logg inn for å fortsette.</p>

          <form class="modal-form" action="#" method="post">
            <div class="modal-field">
              <label class="modal-label" for="loginEmail">E-post</label>
              <input class="modal-input" id="loginEmail" type="email" autocomplete="email" required />
            </div>

            <div class="modal-field">
              <label class="modal-label" for="loginPassword">Passord</label>
              <input class="modal-input" id="loginPassword" type="password" autocomplete="current-password" required />
            </div>

            <div class="modal-row">
              <label class="modal-check">
                <input type="checkbox" />
                Husk meg
              </label>
              <a class="modal-link" href="#" role="button">Glemt passord?</a>
            </div>

            <div class="modal-actions">
              <button class="btn btn-success" type="submit">LOGG INN</button>
              <a class="btn btn-info" href="/src/Pages/registration/registration.html">REGISTRER DEG</a>
            </div>
          </form>
        </section>
      </div>
    `;

    this.modalEl = this.querySelector("#loginModal");

    document.addEventListener("click", this.onDocClick);
    window.addEventListener("keydown", this.onKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.onDocClick);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  open() {
    if (!this.modalEl) return;

    this.modalEl.classList.add("is-open");
    this.modalEl.setAttribute("aria-hidden", "false");
  }

  close() {
    if (!this.modalEl) return;

    this.modalEl.classList.remove("is-open");
    this.modalEl.setAttribute("aria-hidden", "true");
  }
}

if (!customElements.get("login-overlay")) {
  customElements.define("login-overlay", LoginOverlay);
}