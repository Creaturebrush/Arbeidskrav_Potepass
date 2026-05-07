// Anette Bratvold

import { type User } from "../../types/user.type";
import { getAllUsers } from "../../requests/getAllUsers";
import { type Dog } from "../../types/dog.type";
import { getAllDogs } from "../../requests/getDogs";
import type { Petsitter } from "../../types/petsitter.type";
import { getAllPetsitters } from "../../requests/getPetsitters";
import { postBooking } from "../../requests/postBooking";
import { deleteBooking } from "../../requests/deleteBooking";
import { patchBooking } from "../../requests/patchBooking";
import { getBookingId } from "../../requests/getBookingId";

//userType
async function getUsers() {
  const users: User[] = await getAllUsers();
}

getUsers();

async function getPetsitters() {
  const petsitters: Petsitter[] = await getAllPetsitters();

  //localstorage
  const selectedPetsitter = getStoredPetsitter(petsitters);

  if (!selectedPetsitter) {
    return;
  }

  //Sender videre variabelen petsitters
  showPetSitterName(selectedPetsitter);
  getPetSitterDescription(selectedPetsitter);
}

getPetsitters();

//localStorage user and petsitter som kan brukes for å koble sider senere.
localStorage.setItem("storedUserId", "1");
localStorage.setItem("storedPetsitterId", "3");

function getStoredPetsitter(petsitters: Petsitter[]): Petsitter | undefined {
  const storedPetsitterId = localStorage.getItem("storedPetsitterId");

  if (!storedPetsitterId) {
    console.error("No petsitter ID found in localStorage");
    return undefined;
  }

  const petsitter = petsitters.find(
    (petsitter) => petsitter.id === Number(storedPetsitterId),
  );

  if (!petsitter) {
    console.error("No petsitter found with ID:", storedPetsitterId);
    return undefined;
  }

  return petsitter;
}

function getStoredPetsitterId(): number | undefined {
  const storedPetsitterId = localStorage.getItem("storedPetsitterId");

  if (!storedPetsitterId) {
    console.error("No petsitter ID found in localStorage");
    return undefined;
  }

  return Number(storedPetsitterId);
}

function getStoredUserId(): number | undefined {
  const storedUserId = localStorage.getItem("storedUserId");

  if (!storedUserId) {
    console.error("No user found with ID: ", storedUserId);
    return undefined;
  }

  return Number(storedUserId);
}

function getFromDate(): string {
  const fromDate = document.querySelector(
    "#from-date",
  ) as HTMLInputElement | null;

  if (!fromDate) {
    console.error("Could not find from-date input");
    return "";
  }

  return fromDate.value;
}

function getToDate(): string {
  const toDate = document.querySelector("#to-date") as HTMLInputElement | null;

  if (!toDate) {
    console.error("Could not find to-date input");
    return "";
  }

  return toDate.value;
}

function isFromDateBeforeToDate(fromDate: string, toDate: string): boolean {
  if (!fromDate || !toDate) {
    console.error("Both dates must be filled in");
    return false;
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (from > to) {
    console.error("From date must be before to date");
    return false;
  }

  return true;
}

function getFormMessage() {
  let messageInput = document.querySelector(
    "#message-input",
  ) as HTMLTextAreaElement;

  if (!messageInput) {
    console.error("Could not find the message textarea");
    return "";
  }

  if (messageInput.value === "") {
    return "No message written.";
  }
  return messageInput.value;
}

//Variabelen petsitter hentes fra funksjonen getPetsitters slik at den kan brukes i funksjonen under.
function showPetSitterName(petsitter: Petsitter) {
  const dogSitterName = document.querySelector(
    ".dog-sitter-name",
  ) as HTMLHeadingElement;
  dogSitterName.innerHTML = petsitter.name;
}

function getPetSitterDescription(petsitters: Petsitter) {
  const userDescription = document.querySelector(
    ".user-description-txt",
  ) as HTMLParagraphElement;
  userDescription.innerHTML = petsitters.experienceDescription;
}

//dog type
async function getDogs() {
  const dogs: Dog[] = await getAllDogs();

  const usersDogs = getStoredUsersDogs(dogs);

  if (!usersDogs) {
    return;
  }

  showUsersDogs(usersDogs);

  showDogsAllergies(usersDogs);
  addDogCheckboxListeners(usersDogs);
}

getDogs();

function getStoredUsersDogs(dogs: Dog[]): Dog[] | undefined {
  const storedUserId = localStorage.getItem("storedUserId");

  if (!storedUserId) {
    console.error("No user ID found in localStorage");
    return undefined;
  }

  const usersDogs = dogs.filter(
    (dog) => dog.petOwnerId === Number(storedUserId),
  );

  if (usersDogs.length === 0) {
    console.error("No dogs found for user ID:", storedUserId);
    return undefined;
  }

  return usersDogs;
}

function showUsersDogs(usersDogs: Dog[]) {
  const dogsContainer = document.querySelector(
    ".dogs-container",
  ) as HTMLDivElement;

  const usersDogNames = usersDogs
    .map(
      (dog) => `
      <div class="dog-container form-group">
        <input 
          type="checkbox" 
          name="dogs" 
          id="dog-checkbox-${dog.id}" 
          value="${dog.id}"
        />
        <label class="fw-bold" for="dog-checkbox-${dog.id}">
          ${dog.name}
        </label>
      </div>
    `,
    )
    .join("");

  dogsContainer.innerHTML = usersDogNames;
}

//getCheckedDogID
function getSelectedDogIds(): number[] {
  const checkedDogInputs = document.querySelectorAll<HTMLInputElement>(
    'input[name="dogs"]:checked',
  );

  return Array.from(checkedDogInputs).map((input) => Number(input.value));
}

function showDogsAllergies(usersDogs: Dog[]) {
  const allergyInfoContainer = document.querySelector(
    ".allergy-info-container",
  ) as HTMLDivElement;

  const infoContainer = document.querySelector(
    ".info-container",
  ) as HTMLDivElement;

  const dogAllergyInfo = document.querySelector(
    ".dog-allergy-info",
  ) as HTMLDivElement;

  const selectedDogIds = getSelectedDogIds();

  if (selectedDogIds.length === 0) {
    allergyInfoContainer.classList.add("hidden");
    infoContainer.classList.add("hidden");
    dogAllergyInfo.innerHTML = "";
    return;
  }

  const selectedDogs = usersDogs.filter((dog) =>
    selectedDogIds.includes(dog.id),
  );

  const dogAllergyContainer = selectedDogs
    .map((dog) => {
      const allergies =
        dog.allergies.length > 0 ? dog.allergies.join(", ") : "Ingen allergier";

      return `
        <p class="fw-semibold block-txt">
          ${dog.name} - <span>Allergier: ${allergies}</span>
        </p>
      `;
    })
    .join("");

  dogAllergyInfo.innerHTML = dogAllergyContainer;

  allergyInfoContainer.classList.remove("hidden");
  infoContainer.classList.remove("hidden");
}

function addDogCheckboxListeners(usersDogs: Dog[]) {
  const dogCheckboxes =
    document.querySelectorAll<HTMLInputElement>('input[name="dogs"]');

  dogCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      showDogsAllergies(usersDogs);
    });
  });
}

//delete booking

async function deleteBookingId(bookingId: Number) {
  await deleteBooking(bookingId);
}

// patch booking
async function editBooking() {
  const createdBookingId = sessionStorage.getItem("createdBookingId");

  if (!createdBookingId) {
    console.error("No booking ID found in sessionStorage");
    return;
  }

  const fromDate = getFromDate();
  const toDate = getToDate();

  if (!isFromDateBeforeToDate(fromDate, toDate)) {
    return;
  }

  const selectedDogIds = getSelectedDogIds();

  if (selectedDogIds.length === 0) {
    console.error("No dogs selected");
    return;
  }

  const updatedBooking = await patchBooking(Number(createdBookingId), {
    message: getFormMessage(),
    fromDate,
    toDate,
    userDogId: selectedDogIds,
  });

  console.log("Updated booking:", updatedBooking);
}

function renderEditBookingPage() {
  const formTitle = document.querySelector(".form-title") as HTMLHeadingElement;
  const btnContainer = document.querySelector(
    ".btn-container",
  ) as HTMLDivElement;

  btnContainer.innerHTML = `<button id= "booking-updated" class= "btn btn-success">LAGRE ENDRINGER</button>`;
  formTitle.innerHTML = "REDIGER BOOKING";
}

//modal funksjoner
const overlay = document.getElementById("modal1") as HTMLDivElement;
const closeBtn = overlay.querySelector(".modal-close") as HTMLButtonElement;
const modalBody = overlay.querySelector(".modal-body") as HTMLDivElement;

function openModal() {
  overlay.classList.add("is-open");
}

function closeModal() {
  overlay.classList.remove("is-open");
}

closeBtn.addEventListener("click", closeModal);

document.addEventListener("click", async function (event) {
  const target = event.target as HTMLElement;
  const button = target.closest(".btn") as HTMLButtonElement | null;

  if (!button) return;

  event.preventDefault();

  const buttonId = button.id;
  console.log("Clicked button with id:", buttonId);

  let myContent = "";
  const bookingSentContainer = document.querySelector(
    ".booking-sent-container",
  ) as HTMLDivElement;

  switch (buttonId) {
    case "send-booking-btn":
      myContent = `
        <h2>Er du sikker på at du ønsker å sende forespørselen?</h2>
        <div class="btn-container">
          <button type="button" class="btn btn-success" id="confirm-send">JA, SEND FORESPØRSEL</button>
          <button type="button" class="btn btn-danger" id="close-modal">NEI, IKKE SEND FORESPØRSELEN</button>
        </div>
      `;
      modalBody.innerHTML = myContent;
      openModal();
      break;

    //Dont call it hello
    case "hello":
      myContent = `
        <h2>OBS! Alle feltene må være fylt ut!</h2>
        <img src="/images/unsucessful.png" alt="" />
        <button type="button" class="btn btn-success" id="close-modal">FORTSETT</button>
      `;
      modalBody.innerHTML = myContent;
      openModal();
      break;

    case "cancel-booking":
      bookingSentContainer.classList.add("hidden");
      myContent = `
        <h2>Er du sikker på at du vil kansellere bookingen?</h2>
        <img src="/images/unsucessful.png" alt="" />
        <div class="btn-container">
          <button type="button" class="btn btn-success" id="booking-cancelled">JA, SLETT BOOKINGEN</button>
          <button type="button" class="btn btn-danger" id="close-modal">NEI, IKKE SLETT BOOKINGEN</button>
        </div>
      `;
      modalBody.innerHTML = myContent;
      openModal();
      break;

    case "booking-cancelled":
      myContent = `
        <h2>Bookingen har blitt kansellert.</h2>
        <img src="/images/sucessful.png" alt="" />
        <button type="button" class="btn btn-success" id="close-modal">GÅ TILBAKE</button>
      `;
      modalBody.innerHTML = myContent;
      openModal();
      closeModal();

      //Delete booking that was just created.
      const createdBookingId = sessionStorage.getItem("createdBookingId");

      if (!createdBookingId) {
        console.error("No created booking ID found in sessionStorage");
        return;
      }

      await deleteBookingId(Number(createdBookingId));

      sessionStorage.removeItem("createdBookingId");

      break;

    case "checking-booking-confirmed": {
      bookingSentContainer.classList.add("hidden");

      myContent = `
    <h2>Sjekker at booking ikke allerede er bekreftet.</h2>
    <div class="spinner" aria-hidden="true">
      <img
        src="/images/paw-spinner.png"
        alt="Laster..."
        class="spinner-img"
      />
    </div>
  `;

      modalBody.innerHTML = myContent;
      openModal();

      const createdBookingId = sessionStorage.getItem("createdBookingId");

      if (!createdBookingId) {
        console.error("No booking ID found in sessionStorage");
        return;
      }

      const booking = await getBookingId(Number(createdBookingId));

      setTimeout(() => {
        if (booking.status === "pending") {
          modalBody.innerHTML = `
        <div class="modal-changes-available">
          <img src="/images/sucessful.png" alt="" />
          <h2>Booking er ikke bekreftet enda. Du kan gjøre endringer.</h2>
        </div>
        <button id="make-changes-btn" class="btn btn-warning">ENDRE BOOKING</button>
      `;
        } else {
          modalBody.innerHTML = `
        <div class="modal-changes-available">
          <img src="/images/unsucessful.png" alt="" />
          <h2>
            Booking er allerede bekreftet. Du kan ikke gjøre endringer. Ta
            kontakt med hundepasser under "Mine bookinger" for å avtale
            endringer.
          </h2>
        </div>
        <button id="redirect-to-my-bookings"class="btn btn-success">GÅ TIL MINE BOOKINGER</button>
      `;
        }
      }, 2000);

      break;
    }
    case "make-changes-btn":
      closeModal();
      renderEditBookingPage();
      break;

    case "redirect-to-my-bookings":
      window.location.href = "../status/status.html";
      break;

    case "confirm-send":
      myContent = `<div><h5>BOOKINGFORESPØRSEL SENDT!</h5>
      <div>
        <img src="/images/sucess-checkmark.png" alt="" />
        <p>
          DIN FORESPØRSEL ER SENDT TIL HUNDEPASSEREN. DU FINNER DETALJENE OG
          STATUS PÅ BOOKINGEN UNDER <span>MINE BOOKINGER</span>.
        </p>
      </div>
      <div class="btn-container">
        <button class="btn btn-warning" id="checking-booking-confirmed">ENDRE BOOKING</button>
        <button class="btn btn-danger" id="cancel-booking">SLETT BOOKING</button>
        <button id="complete-booking-btn"class="btn btn-success">FULLFØR</button>
      </div>
      </div>
`;
      closeModal();

      bookingSentContainer.classList.remove("hidden");
      bookingSentContainer.innerHTML = myContent;

      const storedPetsitterId = getStoredPetsitterId();

      if (!storedPetsitterId) {
        return;
      }

      const storedUserId = getStoredUserId();

      if (!storedUserId) {
        return;
      }

      const fromDate = getFromDate();
      const toDate = getToDate();

      if (!isFromDateBeforeToDate(fromDate, toDate)) {
        return;
      }

      const selectedDogIds = getSelectedDogIds();

      console.log("Selected dog IDs:", selectedDogIds);

      if (selectedDogIds.length === 0) {
        console.error("No dogs selected");
        return;
      }

      const createdBooking = await postBooking({
        userId: storedUserId,
        userDogId: selectedDogIds,
        petSitterId: storedPetsitterId,
        fromDate: fromDate,
        toDate: toDate,
        status: "accepted",
        message: getFormMessage(),
        created: "",
        updated: "",
      });

      sessionStorage.setItem("createdBookingId", String(createdBooking.id));

      break;

    case "booking-updated":
      await editBooking();
      closeModal();

      myContent = ` <h5>BOOKINGFORESPØRSEL OPPDATERT!</h5>
      <div>
        <img src="/images/sucess-checkmark.png" alt="" />
        <p>
          DIN FORESPØRSEL ER SENDT TIL HUNDEPASSEREN. DU FINNER DETALJENE OG
          STATUS PÅ BOOKINGEN UNDER <span>MINE BOOKINGER</span>.
        </p>
      </div>
      <button id="redirect-my-bookings" class="btn btn-success">SE MINE BOOKINGER</button>
`;
      bookingSentContainer.classList.remove("hidden");
      bookingSentContainer.innerHTML = myContent;
      break;

    case "complete-booking-btn":
      window.location.href = "../sitters/sitters.html";
      break;

    case "redirect-my-bookings":
      window.location.href = "../status/status.html";
      break;

    case "close-modal":
      closeModal();
      break;

    default:
      console.log("No matching case for:", buttonId);
  }
});

// Prevents submit of booking form to reload page and not give button id
//Might have to not use the switch case modals for it and use this seperate function for it.
const form = document.querySelector("form");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  // your booking logic here
});

