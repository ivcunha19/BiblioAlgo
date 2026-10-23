package com.biblioalgo.controller;

import com.biblioalgo.dto.ExecutionTrace;
import com.biblioalgo.service.FilaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fila")
@CrossOrigin(origins = "*")
public class FilaController {

    private final FilaService filaService;

    public FilaController(FilaService filaService) {
        this.filaService = filaService;
    }

    @GetMapping("/estado")
    public ResponseEntity<ExecutionTrace> getEstado() {
        return ResponseEntity.ok(filaService.getCurrentState());
    }

    @PostMapping("/reset")
    public ResponseEntity<ExecutionTrace> reset() {
        return ResponseEntity.ok(filaService.reset());
    }

    @PostMapping("/enfileirar")
    public ResponseEntity<ExecutionTrace> enfileirar(@RequestBody(required = false) Map<String, Object> body,
                                                     @RequestParam(required = false) String item) {
        Object itemParaInserir = item;
        if (body != null && body.containsKey("item")) {
            itemParaInserir = body.get("item");
        }
        if (itemParaInserir == null || itemParaInserir.toString().trim().isEmpty()) {
            itemParaInserir = "A";
        }
        return ResponseEntity.ok(filaService.enfileirar(itemParaInserir));
    }

    @PostMapping("/desenfileirar")
    public ResponseEntity<ExecutionTrace> desenfileirar() {
        return ResponseEntity.ok(filaService.desenfileirar());
    }

    @GetMapping("/consultar")
    public ResponseEntity<ExecutionTrace> consultarPrimeiro() {
        return ResponseEntity.ok(filaService.consultarPrimeiro());
    }

    @GetMapping("/vazia")
    public ResponseEntity<ExecutionTrace> vazia() {
        return ResponseEntity.ok(filaService.vazia());
    }
}
