# API Documentazione — Eventos (Strapi)

## Configurazione base

| Parametro | Valore |
|---|---|
| Base URL | `https://strapi.brusegan.it` |
| Autenticazione | Bearer Token |
| Content-Type | `application/json` |

> Tutte le richieste richiedono l'header:
> ```
> Authorization: Bearer IL_TUO_TOKEN
> ```

---

## Struttura di un Evento

```json
{
  "data": {
    "nome": "string",
    "desc": "string (Markdown)",
    "date_time": [
      {
        "st": "yyyymmddThh:mm:ssUTC+timezone",
        "en": "yyyymmddThh:mm:ssUTC+timezone"
      }
    ],
    "luogo": {
      "name": "string",
      "lat": "number",
      "lon": "number"
    },
    "target": [
      { "fascia": "preadolescenti | adolescenti | giovani | giovani_adulti" }
    ],
    "org_id": "number",
    "imgs": [
      {
        "alt": "string",
        "src": "string (URL)"
      }
    ],
    "rank": {
      "stars": "number (0-5)",
      "sponsored": "boolean"
    }
  }
}
```

### Fasce d'età `target`

| Valore | Fascia d'età |
|---|---|
| `preadolescenti` | 10-13 anni |
| `adolescenti` | 14-17 anni |
| `giovani` | 18-24 anni |
| `giovani_adulti` | 25-35 anni |

---

## Endpoints

### 1. GET — Lista tutti gli eventi

```
GET https://strapi.brusegan.it/api/eventos
```

Restituisce la lista degli eventi **senza** componenti (luogo, target, imgs, rank).

**Risposta:**
```json
{
  "data": [
    {
      "id": 2,
      "documentId": "gvkogteczrubexdnsikewfj0",
      "nome": "Concerto in Piazza",
      "desc": "## Descrizione\nUn bellissimo concerto all'aperto.",
      "date_time": [
        {
          "st": "20260501T20:00:00UTC+02",
          "en": "20260501T23:00:00UTC+02"
        }
      ],
      "org_id": 1,
      "createdAt": "2026-04-24T08:43:38.864Z",
      "updatedAt": "2026-04-24T08:43:38.864Z",
      "publishedAt": "2026-04-24T08:43:38.890Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 2. GET — Lista tutti gli eventi (completa)

```
GET https://strapi.brusegan.it/api/eventos?populate=*
```

Restituisce la lista degli eventi **con** tutti i componenti (luogo, target, imgs, rank).

**Risposta:**
```json
{
  "data": [
    {
      "id": 2,
      "documentId": "gvkogteczrubexdnsikewfj0",
      "nome": "Concerto in Piazza",
      "desc": "## Descrizione\nUn bellissimo concerto all'aperto.",
      "date_time": [
        {
          "st": "20260501T20:00:00UTC+02",
          "en": "20260501T23:00:00UTC+02"
        }
      ],
      "org_id": 1,
      "luogo": {
        "id": 2,
        "name": "Piazza del Duomo",
        "lat": 45.4642,
        "lon": 9.19
      },
      "target": [
        { "id": 3, "fascia": "adolescenti" },
        { "id": 4, "fascia": "giovani" }
      ],
      "imgs": [
        { "id": 2, "alt": "Foto concerto", "src": "https://esempio.com/foto.jpg" }
      ],
      "rank": {
        "id": 2,
        "stars": 4,
        "sponsored": false
      },
      "createdAt": "2026-04-24T08:43:38.864Z",
      "updatedAt": "2026-04-24T08:43:38.864Z",
      "publishedAt": "2026-04-24T08:43:38.890Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 3. GET — Singolo evento per ID

```
GET https://strapi.brusegan.it/api/eventos/{id}?populate=*
```

**Esempio:**
```
GET https://strapi.brusegan.it/api/eventos/2?populate=*
```

**Risposta:** stesso formato della lista completa ma con un solo oggetto in `data`.

---

### 4. POST — Crea un nuovo evento

```
POST https://strapi.brusegan.it/api/eventos
```

**Body:**
```json
{
  "data": {
    "nome": "Concerto in Piazza",
    "desc": "## Descrizione\nUn bellissimo concerto all'aperto.",
    "date_time": [
      {
        "st": "20260501T20:00:00UTC+02",
        "en": "20260501T23:00:00UTC+02"
      }
    ],
    "luogo": {
      "name": "Piazza del Duomo",
      "lat": 45.4642,
      "lon": 9.1900
    },
    "target": [
      { "fascia": "adolescenti" },
      { "fascia": "giovani" }
    ],
    "org_id": 1,
    "imgs": [
      {
        "alt": "Foto concerto",
        "src": "https://esempio.com/foto.jpg"
      }
    ],
    "rank": {
      "stars": 4,
      "sponsored": false
    }
  }
}
```

**Risposta:** `201 Created` con l'evento creato.

---

### 5. PUT — Modifica un evento esistente

```
PUT https://strapi.brusegan.it/api/eventos/{id}
```

**Esempio:**
```
PUT https://strapi.brusegan.it/api/eventos/2
```

**Body:** stessa struttura del POST, con solo i campi da aggiornare.

```json
{
  "data": {
    "nome": "Concerto in Piazza — Aggiornato",
    "rank": {
      "stars": 5,
      "sponsored": true
    }
  }
}
```

**Risposta:** `200 OK` con l'evento aggiornato.

---

### 6. DELETE — Elimina un evento

```
DELETE https://strapi.brusegan.it/api/eventos/{id}
```

**Esempio:**
```
DELETE https://strapi.brusegan.it/api/eventos/2
```

Nessun body necessario.

**Risposta:** `200 OK` con i dati dell'evento eliminato.

---

## Errori comuni

| Codice | Significato | Soluzione |
|---|---|---|
| `401 Unauthorized` | Token mancante o errato | Aggiungi il Bearer Token nella richiesta |
| `400 Bad Request` | Body malformato o valore non valido | Controlla il JSON e i valori dell'Enumeration |
| `404 Not Found` | ID non esistente | Verifica che l'ID esista nel database |
| `403 Forbidden` | Token senza permessi | Controlla i permessi del token su Strapi |

---

## Query utili

### Filtrare per fascia d'età
```
GET /api/eventos?populate=*&filters[target][fascia][$eq]=giovani
```

### Ordinare per stelle
```
GET /api/eventos?populate=*&sort=rank.stars:desc
```

### Paginazione
```
GET /api/eventos?populate=*&pagination[page]=1&pagination[pageSize]=10
```
