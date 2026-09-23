/* ============================================================
   ReForm — Screens
   Each screen: { nav, render(params) -> { el, mount(el, params), unmount() } }
   ============================================================ */
window.ReForm = window.ReForm || {};

(function () {
  "use strict";

  const U = ReForm.util;
  const C = ReForm.components;
  const icon = ReForm.icon;
  const art = ReForm.art;
  const data = ReForm.data;
  const mf = ReForm.movementFeedback;

  const S = {};

  /* ============================================================
     Session runtime (shared by detail → live → complete)
     ============================================================ */
  const session = {
    mode: "plan",
    index: 0,
    exercises: [],
    reps: 0,
    total: 12,
    done: 0,
    timer: null,
    paused: false,
    analyzer: null,
    escalateShown: false,
    practiceId: null
  };

  function startSession(mode, practiceId) {
    session.mode = mode;
    session.practiceId = practiceId || null;
    session.exercises = mode === "plan" ? data.planExercises() : [data.exerciseById(practiceId)];
    session.index = 0;
    session.done = 0;
    session.escalateShown = false;
    session.paused = false;
  }

  function stopTimer() {
    if (session.timer) { clearInterval(session.timer); session.timer = null; }
  }

  /* ============================================================
     01 — Onboarding
     ============================================================ */
  S.onboarding = {
    nav: false,
    render: function () {
      const el = U.el(
        '<div class="onboarding">' +
        '<div class="onboarding__brand">' + art.logo(34) + "</div>" +
        '<div class="onboarding__art">' + art.onboardingArt() + "</div>" +
        '<div class="onboarding__copy">' +
        '<h1 class="onboarding__title rise" style="--d:.06s">Your recovery,<br>at home.</h1>' +
        '<p class="onboarding__sub rise" style="--d:.14s">Smart guidance. Real progress.</p>' +
        '<div class="onboarding__actions rise" style="--d:.22s">' +
        C.button({ label: "Get Started", action: "start" }) +
        '<button class="onboarding__login" data-act="login">Already have an account? <b>Log in</b></button>' +
        "</div>" +
        '<p class="onboarding__foot rise" style="--d:.3s">ReForm supports your rehabilitation at home. It does not replace medical advice.</p>' +
        "</div></div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "start") {
            ReForm.router.go("home", {}, { root: true });
          } else if (act === "login") {
            openLoginSheet();
          }
        });
      }
      return { el: el, mount: mount };
    }
  };

  function openLoginSheet() {
    const html =
      '<h2 class="t-h2" style="margin-bottom:6px">Log in</h2>' +
      '<p class="t-small" style="margin-bottom:20px">Use the account linked to your rehabilitation programme.</p>' +
      '<div class="stack" style="margin-bottom:22px">' +
      '<label class="composer" style="border-radius:16px"><input type="email" placeholder="Email" value="anna.weber@example.de"></label>' +
      '<label class="composer" style="border-radius:16px"><input type="password" placeholder="Password" value="••••••••"></label>' +
      "</div>";
    ReForm.sheet.open({
      content: html,
      actions: [{ label: "Log in", variant: "primary", action: "login-submit" }],
      onAction: function (act, close) {
        if (act === "login-submit") {
          close();
          U.toast("Welcome back, Anna");
          ReForm.router.go("home", {}, { root: true });
        }
      }
    });
  }

  /* ============================================================
     02 — Home
     ============================================================ */
  S.home = {
    nav: "home",
    render: function () {
      const p = data.patient;
      const plan = data.planExercises();
      const totalMin = plan.reduce(function (a, e) { return a + e.duration; }, 0);
      const doneDays = data.week.filter(function (d) { return d.status === "done"; }).length;
      const completed = data.state.todayCompleted;

      const planCard = completed
        ? '<section class="plan-card rise">' +
          '<div class="plan-card__eyebrow">' + icon("calendar", { size: 14 }) + "Today's plan</div>" +
          '<div class="plan-card__title" style="margin-top:12px">Session complete</div>' +
          '<div class="plan-card__meta">Well done — that\'s another step forward.</div>' +
          '<div class="plan-card__done" style="margin-top:14px">' + icon("checkCircle", { size: 20, stroke: 2 }) +
          plan.length + " exercises · " + Math.round(plan.length * 4.5) + " min</div>" +
          '<div class="plan-card__cta">' + C.button({ label: "View progress", action: "progress" }) + "</div>" +
          "</section>"
        : '<section class="plan-card rise">' +
          '<div class="plan-card__eyebrow">' + icon("calendar", { size: 14 }) + "Today's plan</div>" +
          '<div class="plan-card__title">' + plan.length + " exercises · " + totalMin + " min</div>" +
          '<div class="plan-card__meta">Knee programme · strength &amp; mobility</div>' +
          '<div class="plan-card__cta">' + C.button({ label: "Start today's session", action: "start-session", icon: "play" }) + "</div>" +
          "</section>";

      const el = U.el(
        '<div class="screen stack">' +
        '<div class="home__head rise">' +
        "<div><div class=\"home__greet\">Good morning, " + p.firstName + "</div>" +
        '<div class="home__sub">Week ' + p.programWeek + " of " + p.programWeeks + " · " + p.phase + "</div></div>" +
        '<button class="avatar-btn" data-act="profile" aria-label="Open profile">' +
        '<span class="avatar avatar--md">' + art.avatar("patient", 56) + "</span>" +
        (data.state.unreadMessages ? '<span class="unread"></span>' : "") +
        "</button></div>" +

        planCard +

        '<div class="quick-actions rise" style="--d:.06s">' +
        '<button class="quick" data-act="plan"><span class="quick__icon">' + icon("list", { size: 20 }) + "</span>" +
        '<span class="quick__label">Daily Plan</span><span class="quick__sub">' + plan.length + " exercises</span></button>" +
        '<button class="quick" data-act="progress"><span class="quick__icon">' + icon("pulse", { size: 20 }) + "</span>" +
        '<span class="quick__label">Progress</span><span class="quick__sub">' + data.progress.sessionsCompleted + " sessions</span></button>" +
        '<button class="quick" data-act="messages"><span class="quick__icon quick__icon--navy">' + icon("message", { size: 20 }) + "</span>" +
        '<span class="quick__label">Messages</span><span class="quick__sub">' +
        (data.state.unreadMessages ? "1 new" : data.clinician.name) + "</span>" +
        (data.state.unreadMessages ? '<span class="unread"></span>' : "") +
        "</button></div>" +

        '<section class="card rise" style="--d:.12s">' +
        '<div class="card-title"><span class="section__title">Weekly progress</span>' +
        '<span class="t-small">' + doneDays + " / " + p.weeklyGoal + " days completed</span></div>" +
        C.weekStrip(data.week) +
        '<div class="motivation">' + icon("sparkle", { size: 17 }) + "You're building a strong recovery routine.</div>" +
        "</section>" +

        '<button class="clinician-strip rise" style="--d:.18s" data-act="messages">' +
        '<span class="avatar avatar--md">' + art.avatar("clinician", 56) + "</span>" +
        "<div><div class=\"clinician-strip__name\">" + data.clinician.name + "</div>" +
        '<div class="clinician-strip__meta">' + data.clinician.role + " · " + data.clinician.practice + "</div></div>" +
        '<span class="clinician-strip__badge"><span style="width:6px;height:6px;border-radius:50%;background:var(--teal)"></span>Available</span>' +
        "</button>" +
        "</div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "start-session") {
            startSession("plan");
            ReForm.router.go("plan", {});
          } else if (act === "plan") {
            startSession("plan");
            ReForm.router.go("plan", {});
          } else if (act === "progress") {
            ReForm.router.go("progress", {});
          } else if (act === "messages") {
            ReForm.router.go("messages", {});
          } else if (act === "profile") {
            ReForm.router.go("profile", {});
          }
        });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     Today's plan
     ============================================================ */
  S.plan = {
    nav: "home",
    render: function () {
      const plan = data.planExercises();
      const totalMin = plan.reduce(function (a, e) { return a + e.duration; }, 0);
      const doneIds = data.state.completedExerciseIds;

      const list = plan.map(function (ex, i) {
        const done = doneIds.indexOf(ex.id) >= 0;
        const trail = done
          ? '<span style="color:var(--teal);display:grid">' + icon("checkCircle", { size: 22 }) + "</span>"
          : '<span class="exercise__chev">' + icon("chevronRight", { size: 20 }) + "</span>";
        return C.exerciseCard(ex, { action: "open", showTag: true, trail: trail });
      }).join("");

      const el = U.el(
        '<div class="screen stack">' +
        C.topBar({ back: true, title: "Today's plan" }) +
        '<div style="padding:2px 0 4px"><h1 class="t-h1">Today\'s plan</h1>' +
        '<p class="t-small" style="margin-top:4px">' + plan.length + " exercises · " + totalMin +
        " min · Week " + data.patient.programWeek + " of " + data.patient.programWeeks + "</p></div>" +
        '<div class="stack" style="gap:10px">' + list + "</div>" +
        '<div style="margin-top:8px">' +
        C.button({
          label: data.state.todayCompleted ? "Repeat session" : "Start session",
          action: "start",
          icon: "play"
        }) + "</div>" +
        C.note({ icon: "shield", text: "A physiotherapist reviews your progress and can adjust this plan at any time." }) +
        "</div>"
      );

      function mount(root, params) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "back") return ReForm.router.back("home");
          if (act === "open") {
            const id = t.getAttribute("data-id");
            const idx = data.todayPlan.exerciseIds.indexOf(id);
            ReForm.router.go("detail", { id: id, index: idx, from: "plan" });
          } else if (act === "start") {
            startSession("plan");
            ReForm.router.go("detail", { id: plan[0].id, index: 0, from: "plan" });
          }
        });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     03 — Exercise library
     ============================================================ */
  let libraryFilter = "All";

  S.exercises = {
    nav: "exercises",
    render: function () {
      const el = U.el(
        '<div class="screen">' +
        '<div class="screen-head"><div class="screen-head__title">' +
        '<h1 class="t-h1">Exercises</h1>' +
        '<span class="t-small">Your personalised programme</span></div></div>' +
        '<div class="chip-row" data-filters>' +
        ["All", "Strength", "Mobility"].map(function (f) {
          return '<button class="chip' + (f === libraryFilter ? " is-active" : "") + '" data-filter="' + f + '">' + f + "</button>";
        }).join("") +
        "</div>" +
        '<div class="stack" style="gap:10px;margin-top:14px" data-list></div>' +
        "</div>"
      );

      function paint(root) {
        const list = data.exercises.filter(function (e) {
          return libraryFilter === "All" || e.category === libraryFilter;
        });
        root.querySelector("[data-list]").innerHTML = list.map(function (ex) {
          return C.exerciseCard(ex, { action: "open", showTag: libraryFilter === "All" });
        }).join("");
      }

      function mount(root) {
        paint(root);
        U.on(root, "click", "[data-filter]", function (e, t) {
          libraryFilter = t.getAttribute("data-filter");
          U.$$("[data-filters] .chip", root).forEach(function (c) {
            c.classList.toggle("is-active", c.getAttribute("data-filter") === libraryFilter);
          });
          paint(root);
        });
        U.on(root, "click", "[data-act=open]", function (e, t) {
          ReForm.router.go("detail", { id: t.getAttribute("data-id"), from: "library" });
        });
        U.on(root, "click", "[data-act=back]", function () { ReForm.router.back("home"); });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     04 — Exercise detail
     ============================================================ */
  S.detail = {
    nav: false,
    render: function (params) {
      const ex = data.exerciseById(params.id);
      const fromPlan = params.from === "plan";
      const idx = params.index || 0;
      const totalEx = data.todayPlan.exerciseIds.length;
      const barTitle = fromPlan ? "Exercise " + (idx + 1) + " of " + totalEx : ex.category;

      const el = U.el(
        '<div class="screen stack">' +
        C.topBar({ back: true, title: barTitle }) +
        '<div class="detail__hero"><span class="detail__hero-ring"></span>' +
        art.figure(ex.thumbnail, { stroke: 8, color: "#12356B" }).replace("<svg ", '<svg class="hero-figure" ') +
        "</div>" +
        '<h1 class="detail__title">' + U.esc(ex.name) + "</h1>" +
        '<div class="detail__chips">' +
        C.statusPill({ tone: "navy", label: ex.category }) +
        C.statusPill({ tone: "muted", label: ex.reps + " reps" }) +
        C.statusPill({ tone: "muted", label: ex.sets + " sets" }) +
        C.statusPill({ tone: "muted", label: ex.duration + " min" }) +
        C.statusPill({ tone: "muted", label: ex.difficulty }) +
        "</div>" +
        '<p class="detail__desc">' + U.esc(ex.description) + "</p>" +
        '<div class="section"><div class="section__title" style="margin-bottom:12px">How to do it</div>' +
        '<div class="cue-list">' + ex.cues.map(function (c) {
          return '<div class="cue">' + icon("checkCircle", { size: 17 }) + "<span>" + U.esc(c) + "</span></div>";
        }).join("") + "</div></div>" +
        C.note({ tone: "teal", icon: "lock", text: "No recording. Movement is analysed live on your device — your video is never stored." }) +
        '<div style="margin-top:6px">' +
        C.button({
          label: fromPlan ? "Start exercise" : "Try this exercise",
          action: "start",
          icon: "play"
        }) + "</div>" +
        "</div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "back") return ReForm.router.back(fromPlan ? "plan" : "exercises");
          if (act === "start") {
            if (fromPlan) {
              if (!session.exercises.length || session.mode !== "plan") startSession("plan");
              session.index = idx;
            } else {
              startSession("practice", ex.id);
            }
            beginExercise();
          }
        });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     Privacy gate (before first camera-based exercise)
     ============================================================ */
  function openPrivacyGate(onAccept) {
    ReForm.sheet.open({
      content: C.privacyContent(),
      actions: [{ label: "Got it", variant: "primary", action: "accept" }],
      dismissible: false,
      onAction: function (act, close) {
        if (act === "accept") {
          data.state.privacyAcknowledged = true;
          close();
          onAccept();
        }
      }
    });
  }

  /* ============================================================
     05 — Live session
     ============================================================ */
  function beginExercise() {
    if (!data.state.privacyAcknowledged) {
      openPrivacyGate(function () { ReForm.router.go("session", {}); });
    } else {
      ReForm.router.go("session", {});
    }
  }

  S.session = {
    nav: false,
    render: function () {
      const ex = session.exercises[session.index];
      const totalEx = session.exercises.length;
      session.reps = 0;
      session.total = ex.reps;
      session.paused = false;

      const el = U.el(
        '<div class="screen session">' +
        C.topBar({
          back: true,
          title: session.mode === "plan" ? "Exercise " + (session.index + 1) + " / " + totalEx : "Practice",
          right: '<button class="text-btn" data-act="skip">Skip</button>'
        }) +
        '<h1 class="session__title">' + U.esc(ex.name) + "</h1>" +
        '<div class="session__pillrow">' + C.statusPill({ tone: "live", dot: true, label: "Live feedback" }) + "</div>" +
        '<div class="analysis" data-analysis><div class="analysis__figure">' +
        art.figure(ex.thumbnail, { stroke: 7.5, color: "#12356B", tracking: true }) +
        "</div>" +
        '<div class="analysis__note">' + icon("lock", { size: 13 }) + "Analysis stays on your device</div></div>" +
        '<div data-feedback>' + C.feedbackCard(mf.build("good", 0)) + "</div>" +
        '<div class="reps">' +
        '<div class="reps__head"><span class="reps__count"><b data-rep>0</b> / ' + ex.reps + " reps</span>" +
        '<span class="reps__set">Set 1 of ' + ex.sets + "</span></div>" +
        '<div class="bar"><i data-bar style="width:0%"></i></div>' +
        "</div>" +
        '<div class="session__actions">' +
        '<button class="pause-btn" data-act="pause" aria-label="Pause">' + icon("pause", { size: 28 }) + "</button>" +
        '<span class="pause-btn__label" data-pause-label>Pause</span>' +
        "</div>" +
        "</div>"
      );

      let analyzer = null;

      function setFeedback(fb, root) {
        const box = root.querySelector("[data-feedback]");
        box.innerHTML = C.feedbackCard(fb);
        U.replay(box.firstElementChild, "is-change");
        const analysis = root.querySelector("[data-analysis]");
        analysis.className = "analysis" + (fb.tone === "warn" ? " analysis--warn" : fb.tone === "escalate" ? " analysis--escalate" : "");
      }

      function setPaused(root, paused) {
        const btn = root.querySelector("[data-act=pause]");
        btn.innerHTML = paused ? icon("play", { size: 28 }) : icon("pause", { size: 28 });
        root.querySelector("[data-pause-label]").textContent = paused ? "Resume" : "Pause";
      }

      function tick(root) {
        if (session.paused) return;
        session.reps += 1;
        const fb = analyzer.analyze({ rep: session.reps, exerciseId: ex.id });
        root.querySelector("[data-rep]").textContent = session.reps;
        root.querySelector("[data-bar]").style.width = Math.round((session.reps / session.total) * 100) + "%";
        setFeedback(fb, root);

        if (fb.escalate && !session.escalateShown) {
          session.escalateShown = true;
          session.paused = true;
          stopTimer();
          setPaused(root, true);
          openEscalation(root);
          return;
        }
        if (session.reps >= session.total) {
          stopTimer();
          completeExercise(root);
        }
      }

      function completeExercise(root) {
        session.done += 1;
        if (data.state.completedExerciseIds.indexOf(ex.id) < 0) data.state.completedExerciseIds.push(ex.id);

        const nextEx = session.exercises[session.index + 1];
        const overlay = U.el(
          '<div class="overlay-check"><div class="overlay-check__inner">' +
          '<div class="overlay-check__ring">' + icon("check", { size: 44, stroke: 2.6 }) + "</div>" +
          '<div class="overlay-check__text">Exercise complete</div>' +
          '<div class="overlay-check__sub">' + (nextEx ? "Next: " + U.esc(nextEx.name) : "Finishing your session…") + "</div>" +
          "</div></div>"
        );
        root.appendChild(overlay);

        setTimeout(function () {
          if (session.index + 1 < session.exercises.length) {
            session.index += 1;
            ReForm.router.replace("session", {});
          } else {
            if (session.mode === "plan") {
              data.state.todayCompleted = true;
              data.week.forEach(function (d) { if (d.status === "today") d.status = "done"; });
            }
            ReForm.router.replace("complete", {
              count: session.done,
              total: session.exercises.length,
              minutes: Math.round(session.done * 4.5)
            });
          }
        }, 1250);
      }

      function openEscalation(root) {
        ReForm.sheet.open({
          content: C.escalationContent(),
          actions: [
            { label: "Contact physiotherapist", variant: "primary", action: "contact" },
            { label: "Continue later", variant: "secondary", action: "later" }
          ],
          dismissible: false,
          onAction: function (act, close) {
            stopTimer();
            if (act === "contact") {
              data.state.escalationShared = true;
              data.state.composerDraft =
                "Hi Dr. Müller — ReForm suggested a check-in. Could you take a look at my movement today?";
              close();
              ReForm.router.go("messages", {}, { root: true });
            } else {
              analyzer.acknowledgeEscalation();
              close();
              ReForm.router.go("home", {}, { root: true });
            }
          }
        });
      }

      function mount(root) {
        analyzer = mf.createAnalyzer({ profile: ex.simulation, exerciseId: ex.id });
        setFeedback(mf.build("good", 0), root);
        session.paused = false;
        setPaused(root, false);
        session.timer = setInterval(function () { tick(root); }, 1150);

        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "back") {
            stopTimer();
            return ReForm.router.back(session.mode === "plan" ? "plan" : "exercises");
          }
          if (act === "pause") {
            session.paused = !session.paused;
            setPaused(root, session.paused);
            return;
          }
          if (act === "skip") {
            stopTimer();
            if (session.index + 1 < session.exercises.length) {
              session.index += 1;
              ReForm.router.replace("session", {});
            } else {
              ReForm.router.replace("complete", {
                count: session.done,
                total: session.exercises.length,
                minutes: Math.round(session.done * 4.5)
              });
            }
          }
        });
      }

      function unmount() { stopTimer(); }

      return { el: el, mount: mount, unmount: unmount };
    }
  };

  /* ============================================================
     06 — Session complete
     ============================================================ */
  S.complete = {
    nav: false,
    render: function (params) {
      const count = params.count || 4;
      const total = params.total || 4;
      const minutes = params.minutes || 18;

      const el = U.el(
        '<div class="screen"><div class="complete">' +
        '<div class="complete__ring">' + icon("check", { size: 56, stroke: 2.6 }) + "</div>" +
        '<h1 class="complete__title rise" style="--d:.1s">Well done!</h1>' +
        '<p class="complete__sub rise" style="--d:.16s">You completed today\'s session.</p>' +
        '<div class="complete__stats rise" style="--d:.22s">' +
        '<div class="stat"><div class="stat__value t-num">' + count + " / " + total + "</div>" +
        '<div class="stat__label">Exercises</div></div>' +
        '<div class="stat"><div class="stat__value t-num">' + minutes + " min</div>" +
        '<div class="stat__label">Total time</div></div>' +
        "</div>" +
        '<div class="complete__actions rise" style="--d:.28s">' +
        C.button({ label: "View progress", action: "progress" }) +
        C.button({ label: "Back to home", variant: "secondary", action: "home" }) +
        "</div>" +
        '<p class="t-small rise" style="--d:.34s;margin-top:16px;text-align:center">' +
        "Your session summary is available to " + data.clinician.name + ".</p>" +
        "</div></div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "progress") ReForm.router.go("progress", {}, { root: true });
          if (act === "home") ReForm.router.go("home", {}, { root: true });
        });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     07 — Progress
     ============================================================ */
  let progressTab = "overview";
  let progressRange = "Last 6 weeks";

  S.progress = {
    nav: "progress",
    render: function () {
      const pr = data.progress;
      const tab = progressTab;

      const overview =
        '<div class="card rise">' +
        '<div class="section__title">Recovery trend</div>' +
        '<div class="t-small" style="margin-top:2px">Better movement, less pain · <span data-range>' + progressRange + "</span></div>" +
        '<div style="margin:14px 0 10px" class="legend">' +
        '<span class="legend__item"><span class="legend__swatch" style="background:#20C5B5"></span>Mobility</span>' +
        '<span class="legend__item"><span class="legend__swatch" style="background:#A9C3DA"></span>Pain level</span>' +
        "</div>" +
        C.progressChart(pr.trend) +
        "</div>" +
        '<div class="section" style="margin-top:22px"><div class="section__head"><span class="section__title">Key metrics</span></div>' +
        '<div class="metric-grid">' +
        C.metricCard({ label: "Mobility", value: pr.mobilityScore.value, unit: "%", delta: pr.mobilityScore.delta, dir: "up", note: pr.mobilityScore.note }) +
        C.metricCard({ label: "Pain level", value: pr.painScore.value, unit: "%", delta: pr.painScore.delta, dir: "down", note: pr.painScore.note }) +
        "</div></div>" +
        '<div class="stack stack--sm" style="margin-top:14px">' +
        '<div class="stat-row"><span class="stat-row__label">Sessions completed</span>' +
        '<span class="stat-row__value t-num">' + pr.sessionsCompleted + "</span></div>" +
        '<div class="stat-row"><span class="stat-row__label">Consistency</span>' +
        '<span class="stat-row__value t-num">' + pr.weeklyConsistency + " days / week</span></div>" +
        "</div>" +
        C.note({ icon: "info", text: "Sample data for this prototype — not a medically validated measurement." });

      const byExercise =
        '<div class="card">' +
        '<div class="section__title">Movement quality by exercise</div>' +
        '<div class="t-small" style="margin:2px 0 16px">How consistently you perform each movement</div>' +
        '<div class="stack" style="gap:16px">' +
        pr.perExercise.map(function (pe) {
          const ex = data.exerciseById(pe.id);
          return '<div class="ex-progress"><div class="ex-progress__head">' +
            '<span class="ex-progress__name">' + U.esc(ex.name) + "</span>" +
            '<span class="ex-progress__val t-num">' + pe.value + "% · " + pe.last + "</span></div>" +
            '<div class="bar"><i style="width:' + pe.value + '%"></i></div></div>';
        }).join("") +
        "</div></div>" +
        '<div class="stack stack--sm" style="margin-top:14px">' +
        pr.perExercise.map(function (pe) {
          const ex = data.exerciseById(pe.id);
          return '<div class="stat-row"><span class="stat-row__label">' + U.esc(ex.name) + " · " + U.esc(pe.label) + "</span>" +
            '<span class="stat-row__value t-num">+' + ex.rom + "%</span></div>";
        }).join("") +
        "</div>" +
        C.note({ icon: "info", text: "Sample data for this prototype — not a medically validated measurement." });

      const el = U.el(
        '<div class="screen stack">' +
        '<div class="screen-head"><div class="screen-head__title">' +
        '<h1 class="t-h1">Progress</h1><span class="t-small">Since ' + data.patient.startDate + "</span></div>" +
        '<button class="icon-btn icon-btn--surface" data-act="range" aria-label="Time range">' + icon("calendar", { size: 22 }) + "</button></div>" +
        '<div class="tabs"><button class="tab' + (tab === "overview" ? " is-active" : "") + '" data-tab="overview">Overview</button>' +
        '<button class="tab' + (tab === "exercises" ? " is-active" : "") + '" data-tab="exercises">Exercises</button></div>' +
        (tab === "overview" ? overview : byExercise) +
        "</div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-tab]", function (e, t) {
          progressTab = t.getAttribute("data-tab");
          U.$$(".tab", root).forEach(function (b) {
            b.classList.toggle("is-active", b.getAttribute("data-tab") === progressTab);
          });
          ReForm.router.replace("progress", {});
        });
        U.on(root, "click", "[data-act=range]", function () {
          ReForm.sheet.open({
            content:
              '<h2 class="t-h2" style="margin-bottom:14px">Time range</h2>' +
              ["Last 4 weeks", "Last 6 weeks", "Since programme start"].map(function (r) {
                return C.row({ label: r, icon: "calendar", action: "pick-range", data: r, value: r === progressRange ? "Currently shown" : "" });
              }).join(""),
            actions: [{ label: "Close", variant: "secondary", action: "close" }],
            onAction: function (act, close, node) {
              if (act === "close") { close(); return; }
              close();
              progressRange = node.getAttribute("data-key") || progressRange;
              const label = root.querySelector("[data-range]");
              if (label) label.textContent = progressRange;
              U.toast("Range updated");
            }
          });
        });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     08 — Messages
     ============================================================ */
  S.messages = {
    nav: false,
    render: function () {
      const msgs = data.messages;
      const context = data.state.escalationShared
        ? '<div class="thread__context">ReForm shared today\'s movement summary with ' + data.clinician.name + ".</div>"
        : "";

      const el = U.el(
        '<div class="screen screen--chat">' +
        C.topBar({ back: true, title: "Messages" }) +
        '<div style="padding:4px 0 14px">' +
        '<div class="profile-card">' +
        '<span class="avatar avatar--md">' + art.avatar("clinician", 56) + "</span>" +
        "<div style=\"flex:1;min-width:0\"><div class=\"profile-card__name\">" + data.clinician.name + "</div>" +
        '<div class="profile-card__meta">' + data.clinician.role + " · " + data.clinician.practice + "</div></div>" +
        "</div>" +
        '<div style="margin-top:10px">' + C.note({ tone: "teal", icon: "shield", text: data.clinician.replyTime + ". For anything urgent, contact your practice directly." }) + "</div>" +
        "</div>" +
        '<div class="thread" data-thread>' +
        '<div class="thread__day">Today</div>' + context +
        msgs.map(function (m, i) { return C.messageBubble(m, i); }).join("") +
        "</div>" +
        '<div class="composer" style="margin-top:10px">' +
        '<input type="text" placeholder="Write a message…" data-input aria-label="Message">' +
        '<button class="send-btn" data-act="send" aria-label="Send">' + icon("send", { size: 19 }) + "</button>" +
        "</div>" +
        "</div>"
      );

      function mount(root) {
        data.state.unreadMessages = 0;
        const input = root.querySelector("[data-input]");
        const thread = root.querySelector("[data-thread]");
        const sendBtn = root.querySelector("[data-act=send]");

        if (data.state.composerDraft) {
          input.value = data.state.composerDraft;
          data.state.composerDraft = "";
          setTimeout(function () { input.focus(); }, 420);
        }
        sendBtn.disabled = !input.value.trim();
        input.addEventListener("input", function () { sendBtn.disabled = !input.value.trim(); });

        function scrollDown() { thread.scrollTop = thread.scrollHeight; }
        scrollDown();

        function send() {
          const text = input.value.trim();
          if (!text) return;
          input.value = "";
          sendBtn.disabled = true;
          const now = U.formatTime(new Date());
          const mine = { id: "m-" + Date.now(), sender: "patient", timestamp: now, text: text };
          data.messages.push(mine);
          thread.insertAdjacentHTML("beforeend", C.messageBubble(mine, 0));
          scrollDown();

          setTimeout(function () {
            thread.insertAdjacentHTML(
              "beforeend",
              '<div class="bubble-row"><div class="bubble bubble--them"><div class="typing"><span></span><span></span><span></span></div></div></div>'
            );
            scrollDown();
          }, 600);

          setTimeout(function () {
            const t = thread.querySelector(".typing");
            if (t) t.closest(".bubble-row").remove();
            const reply = {
              id: "m-" + Date.now(),
              sender: "clinician",
              timestamp: U.formatTime(new Date()),
              text: "Thanks for the message, Anna. I'll look at your recent sessions and get back to you today."
            };
            data.messages.push(reply);
            thread.insertAdjacentHTML("beforeend", C.messageBubble(reply, 0));
            scrollDown();
          }, 1900);
        }

        U.on(root, "click", "[data-act=send]", send);
        U.on(root, "click", "[data-act=back]", function () { ReForm.router.back("home"); });
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     09 — Profile / More
     ============================================================ */
  S.profile = {
    nav: "profile",
    render: function () {
      const p = data.patient;
      const el = U.el(
        '<div class="screen stack">' +
        '<div class="screen-head"><div class="screen-head__title"><h1 class="t-h1">Profile</h1></div></div>' +
        '<div class="profile-card rise">' +
        '<span class="avatar avatar--lg">' + art.avatar("patient", 68) + "</span>" +
        "<div style=\"flex:1;min-width:0\"><div class=\"profile-card__name\">" + p.name + "</div>" +
        '<div class="profile-card__meta">' + p.rehabProgram + "</div>" +
        '<div class="profile-card__week"><span class="pill pill--navy">Week ' + p.programWeek + " of " + p.programWeeks + "</span></div>" +
        "</div></div>" +

        '<div class="section-label">Care</div>' +
        '<div class="rows">' +
        C.row({ label: "Messages", icon: "message", value: data.state.unreadMessages ? "1 unread message" : "No new messages", trail: data.state.unreadMessages ? '<span class="unread unread--inline"></span>' : '<span class="row__chev">' + icon("chevronRight", { size: 20 }) + "</span>", action: "messages" }) +
        C.row({ label: "Treatment plan", icon: "file", value: p.rehabProgram, action: "page", data: "treatment" }) +
        "</div>" +

        '<div class="section-label">Account</div>' +
        '<div class="rows">' +
        C.row({ label: "Personal information", icon: "user", action: "page", data: "personal" }) +
        C.row({ label: "Notifications", icon: "bell", value: data.state.settings.dailyReminder ? "Daily reminder on" : "Off", action: "page", data: "notifications" }) +
        "</div>" +

        '<div class="section-label">Privacy</div>' +
        '<div class="rows">' +
        C.row({ label: "Privacy & data", icon: "shield", value: "No video is ever stored", action: "page", data: "privacy" }) +
        "</div>" +

        '<div class="section-label">Support</div>' +
        '<div class="rows">' +
        C.row({ label: "Help & support", icon: "help", action: "page", data: "help" }) +
        C.row({ label: "Log out", icon: "logout", action: "logout" }) +
        "</div>" +
        '<p class="t-small" style="text-align:center;margin-top:20px">ReForm · Prototype · Not for medical use</p>' +
        "</div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "messages") return ReForm.router.go("messages", {});
          if (act === "page") return ReForm.router.go("page", { key: t.getAttribute("data-key") });
          if (act === "logout") {
            data.state.todayCompleted = false;
            data.state.completedExerciseIds = [];
            ReForm.router.go("onboarding", {}, { root: true });
          }
        });
      }
      return { el: el, mount: mount };
    }
  };

  /* ============================================================
     10 — Detail pages from Profile
     ============================================================ */
  const PAGES = {
    personal: function () {
      const p = data.patient;
      return {
        title: "Personal information",
        lead: "These details are shared only with your care team.",
        html:
          '<div class="rows">' +
          C.field("Name", p.name) +
          C.field("Year of birth", String(p.birthYear)) +
          C.field("Email", p.email) +
          C.field("City", p.city) +
          C.field("Programme start", p.startDate) +
          "</div>"
      };
    },
    treatment: function () {
      const p = data.patient;
      return {
        title: "Treatment plan",
        lead: "Your plan is set by your clinician and reviewed regularly.",
        html:
          '<div class="rows">' +
          C.field("Programme", p.rehabProgram) +
          C.field("Phase", p.phase) +
          C.field("Week", p.programWeek + " of " + p.programWeeks) +
          C.field("Weekly goal", p.weeklyGoal + " sessions") +
          C.field("Physiotherapist", data.clinician.name) +
          "</div>" +
          '<div style="margin-top:14px">' +
          C.note({ icon: "shield", text: "ReForm never changes your plan on its own — adjustments are made with your clinician." }) +
          "</div>"
      };
    },
    privacy: function () {
      return {
        title: "Privacy & data",
        lead: "Movement analysis happens on your device. There is no video to store or share.",
        html:
          C.privacyContent() +
          '<div class="section-label" style="margin-left:0">Your choices</div>' +
          '<div class="rows">' +
          C.toggleRow({ label: "Camera movement tracking", value: "Required for live feedback", icon: "pulse", iconTone: "teal", on: data.state.privacy.movementTracking, action: "toggle-privacy", data: "movementTracking" }) +
          C.toggleRow({ label: "Share session summaries", value: "With " + data.clinician.name, icon: "shield", on: data.state.privacy.shareSummary, action: "toggle-privacy", data: "shareSummary" }) +
          C.toggleRow({ label: "Anonymous movement analytics", value: "Helps improve ReForm", icon: "sliders", on: data.state.privacy.anonymousAnalytics, action: "toggle-privacy", data: "anonymousAnalytics" }) +
          "</div>"
      };
    },
    notifications: function () {
      const s = data.state.settings;
      return {
        title: "Notifications",
        lead: "Gentle reminders that fit around your day.",
        html:
          '<div class="rows">' +
          C.toggleRow({ label: "Daily reminder", value: "09:00", icon: "bell", iconTone: "teal", on: s.dailyReminder, action: "toggle-setting", data: "dailyReminder" }) +
          C.toggleRow({ label: "Session reminders", value: "Before each planned session", icon: "clock", on: s.sessionReminder, action: "toggle-setting", data: "sessionReminder" }) +
          C.toggleRow({ label: "Messages from clinician", value: "New replies from " + data.clinician.name, icon: "message", on: s.clinicianMessages, action: "toggle-setting", data: "clinicianMessages" }) +
          C.toggleRow({ label: "Weekly progress summary", value: "Every Sunday", icon: "pulse", on: s.weeklySummary, action: "toggle-setting", data: "weeklySummary" }) +
          "</div>"
      };
    },
    help: function () {
      return {
        title: "Help & support",
        lead: "Questions about your exercises, your plan or your data.",
        html:
          '<div class="rows">' +
          C.row({ label: "How movement feedback works", icon: "sparkle", value: "What ReForm looks at", action: "help-toast" }) +
          C.row({ label: "Contact support", icon: "message", value: "support@reform.example", action: "help-toast" }) +
          C.row({ label: "Report a problem", icon: "info", action: "help-toast" }) +
          "</div>" +
          '<div style="margin-top:14px">' +
          C.note({ icon: "shield", text: "ReForm does not diagnose or treat. For pain, swelling or anything unusual, contact your practice." }) +
          "</div>"
      };
    }
  };

  S.page = {
    nav: false,
    render: function (params) {
      const def = (PAGES[params.key] || PAGES.personal)();
      const el = U.el(
        '<div class="screen stack">' +
        C.topBar({ back: true, title: def.title }) +
        '<p class="page__lead">' + U.esc(def.lead) + "</p>" +
        def.html +
        "</div>"
      );

      function mount(root) {
        U.on(root, "click", "[data-act]", function (e, t) {
          const act = t.getAttribute("data-act");
          if (act === "back") return ReForm.router.back("profile");
          if (act === "toggle-setting" || act === "toggle-privacy") {
            const key = t.getAttribute("data-key");
            const bucket = act === "toggle-setting" ? data.state.settings : data.state.privacy;
            bucket[key] = !bucket[key];
            t.classList.toggle("is-on", bucket[key]);
            t.setAttribute("aria-checked", bucket[key] ? "true" : "false");
            U.toast(bucket[key] ? "Turned on" : "Turned off");
            return;
          }
          if (act === "help-toast") {
            U.toast("Support will get back to you shortly");
          }
        });
      }
      return { el: el, mount: mount };
    }
  };

  ReForm.screens = S;
  ReForm.session = session;
})();
