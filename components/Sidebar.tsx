"use client";

import React, { useState } from "react";

const ROSTER = [
  { name: "Gui Khury",             pick: 4,  sport: "Skate · Vert/Park",  flag: "🇧🇷" },
  { name: "Sky Brown",             pick: 5,  sport: "Skate · Park/Vert",  flag: "🇬🇧" },
  { name: "Ryan Williams",         pick: 11, sport: "BMX · Dirt/Park",    flag: "🇦🇺" },
  { name: "Ibuki Matsumoto",       pick: 14, sport: "Skate · Street",     flag: "🇯🇵" },
  { name: "Queen Saray Villegas",  pick: 18, sport: "BMX · Park",         flag: "🇨🇴" },
  { name: "Garrett Reynolds",      pick: 23, sport: "BMX · Street",       flag: "🇺🇸" },
  { name: "Giovanni Vianna",       pick: 25, sport: "Skate · Street",     flag: "🇧🇷" },
  { name: "Gabriela Mazetto",      pick: 32, sport: "Skate · Street",     flag: "🇧🇷" },
  { name: "Luigi Cini",            pick: 36, sport: "Skate · Park/Vert",  flag: "🇧🇷" },
  { name: "Raicca Ventura",        pick: 37, sport: "Skate · Park/Vert",  flag: "🇧🇷" },
];

const VALUES = [
  "Progression",
  "Resilience",
  "Creativity",
  "Humility",
  "Shared Growth",
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scroll">
      {/* Logo + close */}
      <div className="px-6 pt-6 pb-5 border-b border-xblue-700">
        <div className="flex items-start justify-between gap-2 mb-4">
          <img
            src="/wordmark-blue.svg"
            alt="XC São Paulo"
            className="rounded-lg w-full"
            style={{ maxHeight: 180, objectFit: "contain" }}
          />
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="shrink-0 mt-1 w-7 h-7 flex items-center justify-center rounded-lg text-white opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-xblue-100 opacity-80">Official AI Assistant · 2026</span>
        </div>
      </div>

      {/* GM */}
      <div className="px-6 py-5 border-b border-xblue-700">
        <p className="text-[10px] uppercase tracking-widest text-xblue-100 opacity-60 mb-3">
          General Manager
        </p>
        <div>
          <p className="font-semibold text-sm leading-tight">Bob Burnquist</p>
          <p className="text-[11px] text-xblue-100 opacity-60">GM · Club São Paulo</p>
        </div>
      </div>

      {/* Roster */}
      <div className="px-6 py-5 border-b border-xblue-700">
        <p className="text-[10px] uppercase tracking-widest text-xblue-100 opacity-60 mb-3">
          Roster · 10 Athletes
        </p>
        <ul className="space-y-2">
          {ROSTER.map((a) => (
            <li key={a.pick} className="flex items-start gap-2">
              <span className="text-sm shrink-0">{a.flag}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight truncate">{a.name}</p>
                <p className="text-[10px] text-xblue-100 opacity-50 leading-tight">{a.sport}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Values */}
      <div className="px-6 py-5 border-b border-xblue-700">
        <p className="text-[10px] uppercase tracking-widest text-xblue-100 opacity-60 mb-3">
          Club Values
        </p>
        <ul className="space-y-1.5">
          {VALUES.map((v) => (
            <li key={v} className="flex items-start gap-2 text-xs text-xblue-100 opacity-80">
              <span className="text-xblue-400 mt-0.5">→</span>
              {v}
            </li>
          ))}
        </ul>
      </div>

      {/* Season */}
      <div className="px-6 py-5">
        <p className="text-[10px] uppercase tracking-widest text-xblue-100 opacity-60 mb-3">
          2026 Season
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-xs text-xblue-100 opacity-80">
            <span className="text-xblue-400 mt-0.5 shrink-0">→</span>
            4-club championship · snake draft
          </li>
          <li className="flex items-start gap-2 text-xs text-xblue-100 opacity-80">
            <span className="text-xblue-400 mt-0.5 shrink-0">→</span>
            Draft: March 12, 2026 · Pick #4
          </li>
          <li className="flex items-start gap-2 text-xs text-xblue-100 opacity-80">
            <span className="text-xblue-400 mt-0.5 shrink-0">→</span>
            5 disciplines · Skate & BMX
          </li>
          <li className="flex items-start gap-2 text-xs text-xblue-100 opacity-80">
            <span className="text-xblue-400 mt-0.5 shrink-0">→</span>
            Points earned per stop · top-weighted
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-xblue-500 text-white border-r border-xblue-700">
        <SidebarContent />
      </aside>

      {/* Mobile toggle button — shorthand logo */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed top-3 left-3 z-40 w-11 h-11 rounded-xl overflow-hidden shadow-lg"
      >
        <img src="/shorthand-blue.svg" alt="XC SP" className="w-full h-full object-cover" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="relative w-[300px] max-w-[85vw] bg-xblue-500 text-white flex flex-col shadow-2xl"
            style={{ animation: "slideInLeft 0.22s ease-out" }}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
