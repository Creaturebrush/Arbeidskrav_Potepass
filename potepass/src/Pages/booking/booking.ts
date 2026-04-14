import { type User } from "../../types/user.type";
import { getAllUsers } from "../../requests/users-api";

async function getUsers() {
  const users: User[] = await getAllUsers();

  //Sender videre variabelen users.
  showUserName(users);
}

getUsers();

//Variabelen users hentes fra funksjonen getUsers slik at den kan brukes i funksjonen under.
function showUserName(users: User[]) {
  const dogSitterName = document.querySelector(
    ".dog-sitter-name",
  ) as HTMLHeadingElement;
  dogSitterName.innerHTML = users[0].userName;
}
