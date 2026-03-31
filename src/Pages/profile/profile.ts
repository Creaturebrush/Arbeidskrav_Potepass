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
              <p>Etternavn:</p>
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

const addDogBtn = document.getElementById("add-dog-btn") as HTMLButtonElement;
addDogBtn.addEventListener("click", () => {
  const dynamicContent = `
          <h2>Legg til hund</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/dogicon.png" alt="Bilde av hund" />
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <div class="add-edit-info">
              <p>Navn:</p>
              <p>Rase:</p>
              <p>Alder:</p>
              <p>Allergier:</p>
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
            <button class="btn btn-success">LEGG TIL HUND</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
  modal.openModal(dynamicContent);
});

const removeDogBtn = document.getElementById(
  "remove-dog-btn",
) as HTMLButtonElement;
removeDogBtn.addEventListener("click", () => {
  const dynamicContent = `
          <h2>Hvilken hund ønsker du å fjerne?</h2>
          <div class="remove-dog-container">
            <div class="remove-dog-card">
              <img src="/images/dog1.png" alt="Bilde av hund" />
              <p>NAVN</p>
            </div>
            <div class="remove-dog-card">
              <img src="/images/dog1.png" alt="Bilde av hund" />
              <p>NAVN</p>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">AVBRYT</button>
            <button class="btn btn-danger">FJERN VALGT HUND</button>
          </div>
  `;
  modal.openModal(dynamicContent);
});

const editDogBtn = document.getElementById("edit-dog-btn") as HTMLButtonElement;
editDogBtn.addEventListener("click", () => {
  const dynamicContent = `
          <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/dogicon.png" alt="Bilde av hund" />
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <div class="add-edit-info">
              <p>Navn:</p>
              <p>Rase:</p>
              <p>Alder:</p>
              <p>Allergier:</p>
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

// HUNDEKORT
const dogContainer = document.querySelector(".dog-card-container") as HTMLDivElement;

class DogCard {
  dogCard: HTMLDivElement;
  dogCardInfo: HTMLDivElement;
  dogInfo: HTMLDivElement;
  dogImg: HTMLImageElement;
  dogUserInfo: HTMLDivElement;
  btnContainer: HTMLDivElement;
  editDogBtn: HTMLButtonElement;

  constructor() {

    this.dogCard = document.createElement("div");
    this.dogCard.classList.add("dog-card")

    this.dogCardInfo = document.createElement("div");
    this.dogCardInfo.classList.add("dog-card-info");

    this.dogImg = document.createElement("img");
    
    this.dogInfo = document.createElement("div");
    this.dogInfo.classList.add("dog-info")
    this.dogInfo.innerHTML = `
      <p>Navn:</p>
      <p>Rase:</p>
      <p>Alder:</p>
      <p>Allergier:</p>
    `;

    this.dogUserInfo = document.createElement("div");
    this.dogUserInfo.classList.add("dog-user-info");

    this.btnContainer = document.createElement("div");
    this.btnContainer.classList.add("btn-container");

    this.editDogBtn = document.createElement("button");
    this.editDogBtn.textContent = "REDIGER";
    this.editDogBtn.classList.add("btn", "btn-warning");
    this.editDogBtn.id = "edit-dog-btn"

    this.dogCardInfo.appendChild(this.dogImg);
    this.dogCardInfo.appendChild(this.dogInfo);
    this.dogCardInfo.appendChild(this.dogUserInfo);

    this.btnContainer.appendChild(this.editDogBtn);

    
    this.dogCard.appendChild(this.dogCardInfo)
    this.dogCard.appendChild(this.btnContainer)

    dogContainer.appendChild(this.dogCard);
  }
}

function createDogCard() {
  const dogCard = new DogCard();

  dogCard.dogImg.src = "/images/dog1.png";

  dogCard.dogUserInfo.innerHTML = `
    <p>tomt felt</p>
    <p>tomt felt</p>
    <p>tomt felt</p>
    <p>tomt felt</p>
  `;
}

createDogCard();


