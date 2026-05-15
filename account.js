// hashPassword(), isHashed() e altre utility provengono da api.js.

async function account(tipo) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Compila tutti i campi!");
        return;
    }

    if (tipo === "registrazione") {
        const risultato = validaInput(username, password);
        if (!risultato.valido) {
            alert(risultato.errore);
            return;
        }
        await registrazione(username, password);
    } else if (tipo === "login") {
        await login(username, password);
    }
}

async function registrazione(username, password) {
    const radio = document.querySelector('input[name="ruolo"]:checked');
    if (!radio) {
        alert("Seleziona un ruolo.");
        return;
    }
    const ruolo = radio.value;
    let utenti = JSON.parse(localStorage.getItem("utenti")) || [];

    if (utenti.find(u => u.username === username)) {
        alert("Username già in uso!");
        return;
    }

    const passwordHash = await hashPassword(password);
    const nuovoUtente  = { id: Date.now(), username, password: passwordHash, ruolo };

    utenti.push(nuovoUtente);
    localStorage.setItem("utenti",        JSON.stringify(utenti));
    localStorage.setItem("utenteLoggato", JSON.stringify(nuovoUtente));
    alert("Registrazione completata!");
    window.location.href = "Index.html";
}

async function login(username, password) {
    let utenti = JSON.parse(localStorage.getItem("utenti")) || [];
    const candidato = utenti.find(u => u.username === username);

    if (!candidato) {
        alert("Riprova, credenziali errate o utente non registrato");
        return;
    }

    const inputHash = await hashPassword(password);
    let valido = false;

    if (isHashed(candidato.password)) {
        // Confronto fra hash
        valido = candidato.password === inputHash;
    } else {
        // Utente "legacy" registrato prima dell'introduzione dell'hashing:
        // confronto in chiaro e migrazione trasparente.
        if (candidato.password === password) {
            valido = true;
            candidato.password = inputHash;
        }
    }

    if (!valido) {
        alert("Riprova, credenziali errate o utente non registrato");
        return;
    }

    if (!candidato.id) candidato.id = Date.now();
    localStorage.setItem("utenti",        JSON.stringify(utenti));
    localStorage.setItem("utenteLoggato", JSON.stringify(candidato));
    window.location.href = "Index.html";
}

function validaInput(username, password) {
    const regexUser = /^(?=.*[a-zA-Z])[a-zA-Z0-9._-]+$/;
    const regexPswrd = /^(?=.*[0-9]).+$/;

    if (username.length < 3) {
        return { valido: false, errore: "username troppo corto, min 3 caratteri" };
    }
    if (!regexUser.test(username)) {
        return { valido: false, errore: "lo username deve contenere caratteri alfanumerici [a-z][0-9]" };
    }
    if (password.length < 8) {
        return { valido: false, errore: "password troppo corta, min 8 caratteri" };
    }
    if (!regexPswrd.test(password)) {
        return { valido: false, errore: "password non valida, inserire almeno un numero" };
    }

    return { valido: true };
}

function mostraLoginPage() {
    const main = document.querySelector("main");

    main.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h2>Login</h2>
                <input id="username" type="text" placeholder="Username">
                <input id="password" type="password" placeholder="Password">
                <button onclick="account('login')">Accedi</button>
                <p>Non hai un account?
                    <span onclick="mostraRegistrazionePage()" class="link">Registrati</span>
                </p>
            </div>
        </div>
    `;
}

function mostraRegistrazionePage() {
    const main = document.querySelector("main");

    main.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h2>Registrazione</h2>
                <input id="username" type="text" placeholder="Username">
                <input id="password" type="password" placeholder="Password">
                <label><input type="radio" name="ruolo" value="utente" checked> Utente</label>
                <label><input type="radio" name="ruolo" value="organizzatore"> Organizzatore</label>
                <button onclick="account('registrazione')">Registrati</button>
                <p>Hai già un account?
                    <span onclick="mostraLoginPage()" class="link">Login</span>
                </p>
            </div>
        </div>
    `;
}


document.addEventListener("DOMContentLoaded", function () {
    if (!window.location.href.includes("login.html")) return;

    mostraLoginPage();

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        const box = document.querySelector(".login-box h2");
        if (!box) return;
        const tipo = box.textContent === "Login" ? "login" : "registrazione";
        account(tipo);
    });
});
