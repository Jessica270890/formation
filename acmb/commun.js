// Shared helpers for the ACMB training space
const ACMB = (() => {
  const store = {
    get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } },
    set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  };
  // training session code: from the QR code (?s=), else remembered on this phone
  const fromUrl = (new URLSearchParams(location.search).get("s") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 12);
  if (fromUrl) store.set("acmb-session", fromUrl);
  const session = fromUrl || store.get("acmb-session") || "";
  const withS = href => {
    if (!session) return href;
    const [base, hash] = href.split("#");
    return base + (base.includes("?") ? "&" : "?") + "s=" + session + (hash ? "#" + hash : "");
  };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function toast(msg){
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
  }
  async function copy(text){
    try { await navigator.clipboard.writeText(text); toast("Copié : vous pouvez le coller dans un e-mail ou un document."); }
    catch(e){
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Copié."); } catch(_) { toast("Copie impossible : faites une capture d'écran."); }
      ta.remove();
    }
  }
  function linkify(){ document.querySelectorAll("a[data-keep]").forEach(a => a.href = withS(a.getAttribute("href"))); }
  document.addEventListener("DOMContentLoaded", linkify);
  return { store, session, withS, esc, toast, copy };
})();
