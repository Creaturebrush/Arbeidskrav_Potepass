//Stine Hartvigsen
import { type PetSitters } from "../../types/petSitters.type";
import { getAllPetSitters } from "../../requests/getAllPetSitters";
import { getAllReviews } from "../../requests/getAllReviews";
import {type  Reviews } from "../../types/reviews.type";
import { getAllUsers } from "../../requests/getAllUsers";
import { type User } from "../../types/user.type";
import { createPetSitter } from "../../requests/createPetSitter";
import { deletePetSitter } from "../../requests/deletePetSitter";
import { updatePetSitterProfile } from "../../requests/patchPetSitter";


let currentPetSitter: PetSitters | null = null;

let allSitters: PetSitters [] = [];
let allReviews: Reviews [] = [];
let allUsers: User [] = [];

type View = "list" | "form" | "edit";

let currentView: View ="list";

let locationInput: HTMLInputElement;
let priceMinInput: HTMLInputElement;
let priceMaxInput: HTMLInputElement;
let dateFromInput: HTMLInputElement;
let dateToInput: HTMLInputElement;

let mainContent: HTMLElement;
let formShell: HTMLElement;
let formSection: HTMLFormElement;
let profileSection: HTMLElement;
let editProfileSection: HTMLFormElement;

let sittersModal: HTMLDivElement | null = null;
const form = document.getElementById("becomeSitterForm") as HTMLFormElement;

function getFilteredSitters(){
	const locationValue = locationInput.value.toLowerCase();
	const minPrice = Number(priceMinInput.value) ||0;
	const maxPrice = Number(priceMaxInput.value) || 1500;
	/* 
	const dateFrom = dateFromInput.value;
	const dateTo = dateToInput.value;
	*/
	return allSitters.filter((sitter) =>{
		const filterLocation = !locationValue || sitter.location.toLowerCase().includes(locationValue);
		const filterPrice = sitter.pricePerDay >= minPrice && sitter.pricePerDay <= maxPrice;
		
	/**
		let sitterAvailability = true;
		if (dateFrom && dateTo){
		 	sitterAvailability = sitter.available <= dateFrom && sitter.available >= dateTo;
		}
*/
		return (
			filterLocation && filterPrice /* && sitterAvailability*/
		);
 });
}

function acceptedDogs (sitter: PetSitters){
	const experience:string [] = [];
	const sizes:string [] = [];

	if (sitter.acceptsPuppies){
		experience.push("valper");
	}
	if (sitter.acceptsAdultDogs){
		experience.push("voksne hunder");
	}
	if (sitter.acceptsSeniorDogs){
		experience.push("senior hunder");
	}
	if (sitter.acceptsSmallDogs){
		sizes.push("små")
	}
	if (sitter.acceptsMediumDogs){
		sizes.push("mellomstore")
	}
	if (sitter.acceptsLargeDogs){
		sizes.push("store")
	}
	return { 
		experience: experience.map(item => `<span class="sitter-tag">${item}, </span>`).join(""),
		sizes: sizes.map(item => `<span class="sitter-tag">${item}, </span>`).join("")
	}
}

function loadCurrentPetSitter(){
const savedSitter = localStorage.getItem("currentPetSitter");   
	
	if (!savedSitter) return null;

	try {
		return JSON.parse(savedSitter);
	} catch { 
		localStorage.removeItem("currentPetSitter");
		return null;
	}
}

function renderSittersList(){
	const filteredSitters = getFilteredSitters();
	const currentTab = document.querySelector(`.sitters-panel[data-tab="1"]`) as HTMLElement;
	if (!currentTab) return;

	currentTab.innerHTML = renderSitters(filteredSitters, allReviews, allUsers);
}

function renderReviews(reviews: Reviews[], sitterId: number, users: User[]){
	const sitterReviews = reviews.filter(review => review.toPetSitterId === sitterId);

	if (sitterReviews.length === 0) {
	return "";
}

return sitterReviews.map((review) => {
	const reviewer = users.find(
		(user) => user.id === review.fromUserId
		
	);
	
	if(!reviewer) return "";

	return`
		<article class="reviews" aria-label="omtale">
			<div class="review-avatar" aria-hidden="true">
					<img src="/images/useravatar.png" alt="" />     
			</div>
			
			<div class="review-info">
					<div class="review-name">${reviewer.userName}</div>
					<div class="sitter-city">
						<span class="sitter-pin" aria-hidden="true">
						<img src="/images/pin.png" alt="" /></span>${reviewer.location} 
					</div>
			</div>

			<div class="review-comment">
					<p class="review-title">${review.reviewTitle}</p>
					<p class="review-text">${review.reviewMessage}</p>
			</div>     

		</article>` ;
	
	})
		.join("");
}

function renderSitters (sitters: PetSitters[], reviews: Reviews[], users: User[]) {
	return `
	<div class="sitters-list" id="sittersCurrentList">
				${sitters.map((sitter) =>{ 
					const acceptedDogsData = acceptedDogs(sitter);
				return	` 
				<article class="sitter-card" aria-label="hundepassere">

					<div class="sitters-compact">
						<div class="sitter-profil">
								<span class="" aria-hidden="true">
                  <img src="${sitter.image || "/images/hero.jpg"}" alt="" />
                </span>
						</div>
								
						<div class="sitter-compact-info">
								<div class="sitter-name">${sitter.name || sitter.userName}</div>

								<div class="sitter-city">
									<span class="sitter-pin" aria-hidden="true">
											<img src="/images/pin.png" alt="" /> </span> 
								</div> ${sitter.location}
								<div class="sitter-rating" aria-label="sitter rating ${sitter.rating}">${sitter.rating}
									<span class="stars stars--rated">★★★★☆</span>
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
									<img src="${sitter.image || "/images/hero.jpg"}" alt="">

								</div>
										
								<div class="sitter-detail-content">
									<div class="sitter-detail-head">
										<div class="sitter-detail-info">
										<h3 class="sitter-detail-name">${sitter.name || sitter.userName}</h3>
										<div class="sitter-city">
												<span class="sitter-pin" aria-hidden="true">
														<img src="/images/pin.png" alt="" /></span> ${sitter.location}
												</div>
										</div>
										<button class="sitter-toggle" type="button" aria-label="lukk detaljer for hundepassere">
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
												<div class="sitter-info-list">
													<div class="sitter-info-row">
														<span class="sitter-info-label">Årserfaring:</span>
														<span>${sitter.yearsOfExperience} </span>
													</div>
													<div class="sitter-info-row">
															<span class="sitter-info-label">Max antall hunder:</span>
															<span>${sitter.maxDogs} </span>
													</div>
													<div class="sitter-info-row">
														<span class="sitter-info-label">Erfaring med:</span>
														<span class="sitter-tags">${acceptedDogsData.experience}</span>
													</div>
													<div class="sitter-info-row">
														<span class="sitter-info-label">Passer:</span>
														<span class="sitter-tags">${acceptedDogsData.sizes}</span>
													</div>
													<div class="sitter-info-row">
														<span class="sitter-info-label">Pris:</span>
														<span>${sitter.pricePerDay} ,-/pr dag </span>
													</div>
												</div>
					
											</div>
										</div>

										<div class="sitter-detail-bottom">
											<div class="sitter-detail-rating">${sitter.rating}
												<span class="stars stars--rated" aria-label="vurdering 4 av 5">★★★★☆</span>
												<button class="sitter-reviews-toggle" type="button" >
												<span class="sitters-review-count">Omtaler</span>
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
				`}).join("")}
	</div>
	`;
}
async function getCurrentUser(): Promise<User>{
	const storedUserId = localStorage.getItem("storedUserId");
	if (!storedUserId){
		throw new Error ("du er ikke logget inn");
	}

	const users = await getAllUsers();
	const currentUser = users.find((user) => String(user.id) === storedUserId);

	if (!currentUser){
		throw new Error("fant ikke bruker")
	}
	return currentUser;
}

function renderCurrentProfile(){
	if (!profileSection) return;

	if (currentPetSitter){
		profileSection.hidden = false;
		profileSection.innerHTML = renderPetSitterProfile(currentPetSitter);
	}else{
		profileSection.innerHTML ="";
		profileSection.hidden = true;
	}
}

function renderPetSitterProfile (sitter:PetSitters): string {
	const dogTags = acceptedDogs(sitter);
	return `
		<h4 class="my-sitter-title">Din hundepasserprofil</h4>
			<article class="sitter-card my-sitter-card" aria-label="din hundepasser profil">
				<div class="my-sitter-detail">
					<div class="sitter-detail-top">
						<div class="sitter-photo">
							<img src="${sitter.image || "/images/hero.jpg"}" alt="Profilbilde av deg som hundepasser" />
						</div>

						<div class="sitter-detail-content">
							<div class="sitter-detail-head">
								<h3 class="sitter-detail-name">${sitter.userName}</h3>
							</div>

							<div class="sitter-detail-columns">
								<div class="sitter-detail-block">
									<div class="sitter-detail-title">Litt om meg</div>
									<p class="sitter-detail-text">
										${sitter.experienceDescription}
									</p>
								</div>

								<div class="sitter-detail-block">
									<div class="sitter-detail-title">Detaljer</div>
										<div class="sitter-info-list">
											<div class="sitter-info-row">
												<span class="sitter-info-label">Årserfaring:</span>
												<span>${sitter.yearsOfExperience} </span>
											</div>
											<div class="sitter-info-row">
													<span class="sitter-info-label">Max antall hunder:</span>
													<span>${sitter.maxDogs} </span>
											</div>
											<div class="sitter-info-row">
												<span class="sitter-info-label">Erfaring med:</span>
												<span class="sitter-tags">${dogTags.experience}  </span>
											</div>
											<div class="sitter-info-row">
												<span class="sitter-info-label">Passer:</span>
												<span class="sitter-tags">${dogTags.sizes} </span>
											</div>
											<div class="sitter-info-row">
												<span class="sitter-info-label">Pris:</span>
												<span>${sitter.pricePerDay} ,-/pr dag </span>
											</div>
										</div>
									</div>
								</div>
		
								<div class="my-sitter-bottom">
									<div class="my-sitter-bottom-left">
										<div class="sitter-rating" aria-label="Vurdering 4.6 av 5">
                      <span class="my-sitter-reviews">${sitter.reviewCount}</span>
											<span class="stars stars--rated">★★★★☆</span>			
										</div>
									</div>

									<div class="my-sitter-actions">
										<button class="btn btn-warning status-btn"  id="update-mysitter-profile" type="button" aria-label="rediger hundepasser profil">
											REDIGER
										</button>
										<button class="btn btn-danger status-btn" id="delete-registration" type="button" aria-label="slett hundepasser profil">
											SLETT
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
	`;	
}

function updateView(){
	mainContent.hidden = currentView !== "list";
	formShell.hidden = currentView !== "form";
	editProfileSection.hidden = currentView !== "edit";
}

function createModal (dynamicContent: string){
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
};

function closeModal(){
	if (sittersModal){
		sittersModal.remove();
		sittersModal = null;
	}
	document.body.style.overflow = "";
}

function initSitters(container: HTMLElement){
	container.addEventListener("click", (e) =>{
		const target = e.target as HTMLElement;
		if (!target) return;

		const chevron = target.closest(".sitter-toggle") as HTMLElement;
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

document.addEventListener("click", async (e) =>{	
	const target = (e.target as HTMLButtonElement).closest("button");
	if(!target) return;

	switch ((target as HTMLElement).id) {
		case "confirm-registration":{
			createModal(`
				<section class="confirm-card" aria-labeledby="confirmTitle">
					<div class="confirm-card-inner">
						<h3 id="confirmTitle" class="confirm-title">
							Du er nå nesten registrert som hundepasser!
						</h3>

						<p class="confirm-subtitle">Takk for at du er med på laget!</p>

						<div class="confirm-actions">
							<button class="btn btn-danger" type="button" id="cancel-registration" aria-lable="angre registrering">ANGRE REGISTRERING</button>
							<button class="btn btn-success" form="becomeSitterForm" type="button" id="really-confirm-registration" aria-label="fullfør registrering">FULLFØR</button>
						</div>
					</div>
				</section> 
			`) ;
		break;
	}	
	
		case "really-confirm-registration": {
			closeModal();
			createModal (`
					<section class="confirm-card">
						<div class="confirm-card-inner">
							<h2>Regisrerer hundepasser...</h2>
							<img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" draggable="false"/>
						</div>
					</section>
      		`);
			
			await confirmRegistration();
			const formSection = document.getElementById("becomeSitterForm") as HTMLFormElement;
		    
				if(formSection){
					formSection.requestSubmit();
				}

				setTimeout(()=>{
					closeModal();
				},1500);

		break;
		}
		case "delete-registration": {
			
		createModal (`
			 <section class="confirm-card" aria-labelledby="confirmDeleteRegistration">
          <div class="confirm-card-inner">
            <h3 class="confirm-title" id="confirmDeleteRegistration">
              Er du sikker på at du vil fjerne registreringen din som hundpasser?
            </h3>
 
            <div class="confirm-icon" aria-hidden="true">
              <img src="/images/delete-button.png" alt="" />
            </div>
 
            <div class="confirm-actions">
              <button class="btn btn-success" id="confirm-delete" type="button" aria-label="bekreft slett registrering">JA, SLETT REGISTRERING</button>
              <button class="btn btn-danger" id="close-modal" type="button" aria-label="nei, gå tilbake">NEI, GÅ TILBAKE</button>
            </div>
          </div>
        </section>
			`);
		break;
		}
		
		case "confirm-delete": {
			if(!currentPetSitter) return;
				try {
					closeModal();
					createModal (`
					<section class="confirm-card">
						<div class="confirm-card-inner">
							<h2>Sletter hundepasser profilen din...</h2>
							<img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" draggable="false"/>
						</div>
					</section>
      		`);
					
					await deletePetSitter(currentPetSitter.id);

					allSitters = allSitters.filter(
						(sitter)=> sitter.id !== currentPetSitter!.id
					);
					
					currentPetSitter = null;

					localStorage.removeItem("currentPetSitter");

					renderCurrentProfile();
					renderSittersList();
			
					
					
					setTimeout(() =>{
						closeModal();
						createModal (`
							<section class="confirm-card" aria-labelledby="deleteSitterRegistration">
								<div class="confirm-card-inner">
									<h3 id="deleteSitterRegistration" class="confirm-title">
										Registreringen din som hundepasser er slettet.
									</h3>

									<div class="confirm-icon" aria-hidden="true">
										<img src="/images/check.png" alt="" />
									</div>

									<div class="confirm-actions">
										<button class="btn btn-success" id="close-modal" type="button" aria-label="gå tilbake">GÅ TILBAKE</button>
									</div>
								</div>
							</section>`);
					},1500);
					

		} catch (error) {
			console.error(error);
			return; 	
			}

		break;
		}
 
		case "update-mysitter-profile":{
			if (!currentPetSitter) return;
			
				currentView = "edit" ;
				updateView();

				setTimeout(() => { 
					if (!currentPetSitter) return;
					(document.getElementById("editExperienceDescription") as HTMLTextAreaElement).value = currentPetSitter.experienceDescription;
					(document.getElementById("editYearsOfExperience") as HTMLInputElement).value = String (currentPetSitter.yearsOfExperience);
					(document.getElementById("editPricePerDay") as HTMLInputElement).value = String (currentPetSitter.pricePerDay);
					(document.getElementById("editMaxDogs") as HTMLInputElement).value = String (currentPetSitter.maxDogs);

					(document.querySelector("input[name='experiencePuppies']") as HTMLInputElement).checked = currentPetSitter.acceptsPuppies;
					(document.querySelector("input[name='experienceAdultDogs']") as HTMLInputElement).checked = currentPetSitter.acceptsAdultDogs;
					(document.querySelector("input[name='experienceSeniorDogs']") as HTMLInputElement).checked = currentPetSitter.acceptsSeniorDogs;

					(document.querySelector("input[name='sizeSmallDogs']") as HTMLInputElement).checked = currentPetSitter.acceptsSmallDogs;
					(document.querySelector("input[name='sizeMediumDogs']") as HTMLInputElement).checked = currentPetSitter.acceptsMediumDogs;
					(document.querySelector("input[name='sizeLargeDogs']") as HTMLInputElement).checked = currentPetSitter.acceptsLargeDogs;

				});
		break;

		}

		case"update-sitter-profile":{
		
			createModal( `
				<section class="confirm-card" aria-labelledby="updateSitterProfile">
					<div class="confirm-card-inner">
						<h3 id="updateSitterProfile" class="confirm-title">
							Er du sikker på at du vil oppdatere profilen din?
						</h3>
						<div class="confirm-icon" aria-hidden="true">
							<img src="/images/delete-button.png" alt="" />
						</div>

						<div class="confirm-actions">
							<button class="btn btn-success" id="confirm-edit" type="button" aria-label="oppdater">JA, OPPDATER</button>
							<button class="btn btn-danger" id="cancel-edit-sitter" type="button" aria-label="gå tilbake">NEI, GÅ TILBAKE</button>
						</div>
					</div>
				</section>
			`);	
		
		break;
		}

		case"confirm-edit":{ 

			if (!currentPetSitter) return;

			const updated = {
				experienceDescription: (document.getElementById("editExperienceDescription")as HTMLTextAreaElement).value,
				yearsOfExperience: Number((document.getElementById("editYearsOfExperience")as HTMLInputElement).value),
				pricePerDay: Number((document.getElementById("editPricePerDay")as HTMLInputElement).value),
				maxDogs: Number ((document.getElementById("editMaxDogs")as HTMLInputElement).value),

				acceptsPuppies: (document.querySelector("input[name='experiencePuppies']") as HTMLInputElement).checked,
				acceptsAdultDogs: (document.querySelector("input[name='experienceAdultDogs']") as HTMLInputElement).checked,
				acceptsSeniorDogs: (document.querySelector("input[name='experienceSeniorDogs']") as HTMLInputElement).checked,

				acceptsSmallDogs: (document.querySelector("input[name='sizeSmallDogs']") as HTMLInputElement).checked,
				acceptsMediumDogs: (document.querySelector("input[name='sizeMediumDogs']") as HTMLInputElement).checked,
				acceptsLargeDogs: (document.querySelector("input[name='sizeLargeDogs']") as HTMLInputElement).checked,

			}; 

			try {
          closeModal();
        	createModal (`
					<section class="confirm-card">
						<div class="confirm-card-inner">
							<h2>Oppdaterer hundepasser profilen din...</h2>
							<img src="/images/paw-spinner.png" class="profile-spinner" alt="Loading spinner" draggable="false"/>
						</div>
					</section>
      		`);

			const updatedSitter = await updatePetSitterProfile(currentPetSitter.id, updated);

			currentPetSitter = updatedSitter;
			localStorage.setItem("currentPetSitter", JSON.stringify(updatedSitter));

			renderCurrentProfile();
			renderSittersList();

			currentView ="list";
			updateView();
			
      setTimeout(() =>{
        closeModal();
        createModal(`
          
          <section class="confirm-card" aria-labelledby="succsessUpdate">
            <div class="confirm-card-inner">
              <h3 id="succsessUpdate" class="confirm-title">
                Registreringen din er oppdadert.
              </h3>

              <div class="confirm-icon" aria-hidden="true">
                <img src="/images/check.png" alt="" />
              </div>

              <div class="confirm-actions">
                <button class="btn btn-success" type="button" id="close-modal" aria-label="gå tilbake">GÅ TILBAKE</button>
              </div>
            </div>
          </section>
        `);
        },1500);
			} catch (error){
				console.error(error);
			}

		break;
		}

		case "cancel-edit-sitter":{
			currentView="list";
			updateView();
			closeModal();
			break;
		}
		
		case "close-modal":{ 
			
			closeModal();
			break;
			
		}
		case "finish-registration":{
			closeModal();
			break;

		}
		case "cancel-registration":{
			currentView= "list";
			updateView();
			closeModal();
			break;
		}
		default: 
		break;

		}
						
});

function getSitterFormData (formElement: HTMLFormElement){
	const formData = new FormData(formElement);

	return {
		experienceDescription: String (formData.get("experienceDescription") || ""),
		yearsOfExperience: Number (formData.get("yearsOfexperience") ||0),
		pricePerDay:Number (formData.get("pricePerDay") ||0),
		maxDogs:Number (formData.get("maxDogs") ||0),
		
		acceptsPuppies: formData.get("experiencePuppies") === "on",
		acceptsAdultDogs: formData.get("experienceAdultDogs") === "on",
		acceptsSeniorDogs: formData.get("experienceSeniorDogs") === "on",
		
		acceptsSmallDogs: formData.get("sizeSmallDogs") === "on",
		acceptsMediumDogs: formData.get("sizeMediumDogs") === "on",
		acceptsLargeDogs: formData.get("sizeLargeDogs") === "on",
	}
};	


async function confirmRegistration() { 
	
		const users = await getAllUsers();
		const user = await getCurrentUser();
		
		
		if (!user) throw new Error ("finner ikke bruker");

		const formSection = document.getElementById("becomeSitterForm") as HTMLFormElement;
		const formData = getSitterFormData(formSection);

		console.log("user", users);
		
		const newSitter = await createPetSitter(user, formData);

			currentPetSitter = newSitter;
			allSitters.push(newSitter);
			
			localStorage.setItem(
				"currentPetSitter",
				JSON.stringify(newSitter)
			);
		
		renderCurrentProfile();

		currentView ="list";
		updateView();
	
		renderSittersList();
}

document.addEventListener("DOMContentLoaded", async () =>{
	const openBtn = document.getElementById("openBecomeASitterForm") as HTMLButtonElement | null;
	const closeBtn = document.getElementById("cancel-become-form") as HTMLButtonElement | null;
	const currentTab = document.querySelector(`.sitters-panel[data-tab="1"]`) as HTMLElement;
	const previousTab = document.querySelector(`.sitters-panel[data-tab="2"]`) as HTMLElement;
	const firstTabButton = document.querySelector(`.sitters-tab[data-for-tab="1"]`) as HTMLElement;
	const sittersContainer = document.querySelector(".sitters-shell") as HTMLElement;
		
		if (!openBtn || !closeBtn || !form  ) return;

		const [sitters, reviews, users] = await Promise.all([
		getAllPetSitters(),
		getAllReviews(),
		getAllUsers()
	]);

	openBtn.addEventListener("click", () =>{

		if (currentPetSitter) {
		alert ("tullebukk! Du har jo allerede en hundepasser profil! :)");
		return;
		}
	currentView ="form";
	updateView();

	});

	closeBtn.addEventListener("click", () =>{
		currentView ="list";
		updateView();
		
	});

	currentPetSitter = loadCurrentPetSitter();

	formSection = document.getElementById("becomeSitterForm") as HTMLFormElement;
	formShell = document.querySelector(".become-shell") as HTMLElement;
	mainContent = document.getElementById("mainContent") as HTMLElement;
	profileSection = document.querySelector(".my-sitter") as HTMLElement;
	editProfileSection = document.querySelector(".edit-my-sitter-profile") as HTMLFormElement;

	
	if ( !currentTab || !previousTab || !firstTabButton || !sittersContainer || !mainContent || !formSection || !formShell ) return;

	updateView();
	profileSection.hidden = true;

	allSitters = sitters;
	allReviews= reviews;
	allUsers = users;
	
	renderCurrentProfile();	
	sitterTabs();
	initSitters(sittersContainer);

	currentTab.innerHTML = renderSitters(sitters, reviews, users);
	previousTab.innerHTML = renderSitters([...sitters].reverse(), reviews, users);

	currentTab.classList.add("sitters-panel--is-active");
	firstTabButton.classList.add("sitters-tab--is-active");
	
	locationInput = document.getElementById("searchByLocation") as HTMLInputElement;
	priceMinInput = document.getElementById("priceMin") as HTMLInputElement;
	priceMaxInput = document.getElementById("priceMax") as HTMLInputElement;
	dateFromInput = document.getElementById("dateFrom") as HTMLInputElement;
	dateToInput = document.getElementById("dateTo") as HTMLInputElement;

	locationInput.addEventListener("input", renderSittersList);
	priceMinInput.addEventListener("input", renderSittersList);
	priceMaxInput.addEventListener("input", renderSittersList);
	dateFromInput.addEventListener("input", renderSittersList);
	dateToInput.addEventListener("input", renderSittersList);
	
});