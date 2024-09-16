package com.huseyinari.bankapp.exception;

import com.huseyinari.bankapp.response.BankApplicationApiResponseBody;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<BankApplicationApiResponseBody<Object>> handleAuthenticationException(AuthenticationException exception) {
        final List<String> errors = new ArrayList<>();
        errors.add(exception.getMessage());

        BankApplicationApiResponseBody<Object> body = BankApplicationApiResponseBody.builder()
                .responseTime(LocalDateTime.now())
                .data(null)
                .errors(errors)
                .build();

        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BankApplicationApiResponseBody<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        final List<String> errors = new ArrayList<>();
        exception.getFieldErrors().forEach(error -> errors.add(error.getDefaultMessage()));

        BankApplicationApiResponseBody<Object> body = BankApplicationApiResponseBody.builder()
                .responseTime(LocalDateTime.now())
                .data(null)
                .errors(errors)
                .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<BankApplicationApiResponseBody<Object>> handleConstraintViolationException(ConstraintViolationException exception) {
        final List<String> errors = new ArrayList<>();
        exception.getConstraintViolations().forEach(item -> errors.add(item.getMessage()));

        BankApplicationApiResponseBody<Object> body = BankApplicationApiResponseBody.builder()
                .responseTime(LocalDateTime.now())
                .data(null)
                .errors(errors)
                .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BankApplicationApiResponseBody<Object>> handleException(Exception exception) {
        final List<String> errors = new ArrayList<>();
        errors.add(exception.getMessage());

        BankApplicationApiResponseBody<Object> body = BankApplicationApiResponseBody.builder()
                .responseTime(LocalDateTime.now())
                .data(null)
                .errors(errors)
                .build();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
