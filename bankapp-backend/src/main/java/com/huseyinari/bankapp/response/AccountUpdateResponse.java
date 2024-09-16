package com.huseyinari.bankapp.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
public class AccountUpdateResponse {
    private final String name;
    private final String number;
    private final BigDecimal balance;
}
