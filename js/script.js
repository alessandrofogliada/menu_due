document.addEventListener("DOMContentLoaded", () => {
  const menuContent = document.getElementById("menu-content");
  const subNav = document.getElementById("sub-nav");
  const navButtons = document.querySelectorAll(".nav-btn");

  const menuURL = "https://script.google.com/macros/s/AKfycbymjjR9WKi-1MtduV_RVH0Yx6xWA0jRfBIjRNcY--diwwn9mU2UOP6x1KDilN6YpWfG/exec";

  let menuData = {};

  fetch(menuURL)
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const categoria = item.Categoria?.toLowerCase() || "generale";
      const sottosezione = item.Sottosezione || "Senza sezione";
      console.log("Dati ricevuti:", data); // 👈 AGGIUNGI QUESTO


      if (!menuData[categoria]) {
        menuData[categoria] = { sottosezioni: [], piatti: {} };
      }

      if (!menuData[categoria].sottosezioni.includes(sottosezione)) {
        menuData[categoria].sottosezioni.push(sottosezione);
        menuData[categoria].piatti[sottosezione] = [];
      }

      menuData[categoria].piatti[sottosezione].push({
        nome: item.Nome,
        descrizione: item.Descrizione,
        prezzo: item.Prezzo,
        allergeni: item.Allergeni
      });
    });

    renderSubNav("pizze");
  })
    
    .catch(err => console.error("Errore nel caricamento del menu:", err));

    function renderSubNav(cat) {
      subNav.innerHTML = "";
    
      const data = menuData[cat];
    
      if (!data) {
        menuContent.innerHTML = "<p class='text-center'>Nessun contenuto disponibile per questa categoria.</p>";
        return;
      }
    
      if (!data.sottosezioni || data.sottosezioni.length === 0) {
        // Non ci sono sottosezioni → stampa tutto direttamente
        renderMenuFlat(cat);
        return;
      }
    
      // Ci sono sottosezioni → crea bottoni e mostra la prima
      data.sottosezioni.forEach(sub => {
        const btn = document.createElement("button");
        btn.textContent = sub;
        btn.dataset.sub = sub;
        btn.onclick = () => renderMenu(cat, sub);
        subNav.appendChild(btn);
      });
    
      renderMenu(cat, data.sottosezioni[0]);
    }
    

  function renderMenu(cat, sub) {
    const items = menuData[cat]?.piatti[sub] || [];

    menuContent.innerHTML = `
      <div class="menu-section">
        <h2>${sub}</h2>
        ${items.map(item => `
          <div class="menu-item">
            <div class="title">${item.nome} <span class="price">${item.prezzo}</span></div>
            <div class="desc">${item.descrizione}</div>
            <div class="allergeni">Allergeni: ${item.allergeni}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderSubNav(cat) {
    subNav.innerHTML = "";
    const data = menuData[cat];
  
    if (!data) {
      menuContent.innerHTML = "<p class='text-center'>Nessun contenuto disponibile per questa categoria.</p>";
      subNav.style.display = "none"; // Nasconde la barra
      return;
    }
  
    if (!data.sottosezioni || data.sottosezioni.length === 0 || data.sottosezioni.includes("Senza sezione")) {
      subNav.style.display = "none"; // 🔹 Nasconde la barra delle sottocategorie
      renderMenuFlat(cat);          // 🔹 Stampa tutti i piatti della categoria
      return;
    }
  
    subNav.style.display = "flex"; // 🔸 Mostra la barra se ci sono sottosezioni
  
    data.sottosezioni.forEach(sub => {
      const btn = document.createElement("button");
      btn.textContent = sub;
      btn.dataset.sub = sub;
      btn.onclick = () => renderMenu(cat, sub);
      subNav.appendChild(btn);
    });
  
    renderMenu(cat, data.sottosezioni[0]);
  }
  

  function renderMenuFlat(cat) {
    const allItems = Object.values(menuData[cat]?.piatti || {}).flat();
  
    if (!allItems.length) {
      menuContent.innerHTML = "<p class='text-center'>Nessun elemento disponibile.</p>";
      return;
    }
  
    menuContent.innerHTML = `
      <div class="menu-section">
        ${allItems.map(item => `
          <div class="menu-item">
            <div class="title">${item.nome} <span class="price">${item.prezzo}</span></div>
            <div class="desc">${item.descrizione}</div>
            <div class="allergeni">Allergeni: ${item.allergeni}</div>
          </div>
        `).join("")}
      </div>
    `;
  }
  
  

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.cat;
      renderSubNav(cat);
    });
  });
});
