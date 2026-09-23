# ReForm

**Continuous rehabilitation at home, with human care when it matters.**

ReForm is an iPhone-first mobile web app / PWA prototype for patients in the post-AHB maintenance phase in Germany. It explores a hybrid rehabilitation model:

> AI handles the routine. Clinicians handle the exceptions.

ReForm does not replace physiotherapists. It gives patients daily at-home guidance with real-time movement feedback, tracks progress automatically, and escalates to a human clinician whenever clinical judgement is needed.

## What the prototype shows

- **Today's plan** — what to do, how long it takes, one tap to start
- **Live movement feedback** — simulated on-device analysis with calm, human guidance ("Keep your back straight.")
- **Progress** — recovery trend, key metrics, consistency
- **Clinician connection** — messaging with the physiotherapist
- **Escalation** — when movement repeatedly deviates, ReForm suggests a check-in instead of making any claim
- **Privacy by design** — movement analysis happens live; no video is stored or shared

Three ideas the interface keeps reinforcing: **continuous**, **safe**, **private**.

**Live demo:** https://catarina-xxxcc.github.io/ReForm/

## Try it

```bash
# any static server
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open `index.html` directly in a browser. On desktop it renders inside an iPhone-style frame; on mobile it fills the screen. Recommended viewport: 390 × 844.

## Project structure

```
index.html
css/    tokens.css · components.css · screens.css
js/     data.js · feedback.js · art.js · icons.js · components.js · screens.js · app.js
assets/ icon.svg
manifest.webmanifest · sw.js
```

No build step, no dependencies (Inter loads from Google Fonts, with a system-font fallback).

### Architecture notes

- **`js/feedback.js` — `movementFeedback`** is the seam between UI and analysis. The UI never hard-codes feedback copy; it renders whatever `{ state, title, message, tone, icon, escalate }` it receives. Replacing the mock with a real pose-estimation model means implementing `createAnalyzer({ profile, exerciseId })` → `analyze(frame)`. No screen changes required.
- **`js/data.js`** models patient, exercise, session, progress and message objects, so a backend can be added later.

## Scope

This is a design and engineering prototype with mocked data. It does not diagnose, treat, or make medical claims, and it includes no insurance, DiGA, payment or authentication logic. Progress numbers are illustrative sample data.

## Status

MVP prototype — built to be shown to physiotherapists, healthcare partners, university reviewers and investors.
