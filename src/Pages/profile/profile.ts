class Modal {
  modalBackdrop: HTMLDivElement;
  modal: HTMLDivElement;

  constructor() {
    this.modalBackdrop = document.createElement("div");

    this.modal = document.createElement("div");
    this.modal.classList.add("profile-modal");

    this.modalBackdrop.appendChild(this.modal);
    document.body.appendChild(this.modalBackdrop);
  }

  openModal(dynamicContent: string) {
    this.modalBackdrop.classList.add("profile-modal-backdrop");
    this.modal.innerHTML = dynamicContent;
    this.modal.classList.add("open");

    const closeBtn = this.modal.querySelector(
      "#close-btn",
    ) as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
  }

  closeModal() {
    this.modalBackdrop.classList.remove("profile-modal-backdrop");
    this.modal.innerHTML = "";
    this.modal.classList.remove("open");
  }
}

const modal = new Modal();

const deleteProfileBtn = document.getElementById(
  "delete-profile-btn",
) as HTMLButtonElement;
deleteProfileBtn.addEventListener("click", () => {
  const dynamicContent = `
          <h2>Er du sikker på at du ønsker å slette profilen din?</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">NEI, GÅ TILBAKE</button>
            <button class="btn btn-danger">JA, SLETT PROFIL</button>
          </div>
  `;
  modal.openModal(dynamicContent);
});

const editProfileBtn = document.getElementById(
  "edit-profile-btn",
) as HTMLButtonElement;
editProfileBtn.addEventListener("click", () => {
  const dynamicContent = `
      <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/useravatar.png" alt="Bilde av person" />
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <div class="add-edit-info">
              <p>Fornavn:</p>
              <p>Etternav:</p>
              <p>Telefon:</p>
              <p>E-post:</p>
            </div>
            <div class="add-edit-user-info">
              <p>tomt felt</p>
              <p>tomt felt</p>
              <p>tomt felt</p>
              <p>tomt felt</p>
            </div>
            <div class="add-edit-btn-container">
              <button class="btn btn-warning">REDIGER</button>
              <button class="btn btn-warning">REDIGER</button>
              <button class="btn btn-warning">REDIGER</button>
              <button class="btn btn-warning">REDIGER</button>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-success">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
  modal.openModal(dynamicContent);
});
