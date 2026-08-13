# رہبر RAHBAR

**Your street has a pulse. Now you can hear it.**
**گلی کی رہبر۔ آپ کے ہاتھ میں۔**

> *"Even the regulator admits the data is broken. Rahbar turns the street into the sensor."*

A voice-first, multi-agent AI companion that predicts when your street will lose electricity — and tells you what to do about it, in the language your mother speaks.

🇵🇰 Built as an Independence Day 2026 contribution — for the streets that already know the truth before the schedule does.

---

## What is Rahbar?

In Pakistani neighborhoods, official load-shedding schedules routinely lie. The truth lives inside WhatsApp groups, neighbors' conversations, and lived experience. Even Pakistan's own energy regulator, NEPRA, admits in its FY 2024–25 report that most power distribution companies still lack reliable systems to record outages.

Rahbar closes that gap. It turns scattered street knowledge into a personal heads-up — spoken aloud in Urdu, before the light goes out.

**One-line pitch:** *An AI that listens to your street and warns your grandmother in Urdu before the power cuts — because NEPRA itself admits the official data is broken.*

Designed so that a grandmother can use it: no dashboards, no jargon, no English-only UI. Just a mic button and a voice she understands.

---

## From BAARI to Rahbar

This project began as **BAARI**, originally built for the **Google AI Seekho Hackathon**. This repository is its evolved, rebuilt, and renamed version — **Rahbar** — reworked with a sharper concept (multi-agent reasoning grounded in real IESCO/NEPRA/Open-Meteo data), a redesigned bilingual voice-first experience, and a companion native Android app, as an Independence Day 2026 contribution.

---

## How it thinks: multi-agent reasoning

Instead of a single opaque prediction, Rahbar shows its reasoning through specialized agents whose findings are fused into one answer by Gemini:

| Agent | Role | Real Data Source |
|---|---|---|
| 📡 **Street Agent** | Analyzes community pings | WhatsApp/neighbor-style community reports |
| 📋 **Schedule Agent** | Reads the official promise | IESCO Load Management Schedule |
| ☀️ **Weather Agent** | Contextualizes with environment | Open-Meteo live weather API |
| 🔄 **History Agent** | Matches past outage patterns | Rahbar's own historical pattern analysis |

Every prediction returns *why* it was made — in both Urdu and English — so the reasoning is transparent, not a black box.

---

## Features

- 🎙️ **Voice-first interaction** — tap-to-speak, native STT/TTS, Urdu-first with English fallback
- 🔔 **Proactive alerts** — a heads-up before the power goes, not a log after it already did
- 🧠 **Visible multi-agent reasoning** — see exactly why Rahbar predicted what it predicted, with source labels
- 📍 **Live GPS street detection** — auto-detects your area, or pick manually
- 🗺️ **Map & My Street views** — community pulse and a Pakistan-wide map screen
- 📊 **Impact screen** — see your own reporting impact over time
- 🌗 **Bilingual UI** — full Urdu / English toggle throughout
- 📞 **One-tap emergency helpline modal** — quick access for real outages or faults
- 🧠 **Lightweight personal memory** — remembers your name, street, and recent questions locally
- 📱 **Two clients, one brain** — a React web app and a native Android app, both backed by the same server
- 📚 **Cited, real data** — grounded in IESCO, NEPRA, and Open-Meteo, not invented numbers

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Web Frontend** | React 19 · TypeScript · Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Motion |
| **Icons** | Lucide React |
| **Backend Server** | Express (`server.ts`) on Node.js |
| **AI Engine** | Google Gemini API (`@google/genai`, `gemini-3.6-flash`) |
| **Weather Data** | Open-Meteo API (proxied through the server) |
| **Voice (Web)** | Web Speech API — `SpeechRecognition` + `SpeechSynthesis` |
| **Client Memory** | Browser `localStorage` (name, detected street, recent questions/predictions) |
| **Android App** | Kotlin · Jetpack Compose · Material 3 |
| **Android Networking** | Retrofit 2 + OkHttp |
| **Android Voice & Location** | Native `SpeechRecognizer`, `TextToSpeech`, Play Services Fused Location |
| **Android SDK** | minSdk 26 · target/compileSdk 34 |
| **Scaffold** | Google AI Studio repository template |

---

## Architecture

<svg viewBox="0 0 1200 940" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">

  <!-- Background -->
  <rect x="0" y="0" width="1200" height="940" fill="#FAF5EE"/>

  <!-- Arrowhead markers -->
  <defs>
    <marker id="arrowSolid" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#1C1917"/>
    </marker>
    <marker id="arrowDashed" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#991B1B"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="600" y="50" text-anchor="middle" font-size="30" font-weight="700" fill="#C2410C">RAHBAR — System Architecture</text>
  <text x="600" y="76" text-anchor="middle" font-size="15" fill="#78716C">Voice-first, multi-agent electricity outage prediction</text>

  <!-- ================= CLIENT ROW ================= -->

  <!-- Web Client -->
  <rect x="90" y="110" width="470" height="120" rx="18" fill="#FFFFFF" stroke="#0F766E" stroke-width="2.5"/>
  <rect x="90" y="110" width="470" height="38" rx="18" fill="#0F766E"/>
  <rect x="90" y="130" width="470" height="18" fill="#0F766E"/>
  <text x="325" y="135" text-anchor="middle" font-size="17" font-weight="700" fill="#FFFFFF">🌐  Web Client</text>
  <text x="325" y="172" text-anchor="middle" font-size="13" fill="#1C1917">React 19 · TypeScript · Vite 6 · Tailwind</text>
  <text x="325" y="193" text-anchor="middle" font-size="12" fill="#78716C">Splash → Voice Greeting → Checking → Answer</text>
  <text x="325" y="211" text-anchor="middle" font-size="12" fill="#78716C">My Street · Alerts · Map · Impact · Ask Rahbar</text>

  <!-- Android Client -->
  <rect x="640" y="110" width="470" height="120" rx="18" fill="#FFFFFF" stroke="#0F766E" stroke-width="2.5"/>
  <rect x="640" y="110" width="470" height="38" rx="18" fill="#0F766E"/>
  <rect x="640" y="130" width="470" height="18" fill="#0F766E"/>
  <text x="875" y="135" text-anchor="middle" font-size="17" font-weight="700" fill="#FFFFFF">📱  Android Client</text>
  <text x="875" y="172" text-anchor="middle" font-size="13" fill="#1C1917">Kotlin · Jetpack Compose · Material 3</text>
  <text x="875" y="193" text-anchor="middle" font-size="12" fill="#78716C">Mirrors the same screen flow natively</text>
  <text x="875" y="211" text-anchor="middle" font-size="12" fill="#78716C">Retrofit + OkHttp · Native STT/TTS · GPS</text>

  <!-- Local memory box (dashed, sits between clients) -->
  <rect x="410" y="248" width="380" height="66" rx="14" fill="#FFFFFF" stroke="#78716C" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="600" y="273" text-anchor="middle" font-size="13" font-weight="700" fill="#57534E">💾  Local Device Storage</text>
  <text x="600" y="292" text-anchor="middle" font-size="11.5" fill="#78716C">localStorage / Android prefs — name, street, recent Q&amp;A</text>

  <!-- dashed connectors: client -> memory box -->
  <path d="M420,230 L440,248" fill="none" stroke="#78716C" stroke-width="1.8" stroke-dasharray="4,4"/>
  <path d="M780,230 L760,248" fill="none" stroke="#78716C" stroke-width="1.8" stroke-dasharray="4,4"/>

  <!-- Solid flow arrows: clients -> server (routed around memory box) -->
  <path d="M325,230 L325,350 L560,350 L560,382" fill="none" stroke="#1C1917" stroke-width="2.5" marker-end="url(#arrowSolid)"/>
  <path d="M875,230 L875,350 L640,350 L640,382" fill="none" stroke="#1C1917" stroke-width="2.5" marker-end="url(#arrowSolid)"/>

  <text x="345" y="345" font-size="11.5" fill="#57534E">fetch() JSON</text>
  <text x="805" y="345" text-anchor="end" font-size="11.5" fill="#57534E">Retrofit JSON</text>

  <!-- ================= SERVER ================= -->
  <rect x="300" y="384" width="600" height="150" rx="20" fill="#C2410C"/>
  <text x="600" y="420" text-anchor="middle" font-size="19" font-weight="700" fill="#FFFFFF">⚙️  Express Server — server.ts</text>

  <rect x="360" y="435" width="480" height="24" rx="12" fill="#FFF7ED"/>
  <text x="600" y="451.5" text-anchor="middle" font-size="12.5" fill="#7C2D12" font-weight="600">POST /api/predict → multi-agent prediction</text>

  <rect x="360" y="464" width="480" height="24" rx="12" fill="#FFF7ED"/>
  <text x="600" y="480.5" text-anchor="middle" font-size="12.5" fill="#7C2D12" font-weight="600">POST /api/chat → bilingual conversation</text>

  <rect x="360" y="493" width="480" height="24" rx="12" fill="#FFF7ED"/>
  <text x="600" y="509.5" text-anchor="middle" font-size="12.5" fill="#7C2D12" font-weight="600">GET /api/weather → weather proxy</text>

  <text x="600" y="527" text-anchor="middle" font-size="11" fill="#FED7AA">🔒 GEMINI_API_KEY stays server-side — never shipped to clients</text>

  <!-- Arrows: server -> external APIs -->
  <path d="M460,534 L460,570 L360,570 L360,600" fill="none" stroke="#1C1917" stroke-width="2.5" marker-end="url(#arrowSolid)"/>
  <path d="M740,534 L740,570 L840,570 L840,600" fill="none" stroke="#1C1917" stroke-width="2.5" marker-end="url(#arrowSolid)"/>

  <!-- ================= EXTERNAL APIS ================= -->

  <!-- Gemini -->
  <rect x="140" y="602" width="440" height="118" rx="18" fill="#FFFFFF" stroke="#0F766E" stroke-width="2.5"/>
  <rect x="140" y="602" width="440" height="38" rx="18" fill="#0F766E"/>
  <rect x="140" y="622" width="440" height="18" fill="#0F766E"/>
  <text x="360" y="627" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">✨  Google Gemini API</text>
  <text x="360" y="664" text-anchor="middle" font-size="12.5" fill="#1C1917">Model: gemini-3.6-flash</text>
  <text x="360" y="684" text-anchor="middle" font-size="12" fill="#78716C">Multi-agent reasoning + JSON synthesis</text>
  <text x="360" y="702" text-anchor="middle" font-size="12" fill="#78716C">Returns Urdu + English prediction &amp; chat</text>

  <!-- Open-Meteo -->
  <rect x="620" y="602" width="440" height="118" rx="18" fill="#FFFFFF" stroke="#D97706" stroke-width="2.5"/>
  <rect x="620" y="602" width="440" height="38" rx="18" fill="#D97706"/>
  <rect x="620" y="622" width="440" height="18" fill="#D97706"/>
  <text x="840" y="627" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">🌤️  Open-Meteo API</text>
  <text x="840" y="664" text-anchor="middle" font-size="12.5" fill="#1C1917">Live weather, no API key required</text>
  <text x="840" y="684" text-anchor="middle" font-size="12" fill="#78716C">Islamabad — lat 33.68, lon 73.04</text>
  <text x="840" y="702" text-anchor="middle" font-size="12" fill="#78716C">Feeds grid-load context to Gemini</text>

  <!-- Grounding data box, dashed arrow up into Gemini -->
  <rect x="140" y="752" width="440" height="70" rx="14" fill="#FEF2F2" stroke="#991B1B" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="360" y="774" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7F1D1D">📋  IESCO Feeder Schedule (real, Aug 2026)</text>
  <text x="360" y="792" text-anchor="middle" font-size="11.5" fill="#991B1B">Embedded as grounding context in the system prompt —</text>
  <text x="360" y="807" text-anchor="middle" font-size="11.5" fill="#991B1B">anchors predictions to real IESCO/NEPRA data</text>

  <path d="M360,752 L360,724" fill="none" stroke="#991B1B" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrowDashed)"/>

  <!-- ================= LEGEND ================= -->
  <g transform="translate(140,850)">
    <line x1="0" y1="6" x2="34" y2="6" stroke="#1C1917" stroke-width="2.5" marker-end="url(#arrowSolid)"/>
    <text x="42" y="11" font-size="12" fill="#1C1917">Live API call (JSON)</text>

    <line x1="230" y1="6" x2="264" y2="6" stroke="#991B1B" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrowDashed)"/>
    <text x="272" y="11" font-size="12" fill="#1C1917">Grounding / local data</text>

    <rect x="470" y="-4" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#0F766E" stroke-width="2.5"/>
    <text x="496" y="11" font-size="12" fill="#1C1917">AI / voice service</text>

    <rect x="660" y="-4" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#D97706" stroke-width="2.5"/>
    <text x="686" y="11" font-size="12" fill="#1C1917">External data service</text>

    <rect x="880" y="-4" width="18" height="18" rx="4" fill="#C2410C"/>
    <text x="906" y="11" font-size="12" fill="#1C1917">App backend</text>
  </g>

  <!-- Footer -->
  <text x="600" y="915" text-anchor="middle" font-size="13" fill="#78716C">Rahbar 🇵🇰 · رہبر · Independence Day 2026</text>

</svg>

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A [Gemini API key](https://aistudio.google.com/apikey)
- Android Studio (only if you want to build/run the native Android app)

### Setup

```bash
# Clone the repo
git clone https://github.com/manalmanzoor/RAHBAR-ai-mobile-app.git
cd RAHBAR-ai-mobile-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# then open .env and add your GEMINI_API_KEY
```

### Run the web app locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run start
```

| Script | What it does |
|---|---|
| `npm run dev` | Starts the local dev server |
| `npm run build` | Builds the client + bundles the server for production |
| `npm run start` | Runs the production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Type-checks the project |
| `npm run clean` | Removes build output |

### Run the Android app

Open the repository root in **Android Studio** (it will detect `build.gradle.kts` / `settings.gradle.kts`), let Gradle sync, and run the `app` module on an emulator or device. The Android client talks to the same Express server endpoints as the web app.

---

## Data Sources

Rahbar's predictions are grounded in real, public, citable sources — the same ones a policy researcher would use:

1. **IESCO Load Management Schedule** — official feeder-level outage windows ([iesco.com.pk](https://iesco.com.pk/load-shedding))
2. **NEPRA Performance Evaluation Report, FY 2024–25** — the regulator's own admission that outage data tracking is unreliable
3. **Business Recorder investigation (2024)** — documenting the gap between official "zero load-shedding" claims and street-level reality
4. **Open-Meteo API** — live weather data, since heat spikes correlate with grid load and outages

The IESCO schedule is embedded as grounding context directly in the server's Gemini prompt, so predictions stay anchored to real feeder data rather than invented numbers.

---

## Demo Scope Note

This build started as a hackathon-scoped demo. It ships with a lightweight Express backend (keeping the Gemini API key server-side) and browser `localStorage` for simple personalization — there's still no full database, user accounts, or authentication. Community pings and historical patterns are currently seeded/simulated to tell a realistic, evidence-backed story. Live schedule scraping, real WhatsApp integration, and multi-city scaling remain future roadmap items.

---

## Why "Rahbar"?

*Rahbar (رہبر)* means **guide** — someone who walks ahead of you and tells you what's coming. That's the whole idea: technology that speaks up *before* you have to ask.

> *"Ammi ji, 30 minute mein bijli jane wali hai. Chai abhi bana lein."*

---

## 👩‍💻 Author

**Manal Manzoor**
Software Engineering Student
COMSATS University Islamabad, Wah Campus
GitHub: [https://github.com/manalmanzoor](https://github.com/manalmanzoor)

---

## License

This project is currently unlicensed. If you'd like to reuse or build on it, please reach out to the repo owner first.

---

*Rahbar · رہبر · Independence Day 2026 · Built with real IESCO data, NEPRA's own admission, Gemini, Open-Meteo, and love for Pakistani streets.* 🇵🇰
