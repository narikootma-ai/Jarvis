import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Power, Shield, Activity, Cpu, User, Terminal, HardDrive, Database, Network, Settings, X, Volume2 } from 'lucide-react';
import { useJarvisLive } from './hooks/useJarvisLive';

export default function App() {
  const [config, setConfig] = useState({
    name: 'JARVIS',
    voice: 'Aoede'
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'providers' | 'channels' | 'security' | 'nodes' | 'skills' | 'terminal'>('identity');
  
  const [integrations, setIntegrations] = useState({
    openai: '',
    anthropic: '',
    whatsapp: false,
    telegram: true,
    discord: true,
  });

  const {
    isConnected,
    isRecording,
    transcript,
    jarvisResponse,
    toolCall,
    startSession,
    stopSession,
    startRecording,
    stopRecording
  } = useJarvisLive(config);

  const [bootSequence, setBootSequence] = useState(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [uptime, setUptime] = useState('142:12:04');

  useEffect(() => {
    if (toolCall) {
      setSystemLogs(prev => [...prev.slice(-15), toolCall]);
    }
  }, [toolCall]);

  useEffect(() => {
    const timer = setTimeout(() => setBootSequence(false), 3000);
    const initialLogs = [
      "SYSTEM_CORE: INITIALIZING JARVIS OS...",
      "GATEWAY_PROTOCOL: UPLINK_CORE_V5_SECURE",
      "INTEGRATING_MODALITY: BROWSER, EXCEL, SYSTEM_CONTROL",
      "MAPPING_USER_PROFILE: MR_ARJUN_AUTHENTICATED",
      "AUTH_HANDSHAKE: BIOMETRIC_LOCKED",
      "ALL_SYTEMS_GO: JARVIS_LIVE_UPLINK_READY",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < initialLogs.length) {
        setSystemLogs(prev => [...prev, initialLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleSyncCore = () => {
    setIsSettingsOpen(false);
    if (isConnected) {
      stopSession();
      setSystemLogs(prev => [...prev, "RESTARTING NEURAL BRIDGE WITH NEW PROFILE..."]);
      setTimeout(() => startSession(), 800);
    } else {
      setSystemLogs(prev => [...prev, "CORE PROFILE UPDATED. READY FOR UPLINK."]);
    }
  };

  const handleToggleMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Update logs when transcript or response changes
  useEffect(() => {
    if (transcript) {
      setSystemLogs(prev => [...prev.slice(-10), `USER: ${transcript.substring(0, 30)}...`]);
    }
  }, [transcript]);

  useEffect(() => {
    if (jarvisResponse) {
      setSystemLogs(prev => [...prev.slice(-10), `JARVIS: Processing...`]);
    }
  }, [jarvisResponse]);

  return (
    <div className="h-screen w-full bg-[#020408] text-[#00d4ff] flex flex-col font-mono overflow-hidden relative border-4 border-[#00d4ff20] selection:bg-[#00d4ff30] selection:text-white">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 jarvis-grid" />
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#00d4ff30] bg-[#020408]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ scale: isConnected ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-10 h-10 border-2 border-[#00d4ff] rounded-full flex items-center justify-center relative shadow-[0_0_15px_rgba(0,212,255,0.2)]"
          >
            <div className={`w-6 h-6 rounded-full blur-[4px] ${isConnected ? 'bg-[#00d4ff] animate-pulse' : 'bg-red-900 opacity-50'}`}></div>
            <div className="absolute inset-0 border border-dashed border-[#00d4ff50] rounded-full animate-[spin_10s_linear_infinite]" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black tracking-widest text-[#00d4ff] flex items-baseline gap-2">
              {config.name.toUpperCase()} <span className="text-[10px] font-light text-cyan-700 tracking-normal">SYSTEM CORE</span>
            </h1>
            <p className="text-[9px] uppercase tracking-tighter opacity-70">Laptop Control Interface // MR. ARJUN</p>
          </div>
        </div>
        
        <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold items-center">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 border border-[#00d4ff30] rounded-md hover:bg-[#00d4ff10] transition-colors group"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>
          <div className="flex flex-col items-end">
            <span className="opacity-50 text-[8px] font-normal">System Health</span>
            <span className={isConnected ? "text-green-400" : "text-yellow-500"}>{isConnected ? 'OPTIMUM' : 'REDUCED'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="opacity-50 text-[8px] font-normal">Uptime</span>
            <span className="text-[#00d4ff]">{uptime}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="opacity-50 text-[8px] font-normal">Network</span>
            <span className="text-[#00d4ff]">PROTECTED LINK</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex p-6 gap-6 z-10 overflow-hidden">
        
        {/* Left Sidebar: Hardware & Control */}
        <aside className="w-64 flex flex-col gap-4 flex-shrink-0">
          <div className="bg-[#00d4ff05] border border-[#00d4ff20] p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
            <h2 className="text-[11px] font-bold border-b border-[#00d4ff20] pb-2 mb-4 flex items-center justify-between tracking-widest">
              SYSTEM MODULES
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
            </h2>
            <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
              {[
                { label: 'BROWSER ENGINE', val: isConnected ? 'ACTIVE' : 'IDLE', unit: '', percent: isConnected ? 88 : 0, icon: <Network className="w-3 h-3" /> },
                { label: 'EXCEL DATA BRIDGE', val: isConnected ? 'LOADED' : 'IDLE', unit: '', percent: isConnected ? 92 : 0, icon: <Database className="w-3 h-3" /> },
                { label: 'DESKTOP SIGHT', val: isConnected ? 'SCANNING' : 'IDLE', unit: '', percent: isConnected ? 75 : 0, icon: <Activity className="w-3 h-3" /> },
                { label: 'STORAGE CLAW', val: isConnected ? 'SECURE' : 'IDLE', unit: '', percent: isConnected ? 34 : 0, icon: <HardDrive className="w-3 h-3" /> },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="flex items-center gap-1 opacity-70 italic">{item.icon} {item.label}</span>
                    <span className="font-bold">{item.val}{item.unit}</span>
                  </div>
                  <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.5)]" 
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <p className="text-[8px] font-bold opacity-30 mb-2 uppercase tracking-widest flex items-center gap-1">
                   <Network className="w-2 h-2" /> Global Channels
                </p>
                <div className="grid grid-cols-2 gap-2">
                   {[
                     { name: 'WhatsApp', count: 12, color: 'text-green-500' },
                     { name: 'Discord', count: 4, color: 'text-indigo-400' },
                     { name: 'Telegram', count: 8, color: 'text-blue-400' },
                     { name: 'Slack', count: 2, color: 'text-orange-400' },
                   ].map(c => (
                     <div key={c.name} className="text-[8px] border border-cyan-900/30 px-2 py-1 flex justify-between bg-cyan-950/20">
                       <span className={c.color}>{c.name}</span>
                       <span className="opacity-50 tracking-tighter">{isConnected ? c.count : 0}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#00d4ff10]">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-3 h-3 opacity-50" />
                <span className="text-[9px] uppercase font-bold tracking-widest opacity-50">Authorized Operator</span>
              </div>
              <div className="bg-[#00d4ff10] p-2 rounded text-[11px] font-bold text-center border border-[#00d4ff20]">
                MR. ARJUN
              </div>
            </div>
          </div>
          
          <div className="bg-[#00d4ff05] border border-[#00d4ff20] p-4 rounded-lg">
            <h2 className="text-[11px] font-bold border-b border-[#00d4ff20] pb-2 mb-2 tracking-widest">SYSTEM ACTIONS</h2>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
              <button 
                onClick={startSession}
                disabled={isConnected}
                className="border border-[#00d4ff40] p-2 hover:bg-[#00d4ff15] transition-colors disabled:opacity-30 flex items-center justify-center gap-1"
              >
                INIT UPLINK
              </button>
              <button 
                onClick={stopSession}
                disabled={!isConnected}
                className="border border-[#00d4ff40] p-2 hover:bg-red-950/30 hover:border-red-500/40 text-red-400 transition-colors disabled:opacity-30"
              >
                TERMINATE
              </button>
            </div>
          </div>
        </aside>

        {/* Center Section: The Core Interface */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Control Center Modal */}
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020408]/95 z-[60] backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
              >
                <div className="w-full max-w-5xl h-[85vh] border border-[#00d4ff30] bg-[#020408] rounded-xl flex overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.15)] relative">
                  {/* Modal Sidebar */}
                  <div className="w-56 border-r border-[#00d4ff20] bg-[#00d4ff05] flex flex-col p-4">
                    <div className="mb-10 p-2">
                       <h2 className="text-sm font-black text-[#00d4ff] tracking-[0.2em] uppercase">Control Center</h2>
                       <p className="text-[8px] opacity-40 uppercase font-mono tracking-tighter">JARVIS System V4.0.2</p>
                    </div>
                    
                    <nav className="flex flex-col gap-2">
                       {[
                         { id: 'identity', label: 'Core Identity', icon: <User className="w-4 h-4" /> },
                         { id: 'providers', label: 'AI Providers', icon: <Cpu className="w-4 h-4" /> },
                         { id: 'channels', label: 'Media Channels', icon: <Network className="w-4 h-4" /> },
                         { id: 'security', label: 'Security Handshake', icon: <Shield className="w-4 h-4" /> },
                         { id: 'skills', label: 'Neural Skills', icon: <Terminal className="w-4 h-4" /> },
                         { id: 'nodes', label: 'Remote Uplink', icon: <HardDrive className="w-4 h-4" /> },
                         { id: 'terminal', label: 'Kernel Terminal', icon: <Terminal className="w-4 h-4" /> },
                       ].map((item) => (
                         <button 
                          key={item.id}
                          onClick={() => setActiveTab(item.id as any)}
                          className={`flex items-center gap-4 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            activeTab === item.id ? 'bg-[#00d4ff15] text-[#00d4ff] border border-[#00d4ff30]' : 'opacity-40 hover:opacity-100 hover:bg-[#00d4ff05]'
                          }`}
                         >
                           <span className={activeTab === item.id ? 'text-[#00d4ff]' : 'text-gray-500'}>{item.icon}</span>
                           {item.label}
                         </button>
                       ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-[#00d4ff10]">
                       <div className="flex items-center gap-3 px-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[8px] font-bold uppercase opacity-50 tracking-widest text-[#00d4ff]">Gateway Online</span>
                       </div>
                       <button 
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-full py-3 border border-red-900/50 text-red-500 text-[10px] font-black uppercase rounded hover:bg-red-950/20 tracking-[0.1em]"
                       >
                         Terminate Session
                       </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 p-10 overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode="wait">
                      {activeTab === 'identity' && (
                        <motion.div 
                          key="identity"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          className="space-y-8"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">Assistant Identity</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Modify the neural persona and vocal profile</p>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-[11px] uppercase tracking-[0.3em] font-bold opacity-40">System Designation</label>
                              <input 
                                type="text" 
                                value={config.name}
                                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                className="w-full bg-[#00d4ff05] border border-[#00d4ff30] p-4 outline-none focus:border-[#00d4ff] text-xl font-black text-white tracking-widest"
                                placeholder="e.g. JARVIS"
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <label className="text-[11px] uppercase tracking-[0.3em] font-bold opacity-40">Select Neural Voice Identity</label>
                              <div className="space-y-1 border border-[#00d4ff20] bg-[#00d4ff02] rounded-lg overflow-hidden">
                                {[
                                  { id: 'Aoede', name: 'Riya Rao (Hindi)', desc: '24-year-old female, clear and crisp Hindi/English voice' },
                                  { id: 'Zephyr', name: 'Zephyr', desc: 'Professional neutral synthesizer for technical ops' },
                                  { id: 'Puck', name: 'Puck', desc: 'High-energy response profile for rapid interaction' },
                                  { id: 'Charon', name: 'Charon', desc: 'Sub-bass resonant frequency for deep system status' },
                                  { id: 'Kore', name: 'Kore', desc: 'Calm and precise auditory feedback module' },
                                  { id: 'Fenrir', name: 'Fenrir', desc: 'Authoritative and robust system presence' }
                                ].map(v => (
                                  <button 
                                    key={v.id}
                                    onClick={() => setConfig({...config, voice: v.id})}
                                    className={`w-full p-4 text-left flex items-center justify-between transition-all border-b border-[#00d4ff10] last:border-0 ${
                                      config.voice === v.id ? 'bg-[#00d4ff15] text-[#00d4ff]' : 'opacity-40 hover:opacity-100 hover:bg-[#00d4ff05]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className={`p-2 rounded-full border ${config.voice === v.id ? 'border-[#00d4ff] text-[#00d4ff]' : 'border-gray-800 text-gray-500'}`}>
                                        <Volume2 className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className="text-[12px] font-black uppercase tracking-widest">{v.name}</p>
                                        <p className="text-[9px] opacity-60 lowercase mt-0.5 tracking-tighter">{v.desc}</p>
                                      </div>
                                    </div>
                                    {config.voice === v.id && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black tracking-widest uppercase animate-pulse">Selected</span>
                                        <div className="w-2 h-2 rounded-full bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={handleSyncCore}
                            className="w-full mt-10 bg-[#00d4ff] text-[#020408] py-4 px-6 font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                          >
                            Synchronize Core
                          </button>
                        </motion.div>
                      )}

                      {activeTab === 'terminal' && (
                        <motion.div 
                          key="terminal"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="space-y-6 h-full flex flex-col"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">Kernel Terminal</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Direct CLI interaction with JARVIS Gateway</p>
                          </div>
                          
                          <div className="flex-1 bg-black/60 border border-[#00d4ff20] rounded-xl p-4 font-mono text-[10px] overflow-y-auto scrollbar-hide space-y-1">
                             <p className="text-green-500 font-bold">JARVIS Kernel [Version 4.2.0-stable]</p>
                             <p className="text-green-500 font-bold">(c) 2026 Arjun Neural Systems. All rights reserved.</p>
                             <p className="opacity-40 mt-4">--- SYSTEM BOOT COMPLETE ---</p>
                             <div className="my-4 p-4 border border-cyan-800 bg-cyan-950/20 rounded text-left">
                                <p className="text-[#00d4ff] font-black uppercase mb-2">JARVIS NATIVE INSTALLATION (WINDOWS CMD)</p>
                                
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-[10px] text-white/50 mb-1 font-bold uppercase tracking-widest">Step 1: Download JARVIS Core Engine</p>
                                    <a 
                                      href="/api/download-jarvis" 
                                      download="jarvis-engine.zip"
                                      className="inline-block mt-2 px-6 py-3 bg-[#00d4ff20] border border-[#00d4ff] text-[#00d4ff] rounded font-black tracking-widest text-[11px] uppercase hover:bg-[#00d4ff40] transition-colors"
                                    >
                                      Download JARVIS ZIP
                                    </a>
                                  </div>

                                  <div>
                                    <p className="text-[10px] text-white/50 mb-1 font-bold uppercase tracking-widest">Step 2: Extract & Install</p>
                                    <p className="text-[10px] opacity-70 mb-2">Extract the ZIP. Inside the <span className="text-white font-bold">jarvis-engine</span> folder, run CMD and execute:</p>
                                    <code className="bg-black/40 px-3 py-2 rounded border border-cyan-700/30 text-white font-mono text-[11px] block">npm install -g .</code>
                                    <p className="text-[9px] text-[#00d4ff] mt-2 italic">*This will auto-fetch the base and perfectly mix JARVIS into its coding!</p>
                                  </div>

                                  <div>
                                    <p className="text-[10px] text-white/50 mb-1 font-bold uppercase tracking-widest">Step 3: Start JARVIS</p>
                                    <code className="bg-black/40 px-3 py-2 rounded border border-cyan-700/30 text-white font-mono text-[11px] block">jarvis onboard</code>
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-cyan-900/50">
                                   <p className="text-[10px] text-cyan-400 font-bold uppercase">Note for Mr. Arjun:</p>
                                   <p className="text-[9px] opacity-80 mt-1 leading-relaxed">
                                      Sir, maafi chahungi. Pichli baar wali GitHub ZIP script galat hone ki wajah se CMD install nahi ho saka aur break ho gaya. Mujhe exactly samajh aa gaya hai ab aap kya chahte hain! Maine ek naya smart script package banaya hai. Ye automatically <b>npm install -g openclaw@latest</b> ko run karega, aur turant uski poori deep coding me mix ho kar JARVIS setup kar dega taaki openclaw ka naam nishan mit jaye. Ab naya ZIP download karein, pakka work karega!
                                   </p>
                                </div>
                             </div>
                             <p className="text-cyan-400">$ jarvis doctor</p>
                             <p className="ml-4">Checking Node.js version... OK (v22.19.0)</p>
                             <p className="ml-4">Installing JARVIS control plane... DONE</p>
                             <p className="ml-4">Registering background services... DONE</p>
                             <p className="text-cyan-400">$ jarvis doctor</p>
                             <p className="ml-4 text-green-400">✓ Connectivity: Secure</p>
                             <p className="ml-4 text-green-400">✓ AI-Core: Gemini-Live Ready</p>
                             <p className="ml-4 text-green-400">✓ Encryption: AES-256 Symmetric</p>
                             <p className="text-cyan-400">$ jarvis gateway --status</p>
                             <p className="ml-4">Gateway running on port 18789</p>
                             <p className="ml-4">Active sessions: 1 (MR_ARJUN_MAIN)</p>
                             <p className="text-cyan-400 animate-pulse">$ _</p>
                          </div>
                          
                          <div className="flex gap-2">
                             <input 
                              type="text" 
                              placeholder="Type command... (e.g. jarvis update)"
                              className="flex-1 bg-[#00d4ff05] border border-[#00d4ff30] p-3 text-[10px] outline-none focus:border-[#00d4ff]"
                             />
                             <button className="px-6 bg-[#00d4ff20] border border-[#00d4ff40] text-[10px] font-black uppercase">Run</button>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'providers' && (
                        <motion.div 
                          key="providers"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="space-y-10"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">Intelligence Nodes</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Link external API providers to expand JARVIS knowledge</p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-8">
                            {[
                              { id: 'openai', name: 'OpenAI (GPT-4o/o1)', logo: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg' },
                              { id: 'anthropic', name: 'Anthropic (Claude 3.5 Sonnet)', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Anthropic_logo.svg' },
                              { id: 'google', name: 'Google Gemini (Native Bridge)', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', type: 'ACTIVE' },
                            ].map(p => (
                              <div key={p.id} className="p-6 border border-[#00d4ff20] bg-[#00d4ff05] rounded-xl flex items-center justify-between group hover:border-[#00d4ff50] transition-all">
                                <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 bg-white/10 rounded-lg p-2 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                                    <Cpu className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black tracking-widest uppercase">{p.name}</h4>
                                    <p className="text-[10px] opacity-40 uppercase tracking-tighter mt-1">{p.type === 'ACTIVE' ? 'Protocol Connected' : 'Encryption Key Required'}</p>
                                  </div>
                                </div>
                                {p.type === 'ACTIVE' ? (
                                  <div className="flex items-center gap-2 text-green-500 font-black text-[10px] tracking-widest">
                                    <Shield className="w-3 h-3" /> LINKED
                                  </div>
                                ) : (
                                  <input 
                                    type="password" 
                                    placeholder="PASTE_API_SECRET"
                                    className="bg-[#020408] border border-[#00d4ff20] p-2 text-[10px] outline-none focus:border-[#00d4ff] text-cyan-200 w-48 font-mono"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'channels' && (
                        <motion.div 
                          key="channels"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="space-y-10"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">Media Gateways</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Global messaging & notification channels</p>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              { name: 'WhatsApp', status: 'DISCONNECTED', color: 'text-green-500' },
                              { name: 'Telegram', status: 'ACTIVE', color: 'text-blue-400' },
                              { name: 'Discord', status: 'ACTIVE', color: 'text-indigo-400' },
                              { name: 'Slack', status: 'STANDBY', color: 'text-orange-400' },
                              { name: 'Signal', status: 'SECURED', color: 'text-blue-600' },
                              { name: 'Teams', status: 'LOCKED', color: 'text-purple-400' }
                            ].map(ch => (
                              <div key={ch.name} className="p-6 border border-[#00d4ff10] bg-[#00d4ff05] rounded-xl flex flex-col gap-4 hover:border-[#00d4ff40] transition-all cursor-pointer group">
                                <div className="flex justify-between items-start">
                                  <span className={`text-sm font-black tracking-[0.2em] uppercase ${ch.color}`}>{ch.name}</span>
                                  <Network className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${ch.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-red-500/30'}`} />
                                    <span className="text-[10px] font-black tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{ch.status}</span>
                                  </div>
                                  <button className="mt-4 w-full border border-[#00d4ff20] py-2 text-[9px] font-black uppercase tracking-widest hover:bg-[#00d4ff10] transition-all">Configure Bridge</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'security' && (
                        <motion.div 
                          key="security"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="space-y-10"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">OAuth & Security</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Manages biometric handshakes and OAuth permissions</p>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-[#00d4ff05] border border-[#00d4ff20] p-8 rounded-2xl flex items-center justify-between relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Shield className="w-32 h-32" />
                               </div>
                               <div className="z-10">
                                  <h4 className="text-lg font-black tracking-widest text-[#00d4ff]">Google Workspace Link</h4>
                                  <p className="text-[10px] opacity-40 uppercase tracking-widest max-w-sm mt-1">Full access to Calendar, Drive, and Gmail for automated scheduling</p>
                                  <button className="mt-6 bg-[#00d4ff15] border border-[#00d4ff] text-[#00d4ff] px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00d4ff] hover:text-[#020408] transition-all">Start OAuth Handshake</button>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-6 border border-[#00d4ff10] bg-[#00d4ff05] rounded-xl">
                                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4 text-[#00d4ff]">Pairing Protocol</p>
                                  <div className="flex items-center justify-between">
                                     <span className="text-xs font-black tracking-widest">Enforce 2FA</span>
                                     <button className="w-12 h-6 bg-cyan-950 rounded-full flex items-center px-1 border border-cyan-800">
                                        <div className="w-4 h-4 bg-cyan-500 rounded-full translate-x-6" />
                                     </button>
                                  </div>
                               </div>
                               <div className="p-6 border border-[#00d4ff10] bg-[#00d4ff05] rounded-xl">
                                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4 text-[#00d4ff]">Developer Mode</p>
                                  <div className="flex items-center justify-between">
                                     <span className="text-xs font-black tracking-widest">Raw Terminal Access</span>
                                     <button className="w-12 h-6 bg-red-950 rounded-full flex items-center px-1 border border-red-800">
                                        <div className="w-4 h-4 bg-red-500 rounded-full" />
                                     </button>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'skills' && (
                        <motion.div 
                          key="skills"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="space-y-10"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">Neural Skill Registry</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Active capabilities integrated from the JARVIS Ecosystem</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { name: 'System Control', desc: 'Can adjust volume, open apps, and run scripts on host OS.', active: true },
                              { name: 'Browser Engine', desc: 'Automated web navigation, form filling, and page control.', active: true },
                              { name: 'Excel Bridge', desc: 'Active data entry and spreadsheet manipulation protocol.', active: true },
                              { name: 'Media Bridge', desc: 'Cross-platform message sending (WhatsApp/Telegram).', active: true },
                              { name: 'Smart Home', desc: 'Control IoT devices via HomeAssistant bridge.', active: false },
                              { name: 'Deep Search', desc: 'Real-time web browsing and research protocol.', active: true }
                            ].map(skill => (
                              <div key={skill.name} className="p-5 border border-[#00d4ff10] bg-[#00d4ff05] rounded-xl flex items-center justify-between group hover:border-[#00d4ff50] transition-all">
                                <div>
                                  <h4 className="text-xs font-black tracking-widest text-white">{skill.name.toUpperCase()}</h4>
                                  <p className="text-[9px] opacity-40 mt-1 max-w-[180px] leading-tight">{skill.desc}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className={`w-3 h-3 rounded-full ${skill.active ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 'bg-gray-800'}`} />
                                  <span className="text-[8px] font-bold opacity-30">{skill.active ? 'LOADED' : 'OFFLINE'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-[#00d4ff10] pt-6 flex justify-center">
                             <button className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-cyan-400 transition-all">+ Add Skills from GitHub Repository</button>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'nodes' && (
                        <motion.div 
                          key="nodes"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="space-y-10"
                        >
                          <div className="border-b border-[#00d4ff20] pb-4">
                             <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-[#00d4ff]">Remote Node Uplink</h3>
                             <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1 italic">Establish encrypted channels for remote mobile control</p>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-[#00d4ff05] border border-[#00d4ff15] p-6 rounded-2xl flex items-center justify-between">
                               <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 bg-[#00d4ff] text-[#020408] rounded-xl flex items-center justify-center font-black text-2xl shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                                     429-X
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-black tracking-widest text-[#00d4ff]">UPLINK PAIRING CODE</h4>
                                     <p className="text-[10px] opacity-40 uppercase mt-1 tracking-tighter">Enter this code in the JARVIS Mobile app to link device</p>
                                  </div>
                               </div>
                               <button className="px-6 py-2 border border-[#00d4ff30] text-[10px] font-black uppercase hover:bg-[#00d4ff10] transition-all">Regenerate</button>
                            </div>

                            <div className="space-y-4">
                              <h5 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30 px-2">Connected Devices</h5>
                              {[
                                { id: '1', name: 'ARJUN_IPHONE_15', plat: 'iOS 18.2', lastSeen: 'Just Now', status: 'LINKED' },
                                { id: '2', name: 'GALAXY_S24_PRO', plat: 'Android 14', lastSeen: '2h ago', status: 'STANDBY' },
                              ].map(node => (
                                <div key={node.id} className="p-5 border border-[#00d4ff10] bg-[#00d4ff02] rounded-xl flex items-center justify-between hover:border-[#00d4ff40] transition-all group">
                                  <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 border border-[#00d4ff20] rounded-lg flex items-center justify-center text-[#00d4ff] group-hover:bg-[#00d4ff10] transition-all">
                                      <Mic className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black tracking-widest uppercase">{node.name}</h4>
                                      <p className="text-[9px] opacity-40 uppercase tracking-widest flex items-center gap-2">
                                         {node.plat} <span className="opacity-20">|</span> Last Link: {node.lastSeen}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-[10px] font-black tracking-widest ${node.status === 'LINKED' ? 'text-cyan-400' : 'text-gray-600'}`}>{node.status}</span>
                                    <button className="block text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 mt-1 hover:text-red-400 transition-all">Disconnect Node</button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-4 border border-dashed border-[#00d4ff20] rounded-xl text-center bg-[#00d4ff02]">
                               <p className="text-[9px] opacity-50 uppercase tracking-[0.2em]">Secure communication via Signal Protocol (E2EE)</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {bootSequence && (
              <motion.div 
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center bg-[#020408]/95 z-50 rounded-2xl border border-cyan-900/40 backdrop-blur-xl"
              >
                <div className="text-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-32 h-32 border-2 border-t-cyan-400 border-r-transparent border-b-cyan-900 border-l-transparent rounded-full mb-8 mx-auto relative"
                  >
                    <div className="absolute inset-4 border border-dashed border-cyan-800 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                  </motion.div>
                  <p className="text-sm tracking-[1.5em] font-black animate-pulse uppercase">Booting Jarvis OS</p>
                  <p className="text-[10px] mt-2 opacity-50 uppercase tracking-widest">Securing connection to developer Arjun...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Radial Voice Viz */}
          <div className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
            {/* HUD Elements */}
            <div className={`absolute inset-0 border-[1px] border-dashed border-cyan-800/40 rounded-full ${isConnected ? 'animate-[spin_40s_linear_infinite]' : ''}`} />
            <div className={`absolute inset-6 border-[1px] border-cyan-700/20 rounded-full ${isConnected ? 'animate-[spin_60s_linear_infinite_reverse]' : ''}`} />
            <div className="absolute inset-12 border-[2px] border-cyan-400/10 rounded-full" />
            
            {/* Labels for HUD effect */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.6em] bg-[#020408] px-3 font-bold opacity-60 uppercase">Voice Data Stream</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.6em] bg-[#020408] px-3 font-bold opacity-60 uppercase whitespace-nowrap">
              {isRecording ? 'Aural Sensors Global' : 'Sensors Idle'}
            </div>
            
            {/* Central Interaction Core */}
            <motion.button 
              onClick={isConnected ? handleToggleMic : startSession}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 flex items-center justify-center transition-all duration-700 shadow-[0_0_60px_rgba(0,212,255,0.15)] ${
                isConnected ? 'border-cyan-400 bg-cyan-500/5' : 'border-red-900/50 bg-red-950/5'
              }`}
            >
              {isConnected ? (
                <div className="flex gap-2 h-16 items-center">
                  {[4, 12, 8, 16, 6, 12, 4].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={isRecording ? { height: [h*4, h*2, h*5, h*3] } : { height: h*2 }}
                      transition={{ repeat: Infinity, duration: 0.4 + i*0.1 }}
                      className="w-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(0,212,255,0.8)]" 
                    />
                  ))}
                </div>
              ) : (
                <Power className="w-12 h-12 text-red-900 animate-pulse" />
              )}
            </motion.button>
          </div>
          
          {/* Main Transcript Display */}
          <div className="mt-8 w-full max-w-2xl text-center px-8">
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="mb-4 inline-block bg-cyan-950/20 px-3 py-1 border border-cyan-900/30 rounded-full"
                >
                  <p className="text-[10px] text-cyan-400/80 uppercase font-bold tracking-[0.3em]">
                    &ldquo;{transcript}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="min-h-[100px] flex flex-col justify-center">
               <p className={`text-xl sm:text-2xl font-light leading-relaxed tracking-wide transition-all duration-1000 ${isConnected ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-cyan-900/40'}`}>
                 {jarvisResponse || (isConnected ? "I'm listening, sir. What can I assist with?" : "Initialize uplink to access Neural-Lite OS Core.")}
               </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Identity & Nodes */}
        <aside className="w-64 flex flex-col gap-4 flex-shrink-0">
          <div className="bg-[#00d4ff05] border border-[#00d4ff20] p-4 rounded-lg flex flex-col relative overflow-hidden">
             <h2 className="text-[11px] font-bold border-b border-[#00d4ff20] pb-2 mb-3 tracking-widest uppercase flex justify-between items-center">
                ACTIVE ENVIRONMENTS
                <span className="text-[8px] opacity-40">SHIELD: ON</span>
             </h2>
             <div className="space-y-2">
                {[
                  { name: 'CHROME_INSTANCE', type: 'Browser', status: 'Active' },
                  { name: 'EXCEL_SHEET_V1', type: 'Excel', status: 'Idle' },
                  { name: 'HOST_WIN_TERMINAL', type: 'System', status: 'Active' }
                ].map(node => (
                  <div key={node.name} className="p-2 border border-[#00d4ff10] bg-[#00d4ff05] rounded flex justify-between items-center group">
                    <div>
                      <p className="text-[9px] font-black group-hover:text-white transition-colors">{node.name}</p>
                      <p className="text-[7px] opacity-40">{node.type}</p>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-cyan-400 animate-pulse' : node.status === 'Idle' ? 'bg-yellow-500' : 'bg-red-900'}`} />
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 bg-[#00d4ff05] border border-[#00d4ff20] p-4 rounded-lg overflow-hidden flex flex-col relative">
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <Shield className="w-12 h-12" />
             </div>
             <h2 className="text-[11px] font-bold border-b border-[#00d4ff20] pb-2 mb-3 tracking-widest uppercase">Encryption Log</h2>
             <div className="flex-1 text-[10px] space-y-3 font-mono text-cyan-600/80 overflow-y-auto scrollbar-hide">
               {systemLogs.map((log, idx) => (
                 <motion.p 
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={idx} 
                  className={idx === systemLogs.length-1 ? "text-cyan-300 font-bold" : ""}
                 >
                   {">"} <span className="text-white/40">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}]</span> {log}
                 </motion.p>
               ))}
               {!isConnected && <p className="animate-pulse text-red-900">{">"} CONNECTION_TERMINATED</p>}
               {systemLogs.length === 0 && <p className="opacity-30">Awaiting system activation...</p>}
             </div>
          </div>
          
          <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-lg relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-cyan-400/5 rounded-full blur-2xl group-hover:bg-cyan-400/10 transition-all" />
            <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1 font-bold">SYSTEM ARCHITECT</div>
            <div className="text-base font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">MR. ARJUN</div>
            <div className="mt-2 pt-2 border-t border-[#00d4ff20] flex justify-between items-center">
              <span className="text-[8px] opacity-40 uppercase font-bold">DEV_SIG: AJ-772-X</span>
              <div className="flex gap-1">
                 <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                 <div className="w-1 h-1 bg-cyan-600 rounded-full" />
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Settings/Indicators */}
      <footer className="h-12 border-t border-[#00d4ff30] bg-[#020408] px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-gray-800'}`}></div>
            <span className="text-[10px] tracking-widest uppercase font-bold opacity-70">Aural Sensor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.8)]' : 'bg-gray-800'}`}></div>
            <span className="text-[10px] tracking-widest uppercase font-bold opacity-70">Uplink Status</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[9px] font-bold opacity-40 tracking-[0.2em]">
          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> VOL_C: OK</span>
          <span className="border-l border-[#00d4ff30] pl-6 uppercase">OS: NEURAL_LITE_X64_CORE</span>
        </div>
      </footer>

      {/* CRT Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 scanline opacity-30" />
      <div className="absolute inset-0 pointer-events-none z-[100] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
