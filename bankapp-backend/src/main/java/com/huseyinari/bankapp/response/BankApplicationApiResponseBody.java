package com.huseyinari.bankapp.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class BankApplicationApiResponseBody<T> {
    private T data;
    private LocalDateTime responseTime;
    private List<String> errors;
}
