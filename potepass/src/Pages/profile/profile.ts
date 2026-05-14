// FREDRIK

import { type User } from "../../types/user.type";
import { type Dog } from "../../types/dog.type";
import { getAllProfileBookings, getAllProfileSitters } from "../../requests/p-getBookingsAndSitters";
import { getAllUsers } from "../../requests/getAllUsers";
import { deleteUser } from "../../requests/deleteUser";
import { deleteDog } from "../../requests/deleteDog";
import { editUser } from "../../requests/editUser";
import { editDog } from "../../requests/editDog";
import { addDog } from "../../requests/addDog";
import { getAllDogs } from "../../requests/getAllDogs";

let currentUser: User | undefined = undefined;
let userDog: Dog[] = [];
let currentModal: HTMLDivElement | null = null;

await init();

document.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;

  switch (target.id) {
    case "edit-profile-btn": {
      if (!currentUser) return;
      createModal(createEditProfileModalHTML(currentUser));
      break;
    }
    case "edit-password-btn": {
      createModal(createChangePasswordModalHTML());
      break;
    }
    case "confirm-edit-password-btn": {
      if (!currentUser) return;
      const newPassword = changePassword();
      if (!newPassword) return;
      await editUser(currentUser.id, newPassword);
      await init();
      break;
    }
    case "delete-profile-btn": {
      createModal(createConfirmDeleteProfileModalHTML());
      break;
    }
    case "add-dog-btn": {
      createModal(createAddDogModalHTML());
      break;
    }
    case "remove-dog-btn": {
      if (!currentUser) return;
      createModal(createRemoveDogModalHTML());
      await selectDog(currentUser);
      break;
    }
    case "confirm-edit-btn": {
      await editUserInfo();
      break;
    }

    case "confirm-edit-dog-btn": {
      await editDogInfo(target);
      break;
    }
    case "confirm-add-dog-btn": {
      await addNewDogInfo();
      break;
    }
    case "confirm-delete-btn": {
      await removeUser();
      break;
    }
    case "warning-remove-dog-btn": {
      const data = await getSelectedRadio();
      if (!data) return;
      const { dog, dogId } = data;
      createModal(createRemoveDogWarningHTML(dog, dogId));
      break;
    }
    case "confirm-remove-dog-btn": {
      if (!currentUser) return;
      const target = document.querySelector(".remove-dog-container") as HTMLDivElement;
      await removeDog(target);
      await updateBookingNotification(currentUser);
      break;
    }
    case "edit-dog-btn": {
      const dog = await targetDog(target);
      if (!dog) return;
      createModal(createEditDogModal(dog));
      break;
    }
    case "bookings-btn": {
      if (!currentUser) return;
      createModal(createStatusBookingModalHTML());
      await renderBookings(currentUser);
      break;
    }
    case "p-logout-btn": {
      closeModal();
      const dynamicContent = `
          <h2 class="logout-txt" id="title">Logger ut..</h2>
              <img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" aria-hidden="true" draggable="false"/>
          `;
      createModal(dynamicContent);
      setTimeout(() => {
        localStorage.removeItem("storedUserId");
        localStorage.removeItem("storedPetsitterId");
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
});

// -------------------------------------------------------- USER -------------------------------------------------------- //

async function showUser(currentUser: User) {
  if (!currentUser) return;
  const userContainer = document.querySelector(".user-container") as HTMLElement;
  userContainer.innerHTML = renderUserInfo(currentUser);
}

function renderUserInfo(currentUser: User) {
  return `
<h2>Hei, ${currentUser.userName}!</h2>
        <div class="info-container">
          <div class="user-img-container">
            <img src="${currentUser.image || "/images/useravatar.png"}" alt="Profile picture" draggable="false"/>
          </div>
          <div class="user-info">
          <div class="info-row"><dt class="info-txt-bold">Navn:</dt><dd>${currentUser.userName}</dd></div>
          <div class="info-row"><dt class="info-txt-bold">E-post:</dt><dd>${currentUser.email}</dd></div>
          <div class="info-row"><dt class="info-txt-bold">Telefon:</dt><dd>${currentUser.phone}</dd></div>
          <div class="info-row"><dt class="info-txt-bold">Bosted:</dt><dd>${currentUser.location}</dd></div>
          <div class="info-row"><dt class="info-txt-bold">Informasjon:</dt><dd>${currentUser.description}</dd></div>
          </div>
        </div>
        <div class="btn-container">
          <button class="btn btn-warning" id="edit-profile-btn">REDIGER PROFIL</button>
        </div>
`;
}

function getUserEdits(): Partial<User> {
  const username = (document.getElementById("username-input") as HTMLInputElement).value;
  const email = (document.getElementById("email-input") as HTMLInputElement).value;
  const phone = (document.getElementById("phone-input") as HTMLInputElement).value;
  const location = (document.getElementById("location-input") as HTMLInputElement).value;
  const description = (document.getElementById("info-input") as HTMLInputElement).value;

  return {
    userName: username,
    email: email,
    phone: Number(phone),
    location: location,
    description: description,
  };
}

async function editUserInfo() {
  if (!currentUser) return;
  const userForm = document.getElementById("edit-user-form") as HTMLFormElement;
  const validForm = checkFormValidity(userForm);

  if (validForm === false) {
    return;
  } else {
    const editedUser = getUserEdits();

    const dynamicContent = `
      <h2 id="title">Lagrer endringer...</h2>
          <img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" aria-hidden="true" draggable="false"/>
      `;
    createModal(dynamicContent);
    await editUser(currentUser.id, editedUser);

    const updatedUser = await getAllUsers();
    const userId = localStorage.getItem("storedUserId");

    currentUser = updatedUser.find((user) => user.id === Number(userId));

    if (!currentUser) return;
    await showUser(currentUser);

    setTimeout(() => {
      const dynamicContent = `
      <h2 id="title">Endringene ble lagret!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
      createModal(dynamicContent);
    }, 2000);
  }
}

function createEditProfileModalHTML(currentUser: User) {
  return `
      <h2 id="title">Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="${currentUser.image || "/images/useravatar.png"}" alt="Bilde av person" draggable="false"/>
              <label class="btn btn-success edit-user-btns">
                    LAST OPP BILDE
                    <input type="file" hidden aria-label="last opp et bilde av deg selv"/>
                  </label>
              <button class="btn btn-warning edit-user-btns" id="edit-password-btn">ENDRE PASSORD</button>
              <button class="btn btn-danger edit-user-btns" id="delete-profile-btn">SLETT PROFIL</button>
            </div>
            <form class="p-user-input-form" id="edit-user-form">
            <label for="username-input">Brukernavn:</label>
            <input type="text" name="username" value="${currentUser.userName}" id="username-input" class="req-input" required/>
            <label for="email-input">E-post:</label>
            <input type="text" name="email" value="${currentUser.email}" id="email-input" class="req-input" required/>
            <label for="phone-input">Telefon:</label>
            <input type="text" name="phone" value="${currentUser.phone}" id="phone-input" class="req-input" required/>
            <label for="location-input">Bosted:</label>
            <input type="text" name="location" value="${currentUser.location}" id="location-input" class="req-input" required/>
            <label for="info-input">Informasjon:</label>
            <textarea name="info" id="info-input" class="req-input" required/>${currentUser.description}</textarea>
            </form>
          </div>
          <p class="error-txt" id="error-txt"></p>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-edit-btn" type="submit" form="edit-user-form">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
}

function changePassword(): Partial<User> | null {
  const passwordForm = document.getElementById("edit-password-form") as HTMLFormElement;
  const validForm = checkFormValidity(passwordForm);

  if (validForm === false) {
    return null;
  }

  const oldPasswordInput = String(
    (document.getElementById("old-password-input") as HTMLInputElement).value.toLowerCase(),
  );
  const newPasswordInput = String(
    (document.getElementById("new-password-input") as HTMLInputElement).value.toLowerCase(),
  );
  const repeatNewPasswordInput = String(
    (document.getElementById("repeat-new-password-input") as HTMLInputElement).value.toLowerCase(),
  );

  if (!currentUser) return null;
  const oldPassword = String(currentUser.password).toLowerCase();

  if (oldPassword != oldPasswordInput) {
    const dynamicContent = `
      <h2 id="title">Tidligere passord er ikke riktig!</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="edit-password-btn">PRØV PÅ NYTT!</button>
          </div>
  `;
    createModal(dynamicContent);
    return {};
  } else if (oldPassword === oldPasswordInput && newPasswordInput != repeatNewPasswordInput) {
    const dynamicContent = `
      <h2 id="title">De nye passordene er ikke like!</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="edit-password-btn">PRØV PÅ NYTT!</button>
          </div>
  `;
    createModal(dynamicContent);
    return {};
  } else {
    const dynamicContent = `
      <h2 id="title">Lagrer endringer...</h2>
     <img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" aria-hidden="true" draggable="false"/>
`;
    createModal(dynamicContent);

    setTimeout(() => {
      const dynamicContent = `
    <h2 id="title">Passordet er endret!</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
    `;
      createModal(dynamicContent);
    }, 2000);
    return {
      password: newPasswordInput,
    };
  }
}

function createChangePasswordModalHTML() {
  return `
      <h2 id="title">Hva ønsker du å redigere?</h2>
        <div class="add-edit-modal-card password-form">
          <form class="p-user-input-form " id="edit-password-form">
            <label for="old-password-input">Tidligere passord:</label>
              <input type="password" name="old-password-input" value="" id="old-password-input" class="req-input" required>
            <label for="new-password-input">Nytt passord:</label>
              <input type="password" name="new-password-input" value="" id="new-password-input" class="req-input" required>
            <label for="repeat-new-password-input">Gjenta nytt passord:</label>
              <input type="password" name="new-password-input" value="" id="repeat-new-password-input" class="req-input" required>
              <p id="error-txt"></p>
          </form>
          <p id="error-txt"></p>
        </div>
         <div class="btn-container password-modal-btn-container">
            <button class="btn btn-success" id="confirm-edit-password-btn" type="submit" form="edit-password-form">ENDRE PASSORD</button>
            <button class="btn btn-danger" id="edit-profile-btn">AVBRYT</button>
          </div>
      `;
}

async function removeUser() {
  if (!currentUser) return;
  await deleteUser(currentUser.id);
  const dynamicContent = `
      <h2 id="title">Sletter profil...</h2>
          <img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" aria-hidden="true" draggable="false"/>
      `;
  createModal(dynamicContent);
  localStorage.removeItem("storedUserId");
  localStorage.removeItem("storedPetsitterId");
  setTimeout(() => {
    const dynamicContent = `
      <h2 id="title">Profilen din ble slettet!</h2>
      `;
    createModal(dynamicContent);
    window.location.replace("./index.html");
  }, 2000);
}

function createConfirmDeleteProfileModalHTML() {
  return `
          <h2 id="title">Er du sikker på at du ønsker å slette profilen din?</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-delete-btn">JA, SLETT PROFIL</button>
            <button class="btn btn-danger" id="edit-profile-btn">NEI, GÅ TILBAKE</button>
          </div>
  `;
}

// -------------------------------------------------------- DOGS -------------------------------------------------------- //

function createDogCard(userDog: Dog[], currentUser: User) {
  const dogContainer = document.querySelector(".dog-card-container") as HTMLElement;
  dogContainer.innerHTML = "";

  const userDogs = userDog.filter((dog) => dog.petOwnerId === currentUser.id);

  if (userDogs.length === 0) {
    dogContainer.innerHTML = `<h2>Du har ikke lagt til noen hunder enda..</h2>`;
    (document.getElementById("remove-dog-btn") as HTMLButtonElement).style.display = "none";
  } else {
    (document.getElementById("remove-dog-btn") as HTMLButtonElement).style.display = "block";
    for (const dog of userDogs) {
      const dogCard = document.createElement("div") as HTMLDivElement;
      dogCard.classList.add("dog-card");

      const dogCardInfo = document.createElement("div") as HTMLDivElement;
      dogCardInfo.classList.add("dog-card-info");

      const dogImg = document.createElement("img") as HTMLImageElement;

      const dogInfo = document.createElement("div") as HTMLDivElement;
      dogInfo.classList.add("dog-info");
      dogInfo.innerHTML = `
      <div class="info-row"><dt class="info-txt-bold">Navn:</dt><dd>${dog.name}</dd></div>
      <div class="info-row"><dt class="info-txt-bold">Rase:</dt><dd>${dog.breed}</dd></div>
      <div class="info-row"><dt class="info-txt-bold">Alder:</dt><dd>${dog.age} år</dd></div>
      <div class="info-row"><dt class="info-txt-bold">Allergier:</dt><dd>${dog.allergies.length ? dog.allergies.join(", ") : "Ingen"}</dd></div>
    `;

      const btnContainer = document.createElement("div") as HTMLDivElement;
      btnContainer.classList.add("btn-container");

      const editDogBtn = document.createElement("button") as HTMLButtonElement;
      editDogBtn.textContent = "REDIGER";
      editDogBtn.classList.add("btn", "btn-warning");
      editDogBtn.id = "edit-dog-btn";
      editDogBtn.dataset.id = String(dog.id);

      dogCardInfo.appendChild(dogImg);
      dogCardInfo.appendChild(dogInfo);

      btnContainer.appendChild(editDogBtn);

      dogCard.appendChild(dogCardInfo);
      dogCard.appendChild(btnContainer);

      dogContainer.appendChild(dogCard);

      dogImg.src = dog.image || "/images/dogicon.png";
      dogImg.draggable = false;
    }
  }
}

function getDogEdits(): Partial<Dog> {
  const dogName = (document.getElementById("dog-name-input") as HTMLInputElement).value;
  const dogBreed = (document.getElementById("dog-breed-input") as HTMLInputElement).value;
  const dogAge = (document.getElementById("dog-age-input") as HTMLInputElement).value;
  const dogAllergies = (document.getElementById("dog-allergies-input") as HTMLInputElement).value;
  const dogImage = (document.getElementById("dog-image") as HTMLInputElement).value;

  if (dogAllergies === "") {
    return {
      name: dogName,
      breed: dogBreed,
      age: Number(dogAge),
      image: dogImage,
      allergies: [],
    };
  } else {
    return {
      name: dogName,
      breed: dogBreed,
      age: Number(dogAge),
      image: dogImage,
      allergies: [dogAllergies],
    };
  }
}

async function editDogInfo(target: HTMLElement) {
  const userForm = document.getElementById("edit-dog-form") as HTMLFormElement;
  const validForm = checkFormValidity(userForm);

  if (validForm === false) {
    return;
  }

  const dogId = Number((target as HTMLElement).dataset.id);
  const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

  if (!dog) return;

  const editedDog = getDogEdits();
  const dynamicContent = `
      <h2 id="title">Lagrer endringer...</h2>
          <div class="dog-spinner" alt="Loading spinner" aria-hidden="true" draggable="false"/></div>
      `;
  createModal(dynamicContent);
  await editDog(dog.id, editedDog);

  const updatedDog = await getAllDogs();

  setTimeout(() => {
    if (!currentUser) return;
    createDogCard(updatedDog, currentUser);
    const dynamicContent = `
      <h2 id="title">Endringene ble lagret!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
    createModal(dynamicContent);
  }, 2000);
}

function createEditDogModal(dog: Dog) {
  return `
          <h2 id="title">Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="${dog.image || "/images/dogicon.png"}" alt="Bilde av hund" id="dog-image" draggable="false"/>
              <label class="btn btn-success edit-user-btns">
                    LAST OPP BILDE
                    <input type="file" hidden aria-label="Last opp bilde av hund"/>
                  </label>
            </div>
            <form class="p-user-input-form" id="edit-dog-form">
              <label for="dog-name-input">Navn:</label>
              <input type="text" name="dog-name"value="${dog.name}" id="dog-name-input" class="req-input" required>
              <label for="dog-breed-input">Rase:</label>
              <input type="text" name="dog-breed"value="${dog.breed}" id="dog-breed-input" class="req-input" required>
              <label for="dog-age-input">Alder:</label>
              <input type="number" name="dog-age" value="${dog.age}" id="dog-age-input" min="1" max="25" class="req-input" required>
              <label for="dog-allergies-input">Allergi:</label>
              <input type="text" name="dog-allergy" value="${dog.allergies.length ? dog.allergies.join(", ") : ""}" id="dog-allergies-input">
            </form>
          </div>
          <p class="error-txt" id="error-txt"></p>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-edit-dog-btn" type="submit" form="edit-dog-form" data-id="${String(dog.id)}">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
}

function getNewDog(): Partial<Dog> {
  const dogName = (document.getElementById("dog-name-input") as HTMLInputElement).value;
  const dogBreed = (document.getElementById("dog-breed-input") as HTMLInputElement).value;
  const dogAge = (document.getElementById("dog-age-input") as HTMLInputElement).value;
  const dogAllergies = (document.getElementById("dog-allergies-input") as HTMLInputElement).value;

  if (dogAllergies === "") {
    return {
      petOwnerId: currentUser?.id,
      name: dogName,
      breed: dogBreed,
      age: Number(dogAge),
      image: "",
      allergies: [],
    };
  } else
    return {
      petOwnerId: currentUser?.id,
      name: dogName,
      breed: dogBreed,
      age: Number(dogAge),
      image: "",
      allergies: [dogAllergies],
    };
}

async function addNewDogInfo() {
  if (!currentUser) return;

  const addDogForm = document.getElementById("add-dog-form") as HTMLFormElement;
  const validForm = checkFormValidity(addDogForm);

  if (validForm === false) {
    return;
  } else {
    const newDog = getNewDog();
    const dynamicContent = `
      <h2 id="title>Legger til ${newDog.name}...</h2>
          <div class="dog-spinner"></div>
      `;
    createModal(dynamicContent);

    await addDog(newDog);
    const userDog = await getAllDogs();

    setTimeout(() => {
      if (!currentUser) return;
      createDogCard(userDog, currentUser);
      const dynamicContent = `
      <h2 id="title">${newDog.name} ble lagt til i "mine hunder"!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">FORTSETT</button>
          </div>
      `;
      createModal(dynamicContent);
    }, 2000);
  }
}

function createAddDogModalHTML() {
  return `
          <h2 id="title">Legg til hund</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/dogicon.png" alt="Bilde av hund" id="dog-image" draggable="false"/>
              <label class="btn btn-success edit-user-btns">
                    LAST OPP BILDE
                    <input type="file" hidden aria-label="Last opp bilde av hund"/>
                  </label>
            </div>
           <form class="p-user-input-form" id="add-dog-form">
              <label for="dog-name-input">Navn:</label>
              <input type="text" name="dog-name" value="" id="dog-name-input" class="req-input" required>
              <label for="dog-breed-input">Rase:</label>
              <input type="text" name="dog-breed" value="" id="dog-breed-input" class="req-input" required>
              <label for="dog-age-input">Alder:</label>
              <input type="number" name="dog-age" value="" id="dog-age-input" class="req-input" required min="1" max="25">
              <label for="dog-allergies-input">Allergier:</label>
              <input type="text" name="dog-allergies" value="" id="dog-allergies-input">
            </form>
          </div>
          <p class="error-txt" id="error-txt" aria-live="polite"></p>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-add-dog-btn" type="submit" form="add-dog-form">LEGG TIL HUND</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
}

async function removeDog(target: HTMLDivElement) {
  if (!currentUser) return;
  const selectedDog = target;

  const dogId = Number(selectedDog.dataset.id);
  const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

  if (!dog) return;

  const dynamicContent = `
    <h2 id="title">Forsøker å fjerne ${dog.name} fra "mine hunder"..</h2>
          <div class="dog-spinner" aria-hidden="true"></div>
    `;
  createModal(dynamicContent);

  await deleteDog(dogId);
  await getBookings(currentUser);
  const updatedDogs = await getAllDogs();

  setTimeout(() => {
    if (!currentUser) return;
    createDogCard(updatedDogs, currentUser);
    const dynamicContent = `
    <h2 id="title">${dog.name} er fjernet fra "mine hunder"</h2>
          <div class="remove-dog-container">
            <img src="${dog.image || "/images/dogicon.png"}" alt="Bilde av hund" draggable="false"/>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">GÅ TILBAKE</button>
          </div>
    `;
    createModal(dynamicContent);
  }, 2000);
}

async function targetDog(targetBtn: HTMLElement) {
  userDog = await getAllDogs();

  const dogId = Number(targetBtn.dataset.id);
  const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

  return dog;
}

async function getSelectedRadio(): Promise<{ dog: Dog; dogId: number } | null> {
  const userDog = await getAllDogs();
  const selectedRadio = document.querySelector<HTMLInputElement>('input[name="choice"]:checked');

  if (!selectedRadio) return null;

  const dogId = Number(selectedRadio?.dataset.id);
  const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

  if (!dog) return null;
  return { dog, dogId };
}

async function selectDog(currentUser: User) {
  const removeDogContainer = document.querySelector(".remove-dog-container") as HTMLDivElement;

  const checkboxes = document.getElementById("remove-dog-checkboxes") as HTMLDivElement;

  let updatedDogList = await getAllDogs();

  updatedDogList = updatedDogList.filter((dog) => dog.petOwnerId === currentUser.id);

  for (const dog of updatedDogList) {
    const removeDogCard = document.createElement("div") as HTMLDivElement;
    removeDogCard.classList.add("remove-dog-card");
    removeDogCard.dataset.id = String(dog.id);
    removeDogCard.setAttribute("role", "button");
    removeDogCard.setAttribute("aria-labelledby", `dog-name-${dog.id}`)
    const removeDogImg = document.createElement("img") as HTMLImageElement;
    removeDogImg.src = dog.image || "/images/dogicon.png";
    removeDogImg.draggable = false;
    const removeDogName = document.createElement("h2") as HTMLHeadingElement;
    removeDogName.innerText = dog.name;

    const dogLabel = document.createElement("label") as HTMLLabelElement;
    dogLabel.htmlFor = "for" + String(dog.id);
    const dogCheckbox = document.createElement("input") as HTMLInputElement;
    dogCheckbox.id = "for" + String(dog.id);
    dogCheckbox.dataset.id = String(dog.id);
    dogCheckbox.type = "radio";
    dogCheckbox.name = "choice";
    dogCheckbox.value = dog.name;

    dogLabel.appendChild(dogCheckbox);
    checkboxes.appendChild(dogLabel);

    removeDogCard.appendChild(removeDogName);
    removeDogCard.appendChild(removeDogImg);

    removeDogContainer.appendChild(removeDogCard);

    removeDogCard.addEventListener("click", () => {
      const allCards = document.querySelectorAll(".remove-dog-card");
      for (const pressed of allCards) {
        pressed.classList.remove("pressed");
      }
      removeDogCard.classList.add("pressed");
      dogCheckbox.checked = true;
    });
  }
}

function createRemoveDogWarningHTML(dog: Dog, dogId: number) {
  return `
    <h2 id="title">Er du sikker på at du ønsker å fjerne ${dog.name}?</h2>
          <div class="remove-dog-container" data-id="${dogId}">
            <img src="${dog.image || "/images/dogicon.png"}" alt="Bilde av hund" draggable="false"/>
          </div>
          <div class="btn-container">
          <button class="btn btn-success" id="confirm-remove-dog-btn">JA, FJERN HUND</button>
            <button class="btn btn-danger" id="remove-dog-btn">AVBRYT</button>
          </div>
    `;
}

function createRemoveDogModalHTML() {
  return `
          <h2 id="title">Hvilken hund ønsker du å fjerne?</h2>
          <div id="profile-checkbox-container" class="profile-checkbox-container" arie-hidden="true"> 
            <form id="remove-dog-checkboxes">
            </form>
          </div>
          <div class="remove-dog-container">
          </div>
          <p class="error-txt">Trykk på hunden du ønsker å fjerne for å velge den.</p>
          <div class="btn-container">
            <button class="btn btn-success" id="warning-remove-dog-btn">FJERN VALGT HUND</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
}

// -------------------------------------------------------- BOOKING -------------------------------------------------------- //

async function getBookings(currentUser: User) {
  const allBookings = await getAllProfileBookings();
  const allSitters = await getAllProfileSitters();
  const allDogs = await getAllDogs();
  const currentUserBookings = allBookings.filter((bookings) => bookings.userId === currentUser.id);

  return {
    currentUserBookings,
    allSitters,
    allDogs,
  };
}

async function checkValidBookings(currentUser: User) {
  const { currentUserBookings, allSitters, allDogs } = await getBookings(currentUser);

  const validBookings = currentUserBookings.filter((booking) => {
    const sitter = allSitters.find((sitter) => sitter.id === booking.petSitterId);
    const dog = allDogs.find((dog) => booking.userDogId.includes(dog.id));

    return sitter && dog;
  });

  return validBookings;
}

async function renderBookings(currentUser: User) {
  const { allSitters, allDogs } = await getBookings(currentUser);

  const bookingContainer = document.getElementById("booking-container") as HTMLDivElement;
  const booking = document.getElementById("booking") as HTMLDivElement;
  const bookingTitle = document.getElementById("booking-title") as HTMLHeadingElement;

  const validBookings = await checkValidBookings(currentUser);

  if (validBookings.length === 0) {
    bookingContainer.innerHTML = `<h2>Du har ingen aktive bookinger.</h2>`;
    booking.innerHTML = "";
    bookingTitle.innerText = "";
    return;
  } else
    for (const booking of validBookings) {
      const sitter = allSitters.find((sitter) => sitter.id === booking.petSitterId);
      const dog = allDogs.find((dog) => booking.userDogId.includes(dog.id));

      if (!dog || !sitter) continue;
      bookingContainer.innerHTML += `
        <div class="booking-card">
      <div class="booking-sitter">
          <p>${sitter.name}</p>
          <img src="${sitter.image || "/images/useravatar.png"}" alt="">
        </div>
        <div class="booking-info">
          <p>${booking.fromDate} - ${booking.toDate}</p>
          <p>${sitter.location}</p>
        </div>
        <div class="booking-dog">
          <p>${dog.name}</p>
          <img src="${dog.image || "/images/dogicon.png"}" alt="">
        </div>
        <div class="booking-status">
          <div id="${(booking.status, booking.id)}-dot" class="${booking.status} booking-status-dot"></div>
          <p id="${(booking.status, booking.id)}"></p>
        </div>
      </div>
      `;

      const statusText = document.getElementById(`${(booking.status, booking.id)}`) as HTMLParagraphElement;
      const bookingStatusDot = document.getElementById(`${(booking.status, booking.id)}-dot`) as HTMLParagraphElement;
      if (booking.status === "accepted") {
        statusText.innerHTML = "AKSEPTERT";
        bookingStatusDot.style.backgroundColor = "#4caf50";
      } else if (booking.status === "pending") {
        statusText.innerHTML = "UNDER BEHANDLING";
        bookingStatusDot.style.backgroundColor = "#e8a04a";
      } else {
        statusText.innerHTML = "AVSLÅTT";
        bookingStatusDot.style.backgroundColor = "#d9534f";
      }
    }
  await updateBookingNotification(currentUser);
}

async function updateBookingNotification(currentUser: User) {
  const validBookings = await checkValidBookings(currentUser);
  const notif = document.querySelector(".notif") as HTMLSpanElement;

  if (!notif) return;

  if (validBookings.length === 0) {
    notif.style.display = "none";
  } else {
    notif.style.display = "flex";
    notif.innerHTML = `<p>${validBookings.length}</p>`;
  }
}

function createStatusBookingModalHTML() {
  return `
      <h2 id="booking-title">Mine bookinger:</h2>
      <div class="booking" id="booking">
          <p>PASSER:</p>
          <p>INFO:</p>
          <p>HUND:</p>
          <p>STATUS:</p>
        </div>
        <div class="booking-container" id="booking-container"></div>
        <div class="btn-container">
            <button class="btn btn-success" id="close-btn">TILBAKE</button>
          </div>
        `;
}

// -------------------------------------------------------- X -------------------------------------------------------- //

async function init() {
  const userId = localStorage.getItem("storedUserId");

  if (!userId) {
    window.location.replace("./index.html");
    return;
  }

  const users: User[] = await getAllUsers();
  const user: User | undefined = users.find((user) => String(user.id) === userId);

  if (!user) {
    localStorage.removeItem("storedUserId");
    localStorage.removeItem("storedPetsitterId");
    window.location.replace("./index.html");
    return;
  } else {
    currentUser = user;
  }

  userDog = await getAllDogs();

  await showUser(currentUser);
  createDogCard(userDog, currentUser);
  await getBookings(currentUser);
  await updateBookingNotification(currentUser);
}

function createModal(dynamicContent: string) {
  closeModal();
  document.body.style.overflow = "hidden";
  
  const elementsToInert = document.querySelectorAll(".inert")as NodeListOf<HTMLElement>;
  elementsToInert.forEach((element) => {
    element.inert = true;
  })
  

  const modalBackdrop = document.createElement("div") as HTMLDivElement;
  const modal = document.createElement("div") as HTMLDivElement;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labeledby", "title booking-title");
  

  modal.classList.add("profile-modal");

  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);

  modalBackdrop.classList.add("profile-modal-backdrop");
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
  const elementsToInert = document.querySelectorAll(".inert") as NodeListOf<HTMLElement>;
  elementsToInert.forEach((element) => {
    element.inert = false;
  });
}

function checkFormValidity(form: HTMLFormElement) {
  const required = document.querySelectorAll(".req-input") as NodeListOf<HTMLInputElement>;

  const errorTxt = document.getElementById("error-txt") as HTMLParagraphElement;

  if (!form.checkValidity()) {
    required.forEach((input) => {
      if (input.value === "") {
        input.style.border = "2px solid #d9534f";
      } else {
        input.style.border = "none";
      }
    });
    errorTxt.innerText = "ALLE FELTENE MÅ VÆRE FYLT UT!";
    return false;
  } else {
    return true;
  }
}
