package com.biblioalgo.service;

import com.biblioalgo.dto.ExecutionTrace;
import com.biblioalgo.dto.NodeSnapshot;
import com.biblioalgo.dto.PointerSnapshot;
import com.biblioalgo.dto.StepSnapshot;
import com.biblioalgo.model.Celula;
import com.biblioalgo.model.Pilha;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PilhaService {

    private Pilha<Object> pilha;

    public PilhaService() {
        this.pilha = new Pilha<>();
    }

    public synchronized ExecutionTrace reset() {
        this.pilha = new Pilha<>();
        List<StepSnapshot> steps = new ArrayList<>();

        steps.add(StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(6)
                .codeLine("Celula<E> sentinela = new Celula<E>();")
                .method("construtor")
                .description("Aloca a célula sentinela (fundo da pilha) na memória com item = null e proximo = null.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("sentinela", pilha.getFundo().getId()))
                .variables(Map.of("sentinela", pilha.getFundo().getId()))
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(1)
                .lineNumber(8)
                .codeLine("topo = sentinela;")
                .method("construtor")
                .description("Pilha inicializada. Os ponteiros 'topo' e 'fundo' apontam ambos para a célula sentinela (fundo == topo).")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Collections.emptyMap())
                .build());

        return ExecutionTrace.builder()
                .method("construtor")
                .steps(steps)
                .success(true)
                .message("Pilha reiniciada com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace getCurrentState() {
        List<StepSnapshot> steps = new ArrayList<>();
        steps.add(StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(8)
                .codeLine("topo = sentinela;")
                .method("construtor")
                .description("Estado atual da pilha na memória.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Collections.emptyMap())
                .build());

        return ExecutionTrace.builder()
                .method("construtor")
                .steps(steps)
                .success(true)
                .message("Estado atual da pilha obtido.")
                .build();
    }

    public synchronized ExecutionTrace empilhar(Object item) {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(15)
                .codeLine("public void empilhar(E item) {")
                .method("empilhar")
                .description("Início de empilhar(item). Recebido item = '" + item + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Map.of("item", item))
                .build());

        Celula<Object> novaCelula = new Celula<>(item, pilha.getTopo());
        pilha.setTopo(novaCelula);

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(16)
                .codeLine("topo = new Celula<E>(item, topo);")
                .method("empilhar")
                .description("Aloca nova célula no topo com item = '" + item + "', aponta seu 'proximo' para o antigo topo e atualiza 'topo'.")
                .nodes(captureCurrentNodes(novaCelula, null))
                .pointers(capturePointers(null, null))
                .variables(Map.of("item", item, "topo", novaCelula.getId()))
                .build());

        return ExecutionTrace.builder()
                .method("empilhar")
                .steps(steps)
                .success(true)
                .result(item)
                .message("Item '" + item + "' empilhado com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace desempilhar() {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(19)
                .codeLine("public E desempilhar() {")
                .method("desempilhar")
                .description("Início da execução de desempilhar().")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Collections.emptyMap())
                .build());

        if (pilha.vazia()) {
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(26)
                    .codeLine("if (vazia()) {")
                    .method("consultarTopo")
                    .description("consultarTopo() verifica vazia(): fundo == topo é verdadeiro!")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null))
                    .variables(Map.of("vazia()", true))
                    .build());

            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(27)
                    .codeLine("throw new NoSuchElementException(\"Nao há nenhum item na pilha!\");")
                    .method("consultarTopo")
                    .description("Exceção lançada: Pilha vazia! Não há elemento no topo para desempilhar.")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null))
                    .erro(true)
                    .mensagemErro("Nao há nenhum item na pilha!")
                    .build());

            return ExecutionTrace.builder()
                    .method("desempilhar")
                    .steps(steps)
                    .success(false)
                    .message("Erro: Pilha vazia.")
                    .build();
        }

        Celula<Object> antigoTopo = pilha.getTopo();
        Object desempilhado = antigoTopo.getItem();

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(20)
                .codeLine("E desempilhado = consultarTopo();")
                .method("desempilhar")
                .description("Obtém o item atualmente no topo da pilha: desempilhado = '" + desempilhado + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Map.of("desempilhado", desempilhado))
                .build());

        pilha.setTopo(antigoTopo.getProximo());

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(21)
                .codeLine("topo = topo.getProximo();")
                .method("desempilhar")
                .description("Avança o ponteiro 'topo' para a célula seguinte (topo.getProximo()), desvinculando o antigo topo.")
                .nodes(captureCurrentNodes(null, antigoTopo))
                .pointers(capturePointers(null, null))
                .variables(Map.of("desempilhado", desempilhado, "topo", pilha.getTopo().getId()))
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(22)
                .codeLine("return desempilhado;")
                .method("desempilhar")
                .description("Retorna o item desempilhado: '" + desempilhado + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Map.of("desempilhado", desempilhado))
                .returnValue(desempilhado)
                .build());

        return ExecutionTrace.builder()
                .method("desempilhar")
                .steps(steps)
                .success(true)
                .result(desempilhado)
                .message("Item '" + desempilhado + "' desempilhado com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace consultarTopo() {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(26)
                .codeLine("if (vazia()) {")
                .method("consultarTopo")
                .description("Verifica se a pilha está vazia (fundo == topo): " + pilha.vazia())
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Map.of("vazia()", pilha.vazia()))
                .build());

        if (pilha.vazia()) {
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(27)
                    .codeLine("throw new NoSuchElementException(\"Nao há nenhum item na pilha!\");")
                    .method("consultarTopo")
                    .description("Exceção lançada: Pilha vazia!")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null))
                    .erro(true)
                    .mensagemErro("Nao há nenhum item na pilha!")
                    .build());

            return ExecutionTrace.builder()
                    .method("consultarTopo")
                    .steps(steps)
                    .success(false)
                    .message("Pilha vazia.")
                    .build();
        }

        Object item = pilha.getTopo().getItem();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(29)
                .codeLine("return topo.getItem();")
                .method("consultarTopo")
                .description("Retorna diretamente o item armazenado na célula do topo: '" + item + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .returnValue(item)
                .build());

        return ExecutionTrace.builder()
                .method("consultarTopo")
                .steps(steps)
                .success(true)
                .result(item)
                .message("Topo consultado: '" + item + "'.")
                .build();
    }

    public synchronized ExecutionTrace vazia() {
        List<StepSnapshot> steps = new ArrayList<>();
        boolean estaVazia = pilha.vazia();

        steps.add(StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(12)
                .codeLine("return fundo == topo;")
                .method("vazia")
                .description("Compara (fundo == topo): " + estaVazia + ". " +
                        (estaVazia ? "Ambos apontam para a sentinela (pilha vazia)." : "O topo aponta para um elemento acima da sentinela."))
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null))
                .variables(Map.of("fundo == topo", estaVazia))
                .returnValue(estaVazia)
                .build());

        return ExecutionTrace.builder()
                .method("vazia")
                .steps(steps)
                .success(true)
                .result(estaVazia)
                .message("Pilha vazia: " + estaVazia)
                .build();
    }

    private List<NodeSnapshot> captureCurrentNodes(Celula<Object> novoNo, Celula<Object> noRemovido) {
        List<NodeSnapshot> nodes = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        if (noRemovido != null) {
            visited.add(noRemovido.getId());
            nodes.add(NodeSnapshot.builder()
                    .id(noRemovido.getId())
                    .valor(noRemovido.getItem())
                    .proximoId(noRemovido.getProximo() != null ? noRemovido.getProximo().getId() : null)
                    .sentinela(false)
                    .novo(false)
                    .removido(true)
                    .build());
        }

        Celula<Object> aux = pilha.getTopo();
        while (aux != null && !visited.contains(aux.getId())) {
            visited.add(aux.getId());
            boolean isSentinela = (aux == pilha.getFundo());
            boolean isNovo = (novoNo != null && aux == novoNo);
            nodes.add(NodeSnapshot.builder()
                    .id(aux.getId())
                    .valor(aux.getItem())
                    .proximoId(aux.getProximo() != null ? aux.getProximo().getId() : null)
                    .sentinela(isSentinela)
                    .novo(isNovo)
                    .removido(false)
                    .build());
            aux = aux.getProximo();
        }

        return nodes;
    }

    private List<PointerSnapshot> capturePointers(String localName, String localTarget) {
        List<PointerSnapshot> pointers = new ArrayList<>();

        if (pilha.getTopo() != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome("topo")
                    .targetNodeId(pilha.getTopo().getId())
                    .tipo("atributo")
                    .cor("#3b82f6")
                    .build());
        }

        if (pilha.getFundo() != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome("fundo")
                    .targetNodeId(pilha.getFundo().getId())
                    .tipo("atributo")
                    .cor("#10b981")
                    .build());
        }

        if (localName != null && localTarget != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome(localName)
                    .targetNodeId(localTarget)
                    .tipo("local")
                    .cor("#f59e0b")
                    .build());
        }

        return pointers;
    }
}
