package com.huseyinari.bankapp.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransferMoneyRequest {
    @NotEmpty(message = "Para transferi gerçekleştireceğiniz hesap numaranızı giriniz.")
    private String fromAccountNumber;
    @NotEmpty(message = "Para transferinin gerçekleşeceği hesap numarasını giriniz.")
    private String toAccountNumber;
    @NotNull(message = "Para miktarını belirtiniz.")
    @Min(value = 0, message = "Miktar negatif olamaz.")
    private BigDecimal amount;
}
