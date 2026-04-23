const http = require('http');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. SETTA GLI HEADER CORS PER OGNI RISPOSTA
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. GESTISCI LA RICHIESTA "OPTIONS" (IL PRE-CONTROLLO DEL BROWSER)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 3. GESTISCI LA ROTTA /eventi
    if (req.url === '/eventi' && req.method === 'GET') {
        try {
            const data = fs.readFileSync('./db.json', 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ errore: "File db.json non trovato" }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messaggio: "Percorso non valido" }));
    }
});

server.listen(PORT, () => {
    console.log(`✅ Server in ascolto su http://127.0.0.1:${PORT}/eventi`);
});