package com.huseyinari.bankapp.exception;

public class ActiveUserNotFoundException extends RuntimeException {
    public ActiveUserNotFoundException() {
        super("Öncelikle sisteme giriş yapmalısınız.");
    }
}
