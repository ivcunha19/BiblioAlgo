package com.biblioalgo.service;

import com.biblioalgo.dto.ExecutionTrace;
import com.biblioalgo.dto.NodeSnapshot;
import com.biblioalgo.dto.PointerSnapshot;
import com.biblioalgo.dto.StepSnapshot;
import com.biblioalgo.model.Celula;
import com.biblioalgo.model.Fila;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FilaService {

    private Fila<Object> fila;

    public FilaService() {
        this.fila = new Fila<>();
    }

    public synchronized ExecutionTrace reset() {
        this.fila = new Fila<>();
        List<StepSnapshot> steps = new ArrayList<>();
        
        StepSnapshot initialStep = StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(13)
                .codeLine("frente = tras = sentinela;")
                .method("construtor")
                .description("Fila inicializada. Apenas a célula sentinela existe na memória; 'frente' e 'tras' apontam para ela.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.emptyMap())
                .build();
                
        steps.add(initialStep);

        return ExecutionTrace.builder()
                .method("reset")
                .steps(steps)
                .success(true)
                .message("Fila reiniciada com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace getCurrentState() {
        List<StepSnapshot> steps = new ArrayList<>();
        StepSnapshot step = StepSnapshot.builder()
                .stepIndex(0)
                .lineNumber(0)
                .codeLine("")
                .method("estadoAtual")
                .description("Estado atual da fila na memória.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.emptyMap())
                .build();
        steps.add(step);

        return ExecutionTrace.builder()
                .method("estadoAtual")
                .steps(steps)
                .success(true)
                .message("Estado atual obtido.")
                .build();
    }

    public synchronized ExecutionTrace enfileirar(Object item) {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;

        // Linha 21: public void enfileirar(E item)
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(21)
                .codeLine("public void enfileirar(E item) {")
                .method("enfileirar")
                .description("Início da execução de enfileirar. Parâmetro recebido: item = '" + item + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("item", item))
                .build());

        // Linha 23: Celula<E> novaCelula = new Celula<E>(item);
        Celula<Object> novaCelula = new Celula<>(item);
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(23)
                .codeLine("Celula<E> novaCelula = new Celula<E>(item);")
                .method("enfileirar")
                .description("Alocada nova Célula na memória com item = '" + item + "' e proximo = null.")
                .nodes(captureCurrentNodes(novaCelula, null))
                .pointers(capturePointers("novaCelula", novaCelula.getId(), null, null))
                .variables(Map.of("item", item, "novaCelula", novaCelula.getId()))
                .build());

        // Linha 25: tras.setProximo(novaCelula);
        fila.getTras().setProximo(novaCelula);
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(25)
                .codeLine("tras.setProximo(novaCelula);")
                .method("enfileirar")
                .description("A célula apontada por 'tras' agora tem seu 'proximo' apontando para a 'novaCelula'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("novaCelula", novaCelula.getId(), null, null))
                .variables(Map.of("item", item, "novaCelula", novaCelula.getId()))
                .build());

        // Linha 26: tras = tras.getProximo();
        fila.setTras(fila.getTras().getProximo());
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(26)
                .codeLine("tras = tras.getProximo();")
                .method("enfileirar")
                .description("Atualizado o ponteiro 'tras' para apontar para a nova última célula (tras.getProximo()).")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("novaCelula", novaCelula.getId(), null, null))
                .variables(Map.of("item", item, "novaCelula", novaCelula.getId()))
                .build());

        // Linha 27: }
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(27)
                .codeLine("}")
                .method("enfileirar")
                .description("Fim do método enfileirar. A variável local 'novaCelula' sai de escopo.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("item", item))
                .build());

        return ExecutionTrace.builder()
                .method("enfileirar")
                .steps(steps)
                .success(true)
                .result(item)
                .message("Item '" + item + "' enfileirado com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace desenfileirar() {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;

        // Linha 29: public E desenfileirar()
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(29)
                .codeLine("public E desenfileirar() {")
                .method("desenfileirar")
                .description("Início da execução de desenfileirar.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.emptyMap())
                .build());

        // Linha 31: E item = null;
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(31)
                .codeLine("E item = null;")
                .method("desenfileirar")
                .description("Declaração da variável local 'item', inicializada como null.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.singletonMap("item", null))
                .build());

        // Linha 32: Celula<E> primeiro;
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(32)
                .codeLine("Celula<E> primeiro;")
                .method("desenfileirar")
                .description("Declaração da referência local 'primeiro'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.singletonMap("item", null))
                .build());

        // Linha 34: item = consultarPrimeiro();
        if (fila.vazia()) {
            // Passo 50: if (vazia())
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(50)
                    .codeLine("if (vazia()) {")
                    .method("consultarPrimeiro")
                    .description("consultarPrimeiro(): avalia vazia() -> frente == tras é verdadeiro!")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .variables(Collections.singletonMap("item", null))
                    .build());

            // Passo 51: throw new NoSuchElementException("Nao há nenhum item na fila!");
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(51)
                    .codeLine("throw new NoSuchElementException(\"Nao há nenhum item na fila!\");")
                    .method("consultarPrimeiro")
                    .description("Exceção lançada: Fila vazia! Não é possível desenfileirar.")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .variables(Collections.singletonMap("item", null))
                    .erro(true)
                    .mensagemErro("Nao há nenhum item na fila!")
                    .build());

            return ExecutionTrace.builder()
                    .method("desenfileirar")
                    .steps(steps)
                    .success(false)
                    .message("Erro: Fila vazia.")
                    .build();
        }

        Object item = fila.getFrente().getProximo().getItem();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(34)
                .codeLine("item = consultarPrimeiro();")
                .method("desenfileirar")
                .description("consultarPrimeiro() executado com sucesso: item = '" + item + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("item", item))
                .build());

        // Linha 36: primeiro = frente.getProximo();
        Celula<Object> primeiro = fila.getFrente().getProximo();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(36)
                .codeLine("primeiro = frente.getProximo();")
                .method("desenfileirar")
                .description("Referência 'primeiro' passa a apontar para a primeira célula válida (após a sentinela).")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers("primeiro", primeiro.getId(), null, null))
                .variables(Map.of("item", item, "primeiro", primeiro.getId()))
                .build());

        // Linha 37: frente.setProximo(primeiro.getProximo());
        fila.getFrente().setProximo(primeiro.getProximo());
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(37)
                .codeLine("frente.setProximo(primeiro.getProximo());")
                .method("desenfileirar")
                .description("A sentinela 'frente' atualiza seu 'proximo' para 'primeiro.getProximo()', contornando 'primeiro'.")
                .nodes(captureCurrentNodes(null, primeiro))
                .pointers(capturePointers("primeiro", primeiro.getId(), null, null))
                .variables(Map.of("item", item, "primeiro", primeiro.getId()))
                .build());

        // Linha 39: primeiro.setProximo(null);
        primeiro.setProximo(null);
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(39)
                .codeLine("primeiro.setProximo(null);")
                .method("desenfileirar")
                .description("Desconecta 'primeiro' da lista atribuindo null ao seu ponteiro 'proximo'.")
                .nodes(captureCurrentNodes(null, primeiro))
                .pointers(capturePointers("primeiro", primeiro.getId(), null, null))
                .variables(Map.of("item", item, "primeiro", primeiro.getId()))
                .build());

        // Linha 42: if (primeiro == tras)
        boolean eraUltimo = (primeiro == fila.getTras());
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(42)
                .codeLine("if (primeiro == tras)")
                .method("desenfileirar")
                .description("Verifica se 'primeiro == tras'. " + (eraUltimo ? "Verdadeiro: o elemento removido era o único da fila!" : "Falso: ainda restam outros elementos."))
                .nodes(captureCurrentNodes(null, primeiro))
                .pointers(capturePointers("primeiro", primeiro.getId(), null, null))
                .variables(Map.of("item", item, "primeiro == tras", eraUltimo))
                .build());

        // Linha 43: tras = frente; (se eraUltimo)
        if (eraUltimo) {
            fila.setTras(fila.getFrente());
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(43)
                    .codeLine("tras = frente;")
                    .method("desenfileirar")
                    .description("Como a fila esvaziou, reajusta 'tras' para apontar de volta para a sentinela ('frente').")
                    .nodes(captureCurrentNodes(null, primeiro))
                    .pointers(capturePointers("primeiro", primeiro.getId(), null, null))
                    .variables(Map.of("item", item))
                    .build());
        }

        // Linha 45: return item;
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(45)
                .codeLine("return item;")
                .method("desenfileirar")
                .description("Retorna o item removido: '" + item + "'. A célula 'primeiro' é liberada.")
                .nodes(captureCurrentNodes(null, null)) // célula removida sai da memória
                .pointers(capturePointers(null, null, null, null))
                .variables(Map.of("item", item))
                .returnValue(item)
                .build());

        return ExecutionTrace.builder()
                .method("desenfileirar")
                .steps(steps)
                .success(true)
                .result(item)
                .message("Item '" + item + "' desenfileirado com sucesso.")
                .build();
    }

    public synchronized ExecutionTrace consultarPrimeiro() {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(48)
                .codeLine("public E consultarPrimeiro() {")
                .method("consultarPrimeiro")
                .description("Início da execução de consultarPrimeiro().")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.emptyMap())
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(50)
                .codeLine("if (vazia()) {")
                .method("consultarPrimeiro")
                .description("Verifica se a fila está vazia: vazia() -> " + fila.vazia())
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.emptyMap())
                .build());

        if (fila.vazia()) {
            steps.add(StepSnapshot.builder()
                    .stepIndex(stepIdx++)
                    .lineNumber(51)
                    .codeLine("throw new NoSuchElementException(\"Nao há nenhum item na fila!\");")
                    .method("consultarPrimeiro")
                    .description("Exceção lançada: Fila vazia!")
                    .nodes(captureCurrentNodes(null, null))
                    .pointers(capturePointers(null, null, null, null))
                    .erro(true)
                    .mensagemErro("Nao há nenhum item na fila!")
                    .build());

            return ExecutionTrace.builder()
                    .method("consultarPrimeiro")
                    .steps(steps)
                    .success(false)
                    .message("Fila vazia.")
                    .build();
        }

        Object item = fila.getFrente().getProximo().getItem();
        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(54)
                .codeLine("return frente.getProximo().getItem();")
                .method("consultarPrimeiro")
                .description("Retorna o item do primeiro nó real: '" + item + "'.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .returnValue(item)
                .build());

        return ExecutionTrace.builder()
                .method("consultarPrimeiro")
                .steps(steps)
                .success(true)
                .result(item)
                .message("Primeiro item consultado: '" + item + "'.")
                .build();
    }

    public synchronized ExecutionTrace vazia() {
        List<StepSnapshot> steps = new ArrayList<>();
        int stepIdx = 0;
        boolean estaVazia = fila.vazia();

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(16)
                .codeLine("public boolean vazia() {")
                .method("vazia")
                .description("Início da verificação se a fila está vazia.")
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .variables(Collections.emptyMap())
                .build());

        steps.add(StepSnapshot.builder()
                .stepIndex(stepIdx++)
                .lineNumber(18)
                .codeLine("return (frente == tras);")
                .method("vazia")
                .description("Compara referências (frente == tras): " + estaVazia + ". " + 
                        (estaVazia ? "Ambos apontam para a sentinela, fila está vazia." : "Apontam para células diferentes, fila contém dados."))
                .nodes(captureCurrentNodes(null, null))
                .pointers(capturePointers(null, null, null, null))
                .returnValue(estaVazia)
                .build());

        return ExecutionTrace.builder()
                .method("vazia")
                .steps(steps)
                .success(true)
                .result(estaVazia)
                .message("Fila vazia: " + estaVazia)
                .build();
    }

    private List<NodeSnapshot> captureCurrentNodes(Celula<Object> novoNo, Celula<Object> noRemovido) {
        List<NodeSnapshot> nodes = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        // Percorre a partir de frente
        Celula<Object> aux = fila.getFrente();
        boolean isFirst = true;
        while (aux != null && !visited.contains(aux.getId())) {
            visited.add(aux.getId());
            nodes.add(NodeSnapshot.builder()
                    .id(aux.getId())
                    .valor(aux.getItem())
                    .proximoId(aux.getProximo() != null ? aux.getProximo().getId() : null)
                    .sentinela(isFirst)
                    .novo(false)
                    .removido(false)
                    .build());
            isFirst = false;
            aux = aux.getProximo();
        }

        // Se houver um nó recém-criado que ainda não está na cadeia
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

        // Se houver um nó removido desvinculado
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

        if (fila.getFrente() != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome("frente")
                    .targetNodeId(fila.getFrente().getId())
                    .tipo("atributo")
                    .cor("#3b82f6") // Blue
                    .build());
        }

        if (fila.getTras() != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome("tras")
                    .targetNodeId(fila.getTras().getId())
                    .tipo("atributo")
                    .cor("#10b981") // Green
                    .build());
        }

        if (localName1 != null && localTarget1 != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome(localName1)
                    .targetNodeId(localTarget1)
                    .tipo("variavel_local")
                    .cor("#f59e0b") // Amber
                    .build());
        }

        if (localName2 != null && localTarget2 != null) {
            pointers.add(PointerSnapshot.builder()
                    .nome(localName2)
                    .targetNodeId(localTarget2)
                    .tipo("variavel_local")
                    .cor("#8b5cf6") // Purple
                    .build());
        }

        return pointers;
    }
}
