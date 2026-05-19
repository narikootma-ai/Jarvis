# JARVIS - Advanced Autonomous Intelligence System

JARVIS (formerly the legacy framework) is a high-performance personal AI Gateway for laptop control, browser automation, and data entry. Powered by Gemini Live WebSocket architecture, it provides a futuristic cinematic interface with real-time audio interaction and backend control.

## Overview

This project is a React-built web interface (running locally or over the web) that connects to a Node.js backend. Inside, it utilizes the live audio protocol for uninterrupted, low-latency conversational AI capabilities. It includes comprehensive environment controls, system status monitoring, and neural skills encapsulation. 

## Features

- **Voice Assistant Integration:** Microphone input, speech recognition, real-time audio playback using the Gemini Live API.
- **Cinematic Futuristic UI:** Dark HUD design, holographic glows, visual waveform representation for the neural bridge.
- **Modular Actions & Neural Skills:** Extendable architecture for Browser Engine, Excel Data Bridge, desktop automation, and media integrations (WhatsApp, Discord, etc).
- **Core Script Integration:** Downloads the base engine securely, automatically overwrites/rebrands any internal labels, and encapsulates exactly as a global system node.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the full-stack server (includes Vite middleware + API routes):
   ```bash
   npm run dev
   ```

3. To install the native system extension globally via Windows CMD:
   Download the JARVIS ZIP from the Kernel Terminal inside the interface, then run:
   ```bash
   npm install -g .
   jarvis onboard
   ```

## Architecture Notes

- `src/App.tsx`: Contains the central UI rendering, animations, and layouts.
- `src/hooks/useJarvisLive.ts`: Connects the Web Audio API with the backend Google GenAI stream.
- `server.ts`: Powers the API backend, connects WebSocket streams for live audio communication with Google GenAI, and encapsulates the system download route.

---
*(c) 2026 Arjun Neural Systems. All rights reserved.*
