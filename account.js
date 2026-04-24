
function account(tipo) {
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
        registrazione(username, password);
    } else if (tipo === "login") {
        login(username, password);
    }
}

function registrazione(username, password) {
    const ruolo = document.querySelector('input[name="ruolo"]:checked').value;
    let utenti = JSON.parse(localStorage.getItem("utenti")) || [];

    const esisteGia = utenti.find(u => u.username === username);

    if (esisteGia) {
        alert("Username già in uso!");
        return;
    }
    salvataggio({ username, password, ruolo });
    alert("Registrazione completata!");
}

function login(username, password) {
    let utenti = JSON.parse(localStorage.getItem("utenti")) || [];

    const utenteTrovato = utenti.find(u => u.username === username && u.password === password);

    if (!utenteTrovato) {
        alert("Riprova, credenziali errate o utente non registrato");
    } else {
        localStorage.setItem("utenteLoggato", JSON.stringify(utenteTrovato));
        if (utenteTrovato.ruolo === "organizzatore") {
            window.location.href = "index.html"; // da decidere
        } else {
            window.location.href = "index.html" // da decidere
        }
    }
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

function salvataggio(utente) {
    let utenti = JSON.parse(localStorage.getItem("utenti")) || [];
    utenti.push(utente);
    localStorage.setItem("utenti", JSON.stringify(utenti));
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
    const utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));
    const container = document.getElementById("aggiungi");

    if (container && utenteLoggato && utenteLoggato.ruolo === "organizzatore") {
        container.innerHTML = ` 
            <button> + </button>
        `;
    }

    if (window.location.href.includes("login.html")) {
        mostraLoginPage();

         document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const titolo = document.querySelector(".login-box h2").textContent;
            if (titolo === "Login") {
                account('login');
            } else {
                account('registrazione');
            }
        }
    });
    }
});
