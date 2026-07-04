/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getFingerForKey } from "./FingerGuide";

interface VirtualKeyboardProps {
  activeChar: string; // The character the user needs to press
  lastPressedKey: string | null; // The key the user actually pressed
  isError: boolean; // Whether the last keypress was an error
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeChar,
  lastPressedKey,
  isError,
}) => {
  // Define keyboard rows
  const row1 = [
    { key: "`", display: "~", width: "w-10 sm:w-12" },
    { key: "1", display: "1", width: "w-10 sm:w-12" },
    { key: "2", display: "2", width: "w-10 sm:w-12" },
    { key: "3", display: "3", width: "w-10 sm:w-12" },
    { key: "4", display: "4", width: "w-10 sm:w-12" },
    { key: "5", display: "5", width: "w-10 sm:w-12" },
    { key: "6", display: "6", width: "w-10 sm:w-12" },
    { key: "7", display: "7", width: "w-10 sm:w-12" },
    { key: "8", display: "8", width: "w-10 sm:w-12" },
    { key: "9", display: "9", width: "w-10 sm:w-12" },
    { key: "0", display: "0", width: "w-10 sm:w-12" },
    { key: "-", display: "-", width: "w-10 sm:w-12" },
    { key: "=", display: "=", width: "w-10 sm:w-12" },
    { key: "backspace", display: "⌫", width: "flex-grow" },
  ];

  const row2 = [
    { key: "tab", display: "⇥", width: "w-14 sm:w-16" },
    { key: "q", display: "Q", width: "w-10 sm:w-12" },
    { key: "w", display: "W", width: "w-10 sm:w-12" },
    { key: "e", display: "E", width: "w-10 sm:w-12" },
    { key: "r", display: "R", width: "w-10 sm:w-12" },
    { key: "t", display: "T", width: "w-10 sm:w-12" },
    { key: "y", display: "Y", width: "w-10 sm:w-12" },
    { key: "u", display: "U", width: "w-10 sm:w-12" },
    { key: "i", display: "I", width: "w-10 sm:w-12" },
    { key: "o", display: "O", width: "w-10 sm:w-12" },
    { key: "p", display: "P", width: "w-10 sm:w-12" },
    { key: "[", display: "[", width: "w-10 sm:w-12" },
    { key: "]", display: "]", width: "w-10 sm:w-12" },
    { key: "\\", display: "\\", width: "w-10 sm:w-12" },
  ];

  const row3 = [
    { key: "capslock", display: "⇪", width: "w-16 sm:w-20" },
    { key: "a", display: "A", width: "w-10 sm:w-12" },
    { key: "s", display: "S", width: "w-10 sm:w-12" },
    { key: "d", display: "D", width: "w-10 sm:w-12" },
    { key: "f", display: "F", width: "w-10 sm:w-12" },
    { key: "g", display: "G", width: "w-10 sm:w-12" },
    { key: "h", display: "H", width: "w-10 sm:w-12" },
    { key: "j", display: "J", width: "w-10 sm:w-12" },
    { key: "k", display: "K", width: "w-10 sm:w-12" },
    { key: "l", display: "L", width: "w-10 sm:w-12" },
    { key: ";", display: ";", width: "w-10 sm:w-12" },
    { key: "'", display: "'", width: "w-10 sm:w-12" },
    { key: "enter", display: "↵", width: "flex-grow" },
  ];

  const row4 = [
    { key: "shift", display: "⇧", width: "w-20 sm:w-24" },
    { key: "z", display: "Z", width: "w-10 sm:w-12" },
    { key: "x", display: "X", width: "w-10 sm:w-12" },
    { key: "c", display: "C", width: "w-10 sm:w-12" },
    { key: "v", display: "V", width: "w-10 sm:w-12" },
    { key: "b", display: "B", width: "w-10 sm:w-12" },
    { key: "n", display: "N", width: "w-10 sm:w-12" },
    { key: "m", display: "M", width: "w-10 sm:w-12" },
    { key: ",", display: ",", width: "w-10 sm:w-12" },
    { key: ".", display: ".", width: "w-10 sm:w-12" },
    { key: "/", display: "/", width: "w-10 sm:w-12" },
    { key: "shift-right", display: "⇧", width: "flex-grow" },
  ];

  // Map active character to standard key identifier
  const getCleanActiveKey = (char: string): string => {
    if (!char) return "";
    if (char === " ") return "space";
    return char.toLowerCase();
  };

  const currentActiveKeyId = getCleanActiveKey(activeChar);
  const cleanLastPressedKey = lastPressedKey ? lastPressedKey.toLowerCase() : null;

  // Determine key styling classes based on role (active, mistake, finger color coding)
  const getKeyStyle = (keyId: string) => {
    const isTarget = currentActiveKeyId === keyId || (keyId === "shift" && activeChar !== " " && activeChar === activeChar.toUpperCase() && activeChar !== activeChar.toLowerCase());
    const isPressed = cleanLastPressedKey === keyId;
    const isMistake = isPressed && isError;

    if (isMistake) {
      return "bg-rose-600 text-white shadow-lg shadow-rose-950 border-rose-400 scale-95 ring-2 ring-rose-500 z-10 animate-bounce";
    }

    if (isTarget) {
      return "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950 border-cyan-200 ring-4 ring-cyan-400 scale-105 z-10 font-black animate-pulse";
    }

    if (isPressed) {
      return "bg-slate-700 text-slate-100 border-slate-500 scale-95 transition-all";
    }

    // Default styling with touch typing finger indicators (subtle bottom colored border)
    const fingerInfo = getFingerForKey(keyId);
    let borderFingerColor = "border-b-slate-700 hover:border-b-slate-500";
    
    if (fingerInfo.finger === "left-pinky") borderFingerColor = "border-b-purple-500";
    else if (fingerInfo.finger === "left-ring") borderFingerColor = "border-b-indigo-500";
    else if (fingerInfo.finger === "left-middle") borderFingerColor = "border-b-sky-500";
    else if (fingerInfo.finger === "left-index") borderFingerColor = "border-b-emerald-500";
    else if (fingerInfo.finger === "right-index") borderFingerColor = "border-b-teal-500";
    else if (fingerInfo.finger === "right-middle") borderFingerColor = "border-b-cyan-500";
    else if (fingerInfo.finger === "right-ring") borderFingerColor = "border-b-rose-500";
    else if (fingerInfo.finger === "right-pinky") borderFingerColor = "border-b-pink-500";
    else if (fingerInfo.finger === "right-thumb" || fingerInfo.finger === "left-thumb") borderFingerColor = "border-b-amber-500";

    return `bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 ${borderFingerColor} border-b-4`;
  };

  const renderKey = (keyObj: { key: string; display: string; width: string }) => {
    const isTarget = currentActiveKeyId === keyObj.key;
    return (
      <div
        id={`key-${keyObj.key}`}
        key={keyObj.key}
        className={`h-11 sm:h-12 rounded-lg border flex flex-col justify-center items-center font-mono text-sm select-none transition-all duration-100 ${keyObj.width} ${getKeyStyle(keyObj.key)}`}
      >
        <span>{keyObj.display}</span>
        {isTarget && (
          <span className="text-[9px] font-semibold text-slate-950 animate-ping absolute -top-1 -right-1 bg-cyan-400 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-cyan-200">
            ●
          </span>
        )}
      </div>
    );
  };

  return (
    <div id="virtual-keyboard-container" className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 sm:gap-2 shadow-xl select-none w-full overflow-x-auto">
      {/* Row 1 */}
      <div className="flex gap-1.5 sm:gap-2 min-w-[550px] justify-between">
        {row1.map((k) => renderKey(k))}
      </div>

      {/* Row 2 */}
      <div className="flex gap-1.5 sm:gap-2 min-w-[550px] justify-between">
        {row2.map((k) => renderKey(k))}
      </div>

      {/* Row 3 */}
      <div className="flex gap-1.5 sm:gap-2 min-w-[550px] justify-between">
        {row3.map((k) => renderKey(k))}
      </div>

      {/* Row 4 */}
      <div className="flex gap-1.5 sm:gap-2 min-w-[550px] justify-between">
        {row4.map((k) => renderKey(k))}
      </div>

      {/* Row 5: Space Bar */}
      <div className="flex gap-1.5 sm:gap-2 min-w-[550px] justify-center">
        {/* Left Side Modifiers fallback */}
        <div className="w-12 sm:w-14 h-11 sm:h-12 rounded-lg border border-slate-700 bg-slate-800 border-b-slate-600 border-b-4 flex items-center justify-center font-mono text-xs text-slate-400">Ctrl</div>
        <div className="w-10 sm:w-12 h-11 sm:h-12 rounded-lg border border-slate-700 bg-slate-800 border-b-slate-600 border-b-4 flex items-center justify-center font-mono text-xs text-slate-400">❖</div>
        <div className="w-10 sm:w-12 h-11 sm:h-12 rounded-lg border border-slate-700 bg-slate-800 border-b-slate-600 border-b-4 flex items-center justify-center font-mono text-xs text-slate-400">Alt</div>
        
        {/* Dynamic Spacebar */}
        <div
          id="key-space"
          className={`h-11 sm:h-12 rounded-lg border flex justify-center items-center font-mono text-xs select-none transition-all duration-100 w-52 sm:w-72 ${getKeyStyle("space")}`}
        >
          <span>SPASI</span>
          {currentActiveKeyId === "space" && (
            <span className="text-[9px] font-semibold text-slate-950 animate-ping absolute -top-1 -right-1 bg-cyan-400 w-3.5 h-3.5 rounded-full border border-cyan-200" />
          )}
        </div>

        {/* Right Side Modifiers fallback */}
        <div className="w-10 sm:w-12 h-11 sm:h-12 rounded-lg border border-slate-700 bg-slate-800 border-b-slate-600 border-b-4 flex items-center justify-center font-mono text-xs text-slate-400">Alt</div>
        <div className="w-10 sm:w-12 h-11 sm:h-12 rounded-lg border border-slate-700 bg-slate-800 border-b-slate-600 border-b-4 flex items-center justify-center font-mono text-xs text-slate-400">❖</div>
        <div className="w-12 sm:w-14 h-11 sm:h-12 rounded-lg border border-slate-700 bg-slate-800 border-b-slate-600 border-b-4 flex items-center justify-center font-mono text-xs text-slate-400">Ctrl</div>
      </div>

      <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 mt-2 px-1">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400 inline-block border border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]" /> Tombol Target</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-400" /> Salah Ketik</span>
        </div>
        <div className="text-slate-500 italic hidden sm:block">
          Ujung jari kaki dan tumit rata di lantai, punggung lurus, mata menatap layar.
        </div>
      </div>
    </div>
  );
};
