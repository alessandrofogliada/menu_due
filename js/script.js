document.addEventListener("DOMContentLoaded", () => {
  const menuContent = document.getElementById("menu-content");
  const subNav = document.getElementById("sub-nav");
  const navButtons = document.querySelectorAll(".nav-btn");
  const loader = document.getElementById("loader");

  const menuURL = "https://script.google.com/macros/s/AKfycbw9vtMnB4nj-TgsCmKHGkk6tzJiefLrgIeawXfVOfAiGkk6n9krfmkudXAV5OpZxbcr/exec";

  let menuData = {};

  loader.style.display = "flex";

  fetch(menuURL)
  .then(res => res.json())
  .then(data => {
    for (const categoria in data) {
      const items = data[categoria];
      const catKey = categoria.toLowerCase();

      if (!menuData[catKey]) {
        menuData[catKey] = { sottosezioni: [], piatti: {} };
      }

      items.forEach(item => {
        const sottosezione = item.Sottosezione?.trim() || "Senza sezione";

        if (!menuData[catKey].sottosezioni.includes(sottosezione)) {
          menuData[catKey].sottosezioni.push(sottosezione);
          menuData[catKey].piatti[sottosezione] = [];
        }

        menuData[catKey].piatti[sottosezione].push({
          nome: item.Nome,
          descrizione: item.Descrizione,
          prezzo: item.Prezzo,
          allergeni: item.Allergeni,
          "Prezzo Piccola": item["Prezzo Piccola"],
          "Prezzo Media": item["Prezzo Media"],
          "Prezzo Caraffa": item["Prezzo Caraffa"],
          "Prezzo Calice": item["Prezzo Calice"],
          "Prezzo Bott. 0,375": item["Prezzo Bott. 0,375"],
          "Prezzo Bott. 0,75": item["Prezzo Bott. 0,75"]
        });
      });
    }

    renderSubNav("pizze");
    loader.style.display = "none";
  })
  .catch(err => {
    console.error("Errore nel caricamento del menu:", err);
    loader.style.display = "none";
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
        btn.onclick = () => {
          // Rimuove 'active' da tutti
          subNav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
          // Aggiunge 'active' solo al cliccato
          btn.classList.add("active");
        
          renderMenu(cat, sub);
        };
                subNav.appendChild(btn);
      });
    
      renderMenu(cat, data.sottosezioni[0]);
    }
    

    function renderMenu(cat, sub) {
      const items = menuData[cat]?.piatti[sub] || [];
    
      menuContent.innerHTML = `
        <div class="menu-section">
          <h2>${sub}</h2>
          ${items.map(item => {
            const isBirra = cat === "birre";
            const isVino = cat === "vini";
    
            let prezzoExtra = "";
    
            if (isBirra) {
              prezzoExtra = `
                <div class="prezzi-formati">
                  ${item["Prezzo Piccola"] ? `<div>Piccola: €${item["Prezzo Piccola"]}</div>` : ""}
                  ${item["Prezzo Media"] ? `<div>Media: €${item["Prezzo Media"]}</div>` : ""}
                  ${item["Prezzo Caraffa"] ? `<div>Caraffa: €${item["Prezzo Caraffa"]}</div>` : ""}
                </div>
              `;
            } else if (isVino) {
              prezzoExtra = `
                <div class="prezzi-formati">
                  ${item["Prezzo Calice"] ? `<div>Calice: €${item["Prezzo Calice"]}</div>` : ""}
                  ${item["Prezzo Bott. 0,375"] ? `<div>0,375L: €${item["Prezzo Bott. 0,375"]}</div>` : ""}
                  ${item["Prezzo Bott. 0,75"] ? `<div>0,75L: €${item["Prezzo Bott. 0,75"]}</div>` : ""}
                </div>
              `;
            }
    
            return `
              <div class="menu-item">
                <div class="title">${item.nome}</div>
                <div class="desc">${item.descrizione || ""}</div>
                ${prezzoExtra || `<div class="price">€${item.prezzo}</div>`}
                <div class="allergeni">Allergeni: ${item.allergeni || "-"}</div>
              </div>
            `;
          }).join("")}
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
            ${sub !== "Senza sezione" ? `<h2>${sub}</h2>` : ""}
            ${items.map(item => {
              const isBirra = cat === "birre";
              const isVino = cat === "vini";
  
              let prezzoExtra = "";
  
              if (isBirra) {
                prezzoExtra = `
                  <div class="prezzi-formati">
                    ${item["Prezzo Piccola"] ? `<div>Piccola: €${item["Prezzo Piccola"]}</div>` : ""}
                    ${item["Prezzo Media"] ? `<div>Media: €${item["Prezzo Media"]}</div>` : ""}
                    ${item["Prezzo Caraffa"] ? `<div>Caraffa: €${item["Prezzo Caraffa"]}</div>` : ""}
                  </div>
                `;
              } else if (isVino) {
                prezzoExtra = `
                  <div class="prezzi-formati">
                    ${item["Prezzo Calice"] ? `<div>Calice: €${item["Prezzo Calice"]}</div>` : ""}
                    ${item["Prezzo Bott. 0,375"] ? `<div>0,375L: €${item["Prezzo Bott. 0,375"]}</div>` : ""}
                    ${item["Prezzo Bott. 0,75"] ? `<div>0,75L: €${item["Prezzo Bott. 0,75"]}</div>` : ""}
                  </div>
                `;
              }
  
              return `
                <div class="menu-item">
                  <div class="title">${item.nome}</div>
                  <div class="desc">${item.descrizione || ""}</div>
                  ${prezzoExtra || `<div class="price">€${item.prezzo}</div>`}
                  <div class="allergeni">Allergeni: ${item.allergeni || "-"}</div>
                </div>
              `;
            }).join("")}
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
