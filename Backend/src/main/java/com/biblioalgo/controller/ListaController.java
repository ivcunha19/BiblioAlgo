package com.biblioalgo.controller;

import com.biblioalgo.dto.ExecutionTrace;
import com.biblioalgo.service.ListaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lista")
@CrossOrigin(origins = "*")
public class ListaController {

    private final ListaService listaService;

    public ListaController(ListaService listaService) {
        this.listaService = listaService;
    }

    @GetMapping("/estado")
    public ResponseEntity<ExecutionTrace> getEstado() {
        return ResponseEntity.ok(listaService.getCurrentState());
    }

    @PostMapping("/reset")
    public ResponseEntity<ExecutionTrace> reset() {
        return ResponseEntity.ok(listaService.reset());
    }

    @PostMapping("/inserir")
    public ResponseEntity<ExecutionTrace> inserir(@RequestBody(required = false) Map<String, Object> body,
                                                  @RequestParam(required = false) String item,
                                                  @RequestParam(required = false, defaultValue = "0") int posicao) {
        Object itemParaInserir = item;
        int pos = posicao;
        if (body != null) {
            if (body.containsKey("item")) {
                itemParaInserir = body.get("item");
            }
            if (body.containsKey("posicao") && body.get("posicao") != null) {
                pos = Integer.parseInt(body.get("posicao").toString());
            }
        }
        if (itemParaInserir == null || itemParaInserir.toString().trim().isEmpty()) {
            itemParaInserir = "A";
        }
        return ResponseEntity.ok(listaService.inserir(itemParaInserir, pos));
    }

    @PostMapping("/remover")
    public ResponseEntity<ExecutionTrace> remover(@RequestBody(required = false) Map<String, Object> body,
                                                  @RequestParam(required = false, defaultValue = "0") int posicao) {
        int pos = posicao;
        if (body != null && body.containsKey("posicao") && body.get("posicao") != null) {
            pos = Integer.parseInt(body.get("posicao").toString());
        }
        return ResponseEntity.ok(listaService.remover(pos));
    }

    @GetMapping("/vazia")
    public ResponseEntity<ExecutionTrace> vazia() {
        return ResponseEntity.ok(listaService.vazia());
    }
}
