# 📌 Eventi — Gestione e visualizzazione di eventi

Applicazione web per la **gestione, visualizzazione e filtraggio di eventi**, con autenticazione utente, pannello organizzatore e integrazione con un backend Strapi headless.

---

## 🚀 Funzionalità

### Per tutti gli utenti
- **Homepage paginata** con elenco di tutti gli eventi
- **Pagina di dettaglio** per ogni evento (data, luogo, descrizione, immagini, target, valutazione)
- **Ricerca** e **filtri** (luogo, data/orario, tipo, gestore, prezzo, target)
- **Ordinamento** per criterio scelto
- **Sistema di feedback** sugli eventi
- **Chat** integrata

### Per organizzatori
- **Creazione** di nuovi eventi tramite form dedicato (`gestione.html`)
- **Eliminazione** dei propri eventi direttamente dalla card in homepage
- Verifica di proprietà tramite confronto `org_id` ↔ id utente loggato

### Per il sistema
- **Pulizia automatica** degli eventi passati
- **Persistenza** account utenti su `localStorage`
- Distinzione di ruolo (utente / organizzatore) gestita lato client

---

## 🛠️ Stack tecnologico

| Layer | Tecnologie |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES2017+) |
| API | Fetch API con `async/await` |
| Backend | [Strapi](https://strapi.io/) headless CMS — `https://strapi.brusegan.it` |
| Auth client | `localStorage` (utenti, sessione) |
| Dev server | Node.js (`server.js`) + `db.json` come fallback |

---

## 📁 Struttura del progetto

```
Eventi/
├── Index.html          # Homepage con elenco eventi
├── login.html          # Login / Registrazione
├── evento.html         # Dettaglio singolo evento
├── gestione.html       # Form creazione/modifica evento (organizzatori)
├── chat.html           # Chat demo
├── app.js              # Logica homepage: fetch, paginazione, eliminazione
├── account.js          # Registrazione, login, gestione utenti
├── evento.js           # Rendering dettaglio evento
├── gestione.js         # Form creazione/modifica + validazione
├── chat.js             # Chat
├── style.css           # Stili globali
├── server.js           # Server di sviluppo
├── db.json             # DB locale di esempio
└── Documentazione-API.md  # Reference completo degli endpoint Strapi
```

---

## ▶️ Avvio in locale

Trattandosi di un'app statica che consuma un'API remota, è sufficiente un server statico:

```bash
# opzione 1: server Node incluso
node server.js

# opzione 2: qualsiasi server statico
python3 -m http.server 8000
```

Apri poi `http://localhost:8000/Index.html` (o la porta scelta).

> ⚠️ Aprire i file con `file://` non funziona: `fetch()` richiede un server HTTP.

---

## 🔌 API

L'app comunica con un'istanza Strapi su `https://strapi.brusegan.it/api`.

Endpoint principali:
- `GET /eventos?populate=*` — elenco eventi completo
- `GET /eventos/{documentId}?populate=*` — singolo evento
- `POST /eventos` — creazione (organizzatori)
- `PUT /eventos/{documentId}` — modifica
- `DELETE /eventos/{documentId}` — eliminazione

Tutti i dettagli su payload, autenticazione e codici di errore sono in [`Documentazione-API.md`](./Documentazione-API.md).

---

## 👥 Team

| Nome | Responsabilità |
|---|---|
| Alvise | API, gestione dati |
| Zainab | API, scroll, gestione account |
| William | Scroll, pulizia eventi passati |
| Giuseppe | Filtri (luogo, tipo, prezzo) |
| Rossi | Filtri (data, gestore, target) |
| Busetto | Ricerca |
| Mauriello | Feedback eventi |

---

## 📄 Note

Progetto in continuo sviluppo: nuove funzionalità e refinement vengono aggiunti progressivamente. Contributi e segnalazioni sono benvenuti tramite issue/PR.
