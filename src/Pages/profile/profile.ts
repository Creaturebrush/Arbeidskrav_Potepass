const user = {
  firstName: "Fredrik",
  lastName: "Teien",
  number: 98673831,
  email: "Fredrik.teien@gmail.com",
  img: "/images/useravatar.png",
  dogs: [
    {
      name: "Mio",
      breed: "Pomchi",
      age: 3,
      allergy: "Ingen",
      img: "/images/dog1.png",
    },
    {
      name: "Charlie",
      breed: "Kleinspitz",
      age: 12,
      allergy: "Ingen",
      img: "/images/dog1.png",
    },
  ],
};

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
  }

  closeModal() {
    this.modalBackdrop.classList.remove("profile-modal-backdrop");
    this.modal.innerHTML = "";
    this.modal.classList.remove("open");
  }
}

const modal = new Modal();

//EVENTLISTENERS FOR PROFILE PAGE
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  //EDIT PROFILE MODAL
  if (target.id === "edit-profile-btn") {
    const dynamicContent = `
      <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/useravatar.png" alt="Bilde av person" />
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <form class="user-input-form">
            <label for="fname">Fornavn:</label>
            <input type="text" name="fname" value="${user.firstName}"></input>
            <label for="lname">Etternavn:</label>
            <input type="text" name="lname" value="${user.lastName}"></input>
            <label for="phone">Telefon:</label>
            <input type="text" name"phone" value="${user.number}"></input>
            <label for="email">E-post:</label>
            <input type="text" name="email" value="${user.email}"></input>
            </form>
          </div>
          <div class="btn-container">
            <button class="btn btn-success TEST" id="confirm-edit-btn">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
    modal.openModal(dynamicContent);
  }

  //DELETE PROFILE MODAL
  if (target.id === "delete-profile-btn") {
    const dynamicContent = `
          <h2>Er du sikker på at du ønsker å slette profilen din?</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">NEI, GÅ TILBAKE</button>
            <button class="btn btn-danger" id="confirm-delete-btn">JA, SLETT PROFIL</button>
          </div>
  `;
    modal.openModal(dynamicContent);
  }

  //ADD DOG MODAL
  if (target.id === "add-dog-btn") {
    const dynamicContent = `
          <h2>Legg til hund</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/dogicon.png" alt="Bilde av hund" />
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
           <div class="user-input-form"">
              <label for="dog-name">Navn:</label>
              <input type="text" name="dog-name"value=""></input>
              <label for="dog-breed">Rase:</label>
              <input type="text" name="dog-breed"value=""></input>
              <label for="dog-age">Alder:</label>
              <input type="text" name="dog-age "value=""></input>
              <label for="dog-allergy">Allergier:</label>
              <input type="text" name="dog-allergy" value=""></input>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-add-dog-btn">LEGG TIL HUND</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
    modal.openModal(dynamicContent);
  }

  /*/REMOVE DOG MODAL
   if (target.id === "remove-dog-btn") {
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
            <button class="btn btn-danger" id="warning-remove-dog-btn">FJERN VALGT HUND</button>
          </div>
  `;
     modal.openModal(dynamicContent);
   }
   */

  //TEST FOR Å GENERERE HUNDER BASERT PÅ BRUKERENS HUNDER
  if (target.id === "remove-dog-btn") {
    const dynamicContent = `
          <h2>Hvilken hund ønsker du å fjerne?</h2>
          <div class="remove-dog-container">
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">AVBRYT</button>
            <button class="btn btn-danger" id="warning-remove-dog-btn">FJERN VALGT HUND</button>
          </div>
  `;
    modal.openModal(dynamicContent);

    user.dogs.forEach((dog) => {
      const removeDogContainer = document.querySelector(
        ".remove-dog-container",
      ) as HTMLDivElement;
      const removeDogCard = document.createElement("div") as HTMLDivElement;
      removeDogCard.classList.add("remove-dog-card");
      const removeDogImg = document.createElement("img") as HTMLImageElement;
      removeDogImg.src = dog.img;
      const removeDogName = document.createElement("p") as HTMLParagraphElement;
      removeDogName.innerText = dog.name;

      removeDogCard.appendChild(removeDogImg);
      removeDogCard.appendChild(removeDogName);

      removeDogContainer.appendChild(removeDogCard);
    });
  }

});

// EVENTLISTENERS FOR MODALS!
modal.modal.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  //CONFIRM PROFILE EDITS
  if (target.id === "confirm-edit-btn") {
    const dynamicContent = `
      <h2>Endringene ble lagret!</h2>
          <img src="/images/success.png" alt="success" />
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
    modal.openModal(dynamicContent);
  }

  //CONFIRM ADDED DOG
  if (target.id === "confirm-add-dog-btn") {
    const dynamicContent = `
      <h2>"NAVN" ble lagt til i dine hunder!</h2>
          <img src="/images/success.png" alt="success" />
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
    modal.openModal(dynamicContent);
  }

  //CONFIRM PROFILE DELETION
  if (target.id === "confirm-delete-btn") {
    const dynamicContent = `
      <h2>Profilen din ble slettet!</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">AVSLUTT</button>
          </div>
      `;
    modal.openModal(dynamicContent);
  }

    //WARNING REMOVE DOG BUTTON
  if (target.id === "warning-remove-dog-btn") {
    const dynamicContent = `
    <h2>Er du sikker på at du ønsker å fjerne NAVN?</h2>
          <div class="remove-dog-container">
            <img src="/images/dog1.png" alt="Bilde av hund" />
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="remove-dog-btn">AVBRYT</button>
            <button class="btn btn-danger" id="confirm-remove-dog-btn">JA, FJERN HUND</button>
          </div>
    `;
    modal.openModal(dynamicContent);
  }

  //CONFIRM REMOVE DOG BTN
  if (target.id === "confirm-remove-dog-btn") {
    const dynamicContent = `
    <h2>NAVN er fjernet fra "mine hunder"</h2>
          <div class="remove-dog-container">
            <img src="/images/dog1.png" alt="Bilde av hund" />
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">GÅ TILBAKE</button>
          </div>
    `;
    modal.openModal(dynamicContent);
  }

  //CLOSE BUTTON
  if (target.id === "close-btn") {
    modal.closeModal();
  }

  // HER HAR JEG CLASS="TEST" PÅ KNAPPEN I _EDIT PROFILE_, KUN FOR Å VISE!!!!
  if (target.classList.contains("TEST")) {
    const dynamicContent = `
    <h2>OBS! Alle feltene må være fylt ut!</h2>
          <img src="/images/fail.png" alt="fail" />
          <div class="btn-container">
            <button class="btn btn-success" id="edit-profile-btn">FORTSETT</button>
          </div>
    `;
    modal.openModal(dynamicContent);
  }
});

//PROFILKORT
const userContainer = document.querySelector(".user-container") as HTMLElement;

userContainer.innerHTML = `
<h2>Hei, navn!</h2>
        <div class="info-container">
          <div class="user-img-container">
            <img src="${user.img}" alt="Profile picture" />
            <div class="star-container">
              <img src="/images/star-filled.png" alt="Fylt stjerne" />
              <img src="/images/star-filled.png" alt="Fylt stjerne" />
              <img src="/images/star-filled.png" alt="Fylt stjerne" />
              <img src="/images/star-filled.png" alt="Fylt stjerne" />
              <img src="/images/star-filled.png" alt="Fylt stjerne" />
            </div>
          </div>
          <div class="user-info">
            <p>Fornavn:</p>
            <p>Etternavn:</p>
            <p>Telefon:</p>
            <p>E-post:</p>
          </div>
          <div>
            <p>${user.firstName}</p>
            <p>${user.lastName}</p>
            <p>${user.number}</p>
            <p>${user.email}</p>
          </div>
        </div>
        <div class="btn-container">
          <button class="btn btn-warning" id="edit-profile-btn">REDIGER PROFIL</button>
          <button class="btn btn-danger" id="delete-profile-btn">SLETT PROFIL</button>
        </div>
`;

// HUNDEKORT
const dogContainer = document.querySelector(
  ".dog-card-container",
) as HTMLElement;

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
    this.dogCard.classList.add("dog-card");

    this.dogCardInfo = document.createElement("div");
    this.dogCardInfo.classList.add("dog-card-info");

    this.dogImg = document.createElement("img");

    this.dogInfo = document.createElement("div");
    this.dogInfo.classList.add("dog-info");
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
    this.editDogBtn.id = "edit-dog-btn";

    this.dogCardInfo.appendChild(this.dogImg);
    this.dogCardInfo.appendChild(this.dogInfo);
    this.dogCardInfo.appendChild(this.dogUserInfo);

    this.btnContainer.appendChild(this.editDogBtn);

    this.dogCard.appendChild(this.dogCardInfo);
    this.dogCard.appendChild(this.btnContainer);

    dogContainer.appendChild(this.dogCard);
  }
}

function createDogCard() {
  user.dogs.forEach((dog) => {
    const dogCard = new DogCard();

    dogCard.dogImg.src = dog.img;

    dogCard.dogUserInfo.innerHTML = `
    <p>${dog.name}</p>
    <p>${dog.breed}</p>
    <p>${dog.age} år</p>
    <p>${dog.allergy}</p>
  `;

    if (dogCard.editDogBtn) {
      dogCard.editDogBtn.addEventListener("click", () => {
        const dynamicContent = `
          <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="${dog.img}" alt="Bilde av hund" />
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <div class="user-input-form"">
              <label for="dog-name">Navn:</label>
              <input type="text" name="dog-name"value="${dog.name}"></input>
              <label for="dog-breed">Rase:</label>
              <input type="text" name="dog-breed"value="${dog.breed}"></input>
              <label for="dog-age">Alder:</label>
              <input type="text" name="dog-age "value="${dog.age}"></input>
              <label for="dog-allergy">Allergi:</label>
              <input type="text" name="dog-allergy" value="${dog.allergy}"></input>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-edit-btn">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
        modal.openModal(dynamicContent);
      });
    }
  });
}

createDogCard();



