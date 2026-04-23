import { type User } from "../../types/user.type";
import { getAllUsers } from "../../requests/users-api";

async function getUsers() {
  const users: User[] = await getAllUsers();

  //Sender videre variabelen users.
  showUserName(users);
}

getUsers();

//Variabelen users hentes fra funksjonen getUsers slik at den kan brukes i funksjonen under.
function showUserName(users: User[]) {
  const dogSitterName = document.querySelector(
    ".dog-sitter-name",
  ) as HTMLHeadingElement;
  dogSitterName.innerHTML = users[0].userName;
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

document.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;
  const button = target.closest(".btn") as HTMLButtonElement | null;

  if (!button) return;

  event.preventDefault();

  const buttonId = button.id;
  console.log("Clicked button with id:", buttonId);

  let myContent = "";

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
      break;

    case "changes-available":
      myContent = `<div class="modal-changes-available">
        <img src="/images/sucessful.png" alt="" />
        <h2>Booking er ikke bekreftet enda. Du kan gjøre endringer.</h2>
      </div>
      <button class="btn btn-warning">ENDRE BOOKING</button>
      `;
      break;
    case "checking-booking-confirmed":
      myContent = `<h2>Sjekker at booking ikke allerede er bekreftet.</h2>
      <div class="spinner" aria-hidden="true"></div>`;
      break;
    case "changes-not-available":
      myContent = `   <div class="modal-changes-available">
        <img src="/images/unsucessful.png" alt="" />
        <h2>
          Booking er allerede bekreftet. Du kan ikke gjøre endringer. Ta
          kontakt med hundepasser under "Mine bookinger" for å avtale
          endringer.
        </h2>
      </div>
      <button class="btn btn-success">GÅ TIL MINE BOOKINGER</button>`;
      break;

    case "booking-modal-changed":
      myContent = `      <h5>BOOKINGFORESPØRSEL SENDT!</h5>
      <div>
        <img src="/images/sucess-checkmark.png" alt="" />
        <p>
          DIN FORESPØRSEL ER SENDT TIL HUNDEPASSEREN. DU FINNER DETALJENE OG
          STATUS PÅ BOOKINGEN UNDER <span>MINE BOOKINGER</span>.
        </p>
      </div>
      <div class="btn-container">
        <button class="btn btn-warning">ENDRE BOOKING</button>
        <button class="btn btn-danger">SLETT BOOKING</button>
        <button class="btn btn-success">FULLFØR</button>
      </div>
`;
      break;

    case "booking-modal-updated":
      myContent = ` <h5>BOOKINGFORESPØRSEL OPPDATERT!</h5>
      <div>
        <img src="/images/sucess-checkmark.png" alt="" />
        <p>
          DIN FORESPØRSEL ER SENDT TIL HUNDEPASSEREN. DU FINNER DETALJENE OG
          STATUS PÅ BOOKINGEN UNDER <span>MINE BOOKINGER</span>.
        </p>
      </div>
      <button class="btn btn-success">SE MINE BOOKINGER</button>
`;
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
