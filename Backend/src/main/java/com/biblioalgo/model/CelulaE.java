package com.biblioalgo.model;

public class CelulaE<T> {

	private final T item;
	private CelulaE<T> proximo;

	public CelulaE() {
		this.item = null;
		setProximo(null);
	}

	public CelulaE(T item) {
		this.item = item;
		setProximo(null);
	}

	public CelulaE(T item, CelulaE<T> proximo) {
        this.item = item;
        setProximo(proximo);
    }
	
	public T getItem() {
		return item;
	}

	public CelulaE<T> getProximo() {
		return proximo;
	}

	public void setProximo(CelulaE<T> proximo) {
		this.proximo = proximo;
	}
}
