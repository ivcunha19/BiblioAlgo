package com.biblioalgo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionTrace {
    private String method;
    private List<StepSnapshot> steps;
    private Object result;
    private boolean success;
    private String message;
}
