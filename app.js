const API_BASE = 'https://strapi.brusegan.it/api';
const TOKEN = 'Bearer cff92e74316f57f7cd63ce9f93cf8fb309f0f15f673ed41d81afe4f1569a81f88d6b1b4268a94f97e5eb52802a1e1b49ac6702c060f1b96d1d02fa3103f84df65445e2307cd5f15b3ccb141fc91147470465304d44d6f53784989b971c4468aa6932c0b9dc3ed37da4a33e2cd58fcb9fdb87863ead235adca7c87513f47f6e1c';
const HEADERS = {
    'Authorization': TOKEN,
    'Content-Type': 'application/json'
};

let arr = [];
const eventiPerPagina = 10;
let paginaCorrente = 0;
let totalePagine = 0;

function isOrganizzatore() {
    const u = JSON.parse(localStorage.getItem("utenteLoggato"));
    return u && u.ruolo === "organizzatore";
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("utenteLoggato"));
}

async function lettura() {
    try {
        const res  = await fetch(`${API_BASE}/eventos?populate=*`, { headers: HEADERS });
        const dati = await res.json();
        arr = dati.data;

        // AGGIUNGI QUESTA RIGA TEMPORANEA:
        console.log("Primo evento:", JSON.stringify(arr[0], null, 2));

        totalePagine = Math.ceil(arr.length / eventiPerPagina);
        mostra_pagina(0);
    } catch (error) {
        document.getElementById("eventi").innerHTML = "Errore nel caricamento dei dati.";
        console.error(error);
    }
}

function mostra_pagina(n) {
    paginaCorrente = n;

    const inizio = n * eventiPerPagina;
    const fine   = inizio + eventiPerPagina;

    const div_eventi = document.getElementById("eventi");
    div_eventi.innerHTML = "";

    arr.slice(inizio, fine).forEach(evento => {
        const card = document.createElement("div");
        card.className = "evento-card";
        card.style.cursor = "pointer";
        card.onclick = () => mostraDettagli(evento);

        card.innerHTML = `
            <div class="evento-nome">${evento.nome}</div>
            <div class="evento-info">
        `;

        evento.date_time.forEach(dt => {
            card.innerHTML += `
                <span>${stringDate(dt.st)} - ${stringDate(dt.en)}</span>
            `;
        });

        card.innerHTML += `
                <span>${evento.luogo.name}</span>
            </div>
            <div class="evento-desc">${evento.desc}</div>
        `;

        let tagsHTML = "";
        if (evento.tags) {
            evento.tags.forEach(t => {
                tagsHTML += `<span class="tag">${t}</span>`;
            });
        }
        card.innerHTML += `<div class="evento-tags">${tagsHTML}</div>`;

        let targetsHTML = "";
        if (evento.target) {
            evento.target.forEach(t => {
                targetsHTML += `<span class="targets">${t.fascia}</span>`;
            });
        }
        card.innerHTML += `<div class="evento-targets">${targetsHTML}</div>`;

        let imgsHTML = "";
        if (evento.imgs) {
            evento.imgs.forEach(img => {
                const url = img.url || img.src || "";
                const alt = img.alternativeText || img.alt || "";
                imgsHTML += `<img src="${url}" alt="${alt}" />`;
            });
        }
        card.innerHTML += `<div class="evento-img">${imgsHTML}</div>`;

        let stars = "—";
        if (evento.rank) {
            stars = evento.rank.stars;
        }
        card.innerHTML += `<div class="evento-rank">Valutazione: ${stars}/5</div>`;

        if (isOrganizzatore() && String(evento.org_id) === String(getCurrentUser().id)) {
            card.innerHTML += `
                <div class="evento-admin">
                    <button class="btn-elimina" onclick="eliminaEvento('${evento.documentId}', '${evento.nome.replace(/'/g, "\\'")}')">🗑️ Elimina</button>
                </div>
            `;
        }

        div_eventi.appendChild(card);
    });

    aggiorna_paginazione();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostraDettagli(evento) {
    window.location.href = `evento.html?id=${evento.documentId}`;
}

function aggiorna_paginazione() {
    const nav = document.getElementById("paginazione");
    nav.innerHTML = "";

    if (totalePagine <= 1) return;

    const prev = document.createElement("button");
    prev.textContent = "← Precedente";
    prev.className = "pagina-btn pagina-testo";
    prev.disabled = paginaCorrente === 0;
    prev.addEventListener("click", () => mostra_pagina(paginaCorrente - 1));
    nav.appendChild(prev);

    for (let i = 0; i < totalePagine; i++) {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.className = "pagina-btn" + (i === paginaCorrente ? " pagina-attiva" : "");
        btn.addEventListener("click", () => mostra_pagina(i));
        nav.appendChild(btn);
    }

    const next = document.createElement("button");
    next.textContent = "Successivo →";
    next.className = "pagina-btn pagina-testo";
    next.disabled = paginaCorrente === totalePagine - 1;
    next.addEventListener("click", () => mostra_pagina(paginaCorrente + 1));
    nav.appendChild(next);
}

async function eliminaEvento(documentId, nome) {
    console.log("Provo ad eliminare", documentId, nome);

    if (!confirm(`Sei sicuro di voler eliminare "${nome}"?`)) return;

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.ruolo !== "organizzatore") {
        alert("Non hai il permesso di eliminare questo evento.");
        return;
    }

    const evento = arr.find(e => e.documentId === documentId);
    if (!evento || String(evento.org_id) !== String(currentUser.id)) {
        alert("Non hai il permesso di eliminare questo evento.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/eventos/${documentId}`, {
            method: 'DELETE',
            headers: HEADERS
        });
        console.log("res:", res);

        if (res.ok) {
            arr = arr.filter(e => e.documentId !== documentId);
            totalePagine = Math.ceil(arr.length / eventiPerPagina);
            if (paginaCorrente >= totalePagine && paginaCorrente > 0) paginaCorrente--;
            mostra_pagina(paginaCorrente);
            console.log("eliminato con successo");
        } else {
            alert("Errore durante l'eliminazione.");
        }
    } catch (err) {
        console.error(err);
        alert("Errore di rete.");
    }
}

// Gestisce sia il formato custom API "YYYYMMDDThh:mm:ssUTC+TZ"
// sia oggetti Date standard
function stringDate(when) {
    let dd, mm, yyyy, hh, min;

    if (typeof when === "string") {
        // Formato custom: "20260501T20:00:00UTC+02"
        const m = when.match(/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2})/);
        if (!m) return "—";
        yyyy = m[1]; mm = m[2]; dd = m[3]; hh = m[4]; min = m[5];
    } else if (when instanceof Date && !isNaN(when)) {
        dd   = String(when.getDate()).padStart(2, "0");
        mm   = String(when.getMonth() + 1).padStart(2, "0");
        yyyy = when.getFullYear();
        hh   = String(when.getHours()).padStart(2, "0");
        min  = String(when.getMinutes()).padStart(2, "0");
    } else {
        return "—";
    }

    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

document.addEventListener("DOMContentLoaded", () => {
    // Mostra il bottone "+ Aggiungi evento" solo agli organizzatori
    if (isOrganizzatore()) {
        const main = document.querySelector("main");
        const btn  = document.createElement("a");
        btn.href        = "gestione.html";
        btn.className   = "btn-aggiungi";
        btn.textContent = "+ Aggiungi evento";
        main.insertBefore(btn, main.firstChild);
    }

    lettura();
});