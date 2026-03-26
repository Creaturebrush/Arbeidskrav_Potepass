// MODALS

const modal = document.querySelector(".modal-wrapper") as HTMLTemplateElement;

function open() {
    modal.classList.add("open");
    
    modal.innerHTML = `
    <div class="profile-modal">
          <h2>Er du sikker på at du ønsker å slette profilen din?</h2>
          <div class="btn-container">
            <button class="btn btn-success" id="close-btn">NEI, GÅ TILBAKE</button>
            <button class="btn btn-danger">JA, SLETT PROFIL</button>
          </div>
        </div>
    `;

    const closeBtn = document.getElementById("close-btn") as HTMLButtonElement;
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
});
};

const deleteProfileBtn = document.getElementById("delete-profile-btn") as HTMLButtonElement;
deleteProfileBtn.addEventListener("click", open);