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
