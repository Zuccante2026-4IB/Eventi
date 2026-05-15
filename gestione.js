const API_BASE = 'https://strapi.brusegan.it/api';
const TOKEN = 'Bearer cff92e74316f57f7cd63ce9f93cf8fb309f0f15f673ed41d81afe4f1569a81f88d6b1b4268a94f97e5eb52802a1e1b49ac6702c060f1b96d1d02fa3103f84df65445e2307cd5f15b3ccb141fc91147470465304d44d6f53784989b971c4468aa6932c0b9dc3ed37da4a33e2cd58fcb9fdb87863ead235adca7c87513f47f6e1c';
const HEADERS = {
    'Authorization': TOKEN,
    'Content-Type': 'application/json'
};

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("utenteLoggato"));
}

function verificaAccesso() {
    const u = getCurrentUser();
    if (!u || u.ruolo !== "organizzatore") {
        window.location.href = "Index.html";
        return false;
    }
    return true;
}

function getIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || null;
}

async function caricaEvento(documentId) {
    const res = await fetch(`${API_BASE}/eventos/${documentId}?populate=*`, { headers: HEADERS });
    const dati = await res.json();
    const evento = dati.data;
    const currentUser = getCurrentUser();

    // Confronto con String() per evitare mismatch number vs string
    if (!currentUser || String(evento.org_id) !== String(currentUser.id)) {
        alert("Non hai il permesso di modificare questo evento.");
        window.location.href = "Index.html";
        return null;
    }
    return evento;
}

function renderForm(evento) {
    const isModifica = evento !== null;

    let nome        = "";
    let desc        = "";
    let luogoName   = "";
    let luogoLat    = "";
    let luogoLon    = "";
    let imgAlt      = "";
    let imgSrc      = "";
    let tagsStr     = "";
    let dtSt        = "";
    let dtEn        = "";
    let sponsored   = false;
    let targetFasce = [];

    if (isModifica) {
        nome      = evento.nome      || "";
        desc      = evento.desc      || "";
        sponsored = evento.rank && evento.rank.sponsored;

        if (evento.luogo) {
            luogoName = evento.luogo.name || "";
            luogoLat  = evento.luogo.lat  || "";
            luogoLon  = evento.luogo.lon  || "";
        }

        if (evento.imgs && evento.imgs.length > 0) {
            imgAlt = evento.imgs[0].alt || "";
            imgSrc = evento.imgs[0].src || "";
        }

        if (evento.tags) {
            tagsStr = evento.tags.join(", ");
        }

        if (evento.date_time && evento.date_time.length > 0) {
            dtSt = isoToLocal(evento.date_time[0].st);
            dtEn = isoToLocal(evento.date_time[0].en);
        }

        if (evento.target) {
            evento.target.forEach(t => targetFasce.push(t.fascia));
        }
    }

    const main = document.getElementById("main-gestione");
    main.innerHTML = `
        <div class="gestione-container">
            <h2>${isModifica ? "✏️ Modifica Evento" : "+ Nuovo Evento"}</h2>

            <div class="form-section">
                <label>Nome evento *</label>
                <input id="f-nome" type="text" placeholder="Es. Festival della Laguna" value="${escHtml(nome)}">
            </div>

            <div class="form-row">
                <div class="form-section">
                    <label>Data/ora inizio *</label>
                    <input id="f-st" type="datetime-local" value="${dtSt}">
                </div>
                <div class="form-section">
                    <label>Data/ora fine *</label>
                    <input id="f-en" type="datetime-local" value="${dtEn}">
                </div>
            </div>

            <div class="form-section">
                <label>Luogo — Nome *</label>
                <input id="f-luogo-name" type="text" placeholder="Es. Arsenale di Venezia" value="${escHtml(luogoName)}">
            </div>

            <div class="form-row">
                <div class="form-section">
                    <label>Latitudine</label>
                    <input id="f-lat" type="number" step="0.0001" placeholder="45.4375" value="${luogoLat}">
                </div>
                <div class="form-section">
                    <label>Longitudine</label>
                    <input id="f-lon" type="number" step="0.0001" placeholder="12.3487" value="${luogoLon}">
                </div>
            </div>

            <div class="form-section">
                <label>Descrizione</label>
                <textarea id="f-desc" rows="4" placeholder="Descrizione dell'evento">${escHtml(desc)}</textarea>
            </div>

            <div class="form-section">
                <label>Tag (separati da virgola)</label>
                <input id="f-tags" type="text" placeholder="musica, arte, festival" value="${escHtml(tagsStr)}">
            </div>

            <div class="form-section">
                <label>Target (fascia d'età)</label>
                <div class="checkbox-group">
                    <label class="check-label">
                        <input type="checkbox" name="fascia" value="preadolescenti" ${targetFasce.indexOf("preadolescenti") !== -1 ? "checked" : ""}>
                        preadolescenti
                    </label>
                    <label class="check-label">
                        <input type="checkbox" name="fascia" value="adolescenti" ${targetFasce.indexOf("adolescenti") !== -1 ? "checked" : ""}>
                        adolescenti
                    </label>
                    <label class="check-label">
                        <input type="checkbox" name="fascia" value="giovani" ${targetFasce.indexOf("giovani") !== -1 ? "checked" : ""}>
                        giovani
                    </label>
                    <label class="check-label">
                        <input type="checkbox" name="fascia" value="giovani_adulti" ${targetFasce.indexOf("giovani_adulti") !== -1 ? "checked" : ""}>
                        giovani_adulti
                    </label>
                </div>
            </div>

            <div class="form-section">
                <label>Immagine — URL</label>
                <input id="f-img-src" type="text" placeholder="https://..." value="${escHtml(imgSrc)}">
            </div>

            <div class="form-section">
                <label>Immagine — Testo alternativo</label>
                <input id="f-img-alt" type="text" placeholder="Descrizione immagine" value="${escHtml(imgAlt)}">
            </div>

            <div class="form-section">
                <label class="check-label">
                    <input id="f-sponsored" type="checkbox" ${sponsored ? "checked" : ""}>
                    Sponsorizzato
                </label>
            </div>

            <div class="form-actions">
                <button class="btn-salva" id="btn-salva-evento">
                    ${isModifica ? "💾 Salva modifiche" : "✅ Crea evento"}
                </button>
                <a href="Index.html" class="btn-annulla">Annulla</a>
            </div>

            <div id="form-feedback"></div>
        </div>
    `;

    const btnSalva = document.getElementById("btn-salva-evento");
    if (isModifica) {
        btnSalva.addEventListener("click", () => salvaEvento(evento.documentId));
    } else {
        btnSalva.addEventListener("click", () => salvaEvento(null));
    }
}

// Converte "YYYY-MM-DDTHH:MM" → "YYYYMMDDThh:mm:00UTC+00"
function toApiDate(localStr) {
    if (!localStr) return null;
    const [datePart, timePart] = localStr.split("T");
    const [yyyy, mm, dd] = datePart.split("-");
    const [hh, min] = timePart.split(":");
    return `${yyyy}${mm}${dd}T${hh}:${min}:00UTC+00`;
}

// Converte il formato custom Strapi "YYYYMMDDThh:mm:ssUTC+00" → "YYYY-MM-DDTHH:MM"
function isoToLocal(iso) {
    if (!iso) return "";
    const m = iso.match(/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return "";
    return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
}

function leggiForm() {
    const currentUser = getCurrentUser();

    const fasce = [];
    document.querySelectorAll('input[name="fascia"]:checked').forEach(cb => {
        fasce.push({ fascia: cb.value });
    });

    const tags = [];
    document.getElementById('f-tags').value
        .split(',')
        .forEach(t => {
            const trimmed = t.trim();
            if (trimmed !== "") tags.push(trimmed);
        });

    const st = document.getElementById('f-st').value;
    const en = document.getElementById('f-en').value;
    const date_time = [];
    if (st && en) {
        date_time.push({ st: toApiDate(st), en: toApiDate(en) });
    }

    const imgs = [];
    const imgSrc = document.getElementById('f-img-src').value.trim();
    const imgAlt = document.getElementById('f-img-alt').value.trim();
    if (imgSrc !== "") {
        imgs.push({ alt: imgAlt, src: imgSrc });
    }

    return {
        nome:      document.getElementById('f-nome').value.trim(),
        desc:      document.getElementById('f-desc').value.trim(),
        date_time: date_time,
        luogo: {
            name: document.getElementById('f-luogo-name').value.trim(),
            lat:  parseFloat(document.getElementById('f-lat').value) || 0,
            lon:  parseFloat(document.getElementById('f-lon').value) || 0
        },
        tags:   tags,
        target: fasce,
        org_id: currentUser.id,
        imgs:   imgs,
        rank: {
            stars:     0,
            sponsored: document.getElementById('f-sponsored').checked
        }
    };
}

async function salvaEvento(documentId) {
    console.log("salvaEvento chiamata con documentId:", documentId, typeof documentId);

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.ruolo !== "organizzatore") {
        alert("Accesso riservato agli organizzatori.");
        return;
    }

    const dati = leggiForm();

    if (!dati.nome) {
        mostraFeedback("Il nome è obbligatorio.", "errore");
        return;
    }
    if (!dati.luogo.name) {
        mostraFeedback("Il luogo è obbligatorio.", "errore");
        return;
    }
    if (dati.date_time.length === 0) {
        mostraFeedback("Data/ora inizio e fine sono obbligatorie.", "errore");
        return;
    }

    const url    = documentId ? `${API_BASE}/eventos/${documentId}` : `${API_BASE}/eventos`;
    const method = documentId ? 'PUT' : 'POST';

    console.log("Invio", method, "a", url, "con dati:", JSON.stringify(dati, null, 2));

    try {
        const res = await fetch(url, {
            method:  method,
            headers: HEADERS,
            body:    JSON.stringify({ data: dati })
        });

        if (res.ok) {
            mostraFeedback(documentId ? "Evento aggiornato!" : "Evento creato!", "successo");
            setTimeout(() => window.location.href = "Index.html", 1200);
        } else {
            const err = await res.json();
            console.error("Errore Strapi:", err);
            const msg = err?.error?.message || "Errore dal server.";
            mostraFeedback(msg, "errore");
        }
    } catch (e) {
        console.error(e);
        mostraFeedback("Errore di rete.", "errore");
    }
}

function mostraFeedback(testo, tipo) {
    const el = document.getElementById('form-feedback');
    if (!el) return;
    el.className  = "form-feedback form-feedback-" + tipo;
    el.textContent = testo;
}

function escHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g,  "&amp;")
        .replace(/"/g,  "&quot;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;");
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!verificaAccesso()) return;

    const id = getIdDaUrl();

    if (id) {
        try {
            const evento = await caricaEvento(id);
            if (evento) renderForm(evento);
        } catch (e) {
            console.error(e);
            document.getElementById("main-gestione").innerHTML =
                "<p>Errore nel caricamento dell'evento.</p>";
        }
    } else {
        renderForm(null);
    }
});