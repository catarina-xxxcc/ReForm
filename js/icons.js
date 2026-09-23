/* ============================================================
   ReForm — Icon set (stroke-based, 24x24 grid, optical 1.7px)
   Calm, rounded, medical-tech. No gaming / no neon.
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  const P = {
    home: '<path d="M4 10.8 12 4.2l8 6.6V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19z"/><path d="M9.6 20.6v-6.2h4.8v6.2"/>',
    list: '<path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10"/><path d="M4 6.6l1.3 1.4L7.7 5.4M4 12.1l1.3 1.4 2.4-2.6M4 17.6l1.3 1.4 2.4-2.6"/>',
    pulse: '<path d="M3 12.4h3.4l2.3-5.6 3.3 11 2.3-5.4H21"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2.2"/><rect x="13" y="4" width="7" height="7" rx="2.2"/><rect x="4" y="13" width="7" height="7" rx="2.2"/><rect x="13" y="13" width="7" height="7" rx="2.2"/>',
    chevronRight: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
    chevronLeft: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    chevronDown: '<path d="M6 9.5 12 15.5 18 9.5"/>',
    check: '<path d="M5 12.6l4.6 4.6L19 6.8"/>',
    checkCircle: '<circle cx="12" cy="12" r="8.4"/><path d="M8.4 12.3l2.5 2.5 4.7-5"/>',
    shield: '<path d="M12 3.2 19 6v5.9c0 4.1-2.8 7.5-7 8.9-4.2-1.4-7-4.8-7-8.9V6z"/><path d="M9.2 12.1l2 2 3.6-3.9"/>',
    lock: '<rect x="4.8" y="10.4" width="14.4" height="10" rx="3.4"/><path d="M8.4 10.4V7.9a3.6 3.6 0 0 1 7.2 0v2.5"/>',
    message: '<path d="M20 12.4c0 3.8-3.6 6.9-8 6.9-.9 0-1.8-.1-2.6-.4L4.4 20.6l1.3-3.4A6.5 6.5 0 0 1 4 12.4c0-3.8 3.6-6.9 8-6.9s8 3.1 8 6.9z"/>',
    calendar: '<rect x="4" y="5.4" width="16" height="15" rx="3.6"/><path d="M4 10.2h16M8.8 3.4v3.6M15.2 3.4v3.6"/>',
    play: '<path d="M8 5.6 19 12 8 18.4z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="7.4" y="5.6" width="3.4" height="12.8" rx="1.5" fill="currentColor" stroke="none"/><rect x="13.2" y="5.6" width="3.4" height="12.8" rx="1.5" fill="currentColor" stroke="none"/>',
    bell: '<path d="M18 15.6V10a6 6 0 1 0-12 0v5.6L4.6 18.2h14.8z"/><path d="M9.9 20.6a2.5 2.5 0 0 0 4.2 0"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.7a2.35 2.35 0 1 1 3.3 2.1c-.75.4-1.05.9-1.05 1.7"/><circle cx="12" cy="16.8" r=".95" fill="currentColor" stroke="none"/>',
    user: '<circle cx="12" cy="8.2" r="3.6"/><path d="M4.9 20.2c0-3.4 3.2-5.6 7.1-5.6s7.1 2.2 7.1 5.6"/>',
    sliders: '<path d="M4 8h10.4M18.4 8H20M4 16h4.6M12.6 16H20"/><circle cx="16.2" cy="8" r="2.2"/><circle cx="10.3" cy="16" r="2.2"/>',
    sparkle: '<path d="M11 4.2l1.5 4.1 4.1 1.5-4.1 1.5L11 15.4l-1.5-4.1L5.4 9.8l4.1-1.5z"/><path d="M17.6 14.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',
    adjust: '<path d="M4.5 8.4h11l-3.2-3.2M19.5 15.6h-11l3.2 3.2"/>',
    slow: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2.1"/>',
    send: '<path d="M20.6 3.8 3.4 10.9l7.2 2.6 2.6 7.3z" fill="currentColor" stroke="none"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    trendUp: '<path d="M4.5 15.5l5-5 3.4 3.4 6.6-6.6"/><path d="M14.6 7.3h4.9v4.9"/>',
    trendDown: '<path d="M4.5 8.5l5 5 3.4-3.4 6.6 6.6"/><path d="M14.6 16.7h4.9v-4.9"/>',
    heart: '<path d="M12 19.6s-7.2-4.3-7.2-9.3a4.1 4.1 0 0 1 7.2-2.6 4.1 4.1 0 0 1 7.2 2.6c0 5-7.2 9.3-7.2 9.3z"/>',
    logout: '<path d="M14.6 4.6H6.6A1.8 1.8 0 0 0 4.8 6.4v11.2a1.8 1.8 0 0 0 1.8 1.8h8"/><path d="M19.4 12H10.2m9.2 0-3.1-3.1M19.4 12l-3.1 3.1"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.4V12l3.1 2"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2"/><circle cx="12" cy="8.1" r=".95" fill="currentColor" stroke="none"/>',
    file: '<path d="M13.6 3.6H7.4A1.8 1.8 0 0 0 5.6 5.4v13.2a1.8 1.8 0 0 0 1.8 1.8h9.2a1.8 1.8 0 0 0 1.8-1.8V8.4z"/><path d="M13.4 3.8V8.6h4.8"/>',
    eyeOff: '<path d="M4.2 8.4C5.6 6.4 8.5 4.6 12 4.6s6.4 1.8 7.8 3.8"/><path d="M19.8 15.6c-1.4 2-4.3 3.8-7.8 3.8-2 0-3.8-.6-5.2-1.5"/><path d="M9.6 9.6a3.4 3.4 0 0 0 4.8 4.8"/><path d="M4 4l16 16"/>',
    wifi: '<path d="M4.4 9.2a11.6 11.6 0 0 1 15.2 0"/><path d="M7.4 12.4a7.2 7.2 0 0 1 9.2 0"/><path d="M10.3 15.6a2.8 2.8 0 0 1 3.4 0"/><circle cx="12" cy="18.8" r=".9" fill="currentColor" stroke="none"/>'
  };

  /**
   * icon(name, { size, stroke, className })
   * returns an inline SVG string.
   */
  function icon(name, opts) {
    const o = opts || {};
    const path = P[name] || P.info;
    const size = o.size || 24;
    const stroke = o.stroke || 1.7;
    const cls = o.className ? ' class="' + o.className + '"' : "";
    return (
      '<svg' + cls + ' width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="' + stroke + '" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + path + "</svg>"
    );
  }

  /** Filled marks used for status-bar affordances */
  function battery() {
    return (
      '<svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">' +
      '<rect x="0.6" y="0.6" width="22" height="11.8" rx="3.4" stroke="currentColor" stroke-opacity="0.4"/>' +
      '<rect x="2.4" y="2.4" width="15" height="8.2" rx="2" fill="currentColor"/>' +
      '<path d="M24.4 4.4v4.2c1-.4 1.5-1 1.5-2.1s-.5-1.7-1.5-2.1z" fill="currentColor" fill-opacity="0.4"/></svg>'
    );
  }

  function signal() {
    return (
      '<svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">' +
      '<rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/>' +
      '<rect x="5" y="6" width="3" height="6" rx="1" fill="currentColor"/>' +
      '<rect x="10" y="3.5" width="3" height="8.5" rx="1" fill="currentColor"/>' +
      '<rect x="15" y="1" width="3" height="11" rx="1" fill="currentColor"/></svg>'
    );
  }

  ReForm.icon = icon;
  ReForm.icons = P;
  ReForm.iconBattery = battery;
  ReForm.iconSignal = signal;
})();
