const search = document.querySelector("#search-bar");
const submit = document.querySelector("#submit-btn");
const output = document.querySelector("#output");
let user;

submit.addEventListener("click", () => {
  if (!search.value) {
    alert("Veuillez bien renseigner l'utilisateur");
    console.error("Error");
    return;
  }
  output.classList.add("isUser");

  const profile = `https://api.github.com/users/${search.value}`;
  fetch(profile)
    .then((response) => response.json())
    .then((data) => {
      user = data.login;
      console.table(data);
      const template = `
        <div id="result">
            <img id="profile-picture" alt="profile picture" src="${data.avatar_url}"></img>
            <span>${data.name}</span>
            <span>${data.login}</span>
            <a href="${data.html_url}" target="_blank">Profile</a>
            <span>${data.blog}</span>
            <span>${data.location}</span>
            <span>Nombre de repos publics : ${data.public_repos}</span>
            <span>${data.followers}</span>
            <span>${data.following}</span>
        </div>
      `;
      output.innerHTML = template;

      const repos = `https://api.github.com/users/${user}/repos`;
      fetch(repos)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const h1 = "<h1>Liste des repos</h1>";
          output.innerHTML += h1;
          data.forEach((repo) => {
            const template = `
            <div id="repos">
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </div>
            `;
            output.innerHTML += template;
          });
        });
    });
});
