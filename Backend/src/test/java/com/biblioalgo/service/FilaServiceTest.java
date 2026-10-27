package com.biblioalgo.service;

import com.biblioalgo.dto.ExecutionTrace;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FilaServiceTest {

    private FilaService filaService;

    @BeforeEach
    void setUp() {
        filaService = new FilaService();
        filaService.reset();
    }

    @Test
    void testConstrutorResetSentinelaScope() {
        ExecutionTrace traceReset = filaService.reset();
        assertTrue(traceReset.isSuccess());
        assertEquals(3, traceReset.getSteps().size());

        // Passo 0: Celula<E> sentinela = new Celula<E>(); -> apenas 'sentinela'
        assertEquals(1, traceReset.getSteps().get(0).getPointers().size());
        assertEquals("sentinela", traceReset.getSteps().get(0).getPointers().get(0).getNome());

        // Passo 1: frente = tras = sentinela; -> 'frente', 'tras' e 'sentinela'
        assertEquals(3, traceReset.getSteps().get(1).getPointers().size());

        // Passo 2: } -> 'sentinela' sai de escopo, restam 'frente' e 'tras'
        assertEquals(2, traceReset.getSteps().get(2).getPointers().size());
    }

    @Test
    void testEnfileirarEDesenfileirar() {
        // Enfileirar 'A'
        ExecutionTrace traceEnfileirarA = filaService.enfileirar("A");
        assertTrue(traceEnfileirarA.isSuccess());
        assertEquals(5, traceEnfileirarA.getSteps().size());
        
        // Enfileirar 'B'
        ExecutionTrace traceEnfileirarB = filaService.enfileirar("B");
        assertTrue(traceEnfileirarB.isSuccess());

        // Desenfileirar 'A'
        ExecutionTrace traceDesenfileirarA = filaService.desenfileirar();
        assertTrue(traceDesenfileirarA.isSuccess());
        assertEquals("A", traceDesenfileirarA.getResult());

        // Desenfileirar 'B' (fila deve voltar para apenas sentinela, tras = frente)
        ExecutionTrace traceDesenfileirarB = filaService.desenfileirar();
        assertTrue(traceDesenfileirarB.isSuccess());
        assertEquals("B", traceDesenfileirarB.getResult());

        // Tentar desenfileirar com fila vazia deve capturar erro
        ExecutionTrace traceVazia = filaService.desenfileirar();
        assertFalse(traceVazia.isSuccess());
        assertTrue(traceVazia.getSteps().getLast().isErro());
    }
}
