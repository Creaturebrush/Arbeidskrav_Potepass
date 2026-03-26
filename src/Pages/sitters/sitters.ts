// Tabs
const tabs = document.querySelectorAll<HTMLAnchorElement>(".sitters-tab");
const panels = document.querySelectorAll<HTMLElement>(".sitters-panel");
 
function setActive(tabName: string) {
  tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === tabName));
  panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tabName));
}
 
tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    setActive(tab.dataset.tab || "current");
  });
});
