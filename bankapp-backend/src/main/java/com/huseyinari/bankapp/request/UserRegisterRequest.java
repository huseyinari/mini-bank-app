package com.huseyinari.bankapp.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    @NotEmpty(message = "Kullanıcı adı alanı zorunludur.")
    @Size(min = 5, message = "Kullanıcı adı alanı en az 5 karakter olmalıdır.")
    private String username;

    @NotEmpty(message = "Parola alanı zorunludur.")
    @Size(min = 8, message = "Parola alanı en az 8 karakter olmalıdır.")
    private String password;

    @NotEmpty(message = "E-mail alanı zorunludur.")
    @Email(message = "Lütfen geçerli bir mail adresi giriniz.")
    private String email;
}
