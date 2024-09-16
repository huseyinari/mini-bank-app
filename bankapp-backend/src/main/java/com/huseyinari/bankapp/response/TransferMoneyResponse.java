package com.huseyinari.bankapp.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
public class TransferMoneyResponse {
    private final String fromAccountNumber;
    private final String toAccountNumber;
    private final BigDecimal balance;
}
