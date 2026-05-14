// Anette Bratvold

import { type Dog } from "../../types/dog.type";
import { getAllDogs } from "../../requests/getDogs";
import type { Petsitter } from "../../types/petsitter.type";
import { getAllPetsitters } from "../../requests/getPetsitters";
import { postBooking } from "../../requests/postBooking";
import { deleteBooking } from "../../requests/deleteBooking";
import { patchBooking } from "../../requests/patchBooking";
import { getBookingId } from "../../requests/getBookingId";

localStorage.getItem("storedUserId");

localStorage.getItem("storedPetsitterId");

const overlay = document.getElementById("modal1") as HTMLDivElement;
const modalBody = overlay.querySelector(".modal-body") as HTMLDivElement;

function initBookingPage() {
  getPetsitters();
  getDogs();
  setupEventListeners();
}

function setupEventListeners() {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeyDown);
  overlay.addEventListener("click", handleOverlayClick);
  const form = document.querySelector("form");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function handleKeyDown(event: KeyboardEvent) {
  if (!overlay.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = overlay.querySelectorAll<HTMLElement>(
    'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
  );

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function handleOverlayClick(event: MouseEvent) {
  if (event.target === overlay) {
    closeModal();
  }
}

async function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const button = target.closest(".btn") as HTMLButtonElement | null;

  if (!button) {
    return;
  }

  event.preventDefault();

  switch (button.id) {
    case "send-booking-btn":
      handleSendBookingClick();
      break;

    case "cancel-booking":
      handleCancelBookingClick();
      break;

    case "booking-cancelled":
      await handleBookingCancelledClick();
      break;

    case "checking-booking-confirmed":
      await handleCheckingBookingConfirmedClick();
      break;

    case "make-changes-btn":
      closeModal();
      renderEditBookingPage();
      break;

    case "confirm-send":
      await handleConfirmSendClick();
      break;

    case "booking-updated":
      await handleBookingUpdatedClick();
      break;

    case "complete-booking-btn":
      redirectTo("../sitters/sitters.html");
      break;

    case "redirect-to-my-bookings":
    case "redirect-my-bookings":
      redirectTo("../status/status.html");
      break;

    case "close-modal":
      closeModal();
      break;
  }
}

async function getPetsitters() {
  try {
    const petsitters: Petsitter[] = await getAllPetsitters();

    const selectedPetsitter = getStoredPetsitter(petsitters);

    if (!selectedPetsitter) {
      showPetsitterError();
      return;
    }

    showPetSitterName(selectedPetsitter);
    getPetSitterDescription(selectedPetsitter);
    showPetsitterRating(selectedPetsitter.rating);
    showPetSitterImage(selectedPetsitter);

    removeSkeleton(".dog-sitter-name");
    removeSkeleton(".user-description-txt");
    removeSkeleton("#chosen-dogsitter-txt");
    removeRatingSkeleton();
  } catch (error) {
    console.error("Could not load petsitter:", error);
    showPetsitterError();
  }
}

async function getDogs() {
  try {
    const dogs: Dog[] = await getAllDogs();

    const usersDogs = getStoredUsersDogs(dogs);

    if (!usersDogs) {
      showDogsMessage("Ingen hunder funnet.");
      return;
    }

    showUsersDogs(usersDogs);
    showDogsAllergies(usersDogs);
    addDogCheckboxListeners(usersDogs);
  } catch (error) {
    console.error("Could not load dogs:", error);
    showDogsMessage("Kunne ikke laste hunder.");
  }
}

function showPetSitterName(petsitter: Petsitter) {
  const dogSitterName = document.querySelector(
    ".dog-sitter-name",
  ) as HTMLHeadingElement;

  const chosenDogsitterTxt = document.querySelector(
    "#chosen-dogsitter-txt",
  ) as HTMLParagraphElement;

  dogSitterName.textContent = petsitter.name;
  chosenDogsitterTxt.textContent = `Du har valgt ${petsitter.name} som hundepasser`;
}

function getPetSitterDescription(petsitter: Petsitter) {
  const userDescription = document.querySelector(
    ".user-description-txt",
  ) as HTMLParagraphElement | null;

  if (!userDescription) {
    return;
  }

  userDescription.textContent = petsitter.experienceDescription;
}

function showPetSitterImage(petsitter: Petsitter) {
  const profileImg = document.querySelector(
    ".profile-img",
  ) as HTMLImageElement | null;

  if (!profileImg) {
    return;
  }

  profileImg.src = petsitter.image;
  profileImg.alt = `Profilbilde av ${petsitter.name}`;
}

function showPetsitterRating(rating: number) {
  const ratingContainer = document.querySelector(
    ".star-rating",
  ) as HTMLDivElement | null;

  if (!ratingContainer) {
    return;
  }

  const maxRating = 5;
  const safeRating = Math.max(0, Math.min(rating, maxRating));
  const ratingWidth = (safeRating / maxRating) * 100;

  ratingContainer.style.setProperty("--rating-width", `${ratingWidth}%`);
  ratingContainer.setAttribute(
    "aria-label",
    `Vurdering ${safeRating.toFixed(1)} av 5 stjerner`,
  );
}

function showPetsitterError() {
  const dogSitterName = document.querySelector(
    ".dog-sitter-name",
  ) as HTMLHeadingElement | null;

  const userDescription = document.querySelector(
    ".user-description-txt",
  ) as HTMLParagraphElement | null;

  if (dogSitterName) {
    dogSitterName.classList.remove("skeleton", "skeleton-title");
    dogSitterName.textContent = "Kunne ikke laste hundepasser";
  }

  if (userDescription) {
    userDescription.classList.remove("skeleton", "skeleton-paragraph");
    userDescription.textContent = "Prøv å laste siden på nytt.";
  }
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

function showDogsMessage(message: string) {
  const dogsContainer = document.querySelector(
    ".dogs-container",
  ) as HTMLDivElement | null;

  if (!dogsContainer) {
    return;
  }

  dogsContainer.textContent = message;
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

function removeSkeleton(selector: string) {
  const element = document.querySelector(selector);

  if (!element) {
    return;
  }

  element.classList.remove(
    "skeleton",
    "skeleton-title",
    "skeleton-paragraph",
    "skeleton-text-line",
  );
}

function removeRatingSkeleton() {
  const ratingContainer = document.querySelector(".star-rating");

  if (!ratingContainer) {
    return;
  }

  ratingContainer.classList.remove("skeleton-rating");
}

function getStoredPetsitter(petsitters: Petsitter[]): Petsitter | undefined {
  const storedPetsitterId = localStorage.getItem("storedPetsitterId");

  if (!storedPetsitterId) {
    return undefined;
  }

  const petsitter = petsitters.find(
    (petsitter) => petsitter.id === Number(storedPetsitterId),
  );

  if (!petsitter) {
    return undefined;
  }

  return petsitter;
}

function getStoredPetsitterId(): number | undefined {
  const storedPetsitterId = localStorage.getItem("storedPetsitterId");

  if (!storedPetsitterId) {
    return undefined;
  }

  return Number(storedPetsitterId);
}

function getStoredUserId(): number | undefined {
  const storedUserId = localStorage.getItem("storedUserId");

  if (!storedUserId) {
    return undefined;
  }

  return Number(storedUserId);
}

function getStoredUsersDogs(dogs: Dog[]): Dog[] | undefined {
  const storedUserId = localStorage.getItem("storedUserId");

  if (!storedUserId) {
    return undefined;
  }

  const usersDogs = dogs.filter(
    (dog) => dog.petOwnerId === Number(storedUserId),
  );

  if (usersDogs.length === 0) {
    return undefined;
  }

  return usersDogs;
}

function getFromDate(): string {
  const fromDate = document.querySelector(
    "#from-date",
  ) as HTMLInputElement | null;

  if (!fromDate) {
    return "";
  }

  return fromDate.value;
}

function getToDate(): string {
  const toDate = document.querySelector("#to-date") as HTMLInputElement | null;

  if (!toDate) {
    return "";
  }

  return toDate.value;
}

function getFormMessage(): string {
  const messageInput = document.querySelector(
    "#message-input",
  ) as HTMLTextAreaElement | null;

  if (!messageInput) {
    return "";
  }

  if (messageInput.value === "") {
    return "No message written.";
  }

  return messageInput.value;
}

function getSelectedDogIds(): number[] {
  const checkedDogInputs = document.querySelectorAll<HTMLInputElement>(
    'input[name="dogs"]:checked',
  );

  return Array.from(checkedDogInputs).map((input) => Number(input.value));
}

function isAtLeastOneDogChecked(): boolean {
  const checkedDogs = document.querySelectorAll<HTMLInputElement>(
    'input[name="dogs"]:checked',
  );

  return checkedDogs.length > 0;
}

function isFromDateBeforeToDate(fromDate: string, toDate: string): boolean {
  if (!fromDate || !toDate) {
    return false;
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  return from <= to;
}

function validateBookingForm(): boolean {
  const form = document.querySelector("form") as HTMLFormElement;
  const errorMsg = document.querySelector(".error-msg") as HTMLDivElement;
  const errorMsgTxt = document.querySelector(
    ".error-msg-txt",
  ) as HTMLParagraphElement;

  form.classList.add("was-submitted");

  const formIsValid = form.reportValidity();
  const dogIsSelected = isAtLeastOneDogChecked();

  if (formIsValid && dogIsSelected) {
    errorMsg.classList.add("hidden");
    return true;
  }

  errorMsg.classList.remove("hidden");

  errorMsgTxt.textContent = !dogIsSelected
    ? "Du må velge minst én hund."
    : "Alle påkrevde felt må fylles ut.";

  focusErrorMessage(errorMsg);
  return false;
}

async function editBooking() {
  const createdBookingId = sessionStorage.getItem("createdBookingId");

  if (!createdBookingId) {
    return;
  }

  const fromDate = getFromDate();
  const toDate = getToDate();

  if (!isFromDateBeforeToDate(fromDate, toDate)) {
    return;
  }

  const selectedDogIds = getSelectedDogIds();

  if (selectedDogIds.length === 0) {
    return;
  }

  await patchBooking(Number(createdBookingId), {
    message: getFormMessage(),
    fromDate,
    toDate,
    userDogId: selectedDogIds,
  });
}

function getBookingSentContainer(): HTMLDivElement {
  return document.querySelector(".booking-sent-container") as HTMLDivElement;
}

function focusAndScrollToElement(selector: string) {
  const element = document.querySelector(selector) as HTMLDivElement | null;

  if (!element) {
    return;
  }

  element.focus();
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function focusErrorMessage(errorMsg: HTMLDivElement) {
  errorMsg.tabIndex = -1;
  errorMsg.focus();

  errorMsg.classList.remove("blink-error");

  void errorMsg.offsetWidth;

  errorMsg.classList.add("blink-error");
}

function redirectTo(path: string) {
  window.location.href = path;
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

function renderEditBookingPage() {
  const formTitle = document.querySelector(".form-title") as HTMLHeadingElement;
  const btnContainer = document.querySelector(
    ".btn-container",
  ) as HTMLDivElement;

  btnContainer.innerHTML = `
    <button id="booking-updated" class="btn btn-success">
      LAGRE ENDRINGER
    </button>
  `;

  formTitle.textContent = "REDIGER BOOKING";
}

function handleSendBookingClick() {
  if (!validateBookingForm()) {
    return;
  }

  showModal(getConfirmSendModalContent());
}

function handleCancelBookingClick() {
  const bookingSentContainer = getBookingSentContainer();

  bookingSentContainer.classList.add("hidden");
  showModal(getCancelBookingModalContent());
}

async function handleBookingCancelledClick() {
  showModal(getBookingCancelledContent());

  const createdBookingId = sessionStorage.getItem("createdBookingId");

  if (!createdBookingId) {
    return;
  }

  await deleteBooking(Number(createdBookingId));
  sessionStorage.removeItem("createdBookingId");
}

async function handleCheckingBookingConfirmedClick() {
  const bookingSentContainer = getBookingSentContainer();

  bookingSentContainer.classList.add("hidden");
  showModal(getCheckingBookingContent());

  const createdBookingId = sessionStorage.getItem("createdBookingId");

  if (!createdBookingId) {
    return;
  }

  const booking = await getBookingId(Number(createdBookingId));

  setTimeout(() => {
    if (booking.status === "pending") {
      modalBody.innerHTML = getChangesAvailableContent();
    } else {
      modalBody.innerHTML = getChangesUnavailableContent();
    }
  }, 2000);
}

async function handleConfirmSendClick() {
  closeModal();

  const bookingSentContainer = getBookingSentContainer();

  bookingSentContainer.classList.remove("hidden");
  bookingSentContainer.innerHTML = getBookingSentContent();

  focusAndScrollToElement("#booking-sent");

  const storedPetsitterId = getStoredPetsitterId();
  const storedUserId = getStoredUserId();

  if (!storedPetsitterId || !storedUserId) {
    return;
  }

  const fromDate = getFromDate();
  const toDate = getToDate();

  if (!isFromDateBeforeToDate(fromDate, toDate)) {
    return;
  }

  const selectedDogIds = getSelectedDogIds();

  if (selectedDogIds.length === 0) {
    return;
  }

  const createdBooking = await postBooking({
    userId: storedUserId,
    userDogId: selectedDogIds,
    petSitterId: storedPetsitterId,
    fromDate,
    toDate,
    status: "pending",
    message: getFormMessage(),
    created: "",
    updated: "",
  });

  sessionStorage.setItem("createdBookingId", String(createdBooking.id));
}

async function handleBookingUpdatedClick() {
  if (!validateBookingForm()) {
    return;
  }

  await editBooking();
  closeModal();

  const bookingSentContainer = getBookingSentContainer();

  bookingSentContainer.classList.remove("hidden");
  bookingSentContainer.innerHTML = getBookingUpdatedContent();

  focusAndScrollToElement("#booking-updated");
}

function getConfirmSendModalContent(): string {
  return `
    <h2 id="modal-title">Er du sikker på at du ønsker å sende forespørselen?</h2>
    <div class="btn-container">
      <button type="button" class="btn btn-success" id="confirm-send">
        JA, SEND FORESPØRSEL
      </button>
      <button type="button" class="btn btn-danger" id="close-modal">
        NEI, IKKE SEND FORESPØRSELEN
      </button>
    </div>
  `;
}

function getCancelBookingModalContent(): string {
  return `
    <h2 id="modal-title">Er du sikker på at du vil kansellere bookingen?</h2>
    <img src="/images/unsucessful.png" alt="" />
    <div class="btn-container">
      <button type="button" class="btn btn-success" id="booking-cancelled">
        JA, SLETT BOOKINGEN
      </button>
      <button type="button" class="btn btn-danger" id="close-modal">
        NEI, IKKE SLETT BOOKINGEN
      </button>
    </div>
  `;
}

function getBookingCancelledContent(): string {
  return `
    <h2 id="modal-title">Bookingen har blitt kansellert.</h2>
    <img src="/images/sucessful.png" alt="" />
    <button type="button" class="btn btn-success" id="close-modal">
      GÅ TILBAKE
    </button>
  `;
}

function getCheckingBookingContent(): string {
  return `
    <h2 id="modal-title">Sjekker at booking ikke allerede er bekreftet.</h2>
    <div class="spinner" aria-hidden="true">
      <img
        src="/images/paw-spinner.png"
        alt="Laster..."
        class="spinner-img"
      />
    </div>
  `;
}

function getChangesAvailableContent(): string {
  return `
    <div class="modal-changes-available">
      <img src="/images/sucessful.png" alt="" />
      <h2 id="modal-title">Booking er ikke bekreftet enda. Du kan gjøre endringer.</h2>
    </div>
    <button id="make-changes-btn" class="btn btn-warning">
      ENDRE BOOKING
    </button>
  `;
}

function getChangesUnavailableContent(): string {
  return `
    <div class="modal-changes-available">
      <img src="/images/unsucessful.png" alt="" />
      <h2 id="modal-title">
        Booking er allerede bekreftet. Du kan ikke gjøre endringer. Ta
        kontakt med hundepasser under "Mine bookinger" for å avtale
        endringer.
      </h2>
    </div>
    <button id="redirect-to-my-bookings" class="btn btn-success">
      GÅ TIL MINE BOOKINGER
    </button>
  `;
}

function getBookingSentContent(): string {
  return `
    <div id="booking-sent" tabindex="-1">
      <h5 id="modal-title">BOOKINGFORESPØRSEL SENDT!</h5>

      <div id="booking-sent-content">
        <img src="/images/sucess-checkmark.png" alt="" />
        <p id="modal-description">
          DIN FORESPØRSEL ER SENDT TIL HUNDEPASSEREN. DU FINNER DETALJENE OG
          STATUS PÅ BOOKINGEN UNDER <span>MINE BOOKINGER</span>.
        </p>
      </div>

      <div class="btn-container">
        <button class="btn btn-warning" id="checking-booking-confirmed">
          ENDRE BOOKING
        </button>
        <button class="btn btn-danger" id="cancel-booking">
          SLETT BOOKING
        </button>
        <button id="complete-booking-btn" class="btn btn-success">
          FULLFØR
        </button>
      </div>
    </div>
  `;
}

function getBookingUpdatedContent(): string {
  return `
    <div id="booking-updated" tabindex="-1">
      <h5 id="modal-title">BOOKINGFORESPØRSEL OPPDATERT!</h5>

      <div id="booking-updated-container">
        <img src="/images/sucess-checkmark.png" alt="" />
        <p id="modal-description">
          DIN FORESPØRSEL ER OPPDATERT. DU FINNER DETALJENE OG
          STATUS PÅ BOOKINGEN UNDER <span>MINE BOOKINGER</span>.
        </p>
      </div>

      <button id="redirect-my-bookings" class="btn btn-success">
        SE MINE BOOKINGER
      </button>
    </div>
  `;
}

let lastFocusedElement: HTMLElement | null = null;

function openModal() {
  lastFocusedElement = document.activeElement as HTMLElement;

  overlay.classList.add("is-open");

  const modalContent = overlay.querySelector(
    ".modal-content",
  ) as HTMLDivElement | null;

  modalContent?.focus();
}

function closeModal() {
  overlay.classList.remove("is-open");

  lastFocusedElement?.focus();
}

function showModal(content: string) {
  modalBody.innerHTML = content;
  openModal();
}

initBookingPage();
