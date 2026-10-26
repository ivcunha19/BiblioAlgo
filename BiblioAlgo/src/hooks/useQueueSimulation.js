import { useState, useEffect, useRef, useCallback } from 'react';

const cloneNodes = (nodes) =>
  nodes.map((n) => ({ ...n, novo: false, removido: false }));

function buildFilaResetTrace() {
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
        lineNumber: 6,
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
        lineNumber: 7,
        codeLine: 'frente = tras = sentinela;',
        method: 'construtor',
        description:
          'Fila inicializada. Os ponteiros "frente" e "tras" apontam ambos para a célula sentinela (invariante de fila vazia: frente == tras).',
        nodes: [sentinela],
        pointers: [
          { nome: 'frente', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'tras', targetNodeId: 'sentinela', tipo: 'atributo' },
        ],
        variables: {},
      },
    ],
  };
}

function buildPilhaResetTrace() {
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
        lineNumber: 6,
        codeLine: 'Celula<E> sentinela = new Celula<E>();',
        method: 'construtor',
        description:
          'Aloca a célula sentinela (fundo da pilha) na memória com item = null e proximo = null.',
        nodes: [{ ...sentinela, novo: true }],
        pointers: [{ nome: 'sentinela', targetNodeId: 'sentinela', tipo: 'local' }],
        variables: { sentinela: '#sentinela' },
      },
      {
        stepIndex: 1,
        lineNumber: 8,
        codeLine: 'topo = sentinela;',
        method: 'construtor',
        description:
          'Pilha inicializada. Os ponteiros "topo" e "fundo" apontam ambos para a célula sentinela (invariante de pilha vazia: fundo == topo).',
        nodes: [sentinela],
        pointers: [
          { nome: 'topo', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
        ],
        variables: {},
      },
    ],
  };
}

function buildListaResetTrace() {
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
        lineNumber: 7,
        codeLine: 'Celula<E> sentinela = new Celula<>();',
        method: 'construtor',
        description:
          'Aloca a célula sentinela (cabeça da lista) na memória com item = null e proximo = null.',
        nodes: [{ ...sentinela, novo: true }],
        pointers: [{ nome: 'sentinela', targetNodeId: 'sentinela', tipo: 'local' }],
        variables: { sentinela: '#sentinela' },
      },
      {
        stepIndex: 1,
        lineNumber: 9,
        codeLine: 'this.tamanho = 0;',
        method: 'construtor',
        description:
          'Lista inicializada. "primeiro" e "ultimo" apontam para a sentinela e o atributo "tamanho" é definido como 0.',
        nodes: [sentinela],
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: 'sentinela', tipo: 'atributo' },
        ],
        variables: { tamanho: 0 },
      },
    ],
  };
}

function buildInitialTraceFor(structureType) {
  if (structureType === 'pilha') return buildPilhaResetTrace();
  if (structureType === 'lista') return buildListaResetTrace();
  return buildFilaResetTrace();
}

export function useQueueSimulation(structureType = 'fila') {
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeMethod, setActiveMethod] = useState('construtor');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1200);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const timerRef = useRef(null);

  const localNodesMapRef = useRef({
    fila: [
      {
        id: 'sentinela',
        valor: null,
        proximoId: null,
        sentinela: true,
        novo: false,
        removido: false,
      },
    ],
    pilha: [
      {
        id: 'sentinela',
        valor: null,
        proximoId: null,
        sentinela: true,
        novo: false,
        removido: false,
      },
    ],
    lista: [
      {
        id: 'sentinela',
        valor: null,
        proximoId: null,
        sentinela: true,
        novo: false,
        removido: false,
      },
    ],
  });

  const countersRef = useRef({ fila: 1, pilha: 1, lista: 1 });

  const loadTrace = useCallback((trace, autoPlay = false) => {
    if (trace && trace.steps && trace.steps.length > 0) {
      setSteps(trace.steps);
      setCurrentStepIndex(0);
      setActiveMethod(trace.method || trace.steps[0].method);
      setIsPlaying(autoPlay && trace.steps.length > 1);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchStructureState = async () => {
      setIsLoading(true);
      setIsPlaying(false);
      try {
        const res = await fetch(`/api/${structureType}/estado`);
        if (!res.ok) throw new Error('API não respondeu');
        const data = await res.json();
        if (!cancelled) {
          loadTrace(data, false);
          setErrorStatus(null);
        }
      } catch {
        if (!cancelled) {
          setErrorStatus('Modo Estudo Local (Simulação integrada)');
          const initialTrace = buildInitialTraceFor(structureType);
          localNodesMapRef.current[structureType] = cloneNodes(
            initialTrace.steps[initialTrace.steps.length - 1].nodes
          );
          countersRef.current[structureType] = 1;
          loadTrace(initialTrace, false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchStructureState();
    return () => {
      cancelled = true;
    };
  }, [structureType, loadTrace]);

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
  }, [isPlaying, steps, playbackSpeed]);

  // ===========================================================================
  // Local simulation for FILA
  // ===========================================================================
  const simulateFila = useCallback((op, payload) => {
    const baseNodes = cloneNodes(localNodesMapRef.current.fila);
    const lastNode = baseNodes[baseNodes.length - 1];
    const isEmpty = baseNodes.length === 1;

    if (op === 'reset') {
      countersRef.current.fila = 1;
      const trace = buildFilaResetTrace();
      localNodesMapRef.current.fila = cloneNodes(
        trace.steps[trace.steps.length - 1].nodes
      );
      return trace;
    }

    if (op === 'vazia') {
      return {
        method: 'vazia',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 10,
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
            lineNumber: 11,
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
              lineNumber: 34,
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
              lineNumber: 35,
              codeLine:
                'throw new NoSuchElementException("Nao há nenhum item na fila!");',
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
            lineNumber: 34,
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
            lineNumber: 37,
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
      const newId = `c${countersRef.current.fila++}`;
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
      localNodesMapRef.current.fila = cloneNodes(step3Nodes);

      return {
        method: 'enfileirar',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 15,
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
            lineNumber: 16,
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
            lineNumber: 17,
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
              lineNumber: 23,
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
              lineNumber: 35,
              codeLine:
                'throw new NoSuchElementException("Nao há nenhum item na fila!");',
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

      localNodesMapRef.current.fila = cloneNodes(finalNodes);

      const traceSteps = [
        {
          stepIndex: 0,
          lineNumber: 23,
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
          lineNumber: 24,
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
          lineNumber: 25,
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
          lineNumber: 26,
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
          lineNumber: 28,
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
          lineNumber: 29,
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
        lineNumber: 30,
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

    return buildFilaResetTrace();
  }, []);

  // ===========================================================================
  // Local simulation for PILHA
  // ===========================================================================
  const simulatePilha = useCallback((op, payload) => {
    const baseNodes = cloneNodes(localNodesMapRef.current.pilha);
    const currentTop = baseNodes[0];
    const isEmpty = baseNodes.length === 1;

    if (op === 'reset') {
      countersRef.current.pilha = 1;
      const trace = buildPilhaResetTrace();
      localNodesMapRef.current.pilha = cloneNodes(
        trace.steps[trace.steps.length - 1].nodes
      );
      return trace;
    }

    if (op === 'vazia') {
      return {
        method: 'vazia',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 11,
            codeLine: 'public boolean vazia() {',
            method: 'vazia',
            description: 'Inicia a verificação se a pilha está vazia.',
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'topo', targetNodeId: currentTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: {},
          },
          {
            stepIndex: 1,
            lineNumber: 12,
            codeLine: 'return fundo == topo;',
            method: 'vazia',
            description: isEmpty
              ? 'Como "fundo" e "topo" apontam ambos para a sentinela, retorna true (pilha vazia).'
              : `Como "topo" (#${currentTop.id}) é diferente de "fundo" (#sentinela), retorna false (a pilha possui elementos).`,
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'topo', targetNodeId: currentTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: { 'fundo == topo': isEmpty },
            returnValue: isEmpty,
          },
        ],
      };
    }

    if (op === 'consultar') {
      if (isEmpty) {
        return {
          method: 'consultarTopo',
          steps: [
            {
              stepIndex: 0,
              lineNumber: 26,
              codeLine: 'if (vazia()) {',
              method: 'consultarTopo',
              description:
                'Verifica se a pilha está vazia (fundo == topo) antes de ler o topo.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'topo', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: { 'vazia()': true },
            },
            {
              stepIndex: 1,
              lineNumber: 27,
              codeLine:
                'throw new NoSuchElementException("Nao há nenhum item na pilha!");',
              method: 'consultarTopo',
              description:
                'Como fundo == topo, a pilha está vazia. Lança NoSuchElementException.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'topo', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: {},
              erro: true,
              mensagemErro: 'NoSuchElementException: Não há nenhum item na pilha!',
            },
          ],
        };
      }

      return {
        method: 'consultarTopo',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 26,
            codeLine: 'if (vazia()) {',
            method: 'consultarTopo',
            description:
              'Verifica se a pilha está vazia. Como "fundo != topo", prossegue.',
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'topo', targetNodeId: currentTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: { 'vazia()': false },
          },
          {
            stepIndex: 1,
            lineNumber: 29,
            codeLine: 'return topo.getItem();',
            method: 'consultarTopo',
            description: `Retorna diretamente o item armazenado na célula apontada por "topo" (#${currentTop.id}): "${currentTop.valor}".`,
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'topo', targetNodeId: currentTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: { 'topo.item': currentTop.valor },
            returnValue: currentTop.valor,
          },
        ],
      };
    }

    if (op === 'empilhar') {
      const newId = `p${countersRef.current.pilha++}`;
      const newNode = {
        id: newId,
        valor: payload.item,
        proximoId: currentTop.id,
        sentinela: false,
        novo: true,
        removido: false,
      };

      const step1Nodes = cloneNodes(baseNodes);
      const step2Nodes = [{ ...newNode }, ...cloneNodes(baseNodes)];
      const finalNodes = step2Nodes.map((n) => ({ ...n, novo: false }));
      localNodesMapRef.current.pilha = cloneNodes(finalNodes);

      return {
        method: 'empilhar',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 15,
            codeLine: 'public void empilhar(E item) {',
            method: 'empilhar',
            description: `Inicia empilhar("${payload.item}"). O topo atual é #${currentTop.id}.`,
            nodes: step1Nodes,
            pointers: [
              { nome: 'topo', targetNodeId: currentTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: { item: payload.item },
          },
          {
            stepIndex: 1,
            lineNumber: 16,
            codeLine: 'topo = new Celula<E>(item, topo);',
            method: 'empilhar',
            description: `Aloca a nova célula #${newId} com item = "${payload.item}" apontando seu "proximo" para o antigo topo (#${currentTop.id}) e atualiza "topo" para #${newId}.`,
            nodes: step2Nodes,
            pointers: [
              { nome: 'topo', targetNodeId: newId, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: {
              item: payload.item,
              'novo.proximo': `#${currentTop.id}`,
              topo: `#${newId}`,
            },
          },
        ],
      };
    }

    if (op === 'desempilhar') {
      if (isEmpty) {
        return {
          method: 'desempilhar',
          steps: [
            {
              stepIndex: 0,
              lineNumber: 20,
              codeLine: 'E desempilhado = consultarTopo();',
              method: 'desempilhar',
              description:
                'Chama consultarTopo() para obter o elemento do topo antes de removê-lo.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'topo', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: {},
            },
            {
              stepIndex: 1,
              lineNumber: 27,
              codeLine:
                'throw new NoSuchElementException("Nao há nenhum item na pilha!");',
              method: 'desempilhar',
              description:
                'Pilha vazia (fundo == topo)! Não é possível desempilhar. Lança NoSuchElementException.',
              nodes: cloneNodes(baseNodes),
              pointers: [
                { nome: 'topo', targetNodeId: 'sentinela', tipo: 'atributo' },
                { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
              ],
              variables: {},
              erro: true,
              mensagemErro: 'NoSuchElementException: Não há nenhum item na pilha!',
            },
          ],
        };
      }

      const nextTop = baseNodes[1];
      const step1Nodes = cloneNodes(baseNodes);
      const step2Nodes = cloneNodes(baseNodes).map((n, idx) =>
        idx === 0 ? { ...n, removido: true } : n
      );
      const finalNodes = cloneNodes(baseNodes.slice(1));
      localNodesMapRef.current.pilha = cloneNodes(finalNodes);

      return {
        method: 'desempilhar',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 20,
            codeLine: 'E desempilhado = consultarTopo();',
            method: 'desempilhar',
            description: `Obtém o valor no topo (#${currentTop.id}) através de consultarTopo(): desempilhado = "${currentTop.valor}".`,
            nodes: step1Nodes,
            pointers: [
              { nome: 'topo', targetNodeId: currentTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: { desempilhado: currentTop.valor },
          },
          {
            stepIndex: 1,
            lineNumber: 21,
            codeLine: 'topo = topo.getProximo();',
            method: 'desempilhar',
            description: `Avança o ponteiro "topo" para a célula seguinte (#${nextTop.id}), desvinculando o antigo topo (#${currentTop.id}).`,
            nodes: step2Nodes,
            pointers: [
              { nome: 'topo', targetNodeId: nextTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: {
              desempilhado: currentTop.valor,
              topo: `#${nextTop.id}`,
            },
          },
          {
            stepIndex: 2,
            lineNumber: 22,
            codeLine: 'return desempilhado;',
            method: 'desempilhar',
            description: `Retorna o item desempilhado "${currentTop.valor}". A célula #${currentTop.id} é liberada da memória.`,
            nodes: finalNodes,
            pointers: [
              { nome: 'topo', targetNodeId: nextTop.id, tipo: 'atributo' },
              { nome: 'fundo', targetNodeId: 'sentinela', tipo: 'atributo' },
            ],
            variables: { desempilhado: currentTop.valor },
            returnValue: currentTop.valor,
          },
        ],
      };
    }

    return buildPilhaResetTrace();
  }, []);

  // ===========================================================================
  // Local simulation for LISTA
  // ===========================================================================
  const simulateLista = useCallback((op, payload) => {
    const baseNodes = cloneNodes(localNodesMapRef.current.lista);
    const lastNode = baseNodes[baseNodes.length - 1];
    const tamanho = baseNodes.length - 1;
    const isEmpty = tamanho === 0;

    if (op === 'reset') {
      countersRef.current.lista = 1;
      const trace = buildListaResetTrace();
      localNodesMapRef.current.lista = cloneNodes(
        trace.steps[trace.steps.length - 1].nodes
      );
      return trace;
    }

    if (op === 'vazia') {
      return {
        method: 'vazia',
        steps: [
          {
            stepIndex: 0,
            lineNumber: 12,
            codeLine: 'public boolean vazia() {',
            method: 'vazia',
            description: 'Inicia a verificação se a lista está vazia.',
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
            ],
            variables: { tamanho },
          },
          {
            stepIndex: 1,
            lineNumber: 13,
            codeLine: 'return (this.primeiro == this.ultimo);',
            method: 'vazia',
            description: isEmpty
              ? 'Como "primeiro" e "ultimo" apontam ambos para a sentinela (tamanho = 0), retorna true.'
              : `Como "primeiro" (#sentinela) != "ultimo" (#${lastNode.id}), retorna false (tamanho = ${tamanho}).`,
            nodes: cloneNodes(baseNodes),
            pointers: [
              { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
              { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
            ],
            variables: { 'primeiro == ultimo': isEmpty, tamanho },
            returnValue: isEmpty,
          },
        ],
      };
    }

    if (op === 'inserir') {
      const novoItem = payload.item;
      const posicao = Number(payload.posicao ?? 0);
      const traceSteps = [];

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 18,
        codeLine: 'if ((posicao < 0) || (posicao > this.tamanho))',
        method: 'inserir',
        description: `Verifica se a posição informada (${posicao}) é válida no intervalo [0 .. ${tamanho}].`,
        nodes: cloneNodes(baseNodes),
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
        ],
        variables: { novo: novoItem, posicao, tamanho },
      });

      if (posicao < 0 || posicao > tamanho) {
        traceSteps.push({
          stepIndex: traceSteps.length,
          lineNumber: 19,
          codeLine:
            'throw new IndexOutOfBoundsException("Não foi possível inserir o item na lista: a posição informada é inválida!");',
          method: 'inserir',
          description: `Posição inválida (${posicao})! Para tamanho = ${tamanho}, apenas posições de 0 até ${tamanho} são permitidas.`,
          nodes: cloneNodes(baseNodes),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: { posicao, tamanho },
          erro: true,
          mensagemErro: `IndexOutOfBoundsException: a posição informada (${posicao}) é inválida!`,
        });
        return { method: 'inserir', steps: traceSteps };
      }

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 21,
        codeLine: 'anterior = this.primeiro;',
        method: 'inserir',
        description:
          'Posiciona o ponteiro auxiliar "anterior" na célula sentinela ("primeiro") para iniciar o caminhamento.',
        nodes: cloneNodes(baseNodes),
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          { nome: 'anterior', targetNodeId: 'sentinela', tipo: 'local' },
        ],
        variables: {
          novo: novoItem,
          posicao,
          anterior: '#sentinela',
          tamanho,
        },
      });

      for (let i = 0; i < posicao; i++) {
        const targetAnterior = baseNodes[i + 1];
        traceSteps.push({
          stepIndex: traceSteps.length,
          lineNumber: 23,
          codeLine: 'anterior = anterior.getProximo();',
          method: 'inserir',
          description: `Laço for (i = ${i}): avança "anterior" para a célula #${targetAnterior.id} (índice ${i}).`,
          nodes: cloneNodes(baseNodes),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
            { nome: 'anterior', targetNodeId: targetAnterior.id, tipo: 'local' },
          ],
          variables: {
            novo: novoItem,
            posicao,
            i,
            anterior: `#${targetAnterior.id}`,
            tamanho,
          },
        });
      }

      const anteriorNode = baseNodes[posicao];
      const proximaNode = baseNodes[posicao + 1] || null;
      const newId = `l${countersRef.current.lista++}`;
      const newNode = {
        id: newId,
        valor: novoItem,
        proximoId: null,
        sentinela: false,
        novo: true,
        removido: false,
      };

      const nodesWithAlloc = [
        ...cloneNodes(baseNodes).slice(0, posicao + 1),
        { ...newNode },
        ...cloneNodes(baseNodes).slice(posicao + 1),
      ];
      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 24,
        codeLine: 'novaCelula = new Celula<>(novo);',
        method: 'inserir',
        description: `Aloca "novaCelula" (#${newId}) na memória com item = "${novoItem}".`,
        nodes: nodesWithAlloc,
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          { nome: 'anterior', targetNodeId: anteriorNode.id, tipo: 'local' },
          { nome: 'novaCelula', targetNodeId: newId, tipo: 'local' },
        ],
        variables: {
          novo: novoItem,
          posicao,
          anterior: `#${anteriorNode.id}`,
          novaCelula: `#${newId}`,
        },
      });

      const pointersWithProxima = [
        { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
        { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
        { nome: 'anterior', targetNodeId: anteriorNode.id, tipo: 'local' },
        { nome: 'novaCelula', targetNodeId: newId, tipo: 'local' },
      ];
      if (proximaNode) {
        pointersWithProxima.push({
          nome: 'proximaCelula',
          targetNodeId: proximaNode.id,
          tipo: 'local',
        });
      }
      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 25,
        codeLine: 'proximaCelula = anterior.getProximo();',
        method: 'inserir',
        description: proximaNode
          ? `"proximaCelula" guarda a referência para #${proximaNode.id} (antigo sucessor de "anterior").`
          : 'Como "anterior" era o último nó, "proximaCelula" recebe null.',
        nodes: nodesWithAlloc.map((n) => ({ ...n })),
        pointers: pointersWithProxima,
        variables: {
          novo: novoItem,
          posicao,
          proximaCelula: proximaNode ? `#${proximaNode.id}` : 'null',
        },
      });

      const nodesLinked = nodesWithAlloc.map((n) => {
        if (n.id === anteriorNode.id) return { ...n, proximoId: newId };
        if (n.id === newId)
          return { ...n, proximoId: proximaNode ? proximaNode.id : null };
        return { ...n };
      });
      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 27,
        codeLine: 'novaCelula.setProximo(proximaCelula);',
        method: 'inserir',
        description: `Costura os ponteiros: #${anteriorNode.id}.proximo aponta para #${newId}, e #${newId}.proximo aponta para ${
          proximaNode ? `#${proximaNode.id}` : 'null'
        }.`,
        nodes: nodesLinked,
        pointers: pointersWithProxima,
        variables: {
          'anterior.proximo': `#${newId}`,
          'novaCelula.proximo': proximaNode ? `#${proximaNode.id}` : 'null',
        },
      });

      const insertedAtEnd = posicao === tamanho;
      const newUltimoId = insertedAtEnd ? newId : lastNode.id;

      if (insertedAtEnd) {
        traceSteps.push({
          stepIndex: traceSteps.length,
          lineNumber: 29,
          codeLine: 'this.ultimo = novaCelula;',
          method: 'inserir',
          description: `Como posicao == tamanho (${posicao} == ${tamanho}), atualiza o ponteiro "ultimo" para a nova célula (#${newId}).`,
          nodes: nodesLinked.map((n) => ({ ...n })),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: newId, tipo: 'atributo' },
            { nome: 'novaCelula', targetNodeId: newId, tipo: 'local' },
          ],
          variables: { ultimo: `#${newId}`, tamanho },
        });
      }

      const finalNodes = nodesLinked.map((n) => ({ ...n, novo: false }));
      localNodesMapRef.current.lista = cloneNodes(finalNodes);

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 30,
        codeLine: 'this.tamanho++;',
        method: 'inserir',
        description: `Incrementa "this.tamanho" para ${tamanho + 1}. Inserção na posição ${posicao} concluída.`,
        nodes: finalNodes,
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: newUltimoId, tipo: 'atributo' },
        ],
        variables: { tamanho: tamanho + 1 },
      });

      return { method: 'inserir', steps: traceSteps };
    }

    if (op === 'remover') {
      const posicao = Number(payload.posicao ?? 0);
      const traceSteps = [];

      if (isEmpty) {
        traceSteps.push({
          stepIndex: 0,
          lineNumber: 35,
          codeLine: 'if (vazia())',
          method: 'remover',
          description:
            'Verifica se a lista está vazia (primeiro == ultimo): verdadeiro!',
          nodes: cloneNodes(baseNodes),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: 'sentinela', tipo: 'atributo' },
          ],
          variables: { 'vazia()': true, tamanho: 0 },
        });
        traceSteps.push({
          stepIndex: 1,
          lineNumber: 36,
          codeLine:
            'throw new IllegalStateException("Não foi possível remover o item da lista: a lista está vazia!");',
          method: 'remover',
          description:
            'Exceção lançada: Não é possível remover elementos de uma lista vazia!',
          nodes: cloneNodes(baseNodes),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: 'sentinela', tipo: 'atributo' },
          ],
          variables: { tamanho: 0 },
          erro: true,
          mensagemErro:
            'IllegalStateException: Não foi possível remover o item da lista: a lista está vazia!',
        });
        return { method: 'remover', steps: traceSteps };
      }

      if (posicao < 0 || posicao >= tamanho) {
        traceSteps.push({
          stepIndex: 0,
          lineNumber: 38,
          codeLine: 'if ((posicao < 0) || (posicao >= this.tamanho ))',
          method: 'remover',
          description: `Posição inválida (${posicao})! Os índices válidos para remoção vão de 0 até ${
            tamanho - 1
          }.`,
          nodes: cloneNodes(baseNodes),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          ],
          variables: { posicao, tamanho },
          erro: true,
          mensagemErro: `IndexOutOfBoundsException: a posição informada (${posicao}) é inválida!`,
        });
        return { method: 'remover', steps: traceSteps };
      }

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 41,
        codeLine: 'anterior = this.primeiro;',
        method: 'remover',
        description:
          'Posiciona o ponteiro "anterior" na sentinela ("primeiro") para caminhar até a posição anterior ao item removido.',
        nodes: cloneNodes(baseNodes),
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          { nome: 'anterior', targetNodeId: 'sentinela', tipo: 'local' },
        ],
        variables: { posicao, anterior: '#sentinela', tamanho },
      });

      for (let i = 0; i < posicao; i++) {
        const targetAnterior = baseNodes[i + 1];
        traceSteps.push({
          stepIndex: traceSteps.length,
          lineNumber: 43,
          codeLine: 'anterior = anterior.getProximo();',
          method: 'remover',
          description: `Laço for (i = ${i}): avança "anterior" para #${targetAnterior.id}.`,
          nodes: cloneNodes(baseNodes),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
            { nome: 'anterior', targetNodeId: targetAnterior.id, tipo: 'local' },
          ],
          variables: { posicao, i, anterior: `#${targetAnterior.id}`, tamanho },
        });
      }

      const anteriorNode = baseNodes[posicao];
      const celulaRemovida = baseNodes[posicao + 1];
      const proximaCelula = baseNodes[posicao + 2] || null;

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 44,
        codeLine: 'celulaRemovida = anterior.getProximo();',
        method: 'remover',
        description: `"celulaRemovida" aponta para a célula #${celulaRemovida.id} (item = "${celulaRemovida.valor}") na posição ${posicao}.`,
        nodes: cloneNodes(baseNodes),
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          { nome: 'anterior', targetNodeId: anteriorNode.id, tipo: 'local' },
          {
            nome: 'celulaRemovida',
            targetNodeId: celulaRemovida.id,
            tipo: 'local',
          },
        ],
        variables: {
          posicao,
          anterior: `#${anteriorNode.id}`,
          celulaRemovida: `#${celulaRemovida.id}`,
        },
      });

      const unlinkedNodes = cloneNodes(baseNodes).map((n) => {
        if (n.id === anteriorNode.id) {
          return { ...n, proximoId: proximaCelula ? proximaCelula.id : null };
        }
        if (n.id === celulaRemovida.id) {
          return { ...n, proximoId: null, removido: true };
        }
        return n;
      });

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 47,
        codeLine: 'celulaRemovida.setProximo(null);',
        method: 'remover',
        description: `Desvincula #${celulaRemovida.id}: "anterior.proximo" passa a apontar para ${
          proximaCelula ? `#${proximaCelula.id}` : 'null'
        } e "celulaRemovida.proximo" recebe null.`,
        nodes: unlinkedNodes,
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: lastNode.id, tipo: 'atributo' },
          { nome: 'anterior', targetNodeId: anteriorNode.id, tipo: 'local' },
          {
            nome: 'celulaRemovida',
            targetNodeId: celulaRemovida.id,
            tipo: 'local',
          },
        ],
        variables: {
          'anterior.proximo': proximaCelula ? `#${proximaCelula.id}` : 'null',
          'celulaRemovida.proximo': 'null',
        },
      });

      const wasLast = celulaRemovida.id === lastNode.id;
      const newUltimoId = wasLast ? anteriorNode.id : lastNode.id;

      if (wasLast) {
        traceSteps.push({
          stepIndex: traceSteps.length,
          lineNumber: 49,
          codeLine: 'this.ultimo = anterior;',
          method: 'remover',
          description: `Como a célula removida era a última da lista, "this.ultimo" recua para "anterior" (#${anteriorNode.id}).`,
          nodes: unlinkedNodes.map((n) => ({ ...n })),
          pointers: [
            { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
            { nome: 'ultimo', targetNodeId: anteriorNode.id, tipo: 'atributo' },
            { nome: 'anterior', targetNodeId: anteriorNode.id, tipo: 'local' },
          ],
          variables: { ultimo: `#${anteriorNode.id}` },
        });
      }

      const finalNodes = unlinkedNodes
        .filter((n) => n.id !== celulaRemovida.id)
        .map((n) => ({ ...n, removido: false }));
      localNodesMapRef.current.lista = cloneNodes(finalNodes);

      traceSteps.push({
        stepIndex: traceSteps.length,
        lineNumber: 51,
        codeLine: 'return (celulaRemovida.getItem());',
        method: 'remover',
        description: `Decrementa tamanho para ${
          tamanho - 1
        } e retorna o item removido: "${celulaRemovida.valor}".`,
        nodes: finalNodes,
        pointers: [
          { nome: 'primeiro', targetNodeId: 'sentinela', tipo: 'atributo' },
          { nome: 'ultimo', targetNodeId: newUltimoId, tipo: 'atributo' },
        ],
        variables: { tamanho: tamanho - 1 },
        returnValue: celulaRemovida.valor,
      });

      return { method: 'remover', steps: traceSteps };
    }

    return buildListaResetTrace();
  }, []);

  const simulateLocalOperation = useCallback(
    (op, payload) => {
      if (structureType === 'pilha') return simulatePilha(op, payload);
      if (structureType === 'lista') return simulateLista(op, payload);
      return simulateFila(op, payload);
    },
    [structureType, simulateFila, simulatePilha, simulateLista]
  );

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
        loadTrace(trace, true);
        setErrorStatus(null);
        return trace;
      } catch {
        setErrorStatus('Modo Estudo Local (Simulação integrada)');
        const fallbackTrace = simulateLocalOperation(localOp, body);
        loadTrace(fallbackTrace, true);
        return fallbackTrace;
      } finally {
        setIsLoading(false);
      }
    },
    [simulateLocalOperation, loadTrace]
  );

  const enqueue = useCallback(
    (item) => executeApi('/api/fila/enfileirar', 'POST', { item }, 'enfileirar'),
    [executeApi]
  );
  const dequeue = useCallback(
    () => executeApi('/api/fila/desenfileirar', 'POST', null, 'desenfileirar'),
    [executeApi]
  );
  const peek = useCallback(
    () => executeApi('/api/fila/consultar', 'GET', null, 'consultar'),
    [executeApi]
  );

  const push = useCallback(
    (item) => executeApi('/api/pilha/empilhar', 'POST', { item }, 'empilhar'),
    [executeApi]
  );
  const pop = useCallback(
    () => executeApi('/api/pilha/desempilhar', 'POST', null, 'desempilhar'),
    [executeApi]
  );
  const peekTop = useCallback(
    () => executeApi('/api/pilha/consultar', 'GET', null, 'consultar'),
    [executeApi]
  );

  const insertAt = useCallback(
    (item, posicao) =>
      executeApi(
        '/api/lista/inserir',
        'POST',
        { item, posicao: Number(posicao) },
        'inserir'
      ),
    [executeApi]
  );
  const removeAt = useCallback(
    (posicao) =>
      executeApi(
        '/api/lista/remover',
        'POST',
        { posicao: Number(posicao) },
        'remover'
      ),
    [executeApi]
  );

  const checkEmpty = useCallback(
    () => executeApi(`/api/${structureType}/vazia`, 'GET', null, 'vazia'),
    [executeApi, structureType]
  );
  const reset = useCallback(
    () => executeApi(`/api/${structureType}/reset`, 'POST', null, 'reset'),
    [executeApi, structureType]
  );

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
  const activeElementCount = currentStep?.nodes
    ? Math.max(
        0,
        currentStep.nodes.filter((n) => !n.sentinela && !n.removido).length
      )
    : 0;

  return {
    steps,
    currentStepIndex,
    currentStep,
    activeMethod,
    activeElementCount,
    isPlaying,
    playbackSpeed,
    isLoading,
    errorStatus,
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
  };
}
