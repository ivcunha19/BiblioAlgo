import React, { useState } from 'react';

export default function ControlsBar({
  structureType = 'fila',
  activeElementCount = 0,
  onEnqueue,
  onDequeue,
  onPeek,
  onPush,
  onPop,
  onPeekTop,
  onInsertAt,
  onRemoveAt,
  onCheckEmpty,
  onReset,
  currentStepIndex,
  totalSteps,
  onPrevStep,
  onNextStep,
  onFirstStep,
  onLastStep,
  onGoToStep,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  isLoading,
  activeMethod,
}) {
  const [inputValue, setInputValue] = useState('');
  const [positionValue, setPositionValue] = useState('0');

  const getNextItemValue = () =>
    inputValue.trim() || String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const handlePrimarySubmit = (e) => {
    e.preventDefault();
    const val = getNextItemValue();

    if (structureType === 'pilha') {
      onPush(val);
    } else if (structureType === 'lista') {
      const pos = positionValue === '' ? 0 : Number(positionValue);
      onInsertAt(val, pos);
    } else {
      onEnqueue(val);
    }
    setInputValue('');
  };

  const handleListRemove = () => {
    const pos = positionValue === '' ? 0 : Number(positionValue);
    onRemoveAt(pos);
  };

  const resetLabel =
    structureType === 'pilha'
      ? '↺ Reiniciar Pilha'
      : structureType === 'lista'
      ? '↺ Reiniciar Lista'
      : '↺ Reiniciar Fila';

  return (
    <section
      aria-label="Controles de Operação e Execução"
      className="rounded-xl p-4 sm:p-5 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Top Row: TAD Operations */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider mr-1"
            style={{ color: 'var(--text-muted)' }}
          >
            1. Operações:
          </span>

          <form
            onSubmit={handlePrimarySubmit}
            className="flex flex-wrap items-center gap-2"
          >
            <label htmlFor="structure-item-input" className="sr-only">
              Valor do item
            </label>
            <input
              id="structure-item-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Valor (ex: A, 42)"
              maxLength={12}
              className="w-32 sm:w-36 px-3 py-1.5 text-sm rounded-lg font-mono-code focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            />

            {structureType === 'lista' && (
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="structure-pos-input"
                  className="text-xs font-mono-code"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  pos:
                </label>
                <input
                  id="structure-pos-input"
                  type="number"
                  value={positionValue}
                  onChange={(e) => setPositionValue(e.target.value)}
                  placeholder="0"
                  className="w-16 px-2.5 py-1.5 text-sm rounded-lg font-mono-code text-center focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                  title={`Posição na lista (inserção válida: 0 até ${activeElementCount})`}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="px-3.5 py-1.5 text-sm font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                border: '1px solid transparent',
              }}
              title={
                structureType === 'pilha'
                  ? 'Executar empilhar(E item)'
                  : structureType === 'lista'
                  ? 'Executar inserir(E novo, int posicao)'
                  : 'Executar enfileirar(E item)'
              }
            >
              {structureType === 'pilha'
                ? '+ Empilhar'
                : structureType === 'lista'
                ? '+ Inserir na Posição'
                : '+ Enfileirar'}
            </button>
          </form>

          {/* Secondary Structure-Specific Buttons */}
          {structureType === 'fila' && (
            <>
              <button
                type="button"
                onClick={onDequeue}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                }}
                title="Executar desenfileirar()"
              >
                − Desenfileirar
              </button>

              <button
                type="button"
                onClick={onPeek}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
                title="Executar consultarPrimeiro()"
              >
                Consultar Primeiro
              </button>
            </>
          )}

          {structureType === 'pilha' && (
            <>
              <button
                type="button"
                onClick={onPop}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                }}
                title="Executar desempilhar()"
              >
                − Desempilhar
              </button>

              <button
                type="button"
                onClick={onPeekTop}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
                title="Executar consultarTopo()"
              >
                Consultar Topo
              </button>
            </>
          )}

          {structureType === 'lista' && (
            <button
              type="button"
              onClick={handleListRemove}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
              }}
              title="Executar remover(int posicao) usando a posição informada"
            >
              − Remover da Posição ({positionValue || 0})
            </button>
          )}

          <button
            type="button"
            onClick={onCheckEmpty}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
            title="Executar vazia()"
          >
            Verificar Vazia
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
          }}
          title="Reiniciar a estrutura para o estado inicial (apenas célula sentinela)"
        >
          {resetLabel}
        </button>
      </div>

      {/* Bottom Row: Step-by-Step Study Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider mr-1"
            style={{ color: 'var(--text-muted)' }}
          >
            2. Leitura:
          </span>

          <div
            className="inline-flex items-center rounded-lg p-0.5 gap-0.5"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <button
              type="button"
              onClick={onFirstStep}
              disabled={currentStepIndex <= 0 || isLoading}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Ir para o primeiro passo"
              aria-label="Primeiro passo"
            >
              |◀
            </button>

            <button
              type="button"
              onClick={onPrevStep}
              disabled={currentStepIndex <= 0 || isLoading}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Passo anterior"
            >
              ◀ Anterior
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              disabled={totalSteps <= 1 || isLoading}
              className="px-3.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isPlaying
                  ? 'var(--highlight-line-border)'
                  : 'var(--accent-secondary)',
                color: '#ffffff',
              }}
            >
              {isPlaying ? '⏸ Pausar' : '▶ Reproduzir'}
            </button>

            <button
              type="button"
              onClick={onNextStep}
              disabled={currentStepIndex >= totalSteps - 1 || isLoading}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Próximo passo"
            >
              Próximo ▶
            </button>

            <button
              type="button"
              onClick={onLastStep}
              disabled={currentStepIndex >= totalSteps - 1 || isLoading}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Ir para o último passo"
              aria-label="Último passo"
            >
              ▶|
            </button>
          </div>
        </div>

        {/* Interactive Step Track + Speed */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {totalSteps > 0 && (
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label="Progresso dos passos"
            >
              <span
                className="font-mono-code"
                style={{ color: 'var(--text-secondary)' }}
              >
                Passo{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {currentStepIndex + 1}
                </strong>{' '}
                de {totalSteps}
              </span>
              <div className="flex items-center gap-1 ml-1">
                {Array.from({ length: totalSteps }).map((_, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isPast = idx < currentStepIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onGoToStep && onGoToStep(idx)}
                      aria-label={`Ir para o passo ${idx + 1}`}
                      aria-current={isCurrent ? 'step' : undefined}
                      className="h-2.5 rounded-full transition-all cursor-pointer"
                      style={{
                        width: isCurrent ? '1.5rem' : '0.625rem',
                        backgroundColor: isCurrent
                          ? 'var(--accent-primary)'
                          : isPast
                          ? 'var(--border-strong)'
                          : 'var(--border-primary)',
                      }}
                      title={`Passo ${idx + 1} (${activeMethod})`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <label
              htmlFor="playback-speed-select"
              style={{ color: 'var(--text-muted)' }}
            >
              Ritmo:
            </label>
            <select
              id="playback-speed-select"
              value={playbackSpeed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="text-xs rounded-md px-2 py-1 font-mono-code focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              <option value={2000}>0.5x (Estudo detalhado)</option>
              <option value={1200}>1.0x (Leitura normal)</option>
              <option value={600}>2.0x (Revisão rápida)</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
