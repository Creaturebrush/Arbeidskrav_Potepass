//Stine Hartvigsen
// API IMPORTS

import { type petSitters } from "../../types/petSitters.type";
import { getAllPetSitters } from "../../requests/getAllPetSitters";
import { getAllReviews } from "../../requests/getAllReviews";
import {type  reviews } from "../../types/reviews.type";
import { getAllUsers } from "../../requests/getAllUsers";
import { type User } from "../../types/user.type";

// Petsitter card
function renderSitters (sitters: petSitters[], reviews: reviews[], users: User[]) {
    return `
    <div class="sitters-list" id="sittersCurrentList">
								 ${sitters.map((sitter) => ` 
					<article class="sitter-card">

							<div class="sitters-compact">
							<div class="sitter-profil">
									<img src="/images/hero.jpg" alt="" />
									<span class="" aria-hidden="true"></span>
							</div>
									
							<div class="sitter-compact-info">
									<div class="sitter-name">${sitter.name}</div>

									<div class="sitter-city">
									<span class="sitter-pin" aria-hidden="true">
											<img src="/images/pin.png" alt="" />${sitter.location} </span> 
									</div>
									<div class="sitter-rating" aria-label="Vurdering 4 av 5">
									<span class="stars stars--rated">${sitter.rating}★★★★☆</span>
									</div>
							</div>

							
							<div class="sitter-compact-about">
									<div class="sitter-about-title">Litt om meg:</div>
									<div class="sitter-about-text">${sitter.experienceDescription}</div>
							</div>
							
							<button class="sitter-toggle" type="button" aria-label="Vis mer om hundepasseren">
									<img class="sitter-chev" src="/images/arrow-down-2.png" alt="" aria-hidden="true" />
							</button> 
							</div>
											
							
							<div class="sitter-details" >
							<div class="sitter-detail-top">
									<div class="sitter-photo">
									<img src="/images/hero.jpg" alt="">
									<!--<span class="sitter-favorite"></span>-->
									</div>
											
									<div class="sitter-detail-content">
									<div class="sitter-detail-head">
											<div class="sitter-detail-info">
											<h3 class="sitter-detail-name">${sitter.name}</h3>
											<div class="sitter-city">
													<span class="sitter-pin" aria-hidden="true">
															<img src="/images/pin.png" alt="" /></span> ${sitter.location}
													</div>
											</div>
											<button class="sitter-toggle" type="button" aria-label="lukk detaljer for hundepassere"
											">
											<img class="sitter-chev" src="/images/up-arrow.png" alt="" aria-hidden="true" />
											</button>
									</div>

									<div class="sitter-detail-columns">
											<div class="sitter-detail-block">
											
											<div class="sitter-detail-title">Om meg</div>
											<p class="sitter-detail-text">
											${sitter.experienceDescription}
											</p>
											</div>
											<div class="sitter-detail-block">
											<div class="sitter-detail-title">Detaljer</div>
													<p class="sitter-detail-text">
															Årserfraing: ${sitter.yearsOfExperience} <br/>
															Passer: ${sitter.acceptsLargeDogs}<br/>
															Erfaring: ${sitter.experienceDescription} <br/>
															Max anntall hunder samtidig: ${sitter.maxDogs}<br/>
															pris:<br/>
													</p>
											</div>
											</div>

											
											<div class="sitter-detail-bottom">
											<div class="sitter-detail-rating">
													<span class="stars stars--rated" aria-label="vurdering 4 av 5">★★★★☆</span>
													<button class="sitter-reviews-toggle" type="button" >
													<span class="sitters-review-count">3 omtaler</span>
													<img class="sitter-mini-chev" src="/images/arrow-down-2.png" alt="" aria-hidden="true">
													</button>
											</div>
											
											<a class="btn btn-success sitter-book" href="/src/Pages/booking/booking.html">BOOK NÅ</a>
											</div>
									</div>
							</div>

							
							<div class="sitter-reviews">
								${renderReviews(reviews,sitter.id, users)}

							</div>
							</div>    
					</article>
					`).join("")}
		</div>
    `;
}

//sitters
function initSitters(container: HTMLElement){
	container.addEventListener("click", (e) =>{
		const target = e.target as HTMLElement;
		if (!target) return;

		//chevron
		const chevron = target.closest<HTMLButtonElement>(".sitter-toggle");
		if (chevron) {
				const sitterCard = chevron.closest(".sitter-card") as HTMLElement;
				if (!sitterCard) return;

				const compact = sitterCard.querySelector(".sitters-compact") as HTMLElement;
				const details = sitterCard.querySelector(".sitter-details") as HTMLElement;
				const comments = sitterCard.querySelector(".sitter-reviews") as HTMLElement;
				if (!compact || !details || !comments) return;

				const isOpen = sitterCard.classList.toggle("sitter-card--is-active");

				sitterCard.classList.toggle("sitter-card--is-active", isOpen);
				

				comments.classList.remove("sitter-reviews--is-active");
				sitterCard.querySelectorAll(".sitter-reviews-toggle").forEach((btn) => {
					btn.classList.remove("sitter-reviews-toggle--is-active"); 
				});
		
			return;
		}

		//coments
		const commentsBtn = target.closest<HTMLButtonElement>(".sitter-reviews-toggle");
		if(commentsBtn) {
			const sitterCard = commentsBtn?.closest(".sitter-card") as HTMLElement;
			if (!sitterCard) return;

			const comments = sitterCard.querySelector(".sitter-reviews") as HTMLElement;
			if (!comments) return;

			const isOpen = comments.classList.toggle("sitter-reviews--is-active");

			sitterCard.querySelectorAll(".sitter-reviews-toggle").forEach((btn) =>{
				btn.classList.toggle("sitter-reviews-toggle--is-active", isOpen); 

			});
			return;
		}
	});
}
function renderReviews(reviews: reviews[], sitterId: number, users: User[]){
	const sitterReviews = reviews.filter(review => review.toPetSitterId === sitterId);
/** 
	
	const reviewer: reviews = users.find(
		(user) => user.id === reviewer.fromUserId
	);
*/
	if (sitterReviews.length === 0) {
		return `<p class="no-reviews">Ingen omtaler enda</P>`;
	}

	
	return sitterReviews.map(review => {
		

		`
			<article class="reviews">
				<div class="review-avatar" aria-hidden="true">
						<img src="/images/useravatar.png" alt="" />     
				</div>
				<div class="review-info">
						<div class="review-name">${review.fromUserId}</div>
						<div class="sitter-city">
						<span class="sitter-pin" aria-hidden="true">
						<img src="/images/pin.png" alt="" /></span>Bergen 
						</div>
				</div>
				<div class="stars stars--rated" aria-label="Vurdering 5 av 5">★★★★★</div>  
				
				<div class="review-comment">
						<p class="review-title">${review.reviewTitle}</p>
						<p class="review-text">${review.reviewMessage}</p>
				</div>     

			</article>`}).join("");
	}

//tabs

function sitterTabs() {
	const buttons = document.querySelectorAll<HTMLButtonElement>(".sitters-tab");
	const panels = document.querySelectorAll<HTMLElement>(".sitters-panel");

	buttons.forEach((button) => {
		button.addEventListener("click",() => {
			const tabNumber = button.dataset.forTab;
			if (!tabNumber) return;

			buttons.forEach((btn) =>
			  btn.classList.remove("sitters-tab--is-active")
			);
			panels.forEach((panel) =>
				panel.classList.remove("sitters-panel--is-active")
			);
			button.classList.add("sitters-tab--is-active");

		const activePanel = document.querySelector(`.sitters-panel[data-tab="${tabNumber}"]`) as HTMLElement;

		if (activePanel) {
			activePanel.classList.add("sitters-panel--is-active")
		}

		});
		
	});

}

// show it 

document.addEventListener("DOMContentLoaded", async ()=> {
	const currentTab = document.querySelector(
		`.sitters-panel[data-tab="1"]
		`) as HTMLElement;

	const previousTab = document.querySelector(
		`.sitters-panel[data-tab="2"]
		`) as HTMLElement;

	const firstTabButton = document.querySelector(
		`.sitters-tab[data-for-tab="1"]
		`) as HTMLElement;

	const sittersContainer = document.querySelector(".sitters-shell") as HTMLElement;

		if (!currentTab || !previousTab || !firstTabButton || !sittersContainer) return;

		const [sitters, reviews, users] = await Promise.all([
			getAllPetSitters(),
			getAllReviews(),
			getAllUsers()
		]);


		currentTab.innerHTML = renderSitters(sitters, reviews, users);
		previousTab.innerHTML = renderSitters(sitters, reviews, users)


		currentTab.classList.add("sitters-panel--is-active");
		firstTabButton.classList.add("sitters-tab--is-active");

		
		
		sitterTabs();
		initSitters(sittersContainer);

});

// Your profile (only show if currentuser is a petsitter)


// MODALS
let sittersModal: HTMLDivElement | null = null;

function createModal (dynamicContent: string){
	closeModal();

	document.body.style.overflow = "hidden";

	const modalBackdrop = document.createElement("div");
	const modal = document.createElement("div");

	modalBackdrop.classList.add("confirm-card-backdrop")
	modal.classList.add("confirm-card-inner")

	modal.innerHTML = dynamicContent;

	modalBackdrop.appendChild(modal);
	document.body.appendChild(modalBackdrop);

	modal.classList.add("open");

	sittersModal = modalBackdrop;


}

function closeModal(){
	if (sittersModal){
		sittersModal.remove();
		sittersModal = null;
	}
	document.body.style.overflow = "";
}

document.addEventListener("click", (e) =>{
	const target = e.target as HTMLElement;
	switch (target.id){
		case "delete-registration": {
			const dynamicContent=`
			 <section class="confirm-card" aria-labelledby="">
          <div class="confirm-card-inner">
            <h3 class="confirm-title" id="">
              Er du sikker på at du vil fjerne registreringen din som hundpasser?
            </h3>
 
            <div class="confirm-icon" aria-hidden="true">
              <img src="/images/delete-button.png" alt="" />
            </div>
 
            <div class="confirm-actions">
              <button class="btn btn-success" id="confirm-delete" type="button">JA, SLETT REGISTRERING</button>
              <button class="btn btn-danger" id="close-modal" type="button">NEI, GÅ TILBAKE</button>
            </div>
          </div>
        </section>
			`;
			createModal(dynamicContent);
			break;
		}

		case "confirm-delete": {
			const dynamicContent=`
			 <section class="confirm-card" aria-labelledby="">
          <div class="confirm-card-inner">
            <h3 id="" class="confirm-title">
              Registreringen din som hundepasser er slettet.
            </h3>
 
            <div class="confirm-icon" aria-hidden="true">
              <img src="/images/check.png" alt="" />
            </div>
 
            <div class="confirm-actions">
              <button class="btn btn-success" id="close-modal" type="button">GÅ TILBAKE</button>
            </div>
          </div>
        </section>
			`;
			createModal(dynamicContent);
			break;
		}

		case "update-sitter-profile": {
			const dynamicContent=`
		     <section class="confirm-card" aria-labelledby="">
          <div class="confirm-card-inner">
            <h3 id="" class="confirm-title">
              Er du sikker på at du vil oppdatere profilen din?
            </h3>
            <div class="confirm-icon" aria-hidden="true">
              <img src="/images/delete-button.png" alt="" />
            </div>
 
            <div class="confirm-actions">
              <button class="btn btn-success" type="button">JA, OPPDATER</button>
              <button class="btn btn-danger" id="close-modal" type="button">NEI, GÅ TILBAKE</button>
            </div>
          </div>
        </section>
			`;
			createModal(dynamicContent);
			break;
		}


			// insert UPDATE FORM HERE (JA, OPPDATER)
			
		case "register-as-petsitter": {
			const dynamicContent=`
		     <section class="confirm-card" aria-labelledby="">
          <div class="confirm-card-inner">
            <h3 id="" class="confirm-title">
              Du er nå nesten registrert som hundepasser!
            </h3>
 
            <p class="confirm-subtitle">Takk for at du er med på laget!</p>
 
            <div class="confirm-actions">
              <button class="btn btn-danger" type="button" id="close-modal">ANGRE REGISTRERING</button>
              <button class="btn btn-success" type="submit" id="confirm-registration">FULLFØR</button>
            </div>
          </div>
        </section> 
			`;
			createModal(dynamicContent);
			break;
		}
			
		case "confirm-registration": {
			const dynamicContent=`
		    <section class="confirm-card" aria-labelledby="">
          <div class="confirm-card-inner">
            <h3 id="" class="confirm-title">
              Registreringen din er oppdadert.
            </h3>
 
            <div class="confirm-icon" aria-hidden="true">
              <img src="/images/check.png" alt="" />
            </div>
 
            <div class="confirm-actions">
              <button class="btn btn-success" type="button" id="finish-registration">GÅ TILBAKE</button>
            </div>
          </div>
        </section>
			`;
			createModal(dynamicContent);
			break;
		}

		case "close-modal":
		case "cancel-registration":
		case "finish-registration":
			closeModal();
		break;
	}	
});

//  BECOME A SITTER FORM

document.addEventListener("DOMContentLoaded", () =>{
	const openBtn = document.getElementById("openBecomeASitterForm") as HTMLButtonElement | null;
	const formSection = document.querySelector<HTMLElement>(".become-shell");
	const mainContent = document.getElementById("mainContent") as HTMLElement | null;
	const closeBtn = document.getElementById("cancel-become-form") as HTMLElement | null;

	if ( !openBtn || !formSection || !mainContent || !closeBtn) return;
	
	openBtn.addEventListener("click", () =>{
		mainContent.hidden =true;
		formSection.hidden = false;
		console.log("become-a-sitter form opened");
  });

	closeBtn.addEventListener("click", () =>{
		formSection.hidden = true;
		mainContent.hidden = false;
	});


});
