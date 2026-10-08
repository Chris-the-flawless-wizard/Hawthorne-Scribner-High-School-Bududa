function loadArrange() {
  [["arrange-css", "css/arrange.css"], ["nav-groups-css", "css/nav-groups.css"], ["campus-css", "css/campus.css"]].forEach(([id, href]) => {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });
}
