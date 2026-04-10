/* ============================================
   DATI EVENTI
   ============================================ */

const events = [
    {
        nome: "Carnevale di Venezia",
        data: "2026-02-14",
        partecipanti: 300000,
        tipo: "festival",
        luogo: "Centro storico",
        descrizione: "Celebre per maschere e costumi storici"
    },
    {
        nome: "Mostra Internazionale d'Arte Cinematografica",
        data: "2026-09-02",
        partecipanti: 12000,
        tipo: "cinema",
        luogo: "Lido di Venezia",
        descrizione: "Festival del cinema tra i più importanti al mondo"
    },
    {
        nome: "Biennale Arte",
        data: "2026-05-20",
        partecipanti: 500000,
        tipo: "arte",
        luogo: "Giardini e Arsenale",
        descrizione: "Esposizione internazionale d'arte contemporanea"
    },
    {
        nome: "Festa del Redentore",
        data: "2026-07-18",
        partecipanti: 100000,
        tipo: "tradizione",
        luogo: "Bacino di San Marco",
        descrizione: "Spettacolo pirotecnico e celebrazione religiosa"
    },
    {
        nome: "Regata Storica",
        data: "2026-09-06",
        partecipanti: 80000,
        tipo: "sport",
        luogo: "Canal Grande",
        descrizione: "Competizione di voga con corteo storico"
    },
    {
        nome: "Venice Jazz Festival",
        data: "2026-06-10",
        partecipanti: 15000,
        tipo: "musica",
        luogo: "Teatri e piazze",
        descrizione: "Festival dedicato al jazz internazionale"
    }
];

const positiveAspects = [
    "Organizzazione eccellente",
    "Atmosfera straordinaria",
    "Artisti/Performer di qualità",
    "Ubicazione perfetta",
    "Facilità di accesso",
    "Varietà di attività"
];

const improvementAspects = [
    "Troppo affollato",
    "Prezzi elevati",
    "Comunicazione insufficiente",
    "Servizi igienici inadeguati",
    "Parcheggio difficile",
    "Programma poco chiaro"
];

/* ============================================
   STATO GLOBALE
   ============================================ */

let selectedEventIndex = null;
let feedbackData = {};

/* ============================================
   INIZIALIZZAZIONE
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('App inizializzata');
    loadFeedbackData();
    renderEvents();
    setupFormListeners();
});

/* ============================================
   RENDERING EVENTI
   ============================================ */

function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    
    grid.innerHTML = events.map((event, index) => `
        <div class="event-card ${selectedEventIndex === index ? 'selected' : ''}" data-index="${index}">
            <div class="event-badge">${event.tipo}</div>
            <div class="event-name">${event.nome}</div>
            <div class="event-meta">📅 ${formatDate(event.data)}</div>
            <div class="event-meta">📍 ${event.luogo}</div>
            <div class="event-meta">👥 ${formatNumber(event.partecipanti)} partecipanti</div>
            <div class="event-description">${event.descrizione}</div>
            <button type="button" class="event-select-btn" onclick="selectEvent(${index})">
                ${selectedEventIndex === index ? '✓ Selezionato' : 'Seleziona'}
            </button>
        </div>
    `).join('');
}

/* ============================================
   SELEZIONE EVENTO
   ============================================ */

function selectEvent(index) {
    selectedEventIndex = index;
    renderEvents();
    renderFeedbackForm();
    updateStats();
    
    // Mostra la sezione feedback
    const feedbackSection = document.getElementById('feedbackSection');
    feedbackSection.classList.add('active');
    
    // Scroll alla sezione feedback
    setTimeout(() => {
        feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function closeFeedback() {
    selectedEventIndex = null;
    document.getElementById('feedbackSection').classList.remove('active');
    renderEvents();
}

/* ============================================
   RENDERING FORM
   ============================================ */

function renderFeedbackForm() {
    const event = events[selectedEventIndex];
    
    // Aggiorna header
    document.getElementById('eventTitle').textContent = event.nome;
    document.getElementById('eventInfo').textContent = `${event.tipo.toUpperCase()} • ${event.luogo}`;
    
    // Rendering rating buttons
    renderRatingButtons();
    
    // Rendering positive aspects
    renderAspectCheckboxes('positive');
    
    // Rendering improvement aspects
    renderAspectCheckboxes('improvement');
    
    // Carica dati salvati se esistono
    loadFormData();
}

function renderRatingButtons() {
    const container = document.getElementById('ratingContainer');
    const currentRating = feedbackData[selectedEventIndex]?.rating || null;
    
    container.innerHTML = [1, 2, 3, 4, 5].map(rating => `
        <button 
            type="button" 
            class="rating-btn ${currentRating === rating ? 'selected' : ''}"
            onclick="setRating(${rating})">
            ${'⭐'.repeat(rating)}
        </button>
    `).join('');
}

function renderAspectCheckboxes(type) {
    const aspects = type === 'positive' ? positiveAspects : improvementAspects;
    const containerId = type === 'positive' ? 'positiveAspectsContainer' : 'improvementAspectsContainer';
    const container = document.getElementById(containerId);
    
    const selectedAspects = feedbackData[selectedEventIndex]?.[type === 'positive' ? 'positiveAspects' : 'improvementAspects'] || [];
    
    container.innerHTML = aspects.map((aspect, index) => `
        <div class="checkbox-item">
            <input 
                type="checkbox" 
                id="${type}_${index}" 
                value="${aspect}"
                ${selectedAspects.includes(aspect) ? 'checked' : ''}
                onchange="updateAspects('${type}', this)">
            <label for="${type}_${index}">${aspect}</label>
        </div>
    `).join('');
}

/* ============================================
   GESTIONE RATING
   ============================================ */

function setRating(rating) {
    if (!feedbackData[selectedEventIndex]) {
        feedbackData[selectedEventIndex] = {};
    }
    feedbackData[selectedEventIndex].rating = rating;
    saveFeedbackData();
    renderRatingButtons();
}

/* ============================================
   GESTIONE ASPETTI
   ============================================ */

function updateAspects(type, checkbox) {
    if (!feedbackData[selectedEventIndex]) {
        feedbackData[selectedEventIndex] = {};
    }
    
    const key = type === 'positive' ? 'positiveAspects' : 'improvementAspects';
    
    if (!feedbackData[selectedEventIndex][key]) {
        feedbackData[selectedEventIndex][key] = [];
    }
    
    if (checkbox.checked) {
        if (!feedbackData[selectedEventIndex][key].includes(checkbox.value)) {
            feedbackData[selectedEventIndex][key].push(checkbox.value);
        }
    } else {
        feedbackData[selectedEventIndex][key] = feedbackData[selectedEventIndex][key].filter(v => v !== checkbox.value);
    }
    
    saveFeedbackData();
}

/* ============================================
   SETUP FORM LISTENERS
   ============================================ */

function setupFormListeners() {
    const form = document.getElementById('feedbackForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitFeedback();
    });
    
    form.addEventListener('reset', function() {
        setTimeout(() => {
            renderFeedbackForm();
        }, 0);
    });
}

/* ============================================
   INVIO FEEDBACK
   ============================================ */

function submitFeedback() {
    // Validazione
    const data = feedbackData[selectedEventIndex];
    
    if (!data?.rating) {
        alert('⚠️ Per favore, seleziona una valutazione');
        return;
    }
    
    if (!data?.positiveAspects || data.positiveAspects.length === 0) {
        alert('⚠️ Per favore, seleziona almeno un aspetto positivo');
        return;
    }
    
    if (!data?.improvementAspects || data.improvementAspects.length === 0) {
        alert('⚠️ Per favore, seleziona almeno un aspetto da migliorare');
        return;
    }
    
    // Salva dati form
    const comment = document.getElementById('commentInput').value;
    const name = document.getElementById('nameInput').value;
    
    feedbackData[selectedEventIndex].comment = comment;
    feedbackData[selectedEventIndex].name = name;
    feedbackData[selectedEventIndex].timestamp = new Date().toISOString();
    
    // Salva nel localStorage
    saveFeedbackData();
    
    // Aggiorna UI
    updateStats();
    renderFeedbackList();
    
    // Mostra messaggio di successo
    showSuccessMessage();
    
    // Resetta form
    document.getElementById('feedbackForm').reset();
    renderFeedbackForm();
}

function showSuccessMessage() {
    const alert = document.getElementById('successAlert');
    alert.style.display = 'flex';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 4000);
}

/* ============================================
   CARICAMENTO DATI FORM
   ============================================ */

function loadFormData() {
    const data = feedbackData[selectedEventIndex];
    
    if (data) {
        document.getElementById('commentInput').value = data.comment || '';
        document.getElementById('nameInput').value = data.name || '';
    } else {
        document.getElementById('commentInput').value = '';
        document.getElementById('nameInput').value = '';
    }
}

/* ============================================
   STATISTICHE
   ============================================ */

function updateStats() {
    const allFeedback = Object.values(feedbackData).filter(f => f.timestamp);
    
    if (allFeedback.length === 0) {
        document.getElementById('statsGrid').innerHTML = '';
        return;
    }
    
    const avgRating = (allFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / allFeedback.length).toFixed(1);
    const positiveCount = allFeedback.filter(f => f.rating >= 4).length;
    
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${avgRating}</div>
            <div class="stat-label">Valutazione Media</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${allFeedback.length}</div>
            <div class="stat-label">Feedback Totali</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${positiveCount}</div>
            <div class="stat-label">Feedback Positivi (4-5 ⭐)</div>
        </div>
    `;
}

/* ============================================
   LISTA FEEDBACK
   ============================================ */

function renderFeedbackList() {
    const allFeedback = Object.entries(feedbackData)
        .filter(([_, f]) => f.timestamp)
        .map(([idx, f]) => ({
            event: events[idx].nome,
            ...f
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (allFeedback.length === 0) {
        document.getElementById('feedbackListSection').innerHTML = '';
        return;
    }
    
    const html = `
        <h3 class="feedback-list-title">📝 Feedback Recenti (${allFeedback.length})</h3>
        ${allFeedback.map(f => `
            <div class="feedback-item">
                <div class="feedback-item-header">
                    <div class="feedback-item-rating">${'⭐'.repeat(f.rating)} ${f.rating}/5</div>
                    <div class="feedback-item-timestamp">${formatDateTime(f.timestamp)}</div>
                </div>
                ${f.name ? `<div class="feedback-item-name">— ${f.name}</div>` : ''}
                ${f.comment ? `<div class="feedback-item-text">"${f.comment}"</div>` : ''}
                <div class="feedback-item-aspects">
                    ${f.positiveAspects?.map(a => `<span class="aspect-tag positive">✓ ${a}</span>`).join('')}
                    ${f.improvementAspects?.map(a => `<span class="aspect-tag negative">⚠ ${a}</span>`).join('')}
                </div>
            </div>
        `).join('')}
    `;
    
    document.getElementById('feedbackListSection').innerHTML = html;
}

/* ============================================
   STORAGE
   ============================================ */

function saveFeedbackData() {
    try {
        localStorage.setItem('eventFeedback', JSON.stringify(feedbackData));
        console.log('Dati salvati');
    } catch (e) {
        console.error('Errore nel salvataggio:', e);
    }
}

function loadFeedbackData() {
    try {
        const saved = localStorage.getItem('eventFeedback');
        if (saved) {
            feedbackData = JSON.parse(saved);
            console.log('Dati caricati:', feedbackData);
        }
    } catch (e) {
        console.error('Errore nel caricamento:', e);
        feedbackData = {};
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatNumber(num) {
    return num.toLocaleString('it-IT');
}