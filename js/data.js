/* ============================================================
   ReForm — Mock data model
   Shaped so real services (EHR / CV model / messaging backend)
   can be swapped in later without touching the UI.
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  /* ---------- Patient ---------- */
  const patient = {
    id: "pt-001",
    name: "Anna Weber",
    firstName: "Anna",
    avatar: "patient",
    rehabProgram: "Post-op knee rehabilitation",
    phase: "Post-AHB maintenance",
    startDate: "2026-08-12",
    programWeek: 6,
    programWeeks: 12,
    weeklyGoal: 5,
    email: "anna.weber@example.de",
    birthYear: 1974,
    city: "Munich"
  };

  /* ---------- Clinician ---------- */
  const clinician = {
    id: "cl-014",
    name: "Dr. Müller",
    role: "Physiotherapist",
    avatar: "clinician",
    practice: "Reha Zentrum Süd",
    replyTime: "Replies within a few hours",
    online: true
  };

  /* ---------- Exercises ----------
     `simulation` drives the mocked movement analyser:
       'stable'    → mostly good feedback
       'mixed'     → occasional correction
       'escalation'→ repeated problematic feedback → clinician review
  */
  const exercises = [
    {
      id: "hip-abduction",
      name: "Standing Hip Abduction",
      category: "Strength",
      sets: 3,
      reps: 12,
      duration: 5,
      difficulty: "Easy",
      thumbnail: "hip-abduction",
      focus: "Hip stabilisers",
      description:
        "Stand tall and lift your leg slowly out to the side. This builds the muscles that keep your knee steady when you walk.",
      cues: [
        "Hold on to a chair or wall for balance.",
        "Keep your back straight and your toes pointing forward.",
        "Move slowly — control matters more than height."
      ],
      simulation: "stable",
      rom: 24
    },
    {
      id: "knee-flexion",
      name: "Knee Flexion",
      category: "Mobility",
      sets: 3,
      reps: 10,
      duration: 5,
      difficulty: "Moderate",
      thumbnail: "knee-flexion",
      focus: "Knee bending",
      description:
        "Bend your knee and bring your heel towards you. This gently restores the range you need for stairs and walking.",
      cues: [
        "Move only as far as feels comfortable.",
        "Keep both thighs parallel to each other.",
        "Stop if you feel sharp pain."
      ],
      simulation: "escalation",
      rom: 31
    },
    {
      id: "calf-raise",
      name: "Calf Raise",
      category: "Strength",
      sets: 2,
      reps: 15,
      duration: 4,
      difficulty: "Easy",
      thumbnail: "calf-raise",
      focus: "Lower leg",
      description:
        "Rise onto your toes and lower back down slowly. This supports your balance and push-off when walking.",
      cues: [
        "Keep your weight even on both feet.",
        "Lower down slowly — the way down matters most.",
        "Breathe normally throughout."
      ],
      simulation: "mixed",
      rom: 18
    },
    {
      id: "shoulder-rotation",
      name: "Shoulder Rotation",
      category: "Mobility",
      sets: 2,
      reps: 12,
      duration: 6,
      difficulty: "Easy",
      thumbnail: "shoulder-rotation",
      focus: "Upper body",
      description:
        "Rotate your arm gently outwards and back. It keeps your upper body mobile while your knee recovers.",
      cues: [
        "Keep your elbow close to your side.",
        "Relax your shoulders between repetitions.",
        "Move within a comfortable range."
      ],
      simulation: "stable",
      rom: 15
    }
  ];

  /* ---------- Today's plan ---------- */
  const todayPlan = {
    id: "plan-2026-09-23",
    date: "2026-09-23",
    label: "Today's plan",
    exerciseIds: ["hip-abduction", "knee-flexion", "calf-raise", "shoulder-rotation"],
    totalMinutes: 20
  };

  /* ---------- Week ---------- */
  const week = [
    { key: "mon", label: "Mon", short: "M", status: "done" },
    { key: "tue", label: "Tue", short: "T", status: "done" },
    { key: "wed", label: "Wed", short: "W", status: "done" },
    { key: "thu", label: "Thu", short: "T", status: "done" },
    { key: "fri", label: "Fri", short: "F", status: "today" },
    { key: "sat", label: "Sat", short: "S", status: "rest" },
    { key: "sun", label: "Sun", short: "S", status: "rest" }
  ];

  /* ---------- Progress (illustrative sample data) ---------- */
  const progress = {
    mobilityScore: { value: 70, delta: 28, unit: "%", dir: "up", note: "Change since the start of your programme" },
    painScore: { value: 41, delta: -46, unit: "%", dir: "down", note: "Self-reported, lower is better" },
    sessionsCompleted: 18,
    weeklyConsistency: 4.5,
    streakDays: 4,
    trend: [
      { label: "W1", mobility: 55, pain: 76 },
      { label: "W2", mobility: 58, pain: 70 },
      { label: "W3", mobility: 61, pain: 64 },
      { label: "W4", mobility: 64, pain: 56 },
      { label: "W5", mobility: 67, pain: 49 },
      { label: "W6", mobility: 70, pain: 41 }
    ],
    perExercise: [
      { id: "hip-abduction", value: 82, label: "Range of motion", last: "Today" },
      { id: "knee-flexion", value: 74, label: "Range of motion", last: "Today" },
      { id: "calf-raise", value: 68, label: "Control", last: "Yesterday" },
      { id: "shoulder-rotation", value: 91, label: "Range of motion", last: "Today" }
    ]
  };

  /* ---------- Messages ---------- */
  const messages = [
    {
      id: "m1",
      sender: "clinician",
      timestamp: "09:12",
      text: "Great progress this week. Your range of motion has improved significantly. Keep it up!",
      read: true
    },
    { id: "m2", sender: "patient", timestamp: "09:20", text: "Thank you! Should I continue with the same exercises?", read: true },
    {
      id: "m3",
      sender: "clinician",
      timestamp: "09:26",
      text: "Yes, for now. I'll check your next results and let you know if we need to adjust the plan.",
      read: false
    }
  ];

  /* ---------- Helpers ---------- */
  function exerciseById(id) {
    return exercises.filter(function (e) { return e.id === id; })[0] || null;
  }

  function planExercises() {
    return todayPlan.exerciseIds.map(exerciseById).filter(Boolean);
  }

  /* ---------- Mutable app state ---------- */
  const state = {
    privacyAcknowledged: false,
    todayCompleted: false,
    completedExerciseIds: [],
    unreadMessages: 1,
    escalationShown: false,
    composerDraft: "",
    settings: {
      dailyReminder: true,
      sessionReminder: true,
      clinicianMessages: true,
      weeklySummary: false
    },
    privacy: {
      movementTracking: true,
      shareSummary: true,
      anonymousAnalytics: false
    }
  };

  ReForm.data = {
    patient: patient,
    clinician: clinician,
    exercises: exercises,
    todayPlan: todayPlan,
    week: week,
    progress: progress,
    messages: messages,
    state: state,
    exerciseById: exerciseById,
    planExercises: planExercises
  };
})();
