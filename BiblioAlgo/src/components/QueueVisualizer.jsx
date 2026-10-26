import React from 'react';

function getPointerStyles(nome) {
  if (nome === 'frente') {
    return {
      backgroundColor: 'var(--ptr-frente-bg)',
      color: 'var(--ptr-frente-text)',
      borderColor: 'var(--ptr-frente-border)',
    };
  }
  if (nome === 'tras') {
    return {
      backgroundColor: 'var(--ptr-tras-bg)',
      color: 'var(--ptr-tras-text)',
      borderColor: 'var(--ptr-tras-border)',
    };
  }
  if (nome === 'novaCelula') {
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

export default function QueueVisualizer({ step }) {
  if (!step || !step.nodes) {
    return (
      <div
        className="flex items-center justify-center h-full rounded-xl font-mono-code text-sm p-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-muted)',
        }}
      >
        Nenhum estado disponível na memória.
      </div>
    );
  }

  const { nodes = [], pointers = [] } = step;

  const pointersByNode = {};
  pointers.forEach((ptr) => {
    if (!pointersByNode[ptr.targetNodeId]) {
      pointersByNode[ptr.targetNodeId] = [];
    }
    pointersByNode[ptr.targetNodeId].push(ptr);
  });

  const frentePtr = pointers.find((p) => p.nome === 'frente');
  const trasPtr = pointers.find((p) => p.nome === 'tras');
  const isFrenteEqualTras =
    frentePtr && trasPtr && frentePtr.targetNodeId === trasPtr.targetNodeId;
  const activeItemsCount = Math.max(
    0,
    nodes.filter((n) => !n.sentinela && !n.removido && !n.novo).length
  );

  return (
    <section
      aria-label="Diagrama da Estrutura na Memória"
      className="flex flex-col h-full rounded-xl p-4 sm:p-5 overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Diagram Header */}
      <div
        className="flex flex-wrap items-start justify-between gap-3 pb-3 mb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] font-mono-code uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              Figura 1.1
            </span>
            <h2
              className="text-base sm:text-lg font-bold font-serif-library"
              style={{ color: 'var(--text-primary)' }}
            >
              Representação na Memória (Heap)
            </h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {isFrenteEqualTras ? (
              <span>
                Invariante atual: <code className="font-mono-code font-semibold">frente == tras</code>{' '}
                (Fila logicamente vazia — apenas nó sentinela)
              </span>
            ) : (
              <span>
                Fila com <strong>{activeItemsCount}</strong>{' '}
                {activeItemsCount === 1 ? 'elemento útil' : 'elementos úteis'} após a célula sentinela
              </span>
            )}
          </p>
        </div>

        {/* Clean Textbook Legend */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-code">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-medium"
            style={getPointerStyles('frente')}
          >
            <span>↓</span> frente
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-medium"
            style={getPointerStyles('tras')}
          >
            <span>↓</span> tras
          </span>
          {pointers.some((p) => p.nome === 'novaCelula') && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-medium"
              style={getPointerStyles('novaCelula')}
            >
              <span>↓</span> novaCelula
            </span>
          )}
          {pointers.some((p) => p.nome === 'primeiro') && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-medium"
              style={getPointerStyles('primeiro')}
            >
              <span>↓</span> primeiro
            </span>
          )}
        </div>
      </div>

      {/* Memory Diagram Canvas */}
      <div
        className="flex-1 overflow-x-auto overflow-y-auto flex items-center min-h-[260px] p-4 sm:p-6 rounded-lg library-grid-canvas"
        style={{ border: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mx-auto py-4">
          {nodes.map((node, index) => {
            const nodePointers = pointersByNode[node.id] || [];
            const isSentinela = node.sentinela;
            const isNovo = node.novo;
            const isRemovido = node.removido;

            let cardBorderColor = 'var(--border-strong)';
            let headerBg = 'var(--bg-elevated)';
            let headerText = 'var(--text-primary)';

            if (isSentinela) {
              cardBorderColor = 'var(--accent-secondary)';
              headerBg = 'var(--accent-secondary-soft)';
              headerText = 'var(--accent-secondary)';
            } else if (isNovo) {
              cardBorderColor = 'var(--ptr-novo-border)';
              headerBg = 'var(--ptr-novo-bg)';
              headerText = 'var(--ptr-novo-text)';
            } else if (isRemovido) {
              cardBorderColor = 'var(--danger-border)';
              headerBg = 'var(--danger-bg)';
              headerText = 'var(--danger-text)';
            }

            return (
              <React.Fragment key={node.id}>
                <div className="flex flex-col items-center relative">
                  {/* Pointers pointing to this cell */}
                  <div className="min-h-[54px] flex flex-col items-center justify-end gap-1 mb-2">
                    {nodePointers.map((ptr) => (
                      <div
                        key={ptr.nome}
                        className="px-2.5 py-0.5 text-xs font-mono-code font-bold rounded border flex items-center gap-1 transition-all duration-200"
                        style={getPointerStyles(ptr.nome)}
                      >
                        <span aria-hidden="true">↓</span>
                        <span>{ptr.nome}</span>
                      </div>
                    ))}
                  </div>

                  {/* Memory Cell Box: [ item | proximo ] */}
                  <div
                    className="w-36 sm:w-40 rounded-lg overflow-hidden flex flex-col transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderWidth: '2px',
                      borderStyle: isRemovido ? 'dashed' : 'solid',
                      borderColor: cardBorderColor,
                      opacity: isRemovido ? 0.78 : 1,
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {/* Cell Title Bar */}
                    <div
                      className="px-2.5 py-1 text-[11px] font-mono-code font-semibold flex items-center justify-between"
                      style={{
                        backgroundColor: headerBg,
                        color: headerText,
                        borderBottom: `1px solid ${cardBorderColor}`,
                      }}
                    >
                      <span>
                        {isSentinela
                          ? '⚓ Sentinela'
                          : isNovo
                          ? '✨ Nova Célula'
                          : isRemovido
                          ? '🗑️ Removida'
                          : `Célula [${index}]`}
                      </span>
                      <span className="text-[10px] opacity-80">#{node.id}</span>
                    </div>

                    {/* Two Compartments: item | proximo */}
                    <div
                      className="grid grid-cols-2 text-center"
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      {/* Item Field */}
                      <div
                        className="p-2.5 flex flex-col items-center justify-center"
                        style={{ borderRight: '1px solid var(--border-primary)' }}
                      >
                        <span
                          className="text-[10px] uppercase font-mono-code tracking-wider"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          item
                        </span>
                        <span
                          className={`font-mono-code text-sm sm:text-base font-bold mt-0.5 ${
                            isSentinela ? 'italic font-normal' : ''
                          }`}
                          style={{
                            color: isSentinela
                              ? 'var(--text-muted)'
                              : 'var(--text-primary)',
                          }}
                        >
                          {isSentinela ? 'null' : String(node.valor)}
                        </span>
                      </div>

                      {/* Proximo Field */}
                      <div className="p-2.5 flex flex-col items-center justify-center">
                        <span
                          className="text-[10px] uppercase font-mono-code tracking-wider"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          proximo
                        </span>
                        <span className="font-mono-code text-xs font-semibold mt-0.5 flex items-center gap-1">
                          {node.proximoId ? (
                            <>
                              <span style={{ color: 'var(--accent-secondary)' }}>●</span>
                              <span style={{ color: 'var(--text-primary)' }}>
                                #{node.proximoId}
                              </span>
                            </>
                          ) : (
                            <span
                              className="font-bold"
                              style={{ color: 'var(--accent-primary)' }}
                            >
                              null
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Caption Below Cell */}
                  <div
                    className="mt-2 min-h-[18px] text-[11px] font-mono-code text-center"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {isSentinela && <span>(cabeça fixa)</span>}
                    {isNovo && (
                      <span style={{ color: 'var(--ptr-novo-text)' }}>
                        (recém-alocada)
                      </span>
                    )}
                    {isRemovido && (
                      <span style={{ color: 'var(--danger-text)' }}>
                        (desvinculada)
                      </span>
                    )}
                    {!isSentinela && !isNovo && !isRemovido && index === 1 && (
                      <span>(1º da fila)</span>
                    )}
                  </div>
                </div>

                {/* Pointer Arrow Between Cells */}
                {index < nodes.length - 1 && (
                  <div className="flex items-center px-1 font-mono-code text-xs self-center mt-6">
                    {node.proximoId ? (
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 sm:w-10 h-0.5 relative flex items-center justify-end"
                          style={{ backgroundColor: 'var(--text-secondary)' }}
                        >
                          <span
                            className="absolute -right-1 text-xs"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            ▶
                          </span>
                        </div>
                        <span
                          className="text-[10px] mt-1"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          #{node.proximoId}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center px-1"
                        title="Sem vínculo de ponteiro (proximo = null)"
                      >
                        <span
                          className="text-xs font-bold"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          ⨯
                        </span>
                        <span
                          className="text-[9px]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          isolado
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Explicit Ground / Null Terminator at the end of the chain */}
          {nodes.length > 0 && nodes[nodes.length - 1].proximoId === null && (
            <div className="flex items-center pl-1 font-mono-code text-xs self-center mt-6">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
                title="Fim do encadeamento (ponteiro nulo)"
              >
                <span
                  className="font-bold"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  ⏚
                </span>
                <span>null</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
