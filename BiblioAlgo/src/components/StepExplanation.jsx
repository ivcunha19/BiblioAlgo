import React from 'react';

export default function StepExplanation({ step }) {
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
    <div
      className={`border rounded-2xl p-4 sm:p-5 shadow-xl transition-colors duration-200 ${
        erro
          ? 'bg-rose-950/40 border-rose-800 text-rose-200'
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Line code quote & badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                erro
                  ? 'bg-rose-900 text-rose-300'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              Linha {lineNumber}
            </span>
            <code className="text-xs sm:text-sm font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
              {codeLine || '/* execução */'}
            </code>
          </div>

          {erro && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
              ⚠️ Exceção Lançada
            </span>
          )}

          {returnValue !== undefined && returnValue !== null && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Retorno: {String(returnValue)}
            </span>
          )}
        </div>

        {/* Natural Language Explanation */}
        <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-100">
          {erro ? (
            <span className="text-rose-300 font-semibold">
              {mensagemErro || description}
            </span>
          ) : (
            description
          )}
        </p>

        {/* Variables in scope */}
        {variables && Object.keys(variables).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Escopo Local:
            </span>
            {Object.entries(variables).map(([k, v]) => (
              <span
                key={k}
                className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300"
              >
                <span className="text-slate-400">{k}:</span>{' '}
                {v === null ? 'null' : String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
