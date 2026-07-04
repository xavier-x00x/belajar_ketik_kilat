/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FingerName } from "../types";

interface FingerGuideProps {
  activeChar: string;
}

export const getFingerForKey = (key: string): { finger: FingerName; hand: "left" | "right"; label: string; colorClass: string } => {
  if (!key) return { finger: "right-index", hand: "right", label: "Telunjuk Kanan", colorClass: "bg-blue-500" };
  
  const k = key.toLowerCase();
  
  if (k === " " || k === "space") {
    return { finger: "right-thumb", hand: "right", label: "Jempol", colorClass: "bg-amber-500" };
  }
  
  // Left Pinky
  if (["q", "a", "z", "1", "!", "capslock", "shift", "ctrl"].includes(k)) {
    return { finger: "left-pinky", hand: "left", label: "Kelingking Kiri", colorClass: "bg-purple-500" };
  }
  // Left Ring
  if (["w", "s", "x", "2", "@"].includes(k)) {
    return { finger: "left-ring", hand: "left", label: "Jari Manis Kiri", colorClass: "bg-indigo-500" };
  }
  // Left Middle
  if (["e", "d", "c", "3", "#"].includes(k)) {
    return { finger: "left-middle", hand: "left", label: "Jari Tengah Kiri", colorClass: "bg-sky-500" };
  }
  // Left Index
  if (["r", "f", "v", "t", "g", "b", "4", "5", "$", "%"].includes(k)) {
    return { finger: "left-index", hand: "left", label: "Jari Telunjuk Kiri", colorClass: "bg-emerald-500" };
  }
  
  // Right Index
  if (["y", "u", "h", "j", "n", "m", "6", "7", "^", "&"].includes(k)) {
    return { finger: "right-index", hand: "right", label: "Jari Telunjuk Kanan", colorClass: "bg-teal-500" };
  }
  // Right Middle
  if (["i", "k", ",", "<", "8", "*"].includes(k)) {
    return { finger: "right-middle", hand: "right", label: "Jari Tengah Kanan", colorClass: "bg-cyan-500" };
  }
  // Right Ring
  if (["o", "l", ".", ">", "9", "("].includes(k)) {
    return { finger: "right-ring", hand: "right", label: "Jari Manis Kanan", colorClass: "bg-rose-500" };
  }
  // Right Pinky
  if (["p", ";", ":", "/", "?", "0", ")", "-", "_", "=", "+", "[", "]", "{", "}", "'", "\"", "\\", "|", "enter", "backspace"].includes(k)) {
    return { finger: "right-pinky", hand: "right", label: "Kelingking Kanan", colorClass: "bg-pink-500" };
  }
  
  // Default fallback (e.g. capital letters or other symbols)
  // Let's check upper case counterparts or default to right index
  const uppercaseL = k.toUpperCase();
  if (["Q", "A", "Z"].includes(uppercaseL)) return { finger: "left-pinky", hand: "left", label: "Kelingking Kiri", colorClass: "bg-purple-500" };
  if (["W", "S", "X"].includes(uppercaseL)) return { finger: "left-ring", hand: "left", label: "Jari Manis Kiri", colorClass: "bg-indigo-500" };
  if (["E", "D", "C"].includes(uppercaseL)) return { finger: "left-middle", hand: "left", label: "Jari Tengah Kiri", colorClass: "bg-sky-500" };
  if (["R", "F", "V", "T", "G", "B"].includes(uppercaseL)) return { finger: "left-index", hand: "left", label: "Jari Telunjuk Kiri", colorClass: "bg-emerald-500" };
  if (["Y", "U", "H", "J", "N", "M"].includes(uppercaseL)) return { finger: "right-index", hand: "right", label: "Jari Telunjuk Kanan", colorClass: "bg-teal-500" };
  if (["I", "K"].includes(uppercaseL)) return { finger: "right-middle", hand: "right", label: "Jari Tengah Kanan", colorClass: "bg-cyan-500" };
  if (["O", "L"].includes(uppercaseL)) return { finger: "right-ring", hand: "right", label: "Jari Manis Kanan", colorClass: "bg-rose-500" };
  if (["P"].includes(uppercaseL)) return { finger: "right-pinky", hand: "right", label: "Kelingking Kanan", colorClass: "bg-pink-500" };

  return { finger: "right-index", hand: "right", label: "Jari Telunjuk Kanan", colorClass: "bg-teal-500" };
};

export const FingerGuide: React.FC<FingerGuideProps> = ({ activeChar }) => {
  const mapping = getFingerForKey(activeChar);

  const fingersLeft = [
    { id: "left-pinky" as FingerName, label: "Kelingking", cx: 25, cy: 90, r: 10, color: "stroke-purple-500 fill-purple-500" },
    { id: "left-ring" as FingerName, label: "Manis", cx: 50, cy: 60, r: 10, color: "stroke-indigo-500 fill-indigo-500" },
    { id: "left-middle" as FingerName, label: "Tengah", cx: 78, cy: 50, r: 10, color: "stroke-sky-500 fill-sky-500" },
    { id: "left-index" as FingerName, label: "Telunjuk", cx: 108, cy: 65, r: 10, color: "stroke-emerald-500 fill-emerald-500" },
    { id: "left-thumb" as FingerName, label: "Jempol", cx: 145, cy: 115, r: 11, color: "stroke-amber-500 fill-amber-500" },
  ];

  const fingersRight = [
    { id: "right-thumb" as FingerName, label: "Jempol", cx: 205, cy: 115, r: 11, color: "stroke-amber-500 fill-amber-500" },
    { id: "right-index" as FingerName, label: "Telunjuk", cx: 242, cy: 65, r: 10, color: "stroke-teal-500 fill-teal-500" },
    { id: "right-middle" as FingerName, label: "Tengah", cx: 272, cy: 50, r: 10, color: "stroke-cyan-500 fill-cyan-500" },
    { id: "right-ring" as FingerName, label: "Manis", cx: 300, cy: 60, r: 10, color: "stroke-rose-500 fill-rose-500" },
    { id: "right-pinky" as FingerName, label: "Kelingking", cx: 325, cy: 90, r: 10, color: "stroke-pink-500 fill-pink-500" },
  ];

  return (
    <div id="finger-guide-container" className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center shadow-xl w-full h-full justify-between">
      <div className="text-center mb-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Panduan Jari Utama</h3>
        <p className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2 mt-1.5">
          Ketik: <span className="bg-slate-950/80 px-3 py-1 rounded-md text-cyan-400 font-mono border border-slate-800 min-w-[2.5rem] inline-block">{activeChar === " " ? "SPASI" : activeChar}</span> 
          &rarr; 
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${mapping.colorClass} shadow-md shadow-slate-950/40`}>
            {mapping.label}
          </span>
        </p>
      </div>

      <div className="relative w-full max-w-[360px] h-[190px]">
        {/* Beautiful Hands SVG visualization */}
        <svg viewBox="0 0 350 180" className="w-full h-full text-slate-700">
          {/* Hand Outlines */}
          {/* Left Hand Base */}
          <path
            d="M 15 150 C 15 110, 35 110, 35 110 L 45 75 C 45 75, 55 75, 55 110 L 68 65 C 68 65, 78 65, 78 110 L 90 70 C 90 70, 100 70, 100 110 L 115 120 C 120 125, 140 120, 145 130 C 150 140, 130 160, 115 160 C 100 160, 80 155, 65 155 C 45 155, 15 160, 15 150 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-slate-800"
          />
          {/* Right Hand Base */}
          <path
            d="M 335 150 C 335 110, 315 110, 315 110 L 305 75 C 305 75, 295 75, 295 110 L 282 65 C 282 65, 272 65, 272 110 L 260 70 C 260 70, 250 70, 250 110 L 235 120 C 230 125, 210 120, 205 130 C 200 140, 220 160, 235 160 C 250 160, 270 155, 285 155 C 305 155, 335 160, 335 150 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-slate-800"
          />

          {/* Render fingers left */}
          {fingersLeft.map((f) => {
            const isActive = mapping.finger === f.id;
            return (
              <g key={f.id} className="transition-all duration-300">
                {/* Active pulsating ring */}
                {isActive && (
                  <circle
                    cx={f.cx}
                    cy={f.cy}
                    r={f.r + 9}
                    className={`stroke-current ${f.color.split(" ")[0]} fill-none opacity-50 animate-ping`}
                    style={{ animationDuration: "1.5s" }}
                  />
                )}
                {/* Finger circle */}
                <circle
                  cx={f.cx}
                  cy={f.cy}
                  r={isActive ? f.r + 3 : f.r}
                  className={`stroke-2 ${f.color.split(" ")[0]} ${isActive ? f.color.split(" ")[1] + " opacity-100 shadow-lg" : "fill-slate-800 opacity-40"} transition-all duration-300`}
                />
                {/* Finger connector line */}
                <line
                  x1={f.cx}
                  y1={f.cy + f.r + (isActive ? 3 : 0)}
                  x2={f.cx}
                  y2={f.cy + 25}
                  className={`stroke-2 ${isActive ? f.color.split(" ")[0] + " opacity-80" : "stroke-slate-800 opacity-20"}`}
                  strokeDasharray={isActive ? "none" : "2,2"}
                />
              </g>
            );
          })}

          {/* Render fingers right */}
          {fingersRight.map((f) => {
            const isActive = mapping.finger === f.id;
            return (
              <g key={f.id} className="transition-all duration-300">
                {/* Active pulsating ring */}
                {isActive && (
                  <circle
                    cx={f.cx}
                    cy={f.cy}
                    r={f.r + 9}
                    className={`stroke-current ${f.color.split(" ")[0]} fill-none opacity-50 animate-ping`}
                    style={{ animationDuration: "1.5s" }}
                  />
                )}
                {/* Finger circle */}
                <circle
                  cx={f.cx}
                  cy={f.cy}
                  r={isActive ? f.r + 3 : f.r}
                  className={`stroke-2 ${f.color.split(" ")[0]} ${isActive ? f.color.split(" ")[1] + " opacity-100 shadow-lg" : "fill-slate-800 opacity-40"} transition-all duration-300`}
                />
                {/* Finger connector line */}
                <line
                  x1={f.cx}
                  y1={f.cy + f.r + (isActive ? 3 : 0)}
                  x2={f.cx}
                  y2={f.cy + 25}
                  className={`stroke-2 ${isActive ? f.color.split(" ")[0] + " opacity-80" : "stroke-slate-800 opacity-20"}`}
                  strokeDasharray={isActive ? "none" : "2,2"}
                />
              </g>
            );
          })}

          {/* Left / Right hand text labels */}
          <text x="75" y="175" textAnchor="middle" className="text-xs font-bold fill-slate-500 select-none">TANGAN KIRI</text>
          <text x="275" y="175" textAnchor="middle" className="text-xs font-bold fill-slate-500 select-none">TANGAN KANAN</text>
        </svg>
      </div>
    </div>
  );
};
