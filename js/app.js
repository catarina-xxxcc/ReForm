/* ============================================================
   ReForm — Router, sheet layer, bootstrap
   ============================================================ */
(function () {
  "use strict";

  const U = ReForm.util;
  const C = ReForm.components;

  const app = document.getElementById("app");
  const nav = document.getElementById("bottomnav");
  const phone = document.getElementById("phone");
  const sheetRoot = document.getElementById("sheet-root");

  const stack = [];
  let currentUnmount = null;

  /* ---------------- Render ---------------- */
  function render(name, params, transition) {
    const def = ReForm.screens[name];
    if (!def) { console.warn("[ReForm] unknown screen:", name); return; }

    if (currentUnmount) {
      try { currentUnmount(); } catch (e) { /* noop */ }
      currentUnmount = null;
    }

    const view = def.render(params || {});
    const el = view.el;
    if (transition) el.classList.add("is-" + transition);
    app.innerHTML = "";
    app.appendChild(el);
    if (view.mount) view.mount(el, params || {});
    currentUnmount = view.unmount || null;

    if (def.nav) {
      nav.hidden = false;
      nav.innerHTML = C.bottomNav(def.nav);
    } else {
      nav.hidden = true;
    }
    app.scrollTop = 0;
  }

  /* ---------------- Router ---------------- */
  const router = {
    go: function (name, params, opts) {
      const o = opts || {};
      if (o.root) stack.length = 0;
      stack.push({ name: name, params: params || {} });
      render(name, params, o.transition || (o.root ? "fade" : "push"));
    },
    replace: function (name, params, opts) {
      const o = opts || {};
      if (stack.length) stack.pop();
      stack.push({ name: name, params: params || {} });
      render(name, params, o.transition || "fade");
    },
    back: function (target) {
      stack.pop();
      while (target && stack.length > 1 && stack[stack.length - 1].name !== target) stack.pop();
      if (!stack.length) {
        router.go(target || "home", {}, { root: true });
        return;
      }
      const s = stack[stack.length - 1];
      render(s.name, s.params || {}, "pop");
    },
    current: function () {
      return stack.length ? stack[stack.length - 1].name : null;
    }
  };

  /* ---------------- Sheet ---------------- */
  function openSheet(opts) {
    const o = opts || {};
    const wrap = U.el('<div class="sheet" role="dialog" aria-modal="true"></div>');
    const backdrop = U.el('<button class="sheet__backdrop" aria-label="Close"></button>');
    const panel = U.el(
      '<div class="sheet__panel"><div class="sheet__grip"></div>' +
      '<div class="sheet__content"></div><div class="sheet__actions"></div></div>'
    );
    panel.querySelector(".sheet__content").innerHTML = o.content || "";

    const actions = o.actions || [];
    if (actions.length) {
      panel.querySelector(".sheet__actions").innerHTML =
        '<div class="btn-row" style="margin-top:20px">' +
        actions.map(function (a) {
          return C.button({ label: a.label, variant: a.variant, action: a.action });
        }).join("") + "</div>";
    }

    wrap.appendChild(backdrop);
    wrap.appendChild(panel);
    sheetRoot.appendChild(wrap);

    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      wrap.classList.add("is-closing");
      setTimeout(function () { wrap.remove(); }, 240);
    }

    U.on(wrap, "click", "[data-act]", function (e, t) {
      if (o.onAction) o.onAction(t.getAttribute("data-act"), close, t);
    });
    if (o.dismissible !== false) backdrop.addEventListener("click", close);

    return { close: close, el: wrap };
  }

  /* ---------------- Bottom navigation ---------------- */
  U.on(nav, "click", "[data-tab]", function (e, t) {
    const key = t.getAttribute("data-tab");
    if (router.current() === key) {
      app.scrollTop = 0;
      return;
    }
    router.go(key, {}, { root: true, transition: "fade" });
  });

  /* ---------------- Status bar ---------------- */
  function setupStatusBar() {
    const bar = document.getElementById("statusbar");
    if (!bar) return;
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
    if (isMobileUA || standalone) return;
    phone.classList.add("phone--mockbar");
    bar.innerHTML =
      '<span class="statusbar__time">9:41</span>' +
      '<span class="statusbar__right">' + ReForm.iconSignal() +
      ReForm.icon("wifi", { size: 16 }) + ReForm.iconBattery() + "</span>";
  }

  /* ---------------- Boot ---------------- */
  function init() {
    setupStatusBar();
    ReForm.router = router;
    ReForm.sheet = { open: openSheet };
    router.go("onboarding", {}, { root: true });

    if ("serviceWorker" in navigator && /^(https?:)?\/\//.test(location.protocol === "file:" ? "x" : location.href)) {
      const ok = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
      if (ok) navigator.serviceWorker.register("sw.js").catch(function () { /* noop */ });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
