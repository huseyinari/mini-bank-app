package com.huseyinari.bankapp.response;

import com.huseyinari.bankapp.enums.TransactionStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TransactionHistoryResponse {
    private Long id;
    private AccountSearchResponse fromAccount;
    private AccountSearchResponse toAccount;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private TransactionStatus status;
}
