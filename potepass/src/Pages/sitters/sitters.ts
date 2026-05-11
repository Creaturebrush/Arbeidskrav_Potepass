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


let currentPetSitter: PetSitters | null=null;

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
let formSection: HTMLFormElement;
let profileSection: HTMLElement;
let editProfileSection: HTMLFormElement;

let sittersModal: HTMLDivElement | null = null;


function getFilteredSitters(){
	const locationValue = locationInput.value.toLowerCase();
	const minPrice = Number(priceMinInput.value) ||0;
	const maxPrice = Number(priceMaxInput.value) || 1500;
	const dateFrom = dateFromInput.value;
	const dateTo = dateToInput.value;

	return allSitters.filter((sitter) =>{
		const filterLocation = !locationValue || sitter.location.toLowerCase().includes(locationValue);
		const filterPrice = sitter.pricePerDay >= minPrice && sitter.pricePerDay <= maxPrice;
		
	
		let sitterAvailability = true;
		if (dateFrom && dateTo){
		/** 	sitterAvailability = sitter.available <= dateFrom && sitter.available >= dateTo;*/
		}

		return (
			filterLocation && filterPrice && sitterAvailability
		);
 });
}

function renderDogExperience(sitter: PetSitters){
	const experience = [];

	if (sitter.acceptsPuppies){
		experience.push("valper");
	}
	if (sitter.acceptsAdultDogs){
		experience.push("voksne hunder");
	}
	if (sitter.acceptsSeniorDogs){
		experience.push("senior hunder");
	}
	return experience 
		.map(item => `<span class="sitter-tag">${item}</span>`).join("");
}

function renderDogSizes(sitter: PetSitters){
	const sizes = [];

	if (sitter.acceptsSmallDogs){
		sizes.push("små")
	}
	if (sitter.acceptsMediumDogs){
		sizes.push("mellomstore")
	}
	if (sitter.acceptsLargeDogs){
		sizes.push("store")
	}
	return sizes 
		.map(item => `<span class="sitter-tag">${item}</span>`).join("");
}

function loadCurrentPetSitter(){
//	const savedSitter = localStorage.getItem("currentPetSitter");
	
	if (!savedSitter) return null;

	try {
		return JSON.parse(savedSitter);
	} catch { 
		localStorage.removeItem("currentPetSitter");
		return null;
	}
}

function getCheckBoxValue (name: string): boolean{
	const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
	
	return input?.checked ?? false;
}

function renderSittersList(){
	const filteredSitters = getFilteredSitters();
	const currentTab = document.querySelector(`.sitters-panel[data-tab="1"]`) as HTMLElement;
	if (!currentTab) return;

	currentTab.innerHTML = renderSitters(filteredSitters, allReviews, allUsers);

}


//Render

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
		<article class="reviews">
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
														<span class="sitter-tags"></span>
													</div>
													<div class="sitter-info-row">
														<span class="sitter-info-label">Passer:</span>
														<span class="sitter-tags"> </span>
													</div>
													<div class="sitter-info-row">
														<span class="sitter-info-label">Pris;</span>
														<span>${sitter.pricePerDay} ,-/pr dag </span>
													</div>
												</div>
					
											</div>
										</div>


										<div class="sitter-detail-bottom">
											<div class="sitter-detail-rating">
												<span class="stars stars--rated" aria-label="vurdering 4 av 5">${sitter.reviewCount}★★★★☆</span>
												<button class="sitter-reviews-toggle" type="button" >
												<span class="sitters-review-count"> omtaler</span>
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
	return `
		<h4 class="my-sitter-title" id="">Din hundepasserprofil</h4>
			<article class="sitter-card my-sitter-card">
				<div class="my-sitter-detail">
					<div class="sitter-detail-top">
						<div class="sitter-photo">
							<img src="/images/hero.jpg" alt="Profilbilde av deg som hundepasser" />
						</div>

						<div class="sitter-detail-content">
							<div class="sitter-detail-head">
								<h3 class="sitter-detail-name">${sitter.name}</h3>
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
												<span class="sitter-tags">  </span>
											</div>
											<div class="sitter-info-row">
												<span class="sitter-info-label">Passer:</span>
												<span class="sitter-tags">  </span>
											</div>
											<div class="sitter-info-row">
												<span class="sitter-info-label">Pris;</span>
												<span>${sitter.pricePerDay} ,-/pr dag </span>
											</div>
										</div>
			
									</div>
								</div>
							</div>

							<!-- bottom row -->
							<div class="my-sitter-bottom">
								<div class="my-sitter-bottom-left">
									<div class="sitter-rating" aria-label="Vurdering 4.6 av 5">
										<span class="stars stars--rated">★★★★☆</span>
										<span class="my-sitter-reviews">(12 omtaler)</span>
									</div>
								</div>

								<div class="my-sitter-actions">
									<button class="btn btn-warning status-btn update-sitter-profile" type="button">
										REDIGER
									</button>
									<button class="btn btn-danger status-btn delete-registration" type="button">
										SLETT
									</button>
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
	formSection.hidden = currentView !== "form";
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

		//chevron
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

  // fiks dette
document.addEventListener("click", async (e) =>{	
	const target = e.target as HTMLButtonElement;
	if(!target) return;

	const deleteBtn = target.closest(".delete-registration");
	const confirmDeleteBtn = target.closest(".confirm-delete");
	const closeModaBtn = target.closest(".close-modal");
	const editBtn = target.closest(".edit-my-sitter-profile");
	const confirmEdit = target.closest(".confirm-edit")

	switch (target.id) {
		case "register-as-petSitter":{
			createModal(`
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
			`) ;
		break;
	}
		
		case "confirm-registration": {
			closeModal();
			formSection.requestSubmit();
		break;
	}

		case "close-modal":
		case "finish-registration":
		case "cancel-registration":
			closeModal();
		}

	if (deleteBtn){
		createModal (`
			 <section class="confirm-card" aria-labelledby="">
          <div class="confirm-card-inner">
            <h3 class="confirm-title" id="">
              Er du sikker på at du vil fjerne registreringen din som hundpasser?
            </h3>
 
            <div class="confirm-icon" aria-hidden="true">
              <img src="/images/delete-button.png" alt="" />
            </div>
 
            <div class="confirm-actions">
              <button class="btn btn-success confirm-delete" type="button">JA, SLETT REGISTRERING</button>
              <button class="btn btn-danger close-modal"  type="button">NEI, GÅ TILBAKE</button>
            </div>
          </div>
        </section>
			`);
			return;
	}

	if (confirmDeleteBtn) {
		if (!currentPetSitter) return;
 
		try {
				await deletePetSitter(currentPetSitter.id);

				allSitters = allSitters.filter(
					(sitter)=> sitter.id !== currentPetSitter!.id
				);
				
				currentPetSitter = null;
				localStorage.removeItem("currentPetSitter");

				renderCurrentProfile();
				renderSittersList();
		
				closeModal();
				
				createModal (`
				<section class="confirm-card" aria-labelledby="">
					<div class="confirm-card-inner">
						<h3 id="" class="confirm-title">
							Registreringen din som hundepasser er slettet.
						</h3>

						<div class="confirm-icon" aria-hidden="true">
							<img src="/images/check.png" alt="" />
						</div>

						<div class="confirm-actions">
							<button class="btn btn-success close-modal" type="button">GÅ TILBAKE</button>
						</div>
					</div>
				</section>`);

			} catch (error) {
					console.error(error);
					alert("noe er galt")
					return;
			}
			return; 
	}


	if (editBtn){
		const dynamicContent =`
			<section class="confirm-card" aria-labelledby="">
				<div class="confirm-card-inner">
					<h3 id="" class="confirm-title">
						Er du sikker på at du vil oppdatere profilen din?
					</h3>
					<div class="confirm-icon" aria-hidden="true">
						<img src="/images/delete-button.png" alt="" />
					</div>

					<div class="confirm-actions">
						<button class="btn btn-success confirm-edit" type="button">JA, OPPDATER</button>
						<button class="btn btn-danger" id="close-modal" type="button">NEI, GÅ TILBAKE</button>
					</div>
				</div>
			</section>
		`;

		createModal(dynamicContent);
		return;	

//fix this!
	
	}
 
  if (confirmEdit){
				if (!currentPetSitter) return;

				currentView = "edit";
				updateView();

				(document.getElementById("editExperienceDescription") as HTMLTextAreaElement).value = currentPetSitter.experienceDescription;
				(document.getElementById("edityearsOfExperience") as HTMLInputElement).value = String (currentPetSitter.yearsOfExperience);
				(document.getElementById("editPricePerDay") as HTMLInputElement).value = String (currentPetSitter.pricePerDay);
				(document.getElementById("editmaxDogs") as HTMLInputElement).value = String (currentPetSitter.maxDogs);

				return;
			}

});

async function getSitterFormData(){
	e.preventDefault();

	const form = e.target as HTMLFormElement; 


	const formData = {
		experienceDescription: String ((document.getElementById("experienceDescription") as HTMLTextAreaElement).value),
		yearsOfExperience: Number ((document.getElementById("yearsOfExperience") as HTMLInputElement).value),
		pricePerDay:Number ((document.getElementById("pricePerDay") as HTMLInputElement).value),
		maxDogs:Number ((document.getElementById("maxDogs") as HTMLInputElement).value),
		
		acceptsPuppies: (document.querySelector(`input[name="experiencePuppies"]`) as HTMLInputElement).checked,
		acceptsAdultDogs: (document.querySelector(`input[name="AdultDogs"]`) as HTMLInputElement).checked,
		acceptsSeniorDogs: (document.querySelector(`input[name="experienceSeniorDogs"]`) as HTMLInputElement).checked,
		
		acceptsSmallDogs: (document.querySelector(`input[name="experienceSmallDogs"]`) as HTMLInputElement).checked,
		acceptsMediumDogs: (document.querySelector(`input[name="experienceMediumDogs"]`) as HTMLInputElement).checked,
		acceptsLargeDogs: (document.querySelector(`input[name="experienceLargeDogs"]`) as HTMLInputElement).checked,
	};

	try {
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
		form.reset();

		createModal(`
			<section class="confirm-card" aria-labelledby="">
				<div class="confirm-card-inner">
					<h3 id="" class="confirm-title">
						Registreringen din er oppdadert.
					</h3>

					<div class="confirm-icon" aria-hidden="true">
						<img src="/images/check.png" alt="" />
					</div>

					<div class="confirm-actions">
						<button class="btn btn-success" type="button" id="close-modal">GÅ TILBAKE</button>
					</div>
				</div>
			</section>
		`);

		
	} catch (error) {
		console.error(error);
	}

 }

//DOM
document.addEventListener("DOMContentLoaded", async () =>{
	const openBtn = document.getElementById("openBecomeASitterForm") as HTMLButtonElement | null;
	const closeBtn = document.getElementById("cancel-become-form") as HTMLElement | null;
	const form = document.getElementById("becomeSitterForm") as HTMLFormElement | null;

	const currentTab = document.querySelector(`.sitters-panel[data-tab="1"]`) as HTMLElement;
	const previousTab = document.querySelector(`.sitters-panel[data-tab="2"]`) as HTMLElement;
	const firstTabButton = document.querySelector(`.sitters-tab[data-for-tab="1"]`) as HTMLElement;
	const sittersContainer = document.querySelector(".sitters-shell") as HTMLElement;
		
		//current User???? here??

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
	console.log("init sitter:", currentPetSitter);


	formSection = document.querySelector(".become-shell") as HTMLFormElement;
	mainContent = document.getElementById("mainContent") as HTMLElement;
	profileSection = document.querySelector(".my-sitter") as HTMLElement;
	editProfileSection = document.querySelector(".edit-my-sitter-profile") as HTMLFormElement;

	

	if ( !currentTab || !previousTab || !firstTabButton || !sittersContainer || !mainContent || !formSection ) return;

		
	
	updateView();
	profileSection.hidden = true;



	allSitters = sitters;
	allReviews= reviews;
	allUsers = users;

	
	
	renderCurrentProfile();	
	sitterTabs();
	initSitters(sittersContainer);

	currentTab.innerHTML = renderSitters(sitters, reviews, users);
	previousTab.innerHTML = renderSitters(sitters, reviews, users)

	currentTab.classList.add("sitters-panel--is-active");
	firstTabButton.classList.add("sitters-tab--is-active");


	
	locationInput = document.getElementById("searchByLocation") as HTMLInputElement;
	priceMinInput = document.getElementById("priceMin") as HTMLInputElement;
	priceMaxInput = document.getElementById("priceMax") as HTMLInputElement;
	dateFromInput = document.getElementById("dateFrom") as HTMLInputElement;
	dateToInput = document.getElementById("dateTo") as HTMLInputElement;

	formSection.addEventListener("submit", handleSubmit);

	locationInput.addEventListener("input", renderSittersList);
	priceMinInput.addEventListener("input", renderSittersList);
	priceMaxInput.addEventListener("input", renderSittersList);
	dateFromInput.addEventListener("input", renderSittersList);
	dateToInput.addEventListener("input", renderSittersList);

	formSection.addEventListener("submit", (e)=>{
		e.preventDefault();
		console.log("form works")
	
	})
 
});