// ─────────────────────────────────────────────
//  api.js — utility condivise: configurazione
//  API Strapi, sessione utente, escape, date,
//  hashing password.
//  Da includere PRIMA degli script di pagina.
// ─────────────────────────────────────────────

const API_BASE = 'https://strapi.brusegan.it/api';
const TOKEN    = 'Bearer cff92e74316f57f7cd63ce9f93cf8fb309f0f15f673ed41d81afe4f1569a81f88d6b1b4268a94f97e5eb52802a1e1b49ac6702c060f1b96d1d02fa3103f84df65445e2307cd5f15b3ccb141fc91147470465304d44d6f53784989b971c4468aa6932c0b9dc3ed37da4a33e2cd58fcb9fdb87863ead235adca7c87513f47f6e1c';
const HEADERS  = {
    'Authorization': TOKEN,
    'Content-Type':  'application/json'
};

// ─── Sessione utente ─────────────────────────
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("utenteLoggato"));
    } catch (e) {
        return null;
    }
}

function isOrganizzatore() {
    const u = getCurrentUser();
    return !!(u && u.ruolo === "organizzatore");
}

// ─── Escape HTML (anti-XSS) ──────────────────
function escHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ─── Formattazione date ──────────────────────
// Gestisce sia il formato custom Strapi "YYYYMMDDThh:mm:ssUTC±HH"
// sia il formato ISO standard "2026-05-19T15:45:00.000Z" sia oggetti Date.
function stringDate(when) {
    let d;
    if (typeof when === "string") {
        const m = when.match(/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})UTC([+-]\d{2})$/);
        if (m) {
            d = new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${m[7]}:00`);
        } else {
            d = new Date(when);
        }
    } else if (when instanceof Date) {
        d = when;
    } else {
        return "—";
    }
    if (isNaN(d)) return "—";

    const dd  = String(d.getDate()).padStart(2, "0");
    const mm  = String(d.getMonth() + 1).padStart(2, "0");
    const hh  = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear()} ${hh}:${min}`;
}

// ─── Hashing password (SHA-256, hex) ─────────
async function hashPassword(plain) {
    const data = new TextEncoder().encode(plain);
    const buf  = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Vero se la stringa sembra un digest SHA-256 (64 caratteri esadecimali)
function isHashed(value) {
    return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
}
