// Foco · temporizador Pomodoro + tareas de estudio
// Todo se guarda en localStorage para que la app funcione sin internet.

const $ = (id) => document.getElementById(id);
const CLAVE = "foco-datos";
const hoy = () => new Date().toISOString().slice(0, 10);

const estado = leer();
let minutosModo = 25;
let restante = 25 * 60;
let intervalo = null;
let finEsperado = null;

function leer() {
  const base = { tareas: [], dia: hoy(), sesiones: 0, minutos: 0 };
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE)) || base;
    if (d.dia !== hoy()) { d.dia = hoy(); d.sesiones = 0; d.minutos = 0; }
    return { ...base, ...d };
  } catch { return base; }
}
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch { /* sin almacenamiento */ } }

function formato(seg) {
  const m = String(Math.floor(seg / 60)).padStart(2, "0");
  const s = String(seg % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function pintarReloj() {
  $("tiempo").textContent = formato(restante);
  const total = minutosModo * 60;
  $("barra").style.width = `${((total - restante) / total) * 100}%`;
  document.title = intervalo ? `${formato(restante)} · Foco` : "Foco · Temporizador de estudio";
}

function terminar() {
  clearInterval(intervalo); intervalo = null;
  $("iniciar").textContent = "Iniciar";
  if (minutosModo === 25) {
    estado.sesiones += 1; estado.minutos += 25; guardar(); pintarStats();
    $("aviso").textContent = "¡Sesión de enfoque completa! Toma una pausa.";
  } else {
    $("aviso").textContent = "Pausa terminada. ¿Seguimos?";
  }
  if ("vibrate" in navigator) navigator.vibrate(300);
  restante = minutosModo * 60; pintarReloj();
}

function alternar() {
  if (intervalo) {
    clearInterval(intervalo); intervalo = null;
    $("iniciar").textContent = "Continuar";
    return;
  }
  $("aviso").textContent = "";
  finEsperado = Date.now() + restante * 1000;
  $("iniciar").textContent = "Pausar";
  intervalo = setInterval(() => {
    restante = Math.max(0, Math.round((finEsperado - Date.now()) / 1000));
    pintarReloj();
    if (restante === 0) terminar();
  }, 250);
}

function cambiarModo(btn) {
  document.querySelectorAll(".modo").forEach((b) => { b.classList.remove("activo"); b.setAttribute("aria-pressed", "false"); });
  btn.classList.add("activo"); btn.setAttribute("aria-pressed", "true");
  clearInterval(intervalo); intervalo = null;
  minutosModo = Number(btn.dataset.min);
  restante = minutosModo * 60;
  $("iniciar").textContent = "Iniciar";
  pintarReloj();
}

function pintarTareas() {
  const ul = $("tareas");
  ul.innerHTML = "";
  estado.tareas.forEach((t, i) => {
    const li = document.createElement("li");
    if (t.hecha) li.classList.add("hecha");
    li.innerHTML = `
      <input type="checkbox" id="t${i}" ${t.hecha ? "checked" : ""} data-i="${i}">
      <label for="t${i}"></label>
      <button type="button" class="borrar" data-borrar="${i}" aria-label="Eliminar tarea">✕</button>`;
    li.querySelector("label").textContent = t.texto;
    ul.appendChild(li);
  });
  pintarStats();
}

function pintarStats() {
  $("s-sesiones").textContent = estado.sesiones;
  $("s-minutos").textContent = estado.minutos;
  $("s-tareas").textContent = estado.tareas.filter((t) => t.hecha).length;
}

function red() {
  const on = navigator.onLine;
  $("red").textContent = on ? "Conectado" : "Sin conexión · todo sigue funcionando";
  $("red").classList.toggle("off", !on);
}

document.addEventListener("DOMContentLoaded", () => {
  pintarReloj(); pintarTareas(); red();
  $("iniciar").addEventListener("click", alternar);
  $("reiniciar").addEventListener("click", () => { clearInterval(intervalo); intervalo = null; restante = minutosModo * 60; $("iniciar").textContent = "Iniciar"; pintarReloj(); });
  document.querySelectorAll(".modo").forEach((b) => b.addEventListener("click", () => cambiarModo(b)));

  $("form-tarea").addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = $("nueva").value.trim();
    if (!texto) return;
    estado.tareas.push({ texto, hecha: false });
    $("nueva").value = "";
    guardar(); pintarTareas();
  });
  $("tareas").addEventListener("change", (e) => {
    const i = e.target.dataset.i; if (i === undefined) return;
    estado.tareas[i].hecha = e.target.checked; guardar(); pintarTareas();
  });
  $("tareas").addEventListener("click", (e) => {
    const i = e.target.dataset.borrar; if (i === undefined) return;
    estado.tareas.splice(Number(i), 1); guardar(); pintarTareas();
  });

  addEventListener("online", red);
  addEventListener("offline", red);
});

if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}
