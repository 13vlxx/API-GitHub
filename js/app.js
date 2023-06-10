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
  console.log(`Récupération du profil GitHub de ${search.value} depuis : "${profile}"`);

  fetch(profile)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Profil GitHub non trouvé");
      }
      return response.json();
    })
    .then((data) => {
      user = data.login;
      console.table(data);
      const template = `
      <section id="result">
         <div class="userInfo">
          <img id="profile-picture" alt="profile picture" src="${data.avatar_url}"></img>
          <div class="pseudoInfo">
            <span class="githubName">${data.name}</span>
            <span class="githubUsername">${data.login}</span>
            </div>
            <a class="profileLink" href="${data.html_url}" target="_blank"><button class="githubLinkButton">Voir profil</button></a>
         </div>
          <span class="githubLocation">${data.location}</span>
          <a href="${data.blog}" class="pinnedLink">Lien épinglé</a>
          <span class="publicRepos">Nombre de repos publics : ${data.public_repos}</span>
          <span>Abonnés : ${data.followers}</span>
          <span>Abonnements : ${data.following}</span>
      </section>
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
                <a class="repoName" href="${repo.html_url}" target="_blank">${repo.name}</a>
              </div>
            `;
            output.innerHTML += template;
          });
        });

      //* Stockage du dernier utilisateur recherché dans le localStorage
      localStorage.setItem("lastUser", search.value);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération du profil :", error);
      output.innerHTML = "<div id='error-message'>Profil GitHub non trouvé</div>";
    });
});

//* Recherche automatique du dernier utilisateur recherché au chargement de la page
window.addEventListener("load", () => {
  const lastUser = localStorage.getItem("lastUser");
  if (lastUser) {
    search.value = lastUser;
    submit.click();
  }
});

//* Vérifier si c'est la première visite en utilisant le localStorage
const isFirstVisit = localStorage.getItem("isFirstVisit");

if (!isFirstVisit) {
  //* Afficher l'alerte lors de la première visite
  window.alert("Site en cours de développement");

  //* Enregistrer l'indicateur de première visite dans le localStorage
  localStorage.setItem("isFirstVisit", "true");
}
