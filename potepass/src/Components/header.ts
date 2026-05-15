// FREDRIK TEIEN & Anette

import "./header.css";
import "../Pages/Homepage/homepage.css";
import { createHomepageModal, closeModal } from "../Pages/Homepage/homepage";
import { createUser } from "../requests/createUser";
import { getNewUser } from "../Pages/Homepage/homepage";
import { getAllUsers } from "../requests/getAllUsers";
import type { User } from "../types/user.type";

const indexBtn = document.querySelectorAll(".index-btn") as NodeListOf<HTMLButtonElement>;

export function createHeader() {
  const header = document.getElementById("site-header") as HTMLElement;
  if (!header) {
    console.error("Could not find #site-header");
    return;
  }
  const userId = localStorage.getItem("storedUserId");

  if (!userId) {
    indexBtn.forEach(btn => {
      btn.style.display = "block"
    });
    header.innerHTML = `
    <div class="site-header">
        <div class="site-header-inner">
          <a class="site-header-brand" href="/index.html" aria-label="PØTEPASS hjem">
            <h1 class="logo">
              <span class="logo-text">P</span>
              <img class="logo-paw" src="/images/pawprint.png" alt="" />
              <span class="logo-text">TEPASS</span>
            </h1>
        	</a>

      <button 
          class="hamburger-btn" 
          id="hamburger-btn"
          aria-label="Åpne hovedmeny"
          aria-expanded="false"
          aria-controls="site-header-nav"
        >
          ☰
       </button>

      <nav class="site-header-nav" id="site-header-nav" aria-label="Hovedmeny">
        <a href="/src/Pages/booking/booking.html">BOOKING</a>
        <a href="/src/Pages/sitters/sitters.html">FINN HUNDEPASSERE</a>
        <a id="login-btn">LOGG INN</a>
        <a id="register-btn">REGISTRER</a>
      </nav>
          </div>
        </div>
  `;
  } else {
    indexBtn.forEach((btn) => {
      btn.style.display = "none";
    });
    header.innerHTML = `
  <div class="site-header">
        <div class="site-header-inner">
          <a class="site-header-brand" href="/index.html" aria-label="PØTEPASS hjem">
            <h1 class="logo">
              <span class="logo-text">P</span>
              <img class="logo-paw" src="/images/pawprint.png" alt="" />
              <span class="logo-text">TEPASS</span>
            </h1>
        	</a>

    <button 
        class="hamburger-btn" 
        id="hamburger-btn"
        aria-label="Åpne hovedmeny"
        aria-expanded="false"
        aria-controls="site-header-nav"
      >
        ☰
    </button>

    <nav class="site-header-nav" id="site-header-nav" aria-label="Hovedmeny">
      <a href="/src/Pages/booking/booking.html">BOOKING</a>
      <a href="/src/Pages/sitters/sitters.html">FINN HUNDEPASSERE</a>
      <a href="/src/Pages/profile/profile.html">PROFIL</a>
      <a id="logout-btn">LOGG UT</a>
    </nav>
        </div>
      </div>
  `;
  }
}

document.addEventListener("click", async (e) => {
  const target = e.target as HTMLButtonElement;

  switch (target.id) {
    case "login-btn": {
      const dynamicContent = `
      <h2>LOGG INN</h2>
          <div class="">
            <form class="user-input-form">
            <label for="email-input">E-post:</label>
            <input type="mail" name="email" value="" id="email-input">
            <label for="password-input">Passord:</label>
            <input type="password" name="password" value="" id="password-input">
            </form>
          </div>
          <div class="btn-container">
            <button class="btn btn-success" id="confirm-login-btn">LOGG INN</button>
            <button class="btn btn-danger" id="close-btn">AVBRYT</button>
          </div>
  `;
      createHomepageModal(dynamicContent);
      break;
    }
    case "h-register-btn": {
      const dynamicContent = `
        <div>
          <h2>REGISTRERINGSSKJEMA</h2>
        </div>
        <div class="register-form-container">
          <div class="register-user-form">
            
            <form class="user-form" id="h-registration-form">
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
                <textarea name="description" id="description-input" class="reg-input" required ></textarea>
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
        <p id="error-txt" class="error-txt"></p>
        <div class="btn-container register-btn-container">
          <button class="btn btn-success" id="h-create-user-btn" type="button" form="h-registration-form">OPPRETT KONTO</button>
          <button id="close-btn"class="btn btn-danger">AVBRYT</button>
        </div>
      </div>
          `;
      createHomepageModal(dynamicContent);
      break;
    }
     case "h-create-user-btn": {
          const form = document.getElementById("h-registration-form") as HTMLFormElement;
          const errorTxt = document.getElementById("error-txt") as HTMLParagraphElement;
          const password = document.getElementById("password-input") as HTMLInputElement;
          const email = document.getElementById("email-input") as HTMLInputElement;
          const repeatedPassword = document.getElementById("repeated-password-input") as HTMLInputElement;
          const required = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            ".reg-input")
          if (!form.checkValidity()) {
            form.reportValidity();
            errorTxt.innerText = "ALLE FELTER MÅ VÆRE FYLT INN!"
            required.forEach(input => {
              const field = input as HTMLInputElement | HTMLTextAreaElement;
              field.style.border = "none";
              if (field.value === "") {
                field.style.border = "2px solid #d9534f";
              }
            });
            return;
          } else if(password.value.toLowerCase() != repeatedPassword.value.toLowerCase()) {
            required.forEach((input) => {
              input.style.border = "none";
            });
            errorTxt.innerText = "PASSORDENE ER IKKE LIKE!";
            password.style.border = "2px solid #d9534f";
            repeatedPassword.style.border = "2px solid #d9534f";
          } else if (password.value.toLowerCase() === repeatedPassword.value.toLowerCase()) {
            const createdUser = getNewUser();
            await createUser(createdUser);
    
            const users = await getAllUsers();
            const user: User | undefined = users.find(
              (user) =>
                user.email.toLowerCase() === email.value.toLowerCase() && user.password.toLowerCase() === password.value.toLowerCase(),
            );
    
            if (!user) return;
    
            const dynamicContent = `
          <h2>Velkommen, ${createdUser.userName}! <br> Vi setter opp profilen din..</h2>
              <img src="/images/paw-spinner.png" class="homepage-spinner" alt="Loading spinner" draggable="false"/>
          `;
            createHomepageModal(dynamicContent);
    
            setTimeout(() => {
              localStorage.setItem("storedUserId", String(user.id));
              window.location.replace("/src/Pages/profile/profile.html");
            }, 2000);
          }
          break;
        }
    case "logout-btn": {
      const dynamicContent = `
      <h2 class="logout-txt">Logger ut..</h2>
          <img src="/images/paw-spinner.png" class="homepage-spinner" alt="Loading spinner" draggable="false"/>
      `;
      createHomepageModal(dynamicContent);
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
    case "hamburger-btn":{
        const nav = document.querySelector("#site-header-nav") as HTMLElement | null;
        const hamburgerBtn = document.querySelector(
          "#hamburger-btn",
        ) as HTMLButtonElement | null;

        if (!nav || !hamburgerBtn) return;

        nav.classList.toggle("is-open");

        const menuIsOpen = nav.classList.contains("is-open");
        hamburgerBtn.setAttribute("aria-expanded", String(menuIsOpen));

        hamburgerBtn.innerHTML = menuIsOpen ? "✕" : "☰";

        break;
    }
    default:
      break;
  }
});
