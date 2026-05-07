// FREDRIK

import { createUser } from "../../requests/createUser";
import { getAllUsers } from "../../requests/getAllUsers";
import type { User } from "../../types/user.type";

let currentModal: HTMLDivElement | null = null;

function createLoginModal(dynamicContent: string) {
  closeModal();

  document.body.style.overflow = "hidden";

  const modalBackdrop = document.createElement("div") as HTMLDivElement;
  const modal = document.createElement("div") as HTMLDivElement;

  modal.classList.add("login-modal");

  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);

  modalBackdrop.classList.add("login-modal-backdrop");
  modal.innerHTML = dynamicContent;
  modal.classList.add("open");

  currentModal = modalBackdrop;
}

function createRegisterModal(dynamicContent: string) {
  closeModal();

  document.body.style.overflow = "hidden";

  const modalBackdrop = document.createElement("div") as HTMLDivElement;
  modalBackdrop.classList.add("register-modal-backdrop");

  const modal = document.createElement("div") as HTMLDivElement;

  modal.classList.add("register-modal");

  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);

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
    case "login-btn": {
      const dynamicContent = `
      <h2>LOGG INN</h2>
          <div class="">
            <form class="user-input-form">
            <label for="email-input">E-post:</label>
            <input type="mail" name="email" value="" id="email-input">
            <label for="password-input">Passord:</label>
            <input type="text" name="password" value="" id="password-input">
            </form>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-login-btn">LOGG INN</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
      createLoginModal(dynamicContent);
      break;
    }
    case "confirm-login-btn": {
      login();
      break;
    }
    case "register-btn": {
      const dynamicContent = `
        <div>
          <h2>REGISTRERINGSSKJEMA</h2>
        </div>
        <div class="register-form-container">
          <div class="register-user-form">
            <p>INTRODUSER DEG SELV:</p>
            <form class="user-form" id="registration-form">
              <div class="form-field">
                <label for="username-input">Fornavn:</label>
                <input type="text" name="username" id="username-input" class="reg-input" required/>
              </div>
              <div class="form-field">
                <label for="surname-input">Etternavn:</label>
                <input type="text" name="surname" id="surname-input" class="reg-input" required/>
              </div>
              <div class="form-field">
                <label for="location-input">Bosted:</label>
                <input type="text" name="location" id="location-input" class="reg-input" required/>
              </div>
              <div class="form-field">
                <label for="phone-input">Telefon:</label>
                <input type="text" name="phone" id="phone-input" class="reg-input" required/>
              </div>
              <div class="form-field">
                <label for="email-input">E-post:</label>
                <input type="text" name="email" id="email-input" class="reg-input" required/>
              </div>
              <div class="form-field">
                <label for="password-input">Passord:</label>
                <input type="text" name="password" id="password-input" class="reg-input" required/>
              </div>
              <div class="form-field">
                <label for="repeated-password-input">Gjenta passord:</label>
                <input type="text" name="repeated-password" id="repeated-password-input" class="reg-input" required/>
              </div>
              <p>FORTELL KORT OM DEG SELV:</p>
              <label for="description-input" hidden>fortell kort om deg selv:</label>
                <textarea name="description" id="description-input" form="register-form" class="reg-input" required ></textarea>
            </form>
            <div class="submit-image-container">
            <div class="icon">
              <img src="/images/useravatar.png" alt="Profilbilde" class="icon" />
              </div>
              <div class="button">
              <label class="btn btn-success">
                    LAST OPP BILDE
                    <input type="file" hidden />
                  </label>
              </div>
              </div>
          </div>
          </div>
        </div>
        <p id="error-txt" class="error-txt"></p>
        <div class="btn-container register-btn-container">
          <button class="btn btn-success" id="create-user-btn" type="submit" form="register-form">OPPRETT KONTO</button>
          <button id="close-btn"class="btn btn-danger">AVBRYT</button>
        </div>
      </div>
          `;
      createRegisterModal(dynamicContent);
      break;
    }
    case "create-user-btn": {
      const form = document.getElementById("registration-form") as HTMLFormElement;
      const errorTxt = document.getElementById("error-txt") as HTMLParagraphElement;
      const password = document.getElementById("password-input") as HTMLInputElement;
      const email = document.getElementById("email-input") as HTMLInputElement;
      const repeatedPassword = document.getElementById("repeated-password-input") as HTMLInputElement;
      const required = document.querySelectorAll(
        ".reg-input",
      ) as NodeListOf<HTMLInputElement>;
      if (!form.checkValidity()) {
        errorTxt.innerText = "ALLE FELTER MÅ VÆRE FYLT INN!"
        required.forEach(input => {
          input.style.border = "none";
          if (input.value === "") {
            input.style.border = "2px solid #d9534f";
          }
        });
      } else if(password.value != repeatedPassword.value) {
        required.forEach((input) => {
          input.style.border = "none";
        });
        errorTxt.innerText = "PASSORDENE ER IKKE LIKE!";
        password.style.border = "2px solid #d9534f";
        repeatedPassword.style.border = "2px solid #d9534f";
      } else if (password.value === repeatedPassword.value) {
        const createdUser = getNewUser();
        createUser(createdUser);

        const users = await getAllUsers();
        const user: User | undefined = users.find(
          (user) =>
            user.email === email.value && user.password === password.value,
        );

        if (!user) return;

        const dynamicContent = `
      <h2>Velkommen, ${createdUser.userName}! <br> Vi setter opp profilen din..</h2>
          <img src="/images/paw-spinner.png" class="login-spinner" alt="Loading spinner" draggable="false"/>
      `;
        createLoginModal(dynamicContent);

        setTimeout(() => {
          localStorage.setItem("userId", String(user.id));
          window.location.replace("/src/Pages/profile/profile.html");
        }, 2000);
      }

      break;
    }
    case "close-btn": {
      closeModal();
      break;
    }
    case "logout-btn": {
      const dynamicContent = `
      <h2>Logger ut..</h2>
          <img src="/images/paw-spinner.png" class="login-spinner" alt="Loading spinner" draggable="false"/>
      `;
      createLoginModal(dynamicContent);
      setTimeout(() => {
        localStorage.removeItem("userId");
        window.location.replace("./index.html");
      },2000)
      break;
    }
  }
});

async function login() {
  const users = await getAllUsers();
  const emailInput = (
    document.getElementById("email-input") as HTMLInputElement
  ).value;
  const passwordInput = (
    document.getElementById("password-input") as HTMLInputElement
  ).value;

  const user: User | undefined = users.find(
    (user) => user.email === emailInput && user.password === passwordInput,
  );

  if (!user) {
    const dynamicContent = `
      <h2>Logger inn...</h2>
          <img src="/images/paw-spinner.png" class="login-spinner" alt="Loading spinner" draggable="false"/>
      `;
    createLoginModal(dynamicContent);

    setTimeout(() => {
      const dynamicContent = `
      <h2>Feil E-post eller passord!</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="login-btn">PRØV PÅ NYTT</button>
          </div>

      `;
      createLoginModal(dynamicContent);
    }, 1000);

    return;
  } else {
    const dynamicContent = `
      <h2>Logger inn...</h2>
          <img src="/images/paw-spinner.png" class="login-spinner" alt="Loading spinner" draggable="false"/>
      `;
    createLoginModal(dynamicContent);

    setTimeout(() => {
      localStorage.setItem("userId", String(user.id));
      window.location.replace("/src/Pages/profile/profile.html");
    }, 2000);
  }
}

function getNewUser(): Partial<User> {
  const userName = (
    document.getElementById("username-input") as HTMLInputElement
  ).value;
  const surName = (document.getElementById("surname-input") as HTMLInputElement)
    .value;
  const location = (
    document.getElementById("location-input") as HTMLInputElement
  ).value;
  const phone = (document.getElementById("phone-input") as HTMLInputElement)
    .value;
  const email = (document.getElementById("email-input") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("password-input") as HTMLInputElement
  ).value;
  const description = (
    document.getElementById("description-input") as HTMLInputElement
  ).value;

  return {
      userName: `${userName} ${surName}`,
      location: location,
      phone: Number(phone),
      email: email,
      password: password,
      description: description,
      image: "",
    };
  }














//  <div class="register-dog-form">
//           <label for="description">FORTELL KORT OM DEG SELV:</label>
//           <input type="textbox" name="description" id="description-input" required/ >
//             <p>LEGG TIL EN HUND:</p>
//             <form class="dog-form">
//               <div class="form-field">
//                 <label for="">Navn:</label>
//                 <input type="text" />
//               </div>
//               <div class="form-field">
//                 <label for="">rase:</label>
//                 <input type="text" />
//               </div>
//               <div class="form-field">
//                 <label for="">Alder:</label>
//                 <input type="text" />
//               </div>
//               <div class="form-field">
//                 <label for="">Allergier:</label>
//                 <input type="text" />
//               </div>
//             </form>
//             <div class="btn-container">
//                 <img src="/images/dogicon.png" alt="Hundens avatar" />
//               <label class="btn btn-success">
//                     LAST OPP BILDE
//                     <input type="file" hidden />
//                   </label>
//             </div>
//           </div>
