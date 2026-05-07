// FREDRIK

import "./header.css"

export function createHeader() {
  const header = document.getElementById("site-header") as HTMLElement;
  const userId = localStorage.getItem("userId");

  if (!userId) {
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
  } else {
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
            <a href="#">FINN HUNDEPASSERE</a>
            <a href="">BLI HUNDEPASSER</a>
            <button class="btn btn-danger" id="logout-btn">LOGG UT</button>
          </nav>
        </div>
      </header>
  `;
  }
}

document.addEventListener("click", async (e) => {
  const target = e.target as HTMLButtonElement;

  switch (target.id) {
    case "logout-btn": {
      const dynamicContent = `
      <h2>Logger ut..</h2>
          <img src="/images/paw-spinner.png" class="header-spinner" alt="Loading spinner" draggable="false"/>
      `;
      createModal(dynamicContent);
      setTimeout(() => {
        localStorage.removeItem("userId");
        window.location.replace("./index.html");
      }, 2000);
      break;
    }
    case "close-btn": {
      closeModal();
      break;
    }
    default:
      break;
  }
})

let currentModal: HTMLDivElement | null = null;

function createModal(dynamicContent: string) {

  closeModal();

  document.body.style.overflow = "hidden";

  const modalBackdrop = document.createElement("div") as HTMLDivElement;
  const modal = document.createElement("div") as HTMLDivElement;

  modal.classList.add("header-modal");

  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);

  modalBackdrop.classList.add("header-modal-backdrop");
  modal.innerHTML = dynamicContent;
  modal.classList.add("open");

  currentModal = modalBackdrop;
}

function closeModal() {
  if (currentModal) {
    currentModal.remove();
    currentModal = null;
  }

  document.body.style.overflow = "";
}
