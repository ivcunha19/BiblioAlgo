import React from 'react';

export default function QueueVisualizer({ step }) {
  if (!step || !step.nodes) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
        Nenhum estado disponível
      </div>
    );
  }

  const { nodes = [], pointers = [] } = step;

  // Group pointers by targetNodeId
  const pointersByNode = {};
  pointers.forEach((ptr) => {
    if (!pointersByNode[ptr.targetNodeId]) {
      pointersByNode[ptr.targetNodeId] = [];
    }
    pointersByNode[ptr.targetNodeId].push(ptr);
  });

  return (
    <div className="flex flex-col h-full bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Visual Header / Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Estrutura na Memória (Heap)</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              {nodes.length} {nodes.length === 1 ? 'célula' : 'células'}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Encadeamento simples com nó Sentinela explícito
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> frente
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> tras
          </span>
          {pointers.some((p) => p.nome === 'novaCelula') && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/80 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> novaCelula
            </span>
          )}
          {pointers.some((p) => p.nome === 'primeiro') && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/80 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> primeiro
            </span>
          )}
        </div>
      </div>

      {/* Nodes Canvas Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto flex items-center min-h-[260px] p-4 bg-slate-900/50 rounded-xl border border-slate-800/60 relative">
        <div className="flex items-center gap-3 sm:gap-4 mx-auto py-8">
          {nodes.map((node, index) => {
            const nodePointers = pointersByNode[node.id] || [];
            const isSentinela = node.sentinela;
            const isNovo = node.novo;
            const isRemovido = node.removido;

            return (
              <React.Fragment key={node.id}>
                {/* Node Column */}
                <div className="flex flex-col items-center relative group">
                  {/* Top Pointers Container */}
                  <div className="min-h-[48px] flex flex-col items-center justify-end gap-1 mb-2">
                    {nodePointers.map((ptr) => (
                      <div
                        key={ptr.nome}
                        className="px-2.5 py-0.5 text-xs font-bold rounded-full shadow-md flex items-center gap-1 transition-all duration-300 animate-bounce"
                        style={{
                          backgroundColor:
                            ptr.nome === 'frente'
                              ? '#1e3a8a'
                              : ptr.nome === 'tras'
                              ? '#064e3b'
                              : ptr.nome === 'novaCelula'
                              ? '#78350f'
                              : '#581c87',
                          color:
                            ptr.nome === 'frente'
                              ? '#93c5fd'
                              : ptr.nome === 'tras'
                              ? '#6ee7b7'
                              : ptr.nome === 'novaCelula'
                              ? '#fde68a'
                              : '#e9d5ff',
                          borderColor: ptr.cor || '#ffffff',
                          borderWidth: '1px',
                        }}
                      >
                        <span>↓</span>
                        <span>{ptr.nome}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cell Box */}
                  <div
                    className={`w-36 rounded-xl border-2 transition-all duration-300 shadow-lg overflow-hidden flex flex-col ${
                      isRemovido
                        ? 'border-dashed border-red-500 bg-red-950/20 opacity-75 ring-2 ring-red-500/30'
                        : isNovo
                        ? 'border-amber-400 bg-amber-950/20 ring-4 ring-amber-400/20 scale-105'
                        : isSentinela
                        ? 'border-indigo-500/80 bg-indigo-950/20'
                        : 'border-cyan-500/80 bg-slate-800/80'
                    }`}
                  >
                    {/* Node Header / Type Tag */}
                    <div
                      className={`px-2 py-1 text-[11px] font-mono font-semibold flex items-center justify-between border-b ${
                        isSentinela
                          ? 'bg-indigo-900/60 border-indigo-700/60 text-indigo-200'
                          : isNovo
                          ? 'bg-amber-900/60 border-amber-700/60 text-amber-200'
                          : isRemovido
                          ? 'bg-red-900/60 border-red-700/60 text-red-200'
                          : 'bg-slate-700/60 border-slate-600/60 text-slate-300'
                      }`}
                    >
                      <span>
                        {isSentinela
                          ? '⚓ Sentinela'
                          : isNovo
                          ? '✨ novaCelula'
                          : isRemovido
                          ? '🗑️ Removida'
                          : `Célula [${index}]`}
                      </span>
                      <span className="text-[9px] opacity-70">
                        #{node.id}
                      </span>
                    </div>

                    {/* Cell Compartments: [ item | proximo ] */}
                    <div className="grid grid-cols-2 text-center divide-x divide-slate-700 bg-slate-950/40">
                      {/* Item compartment */}
                      <div className="p-3 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                          item
                        </span>
                        <span
                          className={`font-mono text-base font-bold mt-0.5 ${
                            isSentinela
                              ? 'text-slate-500 italic'
                              : 'text-cyan-300'
                          }`}
                        >
                          {isSentinela ? 'null' : String(node.valor)}
                        </span>
                      </div>

                      {/* Next Pointer compartment */}
                      <div className="p-3 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                          proximo
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-300 mt-0.5 flex items-center gap-1">
                          {node.proximoId ? (
                            <>
                              <span className="text-cyan-400">●</span>
                              <span className="text-[10px] text-slate-400">
                                #{node.proximoId}
                              </span>
                            </>
                          ) : (
                            <span className="text-red-400 font-bold">null</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info: role description */}
                  <div className="mt-2 text-[11px] font-mono text-slate-400 text-center">
                    {isSentinela && (
                      <span className="text-indigo-400/90 font-medium">
                        (cabeça da fila)
                      </span>
                    )}
                    {isNovo && (
                      <span className="text-amber-400 font-medium">
                        (recém-alocado)
                      </span>
                    )}
                    {isRemovido && (
                      <span className="text-red-400 font-medium">
                        (desvinculado)
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow to Next Node or End of list */}
                {index < nodes.length - 1 && (
                  <div className="flex items-center px-1 text-slate-500 font-mono text-sm self-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 relative flex items-center justify-end">
                        <span className="absolute -right-1 text-indigo-400 text-xs">
                          ▶
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1">prox</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Null Pointer Terminator for the last node */}
          {nodes.length > 0 && nodes[nodes.length - 1].proximoId === null && (
            <div className="flex items-center pl-1 text-slate-500 font-mono text-xs self-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                <span className="text-red-400 font-bold">⏚</span>
                <span>null</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
