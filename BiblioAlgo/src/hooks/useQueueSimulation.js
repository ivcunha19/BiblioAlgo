import { useState, useEffect, useRef, useCallback } from 'react';

export function useQueueSimulation() {
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeMethod, setActiveMethod] = useState('construtor');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1200);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const timerRef = useRef(null);

  // Fallback initial state if backend isn't started yet
  const getInitialFallbackTrace = () => ({
    method: 'construtor',
    steps: [
      {
        stepIndex: 0,
        lineNumber: 13,
        codeLine: 'frente = tras = sentinela;',
        method: 'construtor',
        description:
          'Fila inicializada. Apenas a célula sentinela existe na memória; "frente" e "tras" apontam para ela.',
        nodes: [
          {
            id: 'sentinela',
            valor: null,
            proximoId: null,
            sentinela: true,
            novo: false,
            removido: false,
          },
        ],
        pointers: [
          { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo', cor: '#3b82f6' },
          { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo', cor: '#10b981' },
        ],
        variables: {},
      },
    ],
  });

  const loadTrace = (trace) => {
    if (trace && trace.steps && trace.steps.length > 0) {
      setSteps(trace.steps);
      setCurrentStepIndex(0);
      setActiveMethod(trace.method || trace.steps[0].method);
      setIsPlaying(false);
    }
  };

  // Initial load
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/fila/estado');
        if (!res.ok) throw new Error('API não respondeu');
        const data = await res.json();
        loadTrace(data);
        setErrorStatus(null);
      } catch (err) {
        console.warn('Backend ainda não disponível ou offline, usando fallback local:', err);
        setErrorStatus('Conexão com o backend em espera. Usando simulação inicial.');
        loadTrace(getInitialFallbackTrace());
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Automatic playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const executeApi = async (endpoint, method = 'POST', body = null) => {
    setIsLoading(true);
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(endpoint, options);
      if (!res.ok) throw new Error(`Falha na requisição: ${res.statusText}`);
      const trace = await res.json();
      loadTrace(trace);
      setErrorStatus(null);
      return trace;
    } catch (err) {
      console.error(err);
      setErrorStatus(`Erro ao conectar ao backend: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const enqueue = useCallback((item) => {
    return executeApi('/api/fila/enfileirar', 'POST', { item });
  }, []);

  const dequeue = useCallback(() => {
    return executeApi('/api/fila/desenfileirar', 'POST');
  }, []);

  const peek = useCallback(() => {
    return executeApi('/api/fila/consultar', 'GET');
  }, []);

  const checkEmpty = useCallback(() => {
    return executeApi('/api/fila/vazia', 'GET');
  }, []);

  const reset = useCallback(() => {
    return executeApi('/api/fila/reset', 'POST');
  }, []);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const firstStep = () => setCurrentStepIndex(0);
  const lastStep = () => setCurrentStepIndex(Math.max(0, steps.length - 1));
  const togglePlay = () => setIsPlaying((prev) => !prev);

  const currentStep = steps[currentStepIndex] || null;

  return {
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
  };
}
