/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lesson } from "../types";
import { PREDEFINED_LESSONS } from "./LessonsData";
import { Sparkles, BookOpen, Layers, Type, Key, Award, AlertCircle, RefreshCw } from "lucide-react";

interface LessonSelectorProps {
  onSelectLesson: (lesson: Lesson) => void;
  activeLessonId: string;
}

export const LessonSelector: React.FC<LessonSelectorProps> = ({
  onSelectLesson,
  activeLessonId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Lesson["category"]>("home-row");
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Suggested chips for quick generation
  const suggestedTopics = [
    "Kucing Lucu bermain bola",
    "Kuliner Rendang Padang",
    "Pemandangan Pantai Bali",
    "Dunia game Minecraft",
    "Belajar Koding Python",
    "Kisah Seru Astronot"
  ];

  // Categories metadata
  const categories = [
    { id: "home-row", name: "Baris Tengah", icon: Key, desc: "Posisi dasar asdf jkl;" },
    { id: "top-row", name: "Baris Atas", icon: Layers, desc: "Tombol qwerty uiop" },
    { id: "bottom-row", name: "Baris Bawah", icon: Layers, desc: "Tombol zxcv bnm" },
    { id: "words", name: "Kata Populer", icon: Type, desc: "Kata dasar bahasa Indonesia" },
    { id: "sentences", name: "Kalimat", icon: BookOpen, desc: "Latihan kalimat & tanda baca" },
    { id: "numbers", name: "Angka & Simbol", icon: Award, desc: "Deret angka dan simbol kode" },
    { id: "ai-custom", name: "Tantangan AI", icon: Sparkles, desc: "Latihan kustom kreasimu!" }
  ] as const;

  const filteredLessons = PREDEFINED_LESSONS.filter(
    (lesson) => lesson.category === selectedCategory
  );

  const handleGenerateCustomLesson = async (topicStr: string) => {
    const finalTopic = topicStr.trim();
    if (!finalTopic) return;

    setIsGenerating(true);
    setApiError(null);

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: finalTopic }),
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung dengan server");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const generatedLesson: Lesson = {
        id: `ai-custom-${Date.now()}`,
        category: "ai-custom",
        title: data.title || `Latihan: ${finalTopic}`,
        description: `Materi kustom bertenaga AI tentang ${finalTopic}.`,
        text: data.text,
        difficulty: data.difficulty || "medium",
      };

      onSelectLesson(generatedLesson);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Gagal menghasilkan teks latihan dengan AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="lesson-selector-card" className="bg-slate-900/20 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="text-cyan-400 w-5.5 h-5.5" /> Pilih Materi Belajar
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Pilih tingkat latihan sesuai kemampuan jari Anda, dari baris tengah hingga kalimat kustom AI.
        </p>
      </div>

      {/* Categories Horizontal Tabs */}
      <div id="category-tabs" className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-850">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 scale-102"
                  : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Display Predefined Lessons Grid */}
      {selectedCategory !== "ai-custom" ? (
        <div id="lessons-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => {
            const isCurrent = activeLessonId === lesson.id;
            const diffColors = {
              easy: "bg-cyan-950/40 text-cyan-400 border border-cyan-900/50",
              medium: "bg-amber-950/40 text-amber-400 border border-amber-900/50",
              hard: "bg-rose-950/40 text-rose-400 border border-rose-900/50"
            };

            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`text-left p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-300 border cursor-pointer hover:scale-[1.02] ${
                  isCurrent
                    ? "bg-slate-800/80 border-cyan-400 shadow-xl ring-1 ring-cyan-500/30"
                    : "bg-slate-800/20 border-slate-850 hover:bg-slate-800 hover:border-slate-750"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${diffColors[lesson.difficulty]}`}>
                      {lesson.difficulty === "easy" ? "Pemula" : lesson.difficulty === "medium" ? "Sedang" : "Mahir"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {lesson.text.length} Karakter
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm tracking-tight leading-tight group-hover:text-cyan-400">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {lesson.description}
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-500 truncate w-full bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                  {lesson.text}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* AI custom generation layout */
        <div id="ai-custom-generator-container" className="bg-slate-950/30 border border-slate-850 rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex gap-3 items-start">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">Hasilkan Latihan Kustom Bertenaga AI</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tuliskan topik apa pun dalam Bahasa Indonesia (contoh: kuliner khas, kisah sejarah, resep, hobi, teknologi) dan AI akan membuatkan teks latihan mengetik yang mendidik dengan tata bahasa Indonesia yang baik.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Ide Topik Menarik:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCustomTopic(topic);
                      handleGenerateCustomLesson(topic);
                    }}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 hover:text-cyan-400 border border-slate-850 hover:border-slate-700 text-slate-300 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✨ {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Topic Input */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="text"
                placeholder="Ketik topik kustom Anda disini (misal: Olahraga lari pagi)..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                disabled={isGenerating}
                className="bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 flex-grow transition-all"
              />
              <button
                onClick={() => handleGenerateCustomLesson(customTopic)}
                disabled={isGenerating || !customTopic.trim()}
                className="bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-semibold px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10 min-w-[150px]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Sedang Membuat...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Hasilkan Teks 🚀
                  </>
                )}
              </button>
            </div>

            {/* Error Message if API fails */}
            {apiError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-3.5 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
