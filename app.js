let arr = [];
const eventiPerPagina = 10;
let paginaCorrente    = 0;
let totalePagine      = 0;

fetch('http://127.0.0.1:3000/eventi')
    .then(res => res.json())
    .then(dati => {
        arr.push(...dati);
        totalePagine = Math.ceil(arr.length / eventiPerPagina);
        mostra_pagina(0);
    })
    .catch(err => {
        document.getElementById("eventi").innerHTML = "Errore nel caricamento dei dati.";
        console.error(err);
    });

function mostra_pagina(n) {
    paginaCorrente = n;

    const inizio = n * eventiPerPagina;
    const fine   = inizio + eventiPerPagina;

    const div_eventi = document.getElementById("eventi");
    div_eventi.innerHTML = "";

    arr.slice(inizio, fine).forEach(evento => {
        const card = document.createElement("div");
        card.className = "evento-card";
        
		card.innerHTML = `
			<div class="evento-nome">${evento.nome}</div>
			<div class="evento-info">
		`;

		evento.date_time.forEach(dt => {
			card.innerHTML += `
				<span>${stringDate(new Date(dt.st))} - ${stringDate(new Date(dt.en))}</span>
			`;
		});

		card.innerHTML += `
				<span>${evento.luogo.name}</span>
			</div>
			<div class="evento-desc">${evento.desc}</div>
			<div class="evento-tags">
				${evento.tags.map(t => `<span class="tag">${t}</span>`).join("")}
			</div>
			<div class="evento-targets">
				${evento.targets.map(t => `<span class="targets">${t}</span>`).join("")}
			</div>
			<div class="evento-img">
		`;

		evento.imgs.forEach(img => {
			card.innerHTML += `
				<img src="${img.src}" alt="${img.alt}" />
			`;
		});

		card.innerHTML+= `
			</div>
			<div class="evento-rank">
				Valutazione: ${evento.rank.stars}/5
			</div>
		`;
		
        div_eventi.appendChild(card);
    });

    aggiorna_paginazione();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function aggiorna_paginazione() {
    const nav = document.getElementById("paginazione");
    nav.innerHTML = "";

    const prev = document.createElement("button");
    prev.textContent = "← Precedente";
    prev.className = "pagina-btn pagina-testo";
    prev.disabled = paginaCorrente === 0;
    prev.addEventListener("click", () => mostra_pagina(paginaCorrente - 1));
    nav.appendChild(prev);

    for (let i = 0; i < totalePagine; i++) {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.className = "pagina-btn" + (i === paginaCorrente ? " pagina-attiva" : "");
        btn.addEventListener("click", () => mostra_pagina(i));
        nav.appendChild(btn);
    }

    const next = document.createElement("button");
    next.textContent = "Successivo →";
    next.className = "pagina-btn pagina-testo";
    next.disabled = paginaCorrente === totalePagine - 1;
    next.addEventListener("click", () => mostra_pagina(paginaCorrente + 1));
    nav.appendChild(next);
}

function stringDate(when){
	let dd = when.getDate();
	if(dd < 10)
		dd = "0" + dd;

	let mm = when.getMonth();
	if(mm < 10)
		mm = "0" + mm;

	let yyyy = when.getFullYear();

	let hh = when.getHours();
	if(hh < 10)
		hh = "0" + hh;

	let min = when.getMinutes();
	if(min < 10)
		min = "0" + min;

	return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
