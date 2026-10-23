package com.biblioalgo.model;

import java.util.UUID;

public class Celula<T> {

	private final T item;
	private Celula<T> proximo;
	private String id;

	public Celula() {
		this.item = null;
		setProximo(null);
		this.id = UUID.randomUUID().toString().substring(0, 8);
	}

	public Celula(T item) {
		this.item = item;
		setProximo(null);
		this.id = UUID.randomUUID().toString().substring(0, 8);
	}

	public Celula(T item, Celula<T> proximo) {
		this.item = item;
		setProximo(proximo);
		this.id = UUID.randomUUID().toString().substring(0, 8);
	}
	
	public T getItem() {
		return item;
	}

	public Celula<T> getProximo() {
		return proximo;
	}

	public void setProximo(Celula<T> proximo) {
		this.proximo = proximo;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}
