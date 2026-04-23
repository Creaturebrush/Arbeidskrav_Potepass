// tabs
const tabs = document.querySelectorAll<HTMLElement>(".sitters-tab")
const panels = document.querySelectorAll<HTMLElement>(".sitters-panel")

function setActive (tabName: string) {
    tabs.forEach ((t) => t.classList.toggle("is-active", t.dataset.tab === tabName));
    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tabName));
}
tabs.forEach((tab) => {
    tab.addEventListener("click",(e) =>{
        e.preventDefault();
        setActive(tab.dataset.tab || "current");
    });
});

setActive ("current");



//Become a pet sitter -BUTTON- TOGGLE FORM
const sittersCta = document.querySelector(".sitters-cta");



function toggleSitterForm (){
    sittersCta?.addEventListener("click",() => {
        window.location.href = "/potepass/src/Pages/sitters/become-a-sitter/become-a-sitter.html";
    });
}

//Petsitters list
//comments
//Your profile
//modals

//