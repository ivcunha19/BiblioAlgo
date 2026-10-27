import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const DEFAULT_SORT_ARRAY = [38, 27, 43, 10, 82, 9];

export const PRESET_ARRAYS = {
  padrao: [38, 27, 43, 10, 82, 9],
  quaseOrdenado: [9, 15, 22, 18, 35, 42],
  inverso: [64, 52, 41, 29, 17, 8],
  repetidos: [25, 12, 40, 12, 25, 8],
};

function generateBubblesortTrace(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparacoes = 0;
  let movimentacoes = 0;
  const sortedSet = new Set();

  steps.push({
    stepIndex: steps.length,
    lineNumber: 9,
    codeLine: 'dadosOrdenados = dados;',
    method: 'ordenar',
    iterationId: 'init',
    iterationLabel: 'Inicialização',
    description: `Inicia o Bubblesort com um vetor de ${n} elementos. Zera os contadores de comparações e movimentações.`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeRange: [0, n - 1],
    comparacoes,
    movimentacoes,
    variables: { 'dados.length': n, comparacoes: 0, movimentacoes: 0 },
  });

  let iterNum = 1;
  for (let i = n - 1; i > 0; i--) {
    const iterId = `iter-${iterNum}`;
    const iterLabel = `Iteração ${iterNum} (i = ${i})`;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 14,
      codeLine: 'for (int i = dadosOrdenados.length - 1; i > 0; i--) {',
      method: 'ordenar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Inicia a ${iterNum}ª iteração externa com i = ${i}. O maior elemento da faixa [0 .. ${i}] irá flutuar até a posição ${i}.`,
      array: [...arr],
      indexPointers: [{ name: 'i', index: i }],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedSet],
      activeRange: [0, i],
      comparacoes,
      movimentacoes,
      variables: { i, comparacoes, movimentacoes },
    });

    for (let j = 0; j < i; j++) {
      comparacoes++;
      const valJ = arr[j];
      const valNext = arr[j + 1];
      const shouldSwap = valJ > valNext;

      steps.push({
        stepIndex: steps.length,
        lineNumber: 17,
        codeLine: 'if (comparador.compare(dadosOrdenados[j], dadosOrdenados[j + 1]) > 0)',
        method: 'ordenar',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Compara dadosOrdenados[${j}] (${valJ}) com dadosOrdenados[${j + 1}] (${valNext}): ${
          shouldSwap
            ? `${valJ} > ${valNext} (verdadeiro — fora de ordem, fará swap).`
            : `${valJ} <= ${valNext} (falso — já estão em ordem).`
        }`,
        array: [...arr],
        indexPointers: [
          { name: 'i', index: i },
          { name: 'j', index: j },
          { name: 'j+1', index: j + 1 },
        ],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sortedSet],
        activeRange: [0, i],
        comparacoes,
        movimentacoes,
        variables: {
          i,
          j,
          [`dados[${j}]`]: valJ,
          [`dados[${j + 1}]`]: valNext,
          comparacoes,
          movimentacoes,
        },
      });

      if (shouldSwap) {
        movimentacoes++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          stepIndex: steps.length,
          lineNumber: 18,
          codeLine: 'swap(j, j + 1);',
          method: 'swap',
          iterationId: iterId,
          iterationLabel: iterLabel,
          description: `Executa swap(${j}, ${j + 1}): troca ${valJ} e ${valNext} de posição.`,
          array: [...arr],
          indexPointers: [
            { name: 'i', index: i },
            { name: 'j', index: j },
            { name: 'j+1', index: j + 1 },
          ],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedSet],
          activeRange: [0, i],
          comparacoes,
          movimentacoes,
          variables: { i, j, temp: valJ, comparacoes, movimentacoes },
        });
      }
    }

    sortedSet.add(i);
    iterNum++;
  }

  sortedSet.add(0);

  steps.push({
    stepIndex: steps.length,
    lineNumber: 23,
    codeLine: 'return dadosOrdenados;',
    method: 'ordenar',
    iterationId: 'done',
    iterationLabel: 'Concluído',
    description: `Ordenação concluída! Vetor totalmente ordenado após ${comparacoes} comparações e ${movimentacoes} movimentações (swaps).`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    activeRange: null,
    comparacoes,
    movimentacoes,
    variables: { comparacoes, movimentacoes },
  });

  return steps;
}

function generateSelectionsortTrace(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparacoes = 0;
  let movimentacoes = 0;
  const sortedSet = new Set();

  steps.push({
    stepIndex: steps.length,
    lineNumber: 9,
    codeLine: 'dadosOrdenados = dados;',
    method: 'ordenar',
    iterationId: 'init',
    iterationLabel: 'Inicialização',
    description: `Inicia o Selectionsort com ${n} elementos. A cada iteração i, buscará o menor elemento em [i .. ${n - 1}].`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeRange: [0, n - 1],
    comparacoes,
    movimentacoes,
    variables: { 'dados.length': n, comparacoes: 0, movimentacoes: 0 },
  });

  for (let i = 0; i < n - 1; i++) {
    const iterId = `iter-${i + 1}`;
    const iterLabel = `Iteração ${i + 1} (i = ${i})`;
    let menor = i;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 15,
      codeLine: 'int menor = i;',
      method: 'ordenar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Inicia a iteração i = ${i} assumindo que o menor elemento da faixa [${i} .. ${n - 1}] está inicialmente em menor = ${i} (valor ${arr[i]}).`,
      array: [...arr],
      indexPointers: [
        { name: 'i', index: i },
        { name: 'menor', index: menor },
      ],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedSet],
      activeRange: [i, n - 1],
      pivotIndex: menor,
      comparacoes,
      movimentacoes,
      variables: { i, menor, [`dados[menor]`]: arr[menor], comparacoes, movimentacoes },
    });

    for (let j = i + 1; j < n; j++) {
      comparacoes++;
      const isSmaller = arr[menor] > arr[j];

      steps.push({
        stepIndex: steps.length,
        lineNumber: 18,
        codeLine: 'if (comparador.compare(dadosOrdenados[menor], dadosOrdenados[j]) > 0)',
        method: 'ordenar',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Compara o menor atual dadosOrdenados[${menor}] (${arr[menor]}) com dadosOrdenados[${j}] (${arr[j]}): ${
          isSmaller
            ? `${arr[j]} é menor que ${arr[menor]}! Atualizará o índice "menor" para ${j}.`
            : `${arr[j]} não é menor que ${arr[menor]}; mantém menor = ${menor}.`
        }`,
        array: [...arr],
        indexPointers: [
          { name: 'i', index: i },
          { name: 'menor', index: menor },
          { name: 'j', index: j },
        ],
        comparingIndices: [menor, j],
        swappingIndices: [],
        sortedIndices: [...sortedSet],
        activeRange: [i, n - 1],
        pivotIndex: menor,
        comparacoes,
        movimentacoes,
        variables: {
          i,
          menor,
          j,
          [`dados[menor]`]: arr[menor],
          [`dados[j]`]: arr[j],
          comparacoes,
        },
      });

      if (isSmaller) {
        menor = j;
        steps.push({
          stepIndex: steps.length,
          lineNumber: 19,
          codeLine: 'menor = j;',
          method: 'ordenar',
          iterationId: iterId,
          iterationLabel: iterLabel,
          description: `Atualiza a referência do índice "menor" para ${menor} (valor ${arr[menor]}).`,
          array: [...arr],
          indexPointers: [
            { name: 'i', index: i },
            { name: 'menor', index: menor },
            { name: 'j', index: j },
          ],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedSet],
          activeRange: [i, n - 1],
          pivotIndex: menor,
          comparacoes,
          movimentacoes,
          variables: { i, menor, [`dados[menor]`]: arr[menor], comparacoes },
        });
      }
    }

    if (menor !== i) {
      const valMenor = arr[menor];
      const valI = arr[i];
      movimentacoes++;
      const temp = arr[menor];
      arr[menor] = arr[i];
      arr[i] = temp;

      steps.push({
        stepIndex: steps.length,
        lineNumber: 22,
        codeLine: 'swap(menor, i);',
        method: 'swap',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Como menor (${menor}) != i (${i}), executa swap(${menor}, ${i}) colocando o menor valor (${valMenor}) na posição ${i} (trocando com ${valI}).`,
        array: [...arr],
        indexPointers: [
          { name: 'i', index: i },
          { name: 'menor', index: menor },
        ],
        comparingIndices: [],
        swappingIndices: [i, menor],
        sortedIndices: [...sortedSet, i],
        activeRange: [i, n - 1],
        comparacoes,
        movimentacoes,
        variables: { i, menor, comparacoes, movimentacoes },
      });
    } else {
      steps.push({
        stepIndex: steps.length,
        lineNumber: 21,
        codeLine: 'if (menor != i)',
        method: 'ordenar',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Como menor == i (${i}), o elemento ${arr[i]} já está na posição correta. Nenhuma troca (swap) é necessária.`,
        array: [...arr],
        indexPointers: [
          { name: 'i', index: i },
          { name: 'menor', index: menor },
        ],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [...sortedSet, i],
        activeRange: [i, n - 1],
        comparacoes,
        movimentacoes,
        variables: { i, menor, 'menor != i': false, comparacoes, movimentacoes },
      });
    }

    sortedSet.add(i);
  }

  sortedSet.add(n - 1);

  steps.push({
    stepIndex: steps.length,
    lineNumber: 26,
    codeLine: 'return dadosOrdenados;',
    method: 'ordenar',
    iterationId: 'done',
    iterationLabel: 'Concluído',
    description: `Selectionsort finalizado! Total de ${comparacoes} comparações e apenas ${movimentacoes} movimentações (swaps).`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    activeRange: null,
    comparacoes,
    movimentacoes,
    variables: { comparacoes, movimentacoes },
  });

  return steps;
}

function generateInsertionsortTrace(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparacoes = 0;
  let movimentacoes = 0;

  steps.push({
    stepIndex: steps.length,
    lineNumber: 9,
    codeLine: 'dadosOrdenados = dados;',
    method: 'ordenar',
    iterationId: 'init',
    iterationLabel: 'Inicialização',
    description: `Inicia o Insertionsort. O primeiro elemento na posição [0] (${arr[0]}) forma a sublista ordenada inicial de tamanho 1.`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [0],
    activeRange: [0, 0],
    comparacoes,
    movimentacoes,
    variables: { 'dados.length': n, comparacoes: 0, movimentacoes: 0 },
  });

  for (let i = 1; i < n; i++) {
    const iterId = `iter-${i}`;
    const iterLabel = `Iteração ${i} (i = ${i}, item = ${arr[i]})`;
    const item = arr[i];
    let j = i - 1;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 15,
      codeLine: 'T item = dadosOrdenados[i];',
      method: 'ordenar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Iteração i = ${i}: copia dadosOrdenados[${i}] (${item}) para a variável "item" e inicia j = ${j} para inserir "${item}" na sublista ordenada [0 .. ${i}].`,
      array: [...arr],
      indexPointers: [
        { name: 'i', index: i },
        { name: 'j', index: j },
      ],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({ length: i }, (_, idx) => idx),
      activeRange: [0, i],
      pivotIndex: i,
      keyItem: { label: 'item', value: item },
      comparacoes,
      movimentacoes,
      variables: { i, j, item, comparacoes, movimentacoes },
    });

    while (j >= 0 && arr[j] > item) {
      const valJ = arr[j];
      comparacoes++;
      movimentacoes++;
      arr[j + 1] = arr[j];

      steps.push({
        stepIndex: steps.length,
        lineNumber: 21,
        codeLine: 'dadosOrdenados[j + 1] = dadosOrdenados[j];',
        method: 'ordenar',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Como dadosOrdenados[${j}] (${valJ}) > item (${item}), desloca ${valJ} para a posição j + 1 (${j + 1}) e decrementa j para ${j - 1}.`,
        array: [...arr],
        indexPointers: [
          { name: 'i', index: i },
          { name: 'j', index: j },
          { name: 'j+1', index: j + 1 },
        ],
        comparingIndices: [j],
        swappingIndices: [j + 1],
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        activeRange: [0, i],
        keyItem: { label: 'item', value: item },
        comparacoes,
        movimentacoes,
        variables: { i, j: j - 1, item, [`dados[${j + 1}]`]: valJ, comparacoes, movimentacoes },
      });

      j--;
    }

    if (j >= 0) {
      steps.push({
        stepIndex: steps.length,
        lineNumber: 18,
        codeLine: 'while ((j >= 0) && (comparador.compare(dadosOrdenados[j], item) > 0)) {',
        method: 'ordenar',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Verifica dadosOrdenados[${j}] (${arr[j]}) > item (${item}): falso! Encontrou o ponto de inserção na posição j + 1 = ${j + 1}.`,
        array: [...arr],
        indexPointers: [
          { name: 'i', index: i },
          { name: 'j', index: j },
        ],
        comparingIndices: [j],
        swappingIndices: [],
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        activeRange: [0, i],
        keyItem: { label: 'item', value: item },
        comparacoes,
        movimentacoes,
        variables: { i, j, item, comparacoes, movimentacoes },
      });
    }

    movimentacoes++;
    arr[j + 1] = item;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 25,
      codeLine: 'dadosOrdenados[j + 1] = item;',
      method: 'ordenar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Insere item (${item}) na posição j + 1 (${j + 1}). Agora o subvetor [0 .. ${i}] está ordenado.`,
      array: [...arr],
      indexPointers: [
        { name: 'i', index: i },
        { name: 'j+1', index: j + 1 },
      ],
      comparingIndices: [],
      swappingIndices: [j + 1],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      activeRange: [0, i],
      keyItem: { label: 'item', value: item },
      comparacoes,
      movimentacoes,
      variables: { i, 'j + 1': j + 1, item, comparacoes, movimentacoes },
    });
  }

  steps.push({
    stepIndex: steps.length,
    lineNumber: 29,
    codeLine: 'return dadosOrdenados;',
    method: 'ordenar',
    iterationId: 'done',
    iterationLabel: 'Concluído',
    description: `Insertionsort concluído! Vetor ordenado com ${comparacoes} comparações no laço while e ${movimentacoes} movimentações.`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    activeRange: null,
    comparacoes,
    movimentacoes,
    variables: { comparacoes, movimentacoes },
  });

  return steps;
}

function generateMergesortTrace(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparacoes = 0;
  let movimentacoes = 0;
  let mergeCount = 0;

  steps.push({
    stepIndex: steps.length,
    lineNumber: 13,
    codeLine: 'mergesort(0, dadosOrdenados.length - 1);',
    method: 'ordenar',
    iterationId: 'init',
    iterationLabel: 'Inicialização',
    description: `Inicia o Mergesort chamando mergesort(0, ${n - 1}) para dividir e intercalar o vetor recursivamente.`,
    array: [...arr],
    indexPointers: [
      { name: 'esq', index: 0 },
      { name: 'dir', index: n - 1 },
    ],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeRange: [0, n - 1],
    comparacoes,
    movimentacoes,
    variables: { esq: 0, dir: n - 1, comparacoes: 0, movimentacoes: 0 },
  });

  function mergesort(esq, dir) {
    if (esq < dir) {
      const meio = Math.floor((esq + dir) / 2);

      steps.push({
        stepIndex: steps.length,
        lineNumber: 20,
        codeLine: 'int meio = (esq + dir) / 2;',
        method: 'mergesort',
        iterationId: `div-${esq}-${dir}`,
        iterationLabel: `Divisão [${esq}..${dir}]`,
        description: `Divide o subvetor [${esq} .. ${dir}] ao meio (meio = ${meio}): esquerda [${esq} .. ${meio}] e direita [${meio + 1} .. ${dir}].`,
        array: [...arr],
        indexPointers: [
          { name: 'esq', index: esq },
          { name: 'meio', index: meio },
          { name: 'dir', index: dir },
        ],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        activeRange: [esq, dir],
        comparacoes,
        movimentacoes,
        variables: { esq, meio, dir },
      });

      mergesort(esq, meio);
      mergesort(meio + 1, dir);
      intercalar(esq, meio, dir);
    }
  }

  function intercalar(esq, meio, dir) {
    mergeCount++;
    const iterId = `merge-${mergeCount}`;
    const iterLabel = `${mergeCount}ª Intercalação [${esq}..${dir}]`;

    const n1 = meio - esq + 1;
    const n2 = dir - meio;
    const a1 = [];
    const a2 = [];

    for (let i = 0; i < n1; i++) a1[i] = arr[esq + i];
    for (let j = 0; j < n2; j++) a2[j] = arr[meio + 1 + j];

    steps.push({
      stepIndex: steps.length,
      lineNumber: 35,
      codeLine: 'for (int j = 0; j < n2; j++) a2[j] = dadosOrdenados[meio + 1 + j];',
      method: 'intercalar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Inicia intercalar(${esq}, ${meio}, ${dir}): copia a metade esquerda [${esq}..${meio}] para a1 = [${a1.join(', ')}] e a metade direita [${meio + 1}..${dir}] para a2 = [${a2.join(', ')}].`,
      array: [...arr],
      indexPointers: [
        { name: 'esq', index: esq },
        { name: 'meio', index: meio },
        { name: 'dir', index: dir },
      ],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      activeRange: [esq, dir],
      auxArrays: { a1: [...a1], a2: [...a2], i: 0, j: 0 },
      comparacoes,
      movimentacoes,
      variables: { esq, meio, dir, n1, n2 },
    });

    let i = 0;
    let j = 0;
    let k = esq;

    for (; i < n1 && j < n2; k++) {
      comparacoes++;
      movimentacoes++;
      const leftSmaller = a1[i] < a2[j];
      const chosenVal = leftSmaller ? a1[i] : a2[j];
      const prevI = i;
      const prevJ = j;

      if (leftSmaller) {
        arr[k] = a1[i++];
      } else {
        arr[k] = a2[j++];
      }

      steps.push({
        stepIndex: steps.length,
        lineNumber: leftSmaller ? 43 : 45,
        codeLine: leftSmaller
          ? 'dadosOrdenados[k] = a1[i++];'
          : 'dadosOrdenados[k] = a2[j++];',
        method: 'intercalar',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Compara a1[${prevI}] (${a1[prevI]}) com a2[${prevJ}] (${a2[prevJ]}): copia o menor (${chosenVal}) para dadosOrdenados[${k}].`,
        array: [...arr],
        indexPointers: [
          { name: 'esq', index: esq },
          { name: 'k', index: k },
          { name: 'dir', index: dir },
        ],
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [],
        activeRange: [esq, dir],
        auxArrays: { a1: [...a1], a2: [...a2], i: prevI, j: prevJ },
        comparacoes,
        movimentacoes,
        variables: {
          k,
          [`a1[${prevI}]`]: a1[prevI],
          [`a2[${prevJ}]`]: a2[prevJ],
          [`dados[${k}]`]: chosenVal,
          comparacoes,
          movimentacoes,
        },
      });
    }

    if (i === n1) {
      for (; k <= dir; k++) {
        const prevJ = j;
        movimentacoes++;
        arr[k] = a2[j++];

        steps.push({
          stepIndex: steps.length,
          lineNumber: 51,
          codeLine: 'dadosOrdenados[k] = a2[j++];',
          method: 'intercalar',
          iterationId: iterId,
          iterationLabel: iterLabel,
          description: `Como a1 terminou (i == n1), copia o elemento restante a2[${prevJ}] (${arr[k]}) para dadosOrdenados[${k}].`,
          array: [...arr],
          indexPointers: [
            { name: 'esq', index: esq },
            { name: 'k', index: k },
            { name: 'dir', index: dir },
          ],
          comparingIndices: [],
          swappingIndices: [k],
          sortedIndices: [],
          activeRange: [esq, dir],
          auxArrays: { a1: [...a1], a2: [...a2], i, j: prevJ },
          comparacoes,
          movimentacoes,
          variables: { k, [`a2[${prevJ}]`]: arr[k], comparacoes, movimentacoes },
        });
      }
    } else {
      for (; k <= dir; k++) {
        const prevI = i;
        movimentacoes++;
        arr[k] = a1[i++];

        steps.push({
          stepIndex: steps.length,
          lineNumber: 56,
          codeLine: 'dadosOrdenados[k] = a1[i++];',
          method: 'intercalar',
          iterationId: iterId,
          iterationLabel: iterLabel,
          description: `Como a2 terminou, copia o elemento restante a1[${prevI}] (${arr[k]}) para dadosOrdenados[${k}].`,
          array: [...arr],
          indexPointers: [
            { name: 'esq', index: esq },
            { name: 'k', index: k },
            { name: 'dir', index: dir },
          ],
          comparingIndices: [],
          swappingIndices: [k],
          sortedIndices: [],
          activeRange: [esq, dir],
          auxArrays: { a1: [...a1], a2: [...a2], i: prevI, j },
          comparacoes,
          movimentacoes,
          variables: { k, [`a1[${prevI}]`]: arr[k], comparacoes, movimentacoes },
        });
      }
    }
  }

  mergesort(0, n - 1);

  steps.push({
    stepIndex: steps.length,
    lineNumber: 15,
    codeLine: 'return dadosOrdenados;',
    method: 'ordenar',
    iterationId: 'done',
    iterationLabel: 'Concluído',
    description: `Mergesort finalizado! O vetor foi intercalado e ordenado com ${comparacoes} comparações e ${movimentacoes} movimentações.`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    activeRange: null,
    comparacoes,
    movimentacoes,
    variables: { comparacoes, movimentacoes },
  });

  return steps;
}

function generateQuicksortTrace(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparacoes = 0;
  let movimentacoes = 0;
  let partCount = 0;
  const sortedSet = new Set();

  steps.push({
    stepIndex: steps.length,
    lineNumber: 13,
    codeLine: 'quicksort(0, dadosOrdenados.length - 1);',
    method: 'ordenar',
    iterationId: 'init',
    iterationLabel: 'Inicialização',
    description: `Inicia o Quicksort chamando quicksort(0, ${n - 1}).`,
    array: [...arr],
    indexPointers: [
      { name: 'esq', index: 0 },
      { name: 'dir', index: n - 1 },
    ],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeRange: [0, n - 1],
    comparacoes,
    movimentacoes,
    variables: { esq: 0, dir: n - 1, comparacoes: 0, movimentacoes: 0 },
  });

  function quicksort(esq, dir) {
    if (esq < dir) {
      const p = particao(esq, dir);
      sortedSet.add(p);
      quicksort(esq, p - 1);
      quicksort(p + 1, dir);
    } else if (esq === dir && esq >= 0 && esq < n) {
      sortedSet.add(esq);
    }
  }

  function particao(inicio, fim) {
    partCount++;
    const meio = Math.floor((inicio + fim) / 2);
    const chosenPivotVal = arr[meio];
    const iterId = `part-${partCount}`;
    const iterLabel = `${partCount}ª Partição [${inicio}..${fim}] (pivô meio[${meio}] = ${chosenPivotVal})`;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 28,
      codeLine: 'int meio = (inicio + fim) / 2;',
      method: 'particao',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Inicia particao(${inicio}, ${fim}): calcula o índice central meio = (${inicio} + ${fim}) / 2 = ${meio} (valor ${chosenPivotVal}) para ser o pivô.`,
      array: [...arr],
      indexPointers: [
        { name: 'inicio', index: inicio },
        { name: 'meio', index: meio },
        { name: 'fim', index: fim },
      ],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedSet],
      activeRange: [inicio, fim],
      pivotIndex: meio,
      keyItem: { label: 'pivot (meio)', value: chosenPivotVal },
      comparacoes,
      movimentacoes,
      variables: { inicio, meio, fim, [`dados[${meio}]`]: chosenPivotVal, comparacoes, movimentacoes },
    });

    movimentacoes++;
    const tempPivot = arr[meio];
    arr[meio] = arr[fim];
    arr[fim] = tempPivot;

    const pivot = arr[fim];
    let part = inicio - 1;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 30,
      codeLine: 'T pivot = dadosOrdenados[fim];',
      method: 'particao',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Executa swap(meio=${meio}, fim=${fim}) movendo o pivô do meio (${pivot}) para o final da partição (dadosOrdenados[${fim}] = ${pivot}) e define part = ${part}.`,
      array: [...arr],
      indexPointers: [
        { name: 'inicio', index: inicio },
        { name: 'meio', index: meio },
        { name: 'fim', index: fim },
        ...(part >= 0 ? [{ name: 'part', index: part }] : []),
      ],
      comparingIndices: [],
      swappingIndices: [meio, fim],
      sortedIndices: [...sortedSet],
      activeRange: [inicio, fim],
      pivotIndex: fim,
      keyItem: { label: 'pivot', value: pivot },
      comparacoes,
      movimentacoes,
      variables: { inicio, meio, fim, pivot, part, comparacoes, movimentacoes },
    });

    for (let i = inicio; i < fim; i++) {
      comparacoes++;
      const isLess = arr[i] < pivot;

      steps.push({
        stepIndex: steps.length,
        lineNumber: 33,
        codeLine: 'if (comparador.compare(dadosOrdenados[i], pivot) < 0) {',
        method: 'particao',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Compara dadosOrdenados[${i}] (${arr[i]}) < pivot (${pivot}): ${
          isLess
            ? 'verdadeiro! Incrementará "part" e fará swap(part, i).'
            : 'falso! O elemento permanece à direita da fronteira "part".'
        }`,
        array: [...arr],
        indexPointers: [
          { name: 'inicio', index: inicio },
          { name: 'i', index: i },
          { name: 'fim', index: fim },
          ...(part >= 0 ? [{ name: 'part', index: part }] : []),
        ],
        comparingIndices: [i, fim],
        swappingIndices: [],
        sortedIndices: [...sortedSet],
        activeRange: [inicio, fim],
        pivotIndex: fim,
        keyItem: { label: 'pivot', value: pivot },
        comparacoes,
        movimentacoes,
        variables: { inicio, fim, i, part, [`dados[${i}]`]: arr[i], pivot, comparacoes, movimentacoes },
      });

      if (isLess) {
        part++;
        movimentacoes++;
        const temp = arr[part];
        arr[part] = arr[i];
        arr[i] = temp;

        steps.push({
          stepIndex: steps.length,
          lineNumber: 35,
          codeLine: 'swap(part, i);',
          method: 'swap',
          iterationId: iterId,
          iterationLabel: iterLabel,
          description: `Avança part para ${part} e executa swap(${part}, ${i}), movendo ${arr[part]} para a região dos elementos menores que o pivô.`,
          array: [...arr],
          indexPointers: [
            { name: 'part', index: part },
            { name: 'i', index: i },
            { name: 'fim', index: fim },
          ],
          comparingIndices: [],
          swappingIndices: [part, i],
          sortedIndices: [...sortedSet],
          activeRange: [inicio, fim],
          pivotIndex: fim,
          keyItem: { label: 'pivot', value: pivot },
          comparacoes,
          movimentacoes,
          variables: { inicio, fim, i, part, pivot, comparacoes, movimentacoes },
        });
      }
    }

    part++;
    movimentacoes++;
    const temp = arr[part];
    arr[part] = arr[fim];
    arr[fim] = temp;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 39,
      codeLine: 'swap(part, fim);',
      method: 'particao',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Posiciona o pivô (${pivot}) em sua posição definitiva: incrementa part para ${part} e executa swap(${part}, ${fim}).`,
      array: [...arr],
      indexPointers: [
        { name: 'part', index: part },
        { name: 'fim', index: fim },
      ],
      comparingIndices: [],
      swappingIndices: [part, fim],
      sortedIndices: [...sortedSet, part],
      activeRange: [inicio, fim],
      pivotIndex: part,
      keyItem: { label: 'pivot', value: pivot },
      comparacoes,
      movimentacoes,
      variables: { inicio, fim, part, pivot, comparacoes, movimentacoes },
    });

    return part;
  }

  quicksort(0, n - 1);

  steps.push({
    stepIndex: steps.length,
    lineNumber: 15,
    codeLine: 'return dadosOrdenados;',
    method: 'ordenar',
    iterationId: 'done',
    iterationLabel: 'Concluído',
    description: `Quicksort concluído! Vetor ordenado com ${comparacoes} comparações e ${movimentacoes} movimentações.`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    activeRange: null,
    comparacoes,
    movimentacoes,
    variables: { comparacoes, movimentacoes },
  });

  return steps;
}

function generateHeapsortTrace(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparacoes = 0;
  let movimentacoes = 0;

  const tmp = new Array(n + 1).fill(null);
  for (let i = 0; i < n; i++) {
    tmp[i + 1] = arr[i];
  }

  steps.push({
    stepIndex: steps.length,
    lineNumber: 15,
    codeLine: 'tmp[i + 1] = dadosOrdenados[i];',
    method: 'ordenar',
    iterationId: 'init',
    iterationLabel: 'Cópia para tmp[1..n]',
    description: `Cria o vetor auxiliar tmp de tamanho ${n + 1} e copia os elementos para as posições 1 até ${n} (ignorando a posição 0 para facilitar o cálculo dos filhos 2*i e 2*i+1).`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeRange: [0, n - 1],
    auxArrays: { tmp: [...tmp], tamHeap: n, pointerTmp: [] },
    comparacoes,
    movimentacoes,
    variables: { 'tmp.length': n + 1, tamHeap: n },
  });

  function syncDisplayArrayFromTmp() {
    return tmp.slice(1);
  }

  function getMaiorFilho(i, tamHeap, iterId, iterLabel, sortedCount) {
    let filho;
    if (2 * i === tamHeap) {
      filho = 2 * i;
    } else {
      comparacoes++;
      if (tmp[2 * i] > tmp[2 * i + 1]) {
        filho = 2 * i;
      } else {
        filho = 2 * i + 1;
      }
    }

    steps.push({
      stepIndex: steps.length,
      lineNumber: 55,
      codeLine: 'if (2 * i == tamHeap || (comparador.compare(tmp[2 * i], tmp[2 * i + 1]) > 0))',
      method: 'getMaiorFilho',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description:
        2 * i === tamHeap
          ? `O nó i = ${i} possui apenas o filho esquerdo na posição ${2 * i} (valor ${tmp[2 * i]}). Retorna filho = ${filho}.`
          : `Compara os filhos do nó i = ${i}: esquerdo tmp[${2 * i}] (${tmp[2 * i]}) e direito tmp[${2 * i + 1}] (${tmp[2 * i + 1]}). O maior filho está em ${filho} (valor ${tmp[filho]}).`,
      array: syncDisplayArrayFromTmp(sortedCount),
      indexPointers: [
        { name: 'i', index: i - 1 },
        { name: 'filho', index: filho - 1 },
      ],
      comparingIndices: 2 * i === tamHeap ? [2 * i - 1] : [2 * i - 1, 2 * i],
      swappingIndices: [],
      sortedIndices: Array.from({ length: sortedCount }, (_, idx) => n - 1 - idx),
      activeRange: [0, tamHeap - 1],
      auxArrays: {
        tmp: [...tmp],
        tamHeap,
        pointerTmp: [
          { name: 'i', index: i },
          { name: 'filho', index: filho },
        ],
      },
      comparacoes,
      movimentacoes,
      variables: { i, tamHeap, filho, [`tmp[filho]`]: tmp[filho], comparacoes, movimentacoes },
    });

    return filho;
  }

  function restaura(i, tamHeap, iterId, iterLabel, sortedCount) {
    let maior = i;
    const filho = getMaiorFilho(i, tamHeap, iterId, iterLabel, sortedCount);

    comparacoes++;
    const childGreater = tmp[i] < tmp[filho];
    if (childGreater) {
      maior = filho;
    }

    steps.push({
      stepIndex: steps.length,
      lineNumber: 42,
      codeLine: 'if (comparador.compare(tmp[i], tmp[filho]) < 0) {',
      method: 'restaura',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Compara o pai tmp[${i}] (${tmp[i]}) com o maior filho tmp[${filho}] (${tmp[filho]}): ${
        childGreater
          ? `o filho (${tmp[filho]}) é maior que o pai (${tmp[i]})! Define maior = ${filho} e fará swap.`
          : `o pai (${tmp[i]}) já é maior ou igual ao filho (${tmp[filho]}). A propriedade de Max-Heap está satisfeita.`
      }`,
      array: syncDisplayArrayFromTmp(sortedCount),
      indexPointers: [
        { name: 'i', index: i - 1 },
        { name: 'filho', index: filho - 1 },
      ],
      comparingIndices: [i - 1, filho - 1],
      swappingIndices: [],
      sortedIndices: Array.from({ length: sortedCount }, (_, idx) => n - 1 - idx),
      activeRange: [0, tamHeap - 1],
      auxArrays: {
        tmp: [...tmp],
        tamHeap,
        pointerTmp: [
          { name: 'i', index: i },
          { name: 'maior', index: maior },
        ],
      },
      comparacoes,
      movimentacoes,
      variables: { i, filho, maior, tamHeap, comparacoes, movimentacoes },
    });

    if (maior !== i) {
      movimentacoes++;
      const temp = tmp[i];
      tmp[i] = tmp[maior];
      tmp[maior] = temp;

      steps.push({
        stepIndex: steps.length,
        lineNumber: 46,
        codeLine: 'swap(tmp, i, maior);',
        method: 'swap',
        iterationId: iterId,
        iterationLabel: iterLabel,
        description: `Executa swap(tmp, ${i}, ${maior}): sobe ${tmp[i]} para a posição ${i} e desce ${tmp[maior]} para ${maior}.`,
        array: syncDisplayArrayFromTmp(sortedCount),
        indexPointers: [
          { name: 'i', index: i - 1 },
          { name: 'maior', index: maior - 1 },
        ],
        comparingIndices: [],
        swappingIndices: [i - 1, maior - 1],
        sortedIndices: Array.from({ length: sortedCount }, (_, idx) => n - 1 - idx),
        activeRange: [0, tamHeap - 1],
        auxArrays: {
          tmp: [...tmp],
          tamHeap,
          pointerTmp: [
            { name: 'i', index: i },
            { name: 'maior', index: maior },
          ],
        },
        comparacoes,
        movimentacoes,
        variables: { i, maior, tamHeap, comparacoes, movimentacoes },
      });

      if (maior <= Math.floor(tamHeap / 2)) {
        restaura(maior, tamHeap, iterId, iterLabel, sortedCount);
      }
    }
  }

  // Fase 1: Construção do Heap
  for (let tamHeap = Math.floor(n / 2); tamHeap >= 1; tamHeap--) {
    const iterId = `build-${tamHeap}`;
    const iterLabel = `Construção Heap (nó ${tamHeap})`;
    restaura(tamHeap, n, iterId, iterLabel, 0);
  }

  // Fase 2: Ordenação propriamente dita
  let tamHeap = n;
  let extractStep = 1;
  {
    const iterId = `extract-${extractStep}`;
    const iterLabel = `1ª Extração (tamHeap = ${tamHeap})`;
    movimentacoes++;
    const oldRoot = tmp[1];
    const oldLast = tmp[tamHeap];
    tmp[1] = oldLast;
    tmp[tamHeap] = oldRoot;
    const prevTamHeap = tamHeap;
    tamHeap--;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 25,
      codeLine: 'swap(tmp, 1, tamHeap--);',
      method: 'ordenar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Troca a raiz do Max-Heap tmp[1] (${oldRoot}, maior elemento) com tmp[${prevTamHeap}] (${oldLast}) e reduz tamHeap para ${tamHeap}.`,
      array: syncDisplayArrayFromTmp(1),
      indexPointers: [
        { name: 'raiz', index: 0 },
        { name: 'tamHeap', index: prevTamHeap - 1 },
      ],
      comparingIndices: [],
      swappingIndices: [0, prevTamHeap - 1],
      sortedIndices: [n - 1],
      activeRange: [0, tamHeap - 1],
      auxArrays: {
        tmp: [...tmp],
        tamHeap,
        pointerTmp: [
          { name: '1', index: 1 },
          { name: 'tamHeap', index: tamHeap },
        ],
      },
      comparacoes,
      movimentacoes,
      variables: { tamHeap, [`extraído`]: oldRoot, comparacoes, movimentacoes },
    });
  }

  let sortedCount = 1;
  while (tamHeap > 1) {
    extractStep++;
    const iterId = `extract-${extractStep}`;
    const iterLabel = `${extractStep}ª Extração (tamHeap = ${tamHeap})`;

    restaura(1, tamHeap, iterId, iterLabel, sortedCount);

    movimentacoes++;
    const oldRoot = tmp[1];
    const oldLast = tmp[tamHeap];
    tmp[1] = oldLast;
    tmp[tamHeap] = oldRoot;
    const prevTamHeap = tamHeap;
    tamHeap--;
    sortedCount++;

    steps.push({
      stepIndex: steps.length,
      lineNumber: 28,
      codeLine: 'swap(tmp, 1, tamHeap--);',
      method: 'ordenar',
      iterationId: iterId,
      iterationLabel: iterLabel,
      description: `Extrai o novo maior elemento na raiz tmp[1] (${oldRoot}), trocando-o com tmp[${prevTamHeap}] (${oldLast}), e decrementa tamHeap para ${tamHeap}.`,
      array: syncDisplayArrayFromTmp(sortedCount),
      indexPointers: [
        { name: 'raiz', index: 0 },
        { name: 'tamHeap', index: prevTamHeap - 1 },
      ],
      comparingIndices: [],
      swappingIndices: [0, prevTamHeap - 1],
      sortedIndices: Array.from({ length: sortedCount }, (_, idx) => n - 1 - idx),
      activeRange: [0, tamHeap - 1],
      auxArrays: {
        tmp: [...tmp],
        tamHeap,
        pointerTmp: [
          { name: '1', index: 1 },
          { name: 'tamHeap', index: tamHeap },
        ],
      },
      comparacoes,
      movimentacoes,
      variables: { tamHeap, [`extraído`]: oldRoot, comparacoes, movimentacoes },
    });
  }

  for (let i = 0; i < n; i++) {
    arr[i] = tmp[i + 1];
  }

  steps.push({
    stepIndex: steps.length,
    lineNumber: 33,
    codeLine: 'dadosOrdenados[i] = tmp[i + 1];',
    method: 'ordenar',
    iterationId: 'done',
    iterationLabel: 'Cópia Final (0..n-1)',
    description: `Copia os elementos ordenados de tmp[1..${n}] de volta para dadosOrdenados[0..${n - 1}]. Heapsort concluído com ${comparacoes} comparações e ${movimentacoes} movimentações!`,
    array: [...arr],
    indexPointers: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    activeRange: null,
    auxArrays: { tmp: [...tmp], tamHeap: 0, pointerTmp: [] },
    comparacoes,
    movimentacoes,
    variables: { comparacoes, movimentacoes },
  });

  return steps;
}

export function buildSortingTrace(algorithmId, inputArray) {
  const safeArray =
    Array.isArray(inputArray) && inputArray.length >= 2
      ? inputArray.slice(0, 12).map((v) => Number(v) || 0)
      : [...DEFAULT_SORT_ARRAY];

  switch (algorithmId) {
    case 'bubblesort':
      return generateBubblesortTrace(safeArray);
    case 'selectionsort':
      return generateSelectionsortTrace(safeArray);
    case 'insertionsort':
      return generateInsertionsortTrace(safeArray);
    case 'mergesort':
      return generateMergesortTrace(safeArray);
    case 'quicksort':
      return generateQuicksortTrace(safeArray);
    case 'heapsort':
      return generateHeapsortTrace(safeArray);
    default:
      return generateBubblesortTrace(safeArray);
  }
}

export function useSortingSimulation(algorithmId = 'bubblesort') {
  const [inputArray, setInputArray] = useState(DEFAULT_SORT_ARRAY);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const timerRef = useRef(null);

  const steps = useMemo(
    () => buildSortingTrace(algorithmId, inputArray),
    [algorithmId, inputArray]
  );

  // Group steps into iterations for iteration-level navigation
  const iterations = useMemo(() => {
    const map = new Map();
    steps.forEach((s, idx) => {
      const id = s.iterationId || 'init';
      if (!map.has(id)) {
        map.set(id, {
          id,
          label: s.iterationLabel || id,
          startStepIndex: idx,
          endStepIndex: idx,
        });
      } else {
        map.get(id).endStepIndex = idx;
      }
    });
    return Array.from(map.values());
  }, [steps]);

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

  const currentStep = steps[currentStepIndex] || steps[0] || null;
  const activeMethod = currentStep?.method || 'ordenar';

  const currentIterationIndex = useMemo(() => {
    if (!currentStep) return 0;
    const idx = iterations.findIndex((it) => it.id === currentStep.iterationId);
    return idx >= 0 ? idx : 0;
  }, [iterations, currentStep]);

  const applyCustomArray = useCallback((newArr, autoPlay = false) => {
    if (Array.isArray(newArr) && newArr.length >= 2) {
      setInputArray(newArr.slice(0, 12));
      setCurrentStepIndex(0);
      setIsPlaying(autoPlay);
    }
  }, []);

  const generateRandomArray = useCallback((size = 6) => {
    const randomVals = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 89) + 10
    );
    setInputArray(randomVals);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    return randomVals;
  }, []);

  const resetSort = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const firstStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const lastStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, steps.length - 1));
  }, [steps.length]);

  const goToStep = useCallback(
    (idx) => {
      if (idx >= 0 && idx < steps.length) {
        setIsPlaying(false);
        setCurrentStepIndex(idx);
      }
    },
    [steps.length]
  );

  const goToIteration = useCallback(
    (iterIndex) => {
      if (iterIndex >= 0 && iterIndex < iterations.length) {
        setIsPlaying(false);
        setCurrentStepIndex(iterations[iterIndex].startStepIndex);
      }
    },
    [iterations]
  );

  const nextIteration = useCallback(() => {
    if (currentIterationIndex < iterations.length - 1) {
      setIsPlaying(false);
      setCurrentStepIndex(iterations[currentIterationIndex + 1].startStepIndex);
    } else {
      setIsPlaying(false);
      setCurrentStepIndex(steps.length - 1);
    }
  }, [currentIterationIndex, iterations, steps.length]);

  const prevIteration = useCallback(() => {
    setIsPlaying(false);
    const currentIter = iterations[currentIterationIndex];
    if (currentIter && currentStepIndex > currentIter.startStepIndex) {
      setCurrentStepIndex(currentIter.startStepIndex);
    } else if (currentIterationIndex > 0) {
      setCurrentStepIndex(iterations[currentIterationIndex - 1].startStepIndex);
    } else {
      setCurrentStepIndex(0);
    }
  }, [currentIterationIndex, currentStepIndex, iterations]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    inputArray,
    steps,
    currentStepIndex,
    currentStep,
    activeMethod,
    iterations,
    currentIterationIndex,
    isPlaying,
    playbackSpeed,
    applyCustomArray,
    generateRandomArray,
    resetSort,
    nextStep,
    prevStep,
    firstStep,
    lastStep,
    goToStep,
    goToIteration,
    nextIteration,
    prevIteration,
    togglePlay,
    setPlaybackSpeed,
  };
}
