import React from 'react';

export default function StepExplanation({ step, stepIndex = 0, totalSteps = 1 }) {
  if (!step) return null;

  const {
    lineNumber,
    codeLine,
    description,
    variables = {},
    returnValue,
    erro,
    mensagemErro,
  } = step;

  return (
    <article
      aria-live="polite"
      className="rounded-xl p-4 sm:p-5 transition-colors duration-200"
      style={{
        backgroundColor: erro ? 'var(--danger-bg)' : 'var(--bg-surface)',
        border: `1px solid ${erro ? 'var(--danger-border)' : 'var(--border-primary)'}`,
        borderLeft: `4px solid ${
          erro ? 'var(--danger-border)' : 'var(--accent-primary)'
        }`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Top Metadata: Step Note + Executed Line */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-mono-code font-bold"
              style={{
                backgroundColor: erro
                  ? 'var(--danger-border)'
                  : 'var(--highlight-line-bg)',
                color: erro ? '#ffffff' : 'var(--highlight-line-text)',
                border: erro
                  ? 'none'
                  : '1px solid var(--highlight-line-border)',
              }}
            >
              Linha {lineNumber}
            </span>

            <code
              className="text-xs sm:text-sm font-mono-code px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-code)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {codeLine ? codeLine.trim() : '/* execução */'}
            </code>
          </div>

          <div className="flex items-center gap-2">
            {erro && (
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--danger-border)',
                  color: '#ffffff',
                }}
              >
                <span aria-hidden="true">⚠️</span>
                <span>Exceção Lançada</span>
              </span>
            )}

            {returnValue !== undefined && returnValue !== null && (
              <span
                className="text-xs font-mono-code font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--ptr-tras-bg)',
                  color: 'var(--ptr-tras-text)',
                  border: '1px solid var(--ptr-tras-border)',
                }}
              >
                <span aria-hidden="true">↪</span>
                <span>Retorno: {String(returnValue)}</span>
              </span>
            )}

            <span
              className="text-[11px] font-mono-code"
              style={{ color: 'var(--text-muted)' }}
            >
              Nota {stepIndex + 1}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Didactic Natural Language Explanation */}
        <p
          className="text-sm sm:text-base leading-relaxed font-serif-library"
          style={{
            color: erro ? 'var(--danger-text)' : 'var(--text-primary)',
            fontWeight: erro ? 600 : 400,
          }}
        >
          {erro ? mensagemErro || description : description}
        </p>

        {/* Local Scope Variables */}
        {variables && Object.keys(variables).length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 pt-2.5"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Estado / Variáveis:
            </span>
            {Object.entries(variables).map(([k, v]) => (
              <span
                key={k}
                className="font-mono-code text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{k} = </span>
                <strong>{v === null ? 'null' : String(v)}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
