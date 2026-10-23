package com.biblioalgo.model;

import java.util.NoSuchElementException;

public class Fila<E> {

	private Celula<E> frente;
	private Celula<E> tras;
	
	public Fila() {
		
		Celula<E> sentinela = new Celula<E>();
		frente = tras = sentinela;
	}
	
	public boolean vazia() {
		
		return (frente == tras);
	}
	
	public void enfileirar(E item) {
		
		Celula<E> novaCelula = new Celula<E>(item);
		
		tras.setProximo(novaCelula);
		tras = tras.getProximo();
	}
	
	public E desenfileirar() {
		
		E item = null;
		Celula<E> primeiro;
		
		item = consultarPrimeiro();
		
		primeiro = frente.getProximo();
		frente.setProximo(primeiro.getProximo());
		
		primeiro.setProximo(null);
			
		// Caso o item desenfileirado seja também o último da fila.
		if (primeiro == tras)
			tras = frente;
		
		return item;
	}
	
	public E consultarPrimeiro() {

		if (vazia()) {
			throw new NoSuchElementException("Nao há nenhum item na fila!");
		}

		return frente.getProximo().getItem();

	}
	
	public Celula<E> getFrente() {
		return frente;
	}

	public Celula<E> getTras() {
		return tras;
	}

	public void setFrente(Celula<E> frente) {
		this.frente = frente;
	}

	public void setTras(Celula<E> tras) {
		this.tras = tras;
	}

	@Override
	public String toString() {
		
		Celula<E> aux;
		String filaTexto = new String();
		
		aux = this.frente.getProximo();
		while (aux != null) {
			filaTexto += aux.getItem() + "\n";
			aux = aux.getProximo();
		}
		return filaTexto; 	
	}
}
