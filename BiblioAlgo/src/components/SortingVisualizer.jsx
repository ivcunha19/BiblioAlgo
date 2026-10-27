import React from 'react';

function getIndexPointerStyle(name) {
  if (name === 'i' || name === 'esq' || name === 'inicio' || name === 'raiz') {
    return {
      backgroundColor: 'var(--ptr-frente-bg)',
      color: 'var(--ptr-frente-text)',
      borderColor: 'var(--ptr-frente-border)',
    };
  }
  if (name === 'j' || name === 'j+1' || name === 'dir' || name === 'fim' || name === 'tamHeap') {
    return {
      backgroundColor: 'var(--ptr-tras-bg)',
      color: 'var(--ptr-tras-text)',
      borderColor: 'var(--ptr-tras-border)',
    };
  }
  if (name === 'menor' || name === 'pivot' || name === 'maior' || name === 'meio') {
    return {
      backgroundColor: 'var(--ptr-novo-bg)',
      color: 'var(--ptr-novo-text)',
      borderColor: 'var(--ptr-novo-border)',
    };
  }
  return {
    backgroundColor: 'var(--ptr-primeiro-bg)',
    color: 'var(--ptr-primeiro-text)',
    borderColor: 'var(--ptr-primeiro-border)',
  };
}

export default function SortingVisualizer({ algorithmId = 'bubblesort', step }) {
  if (!step || !step.array) {
    return (
      <div
        className="flex items-center justify-center h-full rounded-xl font-mono-code text-sm p-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-muted)',
        }}
      >
        Nenhum estado do vetor disponível.
      </div>
    );
  }

  const {
    array = [],
    indexPointers = [],
    comparingIndices = [],
    swappingIndices = [],
    sortedIndices = [],
    activeRange = null,
    pivotIndex = null,
    keyItem = null,
    auxArrays = null,
    comparacoes = 0,
    movimentacoes = 0,
    iterationLabel = '',
  } = step;

  const maxVal = Math.max(...array.map((v) => Math.abs(Number(v)) || 1), 1);

  const pointersByIndex = {};
  indexPointers.forEach((ptr) => {
    if (!pointersByIndex[ptr.index]) {
      pointersByIndex[ptr.index] = [];
    }
    pointersByIndex[ptr.index].push(ptr);
  });

  return (
    <section
      aria-label="Diagrama do Vetor na Memória"
      className="flex flex-col h-full rounded-xl p-4 sm:p-5 overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Diagram Header + IOrdenator Metrics */}
      <div
        className="flex flex-wrap items-start justify-between gap-3 pb-3 mb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="text-base sm:text-lg font-bold font-serif-library"
              style={{ color: 'var(--text-primary)' }}
            >
              Vetor na Memória (dadosOrdenados)
            </h2>
            {iterationLabel && (
              <span
                className="text-xs font-mono-code font-semibold px-2.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--accent-secondary-soft)',
                  color: 'var(--accent-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                {iterationLabel}
              </span>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {activeRange ? (
              <span>
                Faixa ativa na iteração:{' '}
                <code className="font-mono-code font-semibold">
                  [{activeRange[0]} .. {activeRange[1]}]
                </code>
              </span>
            ) : (
              <span>Estado completo do vetor ({array.length} posições)</span>
            )}
          </p>
        </div>

        {/* Live IOrdenator Counters (comparacoes & movimentacoes) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
          <div
            className="px-2.5 py-1 rounded-md flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--ptr-novo-bg)',
              color: 'var(--ptr-novo-text)',
              border: '1px solid var(--ptr-novo-border)',
            }}
            title="Contador getComparacoes() da interface IOrdenator"
          >
            <span>Comparações:</span>
            <strong className="text-sm">{comparacoes}</strong>
          </div>

          <div
            className="px-2.5 py-1 rounded-md flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--ptr-frente-bg)',
              color: 'var(--ptr-frente-text)',
              border: '1px solid var(--ptr-frente-border)',
            }}
            title="Contador getMovimentacoes() da interface IOrdenator"
          >
            <span>Movimentações:</span>
            <strong className="text-sm">{movimentacoes}</strong>
          </div>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-[11px] font-mono-code">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block border"
              style={{
                backgroundColor: 'var(--ptr-novo-bg)',
                borderColor: 'var(--ptr-novo-border)',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Comparando</span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block border"
              style={{
                backgroundColor: 'var(--danger-bg)',
                borderColor: 'var(--danger-border)',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>
              Troca / Movimento
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block border"
              style={{
                backgroundColor: 'var(--ptr-tras-bg)',
                borderColor: 'var(--ptr-tras-border)',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Ordenado</span>
          </span>
        </div>

        {keyItem && (
          <div
            className="px-2.5 py-0.5 rounded border font-bold"
            style={{
              backgroundColor: 'var(--ptr-primeiro-bg)',
              color: 'var(--ptr-primeiro-text)',
              borderColor: 'var(--ptr-primeiro-border)',
            }}
          >
            {keyItem.label} = {keyItem.value}
          </div>
        )}
      </div>

      {/* Main Array Canvas */}
      <div
        className="flex-1 overflow-x-auto overflow-y-auto flex flex-col justify-center gap-5 min-h-[260px] p-4 sm:p-6 rounded-lg library-grid-canvas"
        style={{ border: '1px solid var(--border-primary)' }}
      >
        {/* Bars + Array Cells */}
        <div className="flex items-end justify-center gap-2 sm:gap-3 mx-auto pt-2">
          {array.map((val, idx) => {
            const isComparing = comparingIndices.includes(idx);
            const isSwapping = swappingIndices.includes(idx);
            const isSorted = sortedIndices.includes(idx);
            const isPivot = pivotIndex === idx;
            const isInActiveRange =
              !activeRange || (idx >= activeRange[0] && idx <= activeRange[1]);

            const cellPointers = pointersByIndex[idx] || [];
            const heightPct = Math.max(18, Math.round((Math.abs(val) / maxVal) * 110));

            let boxBg = 'var(--bg-surface)';
            let boxBorder = 'var(--border-strong)';
            let boxText = 'var(--text-primary)';
            let barBg = 'var(--accent-secondary-soft)';
            let barBorder = 'var(--accent-secondary)';

            if (isSwapping) {
              boxBg = 'var(--danger-bg)';
              boxBorder = 'var(--danger-border)';
              boxText = 'var(--danger-text)';
              barBg = 'var(--danger-bg)';
              barBorder = 'var(--danger-border)';
            } else if (isComparing) {
              boxBg = 'var(--ptr-novo-bg)';
              boxBorder = 'var(--ptr-novo-border)';
              boxText = 'var(--ptr-novo-text)';
              barBg = 'var(--ptr-novo-bg)';
              barBorder = 'var(--ptr-novo-border)';
            } else if (isPivot) {
              boxBg = 'var(--ptr-primeiro-bg)';
              boxBorder = 'var(--ptr-primeiro-border)';
              boxText = 'var(--ptr-primeiro-text)';
              barBg = 'var(--ptr-primeiro-bg)';
              barBorder = 'var(--ptr-primeiro-border)';
            } else if (isSorted) {
              boxBg = 'var(--ptr-tras-bg)';
              boxBorder = 'var(--ptr-tras-border)';
              boxText = 'var(--ptr-tras-text)';
              barBg = 'var(--ptr-tras-bg)';
              barBorder = 'var(--ptr-tras-border)';
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center transition-all duration-200"
                style={{ opacity: isInActiveRange || isSorted ? 1 : 0.55 }}
              >
                {/* Proportional Bar */}
                <div className="h-[115px] flex items-end justify-center mb-1.5">
                  <div
                    className="w-8 sm:w-10 rounded-t-md transition-all duration-200"
                    style={{
                      height: `${heightPct}px`,
                      backgroundColor: barBg,
                      borderTop: `2px solid ${barBorder}`,
                      borderLeft: `2px solid ${barBorder}`,
                      borderRight: `2px solid ${barBorder}`,
                    }}
                  />
                </div>

                {/* Array Cell Box [ valor ] */}
                <div
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-lg flex items-center justify-center font-mono-code text-sm sm:text-base font-bold transition-all duration-200"
                  style={{
                    backgroundColor: boxBg,
                    color: boxText,
                    border: `2px solid ${boxBorder}`,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {val}
                </div>

                {/* Array Index [idx] */}
                <span
                  className="mt-1 text-[11px] font-mono-code font-semibold"
                  style={{ color: 'var(--text-muted)' }}
                >
                  [{idx}]
                </span>

                {/* Index Pointers pointing to this position */}
                <div className="min-h-[48px] flex flex-col items-center justify-start gap-1 mt-1">
                  {cellPointers.map((ptr) => (
                    <span
                      key={ptr.name}
                      className="px-2 py-0.5 text-[11px] font-mono-code font-bold rounded border flex items-center gap-0.5"
                      style={getIndexPointerStyle(ptr.name)}
                    >
                      <span aria-hidden="true">↑</span>
                      <span>{ptr.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Auxiliary Subarrays for Mergesort (a1 & a2) */}
        {algorithmId === 'mergesort' && auxArrays && auxArrays.a1 && auxArrays.a2 && (
          <div
            className="p-3 rounded-lg flex flex-wrap items-center justify-center gap-6 text-xs font-mono-code"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: 'var(--ptr-frente-text)' }}>
                Subvetor a1 (esq):
              </span>
              <div className="flex items-center gap-1">
                {auxArrays.a1.map((v, iIdx) => {
                  const isCurrentI = auxArrays.i === iIdx;
                  return (
                    <div key={iIdx} className="flex flex-col items-center">
                      <span
                        className="px-2.5 py-1 rounded border font-bold"
                        style={{
                          backgroundColor: isCurrentI
                            ? 'var(--ptr-frente-bg)'
                            : 'var(--bg-elevated)',
                          color: isCurrentI
                            ? 'var(--ptr-frente-text)'
                            : 'var(--text-primary)',
                          borderColor: isCurrentI
                            ? 'var(--ptr-frente-border)'
                            : 'var(--border-primary)',
                        }}
                      >
                        {v}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {isCurrentI ? `↑ i=${iIdx}` : `[${iIdx}]`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: 'var(--ptr-tras-text)' }}>
                Subvetor a2 (dir):
              </span>
              <div className="flex items-center gap-1">
                {auxArrays.a2.map((v, jIdx) => {
                  const isCurrentJ = auxArrays.j === jIdx;
                  return (
                    <div key={jIdx} className="flex flex-col items-center">
                      <span
                        className="px-2.5 py-1 rounded border font-bold"
                        style={{
                          backgroundColor: isCurrentJ
                            ? 'var(--ptr-tras-bg)'
                            : 'var(--bg-elevated)',
                          color: isCurrentJ
                            ? 'var(--ptr-tras-text)'
                            : 'var(--text-primary)',
                          borderColor: isCurrentJ
                            ? 'var(--ptr-tras-border)'
                            : 'var(--border-primary)',
                        }}
                      >
                        {v}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {isCurrentJ ? `↑ j=${jIdx}` : `[${jIdx}]`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Auxiliary 1-Indexed Array tmp[0..n] for Heapsort */}
        {algorithmId === 'heapsort' && auxArrays && auxArrays.tmp && (
          <div
            className="p-3 rounded-lg flex flex-col items-center gap-2 text-xs font-mono-code"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Vetor Auxiliar tmp[1..n] (posição 0 ignorada):
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                tamHeap = <strong>{auxArrays.tamHeap}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {auxArrays.tmp.map((v, tIdx) => {
                const isIgnoredZero = tIdx === 0;
                const isInsideHeap = tIdx >= 1 && tIdx <= auxArrays.tamHeap;
                return (
                  <div key={tIdx} className="flex flex-col items-center">
                    <span
                      className="px-2.5 py-1 rounded border font-bold"
                      style={{
                        backgroundColor: isIgnoredZero
                          ? 'var(--bg-page)'
                          : isInsideHeap
                          ? 'var(--accent-secondary-soft)'
                          : 'var(--ptr-tras-bg)',
                        color: isIgnoredZero
                          ? 'var(--text-muted)'
                          : isInsideHeap
                          ? 'var(--accent-secondary)'
                          : 'var(--ptr-tras-text)',
                        borderColor: isIgnoredZero
                          ? 'var(--border-subtle)'
                          : isInsideHeap
                          ? 'var(--accent-secondary)'
                          : 'var(--ptr-tras-border)',
                        borderStyle: isIgnoredZero ? 'dashed' : 'solid',
                      }}
                    >
                      {isIgnoredZero ? 'null' : v}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      tmp[{tIdx}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
