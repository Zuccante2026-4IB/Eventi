// API_BASE, TOKEN, HEADERS, escHtml, getCurrentUser, stringDate
// sono forniti da api.js (incluso prima di questo script).

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
        // Link — solo http(s) o path relativi, blocca javascript:/data:
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
            const safe = /^(https?:\/\/|\/|#)/i.test(url.trim()) ? url.trim() : "#";
            return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        })
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

    const dateHTML = (evento.date_time || [])
        .map(dt => `<div class="evento-data">📅 ${escHtml(stringDate(dt.st))} – ${escHtml(stringDate(dt.en))}</div>`)
        .join("");

    const luogo = evento.luogo ? escHtml(evento.luogo.name) : "—";

    const imgsHTML = (evento.imgs || [])
        .map(img => {
            const url = img.url || img.src || "";
            const alt = img.alternativeText || img.alt || "";
            return `<img src="${escHtml(url)}" alt="${escHtml(alt)}" class="evento-dettaglio-img" />`;
        })
        .join("");

    const targetsHTML = (evento.target || [])
        .map(t => `<span class="targets">${escHtml(t.fascia)}</span>`)
        .join("");

    let rankHTML = "Valutazione: —";
    if (evento.rank) {
        rankHTML = `Valutazione: ${escHtml(evento.rank.stars)}/5`;
        if (evento.rank.sponsored) {
            rankHTML += ` <span class="tag">Sponsorizzato</span>`;
        }
    }

    const descHTML = parseMarkdown(evento.desc || "");
    const ownerHTML = isProprietario
        ? `<div class="evento-admin"><button class="btn-elimina" id="btn-elimina-evento">🗑️ Elimina</button></div>`
        : "";

    const main = document.getElementById("main-evento");
    main.innerHTML = `
        <div class="evento-dettaglio-container">
            <a href="Index.html" class="btn-annulla">← Torna alla lista</a>

            <h1 class="evento-nome">${escHtml(evento.nome || "Evento senza nome")}</h1>

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

    if (isProprietario) {
        document.getElementById("btn-elimina-evento")
            .addEventListener("click", () => eliminaEvento(evento.documentId, evento.nome));
    }
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
