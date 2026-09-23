/* ============================================================
   ReForm — Illustrations & figure art
   Flat, calm, medical. Movement is shown as guidance,
   never as surveillance (no brackets, no REC, no crosshairs).
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  const NAVY = "#0B3B82";
  const INK = "#12356B";
  const TEAL = "#20C5B5";

  /* ---------- Brand mark ---------- */
  function logo(size, withWord) {
    const s = size || 34;
    const mark =
      '<svg width="' + s + '" height="' + s + '" viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
      '<rect width="32" height="32" rx="10" fill="' + NAVY + '"/>' +
      '<path d="M7.6 22.2c2.6 0 3.4-12.4 6.6-12.4 2.4 0 3 6.4 4.4 6.4 1.1 0 1.7-2.4 2.6-4.6" ' +
      'stroke="' + TEAL + '" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="23.4" cy="9.2" r="2.7" fill="' + TEAL + '"/>' +
      "</svg>";
    if (withWord === false) return mark;
    return (
      '<span style="display:inline-flex;align-items:center;gap:9px">' + mark +
      '<span style="font-size:20px;font-weight:600;letter-spacing:-.024em;color:' + NAVY + '">ReForm</span></span>'
    );
  }

  /* ---------- Parametric human figure ---------- */
  const BASE = {
    head: [50, 20],
    neck: [50, 32],
    pelvis: [50, 70],
    shL: [39, 40], shR: [61, 40],
    elL: [35, 56], haL: [33, 72],
    elR: [65, 56], haR: [67, 72],
    hipL: [44, 70], hipR: [56, 70],
    kneeL: [44, 92], ftL: [44, 110],
    kneeR: [56, 92], ftR: [56, 110]
  };

  const POSES = {
    "hip-abduction": { kneeR: [70, 86], ftR: [85, 98], elR: [68, 59], haR: [73, 75], arc: "M90 88a11 11 0 0 1 0 17" },
    "knee-flexion": { kneeR: [63, 88], ftR: [73, 79], arc: "M77 74a9 9 0 0 1 0 13" },
    "calf-raise": {
      lift: -5,
      kneeL: [44, 90], ftL: [41, 107],
      kneeR: [56, 90], ftR: [59, 107],
      arc: "M33 112 q9 -6 18 0 q9 -6 18 0"
    },
    "shoulder-rotation": { elR: [77, 45], haR: [91, 41], arc: "M95 34a10 10 0 0 1 0 14" },
    "seated-extension": { kneeL: [40, 94], ftL: [30, 104], kneeR: [60, 94], ftR: [70, 104] }
  };

  function poseJoints(key) {
    const v = POSES[key] || {};
    const j = {};
    Object.keys(BASE).forEach(function (k) { j[k] = BASE[k].slice(); });
    const lift = v.lift || 0;
    Object.keys(v).forEach(function (k) {
      if (k === "lift" || k === "arc") return;
      j[k] = v[k].slice();
    });
    if (lift) {
      ["head", "neck", "pelvis", "shL", "shR", "elL", "haL", "elR", "haR", "hipL", "hipR"].forEach(function (k) {
        j[k][1] += lift;
      });
    }
    return j;
  }

  function limbPaths(j) {
    return [
      "M" + j.neck[0] + " " + j.neck[1] + "L" + j.pelvis[0] + " " + j.pelvis[1],
      "M" + j.shL[0] + " " + j.shL[1] + "L" + j.shR[0] + " " + j.shR[1],
      "M" + j.shL[0] + " " + j.shL[1] + "L" + j.elL[0] + " " + j.elL[1] + "L" + j.haL[0] + " " + j.haL[1],
      "M" + j.shR[0] + " " + j.shR[1] + "L" + j.elR[0] + " " + j.elR[1] + "L" + j.haR[0] + " " + j.haR[1],
      "M" + j.hipL[0] + " " + j.hipL[1] + "L" + j.hipR[0] + " " + j.hipR[1],
      "M" + j.hipL[0] + " " + j.hipL[1] + "L" + j.kneeL[0] + " " + j.kneeL[1] + "L" + j.ftL[0] + " " + j.ftL[1],
      "M" + j.hipR[0] + " " + j.hipR[1] + "L" + j.kneeR[0] + " " + j.kneeR[1] + "L" + j.ftR[0] + " " + j.ftR[1]
    ];
  }

  function jointPoints(j) {
    return [j.shL, j.shR, j.elL, j.elR, j.hipL, j.hipR, j.kneeL, j.kneeR, j.neck];
  }

  /**
   * figure(key, { stroke, color, tracking, arcs, ground })
   */
  function figure(key, opt) {
    const o = opt || {};
    const j = poseJoints(key);
    const color = o.color || INK;
    const sw = o.stroke || 8;
    const arcs = o.arcs !== false ? POSES[key] && POSES[key].arc : null;

    let svg = '<svg viewBox="0 0 100 124" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">';
    svg += '<ellipse cx="50" cy="117" rx="25" ry="3.6" fill="' + NAVY + '" opacity=".07"/>';
    if (arcs) {
      svg += '<path d="' + arcs + '" stroke="' + TEAL + '" stroke-width="1.8" stroke-linecap="round" ' +
        'stroke-dasharray="2 5" opacity=".55"/>';
    }
    svg += '<g stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">';
    limbPaths(j).forEach(function (d) { svg += '<path d="' + d + '"/>'; });
    svg += "</g>";
    svg += '<circle cx="' + j.head[0] + '" cy="' + j.head[1] + '" r="9.4" fill="' + color + '"/>';

    if (o.tracking) {
      svg += '<g stroke="' + TEAL + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".42">';
      limbPaths(j).forEach(function (d) { svg += '<path d="' + d + '"/>'; });
      svg += "</g>";
      jointPoints(j).forEach(function (p) {
        svg += '<circle class="joint" cx="' + p[0] + '" cy="' + p[1] + '" r="2.9" fill="' + TEAL + '"/>';
      });
    }
    svg += "</svg>";
    return svg;
  }

  /* ---------- Avatars ---------- */
  function avatar(kind, size) {
    const s = size || 48;
    const isClinician = kind === "clinician";
    const bg = isClinician ? NAVY : "#EEF7FC";
    const fg = isClinician ? "#FFFFFF" : NAVY;
    let svg = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 48 48" fill="none" aria-hidden="true">';
    svg += '<circle cx="24" cy="24" r="24" fill="' + bg + '"/>';
    svg += '<circle cx="24" cy="19.2" r="7.6" fill="' + fg + '"/>';
    svg += '<path d="M24 27.6c-8.2 0-12.4 5.2-12.4 11.1a1.2 1.2 0 0 0 1.2 1.3h22.4a1.2 1.2 0 0 0 1.2-1.3c0-5.9-4.2-11.1-12.4-11.1z" fill="' + fg + '"/>';
    if (isClinician) {
      svg += '<path d="M19.1 28.4 24 32.8l4.9-4.4" stroke="' + bg + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      svg += '<path d="M16.6 17.6c.6-4.6 3.6-7.2 7.4-7.2s6.8 2.6 7.4 7.2" stroke="' + bg + '" stroke-width="2.4" stroke-linecap="round"/>';
    }
    svg += "</svg>";
    return svg;
  }

  /* ---------- Onboarding illustration ---------- */
  function onboardingArt() {
    return (
      '<svg viewBox="0 0 320 250" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A person exercising at home with a phone nearby">' +
      /* soft backdrop */
      '<circle cx="160" cy="112" r="92" fill="#EEF7FC"/>' +
      '<circle cx="160" cy="112" r="66" fill="#F4FBF9"/>' +
      /* window with daylight */
      '<rect x="30" y="30" width="66" height="56" rx="12" fill="#FFFFFF" stroke="#D9E9F3" stroke-width="2"/>' +
      '<path d="M63 32v52M32 58h62" stroke="#D9E9F3" stroke-width="2"/>' +
      /* plant */
      '<path d="M262 196c0-14 8-22 8-22s8 8 8 22z" fill="#E8F8F5"/>' +
      '<path d="M270 196v-30M270 176c-7-3-10-9-10-15 7 0 11 6 11 12M270 170c6-4 8-10 8-16-6 1-10 7-9 13" stroke="#20C5B5" stroke-width="2.6" stroke-linecap="round"/>' +
      /* rug */
      '<ellipse cx="160" cy="212" rx="92" ry="17" fill="#EEF7FC"/>' +
      '<ellipse cx="160" cy="212" rx="64" ry="11" fill="#E8F8F5"/>' +
      /* phone on a stand (guidance, not surveillance) */
      '<rect x="82" y="150" width="34" height="56" rx="8" fill="#FFFFFF" stroke="#0B3B82" stroke-width="2.4"/>' +
      '<rect x="88" y="158" width="22" height="34" rx="4" fill="#E8F8F5"/>' +
      '<path d="M94 168h10M94 175h10M94 182h6" stroke="#20C5B5" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M92 206l14 8M108 206l-14 8" stroke="#0B3B82" stroke-width="2.4" stroke-linecap="round"/>' +
      /* person */
      '<ellipse cx="176" cy="200" rx="34" ry="5" fill="#0B3B82" opacity=".07"/>' +
      '<g stroke="#0B3B82" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M176 88v46"/>' +
      '<path d="M160 96h32"/>' +
      '<path d="M160 96l-8 24-4 22"/>' +
      '<path d="M192 96l10 22 6 20"/>' +
      '<path d="M170 134h12"/>' +
      '<path d="M170 134l-2 36v30"/>' +
      '<path d="M182 134l18 24 16 18"/>' +
      "</g>" +
      '<circle cx="176" cy="70" r="15" fill="#0B3B82"/>' +
      '<path d="M163 66c1.6-9 7-13 13-13s11.4 4 13 13" stroke="#0B3B82" stroke-width="5.5" stroke-linecap="round"/>' +
      /* movement guidance accents */
      '<circle cx="216" cy="176" r="4.6" fill="#20C5B5"/>' +
      '<circle cx="176" cy="134" r="4" fill="#20C5B5"/>' +
      '<circle cx="170" cy="170" r="4" fill="#20C5B5"/>' +
      '<path d="M222 166a14 14 0 0 1 0 20" stroke="#20C5B5" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M246 128l1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.6-1.7-4.6-4.6-1.7 4.6-1.7z" fill="#35C8BC"/>' +
      '<path d="M52 122l1.2 3.3 3.3 1.2-3.3 1.2L52 131l-1.2-3.3-3.3-1.2 3.3-1.2z" fill="#35C8BC"/>' +
      "</svg>"
    );
  }

  /* ---------- Privacy art ---------- */
  function privacyArt() {
    return (
      '<svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Movement is analysed on your device and never stored">' +
      '<rect x="34" y="20" width="112" height="112" rx="28" fill="#EEF7FC"/>' +
      '<g transform="translate(52 34) scale(0.76)">' +
      figure("hip-abduction", { stroke: 9, color: INK, tracking: false }).replace(/<\/?svg[^>]*>/g, "") +
      "</g>" +
      '<circle cx="120" cy="106" r="4" fill="#20C5B5"/>' +
      '<circle cx="86" cy="88" r="4" fill="#20C5B5"/>' +
      '<circle cx="104" cy="66" r="4" fill="#20C5B5"/>' +
      /* shield badge */
      '<g transform="translate(146 58)">' +
      '<circle cx="28" cy="28" r="34" fill="#FFFFFF"/>' +
      '<path d="M28 12 46 19.4v12.2c0 9.4-7.3 17.2-18 20.4-10.7-3.2-18-11-18-20.4V19.4z" fill="#0B3B82"/>' +
      '<path d="M20.6 28.4l5.4 5.4 10-10.6" stroke="#20C5B5" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</g>" +
      "</svg>"
    );
  }

  /* ---------- Escalation art (human care) ---------- */
  function escalationArt() {
    return (
      '<svg viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A physiotherapist is available to review your movement">' +
      '<circle cx="92" cy="66" r="46" fill="#EEF7FC"/>' +
      '<circle cx="92" cy="66" r="30" fill="#FFFFFF"/>' +
      '<g transform="translate(68 42)">' +
      avatar("clinician", 48).replace(/<\/?svg[^>]*>/g, "") +
      "</g>" +
      '<g transform="translate(140 44)">' +
      '<rect x="0" y="0" width="72" height="48" rx="16" fill="#FFFFFF"/>' +
      '<rect x="0" y="0" width="72" height="48" rx="16" stroke="#E3EEF5" stroke-width="1.5"/>' +
      '<path d="M14 18h30M14 27h20M14 36h12" stroke="#12356B" stroke-width="2.6" stroke-linecap="round" opacity=".75"/>' +
      '<circle cx="54" cy="34" r="13" fill="#20C5B5"/>' +
      '<path d="M48.5 34.2l3.6 3.6 7-7.2" stroke="#082B63" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</g>" +
      '<path d="M118 74c8 8 18 12 30 12" stroke="#20C5B5" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  ReForm.art = {
    logo: logo,
    figure: figure,
    avatar: avatar,
    onboardingArt: onboardingArt,
    privacyArt: privacyArt,
    escalationArt: escalationArt
  };
})();
