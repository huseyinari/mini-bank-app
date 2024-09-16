package com.huseyinari.bankapp.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountCreateRequest {
    @NotEmpty(message = "Lütfen yeni oluşturulacak hesabınıza bir isim giriniz.")
    private String name;
}
