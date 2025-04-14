document.addEventListener("DOMContentLoaded", () => {
  const menuContent = document.getElementById("menu-content");
  const subNav = document.getElementById("sub-nav");
  const navButtons = document.querySelectorAll(".nav-btn");
  const loader = document.getElementById("loader");

  const menuURL = "https://script.google.com/macros/s/AKfycbymjjR9WKi-1MtduV_RVH0Yx6xWA0jRfBIjRNcY--diwwn9mU2UOP6x1KDilN6YpWfG/exec";

  let menuData = {};

  loader.style.display = "flex";
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
    loader.style.display = "none";

  })
    
  .catch(err => {
    console.error("Errore nel caricamento del menu:", err);
    loader.style.display = "none"; // ✅ dentro il catch
  });
  
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
      subNav.style.display = "none";
      return;
    }
  
    if (!data.sottosezioni || data.sottosezioni.length === 0 || data.sottosezioni.includes("Senza sezione")) {
      subNav.style.display = "none";
      renderMenuFlat(cat);
      return;
    }
  
    subNav.style.display = "flex";
  
    // 🔹 Aggiungi bottone "Tutte"
    const allBtn = document.createElement("button");
    allBtn.textContent = "Tutte";
    allBtn.dataset.sub = "all";
    allBtn.classList.add("active");
    allBtn.onclick = () => renderMenuFlat(cat);
    subNav.appendChild(allBtn);
  
    // 🔸 Aggiungi le sottosezioni reali
    data.sottosezioni.forEach(sub => {
      const btn = document.createElement("button");
      btn.textContent = sub;
      btn.dataset.sub = sub;
      btn.onclick = () => {
        // Rimuove active da tutti i bottoni e lo mette solo su quello cliccato
        subNav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(cat, sub);
      };
      subNav.appendChild(btn);
    });
  
    renderMenuFlat(cat); // Mostra tutto all'inizio
  }  
  

  function renderMenuFlat(cat) {
    const data = menuData[cat];
    if (!data) return;
  
    let html = "";
  
    data.sottosezioni.forEach(sub => {
      const items = data.piatti[sub];
      if (items?.length) {
        html += `
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
    });
  
    menuContent.innerHTML = html || "<p class='text-center'>Nessun elemento disponibile.</p>";
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
