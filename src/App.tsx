/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PREDEFINED_LESSONS } from "./components/LessonsData";
import { Lesson, TypingStats } from "./types";
import { VirtualKeyboard } from "./components/VirtualKeyboard";
import { FingerGuide } from "./components/FingerGuide";
import { LessonSelector } from "./components/LessonSelector";
import { 
  Keyboard, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Timer, 
  Percent, 
  Award, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Lightbulb,
  Zap
} from "lucide-react";

export default function App() {
  // Lesson Selection State
  const [activeLesson, setActiveLesson] = useState<Lesson>(PREDEFINED_LESSONS[0]);
  
  // Game Play State
  const [charIndex, setCharIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errorsList, setErrorsList] = useState<boolean[]>([]); // Tracks which characters are errors
  const [typedHistory, setTypedHistory] = useState<string[]>([]); // Tracks what was typed at each index

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Time and Stats
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Sound Options (synthesized mechanical click sound using Web Audio API)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [switchStyle, setSwitchStyle] = useState<"blue" | "red" | "retro">("blue");

  // Keyboard/Finger Help feedback states
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [isLastPressedError, setIsLastPressedError] = useState(false);

  // High score tracking from local storage
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem("ketik_kilat_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Reference to focus on the keydown handler container
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Persistent, low-latency AudioContext ref to avoid re-creation warnings & lags
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize errors array whenever a new lesson is loaded
  useEffect(() => {
    resetPractice(activeLesson);
  }, [activeLesson]);

  // Audio synthesiser for multiple mechanical switch styles (tactile click/clack)
  const playKeyboardSound = useCallback((isError = false) => {
    if (!soundEnabled) return;
    try {
      // Lazy initialize audio context on first interaction to avoid browser warnings
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      // Resume if suspended (browser security blocks audio until gesture)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (isError) {
        // Lower tone buzz for mistakes with subtle noise
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        // Add a slight pitch sweep down
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
        return;
      }

      // Synthesize specific switch sound designs
      if (switchStyle === "blue") {
        // --- CHERRY MX BLUE (Clicky & Crisp) ---
        // 1. Tactile metal click (High frequency high-pass filtered noise burst)
        const bufferSize = ctx.sampleRate * 0.015; // 15ms burst
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(3500, now);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.07, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
        
        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);

        // 2. Main housing clack (medium pitch transient)
        const osc = ctx.createOscillator();
        const mainGain = ctx.createGain();
        osc.connect(mainGain);
        mainGain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.02);
        
        mainGain.gain.setValueAtTime(0.08, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        
        osc.start(now);
        osc.stop(now + 0.03);

      } else if (switchStyle === "red") {
        // --- CHERRY MX RED / CREAMY (Smooth & Deeper Clack) ---
        const osc = ctx.createOscillator();
        const mainGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(ctx.destination);
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, now);
        
        mainGain.gain.setValueAtTime(0.18, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        osc.start(now);
        osc.stop(now + 0.04);

      } else if (switchStyle === "retro") {
        // --- TYPEWRITER KLASIK (Heavy mechanical lever & ringing metal chime) ---
        // 1. Sharp striking impact (lowpass filtered noise)
        const bufferSize = ctx.sampleRate * 0.03; // 30ms strike
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(600, now);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);

        // 2. Bell/metal ring resonance
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        
        chime.type = "sine";
        chime.frequency.setValueAtTime(2600, now); // Sweet metallic high frequency
        
        chimeGain.gain.setValueAtTime(0.02, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Elegant ringing echo
        
        chime.start(now);
        chime.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("Web Audio API not supported or suspended by browser:", e);
    }
  }, [soundEnabled, switchStyle]);

  // Stats updates
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const next = prev + 1;
          // Calculate WPM in real-time
          // Average word length is standard 5 characters
          const minutes = next / 60;
          if (minutes > 0) {
            const calculatedWpm = Math.round((correctCount / 5) / minutes);
            setWpm(calculatedWpm);
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished, correctCount]);

  // Handle updates to accuracy and WPM as typing goes on
  useEffect(() => {
    if (totalKeystrokes > 0) {
      const acc = Math.round((correctCount / totalKeystrokes) * 100);
      setAccuracy(isNaN(acc) ? 100 : acc);
    } else {
      setAccuracy(100);
    }
  }, [correctCount, totalKeystrokes]);

  // Handle game finish
  useEffect(() => {
    if (isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      // Save high score if relevant
      if (wpm > highScore && accuracy > 85) {
        setHighScore(wpm);
        localStorage.setItem("ketik_kilat_highscore", wpm.toString());
      }
    }
  }, [isFinished, wpm, accuracy, highScore]);

  const resetPractice = (lesson: Lesson = activeLesson) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCharIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTotalKeystrokes(0);
    setErrorsList(new Array(lesson.text.length).fill(false));
    setTypedHistory(new Array(lesson.text.length).fill(""));
    setIsStarted(false);
    setIsFinished(false);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setLastPressedKey(null);
    setIsLastPressedError(false);
    
    // Auto-focus the typing area
    setTimeout(() => {
      containerRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ignore special commands and function keys
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " " && e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    if (isFinished) {
      if (e.key === "Enter") {
        resetPractice();
      }
      return;
    }

    // Start timer on first keypress
    if (!isStarted) {
      setIsStarted(true);
    }

    const lessonText = activeLesson.text;
    const targetChar = lessonText[charIndex];

    // Handle backspace functionality
    if (e.key === "Backspace") {
      if (charIndex > 0) {
        const prevIndex = charIndex - 1;
        const wasCorrect = !errorsList[prevIndex];
        
        setCharIndex(prevIndex);
        setErrorsList((prev) => {
          const next = [...prev];
          next[prevIndex] = false;
          return next;
        });
        setTypedHistory((prev) => {
          const next = [...prev];
          next[prevIndex] = "";
          return next;
        });

        if (wasCorrect) {
          setCorrectCount((prev) => Math.max(0, prev - 1));
        } else {
          setIncorrectCount((prev) => Math.max(0, prev - 1));
        }

        setLastPressedKey("backspace");
        setIsLastPressedError(false);
        playKeyboardSound(false);
      }
      return;
    }

    // Normal typing handling
    let pressedKey = e.key;
    if (pressedKey === "Enter") {
      pressedKey = " "; // Normalize Enter for layout spaces in some multi-row configurations
    }

    setLastPressedKey(pressedKey === " " ? "space" : pressedKey);
    setTotalKeystrokes((prev) => prev + 1);

    const isCorrect = pressedKey === targetChar;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setErrorsList((prev) => {
        const next = [...prev];
        next[charIndex] = false;
        return next;
      });
      setIsLastPressedError(false);
      playKeyboardSound(false);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setErrorsList((prev) => {
        const next = [...prev];
        next[charIndex] = true;
        return next;
      });
      setIsLastPressedError(true);
      playKeyboardSound(true);
    }

    setTypedHistory((prev) => {
      const next = [...prev];
      next[charIndex] = pressedKey;
      return next;
    });

    const nextIndex = charIndex + 1;
    if (nextIndex >= lessonText.length) {
      setIsFinished(true);
    } else {
      setCharIndex(nextIndex);
    }
  };

  // Level status categorizer based on Speed WPM
  const getSpeedCategory = (speedWpm: number) => {
    if (speedWpm === 0) return { name: "Siap Beraksi", emoji: "🏁", color: "text-slate-400" };
    if (speedWpm < 15) return { name: "Kura-kura Pemula", emoji: "🐢", color: "text-emerald-400" };
    if (speedWpm < 30) return { name: "Kelinci Lincah", emoji: "🐇", color: "text-teal-400" };
    if (speedWpm < 50) return { name: "Macan Cepat", emoji: "🐆", color: "text-indigo-400" };
    return { name: "Kilat Dahsyat!", emoji: "⚡", color: "text-rose-400" };
  };

  const speedBadge = getSpeedCategory(wpm);

  // Progress Bar percentage
  const progressPercent = activeLesson.text.length > 0 
    ? Math.round((charIndex / activeLesson.text.length) * 100) 
    : 0;

  return (
    <div 
      id="app-root-container" 
      className="bg-slate-950 text-slate-100 font-sans min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col justify-between select-none overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"
    >
      {/* Outer Content Layout - Full Responsive Bento Grid Grid System */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* BENTO BOX 1: Header / Navigation Hub */}
        <header 
          id="bento-header" 
          className="border border-slate-800/80 bg-slate-900/20 backdrop-blur-md rounded-3xl flex flex-col lg:flex-row items-center justify-between p-6 px-6 sm:px-10 shadow-2xl gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl flex items-center justify-center font-black text-2xl italic text-slate-950 shadow-lg shadow-cyan-500/20">
              K
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Ketik<span className="text-cyan-400 font-extrabold">Kilat</span>
                <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full px-2 py-0.5 font-mono">
                  v2.1
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Belajar mengetik 10 jari interaktif bertema Midnight</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-end w-full lg:w-auto">
            {/* Retro Mechanical Click Audio Toggle & Switch Style Selector */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 border border-slate-800/80 p-1.5 rounded-2xl">
              <button
                id="audio-toggle-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                  soundEnabled 
                    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                    : "text-slate-500"
                }`}
                title={soundEnabled ? "Matikan Suara Klik Keyboard" : "Nyalakan Suara Klik Keyboard"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>Suara</span>
              </button>
              
              {soundEnabled && (
                <div className="flex gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
                  <button 
                    onClick={() => setSwitchStyle("blue")}
                    className={`px-2.5 py-1 text-[10px] rounded-lg font-mono transition-all ${switchStyle === "blue" ? "bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/10" : "text-slate-400 hover:text-slate-200"}`}
                    title="Cherry MX Blue (Clicky & Crisp)"
                  >
                    🍒 Blue
                  </button>
                  <button 
                    onClick={() => setSwitchStyle("red")}
                    className={`px-2.5 py-1 text-[10px] rounded-lg font-mono transition-all ${switchStyle === "red" ? "bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-400/10" : "text-slate-400 hover:text-slate-200"}`}
                    title="Cherry MX Red (Silent & Creamy)"
                  >
                    🍦 Red
                  </button>
                  <button 
                    onClick={() => setSwitchStyle("retro")}
                    className={`px-2.5 py-1 text-[10px] rounded-lg font-mono transition-all ${switchStyle === "retro" ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/10" : "text-slate-400 hover:text-slate-200"}`}
                    title="Retro Typewriter (Metal bells & clacks)"
                  >
                    🕰️ Retro
                  </button>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-800 hidden sm:block"></div>

            {/* High Score Badge */}
            <div className="text-right flex items-center gap-2 bg-slate-900/50 border border-slate-800/80 px-4 py-2 rounded-2xl">
              <Award className="text-amber-400 w-5 h-5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-left">Rekor Terbaik</p>
                <p className="text-sm font-black text-amber-300 text-left">{highScore} WPM</p>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800 hidden sm:block"></div>

            {/* Current Level categorization */}
            <div className="text-right bg-slate-900/50 border border-slate-800/80 px-4 py-2 rounded-2xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-left">Peringkat Kecepatan</p>
              <p className={`text-sm font-semibold italic text-left flex items-center gap-1.5 ${speedBadge.color}`}>
                <span>{speedBadge.emoji}</span> {speedBadge.name}
              </p>
            </div>
          </div>
        </header>

        {/* BENTO BOX 2-4: Main Typing Stage & Real-time Scoreboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Interactive Stage (Typing Arena) - Col-span 3 */}
          <div 
            id="typing-arena-container"
            className="lg:col-span-3 border-2 border-cyan-500/30 bg-slate-900/20 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(6,182,212,0.03)] min-h-[320px] focus:outline-none group focus:border-cyan-400/50 transition-all duration-300"
            tabIndex={0}
            ref={containerRef}
            onKeyDown={handleKeyDown}
          >
            {/* Decorative Top Tags */}
            <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
              <div className="flex gap-2">
                <span className="px-3.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Latihan: {activeLesson.title}
                </span>
                <span className="px-3.5 py-1 bg-slate-800/80 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  {activeLesson.difficulty === "easy" ? "Pemula" : activeLesson.difficulty === "medium" ? "Sedang" : "Mahir"}
                </span>
              </div>
              
              <span className="text-xs text-cyan-400 group-focus:hidden flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Klik di sini untuk fokus mengetik
              </span>
              <span className="text-xs text-emerald-400 hidden group-focus:flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Siap menerima ketikan Anda!
              </span>
            </div>

            {/* Interactive Typography display rendering typing feedback */}
            <div 
              id="typing-text-stage"
              className="text-2xl sm:text-3xl font-light leading-relaxed tracking-wide text-slate-600 font-sans break-words my-6 select-none relative"
            >
              {activeLesson.text.split("").map((char, index) => {
                let colorClass = "text-slate-500";
                let underlineClass = "";
                let isCurrent = index === charIndex;

                if (index < charIndex) {
                  // Already typed
                  const isError = errorsList[index];
                  if (isError) {
                    colorClass = "text-rose-400 bg-rose-500/10 font-semibold border-b-2 border-rose-500";
                  } else {
                    colorClass = "text-slate-100 font-medium";
                  }
                } else if (isCurrent) {
                  colorClass = "text-cyan-400 bg-cyan-500/10 px-0.5 rounded-md font-bold border-b-4 border-cyan-400 animate-pulse";
                }

                return (
                  <span 
                    key={index} 
                    className={`${colorClass} ${underlineClass} transition-all duration-150 relative inline-block`}
                    id={`char-${index}`}
                  >
                    {/* Render visual spaces elegantly to allow smooth flow */}
                    {char === " " ? "␣" : char}
                    
                    {/* Pulsing indicator under cursor */}
                    {isCurrent && (
                      <span className="absolute left-0 right-0 -bottom-1 h-1 bg-cyan-400 animate-bounce" />
                    )}
                  </span>
                );
              })}
            </div>

            {/* Progress metrics and instructions inside the main stage */}
            <div className="mt-6">
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-slate-500 font-medium">
                <span className="uppercase tracking-widest text-[10px]">KEMAJUAN SESI: {progressPercent}%</span>
                <span>{charIndex} / {activeLesson.text.length} Karakter</span>
              </div>
            </div>

            {/* Floating Finish State Modal overlay inside the typing arena */}
            {isFinished && (
              <div 
                id="finish-overlay-modal"
                className="absolute inset-0 bg-slate-950/95 rounded-[2.5rem] flex flex-col justify-center items-center p-8 text-center backdrop-blur-md z-30 border border-cyan-500/40 animate-fade-in"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                  <Award className="w-8 h-8" />
                </div>
                
                <h3 className="text-3xl font-extrabold text-white tracking-tight">Sesi Selesai! Luar Biasa! 🎉</h3>
                <p className="text-slate-400 mt-2 text-sm max-w-md">
                  Anda telah menyelesaikan materi <span className="text-cyan-400 font-semibold">{activeLesson.title}</span> dengan performa yang mantap.
                </p>

                {/* Performance stats grids */}
                <div className="grid grid-cols-3 gap-4 my-6 w-full max-w-md">
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                    <p className="text-2xl font-black text-cyan-400 font-mono">{wpm}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">WPM (Kecepatan)</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                    <p className="text-2xl font-black text-emerald-400 font-mono">{accuracy}%</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Akurasi</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                    <p className="text-2xl font-black text-amber-400 font-mono">{timeElapsed}s</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Durasi</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => resetPractice()}
                    className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-extrabold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-400/20"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-950" /> Latihan Lagi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Statistics Panel - Bento Grid Columns */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Speed WPM box */}
            <div 
              id="wpm-bento-card"
              className="border border-slate-800/80 bg-slate-900/20 rounded-[2rem] p-6 flex flex-col justify-center items-center shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 min-h-[140px]"
            >
              <div className="absolute top-3 right-3 text-slate-700">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-5xl font-black text-cyan-400 italic font-mono tracking-tight group-hover:scale-105 transition-all duration-300">
                {wpm}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1.5 flex flex-wrap items-center justify-center gap-1">
                WPM <span className="text-[9px] lowercase font-normal text-slate-600">(kata per menit)</span>
              </p>
            </div>

            {/* Scorecard Details: Accuracy, Time, Key Stats & Control */}
            <div 
              id="stats-bento-card"
              className="border border-slate-800/80 bg-slate-900/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl gap-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="space-y-4">
                {/* Accuracy */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Akurasi</p>
                    <p className={`text-3xl font-bold font-mono ${accuracy < 90 ? "text-amber-400" : "text-emerald-400"}`}>
                      {accuracy}%
                    </p>
                  </div>
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>

                <div className="h-[1px] bg-slate-850"></div>

                {/* Time Elapsed */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Waktu</p>
                    <p className="text-3xl font-bold font-mono text-slate-100">
                      {Math.floor(timeElapsed / 60).toString().padStart(2, "0")}:
                      {(timeElapsed % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                    <Timer className="w-5 h-5" />
                  </div>
                </div>

                <div className="h-[1px] bg-slate-850"></div>

                {/* Correct vs Mistake breakdown counters */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Benar</p>
                    <p className="text-base font-bold text-emerald-400 font-mono mt-0.5 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {correctCount}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Salah</p>
                    <p className="text-base font-bold text-rose-400 font-mono mt-0.5 flex items-center justify-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> {incorrectCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* satisfying reset button */}
              <button 
                id="reset-practice-btn"
                onClick={() => resetPractice()}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-102 active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" /> MULAI ULANG SESI
              </button>
            </div>

          </div>
        </div>

        {/* BENTO BOX 5: Typing Guidance & Input Helpers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Virtual Keyboard Component (Col-span 8) */}
          <div className="lg:col-span-8 flex flex-col">
            <VirtualKeyboard 
              activeChar={isFinished ? "" : activeLesson.text[charIndex]}
              lastPressedKey={lastPressedKey}
              isError={isLastPressedError}
            />
          </div>

          {/* Hands and Finger Guide Component (Col-span 4) */}
          <div className="lg:col-span-4 flex flex-col">
            <FingerGuide activeChar={isFinished ? "" : activeLesson.text[charIndex]} />
          </div>

        </div>

        {/* BENTO BOX 6: Material Selection & Custom AI generators */}
        <div id="material-hub-container">
          <LessonSelector 
            onSelectLesson={(lesson) => {
              setActiveLesson(lesson);
            }} 
            activeLessonId={activeLesson.id} 
          />
        </div>

        {/* Informative Help Guide on posture */}
        <section id="posture-guide" className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Tips Ergonomis Ketik 10 Jari untuk Pemula</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Letakkan jari telunjuk kiri di tombol <strong className="text-cyan-400">F</strong> (ada tonjolan kecil) dan jari telunjuk kanan di tombol <strong className="text-cyan-400">J</strong> (ada tonjolan kecil). Luruskan pergelangan tangan, duduk tegak dengan pandangan lurus menatap monitor, serta usahakan tidak melihat tombol keyboard saat mengetik!
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 border border-slate-800/80 px-4 py-2.5 rounded-xl bg-slate-950/40">
            Home Row: A S D F (Kiri) | J K L ; (Kanan)
          </div>
        </section>

      </div>

      {/* Humble Footer */}
      <footer className="text-center text-[11px] text-slate-600 uppercase font-black tracking-[0.3em] mt-10 py-4 border-t border-slate-900">
        KetikKilat Bento Typing App • Dibuat untuk Efisiensi & Fokus
      </footer>
    </div>
  );
}
