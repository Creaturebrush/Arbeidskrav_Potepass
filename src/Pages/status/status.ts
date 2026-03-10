const tabs = document.querySelectorAll<HTMLAnchorElement>(".status-tab");
const panels = document.querySelectorAll<HTMLElement>(".status-panel");

const toolsBookings = document.querySelector<HTMLElement>(".status-tools--bookings");
const toolsRequests = document.querySelector<HTMLElement>(".status-tools--requests");

function setActive(tabName: string) {
  tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === tabName));
  panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tabName));

  // Toggle correct toolbar
  if (toolsBookings && toolsRequests) {
    const showRequests = tabName === "requests";
    toolsBookings.style.display = showRequests ? "none" : "flex";
    toolsRequests.style.display = showRequests ? "flex" : "none";
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    setActive(tab.dataset.tab || "bookings");
  });
});

// default
setActive("bookings");