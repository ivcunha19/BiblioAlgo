package com.biblioalgo.controller;

import com.biblioalgo.dto.ExecutionTrace;
import com.biblioalgo.service.PilhaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pilha")
@CrossOrigin(origins = "*")
public class PilhaController {

    private final PilhaService pilhaService;

    public PilhaController(PilhaService pilhaService) {
        this.pilhaService = pilhaService;
    }

    @GetMapping("/estado")
    public ResponseEntity<ExecutionTrace> getEstado() {
        return ResponseEntity.ok(pilhaService.getCurrentState());
    }

    @PostMapping("/reset")
    public ResponseEntity<ExecutionTrace> reset() {
        return ResponseEntity.ok(pilhaService.reset());
    }

    @PostMapping("/empilhar")
    public ResponseEntity<ExecutionTrace> empilhar(@RequestBody(required = false) Map<String, Object> body,
                                                   @RequestParam(required = false) String item) {
        Object itemParaInserir = item;
        if (body != null && body.containsKey("item")) {
            itemParaInserir = body.get("item");
        }
        if (itemParaInserir == null || itemParaInserir.toString().trim().isEmpty()) {
            itemParaInserir = "A";
        }
        return ResponseEntity.ok(pilhaService.empilhar(itemParaInserir));
    }

    @PostMapping("/desempilhar")
    public ResponseEntity<ExecutionTrace> desempilhar() {
        return ResponseEntity.ok(pilhaService.desempilhar());
    }

    @GetMapping("/consultar")
    public ResponseEntity<ExecutionTrace> consultarTopo() {
        return ResponseEntity.ok(pilhaService.consultarTopo());
    }

    @GetMapping("/vazia")
    public ResponseEntity<ExecutionTrace> vazia() {
        return ResponseEntity.ok(pilhaService.vazia());
    }
}
