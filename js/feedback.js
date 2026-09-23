/* ============================================================
   ReForm — movementFeedback
   ------------------------------------------------------------
   Abstraction layer between the UI and movement analysis.

   The UI NEVER hard-codes feedback copy. It only receives a
   feedback object: { state, title, message, tone, icon, escalate }

   To plug in a real computer-vision model later, replace
   `createAnalyzer` with an implementation whose `analyze(frame)`
   returns the same shape. Nothing in the screens changes.

     frame = { rep, exerciseId, elapsedMs, joints? }
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  /* ---------- Feedback states (UI copy lives here) ---------- */
  const STATES = {
    good: {
      id: "good",
      tone: "positive",
      icon: "checkCircle",
      title: "Good posture",
      messages: [
        "Keep your back straight.",
        "Nice and steady.",
        "Good range of motion.",
        "That's the right tempo."
      ]
    },
    adjust: {
      id: "adjust",
      tone: "warn",
      icon: "adjust",
      title: "Almost there",
      messages: [
        "Keep your knee aligned.",
        "Keep your hips level.",
        "Bring your foot slightly forward."
      ]
    },
    slow: {
      id: "slow",
      tone: "warn",
      icon: "slow",
      title: "Slow down",
      messages: [
        "Control the movement.",
        "Take your time on the way down.",
        "A little slower — quality over speed."
      ]
    },
    escalate: {
      id: "escalate",
      tone: "escalate",
      icon: "shield",
      title: "Let's check this together.",
      messages: ["Your movement looks different today."]
    }
  };

  /* ---------- Mocked movement signal per exercise profile ---------- */
  const PROFILES = {
    stable: { 4: "adjust", 8: "slow" },
    mixed: { 2: "adjust", 5: "slow", 7: "adjust", 11: "slow" },
    escalation: { 3: "adjust", 4: "slow", 5: "adjust", 6: "adjust", 7: "adjust" }
  };

  const PROBLEMATIC = { adjust: true, slow: true };

  /**
   * Build a feedback object from a state id (+ variant rotation).
   */
  function build(id, variantIndex) {
    const s = STATES[id] || STATES.good;
    const list = s.messages;
    const message = list[(variantIndex || 0) % list.length];
    return {
      state: s.id,
      tone: s.tone,
      icon: s.icon,
      title: s.title,
      message: message,
      escalate: s.id === "escalate"
    };
  }

  /**
   * createAnalyzer({ profile, exerciseId, escalateAfter })
   * profile: 'stable' | 'mixed' | 'escalation'
   */
  function createAnalyzer(opts) {
    const o = opts || {};
    const profile = PROFILES[o.profile] || PROFILES.stable;
    const escalateAfter = o.escalateAfter == null ? 3 : o.escalateAfter;

    let consecutive = 0;
    let variants = {};
    let acknowledged = false;

    return {
      /** Analyze one repetition. */
      analyze: function (frame) {
        const rep = (frame && frame.rep) || 1;
        let id = rep === 1 ? "good" : profile[rep] || "good";

        if (PROBLEMATIC[id]) {
          consecutive += 1;
        } else {
          consecutive = 0;
        }

        if (!acknowledged && consecutive >= escalateAfter) {
          acknowledged = true; // only escalate once per session
          return build("escalate", 0);
        }

        variants[id] = (variants[id] || 0) + 1;
        return build(id, variants[id] - 1);
      },
      /** Called when the patient dismisses the escalation card. */
      acknowledgeEscalation: function () {
        acknowledged = true;
      },
      /** Rolling signal used by the home screen / summaries. */
      summary: function () {
        return { problematic: consecutive, escalated: acknowledged };
      }
    };
  }

  ReForm.movementFeedback = {
    STATES: STATES,
    createAnalyzer: createAnalyzer,
    build: build
  };
})();
