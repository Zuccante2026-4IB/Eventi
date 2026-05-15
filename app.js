// API_BASE, TOKEN, HEADERS, escHtml, getCurrentUser, isOrganizzatore,
// stringDate sono forniti da api.js (incluso prima di questo script).

let arr = [];
const eventiPerPagina = 10;
let paginaCorrente = 0;
let totalePagine = 0;

async function lettura() {
    try {
        const res  = await fetch(`${API_BASE}/eventos?populate=*`, { headers: HEADERS });
        const dati = await res.json();
        arr = dati.data || [];
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
        card.addEventListener("click", () => mostraDettagli(evento));

        const dateHTML = (evento.date_time || [])
            .map(dt => `<span>${escHtml(stringDate(dt.st))} - ${escHtml(stringDate(dt.en))}</span>`)
            .join("");

        const luogoName = evento.luogo ? escHtml(evento.luogo.name) : "—";

        const tagsHTML = (evento.tags || [])
            .map(t => `<span class="tag">${escHtml(t)}</span>`)
            .join("");

        const targetsHTML = (evento.target || [])
            .map(t => `<span class="targets">${escHtml(t.fascia)}</span>`)
            .join("");

        const imgsHTML = (evento.imgs || [])
            .map(img => {
                const url = img.url || img.src || "";
                const alt = img.alternativeText || img.alt || "";
                if (!url) return "";
                return `<img src="${escHtml(url)}" alt="${escHtml(alt)}" loading="lazy" onerror="this.style.display='none'" />`;
            })
            .join("");

        const stars = evento.rank ? escHtml(evento.rank.stars) : "—";

        card.innerHTML = `
            <div class="evento-nome">${escHtml(evento.nome)}</div>
            <div class="evento-info">
                ${dateHTML}
                <span>${luogoName}</span>
            </div>
            <div class="evento-desc">${escHtml(evento.desc)}</div>
            <div class="evento-tags">${tagsHTML}</div>
            <div class="evento-targets">${targetsHTML}</div>
            <div class="evento-img">${imgsHTML}</div>
            <div class="evento-rank">Valutazione: ${stars}/5</div>
        `;

        const user = getCurrentUser();
        if (isOrganizzatore() && user && String(evento.org_id) === String(user.id)) {
            const admin = document.createElement("div");
            admin.className = "evento-admin";
            const btn = document.createElement("button");
            btn.className = "btn-elimina";
            btn.textContent = "🗑️ Elimina";
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminaEvento(evento.documentId, evento.nome);
            });
            admin.appendChild(btn);
            card.appendChild(admin);
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

        if (res.ok) {
            arr = arr.filter(e => e.documentId !== documentId);
            totalePagine = Math.ceil(arr.length / eventiPerPagina);
            if (paginaCorrente >= totalePagine && paginaCorrente > 0) paginaCorrente--;
            mostra_pagina(paginaCorrente);
        } else {
            alert("Errore durante l'eliminazione.");
        }
    } catch (err) {
        console.error(err);
        alert("Errore di rete.");
    }
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