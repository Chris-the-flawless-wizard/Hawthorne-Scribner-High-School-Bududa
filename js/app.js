const pillLinks = [
  ["index.html", "Home", "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"],
  ["photos.html", "Gallery", "M4 6h16v12H4z M8 14l2.5-3 2 2.5L16 10l4 5"],
  ["photos.html", "Photos", "M5 7h14v10H5z M9 7l1.2-2h3.6L15 7"],
  ["movies.html", "Buzz", "M5 7h10v10H5z M15 10l4-2v8l-4-2z"],
  ["trending.html", "Trending", "M12 4c1 3 3 4 3 7a3 3 0 1 1-6 0c0-1 .4-2 1-3-1 2-1 3 0 4"],
  ["events.html", "Spotlight", "M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8z"],
  ["clubs.html", "Polls", "M5 19V10 M12 19V5 M19 19v-7"],
  ["holiday-packages.html", "Memories", "M12 7v5l3 2 M12 4a8 8 0 1 0 8 8"]
];
const moreLinks = [
  ["past-papers.html", "Past Papers"],
  ["notes.html", "Notes"],
  ["academics.html", "Academics"],
  ["library.html", "Library"],
  ["announcements.html", "Announcements"],
  ["sports.html", "Sports"],
  ["music.html", "Music"],
  ["chats.html", "Chats"],
  ["staff.html", "Staff"],
  ["admissions.html", "Admissions"],
  ["contact.html", "Contact"],
  ["profile.html", "Profile"]
];
function icon(path) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function loadArrange() {
  [["arrange-css", "css/arrange.css"], ["nav-groups-css", "css/nav-groups.css"], ["campus-css", "css/campus.css"], ["world-bar-css", "css/world-bar.css"]].forEach(([id, href]) => {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });
}
function dressWorldBar() {
  const bar = document.querySelector(".topbar");
  if (!bar || bar.dataset.world) return;
  bar.dataset.world = "1";
  bar.classList.add("world-bar");
  const here = location.pathname.split("/").pop() || "index.html";
  const links = pillLinks.map(([href, label, path]) => {
    const active = here === href && label !== "Photos" ? " active" : (here === href && label === "Gallery" ? " active" : "");
    const on = (label === "Home" && here === "index.html") || (label === "Gallery" && here === "photos.html") || (label !== "Home" && label !== "Gallery" && label !== "Photos" && here === href);
    return `<a class="pill-link${on ? " active" : ""}" data-nav href="${href}">${icon(path)}<span>${label}</span></a>`;
  }).join("");
  const more = moreLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  bar.innerHTML = `
    <a class="brand" href="index.html">
      <img class="badge" src="images/badge.png" alt="Hawthorne-Scribner High School badge">
      <div class="nameplate"><strong>HSHS World <span class="check">\u2713</span></strong><span>Campus social</span></div>
    </a>
    <nav class="pill-nav" aria-label="Primary">${links}</nav>
    <form class="search" action="photos.html">
      <input data-search type="search" placeholder="Search posts, students, events..." aria-label="Search pages">
    </form>
    <a class="upload-btn" href="photos.html">+ Upload</a>
    <div class="more-drop">
      <button class="more-btn" type="button" aria-expanded="false">\u00b7\u00b7\u00b7 More</button>
      <div class="nav-menu">${more}</div>
    </div>
    <a class="icon-btn" href="announcements.html" aria-label="Alerts">\uD83D\uDD14</a>
    <a class="icon-btn" href="profile.html" aria-label="Profile">\uD83D\uDC64</a>
  `;
  const drop = bar.querySelector(".more-drop");
  const button = drop.querySelector("button");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = drop.classList.toggle("open");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", () => {
    drop.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  });
}
function markNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.getAttribute("href") === here && a.textContent.includes("Home") && here === "index.html") a.classList.add("active");
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
      contact: "contact.html", academic: "academics.html", profile: "profile.html", login: "login.html"
    };
    const hit = Object.keys(map).find((k) => q.includes(k));
    location.href = hit ? map[hit] : "photos.html";
  });
}
function loadProfile() {
  try { return JSON.parse(localStorage.getItem("hshs-profile") || "null"); }
  catch { return null; }
}
function saveProfile(profile) {
  localStorage.setItem("hshs-profile", JSON.stringify(profile));
}
function defaultAvatar(name) {
  const letter = (name || "H").slice(0, 1).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='160' height='160' rx='32' fill='%231f8a72'/><text x='80' y='98' text-anchor='middle' font-size='72' fill='%23f3d48a' font-family='Georgia'>${letter}</text></svg>`;
  return `data:image/svg+xml,${svg}`;
}
function paintAccount() {
  const profile = loadProfile();
  const slot = document.querySelector(".brand-row");
  if (!slot || document.querySelector("[data-account]")) return;
  const link = document.createElement("a");
  link.className = "nav-btn";
  link.dataset.account = "1";
  link.href = profile ? "profile.html" : "login.html";
  const img = document.createElement("img");
  img.alt = "";
  img.width = 22;
  img.height = 22;
  img.style.borderRadius = "50%";
  img.style.objectFit = "cover";
  img.src = profile?.avatar || defaultAvatar(profile?.username || "Sign in");
  link.append(img, document.createTextNode(profile ? profile.username : "Sign in"));
  slot.insertBefore(link, slot.querySelector("[data-menu]"));
}
function wireLogin() {
  const form = document.querySelector("[data-login]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector("[data-notice]").textContent = "Enter a real email address, like name@school.com.";
      form.querySelector("[data-notice]").classList.add("show");
      return;
    }
    const existing = loadProfile();
    const profile = existing && existing.email === email ? existing : {
      email,
      username: email.split("@")[0].replace(/[._]/g, " "),
      avatar: defaultAvatar(email),
      saved: ["S4 Algebra of the terrace", "S1 field sketch", "Mist over Elgon"]
    };
    saveProfile(profile);
    location.href = "profile.html";
  });
}
function wireProfile() {
  const box = document.querySelector("[data-profile]");
  if (!box) return;
  const profile = loadProfile();
  if (!profile) { location.href = "login.html"; return; }
  box.querySelector("[data-avatar]").src = profile.avatar || defaultAvatar(profile.username);
  box.querySelector("[data-email]").textContent = profile.email;
  box.querySelector("[name=username]").value = profile.username;
  const list = box.querySelector("[data-saved]");
  const renderSaved = () => {
    list.innerHTML = (profile.saved || []).map((item) => `<article class="row card"><div><h3>${item}</h3><p class="tiny">Saved on this device</p></div><button class="btn alt" type="button" data-drop="${item}">Remove</button></article>`).join("") || "<p>No saved desk items yet.</p>";
  };
  renderSaved();
  box.querySelector("[data-pic]").addEventListener("change", () => {
    const file = box.querySelector("[data-pic]").files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      profile.avatar = reader.result;
      box.querySelector("[data-avatar]").src = profile.avatar;
    };
    reader.readAsDataURL(file);
  });
  box.querySelector("[data-save-profile]").addEventListener("click", () => {
    const name = box.querySelector("[name=username]").value.trim();
    if (!name) return;
    profile.username = name;
    saveProfile(profile);
    box.querySelector("[data-profile-notice]").textContent = "Profile saved on this device.";
    box.querySelector("[data-profile-notice]").classList.add("show");
    paintAccount();
  });
  list.addEventListener("click", (e) => {
    const drop = e.target.closest("[data-drop]");
    if (!drop) return;
    profile.saved = profile.saved.filter((item) => item !== drop.dataset.drop);
    saveProfile(profile);
    renderSaved();
  });
  box.querySelector("[data-logout]").addEventListener("click", () => {
    localStorage.removeItem("hshs-profile");
    location.href = "login.html";
  });
}
function wireSaveButtons() {
  document.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const profile = loadProfile();
      if (!profile) { location.href = "login.html"; return; }
      profile.saved = profile.saved || [];
      if (!profile.saved.includes(btn.dataset.save)) profile.saved.push(btn.dataset.save);
      saveProfile(profile);
      btn.textContent = "Saved";
    });
  });
}
function dressMotto() {
  document.querySelectorAll("footer .tiny").forEach((node) => {
    if (node.dataset.motto || !node.textContent.includes("Educate")) return;
    node.dataset.motto = "1";
    node.textContent = node.textContent.replace(/Educate\s*\u00B7\s*Engage\s*\u00B7\s*Empower\.?/, "").trim();
    const row = document.createElement("div");
    row.className = "motto";
    ["Educate", "Engage", "Empower"].forEach((word) => {
      const chip = document.createElement("span");
      chip.textContent = word;
      row.appendChild(chip);
    });
    node.after(row);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadArrange();
  dressWorldBar();
  markNav();
  wireFilters("[data-filter]", "kind");
  wireModals();
  wireChat();
  wireMusic();
  wireContact();
  wireSearch();
  wireLogin();
  wireProfile();
  wireSaveButtons();
  dressMotto();
});
