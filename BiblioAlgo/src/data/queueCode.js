export const QUEUE_JAVA_CODE = `public class Fila<E> {
	private Celula<E> frente;
	private Celula<E> tras;

	public Fila() {
		Celula<E> sentinela = new Celula<E>();
		frente = tras = sentinela;
	}

	public boolean vazia() {
		return (frente == tras);
	}

	public void enfileirar(E item) {
		Celula<E> novaCelula = new Celula<E>(item);
		tras.setProximo(novaCelula);
		tras = tras.getProximo();
	}

	public E desenfileirar() {
		E item = null;
		Celula<E> primeiro;
		item = consultarPrimeiro();
		primeiro = frente.getProximo();
		frente.setProximo(primeiro.getProximo());
		primeiro.setProximo(null);
		// Caso o item desenfileirado seja também o último da fila.
		if (primeiro == tras)
			tras = frente;
		return item;
	}

	public E consultarPrimeiro() {
		if (vazia()) {
			throw new NoSuchElementException("Nao há nenhum item na fila!");
		}
		return frente.getProximo().getItem();
	}
}`.split('\n');

export const STACK_JAVA_CODE = `public class Pilha<E> {
	private Celula<E> topo;
	private Celula<E> fundo;

	public Pilha() {
		Celula<E> sentinela = new Celula<E>();
		fundo = sentinela;
		topo = sentinela;
	}

	public boolean vazia() {
		return fundo == topo;
	}

	public void empilhar(E item) {
		topo = new Celula<E>(item, topo);
	}

	public E desempilhar() {
		E desempilhado = consultarTopo();
		topo = topo.getProximo();
		return desempilhado;
	}

	public E consultarTopo() {
		if (vazia()) {
			throw new NoSuchElementException("Nao há nenhum item na pilha!");
		}
		return topo.getItem();
	}
}`.split('\n');

export const LIST_JAVA_CODE = `public class Lista<E> {
	private Celula<E> primeiro;
	private Celula<E> ultimo;
	private int tamanho;

	public Lista() {
		Celula<E> sentinela = new Celula<>();
		this.primeiro = this.ultimo = sentinela;
		this.tamanho = 0;
	}

	public boolean vazia() {
		return (this.primeiro == this.ultimo);
	}

	public void inserir(E novo, int posicao) {
		Celula<E> anterior, novaCelula, proximaCelula;
		if ((posicao < 0) || (posicao > this.tamanho))
			throw new IndexOutOfBoundsException("Não foi possível inserir o item na lista: "
					+ "a posição informada é inválida!");
		anterior = this.primeiro;
		for (int i = 0; i < posicao; i++)
			anterior = anterior.getProximo();
		novaCelula = new Celula<>(novo);
		proximaCelula = anterior.getProximo();
		anterior.setProximo(novaCelula);
		novaCelula.setProximo(proximaCelula);
		if (posicao == this.tamanho)  // a inserção ocorreu na última posição da lista
			this.ultimo = novaCelula;
		this.tamanho++;
	}

	public E remover(int posicao) {
		Celula<E> anterior, celulaRemovida, proximaCelula;
		if (vazia())
			throw new IllegalStateException("Não foi possível remover o item da lista: "
					+ "a lista está vazia!");
		if ((posicao < 0) || (posicao >= this.tamanho ))
			throw new IndexOutOfBoundsException("Não foi possível remover o item da lista: "
					+ "a posição informada é inválida!");
		anterior = this.primeiro;
		for (int i = 0; i < posicao; i++)
			anterior = anterior.getProximo();
		celulaRemovida = anterior.getProximo();
		proximaCelula = celulaRemovida.getProximo();
		anterior.setProximo(proximaCelula);
		celulaRemovida.setProximo(null);
		if (celulaRemovida == this.ultimo)
			this.ultimo = anterior;
		this.tamanho--;
		return (celulaRemovida.getItem());
	}
}`.split('\n');

export const STRUCTURES_CATALOG = {
  fila: {
    id: 'fila',
    title: 'Fila Encadeada',
    shortName: 'Fila',
    policyTag: 'FIFO (First-In, First-Out)',
    complexityTag: 'O(1)',
    fileName: 'Fila.java',
    summary:
      'Estrutura linear em que as inserções ocorrem no final (tras) e as remoções ocorrem no início (após a célula sentinela apontada por frente).',
    operationsList: ['enfileirar(item)', 'desenfileirar()', 'consultarPrimeiro()', 'vazia()'],
    codeLines: QUEUE_JAVA_CODE,
    primaryPointers: ['frente', 'tras'],
    emptyInvariantText: 'frente == tras',
    methodRanges: {
      construtor: { start: 5, end: 8, name: 'Fila() [Construtor]' },
      vazia: { start: 10, end: 12, name: 'vazia()' },
      enfileirar: { start: 14, end: 18, name: 'enfileirar(E item)' },
      desenfileirar: { start: 20, end: 31, name: 'desenfileirar()' },
      consultarPrimeiro: { start: 33, end: 38, name: 'consultarPrimeiro()' },
    },
    cards: [
      {
        tag: 'Estrutura',
        title: 'Célula Sentinela (Cabeça)',
        body: 'Permanece fixa no início da fila com item = null. Elimina casos especiais de ponteiro nulo ao inserir o primeiro elemento ou remover elementos iniciais.',
      },
      {
        tag: 'Ponteiros',
        title: 'Frente e Trás',
        body: 'frente referencia a sentinela; tras referencia o último nó. O primeiro item útil está em frente.getProximo(), e a fila está vazia quando frente == tras.',
      },
      {
        tag: 'Complexidade',
        title: 'Operações em O(1)',
        body: 'Graças aos ponteiros diretos frente e tras, todas as operações básicas (enfileirar, desenfileirar, consultarPrimeiro e vazia) executam em tempo constante O(1).',
      },
    ],
  },
  pilha: {
    id: 'pilha',
    title: 'Pilha Encadeada',
    shortName: 'Pilha',
    policyTag: 'LIFO (Last-In, First-Out)',
    complexityTag: 'O(1)',
    fileName: 'Pilha.java',
    summary:
      'Estrutura linear em que tanto a inserção quanto a remoção ocorrem na mesma extremidade (topo), mantendo uma célula sentinela fixa na base (fundo).',
    operationsList: ['empilhar(item)', 'desempilhar()', 'consultarTopo()', 'vazia()'],
    codeLines: STACK_JAVA_CODE,
    primaryPointers: ['topo', 'fundo'],
    emptyInvariantText: 'fundo == topo',
    methodRanges: {
      construtor: { start: 5, end: 9, name: 'Pilha() [Construtor]' },
      vazia: { start: 11, end: 13, name: 'vazia()' },
      empilhar: { start: 15, end: 17, name: 'empilhar(E item)' },
      desempilhar: { start: 19, end: 23, name: 'desempilhar()' },
      consultarTopo: { start: 25, end: 30, name: 'consultarTopo()' },
    },
    cards: [
      {
        tag: 'Estrutura',
        title: 'Sentinela no Fundo',
        body: 'Na Pilha encadeada, a célula sentinela marca a base (fundo) com item = null e proximo = null. Os novos elementos são empilhados antes dela.',
      },
      {
        tag: 'Ponteiros',
        title: 'Topo e Fundo',
        body: 'topo aponta diretamente para o elemento mais recente; cada célula aponta para a célula abaixo dela até chegar em fundo (sentinela). Pilha vazia: fundo == topo.',
      },
      {
        tag: 'Complexidade',
        title: 'Operações em O(1)',
        body: 'empilhar aloca a célula já apontando para o antigo topo (new Celula(item, topo)), e desempilhar apenas avança topo = topo.getProximo(), ambos em O(1).',
      },
    ],
  },
  lista: {
    id: 'lista',
    title: 'Lista Encadeada',
    shortName: 'Lista',
    policyTag: 'Inserção e Remoção por Posição',
    complexityTag: 'O(n)',
    fileName: 'Lista.java',
    summary:
      'Estrutura linear flexível que permite inserir e remover elementos em qualquer índice válido [0 .. tamanho] percorrendo os ponteiros a partir da sentinela.',
    operationsList: ['inserir(novo, posicao)', 'remover(posicao)', 'vazia()'],
    codeLines: LIST_JAVA_CODE,
    primaryPointers: ['primeiro', 'ultimo'],
    emptyInvariantText: 'primeiro == ultimo',
    methodRanges: {
      construtor: { start: 6, end: 10, name: 'Lista() [Construtor]' },
      vazia: { start: 12, end: 14, name: 'vazia()' },
      inserir: { start: 16, end: 31, name: 'inserir(E novo, int posicao)' },
      remover: { start: 33, end: 52, name: 'remover(int posicao)' },
    },
    cards: [
      {
        tag: 'Estrutura',
        title: 'Sentinela e Tamanho',
        body: 'primeiro aponta para a sentinela (cabeça). O atributo tamanho registra a quantidade de células úteis, permitindo validar posições em O(1).',
      },
      {
        tag: 'Caminhamento',
        title: 'Ponteiro Auxiliar Anterior',
        body: 'Para atuar na posição k, o ponteiro anterior parte de primeiro (sentinela) e avança k vezes no laço for, parando na célula imediatamente anterior ao alvo.',
      },
      {
        tag: 'Complexidade',
        title: 'Operações em O(n)',
        body: 'Enquanto vazia() roda em O(1), inserir(novo, posicao) e remover(posicao) percorrem até posicao células a partir da sentinela, resultando em O(n) no pior caso.',
      },
    ],
  },
};
