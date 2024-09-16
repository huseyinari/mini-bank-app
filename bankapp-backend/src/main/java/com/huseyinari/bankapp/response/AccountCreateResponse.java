package com.huseyinari.bankapp.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Getter
@RequiredArgsConstructor
public class AccountCreateResponse {
    private final String number;
    private final String name;
    private final BigDecimal balance;
}
