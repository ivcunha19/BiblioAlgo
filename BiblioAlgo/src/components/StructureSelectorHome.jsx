import React from 'react';
import { STRUCTURES_CATALOG } from '../data/queueCode';
import logoImg from '../assets/logo.png';

const STRUCTURE_KEYS = ['fila', 'pilha', 'lista'];

export default function StructureSelectorHome({ onSelectStructure }) {
  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
      {/* Intro Hero Banner with Logo */}
      <section
        className="rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="max-w-2xl flex flex-col gap-2">
          <span
            className="text-xs font-mono-code uppercase tracking-wider font-semibold"
            style={{ color: 'var(--accent-primary)' }}
          >
            Visualizador Passo a Passo de Estruturas de Dados
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold font-serif-library tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Escolha uma estrutura para estudar
          </h2>
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Selecione uma das estruturas dinâmicas encadeadas abaixo para executar
            suas operações, acompanhar a alocação de células na memória e observar
            a execução linha a linha do código em Java.
          </p>
          <p
            className="text-xs leading-relaxed mt-1 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>
              Nota sobre terminologia:
            </strong>{' '}
            Em Java, variáveis que armazenam o endereço de objetos são chamadas de{' '}
            <strong>referências</strong>, mas também utilizamos o termo{' '}
            <strong>ponteiros</strong> por ser amplamente empregado nas aulas de AEDS.
          </p>
        </div>

        <div
          className="hidden sm:flex w-20 h-20 rounded-2xl items-center justify-center p-3.5 shrink-0"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
          aria-hidden="true"
        >
          <img
            src={logoImg}
            alt=""
            width="56"
            height="56"
            className="w-14 h-14 object-contain logo-adaptive"
          />
        </div>
      </section>

      {/* Structure Cards Grid */}
      <section
        aria-label="Estruturas de Dados Disponíveis"
        className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
      >
        {STRUCTURE_KEYS.map((key) => {
          const item = STRUCTURES_CATALOG[key];
          const [ptrA, ptrB] = item.primaryPointers;

          return (
            <article
              key={item.id}
              className="rounded-xl p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex flex-col gap-4">
                {/* Top Metadata Row */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-mono-code font-semibold px-2.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--accent-secondary-soft)',
                      color: 'var(--accent-secondary)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    {item.fileName}
                  </span>
                </div>

                {/* Title & Policy */}
                <div>
                  <h3
                    className="text-xl font-bold font-serif-library"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs font-mono-code mt-1"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {item.policyTag}
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.summary}
                </p>

                {/* References & Empty Invariant Box */}
                <div
                  className="p-3 rounded-lg flex flex-col gap-2 text-xs font-mono-code"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>
                      Referências (Ponteiros):
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-1.5 py-0.5 rounded border font-semibold"
                        style={{
                          backgroundColor: 'var(--ptr-frente-bg)',
                          color: 'var(--ptr-frente-text)',
                          borderColor: 'var(--ptr-frente-border)',
                        }}
                      >
                        {ptrA}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded border font-semibold"
                        style={{
                          backgroundColor: 'var(--ptr-tras-bg)',
                          color: 'var(--ptr-tras-text)',
                          borderColor: 'var(--ptr-tras-border)',
                        }}
                      >
                        {ptrB}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>
                      Condição vazia:
                    </span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {item.emptyInvariantText}
                    </strong>
                  </div>
                </div>

                {/* Operations & Complexity List */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-[11px] font-mono-code uppercase tracking-wider font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Operações e Complexidade:
                  </span>
                  <div className="flex flex-col gap-1">
                    {item.operationsComplexity.map((op) => (
                      <div
                        key={op.name}
                        className="flex items-center justify-between text-xs font-mono-code px-2.5 py-1 rounded"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        <code
                          style={{
                            color: op.theoretical
                              ? 'var(--text-secondary)'
                              : 'var(--text-primary)',
                          }}
                        >
                          {op.name}
                        </code>
                        <span
                          className="font-bold px-1.5 py-0.5 rounded text-[11px]"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            color:
                              op.complexity === 'O(1)'
                                ? 'var(--accent-secondary)'
                                : 'var(--accent-primary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {op.complexity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectStructure(item.id)}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                }}
              >
                <span>Abrir {item.title}</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
