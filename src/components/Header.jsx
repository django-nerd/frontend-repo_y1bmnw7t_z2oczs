import React from "react";

export default function Header({ email, onLogout }) {
  return (
    <header className="w-full py-4 px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="text-lg font-semibold text-white">Text → DOCX</div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-sm">{email}</span>
          <button
            onClick={onLogout}
            className="text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
