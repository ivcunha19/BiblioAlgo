package com.biblioalgo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointerSnapshot {
    private String nome;
    private String targetNodeId;
    private String tipo; // "atributo" (ex: frente, tras) ou "variavel_local" (ex: novaCelula, primeiro)
    private String cor;
}
