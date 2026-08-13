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
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/dade9351-1754-4e8c-9e63-246ba7167d46" />


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
