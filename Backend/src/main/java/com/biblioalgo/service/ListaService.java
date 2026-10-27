package com.biblioalgo.service;

import com.biblioalgo.dto.ExecutionTrace;
import com.biblioalgo.dto.NodeSnapshot;
import com.biblioalgo.dto.PointerSnapshot;
import com.biblioalgo.dto.StepSnapshot;
import com.biblioalgo.model.Celula;
import com.biblioalgo.model.Lista;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ListaService {

    private Lista<Object> lista;

    public ListaService() {
        this.lista = new Lista<>();
    }

    public synchronized ExecutionTrace reset() {
        this.lista = new Lista<>();
        List<StepSnapshot> steps = new ArrayList<>();
        String sentinelaId = lista.getPrimeiro().getId();

        steps.add(StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(7)
                .codeLine("Celula<E> sentinela = new Celula<>();")
                .method("construtor")
                .description("Aloca a célula sentinela (cabeça da lista) na memória com item = null e proximo = null. A referência local 'sentinela' aponta para ela.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(List.of(
                        PointerSnapshot.builder()
                                .nome("sentinela")
                                .targetNodeId(sentinelaId)
                                .tipo("local")
                                .cor("#f59e0b")
                                .build()
                ))
                .variables(Collections.emptyMap())
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(1)
                .lineNumber(8)
                .codeLine("this.primeiro = this.ultimo = sentinela;")
                .method("construtor")
                .description("As referências 'primeiro' e 'ultimo' recebem o endereço guardado em 'sentinela', passando a apontar para a célula cabeça.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("sentinela", sentinelaId, null, null))
                .variables(Collections.emptyMap())
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(2)
                .lineNumber(9)
                .codeLine("this.tamanho = 0;")
                .method("construtor")
                .description("Inicializa o atributo 'tamanho' com 0.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("sentinela", sentinelaId, null, null))
                .variables(Map.of("tamanho", 0))
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(3)
                .lineNumber(10)
                .codeLine("}")
                .method("construtor")
                .description("Fim do construtor. A variável local 'sentinela' sai de escopo; 'primeiro' e 'ultimo' permanecem apontando para a célula sentinela (lista vazia: primeiro == ultimo).")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("tamanho", 0))
                .build());

        return ExecutionTrace.builder()
                .method("construtor")
                .steps(steps)
                .success(true)
                .message("Lista reiniciada com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace getCurrentState() {
        if (lista.vazia()) {
            return reset();
        }
        List<StepSnapshot> steps = new ArrayList<>();
        steps.add(StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(10)
                .codeLine("}")
                .method("construtor")
                .description("Estado atual da lista na memória.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("tamanho", lista.getTamanho()))
                .build());

        return ExecutionTrace.builder()
                .method("construtor")
                .steps(steps)
                .success(true)
                .message("Estado atual da lista obtido.")
                .build();
    }

    public synchronized ExecutionTrace inserir(Object novo, int posicao) {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;
        int tamAtual = lista.getTamanho();

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(18)
                .codeLine("if ((posicao < 0) || (posicao > this.tamanho))")
                .method("inserir")
                .description("Valida a posição informada (" + posicao + ") em relação ao intervalo permitido [0 .. " + tamAtual + "].")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("novo", novo, "posicao", posicao, "tamanho", tamAtual))
                .build());

        if (posicao < 0 || posicao > tamAtual) {
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(19)
                    .codeLine("throw new IndexOutOfBoundsException(\"Não foi possível inserir o item na lista: a posição informada é inválida!\");")
                    .method("inserir")
                    .description("Posição inválida! Para uma lista de tamanho " + tamAtual + ", a posição deve estar entre 0 e " + tamAtual + ".")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .variables(Map.of("posicao", posicao, "tamanho", tamAtual))
                    .erro(true)
                    .mensagemErro("IndexOutOfBoundsException: a posição informada (" + posicao + ") é inválida!")
                    .build());

            return ExecutionTrace.builder()
                    .method("inserir")
                    .steps(steps)
                    .success(false)
                    .message("Posição inválida.")
                    .build();
        }

        Celula<Object> anterior = lista.getPrimeiro();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(21)
                .codeLine("anterior = this.primeiro;")
                .method("inserir")
                .description("Posiciona o ponteiro auxiliar 'anterior' na célula sentinela ('primeiro') para iniciar o caminhamento.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("anterior", anterior.getId(), null, null))
                .variables(Map.of("novo", novo, "posicao", posicao, "tamanho", tamAtual))
                .build());

        for (int i = 0; i < posicao; i++) {
            anterior = anterior.getProximo();
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(23)
                    .codeLine("anterior = anterior.getProximo();")
                    .method("inserir")
                    .description("Iteração i = " + i + ": avança 'anterior' para a célula #" + anterior.getId() + ".")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers("anterior", anterior.getId(), null, null))
                    .variables(Map.of("novo", novo, "posicao", posicao, "i", i, "tamanho", tamAtual))
                    .build());
        }

        Celula<Object> novaCelula = new Celula<>(novo);
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(24)
                .codeLine("novaCelula = new Celula<>(novo);")
                .method("inserir")
                .description("Aloca 'novaCelula' na memória com o item '" + novo + "'.")
                .nodes(captureCurrentNodes(novaCelula, null))
                .pointers(capturePointers("anterior", anterior.getId(), "novaCelula", novaCelula.getId()))
                .variables(Map.of("novo", novo, "posicao", posicao, "tamanho", tamAtual))
                .build());

        Celula<Object> proximaCelula = anterior.getProximo();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(25)
                .codeLine("proximaCelula = anterior.getProximo();")
                .method("inserir")
                .description(proximaCelula != null
                        ? "Guarda em 'proximaCelula' a referência para #" + proximaCelula.getId() + " (que ficará após a nova célula)."
                        : "Como a inserção é no fim da lista, 'proximaCelula' recebe null.")
                .nodes(captureCurrentNodes(novaCelula, null))
                .pointers(capturePointers("anterior", anterior.getId(), "novaCelula", novaCelula.getId()))
                .variables(Map.of("novo", novo, "posicao", posicao, "proximaCelula", proximaCelula != null ? "#" + proximaCelula.getId() : "null"))
                .build());

        anterior.setProximo(novaCelula);
        novaCelula.setProximo(proximaCelula);
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(27)
                .codeLine("novaCelula.setProximo(proximaCelula);")
                .method("inserir")
                .description("Encadeia a nova célula: 'anterior.proximo' aponta para 'novaCelula' e 'novaCelula.proximo' aponta para 'proximaCelula'.")
                .nodes(captureCurrentNodes(novaCelula, null))
                .pointers(capturePointers("anterior", anterior.getId(), "novaCelula", novaCelula.getId()))
                .variables(Map.of("novo", novo, "posicao", posicao, "tamanho", tamAtual))
                .build());

        if (posicao == tamAtual) {
            lista.setUltimo(novaCelula);
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(29)
                    .codeLine("this.ultimo = novaCelula;")
                    .method("inserir")
                    .description("Como a inserção ocorreu na última posição (posicao == tamanho), atualiza 'ultimo' para apontar para 'novaCelula'.")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers("anterior", anterior.getId(), "novaCelula", novaCelula.getId()))
                    .variables(Map.of("novo", novo, "posicao", posicao, "tamanho", tamAtual))
                    .build());
        }

        lista.setTamanho(tamAtual + 1);
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(30)
                .codeLine("this.tamanho++;")
                .method("inserir")
                .description("Incrementa o contador de elementos da lista: tamanho passa a ser " + lista.getTamanho() + ".")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("tamanho", lista.getTamanho()))
                .build());

        return ExecutionTrace.builder()
                .method("inserir")
                .steps(steps)
                .success(true)
                .result(novo)
                .message("Item inserido na posição " + posicao + ".")
                .build();
    }

    public synchronized ExecutionTrace remover(int posicao) {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;
        int tamAtual = lista.getTamanho();

        if (lista.vazia()) {
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(35)
                    .codeLine("if (vazia())")
                    .method("remover")
                    .description("Verifica se a lista está vazia (primeiro == ultimo): verdadeiro!")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .variables(Map.of("tamanho", 0))
                    .build());

            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(36)
                    .codeLine("throw new IllegalStateException(\"Não foi possível remover o item da lista: a lista está vazia!\");")
                    .method("remover")
                    .description("Exceção lançada: Não é possível remover de uma lista vazia!")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .erro(true)
                    .mensagemErro("IllegalStateException: a lista está vazia!")
                    .build());

            return ExecutionTrace.builder()
                    .method("remover")
                    .steps(steps)
                    .success(false)
                    .message("Lista vazia.")
                    .build();
        }

        if (posicao < 0 || posicao >= tamAtual) {
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(38)
                    .codeLine("if ((posicao < 0) || (posicao >= this.tamanho ))")
                    .method("remover")
                    .description("Posição inválida (" + posicao + "). Os índices existentes vão de 0 até " + (tamAtual - 1) + ".")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .variables(Map.of("posicao", posicao, "tamanho", tamAtual))
                    .erro(true)
                    .mensagemErro("IndexOutOfBoundsException: a posição informada (" + posicao + ") é inválida!")
                    .build());

            return ExecutionTrace.builder()
                    .method("remover")
                    .steps(steps)
                    .success(false)
                    .message("Posição inválida.")
                    .build();
        }

        Celula<Object> anterior = lista.getPrimeiro();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(41)
                .codeLine("anterior = this.primeiro;")
                .method("remover")
                .description("Inicia o ponteiro 'anterior' na célula sentinela ('primeiro').")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("anterior", anterior.getId(), null, null))
                .variables(Map.of("posicao", posicao, "tamanho", tamAtual))
                .build());

        for (int i = 0; i < posicao; i++) {
            anterior = anterior.getProximo();
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(43)
                    .codeLine("anterior = anterior.getProximo();")
                    .method("remover")
                    .description("Iteração i = " + i + ": avança 'anterior' até a célula imediatamente anterior à posição " + posicao + ".")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers("anterior", anterior.getId(), null, null))
                    .variables(Map.of("posicao", posicao, "i", i, "tamanho", tamAtual))
                    .build());
        }

        Celula<Object> celulaRemovida = anterior.getProximo();
        Celula<Object> proximaCelula = celulaRemovida.getProximo();

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(44)
                .codeLine("celulaRemovida = anterior.getProximo();")
                .method("remover")
                .description("Identifica a célula na posição " + posicao + " (#" + celulaRemovida.getId() + ", item = '" + celulaRemovida.getItem() + "') para remoção.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("anterior", anterior.getId(), "celulaRemovida", celulaRemovida.getId()))
                .variables(Map.of("posicao", posicao, "item", celulaRemovida.getItem()))
                .build());

        anterior.setProximo(proximaCelula);
        celulaRemovida.setProximo(null);

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(47)
                .codeLine("celulaRemovida.setProximo(null);")
                .method("remover")
                .description("Desvincula 'celulaRemovida': 'anterior.proximo' salta para 'proximaCelula' e 'celulaRemovida.proximo' recebe null.")
                .nodes(captureCurrentNodes(null, celulaRemovida))
                .pointers(capturePointers("anterior", anterior.getId(), "celulaRemovida", celulaRemovida.getId()))
                .variables(Map.of("posicao", posicao, "item", celulaRemovida.getItem()))
                .build());

        if (celulaRemovida == lista.getUltimo()) {
            lista.setUltimo(anterior);
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(49)
                    .codeLine("this.ultimo = anterior;")
                    .method("remover")
                    .description("Como a célula removida era a última da lista, recua o ponteiro 'ultimo' para 'anterior'.")
                    .nodes(captureCurrentNodes(null, celulaRemovida))
                    .pointers(capturePointers("anterior", anterior.getId(), "celulaRemovida", celulaRemovida.getId()))
                    .variables(Map.of("posicao", posicao))
                    .build());
        }

        lista.setTamanho(tamAtual - 1);
        Object itemRemovido = celulaRemovida.getItem();

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(51)
                .codeLine("return (celulaRemovida.getItem());")
                .method("remover")
                .description("Decrementa tamanho para " + lista.getTamanho() + " e retorna o item removido: '" + itemRemovido + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("tamanho", lista.getTamanho()))
                .returnValue(itemRemovido)
                .build());

        return ExecutionTrace.builder()
                .method("remover")
                .steps(steps)
                .success(true)
                .result(itemRemovido)
                .message("Item removido da posição " + posicao + ".")
                .build();
    }

    public synchronized ExecutionTrace vazia() {
        List<StepSnapshot> steps = new ArrayList<>();
        boolean estaVazia = lista.vazia();

        steps.add(StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(13)
                .codeLine("return (this.primeiro == this.ultimo);")
                .method("vazia")
                .description("Compara (primeiro == ultimo): " + estaVazia + " (tamanho = " + lista.getTamanho() + ").")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("primeiro == ultimo", estaVazia, "tamanho", lista.getTamanho()))
                .returnValue(estaVazia)
                .build());

        return ExecutionTrace.builder()
                .method("vazia")
                .steps(steps)
                .success(true)
                .result(estaVazia)
                .message("Lista vazia: " + estaVazia)
                .build();
    }

    private List<NodeSnapshot> captureCurrentNodes(Celula<Object> novoNo, Celula<Object> noRemovido) {
        List<NodeSnapshot> nodes = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        Celula<Object> aux = lista.getPrimeiro();
        boolean isFirst = true;
        while (aux != null && !visited.contains(aux.getId())) {
            visited.add(aux.getId());
            boolean isNovo = (novoNo != null && aux == novoNo);
            nodes.add(NodeSnapshot.builder()
                    .id(aux.getId())
                    .valor(aux.getItem())
                    .proximoId(aux.getProximo() != null ? aux.getProximo().getId() : null)
                    .sentinela(isFirst)
                    .novo(isNovo)
                    .removido(false)
                    .build());
            isFirst = false;
            aux = aux.getProximo();
        }

        if (novoNo != null && !visited.contains(novoNo.getId())) {
            nodes.add(NodeSnapshot.builder()
                    .id(novoNo.getId())
                    .valor(novoNo.getItem())
                    .proximoId(novoNo.getProximo() != null ? novoNo.getProximo().getId() : null)
                    .sentinela(false)
                    .novo(true)
                    .removido(false)
                    .build());
        }

        if (noRemovido != null && !visited.contains(noRemovido.getId())) {
            nodes.add(NodeSnapshot.builder()
                    .id(noRemovido.getId())
                    .valor(noRemovido.getItem())
                    .proximoId(noRemovido.getProximo() != null ? noRemovido.getProximo().getId() : null)
                    .sentinela(false)
                    .novo(false)
                    .removido(true)
                    .build());
        }

        return nodes;
    }

    private List<PointerSnapshot> capturePointers(String localName1, String localTarget1, String localName2, String localTarget2) {
        List<PointerSnapshot> pointers = new ArrayList<>();

        if (lista.getPrimeiro() != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome("primeiro")
                    .targetNodeId(lista.getPrimeiro().getId())
                    .tipo("atributo")
                    .cor("#3b82f6")
                    .build());
        }

        if (lista.getUltimo() != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome("ultimo")
                    .targetNodeId(lista.getUltimo().getId())
                    .tipo("atributo")
                    .cor("#10b981")
                    .build());
        }

        if (localName1 != null && localTarget1 != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome(localName1)
                    .targetNodeId(localTarget1)
                    .tipo("local")
                    .cor("#f59e0b")
                    .build());
        }

        if (localName2 != null && localTarget2 != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome(localName2)
                    .targetNodeId(localTarget2)
                    .tipo("local")
                    .cor("#8b5cf6")
                    .build());
        }

        return pointers;
    }
}
