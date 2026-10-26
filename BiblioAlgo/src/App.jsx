import React from 'react';
import CodeViewer from './components/CodeViewer';
import QueueVisualizer from './components/QueueVisualizer';
import ControlsBar from './components/ControlsBar';
import StepExplanation from './components/StepExplanation';
import ThemeToggle from './components/ThemeToggle';
import { useQueueSimulation } from './hooks/useQueueSimulation';

export default function App() {
  const {
    steps,
    currentStepIndex,
    currentStep,
    activeMethod,
    isPlaying,
    playbackSpeed,
    isLoading,
    errorStatus,
    enqueue,
    dequeue,
    peek,
    checkEmpty,
    reset,
    nextStep,
    prevStep,
    firstStep,
    lastStep,
    goToStep,
    togglePlay,
    setPlaybackSpeed,
  } = useQueueSimulation();

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Library Catalog Header */}
      <header
        className="sticky top-0 z-20"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-serif-library font-bold text-lg shrink-0"
              style={{
                backgroundColor: 'var(--accent-primary-soft)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-strong)',
              }}
              aria-hidden="true"
            >
              📖
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-serif-library tracking-tight">
                  BiblioAlgo
                </h1>
                <span
                  className="text-xs font-mono-code px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  Acervo AED • Fila Encadeada
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Caderno interativo de algoritmos: execute operações e acompanhe o efeito de cada linha na memória
              </p>
            </div>
          </div>

          {/* Right Controls: Theme Toggle + Execution Mode Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: errorStatus
                    ? 'var(--ptr-novo-border)'
                    : 'var(--ptr-tras-border)',
                }}
              />
              <span>
                {errorStatus ? 'Simulador Integrado' : 'Servidor Java (:8080)'}
              </span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Study Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Workbench Controls (Operations + Stepper) */}
        <ControlsBar
          onEnqueue={enqueue}
          onDequeue={dequeue}
          onPeek={peek}
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

        {/* Open-Book Two-Column Study Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Page: Current Step Note + Memory Diagram (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5 min-h-[480px]">
            <StepExplanation
              step={currentStep}
              stepIndex={currentStepIndex}
              totalSteps={steps.length}
            />

            <div className="flex-1 min-h-[340px]">
              <QueueVisualizer step={currentStep} />
            </div>
          </div>

          {/* Right Page: Source Code Listing (5 cols) */}
          <div className="lg:col-span-5 h-[500px] lg:h-auto min-h-[480px]">
            <CodeViewer
              currentLineNumber={currentStep?.lineNumber || 0}
              activeMethod={activeMethod}
            />
          </div>
        </div>

        {/* Library Reference Index Cards (Fichário Conceitual) */}
        <section
          aria-label="Fichas de Referência Conceitual"
          className="pt-4"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-mono-code uppercase tracking-wider font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              Fichário de Revisão Rápida
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <article
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
                Ficha I • Estrutura
              </div>
              <h3 className="font-serif-library font-bold text-sm mb-1.5">
                Célula Sentinela (Cabeça)
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Permanece fixa no início da fila com{' '}
                <code className="font-mono-code font-semibold">item = null</code>.
                Elimina casos especiais de ponteiro nulo ao inserir o primeiro elemento
                ou remover elementos iniciais.
              </p>
            </article>

            <article
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
                Ficha II • Invariantes
              </div>
              <h3 className="font-serif-library font-bold text-sm mb-1.5">
                Ponteiros Frente e Trás
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                <strong style={{ color: 'var(--ptr-frente-text)' }}>frente</strong>{' '}
                referencia a sentinela;{' '}
                <strong style={{ color: 'var(--ptr-tras-text)' }}>tras</strong>{' '}
                referencia o último nó. O primeiro item útil está sempre em{' '}
                <code className="font-mono-code font-semibold">
                  frente.getProximo()
                </code>
                , e a fila está vazia se e somente se{' '}
                <code className="font-mono-code font-semibold">frente == tras</code>.
              </p>
            </article>

            <article
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
                Ficha III • Desempenho
              </div>
              <h3 className="font-serif-library font-bold text-sm mb-1.5">
                Complexidade Constante O(1)
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Sem necessidade de percorrer a lista, todas as operações do TAD (
                <code className="font-mono-code font-semibold">enfileirar</code>,{' '}
                <code className="font-mono-code font-semibold">desenfileirar</code>,{' '}
                <code className="font-mono-code font-semibold">
                  consultarPrimeiro
                </code>{' '}
                e <code className="font-mono-code font-semibold">vazia</code>)
                executam em tempo constante <strong>O(1)</strong>.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* Minimalist Library Footer */}
      <footer
        className="py-4 text-center text-xs"
        style={{
          borderTop: '1px solid var(--border-primary)',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        BiblioAlgo — Biblioteca Didática de Algoritmos e Estruturas de Dados
      </footer>
    </div>
  );
}
