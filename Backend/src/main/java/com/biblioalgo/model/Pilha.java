package com.biblioalgo.model;

import java.util.NoSuchElementException;

public class Pilha<E> {

	private Celula<E> topo;
	private Celula<E> fundo;

	public Pilha() {

		Celula<E> sentinela = new Celula<E>();
		fundo = sentinela;
		topo = sentinela;

	}

	public boolean vazia() {
		return fundo == topo;
	}

	public void empilhar(E item) {

		topo = new Celula<E>(item, topo);
	}

	public E desempilhar() {

		E desempilhado = consultarTopo();
		topo = topo.getProximo();
		return desempilhado;

	}

	public E consultarTopo() {

		if (vazia()) {
			throw new NoSuchElementException("Nao há nenhum item na pilha!");
		}

		return topo.getItem();

	}

	public Celula<E> getTopo() {
		return topo;
	}

	public void setTopo(Celula<E> topo) {
		this.topo = topo;
	}

	public Celula<E> getFundo() {
		return fundo;
	}

	public void setFundo(Celula<E> fundo) {
		this.fundo = fundo;
	}
}
