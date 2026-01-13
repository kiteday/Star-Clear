- First update : 2026-01-08
- Last update : 2026-01-13
- Last code update : 2026-01-08

(한글 문서는 곧 업로드 예정입니다!)

**If you have any questions or feedback, please open an issue in the Issues tab.**

# 🚀 Star Clear: Galaxy Catch
A mobile arcade game built with React, Vite, and Capacitor, featuring AdMob integration for rewarded ads. Capture stars, avoid bombs, and clear the galaxy!

## 🎯 Project Intent & Concept
The goal was to build a robust mobile arcade game while exploring modern build tools. This project specifically focuses on navigating technical hurdles during environment setup, transitioning from a standalone CSS configuration to a **Vite-based development workflow** for better performance and reliability.

## 📅 Development Period
* **Total Duration**: 2026.01.06 ~ 2026.01.08
* **Setup Phase**: Explored various build environments; successfully migrated to **Vite** for optimized React development.
* **Development Phase**: Implemented core game mechanics, life/time systems, and dynamic star/bomb spawning.
* **Optimization Phase**: Fixed iOS SafeArea issues and integrated AdMob for rewarded video ads.

## ⌨️ Development Methodology: "Vibe Coding"
This project was developed using the **"Vibe Coding"** approach—leveraging high-level interaction with AI (Claude, Google AI Studio, Gemini) to rapidly prototype, debug, and iterate. 

* **Intuitive Iteration**: Focused on natural language communication to bridge the gap between creative ideas and complex code.
* **Rapid Problem Solving**: Navigated technical hurdles (like migrating to Vite and fixing iOS SafeArea issues) through real-time AI partnership.
* **Human-AI Collaboration**: Demonstrated how AI can accelerate the development lifecycle from initial setup to App Store readiness.

## ✨ Features
iOS Native Support: Fully optimized for iOS with SafeArea (Notch/Dynamic Island) support.

Level System: Progress through multiple worlds and sectors.

Rewarded Ads: Use gems to revive or extend time by watching ads.

Game Mechanics: Life and time management systems optimized for mobile play.

## 🛠 Tech Stack
Frontend: React (TypeScript), Vite, Tailwind CSS

Mobile Bridge: Capacitor

Monetization: Google AdMob

## 📦 Getting Started
Prerequisites
Node.js: v18 or higher

Xcode: v15 or higher (for iOS builds)

CocoaPods: Required for iOS dependency management

### Installation
Clone the repository:

```Bash

git clone https://github.com/your-username/star-clear.git
cd star-clear
```

Install dependencies:
```Bash
npm install
```

## 🔑 Environment Variables
For security reasons, AdMob IDs are not included in the repository. You must create a .env file in the root directory and add your own IDs.

Create a .env file:

```Bash
touch .env
```

Add the following variables (replace with your actual AdMob IDs):

```Plaintext

VITE_IOS_BANNER_ID=your_ios_banner_id
VITE_IOS_INTERSTITIAL_ID=your_ios_interstitial_id
VITE_IOS_REWARDED_ID=your_ios_rewarded_id

VITE_ANDROID_BANNER_ID=your_android_banner_id
VITE_ANDROID_INTERSTITIAL_ID=your_android_interstitial_id
VITE_ANDROID_REWARDED_ID=your_android_reward_id
```

## 📱 Build and Run (iOS)
Build the React project:

```Bash
npm run build
```

Sync the web code to the native iOS project:
```Bash
npx cap copy ios
```

Open the project in Xcode:

```Bash
npx cap open ios
```

Important: Select your development team in the Signing & Capabilities tab before building to a physical device.

## 📝 Important Notes
Signing: Requires an Apple Developer Account for physical device testing.

SafeArea: The app uses viewport-fit=cover and env(safe-area-inset-top) to ensure the UI is not hidden by the device notch.

## 🎮 How to Play
The objective is to clear each level by collecting stars while surviving the galaxy's hazards.

Objective: Collect the required number of Stars to complete the sector.

Controls: Tap or drag on the screen to move your character.

Avoid Obstacles: Do not touch the Bombs! Hitting a bomb will cost you a life.

Game Over: The game ends if you run out of Lives or if the Timer reaches zero.

Revive System:

Out of Lives? Watch a rewarded ad to gain +1 Life.

Out of Time? Watch a rewarded ad to add +10 Seconds to the clock.

Progress: Clear sectors to unlock new Worlds. Each world features unique themes and increased difficulty.


----
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
