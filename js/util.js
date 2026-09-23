/* ============================================================
   ReForm — Utilities
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  const U = {};

  /** Build a DOM element from an HTML string. */
  U.el = function (html) {
    const t = document.createElement("template");
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild;
  };

  /** Build a DocumentFragment from an HTML string. */
  U.frag = function (html) {
    const t = document.createElement("template");
    t.innerHTML = String(html).trim();
    return t.content;
  };

  U.$ = (sel, root) => (root || document).querySelector(sel);
  U.$$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /** Event delegation: U.on(root, 'click', '[data-act]', fn) */
  U.on = function (root, type, selector, handler) {
    root.addEventListener(type, function (e) {
      const target = e.target.closest(selector);
      if (target && root.contains(target)) handler(e, target);
    });
  };

  U.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  U.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  U.clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /** Restart a CSS animation on an element. */
  U.replay = function (node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  };

  U.formatTime = function (date) {
    const h = date.getHours();
    const m = date.getMinutes();
    return h + ":" + String(m).padStart(2, "0");
  };

  /** Toast notification */
  U.toast = function (message, duration) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const node = U.el('<div class="toast">' + U.esc(message) + "</div>");
    root.appendChild(node);
    const life = duration || 2200;
    setTimeout(function () {
      node.classList.add("is-out");
      setTimeout(function () {
        node.remove();
      }, 300);
    }, life);
  };

  ReForm.util = U;
})();
