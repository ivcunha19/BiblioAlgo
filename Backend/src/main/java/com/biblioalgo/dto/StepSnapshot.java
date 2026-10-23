package com.biblioalgo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StepSnapshot {
    private int stepIndex;
    private int lineNumber;
    private String codeLine;
    private String method;
    private String description;
    private List<NodeSnapshot> nodes;
    private List<PointerSnapshot> pointers;
    private Map<String, Object> variables;
    private Object returnValue;
    private boolean erro;
    private String mensagemErro;
}
