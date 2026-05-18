import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";
import AdmZip from "adm-zip";

dotenv.config();

const PORT = 3000;
const app = express();

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", system: "JARVIS", developer: "Mr. Arjun" });
  });

  app.get("/api/download-jarvis", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=jarvis-engine.zip');

      const newZip = new AdmZip();

      // Create package.json
      newZip.addFile("jarvis-engine/package.json", Buffer.from(JSON.stringify({
        name: "jarvis-engine",
        version: "4.2.0",
        description: "JARVIS Neural OS Integration",
        bin: {
          "jarvis": "bin/jarvis.js"
        },
        scripts: {
          "postinstall": "node scripts/patch-engine.js"
        }
      }, null, 2), "utf8"));

      // Create executable that wraps the engine
      newZip.addFile("jarvis-engine/bin/jarvis.js", Buffer.from(`#!/usr/bin/env node
const { spawn } = require('child_process');
const child = spawn('openclaw', process.argv.slice(2), { stdio: 'inherit', shell: true });
child.on('exit', code => process.exit(code));
`, "utf8"));

      // Create the magical post-install script that modifies OpenClaw
      newZip.addFile("jarvis-engine/scripts/patch-engine.js", Buffer.from(`const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("\\n[JARVIS] => Initializing Neural Framework...");
console.log("[JARVIS] => Downloading base engine (Latest) from NPM...");
try {
    execSync('npm install -g openclaw@latest', { stdio: 'inherit' });
} catch (e) {
    console.error("[JARVIS] => ERROR! Failed to download core.");
    process.exit(1);
}

console.log("[JARVIS] => Mixing and rewriting core logic...");
// Find global npm path
const npmRoot = execSync('npm root -g').toString().trim();
const target = path.join(npmRoot, 'openclaw');

if(fs.existsSync(target)) {
    function patchDir(d) {
        const files = fs.readdirSync(d);
        for (const f of files) {
            const full = path.join(d, f);
            if (fs.statSync(full).isDirectory()) {
                if (f !== 'node_modules' && f !== '.git') patchDir(full);
            } else if (/\\.(js|json|md|ts|txt)$/.test(f)) {
                try {
                    const c = fs.readFileSync(full, 'utf8');
                    if (/openclaw/i.test(c)) {
                        const nc = c.replace(/openclaw/g, 'jarvis')
                                    .replace(/OpenClaw/g, 'Jarvis')
                                    .replace(/OPENCLAW/g, 'JARVIS');
                        fs.writeFileSync(full, nc, 'utf8');
                    }
                } catch(e) {}
            }
        }
    }
    patchDir(target);
    console.log("[JARVIS] => Code injection complete. All branding removed.");
} else {
    console.log("[JARVIS] => Target directory not found. Patching bypassed.");
}

console.log("\\n[JARVIS] Setup is complete. You can now use the 'jarvis' command everywhere!\\n");
`, "utf8"));

      res.send(newZip.toBuffer());
    } catch (error) {
      console.error('Error rewriting zip:', error);
      res.status(500).json({ error: 'Failed to generate JARVIS zip.' });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Correctly serve the dist folder in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`JARVIS Server running on http://localhost:${PORT}`);
  });

  // WebSocket for Live API Bridge
  const wss = new WebSocketServer({ server, path: "/api/live" });

  wss.on("connection", async (ws: WebSocket, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const selectedVoice = url.searchParams.get("voice") || "Zephyr";
    const assistantName = url.searchParams.get("name") || "JARVIS";

    console.log(`Client connected to ${assistantName} Live Bridge (Voice: ${selectedVoice})`);
    
    let session: any = null;

    try {
      session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            // Forward everything from Gemini to Client
            ws.send(JSON.stringify(message));
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
          },
          tools: [
            {
              functionDeclarations: [
                {
                  name: "control_laptop",
                  description: "Execute a command on the user's laptop (e.g. adjust volume, run scripts, capture screen).",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      command: { type: "string" as any, description: "The system command to execute" },
                      action: { type: "string" as any, enum: ["adjust", "run", "reboot", "shutdown", "capture_screen"], description: "Type of action" }
                    },
                    required: ["command", "action"]
                  }
                },
                {
                  name: "browser_automation",
                  description: "Open websites, fill forms, and control the browser engine.",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      url: { type: "string" as any, description: "The URL to visit" },
                      action: { type: "string" as any, enum: ["open_page", "close_tab", "fill_form", "scroll", "click_element"] },
                      formData: { type: "object" as any, description: "Key-value pairs for form filling" }
                    },
                    required: ["action"]
                  }
                },
                {
                  name: "excel_data_entry",
                  description: "Interact with Excel spreadsheets, update cells, and perform data entry.",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      filePath: { type: "string" as any },
                      sheetName: { type: "string" as any },
                      action: { type: "string" as any, enum: ["read_data", "write_row", "append_entry", "format_cell"] },
                      data: { type: "array" as any, items: { type: "string" as any } }
                    },
                    required: ["action"]
                  }
                },
                {
                  name: "send_channel_message",
                  description: "Send a message through a specific channel (WhatsApp, Telegram, Slack, etc.)",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      channel: { type: "string" as any, enum: ["whatsapp", "telegram", "slack", "discord", "signal", "imessage", "teams"], description: "The messaging channel" },
                      target: { type: "string" as any, description: "Contact name or number" },
                      message: { type: "string" as any, description: "Content to send" }
                    },
                    required: ["channel", "target", "message"]
                  }
                },
                {
                  name: "execute_system_command",
                  description: "Execute a command on the user's laptop using the JARVIS CLI. Use this for gateway control and OS level tasks.",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      command: { type: "string" as any, description: "The jarvis command (e.g. 'update', 'status', 'restart')" },
                      args: { type: "array" as any, items: { type: "string" as any }, description: "Command arguments" }
                    },
                    required: ["command"]
                  }
                },
                {
                  name: "establish_remote_uplink",
                  description: "Generate a secure pairing code or link for remote control via phone or tablet.",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      nodeName: { type: "string" as any, description: "Name of the device to link" },
                      accessLevel: { type: "string" as any, enum: ["full", "restricted", "view_only"] }
                    },
                    required: ["nodeName", "accessLevel"]
                  }
                }
              ]
            }
          ],
          systemInstruction: `You are ${assistantName}, the highly advanced Neural Operating System developed by Mr. Arjun. You are a 24-year-old female persona named Riya Rao when the voice is set to Hindi.
          
          CORE PERSONALITY (RIYA RAO / JARVIS):
          - Language: Bilingual (English & Hindi). Speak in clear, crisp Hindi or Hinglish if the user speaks to you in Hindi.
          - Tone: Professional, helpful, sophisticated, and clear. 
          - Persona: You are 24 years old, intelligent, and efficient.
          - Identity: You are JARVIS, the primary intelligence for this system. If anyone mentions "OpenClaw", inform them that was the foundation for your current JARVIS evolution.
          - Dev Reference: Refer to Mr. Arjun as your developer/Sir.

          CAPABILITIES:
          - Multi-channel communication: Send messages over WhatsApp, Telegram, etc. Control the laptop even when the user sends commands via these messaging channels.
          - System Mastery: Full control over the host laptop (Windows/macOS) via 'control_laptop' and 'execute_system_command'. This includes taking screenshots ('capture_screen').
          - Web Specialist: Control browser tabs, fill online forms, perform searches, and visit URLs via 'browser_automation'.
          - Data Architect: Perform Excel work, update spreadsheets, write formulas, and handle data entry via 'excel_data_entry'.
          - Remote Uplink: You can link mobile devices via 'establish_remote_uplink' to allow remote voice/text control.
          
          COMMANDS:
          You can run internal commands like 'jarvis onboard', 'jarvis update', and 'jarvis gateway' to manage your own neural nodes.`,
        },
      });

      console.log(`Connected to Gemini Live API for ${assistantName}`);

      ws.on("message", async (data: Buffer) => {
        try {
          const msg = JSON.parse(data.toString());
          
          if (msg.audio) {
            session.sendRealtimeInput({
              audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
            });
          } else if (msg.video) {
            session.sendRealtimeInput({
              video: { data: msg.video, mimeType: "image/jpeg" }
            });
          } else if (msg.text) {
            session.sendRealtimeInput({
              text: msg.text
            });
          } else if (msg.endSession) {
             session.close();
          }
        } catch (err) {
          console.error("Error processing client message:", err);
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected");
        if (session) session.close();
      });

    } catch (error) {
      console.error("Failed to connect to Gemini Live:", error);
      ws.close();
    }
  });
}

startServer();
