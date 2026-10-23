import React, { useEffect, useRef, useState } from 'react';
import { QUEUE_JAVA_CODE } from '../data/queueCode';

export default function CodeViewer({ currentLineNumber, activeMethod }) {
  const [focusMethodOnly, setFocusMethodOnly] = useState(false);
  const activeLineRef = useRef(null);
  const containerRef = useRef(null);

  // Method line ranges in Fila.java
  const methodRanges = {
    construtor: { start: 10, end: 14, name: 'Fila() [Construtor]' },
    vazia: { start: 16, end: 19, name: 'vazia()' },
    enfileirar: { start: 21, end: 27, name: 'enfileirar(E item)' },
    desenfileirar: { start: 29, end: 46, name: 'desenfileirar()' },
    consultarPrimeiro: { start: 48, end: 57, name: 'consultarPrimeiro()' },
  };

  const currentRange = methodRanges[activeMethod] || null;

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineNumber]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 font-mono text-xs font-semibold text-slate-400">
            Fila.java
          </span>
          {activeMethod && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {methodRanges[activeMethod]?.name || activeMethod}
            </span>
          )}
        </div>

        {currentRange && (
          <button
            onClick={() => setFocusMethodOnly(!focusMethodOnly)}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition"
          >
            {focusMethodOnly ? 'Ver classe inteira' : 'Focar método'}
          </button>
        )}
      </div>

      {/* Code body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-3 font-mono text-xs sm:text-sm leading-relaxed"
      >
        {QUEUE_JAVA_CODE.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === currentLineNumber;

          // If focusMethodOnly is true and line is outside current method range, skip
          if (focusMethodOnly && currentRange) {
            if (lineNumber < currentRange.start || lineNumber > currentRange.end) {
              return null;
            }
          }

          return (
            <div
              key={lineNumber}
              ref={isActive ? activeLineRef : null}
              className={`flex items-start transition-colors duration-150 rounded px-1.5 py-0.5 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border-l-4 border-amber-400 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <span
                className={`select-none text-right w-8 pr-3 shrink-0 font-mono text-xs ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-600'
                }`}
              >
                {lineNumber}
              </span>

              <span className="w-4 shrink-0 text-amber-400 font-bold">
                {isActive ? '▶' : ''}
              </span>

              <span className="whitespace-pre overflow-x-auto">
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
