import React, { useState } from 'react';
import CodeViewer from './components/CodeViewer';
import QueueVisualizer from './components/QueueVisualizer';
import ControlsBar from './components/ControlsBar';
import StepExplanation from './components/StepExplanation';
import ThemeToggle from './components/ThemeToggle';
import StructureSelectorHome from './components/StructureSelectorHome';
import { useQueueSimulation } from './hooks/useQueueSimulation';
import { STRUCTURES_CATALOG } from './data/queueCode';
import logoImg from './assets/logo.png';

function StructureWorkspace({ selectedStructure, onBackToHome }) {
  const {
    steps,
    currentStepIndex,
    currentStep,
    activeMethod,
    activeElementCount,
    isPlaying,
    playbackSpeed,
    isLoading,
    enqueue,
    dequeue,
    peek,
    push,
    pop,
    peekTop,
    insertAt,
    removeAt,
    checkEmpty,
    reset,
    nextStep,
    prevStep,
    firstStep,
    lastStep,
    goToStep,
    togglePlay,
    setPlaybackSpeed,
  } = useQueueSimulation(selectedStructure);

  const currentCatalog =
    STRUCTURES_CATALOG[selectedStructure] || STRUCTURES_CATALOG.fila;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
      {/* Structure Title Bar & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)',
            }}
          >
            <span aria-hidden="true">←</span>
            <span>Trocar Estrutura</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold font-serif-library">
              {currentCatalog.title}
            </h2>
            <span
              className="text-xs font-mono-code px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-secondary-soft)',
                color: 'var(--accent-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              {currentCatalog.policyTag}
            </span>
          </div>
        </div>

        <span
          className="text-xs font-mono-code"
          style={{ color: 'var(--text-muted)' }}
        >
          Classe: <strong>{currentCatalog.fileName}</strong>
        </span>
      </div>

      {/* Workbench Controls (Operations + Stepper) */}
      <ControlsBar
        structureType={selectedStructure}
        activeElementCount={activeElementCount}
        onEnqueue={enqueue}
        onDequeue={dequeue}
        onPeek={peek}
        onPush={push}
        onPop={pop}
        onPeekTop={peekTop}
        onInsertAt={insertAt}
        onRemoveAt={removeAt}
        onCheckEmpty={checkEmpty}
        onReset={reset}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        onPrevStep={prevStep}
        onNextStep={nextStep}
        onFirstStep={firstStep}
        onLastStep={lastStep}
        onGoToStep={goToStep}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
        isLoading={isLoading}
        activeMethod={activeMethod}
      />

      {/* Two-Column Study Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Step Explanation + Memory Diagram (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5 min-h-[480px]">
          <StepExplanation
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={steps.length}
          />

          <div className="flex-1 min-h-[340px]">
            <QueueVisualizer
              structureType={selectedStructure}
              step={currentStep}
            />
          </div>
        </div>

        {/* Right Column: Source Code (5 cols) */}
        <div className="lg:col-span-5 h-[500px] lg:h-auto min-h-[480px]">
          <CodeViewer
            structureType={selectedStructure}
            currentLineNumber={currentStep?.lineNumber || 0}
            activeMethod={activeMethod}
          />
        </div>
      </div>

      {/* Conceptual Summary Cards */}
      <section
        aria-label="Resumo Conceitual"
        className="pt-4"
        style={{ borderTop: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-xs font-mono-code uppercase tracking-wider font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            Conceitos Principais — {currentCatalog.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {currentCatalog.cards.map((card) => (
            <article
              key={card.title}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div
                className="font-mono-code text-[11px] uppercase tracking-wider mb-1"
                style={{ color: 'var(--accent-primary)' }}
              >
                {card.tag}
              </div>
              <h3 className="font-serif-library font-bold text-sm mb-1.5">
                {card.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [selectedStructure, setSelectedStructure] = useState(null);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-20"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedStructure(null)}
            className="flex items-center gap-3 text-left cursor-pointer"
            title="Voltar para a página inicial de estruturas"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5 shrink-0"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
              }}
            >
              <img
                src={logoImg}
                alt="Logo BiblioAlgo"
                width="28"
                height="28"
                className="w-7 h-7 object-contain logo-adaptive"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-serif-library tracking-tight">
                BiblioAlgo
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Visualizador Didático de Estruturas de Dados
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content: Home Selection Page OR Selected Structure Workspace */}
      {selectedStructure === null ? (
        <StructureSelectorHome onSelectStructure={setSelectedStructure} />
      ) : (
        <StructureWorkspace
          selectedStructure={selectedStructure}
          onBackToHome={() => setSelectedStructure(null)}
        />
      )}

      {/* Footer */}
      <footer
        className="py-4 px-4 text-xs"
        style={{
          borderTop: '1px solid var(--border-primary)',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <img
            src={logoImg}
            alt=""
            aria-hidden="true"
            width="18"
            height="18"
            className="w-4 h-4 object-contain opacity-75 logo-adaptive"
          />
          <span>BiblioAlgo — Visualizador Didático de Estruturas de Dados</span>
        </div>
      </footer>
    </div>
  );
}
