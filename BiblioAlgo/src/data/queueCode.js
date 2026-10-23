export const QUEUE_JAVA_CODE = `package com.biblioalgo.model;

import java.util.NoSuchElementException;

public class Fila<E> {

\tprivate Celula<E> frente;
\tprivate Celula<E> tras;
\t
\tpublic Fila() {
\t\t
\t\tCelula<E> sentinela = new Celula<E>();
\t\tfrente = tras = sentinela;
\t}
\t
\tpublic boolean vazia() {
\t\t
\t\treturn (frente == tras);
\t}
\t
\tpublic void enfileirar(E item) {
\t\t
\t\tCelula<E> novaCelula = new Celula<E>(item);
\t\t
\t\ttras.setProximo(novaCelula);
\t\ttras = tras.getProximo();
\t}
\t
\tpublic E desenfileirar() {
\t\t
\t\tE item = null;
\t\tCelula<E> primeiro;
\t\t
\t\titem = consultarPrimeiro();
\t\t
\t\tprimeiro = frente.getProximo();
\t\tfrente.setProximo(primeiro.getProximo());
\t\t
\t\tprimeiro.setProximo(null);
\t\t\t
\t\t// Caso o item desenfileirado seja também o último da fila.
\t\tif (primeiro == tras)
\t\t\ttras = frente;
\t\t
\t\treturn item;
\t}
\t
\tpublic E consultarPrimeiro() {

\t\tif (vazia()) {
\t\t\tthrow new NoSuchElementException("Nao há nenhum item na fila!");
\t\t}

\t\treturn frente.getProximo().getItem();

\t}
}`.split('\n');
