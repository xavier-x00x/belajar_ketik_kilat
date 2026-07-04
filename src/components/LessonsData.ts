/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from "../types";

export const PREDEFINED_LESSONS: Lesson[] = [
  // --- HOME ROW CATEGORY ---
  {
    id: "home-row-1",
    category: "home-row",
    title: "Mengenal Jari Tengah & Telunjuk",
    description: "Latihan tombol dasar F, J, D, K pada baris tengah (home row).",
    text: "ff dd jj kk fdfd jkjk fdfj djkd ddfj kdjf",
    difficulty: "easy"
  },
  {
    id: "home-row-2",
    category: "home-row",
    title: "Posisi Dasar Rumah (Home Row)",
    description: "Latihan seluruh baris tengah: A, S, D, F, J, K, L, dan Semicolon (;).",
    text: "asdf jkl; asdf jkl; asdfghjkl; fjdksla; a;sldkfjgh",
    difficulty: "easy"
  },
  {
    id: "home-row-3",
    category: "home-row",
    title: "Kombinasi Baris Tengah Indonesia",
    description: "Kata-kata sederhana yang hanya menggunakan tombol baris tengah.",
    text: "ada saja jasa jala dada gajah salah kasa fajar jasad",
    difficulty: "easy"
  },

  // --- TOP ROW CATEGORY ---
  {
    id: "top-row-1",
    category: "top-row",
    title: "Baris Atas Bagian Kiri",
    description: "Latihan tombol Q, W, E, R, T bersama baris tengah.",
    text: "qq ww ee rr tt qwert ewqtr redtf fader trew",
    difficulty: "easy"
  },
  {
    id: "top-row-2",
    category: "top-row",
    title: "Baris Atas Bagian Kanan",
    description: "Latihan tombol Y, U, I, O, P bersama baris tengah.",
    text: "yy uu ii oo pp yuiop pouiy jkluy uiojp poyui",
    difficulty: "easy"
  },
  {
    id: "top-row-3",
    category: "top-row",
    title: "Kombinasi Baris Atas & Tengah",
    description: "Kata-kata dasar Indonesia menggunakan baris tengah dan baris atas.",
    text: "saya tiru roti pagi hari sore suap topi sawah teater rupiah",
    difficulty: "medium"
  },

  // --- BOTTOM ROW CATEGORY ---
  {
    id: "bottom-row-1",
    category: "bottom-row",
    title: "Mengenal Baris Bawah",
    description: "Latihan tombol Z, X, C, V, B, N, M, koma (,), dan titik (.).",
    text: "zz xx cc vv bb nn mm zxcvb mnbvc zxvnmbv cnbz",
    difficulty: "medium"
  },
  {
    id: "bottom-row-2",
    category: "bottom-row",
    title: "Kombinasi Tiga Baris",
    description: "Latihan mengetik menggunakan kombinasi seluruh baris keyboard.",
    text: "belajar mengetik dengan sepuluh jari agar lebih cepat dan lancar",
    difficulty: "medium"
  },

  // --- WORDS CATEGORY ---
  {
    id: "words-1",
    category: "words",
    title: "Kata Penghubung Populer",
    description: "Mengetik kata-kata penghubung yang paling sering digunakan dalam bahasa Indonesia.",
    text: "yang dan di ke dari untuk dengan dalam pada atau bapa saya kamu",
    difficulty: "easy"
  },
  {
    id: "words-2",
    category: "words",
    title: "Kata Kerja Dasar",
    description: "Latihan mengetik kata kerja umum dalam bahasa Indonesia.",
    text: "makan minum tidur kerja baca tulis dengar lihat jalan lari lompat",
    difficulty: "medium"
  },
  {
    id: "words-3",
    category: "words",
    title: "Nama Hari dan Bulan",
    description: "Membiasakan pengetikan huruf kapital di awal kata.",
    text: "Senin Selasa Rabu Kamis Jumat Sabtu Minggu Januari Maret Agustus Desember",
    difficulty: "medium"
  },

  // --- SENTENCES CATEGORY ---
  {
    id: "sentences-1",
    category: "sentences",
    title: "Kalimat Motivasi Belajar",
    description: "Kalimat motivasi pendek untuk meningkatkan kefasihan mengetik Anda.",
    text: "Latihan yang konsisten adalah kunci utama menguasai teknik mengetik sepuluh jari.",
    difficulty: "medium"
  },
  {
    id: "sentences-2",
    category: "sentences",
    title: "Pangram Indonesia",
    description: "Kalimat unik yang mengandung hampir seluruh huruf abjad dalam bahasa Indonesia.",
    text: "Eko pergi mencari udang dan wader di kali dekat pondok yang sepi.",
    difficulty: "hard"
  },
  {
    id: "sentences-3",
    category: "sentences",
    title: "Pepatah Klasik Indonesia",
    description: "Melatih pengetikan kalimat panjang berstruktur baku dengan tanda baca lengkap.",
    text: "Sedikit demi sedikit, lama-lama menjadi bukit. Kegagalan hari ini adalah sukses tertunda.",
    difficulty: "hard"
  },

  // --- NUMBERS & SYMBOLS ---
  {
    id: "numbers-1",
    category: "numbers",
    title: "Deret Angka Dasar",
    description: "Melatih ingatan motorik jari untuk baris angka paling atas.",
    text: "123 456 789 012 987 654 3210 1029 3847 5620",
    difficulty: "medium"
  },
  {
    id: "numbers-2",
    category: "numbers",
    title: "Format Tanggal & Uang",
    description: "Latihan mengetik angka, garis miring, titik, dan simbol mata uang.",
    text: "Hari ini tanggal 25/08/2026. Saldo tabungan Anda adalah Rp 1.500.000.",
    difficulty: "hard"
  },
  {
    id: "numbers-3",
    category: "numbers",
    title: "Kombinasi Simbol & Sandi",
    description: "Latihan mengetik simbol pemrograman dasar yang sering digunakan di komputer.",
    text: "email@contoh.com #belajar (100% sukses!) {x = y + 5;}",
    difficulty: "hard"
  }
];
