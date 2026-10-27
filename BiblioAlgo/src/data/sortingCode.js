export const BUBBLESORT_JAVA_CODE = `public class Bubblesort<T extends Comparable<T>> implements IOrdenator<T> {
	private T[] dadosOrdenados;
	private Comparator<T> comparador;
	private long comparacoes;
	private long movimentacoes;

	@Override
	public T[] ordenar(T[] dados) {
		dadosOrdenados = dados;
		comparacoes = 0;
		movimentacoes = 0;
		iniciar();

		for (int i = dadosOrdenados.length - 1; i > 0; i--) {
			for (int j = 0; j < i; j++) {
				comparacoes++;
				if (comparador.compare(dadosOrdenados[j], dadosOrdenados[j + 1]) > 0)
					swap(j, j + 1);
			}
		}

		terminar();
		return dadosOrdenados;
	}

	private void swap(int i, int j) {
		movimentacoes++;
		T temp = dadosOrdenados[i];
		dadosOrdenados[i] = dadosOrdenados[j];
		dadosOrdenados[j] = temp;
	}
}`.split('\n');

export const SELECTIONSORT_JAVA_CODE = `public class Selectionsort<T extends Comparable<T>> implements IOrdenator<T> {
	private T[] dadosOrdenados;
	private Comparator<T> comparador;
	private long comparacoes;
	private long movimentacoes;

	@Override
	public T[] ordenar(T[] dados) {
		dadosOrdenados = dados;
		comparacoes = 0;
		movimentacoes = 0;
		iniciar();

		for (int i = 0; i < (dadosOrdenados.length - 1); i++) {
			int menor = i;
			for (int j = (i + 1); j < dadosOrdenados.length; j++) {
				comparacoes++;
				if (comparador.compare(dadosOrdenados[menor], dadosOrdenados[j]) > 0)
					menor = j;
			}
			if (menor != i)
				swap(menor, i);
		}

		terminar();
		return dadosOrdenados;
	}

	private void swap(int i, int j) {
		movimentacoes++;
		T temp = dadosOrdenados[i];
		dadosOrdenados[i] = dadosOrdenados[j];
		dadosOrdenados[j] = temp;
	}
}`.split('\n');

export const INSERTIONSORT_JAVA_CODE = `public class Insertionsort<T extends Comparable<T>> implements IOrdenator<T> {
	private T[] dadosOrdenados;
	private Comparator<T> comparador;
	private long comparacoes;
	private long movimentacoes;

	@Override
	public T[] ordenar(T[] dados) {
		dadosOrdenados = dados;
		comparacoes = 0;
		movimentacoes = 0;
		iniciar();

		for (int i = 1; i < dadosOrdenados.length; i++) {
			T item = dadosOrdenados[i];
			int j = i - 1;

			while ((j >= 0) && (comparador.compare(dadosOrdenados[j], item) > 0)) {
				comparacoes++;
				movimentacoes++;
				dadosOrdenados[j + 1] = dadosOrdenados[j];
				j--;
			}
			movimentacoes++;
			dadosOrdenados[j + 1] = item;
		}

		terminar();
		return dadosOrdenados;
	}
}`.split('\n');

export const MERGESORT_JAVA_CODE = `public class Mergesort<T extends Comparable<T>> implements IOrdenator<T> {
	private T[] dadosOrdenados;
	private Comparator<T> comparador;
	private long comparacoes;
	private long movimentacoes;

	@Override
	public T[] ordenar(T[] dados) {
		dadosOrdenados = dados;
		comparacoes = 0;
		movimentacoes = 0;
		iniciar();
		mergesort(0, dadosOrdenados.length - 1);
		terminar();
		return dadosOrdenados;
	}

	private void mergesort(int esq, int dir) {
		if (esq < dir) {
			int meio = (esq + dir) / 2;
			mergesort(esq, meio);
			mergesort(meio + 1, dir);
			intercalar(esq, meio, dir);
		}
	}

	private void intercalar(int esq, int meio, int dir) {
		int n1 = meio - esq + 1;
		int n2 = dir - meio;
		T[] a1 = (T[]) new Comparable[n1];
		T[] a2 = (T[]) new Comparable[n2];

		for (int i = 0; i < n1; i++)
			a1[i] = dadosOrdenados[esq + i];
		for (int j = 0; j < n2; j++)
			a2[j] = dadosOrdenados[meio + 1 + j];

		int i, j, k;
		for (i = j = 0, k = esq; (i < n1 && j < n2); k++) {
			comparacoes++;
			movimentacoes++;
			if (comparador.compare(a1[i], a2[j]) < 0)
				dadosOrdenados[k] = a1[i++];
			else
				dadosOrdenados[k] = a2[j++];
		}

		if (i == n1)
			for (; k <= dir; k++) {
				movimentacoes++;
				dadosOrdenados[k] = a2[j++];
			}
		else
			for (; k <= dir; k++) {
				movimentacoes++;
				dadosOrdenados[k] = a1[i++];
			}
	}
}`.split('\n');

export const QUICKSORT_JAVA_CODE = `public class Quicksort<T extends Comparable<T>> implements IOrdenator<T> {
	private T[] dadosOrdenados;
	private Comparator<T> comparador;
	private long comparacoes;
	private long movimentacoes;

	@Override
	public T[] ordenar(T[] dados) {
		dadosOrdenados = dados;
		comparacoes = 0;
		movimentacoes = 0;
		iniciar();
		quicksort(0, dadosOrdenados.length - 1);
		terminar();
		return dadosOrdenados;
	}

	private void quicksort(int esq, int dir) {
		int part;
		if (esq < dir) {
			part = particao(esq, dir);
			quicksort(esq, part - 1);
			quicksort(part + 1, dir);
		}
	}

	private int particao(int inicio, int fim) {
		int meio = (inicio + fim) / 2;
		swap(meio, fim);
		T pivot = dadosOrdenados[fim];
		int part = inicio - 1;
		for (int i = inicio; i < fim; i++) {
			if (comparador.compare(dadosOrdenados[i], pivot) < 0) {
				part++;
				swap(part, i);
			}
		}
		part++;
		swap(part, fim);
		return (part);
	}

	private void swap(int i, int j) {
		movimentacoes++;
		T temp = dadosOrdenados[i];
		dadosOrdenados[i] = dadosOrdenados[j];
		dadosOrdenados[j] = temp;
	}
}`.split('\n');

export const HEAPSORT_JAVA_CODE = `public class Heapsort<T extends Comparable<T>> implements IOrdenator<T> {
	private T[] dadosOrdenados;
	private Comparator<T> comparador;
	private long comparacoes;
	private long movimentacoes;

	@Override
	public T[] ordenar(T[] dados) {
		dadosOrdenados = dados;
		comparacoes = 0;
		movimentacoes = 0;

		T[] tmp = (T[]) new Comparable[dadosOrdenados.length + 1];
		for (int i = 0; i < dadosOrdenados.length; i++) {
			tmp[i + 1] = dadosOrdenados[i];
		}

		// Construção do heap
		for (int tamHeap = (tmp.length - 1) / 2; tamHeap >= 1; tamHeap--) {
			restaura(tmp, tamHeap, tmp.length - 1);
		}

		// Ordenação propriamente dita
		int tamHeap = tmp.length - 1;
		swap(tmp, 1, tamHeap--);
		while (tamHeap > 1) {
			restaura(tmp, 1, tamHeap);
			swap(tmp, 1, tamHeap--);
		}

		// Alterar o vetor para voltar à posição zero
		for (int i = 0; i < dadosOrdenados.length; i++) {
			dadosOrdenados[i] = tmp[i + 1];
		}
		return dadosOrdenados;
	}

	private void restaura(T[] tmp, int i, int tamHeap) {
		int maior = i;
		int filho = getMaiorFilho(tmp, i, tamHeap);

		if (comparador.compare(tmp[i], tmp[filho]) < 0) {
			maior = filho;
		}
		if (maior != i) {
			swap(tmp, i, maior);
			if (maior <= tamHeap / 2) {
				restaura(tmp, maior, tamHeap);
			}
		}
	}

	private int getMaiorFilho(T[] tmp, int i, int tamHeap) {
		int filho;
		if (2 * i == tamHeap || (comparador.compare(tmp[2 * i], tmp[2 * i + 1]) > 0)) {
			filho = 2 * i;
		} else {
			filho = 2 * i + 1;
		}
		return filho;
	}

	private void swap(T[] dados, int i, int j) {
		movimentacoes++;
		T temp = dados[i];
		dados[i] = dados[j];
		dados[j] = temp;
	}
}`.split('\n');

export const SORTING_KEYS = [
  'bubblesort',
  'selectionsort',
  'insertionsort',
  'mergesort',
  'quicksort',
  'heapsort',
];

export const SORTING_CATALOG = {
  bubblesort: {
    id: 'bubblesort',
    category: 'sorting',
    title: 'Bubblesort (Método da Bolha)',
    shortName: 'Bubblesort',
    policyTag: 'Trocas Adjacentes • Estável',
    fileName: 'Bubblesort.java',
    summary:
      'Percorre o vetor múltiplas vezes comparando pares adjacentes (j e j+1) e trocando-os quando estão fora de ordem, fazendo o maior elemento "flutuar" até a posição final i de cada iteração.',
    primaryPointers: ['i', 'j'],
    invariantText: 'Subvetor [i+1 .. n-1] ordenado',
    operationsComplexity: [
      { name: 'Melhor caso (Comparações)', complexity: 'O(n²)' },
      { name: 'Caso médio / Pior caso', complexity: 'O(n²)' },
      { name: 'Movimentações (Melhor / Pior)', complexity: 'O(1) / O(n²)' },
      { name: 'Memória auxiliar', complexity: 'O(1) in-place' },
    ],
    codeLines: BUBBLESORT_JAVA_CODE,
    methodRanges: {
      ordenar: { start: 8, end: 24, name: 'ordenar(T[] dados)' },
      swap: { start: 26, end: 31, name: 'swap(int i, int j)' },
    },
    cards: [
      {
        tag: 'Dinâmica',
        title: 'Flutuação do Maior Elemento',
        body: 'A cada iteração do laço externo (i decrescendo de n-1 até 1), o laço interno (j de 0 até i-1) compara elementos vizinhos e empurra o maior valor da faixa não ordenada para a posição i.',
      },
      {
        tag: 'Índices',
        title: 'Controle por i e j',
        body: 'O índice i delimita o fim da região ainda não ordenada, enquanto j e j+1 percorrem os pares adjacentes. Após cada passada completa de j, a posição i fica definitivamente ordenada.',
      },
      {
        tag: 'Complexidade',
        title: 'Comparações vs. Movimentações',
        body: 'Sem flag de parada antecipada, realiza sempre n(n-1)/2 comparações — O(n²) em todos os casos. Já as movimentacoes (swaps) são 0 no melhor caso (vetor já ordenado) e O(n²) no pior caso.',
      },
    ],
  },
  selectionsort: {
    id: 'selectionsort',
    category: 'sorting',
    title: 'Selectionsort (Seleção Direta)',
    shortName: 'Selectionsort',
    policyTag: 'Seleção do Menor • Poucas Trocas',
    fileName: 'Selectionsort.java',
    summary:
      'A cada iteração i, localiza o índice "menor" contendo o menor elemento do subvetor [i .. n-1] e realiza no máximo uma única troca (swap) colocando-o na posição i.',
    primaryPointers: ['i', 'menor', 'j'],
    invariantText: 'Subvetor [0 .. i-1] ordenado',
    operationsComplexity: [
      { name: 'Melhor / Médio / Pior caso', complexity: 'O(n²)' },
      { name: 'Movimentações (Swaps)', complexity: 'O(n)' },
      { name: 'Memória auxiliar', complexity: 'O(1) in-place' },
    ],
    codeLines: SELECTIONSORT_JAVA_CODE,
    methodRanges: {
      ordenar: { start: 8, end: 27, name: 'ordenar(T[] dados)' },
      swap: { start: 29, end: 34, name: 'swap(int i, int j)' },
    },
    cards: [
      {
        tag: 'Dinâmica',
        title: 'Busca pelo Índice do Menor',
        body: 'Inicia assumindo menor = i e percorre o restante do vetor com j = i + 1 até n - 1. Sempre que encontra um elemento menor que dadosOrdenados[menor], atualiza o índice menor = j.',
      },
      {
        tag: 'Eficiência em Escritas',
        title: 'No Máximo O(n) Trocas',
        body: 'Ao final da varredura interna de j, a troca swap(menor, i) só ocorre se menor != i. Por isso, o Selectionsort realiza no máximo n - 1 movimentações de swap em toda a execução.',
      },
      {
        tag: 'Complexidade',
        title: 'Insensível à Ordem Inicial',
        body: 'Independentemente de o vetor já estar ordenado ou invertido, o laço interno percorre todos os elementos restantes, realizando sempre n(n-1)/2 comparações — O(n²) em todos os casos.',
      },
    ],
  },
  insertionsort: {
    id: 'insertionsort',
    category: 'sorting',
    title: 'Insertionsort (Inserção Direta)',
    shortName: 'Insertionsort',
    policyTag: 'Inserção na Sublista • Adaptativo',
    fileName: 'Insertionsort.java',
    summary:
      'Percorre o vetor a partir de i = 1, copia a chave "item = dadosOrdenados[i]" e desloca para a direita (j+1) todos os elementos anteriores que sejam maiores que "item", inserindo-o na posição correta.',
    primaryPointers: ['i', 'j', 'item'],
    invariantText: 'Subvetor [0 .. i-1] sempre ordenado',
    operationsComplexity: [
      { name: 'Melhor caso (já ordenado)', complexity: 'O(n)' },
      { name: 'Caso médio / Pior caso', complexity: 'O(n²)' },
      { name: 'Memória auxiliar', complexity: 'O(1) in-place' },
    ],
    codeLines: INSERTIONSORT_JAVA_CODE,
    methodRanges: {
      ordenar: { start: 8, end: 30, name: 'ordenar(T[] dados)' },
    },
    cards: [
      {
        tag: 'Dinâmica',
        title: 'Deslocamento em Vez de Swaps',
        body: 'Em vez de trocar pares repetidamente, guarda o valor atual em "item = dadosOrdenados[i]", abre espaço deslocando elementos maiores uma posição à direita (dadosOrdenados[j+1] = dadosOrdenados[j]) e grava item em j+1.',
      },
      {
        tag: 'Adaptatividade',
        title: 'Excelente para Vetores Quase Ordenados',
        body: 'Se dadosOrdenados[j] <= item já na primeira verificação do while, o laço interno não executa nenhum deslocamento, tornando o algoritmo extremamente rápido em dados parcialmente ordenados.',
      },
      {
        tag: 'Complexidade',
        title: 'O(n) no Melhor Caso e O(n²) no Pior',
        body: 'No melhor caso (vetor ordenado), faz apenas n - 1 comparações — O(n). No pior caso (vetor em ordem decrescente), desloca todos os elementos anteriores a cada passo — O(n²).',
      },
    ],
  },
  mergesort: {
    id: 'mergesort',
    category: 'sorting',
    title: 'Mergesort (Ordenação por Intercalação)',
    shortName: 'Mergesort',
    policyTag: 'Divisão e Conquista • Estável',
    fileName: 'Mergesort.java',
    summary:
      'Divide recursivamente o vetor ao meio (esq..meio e meio+1..dir) até subvetores unitários e depois intercala os segmentos ordenados usando os subvetores auxiliares a1 e a2.',
    primaryPointers: ['esq', 'meio', 'dir', 'k'],
    invariantText: 'Intercala a1[0..n1-1] e a2[0..n2-1]',
    operationsComplexity: [
      { name: 'Melhor / Médio / Pior caso', complexity: 'O(n log n)' },
      { name: 'Intercalação (intercalar)', complexity: 'O(n)' },
      { name: 'Memória auxiliar (a1 e a2)', complexity: 'O(n)' },
    ],
    codeLines: MERGESORT_JAVA_CODE,
    methodRanges: {
      ordenar: { start: 8, end: 16, name: 'ordenar(T[] dados)' },
      mergesort: { start: 18, end: 25, name: 'mergesort(int esq, int dir)' },
      intercalar: { start: 27, end: 58, name: 'intercalar(int esq, int meio, int dir)' },
    },
    cards: [
      {
        tag: 'Divisão e Conquista',
        title: 'Árvore de Chamadas Recursivas',
        body: 'O método mergesort(esq, dir) calcula meio = (esq + dir) / 2, ordena recursivamente a metade esquerda [esq..meio], depois a metade direita [meio+1..dir], e por fim combina ambas com intercalar.',
      },
      {
        tag: 'Subvetores Auxiliares',
        title: 'Vetores a1 e a2 na Intercalação',
        body: 'intercalar copia a metade esquerda para a1 (tamanho n1) e a direita para a2 (tamanho n2). Os índices i e j avançam pelo menor elemento entre a1[i] e a2[j], gravando em dadosOrdenados[k].',
      },
      {
        tag: 'Complexidade',
        title: 'Garantia de O(n log n)',
        body: 'Como a divisão é sempre balanceada ao meio (altura log₂ n) e as intercalações de cada nível processam n elementos no total, o tempo é garantidamente O(n log n) em todos os casos, usando O(n) de memória auxiliar.',
      },
    ],
  },
  quicksort: {
    id: 'quicksort',
    category: 'sorting',
    title: 'Quicksort (Ordenação Rápida)',
    shortName: 'Quicksort',
    policyTag: 'Particionamento por Pivô no Meio',
    fileName: 'Quicksort.java',
    summary:
      'Seleciona o elemento central da partição (meio = (inicio + fim) / 2) como pivô movendo-o para o fim com swap(meio, fim), rearranja os elementos menores à esquerda de "part" e maiores à direita, e ordena recursivamente as subpartições.',
    primaryPointers: ['inicio', 'meio', 'fim', 'part', 'i'],
    invariantText: 'Elementos < pivot à esquerda de part',
    operationsComplexity: [
      { name: 'Melhor caso / Caso médio', complexity: 'O(n log n)' },
      { name: 'Pior caso (partições desbalanceadas)', complexity: 'O(n²)' },
      { name: 'Memória auxiliar (pilha recursão)', complexity: 'O(log n)' },
    ],
    codeLines: QUICKSORT_JAVA_CODE,
    methodRanges: {
      ordenar: { start: 8, end: 16, name: 'ordenar(T[] dados)' },
      quicksort: { start: 18, end: 25, name: 'quicksort(int esq, int dir)' },
      particao: { start: 27, end: 41, name: 'particao(int inicio, int fim)' },
      swap: { start: 43, end: 48, name: 'swap(int i, int j)' },
    },
    cards: [
      {
        tag: 'Particionamento',
        title: 'Escolha do Pivô no Meio',
        body: 'No método particao(inicio, fim), calcula-se meio = (inicio + fim) / 2, troca-se swap(meio, fim) e pivot recebe dadosOrdenados[fim]. Sempre que dadosOrdenados[i] < pivot, incrementa-se part e troca-se swap(part, i).',
      },
      {
        tag: 'Posição Definitiva',
        title: 'Posicionamento Final do Pivô',
        body: 'Ao encerrar o laço for de i, incrementa-se part++ e executa-se swap(part, fim). Nesse instante, o pivô fica em sua posição definitiva no vetor ordenado e divide as chamadas recursivas.',
      },
      {
        tag: 'Complexidade',
        title: 'Vantagem do Pivô Central',
        body: 'Ao escolher o elemento do meio como pivô, vetores já ordenados ou em ordem inversa deixam de ser o pior caso degenerado, mantendo a divisão equilibrada em O(n log n).',
      },
    ],
  },
  heapsort: {
    id: 'heapsort',
    category: 'sorting',
    title: 'Heapsort (Ordenação por Heap)',
    shortName: 'Heapsort',
    policyTag: 'Max-Heap em Vetor (1..n)',
    fileName: 'Heapsort.java',
    summary:
      'Utiliza um vetor auxiliar tmp indexado de 1 a n (ignorando a posição 0), constrói um Max-Heap com restaura() e extrai sucessivamente a raiz (maior elemento) trocando tmp[1] com tmp[tamHeap].',
    primaryPointers: ['tamHeap', 'i', 'filho', 'maior'],
    invariantText: 'tmp[1] é o maior em [1 .. tamHeap]',
    operationsComplexity: [
      { name: 'Construção do Heap', complexity: 'O(n)' },
      { name: 'Melhor / Médio / Pior caso', complexity: 'O(n log n)' },
      { name: 'Restauração (restaura)', complexity: 'O(log n)' },
    ],
    codeLines: HEAPSORT_JAVA_CODE,
    methodRanges: {
      ordenar: { start: 8, end: 36, name: 'ordenar(T[] dados)' },
      restaura: { start: 38, end: 51, name: 'restaura(T[] tmp, int i, int tamHeap)' },
      getMaiorFilho: { start: 53, end: 61, name: 'getMaiorFilho(T[] tmp, int i, int tamHeap)' },
      swap: { start: 63, end: 68, name: 'swap(T[] dados, int i, int j)' },
    },
    cards: [
      {
        tag: 'Indexação 1..n',
        title: 'Vetor tmp Ignorando a Posição Zero',
        body: 'Os elementos são copiados para tmp[1..n] deixando tmp[0] vazio. Isso simplifica a aritmética da árvore binária: para um nó i, o filho esquerdo está em 2*i e o filho direito em 2*i + 1.',
      },
      {
        tag: 'Duas Fases',
        title: 'Construção do Heap e Extração da Raiz',
        body: 'Na 1ª fase, restaura() é chamado de n/2 até 1 para montar o Max-Heap. Na 2ª fase, troca-se a raiz tmp[1] (maior item) com a última folha ativa tmp[tamHeap], reduz-se tamHeap e restaura-se a raiz.',
      },
      {
        tag: 'Complexidade',
        title: 'O(n log n) Garantido',
        body: 'Cada chamada a restaura() desce no máximo a altura da árvore (O(log n)). Como são feitas n - 1 extrações após a construção O(n), o tempo total é O(n log n) no melhor, médio e pior caso.',
      },
    ],
  },
};
