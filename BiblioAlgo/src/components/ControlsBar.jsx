import React, { useState } from 'react';

export default function ControlsBar({
  onEnqueue,
  onDequeue,
  onPeek,
  onCheckEmpty,
  onReset,
  currentStepIndex,
  totalSteps,
  onPrevStep,
  onNextStep,
  onFirstStep,
  onLastStep,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  isLoading,
}) {
  const [inputValue, setInputValue] = useState('');

  const handleEnqueueSubmit = (e) => {
    e.preventDefault();
    const val = inputValue.trim() || String.fromCharCode(65 + Math.floor(Math.random() * 26));
    onEnqueue(val);
    setInputValue('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      {/* Upper Section: Data Structure Operations */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <form onSubmit={handleEnqueueSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Item (ex: 'X', 10)"
            maxLength={12}
            className="w-32 sm:w-40 px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            + Enfileirar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDequeue}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            - Desenfileirar
          </button>
          <button
            onClick={onPeek}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            👁️ Consultar Primeiro
          </button>
          <button
            onClick={onCheckEmpty}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            ❓ Vazia?
          </button>
          <button
            onClick={onReset}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-400 border border-amber-800/40 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Reiniciar para a fila vazia (somente nó sentinela)"
          >
            🔄 Resetar
          </button>
        </div>
      </div>

      {/* Lower Section: Stepper / Execution Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* First */}
          <button
            onClick={onFirstStep}
            disabled={currentStepIndex <= 0 || isLoading}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Primeiro Passo"
          >
            |◀◀
          </button>

          {/* Prev */}
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex <= 0 || isLoading}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Passo Anterior"
          >
            ◀ Anterior
          </button>

          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            disabled={totalSteps <= 1 || isLoading}
            className={`px-4 py-2 text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <span>{isPlaying ? '⏸ Pausar' : '▶ Reproduzir'}</span>
          </button>

          {/* Next */}
          <button
            onClick={onNextStep}
            disabled={currentStepIndex >= totalSteps - 1 || isLoading}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Próximo Passo"
          >
            Próximo ▶
          </button>

          {/* Last */}
          <button
            onClick={onLastStep}
            disabled={currentStepIndex >= totalSteps - 1 || isLoading}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Último Passo"
          >
            ▶▶|
          </button>
        </div>

        {/* Step Indicator & Speed Slider */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Passo:</span>
            <span className="text-indigo-400 font-bold">
              {totalSteps > 0 ? currentStepIndex + 1 : 0}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-semibold">{totalSteps}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Velocidade:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value={2000}>0.5x (Lento)</option>
              <option value={1200}>1.0x (Normal)</option>
              <option value={600}>2.0x (Rápido)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
