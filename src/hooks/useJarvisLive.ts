import { useState, useEffect, useRef, useCallback } from 'react';
import { pcmFloat32ToBase64, base64ToFloat32 } from '../lib/audio-processing';

export function useJarvisLive({ voice = 'Zephyr', name = 'JARVIS' } = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('');
  const [toolCall, setToolCall] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const stopRecording = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const playAudio = useCallback((base64Audio: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
    }
    
    const ctx = audioContextRef.current;
    const float32Data = base64ToFloat32(base64Audio);
    const buffer = ctx.createBuffer(1, float32Data.length, 16000);
    buffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    // Schedule for gapless playback
    const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
  }, []);

  const startSession = useCallback(async () => {
    if (wsRef.current) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const params = new URLSearchParams({ voice, name });
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/live?${params.toString()}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to JARVIS Bridge');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle Audio Output
      const audioData = data.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        playAudio(audioData);
      }

      // Handle Transcription
      const modelTranscript = data.serverContent?.modelTurn?.parts?.[0]?.text;
      if (modelTranscript) {
        setJarvisResponse(prev => prev + modelTranscript);
      }

      // Handle User Transcript
      const userTranscript = data.serverContent?.inputAudioTranscription?.text;
      if (userTranscript) {
        setTranscript(userTranscript);
      }

      // Handle Tool Calls
      const toolCalls = data.toolCall?.functionCalls;
      if (toolCalls) {
        toolCalls.forEach((call: any) => {
          console.log('Tool Call:', call);
          setToolCall(`EXECUTING: ${call.name}(${JSON.stringify(call.args)})`);
          
          // Mimic execution and send response back
          setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                toolResponse: {
                  functionResponses: [{
                    id: call.id,
                    response: { output: "Success: Operation completed on host system." }
                  }]
                }
              }));
              setToolCall(null);
            }
          }, 1500);
        });
      }

      // Handle Interruption
      if (data.serverContent?.interrupted) {
         // Stop current playback
         // (Implementation for clearing queue would go here)
      }
    };

    ws.onclose = () => {
      console.log('JARVIS Bridge closed');
      setIsConnected(false);
      stopRecording();
    };
  }, [voice, name, playAudio, stopRecording]);

  const stopSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopRecording();
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64 = pcmFloat32ToBase64(e.inputBuffer.getChannelData(0));
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };

      processorRef.current = processor;
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  }, []);

  return {
    isConnected,
    isRecording,
    transcript,
    jarvisResponse,
    toolCall,
    startSession,
    stopSession,
    startRecording,
    stopRecording
  };
}
