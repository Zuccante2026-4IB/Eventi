
const oggetto_json = `[
	{
		"nome": "Concerto barocco a San Vidal",
		"data": {
			"y": 2026,
			"m": 5,
			"d": 4,
			"yyyymmdd": 20260504
		},
		"luogo": {
			"nome": "Chiesa di San Vidal",
			"lat": 45.4337,
			"lon": 12.3326
		},
		"orario": "21:00",
		"descrizione": "Concerto di musica barocca con strumenti d’epoca.",
		"tags": ["musica", "classica"],
		"prezzo": {
			"nome": "nomeDebug",
			"prezzoEur": 25.00,
			"condizioni": "condizioneEE"
		}
	},
	{
		"nome": "Tour notturno tra calli e leggende",
		"data": {
			"y": 2026,
			"m": 5,
			"d": 5,
			"yyyymmdd": 20260505
		},
		"luogo": {
			"nome": "Campo Santa Margherita",
			"lat": 45.4342,
			"lon": 12.3229
		},
		"orario": "21:00",
		"descrizione": "Passeggiata guidata tra misteri e leggende veneziane.",
		"tags": ["tour", "storia"],
		"prezzo": {
			"nome": "nomeDebug",
			"prezzoEur": 18.00,
			"condizioni": "condizioneEE"
		}
	},
	{
		"nome": "Mostra fotografica sulla laguna",
		"data": {
			"y": 2026,
			"m": 5,
			"d": 5,
			"yyyymmdd": 20260505
		},
		"luogo": {
			"nome": "Ca' Pesaro",
			"lat": 45.4417,
			"lon": 12.3317
		},
		"orario": "10:00",
		"descrizione": "Esposizione dedicata ai paesaggi della laguna veneta.",
		"tags": ["arte", "mostra"],
		"prezzo": {
			"nome": "nomeDebug",
			"prezzoEur": 12.00,
			"condizioni": "condizioneEE"
		}
	}
]`;

function scrittura_evento() {
	
	let elenco_eventi = JSON.parse(oggetto_json);

	console.log(elenco_eventi);

	const div_eventi = document.getElementById("eventi");
	div_eventi.innerHTML = "";

	elenco_eventi.forEach(evento => {
		div_eventi.innerHTML += `
			<b>Nome</b>: ${evento.nome} <br>
			<b>Data e ora</b>: ${evento.data.d}/${evento.data.m}/${evento.data.y} - ${evento.orario} <br>
			<b>Luogo</b>: ${evento.luogo.nome}
			<br><br>
		`;
	});
}


//*

//Scroll infinito
const arr_size = 1000;
const altezzaViewport = 400;
const altezzaRiga = 30;

const buffer = 3;   //elemnti sopra e sotto la parte visibile

const viewport = document.getElementById("viewport");
const list = document.getElementById("list");
const paddingTop = document.getElementById("top-padding");
const paddingBottom = document.getElementById("bottom-padding");

// dati fake da prova
const arr = new Array(arr_size).fill(null).map((_,i) => ({
    index: i + 1,
    id: Math.random(),
    value: Math.floor(Math.random() * 2 * arr_size),
}));

const visibleCount = Math.ceil(altezzaViewport/altezzaRiga);
function render() {
    const scrollTop = viewport.scrollTop;
    
    let inizioIndex = Math.floor(scrollTop / altezzaRiga) - buffer;
    inizioIndex = Math.max(0, inizioIndex);
    

    let fineIndex = inizioIndex + visibleCount + buffer*2;
    fineIndex = Math.min(arr_size, fineIndex);

    const elementiVisibili = arr.slice(inizioIndex, fineIndex);

    const altezzaTop = inizioIndex*altezzaRiga;
    const altezzaBottom = (arr_size-fineIndex)*altezzaRiga;
    paddingTop.style.height = `${altezzaTop}px`;
    paddingBottom.style.height = `${altezzaBottom}px`;

    list.innerHTML ="";

    elementiVisibili.forEach(item => {
        const div = document.createElement("div");
        div.className = "riga";
        div.textContent = `#${item.index} - ${item.value}`;

        list.appendChild(div);
    });
    
    vie
}

function scroll({oggetto_json, nRighe, altezzaRiga}) {
    const [scrolltop, setScrollTop] = useState(0);

    const gestoreScroll = (e) => {
        e.preventDefault();
        setScrollTop(e.target.scrollTop);
    }
}




function ordinaLuogo(oggetto_json, crescente = true) {
	return [...eventi].sort((a, b) => {
		const nomeA = ()
	})
}

function ordinaData() {

}

function ordinaTipo() {

}

function ordinaGestore() {

}

function ordinaPrezzi() {

}

function ordinaTarget() {

}

function ricerca() {

}


function eventiPassati() {

}

function feedback() {

}

function account() {

}



//*/ 

//METODI ESSENZIALI
/*richiesta API
Gestione lettura-scrittura
Richiesta dell'API -> fetch() [uso di async/await]
Gestione lettura-scrittura
Scroll a caricamento
Filtri/ordinamento
Luogo
Data (orario, a discrezione dell'utente)
Tipo di evento
Gestore
Prezzi
Target
Ricerca
Togliere gli eventi passati
Feedback sugli eventi
Mezzi di trasporto
Account*/

//aggiungi sezioni

window.onload = scrittura_evento;