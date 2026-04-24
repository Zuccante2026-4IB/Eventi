// ─────────────────────────────────────────────
//  chat.js — pagina chatbot (chat.html)
//  Responsabilità: trovare risposte simulate,
//  gestire i messaggi, animare il typing
// ─────────────────────────────────────────────

const risposte = [
    {
        chiavi: ['concert', 'barocc', 'music', 'san vidal'],
        testo: '🎵 Il <b>Concerto barocco a San Vidal</b> si tiene il 4 maggio 2026 alle 21:00 presso la Chiesa di San Vidal. Musica con strumenti d\'epoca. Biglietto: €25.'
    },
    {
        chiavi: ['tour', 'notturno', 'calli', 'leggend', 'storia'],
        testo: '🌙 Il <b>Tour notturno tra calli e leggende</b> parte da Campo Santa Margherita il 5 maggio alle 21:00. Misteri veneziani. Costo: €18 (ridotto studenti).'
    },
    {
        chiavi: ['mostra', 'fotograf', 'laguna', 'ca pesaro', 'arte'],
        testo: '📷 La <b>Mostra fotografica sulla laguna</b> è esposta a Ca\' Pesaro dal 5 maggio, apertura ore 10:00. Ingresso €12, acquistabile online.'
    },
    {
        chiavi: ['vogat', 'tramonto', 'voga', 'remo', 'sport'],
        testo: '🚣 La <b>Vogata al tramonto</b> è a Sacca Fisola il 6 maggio alle 18:30. Lezione di voga alla veneta per principianti, €40 con prenotazione.'
    },
    {
        chiavi: ['jazz', 'aperitivo', 'misericordia', 'gratis', 'libero'],
        testo: '🎷 <b>Aperitivo in Jazz</b> alla Fondamenta della Misericordia, 7 maggio ore 19:00. Ingresso libero con consumazione.'
    },
    {
        chiavi: ['maschera', 'workshop', 'cartapesta', 'artigian', 'san polo'],
        testo: '🎭 Il <b>Workshop Maschere Veneziane</b> si tiene all\'Atelier San Polo l\'8 maggio alle 15:00. Materiali inclusi, €55. Massimo 5 partecipanti.'
    },
    {
        chiavi: ['vino', 'degust', 'mazzorbo', 'food'],
        testo: '🍷 La <b>Degustazione vini locali</b> è sull\'Isola di Mazzorbo, 9 maggio ore 11:00. Include cicchetti, costo €30.'
    },
    {
        chiavi: ['cinema', 'film', 'aperto', 'stelle'],
        testo: '🎬 <b>Cinema all\'aperto</b> a Campo San Polo il 10 maggio alle 21:30. Film italiani sotto le stelle, €8. Posti limitati.'
    },
    {
        chiavi: ['cucina', 'ricetta', 'venezian', 'corso'],
        testo: '👨‍🍳 La <b>Lezione di cucina veneziana</b> è l\'11 maggio alle 17:00 a Cannaregio. Include cena, €65.'
    },
    {
        chiavi: ['palazzo ducale', 'ducal', 'visita', 'guid'],
        testo: '🏛️ La <b>Visita guidata a Palazzo Ducale</b> è il 12 maggio alle 10:30. Guida inclusa, biglietto €20.'
    },
    {
        chiavi: ['yoga', 'giardini', 'biennale', 'benessere'],
        testo: '🧘 <b>Yoga al parco</b> ai Giardini della Biennale il 13 maggio ore 08:00. Donazione libera, suggerito €10.'
    },
    {
        chiavi: ['mercato', 'rialto', 'bancarelle', 'gratuito'],
        testo: '🛍️ Il <b>Mercato artigianale</b> al Rialto il 14 maggio dalle 09:00. Ingresso gratuito.'
    },
    {
        chiavi: ['teatro', 'strada', 'spettacolo', 'san giacomo'],
        testo: '🎪 Lo <b>Spettacolo di teatro di strada</b> è a Campo San Giacomo il 15 maggio alle 18:00. Offerta libera, €5 suggeriti.'
    },
    {
        chiavi: ['gondola', 'giro', 'condiviso'],
        testo: '🚤 <b>Giro in gondola condiviso</b> dal Ponte di Rialto il 16 maggio alle 14:00. €35 a persona, massimo 5 persone.'
    },
    {
        chiavi: ['vetro', 'murano', 'laborator'],
        testo: '🔥 Il <b>Laboratorio vetro di Murano</b> è il 17 maggio alle 11:30. Dimostrazione di soffiatura, €15 con visita guidata.'
    },
    {
        chiavi: ['corale', 'basilica', 'frari', 'sacra'],
        testo: '🎶 Il <b>Concerto corale</b> alla Basilica dei Frari è il 18 maggio alle 20:30. Musica sacra internazionale, €22. Posti numerati.'
    },
    {
        chiavi: ['escursione', 'laguna', 'natura', 'isole', 'barca'],
        testo: '⛵ L\'<b>Escursione in laguna</b> parte da Punta Sabbioni il 19 maggio ore 09:30. Tour naturalistico, €45 con guida.'
    },
    {
        chiavi: ['maggio', 'eventi', 'cosa', 'programm', 'lista', 'settimana'],
        testo: '📅 A maggio ci sono tantissimi eventi: concerti, tour notturni, mostre, laboratori e degustazioni. Chiedimi di uno specifico!'
    },
    {
        chiavi: ['gratis', 'gratuito', 'free', 'economico', 'poco'],
        testo: '💶 Gli eventi gratuiti: <b>Aperitivo in Jazz</b> (libero con consumazione) e <b>Mercato al Rialto</b> (ingresso gratuito). Lo yoga è a donazione libera.'
    },
    {
        chiavi: ['sport', 'attivit', 'fisic', 'attivo'],
        testo: '🏃 Per le attività fisiche: <b>Vogata al tramonto</b> (€40) e <b>Yoga ai Giardini</b> (donazione libera).'
    },
    {
        chiavi: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'aiuto', 'help'],
        testo: 'Ciao! 👋 Sono il chatbot di <b>Progetto GetUp</b>. Chiedimi degli eventi di maggio a Venezia!'
    }
];

const DEFAULT_RISPOSTA = 'Non ho trovato informazioni su questo. Prova a chiedermi di <b>musica</b>, <b>tour</b>, <b>arte</b>, <b>sport</b> o <b>gastronomia</b> a Venezia!';

// ─────────────────────────────────────────────
//  trova_risposta(input)
//  Normalizza il testo (minuscolo, senza accenti)
//  e cerca una corrispondenza nelle chiavi
// ─────────────────────────────────────────────
function trova_risposta(input) {
    const testo = input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    for (const r of risposte) {
        if (r.chiavi.some(k => testo.includes(k))) return r.testo;
    }
    return DEFAULT_RISPOSTA;
}

// ─────────────────────────────────────────────
//  aggiungi_messaggio(testo, tipo)
//  tipo: "user" | "bot"
//  Per i messaggi bot usa innerHTML (supporta <b>),
//  per l'utente usa textContent (più sicuro)
// ─────────────────────────────────────────────
function aggiungi_messaggio(testo, tipo) {
    const risposta = document.getElementById('risposta');
    const div = document.createElement('div');
    div.className = 'messaggio messaggio-' + tipo;

    if (tipo === 'bot') div.innerHTML  = testo;
    else                div.textContent = testo;

    risposta.appendChild(div);
    risposta.scrollTop = risposta.scrollHeight;
}

// ─────────────────────────────────────────────
//  mostra_typing() / rimuovi_typing()
//  Tre puntini animati mentre il bot "scrive"
// ─────────────────────────────────────────────
function mostra_typing() {
    const risposta = document.getElementById('risposta');
    const div = document.createElement('div');
    div.className = 'messaggio messaggio-bot messaggio-typing';
    div.id = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    risposta.appendChild(div);
    risposta.scrollTop = risposta.scrollHeight;
}

function rimuovi_typing() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
}

// ─────────────────────────────────────────────
//  invia(testo)
//  Mostra il messaggio utente, simula il typing,
//  poi risponde dopo un ritardo casuale
// ─────────────────────────────────────────────
function invia(testo) {
    if (!testo.trim()) return;

    aggiungi_messaggio(testo, 'user');
    document.getElementById('user-text').value = '';

    mostra_typing();
    setTimeout(() => {
        rimuovi_typing();
        aggiungi_messaggio(trova_risposta(testo), 'bot');
    }, 700 + Math.random() * 500);
}

// ─────────────────────────────────────────────
//  AVVIO
// ─────────────────────────────────────────────
window.onload = function () {
    aggiungi_messaggio('Ciao! 👋 Sono il chatbot di <b>Progetto GetUp</b>. Chiedimi degli eventi di maggio a Venezia!', 'bot');

    document.getElementById('user-text').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            invia(this.value);
        }
    });

    document.getElementById('invia-btn').addEventListener('click', function () {
        invia(document.getElementById('user-text').value);
    });
};