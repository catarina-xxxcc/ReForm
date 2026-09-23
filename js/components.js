/* ============================================================
   ReForm — Reusable components
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  const U = ReForm.util;
  const icon = ReForm.icon;
  const art = ReForm.art;

  const C = {};

  /* ---------- Buttons ---------- */
  C.button = function (opts) {
    const o = opts || {};
    const variant = o.variant || "primary";
    const lead = o.icon ? icon(o.icon, { size: 19 }) : "";
    return (
      '<button class="btn btn--' + variant + '"' +
      (o.action ? ' data-act="' + o.action + '"' : "") +
      (o.disabled ? " disabled" : "") +
      ">" + lead + "<span>" + U.esc(o.label) + "</span></button>"
    );
  };

  /* ---------- Card ---------- */
  C.card = function (opts) {
    const o = opts || {};
    const cls = ["card"];
    if (o.tight) cls.push("card--tight");
    if (o.muted) cls.push("card--muted");
    if (o.className) cls.push(o.className);
    return '<div class="' + cls.join(" ") + '">' + (o.content || "") + "</div>";
  };

  /* ---------- Top bar ---------- */
  C.topBar = function (opts) {
    const o = opts || {};
    const left = o.back
      ? '<button class="icon-btn" data-act="back" aria-label="Back">' + icon("chevronLeft", { size: 24 }) + "</button>"
      : "<span></span>";
    const right = o.right || "<span></span>";
    return (
      '<header class="topbar">' + left +
      '<div class="topbar__center"><span class="topbar__eyebrow">' + U.esc(o.title || "") + "</span></div>" +
      '<div class="topbar__right">' + right + "</div></header>"
    );
  };

  /* ---------- Status pill ---------- */
  C.statusPill = function (opts) {
    const o = opts || {};
    const cls = "pill pill--" + (o.tone || "live");
    const dot = o.dot ? '<span class="dot"></span>' : "";
    const lead = o.icon ? icon(o.icon, { size: 15 }) : "";
    return '<span class="' + cls + '">' + dot + lead + U.esc(o.label) + "</span>";
  };

  /* ---------- Avatar ---------- */
  C.avatar = function (kind, size) {
    const cls = "avatar avatar--" + (size || "md");
    return '<span class="' + cls + '">' + art.avatar(kind, size === "sm" ? 40 : size === "lg" ? 68 : 56) + "</span>";
  };

  /* ---------- Exercise card ---------- */
  C.exerciseCard = function (ex, opts) {
    const o = opts || {};
    const trail = o.trail || '<span class="exercise__chev">' + icon("chevronRight", { size: 20 }) + "</span>";
    return (
      '<button class="exercise" data-act="' + (o.action || "open-exercise") + '" data-id="' + ex.id + '">' +
      '<span class="exercise__thumb">' + art.figure(ex.thumbnail, { stroke: 8, color: "#12356B" }) + "</span>" +
      '<span class="exercise__body">' +
      '<span class="exercise__name">' + U.esc(ex.name) +
      (o.showTag ? '<span class="exercise__tag">' + U.esc(ex.category) + "</span>" : "") +
      "</span>" +
      '<span class="exercise__meta">' + ex.reps + " reps · " + ex.sets + " sets</span>" +
      "</span>" +
      trail +
      "</button>"
    );
  };

  /* ---------- Metric card ---------- */
  C.metricCard = function (opts) {
    const o = opts || {};
    const dir = o.dir === "down" ? "down" : "up";
    const arrow = dir === "up" ? icon("trendUp", { size: 13 }) : icon("trendDown", { size: 13 });
    const sign = o.delta > 0 ? "+" : "";
    return (
      '<div class="metric">' +
      '<div class="metric__label">' + U.esc(o.label) + "</div>" +
      '<div class="metric__value t-num">' + U.esc(o.value) +
      (o.unit ? '<span class="metric__unit">' + U.esc(o.unit) + "</span>" : "") + "</div>" +
      '<div class="metric__delta metric__delta--' + dir + '">' + arrow + sign + o.delta + "%" +
      '<span style="opacity:.7;font-weight:500">vs. start</span></div>' +
      (o.note ? '<div class="metric__note">' + U.esc(o.note) + "</div>" : "") +
      "</div>"
    );
  };

  /* ---------- Feedback card (driven by movementFeedback) ---------- */
  C.feedbackCard = function (fb) {
    return (
      '<div class="feedback feedback--' + fb.tone + '">' +
      '<span class="feedback__icon">' + icon(fb.icon, { size: 22 }) + "</span>" +
      "<div><div class=\"feedback__title\">" + U.esc(fb.title) + "</div>" +
      '<div class="feedback__msg">' + U.esc(fb.message) + "</div></div>" +
      "</div>"
    );
  };

  /* ---------- Message bubble ---------- */
  C.messageBubble = function (msg, index) {
    const mine = msg.sender === "patient";
    return (
      '<div class="bubble-row' + (mine ? " bubble-row--me" : "") + '">' +
      '<div class="bubble bubble--' + (mine ? "me" : "them") + '" style="animation-delay:' + (index * 0.05).toFixed(2) + 's">' +
      U.esc(msg.text) + '<span class="bubble__time">' + U.esc(msg.timestamp) + "</span>" +
      "</div></div>"
    );
  };

  /* ---------- Bottom navigation ---------- */
  const TABS = [
    { key: "home", label: "Home", icon: "home" },
    { key: "exercises", label: "Exercises", icon: "list" },
    { key: "progress", label: "Progress", icon: "pulse" },
    { key: "profile", label: "More", icon: "grid" }
  ];

  C.bottomNav = function (active) {
    return TABS.map(function (t) {
      return (
        '<button class="navtab' + (t.key === active ? " is-active" : "") + '" data-tab="' + t.key + '">' +
        icon(t.icon, { size: 24 }) + "<span>" + t.label + "</span></button>"
      );
    }).join("");
  };

  C.navKeys = TABS.map(function (t) { return t.key; });

  /* ---------- Week strip ---------- */
  C.weekStrip = function (days) {
    return (
      '<div class="week">' +
      days.map(function (d) {
        let inner = "";
        let cls = "week__dot";
        if (d.status === "done") {
          cls += " is-done";
          inner = icon("check", { size: 16, stroke: 2.4 });
        } else if (d.status === "today") {
          cls += " is-today";
          inner = '<span style="width:7px;height:7px;border-radius:50%;background:var(--teal)"></span>';
        } else {
          cls += " is-rest";
          inner = '<span style="width:8px;height:2px;border-radius:2px;background:#C0D2DC"></span>';
        }
        return (
          '<div class="week__day"><span class="week__label">' + d.short + "</span>" +
          '<span class="' + cls + '">' + inner + "</span></div>"
        );
      }).join("") +
      "</div>"
    );
  };

  /* ---------- Progress chart ---------- */
  function smoothPath(points) {
    if (!points.length) return "";
    if (points.length < 3) {
      return "M" + points.map(function (p) { return p[0] + " " + p[1]; }).join("L");
    }
    let d = "M" + points[0][0] + " " + points[0][1];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += "C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  C.progressChart = function (trend) {
    const W = 340, H = 152;
    const padL = 10, padR = 10, padT = 16, padB = 28;
    const n = trend.length;
    const xAt = function (i) { return padL + (i * (W - padL - padR)) / (n - 1); };
    const yAt = function (v) { return padT + (1 - (U.clamp(v, 30, 90) - 30) / 60) * (H - padT - padB); };

    const mobility = trend.map(function (t, i) { return [xAt(i), yAt(t.mobility)]; });
    const pain = trend.map(function (t, i) { return [xAt(i), yAt(t.pain)]; });

    const mPath = smoothPath(mobility);
    const pPath = smoothPath(pain);
    const area = mPath + "L" + mobility[n - 1][0] + " " + (H - padB) + "L" + mobility[0][0] + " " + (H - padB) + "Z";

    let svg = '<svg viewBox="0 0 ' + W + " " + H + '" fill="none" aria-hidden="true">';
    svg += '<defs><linearGradient id="rfArea" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#20C5B5" stop-opacity="0.20"/>' +
      '<stop offset="100%" stop-color="#20C5B5" stop-opacity="0"/></linearGradient></defs>';

    /* faint guides */
    [50, 75].forEach(function (v) {
      svg += '<path d="M' + padL + " " + yAt(v) + "L" + (W - padR) + " " + yAt(v) +
        '" stroke="#12356B" stroke-opacity="0.06" stroke-width="1" stroke-dasharray="3 5"/>';
    });

    svg += '<path d="' + pPath + '" stroke="#A9C3DA" stroke-width="2" stroke-linecap="round" stroke-dasharray="0" fill="none" opacity=".85"/>';
    svg += '<path d="' + area + '" fill="url(#rfArea)"/>';
    svg += '<path class="chart__line" style="--len:640" d="' + mPath + '" stroke="#20C5B5" stroke-width="2.8"/>';
    svg += '<path class="chart__line" style="--len:640;animation-delay:.15s" d="' + pPath + '" stroke="#A9C3DA" stroke-width="2"/>';

    /* last-point markers */
    svg += '<circle class="chart__dot" style="animation-delay:1.1s" cx="' + mobility[n - 1][0] + '" cy="' + mobility[n - 1][1] +
      '" r="5.5" fill="#20C5B5" stroke="#FFFFFF" stroke-width="2.5"/>';
    svg += '<circle class="chart__dot" style="animation-delay:1.2s" cx="' + pain[n - 1][0] + '" cy="' + pain[n - 1][1] +
      '" r="4.5" fill="#FFFFFF" stroke="#A9C3DA" stroke-width="2.5"/>';

    /* x labels */
    trend.forEach(function (t, i) {
      svg += '<text x="' + xAt(i) + '" y="' + (H - 8) + '" fill="#9BB4C4" font-size="11" font-family="Inter, sans-serif" ' +
        'text-anchor="middle" font-weight="500">' + t.label + "</text>";
    });
    svg += "</svg>";
    return '<div class="chart">' + svg + "</div>";
  };

  /* ---------- List row ---------- */
  C.row = function (opts) {
    const o = opts || {};
    const iconHtml = o.icon
      ? '<span class="row__icon' + (o.iconTone === "teal" ? " row__icon--teal" : "") + '">' + icon(o.icon, { size: 18 }) + "</span>"
      : "";
    const trail = o.trail || '<span class="row__chev">' + icon("chevronRight", { size: 20 }) + "</span>";
    return (
      '<button class="row" data-act="' + (o.action || "") + '"' + (o.data ? ' data-key="' + o.data + '"' : "") + ">" +
      iconHtml +
      '<span class="row__label">' + U.esc(o.label) +
      (o.value ? '<span style="display:block;font-size:12.5px;color:var(--text-2);font-weight:400;margin-top:1px">' + U.esc(o.value) + "</span>" : "") +
      "</span>" + trail + "</button>"
    );
  };

  C.toggleRow = function (opts) {
    const o = opts || {};
    return (
      '<div class="row" style="cursor:default">' +
      '<span class="row__icon' + (o.iconTone === "teal" ? " row__icon--teal" : "") + '">' + icon(o.icon, { size: 18 }) + "</span>" +
      '<span class="row__label" style="display:flex;flex-direction:column;gap:2px">' + U.esc(o.label) +
      (o.value ? '<span style="font-size:12.5px;color:var(--text-2);font-weight:400">' + U.esc(o.value) + "</span>" : "") +
      "</span>" +
      '<button class="switch' + (o.on ? " is-on" : "") + '" data-act="' + (o.action || "toggle") + '" data-key="' + o.data +
      '" role="switch" aria-checked="' + (o.on ? "true" : "false") + '" aria-label="' + U.esc(o.label) + '"></button>' +
      "</div>"
    );
  };

  C.field = function (label, value) {
    return '<div class="field"><span class="field__label">' + U.esc(label) + '</span><span class="field__value">' + U.esc(value) + "</span></div>";
  };

  C.note = function (opts) {
    const o = opts || {};
    return '<div class="note' + (o.tone === "teal" ? " note--teal" : "") + '">' + icon(o.icon || "info", { size: 16 }) +
      "<span>" + (o.html || U.esc(o.text || "")) + "</span></div>";
  };

  C.benefit = function (iconName, title, body) {
    return (
      '<div class="benefit"><span class="benefit__icon">' + icon(iconName, { size: 20 }) + "</span>" +
      "<div><div class=\"benefit__title\">" + U.esc(title) + "</div>" +
      '<div class="benefit__body">' + U.esc(body) + "</div></div></div>"
    );
  };

  /* ---------- Privacy notice content ---------- */
  C.privacyContent = function () {
    return (
      '<div class="privacy__art">' + art.privacyArt() + "</div>" +
      '<h2 class="privacy__title">No recording.<br>Your privacy matters.</h2>' +
      '<p class="privacy__body">We use your camera only for real-time movement tracking. Your video is not stored or shared.</p>' +
      '<div class="privacy__list">' +
      C.benefit("pulse", "Real-time analysis", "Movement is read live on your device, so guidance keeps up with you.") +
      C.benefit("lock", "No video storage", "Nothing is recorded. There is no video to save, send or leak.") +
      C.benefit("sliders", "Privacy control", "You decide what is shared with your physiotherapist — and can change it anytime.") +
      "</div>"
    );
  };

  /* ---------- Escalation card content ---------- */
  C.escalationContent = function () {
    return (
      '<div class="escalation__art">' + art.escalationArt() + "</div>" +
      '<h2 class="escalation__title">Let\'s check this together.</h2>' +
      '<p class="escalation__body">Your movement looks different today. A physiotherapist can take a closer look.</p>' +
      C.note({
        icon: "info",
        text: "ReForm does not diagnose. This is simply a suggestion to involve your clinician."
      })
    );
  };

  ReForm.components = C;
})();
