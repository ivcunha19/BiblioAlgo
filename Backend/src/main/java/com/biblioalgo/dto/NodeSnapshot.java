package com.biblioalgo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NodeSnapshot {
    private String id;
    private Object valor;
    private String proximoId;
    private boolean sentinela;
    private boolean novo;
    private boolean removido;
}
