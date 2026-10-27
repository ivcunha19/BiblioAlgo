import React, { useState } from 'react';
import { PRESET_ARRAYS } from '../hooks/useSortingSimulation';

export default function SortingControlsBar({
  inputArray = [],
  onApplyCustomArray,
  onGenerateRandomArray,
  onReset,
  currentStepIndex,
  totalSteps,
  onPrevStep,
  onNextStep,
  onFirstStep,
  onLastStep,
  iterations = [],
  currentIterationIndex = 0,
  onPrevIteration,
  onNextIteration,
  onGoToIteration,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
}) {
  const [arrayText, setArrayText] = useState(inputArray.join(', '));
  const [inputError, setInputError] = useState('');

  const handleSelectPreset = (arr) => {
    setArrayText(arr.join(', '));
    setInputError('');
    onApplyCustomArray(arr, false);
  };

  const handleGenerateRandom = () => {
    const newArr = onGenerateRandomArray(6);
    if (Array.isArray(newArr)) {
      setArrayText(newArr.join(', '));
    }
    setInputError('');
  };

  const handleArraySubmit = (e) => {
    e.preventDefault();
    const parsed = arrayText
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);

    if (parsed.length < 2 || parsed.length > 12 || parsed.some(Number.isNaN)) {
      setInputError('Informe de 2 a 12 números inteiros separados por vírgula.');
      return;
    }
    setInputError('');
    onApplyCustomArray(parsed, false);
  };

  return (
    <section
      aria-label="Controles do Método de Ordenação"
      className="rounded-xl p-4 sm:p-5 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Row 1: Array Input & Presets */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider mr-1"
            style={{ color: 'var(--text-muted)' }}
          >
            1. Vetor de Entrada:
          </span>

          <form
            onSubmit={handleArraySubmit}
            className="flex flex-wrap items-center gap-2"
          >
            <label htmlFor="sorting-array-input" className="sr-only">
              Elementos do vetor separados por vírgula
            </label>
            <input
              id="sorting-array-input"
              type="text"
              value={arrayText}
              onChange={(e) => setArrayText(e.target.value)}
              placeholder="Ex: 38, 27, 43, 10, 82, 9"
              className="w-52 sm:w-64 px-3 py-1.5 text-sm rounded-lg font-mono-code focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
              }}
            >
              Aplicar Vetor
            </button>
          </form>

          {/* Preset Scenarios */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleGenerateRandom}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
              }}
              title="Gerar um novo vetor aleatório com 6 elementos"
            >
              🎲 Aleatório
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset(PRESET_ARRAYS.quaseOrdenado)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              }}
              title="Carregar vetor quase ordenado (ótimo para testar Insertionsort)"
            >
              Quase Ordenado
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset(PRESET_ARRAYS.inverso)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              }}
              title="Carregar vetor em ordem decrescente (pior caso clássico)"
            >
              Ordem Inversa
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset(PRESET_ARRAYS.repetidos)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              }}
              title="Carregar vetor com chaves duplicadas"
            >
              Com Repetidos
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
          }}
          title="Voltar ao passo inicial da ordenação"
        >
          ↺ Reiniciar Ordenação
        </button>
      </div>

      {inputError && (
        <p
          className="text-xs font-mono-code -mt-2"
          style={{ color: 'var(--danger-text)' }}
        >
          {inputError}
        </p>
      )}

      {/* Row 2: Iteration Control Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-3"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider mr-1"
            style={{ color: 'var(--text-muted)' }}
          >
            2. Controle por Iteração:
          </span>

          <div
            className="inline-flex items-center rounded-lg p-0.5 gap-1"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <button
              type="button"
              onClick={onPrevIteration}
              disabled={currentStepIndex <= 0}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Voltar ao início da iteração atual ou anterior"
            >
              ⏮ Iteração Anterior
            </button>

            <select
              aria-label="Selecionar iteração"
              value={currentIterationIndex}
              onChange={(e) => onGoToIteration(Number(e.target.value))}
              className="text-xs font-mono-code font-semibold px-2.5 py-1 rounded-md focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              {iterations.map((it, idx) => (
                <option key={it.id} value={idx}>
                  [{idx + 1}/{iterations.length}] {it.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onNextIteration}
              disabled={currentStepIndex >= totalSteps - 1}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Avançar para a próxima iteração do método"
            >
              Próxima Iteração ⏭
            </button>
          </div>
        </div>

        {/* Clickable Iteration Chips */}
        <div className="flex flex-wrap items-center gap-1">
          {iterations.map((it, idx) => {
            const isCurrent = idx === currentIterationIndex;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onGoToIteration(idx)}
                className="px-2 py-0.5 text-[11px] font-mono-code rounded transition cursor-pointer"
                style={{
                  backgroundColor: isCurrent
                    ? 'var(--accent-secondary)'
                    : 'var(--bg-elevated)',
                  color: isCurrent ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                  fontWeight: isCurrent ? 700 : 500,
                }}
                title={`Ir para ${it.label} (passo ${it.startStepIndex + 1})`}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Fine-Grained Step-by-Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider mr-1"
            style={{ color: 'var(--text-muted)' }}
          >
            3. Passo a Passo:
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
              disabled={currentStepIndex <= 0}
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
              disabled={currentStepIndex <= 0}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Passo anterior"
            >
              ◀ Anterior
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              disabled={totalSteps <= 1}
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
              disabled={currentStepIndex >= totalSteps - 1}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Próximo passo"
            >
              Próximo ▶
            </button>

            <button
              type="button"
              onClick={onLastStep}
              disabled={currentStepIndex >= totalSteps - 1}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
              title="Ir para o último passo"
              aria-label="Último passo"
            >
              ▶|
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
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

          <div className="flex items-center gap-1.5">
            <label
              htmlFor="sort-playback-speed"
              style={{ color: 'var(--text-muted)' }}
            >
              Ritmo:
            </label>
            <select
              id="sort-playback-speed"
              value={playbackSpeed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="text-xs rounded-md px-2 py-1 font-mono-code focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              <option value={1600}>0.5x (Estudo detalhado)</option>
              <option value={950}>1.0x (Leitura normal)</option>
              <option value={450}>2.0x (Rápido)</option>
              <option value={200}>4.0x (Super rápido)</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
