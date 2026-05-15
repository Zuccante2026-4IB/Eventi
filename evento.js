const API_BASE = 'https://strapi.brusegan.it/api';
const TOKEN = 'Bearer cff92e74316f57f7cd63ce9f93cf8fb309f0f15f673ed41d81afe4f1569a81f88d6b1b4268a94f97e5eb52802a1e1b49ac6702c060f1b96d1d02fa3103f84df65445e2307cd5f15b3ccb141fc91147470465304d44d6f53784989b971c4468aa6932c0b9dc3ed37da4a33e2cd58fcb9fdb87863ead235adca7c87513f47f6e1c';
const HEADERS = {
    'Authorization': TOKEN,
    'Content-Type': 'application/json'
};

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("utenteLoggato"));
    } catch (e) {
        return null;
    }
}

// Gestisce sia il formato custom API "YYYYMMDDThh:mm:ssUTC+TZ"
// sia oggetti Date standard
function stringDate(when) {
    if (typeof when === "string") {
        const m = when.match(/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2})/);
        if (!m) return "—";
        return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`;
    }
    if (when instanceof Date && !isNaN(when)) {
        const dd  = String(when.getDate()).padStart(2, "0");
        const mm  = String(when.getMonth() + 1).padStart(2, "0");
        const hh  = String(when.getHours()).padStart(2, "0");
        const min = String(when.getMinutes()).padStart(2, "0");
        return `${dd}/${mm}/${when.getFullYear()} ${hh}:${min}`;
    }
    return "—";
}

// Parser markdown minimale con sanitizzazione XSS
function parseMarkdown(testo) {
    if (!testo) return "";

    let html = testo
        // Escape caratteri HTML pericolosi prima di tutto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        // Headings
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm,  "<h2>$1</h2>")
        .replace(/^# (.+)$/gm,   "<h1>$1</h1>")
        // Bold e italic
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g,     "<em>$1</em>")
        // Liste
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        // Link
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // A capo
        .replace(/\n/g, "<br>");

    // Avvolgi gli <li> consecutivi in <ul>
    html = html.replace(/(<li>.*?<\/li>)(<br>)*/gs, (match) => {
        const items = match.replace(/<br>/g, "");
        return `<ul>${items}</ul>`;
    });

    return html;
}

function mostraErrore(msg) {
    const main = document.getElementById("main-evento");
    main.innerHTML = `
        <div class="evento-dettaglio-container">
            <p class="errore-msg">${msg}</p>
            <a href="Index.html" class="btn-annulla">← Torna alla lista</a>
        </div>
    `;
}

async function eliminaEvento(documentId, nome) {
    if (!confirm(`Sei sicuro di voler eliminare "${nome}"?`)) return;

    try {
        const res = await fetch(`${API_BASE}/eventos/${documentId}`, {
            method: 'DELETE',
            headers: HEADERS
        });
        if (res.ok) {
            window.location.href = "Index.html";
        } else {
            alert("Errore durante l'eliminazione.");
        }
    } catch (err) {
        console.error(err);
        alert("Errore di rete.");
    }
}

function renderEvento(evento) {
    const currentUser = getCurrentUser();
    const isProprietario = currentUser &&
        currentUser.ruolo === "organizzatore" &&
        String(currentUser.id) === String(evento.org_id);

    let dateHTML = "";
    if (evento.date_time && evento.date_time.length > 0) {
        evento.date_time.forEach(dt => {
            dateHTML += `<div class="evento-data">📅 ${stringDate(dt.st)} – ${stringDate(dt.en)}</div>`;
        });
    }

    const luogo = evento.luogo ? evento.luogo.name : "—";

    let imgsHTML = "";
    if (evento.imgs && evento.imgs.length > 0) {
        evento.imgs.forEach(img => {
            const url = img.url || img.src || "";
            const alt = img.alternativeText || img.alt || "";
            imgsHTML += `<img src="${url}" alt="${alt}" class="evento-dettaglio-img" />`;
        });
    }

    let targetsHTML = "";
    if (evento.target && evento.target.length > 0) {
        evento.target.forEach(t => {
            targetsHTML += `<span class="targets">${t.fascia}</span>`;
        });
    }

    let rankHTML = "Valutazione: —";
    if (evento.rank) {
        rankHTML = `Valutazione: ${evento.rank.stars}/5`;
        if (evento.rank.sponsored) {
            rankHTML += ` <span class="tag">Sponsorizzato</span>`;
        }
    }

    const descHTML = parseMarkdown(evento.desc || "");

    const ownerHTML = isProprietario ? `
        <div class="evento-admin">
            <button class="btn-elimina" onclick="eliminaEvento('${evento.documentId}', '${(evento.nome || "").replace(/'/g, "\\'")}')">🗑️ Elimina</button>
        </div>
    ` : "";

    const main = document.getElementById("main-evento");
    main.innerHTML = `
        <div class="evento-dettaglio-container">
            <a href="Index.html" class="btn-annulla">← Torna alla lista</a>

            <h1 class="evento-nome">${evento.nome || "Evento senza nome"}</h1>

            ${ownerHTML}

            <div class="evento-info">
                ${dateHTML}
                <div class="evento-luogo">📍 ${luogo}</div>
            </div>

            <div class="evento-targets">${targetsHTML}</div>

            <div class="evento-rank">${rankHTML}</div>

            <div class="evento-img">${imgsHTML}</div>

            <div class="evento-desc-detail" style="line-height:1.6; padding:12px 0;">${descHTML}</div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const idRaw  = params.get("id");

    if (!idRaw) {
        mostraErrore("Evento non trovato.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/eventos/${idRaw}?populate=*`, { headers: HEADERS });

        if (res.status === 404) {
            mostraErrore("Evento non trovato.");
            return;
        }
        if (!res.ok) {
            mostraErrore("Errore nel caricamento dell'evento.");
            return;
        }

        const dati   = await res.json();
        const evento = dati.data;

        if (!evento || !evento.nome) {
            mostraErrore("Dati incompleti.");
            return;
        }

        renderEvento(evento);

    } catch (err) {
        console.error(err);
        mostraErrore("Errore di connessione.");
    }
});
