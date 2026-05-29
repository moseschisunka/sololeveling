# THE SYSTEM: Solo Leveling accountability system (Gym & Intellectual HUD)

Welcome, Hunter. **THE SYSTEM** is a real-world, highly immersive Solo Leveling-inspired accountability and leveling system designed to push your physical limits at the gym and sharpen your cognitive capacity through rigorous academic trials.

This repository bundles both the high-performance Web-based HUD portal and the standalone Mobile Android packaging shell.

---

## 📂 Repository Structure

*   **[`/solo-leveling-system`](./solo-leveling-system)**: The core web application containing the high-tech sci-fi dashboard interface (`index.html`, `styles.css`, `app.js`). Runs completely client-side.
*   **[`/solo-leveling-system-android`](./solo-leveling-system-android)**: A modern Jetpack Compose/Kotlin WebView shell that packages the compiled web assets into a high-performance standalone Android APK.

---

## ⚡ Core Features

### 1. Physical Accountability (The Gym Trials)
*   **Dynamic Workouts**: Log gym activities with a wide variety of exercise variations to earn EXP, raise active Hunter levels, and scale combat stats.
*   **Faltered Resolve Penalty**: If you miss your gym trials (inactive for 36h+), a fullscreen **Survival Game Gate** triggers immediately! You must complete your penalty workout (or clear the canvas minigame) within the strict countdown timer, or face severe stat exhaustions (-20% STR/AGI) and EXP/Gold deductions.
*   **Loot Gacha Chests**: Complete daily trials to earn Bronze, Silver, or Gold loot chests, yielding stats modifications and inventory collectibles.

### 2. Intellectual Trials (Monarch of Mind)
*   **Daily Study Nodes**: Conquers five daily academic modules:
    1.  📖 **Holy Scripture** (Bible Reading & Hermeneutics)
    2.  ⚖️ **Comparative Religion** (Christian-Islamic Studies & Comparative Theologies)
    3.  🌍 **World Political History** (Empires, Geopolitical Treaties, Westphalia)
    4.  🏛️ **Philosophy & Theology** (Epistemology, Ethics, Classical Treatises)
    5.  🧪 **Public Health & Epidemiology** (Epidemiology, Biostatistics, prospective cohort studies)
*   **Dual-Engine AI Core**: Bind your **Google Gemini API Key** in the settings panel to dynamically generate unique study passages, discussion prompts, and quiz questions client-side. Works with a high-fidelity pre-programmed offline database fallback when no key is present.
*   **Synaptic Flashcard Codex**: 25 preloaded academic flashcards with fluid 3D card flipping and self-assessment mastery tracking.
*   **Weekly Monarch Exams**: Unlock 10-question exams under a 10-minute timer using permits earned from study streaks to clear fatigue and permanently raise cognitive stats.
*   **Dynamic System IQ**: Scales your intelligence rank (E-Rank to S-Rank Monarch Core) which translates to a flat raw combat damage bonus (+5% per rank) inside dungeons!

---

## 📱 Mobile Android APK Packaging

The Android shell compiles all web assets directly inside the mobile container's offline storage, offering:
*   **Edge-To-Edge Fullscreen**: Transparent system status and navigation bars blended into the neon glowing game interface.
*   **Complete Offline Persistence**: Powered by hardware-accelerated WebView `domStorage` to save hunter states locally.
*   **Hardware Back-Button Navigation**: Smooth back-stack handling that browses active tab history before exiting.

---

## 🚀 How to Run Locally

### 1. Web Portal (Browser)
Navigate to the web directory and spin up a lightweight development server:
```bash
cd solo-leveling-system
python -m http.server 8080
```
Open **`http://localhost:8080`** in your browser.

### 2. Standalone Android Compilation
Open `/solo-leveling-system-android` inside **Android Studio**, or build the package from your shell using Gradle:
```bash
cd solo-leveling-system-android
./gradlew assembleDebug
```
The compiled package will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`
