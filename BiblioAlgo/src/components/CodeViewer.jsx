import React, { useEffect, useRef, useState } from 'react';
import { QUEUE_JAVA_CODE } from '../data/queueCode';

export default function CodeViewer({ currentLineNumber, activeMethod }) {
  const [focusMethodOnly, setFocusMethodOnly] = useState(false);
  const activeLineRef = useRef(null);
  const containerRef = useRef(null);

  const methodRanges = {
    construtor: { start: 10, end: 14, name: 'Fila() [Construtor]' },
    vazia: { start: 16, end: 19, name: 'vazia()' },
    enfileirar: { start: 21, end: 27, name: 'enfileirar(E item)' },
    desenfileirar: { start: 29, end: 46, name: 'desenfileirar()' },
    consultarPrimeiro: { start: 48, end: 56, name: 'consultarPrimeiro()' },
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
    <section
      aria-label="Código-Fonte Java (Fila.java)"
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Textbook Code Listing Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[11px] font-mono-code uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            Listagem 1.1
          </span>
          <span
            className="font-mono-code text-xs sm:text-sm font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Fila.java
          </span>
          {activeMethod && (
            <span
              className="text-xs font-mono-code font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-secondary-soft)',
                color: 'var(--accent-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              {methodRanges[activeMethod]?.name || activeMethod}
            </span>
          )}
        </div>

        {currentRange && (
          <button
            type="button"
            onClick={() => setFocusMethodOnly(!focusMethodOnly)}
            className="text-xs font-medium px-2.5 py-1 rounded-md transition cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {focusMethodOnly ? 'Ver classe completa' : 'Isolar método atual'}
          </button>
        )}
      </div>

      {/* Code Lines */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-3 font-mono-code text-xs sm:text-[13px] leading-relaxed"
        style={{ backgroundColor: 'var(--bg-code)' }}
      >
        {QUEUE_JAVA_CODE.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === currentLineNumber;
          const isInActiveMethod =
            currentRange &&
            lineNumber >= currentRange.start &&
            lineNumber <= currentRange.end;

          if (focusMethodOnly && currentRange && !isInActiveMethod) {
            return null;
          }

          return (
            <div
              key={lineNumber}
              ref={isActive ? activeLineRef : null}
              className="flex items-start rounded px-1.5 py-0.5 transition-colors duration-150"
              style={{
                backgroundColor: isActive
                  ? 'var(--highlight-line-bg)'
                  : 'transparent',
                color: isActive
                  ? 'var(--highlight-line-text)'
                  : isInActiveMethod || !currentRange
                  ? 'var(--text-primary)'
                  : 'var(--text-muted)',
                borderLeft: isActive
                  ? '3px solid var(--highlight-line-border)'
                  : '3px solid transparent',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <span
                className="select-none text-right w-7 pr-2.5 shrink-0 font-mono-code text-[11px]"
                style={{
                  color: isActive
                    ? 'var(--highlight-line-text)'
                    : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {lineNumber}
              </span>

              <span
                className="w-4 shrink-0 font-bold select-none"
                style={{ color: 'var(--accent-primary)' }}
                aria-hidden="true"
              >
                {isActive ? '▶' : ''}
              </span>

              <span className="whitespace-pre overflow-x-auto">
                {line ? line.replace(/\t/g, '  ') : ' '}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
