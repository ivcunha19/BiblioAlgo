import React from 'react';
import CodeViewer from './components/CodeViewer';
import QueueVisualizer from './components/QueueVisualizer';
import ControlsBar from './components/ControlsBar';
import StepExplanation from './components/StepExplanation';
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
    togglePlay,
    setPlaybackSpeed,
  } = useQueueSimulation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 text-white">
              BA
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                BiblioAlgo
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Fila Encadeada
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Visualização interativa da execução linha a linha (Código da Professora)
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-3 text-xs">
            {errorStatus ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Backend offline (Modo Demonstração)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Backend Conectado (:8080)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Controls Bar (Operations + Stepper) */}
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
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
          isLoading={isLoading}
        />

        {/* Workspace: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Visualizer + Explanation (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5 min-h-[500px]">
            {/* Step Explanation Banner */}
            <StepExplanation step={currentStep} />

            {/* Visualizer Area */}
            <div className="flex-1 min-h-[360px]">
              <QueueVisualizer step={currentStep} />
            </div>
          </div>

          {/* Right Column: Java Code Panel (5 cols) */}
          <div className="lg:col-span-5 h-[500px] lg:h-auto min-h-[500px]">
            <CodeViewer
              currentLineNumber={currentStep?.lineNumber || 0}
              activeMethod={activeMethod}
            />
          </div>
        </div>

        {/* Explanatory Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <span>⚓</span> Nó Sentinela (Cabeça)
            </h3>
            <p className="text-slate-400 leading-relaxed">
              A célula sentinela existe permanentemente no início da fila com <code className="text-slate-300">item = null</code>. Ela simplifica inserções e remoções eliminando verificações de ponteiro nulo para <code className="text-slate-300">frente</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <span>🔵</span> Ponteiros Frente e Trás
            </h3>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-blue-400">frente</strong> sempre aponta para a sentinela. <strong className="text-emerald-400">tras</strong> aponta para a última célula inserida. Se <code className="text-slate-300">frente == tras</code>, a fila está vazia.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <span>⚡</span> Complexidade das Operações
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Graças ao nó sentinela e aos ponteiros diretos de início e fim, todas as operações básicas (<code className="text-indigo-300">enfileirar</code>, <code className="text-indigo-300">desenfileirar</code>, <code className="text-indigo-300">consultarPrimeiro</code>, <code className="text-indigo-300">vazia</code>) rodam em tempo constante <strong>O(1)</strong>.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        BiblioAlgo — Visualizador Didático de Algoritmos e Estruturas de Dados
      </footer>
    </div>
  );
}
