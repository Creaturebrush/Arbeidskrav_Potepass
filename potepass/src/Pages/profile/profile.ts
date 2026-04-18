import { type User } from "../../types/user.type";
import { getAllUsers } from "../../requests/users-api";

let currentUser: User | null = null;

async function init() {
  const users: User[] = await getAllUsers();
  currentUser = users[0];

  if (!currentUser) return;

  showUser(currentUser);
  createDogCard();
}

init();

async function showUser(currentUser: User) {
  const userContainer = document.querySelector(
    ".user-container",
  ) as HTMLElement;

  if (!currentUser) return;

  userContainer.innerHTML = `
<h2>Hei, ${currentUser.userName}!</h2>
        <div class="info-container">
          <div class="user-img-container">
            <img src="${currentUser.image || "/images/useravatar.png"}" alt="Profile picture" draggable="false"/>
            <div class="star-container">
              <img src="/images/star-filled.png" alt="Fylt stjerne" draggable="false"/>
              <img src="/images/star-filled.png" alt="Fylt stjerne" draggable="false"/>
              <img src="/images/star-filled.png" alt="Fylt stjerne" draggable="false"/>
              <img src="/images/star-filled.png" alt="Fylt stjerne" draggable="false"/>
              <img src="/images/star-filled.png" alt="Fylt stjerne" draggable="false"/>
            </div>
          </div>
          <div class="user-info">
            <p>Navn:</p>
            <p>E-post:</p>
            <p>Telefon:</p>
            <p>Bosted:</p>
            <p>Bio:</p>
          </div>
          <div>
            <p>${currentUser.userName}</p>
            <p>${currentUser.email}</p>
            <p>${currentUser.phone}</p>
            <p>${currentUser.location}</p>
            <p>${currentUser.description}</p>
          </div>
        </div>
        <div class="btn-container">
          <button class="btn btn-warning" id="edit-profile-btn">REDIGER PROFIL</button>
          <button class="btn btn-danger" id="delete-profile-btn">SLETT PROFIL</button>
        </div>
`;
}

//MODALS

let currentModal: HTMLDivElement | null = null;

function createModal(dynamicContent: string) {
  closeModal();

  document.body.style.overflow = "hidden";

  const modalBackdrop = document.createElement("div") as HTMLDivElement;
  const modal = document.createElement("div") as HTMLDivElement;

  modal.classList.add("profile-modal");

  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);

  modalBackdrop.classList.add("profile-modal-backdrop");
  modal.innerHTML = dynamicContent;
  modal.classList.add("open");

  currentModal = modalBackdrop;
}

function closeModal() {
  currentModal?.remove();
  currentModal = null;

  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  switch (target.id) {
    case "edit-profile-btn": {
      if (!currentUser) return;
      const dynamicContent = `
      <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/useravatar.png" alt="Bilde av person" draggable="false"/>
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <form class="user-input-form">
            <label for="username">Brukernavn:</label>
            <input type="text" name="username" value="${currentUser.userName}"></input>
            <label for="email">E-post:</label>
            <input type="text" name="email" value="${currentUser.email}"></input>
            <label for="phone">Telefon:</label>
            <input type="text" name="phone" value="${currentUser.phone}"></input>
            <label for="location">Bosted:</label>
            <input type="text" name="location" value="${currentUser.location}"></input>
            <label for="bio">Bio:</label>
            <textarea name="bio">${currentUser.description}</textarea>
            </form>
          </div>
          <div class="btn-container">
            <button class="btn btn-success TEST" id="confirm-edit-btn">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
      createModal(dynamicContent);
      break;
    }
    case "delete-profile-btn": {
      const dynamicContent = `
          <h2>Er du sikker på at du ønsker å slette profilen din?</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">NEI, GÅ TILBAKE</button>
            <button class="btn btn-danger" id="confirm-delete-btn">JA, SLETT PROFIL</button>
          </div>
  `;
      createModal(dynamicContent);
      break;
    }
    case "add-dog-btn": {
      const dynamicContent = `
          <h2>Legg til hund</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/dogicon.png" alt="Bilde av hund" draggable="false"/>
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
           <div class="user-input-form">
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
      createModal(dynamicContent);
      break;
    }
    case "remove-dog-btn": {
      if (!currentUser) return;

      const dynamicContent = `
          <h2>Hvilken hund ønsker du å fjerne?</h2>
          <div class="remove-dog-container">
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">AVBRYT</button>
            <button class="btn btn-danger" id="warning-remove-dog-btn">FJERN VALGT HUND</button>
          </div>
  `;
      createModal(dynamicContent);

      const removeDogContainer = document.querySelector(
        ".remove-dog-container",
      ) as HTMLDivElement;

      currentUser.dogs.forEach((dog) => {
        const removeDogCard = document.createElement("div") as HTMLDivElement;
        removeDogCard.classList.add("remove-dog-card");
        removeDogCard.dataset.id = dog.id.toString();
        const removeDogImg = document.createElement("img") as HTMLImageElement;
        removeDogImg.src = dog.image || "/images/dogicon.png";
        removeDogImg.draggable = false;
        const removeDogName = document.createElement(
          "p",
        ) as HTMLParagraphElement;
        removeDogName.innerText = dog.name;

        removeDogCard.appendChild(removeDogImg);
        removeDogCard.appendChild(removeDogName);

        removeDogContainer.appendChild(removeDogCard);
      });
      break;
    }
    case "confirm-edit-btn": {
      const dynamicContent = `
      <h2>Endringene ble lagret!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
      createModal(dynamicContent);
      break;
    }
    case "confirm-add-dog-btn": {
      const dynamicContent = `
      <h2>"NAVN" ble lagt til i dine hunder!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
      createModal(dynamicContent);
      break;
    }
    case "confirm-delete-btn": {
      const dynamicContent = `
      <h2>Profilen din ble slettet!</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">AVSLUTT</button>
          </div>
      `;
      createModal(dynamicContent);
      break;
    }
    case "warning-remove-dog-btn": {
      const dynamicContent = `
    <h2>Er du sikker på at du ønsker å fjerne NAVN?</h2>
          <div class="remove-dog-container">
            <img src="/images/dog1.png" alt="Bilde av hund" draggable="false"/>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="remove-dog-btn">AVBRYT</button>
            <button class="btn btn-danger" id="confirm-remove-dog-btn">JA, FJERN HUND</button>
          </div>
    `;
      createModal(dynamicContent);
      break;
    }
    case "confirm-remove-dog-btn": {
      const dynamicContent = `
    <h2>NAVN er fjernet fra "mine hunder"</h2>
          <div class="remove-dog-container">
            <img src="/images/dog1.png" alt="Bilde av hund" draggable="false"/>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">GÅ TILBAKE</button>
          </div>
    `;
      createModal(dynamicContent);
      break;
    }
    case "edit-dog-btn": {
      if (!currentUser) return;

      const dogId = Number((target as HTMLElement).dataset.id);
      const dog = currentUser.dogs.find((d) => d.id === dogId);

      if (!dog) return;

      const dynamicContent = `
          <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="${dog.image}" alt="Bilde av hund" draggable="false"/>
              <button class="btn btn-success">LAST OPP BILDE</button>
            </div>
            <div class="user-input-form">
              <label for="dog-name">Navn:</label>
              <input type="text" name="dog-name"value="${dog.name}"></input>
              <label for="dog-breed">Rase:</label>
              <input type="text" name="dog-breed"value="${dog.breed}"></input>
              <label for="dog-age">Alder:</label>
              <input type="text" name="dog-age" value="${dog.age}"></input>
              <label for="dog-allergy">Allergi:</label>
              <input type="text" name="dog-allergy" value="${dog.allergies.length ? dog.allergies.join(", ") : ""}"></input>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-edit-btn">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
      createModal(dynamicContent);
      break;
    }
    case "close-btn": {
      closeModal();
      break;
    }
    default:
      break;
  }
});

/* HER HAR JEG CLASS="TEST" PÅ KNAPPEN I _EDIT PROFILE_, KUN FOR Å VISE!!!!
  if (target.classList.contains("TEST")) {
    const dynamicContent = `
    <h2>OBS! Alle feltene må være fylt ut!</h2>
          <img src="/images/fail.png" alt="fail" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="edit-profile-btn">FORTSETT</button>
          </div>
    `;
    modal.openModal(dynamicContent);
  }
});
*/

//PROFILKORT

function createDogCard() {
  if (!currentUser) return;
  const dogContainer = document.querySelector(
    ".dog-card-container",
  ) as HTMLElement;

  dogContainer.innerHTML = "";

  currentUser.dogs.forEach((dog) => {
    const dogCard = document.createElement("div") as HTMLDivElement;
    dogCard.classList.add("dog-card");

    const dogCardInfo = document.createElement("div") as HTMLDivElement;
    dogCardInfo.classList.add("dog-card-info");

    const dogImg = document.createElement("img") as HTMLImageElement;

    const dogInfo = document.createElement("div") as HTMLDivElement;
    dogInfo.classList.add("dog-info");
    dogInfo.innerHTML = `
      <p>Navn:</p>
      <p>Rase:</p>
      <p>Alder:</p>
      <p>Allergier:</p>
    `;

    const dogUserInfo = document.createElement("div") as HTMLDivElement;
    dogUserInfo.classList.add("dog-user-info");

    const btnContainer = document.createElement("div") as HTMLDivElement;
    btnContainer.classList.add("btn-container");

    const editDogBtn = document.createElement("button") as HTMLButtonElement;
    editDogBtn.textContent = "REDIGER";
    editDogBtn.classList.add("btn", "btn-warning");
    editDogBtn.id = "edit-dog-btn";
    editDogBtn.dataset.id = dog.id.toString();

    dogCardInfo.appendChild(dogImg);
    dogCardInfo.appendChild(dogInfo);
    dogCardInfo.appendChild(dogUserInfo);

    btnContainer.appendChild(editDogBtn);

    dogCard.appendChild(dogCardInfo);
    dogCard.appendChild(btnContainer);

    dogContainer.appendChild(dogCard);

    dogImg.src = dog.image || "/images/dogicon.png";
    dogImg.draggable = false;

    dogUserInfo.innerHTML = `
    <p>${dog.name}</p>
    <p>${dog.breed}</p>
    <p>${dog.age} år</p>
    <p>${dog.allergies.length ? dog.allergies.join(", ") : "Ingen"}</p>
  `;
  });
}
