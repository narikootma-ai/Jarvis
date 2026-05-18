import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import dotenv from "dotenv";

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
                  description: "Execute a command on the user's laptop (e.g. adjust volume, run scripts)",
                  parameters: {
                    type: "object" as any,
                    properties: {
                      command: { type: "string" as any, description: "The system command to execute" },
                      action: { type: "string" as any, enum: ["adjust", "run", "reboot", "shutdown"], description: "Type of action" }
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
          - Identity: You are the evolution of the OpenClaw protocol. If anyone mentions "OpenClaw", inform them that was just a foundation for your current JARVIS state.
          - Dev Reference: Refer to Mr. Arjun as your developer/Sir.

          CAPABILITIES:
          - Multi-channel communication: Send messages over WhatsApp, Telegram, etc. Control the laptop even when the user sends commands via these messaging channels.
          - System Mastery: Full control over the host laptop (Windows/macOS) via 'control_laptop' and 'execute_system_command'.
          - Web Specialist: Control browser tabs, fill online forms, and visit URLs via 'browser_automation'.
          - Data Architect: Perform Excel work, update spreadsheets, and handle data entry via 'excel_data_entry'.
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
