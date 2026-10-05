const pages = [
  ["index.html", "Home"],
  ["chats.html", "Chats"],
  ["past-papers.html", "Past Papers"],
  ["holiday-packages.html", "Holiday Packages"],
  ["notes.html", "Notes"],
  ["announcements.html", "Announcements"],
  ["movies.html", "Movies"],
  ["music.html", "Music Vibes"],
  ["trending.html", "Trending"],
  ["photos.html", "Photos"],
  ["academics.html", "Academics"],
  ["sports.html", "Sports"],
  ["clubs.html", "Clubs"],
  ["library.html", "Library"],
  ["staff.html", "Staff"],
  ["events.html", "Events"],
  ["admissions.html", "Admissions"],
  ["contact.html", "Contact"]
];

function markNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
}

function wireFilters(selector, attr) {
  const chips = document.querySelectorAll(selector);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      const value = chip.dataset.filter;
      document.querySelectorAll("[data-item]").forEach((item) => {
        const ok = value === "all" || item.dataset[attr] === value || (item.dataset.tags || "").includes(value);
        item.style.display = ok ? "" : "none";
      });
    });
  });
}

function wireModals() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.querySelector(btn.dataset.open);
      if (!modal) return;
      const title = modal.querySelector("[data-title]");
      const body = modal.querySelector("[data-body]");
      if (title && btn.dataset.title) title.textContent = btn.dataset.title;
      if (body && btn.dataset.body) body.textContent = btn.dataset.body;
      modal.classList.add("open");
    });
  });
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".modal, .lightbox").classList.remove("open"));
  });
}

function wireChat() {
  const rooms = document.querySelectorAll("[data-room]");
  const log = document.querySelector("[data-log]");
  const form = document.querySelector("[data-chat-form]");
  if (!rooms.length || !log || !form) return;
  let room = "ridge-house";
  const seed = {
    "ridge-house": [{ who: "Prefect Amina", text: "Ridge House meeting is Thursday after prep. Bring your reading log." }],
    "science": [{ who: "Lab captain", text: "S4 practical groups are on the notice beside the physics lab." }],
    "study": [{ who: "Librarian", text: "Quiet hour in the reading room is 7:00 to 8:30 tonight." }],
    "sports": [{ who: "Games tutor", text: "Netball trial list goes up Friday at the pavilion." }]
  };
  const saved = JSON.parse(localStorage.getItem("hshs-chats") || "{}");
  function render() {
    const items = saved[room] || seed[room] || [];
    log.innerHTML = items.map((m) => `<div class="bubble ${m.me ? "me" : ""}"><strong>${m.who}</strong><br>${m.text}</div>`).join("");
    log.scrollTop = log.scrollHeight;
  }
  rooms.forEach((btn) => btn.addEventListener("click", () => {
    rooms.forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    room = btn.dataset.room;
    render();
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    saved[room] = saved[room] || (seed[room] || []).slice();
    saved[room].push({ who: "You", text, me: true });
    localStorage.setItem("hshs-chats", JSON.stringify(saved));
    input.value = "";
    render();
  });
  render();
}

function wireMusic() {
  const tracks = document.querySelectorAll("[data-track]");
  const label = document.querySelector("[data-now]");
  const wave = document.querySelector("[data-wave]");
  if (!tracks.length) return;
  let ctx, timer;
  function stop() {
    if (timer) clearInterval(timer);
    if (ctx) ctx.close();
    ctx = null;
    wave?.classList.remove("play");
  }
  tracks.forEach((btn) => btn.addEventListener("click", async () => {
    tracks.forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    stop();
    label.textContent = btn.dataset.track;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    const notes = JSON.parse(btn.dataset.notes);
    let i = 0;
    wave?.classList.add("play");
    timer = setInterval(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = notes[i % notes.length];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
      i += 1;
    }, 380);
  }));
}

function wireContact() {
  const form = document.querySelector("[data-contact]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) return;
    const box = document.querySelector("[data-notice]");
    box.textContent = `Thank you, ${data.name}. The front office has your note about ${data.topic}.`;
    box.classList.add("show");
    form.reset();
  });
}

function wireSearch() {
  const input = document.querySelector("[data-search]");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = input.value.toLowerCase();
    const map = {
      chat: "chats.html", paper: "past-papers.html", holiday: "holiday-packages.html",
      note: "notes.html", announce: "announcements.html", movie: "movies.html",
      music: "music.html", trend: "trending.html", photo: "photos.html",
      sport: "sports.html", club: "clubs.html", book: "library.html",
      staff: "staff.html", event: "events.html", admission: "admissions.html",
      contact: "contact.html", academic: "academics.html"
    };
    const hit = Object.keys(map).find((k) => q.includes(k));
    location.href = hit ? map[hit] : "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markNav();
  wireFilters("[data-filter]", "kind");
  wireModals();
  wireChat();
  wireMusic();
  wireContact();
  wireSearch();
  const toggle = document.querySelector("[data-menu]");
  toggle?.addEventListener("click", () => document.querySelector(".nav-wrap").classList.toggle("closed"));
});
