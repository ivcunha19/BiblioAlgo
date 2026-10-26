import { useState, useEffect, useRef, useCallback } from 'react';

const cloneNodes = (nodes) => nodes.map((n) => ({ ...n, novo: false, removido: false }));

function buildLocalResetTrace() {
  const sentinela = {
    id: 'sentinela',
    valor: null,
    proximoId: null,
    sentinela: true,
    novo: false,
    removido: false,
  };
  return {
    method: 'construtor',
    steps: [
      {
        stepIndex: 0,
        lineNumber: 12,
        codeLine: 'Celula<E> sentinela = new Celula<E>();',
        method: 'construtor',
        description:
          'Aloca a célula sentinela (cabeça) na memória com item = null e proximo = null.',
        nodes: [{ ...sentinela, novo: true }],
        pointers: [{ nome: 'novaCelula', targetNodeId: 'sentinela', tipo: 'local' }],
        variables: { sentinela: '#sentinela' },
      },
      {
        stepIndex: 1,
        lineNumber: 13,
        codeLine: 'frente = tras = sentinela;',
        method: 'construtor',
        description:
          'Fila inicializada. Os ponteiros "frente" e "tras" apontam ambos para a célula sentinela (invariante de fila vazia: frente == tras).',
        nodes: [sentinela],
        pointers: [
          { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo', cor: '#3b82f6' },
          { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo', cor: '#10b981' },
        ],
        variables: {},
      },
    ],
  };
}

export function useQueueSimulation() {
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeMethod, setActiveMethod] = useState('construtor');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1200);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const timerRef = useRef(null);
  const localQueueRef = useRef([
    {
      id: 'sentinela',
      valor: null,
      proximoId: null,
      sentinela: true,
      novo: false,
      removido: false,
    },
  ]);
  const nextIdCounterRef = useRef(1);

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
      } catch {
        setErrorStatus('Modo Estudo Local (Backend offline)');
        loadTrace(buildLocalResetTrace());
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
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const simulateLocalOperation = useCallback((op, payload) => {
    const baseNodes = cloneNodes(localQueueRef.current);
    const lastNode = baseNodes[baseNodes.length - 1];
    const isEmpty = baseNodes.length === 1;

    if (op === 'reset') {
      nextIdCounterRef.current = 1;
      const trace = buildLocalResetTrace();
      localQueueRef.current = cloneNodes(trace.steps[trace.steps.length - 1].nodes);
      return trace;
    }

    if (op === 'vazia') {
      return {
        method: 'vazia',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 16,
            codeLine: 'public boolean vazia() {',
            method: 'vazia',
            description: 'Inicia a verificação se a fila encontra-se vazia.',
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
            ],
            variables: {},
          },
          {
            stepIndex: 1,
            lineNumber: 18,
            codeLine: 'return (frente == tras);',
            method: 'vazia',
            description: isEmpty
              ? 'Como "frente" e "tras" apontam ambos para a sentinela, retorna true (fila vazia).'
              : `Como "frente" (#sentinela) é diferente de "tras" (#${lastNode.id}), retorna false (a fila possui elementos).`,
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
            ],
            variables: { 'frente == tras': isEmpty },
            returnValue: isEmpty,
          },
        ],
      };
    }

    if (op === 'consultar') {
      if (isEmpty) {
        return {
          method: 'consultarPrimeiro',
          steps: [
            {
              stepIndex: 0,
              lineNumber: 50,
              codeLine: 'if (vazia()) {',
              method: 'consultarPrimeiro',
              description:
                'Verifica se a fila está vazia antes de acessar a célula seguinte à sentinela.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: { 'vazia()': true },
            },
            {
              stepIndex: 1,
              lineNumber: 51,
              codeLine: 'throw new NoSuchElementException("Nao há nenhum item na fila!");',
              method: 'consultarPrimeiro',
              description:
                'Como frente == tras, não há primeiro elemento útil. Lança NoSuchElementException.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: {},
              erro: true,
              mensagemErro: 'NoSuchElementException: Não há nenhum item na fila!',
            },
          ],
        };
      }

      const firstDataNode = baseNodes[1];
      return {
        method: 'consultarPrimeiro',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 50,
            codeLine: 'if (vazia()) {',
            method: 'consultarPrimeiro',
            description:
              'Verifica se a fila está vazia. Como "frente != tras", prossegue para a leitura.',
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
            ],
            variables: { 'vazia()': false },
          },
          {
            stepIndex: 1,
            lineNumber: 54,
            codeLine: 'return frente.getProximo().getItem();',
            method: 'consultarPrimeiro',
            description: `Acessa a célula após a sentinela (#${firstDataNode.id}) e retorna seu item "${firstDataNode.valor}" sem removê-la.`,
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'primeiro', targetNodeId: firstDataNode.id, tipo: 'local' },
              { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
            ],
            variables: { 'frente.proximo': `#${firstDataNode.id}` },
            returnValue: firstDataNode.valor,
          },
        ],
      };
    }

    if (op === 'enfileirar') {
      const newId = `c${nextIdCounterRef.current++}`;
      const newNode = {
        id: newId,
        valor: payload.item,
        proximoId: null,
        sentinela: false,
        novo: true,
        removido: false,
      };

      const step1Nodes = [...cloneNodes(baseNodes), { ...newNode }];
      const step2Nodes = cloneNodes(baseNodes).map((n) =>
        n.id === lastNode.id ? { ...n, proximoId: newId } : n
      );
      step2Nodes.push({ ...newNode });

      const step3Nodes = step2Nodes.map((n) => ({ ...n, novo: false }));
      localQueueRef.current = cloneNodes(step3Nodes);

      return {
        method: 'enfileirar',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 23,
            codeLine: 'Celula<E> novaCelula = new Celula<E>(item);',
            method: 'enfileirar',
            description: `Aloca uma nova célula (#${newId}) no heap contendo o valor "${payload.item}" e proximo = null.`,
            nodes: step1Nodes,
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
              { nome: 'novaCelula', targetNodeId: newId, tipo: 'local' },
            ],
            variables: { item: payload.item, novaCelula: `#${newId}` },
          },
          {
            stepIndex: 1,
            lineNumber: 25,
            codeLine: 'tras.setProximo(novaCelula);',
            method: 'enfileirar',
            description: `Encadeia a nova célula ao final da fila: o campo "proximo" de #${lastNode.id} passa a apontar para #${newId}.`,
            nodes: step2Nodes,
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
              { nome: 'novaCelula', targetNodeId: newId, tipo: 'local' },
            ],
            variables: { item: payload.item, 'tras.proximo': `#${newId}` },
          },
          {
            stepIndex: 2,
            lineNumber: 26,
            codeLine: 'tras = tras.getProximo();',
            method: 'enfileirar',
            description: `Avança o ponteiro "tras" para a nova última célula (#${newId}). Inserção concluída em O(1).`,
            nodes: step3Nodes,
            pointers: [
              { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'tras', targetNodeId: newId, tipo: 'atributo' },
            ],
            variables: { item: payload.item, tras: `#${newId}` },
          },
        ],
      };
    }

    if (op === 'desenfileirar') {
      if (isEmpty) {
        return {
          method: 'desenfileirar',
          steps: [
            {
              stepIndex: 0,
              lineNumber: 34,
              codeLine: 'item = consultarPrimeiro();',
              method: 'desenfileirar',
              description:
                'Chama consultarPrimeiro() para obter o elemento na frente da fila antes de remover.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: { item: null },
            },
            {
              stepIndex: 1,
              lineNumber: 51,
              codeLine: 'throw new NoSuchElementException("Nao há nenhum item na fila!");',
              method: 'desenfileirar',
              description:
                'Fila vazia (frente == tras)! Não é possível desenfileirar. Uma NoSuchElementException é lançada.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: {},
              erro: true,
              mensagemErro: 'NoSuchElementException: Não há nenhum item na fila!',
            },
          ],
        };
      }

      const firstNode = baseNodes[1];
      const nextAfterFirst = baseNodes[2] || null;
      const wasOnlyElement = baseNodes.length === 2;

      const step1Nodes = cloneNodes(baseNodes);
      const step2Nodes = cloneNodes(baseNodes);
      const step3Nodes = cloneNodes(baseNodes).map((n) => {
        if (n.id === 'sentinela') {
          return { ...n, proximoId: nextAfterFirst ? nextAfterFirst.id : null };
        }
        if (n.id === firstNode.id) {
          return { ...n, removido: true };
        }
        return n;
      });
      const step4Nodes = step3Nodes.map((n) =>
        n.id === firstNode.id ? { ...n, proximoId: null, removido: true } : n
      );
      const finalNodes = cloneNodes(baseNodes)
        .filter((n) => n.id !== firstNode.id)
        .map((n) =>
          n.id === 'sentinela'
            ? { ...n, proximoId: nextAfterFirst ? nextAfterFirst.id : null }
            : n
        );

      localQueueRef.current = cloneNodes(finalNodes);

      const traceSteps = [
        {
          stepIndex: 0,
          lineNumber: 34,
          codeLine: 'item = consultarPrimeiro();',
          method: 'desenfileirar',
          description: `Obtém o valor da primeira célula útil (#${firstNode.id}): item = "${firstNode.valor}".`,
          nodes: step1Nodes,
          pointers: [
            { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: { item: firstNode.valor },
        },
        {
          stepIndex: 1,
          lineNumber: 36,
          codeLine: 'primeiro = frente.getProximo();',
          method: 'desenfileirar',
          description: `O ponteiro local "primeiro" guarda a referência para a célula #${firstNode.id} que será removida.`,
          nodes: step2Nodes,
          pointers: [
            { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'primeiro', targetNodeId: firstNode.id, tipo: 'local' },
            { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: { item: firstNode.valor, primeiro: `#${firstNode.id}` },
        },
        {
          stepIndex: 2,
          lineNumber: 37,
          codeLine: 'frente.setProximo(primeiro.getProximo());',
          method: 'desenfileirar',
          description: nextAfterFirst
            ? `A sentinela passa a apontar diretamente para #${nextAfterFirst.id}, contornando #${firstNode.id}.`
            : `A sentinela passa a apontar para null, pois #${firstNode.id} era o único item da fila.`,
          nodes: step3Nodes,
          pointers: [
            { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'primeiro', targetNodeId: firstNode.id, tipo: 'local' },
            { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: {
            item: firstNode.valor,
            primeiro: `#${firstNode.id}`,
            'frente.proximo': nextAfterFirst ? `#${nextAfterFirst.id}` : 'null',
          },
        },
        {
          stepIndex: 3,
          lineNumber: 39,
          codeLine: 'primeiro.setProximo(null);',
          method: 'desenfileirar',
          description: `Isola completamente a célula removida (#${firstNode.id}) definindo seu ponteiro proximo como null.`,
          nodes: step4Nodes,
          pointers: [
            { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'primeiro', targetNodeId: firstNode.id, tipo: 'local' },
            { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: { item: firstNode.valor, 'primeiro.proximo': 'null' },
        },
        {
          stepIndex: 4,
          lineNumber: 42,
          codeLine: 'if (primeiro == tras)',
          method: 'desenfileirar',
          description: wasOnlyElement
            ? `Verifica se a célula removida era a última da fila: verdadeiro (#${firstNode.id} == tras).`
            : `Verifica se a célula removida era a última da fila: falso (#${firstNode.id} != #${lastNode.id}).`,
          nodes: step4Nodes,
          pointers: [
            { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'primeiro', targetNodeId: firstNode.id, tipo: 'local' },
            { nome: 'tras', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: { item: firstNode.valor, 'primeiro == tras': wasOnlyElement },
        },
      ];

      if (wasOnlyElement) {
        traceSteps.push({
          stepIndex: 5,
          lineNumber: 43,
          codeLine: 'tras = frente;',
          method: 'desenfileirar',
          description:
            'Como o último item foi removido, "tras" retorna para a célula sentinela (frente), restaurando o estado de fila vazia.',
          nodes: step4Nodes,
          pointers: [
            { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'primeiro', targetNodeId: firstNode.id, tipo: 'local' },
          ],
          variables: { item: firstNode.valor, tras: '#sentinela' },
        });
      }

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 45,
        codeLine: 'return item;',
        method: 'desenfileirar',
        description: `Retorna o item removido "${firstNode.valor}". A célula #${firstNode.id} é coletada pelo Garbage Collector.`,
        nodes: finalNodes,
        pointers: [
          { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
          {
            nome: 'tras',
            targetNodeId: wasOnlyElement ? 'sentinela' : lastNode.id,
            tipo: 'atributo',
          },
        ],
        variables: { item: firstNode.valor },
        returnValue: firstNode.valor,
      });

      return {
        method: 'desenfileirar',
        steps: traceSteps,
      };
    }

    return buildLocalResetTrace();
  }, []);

  const executeApi = useCallback(
    async (endpoint, method = 'POST', body = null, localOp = 'reset') => {
      setIsLoading(true);
      try {
        const options = {
          method,
          headers: { 'Content-Type': 'application/json' },
        };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(endpoint, options);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const trace = await res.json();
        loadTrace(trace);
        setErrorStatus(null);
        return trace;
      } catch {
        setErrorStatus('Modo Estudo Local (Simulação integrada)');
        const fallbackTrace = simulateLocalOperation(localOp, body);
        loadTrace(fallbackTrace);
        return fallbackTrace;
      } finally {
        setIsLoading(false);
      }
    },
    [simulateLocalOperation]
  );

  const enqueue = useCallback(
    (item) => {
      return executeApi('/api/fila/enfileirar', 'POST', { item }, 'enfileirar');
    },
    [executeApi]
  );

  const dequeue = useCallback(() => {
    return executeApi('/api/fila/desenfileirar', 'POST', null, 'desenfileirar');
  }, [executeApi]);

  const peek = useCallback(() => {
    return executeApi('/api/fila/consultar', 'GET', null, 'consultar');
  }, [executeApi]);

  const checkEmpty = useCallback(() => {
    return executeApi('/api/fila/vazia', 'GET', null, 'vazia');
  }, [executeApi]);

  const reset = useCallback(() => {
    return executeApi('/api/fila/reset', 'POST', null, 'reset');
  }, [executeApi]);

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
  const goToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setIsPlaying(false);
      setCurrentStepIndex(index);
    }
  };
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
    goToStep,
    togglePlay,
    setPlaybackSpeed,
  };
}
