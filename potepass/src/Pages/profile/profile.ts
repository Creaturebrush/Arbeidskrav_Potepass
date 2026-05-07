// FREDRIK

import { type User } from "../../types/user.type";
import { type Dog } from "../../types/dog.type";
import {
  getAllProfileBookings,
  getAllProfileSitters,
} from "../../requests/p-getBookingsAndSitters";
import { getAllUsers } from "../../requests/getAllUsers";
import { deleteUser } from "../../requests/deleteUser";
import { deleteDog } from "../../requests/deleteDog";
import { editUser } from "../../requests/editUser";
import { editDog } from "../../requests/editDog";
import { addDog } from "../../requests/addDog";
import { getAllDogs } from "../../requests/getAllDogs";

let currentUser: User | undefined = undefined;
let userDog: Dog[] = [];

async function init() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.location.replace("./index.html");
    return;
  }

  const users: User[] = await getAllUsers();
  const user: User | undefined = users.find(
    (user) => String(user.id) === userId,
  );

  if (!user) {
    localStorage.removeItem("userId");
    window.location.replace("./index.html");
    return;
  } else {
    currentUser = user;
  }

  userDog = await getAllDogs();

  showUser(currentUser);
  createDogCard(userDog, currentUser);
  getBookings(currentUser);
}

init();

async function showUser(currentUser: User) {
  if (!currentUser) return;
  const userContainer = document.querySelector(
    ".user-container",
  ) as HTMLElement;

  userContainer.innerHTML = `
<h2>Hei, ${currentUser.userName}!</h2>
        <div class="info-container">
          <div class="user-img-container">
            <img src="${currentUser.image || "/images/useravatar.png"}" alt="Profile picture" draggable="false"/>
          </div>
          <div class="user-info">
          <span><p class="info-txt-bold">Navn:</p><p>${currentUser.userName}</p></span>
          <span><p class="info-txt-bold">E-post:</p><p>${currentUser.email}</p></span>
          <span><p class="info-txt-bold">Telefon:</p><p>${currentUser.phone}</p></span>
          <span><p class="info-txt-bold">Bosted:</p><p>${currentUser.location}</p></span>
          <span><p class="info-txt-bold">Informasjon:</p><p>${currentUser.description}</p></span>
          </div>
        </div>
        <div class="btn-container">
          <button class="btn btn-warning" id="edit-profile-btn">REDIGER PROFIL</button>
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
  if (currentModal) {
    currentModal.remove();
    currentModal = null;
  }

  document.body.style.overflow = "";
}

document.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  switch (target.id) {
    case "edit-profile-btn": {
      if (!currentUser) return;
      const dynamicContent = `
      <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="/images/useravatar.png" alt="Bilde av person" draggable="false"/>
              <label class="btn btn-success">
                    LAST OPP BILDE
                    <input type="file" hidden />
                  </label>
              <button class="btn btn-warning" id="edit-password-btn">ENDRE PASSORD</button>
              <button class="btn btn-danger" id="delete-profile-btn">SLETT PROFIL</button>
            </div>
            <form class="user-input-form" id="edit-user-form">
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
          <div class="btn-container">
            <button class="btn btn-success TEST" id="confirm-edit-btn">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
      createModal(dynamicContent);
      break;
    }
    case "edit-password-btn": {
      const dynamicContent = `
      <h2>Hva ønsker du å redigere?</h2>
        <div class="add-edit-modal-card">
          <form class="user-input-form">
            <label for="old-password-input">Tidligere passord:</label>
              <input type="text" name="old-password-input" value="" id="old-password-input">
            <label for="new-password-input">Nytt passord:</label>
              <input type="text" name="new-password-input" value="" id="new-password-input">
            <label for="repeat-new-password-input">Gjenta nytt passord:</label>
              <input type="text" name="new-password-input" value="" id="repeat-new-password-input">
          </form>
        </div>
         <div class="btn-container">
            <button class="btn btn-success" id="confirm-edit-password-btn">ENDRE PASSORD</button>
            <button class="btn btn-danger" id="edit-profile-btn">AVBRYT</button>
          </div>
      `;
      createModal(dynamicContent);
      break;
    }
    case "confirm-edit-password-btn": {
      if (!currentUser) return;
      const newPassword = changePassword();
      editUser(currentUser.id, newPassword);

      break;
    }
    case "delete-profile-btn": {
      const dynamicContent = `
          <h2>Er du sikker på at du ønsker å slette profilen din?</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-delete-btn">JA, SLETT PROFIL</button>
            <button class="btn btn-danger" id="close-btn">NEI, GÅ TILBAKE</button>
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
              <label class="btn btn-success">
                    LAST OPP BILDE
                    <input type="file" hidden />
                  </label>
            </div>
           <form class="user-input-form" id="add-dog-form">
              <label for="dog-name-input">Navn:</label>
              <input type="text" name="dog-name" value="" id="dog-name-input" required>
              <label for="dog-breed-input">Rase:</label>
              <input type="text" name="dog-breed" value="" id="dog-breed-input" required>
              <label for="dog-age-input">Alder:</label>
              <input type="text" name="dog-age" value="" id="dog-age-input" required>
              <label for="dog-allergies-input">Allergier:</label>
              <input type="text" name="dog-allergies" value="" id="dog-allergies-input">
            </form>
          </div>
          <p id="error-txt"></p>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-add-dog-btn" type="submit" form="add-dog-form">LEGG TIL HUND</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
      createModal(dynamicContent);
      break;
    }
    case "remove-dog-btn": {
      const dynamicContent = `
          <h2>Hvilken hund ønsker du å fjerne?</h2>
          <div id="profile-checkbox-container" class="profile-checkbox-container"> 
            <form id="remove-dog-checkboxes">
            </form>
          </div>
          <div class="remove-dog-container">
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="warning-remove-dog-btn">FJERN VALGT HUND</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
      createModal(dynamicContent);

      const removeDogContainer = document.querySelector(
        ".remove-dog-container",
      ) as HTMLDivElement;

      const checkboxes = document.getElementById(
        "remove-dog-checkboxes",
      ) as HTMLDivElement;

      let updatedDogList = await getAllDogs();
  
      updatedDogList = updatedDogList.filter(
        (dog) => dog.petOwnerId === currentUser?.id,
      );

      for (const dog of updatedDogList) {
        const removeDogCard = document.createElement("div") as HTMLDivElement;
        removeDogCard.classList.add("remove-dog-card");
        removeDogCard.dataset.id = String(dog.id);
        const removeDogImg = document.createElement("img") as HTMLImageElement;
        removeDogImg.src = dog.image || "/images/dogicon.png";
        removeDogImg.draggable = false;
        const removeDogName = document.createElement(
          "h2",
        ) as HTMLHeadingElement;
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
      break;
    }
    case "confirm-edit-btn": {
      if (!currentUser) return;
      const editedUser = getUserEdits();
      await editUser(currentUser.id, editedUser);
      
       const updatedUser = await getAllUsers();
       const userId = localStorage.getItem("userId");

       currentUser = updatedUser.find((user) => user.id === Number(userId))

       if (!currentUser) return;
       showUser(currentUser);

      const dynamicContent = `
      <h2>Lagrer endringer...</h2>
          <img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" draggable="false"/>
      `;
      createModal(dynamicContent);

      setTimeout(() => {
        
        const dynamicContent = `
      <h2>Endringene ble lagret!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-and-update-btn">FORTSETT</button>
          </div>
      `;
        createModal(dynamicContent);
      }, 2000);
      break;
    }
    case "confirm-edit-dog-btn": {
      const dogId = Number((target as HTMLElement).dataset.id);
      const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

      if (!dog) return;

      const editedDog = getDogEdits();
      await editDog(dog.id, editedDog);

      const updatedDog = await getAllDogs();
      


      const dynamicContent = `
      <h2>Lagrer endringer...</h2>
          <img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" draggable="false"/>
      `;
      createModal(dynamicContent);

      setTimeout(() => {
        if (!currentUser) return;
        createDogCard(updatedDog, currentUser);
        const dynamicContent = `
      <h2>Endringene ble lagret!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-and-update-btn">FORTSETT</button>
          </div>
      `;
        createModal(dynamicContent);
      }, 2000);

      break;
    }
    case "confirm-add-dog-btn": {
      if (!currentUser) return;
      const newDog = getNewDog();
      const dynamicContent = `
      <h2>Legger til ${newDog.name}...</h2>
          <div class="dog-spinner"></div>
      `;
      createModal(dynamicContent);
      
      await addDog(newDog);
      const userDog = await getAllDogs();

      setTimeout(() => {
        if (!currentUser) return;
        createDogCard(userDog, currentUser);
        const dynamicContent = `
      <h2>${newDog.name} ble lagt til i "mine hunder"!</h2>
          <img src="/images/success.png" alt="success" draggable="false"/>
          <div class="btn-container">
            <button class="btn btn-success" id="close-and-update-btn">FORTSETT</button>
          </div>
      `;
        createModal(dynamicContent);
      }, 2000);
      break;
    }
    case "confirm-delete-btn": {
      if (!currentUser) return;
      await deleteUser(currentUser.id);
      setTimeout(() => {
        window.location.replace("./index.html");
      }, 2000);
      const dynamicContent = `
      <h2>Profilen din ble slettet!</h2>
      `;
      createModal(dynamicContent);
      break;
    }
    case "warning-remove-dog-btn": {
      const selectedDog = document.querySelector(".pressed") as HTMLDivElement;
      const dogId = Number(selectedDog.dataset.id);
      const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

      if (!dog) return;

      const dynamicContent = `
    <h2>Er du sikker på at du ønsker å fjerne ${dog.name}?</h2>
          <div class="remove-dog-container" data-id="${dogId}">
            <img src="${dog.image || "/images/dogicon.png"}" alt="Bilde av hund" draggable="false"/>
          </div>
          <div class="btn-container">
          <button class="btn btn-success" id="confirm-remove-dog-btn">JA, FJERN HUND</button>
            <button class="btn btn-danger" id="remove-dog-btn">AVBRYT</button>
          </div>
    `;
      createModal(dynamicContent);
      break;
    }
    case "confirm-remove-dog-btn": {
      if (!currentUser) return;
      const selectedDog = document.querySelector(
        ".remove-dog-container",
      ) as HTMLDivElement;

      const dogId = Number(selectedDog.dataset.id);
      const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

      if (!dog) return;

      const dynamicContent = `
    <h2>Forsøker å fjerne ${dog.name} fra "mine hunder"..</h2>
          <div class="dog-spinner"></div>
    `;
      createModal(dynamicContent);

      await deleteDog(dogId);
      await getBookings(currentUser);
      const updatedDogs = await getAllDogs();

      setTimeout(() => {
        if (!currentUser) return;
        createDogCard(updatedDogs, currentUser);
        const dynamicContent = `
    <h2>${dog.name} er fjernet fra "mine hunder"</h2>
          <div class="remove-dog-container">
            <img src="${dog.image || "/images/dogicon.png"}" alt="Bilde av hund" draggable="false"/>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="close-and-update-btn">GÅ TILBAKE</button>
          </div>
    `;
        createModal(dynamicContent);
        
      }, 2000);
      break;
    }
    case "edit-dog-btn": {
      const targetBtn = (target as HTMLElement).closest(
        "#edit-dog-btn",
      ) as HTMLButtonElement;

      userDog = await getAllDogs();

      const dogId = Number(targetBtn.dataset.id);
      const dog: Dog | undefined = userDog.find((dog) => dog.id === dogId);

      if (!dog) return;

      const dynamicContent = `
          <h2>Hva ønsker du å redigere?</h2>
          <div class="add-edit-modal-card">
            <div class="add-edit-img-container">
              <img src="${dog.image || "/images/dogicon.png"}" alt="Bilde av hund" draggable="false"/>
              <label class="btn btn-success">
                    LAST OPP BILDE
                    <input type="file" hidden />
                  </label>
            </div>
            <div class="user-input-form">
              <label for="dog-name-input">Navn:</label>
              <input type="text" name="dog-name"value="${dog.name}" id="dog-name-input">
              <label for="dog-breed-input">Rase:</label>
              <input type="text" name="dog-breed"value="${dog.breed}" id="dog-breed-input">
              <label for="dog-age-input">Alder:</label>
              <input type="text" name="dog-age" value="${dog.age}" id="dog-age-input">
              <label for="dog-allergies-input">Allergi:</label>
              <input type="text" name="dog-allergy" value="${dog.allergies.length ? dog.allergies.join(", ") : ""}" id="dog-allergies-input">
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-edit-dog-btn" data-id="${String(dog.id)}">BEKREFT ENDRINGER</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT ENDRINGER</button>
          </div>
  `;
      createModal(dynamicContent);
      break;
    }
    case "bookings-btn": {
      if (!currentUser) return;

      const dynamicContent = `
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
      createModal(dynamicContent);

      const { currentUserBookings, allSitters, allDogs } =
        await getBookings(currentUser);

      const bookingContainer = document.getElementById(
        "booking-container",
      ) as HTMLDivElement;
      const booking = document.getElementById("booking") as HTMLDivElement;
      const bookingTitle = document.getElementById(
        "booking-title",
      ) as HTMLHeadingElement;

      const validBookings = currentUserBookings.filter((booking) => {
        const sitter = allSitters.find(
          (sitter) => sitter.id === booking.petSitterId,
        );
        const dog = allDogs.find((dog) => dog.id === booking.userDogId);

        return sitter && dog;
      });

      if (validBookings.length === 0) {
        bookingContainer.innerHTML = `<h2>Du har ingen aktive bookinger.</h2>`;
        booking.innerHTML = "";
        bookingTitle.innerText = "";
        return;
      }

      for (const booking of validBookings) {
        const sitter = allSitters.find(
          (sitter) => sitter.id === booking.petSitterId,
        );

        const dog = allDogs.find(
          (dog) => Number(dog.id) === Number(booking.userDogId),
        );
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
          <div id="${booking.status}-dot" class="${booking.status} booking-status-dot"></div>
          <p id="${booking.status}"></p>
        </div>
      </div>
      `;

        const statusText = document.getElementById(
          booking.status,
        ) as HTMLParagraphElement;
        const bookingStatusDot = document.getElementById(
          `${booking.status}-dot`,
        ) as HTMLParagraphElement;
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
      break;
    }
    case "close-btn": {
      closeModal();
      break;
    }
    case "close-and-update-btn": {
      if (!currentUser) return;
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

function createDogCard(userDog: Dog[], currentUser: User) {
  const dogContainer = document.querySelector(
    ".dog-card-container",
  ) as HTMLElement;

  dogContainer.innerHTML = "";

  const userDogs = userDog.filter((dog) => dog.petOwnerId === currentUser.id);

  if (userDogs.length === 0) {
    dogContainer.innerHTML = `<h2>Du har ikke lagt til noen hunder enda..</h2>`;
    (
      document.getElementById("remove-dog-btn") as HTMLButtonElement
    ).style.display = "none";
  } else {
      (document.getElementById("remove-dog-btn") as HTMLButtonElement
    ).style.display = "block";
    for (const dog of userDogs) {
      const dogCard = document.createElement("div") as HTMLDivElement;
      dogCard.classList.add("dog-card");

      const dogCardInfo = document.createElement("div") as HTMLDivElement;
      dogCardInfo.classList.add("dog-card-info");

      const dogImg = document.createElement("img") as HTMLImageElement;

      const dogInfo = document.createElement("div") as HTMLDivElement;
      dogInfo.classList.add("dog-info");
      dogInfo.innerHTML = `
      <span><p class="info-txt-bold">Navn:</p><p>${dog.name}</p></span>
      <span><p class="info-txt-bold">Rase:</p><p>${dog.breed}</p></span>
      <span><p class="info-txt-bold">Alder:</p><p>${dog.age} år</p></span>
      <span><p class="info-txt-bold">Allergier:</p><p>${dog.allergies.length ? dog.allergies.join(", ") : "Ingen"}</p></span>
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

function getUserEdits(): Partial<User> {

  const username = (
    document.getElementById("username-input") as HTMLInputElement
  ).value;
  const email = (document.getElementById("email-input") as HTMLInputElement)
    .value;
  const phone = (document.getElementById("phone-input") as HTMLInputElement)
    .value;
  const location = (
    document.getElementById("location-input") as HTMLInputElement
  ).value;
  const description = (
    document.getElementById("info-input") as HTMLInputElement
  ).value;

 

  return {
    userName: username,
    email: email,
    phone: Number(phone),
    location: location,
    description: description,
  };

}

function getDogEdits(): Partial<Dog> {
  const dogName = (
    document.getElementById("dog-name-input") as HTMLInputElement
  ).value;
  const dogBreed = (
    document.getElementById("dog-breed-input") as HTMLInputElement
  ).value;
  const dogAge = (document.getElementById("dog-age-input") as HTMLInputElement)
    .value;
  const dogAllergies = (
    document.getElementById("dog-allergies-input") as HTMLInputElement
  ).value;

  if (dogAllergies === "") {
    return {
      name: dogName,
      breed: dogBreed,
      age: Number(dogAge),
      image: "",
      allergies: [],
    };
  } else {
    return {
      name: dogName,
      breed: dogBreed,
      age: Number(dogAge),
      image: "",
      allergies: [dogAllergies],
    };
  }
}

function getNewDog(): Partial<Dog> {
  const dogName = (
    document.getElementById("dog-name-input") as HTMLInputElement
  ).value;
  const dogBreed = (
    document.getElementById("dog-breed-input") as HTMLInputElement
  ).value;
  const dogAge = (document.getElementById("dog-age-input") as HTMLInputElement)
    .value;
  const dogAllergies = (
    document.getElementById("dog-allergies-input") as HTMLInputElement
  ).value;

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

function changePassword(): Partial<User> {
  const oldPasswordInput = (
    document.getElementById("old-password-input") as HTMLInputElement
  ).value;
  const newPasswordInput = (
    document.getElementById("new-password-input") as HTMLInputElement
  ).value;
  const repeatNewPasswordInput = (
    document.getElementById("repeat-new-password-input") as HTMLInputElement
  ).value;

  const oldPassword = currentUser?.password;

  if (oldPassword != oldPasswordInput) {
    alert("Feil tidligere passord!");
    return {};
  } else if (newPasswordInput != repeatNewPasswordInput) {
    alert("De nye passordene er ikke like!");
    return {};
  } else {
    return {
      password: newPasswordInput,
    };
  }
}

async function getBookings(currentUser: User) {
  const allBookings = await getAllProfileBookings();
  const allSitters = await getAllProfileSitters();
  const allDogs = await getAllDogs();
  const currentUserBookings = allBookings.filter(
    (bookings) => bookings.userId === currentUser.id,
  );

  return {
    currentUserBookings,
    allSitters,
    allDogs,
  };
}