const oggetto_json = `[
    {
        "nome": "Concerto barocco a San Vidal",
        "data": { "y": 2026, "m": 5, "d": 4, "yyyymmdd": 20260504 },
        "luogo": { "nome": "Chiesa di San Vidal", "lat": 45.4337, "lon": 12.3326 },
        "orario": "21:00",
        "descrizione": "Concerto di musica barocca con strumenti d’epoca.",
        "tags": ["musica", "classica"],
        "prezzo": { "nome": "Intero", "prezzoEur": 25.00, "condizioni": "nessuna" }
    },
    {
        "nome": "Tour notturno tra calli e leggende",
        "data": { "y": 2026, "m": 5, "d": 5, "yyyymmdd": 20260505 },
        "luogo": { "nome": "Campo Santa Margherita", "lat": 45.4342, "lon": 12.3229 },
        "orario": "21:00",
        "descrizione": "Passeggiata guidata tra misteri e leggende veneziane.",
        "tags": ["tour", "storia"],
        "prezzo": { "nome": "Ridotto", "prezzoEur": 18.00, "condizioni": "studenti" }
    },
    {
        "nome": "Mostra fotografica sulla laguna",
        "data": { "y": 2026, "m": 5, "d": 5, "yyyymmdd": 20260505 },
        "luogo": { "nome": "Ca' Pesaro", "lat": 45.4417, "lon": 12.3317 },
        "orario": "10:00",
        "descrizione": "Esposizione dedicata ai paesaggi della laguna veneta.",
        "tags": ["arte", "mostra"],
        "prezzo": { "nome": "Standard", "prezzoEur": 12.00, "condizioni": "online" }
    },
    {
        "nome": "Vogata al tramonto",
        "data": { "y": 2026, "m": 5, "d": 6, "yyyymmdd": 20260506 },
        "luogo": { "nome": "Sacca Fisola", "lat": 45.4283, "lon": 12.3167 },
        "orario": "18:30",
        "descrizione": "Lezione di voga alla veneta per principianti.",
        "tags": ["sport", "tradizione"],
        "prezzo": { "nome": "Lezione", "prezzoEur": 40.00, "condizioni": "prenotazione" }
    },
    {
        "nome": "Aperitivo in Jazz",
        "data": { "y": 2026, "m": 5, "d": 7, "yyyymmdd": 20260507 },
        "luogo": { "nome": "Fondamenta della Misericordia", "lat": 45.4445, "lon": 12.3320 },
        "orario": "19:00",
        "descrizione": "Musica jazz dal vivo nei locali della Fondamenta.",
        "tags": ["musica", "aperitivo"],
        "prezzo": { "nome": "Libero", "prezzoEur": 0.00, "condizioni": "consumazione" }
    },
    {
        "nome": "Workshop Maschere Veneziane",
        "data": { "y": 2026, "m": 5, "d": 8, "yyyymmdd": 20260508 },
        "luogo": { "nome": "Atelier San Polo", "lat": 45.4378, "lon": 12.3300 },
        "orario": "15:00",
        "descrizione": "Crea e decora la tua maschera in cartapesta.",
        "tags": ["artigianato", "corso"],
        "prezzo": { "nome": "Materiali inclusi", "prezzoEur": 55.00, "condizioni": "max 5 persone" }
    },
    {
        "nome": "Degustazione vini locali",
        "data": { "y": 2026, "m": 5, "d": 9, "yyyymmdd": 20260509 },
        "luogo": { "nome": "Isola di Mazzorbo", "lat": 45.4850, "lon": 12.4110 },
        "orario": "11:00",
        "descrizione": "Assaggio di vini prodotti nelle vigne della laguna.",
        "tags": ["food", "vino"],
        "prezzo": { "nome": "Full", "prezzoEur": 30.00, "condizioni": "include cicchetti" }
    },

    {
        "nome": "Cinema all’aperto in campo",
        "data": { "y": 2026, "m": 5, "d": 10, "yyyymmdd": 20260510 },
        "luogo": { "nome": "Campo San Polo", "lat": 45.4380, "lon": 12.3292 },
        "orario": "21:30",
        "descrizione": "Proiezione di film italiani sotto le stelle.",
        "tags": ["cinema", "outdoor"],
        "prezzo": { "nome": "Ingresso", "prezzoEur": 8.00, "condizioni": "posti limitati" }
    },
    {
        "nome": "Lezione di cucina veneziana",
        "data": { "y": 2026, "m": 5, "d": 11, "yyyymmdd": 20260511 },
        "luogo": { "nome": "Scuola di Cucina Cannaregio", "lat": 45.4440, "lon": 12.3335 },
        "orario": "17:00",
        "descrizione": "Impara a cucinare piatti tipici veneziani.",
        "tags": ["cucina", "corso"],
        "prezzo": { "nome": "Completo", "prezzoEur": 65.00, "condizioni": "include cena" }
    },
    {
        "nome": "Visita guidata Palazzo Ducale",
        "data": { "y": 2026, "m": 5, "d": 12, "yyyymmdd": 20260512 },
        "luogo": { "nome": "Palazzo Ducale", "lat": 45.4336, "lon": 12.3404 },
        "orario": "10:30",
        "descrizione": "Tour storico nel cuore del potere veneziano.",
        "tags": ["storia", "tour"],
        "prezzo": { "nome": "Biglietto", "prezzoEur": 20.00, "condizioni": "guida inclusa" }
    },
    {
        "nome": "Yoga al parco",
        "data": { "y": 2026, "m": 5, "d": 13, "yyyymmdd": 20260513 },
        "luogo": { "nome": "Giardini della Biennale", "lat": 45.4289, "lon": 12.3570 },
        "orario": "08:00",
        "descrizione": "Sessione di yoga all’aperto per tutti i livelli.",
        "tags": ["sport", "benessere"],
        "prezzo": { "nome": "Donazione", "prezzoEur": 10.00, "condizioni": "libero" }
    },
    {
        "nome": "Mercato artigianale locale",
        "data": { "y": 2026, "m": 5, "d": 14, "yyyymmdd": 20260514 },
        "luogo": { "nome": "Rialto", "lat": 45.4381, "lon": 12.3358 },
        "orario": "09:00",
        "descrizione": "Bancarelle di artigianato e prodotti locali.",
        "tags": ["mercato", "artigianato"],
        "prezzo": { "nome": "Ingresso", "prezzoEur": 0.00, "condizioni": "gratuito" }
    },
    {
        "nome": "Spettacolo di teatro di strada",
        "data": { "y": 2026, "m": 5, "d": 15, "yyyymmdd": 20260515 },
        "luogo": { "nome": "Campo San Giacomo", "lat": 45.4370, "lon": 12.3365 },
        "orario": "18:00",
        "descrizione": "Performance teatrali itineranti.",
        "tags": ["teatro", "arte"],
        "prezzo": { "nome": "Offerta", "prezzoEur": 5.00, "condizioni": "libera" }
    },
    {
        "nome": "Giro in gondola condiviso",
        "data": { "y": 2026, "m": 5, "d": 16, "yyyymmdd": 20260516 },
        "luogo": { "nome": "Ponte di Rialto", "lat": 45.4381, "lon": 12.3358 },
        "orario": "14:00",
        "descrizione": "Esperienza in gondola a prezzo ridotto.",
        "tags": ["tour", "esperienza"],
        "prezzo": { "nome": "Condiviso", "prezzoEur": 35.00, "condizioni": "max 5 persone" }
    },
    {
        "nome": "Laboratorio vetro Murano",
        "data": { "y": 2026, "m": 5, "d": 17, "yyyymmdd": 20260517 },
        "luogo": { "nome": "Isola di Murano", "lat": 45.4586, "lon": 12.3520 },
        "orario": "11:30",
        "descrizione": "Dimostrazione lavorazione del vetro.",
        "tags": ["artigianato", "tradizione"],
        "prezzo": { "nome": "Ingresso", "prezzoEur": 15.00, "condizioni": "visita guidata" }
    },
    {
        "nome": "Concerto corale in basilica",
        "data": { "y": 2026, "m": 5, "d": 18, "yyyymmdd": 20260518 },
        "luogo": { "nome": "Basilica dei Frari", "lat": 45.4367, "lon": 12.3277 },
        "orario": "20:30",
        "descrizione": "Musica sacra eseguita da coro internazionale.",
        "tags": ["musica", "classica"],
        "prezzo": { "nome": "Intero", "prezzoEur": 22.00, "condizioni": "posti numerati" }
    },
    {
        "nome": "Escursione in laguna in barca",
        "data": { "y": 2026, "m": 5, "d": 19, "yyyymmdd": 20260519 },
        "luogo": { "nome": "Punta Sabbioni", "lat": 45.4448, "lon": 12.4420 },
        "orario": "09:30",
        "descrizione": "Tour naturalistico tra le isole minori.",
        "tags": ["natura", "tour"],
        "prezzo": { "nome": "Escursione", "prezzoEur": 45.00, "condizioni": "guida inclusa" }
    }
]`;

const arr = JSON.parse(oggetto_json);

const arr_size        = arr.length;
const altezzaViewport = 400;
const altezzaRiga     = 90;
const buffer          = 2;

let viewport, list, paddingTop, paddingBottom;
const pool = [];

// ─────────────────────────────────────────────
//  scrittura_evento
//  FIX: usa createElement invece di innerHTML +=
//  così i tag <br> non vengono mai collassati
// ─────────────────────────────────────────────
function scrittura_evento() {
    const div_eventi = document.getElementById("eventi");
    div_eventi.innerHTML = "";

    arr.forEach(evento => {
        const card = document.createElement("div");
        card.className = "evento-card";

        //crea il box dell'evento
        card.innerHTML = `
            <div class="evento-nome">${evento.nome}</div>
            <div class="evento-info">
                <span>${evento.data.d}/${evento.data.m}/${evento.data.y} — ${evento.orario}</span>
                <span>${evento.luogo.nome}</span>
                <span>€${evento.prezzo.prezzoEur.toFixed(2)}</span>
            </div>
            <div class="evento-desc">${evento.descrizione}</div>
            <div class="evento-tags">
                ${evento.tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>
        `;

        div_eventi.appendChild(card);
    });
}

function buildPool() {
    list.innerHTML = "";
    pool.length = 0;

    const count = Math.ceil(altezzaViewport / altezzaRiga) + buffer * 2;

    for (let i = 0; i < count; i++) {
        const row  = document.createElement("div");
        row.className = "riga";

        const nome = document.createElement("div");
        nome.className = "riga-nome";

        const meta = document.createElement("div");
        meta.className = "riga-meta";

        const desc = document.createElement("div");
        desc.className = "riga-desc";

        row.appendChild(nome);
        row.appendChild(meta);
        row.appendChild(desc);
        list.appendChild(row);

        pool.push({ row, nome, meta, desc });
    }
}

function render() {
    const scrollTop = viewport.scrollTop;

    let inizioIndex = Math.floor(scrollTop / altezzaRiga) - buffer;
    inizioIndex = Math.max(0, inizioIndex);

    let fineIndex = inizioIndex + Math.ceil(altezzaViewport / altezzaRiga) + buffer * 2;
    fineIndex = Math.min(arr_size, fineIndex);

    paddingTop.style.height    = (inizioIndex * altezzaRiga) + "px";
    paddingBottom.style.height = ((arr_size - fineIndex) * altezzaRiga) + "px";

    arr.slice(inizioIndex, fineIndex).forEach((item, i) => {
        const node = pool[i];

        node.row.style.display = "flex";
        node.nome.textContent  = item.nome;

        const data = `${item.data.d}/${item.data.m}/${item.data.y}`;
        node.meta.innerHTML =
            `<span>${data} ${item.orario}</span>` +
            `<span>${item.luogo.nome}</span>` +
            `<span>€${item.prezzo.prezzoEur.toFixed(2)}</span>` +
            item.tags.map(t => `<span class="tag">${t}</span>`).join("");

        node.desc.textContent = item.descrizione;
    });

    for (let i = fineIndex - inizioIndex; i < pool.length; i++) {
        pool[i].row.style.display = "none";
    }
}

window.onload = function () {
    viewport      = document.getElementById("viewport");
    list          = document.getElementById("list");
    paddingTop    = document.getElementById("top-padding");
    paddingBottom = document.getElementById("bottom-padding");

    scrittura_evento();
    buildPool();
    render();
    viewport.addEventListener("scroll", render);
};

